# Bug: syncUser Mutation "Not authenticated" Error

## Bug Description

The `syncUser` mutation is throwing "Uncaught Error: Not authenticated" errors when called from the `useUserSync` hook in the dashboard page. The errors occur repeatedly:

```
10/23/2025, 6:24:35 PM [CONVEX M(users:syncUser)] Uncaught Error: Not authenticated
    at handler (../convex/users.ts:85:25)
```

**Expected Behavior**: When a user is authenticated via Clerk and visits the dashboard, the `syncUser` mutation should successfully retrieve the user's Clerk identity and create/update the user in the Convex `users` table.

**Actual Behavior**: The mutation throws "Not authenticated" error at line 82 (`if (!identity)`) indicating that `ctx.auth.getUserIdentity()` is returning `null` despite the user being authenticated in Clerk.

## Problem Statement

The `syncUser` mutation cannot access the authenticated user's identity from the Convex auth context (`ctx.auth.getUserIdentity()` returns `null`) even though:
1. The user is successfully authenticated in Clerk (dashboard page loads, which is protected)
2. The `useAuth` hook from Clerk is working (ConvexClientProvider uses it)
3. The mutation is being called from an authenticated client

This is a **timing/race condition** issue where the mutation is being called before Convex has fully established the authenticated session context.

## Solution Statement

Fix the authentication timing issue by:

1. **Remove premature error throwing**: Allow the mutation to gracefully handle unauthenticated states instead of throwing errors immediately
2. **Add proper authentication checks**: Make the mutation return early with a null/pending state when auth isn't ready
3. **Improve hook logic**: Add authentication readiness checks in `useUserSync` to only call the mutation when Convex auth context is confirmed ready
4. **Add retry mechanism**: Implement exponential backoff retry in the hook to handle temporary auth context initialization delays

The minimal fix is to make both the mutation and the hook **auth-context-aware** and **gracefully handle pending auth states**.

## Steps to Reproduce

1. Start Convex dev server: `npx convex dev`
2. Start Next.js dev server: `bun dev`
3. Navigate to home page `/`
4. Click "Sign In" and authenticate with Clerk
5. Navigate to `/dashboard`
6. Observe console errors: "Not authenticated" thrown by `syncUser` mutation
7. Check Convex logs in terminal: Multiple "Uncaught Error: Not authenticated" entries

## Root Cause Analysis

**Primary Root Cause**: Race condition between Clerk authentication and Convex auth context initialization.

**Technical Details**:

1. **ConvexProviderWithClerk Integration**: The `ConvexProviderWithClerk` uses the `useAuth` hook from Clerk to pass authentication tokens to Convex. However, there's a timing gap:
   - Clerk authentication completes first (user can access protected routes)
   - Convex auth context initialization happens asynchronously
   - The `useUserSync` hook fires immediately when the dashboard mounts
   - The mutation is called before `ctx.auth.getUserIdentity()` has the auth token

2. **useEffect Timing**: The `useUserSync` hook uses `useEffect` with dependencies `[isLoaded, isSignedIn, user, syncUser]`. This fires as soon as Clerk confirms authentication, but doesn't wait for Convex's auth context to be ready.

3. **No Retry Logic**: The hook has error handling that resets the `hasSynced` flag, but React's useEffect won't automatically re-run unless dependencies change. The mutation fails permanently on the first call.

4. **Error Throwing**: The mutation throws an error on line 82 instead of returning early or waiting, causing the entire operation to fail loudly.

**Why This Happens**:
- `ConvexProviderWithClerk` passes auth tokens to Convex asynchronously
- There's no mechanism to wait for Convex auth context to be ready before calling mutations
- The `useAuth` hook from Clerk being truthy doesn't guarantee Convex's `ctx.auth` is initialized

**Evidence from Logs**:
- Multiple repeated "Not authenticated" errors show the hook is retrying (due to error resetting `hasSynced`)
- The dashboard loads successfully (200 OK), proving Clerk auth works
- No users appear in Convex database, proving the mutation never succeeds

## Relevant Files

Use these files to fix the bug:

**Convex Backend:**
- `convex/users.ts` (lines 78-112) - Contains the `syncUser` mutation that's throwing the error. **Relevant because**: Line 82 throws the "Not authenticated" error when `ctx.auth.getUserIdentity()` returns null. Needs to handle pending auth states gracefully.

**Frontend Hooks:**
- `lib/hooks/useUserSync.ts` - Custom hook that calls `syncUser` mutation. **Relevant because**: Fires too early before Convex auth context is ready. Needs authentication readiness checks and retry logic.

**Authentication Setup:**
- `app/ConvexClientProvider.tsx` - Connects Clerk auth to Convex. **Relevant because**: Understanding this integration is crucial for timing issues. May need to expose auth readiness state.
- `convex/auth.config.ts` - Clerk auth configuration for Convex. **Relevant because**: Confirms the Clerk domain configuration is correct.
- `middleware.ts` → `proxy.ts` - Clerk authentication middleware for route protection. **Relevant because**: Needs to be renamed to `proxy.ts` to eliminate Next.js 16 deprecation warning (unrelated to auth bug but good hygiene).

**Layout & Routing:**
- `app/layout.tsx` - Root layout with ClerkProvider and ConvexClientProvider. **Relevant because**: Shows provider hierarchy and potential timing of auth initialization.
- `app/dashboard/page.tsx` - Dashboard page that uses `useUserSync`. **Relevant because**: The page where the bug manifests.

### New Files

No new files needed. This is a logic fix in existing files.

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 0: Migrate middleware.ts to proxy.ts (Next.js 16 Compliance)

- **Rename file**: `middleware.ts` → `proxy.ts`
  - This eliminates the deprecation warning: "The 'middleware' file convention is deprecated. Please use 'proxy' instead"
  - Next.js 16 prefers `proxy.ts` for clearer naming and consistent Node.js runtime
- **Verify export**: The file already uses `export default clerkMiddleware(...)` which is correct
- **Keep all logic unchanged**: Route protection, public route matching, and config remain identical
- **Why do this first**:
  - Eliminates console noise from deprecation warning
  - Follows Next.js 16 best practices
  - Unrelated to auth bug but good hygiene
  - Simple file rename with zero logic changes

### Step 1: Fix syncUser Mutation - Handle Pending Auth Gracefully

- Update `convex/users.ts` - Modify `syncUser` mutation (lines 78-112):
  - **Remove error throwing** on line 82: Don't throw "Not authenticated" error
  - **Return early with null** when `identity` is null: This indicates auth context isn't ready yet, not a permanent failure
  - **Add return type annotation**: Make it clear the mutation can return `null | Id<"users">`
  - Keep all the user creation/update logic the same
  - This allows the frontend to detect "auth not ready yet" vs "mutation succeeded"

### Step 2: Improve useUserSync Hook - Add Auth Readiness and Retry

- Update `lib/hooks/useUserSync.ts`:
  - **Add retry counter state**: Track retry attempts with `useState` (max 5 retries)
  - **Add delay state**: Track current retry delay with exponential backoff (100ms, 200ms, 400ms, 800ms, 1600ms)
  - **Modify useEffect logic**:
    - Check if `syncUser` result is `null` (auth not ready) vs successful user ID
    - Implement exponential backoff retry when result is `null`
    - Stop retrying after max attempts and log final error
    - Clear retry timer on unmount to prevent memory leaks
  - **Better error logging**: Distinguish between "auth not ready" (retry) vs "actual error" (stop)
  - **Success logging**: Only log success when user ID is returned

### Step 3: Test Authentication Flow End-to-End

- Start Convex dev server: `npx convex dev` (background Terminal 1)
- Start Next.js dev server: `bun dev` (Terminal 2)
- Clear browser cache and local storage
- Test flow:
  1. Navigate to `/` (home page)
  2. Click "Sign In" and authenticate with Clerk
  3. Navigate to `/dashboard`
  4. Watch browser console for:
     - "User synced to Convex database" success message
     - No "Not authenticated" errors
     - Possible retry messages if auth context takes time
  5. Check Convex logs in Terminal 1:
     - No "Uncaught Error: Not authenticated" errors
     - Possible info logs about retry attempts (acceptable)
  6. Verify Convex dashboard:
     - Visit https://dashboard.convex.dev/t/tjmcgovern/kindly-pigeon-464/data
     - Click `users` table
     - Confirm authenticated user appears with correct Clerk ID, email, name

### Step 4: Test Edge Cases

- Test multiple scenarios to ensure robustness:
  1. **Fast auth context**: Refresh dashboard multiple times - should work without retries
  2. **Slow auth context**: Simulate slow network in DevTools - should retry and succeed
  3. **Sign out and sign in**: Ensure sync works for returning users
  4. **New user signup**: Create new account and verify sync works on first visit
  5. **Multiple dashboard visits**: Refresh dashboard 5+ times - verify no duplicate users created

### Step 5: Run Validation Commands

- Execute all validation commands to confirm zero regressions
- Verify no TypeScript errors
- Verify Convex deployment succeeds
- Verify dashboard functionality intact

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

**Build and Deploy:**
- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions, watch logs for errors (run in background Terminal 1)

**Manual Testing:**
- `bun dev` - Start the Next.js dev server (Terminal 2)
- **Verify middleware → proxy migration**:
  - Check server logs: "⚠ The 'middleware' file convention is deprecated" warning should be GONE
  - Verify dashboard route protection still works (redirects to sign-in when not authenticated)
- Navigate to `http://localhost:3000/dashboard` after signing in
- **Before fix**: See "Uncaught Error: Not authenticated" in Convex logs
- **After fix**: See "User synced to Convex database" in browser console, no errors in Convex logs
- Visit Convex dashboard and verify user exists in `users` table

**Regression Testing:**
- Test form submission on dashboard still works (save configuration)
- Test sign out and sign in flow
- Test new user signup and first dashboard visit
- Verify no console errors in browser or Convex logs
- Verify dashboard loads correctly and all features work

## Notes

### Middleware → Proxy Migration (Bonus Fix)

While investigating the authentication bug, we also noticed the Next.js 16 deprecation warning:
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**Why include this in the bug fix?**
1. **Clean logs**: Deprecation warning adds noise to logs, making it harder to spot real issues
2. **Best practice**: Next.js 16 officially recommends `proxy.ts` for clearer semantics
3. **Zero risk**: Simple file rename with no logic changes
4. **Future-proofing**: Next.js may remove `middleware.ts` support in future versions

**Is this related to the auth bug?**
- **No, they are separate issues**
- The middleware deprecation is a naming convention change
- The auth bug is a timing issue with Convex auth context initialization
- However, fixing both together improves overall code quality

### Why This Bug Happened

This is a **classic async timing bug** in the Clerk + Convex integration:

1. **Clerk authenticates fast**: User is authenticated in Clerk almost instantly
2. **Convex auth context is slow**: The `ConvexProviderWithClerk` needs to exchange Clerk tokens with Convex, which takes time
3. **React renders optimistically**: React allows the dashboard to render as soon as Clerk confirms auth
4. **useEffect fires immediately**: The `useUserSync` hook's useEffect fires on first render
5. **Mutation called too early**: The mutation is called before Convex's `ctx.auth.getUserIdentity()` has the token

### Alternative Solutions Considered

**Option 1: Use Convex's `useAuth` to check readiness** (Not Implemented)
- Pros: More direct check of Convex auth state
- Cons: `convex/react` doesn't expose an auth readiness hook

**Option 2: Add delay before calling mutation** (Not Implemented)
- Pros: Simple fix
- Cons: Arbitrary timeout, doesn't solve root cause, unreliable

**Option 3: Use Clerk webhooks for user sync** (Future Enhancement)
- Pros: Most reliable, server-side sync
- Cons: Requires webhook setup, more complex, not addressing immediate bug

**Option 4: Retry with exponential backoff** (Chosen Solution)
- Pros: Handles timing gracefully, self-healing, minimal code changes
- Cons: Slight delay for user sync (acceptable trade-off)

### Why This Fix is Minimal and Surgical

1. **No new dependencies**: Pure logic fix using existing React hooks
2. **No architecture changes**: Keeps ConvexProviderWithClerk integration as-is
3. **Backward compatible**: Doesn't break existing functionality
4. **Graceful degradation**: If sync fails after retries, dashboard still works (sync will happen on next visit)
5. **Clear error messages**: Developers can debug issues with improved logging

### Performance Impact

- **Negligible**: Retry logic only fires when auth context is slow (rare)
- **Max delay**: 3.1 seconds total (100ms + 200ms + 400ms + 800ms + 1600ms) across 5 retries
- **Typical case**: 0-200ms delay (auth context ready on first or second attempt)
- **No impact on authenticated users**: Once synced, no retries on subsequent visits

### Future Improvements

1. **Implement Clerk webhooks**: For guaranteed server-side sync (recommended for production)
2. **Add Convex auth readiness signal**: Feature request to Convex for explicit auth state
3. **Optimize ConvexProviderWithClerk**: Investigate if auth token exchange can be faster
4. **Add loading UI**: Show spinner during sync retries for better UX
