# Bug: FormField Context Error in Behavior Tab

## Bug Description
When clicking on the "Behavior" tab in the widget configuration page (`/dashboard/configure-widget`), a runtime error is thrown: "useFormField should be used within <FormField>". The error occurs at line 449 in the page component where `FormLabel` is used outside of a `FormField` context. The application crashes and the Behavior tab content cannot be displayed.

**Expected Behavior**: The Behavior tab should display without errors, showing the placement selector, open state mode selector, and seed questions section.

**Actual Behavior**: Runtime error is thrown when the Behavior tab content is rendered, preventing the tab from being displayed.

## Problem Statement
The `FormLabel` component from shadcn/ui requires a `FormField` context (provided by `FormFieldContext`) to function properly. In the Behavior tab's "Seed Questions" section, `FormLabel` is used as a standalone heading outside of any `FormField` wrapper, causing the context to be undefined and triggering the error.

## Solution Statement
Replace the standalone `FormLabel` component (line 449) with a regular HTML label or heading element, since it's being used as a section header rather than a form field label. The `FormLabel` component should only be used within `FormField` components where it's connected to a specific form input.

## Steps to Reproduce
1. Navigate to `/dashboard/configure-widget`
2. Click on the "Behavior" tab
3. Observe the runtime error: "useFormField should be used within <FormField>"
4. Application crashes and tab content is not displayed

## Root Cause Analysis

**Location**: `app/dashboard/configure-widget/page.tsx` lines 447-453

**Code**:
```tsx
<div className="flex items-center justify-between">
  <div>
    <FormLabel>Seed Questions</FormLabel>  // ❌ Line 449 - FormLabel used outside FormField
    <p className="text-sm text-gray-600 mt-1">
      Pre-written questions to help users get started (max 5)
    </p>
  </div>
  ...
</div>
```

**Problem**:
- `FormLabel` internally calls `useFormField()` hook (line 93 in `components/ui/form.tsx`)
- `useFormField()` expects to be within a `FormFieldContext` provider
- The "Seed Questions" label is a section header, not a form field label
- It's used outside any `FormField` wrapper, so `fieldContext` is `null`
- This triggers the error on line 48: `throw new Error("useFormField should be used within <FormField>")`

**Why It Works in Other Tabs**:
- Basics tab: All `FormLabel` uses are within `FormField` components
- Appearance tab: All `FormLabel` uses are within `FormField` components
- Behavior tab: Placement and Open State Mode use `FormLabel` correctly within `FormField`, but the "Seed Questions" section header does not

## Relevant Files
Use these files to fix the bug:

- `app/dashboard/configure-widget/page.tsx` - Contains the buggy code
  - Line 449: `FormLabel` used outside `FormField` context
  - Need to replace with regular label or heading element
  - This is the only file that needs modification

## Step by Step Tasks

### Step 1: Replace Standalone FormLabel with Label Element
- Open `app/dashboard/configure-widget/page.tsx`
- Locate line 449 where `FormLabel` is used for "Seed Questions"
- Replace `FormLabel` with regular `Label` component (imported from `@/components/ui/label`)
- This label is a section header, not connected to a form field, so it doesn't need FormField context
- Preserve the existing text content and className

### Step 2: Verify Fix Locally
- Save the file
- Navigate to `/dashboard/configure-widget` in browser
- Click on "Behavior" tab
- Verify tab content displays without errors
- Verify "Seed Questions" section header appears correctly
- Verify seed question inputs still work (add, edit, remove)

### Step 3: Test All Tabs
- Test "Basics" tab - verify no regressions
- Test "Appearance" tab - verify no regressions
- Test "Behavior" tab - verify bug is fixed
- Test form submission - verify still works
- Test form reset - verify still works
- Test live preview - verify still updates correctly

### Step 4: Run Validation Commands
- Build the application to check for TypeScript errors
- Start dev server and manually test all functionality
- Verify zero console errors
- Verify zero regressions in existing functionality

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

```bash
# 1. Build to check for TypeScript errors
bun run build

# 2. Start dev server
bun dev

# 3. Manual Testing in Browser (http://localhost:3000)

## Reproduce Original Bug (should now be fixed)
- [ ] Navigate to /dashboard/configure-widget
- [ ] Click "Behavior" tab
- [ ] Verify NO error is thrown
- [ ] Verify tab content displays correctly
- [ ] Verify "Seed Questions" section header appears

## Test Seed Questions Functionality
- [ ] Click "Add Question" button
- [ ] Verify new textarea appears
- [ ] Type a question in textarea
- [ ] Verify character count updates (0/60)
- [ ] Click X button to remove question
- [ ] Verify question is removed
- [ ] Add 5 questions (max limit)
- [ ] Verify "Add Question" button becomes disabled

## Test Other Tabs (No Regressions)
- [ ] Click "Basics" tab
- [ ] Verify tab displays correctly
- [ ] Enter widget name
- [ ] Select widget type
- [ ] Verify no errors

- [ ] Click "Appearance" tab
- [ ] Verify tab displays correctly
- [ ] Change primary color
- [ ] Adjust width slider
- [ ] Adjust height slider
- [ ] Verify no errors

- [ ] Click "Behavior" tab again
- [ ] Select different placement options
- [ ] Select different open state modes
- [ ] Verify no errors

## Test Live Preview
- [ ] Make changes in any tab
- [ ] Verify preview panel updates in real-time
- [ ] Verify widget appearance reflects configuration
- [ ] Verify no preview errors

## Test Form Actions
- [ ] Fill out form with valid data
- [ ] Click "Save Draft" button
- [ ] Verify loading state appears
- [ ] Verify success toast appears
- [ ] Click "Reset to Defaults"
- [ ] Confirm reset in dialog
- [ ] Verify form resets to default values

## Check Browser Console
- [ ] Open DevTools console (F12)
- [ ] Verify ZERO errors
- [ ] Verify ZERO warnings related to app code
- [ ] Verify no FormField context errors
```

## Notes

### Why This Bug Occurred
The `FormLabel` component is designed to be used exclusively within `FormField` components, where it automatically connects to the form field's context for error state, ID association, and accessibility. Using it as a standalone label/heading breaks this contract.

### Correct Usage Pattern

**❌ Incorrect** (Causes Error):
```tsx
<div>
  <FormLabel>Section Header</FormLabel>  // Not within FormField
  <p>Description text</p>
</div>
```

**✅ Correct** (For Section Headers):
```tsx
<div>
  <Label>Section Header</Label>  // Use regular Label
  <p>Description text</p>
</div>
```

**✅ Correct** (For Form Fields):
```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>  // Within FormField context
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

### shadcn/ui Component Architecture
- **FormField**: Provides context via `FormFieldContext`
- **FormItem**: Provides item context via `FormItemContext`
- **FormLabel**: Consumes both contexts via `useFormField()` hook
- **FormControl**: Wraps the actual input element
- **FormMessage**: Displays validation errors

All form-related components (FormLabel, FormControl, FormDescription, FormMessage) require the contexts provided by FormField and FormItem to function properly.

### Alternative Solutions Considered

1. **Wrap in FormField** (Not Ideal):
   - Could wrap "Seed Questions" header in a FormField
   - Would need to create a dummy form field
   - Overcomplicated for a simple heading
   - Not semantically correct

2. **Use Regular Label** (Chosen Solution):
   - Simple, direct fix
   - Semantically appropriate for section header
   - No form field context needed
   - Maintains visual consistency
   - Zero side effects

3. **Use Heading Element** (Alternative):
   - Could use `<h3>` or `<h4>`
   - More semantic for section header
   - Would need to match existing label styling
   - Label component is simpler and matches existing design

### Verification
After the fix, the component hierarchy in the Behavior tab will be:
```
TabsContent (Behavior)
  └─ FormField (placement)
  └─ FormField (openStateMode)
  └─ div (seed questions section)
      └─ Label (section header) ✅ No FormField needed
      └─ FormField[] (individual questions)
```

This maintains the correct context hierarchy and prevents the error.
