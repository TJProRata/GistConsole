# Widget Chore: Separate Dual Carousel Seed Questions - Women's World Widget

## Chore Description
Refactor the Women's World Widget to support two independent auto-scrolling carousels with separate seed question arrays instead of the current linked implementation where both carousels display the same duplicated questions.

**Current Issue:** Both carousel rows display identical seed questions from a single shared array. The component duplicates the array internally (`[...questions, ...questions]`) and renders it twice, creating two visual copies of the same data.

**Desired Outcome:** Two independent carousels with their own distinct seed question sets, allowing for better content organization (e.g., Row 1 could show general health questions, Row 2 could show wellness/lifestyle questions).

## Motivation
- **Content Diversity**: Enable more comprehensive question coverage by supporting 12+ unique questions (6 per row) instead of showing the same 6 questions twice
- **User Experience**: Reduce visual redundancy and provide more valuable suggestion options
- **Flexibility**: Allow configuration of two thematically distinct question sets (e.g., "Medical Questions" vs "Wellness Tips")
- **Maintainability**: Explicit data structures are clearer than implicit duplication
- **Future-Proofing**: Better foundation for potential future features like row-specific themes or behaviors

## Current State Analysis

### What Works
- ✅ Smooth continuous auto-scroll animation using Framer Motion
- ✅ Pause-on-hover functionality
- ✅ Seamless infinite loop with duplicated arrays
- ✅ Question pill selection and input population
- ✅ Glassmorphism input styling with gradient borders
- ✅ Responsive layout and 40px pill radius design
- ✅ Admin preview page configuration controls

### What Needs Improvement
- ❌ Both carousels share the same seed questions array
- ❌ No way to configure separate questions for each row
- ❌ Duplicated array logic is implicit and not configurable
- ❌ Admin preview UI shows single textarea for "Seed Questions" without row differentiation

### Technical Debt Assessment
- **Component Coupling**: Single `seedQuestions` prop forces identical content across rows
- **Configuration Limitation**: Admin preview lacks granular control over individual carousel rows
- **Data Structure**: Current array structure doesn't represent the dual-row architecture
- **Type Safety**: Type definitions don't enforce separation of carousel data

## Proposed Changes

### Component Structure Changes
1. **Split seed questions into two arrays**: `seedQuestionsRow1` and `seedQuestionsRow2`
2. **Update `SeedQuestionsCarousel` component**: Accept separate question arrays for each instance
3. **Maintain existing animation and interaction logic**: No changes to scroll behavior, pause/resume, or selection

### State Management Optimization
**DRY Principle Applied:**
- Store two minimal arrays (row1 questions, row2 questions)
- Derive duplicated arrays for seamless scrolling in each carousel component
- Compute selected question from user interaction (no redundant state)

**Before (Current):**
```tsx
const [selectedQuestion, setSelectedQuestion] = useState<string>("");
// Single seedQuestions array passed to both carousels
```

**After (Proposed):**
```tsx
const [selectedQuestion, setSelectedQuestion] = useState<string>("");
// Separate seedQuestionsRow1 and seedQuestionsRow2 arrays
// Each carousel manages its own duplication internally
```

### Type Definition Updates
**File:** `components/widget_components/types.ts`

**Add new props:**
```typescript
export interface WomensWorldWidgetProps {
  // ... existing props

  /** Pre-populated seed questions for first carousel row */
  seedQuestionsRow1?: string[];

  /** Pre-populated seed questions for second carousel row */
  seedQuestionsRow2?: string[];

  /** @deprecated Use seedQuestionsRow1 and seedQuestionsRow2 instead */
  seedQuestions?: string[];
}

export interface SearchInputSectionProps {
  // ... existing props

  /** Seed questions for first carousel row */
  seedQuestionsRow1: string[];

  /** Seed questions for second carousel row */
  seedQuestionsRow2: string[];

  /** @deprecated Use seedQuestionsRow1 and seedQuestionsRow2 instead */
  seedQuestions?: string[];
}
```

### Performance Optimizations
**No performance regressions expected:**
- Same number of carousel instances (2)
- Same duplication strategy (internal to each carousel)
- Same animation and interaction logic
- Minimal prop changes (splitting one array into two)

**Bundle size impact:** Negligible (<1KB due to type changes and default values)

### Code Quality Improvements
1. **Single Responsibility**: Each carousel row has its own data source
2. **Explicit Configuration**: Clear separation between row 1 and row 2 questions
3. **Backward Compatibility**: Support legacy `seedQuestions` prop with deprecation warning
4. **Type Safety**: TypeScript enforces correct prop usage
5. **Documentation**: Clear JSDoc comments explaining the dual-row architecture

## Impact Analysis

### Breaking Changes
**None expected with proper fallback handling**

**Migration Strategy:**
```tsx
// Old usage (still works, deprecated)
<WomensWorldWidget seedQuestions={allQuestions} />

// New usage (recommended)
<WomensWorldWidget
  seedQuestionsRow1={healthQuestions}
  seedQuestionsRow2={wellnessQuestions}
/>

// Fallback logic in component:
const row1 = seedQuestionsRow1 ?? seedQuestions?.slice(0, 6) ?? DEFAULT_ROW_1;
const row2 = seedQuestionsRow2 ?? seedQuestions?.slice(6, 12) ?? DEFAULT_ROW_2;
```

### Affected Components
- `components/widget_components/complete/womens-world-widget.tsx` - Main widget component
- `components/widget_components/types.ts` - Type definitions
- `components/component-previews/widget-demos.tsx` - Demo component configuration
- `app/admin/components/widgets/complete/[widget]/page.tsx` - Admin preview page UI

### Affected Integrations
- **Admin Preview Page**: Needs two separate textareas for row 1 and row 2 questions
- **Convex Preview Data**: Update `WIDGET_DATA` code example to show new prop structure
- **Widget Demos**: Update demo component to use separate arrays

## Relevant Files

### Files to Modify

#### `components/widget_components/complete/womens-world-widget.tsx` (Primary)
**Changes:**
- Add `seedQuestionsRow1` and `seedQuestionsRow2` props to component interface
- Update `DEFAULT_SEED_QUESTIONS` to split into `DEFAULT_SEED_QUESTIONS_ROW_1` and `DEFAULT_SEED_QUESTIONS_ROW_2`
- Implement fallback logic for backward compatibility with deprecated `seedQuestions` prop
- Pass separate question arrays to each `SeedQuestionsCarousel` instance (lines 202-213)
- Update JSDoc comments to document new dual-array architecture

#### `components/widget_components/types.ts` (Type Safety)
**Changes:**
- Add `seedQuestionsRow1?: string[]` to `WomensWorldWidgetProps`
- Add `seedQuestionsRow2?: string[]` to `WomensWorldWidgetProps`
- Deprecate `seedQuestions?: string[]` with JSDoc `@deprecated` tag
- Update `SearchInputSectionProps` with same changes
- Add detailed JSDoc comments explaining row1/row2 separation

#### `app/admin/components/widgets/complete/[widget]/page.tsx` (Admin UI)
**Changes:**
- Split `seedQuestions` state into `seedQuestionsRow1` and `seedQuestionsRow2` in `womensWorldConfig` (line 39-46)
- Update default values to show distinct questions per row
- Add two separate textareas in Content tab:
  - "Seed Questions - Row 1" with helper text
  - "Seed Questions - Row 2" with helper text
- Update component render to pass both props (line 342-346)

#### `components/component-previews/widget-demos.tsx` (Demo Setup)
**Changes:**
- Update `WomensWorldWidgetDemo` to use new prop structure
- Provide example arrays showing thematic separation (health vs wellness)
- Add comments explaining the dual-row concept

#### `convex/componentPreviews.ts` (Documentation)
**Changes:**
- Update `WIDGET_DATA` code example for `womens-world-widget` (lines 1025-1042)
- Show usage of `seedQuestionsRow1` and `seedQuestionsRow2` props
- Update dependencies list to note "Carousel (x2 instances with separate data)"

### Files to Delete (if applicable)
None - this is a refactoring, not a removal

### New Files (if applicable)
None - working with existing component structure

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Type Definitions
- Open `components/widget_components/types.ts`
- Add `seedQuestionsRow1?: string[]` to `WomensWorldWidgetProps` with JSDoc comment
- Add `seedQuestionsRow2?: string[]` to `WomensWorldWidgetProps` with JSDoc comment
- Mark existing `seedQuestions?: string[]` as deprecated with `@deprecated` tag and migration note
- Update `SearchInputSectionProps` with same new props and deprecation
- Add detailed JSDoc comments explaining the dual-row architecture and backward compatibility

### Step 2: Refactor Widget Component - Default Values
- Open `components/widget_components/complete/womens-world-widget.tsx`
- Split `DEFAULT_SEED_QUESTIONS` (lines 21-28) into two constants:
  - `DEFAULT_SEED_QUESTIONS_ROW_1`: 6 health-focused questions
  - `DEFAULT_SEED_QUESTIONS_ROW_2`: 6 wellness-focused questions (distinct from row 1)
- Add JSDoc comments explaining thematic separation

### Step 3: Refactor Widget Component - Props Interface
- Update `WomensWorldWidget` function signature to accept new props
- Add `seedQuestionsRow1` and `seedQuestionsRow2` to destructured props (line 224-238)
- Keep deprecated `seedQuestions` prop for backward compatibility
- Add default values using new constants

### Step 4: Refactor Widget Component - Fallback Logic
- Implement fallback logic at top of component:
  ```tsx
  const row1Questions = seedQuestionsRow1 ?? seedQuestions?.slice(0, 6) ?? DEFAULT_SEED_QUESTIONS_ROW_1;
  const row2Questions = seedQuestionsRow2 ?? seedQuestions?.slice(6, 12) ?? DEFAULT_SEED_QUESTIONS_ROW_2;
  ```
- Add inline comment explaining backward compatibility strategy

### Step 5: Refactor Widget Component - Carousel Props
- Update first `SeedQuestionsCarousel` (line 202) to use `row1Questions`
- Update second `SeedQuestionsCarousel` (line 208) to use `row2Questions`
- Ensure both carousels still receive same `autoScrollInterval`, `onQuestionClick`, and `selectedQuestion` props
- Verify no other logic changes needed in `SearchInputSection`

### Step 6: Update Admin Preview Configuration
- Open `app/admin/components/widgets/complete/[widget]/page.tsx`
- Update `womensWorldConfig` state (lines 35-49):
  - Replace `seedQuestions` array with `seedQuestionsRow1` array (6 questions)
  - Add `seedQuestionsRow2` array (6 different questions)
- Add example questions that demonstrate thematic separation

### Step 7: Update Admin Preview UI - Content Tab
- Find Content tab in widget configuration (lines 245-333)
- Replace single "Seed Questions" textarea with two separate controls:
  - "Seed Questions - Row 1" textarea with helper text: "First carousel row (one question per line)"
  - "Seed Questions - Row 2" textarea with helper text: "Second carousel row (one question per line)"
- Update state handlers to modify `seedQuestionsRow1` and `seedQuestionsRow2` separately
- Update validation and filtering logic for each textarea

### Step 8: Update Admin Preview Component Render
- Update component render section (lines 342-346) to pass both new props:
  ```tsx
  <DemoComponent
    width={widgetWidth}
    seedQuestionsRow1={womensWorldConfig.seedQuestionsRow1}
    seedQuestionsRow2={womensWorldConfig.seedQuestionsRow2}
    {...otherProps}
  />
  ```

### Step 9: Update Demo Component
- Open `components/component-previews/widget-demos.tsx`
- Find `WomensWorldWidgetDemo` export
- Update to use new prop structure with example data showing thematic separation
- Add comment explaining the dual-row concept for developers

### Step 10: Update Convex Preview Metadata
- Open `convex/componentPreviews.ts`
- Find `womens-world-widget` entry in `WIDGET_DATA` array (lines 1012-1043)
- Update code example to show usage of `seedQuestionsRow1` and `seedQuestionsRow2`
- Update dependencies note from "Carousel (x2 instances)" to "Carousel (x2 instances with separate data)"
- Update description to mention "dual auto-scrolling seed question carousels with independent data sets"

### Step 11: Run Validation Commands
Execute all validation commands listed below to ensure zero regressions

## Testing Strategy

### Regression Testing
- [ ] Test collapsed state renders correctly with "Ask AI" button
- [ ] Test expansion animation works smoothly
- [ ] Test both carousels auto-scroll independently
- [ ] Test pause-on-hover works for both carousels
- [ ] Test clicking question pill populates input correctly
- [ ] Test clicking questions from row 1 and row 2 both work
- [ ] Test submit button appears when input has text
- [ ] Test glassmorphism input styling intact
- [ ] Test 40px pill radius preserved
- [ ] Test gradient borders render correctly
- [ ] Test powered-by footer displays
- [ ] Test close button functionality

### Integration Testing
- [ ] Admin preview page loads without errors
- [ ] Two seed question textareas render in Content tab
- [ ] Editing row 1 questions updates first carousel only
- [ ] Editing row 2 questions updates second carousel only
- [ ] Widget width slider still works
- [ ] Auto-scroll interval slider still works
- [ ] All other config controls function correctly
- [ ] Widget preview updates reactively with config changes
- [ ] Navigation to/from widget preview page works
- [ ] Code tab displays updated implementation

### Performance Testing
**Not applicable** - No performance changes expected (same component count, same animation logic, minimal prop additions)

## Acceptance Criteria
- [ ] Two separate `seedQuestionsRow1` and `seedQuestionsRow2` props defined in types
- [ ] Deprecated `seedQuestions` prop marked with `@deprecated` tag
- [ ] Backward compatibility fallback logic implemented and tested
- [ ] Default values split into two distinct arrays with thematic separation
- [ ] Both carousels render with independent question sets
- [ ] Admin preview page shows two separate textareas for row 1 and row 2
- [ ] Demo component updated to use new prop structure
- [ ] Convex preview metadata updated with new code example
- [ ] No visual regressions in widget appearance or animations
- [ ] No functionality broken (pause, hover, selection, submit)
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] All manual validation tests pass
- [ ] Code quality maintained (no duplication, clear naming, proper comments)

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

### Build Validation
```bash
bun run build
```
**Expected:** No TypeScript errors, no build errors, successful compilation

### Development Server Validation
```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Next.js
bun dev
```
**Expected:** Server starts without errors, no runtime warnings

### Manual Validation Checklist
- [ ] Navigate to `http://localhost:3000/admin/components/widgets/complete/womens-world-widget`
- [ ] Verify widget renders in collapsed state
- [ ] Click to expand widget
- [ ] Verify two carousel rows display different questions
- [ ] Hover over first carousel and verify it pauses
- [ ] Hover over second carousel and verify it pauses independently
- [ ] Click a question from row 1 and verify input populates
- [ ] Click a question from row 2 and verify input populates
- [ ] Verify submit button appears when input has text
- [ ] Test form submission (console log check)
- [ ] Open Content tab in configuration panel
- [ ] Verify "Seed Questions - Row 1" textarea exists
- [ ] Verify "Seed Questions - Row 2" textarea exists
- [ ] Edit row 1 questions and verify only first carousel updates
- [ ] Edit row 2 questions and verify only second carousel updates
- [ ] Test width slider still functions
- [ ] Test auto-scroll interval slider still functions
- [ ] Click "Code" tab and verify updated implementation shows
- [ ] Verify no console errors or warnings
- [ ] Test keyboard navigation (tab through elements)
- [ ] Verify close button functionality
- [ ] Test responsive behavior (resize browser)

### TypeScript Validation
```bash
npx tsc --noEmit
```
**Expected:** No type errors

### Performance Validation (if applicable)
**Not applicable** - This is a configuration refactoring with no expected performance impact

## Notes

### Refactoring Safety
- **Test after each step**: Run `bun dev` and verify widget still works
- **Commit incrementally**: Commit after types, after component, after admin UI
- **Keep functional changes separate**: This chore only separates data, no behavior changes
- **Backward compatibility priority**: Existing `seedQuestions` usage must not break

### Default Question Recommendations
**Row 1 (Health/Medical Focus):**
- "What's the best bread for weight loss?"
- "Can I prevent dementia?"
- "Is there a link between trauma and autoimmune symptoms?"
- "How do I improve my gut health?"
- "What are signs of vitamin deficiency?"
- "Can exercise reduce inflammation?"

**Row 2 (Wellness/Lifestyle Focus):**
- "How can I make Hamburger Helper healthier?"
- "What are natural ways to boost energy?"
- "Best morning routine for productivity?"
- "How much water should I drink daily?"
- "What foods improve sleep quality?"
- "Natural remedies for stress relief?"

### Future Enhancements
- Row-specific themes (different gradient colors per carousel)
- Independent auto-scroll speeds per row
- Row-specific animation directions (row 1 left-to-right, row 2 right-to-left)
- Category labels above each carousel row
- Toggle to enable/disable individual rows
- Analytics on which row generates more clicks

### Related Widgets
- **NYT Chat Widget**: Also uses suggestion systems, could benefit from categorized suggestions
- **Rufus Widget**: Has seed questions, could explore multi-row layout in future
- **Onboarding Widget**: Uses suggestion pills, different pattern but related UX
