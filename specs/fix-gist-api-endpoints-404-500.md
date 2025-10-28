# Bug: Gist API Citations Returns 500 and Related Questions Returns 404

## Bug Description

After implementing anonymous user support for the Gist API routes, the Women's World answer page still fails to fetch citations and related questions with the following errors:

1. **Citations API returns 500**: The `/api/gist/citations` endpoint returns HTTP 500 when called with valid threadId and turnId
2. **Related Questions API returns 404**: The `/api/gist/related-questions` endpoint returns HTTP 404, suggesting the Gist API endpoint `/v1/questions` doesn't exist or the endpoint URL is incorrect

**Expected Behavior**: After streaming completes, citations and related questions should load successfully from the Gist API.

**Actual Behavior**: Both API calls fail, leaving the answer page without source citations or related questions.

## Problem Statement

There are two distinct issues:

1. **Citations 500 Error**: The Gist API `/v1/chat/citations/{threadId}/{turnId}` endpoint is returning HTTP 400 "Invalid thread ID or turn ID", which our route handler converts to a 500 error. This suggests that either:
   - The threadId/turnId from streaming is invalid or malformed
   - The Gist API requires a different format
   - The thread/turn doesn't exist yet when we try to fetch citations

2. **Related Questions 404 Error**: Direct testing reveals the Gist API endpoint `GET /v1/questions` returns HTTP 404 "Route /v1/questions not found". This indicates:
   - The endpoint doesn't exist in the current Gist API version
   - The endpoint URL is incorrect
   - The API documentation is outdated or this feature hasn't been implemented yet

## Solution Statement

**For Citations (500 Error)**:
- Add detailed logging to track threadId/turnId values through the entire flow
- Add retry logic or delay to ensure citations are available after streaming
- Improve error handling to show specific Gist API error messages
- Consider that citations may not be immediately available after streaming completes

**For Related Questions (404 Error)**:
- Remove or comment out the related questions fetching since the endpoint doesn't exist
- Update the answer page to work without related questions
- Add a fallback to use mock/seed questions or remove the feature entirely until the endpoint is available
- Document the missing endpoint in comments for future implementation

## Steps to Reproduce

1. Start dev server: `bun dev`
2. Navigate to `http://localhost:3000/womens-world/answers?q=What%20are%20natural%20ways%20to%20boost%20energy%3F` (without signing in)
3. Wait for streaming to complete
4. Open browser console
5. Observe errors:
   - `Failed to fetch citations: 500`
   - `Failed to fetch related questions: 404`
6. Check Network tab:
   - `/api/gist/citations?threadId=...&turnId=...` returns 500 with error from Gist API
   - `/api/gist/related-questions?count=3` returns 404

**Direct API Testing**:
```bash
# Test citations with invalid threadId
curl 'https://api.gist.ai/v1/chat/citations/test-thread/1' \
  -H "Authorization: Bearer pk_..." \
  -H "X-User-ID: test"
# Returns: {"error":{"message":"Invalid thread ID or turn ID","status":400,"code":"VALIDATION_ERROR"}}

# Test questions endpoint
curl 'https://api.gist.ai/v1/questions?count=3' \
  -H "Authorization: Bearer pk_..." \
  -H "X-User-ID: test"
# Returns: {"error":"Not Found","message":"Route /v1/questions?count=3 not found","statusCode":404}
```

## Root Cause Analysis

### Citations 500 Error

**File**: `app/api/gist/citations/route.ts`

The Gist API is returning HTTP 400 "Invalid thread ID or turn ID", which means either:
1. The threadId/turnId from the streaming response are not in the correct format
2. The citations are not ready immediately after streaming completes (timing issue)
3. There's a mismatch between what our streaming API returns and what the citations API expects

The error handling in our route converts the Gist API's 400 error to a 500 error for the client, which masks the real issue.

### Related Questions 404 Error

**File**: `app/api/gist/related-questions/route.ts`

Direct API testing confirms the Gist API endpoint `GET /v1/questions` does not exist:
```json
{"error":"Not Found","message":"Route /v1/questions?count=3 not found","statusCode":404}
```

This is a case where the API documentation (`ai_docs/gist_docs/gistapi.md` lines 450-473) describes an endpoint that doesn't exist in the actual API. This is not a bug in our code - the Gist API simply doesn't have this endpoint implemented.

## Relevant Files

Use these files to fix the bug:

- **`app/api/gist/citations/route.ts`** (Lines 1-83)
  - Current error handling masks the real Gist API error
  - Needs better logging to show actual Gist API error messages
  - May need retry logic or delay before fetching citations
  - Should pass through Gist API error details to help debug

- **`app/api/gist/related-questions/route.ts`** (Lines 1-61)
  - Calls non-existent `/v1/questions` endpoint
  - Should be disabled or removed until endpoint exists
  - Could use fallback to mock data or remove feature

- **`app/womens-world/answers/page.tsx`** (Lines 125-174)
  - Fetches citations and related questions after streaming
  - Should handle missing related questions gracefully
  - Could use mock/seed questions as fallback
  - Needs better error handling to show users what failed

- **`lib/gist-api.ts`** (Lines 360-409)
  - `fetchRelatedQuestions()` calls non-existent endpoint
  - Should be commented out or documented as unavailable
  - Add comment explaining the endpoint doesn't exist

- **`components/widget_components/ai-elements/related-questions.tsx`**
  - Component that displays related questions
  - Should handle empty questions array gracefully
  - Already has fallback behavior, needs verification

### New Files

No new files needed.

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Improve Citations API Error Handling

- Open `app/api/gist/citations/route.ts`
- Update the error handling to expose the actual Gist API error:
  - When catching `GistApiError`, include the response body in the error response
  - Return error object with: `{ error: error.message, gistApiError: error.response, statusCode: error.statusCode }`
  - This will help us see the actual "Invalid thread ID or turn ID" message from Gist
- Add more detailed logging before calling `fetchCitations()`:
  - Log the exact threadId and turnId values being sent
  - Log the full URL being called
- Keep the status code from the Gist API (don't convert 400 to 500)

### Step 2: Add Retry Logic for Citations

- In `app/api/gist/citations/route.ts`
- Add a simple retry mechanism with delay:
  - If first fetch returns 400 "Invalid thread ID", wait 500ms and retry once
  - Log retry attempts
  - This accounts for potential timing where citations aren't ready immediately
- If retry also fails, return the detailed error to client

### Step 3: Disable Related Questions Endpoint

- Open `app/api/gist/related-questions/route.ts`
- Add a comment at the top explaining the Gist API `/v1/questions` endpoint doesn't exist:
  ```typescript
  // NOTE: The Gist API /v1/questions endpoint returns 404 (endpoint not implemented)
  // This route is disabled until the endpoint becomes available
  // For now, we return empty questions array
  ```
- Replace the entire route logic with:
  ```typescript
  return NextResponse.json({ questions: [] });
  ```
- This prevents unnecessary API calls and lets the page work without errors

### Step 4: Update Answer Page to Handle Missing Features

- Open `app/womens-world/answers/page.tsx`
- Update the citations fetch error handling (line 142):
  - Log the full error response including `gistApiError` if present
  - Show more specific error message to help debugging
- Update the related questions handling (lines 145-151):
  - Since endpoint is disabled, this will now always return empty array
  - Verify the UI handles empty `relatedQuestions` array gracefully
  - Component should simply not render related questions section

### Step 5: Document API Limitations in Gist Library

- Open `lib/gist-api.ts`
- Add documentation comment above `fetchRelatedQuestions()` function (line 360):
  ```typescript
  // NOTE: As of October 2025, the Gist API /v1/questions endpoint returns 404
  // This function is kept for future use when the endpoint becomes available
  // Current status: Endpoint not implemented by Gist AI API
  ```
- Keep the function implementation as-is for future use

### Step 6: Verify Related Questions Component Handles Empty Array

- Open `components/widget_components/ai-elements/related-questions.tsx`
- Review the component rendering logic
- Verify it returns null or empty state when `questions` array is empty
- If not handling empty array, add conditional rendering:
  ```typescript
  if (!questions || questions.length === 0) {
    return null;
  }
  ```

### Step 7: Test with Real Streaming Data

- Start dev server: `bun dev`
- Navigate to answer page with query
- Wait for streaming to complete
- Check browser console:
  - Should see detailed logs with threadId/turnId values
  - Should see actual Gist API error messages (if citations still fail)
  - Should NOT see 404 error for related questions (now returns empty array)
- Check Network tab:
  - `/api/gist/citations` should show detailed error response if it fails
  - `/api/gist/related-questions` should return `{questions: []}`
- Verify page still displays answer and any available citations
- Verify no related questions section appears (gracefully hidden)

### Step 8: Run Validation Commands

- Execute all validation commands listed below
- Fix any TypeScript errors or build issues
- Ensure zero regressions in existing functionality

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server
- **Manual Test (Anonymous User)**:
  - Open incognito browser window
  - Navigate to `http://localhost:3000/womens-world/answers?q=What%20are%20natural%20ways%20to%20boost%20energy%3F`
  - Wait for streaming to complete
  - Check browser console for detailed error messages (if citations fail)
  - Verify NO 404 error for related questions
  - Verify answer displays even if citations fail
  - Verify no related questions section (or empty state shown gracefully)
- **Test Citations with Valid Thread**:
  - Submit a query and capture the threadId/turnId from streaming
  - Check server logs to see if citations fetch succeeds or what error Gist API returns
  - If retry logic triggers, verify it's logged
- **Verify Error Messages**:
  - If citations fail, check that error response includes Gist API error details
  - Verify the error helps identify the root cause (invalid thread, timing, etc.)

## Notes

### Why Related Questions Doesn't Work

The Gist API documentation in `ai_docs/gist_docs/gistapi.md` (lines 446-473) describes a `GET /v1/questions` endpoint that **does not exist** in the actual API. Direct testing confirms:

```bash
curl 'https://api.gist.ai/v1/questions?count=3' \
  -H "Authorization: Bearer $GIST_API_KEY" \
  -H "X-User-ID: test-user"

# Response: {"error":"Not Found","message":"Route /v1/questions?count=3 not found","statusCode":404}
```

This is not a bug in our code - the endpoint simply isn't implemented by Gist AI. We have three options:

1. **Disable the feature** (recommended): Return empty questions array until endpoint exists
2. **Use mock data**: Return hardcoded seed questions for UX purposes
3. **Remove the feature entirely**: Delete all related questions code

For this fix, we're choosing option 1 (disable) because it's the cleanest approach and keeps the code ready for when the endpoint becomes available.

### Citations Timing Issue

The Gist API may return "Invalid thread ID or turn ID" if we try to fetch citations too quickly after streaming completes. The citations might not be indexed/available immediately. The retry logic with a 500ms delay should handle this.

### Alternative: Use Seed Questions

Instead of disabling related questions entirely, we could use the existing seed questions carousel logic as a fallback. The Women's World widget already has seed questions that could be shown when the API endpoint isn't available. This would maintain better UX.

To implement this:
1. Keep the related questions API call
2. If it returns empty array, fall back to predefined seed questions
3. Update component to handle this fallback

### Future Enhancement: Poll for Citations

If citations consistently fail with timing issues, consider implementing a polling mechanism:
1. Try to fetch citations immediately after streaming
2. If 400 error, retry with exponential backoff (500ms, 1s, 2s)
3. Give up after 3 attempts or 5 seconds total
4. Show answer without citations if all retries fail

This would be more robust than a single retry but adds complexity.

### Testing with Real Data

To properly test the citations fix, we need:
1. Valid threadId and turnId from a real streaming response
2. Verification that the Gist API actually returns citations for that thread/turn
3. Understanding of how long after streaming the citations become available

The retry logic should help with timing, but we may need to adjust the delay based on real-world testing.
