# Bug: User Profile Not Stored in Convex Database

## Bug Description
When users sign up through Clerk authentication, their profile information is not being reliably stored in the Convex database. The application uses a client-side sync mechanism (`useUserSync` hook) that only runs on the dashboard page, which means:

1. Users signing up for the first time may not have their profile created in Convex
2. The sync only happens when users visit the `/dashboard` page
3. There is no server-side webhook handler to catch Clerk user events
4. Users who sign up but don't visit the dashboard won't exist in the Convex database

**Expected Behavior**: User profile should be automatically created in Convex database immediately after successful Clerk signup, regardless of which page they navigate to.

**Actual Behavior**: User profile is only created when the user visits the dashboard page and the `useUserSync` hook executes successfully, which may fail due to timing issues with auth context initialization.

## Problem Statement
The current implementation relies solely on client-side user synchronization through the `useUserSync` hook, which is only called on the dashboard page. This creates a race condition and reliability issue where:

1. New users may not have their profiles created in Convex immediately
2. Users who sign up but don't visit the dashboard won't be synced
3. The client-side sync has retry logic to handle auth context timing, but this is a workaround for a missing server-side sync mechanism
4. There's no guaranteed synchronization point between Clerk and Convex

## Solution Statement
Implement a server-side Clerk webhook handler that automatically syncs user data to Convex when Clerk user events occur (user.created, user.updated). This provides:

1. **Reliable sync**: Server-side webhook guarantees user creation/update
2. **Immediate sync**: Users are created in Convex as soon as they sign up in Clerk
3. **Event-driven architecture**: Responds to Clerk events (user.created, user.updated, user.deleted)
4. **No race conditions**: Server-side processing eliminates client-side timing issues
5. **Backup client-side sync**: Keep `useUserSync` as a fallback for edge cases

## Steps to Reproduce
1. Start the application with `bun dev` and `npx convex dev`
2. Navigate to the home page at `http://localhost:3000`
3. Click "Sign Up" and create a new account through Clerk
4. After successful signup, check the Convex database for the new user
5. **Expected**: User should exist in the `users` table
6. **Actual**: User may not exist until they visit `/dashboard` and `useUserSync` executes

To verify the bug:
```bash
# In Convex dashboard or via CLI
npx convex run users:currentUser
# May return null even though user is authenticated via Clerk
```

## Root Cause Analysis
The application is missing a critical server-side integration between Clerk and Convex:

1. **No webhook handler**: There is no API route to receive Clerk webhook events
2. **Client-side only sync**: User sync only happens via `useUserSync` hook on dashboard page
3. **Timing dependency**: The client-side sync depends on auth context being ready, which has timing issues
4. **No guaranteed sync point**: There's no server-side mechanism to ensure every Clerk user exists in Convex

**Evidence**:
- `proxy.ts:8` has a public route for `/api/webhook(.*)` but no handler exists
- `convex/users.ts:33` has a `getOrCreateUser` mutation designed for webhook calls, but it's never invoked
- `lib/hooks/useUserSync.ts` implements complex retry logic with exponential backoff to work around auth context timing issues
- `app/dashboard/page.tsx:69` is the only place where `useUserSync` is called

The comment in `convex/users.ts:32` explicitly mentions "called from webhook or first auth", indicating the original design intended webhook-based sync, but the webhook handler was never implemented.

## Relevant Files
Use these files to fix the bug:

### Existing Files to Modify

**`app/api/webhook/clerk/route.ts`** (NEW - needs creation)
- Create Next.js API route to handle Clerk webhooks
- Verify webhook signature for security
- Call Convex mutation to sync user data
- Handle user.created, user.updated, user.deleted events

**`convex/users.ts`** (MODIFY)
- The `getOrCreateUser` mutation already exists and is designed for webhook usage
- May need to add explicit error handling or logging
- Already has proper logic for creating/updating users

**`lib/hooks/useUserSync.ts`** (KEEP AS FALLBACK)
- Keep existing client-side sync as a backup mechanism
- This provides redundancy in case webhook fails or is delayed
- Already has robust retry logic with exponential backoff

**`proxy.ts`** (NO CHANGES NEEDED)
- Already has `/api/webhook(.*)` marked as public route (line 8)
- This allows Clerk to send webhook events without authentication

**`.env.local`** (MODIFY)
- Add `CLERK_WEBHOOK_SECRET` environment variable
- This is used to verify webhook signatures from Clerk

### New Files to Create

**`app/api/webhook/clerk/route.ts`**
- Next.js 16 API route handler for Clerk webhooks
- Implements webhook signature verification
- Calls `getOrCreateUser` mutation for user events
- Handles errors and returns appropriate responses

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add Clerk Webhook Secret to Environment
- Add `CLERK_WEBHOOK_SECRET` to `.env.local`
- Document where to find this secret in Clerk Dashboard (Webhooks section)
- Add a note in README.md about configuring webhooks in Clerk Dashboard

### Step 2: Install Required Dependencies
- Install `svix` package for webhook signature verification: `bun add svix`
- This is Clerk's recommended library for verifying webhook signatures

### Step 3: Create Clerk Webhook API Route Handler
- Create `app/api/webhook/clerk/route.ts`
- Implement POST handler that:
  - Receives webhook payload from Clerk
  - Verifies webhook signature using `svix` and `CLERK_WEBHOOK_SECRET`
  - Parses webhook event type (user.created, user.updated, user.deleted)
  - Extracts user data from webhook payload
  - Calls Convex `getOrCreateUser` mutation with user data
  - Returns appropriate HTTP responses (200 for success, 400 for invalid signature, 500 for errors)
- Add comprehensive error handling and logging

### Step 4: Update Convex Users Module (Optional Improvements)
- Review `convex/users.ts` `getOrCreateUser` mutation
- Add error logging for debugging webhook calls
- Ensure proper handling of optional fields (name, imageUrl)
- Add validation for required fields (clerkId, email)

### Step 5: Update Documentation
- Update `README.md` with webhook setup instructions
- Document the new environment variable `CLERK_WEBHOOK_SECRET`
- Add instructions for configuring webhook endpoint in Clerk Dashboard
- Include the webhook URL format: `https://your-domain.com/api/webhook/clerk`
- Note that webhooks require HTTPS in production (ngrok for local testing)

### Step 6: Test Webhook Integration
- Set up ngrok tunnel for local testing: `ngrok http 3000`
- Configure webhook endpoint in Clerk Dashboard with ngrok URL
- Test user creation: sign up a new user and verify they're created in Convex immediately
- Test user update: update user profile in Clerk and verify changes sync to Convex
- Verify webhook signature validation by sending invalid signature
- Check Convex database to confirm user data is correctly stored

### Step 7: Verify Client-Side Sync Still Works
- Test that `useUserSync` hook still functions as a fallback
- Verify dashboard page still syncs users if webhook somehow fails
- Confirm no duplicate user creation attempts

### Step 8: Run Validation Commands
- Execute all validation commands listed below
- Ensure build succeeds with no TypeScript errors
- Verify webhook handler compiles correctly
- Test end-to-end user signup flow

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

```bash
# 1. Install dependencies
bun add svix

# 2. Build the Next.js app to validate no TypeScript or build errors
bun run build

# 3. Start Convex backend (in separate terminal)
npx convex dev

# 4. Start Next.js dev server (in separate terminal)
bun dev

# 5. Set up ngrok for local webhook testing (in separate terminal)
npx ngrok http 3000
# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

# 6. Configure Clerk webhook in Clerk Dashboard
# - Go to Clerk Dashboard → Webhooks
# - Add endpoint: https://abc123.ngrok.io/api/webhook/clerk
# - Subscribe to events: user.created, user.updated, user.deleted
# - Copy the webhook secret to .env.local as CLERK_WEBHOOK_SECRET

# 7. Test user signup flow
# - Navigate to http://localhost:3000
# - Sign up with a new test account
# - Immediately check Convex database for user (should exist without visiting dashboard)

# 8. Test user update flow
# - Update user profile in Clerk Dashboard (name, email, image)
# - Check Convex database to verify changes are synced

# 9. Verify webhook endpoint directly
curl -X POST http://localhost:3000/api/webhook/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: test" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: invalid" \
  -d '{"type":"user.created","data":{}}'
# Should return 400 Bad Request (invalid signature)

# 10. Check Convex logs for webhook activity
# In Convex dashboard, check logs for successful user creation from webhook

# 11. Verify no regressions in existing functionality
# - Test dashboard page loads correctly
# - Test useUserSync hook still works as fallback
# - Confirm no duplicate users are created
```

## Notes

### Production Deployment Considerations
- **HTTPS Required**: Clerk webhooks require HTTPS endpoints. Use ngrok for local development.
- **Environment Variables**: Ensure `CLERK_WEBHOOK_SECRET` is set in production environment
- **Webhook Endpoint**: Configure production webhook URL in Clerk Dashboard: `https://your-domain.com/api/webhook/clerk`
- **Idempotency**: The `getOrCreateUser` mutation is already idempotent (checks for existing user before creating)

### Security
- **Signature Verification**: Always verify webhook signatures using `svix` library
- **Secret Rotation**: If webhook secret is compromised, rotate it in Clerk Dashboard and update `.env.local`
- **Public Route**: Webhook endpoint must be public (already configured in `proxy.ts`)

### Fallback Strategy
- Keep `useUserSync` hook as a client-side fallback mechanism
- This provides redundancy if webhook delivery fails or is delayed
- Client-side sync ensures users are eventually created even if webhook fails

### Event Types to Handle
- `user.created`: New user signs up → create user in Convex
- `user.updated`: User updates profile → update user in Convex
- `user.deleted`: User deletes account → optionally delete from Convex (soft delete recommended)

### Testing Tips
- Use Clerk Dashboard webhook testing feature to send test events
- Monitor Convex logs for mutation execution
- Use ngrok inspect UI (http://localhost:4040) to see webhook payloads
- Test with multiple user signups to ensure no race conditions

### Alternative Solution (Not Recommended)
Instead of webhooks, you could call `useUserSync` in the root layout or a global component. However, this approach has drawbacks:
- Still client-side (timing issues remain)
- Runs on every page load (unnecessary overhead)
- Not as reliable as server-side webhooks
- Doesn't follow event-driven architecture best practices

The webhook approach is the recommended solution for production applications.
