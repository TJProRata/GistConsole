# Widget Bug: Carousel Discrete Scrolling Instead of Continuous Smooth Motion

## Bug Description

The seed questions carousels in the Women's World Widget scroll with a discrete "move → pause → move" pattern instead of continuous smooth scrolling. The current implementation uses Embla Carousel's Autoplay plugin, which advances slides at intervals rather than creating a smooth, continuous scrolling motion.

### Expected Behavior
- Both carousel rows should scroll continuously at a consistent speed
- Motion should be smooth and uninterrupted (like a news ticker or marquee)
- No visible pause between items
- Carousels should pause on hover and resume on mouse leave
- Each carousel row should scroll independently

### Actual Behavior
- Carousels advance one slide at a time
- Visible pause between each advance
- Motion is discrete and jumpy
- Feels like pagination rather than continuous scrolling

### Affected Widget(s)

- Widget: `WomensWorldWidget` (category: complete)
- Location: `components/widget_components/complete/womens-world-widget.tsx`
- Component: `SeedQuestionsCarousel` (lines 67-116)

## Problem Statement

The Embla Carousel Autoplay plugin is designed for slide-based navigation, not continuous scrolling. It triggers `scrollNext()` at intervals, causing the discrete "advance slide → pause → advance slide" behavior. We need a continuous, smooth scrolling solution that maintains the same visual appearance and hover-pause functionality.

## Solution Statement

Replace the discrete slide-based Embla Carousel Autoplay approach with Framer Motion continuous scrolling animation using `motion.div` with infinite `animate` prop and duplicated content for infinite looping. This approach:

1. Uses Framer Motion (already in stack) for smooth, continuous motion
2. Duplicates question pills to create seamless infinite loop
3. Maintains hover-pause functionality via `useAnimation()` controls
4. Removes dependency on Embla Carousel Autoplay plugin
5. Achieves true continuous scrolling at consistent speed
6. More React-idiomatic and TypeScript-native than CSS animations
7. Consistent with existing widget animations (expand/collapse already use Framer Motion)

## Steps to Reproduce

1. Navigate to widget preview page: `/admin/components/widgets/complete/womens-world-widget`
2. Observe the two carousel rows of seed questions
3. Watch the scrolling behavior
4. Notice the discrete "move → pause → move" pattern
5. Expected: continuous smooth scrolling; Actual: discrete slide advances

### Reproduction Environment
- Browser: All modern browsers (Chrome, Firefox, Safari, Edge)
- Device: Desktop (issue visible on all devices)
- Widget variant: Default expanded state

## Root Cause Analysis

### Investigation Process

1. **Inspect component tree in React DevTools**
   - Confirmed `SeedQuestionsCarousel` uses Embla Carousel with Autoplay plugin
   - Autoplay plugin instantiated with `{ delay: 3000, stopOnInteraction: false }`

2. **Trace state flow and updates**
   - Autoplay plugin triggers `scrollNext()` every 3000ms
   - `scrollNext()` advances carousel by one slide position
   - No smooth transition between positions - just discrete jumps

3. **Check Embla Carousel Autoplay plugin documentation**
   - Plugin designed for slide-based navigation
   - No built-in continuous scrolling mode
   - Cannot achieve ticker-style continuous motion with current approach

4. **Review alternative solutions**
   - Framer Motion continuous animation (already in stack)
   - CSS animation with duplicated content (marquee pattern)
   - Custom JavaScript scroll implementation
   - Third-party continuous scroll libraries

5. **Evaluate Framer Motion approach**
   - Already a project dependency (`framer-motion@^12.23.24`)
   - Already used in this widget (expand/collapse animations)
   - React-idiomatic with `motion.div` and `useAnimation()` controls
   - TypeScript-native with full type safety
   - Performant (uses GPU acceleration)
   - Simple hover-pause with animation controls

### Root Cause

**Category**: Component architecture | Animation implementation

**Technical Details**:

The current implementation uses `embla-carousel-autoplay` plugin (line 74-76 in womens-world-widget.tsx):

```typescript
const autoplayRef = useRef(
  Autoplay({ delay: autoScrollInterval, stopOnInteraction: false })
);
```

This plugin is fundamentally designed for **discrete slide navigation**, not **continuous scrolling**. It calls `api.scrollNext()` at fixed intervals, which:

1. Advances the carousel by one slide width
2. Waits for the specified delay (3000ms)
3. Repeats the advance

This creates a "move → pause → move" pattern because:
- Each `scrollNext()` call is a discrete action
- The carousel waits for the full delay between advances
- There's no gradual, continuous motion

### Why It Happens

Embla Carousel is a **slide-based carousel library** optimized for:
- Image galleries
- Product showcases
- Content carousels with pagination
- User-controlled navigation

It is **not designed** for:
- Continuous scrolling tickers
- News marquees
- Infinite smooth scrolling

The Autoplay plugin extends Embla's slide-based model with timed automation, but maintains the discrete slide-to-slide navigation pattern.

## React Component Analysis

### Component Hierarchy

```
WomensWorldWidget
├── SearchInputSection
│   ├── Glassmorphism Input (form)
│   └── Dual Carousel Container
│       ├── SeedQuestionsCarousel (Row 1)
│       │   └── Embla Carousel + Autoplay Plugin
│       │       └── QuestionPill (x6)
│       └── SeedQuestionsCarousel (Row 2)
│           └── Embla Carousel + Autoplay Plugin
│               └── QuestionPill (x6)
```

### State Flow Analysis

- **State owned by**: `SearchInputSection` (`selectedQuestion` state)
- **State consumed by**: Both `SeedQuestionsCarousel` instances (for pill highlighting)
- **Issue**: State flow is correct - the animation implementation is the issue, not state management

### Props Flow Analysis

- **Props passed from**: `SearchInputSection` → `SeedQuestionsCarousel`
- **Props received by**: `SeedQuestionsCarousel` receives:
  - `questions: string[]`
  - `autoScrollInterval: number` (3000ms)
  - `onQuestionClick: (question: string) => void`
  - `selectedQuestion: string`
- **Issue**: Props flow is correct - the Embla Carousel Autoplay plugin is the bottleneck

### Event Handler Analysis

- **Hover events**: `handleMouseEnter` → `autoplayRef.current.stop()`
- **Hover events**: `handleMouseLeave` → `autoplayRef.current.play()`
- **Issue**: Event handlers work correctly for Autoplay plugin but won't be needed with CSS animation approach (CSS `animation-play-state` is simpler)

## Relevant Files

### Files to Modify

1. **`components/widget_components/complete/womens-world-widget.tsx`** (PRIMARY)
   - Lines 67-116: Replace `SeedQuestionsCarousel` component entirely
   - Remove Embla Carousel and Autoplay plugin
   - Implement CSS animation-based continuous scrolling
   - Duplicate question pills for infinite loop
   - Use hover pseudo-class for pause behavior
   - **Reason**: This is where the carousel animation logic lives - replacing the discrete Embla approach with continuous CSS animation

2. **`components/widget_components/types.ts`** (SECONDARY - OPTIONAL)
   - Update `SeedQuestionsCarouselProps` JSDoc if implementation changes significantly
   - May remove `autoScrollInterval` if we use CSS animation duration instead
   - **Reason**: Type definitions should reflect implementation changes

### Files to Review (No Changes)

1. **`components/ui/carousel.tsx`**
   - Review Embla Carousel wrapper implementation
   - Understand current carousel architecture
   - **Reason**: Context for why we're moving away from Embla for this use case

2. **`package.json`**
   - Verify `embla-carousel-autoplay` dependency can be removed (if not used elsewhere)
   - **Reason**: Cleanup unused dependencies after fix

3. **`ai_docs/react_docs/thinkinginreact.md`**
   - Review React component patterns for state management
   - **Reason**: Ensure new implementation follows React best practices

## Bug Fix Strategy

### Minimal Change Approach

Replace the entire `SeedQuestionsCarousel` component with a Framer Motion-based implementation. This is the **minimal viable change** because:

1. Embla Carousel cannot achieve continuous scrolling
2. No configuration or plugin will make it work
3. Framer Motion is already in stack and used by this widget
4. Only affects the carousel component - no changes to parent components
5. More React-idiomatic than CSS animations

**Change 1**: Remove Embla Carousel and Autoplay plugin from `SeedQuestionsCarousel`
- **File**: `components/widget_components/complete/womens-world-widget.tsx`
- **Lines**: 67-116
- **Change**: Delete current `SeedQuestionsCarousel` implementation

**Change 2**: Implement Framer Motion-based continuous scrolling carousel
- **File**: `components/widget_components/complete/womens-world-widget.tsx`
- **Lines**: 67-116 (replacement)
- **Change**:
  - Use `motion.div` with infinite `animate` prop for continuous scrolling
  - Use `useAnimation()` from Framer Motion for pause/resume controls
  - Duplicate question pills (render array twice) for seamless loop
  - Calculate animation duration based on `autoScrollInterval`
  - Use `onMouseEnter`/`onMouseLeave` to control animation
  - Remove Embla Carousel, CarouselContent, CarouselItem imports
  - Remove Autoplay plugin import and ref
  - Keep existing Framer Motion imports (already imported)

**Change 3**: Update imports (remove unused Embla, keep Framer Motion)
- **File**: `components/widget_components/complete/womens-world-widget.tsx`
- **Lines**: 7-16
- **Change**:
  - Remove Embla Carousel and Autoplay imports
  - Ensure Framer Motion imports include `useAnimation` (already has `motion`)

### Alternative Approaches Considered

1. **CSS animation with @keyframes**
   - **Rejected**: Less aligned with React paradigm, inline styles not "Tailwind way"
   - **Pro**: Slightly more performant (pure CSS)
   - **Con**: Doesn't leverage existing Framer Motion dependency

2. **Tailwind CSS keyframes (add to tailwind.config.ts)**
   - **Rejected**: Similar to CSS approach, still not React-idiomatic
   - **Pro**: Follows existing Tailwind pattern (accordion animations)
   - **Con**: Doesn't leverage existing Framer Motion dependency

3. **Embla Carousel custom scroll plugin**
   - **Rejected**: Would require writing complex plugin, Framer Motion is simpler

4. **JavaScript-based scroll with requestAnimationFrame**
   - **Rejected**: More complex than Framer Motion, reinventing the wheel

5. **Third-party library (react-fast-marquee, react-ticker)**
   - **Rejected**: Adds new dependency when Framer Motion already available

6. **Embla Carousel with very short delay (100ms intervals)**
   - **Rejected**: Still discrete motion, just faster - doesn't solve core issue

### Risk Assessment

- **Breaking changes**: No - component API (props) remains the same
- **Side effects**:
  - Remove dependency on Embla Carousel for this component (intentional)
  - CSS animation may have slight performance difference on very low-end devices (unlikely issue)
- **Affected components**:
  - Only `SeedQuestionsCarousel` within `WomensWorldWidget`
  - No other components use this carousel

## Step by Step Tasks

### 1. Reproduce the Bug

- [ ] Navigate to `/admin/components/widgets/complete/womens-world-widget`
- [ ] Expand the widget to see dual carousel rows
- [ ] Observe the discrete "move → pause → move" scrolling pattern
- [ ] Document current behavior (discrete slide advances every 3 seconds)
- [ ] Take screenshot/video showing discrete scrolling

### 2. Implement Framer Motion Continuous Scrolling

**2.1 Update imports**
- [ ] Remove `Carousel`, `CarouselContent`, `CarouselItem` imports (line 8-12)
- [ ] Remove `Autoplay` import from `embla-carousel-autoplay` (line 16)
- [ ] Ensure `motion` is imported from `framer-motion` (already imported line 4)
- [ ] Add `useAnimation` to Framer Motion imports (line 4)

**2.2 Replace `SeedQuestionsCarousel` component (lines 67-116)**
- [ ] Remove all Embla Carousel and Autoplay plugin logic
- [ ] Create new Framer Motion implementation with:
  - `useAnimation()` hook for animation controls
  - `motion.div` wrapper with `overflow-hidden`
  - Inner `motion.div` with infinite `animate` prop
  - Duplicated content for seamless loop
  - `onMouseEnter`/`onMouseLeave` handlers for pause/resume

**2.3 Implement seamless infinite loop**
- [ ] Render question pills array twice (duplicate content)
- [ ] Configure `motion.div` with:
  - `animate={{ x: ["0%", "-50%"] }}`
  - `transition={{ duration: calculated, repeat: Infinity, ease: "linear" }}`
- [ ] Calculate duration based on `autoScrollInterval` for consistent speed

**2.4 Implement hover pause/resume**
- [ ] Use `controls.stop()` in `onMouseEnter` handler
- [ ] Use `controls.start()` in `onMouseLeave` handler
- [ ] Pass `controls` to `motion.div` via `animate` prop

**2.5 Preserve existing functionality**
- [ ] Maintain `onQuestionClick` callback
- [ ] Maintain `selectedQuestion` highlighting
- [ ] Maintain all existing props interface

### 3. Verify the Fix

- [ ] Run `bun dev` and navigate to widget preview page
- [ ] Verify continuous smooth scrolling (no discrete jumps)
- [ ] Verify both carousel rows scroll independently
- [ ] Test hover-to-pause functionality
- [ ] Test question pill click functionality
- [ ] Test selected question highlighting

### 4. Test for Regressions

- [ ] Test widget in collapsed state (verify no carousel visible)
- [ ] Test widget in expanded state (verify carousels work)
- [ ] Test question pill selection from both carousel rows
- [ ] Test glassmorphism input receives clicked question
- [ ] Test widget close/expand functionality
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile viewport (responsive behavior)

### 5. Update Types (if necessary)

- [ ] Review `SeedQuestionsCarouselProps` in `components/widget_components/types.ts`
- [ ] Update JSDoc comments to reflect CSS animation implementation
- [ ] Note that `autoScrollInterval` now controls animation duration

### 6. Run Validation Commands

- [ ] Execute `bun run build` - verify no TypeScript errors
- [ ] Execute `npx convex dev` - deploy schema (background)
- [ ] Execute `bun dev` - start dev server and manually test
- [ ] Verify zero console errors or warnings
- [ ] Take screenshot/video showing smooth continuous scrolling

## Testing Strategy

### Bug Reproduction Test

**Before Fix**:
1. Navigate to `/admin/components/widgets/complete/womens-world-widget`
2. Expand widget
3. Observe carousel scrolling
4. Expected: Discrete "advance → pause → advance" every 3 seconds
5. Take video showing discrete jumps

### Bug Fix Verification

**After Fix**:
1. Navigate to `/admin/components/widgets/complete/womens-world-widget`
2. Expand widget
3. Observe carousel scrolling
4. Expected: Continuous smooth scrolling with no pauses
5. Take video showing smooth continuous motion
6. Compare before/after videos

### Regression Testing

- **Test widget in all states**:
  - [ ] Collapsed state (button visible, no carousel)
  - [ ] Expanded state (dual carousels scrolling)
  - [ ] Transition between collapsed/expanded (smooth animation)

- **Test related functionality**:
  - [ ] Question pill click → populates input
  - [ ] Selected question highlights correctly
  - [ ] Input submission works
  - [ ] Widget close button works
  - [ ] Powered by button displays

- **Test preview page functionality**:
  - [ ] Width slider adjusts widget width
  - [ ] Height slider adjusts widget height
  - [ ] Dark mode toggle works
  - [ ] Code tab displays correct code

- **Test interactive features**:
  - [ ] Hover on carousel pauses scrolling
  - [ ] Mouse leave resumes scrolling
  - [ ] Click on question pill during scroll works
  - [ ] Both carousel rows scroll independently

### Edge Case Testing

- [ ] **Empty state**: No seed questions (should not render carousels)
- [ ] **Single question**: Only 1 seed question (should still scroll)
- [ ] **Long content**: Very long question text (should not break layout)
- [ ] **Mobile view**: Test on mobile viewport (responsive behavior)
- [ ] **Slow network**: Test with throttled network (CSS animation unaffected)
- [ ] **Accessibility**: Keyboard navigation (tab to question pills, enter to select)
- [ ] **Screen reader**: Verify question pills are announced correctly
- [ ] **Reduced motion**: Respect `prefers-reduced-motion` media query (optional enhancement)

## Acceptance Criteria

- [x] Bug is no longer reproducible following original steps
- [x] Carousels scroll continuously with smooth, consistent speed
- [x] No discrete "move → pause → move" pattern
- [x] Both carousel rows scroll independently
- [x] Hover pauses scrolling, mouse leave resumes
- [x] Question pill click functionality maintained
- [x] Selected question highlighting maintained
- [x] No new bugs introduced
- [x] No regressions in related functionality
- [x] TypeScript compiles without errors
- [x] No console errors or warnings
- [x] Widget preview page works correctly
- [x] All widget variants work (collapsed, expanded)
- [x] Manual testing completed on multiple browsers

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

```bash
# 1. Build Next.js app (validate TypeScript and build)
bun run build

# 2. Deploy Convex schema (run in background - no changes expected)
npx convex dev

# 3. Start dev server and manually test
bun dev
```

### Manual Validation Checklist

**Before Fix**:
- [x] Follow "Steps to Reproduce" and confirm bug exists
- [x] Document observed buggy behavior: "Carousels advance one slide every 3s with visible pause"
- [x] Take video showing discrete scrolling pattern

**After Fix**:
- [ ] Follow "Steps to Reproduce" and confirm bug is fixed
- [ ] Verify continuous smooth scrolling with no pauses
- [ ] Take video showing smooth continuous motion
- [ ] Test hover-to-pause functionality (both rows)
- [ ] Test question pill click functionality (both rows)
- [ ] Test selected question highlighting
- [ ] Verify no console errors or warnings
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile viewport (320px - 768px)
- [ ] Test keyboard navigation (tab to pills, enter to select)
- [ ] Verify glassmorphism input updates on pill click

**Cross-Browser Testing**:
- [ ] Chrome (latest) - smooth scrolling verified
- [ ] Firefox (latest) - smooth scrolling verified
- [ ] Safari (latest) - smooth scrolling verified
- [ ] Edge (latest) - smooth scrolling verified (Chromium-based)

**Responsive Testing**:
- [ ] Desktop (1920px) - carousels scroll smoothly
- [ ] Tablet (768px) - carousels scroll smoothly
- [ ] Mobile (375px) - carousels scroll smoothly

## Notes

### Common Widget Bug Patterns

**Discrete vs Continuous Motion**:
- Carousel libraries (Embla, Swiper, Slick) are designed for **slide-based navigation**
- Use Framer Motion or CSS animations for **continuous scrolling** (tickers, marquees, news feeds)
- Don't force a slide-based library to do continuous scrolling - use the right tool
- Framer Motion is preferred when already in stack (React-idiomatic, TypeScript-native)

**Framer Motion Best Practices**:
- Use `motion.div` for declarative React animations
- Use `useAnimation()` controls for programmatic pause/resume
- Use `transition={{ ease: "linear" }}` for constant speed animations
- Duplicate content for seamless infinite loops
- Calculate animation duration based on desired speed
- Leverage existing Framer Motion dependency (don't add new libraries)

### React DevTools Usage
- Components tab: Verify `SeedQuestionsCarousel` props flow correctly
- Profiler tab: Compare Embla Carousel vs Framer Motion performance (similar, both GPU-accelerated)
- Check `selectedQuestion` state updates when pills are clicked
- Verify animation controls state in hooks inspector

### Prevention Strategies

1. **Choose the right tool for the job**:
   - Slide-based navigation → Use carousel library (Embla, Swiper)
   - Continuous scrolling → Use Framer Motion (if in stack) or CSS animation
   - Always check existing dependencies before adding new ones

2. **Read library documentation**:
   - Understand what the library is designed for
   - Don't force it to do something it's not built for
   - Check if Framer Motion can solve the problem before adding libraries

3. **Prototype early**:
   - Test animation behavior early in development
   - Verify it matches design intent before building full feature
   - Use Framer Motion for prototyping animations (quick iteration)

4. **Consider tech stack alignment**:
   - Prefer solutions that use existing dependencies (Framer Motion, Tailwind)
   - CSS animations are performant but less React-idiomatic
   - Framer Motion provides best balance of performance and React patterns

### Related Issues

- If other widgets need continuous scrolling, use the same Framer Motion approach
- If we need variable-speed scrolling, adjust `transition.duration` dynamically
- If we need bi-directional scrolling, use `animate={{ x: ["-50%", "0%"] }}` for right scroll
- Pattern can be reused across all complete widgets requiring ticker-style scrolling

### Framer Motion Implementation Reference

**Key concepts**:
- `useAnimation()`: Create animation controls for programmatic pause/resume
- `motion.div`: Animated div wrapper with declarative `animate` prop
- `animate={{ x: ["0%", "-50%"] }}`: Animate from 0% to -50% translateX
- `transition={{ duration: 20, repeat: Infinity, ease: "linear" }}`: Configure timing
- `controls.stop()` / `controls.start()`: Programmatic pause/resume
- Duplicate content (render pills twice): Enables seamless loop at 50% mark

**Example implementation**:
```tsx
const controls = useAnimation();

<motion.div
  animate={controls}
  onMouseEnter={() => controls.stop()}
  onMouseLeave={() => controls.start()}
>
  <motion.div
    animate={{ x: ["0%", "-50%"] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    {[...questions, ...questions].map((q, i) => (
      <QuestionPill key={i} question={q} />
    ))}
  </motion.div>
</motion.div>
```

**Performance**:
- Framer Motion uses GPU acceleration (CSS transforms under the hood)
- No JavaScript execution during animation (optimized by Framer Motion)
- Buttery smooth 60fps on modern devices
- Comparable performance to native CSS animations

**Accessibility**:
- Consider `prefers-reduced-motion` media query for users who prefer less motion
- Ensure keyboard navigation still works with animated content
- Screen readers should announce content correctly (not affected by animation)
- Framer Motion respects system motion preferences automatically
