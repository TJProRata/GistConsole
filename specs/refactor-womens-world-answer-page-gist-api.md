# Chore: Refactor Women's World Answer Page to Use Complete Gist API Integration

## Chore Description
Refactor the Women's World Answer Page to properly integrate with all Gist API endpoints for citations, attributions, and feedback. The current implementation has a partial integration that only streams the response text but uses mock data for citations and related questions. This chore will:

1. Replace mock citations with real Gist API citations from `/v1/chat/citations/{threadId}/{turnId}`
2. Replace mock related questions with data from `/v1/questions` endpoint
3. Ensure attributions are fetched from `/v1/chat/attributions/{threadId}/{turnId}` for proper source credit distribution
4. Verify feedback submission to `/v1/chat/feedback/{threadId}/{turnId}` is working correctly
5. Update all TypeScript types to match Gist API response schemas
6. Add proper error handling for all API calls
7. Add format parsing for structured answer text (sections, bullets, citations) as specified in the companion feature spec

This refactor will make the answer page fully functional with real data instead of mock placeholders, providing accurate citations, related questions, and proper source attributions.

## Relevant Files
Use these files to resolve the chore:

- **`app/womens-world/answers/page.tsx`** (Lines 1-331)
  - Main answer page component with streaming logic
  - Currently uses mock sources (lines 309-324) and mock related questions (lines 326-330)
  - Already has streaming integration with `/api/gist/stream` route
  - Needs to fetch citations and related questions after streaming completes
  - Needs to implement proper attribution fetching
  - Already has feedback submission logic (lines 151-177)

- **`app/api/gist/stream/route.ts`** (Lines 1-283)
  - Backend route handler for streaming responses
  - Already properly integrated with Gist API `/v1/chat` and `/v1/chat/response/{threadId}/{turnId}`
  - Returns threadId and turnId in metadata event (lines 128-139)
  - No changes needed - already correct

- **`app/api/gist/feedback/route.ts`**
  - Backend route handler for feedback submission
  - Should exist and proxy to Gist API `/v1/chat/feedback/{threadId}/{turnId}`
  - Needs verification and potential updates

- **`lib/gist-api.ts`** (Lines 1-349)
  - Already has `fetchCitations()` function (lines 156-216)
  - Already has `fetchAttributions()` function (lines 218-277)
  - Already has `submitFeedback()` function (lines 279-348)
  - Already has proper TypeScript types: `GistCitation`, `GistAttribution`
  - Needs `fetchRelatedQuestions()` function added for `/v1/questions` endpoint

- **`components/widget_components/types.ts`**
  - Contains `AttributionSource` type
  - Needs update to align with `GistCitation` type from `lib/gist-api.ts`
  - May need `RelatedQuestion` type addition

- **`components/widget_components/ai-elements/attribution-cards.tsx`**
  - Component for displaying source citations
  - May need props update to handle `GistCitation` type instead of `AttributionSource`

- **`components/widget_components/ai-elements/related-questions.tsx`**
  - Component for displaying related questions
  - May need props update based on Gist API `/v1/questions` response format

### New Files

- **`app/api/gist/citations/route.ts`**
  - New backend route handler to fetch citations from Gist API
  - Accepts `threadId` and `turnId` as query parameters
  - Proxies to `/v1/chat/citations/{threadId}/{turnId}`
  - Uses `fetchCitations()` from `lib/gist-api.ts`

- **`app/api/gist/related-questions/route.ts`**
  - New backend route handler to fetch related questions
  - Proxies to `/v1/questions` endpoint with `count` parameter
  - Returns recommended questions for user

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add Related Questions Fetching to Gist API Library
- Open `lib/gist-api.ts`
- Add TypeScript interface `GistRelatedQuestions` based on `/v1/questions` response format:
  ```typescript
  export interface GistRelatedQuestions {
    questions: {
      recommended_queries: {
        questions: string[];
        related_or_synthetic: string;
      };
    };
  }
  ```
- Add `fetchRelatedQuestions()` function that calls `/v1/questions` endpoint:
  - Accept parameters: `userId: string`, `count?: number` (default 3)
  - Make GET request to `${baseUrl}/v1/questions?count={count}`
  - Include headers: `Authorization: Bearer ${apiKey}`, `X-User-ID: ${userId}`
  - Return parsed `GistRelatedQuestions` response
  - Add comprehensive logging for debugging
  - Handle errors with `GistApiError`

### Step 2: Create Citations API Route
- Create `app/api/gist/citations/route.ts` with GET handler
- Accept query parameters: `threadId` (required), `turnId` (required)
- Validate parameters are present and non-empty
- Get Clerk userId with `await auth()`
- Call `fetchCitations(threadId, turnId, userId)` from `lib/gist-api.ts`
- Map `GistCitation[]` to `AttributionSource[]` format for compatibility:
  - `id` → `id`
  - `title` → `title`
  - `url` → `url`
  - `domain` → `domain`
  - `date` → `publishedDate`
- Return JSON response with mapped citations
- Add comprehensive error handling with try-catch
- Add logging for debugging

### Step 3: Create Related Questions API Route
- Create `app/api/gist/related-questions/route.ts` with GET handler
- Accept optional query parameter: `count` (default 3)
- Get Clerk userId with `await auth()`
- Call `fetchRelatedQuestions(userId, count)` from `lib/gist-api.ts`
- Extract questions array from nested response structure
- Return JSON response: `{ questions: string[] }`
- Add comprehensive error handling with try-catch
- Add logging for debugging

### Step 4: Verify Feedback API Route Exists
- Check if `app/api/gist/feedback/route.ts` exists
- If it doesn't exist, create it with POST handler:
  - Accept path parameters or body: `threadId`, `turnId`, `like`, `comment` (optional)
  - Get Clerk userId with `await auth()`
  - Call `submitFeedback(threadId, turnId, userId, like, comment)` from `lib/gist-api.ts`
  - Return success response
  - Add comprehensive error handling
- If it exists, verify it matches the expected implementation
- Add logging for debugging if missing

### Step 5: Update Answer Page to Fetch Real Citations
- Open `app/womens-world/answers/page.tsx`
- Remove mock sources constants (lines 309-324)
- After streaming completes (in `complete` event or after reader closes), fetch citations:
  - Add `useCallback` function `fetchCitations()` that calls `/api/gist/citations?threadId={threadId}&turnId={turnId}`
  - Parse response to get `AttributionSource[]` array
  - Update `answerData` state with real citations
  - Handle errors gracefully (log error, show user-friendly message)
- Call `fetchCitations()` after setting `pageState` to `"complete"`
- Update state management to track citation loading state if needed

### Step 6: Update Answer Page to Fetch Real Related Questions
- In `app/womens-world/answers/page.tsx`
- Remove mock related questions constants (lines 326-330)
- After streaming completes and citations are fetched, fetch related questions:
  - Add `useCallback` function `fetchRelatedQuestions()` that calls `/api/gist/related-questions?count=3`
  - Parse response to get `questions: string[]` array
  - Update `answerData` state with real related questions
  - Handle errors gracefully (show empty related questions section if fetch fails)
- Call `fetchRelatedQuestions()` after `fetchCitations()` completes
- Update state management to track related questions loading state if needed

### Step 7: Verify Feedback Submission Integration
- In `app/womens-world/answers/page.tsx`
- Review `handleFeedback` function (lines 151-177)
- Verify it correctly calls `/api/gist/feedback` with `threadId`, `turnId`, `like` parameters
- Ensure error handling logs errors but doesn't break UI
- Test feedback submission with both thumbs up and thumbs down
- Verify feedback state updates correctly after submission

### Step 8: Update TypeScript Types for Consistency
- Open `components/widget_components/types.ts`
- Verify `AttributionSource` type matches the mapped structure from `GistCitation`:
  ```typescript
  export interface AttributionSource {
    id: string;
    title: string;
    url: string;
    domain: string;
    publishedDate: string;
  }
  ```
- Update `AnswerData` interface if needed to reflect real API structure
- Ensure all types are exported and imported correctly

### Step 9: Test Sequential API Flow
- Test complete user flow:
  1. Submit query → wait for loading state
  2. Stream response → verify metadata event with threadId/turnId
  3. Stream complete → verify pageState changes to "complete"
  4. Fetch citations → verify real sources display in attribution cards
  5. Fetch related questions → verify real questions display below answer
  6. Click feedback buttons → verify feedback submission succeeds
- Verify all API calls execute in correct sequence
- Verify error handling doesn't break user experience
- Check browser console for any errors or warnings

### Step 10: Add Format Parsing Integration (From Companion Feature Spec)
- Implement text parsing utilities from `specs/format-womens-world-answer-text.md`
- Create `lib/text-parser.ts` with markdown-like parsing functions
- Create `InlineCitation` component for citation pills
- Create `FormattedText` component to replace `StreamingText`
- Integrate parsed citations with real citation data from API
- Ensure citation numbers in text match indices in citations array
- Test formatted text rendering with real streaming data

### Step 11: Run Validation Commands
- Execute all validation commands listed below
- Fix any TypeScript errors or build issues
- Manually test complete user flow with real API data
- Verify all features work end-to-end with zero regressions

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete
- Navigate to `http://localhost:3000/womens-world/answers?q=What%20are%20natural%20ways%20to%20boost%20energy%3F`
- Verify streaming starts and displays loading animation
- Verify streaming text appears progressively
- Wait for streaming to complete and verify citations load automatically
- Verify real citation sources display in attribution cards (not mock data)
- Verify related questions display below answer (not mock data)
- Click a citation source card and verify it opens the URL
- Click thumbs up button and verify feedback submits without errors
- Click thumbs down button and verify feedback submits without errors
- Submit a new query with a related question and verify thread continues
- Check browser console for any errors or warnings
- Verify all API calls succeed with 200 status codes
- Test error handling by temporarily breaking API connection and verifying graceful degradation

## Notes
- **Sequential API Flow**: The correct flow is: 1) POST `/v1/chat` to create chat, 2) GET `/v1/chat/response/{threadId}/{turnId}` to stream response, 3) GET `/v1/chat/citations/{threadId}/{turnId}` to get sources, 4) GET `/v1/questions` to get related questions (optional), 5) POST `/v1/chat/feedback/{threadId}/{turnId}` to submit feedback
- **Authentication**: All Gist API calls require `Authorization: Bearer {API_KEY}` and `X-User-ID: {userId}` headers. The backend routes handle this using Clerk authentication.
- **Error Handling**: All API routes should handle errors gracefully and return user-friendly error messages. Don't break the UI if an API call fails - show empty sections or fallback content.
- **Type Safety**: Maintain strict type safety with TypeScript interfaces that match Gist API response schemas. Use the types from `lib/gist-api.ts` as the source of truth.
- **Mock Data Removal**: Remove all mock data (mockSources, mockRelatedQuestions) and replace with real API calls. This is the primary goal of this chore.
- **Performance**: Consider caching citations and related questions to avoid redundant API calls if user clicks back/forward or reloads.
- **Logging**: Comprehensive logging is already in place for `lib/gist-api.ts` functions. Add similar logging to new API routes for debugging.
- **Parallel Fetching**: Citations and related questions can be fetched in parallel after streaming completes to improve perceived performance. Use `Promise.all()` to fetch both simultaneously.
- **Format Parsing Integration**: This chore includes the format parsing work from `specs/format-womens-world-answer-text.md`. Implement both API integration and format parsing together to ensure citation numbers in formatted text match real citation indices.
