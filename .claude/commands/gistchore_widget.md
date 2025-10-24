# Widget Chore Planning

Create a new plan in specs/*.md to resolve the `Widget Chore` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

- You're writing a plan to resolve a widget maintenance chore - refactoring, optimization, reorganization, or technical debt reduction.
- Create the plan in the `specs/*.md` file. Name it appropriately based on the `Widget Chore`.
- Use the plan format below to create the plan.
- Research the codebase and existing widget patterns to accomplish the chore.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to accomplish the chore.
- Use your reasoning model: THINK HARD about the plan and the steps to accomplish the chore without breaking existing functionality.
- **Widget-Specific Focus**: All changes should be isolated to widget components in `components/widget_components/`
- **React Best Practices**: Apply principles from `ai_docs/react_docs/thinkinginreact.md`:
  - Single responsibility principle for components
  - DRY principle for state (compute derived values)
  - Minimal state, maximum derivation
  - Props down, events up pattern
- **Preserve Functionality**: Ensure refactoring doesn't change widget behavior or break integrations
- **TypeScript Safety**: Update type definitions in `types.ts` to reflect any interface changes
- **Export Management**: Update `index.ts` exports if widget structure changes
- **Use shadcn/ui components**: If UI changes are needed, always use existing shadcn/ui components from `components/ui/`
- **Follow shadcn/ui best practices**: Read `ai_docs/shadcn/shadcn_component_library_bp.md` for component maintenance, styling, and update patterns
- **Update components properly**: When updating shadcn/ui components, maintain CVA variants, forwardRef patterns, CSS variables, and accessibility features
- **Bundling Impact**: Consider impact on embeddable widget bundles (size, performance) from `ai_docs/bun_docs/bun_bundling.md`
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.

## Relevant Files

Focus on the following files:
- `README.md` - Project overview and setup instructions
- `components/widget_components/` - Widget library structure (all categories)
- `components/widget_components/index.ts` - Widget exports (may need updates)
- `components/widget_components/types.ts` - TypeScript type definitions
- `components/ui/` - shadcn/ui component library
- `app/admin/components/widgets/` - Widget preview pages (may need updates)
- `convex/componentPreviews.ts` - Component preview metadata (may need updates)
- `lib/utils.ts` - Utility functions including cn() for class name merging
- `ai_docs/react_docs/thinkinginreact.md` - React component design principles
- `ai_docs/bun_docs/bun_bundling.md` - Bundling considerations for embeddable widgets
- `ai_docs/shadcn/shadcn_component_library_bp.md` - shadcn/ui best practices and maintenance patterns
- `package.json` - Dependencies and scripts

Ignore all other files in the codebase.

## Plan Format

```md
# Widget Chore: <chore name>

## Chore Description
<describe the widget maintenance chore in detail - what needs to be refactored, optimized, reorganized, or cleaned up>

## Motivation
<explain why this chore is necessary - technical debt, performance, maintainability, consistency>

## Current State Analysis
<analyze the current state of the widgets or widget system>

### What Works
<list what's working well and should be preserved>

### What Needs Improvement
<list specific areas that need improvement>

### Technical Debt Assessment
<identify technical debt being addressed>

## Proposed Changes

### Component Structure Changes
<describe any changes to component hierarchy or organization>

### State Management Optimization
<describe state management improvements using React best practices>

- Identify redundant state that can be derived
- Consolidate state management where appropriate
- Apply DRY principle to state

### Type Definition Updates
<describe changes to TypeScript interfaces in types.ts>

### Export Updates
<describe changes to index.ts exports if widget structure changes>

### Performance Optimizations
<describe performance improvements>

- Bundle size reduction (for embeddable widgets)
- Render optimization (memoization, lazy loading)
- Asset optimization

### Code Quality Improvements
<describe code quality improvements>

- Component decomposition (single responsibility)
- Prop interface cleanup
- Naming consistency
- Documentation updates

## Impact Analysis

### Breaking Changes
<list any breaking changes to widget APIs or interfaces>

**None expected** OR <list specific breaking changes and migration path>

### Affected Components
<list all widget components affected by this chore>

### Affected Integrations
<list any integrations affected - preview pages, embeddable builds, etc.>

## Relevant Files
Use these files to resolve the chore:

<find and list the files that are relevant to the chore. Describe why they are relevant in bullet points. If there are new files that need to be created, list them in an h3 'New Files' section.>

### Files to Modify
<list files that will be modified with specific changes>

### Files to Delete (if applicable)
<list any files that will be removed as part of cleanup>

### New Files (if applicable)
<list new files that need to be created>

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. Use as many h3 headers as needed to accomplish the chore. Order matters:

1. Analysis and documentation of current state
2. Type definition updates (if needed)
3. Component refactoring (preserve functionality)
4. State management optimization
5. Export updates in index.ts
6. Preview page updates (if needed)
7. Build configuration updates (if needed)
8. Testing and verification
9. Run Validation Commands

Your last step should be running the `Validation Commands` to validate the chore is complete with zero regressions.>

## Testing Strategy

### Regression Testing
<describe how to ensure no functionality is broken>

- Test all widget variants
- Verify props still work correctly
- Check state management still functions
- Ensure events fire properly

### Integration Testing
<describe integration testing>

- Preview pages still render correctly
- Exports from index.ts working
- Embeddable builds still function (if applicable)
- No TypeScript errors introduced

### Performance Testing
<describe performance testing if optimization is involved>

- Bundle size comparison (before/after)
- Render performance measurement
- Memory usage check

## Acceptance Criteria
<list specific, measurable criteria that must be met for the chore to be considered complete>

- [ ] All targeted improvements implemented
- [ ] No functionality broken
- [ ] Type definitions updated and accurate
- [ ] Exports from index.ts working correctly
- [ ] All widget previews rendering correctly
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] Performance metrics improved (if applicable)
- [ ] Code quality metrics improved
- [ ] Documentation updated
- [ ] Manual testing completed

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

<list commands you'll use to validate with 100% confidence the chore is complete. Every command must execute without errors.>

- `bun run build` - Build Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start Next.js dev server and manually validate all widgets work
- `bun run build:widgets` - Build all embeddable widget bundles (if applicable)
- `bun test` - Run tests to validate chore is complete with zero regressions (if tests exist)

### Manual Validation Checklist
- [ ] Navigate to each affected widget preview page
- [ ] Verify all widgets render correctly
- [ ] Test interactive features still work
- [ ] Verify no console errors or warnings
- [ ] Check responsive behavior
- [ ] Test keyboard navigation and accessibility
- [ ] Verify embeddable bundles work (if applicable)

### Performance Validation (if applicable)
- [ ] Compare bundle sizes before/after
- [ ] Measure render performance improvement
- [ ] Verify no performance regressions

## Notes
<optionally list any additional notes or context that are relevant to the chore that will be helpful to the developer>

### Refactoring Safety
- Test after each major change
- Commit incrementally
- Keep functional changes separate from refactoring

### Future Chores
<list potential follow-up chores or improvements>

### Related Widgets
<list related widgets that may benefit from similar improvements>
```

## Widget Chore
$ARGUMENTS
