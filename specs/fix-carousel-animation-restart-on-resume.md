# Bug: Carousel Animation Restarts From Beginning After Hover

## Bug Description

When hovering over the seed questions carousel in the Women's World Widget, the animation correctly pauses. However, when the mouse cursor leaves the carousel area, the animation restarts from the beginning (0%) instead of resuming from where it was paused. This creates a jarring visual experience where the carousel "jumps" back to its starting position.

**Expected Behavior**:
- Hover on carousel → animation pauses at current position
- Mouse leave carousel → animation resumes from paused position (seamless continuation)

**Actual Behavior**:
- Hover on carousel → animation pauses at current position ✓
- Mouse leave carousel → animation restarts from 0% (jumps back to beginning) ❌

## Problem Statement

The Framer Motion `controls.start()` method is being called with the full animation configuration `x: ["0%", "-50%"]` when resuming animation on mouse leave. This causes the animation to restart from the beginning (0%) instead of continuing from the current paused position.

## Solution Statement

Replace the pause/resume approach using `controls.stop()` and `controls.start()` with Framer Motion's animation state management. Use the `animate` prop directly with a conditional paused state, or use `AnimationControls.set()` to preserve the current position and then resume the animation from that position.

**Approach**: Track hover state and conditionally control the animation's `paused` state rather than stopping and restarting the animation entirely.

## Steps to Reproduce

1. Navigate to `/admin/components/widgets/complete/womens-world-widget`
2. Expand the widget to see the dual carousel rows
3. Observe the carousels scrolling continuously
4. Hover over one of the carousel rows
5. Observe: Animation pauses ✓
6. Move cursor off the carousel
7. **Bug**: Animation jumps back to beginning instead of continuing from paused position

## Root Cause Analysis

**Root Cause**: Improper use of Framer Motion's `AnimationControls` API.

**Technical Details**:

In `SeedQuestionsCarousel` component (lines 83-98):

```tsx
// Pause animation on hover
const handleMouseEnter = () => {
  controls.stop(); // ✓ Correctly pauses animation
};

// Resume animation on mouse leave
const handleMouseLeave = () => {
  controls.start({
    x: ["0%", "-50%"],  // ❌ PROBLEM: Restarts from ["0%", "-50%"]
    transition: {
      duration: scrollDuration,
      repeat: Infinity,
      ease: "linear",
    },
  });
};
```

**Why This Happens**:

When `controls.start({ x: ["0%", "-50%"] })` is called:
1. Framer Motion interprets this as a new animation starting from `x: "0%"`
2. The animation resets to the beginning of the keyframe array
3. The current position is lost

**Correct Approach**:

Use one of these Framer Motion patterns:

**Option 1**: Track paused state and use `transition.type` control
```tsx
const [isPaused, setIsPaused] = useState(false);

<motion.div
  animate={{ x: ["0%", "-50%"] }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
    ...(isPaused && { type: false }) // Pause by disabling transition
  }}
/>
```

**Option 2**: Use `AnimationControls` with proper state management
```tsx
// On pause: Get current x value, then stop
// On resume: Start from current x value to -50%
```

**Option 3** (Best): Use CSS-based approach or Framer Motion's built-in pause
```tsx
const [isPaused, setIsPaused] = useState(false);

<motion.div
  animate={isPaused ? false : { x: ["0%", "-50%"] }}
  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
/>
```

## Relevant Files

### Files to Modify

**`components/widget_components/complete/womens-world-widget.tsx`** (PRIMARY FIX)
- Lines 60-125: `SeedQuestionsCarousel` component
- **Why**: Contains the buggy pause/resume logic using `controls.stop()` and `controls.start()`
- **Change**: Replace with state-based animation control that preserves position on pause

## Step by Step Tasks

### 1. Understand Framer Motion Animation Control Patterns

- [ ] Review Framer Motion documentation for proper pause/resume patterns
- [ ] Identify best approach: state-based vs AnimationControls with position tracking
- [ ] Choose simplest solution that preserves animation position

### 2. Implement State-Based Pause Control

**Replace `controls.stop()/start()` with hover state tracking**

- [ ] Add `useState` hook to track hover state: `const [isHovered, setIsHovered] = useState(false)`
- [ ] Update `handleMouseEnter` to set hover state: `setIsHovered(true)`
- [ ] Update `handleMouseLeave` to clear hover state: `setIsHovered(false)`
- [ ] Modify `motion.div` to conditionally animate based on hover state
- [ ] Remove `controls.start()` call from `useEffect` (animation will be controlled by `animate` prop)
- [ ] Update `animate` prop to pause when hovered: `animate={isHovered ? undefined : { x: ["0%", "-50%"] }}`

### 3. Test Alternative: AnimationPlaybackControls

**If state-based approach doesn't work, try AnimationPlaybackControls**

- [ ] Replace `useAnimation()` with direct animation control
- [ ] Store animation playback control in ref
- [ ] Use `animation.pause()` and `animation.play()` instead of `controls.stop()` and `controls.start()`

### 4. Verify Fix Locally

- [ ] Run `bun dev` and navigate to widget preview
- [ ] Test hover → pause behavior
- [ ] Test mouse leave → resume behavior
- [ ] Verify animation continues from paused position (no jump)
- [ ] Test on both carousel rows independently
- [ ] Test rapid hover on/off (edge case)

### 5. Validate Build and Type Safety

- [ ] Run `bun run build` to ensure no TypeScript errors
- [ ] Verify all routes compile successfully
- [ ] Check for any console warnings in dev mode

### 6. Run Validation Commands

- [ ] Execute all validation commands listed below
- [ ] Verify zero regressions in widget functionality
- [ ] Confirm smooth continuous scrolling with proper pause/resume

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
- [ ] Hover on carousel → animation pauses ✓
- [ ] Mouse leave carousel → animation restarts from beginning (BUG) ✓

**After Fix**:
- [ ] Hover on carousel → animation pauses ✓
- [ ] Mouse leave carousel → animation continues from paused position ✓
- [ ] No visible jump or reset in animation
- [ ] Both carousel rows behave independently
- [ ] Rapid hover on/off doesn't break animation
- [ ] Question pill click still works during scroll
- [ ] Selected question highlighting still works
- [ ] Glassmorphism input receives clicked question

**Edge Cases**:
- [ ] Hover during middle of scroll cycle → pause → resume → continues correctly
- [ ] Hover at end of scroll cycle (near -50%) → pause → resume → continues correctly
- [ ] Hover immediately after page load → pause → resume → continues correctly
- [ ] Multiple quick hovers in succession → animation remains smooth

## Notes

### Framer Motion Animation Control Patterns

**Pattern 1: Conditional Animate (Recommended)**
```tsx
const [isPaused, setIsPaused] = useState(false);

<motion.div
  animate={isPaused ? undefined : { x: ["0%", "-50%"] }}
  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
/>
```
- **Pro**: Simple, declarative, preserves position automatically
- **Con**: May briefly flash when switching between paused/animated state

**Pattern 2: AnimationPlaybackControls**
```tsx
const animation = useRef<any>(null);

useEffect(() => {
  animation.current = animate(ref.current,
    { x: ["0%", "-50%"] },
    { duration: 20, repeat: Infinity, ease: "linear" }
  );
}, []);

const handleMouseEnter = () => animation.current?.pause();
const handleMouseLeave = () => animation.current?.play();
```
- **Pro**: Direct control, pause/play preserves position
- **Con**: More complex, requires ref management

**Pattern 3: CSS Animation (Alternative)**
```css
@keyframes scroll {
  from { transform: translateX(0%); }
  to { transform: translateX(-50%); }
}

.carousel {
  animation: scroll 20s linear infinite;
}

.carousel:hover {
  animation-play-state: paused;
}
```
- **Pro**: Simplest, native CSS, perfect pause/resume
- **Con**: Less React-idiomatic, harder to control programmatically

### Recommended Solution

**Use Pattern 1 (Conditional Animate)** with a modification:

Instead of setting `animate` to `undefined` when paused (which might cause issues), use Framer Motion's animation state preservation:

```tsx
const [isHovered, setIsHovered] = useState(false);

<motion.div
  animate={{
    x: ["0%", "-50%"],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
    ...(isHovered && {
      // When hovered, set animation to current position (pauses it)
      type: false
    })
  }}
  onHoverStart={() => setIsHovered(true)}
  onHoverEnd={() => setIsHovered(false)}
/>
```

**OR** use the simpler approach with `whileHover`:

```tsx
<motion.div
  animate={{ x: ["0%", "-50%"] }}
  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  whileHover={{
    // This is a hack: setting transition to duration 0 effectively pauses
    transition: { duration: 0 }
  }}
/>
```

Actually, the **cleanest solution** is to use Framer Motion's `useMotionValue` and `useAnimationFrame`:

```tsx
const x = useMotionValue(0);
const [isPaused, setIsPaused] = useState(false);

useAnimationFrame((t, delta) => {
  if (!isPaused) {
    const progress = (t / (scrollDuration * 1000)) % 1;
    x.set(-progress * 50);
  }
});

<motion.div style={{ x: `${x.get()}%` }}>
```

**BUT** the absolute simplest fix is to just use CSS animation with `animation-play-state`:

Remove Framer Motion animation entirely and use pure CSS for this specific use case.

### Prevention Strategies

1. **Understand animation libraries deeply**: Read Framer Motion docs on pause/resume patterns
2. **Test pause/resume early**: Don't assume `stop()` and `start()` will preserve position
3. **Consider CSS first**: For simple continuous animations, CSS is often simpler and more performant
4. **Use the right tool**: Framer Motion excels at interactive animations, CSS excels at continuous animations

### Related Framer Motion Issues

- When using `controls.start()`, always consider whether you're creating a new animation vs resuming existing
- `controls.stop()` pauses but `controls.start()` with new config creates new animation
- For true pause/resume, use `AnimationPlaybackControls.pause()` and `.play()`
