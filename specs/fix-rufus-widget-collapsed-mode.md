# Bug: Rufus Widget Starts Expanded and Cannot Show Collapsed Mode in Preview

## Bug Description
In the live preview for the preview flow (`/preview/demo`), the Rufus widget starts in expanded mode and never shows the collapsed mode. The widget should respect its `defaultExpanded` prop and allow toggling between collapsed and expanded states, but it's being forced to always show in expanded mode.

**Symptoms:**
- Widget always renders in expanded state
- Collapsed mode (compact horizontal button with seed questions) never displays
- Widget behavior doesn't match the component's design (two-state system)

**Expected Behavior:**
- Widget should start in collapsed mode by default (compact horizontal button)
- Clicking the button or seed questions should expand the widget
- Clicking the X button should collapse the widget back to compact mode

**Actual Behavior:**
- Widget always starts and remains in expanded state
- No way to see or test the collapsed mode in the preview flow

## Problem Statement
The `PreviewWidgetRenderer` component is passing `isExpanded={true}` as a hardcoded prop to the `RufusWidget` component, which overrides the widget's internal state management and forces it to always be expanded. This prevents users from seeing the collapsed state during preview and testing.

## Solution Statement
Remove the hardcoded `isExpanded={true}` prop from `PreviewWidgetRenderer` and allow the `RufusWidget` to use its own internal state management. The widget should start in collapsed mode by default (matching its `defaultExpanded = false` default) and allow users to expand/collapse it naturally during the preview.

Optionally, respect the `configuration.openByDefault` setting to control the initial state if desired.

## Steps to Reproduce
1. Start the development servers:
   ```bash
   npx convex dev  # Terminal 1
   bun dev         # Terminal 2
   ```
2. Navigate to `/preview` or `/preview/select-widget`
3. Select "Rufus - Shopping Assistant" widget
4. Configure the widget on `/preview/configure` (any settings)
5. Click "Preview Widget" to go to `/preview/demo`
6. **Observe**: Widget is already expanded (full chat interface visible)
7. **Observe**: No collapsed mode (compact horizontal button) is ever shown
8. Click the X button to try to close the widget
9. **Observe**: Nothing happens - widget remains expanded

## Root Cause Analysis
**File**: `components/PreviewWidgetRenderer.tsx` (lines 128-156)

**Root Cause**: The `PreviewWidgetRenderer` component hardcodes `isExpanded={true}` when rendering the Rufus widget:

```typescript
// Rufus Widget (bottom-center, responsive to container)
if (widgetType === "rufus") {
  return (
    <div className={cn(positionClasses, "flex items-end justify-center", className)}>
      <RufusWidget
        isExpanded={true}  // <- HARDCODED EXPANDED STATE
        onExpandChange={() => {}}  // <- EMPTY HANDLER - NO STATE MANAGEMENT
        customColors={{ ... }}
        customGradient={{ ... }}
        customDimensions={{ ... }}
      />
    </div>
  );
}
```

**Why This Breaks**:
1. The `RufusWidget` component uses a controlled/uncontrolled pattern with `isExpanded` prop
2. When `isExpanded` is provided (controlled mode), it takes precedence over internal state
3. `isExpanded={true}` forces the widget to always render in expanded mode
4. `onExpandChange={() => {}}` is an empty handler that doesn't update any state
5. The widget's internal collapse/expand functionality is completely bypassed

**Contrast with NYT Chat Widget**:
The NYT Chat Widget in the same file doesn't receive any state-controlling props and works correctly because it manages its own internal state.

## Relevant Files
Use these files to fix the bug:

- **`components/PreviewWidgetRenderer.tsx`** (PRIMARY FIX)
  - Contains the hardcoded `isExpanded={true}` prop that forces Rufus widget to be expanded
  - Line 136: Remove `isExpanded={true}` prop
  - Line 137: Remove `onExpandChange={() => {}}` prop or implement proper state management
  - Optional: Use `configuration.openByDefault` to set `defaultExpanded` prop if desired

- **`components/widget_components/complete/rufus-widget.tsx`** (REFERENCE ONLY - NO CHANGES NEEDED)
  - Contains the `RufusWidget` component implementation
  - Shows the correct controlled/uncontrolled pattern: `const isExpanded = controlledIsExpanded ?? internalExpanded;`
  - Demonstrates proper state management with `useState(defaultExpanded)`
  - Already has correct expand/collapse handlers (`handleExpand`, `handleClose`)
  - No changes needed - widget logic is correct

- **`app/preview/demo/page.tsx`** (REFERENCE ONLY - NO CHANGES NEEDED)
  - Renders `PreviewWidgetRenderer` with configuration data
  - No changes needed - just passes configuration through

## Step by Step Tasks

### 1. Remove Hardcoded Expanded State from RufusWidget in PreviewWidgetRenderer
- Open `components/PreviewWidgetRenderer.tsx`
- Locate the Rufus widget rendering block (lines 128-156)
- Remove the `isExpanded={true}` prop
- Remove the `onExpandChange={() => {}}` prop
- Optionally add `defaultExpanded={configuration.openByDefault ?? false}` to respect configuration

**Before:**
```typescript
<RufusWidget
  isExpanded={true}
  onExpandChange={() => {}}
  customColors={{ ... }}
  customGradient={{ ... }}
  customDimensions={{ ... }}
/>
```

**After:**
```typescript
<RufusWidget
  defaultExpanded={configuration.openByDefault ?? false}
  customColors={{ ... }}
  customGradient={{ ... }}
  customDimensions={{ ... }}
/>
```

### 2. Test Collapsed Mode Displays Correctly
- Start development servers (`npx convex dev`, `bun dev`)
- Navigate to `/preview/demo` with a Rufus widget configuration
- Verify widget starts in collapsed mode (compact horizontal button with seed questions)
- Verify "Ask Rufus" button is visible
- Verify 3 seed questions are visible in collapsed mode
- Verify "Ask something else" CTA button is visible

### 3. Test Expand Functionality
- Click the "Ask Rufus" button
- Verify widget expands to full chat interface
- Click a seed question pill in collapsed mode
- Verify widget expands and pre-populates the question
- Click "Ask something else" button
- Verify widget expands to full chat interface

### 4. Test Collapse Functionality
- With widget in expanded mode, click the X button (top right)
- Verify widget collapses back to compact mode
- Verify all collapsed elements are visible again
- Test expand/collapse cycle multiple times

### 5. Test OpenByDefault Configuration
- Go to `/preview/configure`
- Toggle "Open by Default" setting (if available in configuration UI)
- Preview the widget
- Verify widget respects the `openByDefault` configuration setting
- Test with `openByDefault: true` → widget should start expanded
- Test with `openByDefault: false` → widget should start collapsed

### 6. Run Validation Commands
Execute validation commands to ensure no regressions:
- Run `bun run build` to validate TypeScript compilation
- Run development servers and test all widget states
- Verify no console errors during expand/collapse transitions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and reproduce the bug to verify it's fixed
- **Manual Testing Steps**:
  1. Navigate to `/preview` → select Rufus widget → configure → preview
  2. Verify widget starts in collapsed mode (compact button visible)
  3. Click "Ask Rufus" button → verify widget expands
  4. Click X button → verify widget collapses
  5. Click a seed question in collapsed mode → verify widget expands with question pre-populated
  6. Test expand/collapse cycle 5+ times → verify no state issues
  7. Check browser console → verify no errors
  8. Test with different color/dimension configurations → verify expand/collapse works in all cases

## Notes
- **No changes needed to RufusWidget component** - the widget's internal state management is already correctly implemented
- **Minimal fix** - only remove 2 lines (or modify them to add `defaultExpanded` prop)
- **Pattern consistency** - this fix makes Rufus widget work like the NYT Chat Widget (which also manages its own state)
- **Configuration respect** - optionally using `configuration.openByDefault` allows admin/preview users to control initial state
- **No breaking changes** - the `defaultExpanded` prop already exists in `RufusWidget` with a default value of `false`
- **Testing focus** - primary validation is manual testing of expand/collapse functionality in `/preview/demo`
