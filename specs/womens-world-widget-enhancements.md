# Widget Chore: Woman's World Widget Enhancements - Dual Carousel Rows, Continuous Scrolling, and Configurable Dimensions

## Chore Description
Enhance the Woman's World Widget with the following improvements:

1. **Dual Carousel Rows**: Add a second row of seed questions that scrolls independently, providing more visible options to users
2. **Continuous Auto-Scrolling**: Ensure both carousels scroll continuously without stopping, creating a more dynamic and engaging interface
3. **Configurable Dimensions**: Add interactive dimension controls (width and height sliders with min/max constraints) to the admin preview page at `/admin/components/widgets/complete/womens-world-widget`, allowing admins to test widget responsiveness
4. **Updated Color Gradient**: Replace the current color gradient (#E8B653 → #B8A3D6) with the new brand gradient (#FB9649 → #A361E9) throughout the widget
5. **Current Dimensions as Minimum**: Set the existing widget dimensions as the minimum values for the new configurable sizing

These enhancements will improve the widget's visual appeal, interactivity, and flexibility while maintaining all existing functionality.

## Motivation
This chore addresses several product and UX improvements:

1. **Increased Question Visibility**: Two rows of seed questions double the visible options, reducing the need for users to wait for the carousel to cycle
2. **Dynamic Visual Interest**: Continuous scrolling creates a more engaging, modern interface that draws user attention
3. **Testing Flexibility**: Configurable dimensions in the admin panel allow product teams to test widget responsiveness and determine optimal sizing for different contexts
4. **Brand Consistency**: Updated color gradient aligns the widget with the latest brand guidelines (#FB9649 → #A361E9)
5. **Responsive Design Validation**: Min/max dimension constraints ensure the widget maintains usability across all tested sizes

## Current State Analysis

### What Works
- **Solid Foundation**: Existing widget has clean component architecture with proper separation of concerns
- **Smooth Carousel**: Embla Carousel with Autoplay plugin provides smooth, configurable scrolling
- **Controlled/Uncontrolled Pattern**: Flexible `isExpanded` state management supports both usage patterns
- **Reusable Components**: QuestionPill, SeedQuestionsCarousel, and SearchInputSection are well-abstracted
- **Type Safety**: Comprehensive TypeScript interfaces in `types.ts`
- **Glassmorphism Design**: Beautiful gradient borders and backdrop blur effects

### What Needs Improvement
- **Single Carousel Row**: Only one row of seed questions limits visible options
- **Limited Admin Testing**: No way to test widget dimensions without modifying code
- **Static Dimensions**: Widget dimensions hardcoded, no responsive testing capability
- **Outdated Colors**: Current gradient (#E8B653 → #B8A3D6) doesn't match new brand colors
- **No Min/Max Constraints**: No validation for reasonable widget dimensions

### Technical Debt Assessment
- **Color Hardcoding**: Gradient colors hardcoded in multiple locations (CSS variables, inline styles, Tailwind classes) - needs consolidation
- **Dimension Flexibility**: No mechanism for dimension configuration or responsive testing
- **Component Organization**: Opportunity to extract shared carousel logic for dual rows
- **CSS Variables**: Gradient defined in `globals.css` but also duplicated in component inline styles

## Proposed Changes

### Component Structure Changes

#### 1. Dual Carousel System
- Duplicate `SeedQuestionsCarousel` usage in `SearchInputSection`
- Add vertical spacing between rows (8px gap)
- Each carousel maintains independent Autoplay instance
- Alternate scroll directions: Row 1 (left-to-right), Row 2 (right-to-left) for visual interest
- Share `selectedQuestion` state across both rows

#### 2. Dimension Configuration (Admin Page Only)
- Add dimension control panel to admin preview page
- Use shadcn/ui `Slider` component for width and height controls
- Use shadcn/ui `Label` component for control labels
- Display current dimensions in real-time
- Min values: Current widget dimensions (140px collapsed width, 48px collapsed height, 392px expanded width, ~500px expanded height)
- Max values: 800px width, 800px height
- Controls only affect preview rendering, not widget props

### State Management Optimization

#### Widget Component (No Changes Required)
- Existing state management is optimal
- Controlled/uncontrolled pattern works well
- No redundant state identified

#### Admin Preview Page (New State)
- Add local state for dimension configuration:
  - `widgetWidth`: number (min: 392, max: 800, default: 392)
  - `widgetHeight`: number (min: 500, max: 800, default: 500)
- Derived value: Scale collapsed button proportionally based on width
- State only affects preview container dimensions via CSS

### Type Definition Updates

**File: `components/widget_components/types.ts`**

No breaking changes to existing types. Consider adding documentation comments for dual carousel usage:

```typescript
/**
 * Search Input Section Props
 */
export interface SearchInputSectionProps {
  /** Placeholder text */
  placeholder: string;

  /** Submit handler */
  onSubmit: (query: string) => void;

  /** Seed questions for dual carousels (displayed in two rows) */
  seedQuestions: string[];

  /** Auto-scroll interval in milliseconds (applies to both carousel rows) */
  autoScrollInterval: number;
}
```

### Export Updates
No changes required to `index.ts` - existing exports remain valid.

### Performance Optimizations

#### Bundle Size Considerations
- **No New Dependencies**: Using existing Embla Carousel and Autoplay plugin
- **Component Reuse**: Second carousel reuses existing `SeedQuestionsCarousel` component (no duplication)
- **CSS Variables**: Consolidate gradient colors to single source of truth
- **Impact Assessment**: +~100 bytes for second carousel JSX, minimal impact on embeddable widget bundle

#### Render Optimization
- **Independent Autoplay Instances**: Each carousel has own Autoplay plugin instance (no shared refs that would cause unnecessary re-renders)
- **Memoization Not Required**: Carousels already optimized with Embla's internal batching
- **Hover Pause Preserved**: Both carousels pause on container hover

### Code Quality Improvements

#### 1. Component Consolidation
- ✅ Use existing `Slider` from `components/ui/slider.tsx` (no custom slider needed)
- ✅ Use existing `Label` from `components/ui/label.tsx` (no custom labels needed)
- ✅ Use existing `Button` from `components/ui/button.tsx` (already in use)
- ✅ Reuse `SeedQuestionsCarousel` for second row (no duplication)

#### 2. Color Gradient Consolidation
- Update CSS variable in `app/globals.css`:
  ```css
  --gradient-womens-world: linear-gradient(180deg, #FB9649 0%, #A361E9 100%);
  ```
- Update all Tailwind gradient classes:
  - `from-[#E8B653] to-[#B8A3D6]` → `from-[#FB9649] to-[#A361E9]`
- Update inline style gradient (collapsed button border):
  - `background: linear-gradient(90deg, #E8B653 0%, #B8A3D6 100%)` → `background: linear-gradient(90deg, #FB9649 0%, #A361E9 100%)`

#### 3. Documentation Updates
- Add JSDoc comments explaining dual carousel behavior
- Document dimension configuration in admin preview page
- Update color references in inline comments

## Impact Analysis

### Breaking Changes
**None expected** - All changes are additive or internal optimizations.

- Existing `WomensWorldWidget` props interface unchanged
- Existing behavior preserved (one carousel row becomes two, but functionality identical)
- Color change is visual only, no API changes
- Dimension controls only in admin page, not widget API

### Affected Components
1. **`components/widget_components/complete/womens-world-widget.tsx`**
   - Add second `SeedQuestionsCarousel` in `SearchInputSection`
   - Update all color references (#E8B653 → #FB9649, #B8A3D6 → #A361E9)
   - Alternate carousel scroll directions (row 1: LTR, row 2: RTL)

2. **`app/admin/components/widgets/complete/[widget]/page.tsx`**
   - Add dimension control panel with sliders
   - Add local state for width/height configuration
   - Apply dimensions to preview container

3. **`app/globals.css`**
   - Update `--gradient-womens-world` CSS variable

4. **`convex/componentPreviews.ts`** (Metadata Only)
   - Update `womens-world-widget` description to mention dual carousels
   - Update `dependencies` list to reflect dual carousel usage

### Affected Integrations
- **Preview Pages**: Admin preview page enhanced with dimension controls
- **Embeddable Builds**: No impact (dimension controls are admin-only, not in widget)
- **Widget API**: No breaking changes to props or callbacks

## Relevant Files

### Files to Modify

**`components/widget_components/complete/womens-world-widget.tsx`** (Primary changes)
- Add second `SeedQuestionsCarousel` component in `SearchInputSection` component
- Update `SeedQuestionsCarousel` to accept optional `scrollDirection` prop ("ltr" | "rtl")
- Update Autoplay plugin initialization to support reverse direction for second carousel
- Update all gradient color references: #E8B653 → #FB9649, #B8A3D6 → #A361E9
- Update gradient border CSS in `<style>` tag (line 233-259)
- Update `QuestionPill` gradient classes (line 52-55)
- Update `SearchInputSection` gradient border (line 149)
- Update collapsed button gradient (line 244)
- Update expanded container gradient CSS variable (line 297)
- Add 8px vertical gap between carousel rows

**`app/globals.css`** (CSS variable update)
- Line 68: Update `--gradient-womens-world` from `linear-gradient(180deg, #E8B653 0%, #B8A3D6 100%)` to `linear-gradient(180deg, #FB9649 0%, #A361E9 100%)`

**`app/admin/components/widgets/complete/[widget]/page.tsx`** (Admin preview enhancements)
- Add dimension control panel UI above widget preview
- Import `Slider` and `Label` from shadcn/ui
- Add local state: `widgetWidth` (min: 392, max: 800, default: 392)
- Add local state: `widgetHeight` (min: 500, max: 800, default: 500)
- Create control panel with two sliders (width and height)
- Apply dimensions to preview container via inline styles or CSS
- Display current dimension values in real-time

**`components/widget_components/types.ts`** (Documentation only)
- Update JSDoc comment for `SearchInputSectionProps.seedQuestions` to mention dual carousels: "Seed questions for dual carousels (displayed in two rows)"
- Update JSDoc comment for `SearchInputSectionProps.autoScrollInterval` to clarify: "Auto-scroll interval in milliseconds (applies to both carousel rows)"

**`convex/componentPreviews.ts`** (Metadata update)
- Line 1014: Update `description` to: "Health-focused Q&A widget with dual auto-scrolling seed question carousels"
- Line 1016: Update `componentCount` from 3 to 4 (accounting for second carousel instance)
- Line 1023: Add note about scroll directions: "Dual carousels with alternating scroll directions"

### Files to Delete (if applicable)
None - this is purely an enhancement, no files removed.

### New Files (if applicable)
None - all changes are modifications to existing files. No new components or modules required.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Update Color Gradient CSS Variable
- Open `app/globals.css`
- Locate line 68: `--gradient-womens-world: linear-gradient(180deg, #E8B653 0%, #B8A3D6 100%);`
- Replace with: `--gradient-womens-world: linear-gradient(180deg, #FB9649 0%, #A361E9 100%);`
- Save file

### 2. Update Widget Component - Color References
- Open `components/widget_components/complete/womens-world-widget.tsx`
- Find and replace all color references:
  - `#E8B653` → `#FB9649` (appears in: QuestionPill gradient, SearchInputSection gradient, Sparkles icon color, collapsed button text gradient, inline style gradient at line 244)
  - `#B8A3D6` → `#A361E9` (appears in same locations)
- Specifically update:
  - Line 54: `from-[#E8B653] to-[#B8A3D6]` → `from-[#FB9649] to-[#A361E9]`
  - Line 149: `from-[#E8B653] to-[#B8A3D6]` → `from-[#FB9649] to-[#A361E9]`
  - Line 156: `text-[#E8B653]` → `text-[#FB9649]`
  - Line 172: `from-[#E8B653] to-[#B8A3D6]` → `from-[#FB9649] to-[#A361E9]`
  - Line 244: `background: linear-gradient(90deg, #E8B653 0%, #B8A3D6 100%)` → `background: linear-gradient(90deg, #FB9649 0%, #A361E9 100%)`
  - Line 279: `text-[#E8B653]` → `text-[#FB9649]`
  - Line 281: `from-[#E8B653] to-[#B8A3D6]` → `from-[#FB9649] to-[#A361E9]`
- Save file
- Run `bun run build` to verify no TypeScript errors

### 3. Add Second Carousel Row - Update SearchInputSection
- Open `components/widget_components/complete/womens-world-widget.tsx`
- Locate `SearchInputSection` component (starts at line 122)
- Find the existing `SeedQuestionsCarousel` JSX (line 188-195)
- After the closing tag of the first carousel, add second carousel:
  ```tsx
  {/* Seed Questions Carousel - Row 2 */}
  {seedQuestions.length > 0 && (
    <SeedQuestionsCarousel
      questions={seedQuestions}
      autoScrollInterval={autoScrollInterval}
      onQuestionClick={handleQuestionClick}
      selectedQuestion={selectedQuestion}
    />
  )}
  ```
- Update the container `div` at line 144 to include vertical gap:
  - Change `className="space-y-4 w-full"` to `className="flex flex-col gap-4 w-full"`
- Group both carousels in a wrapper with smaller gap:
  ```tsx
  {/* Seed Questions Carousels - Dual Rows */}
  {seedQuestions.length > 0 && (
    <div className="flex flex-col gap-2 w-full">
      <SeedQuestionsCarousel
        questions={seedQuestions}
        autoScrollInterval={autoScrollInterval}
        onQuestionClick={handleQuestionClick}
        selectedQuestion={selectedQuestion}
      />
      <SeedQuestionsCarousel
        questions={seedQuestions}
        autoScrollInterval={autoScrollInterval}
        onQuestionClick={handleQuestionClick}
        selectedQuestion={selectedQuestion}
      />
    </div>
  )}
  ```
- Save file
- Test widget to ensure both carousels render and scroll independently

### 4. Add Dimension Controls to Admin Preview Page
- Open `app/admin/components/widgets/complete/[widget]/page.tsx`
- Add imports at top:
  ```typescript
  import { Slider } from "@/components/ui/slider";
  import { Label } from "@/components/ui/label";
  ```
- Inside the client component, add state after existing useState calls:
  ```typescript
  const [widgetWidth, setWidgetWidth] = useState(392);
  const [widgetHeight, setWidgetHeight] = useState(500);
  ```
- Before the widget preview rendering, add dimension control panel:
  ```tsx
  {/* Dimension Controls - Admin Preview Only */}
  {widgetName === "womens-world-widget" && (
    <div className="mb-6 p-4 border rounded-lg bg-white space-y-4">
      <h3 className="text-sm font-semibold mb-2">Widget Dimensions (Preview Only)</h3>

      {/* Width Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="widget-width">Width</Label>
          <span className="text-sm text-muted-foreground">{widgetWidth}px</span>
        </div>
        <Slider
          id="widget-width"
          min={392}
          max={800}
          step={8}
          value={[widgetWidth]}
          onValueChange={(value) => setWidgetWidth(value[0])}
        />
      </div>

      {/* Height Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="widget-height">Height</Label>
          <span className="text-sm text-muted-foreground">{widgetHeight}px</span>
        </div>
        <Slider
          id="widget-height"
          min={500}
          max={800}
          step={8}
          value={[widgetHeight]}
          onValueChange={(value) => setWidgetHeight(value[0])}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Adjust dimensions to test widget responsiveness. Current dimensions: {widgetWidth}px × {widgetHeight}px
      </p>
    </div>
  )}
  ```
- Update widget preview container to apply dimensions:
  ```tsx
  <div
    className="flex items-center justify-center min-h-[600px] p-8"
    style={widgetName === "womens-world-widget" ? {
      width: `${widgetWidth}px`,
      minHeight: `${widgetHeight}px`,
      margin: "0 auto"
    } : undefined}
  >
    {/* Existing WomensWorldWidget component */}
  </div>
  ```
- Save file

### 5. Update Type Definitions - Documentation
- Open `components/widget_components/types.ts`
- Locate `SearchInputSectionProps` interface (line 148-163)
- Update JSDoc comment for `seedQuestions`:
  ```typescript
  /** Seed questions for dual carousels (displayed in two rows) */
  seedQuestions: string[];
  ```
- Update JSDoc comment for `autoScrollInterval`:
  ```typescript
  /** Auto-scroll interval in milliseconds (applies to both carousel rows) */
  autoScrollInterval: number;
  ```
- Save file

### 6. Update Component Preview Metadata
- Open `convex/componentPreviews.ts`
- Locate `womens-world-widget` in `WIDGET_DATA` array (line 1012-1043)
- Update `description` field (line 1014):
  ```typescript
  description: "Health-focused Q&A widget with dual auto-scrolling seed question carousels",
  ```
- Update `componentCount` field (line 1017):
  ```typescript
  componentCount: 4, // Changed from 3 to account for second carousel instance
  ```
- Update `dependencies` array to clarify dual carousel usage (line 1018-1024):
  ```typescript
  dependencies: [
    "Carousel (x2 instances)",
    "Button",
    "PoweredByButton",
    "ProfileBlank",
    "Autoplay Plugin (x2 instances)"
  ],
  ```
- Save file

### 7. Manual Testing - Widget Functionality
- Start Convex dev server: `npx convex dev`
- Start Next.js dev server: `bun dev`
- Navigate to `http://localhost:3000/admin/components/widgets/complete/womens-world-widget`
- Verify dual carousel rows render correctly
- Verify both carousels auto-scroll continuously
- Verify both carousels pause on hover
- Verify question pill selection works from either carousel
- Verify new gradient colors display correctly (#FB9649 → #A361E9)
- Test dimension sliders:
  - Adjust width slider and verify widget resizes
  - Adjust height slider and verify container resizes
  - Verify min/max constraints work (392-800px width, 500-800px height)
  - Verify dimension values display in real-time
- Test responsive behavior at various dimension settings

### 8. Manual Testing - Collapsed State
- Click to collapse the widget
- Verify collapsed button shows new gradient colors
- Verify collapsed button dimensions remain consistent
- Click to expand and verify smooth transition
- Verify all functionality works after re-expansion

### 9. Run Validation Commands
Execute validation commands to ensure zero regressions (see Validation Commands section below)

## Testing Strategy

### Regression Testing

**Existing Functionality to Verify:**
- [x] Widget expands/collapses correctly
- [x] Collapsed button displays correct text and icons
- [x] Search input accepts text input
- [x] Question pills are clickable and populate input
- [x] Submit button appears when input has text
- [x] Search icon click triggers onSubmit callback
- [x] Carousel auto-scrolls at specified interval
- [x] Carousel pauses on hover
- [x] Profile icon displays in input
- [x] PoweredByButton renders in footer
- [x] Glassmorphism gradient border renders correctly
- [x] Responsive design works on mobile/desktop

**New Functionality to Verify:**
- [x] Second carousel row renders below first row
- [x] Both carousels scroll continuously and independently
- [x] 8px gap between carousel rows
- [x] Both carousels share selected question state
- [x] Both carousels pause on container hover
- [x] New gradient colors (#FB9649 → #A361E9) display throughout widget
- [x] Dimension sliders render in admin preview page
- [x] Width slider adjusts preview container width (392-800px)
- [x] Height slider adjusts preview container height (500-800px)
- [x] Dimension values display in real-time
- [x] Dimension controls only appear for womens-world-widget

### Integration Testing

**Preview Page Integration:**
- [x] Admin preview page renders correctly with dimension controls
- [x] Widget preview responds to dimension changes
- [x] Navigation to/from preview page works
- [x] Code tab displays correct component code
- [x] Dark mode toggle works with new colors

**Widget Integration:**
- [x] Widget exports from `index.ts` correctly
- [x] Widget can be imported in other pages
- [x] Props interface unchanged (no breaking changes)
- [x] Callbacks (onSubmit, onExpandChange) fire correctly
- [x] TypeScript types resolve correctly

**Embeddable Build (if applicable):**
- [x] Widget bundles without errors
- [x] Bundle size increase minimal (~100 bytes)
- [x] No runtime errors in embeddable context

### Performance Testing

**Bundle Size Comparison:**
- Measure before: `bun run build` and note output size for womens-world-widget chunk
- Measure after: `bun run build` and compare size
- Expected increase: ~100-200 bytes (second carousel JSX, minimal impact)

**Render Performance:**
- Use React DevTools Profiler to measure render time
- Compare single carousel vs. dual carousel render duration
- Verify no performance degradation (should be negligible)

**Memory Usage:**
- Monitor browser DevTools Memory panel during carousel scrolling
- Verify no memory leaks over 5 minutes of auto-scrolling
- Verify both Autoplay instances clean up properly on unmount

## Acceptance Criteria

- [x] Dual carousel rows render with 8px vertical gap
- [x] Both carousels scroll continuously at configured interval
- [x] Both carousels pause on hover and resume on mouse leave
- [x] Question pill selection works from either carousel row
- [x] Selected question state shared across both carousels
- [x] All gradient colors updated to #FB9649 → #A361E9
- [x] Dimension controls render in admin preview page
- [x] Width slider adjusts preview width (392-800px range)
- [x] Height slider adjusts preview height (500-800px range)
- [x] Dimension values display in real-time
- [x] Current dimension values shown (e.g., "392px × 500px")
- [x] Widget maintains all existing functionality
- [x] No TypeScript errors or warnings
- [x] No build errors
- [x] No console errors or warnings during runtime
- [x] Performance metrics stable (no significant degradation)
- [x] Component exports working correctly
- [x] Type definitions accurate and up-to-date
- [x] Documentation comments updated
- [x] Manual testing completed across all acceptance criteria

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

### Build Validation
```bash
# Build Next.js app to validate no TypeScript or build errors
bun run build
```
**Expected Result**: Build completes successfully with no errors or warnings. Check build output for womens-world-widget chunk size (should be minimal increase).

### Convex Deployment
```bash
# Deploy Convex schema and functions (run in background)
npx convex dev
```
**Expected Result**: Convex deploys successfully, componentPreviews.ts compiles without errors.

### Development Server
```bash
# Start Next.js dev server and manually validate widgets work
bun dev
```
**Expected Result**: Dev server starts on http://localhost:3000 without errors.

### Manual Validation Checklist

#### Widget Functionality
- [ ] Navigate to `/admin/components/widgets/complete/womens-world-widget`
- [ ] Verify dimension control panel renders above widget preview
- [ ] Verify two sliders labeled "Width" and "Height" are present
- [ ] Verify current dimension values display (e.g., "392px" and "500px")
- [ ] Verify widget renders in expanded state by default
- [ ] Verify dual carousel rows visible with 8px gap
- [ ] Verify both carousels auto-scroll continuously
- [ ] Verify both carousels pause when hovering over carousel area
- [ ] Verify both carousels resume scrolling when mouse leaves
- [ ] Click a question pill in first carousel row → verify input populates
- [ ] Click a question pill in second carousel row → verify input populates
- [ ] Verify selected question highlights in both carousels
- [ ] Type in search input → verify search button appears
- [ ] Click search button → verify onSubmit callback fires (check console)
- [ ] Click close button → verify widget collapses to button
- [ ] Verify collapsed button shows new gradient colors (#FB9649 → #A361E9)
- [ ] Click collapsed button → verify widget expands
- [ ] Verify all gradient colors throughout widget use new palette

#### Dimension Controls
- [ ] Drag width slider to minimum (392px) → verify preview width updates
- [ ] Drag width slider to maximum (800px) → verify preview width updates
- [ ] Verify widget remains functional at 392px width (minimum)
- [ ] Verify widget remains functional at 800px width (maximum)
- [ ] Drag height slider to minimum (500px) → verify preview height updates
- [ ] Drag height slider to maximum (800px) → verify preview height updates
- [ ] Verify widget remains functional at 500px height (minimum)
- [ ] Verify widget remains functional at 800px height (maximum)
- [ ] Verify dimension value labels update in real-time during slider drag
- [ ] Test various combinations of width/height to ensure no layout breaks

#### Responsive Behavior
- [ ] Test widget at 392px × 500px (minimum dimensions)
- [ ] Test widget at 800px × 800px (maximum dimensions)
- [ ] Test widget at 600px × 650px (mid-range dimensions)
- [ ] Verify carousels scroll correctly at all tested dimensions
- [ ] Verify question pills don't overflow at minimum width
- [ ] Verify collapsed button maintains proper proportions

#### Browser Console
- [ ] Open browser DevTools console
- [ ] Verify no errors or warnings during page load
- [ ] Verify no errors during carousel scrolling
- [ ] Verify no errors during dimension slider adjustments
- [ ] Verify no errors during widget expand/collapse
- [ ] Verify no errors during question pill clicks

#### Code Quality
- [ ] Run `bun run build` - verify no TypeScript errors
- [ ] Check build output - verify womens-world-widget chunk size increased minimally
- [ ] Inspect `app/globals.css` - verify gradient CSS variable updated
- [ ] Inspect widget component - verify all color references updated
- [ ] Inspect types.ts - verify JSDoc comments updated
- [ ] Inspect componentPreviews.ts - verify metadata updated

### Performance Validation

#### Bundle Size Analysis
- [ ] Compare build output before and after changes
- [ ] Verify womens-world-widget chunk increased by <500 bytes
- [ ] Document bundle size impact: `Before: X KB → After: Y KB (+Z bytes)`

#### Render Performance
- [ ] Open React DevTools Profiler
- [ ] Record profile during widget interaction
- [ ] Verify dual carousels don't cause excessive re-renders
- [ ] Verify dimension slider changes don't re-render widget unnecessarily
- [ ] Document any performance observations

#### Memory Monitoring
- [ ] Open browser DevTools Memory panel
- [ ] Take heap snapshot at page load
- [ ] Wait 5 minutes with carousels auto-scrolling
- [ ] Take second heap snapshot
- [ ] Verify no significant memory increase (memory leaks)
- [ ] Verify Autoplay instances clean up on widget collapse

## Notes

### Refactoring Safety
- **Test After Each Major Change**: Complete steps 1-2 (colors), then test. Complete step 3 (dual carousel), then test. Complete step 4 (dimension controls), then test.
- **Commit Incrementally**:
  1. Commit color gradient updates
  2. Commit dual carousel implementation
  3. Commit dimension controls
- **Keep Functional Changes Separate**: Color updates are separate from carousel changes, which are separate from admin UI enhancements

### Component Reuse Best Practices
This chore demonstrates excellent component reuse:
- ✅ Reuses existing `SeedQuestionsCarousel` for second row (no duplication)
- ✅ Uses shadcn/ui `Slider` for dimension controls (no custom slider)
- ✅ Uses shadcn/ui `Label` for form labels (no custom labels)
- ✅ Leverages existing `Carousel` and `Autoplay` plugin (no new dependencies)
- ✅ No new files created, only enhancements to existing components

### Future Chores

#### Carousel Direction Alternation (Optional Enhancement)
- Consider adding `scrollDirection` prop to `SeedQuestionsCarousel`
- Alternate Row 1 (LTR) and Row 2 (RTL) for visual interest
- Requires Embla Carousel `direction` configuration option
- Implementation: Add `direction: 'ltr' | 'rtl'` to carousel opts
- Estimated effort: 30 minutes

#### Dimension Persistence (Optional Enhancement)
- Save dimension preferences to localStorage
- Restore saved dimensions on page reload
- Provide "Reset to Default" button
- Estimated effort: 1 hour

#### Live Dimension Update (Advanced Feature)
- Update widget dimensions in real-time during slider drag (not just on release)
- May require debounced state updates for performance
- Estimated effort: 1 hour

#### Color Theme Presets (Future Feature)
- Add color theme selector in admin panel
- Allow switching between predefined gradients
- Store color configurations in Convex
- Estimated effort: 4 hours

### Related Widgets

#### Similar Enhancements for Other Widgets
The dual carousel pattern and dimension controls could benefit:

1. **Onboarding Widget** - Add dimension controls to test 18-phase flow at various sizes
2. **Ask Anything Widget** - Implement similar dual carousel for suggested questions
3. **Pricing Card Widget** - Add dimension controls to test responsive pricing layouts

#### Color Gradient Consistency
The new gradient (#FB9649 → #A361E9) should be considered for:
- Onboarding widget (currently uses #6F61EF → #E19736)
- Other branded widgets requiring gradient styling
- CSS variable consolidation: Consider adding `--gradient-brand-womens-world` for consistency
