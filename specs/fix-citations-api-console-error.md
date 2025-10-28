# Bug: Citations API Console Error - Empty Error Object

## Bug Description

The Women's World Answer Page logs a confusing console error when fetching citations fails:

```
Failed to fetch citations: {}
```

The error object is empty (`{}`), making it impossible to diagnose the actual failure. The console.error statement at line 143 attempts to log status, error, and gistApiError properties, but the error object caught from the JSON parsing fallback is empty.

**Symptoms:**
- Console shows "Failed to fetch citations: {}" with no useful debugging information
- No status code, error message, or Gist API error details in the console
- Difficult to diagnose whether it's a 400, 404, 500, or network error
- Users may see answers without citations due to silent failure

**Expected Behavior:**
- Clear, actionable error messages in the console
- Full error details including status code, error message, and Gist API response
- Proper error structure for debugging and troubleshooting

**Actual Behavior:**
- Empty error object `{}` logged to console
- Missing critical debugging information (status, error message, response body)
- Silent failure that's hard to diagnose

## Problem Statement

The error handling in the citations fetch logic (lines 138-150) catches JSON parsing errors but returns an empty object `{}` as the fallback. When this empty object is logged, it provides no useful information for debugging. The console.error statement expects properties like `status`, `error`, and `gistApiError`, but the fallback object is empty.

Additionally, the error logging is incomplete - it doesn't include the actual Response object or attempt to extract the response body as text if JSON parsing fails.

## Solution Statement

Improve error logging by:

1. **Extract response body as text when JSON parsing fails** - If `citationsResponse.json()` throws, read the response body as text to capture the raw error message
2. **Include Response object properties in error log** - Log `citationsResponse.status`, `citationsResponse.statusText`, and `citationsResponse.ok` directly
3. **Use structured error object with fallback values** - Create error object with meaningful defaults instead of empty object
4. **Add try-catch around response.text() fallback** - Handle edge cases where response body cannot be read
5. **Improve error message clarity** - Use descriptive labels and format for easy scanning

This approach ensures that errors are always logged with maximum available information, making debugging straightforward.

## Steps to Reproduce

1. Start the development server: `bun dev`
2. Navigate to `/womens-world/answers?q=test question`
3. Wait for the streaming answer to complete
4. Observe the console error when citations fetch fails (may require Gist API to return error or be unavailable)
5. Note that the error object is empty: `Failed to fetch citations: {}`

**Alternatively, to force the error:**
1. Temporarily modify `/api/gist/citations/route.ts` to return an error status
2. Navigate to `/womens-world/answers?q=test question`
3. Observe the incomplete error logging

## Root Cause Analysis

**Primary Cause:** Insufficient error handling and logging in the citations fetch logic (app/womens-world/answers/page.tsx:138-150)

**Technical Details:**

1. **Empty fallback object** (line 142):
   ```typescript
   const errorData = await citationsResponse.json().catch(() => ({}));
   ```
   - When `citationsResponse.json()` throws (e.g., invalid JSON, empty response), it returns `{}`
   - This empty object has no `error` or `gistApiError` properties
   - Results in useless error log: `Failed to fetch citations: {}`

2. **Missing response body extraction:**
   - If JSON parsing fails, the raw response body is never read
   - Could contain valuable error text, HTML error pages, or plain text messages
   - Lost opportunity for debugging information

3. **Incomplete Response object usage:**
   - `citationsResponse.status` and `citationsResponse.statusText` are available but not fully leveraged
   - Error log doesn't show HTTP method, URL, or headers that could help diagnosis

4. **No error type differentiation:**
   - 400 Bad Request (invalid parameters)
   - 404 Not Found (endpoint doesn't exist)
   - 500 Internal Server Error (server issues)
   - Network errors (timeout, DNS failure)
   - All logged the same way with incomplete information

**Secondary Issues:**

- **Parallel fetch without proper coordination** (line 129-132):
  - Citations and related questions fetched in parallel with `Promise.all()`
  - If citations fail, related questions error is also logged but less critical
  - Should differentiate critical vs non-critical failures

- **Catch block swallows valuable error context** (line 165-173):
  - Generic "Error fetching citations or questions" message
  - Original error details lost in outer catch block
  - Stack trace not preserved

## Relevant Files

Use these files to fix the bug:

### Existing Files

- **app/womens-world/answers/page.tsx** (lines 138-150, 165-173)
  - Contains the buggy error logging that outputs empty error object
  - Needs improved error extraction and logging
  - Should differentiate between JSON parse errors and HTTP errors
  - Should extract response body as text when JSON fails

- **app/api/gist/citations/route.ts** (lines 95-114)
  - Server-side citations endpoint that returns structured errors
  - Already returns proper error structure: `{ error, gistApiError, statusCode }`
  - Frontend should properly display these structured errors
  - Provides context for expected error format

- **lib/gist-api.ts** (lines 165-225)
  - Contains `fetchCitations()` function and `GistApiError` class
  - Shows proper error handling pattern with status codes and error messages
  - Demonstrates expected error structure for Gist API calls
  - Can be reference for consistent error handling

### New Files

None required. This is a logging/error handling fix in existing code.

## Step by Step Tasks

### 1. Improve Citations Error Extraction and Logging

Update the error handling in the citations fetch block (lines 138-150) to extract maximum debugging information:

- Replace empty object fallback `{}` with a comprehensive error extraction function
- Read response body as text when JSON parsing fails
- Log all available Response object properties (status, statusText, ok, headers, url)
- Create structured error object with meaningful defaults
- Add try-catch around response.text() to handle edge cases
- Format error log for easy scanning and diagnosis

**Implementation:**
```typescript
// app/womens-world/answers/page.tsx (lines 138-150)

// Parse citations
if (citationsResponse.ok) {
  const citationsData = await citationsResponse.json();
  realSources = citationsData.citations || [];
} else {
  // Extract error information with maximum detail
  let errorDetails = {
    status: citationsResponse.status,
    statusText: citationsResponse.statusText,
    ok: citationsResponse.ok,
    url: citationsResponse.url,
    error: null as string | null,
    gistApiError: null as unknown,
    rawBody: null as string | null,
  };

  try {
    // Try to parse as JSON first (structured error from our API)
    const errorData = await citationsResponse.json();
    errorDetails.error = errorData.error;
    errorDetails.gistApiError = errorData.gistApiError;
  } catch (jsonError) {
    // JSON parse failed - read as text instead
    try {
      errorDetails.rawBody = await citationsResponse.text();
      errorDetails.error = "Failed to parse error response as JSON";
    } catch (textError) {
      errorDetails.error = "Failed to read error response body";
    }
  }

  console.error("[CITATIONS-FETCH] Failed to fetch citations:", {
    ...errorDetails,
    threadId: currentThreadId,
    turnId: currentTurnId,
  });
}
```

### 2. Improve Related Questions Error Logging

Update related questions error logging (lines 152-158) to match the improved pattern:

- Add consistent error extraction
- Use structured error logging with `[RELATED-QUESTIONS-FETCH]` prefix
- Include URL and request details for debugging

**Implementation:**
```typescript
// app/womens-world/answers/page.tsx (lines 152-158)

// Parse related questions (endpoint currently returns empty array - endpoint not implemented by Gist API)
if (relatedQuestionsResponse.ok) {
  const questionsData = await relatedQuestionsResponse.json();
  realRelatedQuestions = questionsData.questions || [];
} else {
  // Extract error information
  let errorDetails = {
    status: relatedQuestionsResponse.status,
    statusText: relatedQuestionsResponse.statusText,
    url: relatedQuestionsResponse.url,
  };

  console.error("[RELATED-QUESTIONS-FETCH] Failed to fetch related questions:", errorDetails);
}
```

### 3. Improve Outer Catch Block Error Logging

Update the outer catch block (lines 165-173) to preserve error context:

- Log original error with stack trace
- Differentiate between network errors, API errors, and JSON parse errors
- Include fetch details (URLs, parameters) in error log

**Implementation:**
```typescript
// app/womens-world/answers/page.tsx (lines 165-173)

} catch (fetchError) {
  console.error("[CITATIONS-FETCH] Error fetching citations or questions:", {
    error: fetchError instanceof Error ? fetchError.message : String(fetchError),
    stack: fetchError instanceof Error ? fetchError.stack : undefined,
    threadId: currentThreadId,
    turnId: currentTurnId,
    citationsUrl: `/api/gist/citations?threadId=${currentThreadId}&turnId=${currentTurnId}`,
    relatedQuestionsUrl: `/api/gist/related-questions?count=3`,
  });

  // Fallback to showing answer without sources
  setAnswerData({
    text: accumulatedText,
    sources: [],
    relatedQuestions: [],
  });
}
```

### 4. Test Error Logging with Various Scenarios

Create test scenarios to validate comprehensive error logging:

- Test with valid citations API response (200 OK with JSON)
- Test with 400 Bad Request (invalid threadId/turnId)
- Test with 404 Not Found (endpoint doesn't exist)
- Test with 500 Internal Server Error (server error)
- Test with network timeout (slow/failed connection)
- Test with invalid JSON response (malformed JSON)
- Test with HTML error page (non-JSON response)
- Test with empty response body
- Verify all error logs include maximum available information

### 5. Run Validation Commands

Execute all validation commands to ensure the bug is fixed with zero regressions:

- Build the application to catch TypeScript errors
- Start Convex dev server to ensure schema is deployed
- Start Next.js dev server and test citations fetch
- Verify improved error messages in console
- Confirm answers page still works when citations succeed
- Confirm graceful degradation when citations fail

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and test the improved error logging
- Navigate to `/womens-world/answers?q=test health question` and verify:
  - Answer streams successfully
  - If citations fail, console shows detailed error with status, error message, and raw response
  - If citations succeed, sources display correctly
  - No empty `{}` error objects in console
  - Error logs are clear and actionable

## Notes

### Error Handling Best Practices

1. **Always extract maximum information from failed responses:**
   - HTTP status code and status text
   - Response headers (if relevant)
   - Response body (JSON or text)
   - Request URL and parameters
   - Stack trace for exceptions

2. **Use structured logging with prefixes:**
   - `[CITATIONS-FETCH]` for citations-specific errors
   - `[RELATED-QUESTIONS-FETCH]` for related questions errors
   - Makes console filtering and debugging easier

3. **Differentiate error types:**
   - HTTP errors (4xx, 5xx) - server-side issues
   - Network errors (timeout, DNS) - connectivity issues
   - Parse errors (invalid JSON) - response format issues
   - Application errors (business logic) - code issues

4. **Preserve error context:**
   - Original error message and stack trace
   - Request/response details
   - Application state (threadId, turnId, query)

5. **Graceful degradation:**
   - Show answer even if citations fail (current behavior - good!)
   - Log errors for debugging but don't break UX
   - Provide empty fallbacks (empty sources array)

### Performance Considerations

- Error extraction adds minimal overhead (only runs on failure)
- `response.text()` is called only when JSON parsing fails
- Structured logging is more verbose but essential for debugging
- Consider adding error monitoring service (Sentry, LogRocket) in future

### Future Improvements

Consider implementing in future iterations:

1. **Error monitoring service integration** (Sentry, LogRocket)
2. **Retry logic for transient failures** (already exists in `/api/gist/citations/route.ts`)
3. **User-facing error messages** (currently silent - only console logs)
4. **Error analytics tracking** (count of citation failures)
5. **Fallback to cached citations** (if available)
