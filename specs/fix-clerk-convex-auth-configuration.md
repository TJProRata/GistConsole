# Bug: Clerk-Convex Authentication Not Working - User Not Authenticated Error

## Bug Description
Users are unable to save configurations in the dashboard even after signing in with Clerk. The Convex mutation `gistConfigurations:saveConfiguration` throws an "Uncaught Error: User not authenticated" error, causing `ctx.auth.getUserIdentity()` to return `null` despite the user being authenticated via Clerk.

**Symptoms:**
- User successfully signs in via Clerk (UI shows signed-in state with UserButton)
- When submitting the dashboard form, Convex mutation fails
- Error in Convex logs: `[CONVEX M(gistConfigurations:saveConfiguration)] Uncaught Error: User not authenticated at handler (../convex/gistConfigurations.ts:69:21)`
- Error persists even after signing out and signing back in

**Expected Behavior:**
- User signs in via Clerk
- Clerk JWT token is validated by Convex backend
- `ctx.auth.getUserIdentity()` returns user identity
- Mutations execute successfully

**Actual Behavior:**
- User signs in via Clerk (frontend shows authenticated)
- Convex backend fails to validate JWT token
- `ctx.auth.getUserIdentity()` returns `null`
- All authenticated mutations fail with "User not authenticated"

## Problem Statement
The Convex authentication configuration (`convex/auth.config.ts`) is using a **hardcoded domain string** instead of an environment variable. According to Convex documentation, the auth config should use `process.env.CLERK_JWT_ISSUER_DOMAIN` to properly validate Clerk JWT tokens.

**Current (Incorrect) Configuration:**
```typescript
export default {
  providers: [
    {
      domain: "https://calm-turkey-7.clerk.accounts.dev", // ❌ Hardcoded
      applicationID: "convex",
    },
  ],
};
```

**Critical Issues:**
1. **No environment variable for JWT issuer domain** - `.env.local` is missing `CLERK_JWT_ISSUER_DOMAIN`
2. **Hardcoded domain prevents environment-specific configuration** - Can't switch between dev/staging/production
3. **JWT validation may be failing** - Convex can't validate Clerk's JWT tokens without proper issuer domain configuration
4. **Missing JWT template verification** - Need to confirm "convex" JWT template exists in Clerk Dashboard

## Solution Statement
Fix the Clerk-Convex authentication integration by:

1. **Add JWT issuer domain to environment variables** - Add `CLERK_JWT_ISSUER_DOMAIN` to `.env.local`
2. **Update `convex/auth.config.ts`** - Use `process.env.CLERK_JWT_ISSUER_DOMAIN` instead of hardcoded domain
3. **Verify Clerk JWT template** - Ensure "convex" JWT template exists in Clerk Dashboard
4. **Redeploy Convex backend** - Run `npx convex dev` to sync new auth configuration
5. **Test authentication flow** - Verify users can save configurations after fix

This follows the official Convex-Clerk integration pattern documented at https://docs.convex.dev/auth/clerk

## Steps to Reproduce

1. **Start the application:**
   ```bash
   npx convex dev  # Terminal 1
   bun dev         # Terminal 2
   ```

2. **Sign in via Clerk:**
   - Navigate to http://localhost:3000
   - Click "Sign In" button
   - Authenticate with Clerk (email/password or social login)
   - Verify UserButton appears in header (user is signed in on frontend)

3. **Attempt to save configuration:**
   - Navigate to http://localhost:3000/dashboard
   - Fill out the onboarding form:
     - Publication Name: "Test Publication"
     - Category: Select any category
     - Ingestion Method: "wordpress" or "rss"
     - WordPress URL or RSS URL
     - Accept terms and conditions
   - Click "Submit" button

4. **Observe the error:**
   - Check Convex dev terminal output
   - See error: `[CONVEX M(gistConfigurations:saveConfiguration)] Uncaught Error: User not authenticated`
   - Form submission fails
   - No configuration saved to database

5. **Verify authentication state:**
   - User is signed in (frontend shows UserButton)
   - But backend rejects as "not authenticated"
   - Issue persists across sign-out/sign-in cycles

## Root Cause Analysis

**Primary Root Cause: Incorrect Auth Configuration**

The `convex/auth.config.ts` file uses a **hardcoded domain** instead of an environment variable:

```typescript
// Current (WRONG)
export default {
  providers: [
    {
      domain: "https://calm-turkey-7.clerk.accounts.dev", // ❌ Hardcoded
      applicationID: "convex",
    },
  ],
};
```

**Why This Causes Authentication Failure:**

1. **JWT Token Validation Flow:**
   - User signs in → Clerk issues JWT token with issuer `https://calm-turkey-7.clerk.accounts.dev`
   - Frontend passes JWT to Convex via `ConvexProviderWithClerk`
   - Convex backend reads `auth.config.ts` to validate JWT
   - Convex checks if JWT issuer matches configured domain
   - **If domain is incorrect or not loaded from env, validation fails**
   - `ctx.auth.getUserIdentity()` returns `null`

2. **Environment Variable Not Being Used:**
   - Convex auth config should use `process.env.CLERK_JWT_ISSUER_DOMAIN`
   - This allows proper environment-specific configuration
   - Current hardcoded value may not match actual Clerk issuer domain
   - No flexibility for dev/staging/production environments

3. **Missing Environment Variable:**
   - `.env.local` does not contain `CLERK_JWT_ISSUER_DOMAIN`
   - Even though domain is correct in `CLERK_DOMAIN`, it's not being used by Convex
   - Convex needs explicit `CLERK_JWT_ISSUER_DOMAIN` environment variable

4. **Potential JWT Template Issue:**
   - Clerk requires a JWT template named exactly "convex"
   - If this template doesn't exist or is misconfigured, tokens won't be valid
   - Need to verify this in Clerk Dashboard

**Official Convex Documentation Pattern:**

From https://docs.convex.dev/auth/clerk:

```typescript
// CORRECT pattern from docs
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN, // ✅ Use env var
      applicationID: "convex",
    },
  ]
};
```

**Why This Matters:**
- Environment variables allow Convex to read configuration at runtime
- Hardcoded values are baked in at build time and may not match deployment
- Proper env var usage ensures JWT validation works correctly
- Allows different configurations for dev/staging/production

## Relevant Files

### Existing Files to Modify

- **`convex/auth.config.ts`** (lines 1-8)
  - Current: Uses hardcoded domain `"https://calm-turkey-7.clerk.accounts.dev"`
  - Fix: Change to `process.env.CLERK_JWT_ISSUER_DOMAIN`
  - Reason: Core auth configuration file that Convex uses to validate Clerk JWTs

- **`.env.local`** (environment variables)
  - Current: Missing `CLERK_JWT_ISSUER_DOMAIN` variable
  - Fix: Add `CLERK_JWT_ISSUER_DOMAIN=https://calm-turkey-7.clerk.accounts.dev`
  - Reason: Convex needs this env var to validate JWT tokens from Clerk

- **`README.md`** (lines 20-40, environment setup section)
  - Current: Doesn't mention `CLERK_JWT_ISSUER_DOMAIN` requirement
  - Fix: Add `CLERK_JWT_ISSUER_DOMAIN` to required environment variables
  - Reason: Document this critical requirement for future developers

### New Files
None - this is a configuration fix only.

## Step by Step Tasks

### Step 1: Add CLERK_JWT_ISSUER_DOMAIN to Environment Variables
- Open `.env.local` file
- Add the following line after the existing Clerk variables:
  ```bash
  CLERK_JWT_ISSUER_DOMAIN=https://calm-turkey-7.clerk.accounts.dev
  ```
- **Important**: The domain should match your Clerk Frontend API URL (found in Clerk Dashboard → API Keys)
- This is the same value as `CLERK_DOMAIN` but Convex specifically looks for `CLERK_JWT_ISSUER_DOMAIN`
- Save the file

### Step 2: Update convex/auth.config.ts to Use Environment Variable
- Open `convex/auth.config.ts`
- Replace the hardcoded domain with environment variable:
  ```typescript
  export default {
    providers: [
      {
        domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
        applicationID: "convex",
      },
    ],
  };
  ```
- This follows the official Convex documentation pattern
- Allows proper JWT token validation from Clerk
- Save the file

### Step 3: Update README.md Documentation
- Open `README.md`
- Locate the "Environment Variables" section (around line 20-40)
- Add `CLERK_JWT_ISSUER_DOMAIN` to the required Clerk variables:
  ```markdown
  ### Required (Clerk)

  These must be manually added to `.env.local`:

  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key (starts with `pk_test_` or `pk_live_`)
  - `CLERK_SECRET_KEY`: Clerk secret key (starts with `sk_test_` or `sk_live_`)
  - `CLERK_DOMAIN`: Your Clerk domain (e.g., `https://your-app.clerk.accounts.dev`)
  - `CLERK_JWT_ISSUER_DOMAIN`: Your Clerk JWT issuer domain (same as CLERK_DOMAIN) - **Required for Convex authentication**
  ```
- Add explanation of why this is needed:
  ```markdown
  **Note**: `CLERK_JWT_ISSUER_DOMAIN` is required for Convex to validate Clerk JWT tokens. It should match your Clerk Frontend API URL found in Clerk Dashboard → API Keys.
  ```
- Save the file

### Step 4: Redeploy Convex Backend with New Configuration
- Stop the existing Convex dev server if running (Ctrl+C in terminal)
- Run `npx convex dev` to redeploy with new auth configuration
- Wait for confirmation: "✔ Convex functions ready!"
- Verify the deployment includes the auth config changes
- Keep this terminal running for testing

### Step 5: Restart Next.js Dev Server
- Stop the Next.js dev server if running (Ctrl+C in terminal)
- Run `bun dev` to restart with new environment variables
- Wait for server to start: "✓ Ready"
- Next.js will now pass the correct JWT issuer domain to Convex

### Step 6: Verify Clerk JWT Template (Critical)
- Log into Clerk Dashboard: https://dashboard.clerk.com
- Navigate to: Configure → JWT Templates
- **Verify a template named exactly "convex" exists**
- If it doesn't exist:
  - Click "New template"
  - Name it exactly "convex" (do not rename)
  - Use default claims or add custom claims as needed
  - Save the template
- Copy the Issuer URL and verify it matches `CLERK_JWT_ISSUER_DOMAIN` in `.env.local`
- This template is required for Convex to validate tokens

### Step 7: Test Authentication Flow End-to-End
- Navigate to http://localhost:3000
- If already signed in, sign out first (click UserButton → Sign Out)
- Click "Sign In" and authenticate with Clerk
- Navigate to http://localhost:3000/dashboard
- Fill out the configuration form:
  - Publication Name: "Test After Fix"
  - Category: "News"
  - Ingestion Method: "wordpress"
  - WordPress URL: "https://example.com"
  - Accept terms and conditions
- Click "Submit"
- **Expected**: Form submission succeeds
- **Expected**: No "User not authenticated" error in Convex logs
- **Expected**: Success message appears
- Check Convex dashboard → Data → gistConfigurations table to verify configuration was saved

### Step 8: Test With Browser DevTools
- Open browser DevTools (F12)
- Go to Console tab
- Sign in with Clerk
- Submit dashboard form
- Check for any authentication errors in console
- Verify Convex client successfully passes JWT token
- No errors should appear related to authentication

### Step 9: Run All Validation Commands
- Execute the validation commands listed below
- Verify zero errors in build, TypeScript compilation, and runtime
- Confirm authentication works across page reloads
- Test sign-out and sign-in cycles

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

### Before Fix - Reproduce Bug
- `npx convex dev` - Start Convex dev server
- `bun dev` - Start Next.js dev server
- Navigate to http://localhost:3000/dashboard
- Fill form and submit
- **Expected Error**: "User not authenticated" in Convex logs
- Stop both servers before applying fix

### Apply Fix
- Add `CLERK_JWT_ISSUER_DOMAIN` to `.env.local`
- Update `convex/auth.config.ts` to use `process.env.CLERK_JWT_ISSUER_DOMAIN`
- Update `README.md` documentation

### After Fix - Verify Bug is Fixed
- `bun run build` - Build Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions with new auth config (run in background, keep terminal open)
- `bun dev` - Start Next.js dev server (run in separate terminal, keep open)
- Navigate to http://localhost:3000
- Sign out if already signed in
- Click "Sign In" and authenticate with Clerk
- Navigate to http://localhost:3000/dashboard
- Fill out configuration form completely
- Click "Submit" button
- **Expected Success**: Form submits without errors
- **Expected Success**: No "User not authenticated" error in Convex logs
- **Expected Success**: Configuration saved to Convex database
- **Expected Success**: Success message appears in UI
- Check Convex dashboard → Data → gistConfigurations to verify data saved
- Sign out and sign back in to test session persistence
- Submit another configuration to test repeatability
- Check browser DevTools console for zero authentication errors

### Cross-Browser Testing (Optional but Recommended)
- Test in Chrome/Brave
- Test in Firefox
- Test in Safari
- Verify authentication works in all browsers

## Notes

### Critical Configuration Requirements

1. **Clerk JWT Template Must Exist:**
   - Template name must be exactly "convex" (case-sensitive)
   - Find in Clerk Dashboard → Configure → JWT Templates
   - If missing, authentication will fail even with correct env vars

2. **Domain Must Match Exactly:**
   - `CLERK_JWT_ISSUER_DOMAIN` must match Clerk's Issuer URL
   - Format: `https://[subdomain].clerk.accounts.dev` (development)
   - Format: `https://clerk.[your-domain].com` (production)
   - No trailing slashes

3. **Environment Variable Loading:**
   - Convex auth.config.ts reads `process.env.CLERK_JWT_ISSUER_DOMAIN` at deployment time
   - Must redeploy Convex (`npx convex dev`) after changing `.env.local`
   - Next.js must be restarted to load new env vars

4. **Why This Fix Works:**
   - Proper env var allows Convex to validate Clerk JWTs correctly
   - JWT validation compares token issuer against configured domain
   - When domains match, `ctx.auth.getUserIdentity()` returns user data
   - When domains mismatch, validation fails and returns `null`

### Security Considerations

- JWT issuer domain should match your actual Clerk deployment
- Never commit `.env.local` to version control (already in `.gitignore`)
- Use different Clerk instances for dev/staging/production
- Keep Clerk secret keys secure

### Official Documentation References

- Convex-Clerk Integration: https://docs.convex.dev/auth/clerk
- Clerk JWT Templates: https://clerk.com/docs/backend-requests/making/jwt-templates
- Convex Auth Configuration: https://docs.convex.dev/auth/config

### Alternative Solutions Considered

**Why not use hardcoded domain?**
- Hardcoded values don't work with multiple environments
- Can't switch between dev/staging/production easily
- Doesn't follow Convex official documentation pattern
- May cause subtle deployment issues

**Why not use CLERK_DOMAIN directly?**
- Convex specifically looks for `CLERK_JWT_ISSUER_DOMAIN`
- While values may be the same, explicit naming is clearer
- Follows official Convex-Clerk integration pattern
- Allows flexibility if domains ever differ

### Verification Checklist

After applying fix, verify:
- [ ] `.env.local` contains `CLERK_JWT_ISSUER_DOMAIN`
- [ ] `convex/auth.config.ts` uses `process.env.CLERK_JWT_ISSUER_DOMAIN`
- [ ] Convex dev server redeployed successfully
- [ ] Next.js dev server restarted
- [ ] User can sign in via Clerk
- [ ] User can submit dashboard form without errors
- [ ] Configuration saves to Convex database
- [ ] No "User not authenticated" errors in logs
- [ ] Clerk JWT template named "convex" exists
- [ ] Domain in env var matches Clerk Dashboard issuer URL
- [ ] README.md documents the new requirement

### Post-Fix Monitoring

Monitor for:
- Authentication errors in Convex logs
- Failed form submissions
- User reports of authentication issues
- Session expiration edge cases

If issues persist after fix:
1. Verify Clerk JWT template exists and is named "convex"
2. Check domain matches exactly (no trailing slashes, correct protocol)
3. Confirm Convex deployment includes auth config changes
4. Test with fresh browser session (clear cookies/cache)
5. Check Clerk Dashboard for service status issues
