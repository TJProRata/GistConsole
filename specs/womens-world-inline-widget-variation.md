# Widget Chore: Create Embeddable Inline Variation of Women's World Widget

## Chore Description

Create a new "inline" variation of the Women's World Widget that is optimized for embedding between paragraphs within article content. The inline widget will be a compact, always-expanded version without the collapsed/expanded state transition, designed to feel native to article layouts while maintaining the core Q&A functionality.

This variation will:
- Remove collapsed state (always visible)
- Eliminate expand/collapse animations and transitions
- Use a more compact, article-friendly design
- Maintain the dual auto-scrolling carousel functionality
- Preserve glassmorphism input styling
- Optimize bundle size for embeddable widget use case
- Support responsive width to fit within article columns

## Motivation

**Why this chore is necessary:**

1. **Content Integration**: Publishers want to embed Q&A widgets directly within article content to increase engagement at relevant moments in the reading experience
2. **Layout Flexibility**: The current widget is designed for corner/sidebar placement with expand/collapse behavior, which doesn't suit inline article embedding
3. **Performance**: Inline widgets need to be lightweight and not disrupt page load or reading flow
4. **User Experience**: Readers expect inline widgets to feel native to the article, not like a separate overlay or modal
5. **Bundle Optimization**: Creating a separate inline variant allows for tree-shaking of unused expanded/collapsed state logic

**Business Impact:**
- Higher engagement when widgets appear contextually within content
- Better SEO through on-page interaction elements
- Reduced bounce rate by keeping users engaged without navigation

## Current State Analysis

### What Works

**Existing Widget Strengths:**
- ✅ Dual independent auto-scrolling carousels with distinct question themes
- ✅ Glassmorphism input design with gradient borders
- ✅ Smooth animations and hover interactions
- ✅ Well-structured component hierarchy (QuestionPill, SeedQuestionsCarousel, SearchInputSection)
- ✅ Clean TypeScript type definitions in `types.ts`
- ✅ Props-based customization (colors, text, dimensions)
- ✅ Responsive to prop changes (autoScrollInterval, seedQuestions)

**Reusable Components:**
- `QuestionPill` - Can be reused as-is
- `SeedQuestionsCarousel` - Can be reused with minor styling adjustments
- `SearchInputSection` - Core functionality works, needs layout optimization
- `PoweredByButton` - Can be reused
- Existing shadcn/ui components (Button from `components/ui/button.tsx`)

### What Needs Improvement

**For Inline Variation:**

1. **Layout Structure:**
   - Current: Two-state widget (collapsed 140px × 48px → expanded 392px × auto with modal-like appearance)
   - Needed: Single-state inline widget (100% width within article container, compact height ~280-350px)

2. **Visual Design:**
   - Current: Floating modal with shadow-xl, rounded-3xl, gradient background
   - Needed: Flatter design that blends with article content, subtle shadows, less dramatic borders

3. **State Management:**
   - Current: Complex controlled/uncontrolled expand/collapse state with animations
   - Needed: Minimal state (only input value, selected question)

4. **Bundle Impact:**
   - Current: Includes Framer Motion animations for expand/collapse transitions
   - Needed: Remove unnecessary animation dependencies for inline variant

5. **Responsive Behavior:**
   - Current: Fixed width (392px default)
   - Needed: Responsive width (100% of container with max-width constraint)

6. **Footer Placement:**
   - Current: PoweredByButton in right-aligned footer
   - Needed: Consider more compact footer or integrate into header for space efficiency

### Technical Debt Assessment

**No Technical Debt to Address** - This is a new component variant, not a refactoring of existing code.

**Opportunities:**
- Create shared sub-components that both variants can use (DRY principle)
- Establish pattern for future widget variations (inline vs. overlay)
- Improve code organization by extracting shared logic to separate files

## Proposed Changes

### Component Structure Changes

**New Component File:**
```
components/widget_components/complete/womens-world-inline-widget.tsx
```

**Component Hierarchy:**
```
WomensWorldInlineWidget (new)
├── SearchInputSection (reused from existing widget)
│   ├── Glassmorphism Input Container
│   │   ├── Sparkles icon (lucide-react)
│   │   ├── <input> (native)
│   │   ├── Search button (conditional, native button)
│   │   └── ProfileBlank icon
│   └── SeedQuestionsCarousel (reused × 2)
│       └── QuestionPill (reused × N)
└── PoweredByButton (reused)
```

**Shared Components Strategy:**
- Extract `QuestionPill`, `SeedQuestionsCarousel`, and `SearchInputSection` into separate files in `components/widget_components/shared/` for reuse across both variants
- Both `womens-world-widget.tsx` and `womens-world-inline-widget.tsx` import from shared files
- Reduces duplication and ensures consistency

### State Management Optimization

**Apply React Best Practices:**

1. **Minimal State (DRY Principle):**
   ```typescript
   // ✅ Minimal state - only user input
   const [selectedQuestion, setSelectedQuestion] = useState<string>("");

   // ❌ Avoid - this is derived, not state
   // const [hasInput, setHasInput] = useState(false); // Computed: selectedQuestion.length > 0
   ```

2. **Single Responsibility:**
   - Inline widget: Handles rendering and input state
   - SearchInputSection: Manages question selection and submission
   - SeedQuestionsCarousel: Manages auto-scroll animation

3. **Props Down, Events Up:**
   ```typescript
   // Props flow down
   <WomensWorldInlineWidget
     seedQuestionsRow1={questions1}
     onSubmit={(q) => handleSubmit(q)}
   />

   // Events bubble up
   onSubmit(selectedQuestion); // Notify parent
   ```

**State to Remove:**
- ✂️ `isExpanded` / `controlledIsExpanded` - Inline widget is always visible
- ✂️ `internalExpanded` / `onExpandChange` - No expand/collapse behavior
- ✂️ Framer Motion animation states

**State to Keep:**
- ✅ `selectedQuestion` - Current input value (SearchInputSection)
- ✅ Carousel animation refs (SeedQuestionsCarousel)

### Type Definition Updates

**New Props Interface:**
```typescript
/**
 * Women's World Inline Widget Props
 * Optimized for embedding within article content
 */
export interface WomensWorldInlineWidgetProps {
  /** Widget title with sparkle emoji */
  title?: string;

  /** Placeholder text for search input */
  placeholder?: string;

  /**
   * Pre-populated seed questions for first carousel row.
   * Use this for health/medical-focused questions.
   */
  seedQuestionsRow1?: string[];

  /**
   * Pre-populated seed questions for second carousel row.
   * Use this for wellness/lifestyle-focused questions.
   */
  seedQuestionsRow2?: string[];

  /** Auto-scroll interval in milliseconds */
  autoScrollInterval?: number;

  /** Branding text for footer (default: "Powered by Gist.ai") */
  brandingText?: string;

  /** Callback when question is submitted */
  onSubmit?: (question: string) => void;

  /** Maximum width in pixels (default: 640px for readable line length) */
  maxWidth?: number;

  /** Additional CSS classes */
  className?: string;

  /** Theme variant for article context */
  variant?: "light" | "neutral" | "subtle";
}
```

**Update `types.ts`:**
- Add `WomensWorldInlineWidgetProps` interface
- Keep existing `WomensWorldWidgetProps` unchanged (no breaking changes)

### Export Updates

**Update `index.ts`:**
```typescript
// Add new export
export { WomensWorldInlineWidget } from "./complete/womens-world-inline-widget";
export type { WomensWorldInlineWidgetProps } from "./types";

// Existing exports remain unchanged
export { WomensWorldWidget } from "./complete/womens-world-widget";
export type { WomensWorldWidgetProps } from "./types";
```

### Performance Optimizations

**Bundle Size Reduction:**
1. **Remove Framer Motion for inline variant:**
   - No `motion` components needed (no expand/collapse animations)
   - Estimated savings: ~15-20KB gzipped
   - Keep for auto-scroll: Native `animate()` from Framer Motion (required for carousels)

2. **Tree-Shaking Opportunities:**
   - Separate inline widget into own file allows bundlers to exclude expanded/collapsed state logic
   - Remove unused props validation
   - Remove backward compatibility fallback code

3. **Asset Optimization:**
   - Reuse existing icons (Sparkles, Search, ProfileBlank from lucide-react)
   - Reuse PoweredByButton SVG
   - No new assets required

**Render Optimization:**
1. **Component Memoization (if needed):**
   ```typescript
   // Only if profiling shows re-render issues
   const MemoizedCarousel = React.memo(SeedQuestionsCarousel);
   ```

2. **Lazy Loading:**
   - Consider code-splitting inline widget for pages that don't always need it
   - Not required initially (widget is small ~5-8KB)

### Code Quality Improvements

**Component Decomposition (Single Responsibility):**
1. **Extract shared sub-components:**
   ```
   components/widget_components/shared/
   ├── question-pill.tsx        (Button wrapper for questions)
   ├── seed-questions-carousel.tsx  (Auto-scroll carousel)
   └── search-input-section.tsx     (Input + carousels)
   ```

2. **Update both widget variants to import from shared files**

**Prop Interface Cleanup:**
- Remove props not relevant to inline widget (isExpanded, onExpandChange, height, width)
- Add props specific to inline use case (maxWidth, variant)

**Naming Consistency:**
- Use `WomensWorldInlineWidget` (clear distinction from modal variant)
- Use `WomensWorldWidget` (existing modal/overlay variant)

**Documentation Updates:**
- Add JSDoc comments explaining inline vs. overlay use cases
- Document recommended article integration patterns
- Add responsive behavior notes

**Component Consolidation:**
- ✅ Reuse existing shadcn/ui Button component (don't create new button variant)
- ✅ Reuse existing lucide-react icons (Sparkles, Search, X, ProfileBlank)
- ✅ Reuse PoweredByButton component from `components/widget_components/icons/`
- ❌ Don't create new input component (use native `<input>` with custom styles)

## Impact Analysis

### Breaking Changes

**None expected** - This is a new component variant, not a modification of existing widget.

### Affected Components

**New Components:**
- `components/widget_components/complete/womens-world-inline-widget.tsx` (new)
- `components/widget_components/shared/question-pill.tsx` (extracted from existing)
- `components/widget_components/shared/seed-questions-carousel.tsx` (extracted from existing)
- `components/widget_components/shared/search-input-section.tsx` (extracted from existing)

**Modified Components:**
- `components/widget_components/complete/womens-world-widget.tsx` (refactored to use shared components)
- `components/widget_components/types.ts` (add WomensWorldInlineWidgetProps)
- `components/widget_components/index.ts` (add new exports)

**Reused Components (No Changes):**
- `components/widget_components/icons/powered-by-button.tsx`
- `components/widget_components/icons/profile-blank.tsx`
- `components/ui/button.tsx`

### Affected Integrations

**Admin Preview Pages:**
- Create new preview page: `app/admin/components/widgets/complete/[widget]/page.tsx`
- Add routing for `womens-world-inline-widget` preview
- Add configuration UI for inline widget properties

**Component Metadata:**
- Update `convex/components.ts` to include `womens-world-inline-widget` in complete widgets list
- Update count: `completeWidgetsCount: 5` (was 4)

**Component Previews:**
- Add preview entry in `convex/componentPreviews.ts` for `womens-world-inline-widget`
- Create demo component in `components/component-previews/widget-demos.tsx`

**Build System:**
- No changes required (inline widget uses same build config as existing widgets)
- Bundle will automatically tree-shake unused code

## Relevant Files

### Files to Modify

#### 1. `components/widget_components/types.ts`
**Changes:** Add `WomensWorldInlineWidgetProps` interface
**Why:** TypeScript type definitions for new inline widget variant

#### 2. `components/widget_components/index.ts`
**Changes:** Export `WomensWorldInlineWidget` and `WomensWorldInlineWidgetProps`
**Why:** Make inline widget accessible to consumers

#### 3. `components/widget_components/complete/womens-world-widget.tsx`
**Changes:** Refactor to import shared components from `shared/` directory instead of defining inline
**Why:** Eliminate code duplication, apply DRY principle

#### 4. `convex/components.ts`
**Changes:**
- Update `completeWidgetsCount` from 4 to 5
- Add entry for `womens-world-inline-widget` in `getCompleteWidgetsList` array
**Why:** Admin portal should display inline widget in complete widgets list

#### 5. `convex/componentPreviews.ts`
**Changes:** Add preview metadata entry for `womens-world-inline-widget`
**Why:** Enable preview page with code snippet and demo

#### 6. `components/component-previews/widget-demos.tsx`
**Changes:** Add `WomensWorldInlineWidgetDemo` function and WIDGET_DEMOS entry
**Why:** Render inline widget demo on preview page

#### 7. `app/admin/components/widgets/complete/[widget]/page.tsx`
**Changes:** Add configuration UI for `womens-world-inline-widget` (similar to existing womens-world-widget config)
**Why:** Allow admins to preview and configure inline widget properties

#### 8. `app/globals.css`
**Changes:** Add CSS custom properties for inline widget variant styling (if needed)
**Why:** Theme-level styling for inline widget that differs from modal variant

### Files to Delete

**None** - This is additive work, no components are being removed.

### New Files

#### 1. `components/widget_components/complete/womens-world-inline-widget.tsx`
**Purpose:** Main inline widget component optimized for article embedding
**Content:** Compact, always-expanded widget without state transitions

#### 2. `components/widget_components/shared/question-pill.tsx`
**Purpose:** Reusable question button component
**Content:** Extracted from existing widget, shared by both variants

#### 3. `components/widget_components/shared/seed-questions-carousel.tsx`
**Purpose:** Auto-scrolling carousel for seed questions
**Content:** Extracted from existing widget with pause-on-hover functionality

#### 4. `components/widget_components/shared/search-input-section.tsx`
**Purpose:** Glassmorphism input + dual carousels section
**Content:** Extracted from existing widget, shared by both variants

## Step by Step Tasks

### Step 1: Analysis and Documentation
- [x] Review existing Women's World Widget implementation
- [x] Document current component structure and state management
- [x] Identify shared vs. variant-specific code
- [x] Define inline widget requirements and design constraints
- [x] Create comprehensive plan document

### Step 2: Type Definition Updates
- [ ] Open `components/widget_components/types.ts`
- [ ] Add `WomensWorldInlineWidgetProps` interface with inline-specific props
- [ ] Add JSDoc comments explaining inline vs. overlay use cases
- [ ] Remove props not relevant to inline widget (isExpanded, onExpandChange, height, width)
- [ ] Add props specific to inline use case (maxWidth, variant)
- [ ] Verify TypeScript compilation: `bun run build`

### Step 3: Extract Shared Components (DRY Principle)
- [ ] Create directory: `components/widget_components/shared/`
- [ ] Extract `QuestionPill` to `shared/question-pill.tsx`
  - Copy component code from existing widget
  - Import necessary dependencies (Button, cn utility)
  - Export component with proper TypeScript types
- [ ] Extract `SeedQuestionsCarousel` to `shared/seed-questions-carousel.tsx`
  - Copy component code with auto-scroll animation logic
  - Import Framer Motion animate function
  - Import QuestionPill from shared directory
  - Handle pause-on-hover functionality
  - Export component with TypeScript types
- [ ] Extract `SearchInputSection` to `shared/search-input-section.tsx`
  - Copy component code with glassmorphism input
  - Import SeedQuestionsCarousel from shared
  - Import icons (Sparkles, Search, ProfileBlank)
  - Handle form submission and question selection
  - Export component with TypeScript types
- [ ] Verify extracted components compile independently

### Step 4: Refactor Existing Widget to Use Shared Components
- [ ] Open `components/widget_components/complete/womens-world-widget.tsx`
- [ ] Remove inline definitions of QuestionPill, SeedQuestionsCarousel, SearchInputSection
- [ ] Add imports from `shared/` directory:
  ```typescript
  import { QuestionPill } from "../shared/question-pill";
  import { SeedQuestionsCarousel } from "../shared/seed-questions-carousel";
  import { SearchInputSection } from "../shared/search-input-section";
  ```
- [ ] Verify existing widget still works identically after refactoring
- [ ] Test in preview page: http://localhost:3000/admin/components/widgets/complete/womens-world-widget
- [ ] Verify no TypeScript errors: `bun run build`

### Step 5: Create Inline Widget Component
- [ ] Create file: `components/widget_components/complete/womens-world-inline-widget.tsx`
- [ ] Add "use client" directive at top
- [ ] Import shared components (SearchInputSection)
- [ ] Import PoweredByButton, icons
- [ ] Import types from `types.ts`
- [ ] Define default values (same as existing widget):
  ```typescript
  const DEFAULT_SEED_QUESTIONS_ROW_1 = [...]
  const DEFAULT_SEED_QUESTIONS_ROW_2 = [...]
  ```
- [ ] Create `WomensWorldInlineWidget` component:
  - Accept `WomensWorldInlineWidgetProps`
  - No expand/collapse state (always visible)
  - Use `maxWidth` prop for responsive width constraint
  - Apply `variant` prop for theme styling
  - Render compact header with title
  - Render SearchInputSection in content area
  - Render PoweredByButton in compact footer
  - Apply CSS classes for inline article styling
- [ ] Add inline-specific styling:
  - Subtle shadows (not shadow-xl)
  - Smaller border radius (rounded-2xl instead of rounded-3xl)
  - Responsive width (w-full with max-width)
  - Compact padding
  - Flatter visual hierarchy
- [ ] Verify TypeScript compilation: `bun run build`

### Step 6: Export Updates in index.ts
- [ ] Open `components/widget_components/index.ts`
- [ ] Add export for inline widget:
  ```typescript
  export { WomensWorldInlineWidget } from "./complete/womens-world-inline-widget";
  ```
- [ ] Add export for inline widget types:
  ```typescript
  export type { WomensWorldInlineWidgetProps } from "./types";
  ```
- [ ] Verify exports work by importing in test file

### Step 7: Update Convex Metadata
- [ ] Open `convex/components.ts`
- [ ] Update `completeWidgetsCount` from 4 to 5 (line 24)
- [ ] Add entry in `getCompleteWidgetsList` query after womens-world-widget:
  ```typescript
  {
    name: "womens-world-inline-widget",
    path: "components/widget_components/complete/womens-world-inline-widget.tsx",
    description: "Compact inline Q&A widget optimized for embedding between article paragraphs",
    phases: 1,
    componentCount: 4, // SearchInputSection + 2 carousels + PoweredByButton
  }
  ```
- [ ] Deploy Convex schema: `npx convex dev` (should auto-update)

### Step 8: Add Component Preview Metadata
- [ ] Open `convex/componentPreviews.ts`
- [ ] Add preview entry in `WIDGET_COMPONENTS_DATA` array:
  ```typescript
  {
    name: "womens-world-inline-widget",
    description: "Compact inline Q&A widget for article embedding with dual auto-scrolling carousels",
    category: "complete",
    code: `import { WomensWorldInlineWidget } from "@/components/widget_components/complete/womens-world-inline-widget"

export function WomensWorldInlineWidgetDemo() {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl">
        <p className="text-sm text-gray-600 mb-6 text-center">
          Compact inline widget optimized for article embedding
        </p>
        <WomensWorldInlineWidget
          onSubmit={(question) => console.log("Question submitted:", question)}
        />
      </div>
    </div>
  )
}`
  }
  ```

### Step 9: Add Demo Component
- [ ] Open `components/component-previews/widget-demos.tsx`
- [ ] Import inline widget: `import { WomensWorldInlineWidget } from "@/components/widget_components/complete/womens-world-inline-widget";`
- [ ] Add demo function (after WomensWorldWidgetDemo):
  ```typescript
  export function WomensWorldInlineWidgetDemo() {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-2xl">
          <p className="text-sm text-gray-600 mb-6 text-center">
            Compact inline widget optimized for article embedding
          </p>
          <WomensWorldInlineWidget
            onSubmit={(question) => console.log("Question submitted:", question)}
          />
        </div>
      </div>
    );
  }
  ```
- [ ] Add entry to WIDGET_DEMOS mapping:
  ```typescript
  "womens-world-inline-widget": WomensWorldInlineWidgetDemo,
  ```

### Step 10: Add Admin Preview Configuration UI
- [ ] Open `app/admin/components/widgets/complete/[widget]/page.tsx`
- [ ] Add configuration state for inline widget (after womensWorldConfig):
  ```typescript
  const [womensWorldInlineConfig, setWomensWorldInlineConfig] = useState({
    title: "✨ Woman's World Answers",
    placeholder: "Ask us your health questions",
    seedQuestionsRow1: [...],
    seedQuestionsRow2: [...],
    autoScrollInterval: 35000,
    maxWidth: 640,
    variant: "light" as const,
  });
  ```
- [ ] Add configuration UI in widget-specific config section:
  - Title input
  - Placeholder input
  - Seed Questions Row 1 textarea
  - Seed Questions Row 2 textarea
  - Auto-scroll interval slider (30-40 seconds)
  - Max width slider (400-800px)
  - Variant radio buttons (light/neutral/subtle)
- [ ] Add widget render in preview section:
  ```tsx
  {resolvedWidget === "womens-world-inline-widget" && (
    <WomensWorldInlineWidget
      title={womensWorldInlineConfig.title}
      placeholder={womensWorldInlineConfig.placeholder}
      seedQuestionsRow1={womensWorldInlineConfig.seedQuestionsRow1}
      seedQuestionsRow2={womensWorldInlineConfig.seedQuestionsRow2}
      autoScrollInterval={womensWorldInlineConfig.autoScrollInterval}
      maxWidth={womensWorldInlineConfig.maxWidth}
      variant={womensWorldInlineConfig.variant}
      onSubmit={(q) => console.log("Question:", q)}
    />
  )}
  ```

### Step 11: CSS Styling Updates (if needed)
- [ ] Open `app/globals.css`
- [ ] Add CSS custom properties for inline widget variant (if distinct from modal variant):
  ```css
  /* Women's World Inline Widget Variants */
  .womens-world-inline-light {
    background: linear-gradient(135deg, #fff7ed 0%, #fef3f2 100%);
  }
  .womens-world-inline-neutral {
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  }
  .womens-world-inline-subtle {
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  }
  ```
- [ ] Test styling in preview page

### Step 12: Run Validation Commands
- [ ] Stop dev server if running
- [ ] Run build: `bun run build`
  - Verify no TypeScript errors
  - Verify no build errors
  - Check bundle size (should be similar to existing widget)
- [ ] Start Convex dev: `npx convex dev` (in separate terminal)
  - Verify schema deploys successfully
  - Verify component metadata updates
- [ ] Start Next.js dev: `bun dev` (in separate terminal)
  - Navigate to admin components page
  - Verify inline widget appears in Widgets tab
  - Click "View Preview" on womens-world-inline-widget
  - Verify widget renders correctly
  - Test all interactive features
  - Verify no console errors
  - Test responsive behavior
  - Test keyboard navigation
  - Test auto-scroll carousels
  - Test question submission
  - Test configuration UI updates

## Testing Strategy

### Regression Testing

**Ensure Existing Widget Still Works:**
- [ ] Navigate to `http://localhost:3000/admin/components/widgets/complete/womens-world-widget`
- [ ] Verify widget renders with collapsed state
- [ ] Click "Ask AI" button to expand
- [ ] Verify expand animation works smoothly
- [ ] Test hover-pause on carousels
- [ ] Click seed question pills to populate input
- [ ] Type custom question and submit
- [ ] Click X button to collapse
- [ ] Verify all props still work (width, height, colors, text)
- [ ] Check that configuration UI updates widget correctly

**Verify Shared Components Work:**
- [ ] Inspect QuestionPill styling consistency across both widgets
- [ ] Verify SeedQuestionsCarousel auto-scroll timing identical
- [ ] Test pause-on-hover behavior identical
- [ ] Check SearchInputSection glassmorphism styling identical

### Integration Testing

**Admin Portal Integration:**
- [ ] Navigate to `/admin/components/widgets`
- [ ] Verify "Widgets" tab shows 5 complete widgets (was 4)
- [ ] Verify `womens-world-inline-widget` card displays
- [ ] Click "View Preview" button
- [ ] Verify preview page loads without errors
- [ ] Test configuration UI controls update widget
- [ ] Verify "Code" tab shows correct import statement

**Preview Page Integration:**
- [ ] Load preview page: `/admin/components/widgets/womens-world-inline-widget`
- [ ] Verify widget renders in preview section
- [ ] Test widget resizes with browser window (responsive)
- [ ] Verify code snippet displays in "Code" tab
- [ ] Test copy-to-clipboard functionality
- [ ] Verify syntax highlighting works

**Export Integration:**
- [ ] Create test file: `test-inline-widget-import.tsx`
- [ ] Import inline widget: `import { WomensWorldInlineWidget } from "@/components/widget_components";`
- [ ] Import types: `import type { WomensWorldInlineWidgetProps } from "@/components/widget_components";`
- [ ] Verify TypeScript recognizes exports
- [ ] Delete test file after verification

### Performance Testing

**Bundle Size Comparison:**
- [ ] Build production bundle: `bun run build`
- [ ] Compare bundle sizes before/after:
  - Check `.next/static/chunks/` directory
  - Look for widget chunk files
  - Verify inline widget bundle ≈ existing widget bundle (should be similar or smaller)
  - Inline should be ~5-15KB smaller due to removed Framer Motion expand/collapse animations

**Render Performance:**
- [ ] Open preview page in browser
- [ ] Open DevTools → Performance tab
- [ ] Record page load and interaction
- [ ] Verify no layout thrashing
- [ ] Verify carousel animations at 60fps
- [ ] Check Time to Interactive (TTI) < 2 seconds

**Memory Usage:**
- [ ] Open preview page in browser
- [ ] Open DevTools → Memory tab
- [ ] Take heap snapshot
- [ ] Interact with widget (expand, collapse, carousel, input)
- [ ] Take another heap snapshot
- [ ] Verify no memory leaks (heap size should stabilize)

### Accessibility Testing

- [ ] Keyboard Navigation:
  - [ ] Tab through all interactive elements (pills, input, submit button)
  - [ ] Press Enter on question pills
  - [ ] Submit form with Enter key
  - [ ] Focus visible on all elements
- [ ] Screen Reader:
  - [ ] Turn on VoiceOver (Mac) or NVDA (Windows)
  - [ ] Verify all elements have proper labels
  - [ ] Verify semantic HTML structure
  - [ ] Verify ARIA attributes on custom components
- [ ] Color Contrast:
  - [ ] Verify text meets WCAG AA standards (4.5:1 for normal text)
  - [ ] Verify gradient text is readable
  - [ ] Test in light and dark modes (if applicable)

## Acceptance Criteria

**Functionality:**
- [x] Plan document created with comprehensive steps
- [ ] Inline widget component created and renders correctly
- [ ] Shared components extracted and work in both widget variants
- [ ] Type definitions added for WomensWorldInlineWidgetProps
- [ ] Exports updated in index.ts
- [ ] Convex metadata updated (completeWidgetsCount: 5)
- [ ] Component preview metadata added
- [ ] Demo component added to widget-demos.tsx
- [ ] Admin preview page configuration UI added
- [ ] All interactive features work (carousels, input, submit)
- [ ] No functionality broken in existing widget

**Quality:**
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] No runtime errors or warnings in console
- [ ] Code follows React best practices (DRY, single responsibility)
- [ ] Shared components eliminate duplication
- [ ] Props interface is clean and well-documented

**Performance:**
- [ ] Bundle size similar or smaller than existing widget
- [ ] Carousel animations run at 60fps
- [ ] No layout thrashing or jank
- [ ] Time to Interactive < 2 seconds

**Integration:**
- [ ] Preview page renders inline widget correctly
- [ ] Configuration UI controls work
- [ ] Widget appears in admin components list
- [ ] Exports from index.ts work correctly
- [ ] Responsive behavior works (100% width with max-width)

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader announcements are clear
- [ ] Focus visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Semantic HTML structure

**Documentation:**
- [ ] JSDoc comments added to WomensWorldInlineWidgetProps
- [ ] Inline vs. overlay use cases documented
- [ ] Responsive behavior documented
- [ ] Integration examples provided

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

### Build Validation
```bash
# Build Next.js app to validate no TypeScript or build errors
bun run build
```

**Expected Output:**
- ✓ Compiled successfully
- No TypeScript errors
- No build errors
- Bundle size similar to before (inline widget should add minimal overhead)

### Convex Deployment
```bash
# Deploy Convex schema and functions (run in background)
npx convex dev
```

**Expected Output:**
- ✓ Schema deployed successfully
- ✓ Component metadata updated
- ✓ Functions deployed

### Dev Server Validation
```bash
# Start Next.js dev server and manually validate all widgets work
bun dev
```

**Manual Validation Steps:**
1. Navigate to http://localhost:3000/admin/components/widgets
2. Verify "Widgets" tab shows 5 complete widgets
3. Verify `womens-world-inline-widget` card is visible
4. Click "View Preview" on `womens-world-inline-widget`
5. Verify inline widget renders in preview
6. Test all configuration UI controls
7. Test widget interactivity (carousels, input, submit)
8. Navigate to http://localhost:3000/admin/components/widgets/complete/womens-world-widget
9. Verify existing widget still works identically (regression test)
10. Test expand/collapse animations still smooth
11. Test all existing features still functional

### Manual Validation Checklist

**Inline Widget:**
- [ ] Renders in compact inline layout
- [ ] No expand/collapse button (always visible)
- [ ] Glassmorphism input works
- [ ] Both carousels auto-scroll independently
- [ ] Hover pauses carousel animation
- [ ] Clicking question pill populates input
- [ ] Typing custom question works
- [ ] Submit button appears when input has text
- [ ] Pressing Enter submits question
- [ ] PoweredByButton renders in footer
- [ ] Widget is responsive (adjusts to container width)
- [ ] maxWidth prop constrains width correctly
- [ ] variant prop changes theme styling
- [ ] No console errors or warnings

**Existing Widget (Regression Test):**
- [ ] Still renders with collapsed state
- [ ] Expand animation works smoothly
- [ ] All features work identically to before refactoring
- [ ] Configuration UI updates widget correctly
- [ ] No visual changes or regressions

**Shared Components:**
- [ ] QuestionPill styling consistent across both widgets
- [ ] SeedQuestionsCarousel timing identical
- [ ] SearchInputSection layout works in both contexts
- [ ] No duplicate code between widgets

**Admin Portal:**
- [ ] Inline widget appears in Widgets tab
- [ ] Preview page loads without errors
- [ ] Configuration UI updates widget props
- [ ] Code tab shows correct import statement
- [ ] Copy-to-clipboard works

**Accessibility:**
- [ ] Tab through all interactive elements
- [ ] Focus visible on all elements
- [ ] Press Enter on pills to select
- [ ] Submit form with Enter key
- [ ] VoiceOver/NVDA announces elements correctly
- [ ] Color contrast meets WCAG AA

**Performance:**
- [ ] Carousel animations smooth (60fps)
- [ ] No layout thrashing
- [ ] Page load time reasonable (<2s)
- [ ] No memory leaks after interaction

### Performance Validation

**Bundle Size Comparison:**
```bash
# Check bundle sizes before and after
ls -lh .next/static/chunks/pages/admin/components/widgets/
```

**Expected:**
- Inline widget bundle similar to existing widget
- Total bundle size increase minimal (<10KB)

**Render Performance:**
- Open Chrome DevTools → Performance
- Record page load and interaction
- Verify no long tasks (>50ms)
- Verify carousel animations at 60fps
- Verify Time to Interactive < 2 seconds

## Notes

### Refactoring Safety

**Test After Each Major Change:**
- Step 4: After refactoring existing widget to use shared components
- Step 5: After creating inline widget component
- Step 10: After adding admin configuration UI
- Step 12: After running all validation commands

**Commit Incrementally:**
1. Commit after extracting shared components (Step 3)
2. Commit after refactoring existing widget (Step 4)
3. Commit after creating inline widget (Step 5-6)
4. Commit after updating metadata and previews (Steps 7-9)
5. Commit after adding admin UI (Step 10)

**Keep Functional Changes Separate from Refactoring:**
- Refactoring (Steps 3-4): Extract shared components, update imports
- New Features (Steps 5-6): Create inline widget variant
- Integration (Steps 7-10): Wire up preview pages and metadata

### Future Chores

**Potential Follow-Up Improvements:**
1. **Create More Widget Variations:**
   - Sidebar variant (vertical layout)
   - Mobile-optimized variant (touch-friendly)
   - Minimal variant (text-only, no carousels)

2. **Enhance Shared Components:**
   - Add more carousel configuration options (speed, direction, easing)
   - Create configurable theme system for consistent styling
   - Add animation presets (subtle, normal, dramatic)

3. **Performance Optimizations:**
   - Implement virtual scrolling for long question lists
   - Add image lazy loading for widget backgrounds
   - Create lightweight "core" bundle with feature flags

4. **Analytics Integration:**
   - Track question submissions
   - Measure carousel engagement (hover rate, click-through)
   - A/B test widget placement and styling

5. **Accessibility Enhancements:**
   - Add reduced motion mode for carousel animations
   - Implement high contrast mode
   - Add voice input support

### Related Widgets

**Similar Patterns:**
- **Rufus Widget**: Also has collapsed/expanded states, could benefit from inline variation
- **NYT Chat Widget**: Dark theme variant, could create light inline variant
- **Onboarding Widget**: Multi-phase flow, could create single-phase inline variant

**Shared Patterns to Extract:**
- Collapsed/expanded state management (used by 3 widgets)
- Carousel auto-scroll animation (used by 2 widgets)
- Glassmorphism input styling (used by 2 widgets)
- PoweredByButton footer (used by all widgets)

### Embeddable Widget Considerations

**For Future Embeddable Builds:**
1. **Bundle Configuration:**
   - Create separate entry point: `build:inline-widget`
   - Configure tree-shaking to remove admin-only code
   - Use code splitting to load carousels lazily

2. **Distribution:**
   - Generate standalone JS bundle for CDN hosting
   - Create npm package for React apps
   - Provide vanilla JS wrapper for non-React sites

3. **Versioning:**
   - Use semantic versioning for widget API
   - Maintain backward compatibility for embedded widgets
   - Provide migration guides for breaking changes

4. **Documentation:**
   - Create integration guide for publishers
   - Document responsive breakpoints and behavior
   - Provide customization examples and recipes
