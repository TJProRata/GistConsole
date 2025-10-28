# Bug: Answers Page API 404 Error

## Bug Description
The Women's World Answers page (`/admin/components/widgets/complete/answers/page.tsx`) is throwing a 404 error when attempting to fetch from the `/api/openai/stream` endpoint. The error occurs at line 66 when checking the response status after making a POST request to the OpenAI streaming API.

**Symptoms:**
- Console error: "API request failed: 404"
- The streaming answer functionality breaks completely
- Users cannot submit queries and receive AI-generated answers

**Expected Behavior:**
- POST request to `/api/openai/stream` should return 200 status
- Stream response should be read and displayed in real-time
- Answer should complete with attribution sources and related questions

**Actual Behavior:**
- POST request to `/api/openai/stream` returns 404 status
- Error is caught and displayed to the user
- No streaming or answer display occurs

## Problem Statement
The `/api/openai/stream` endpoint exists in the codebase (`app/api/openai/stream/route.ts`) but is returning a 404 status code when accessed from the admin answers page. This is likely due to one of the following issues:

1. **Authentication Middleware Blocking**: The `proxy.ts` middleware may be blocking the API route because the admin page is protected and the API endpoint is not explicitly marked as public
2. **Route Registration**: Next.js 16 may not be properly registering the API route in the Turbopack dev server
3. **Missing Environment Variable**: `OPENAI_API_KEY` may not be configured, causing the route to fail silently

## Solution Statement
We need to ensure the `/api/openai/stream` endpoint is accessible and properly configured. The solution involves:

1. **Add API route to public routes**: Update `proxy.ts` to allow `/api/openai/stream` to be accessed by authenticated admin users
2. **Verify environment variable**: Ensure `OPENAI_API_KEY` is configured in `.env.local`
3. **Add proper error handling**: Improve error messages to distinguish between authentication, configuration, and API errors
4. **Test the endpoint**: Verify the route is accessible and returns proper streaming responses

## Steps to Reproduce
1. Start the Next.js dev server: `bun dev`
2. Start Convex dev server: `npx convex dev`
3. Sign in as an admin user
4. Navigate to `/admin/components/widgets/complete/answers`
5. Enter a query in the search input (e.g., "What's the best bread for weight loss?")
6. Click submit or press Enter
7. Observe the console error: "API request failed: 404"

## Root Cause Analysis
After reviewing the codebase, the root cause is that the `/api/openai/stream` endpoint exists but is being blocked or not properly accessible. The specific issues are:

1. **Middleware Configuration**: The `proxy.ts` file only allows `/api/webhook(.*)` as a public API route pattern. The `/api/openai/stream` route is not explicitly allowed, which means it requires authentication but may not be handling authenticated requests properly.

2. **Missing Error Context**: The error message "API request failed: 404" doesn't provide enough context to debug. The actual issue could be:
   - Route not found (true 404)
   - Authentication failure (401/403 treated as 404)
   - Missing API key (500 treated as 404)

3. **OpenAI Dependency**: The route requires the `openai` package (which is installed) and `OPENAI_API_KEY` environment variable. If the key is missing, the route returns a 500 error, but the client treats any non-200 response as a generic error.

4. **Next.js 16 Route Registration**: With Turbopack as the default bundler, there may be route registration issues that need verification.

## Relevant Files
Use these files to fix the bug:

### Existing Files

**`app/api/openai/stream/route.ts`** - The OpenAI streaming API route
- Contains the POST handler that streams responses from OpenAI GPT-4
- Has error handling for missing API key and invalid queries
- Uses ReadableStream to stream responses back to the client
- **Relevance**: This is the endpoint returning 404, need to verify it's properly registered and accessible

**`app/admin/components/widgets/complete/answers/page.tsx`** - The answers page making the API call
- Line 57: Makes POST request to `/api/openai/stream`
- Line 66: Throws the error when response.ok is false
- **Relevance**: The client code calling the API endpoint, may need better error handling

**`proxy.ts`** - Clerk authentication middleware
- Defines public routes that don't require authentication
- Currently allows `/api/webhook(.*)` but not `/api/openai/stream`
- **Relevance**: May be blocking the API route or not handling authenticated API requests properly

**`.env.local`** - Environment variables (should exist)
- Should contain `OPENAI_API_KEY` configuration
- **Relevance**: Missing API key would cause 500 error from the route

**`package.json`** - Dependencies
- Contains `openai: "^6.7.0"` dependency
- **Relevance**: Confirms OpenAI package is installed

### Files to Verify/Create

**`.env.local`** - May need to be created or updated with OPENAI_API_KEY

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Verify Environment Configuration
- Check if `.env.local` exists and contains `OPENAI_API_KEY`
- If missing, document that the API key needs to be added
- Add a note about obtaining an API key from OpenAI platform

### Step 2: Update Middleware to Allow OpenAI API Route
- Modify `proxy.ts` to explicitly allow authenticated access to `/api/openai/stream`
- The route should be accessible to authenticated users (not public, but not blocked)
- Keep webhook routes public as they need to accept external requests

### Step 3: Improve Error Handling in API Route
- Update `app/api/openai/stream/route.ts` to return more descriptive error messages
- Add status code logging for debugging
- Ensure proper error response format matches client expectations

### Step 4: Improve Error Handling in Client Page
- Update `app/admin/components/widgets/complete/answers/page.tsx` to show more detailed error messages
- Parse and display specific error types (404, 401, 500, etc.)
- Add helpful messages for common issues (missing API key, authentication failure)

### Step 5: Add README Documentation
- Update `README.md` to document the `OPENAI_API_KEY` requirement
- Add setup instructions for configuring OpenAI API access
- Document the answers page functionality and requirements

### Step 6: Test the Fix
- Run the validation commands to ensure the bug is fixed
- Verify the API route is accessible and returns proper responses
- Test with and without valid API key to ensure proper error handling
- Confirm streaming functionality works end-to-end

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background, use Ctrl+C to stop after validation)
- `bun dev` - Start the Next.js dev server (run in background)
- Manual test: Navigate to `http://localhost:3000/admin/components/widgets/complete/answers` and submit a query
- Verify: Check browser console shows no 404 errors
- Verify: If `OPENAI_API_KEY` is missing, error message should clearly state "OpenAI API key not configured"
- Verify: If `OPENAI_API_KEY` is present, streaming should work and display answer
- Verify: Related questions, attribution sources, and feedback buttons appear after answer completes

## Notes

### OpenAI API Key Setup
Users need to obtain an API key from OpenAI:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env.local` as: `OPENAI_API_KEY=sk-...`
4. Restart the dev server

### Alternative Solutions Considered
1. **Make route fully public**: Rejected because admin pages should remain protected
2. **Use Convex actions**: Rejected because existing implementation uses Next.js API routes and works well
3. **Client-side OpenAI calls**: Rejected due to security concerns (exposing API key)

### Testing Notes
- Test with missing API key first to ensure proper error handling
- Test with valid API key to ensure streaming works
- Test authentication by signing out and attempting to access the page
- Verify the route returns proper CORS headers if needed

### Next.js 16 Considerations
- Turbopack is the default bundler, ensure routes are registered properly
- `proxy.ts` is the new middleware file (replaces `middleware.ts`)
- Async APIs require `await` for params, searchParams, cookies, headers
