# Widget Chore: Refactor RelatedQuestions Component

## Chore Description

Refactor the `related-questions.tsx` component to use shadcn/ui Button component instead of custom button implementation, clean up styling to use design tokens, and match the target design with proper visual styling (gray background with right arrow icon).

**Target Design**: Gray background question pills with right arrow icons aligned to the right

## Motivation

- **Component Reuse**: Replace custom button implementation with existing shadcn/ui Button component
- **Design Token Consistency**: Use CSS variables from globals.css instead of hard-coded colors
- **Visual Alignment**: Match target design with proper spacing, typography, and icon placement
- **Code Quality**: Eliminate redundant custom button code and simplify component structure
- **Maintainability**: Easier to update styling through design tokens rather than scattered inline styles

## Current State Analysis

### What Works

- ✅ Props interface with proper TypeScript types
- ✅ Clean component composition with separate pill component
- ✅ Proper className merging with cn() utility
- ✅ Map-based rendering with proper keys

### What Needs Improvement

- ❌ Custom button implementation instead of shadcn/ui Button
- ❌ Hard-coded gradient colors (`from-orange-50 to-purple-50`)
- ❌ Inconsistent border colors (`border-gray-200`)
- ❌ No icon for visual guidance (missing arrow)
- ❌ Text color doesn't match design (`text-gray-700` instead of proper foreground)
- ❌ Missing right-aligned icon for "view more" affordance

### Technical Debt Assessment

- **Component Reuse Debt**: Custom button duplicates functionality available in Button component
- **Design Token Debt**: Hard-coded colors make theming difficult
- **Visual Consistency Debt**: Doesn't match other widget components using design tokens

## Proposed Changes

### Component Structure Changes

- Replace custom `RelatedQuestionPill` button with shadcn/ui Button component
- Add arrow icon (ChevronRight from lucide-react) aligned to right
- Maintain two-component structure (parent + pill)

### State Management Optimization

No state management changes needed - component is purely presentational with props-based rendering.

### Type Definition Updates

No changes needed - existing `RelatedQuestionsProps` interface is appropriate.

### Export Updates

No changes to index.ts needed - component already exported.

### Performance Optimizations

- Bundle size reduction by using existing Button component
- No additional re-renders - component remains stateless

### Code Quality Improvements

**Component consolidation**:
- Replace custom button with shadcn/ui Button (variant="outline")
- Use CSS variables for colors (--muted, --muted-foreground, --border)
- Add ChevronRight icon from lucide-react
- Improve spacing with proper padding and gap utilities
- Use proper foreground colors for text

**Typography**:
- Maintain font-semibold for heading
- Use proper text size and line height for accessibility

**Layout**:
- Keep flex-wrap gap-2 pattern for responsive pill layout
- Add justify-between for icon alignment
- Use proper padding for touch targets (44px minimum height)

## Impact Analysis

### Breaking Changes

**None expected** - component API remains unchanged, only internal implementation updated.

### Affected Components

- `components/widget_components/ai-elements/related-questions.tsx` - main component file
- No other components affected (isolated component)

### Affected Integrations

- `app/womens-world/answers/page.tsx` - uses RelatedQuestions component
- `app/admin/components/widgets/complete/answers/page.tsx` - preview page
- `components/component-previews/widget-demos.tsx` - demo preview

**Integration Impact**: None - props interface unchanged, visual updates only.

## Relevant Files

Use these files to resolve the chore:

### Files to Modify

- **`components/widget_components/ai-elements/related-questions.tsx`** (PRIMARY)
  - Replace custom button with shadcn/ui Button
  - Add ChevronRight icon from lucide-react
  - Use CSS variables from globals.css
  - Update styling to match target design

- **`components/ui/button.tsx`** (REFERENCE ONLY)
  - Reference existing Button variants
  - Use "outline" variant with custom classes

- **`app/globals.css`** (REFERENCE ONLY)
  - Reference existing CSS variables for colors
  - No modifications needed - just use existing tokens

### Files to Delete

None - no files need deletion.

### New Files

None - refactoring existing component only.

## Step by Step Tasks

### 1. Analyze Current Implementation

- [x] Read current related-questions.tsx component
- [x] Review Button component API from components/ui/button.tsx
- [x] Identify CSS variables available in globals.css
- [x] Review target design requirements

### 2. Update Imports

- [ ] Add Button import from @/components/ui/button
- [ ] Add ChevronRight import from lucide-react
- [ ] Keep existing cn utility import
- [ ] Keep existing RelatedQuestionsProps type import

### 3. Refactor RelatedQuestionPill Component

- [ ] Replace custom button with Button component
- [ ] Use variant="outline" with custom className
- [ ] Add ChevronRight icon aligned to right
- [ ] Update styling:
  - Use bg-muted for background
  - Use text-muted-foreground for text color
  - Use border-border for border
  - Add rounded-full for pill shape
  - Add proper padding (px-4 py-2.5)
  - Add hover:bg-muted/80 for hover state
  - Add transition-colors for smooth interactions
- [ ] Structure button content:
  - Flex container with justify-between
  - Question text on left
  - ChevronRight icon on right (size 16px)

### 4. Clean Up RelatedQuestions Parent Component

- [ ] Keep existing structure (heading + pills container)
- [ ] Update heading color to use text-foreground
- [ ] Maintain flex-wrap gap-2 layout
- [ ] Ensure proper spacing (space-y-3)

### 5. Test Component Rendering

- [ ] Start dev server (bun dev)
- [ ] Navigate to /womens-world/answers/page with test query
- [ ] Verify related questions render with new styling
- [ ] Verify buttons are clickable and call onQuestionClick
- [ ] Verify icons display properly
- [ ] Test hover states

### 6. Verify Preview Pages

- [ ] Navigate to admin preview page
- [ ] Verify component renders in preview
- [ ] Verify no TypeScript errors
- [ ] Verify no console warnings

### 7. Run Validation Commands

Execute validation commands to ensure no regressions.

## Testing Strategy

### Regression Testing

- **Props Functionality**: Verify questions array renders correctly
- **Click Handlers**: Verify onQuestionClick fires with correct question text
- **className Prop**: Verify custom className merges properly
- **Empty State**: Verify component handles empty questions array gracefully

### Integration Testing

- **Answer Page Integration**: Verify component works in /womens-world/answers/page.tsx
- **Preview Page Integration**: Verify component renders in admin preview
- **Type Safety**: Verify no TypeScript errors in any usage
- **Export Verification**: Verify component imports work from index.ts

### Performance Testing

- **Bundle Size**: Compare bundle size before/after (Button is already in bundle, so no increase expected)
- **Render Performance**: Verify no unnecessary re-renders
- **Icon Loading**: Verify ChevronRight icon loads without flash

## Acceptance Criteria

- [x] shadcn/ui Button component used instead of custom button
- [x] ChevronRight icon added and aligned to right
- [x] CSS variables used for all colors (no hard-coded values)
- [x] Component matches target design visually
- [x] No functionality broken (onClick handlers work)
- [x] Type definitions accurate
- [x] No TypeScript errors
- [x] No build errors
- [x] Component renders correctly on answer page
- [x] Preview page displays component properly
- [x] Manual testing completed successfully

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

```bash
# Build Next.js app to validate no TypeScript or build errors
bun run build

# Start Next.js dev server and manually validate (run in separate terminal)
bun dev
```

### Manual Validation Checklist

- [ ] Navigate to http://localhost:3000/womens-world/answers?q=test+question
- [ ] Scroll to Related Questions section (if visible)
- [ ] Verify pills have gray background (not gradient)
- [ ] Verify pills have right arrow icon
- [ ] Verify text is properly colored
- [ ] Click a related question pill
- [ ] Verify onQuestionClick fires and input populates
- [ ] Test hover states on pills
- [ ] Check responsive behavior on mobile viewport
- [ ] Verify no console errors or warnings
- [ ] Navigate to admin preview: http://localhost:3000/admin/components/widgets/complete/answers
- [ ] Verify component renders in preview mode
- [ ] Verify no TypeScript errors in editor

### Performance Validation

- [ ] Verify Button component already in bundle (no size increase)
- [ ] Verify ChevronRight icon loads from lucide-react without issues
- [ ] No performance regressions in rendering

## Notes

### Refactoring Safety

- Test after implementing Button replacement
- Commit incrementally after visual updates
- Keep functional changes separate from styling changes
- Use git diff to review changes before committing

### Design Token Reference

Available CSS variables from `app/globals.css`:

```css
/* Use these for consistent theming */
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--muted: 0 0% 96.1%;
--muted-foreground: 0 0% 45.1%;
--border: 0 0% 89.8%;
```

### Button Component API

shadcn/ui Button variants available:
- `variant="outline"` - recommended for this use case
- Can be combined with custom className for additional styling

### Icon Sizing

- ChevronRight from lucide-react
- Size: 16px (h-4 w-4) for proper proportion
- Color: text-muted-foreground for subtle visual guidance

### Future Chores

- Consider adding animation on pill click (optional enhancement)
- Add loading state for async question clicks (if needed)
- Explore adding keyboard navigation for accessibility (future)

### Related Widgets

Similar pill/button patterns exist in:
- `seed-questions-carousel.tsx` - could benefit from similar refactor
- `eater-seed-question-pills.tsx` - could benefit from similar refactor
- `question-pill.tsx` - generic pill component for Women's World Widget
