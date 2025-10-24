# Bug: Demo Page Sign-Up Should Stay on Same Page

## Bug Description
When users click "Create Account & Save" on the preview demo page (`/preview/demo`), they are redirected to `/sign-up` which results in leaving the demo page. The sign-up should happen inline on the demo page using Clerk's modal UI, preserving the demo context while the user completes sign-up.

**Current Behavior:**
- User clicks "Create Account & Save" button on `/preview/demo`
- User is redirected to `/sign-up` page (different page)
- Demo context and preview widget are no longer visible
- User loses visual context of what they're signing up for

**Expected Behavior:**
- User clicks "Create Account & Save" button on demo page
- Clerk sign-up modal opens **on the same page** (overlay)
- Demo content remains visible in background
- After successful sign-up, modal closes
- Preview configuration is automatically converted to user's Convex account
- User stays on demo page or is redirected to dashboard

## Problem Statement
The "Create Account & Save" button uses a `<Link>` component that navigates away from the demo page. This breaks the user experience by removing the visual context of the widget they just configured. The solution needs to open Clerk's sign-up modal inline without navigation, then handle the preview-to-user configuration conversion after authentication completes.

## Solution Statement
1. **Replace Link with SignUpButton**: Use Clerk's `<SignUpButton>` component instead of `<Link>` to open sign-up modal inline
2. **Configure Redirect URL**: Set `redirectUrl` to `/dashboard` to navigate after successful sign-up
3. **Verify Conversion Hook**: Ensure `usePreviewConversion` hook automatically converts preview config after sign-up
4. **Preserve Widget Configuration**: Store widget settings in preview config and transfer to user config on conversion
5. **Update Schema if Needed**: Verify `gistConfigurations` table can store widget configuration data

## Steps to Reproduce
1. Navigate to `/preview` (unauthenticated)
2. Enter any API key (e.g., "test-key") and proceed
3. Select a widget type (e.g., "floating")
4. Configure widget appearance (colors: gradient blue to purple, placement: bottom-right, width: 400px)
5. Navigate to `/preview/demo` to see widget in action
6. Click "Create Account & Save" button
7. **Observe**: Page navigates to `/sign-up` (loses demo context)
8. **Expected**: Sign-up modal should open on same page

## Root Cause Analysis

### Primary Issue: Direct Link Navigation
`app/preview/demo/page.tsx:81-86` uses `<Link href="/sign-up">` which causes full page navigation:
```tsx
<Link href="/sign-up" className="flex-1">
  <Button size="lg" className="w-full">
    <Sparkles className="mr-2 h-5 w-5" />
    Create Account & Save
  </Button>
</Link>
```

This pattern doesn't work with Clerk's modal-based authentication system used elsewhere in the app (`components/Header.tsx` uses `<SignInButton>` and `<SignUpButton>`).

### Secondary Issue: Schema Mismatch for Widget Configuration
The `previewConfigurations` table stores:
- `widgetType`: "floating" | "rufus" | "womensWorld"
- `configuration`: Object with colors, dimensions, placement, text customization

The `gistConfigurations` table stores:
- `publicationName`, `category`, `ingestionMethod`, `rssFeeds`, etc.

**Problem**: Widget configuration data from preview is NOT transferred during conversion because the schemas serve different purposes:
- Preview: Widget appearance/behavior
- Gist Config: Content ingestion settings

**Solution Options**:
1. Add widget config fields to `gistConfigurations` schema
2. Create separate `widgetConfigurations` table
3. Accept that preview config is demonstration-only (Phase 1 approach)

For this bug fix, we'll use **Option 3** (Phase 1) to keep changes minimal. Widget configuration transfer can be a separate feature enhancement.

### Tertiary Issue: Conversion Hook Integration
The `usePreviewConversion` hook in `app/ConvexClientProvider.tsx:11-14` correctly runs after authentication. It:
1. Checks if user is signed in
2. Reads preview session ID from localStorage
3. Calls `convertPreviewToUserConfig` mutation
4. Cleans up localStorage

This should work correctly once sign-up completes, but needs redirect to dashboard added.

## Relevant Files

### Files to Fix

- **`app/preview/demo/page.tsx`** (Lines 1-137)
  - Import `SignUpButton` from `@clerk/nextjs`
  - Replace `<Link href="/sign-up">` with `<SignUpButton mode="modal" redirectUrl="/dashboard">`
  - Keep `<Button>` as child component for consistent styling
  - Ensure localStorage `gist_preview_session_id` persists through sign-up

### Files to Verify

- **`lib/hooks/usePreviewConversion.ts`** (Lines 1-47)
  - Verify hook runs after sign-up completes
  - Confirm localStorage cleanup happens after conversion
  - Ensure error handling works correctly

- **`convex/previewConfigurations.ts`** (Lines 155-221)
  - Verify `convertPreviewToUserConfig` creates new configuration
  - Confirm preview config is deleted after conversion
  - Check that conversion doesn't override existing user configs

- **`convex/schema.ts`** (Lines 95-157)
  - Review `gistConfigurations` schema
  - Confirm it doesn't need widget config fields for Phase 1
  - Document that widget preview data is demo-only

- **`components/Header.tsx`**
  - Reference for proper `<SignUpButton>` usage pattern
  - Ensure consistency across the app

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Demo Page Sign-Up Button
- Open `app/preview/demo/page.tsx`
- Add import: `import { SignUpButton } from "@clerk/nextjs"`
- Locate the "Create Account & Save" button (lines 81-86)
- Replace the `<Link>` wrapper with `<SignUpButton mode="modal" redirectUrl="/dashboard">`
- Keep the `<Button>` component as a child for consistent styling
- Remove the now-unused `Link` import from `next/link`
- Test that clicking opens Clerk modal instead of navigating

### Step 2: Verify Conversion Hook Works
- Review `lib/hooks/usePreviewConversion.ts`
- Confirm hook reads `gist_preview_session_id` from localStorage
- Verify it only runs when user is authenticated (`isSignedIn && isLoaded`)
- Ensure localStorage is cleaned up after conversion attempt
- Add console.log for debugging if needed

### Step 3: Test Conversion Mutation
- Review `convex/previewConfigurations.ts` mutation `convertPreviewToUserConfig`
- Verify it creates a **new** `gistConfigurations` entry (doesn't update existing)
- Confirm it properly deletes the `previewConfigurations` entry
- Check that `previewToUserMapping` tracks conversion correctly
- Ensure mutation handles missing preview gracefully

### Step 4: Add Dashboard Success Message (Optional Enhancement)
- Consider adding a toast/alert on dashboard after successful conversion
- This helps user understand their preview was saved
- Can be deferred to future enhancement

### Step 5: Manual Testing
- Clear browser localStorage and cookies
- Navigate to `/preview` and complete full flow
- Configure widget with specific settings
- On demo page, click "Create Account & Save"
- Verify Clerk modal opens (doesn't navigate away)
- Complete sign-up with test email
- Verify conversion happens automatically
- Check dashboard for new configuration entry
- Verify preview session is cleaned up

### Step 6: Run Validation Commands
- Execute all validation commands below
- Fix any TypeScript errors
- Verify build succeeds
- Test complete flow end-to-end

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background, keep running)
- `bun dev` - Start the Next.js dev server (test in browser)

### Manual Testing Checklist

**Test 1: New User Sign-Up with Preview**
1. Clear browser state (localStorage + cookies)
2. Navigate to `/preview`
3. Enter API key: "test-key-123"
4. Select widget type: "floating"
5. Configure: Gradient (blue to purple), width 400px, placement bottom-right
6. Navigate to `/preview/demo`
7. Click "Create Account & Save"
8. ✅ **Verify**: Clerk sign-up modal opens on same page (doesn't navigate)
9. ✅ **Verify**: Demo content visible in background
10. Complete sign-up with test email
11. ✅ **Verify**: Modal closes
12. ✅ **Verify**: Redirected to `/dashboard`
13. Open Convex Dashboard → Data → `gistConfigurations`
14. ✅ **Verify**: New configuration entry for user
15. Check `previewConfigurations` table
16. ✅ **Verify**: Preview entry deleted
17. Check browser localStorage
18. ✅ **Verify**: `gist_preview_session_id` removed

**Test 2: Existing User with Preview**
1. Sign out from previous test
2. Clear localStorage (keep cookies)
3. Navigate to `/preview`
4. Create new preview configuration with different settings
5. Navigate to `/preview/demo`
6. Click "Create Account & Save"
7. ✅ **Verify**: Clerk modal opens (shows sign in option)
8. Sign in with existing account from Test 1
9. ✅ **Verify**: Redirected to dashboard
10. Check Convex `gistConfigurations` table
11. ✅ **Verify**: Original config from Test 1 still exists
12. ✅ **Verify**: New config added (2 total for user)

**Test 3: Multiple Preview Conversions**
1. Repeat Test 2 process 2-3 times with different preview configs
2. ✅ **Verify**: Each conversion creates new `gistConfigurations` entry
3. ✅ **Verify**: No configurations are overwritten
4. ✅ **Verify**: User can have multiple configurations

**Test 4: Edge Cases**
1. Start preview → close browser → reopen → complete sign-up
   - ✅ **Verify**: Session persists via localStorage
2. Start preview → navigate away → return → complete sign-up
   - ✅ **Verify**: Conversion still works
3. Start preview → let it sit 25 hours (expires) → sign up
   - ✅ **Verify**: Conversion fails gracefully (preview expired)

## Notes

### Clerk SignUpButton Component
The `<SignUpButton>` component from `@clerk/nextjs` accepts these props:
- `mode="modal"` - Opens sign-up in modal overlay (recommended)
- `redirectUrl="/dashboard"` - Where to redirect after sign-up completes
- `children` - Custom button component (we'll use our `<Button>`)

**Example Usage**:
```tsx
<SignUpButton mode="modal" redirectUrl="/dashboard">
  <Button size="lg" className="w-full">
    <Sparkles className="mr-2 h-5 w-5" />
    Create Account & Save
  </Button>
</SignUpButton>
```

### Widget Configuration Transfer (Future Enhancement)
The preview configuration stores widget appearance settings that are NOT transferred to `gistConfigurations` during conversion. This is acceptable for Phase 1 because:
1. Preview is primarily for demonstration
2. `gistConfigurations` is for content ingestion settings (RSS feeds, WordPress, etc.)
3. Widget settings can be configured again in the dashboard

**Future Enhancement**: Create `widgetConfigurations` table to store widget appearance per user and link to `gistConfigurations`.

### Session Persistence
The preview session ID stored in `localStorage` (`gist_preview_session_id`) persists across:
- Page refreshes
- Navigation
- Clerk sign-up modal opening/closing
- Browser close/reopen (until cleared)

This ensures the conversion can happen even if user takes time to complete sign-up.

### Conversion Timing
The `usePreviewConversion` hook runs inside `ConvexClientProvider` which wraps the entire app. This ensures:
1. It runs on every page after authentication
2. It has access to Convex client for mutations
3. It only runs once per authentication session
4. It cleans up localStorage after conversion

### No Schema Changes Required
The `gistConfigurations` schema does NOT need modification for this bug fix. The minimal configuration created during conversion is acceptable:
```typescript
{
  userId: identity.subject,
  publicationName: "My Publication",
  category: "Uncategorized",
  ingestionMethod: "rss",
  termsAccepted: false,
  createdAt: now,
  updatedAt: now,
}
```

User can fill in proper details from the dashboard.

### Testing with Convex Dashboard
Monitor these tables during testing:
1. **previewConfigurations** - Should show entry before sign-up, disappear after
2. **gistConfigurations** - Should show new entry after conversion
3. **previewToUserMapping** - Should track successful conversions
4. **users** - Should show new user after sign-up

### Rollback Plan
If issues arise, the change is minimal and easily reversible:
1. Revert `app/preview/demo/page.tsx` to use `<Link href="/sign-up">`
2. No database changes required (mutation is idempotent)
3. No schema migrations needed
