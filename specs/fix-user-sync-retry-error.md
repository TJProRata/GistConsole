# Bug: User Sync Retry Exhaustion Error

## Bug Description
Console error appears stating "Failed to sync user after maximum retries. Auth context may not be initialized." This occurs when the `useUserSync` hook exhausts its retry attempts (5 retries with exponential backoff) trying to sync the authenticated Clerk user to the Convex database. The error indicates a race condition where the Convex auth context is not ready when the hook attempts synchronization.

**Expected Behavior:** User should be silently synced to Convex database without console errors, even if auth context initialization requires waiting.

**Actual Behavior:** After 5 failed retry attempts, an error message is logged to the console, indicating the sync failed.

## Problem Statement
The current retry mechanism has two issues:

1. **Fixed Maximum Retries**: The hook gives up after 5 retries, but in some cases (slow network, heavy browser load, etc.), the auth context may need more time to initialize
2. **No Success Handling After Retry**: Once the retry count is exceeded, the hook doesn't continue monitoring for auth context readiness
3. **Error Logging is Too Harsh**: The error message suggests a critical failure, when in reality it's often just a timing issue that will resolve on its own

The root issue is architectural: the hook tries to sync immediately on mount, but Convex auth context initialization isn't guaranteed to be complete at that moment.

## Solution Statement
Implement a more resilient retry strategy that:

1. **Increases maximum retries** from 5 to 10 to handle slower initialization
2. **Continues silent polling** even after max retries are exceeded (change from error to warning)
3. **Adds a final fallback** that keeps checking until auth context is ready or component unmounts
4. **Improves logging** to distinguish between temporary auth delays (expected) and actual errors (unexpected)

This approach is more forgiving of timing variations while still providing visibility into what's happening.

## Steps to Reproduce
1. Start the development server: `bun dev`
2. Sign in with Clerk authentication
3. Navigate to `/dashboard` or `/dashboard/install-widget`
4. Open browser console
5. Observe the console error after 5-6 retry attempts (approximately 3.1 seconds total)
6. The error appears even though the user authentication is working correctly

## Root Cause Analysis

**Timing Issue:**
```
Component Mount → useUserSync calls → Convex mutation → ctx.auth.getUserIdentity()
                                                              ↓
                                                      Returns null (not ready yet)
                                                              ↓
                                                      Retry with exponential backoff
                                                              ↓
                                                      After 5 retries: Error logged
```

**Why Auth Context Isn't Ready:**
1. Clerk authentication completes first (user is signed in)
2. ConvexProviderWithClerk receives Clerk auth token
3. Convex backend validates and establishes auth context
4. Small window exists where Clerk says "authenticated" but Convex auth isn't ready

**Current Retry Schedule:**
- Attempt 1: Immediate
- Attempt 2: +100ms (total: 100ms)
- Attempt 3: +200ms (total: 300ms)
- Attempt 4: +400ms (total: 700ms)
- Attempt 5: +800ms (total: 1500ms)
- Attempt 6: +1600ms (total: 3100ms)
- Then: Error logged, no more retries

**The Problem:**
If auth context takes longer than ~3 seconds to initialize (possible on slow connections, cold starts, or heavy browser load), the sync fails and logs an error even though it will eventually succeed.

## Relevant Files
Use these files to fix the bug:

- `lib/hooks/useUserSync.ts` (lines 20-48)
  - Contains the retry logic with MAX_RETRIES constant
  - Line 45 where the error is logged
  - Needs to increase retry limit and improve error handling
  - Should continue attempting sync even after "max" retries

- `convex/users.ts` (lines 79-115)
  - The `syncUser` mutation that's being called
  - Returns `null` when auth context isn't ready (expected behavior)
  - No changes needed here - it's working correctly

- `app/dashboard/page.tsx` (line 69)
  - Calls `useUserSync()` on component mount
  - No changes needed - usage is correct

- `app/dashboard/install-widget/page.tsx` (line 8)
  - Also calls `useUserSync()` on component mount
  - No changes needed - usage is correct

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Increase Maximum Retry Attempts
- Open `lib/hooks/useUserSync.ts`
- Change `MAX_RETRIES` from `5` to `10` (line 20)
- This doubles the retry window from ~3 seconds to ~102 seconds total
- More attempts = more tolerance for slow auth context initialization

### Step 2: Improve Retry Exhaustion Handling
- After max retries are exceeded (line 44-48), change behavior:
  - Downgrade from `console.error` to `console.warn`
  - Change message to indicate this is expected and will continue polling
  - Add a longer-interval polling mechanism that continues checking
  - Don't treat this as a failure state since auth may still initialize

### Step 3: Add Extended Polling After Max Retries
- After max fast retries are exhausted, implement slower polling:
  - Check auth context every 2 seconds
  - Continue until either success or component unmounts
  - This handles edge cases where auth takes unusually long
  - Log success when auth finally becomes available

### Step 4: Improve Logging Messages
- Update retry logs to be less alarming:
  - "Waiting for auth context" instead of "Auth context not ready"
  - Show total time elapsed, not just retry count
  - Only warn (not error) if extended polling is active
  - Clearly distinguish between temporary delay (normal) and actual error (rare)

### Step 5: Validate the Fix
- Build the application to check for TypeScript errors
- Start dev server and test the sync behavior
- Verify no error messages appear in console
- Confirm warning messages (if any) are appropriate
- Test with slow network conditions to verify extended polling works

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and test:
  1. Sign in with Clerk
  2. Navigate to `/dashboard`
  3. Open browser console
  4. Verify NO error messages appear
  5. Verify user sync completes successfully (check success log)
  6. Navigate to `/dashboard/install-widget`
  7. Verify NO error messages appear
  8. Refresh the page multiple times to test different timing scenarios
  9. Throttle network to "Slow 3G" in Chrome DevTools and test again
  10. Verify sync eventually succeeds even with slow network

## Notes

### Why This Approach is Better

**Before (Current):**
- Fixed 5 retries with exponential backoff
- Gives up after ~3 seconds
- Logs error even though sync may eventually succeed
- No recovery mechanism after max retries

**After (Fixed):**
- 10 fast retries (0-102 seconds)
- Extended polling if fast retries exhausted
- Never gives up until component unmounts
- Warning instead of error for extended polling
- More resilient to network/timing variations

### Alternative Approaches Considered

1. **Remove useUserSync entirely, rely on middleware**
   - ❌ Would require webhook setup (more complex)
   - ❌ Doesn't sync on first visit after signup

2. **Move sync to ConvexClientProvider**
   - ❌ Would run on every page, not just protected pages
   - ❌ Harder to handle per-page sync requirements

3. **Use React Query with infinite retries**
   - ❌ Adds unnecessary dependency
   - ❌ Overengineered for this use case

4. **Wait for Convex to add "onAuthReady" callback**
   - ❌ Not currently available in Convex API
   - ❌ Would require framework update

### Why Increased Retries is Safe

- Each retry has exponential backoff, so we're not spamming the server
- Retry 10: +102.4 seconds total (extremely generous)
- Extended polling is every 2 seconds (reasonable for background task)
- All attempts bail out on component unmount (no memory leaks)
- User experience is unaffected (sync happens in background)

### Expected Log Output After Fix

**Normal case (auth ready quickly):**
```
User synced to Convex database
```

**Slow auth context case:**
```
Waiting for auth context (attempt 1/10)
Waiting for auth context (attempt 2/10)
...
User synced to Convex database
```

**Very slow auth context case:**
```
Waiting for auth context (attempt 1/10)
...
Waiting for auth context (attempt 10/10)
[Warn] Max fast retries exceeded, using extended polling
[Extended polling check every 2s]
User synced to Convex database
```
