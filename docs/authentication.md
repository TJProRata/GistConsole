# Authentication & Login System

Complete documentation for how authentication and user management works in Gist Widget Builder.

## Overview

Gist Widget Builder uses **Clerk** for authentication and **Convex** for user data storage, with a dual-layer sync strategy ensuring reliable user profile creation.

## Complete Authentication Flow

### 1. User Signup/Login (Clerk)
- User visits home page (`/`)
- Clicks "Sign Up" or "Sign In" in Header component
- Clerk modal opens (managed by Clerk's pre-built UI)
- User creates account or authenticates
- Clerk issues JWT token, stores session in cookies

### 2. Automatic User Sync to Convex (Server-Side Webhook)
- Clerk fires `user.created` webhook event → `https://your-domain.com/api/webhook/clerk`
- Webhook handler (`app/api/webhook/clerk/route.ts`) receives event:
  - Verifies webhook signature using `svix` library (security)
  - Extracts user data (clerkId, email, name, imageUrl)
  - Calls Convex mutation `api.users.getOrCreateUser` via ConvexHttpClient
  - User profile created in Convex database immediately
- **Result:** User exists in Convex before they even navigate to dashboard

### 3. Route Protection (Middleware)
- User tries to access protected route (e.g., `/dashboard`)
- `proxy.ts` middleware intercepts request:
  - Checks if route is public (home, sign-in, sign-up, webhooks)
  - If protected route, calls `auth.protect()` to verify Clerk session
  - If not authenticated → redirects to sign-in
  - If authenticated → allows access

### 4. Client-Side Fallback Sync (useUserSync Hook)
- Dashboard page mounts, calls `useUserSync()` hook
- Hook checks if user exists in Convex via `syncUser` mutation
- If user doesn't exist (webhook failed/delayed):
  - Retry logic with exponential backoff (10 attempts, then 2s polling)
  - Eventually creates user via client-side sync
- **Purpose:** Safety net in case webhook fails or is delayed

### 5. Accessing User Data in App

**Client Components:**
```tsx
import { useUser } from "@clerk/nextjs";

const { user, isLoaded, isSignedIn } = useUser();
// user = Clerk user object (from session)
```

**Convex Queries (Server):**
```tsx
import { getCurrentUser } from "@/convex/users";

const user = await getCurrentUser(ctx);
// user = Convex database user record
```

## Data Flow Diagram

```
SIGNUP/LOGIN FLOW:
┌─────────────┐
│   Browser   │ 1. Click "Sign Up"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Clerk    │ 2. User creates account
│   (Auth)    │    Session stored in cookies
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼ (Webhook)                      ▼ (Session)
┌─────────────────┐              ┌──────────────┐
│  Webhook API    │              │   Next.js    │
│ /api/webhook/   │              │    App       │
│    clerk        │              └──────┬───────┘
└────────┬────────┘                     │
         │                              │
         │ 3. Creates user              │ 4. User navigates
         ▼                              ▼
┌─────────────────┐              ┌──────────────┐
│     Convex      │◄─────────────│  Middleware  │
│    Database     │  5. Verifies │  (proxy.ts)  │
│                 │     auth     │              │
│  users table    │              └──────────────┘
└─────────────────┘
         ▲
         │ 6. Fallback sync (if needed)
         │
┌────────┴────────┐
│  useUserSync    │
│     Hook        │
└─────────────────┘
```

## Authentication Components

### 1. ClerkProvider (`app/layout.tsx`)
- Wraps entire app
- Provides Clerk session context to all components
- Manages authentication state globally

**Code:**
```tsx
<ClerkProvider>
  <html lang="en">
    <body>
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </body>
  </html>
</ClerkProvider>
```

### 2. ConvexProviderWithClerk (`app/ConvexClientProvider.tsx`)
- Bridges Clerk auth with Convex queries
- Passes Clerk JWT to Convex for authenticated queries
- Enables `ctx.auth.getUserIdentity()` in Convex functions

**Code:**
```tsx
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
```

### 3. Middleware (`proxy.ts`)
- Runs on every request (except static files)
- Public routes: `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhook(.*)`
- Protected routes: All others (requires authentication)
- Uses `auth.protect()` from `@clerk/nextjs/server`

**Code:**
```tsx
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

### 4. Webhook Handler (`app/api/webhook/clerk/route.ts`)
- POST endpoint at `/api/webhook/clerk`
- Receives Clerk events: `user.created`, `user.updated`, `user.deleted`
- Verifies signature with `CLERK_WEBHOOK_SECRET`
- Creates/updates user in Convex via `ConvexHttpClient`
- Handles errors gracefully with logging

**Key Code:**
```tsx
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // Verify signature
  const wh = new Webhook(WEBHOOK_SECRET);
  const evt = wh.verify(payload, headers) as WebhookEvent;

  // Process event
  if (evt.type === "user.created" || evt.type === "user.updated") {
    await convex.mutation(api.users.getOrCreateUser, {
      clerkId: evt.data.id,
      email: primaryEmail.email_address,
      name: name,
      imageUrl: evt.data.image_url,
    });
  }
}
```

### 5. Convex Auth Config (`convex/auth.config.ts`)
- Configures Clerk domain for JWT verification
- Allows Convex to validate Clerk JWTs
- Enables `ctx.auth.getUserIdentity()` to work

**Code:**
```tsx
export default {
  providers: [
    {
      domain: "https://calm-turkey-7.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
```

## User Sync Strategy (Dual-Layer)

### Primary: Server-Side Webhook (Reliable)
- ✅ Immediate sync on signup
- ✅ No client-side timing issues
- ✅ Works even if user never visits dashboard
- ✅ Handles profile updates automatically
- ⚠️ Requires HTTPS in production
- ⚠️ Requires `CLERK_WEBHOOK_SECRET` configured

**Implementation:** `app/api/webhook/clerk/route.ts`

### Fallback: Client-Side Hook (Safety Net)
- ✅ Handles webhook failures/delays
- ✅ Retry logic with exponential backoff
- ✅ Works on any protected page that calls it
- ⚠️ Runs on dashboard page load only
- ⚠️ Auth context timing dependency

**Implementation:** `lib/hooks/useUserSync.ts`

**Usage:**
```tsx
// In protected pages (like dashboard)
export default function DashboardPage() {
  useUserSync(); // Automatically syncs user as fallback

  return <div>Dashboard content</div>;
}
```

## Session Management

### Session Storage
- Clerk manages sessions via HTTP-only cookies
- Session persists across page reloads
- Auto-refresh before expiration
- Secure against XSS attacks (HTTP-only flag)

### Session Validation
- **Middleware:** Validates on every request to protected routes
- **Convex:** Validates JWT on every query/mutation
- Double layer of security ensures authenticated requests

### Sign Out Flow
1. User clicks UserButton → Sign Out
2. Clerk clears session cookies
3. Redirects to home page
4. Subsequent protected route access → redirects to sign-in

## Security Features

### 1. Webhook Signature Verification
- All webhooks verified with `svix` library
- Invalid signatures rejected with 400 status
- Prevents unauthorized user creation

**Verification Code:**
```tsx
const wh = new Webhook(WEBHOOK_SECRET);
const evt = wh.verify(payload, {
  "svix-id": svix_id,
  "svix-timestamp": svix_timestamp,
  "svix-signature": svix_signature,
});
```

### 2. Route Protection
- Middleware blocks unauthenticated access
- Automatic redirects to sign-in
- Public routes explicitly whitelisted

### 3. JWT Validation
- Convex validates Clerk JWTs on every request
- `auth.config.ts` ensures proper domain matching
- Prevents token forgery

### 4. Environment Secrets
- All secrets in `.env.local` (gitignored)
- Webhook secret required for sync
- Clerk keys kept private

**Required Variables:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_DOMAIN=https://your-app.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_...
```

## Webhook Setup

### Local Development (ngrok)

**1. Start servers:**
```bash
# Terminal 1
npx convex dev

# Terminal 2
bun dev

# Terminal 3
ngrok http 3000
```

**2. Configure Clerk webhook:**
- Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
- Go to Clerk Dashboard → Webhooks
- Add endpoint: `https://abc123.ngrok.io/api/webhook/clerk`
- Subscribe to: `user.created`, `user.updated`, `user.deleted`
- Copy signing secret

**3. Update `.env.local`:**
```bash
CLERK_WEBHOOK_SECRET=whsec_your_secret_here
```

**4. Restart Next.js:**
```bash
bun dev
```

### Production Deployment

**1. Configure Clerk webhook:**
- Go to Clerk Dashboard → Webhooks
- Add endpoint: `https://your-domain.com/api/webhook/clerk`
- Subscribe to: `user.created`, `user.updated`, `user.deleted`
- Copy signing secret

**2. Set environment variable:**
- Add `CLERK_WEBHOOK_SECRET` to production environment
- Ensure HTTPS is enabled (required)

## Troubleshooting

### User not in Convex after signup

**Symptoms:**
- User can sign in with Clerk
- User missing from Convex users table
- Dashboard may show errors

**Solutions:**
1. Check webhook configured in Clerk Dashboard
2. Verify `CLERK_WEBHOOK_SECRET` in `.env.local`
3. Check ngrok running (local dev): `ngrok http 3000`
4. View webhook logs at http://localhost:4040 (ngrok inspector)
5. Check Convex logs for mutation execution
6. Test webhook manually: Clerk Dashboard → Webhooks → Test

### Authentication redirects not working

**Symptoms:**
- Infinite redirect loops
- Can't access protected routes
- Sign-in doesn't redirect properly

**Solutions:**
1. Verify `proxy.ts` middleware exists and exports default function
2. Check public routes in `isPublicRoute` matcher
3. Ensure Clerk keys in `.env.local` are correct
4. Check middleware config matcher includes all routes
5. Clear browser cookies and try again

### Can't access Convex user data

**Symptoms:**
- `getCurrentUser()` returns null
- Convex queries fail with auth errors
- User exists in Clerk but not Convex

**Solutions:**
1. Ensure `ConvexProviderWithClerk` wraps app in `layout.tsx`
2. Check `convex/auth.config.ts` has correct Clerk domain
3. Verify user exists: query Convex users table directly
4. Check Clerk JWT being passed to Convex (browser dev tools)
5. Run `useUserSync()` hook manually in dashboard

### Webhook signature verification fails

**Symptoms:**
- 400 errors in webhook logs
- "Invalid signature" messages
- Users not syncing to Convex

**Solutions:**
1. Verify `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard
2. Check webhook secret hasn't been rotated
3. Ensure no extra whitespace in `.env.local`
4. Restart Next.js after updating secret
5. Test with Clerk's webhook testing tool

## Testing

### Test User Signup Flow

1. Start all servers (Convex, Next.js, ngrok)
2. Navigate to `http://localhost:3000`
3. Click "Sign Up"
4. Create test account
5. Check Convex Dashboard → Data → users table
6. User should appear immediately
7. Navigate to `/dashboard` - should work without errors

### Test Webhook Delivery

1. Open ngrok inspector: `http://localhost:4040`
2. Sign up with new account
3. Check ngrok inspector for POST to `/api/webhook/clerk`
4. Verify 200 status response
5. Check request/response bodies for debugging

### Test Fallback Sync

1. Temporarily disable webhook or use invalid secret
2. Sign up with new account
3. Navigate to `/dashboard`
4. Check browser console for "Waiting for auth context" logs
5. User should sync after retries (10-20 seconds)
6. Verify user in Convex database

## Database Schema

### Users Table (`convex/schema.ts`)

```typescript
users: defineTable({
  clerkId: v.string(),      // Clerk user ID (primary key)
  email: v.string(),         // User email
  name: v.optional(v.string()),     // Full name (optional)
  imageUrl: v.optional(v.string()), // Profile image URL (optional)
  createdAt: v.number(),     // Timestamp of creation
})
  .index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"]),
```

### Helper Functions (`convex/users.ts`)

**getCurrentUser(ctx):**
- Returns current user from Convex database
- Uses `ctx.auth.getUserIdentity()` to get Clerk ID
- Returns null if not authenticated

**getCurrentUserOrThrow(ctx):**
- Same as getCurrentUser but throws error if not authenticated
- Use for operations requiring authentication

**getOrCreateUser(args):**
- Creates or updates user in Convex
- Called by webhook handler
- Idempotent - safe to call multiple times

**syncUser():**
- Client-side mutation for fallback sync
- Returns user ID on success, null if auth not ready
- Used by `useUserSync` hook

## File Reference

### Core Authentication Files

```
/app
  /layout.tsx                    # ClerkProvider wrapper
  /ConvexClientProvider.tsx      # Convex + Clerk integration
  /api/webhook/clerk/route.ts    # Webhook handler

/convex
  /auth.config.ts                # Clerk domain configuration
  /users.ts                      # User queries and mutations
  /schema.ts                     # Database schema

/lib/hooks
  /useUserSync.ts                # Client-side fallback sync

/components
  /Header.tsx                    # Sign in/up UI

/proxy.ts                        # Route protection middleware
/.env.local                      # Environment variables (gitignored)
```

### Environment Variables

**Required:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_DOMAIN` - Clerk domain URL
- `CLERK_WEBHOOK_SECRET` - Webhook signing secret
- `NEXT_PUBLIC_CONVEX_URL` - Convex API URL (auto-generated)
- `CONVEX_DEPLOYMENT` - Convex deployment ID (auto-generated)

## Best Practices

### 1. Always Use Webhook Sync
- Don't rely solely on client-side sync
- Configure webhooks in both development and production
- Use ngrok for local webhook testing

### 2. Handle Auth Context Timing
- Always check `isLoaded` before accessing user data
- Use `useUserSync` as fallback in protected pages
- Handle null states gracefully in UI

### 3. Secure Your Webhooks
- Never commit `CLERK_WEBHOOK_SECRET` to git
- Rotate webhook secrets if compromised
- Verify signatures on all webhook requests

### 4. Test Both Sync Methods
- Test webhook sync (primary path)
- Test fallback sync (error handling)
- Verify duplicate user prevention

### 5. Monitor Logs
- Watch Convex logs for user creation
- Monitor ngrok inspector during development
- Set up production logging/monitoring

## Additional Resources

- **Clerk Documentation:** https://clerk.com/docs
- **Convex Authentication:** https://docs.convex.dev/auth/clerk
- **Webhook Setup Guide:** See `README.md` in project root
- **ngrok Documentation:** https://ngrok.com/docs
