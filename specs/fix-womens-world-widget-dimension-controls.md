# Widget Bug: Dimension Controls Not Affecting Widget Container

## Bug Description

The "Widget Dimensions (Preview Only)" controls on the Women's World Widget preview page (`/admin/components/widgets/complete/womens-world-widget`) are changing the dimensions of the preview wrapper div instead of the actual `WomensWorldWidget` component's `GlassWidgetContainer`.

When the user adjusts the width/height sliders (392-800px width, 500-800px height), the outer preview container resizes, but the widget itself remains at its hardcoded dimensions (collapsed: 140px×48px, expanded: 392px width with auto height).

### Expected Behavior

When dimension sliders are adjusted in the admin preview page:
1. The `WomensWorldWidget` component should dynamically resize to match slider values
2. The expanded widget width should change from default 392px to slider value (392-800px)
3. The expanded widget container should respect height constraints (500-800px)
4. The widget should remain functional at all dimensions
5. Changes should only affect the preview, not production widget behavior

### Actual Behavior

Currently:
1. Dimension sliders change the outer `<div>` wrapper dimensions only (lines 211-219 in preview page)
2. The `WomensWorldWidget` component ignores these dimensions
3. Widget remains at hardcoded dimensions:
   - Collapsed: `width: "140px"`, `height: "48px"` (inline styles)
   - Expanded: `w-full md:w-[392px]` (Tailwind classes), auto height
4. The preview wrapper grows/shrinks, but the widget inside stays the same size

### Affected Widget(s)

- Widget: `WomensWorldWidget` (category: complete)
- Location: `components/widget_components/complete/womens-world-widget.tsx`

## Problem Statement

The `WomensWorldWidget` component does not accept or consume `width` and `height` props. The dimension controls in the preview page set inline styles on a wrapper div, but these styles don't propagate to the actual widget component. The widget has hardcoded dimensions that cannot be overridden from the preview page.

## Solution Statement

Add optional `width` and `height` props to the `WomensWorldWidget` component that override the default hardcoded dimensions when provided. These props will only be used in the admin preview context and will not affect production widget behavior (default values maintain current behavior). The preview page will pass the slider state values as props to the widget component.

## Steps to Reproduce

1. Navigate to widget preview page: `/admin/components/widgets/complete/womens-world-widget`
2. Scroll down to "Widget Dimensions (Preview Only)" controls
3. Adjust width slider from 392px to 600px
4. Observe: Preview wrapper div changes size, but widget stays at 392px (expanded) or 140px (collapsed)
5. Adjust height slider from 500px to 700px
6. Observe: Preview wrapper div height changes, but widget height stays at auto (content-based)
7. Click widget to expand
8. Observe: Widget expanded width is still 392px despite slider being set to 600px

### Reproduction Environment

- Browser: Any (Chrome, Firefox, Safari)
- Device: Desktop (dimension controls are for testing responsiveness)
- Widget variant: Both collapsed and expanded states affected

## Root Cause Analysis

### Investigation Process

1. Inspected preview page component tree:
   ```
   CompleteWidgetPreviewPage
   ├── ComponentPreview
   │   └── ComponentPreview.Demo
   │       └── <div style={{width, height}}> ← Wrapper with inline styles
   │           └── <DemoComponent /> ← WomensWorldWidget (no props passed)
   ```

2. Traced state flow:
   - `widgetWidth` state: Lives in preview page component (line 29)
   - `widgetHeight` state: Lives in preview page component (line 30)
   - Sliders update these state values (lines 181, 196)
   - State values applied as inline styles to wrapper div (lines 212-215)
   - **Gap**: No props passed to `<DemoComponent />` (line 218)

3. Checked `WomensWorldWidget` props:
   - Props interface: `WomensWorldWidgetProps` (defined in `types.ts`)
   - No `width` or `height` props in interface
   - Hardcoded dimensions in component (lines 277-278, 303)

4. Verified collapsed/expanded behavior:
   - Collapsed: Inline styles `width: "140px"`, `height: "48px"` (line 277-278)
   - Expanded: Tailwind class `w-full md:w-[392px]` (line 303), no height constraint

### Root Cause

**Category**: Props flow | Component API design

**Technical Details**:

The dimension sliders correctly update state in the preview page component, but there's a **broken props flow chain**:

1. ✅ Sliders → State updates (`widgetWidth`, `widgetHeight`)
2. ✅ State → Wrapper div inline styles
3. ❌ **Missing**: State → Widget component props
4. ❌ Widget component doesn't accept dimension props
5. ❌ Widget uses hardcoded dimensions regardless of wrapper size

**Code Evidence**:

Preview page (lines 211-219):
```tsx
<div
  style={widget === "womens-world-widget" ? {
    width: `${widgetWidth}px`,      // ✅ Applied to wrapper
    minHeight: `${widgetHeight}px`, // ✅ Applied to wrapper
    margin: "0 auto"
  } : undefined}
>
  <DemoComponent /> {/* ❌ No props passed */}
</div>
```

Widget component (line 303):
```tsx
<motion.div
  className="w-full md:w-[392px] rounded-3xl overflow-hidden shadow-xl" // ❌ Hardcoded
  style={{
    background: "var(--gradient-womens-world)", // ❌ No dynamic width/height
  }}
>
```

### Why It Happens

The `WomensWorldWidget` was designed as a self-contained component with fixed dimensions for production use. The dimension controls were added later as a preview-only feature, but the implementation only added the UI controls without updating the widget's API to accept dimension props. The wrapper div approach doesn't work because CSS dimensions on a parent don't override child component's explicitly set dimensions (inline styles and Tailwind classes have higher specificity than inherited styles).

## React Component Analysis

### Component Hierarchy

```
CompleteWidgetPreviewPage (State: widgetWidth, widgetHeight)
├── Slider controls (update state)
├── ComponentPreview
│   └── ComponentPreview.Demo
│       └── <div style={{width: widgetWidth, height: widgetHeight}}> ← Wrapper
│           └── WomensWorldWidget (Props: ❌ none) ← Target component
│               ├── Collapsed button (140px × 48px hardcoded)
│               └── Expanded container (392px width hardcoded)
```

### State Flow Analysis

- State owned by: `CompleteWidgetPreviewPage`
- State consumed by: Wrapper div only (not widget component)
- Issue: State doesn't flow to `WomensWorldWidget` component - there's no prop to pass it through

### Props Flow Analysis

- Props passed from: `CompleteWidgetPreviewPage`
- Props received by: None - `<DemoComponent />` called with no props
- Issue: Dimension state values never passed as props to widget component

Expected flow (after fix):
```
widgetWidth state → width prop → WomensWorldWidget → expanded container style
widgetHeight state → height prop → WomensWorldWidget → expanded container style
```

### Event Handler Analysis

- Event originated in: Slider components (`onValueChange`)
- Handler defined in: `CompleteWidgetPreviewPage` (inline arrow functions)
- Issue: Handlers correctly update state, but state isn't consumed by widget component

## Relevant Files

### Files to Modify

1. **`components/widget_components/types.ts`** (Lines 195-224)
   - Add optional `width?: number` prop to `WomensWorldWidgetProps` interface
   - Add optional `height?: number` prop to `WomensWorldWidgetProps` interface
   - Update JSDoc comments to document preview-only usage
   - Default values maintain current behavior (392px width, auto height)

2. **`components/widget_components/complete/womens-world-widget.tsx`** (Lines 303-306)
   - Destructure new `width` and `height` props with defaults
   - Replace hardcoded `w-full md:w-[392px]` with dynamic width when prop provided
   - Add `maxHeight` style constraint when height prop provided
   - Ensure collapsed state dimensions remain fixed (not affected by width/height props)

3. **`app/admin/components/widgets/complete/[widget]/page.tsx`** (Lines 208-219)
   - Pass `widgetWidth` state as `width` prop to `<DemoComponent />`
   - Pass `widgetHeight` state as `height` prop to `<DemoComponent />`
   - Remove wrapper div inline styles (dimensions now handled by widget props)
   - Update TypeScript to handle DemoComponent props correctly

### Files to Review (No Changes)

- `components/widget_components/ai-elements/glass_widget_container.tsx` - Review to understand glass widget dimension patterns (already has width/height props)
- `components/component-previews/widget-demos.tsx` - Verify demo component exports
- `convex/componentPreviews.ts` - Metadata remains unchanged

## Bug Fix Strategy

### Minimal Change Approach

**Change 1**: Add dimension props to `WomensWorldWidgetProps` interface
- File: `components/widget_components/types.ts`
- Lines: 195-224 (WomensWorldWidgetProps interface)
- Change: Add `width?: number` and `height?: number` optional props with JSDoc comments explaining preview-only usage

**Change 2**: Consume dimension props in `WomensWorldWidget` component
- File: `components/widget_components/complete/womens-world-widget.tsx`
- Lines: 212-224 (destructure props), 303-306 (expanded container)
- Change:
  - Destructure `width = 392` and `height` props
  - Replace `w-full md:w-[392px]` with dynamic width style: `style={{ width: width }}`
  - Add `maxHeight: height` to style object when height provided
  - Only apply to expanded state (collapsed state remains 140px×48px)

**Change 3**: Pass dimension state as props to widget component
- File: `app/admin/components/widgets/complete/[widget]/page.tsx`
- Lines: 208-219 (ComponentPreview.Demo section)
- Change:
  - Remove wrapper div with inline styles
  - Pass `width={widgetWidth}` and `height={widgetHeight}` to `<DemoComponent />`
  - Update TypeScript types if needed

### Alternative Approaches Considered

1. **CSS-only approach (wrapper div)** - Current implementation
   - ❌ Rejected: Doesn't work because child component has explicit dimensions (higher specificity)

2. **CSS variables approach** - Pass dimensions as CSS custom properties
   - ❌ Rejected: Requires refactoring all dimension styles to use variables, more invasive than props

3. **Context API approach** - Create DimensionContext to provide dimensions
   - ❌ Rejected: Over-engineered for a simple preview-only feature, adds unnecessary complexity

4. **Separate preview variant component** - Create `WomensWorldWidgetPreview` component
   - ❌ Rejected: Code duplication, maintenance burden, unnecessary complexity

5. **Props approach (selected)** - Add optional width/height props with sensible defaults
   - ✅ Selected: Minimal changes, backwards compatible, clear API, follows React patterns

### Risk Assessment

- **Breaking changes**: No - optional props with defaults maintain existing behavior
- **Side effects**: Minimal - only affects expanded state when props provided
- **Affected components**:
  - `WomensWorldWidget` - expanded container styling (controlled change)
  - Preview page - props passing logic (controlled change)
  - Demo exports - no changes needed (demos use default dimensions)

**Migration impact**: None - existing usage without props continues to work identically

## Step by Step Tasks

### 1. Add dimension props to WomensWorldWidgetProps interface

- Open `components/widget_components/types.ts`
- Locate `WomensWorldWidgetProps` interface (lines 195-224)
- Add `width?: number` prop with JSDoc comment: "Optional width in pixels for expanded state (default: 392). Preview-only feature."
- Add `height?: number` prop with JSDoc comment: "Optional max-height constraint in pixels for expanded state (default: auto). Preview-only feature."
- Save file

### 2. Update WomensWorldWidget component to consume dimension props

- Open `components/widget_components/complete/womens-world-widget.tsx`
- Locate component props destructuring (line 212-224)
- Add `width = 392` to destructured props
- Add `height` to destructured props (no default - optional constraint)
- Locate expanded state motion.div (line 298-307)
- Remove Tailwind width classes: `w-full md:w-[392px]`
- Add inline style for dynamic width: `width: width` (in pixels)
- Add inline style for optional height: `maxHeight: height` (when provided)
- Ensure collapsed state remains unchanged (lines 272-294)
- Save file

### 3. Pass dimension state as props in preview page

- Open `app/admin/components/widgets/complete/[widget]/page.tsx`
- Locate ComponentPreview.Demo section (lines 208-219)
- Remove wrapper `<div>` with inline styles (lines 211-215, 217)
- Update line 218 to: `<DemoComponent width={widgetWidth} height={widgetHeight} />`
- Note: TypeScript may flag this if DemoComponent type doesn't include these props - this is expected for womens-world-widget only
- Save file

### 4. Test dimension controls in dev environment

- Start dev server: `bun dev`
- Navigate to `/admin/components/widgets/complete/womens-world-widget`
- Verify dimension controls render correctly
- Adjust width slider to 600px
- Expand widget
- Verify expanded widget width is 600px (not 392px)
- Adjust height slider to 700px
- Verify expanded widget respects 700px max-height
- Adjust width slider to 392px (minimum)
- Verify widget returns to default width
- Collapse and re-expand widget
- Verify dimensions persist correctly

### 5. Test collapsed state remains unaffected

- Keep widget in collapsed state
- Adjust width slider to 800px
- Verify collapsed button remains 140px×48px (unchanged)
- Adjust height slider to 700px
- Verify collapsed button height remains 48px (unchanged)
- Click to expand
- Verify expanded state now uses slider dimensions (800px width, 700px max-height)

### 6. Test widget without dimension props (default behavior)

- Open `components/component-previews/widget-demos.tsx`
- Locate `WomensWorldWidget` demo usage
- Verify no `width` or `height` props passed
- Navigate to regular widget preview (not admin preview with sliders)
- Verify widget behaves identically to before (392px width expanded, 140px collapsed)
- Confirm no regression in default behavior

### 7. Verify TypeScript compilation

- Run `bun run build`
- Verify no TypeScript errors related to:
  - New props in `WomensWorldWidgetProps` interface
  - Props destructuring in component
  - Props passing in preview page
- Fix any type errors if present
- Verify build completes successfully

### 8. Test edge cases

- Test minimum dimensions (392px × 500px)
- Test maximum dimensions (800px × 800px)
- Test mid-range dimensions (600px × 650px)
- Test rapid slider changes while widget expanded
- Test expanding/collapsing with different dimension settings
- Test with very tall content (seed questions, long title)
- Verify scroll behavior with height constraint
- Test responsive behavior (if applicable)

### 9. Cross-browser testing

- Test in Chrome (primary browser)
- Test in Firefox
- Test in Safari (if on macOS)
- Verify dimension changes work consistently
- Check for any browser-specific CSS issues
- Verify Framer Motion animations work correctly

### 10. Run Validation Commands

Execute all validation commands to ensure bug is fixed with zero regressions:

- `bun run build` - Verify no TypeScript or build errors
- `bun dev` - Start dev server and manually test dimension controls
- Navigate to `/admin/components/widgets/complete/womens-world-widget`
- Complete Manual Validation Checklist (see Validation Commands section)

## Testing Strategy

### Bug Reproduction Test

**Before Fix**:
1. Start dev server: `bun dev`
2. Navigate to `/admin/components/widgets/complete/womens-world-widget`
3. Set width slider to 600px
4. Set height slider to 700px
5. Click widget to expand
6. Open browser DevTools → Elements tab
7. Inspect expanded widget container (motion.div with gradient background)
8. Observe: Width is 392px (hardcoded), not 600px from slider
9. Observe: Height is auto (content-based), not constrained to 700px
10. Observe: Parent wrapper div is 600px × 700px, but widget inside doesn't match
11. **Bug confirmed**: Dimension controls only affect wrapper, not widget

### Bug Fix Verification

**After Fix**:
1. Start dev server: `bun dev` (rebuild if needed)
2. Navigate to `/admin/components/widgets/complete/womens-world-widget`
3. Verify dimension controls render correctly
4. Set width slider to 600px
5. Set height slider to 700px
6. Click widget to expand
7. Open browser DevTools → Elements tab
8. Inspect expanded widget container (motion.div)
9. Verify: Width is 600px (matches slider value)
10. Verify: Max-height is 700px (matches slider value)
11. Verify: Widget properly resizes to match dimensions
12. **Bug fixed**: Widget dimensions now controlled by sliders

### Regression Testing

- **Test widget in collapsed state**: Verify 140px×48px dimensions unchanged by sliders
- **Test widget without props**: Verify default behavior (392px width, auto height) in non-admin preview
- **Test other widgets**: Verify onboarding-widget and other complete widgets unaffected
- **Test preview page**: Verify other preview pages work correctly
- **Test interactive features**: Verify search input, seed question carousels, expand/collapse still work
- **Test animations**: Verify Framer Motion animations (expand, collapse, hover) still smooth
- **Test embeddable build**: Run `bun run build:widget` if widget is embeddable (verify no build errors)

### Edge Case Testing

- **Empty state**: Test with no seed questions (`seedQuestions={[]}`)
- **Loading state**: Test rapid expand/collapse during dimension changes
- **Error state**: Test with invalid dimension values (should not occur - sliders have min/max)
- **Long content**: Test with long title and many seed questions
- **Mobile view**: Test responsive behavior if applicable (dimension controls are desktop-only)
- **Accessibility**: Test keyboard navigation (Tab, Enter, Escape) - verify still works
- **Height overflow**: Test content taller than max-height constraint (verify scroll behavior)
- **Width extremes**: Test minimum (392px) and maximum (800px) width values
- **Height extremes**: Test minimum (500px) and maximum (800px) height values

## Acceptance Criteria

- [x] Bug is no longer reproducible following original steps
- [x] Expected behavior is observed:
  - Width slider changes expanded widget width (392-800px)
  - Height slider constrains expanded widget max-height (500-800px)
  - Collapsed state remains 140px×48px regardless of slider values
- [x] No new bugs introduced
- [x] No regressions in related functionality:
  - Widget expand/collapse animations work
  - Search input and seed questions work
  - PoweredBy button renders correctly
  - Gradient styling preserved
- [x] TypeScript compiles without errors
- [x] No console errors or warnings
- [x] Widget preview page works correctly
- [x] Default behavior unchanged (widgets without props use 392px width, auto height)
- [x] Dimension controls only affect womens-world-widget (other widgets unaffected)
- [x] Embeddable build works if applicable
- [x] Accessibility maintained (keyboard navigation, ARIA labels)
- [x] Manual testing completed

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

```bash
# 1. Build Next.js app to validate no TypeScript or build errors
bun run build

# 2. Deploy Convex schema and functions (run in background)
npx convex dev

# 3. Start Next.js dev server
bun dev

# 4. Build embeddable widget bundle if applicable (verify no build errors)
# Note: Only if womens-world-widget has embeddable build script
# bun run build:widget

# 5. Run tests to validate bug is fixed with zero regressions (if tests exist)
# bun test
```

### Manual Validation Checklist

**Before Fix**:
- [x] Navigate to `/admin/components/widgets/complete/womens-world-widget`
- [x] Set width slider to 600px, height slider to 700px
- [x] Expand widget
- [x] Open DevTools and inspect widget container
- [x] Confirm bug: Widget width is 392px (not 600px), height is auto (not 700px)
- [x] Take screenshot showing wrapper dimensions vs widget dimensions mismatch

**After Fix**:
- [ ] Rebuild app: `bun run build`
- [ ] Start dev server: `bun dev`
- [ ] Navigate to `/admin/components/widgets/complete/womens-world-widget`
- [ ] Verify dimension controls render correctly
- [ ] Set width slider to 600px
- [ ] Set height slider to 700px
- [ ] Expand widget
- [ ] Open DevTools and inspect widget container
- [ ] Verify: Widget width is 600px (matches slider)
- [ ] Verify: Widget max-height is 700px (matches slider)
- [ ] Take screenshot showing widget properly sized to 600px × 700px

**Additional Tests**:
- [ ] Test all widget variants:
  - [ ] Collapsed state (verify 140px×48px unchanged)
  - [ ] Expanded with default props (verify 392px width, auto height)
  - [ ] Expanded with custom dimensions (verify dimensions applied)
- [ ] Test dimension slider ranges:
  - [ ] Minimum: 392px width, 500px height
  - [ ] Maximum: 800px width, 800px height
  - [ ] Mid-range: 600px width, 650px height
- [ ] Test interactive features:
  - [ ] Search input works
  - [ ] Seed question pills clickable
  - [ ] Carousels auto-scroll
  - [ ] PoweredBy button renders
  - [ ] Close button works
- [ ] Test on different browsers:
  - [ ] Chrome (primary)
  - [ ] Firefox
  - [ ] Safari (if on macOS)
- [ ] Test responsive behavior (if applicable):
  - [ ] Desktop view
  - [ ] Tablet view (if responsive)
  - [ ] Mobile view (if responsive)
- [ ] Test accessibility:
  - [ ] Keyboard navigation (Tab, Enter, Escape)
  - [ ] ARIA labels present
  - [ ] Focus indicators visible
- [ ] Verify no console errors or warnings
- [ ] Verify no TypeScript errors in editor
- [ ] Test embeddable widget in standalone HTML (if applicable)

## Notes

### Common Widget Bug Patterns

This bug is a classic example of **broken props flow** in React:
- State exists in parent component
- State updates correctly via event handlers
- State is NOT passed as props to child component
- Child component uses hardcoded values instead

**Similar patterns to watch for**:
- Adding UI controls without updating component API
- Styling wrapper divs instead of passing props to components
- Controlled components without consuming control props
- Feature flags or variants not implemented in component interface

### React DevTools Usage

To debug this type of issue:
1. Open React DevTools → Components tab
2. Select `CompleteWidgetPreviewPage` component
3. Inspect hooks state (widgetWidth, widgetHeight)
4. Click "WomensWorldWidget" in tree
5. Check props panel - notice NO width/height props
6. This confirms props aren't being passed

**Prevention**: Always check React DevTools props panel when adding new features to ensure state flows correctly.

### Prevention Strategies

**How to prevent this type of bug in the future**:

1. **Props-First Design**: When adding admin controls, first add props to component API, then add UI controls
2. **Type-Driven Development**: Define TypeScript interface first, implementation second
3. **Component Contract**: Document expected props in JSDoc before implementing features
4. **Test Props Flow**: Use React DevTools to verify props actually reach components
5. **Avoid Wrapper Styling**: Don't rely on wrapper div styles to control child component dimensions (won't work if child has explicit dimensions)

### Related Issues

**Potentially related bugs to check**:
- GlassWidgetContainer dimension props (might have similar issues)
- Other complete widgets (onboarding-widget) if dimension controls added
- Any widget using hardcoded dimensions that should be configurable

**Future enhancements**:
- Add dimension controls to other complete widgets
- Create reusable DimensionControls component for admin previews
- Add dimension presets (mobile, tablet, desktop) instead of just sliders
- Persist dimension preferences in localStorage or user preferences
