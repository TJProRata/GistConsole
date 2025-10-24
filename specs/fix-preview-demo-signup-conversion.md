# Bug: Preview Demo Sign-Up Not Converting Configuration

## Bug Description
When users click "Create Account & Save" on the preview demo page (`/preview/demo`), they are redirected to a 404 page instead of being taken through the Clerk sign-up flow. After successful sign-up, the preview configuration should be automatically converted to a saved user configuration without overriding existing widgets they may have created.

**Current Behavior:**
- User clicks "Create Account & Save" button on `/preview/demo`
- User is redirected to a 404 page
- Preview configuration is not converted to user configuration
- Sign-up flow does not complete properly

**Expected Behavior:**
- User clicks "Create Account & Save" button
- User is redirected to Clerk's sign-up page (`/sign-up`)
- After successful sign-up, user is authenticated
- Preview configuration is automatically converted to a new gistConfiguration entry
- User is redirected to dashboard with their new configuration
- Existing user configurations remain intact (no override)

## Problem Statement
The "Create Account & Save" button on `/preview/demo` page links to `/sign-up`, but Clerk's sign-up page is not properly configured or the link is incorrect. Additionally, the preview-to-user configuration conversion flow needs to be verified and potentially fixed to ensure configurations are saved properly after sign-up without overriding existing configurations.

## Solution Statement
1. **Fix Sign-Up Link**: Ensure the "Create Account & Save" button correctly triggers Clerk's sign-up flow by using Clerk's `<SignUpButton>` component or proper redirect URL
2. **Verify Clerk Configuration**: Ensure Clerk is properly configured to handle `/sign-up` routes
3. **Verify Conversion Hook**: Ensure `usePreviewConversion` hook is properly integrated in the app layout to automatically convert preview configurations after sign-up
4. **Fix Conversion Logic**: Update `convertPreviewToUserConfig` mutation to create a new configuration entry rather than overriding existing ones
5. **Add Redirect After Sign-Up**: Configure proper redirect to dashboard after successful sign-up with preview conversion

## Steps to Reproduce
1. Navigate to `/preview` (unauthenticated)
2. Enter any API key and proceed through preview flow
3. Select a widget type (e.g., "floating")
4. Configure widget appearance (colors, placement, etc.)
5. Navigate to `/preview/demo` to see widget in action
6. Click "Create Account & Save" button
7. **Observe**: User is redirected to a 404 page instead of Clerk sign-up flow

## Root Cause Analysis

### Primary Issue: Direct Link to `/sign-up` Without Clerk Configuration
The button at `app/preview/demo/page.tsx:81-86` uses a direct `<Link>` to `/sign-up`:
```tsx
<Link href="/sign-up" className="flex-1">
  <Button size="lg" className="w-full">
    <Sparkles className="mr-2 h-5 w-5" />
    Create Account & Save
  </Button>
</Link>
```

Clerk requires either:
1. A dedicated sign-up page component using `<SignUp />` from `@clerk/nextjs`
2. Or using `<SignUpButton>` component that opens Clerk's modal UI
3. Or proper configuration of redirect URLs in Clerk Dashboard

Since the app uses Clerk's modal-based authentication (as seen in `components/Header.tsx`), there's no dedicated `/sign-up` page, causing the 404.

### Secondary Issue: Configuration Conversion Validation
The `convertPreviewToUserConfig` mutation in `convex/previewConfigurations.ts:148-214` creates a minimal configuration with default values:
```typescript
const configId = await ctx.db.insert("gistConfigurations", {
  userId: identity.subject,
  publicationName: "My Publication", // Default name
  category: "Uncategorized", // Default category
  ingestionMethod: "rss", // Default method
  termsAccepted: false, // User needs to accept terms
  createdAt: now,
  updatedAt: now,
});
```

This creates a new entry correctly (doesn't override), but doesn't transfer the preview configuration data (widgetType, configuration settings) which are stored in the `previewConfigurations` table but not mapped to `gistConfigurations` schema.

### Tertiary Issue: Preview Conversion Hook Integration
The `usePreviewConversion` hook is correctly integrated in `app/ConvexClientProvider.tsx:11-14`, so it will automatically run after sign-up. However, it needs to be triggered properly after the sign-up flow completes.

## Relevant Files

### Files to Fix
- **`app/preview/demo/page.tsx`** (Line 81-86)
  - Replace direct `/sign-up` link with Clerk's `<SignUpButton>` component or proper sign-in redirect
  - Add return URL parameter to redirect back to dashboard after sign-up
  - Ensure preview session ID persists through sign-up flow

- **`convex/previewConfigurations.ts`** (Lines 148-214)
  - Verify the conversion logic creates new configurations without overriding
  - Ensure proper cleanup of preview configuration after conversion
  - Validate that conversion tracking works correctly

- **`app/ConvexClientProvider.tsx`** (Lines 11-14)
  - Verify `PreviewConversionHandler` is properly positioned
  - Ensure hook runs after authentication completes
  - Add redirect logic to dashboard after successful conversion

### Files to Reference
- **`components/Header.tsx`**
  - Check how sign-up is triggered in other parts of the app
  - Use same pattern for consistency

- **`lib/hooks/usePreviewConversion.ts`**
  - Review conversion logic and timing
  - Ensure proper error handling

- **`proxy.ts`**
  - Verify `/sign-up` route is properly configured as public
  - Confirm Clerk can handle sign-up routes

- **`docs/authentication.md`**
  - Reference authentication flow documentation
  - Understand Clerk configuration requirements

## Step by Step Tasks

### Step 1: Fix Sign-Up Button in Demo Page
- Open `app/preview/demo/page.tsx`
- Import `SignUpButton` from `@clerk/nextjs`
- Replace the direct `<Link href="/sign-up">` with `<SignUpButton>` component
- Add `redirectUrl` prop to redirect to `/dashboard` after sign-up
- Ensure preview session ID is preserved in localStorage during sign-up
- Test that clicking button opens Clerk's sign-up modal

### Step 2: Add Dashboard Redirect After Sign-Up
- Update `app/ConvexClientProvider.tsx`
- Add `useRouter` from `next/navigation` to `PreviewConversionHandler`
- After successful conversion, redirect to `/dashboard` with success toast/message
- Add error handling for conversion failures
- Ensure redirect only happens once (use ref to track)

### Step 3: Verify Conversion Logic
- Review `convex/previewConfigurations.ts` conversion mutation
- Confirm it creates a **new** configuration entry (doesn't update existing)
- Verify conversion tracking in `previewToUserMapping` table
- Test that multiple conversions create separate configuration entries
- Ensure proper cleanup of preview configuration after conversion

### Step 4: Add Loading State During Conversion
- Update `PreviewConversionHandler` to show loading state
- Add skeleton or spinner while conversion is in progress
- Prevent multiple conversion attempts
- Display success message after conversion completes

### Step 5: Handle Edge Cases
- Test conversion when user already has configurations (should not override)
- Test conversion when preview session expires during sign-up
- Test conversion when user signs in (not signs up) with active preview
- Add error handling for all edge cases
- Log errors for debugging

### Step 6: Update Documentation
- Update `README.md` to document preview-to-signup flow
- Add troubleshooting section for conversion issues
- Document expected behavior for preview configurations

### Step 7: Run Validation Commands
- Execute all validation commands to ensure bug is fixed with zero regressions
- Manually test the complete preview-to-signup flow
- Verify configurations don't override existing ones
- Test with and without existing configurations

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and reproduce the bug to verify it's fixed

### Manual Testing Steps
1. **Clear State**: Clear browser localStorage and cookies
2. **Start Preview Flow**: Navigate to `/preview`
3. **Complete Configuration**: Go through entire preview flow (API key → widget type → configure → demo)
4. **Test Sign-Up Button**: Click "Create Account & Save" on demo page
5. **Verify Sign-Up Modal**: Confirm Clerk sign-up modal opens (not 404)
6. **Complete Sign-Up**: Create a new test account
7. **Verify Conversion**: Check that preview configuration converts to user configuration
8. **Check Dashboard**: Verify redirect to dashboard with new configuration
9. **Verify No Override**: Create another preview and sign up with existing account - verify configurations don't override
10. **Test Multiple Configs**: Verify user can have multiple configurations from multiple previews
11. **Check Database**: Open Convex dashboard and verify:
    - Preview configuration is deleted after conversion
    - New gistConfiguration entry exists for user
    - previewToUserMapping shows successful conversion
12. **Test Edge Cases**:
    - Sign up → create preview → verify conversion still works
    - Preview → close browser → reopen → sign up → verify session persists

## Notes

### Clerk Sign-Up Implementation Options
According to Clerk documentation and the existing app patterns, there are 3 ways to implement sign-up:

1. **Modal UI (Recommended for this app)**: Use `<SignUpButton>` component
   - Opens Clerk's modal UI overlay
   - Consistent with existing Header component pattern
   - No route configuration needed
   - Supports redirect URLs

2. **Dedicated Page**: Create `app/sign-up/[[...sign-up]]/page.tsx`
   - Uses `<SignUp />` component
   - Full-page sign-up experience
   - Requires route configuration

3. **Redirect**: Use `redirectToSignUp()` function
   - Programmatic redirect to Clerk's hosted pages
   - Requires return URL configuration

**Chosen Approach**: Option 1 (Modal UI) for consistency with existing app.

### Preview Configuration Data Mapping
The preview configuration stores widget-specific settings (widgetType, colors, placement, etc.) that don't directly map to the `gistConfigurations` schema. The conversion currently creates a minimal configuration. Future enhancement could:
- Add widget configuration fields to `gistConfigurations` schema
- Or create a separate `widgetConfigurations` table linked to `gistConfigurations`
- For now, the minimal configuration creation is acceptable as Phase 1

### Multiple Configurations Support
The `gistConfigurations` table already supports multiple entries per user (indexed by `userId`). The conversion mutation correctly creates a **new** entry rather than updating existing ones, so multiple preview conversions will not override each other.

### Session Persistence
The preview session ID is stored in localStorage (`gist_preview_session_id`) and persists across the sign-up flow. The `usePreviewConversion` hook reads this ID after authentication and triggers the conversion. No additional work needed here.

### Redirect After Sign-Up
Clerk's `<SignUpButton>` supports `redirectUrl` prop which will redirect to `/dashboard` after sign-up completes. The `PreviewConversionHandler` will run automatically on the dashboard page and convert the preview configuration.

### Testing Considerations
- Test with fresh browser (no existing auth sessions)
- Test with existing authenticated user creating new preview
- Test with user who already has configurations
- Verify Convex logs show successful conversion
- Monitor for any race conditions in conversion timing
