# Bug: Auto-scroll Speed Toggle Unresponsive in Women's World Widget

## Bug Description
The auto-scroll interval slider in the admin preview page at `http://localhost:3000/admin/components/widgets/complete/womens-world-widget` is unresponsive. When users adjust the slider to change the carousel auto-scroll speed (1-10 seconds), the carousel animation speed does not change. The carousel continues to scroll at a fixed 20-second duration regardless of the `autoScrollInterval` prop value.

**Expected behavior:** Adjusting the slider should dynamically change the carousel scroll speed in real-time.

**Actual behavior:** The carousel scroll speed remains constant at 20 seconds, ignoring the `autoScrollInterval` prop entirely.

## Problem Statement
The `SeedQuestionsCarousel` component in `womens-world-widget.tsx` uses a hardcoded `scrollDuration = 20` constant for the animation and never references the `autoScrollInterval` prop that is passed down from the parent widget and admin preview page. The prop is properly wired through the component tree but is not actually used in the animation logic.

## Solution Statement
Replace the hardcoded `scrollDuration` constant with a calculated duration based on the `autoScrollInterval` prop. The carousel should use the prop value to determine how long it takes for one complete scroll cycle, making the animation speed responsive to user configuration changes.

## Steps to Reproduce
1. Navigate to `http://localhost:3000/admin/components/widgets/complete/womens-world-widget`
2. Sign in as an admin user
3. Expand the widget by clicking the collapsed button
4. In the "Widget Configuration (Preview Only)" section, click the "Behavior" tab
5. Observe the current "Auto-scroll Interval" value (default: 3000ms)
6. Adjust the slider to change the interval (e.g., from 3000ms to 1000ms or 10000ms)
7. Observe the carousel animation speed
8. **BUG:** The carousel continues scrolling at the same fixed speed regardless of slider value

## Root Cause Analysis
**File:** `components/widget_components/complete/womens-world-widget.tsx`

**Line 71:** `const scrollDuration = 20;` - Hardcoded constant

**Line 79-86:** The `animate()` function uses `scrollDuration` directly:
```typescript
animationRef.current = animate(
  carouselRef.current,
  { x: ["0%", "-50%"] },
  {
    duration: scrollDuration, // ❌ Uses hardcoded value
    repeat: Infinity,
    ease: "linear",
  }
);
```

**Problem:** The `autoScrollInterval` prop (lines 62, 138, 204, 210) is passed through the component tree but never used in the animation calculation.

**Component Tree:**
1. `WomensWorldWidget` receives `autoScrollInterval` (line 232: default 3000)
2. Props passed to `SearchInputSection` (line 346)
3. Props passed to `SeedQuestionsCarousel` (lines 204, 210)
4. `SeedQuestionsCarousel` receives prop but uses hardcoded `scrollDuration` instead

## Relevant Files
Use these files to fix the bug:

- **`components/widget_components/complete/womens-world-widget.tsx`** (PRIMARY FIX)
  - Line 71: Remove hardcoded `scrollDuration` constant
  - Line 60-94: Update `SeedQuestionsCarousel` component to use `autoScrollInterval` prop
  - Line 77-94: Update `useEffect` to recalculate animation when `autoScrollInterval` changes
  - Calculate scroll duration based on `autoScrollInterval` prop value

- **`components/widget_components/types.ts`** (REFERENCE ONLY)
  - Lines 168, 179: Type definitions confirm `autoScrollInterval` is number (milliseconds)
  - Validates prop is properly typed throughout component tree

- **`app/admin/components/widgets/complete/[widget]/page.tsx`** (VALIDATION)
  - Lines 229-238: Admin slider that controls `autoScrollInterval` state
  - Lines 342-346: Props passed to `WomensWorldWidget` component
  - Used to validate fix works end-to-end

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update SeedQuestionsCarousel to Use autoScrollInterval Prop
- Remove the hardcoded `scrollDuration` constant (line 71)
- Calculate scroll duration dynamically based on `autoScrollInterval` prop
- Formula: Use `autoScrollInterval` directly as the duration in seconds (convert ms to seconds)
- Example: 3000ms → 3 seconds for one complete scroll cycle
- Replace `duration: scrollDuration` with calculated value in animate() call

### Step 2: Add autoScrollInterval to useEffect Dependencies
- Update the `useEffect` hook (lines 77-94) to include `autoScrollInterval` in the dependency array
- This ensures the animation restarts with the new duration when the prop changes
- Current dependencies: `[scrollDuration]` → New: `[autoScrollInterval]`
- The animation cleanup and re-initialization will handle smooth transitions

### Step 3: Test Animation Speed Changes
- Start Convex dev server: `npx convex dev`
- Start Next.js dev server: `bun dev`
- Navigate to `http://localhost:3000/admin/components/widgets/complete/womens-world-widget`
- Expand the widget
- Open "Behavior" tab in configuration panel
- Test slider at multiple values:
  - 1000ms (1 second) - should scroll very fast
  - 3000ms (3 seconds) - default speed
  - 5000ms (5 seconds) - medium speed
  - 10000ms (10 seconds) - slow speed
- Verify carousel speed changes immediately when slider is adjusted
- Verify both carousel rows scroll at the same speed
- Verify hover-to-pause still works correctly

### Step 4: Test Edge Cases
- Test minimum value (1000ms) - verify animation doesn't break
- Test maximum value (10000ms) - verify animation still smooth
- Test rapid slider adjustments - verify no animation stutter or memory leaks
- Test with collapsed/expanded state changes - verify animation restarts correctly
- Test with different seed question arrays (3 questions vs 6 questions)

### Step 5: Validate TypeScript Compilation
- Run build command to ensure no TypeScript errors
- Verify prop types are correctly used
- Ensure no unused variables or imports

### Step 6: Run Validation Commands
- Execute all validation commands listed below
- Verify zero TypeScript errors
- Verify zero build errors
- Verify bug is completely fixed with visual confirmation

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and reproduce the bug to verify it's fixed
- Visual validation steps:
  1. Navigate to `http://localhost:3000/admin/components/widgets/complete/womens-world-widget`
  2. Expand widget and click "Behavior" tab
  3. Set slider to 1000ms - verify fast scroll speed
  4. Set slider to 10000ms - verify slow scroll speed
  5. Adjust slider multiple times - verify immediate response
  6. Hover over carousel - verify pause still works
  7. Leave hover - verify animation resumes at correct speed

## Notes
- **Duration Calculation:** The `autoScrollInterval` prop is in milliseconds, but framer-motion's `animate()` expects duration in seconds. Convert by dividing by 1000: `duration: autoScrollInterval / 1000`
- **Animation Smoothness:** The linear easing ensures consistent scroll speed. No changes needed to ease function.
- **Memory Management:** The existing cleanup function (`animationRef.current?.stop()`) properly handles animation disposal when component unmounts or re-renders.
- **Dual Carousels:** Both carousel rows (lines 202-214) receive the same `autoScrollInterval` prop and will update synchronously.
- **Framer Motion Dependency:** Already installed in package.json. No new dependencies required.
- **React 19.2 Compatibility:** The fix uses standard React hooks (useRef, useEffect, useState) and framer-motion APIs that are fully compatible with React 19.2.
- **Performance:** Re-creating the animation on prop change is the correct approach. Framer-motion handles the transition smoothly without flickering.
