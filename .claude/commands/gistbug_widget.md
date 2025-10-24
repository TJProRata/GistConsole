# Widget Bug Planning

Create a new plan in specs/*.md to resolve the `Widget Bug` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

- You're writing a plan to resolve a widget bug - it should be thorough and precise so we fix the root cause and prevent regressions.
- Create the plan in the `specs/*.md` file. Name it appropriately based on the `Widget Bug`.
- Use the plan format below to create the plan.
- Research the codebase to understand the bug, reproduce it, and put together a plan to fix it.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to fix the bug.
- Use your reasoning model: THINK HARD about the bug, its root cause, and the steps to fix it properly.
- IMPORTANT: Be surgical with your bug fix - solve the bug at hand and don't fall off track.
- IMPORTANT: We want the minimal number of changes that will fix and address the bug.
- **Widget-Specific Debugging**: Focus on React component lifecycle, state management, props flow, and event handling
- **React Debugging Principles**: Apply concepts from `ai_docs/react_docs/thinkinginreact.md`:
  - Trace data flow (props down, events up)
  - Check state vs derived values
  - Verify controlled component patterns
  - Identify prop drilling issues
- **Common Widget Bugs**:
  - State not updating as expected
  - Props not flowing correctly
  - Event handlers not firing
  - Re-render issues (infinite loops, unnecessary renders)
  - CSS/styling conflicts (Tailwind classes)
  - TypeScript type mismatches
  - Embeddable bundle issues (for complete widgets)
- **Use shadcn/ui components**: If UI bug fixes are needed, understand shadcn/ui component architecture and patterns
- **Follow shadcn/ui debugging**: Read `ai_docs/shadcn/shadcn_component_library_bp.md` for component debugging, common pitfalls, and proper fix patterns
- **Maintain component integrity**: When fixing bugs in shadcn/ui components, preserve CVA variants, forwardRef patterns, CSS variables, and accessibility
- **CRITICAL - No New Components for Bug Fixes**:
  - ❌ **Fix within existing structure**: Bug fixes should work within existing component architecture from `/Users/tjmcgovern/gist-console/components`
  - ❌ **Don't create new components**: Never create new UI components (Button, Form, Input, Card, Dialog, etc.) as part of bug fix unless absolutely necessary
  - ✅ **Reuse existing**: If additional UI needed, use existing components from `components/ui/`
  - ✅ **Variants allowed**: Create variants of existing components using CVA if fix requires it
  - ✅ **CSS edits allowed**: Modify `app/globals.css` for styling bug fixes
- Don't use decorators. Keep it simple.
- If you need a new library, use `bun add` and be sure to report it in the `Notes` section of the `Plan Format`.
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.

## Relevant Files

Focus on the following files:
- `README.md` - Project overview and setup instructions
- `/Users/tjmcgovern/gist-console/components/` - **PRIMARY SOURCE**: All reusable components live here
- `components/ui/` - **CHECK FIRST**: shadcn/ui component library (accordion, alert, badge, button, card, carousel, checkbox, dialog, dropdown-menu, form, input, label, radio-group, scroll-area, select, separator, skeleton, slider, table, tabs, textarea, phase-navigation, powered-by-button)
- `components/widget_components/` - Widget library (specific widget with bug)
- `components/widget_components/index.ts` - Widget exports
- `components/widget_components/types.ts` - TypeScript type definitions
- `app/admin/components/widgets/` - Widget preview pages (for reproduction)
- `convex/componentPreviews.ts` - Component preview metadata
- `lib/utils.ts` - Utility functions including cn() for class name merging
- `ai_docs/react_docs/thinkinginreact.md` - React component patterns and debugging
- `ai_docs/bun_docs/bun_bundling.md` - Embeddable widget bundle debugging
- `ai_docs/shadcn/shadcn_component_library_bp.md` - shadcn/ui debugging patterns and common pitfalls
- `package.json` - Dependencies and scripts

Ignore all other files in the codebase.

## Plan Format

```md
# Widget Bug: <bug name>

## Bug Description
<describe the bug in detail, including symptoms and expected vs actual behavior>

### Expected Behavior
<clearly describe what should happen>

### Actual Behavior
<clearly describe what is actually happening>

### Affected Widget(s)
<list specific widgets affected by this bug>

- Widget: `<WidgetName>` (category: <icon|animation|ai-element|ask-anything|complete>)
- Location: `components/widget_components/<category>/<widget-name>.tsx`

## Problem Statement
<clearly define the specific problem that needs to be solved>

## Solution Statement
<describe the proposed solution approach to fix the bug>

## Steps to Reproduce
<list exact steps to reproduce the bug>

1. Navigate to widget preview page: `/admin/components/widgets/<category>/<widget-name>`
2. <specific action>
3. <specific action>
4. Observe <bug symptom>

### Reproduction Environment
- Browser: <specific browser if relevant>
- Device: <desktop|mobile|tablet if relevant>
- Widget variant: <if widget has multiple variants>

## Root Cause Analysis

### Investigation Process
<describe the debugging process used to identify the root cause>

1. Inspect component tree in React DevTools
2. Trace state flow and updates
3. Check prop values at each level
4. Verify event handlers and callbacks
5. Review TypeScript types
6. Check CSS class application (Tailwind)
7. Examine console errors/warnings

### Root Cause
<explain the root cause of the bug in technical detail>

**Category**: <state management | props flow | event handling | styling | TypeScript | bundling | other>

**Technical Details**:
<detailed explanation of what's causing the bug>

### Why It Happens
<explain why the current code produces the buggy behavior>

## React Component Analysis

### Component Hierarchy
<show the component hierarchy related to the bug>

```
ParentComponent
├── BuggyComponent
│   ├── ChildA
│   └── ChildB
```

### State Flow Analysis
<analyze how state flows through the components>

- State owned by: `<ComponentName>`
- State consumed by: `<ComponentName>`, `<ComponentName>`
- Issue: <describe the state flow issue>

### Props Flow Analysis
<analyze how props flow through the components>

- Props passed from: `<ParentComponent>`
- Props received by: `<BuggyComponent>`
- Issue: <describe the props flow issue>

### Event Handler Analysis
<analyze event handlers and callbacks>

- Event originated in: `<ComponentName>`
- Handler defined in: `<ComponentName>`
- Issue: <describe the event handling issue>

## Relevant Files
Use these files to fix the bug:

<find and list the files that are relevant to the bug. Describe why they are relevant in bullet points. Focus on the minimal set of files that need changes.>

### Files to Modify
<list specific files that need changes with exact line numbers if possible>

- `components/widget_components/<category>/<widget-name>.tsx` - <specific change needed>
- `components/widget_components/types.ts` - <specific change needed if types need fixing>

### Files to Review (No Changes)
<list files that need to be reviewed for context but don't need changes>

## Bug Fix Strategy

### Minimal Change Approach
<describe the minimal changes needed to fix the bug>

**Change 1**: <specific change>
- File: <file path>
- Lines: <line numbers>
- Change: <exact change description>

**Change 2**: <specific change>
- File: <file path>
- Lines: <line numbers>
- Change: <exact change description>

### Alternative Approaches Considered
<list alternative fixes that were considered and why they were rejected>

### Risk Assessment
<assess risks associated with the fix>

- **Breaking changes**: <yes/no - describe if yes>
- **Side effects**: <potential side effects>
- **Affected components**: <list components that might be affected>

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. Use as many h3 headers as needed to fix the bug. Order matters:

1. Reproduce the bug (document exact steps)
2. Implement the fix (minimal changes only)
3. Verify the fix resolves the bug
4. Test for regressions (check related functionality)
5. Update types if necessary
6. Update tests if necessary
7. Run Validation Commands

Your last step should be running the `Validation Commands` to validate the bug is fixed with zero regressions.>

## Testing Strategy

### Bug Reproduction Test
<describe exact test to confirm bug exists before fix>

### Bug Fix Verification
<describe exact test to confirm bug is fixed after fix>

### Regression Testing
<describe tests to ensure nothing else broke>

- Test widget in all variants
- Test related widgets
- Test preview page functionality
- Test interactive features
- Test embeddable build (if applicable)

### Edge Case Testing
<list edge cases to test>

- Empty state
- Loading state
- Error state
- Long content
- Mobile view
- Accessibility (keyboard navigation)

## Acceptance Criteria
<list specific, measurable criteria that must be met for the bug to be considered fixed>

- [ ] Bug is no longer reproducible following original steps
- [ ] Expected behavior is observed
- [ ] No new bugs introduced
- [ ] No regressions in related functionality
- [ ] TypeScript compiles without errors
- [ ] No console errors or warnings
- [ ] Widget preview page works correctly
- [ ] Embeddable build works (if applicable)
- [ ] Accessibility maintained
- [ ] Manual testing completed

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

<list commands you'll use to validate with 100% confidence the bug is fixed. Every command must execute without errors. Include commands to reproduce the bug before and after the fix.>

- `bun run build` - Build Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start Next.js dev server and reproduce the bug to verify it's fixed
- `bun run build:widget` - Build embeddable widget bundle if applicable (verify no build errors)
- `bun test` - Run tests to validate bug is fixed with zero regressions (if tests exist)

### Manual Validation Checklist

**Before Fix**:
- [ ] Follow "Steps to Reproduce" and confirm bug exists
- [ ] Document observed buggy behavior
- [ ] Take screenshots if visual bug

**After Fix**:
- [ ] Follow "Steps to Reproduce" and confirm bug is fixed
- [ ] Verify expected behavior is observed
- [ ] Take screenshots showing fix (if visual bug)
- [ ] Test all widget variants
- [ ] Test on different browsers (if browser-specific)
- [ ] Test on mobile/tablet (if responsive bug)
- [ ] Test keyboard navigation
- [ ] Verify no console errors or warnings
- [ ] Test embeddable widget in standalone HTML (if applicable)

## Notes
<optionally list any additional notes or context that are relevant to the bug that will be helpful to the developer>

### Common Widget Bug Patterns
<note any common patterns that might help debug similar issues>

### React DevTools Usage
- Use Components tab to inspect component tree
- Use Profiler tab to identify performance issues
- Check hooks state and props values
- Verify component re-render counts

### Prevention Strategies
<describe how to prevent this type of bug in the future>

### Related Issues
<list any related bugs or issues that might need similar fixes>
```

## Widget Bug
$ARGUMENTS
