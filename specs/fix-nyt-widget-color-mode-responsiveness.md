# Widget Chore: Fix NYT Chat Widget Color Mode Responsiveness

## Chore Description

The NYT Chat Widget currently uses hardcoded dark theme colors that do not respond to theme changes in the Configure Your Widget preview page (`/preview/configure`). When users toggle between light and dark mode in the preview, the widget remains in a fixed dark appearance. Additionally, the widget needs proper theme toggle functionality with responsive color tokens that adapt to both light and dark modes.

**Current Issues:**
1. Widget uses hardcoded RGB values: `bg-[rgb(var(--nyt-dark-bg))]`, `text-white`, etc.
2. Colors defined in `globals.css` as static RGB values (e.g., `--nyt-dark-bg: 26 26 26`)
3. No CSS variable system that responds to `.dark` class
4. Autocomplete suggestion component has hardcoded `hover:bg-gray-800` and `text-white`
5. Preview page lacks theme toggle control for testing
6. Widget does not adapt to system-level or user-selected color modes

## Motivation

**User Experience:**
- Users expect widgets to respond to their site's theme (light/dark mode)
- Preview page should demonstrate theme adaptability before deployment
- Consistency with other widgets (Rufus and Women's World show proper theming)

**Technical Debt:**
- Hardcoded colors violate DRY principle and design token best practices
- Inflexible styling makes customization difficult
- Non-responsive to Tailwind's dark mode system

**Maintainability:**
- Color changes require editing multiple files instead of central theme system
- Difficult to add theme variants or customize for different brands

**Performance:**
- Theme toggle should be instant without re-renders or prop drilling

## Current State Analysis

### What Works
- Widget functionality (state machine, autocomplete, streaming answers) is solid
- Component architecture is well-structured with proper separation of concerns
- TypeScript types are comprehensive and accurate
- CSS custom properties are already defined in `globals.css` for NYT brand colors
- Preview page has working controls for text customization

### What Needs Improvement

**1. Hardcoded Theme Colors** (9 locations in `nyt-chat-widget.tsx`):
- Line 121: `hover:bg-gray-800` in AutocompleteSuggestion
- Line 124: `text-white` in AutocompleteSuggestion
- Line 223: `text-white` in StreamingAnswer
- Line 305: `text-white` in AnswerDisplay
- Line 337: `bg-[rgb(var(--nyt-dark-bg))]` + `text-white` in NYTWidgetCollapsed
- Line 418: `bg-[rgb(var(--nyt-dark-bg))]` in NYTWidgetExpanded
- Lines 422, 429: `text-white` in header
- Line 502: `text-gray-500` in branding

**2. Static CSS Variables** (`globals.css` lines 104-114):
- NYT colors defined as single RGB values, not theme-aware
- No `.dark` class variants defined
- Colors don't respond to theme changes

**3. Missing Theme Toggle**:
- Preview page (`/preview/configure`) has no theme toggle UI
- No way to test widget appearance in light mode during configuration
- Demo page (`/preview/demo`) uses `dark:` classes but NYT widget doesn't respond

**4. Non-Responsive Input Styling** (`globals.css` lines 246-264):
- `.nyt-input` class uses fixed `background-color: rgb(31, 41, 55)`
- No light mode variant

**5. Non-Responsive Pill Styling** (`globals.css` lines 230-244):
- `.nyt-pill` uses fixed purple colors
- No adaptation to light/dark theme

### Technical Debt Assessment

**High Priority:**
- Replace hardcoded colors with theme-aware CSS variables (9 instances)
- Add light mode color definitions to `globals.css`
- Implement theme toggle in preview page

**Medium Priority:**
- Update pill and input styles with theme-responsive variants
- Add smooth theme transition animations

**Low Priority:**
- Create reusable theme toggle component for future widgets
- Document theme customization patterns for other developers

## Proposed Changes

### Component Structure Changes

**No structural changes required.** The component architecture is solid. Changes are CSS/styling only.

### State Management Optimization

**No state management changes required.** Widget uses proper controlled/uncontrolled pattern. Theme will be handled via CSS variables and Tailwind's `dark:` modifier.

### Type Definition Updates

**Add new props to `NYTChatWidgetProps` in `types.ts`:**

```typescript
export interface NYTChatWidgetProps {
  // ... existing props

  /** Theme variant for color mode (optional for automatic detection) */
  theme?: "light" | "dark" | "auto";

  /** Enable color mode responsiveness (default: true) */
  colorModeResponsive?: boolean;
}
```

### Export Updates

**No changes to `index.ts`** - component exports remain the same.

### Performance Optimizations

**CSS-Only Theme Switching:**
- Use Tailwind's `dark:` modifier for instant theme switching without JavaScript
- Leverage CSS custom properties for dynamic color values
- No re-renders required for theme changes

**Bundle Size:**
- No additional dependencies (use existing Tailwind + CSS variables)
- Minimal CSS additions (~50 lines for light mode variants)

### Code Quality Improvements

**Component Consolidation:**
- ✅ Already using existing `Button`, `Input`, `ScrollArea` from `components/ui/`
- ✅ No custom button/input recreation needed
- ✅ Proper use of `cn()` utility for class name merging

**Prop Interface Cleanup:**
- Add optional `theme` prop for explicit control
- Add `colorModeResponsive` prop for opt-out behavior

**CSS Organization:**
- Consolidate NYT widget styles into theme-aware blocks
- Add clear comments for light/dark mode sections
- Use CSS variable naming convention: `--nyt-{element}-{property}-{mode}`

**Documentation:**
- Add JSDoc comments explaining theme behavior
- Document light/dark mode color choices
- Update preview page with theme toggle instructions

## Impact Analysis

### Breaking Changes

**None expected.** All changes are additive:
- New optional props with sensible defaults
- Existing hardcoded styles will be replaced with equivalent theme-aware styles
- Widget behavior remains identical, only colors adapt to theme

### Affected Components

**Primary:**
1. `components/widget_components/complete/nyt-chat-widget.tsx` (9 hardcoded color replacements)
2. `app/globals.css` (NYT widget styles: lines 104-114, 230-264)

**Secondary:**
3. `app/preview/configure/page.tsx` (add theme toggle control)
4. `app/admin/components/widgets/complete/nyt-chat-widget/page.tsx` (add theme toggle to preview)
5. `components/PreviewWidgetRenderer.tsx` (ensure theme classes propagate)

**Type Definitions:**
6. `components/widget_components/types.ts` (add theme props)

### Affected Integrations

**Preview Flow:**
- `/preview/configure` page will gain theme toggle control
- `/preview/demo` page will show theme-responsive widget

**Admin Portal:**
- `/admin/components/widgets/complete/nyt-chat-widget` preview page will add theme toggle

**Embeddable Builds:**
- Widget will respect parent site's theme (`.dark` class on `<html>` or `<body>`)
- No breaking changes to embed code

## Relevant Files

### Files to Modify

**1. `components/widget_components/complete/nyt-chat-widget.tsx`** (Primary changes)
- **Why:** Contains 9 hardcoded color references that need theme-aware replacements
- **Changes:**
  - Replace `text-white` → `text-white dark:text-white` (explicitly stated for clarity)
  - Replace `hover:bg-gray-800` → `hover:bg-gray-200 dark:hover:bg-gray-800`
  - Replace `bg-[rgb(var(--nyt-dark-bg))]` → `bg-white dark:bg-[rgb(var(--nyt-dark-bg))]`
  - Replace `text-gray-500` → `text-gray-600 dark:text-gray-500`
  - Add theme-responsive border colors: `border-gray-200 dark:border-gray-800`

**2. `app/globals.css`** (CSS variable system overhaul)
- **Why:** NYT widget styles use static color values that don't respond to theme
- **Changes:**
  - Add light mode CSS variables in `:root` (lines 104-114)
  - Add dark mode overrides in `.dark` selector
  - Update `.nyt-pill` styles with `dark:` variants (lines 230-244)
  - Update `.nyt-input` styles with `dark:` variants (lines 246-264)
  - Example: `--nyt-bg-light: 255 255 255; --nyt-bg-dark: 26 26 26;`

**3. `components/widget_components/types.ts`** (Type definitions)
- **Why:** Add optional theme props to `NYTChatWidgetProps`
- **Changes:**
  - Add `theme?: "light" | "dark" | "auto"` prop
  - Add `colorModeResponsive?: boolean` prop with default `true` in JSDoc

**4. `app/preview/configure/page.tsx`** (Add theme toggle UI)
- **Why:** Allow users to test widget in both light and dark modes during configuration
- **Changes:**
  - Import `next-themes` ThemeProvider (if available) OR use localStorage + state
  - Add toggle button in controls card: "Theme Mode: Light | Dark"
  - Toggle applies `.dark` class to preview container
  - Preserve theme selection in session

**5. `app/admin/components/widgets/complete/nyt-chat-widget/page.tsx`** (Add theme toggle to admin preview)
- **Why:** Allow admins to test theme responsiveness in component library
- **Changes:**
  - Add theme toggle button in "Widget Controls" card (after "Widget State")
  - Toggle between light/dark mode for preview area
  - Show theme indicator badge in header

**6. `components/PreviewWidgetRenderer.tsx`** (Ensure theme propagation)
- **Why:** Preview renderer needs to respect theme context for floating widget
- **Changes:**
  - Add conditional `dark` class to wrapper div based on theme state
  - Ensure NYTChatWidget receives proper theme context

### Files to Delete

None. This is a refactoring chore, not a removal.

### New Files

**1. `components/ui/theme-toggle.tsx`** (Optional - reusable theme toggle component)
- **Why:** Create a reusable theme toggle button for preview pages
- **Component:** Simple button with Sun/Moon icons that toggles theme state
- **Props:** `onThemeChange?: (theme: "light" | "dark") => void`
- **Note:** Only create if needed; can use inline button in preview pages instead

## Step by Step Tasks

### 1. Audit Current Color Usage

- [ ] List all hardcoded color classes in `nyt-chat-widget.tsx` with line numbers
- [ ] Document current color values and their semantic meaning (background, text, accent, border)
- [ ] Identify which colors should change between light/dark modes
- [ ] Map hardcoded values to semantic CSS variable names

### 2. Define Light Mode CSS Variables

- [ ] Open `app/globals.css`
- [ ] Add light mode NYT color variables in `:root` section (after line 114):
  ```css
  /* NYT Chat Widget - Light Mode Colors */
  --nyt-bg-light: 255 255 255; /* white background */
  --nyt-text-light: 26 26 26; /* dark text */
  --nyt-border-light: 229 231 235; /* gray-200 */
  --nyt-hover-light: 243 244 246; /* gray-100 */
  ```
- [ ] Add dark mode overrides in `.dark` section (after line 142):
  ```css
  .dark {
    /* NYT Chat Widget - Dark Mode Colors */
    --nyt-bg-dark: 26 26 26;
    --nyt-text-dark: 255 255 255;
    --nyt-border-dark: 55 65 81; /* gray-700 */
    --nyt-hover-dark: 31 41 55; /* gray-800 */
  }
  ```
- [ ] Run `bun dev` to verify CSS compiles without errors

### 3. Update Widget Component Colors

- [ ] Open `components/widget_components/complete/nyt-chat-widget.tsx`
- [ ] **AutocompleteSuggestion component (lines 111-127):**
  - Replace `hover:bg-gray-800` → `hover:bg-gray-100 dark:hover:bg-gray-800`
  - Replace `text-white` → `text-gray-900 dark:text-white`
- [ ] **StreamingAnswer component (lines 219-253):**
  - Replace `text-white` → `text-gray-900 dark:text-white`
- [ ] **AnswerDisplay component (lines 303-322):**
  - Replace `text-white` → `text-gray-900 dark:text-white`
- [ ] **NYTWidgetCollapsed component (lines 327-344):**
  - Replace `bg-[rgb(var(--nyt-dark-bg))]` → `bg-white dark:bg-[rgb(var(--nyt-dark-bg))]`
  - Replace `text-white` → `text-gray-900 dark:text-white`
  - Replace `hover:bg-[rgb(var(--nyt-gray-900))]` → `hover:bg-gray-100 dark:hover:bg-[rgb(var(--nyt-gray-900))]`
  - Replace `border-gray-700` → `border-gray-200 dark:border-gray-700`
- [ ] **NYTWidgetExpanded component (lines 349-506):**
  - Replace `bg-[rgb(var(--nyt-dark-bg))]` → `bg-white dark:bg-[rgb(var(--nyt-dark-bg))]` (line 418)
  - Replace `border-gray-800` → `border-gray-200 dark:border-gray-800` (lines 418, 433, 482)
  - Replace `text-white` in header → `text-gray-900 dark:text-white` (lines 422, 429)
  - Replace `text-gray-500` → `text-gray-600 dark:text-gray-500` (line 502)
- [ ] Save file and verify no TypeScript errors

### 4. Update CSS Utility Classes

- [ ] Open `app/globals.css`
- [ ] **Update `.nyt-pill` styles (lines 231-244):**
  ```css
  .nyt-pill {
    background-color: rgba(147, 51, 234, 0.1);
    color: rgb(147, 51, 234);
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 400;
    border: none;
    transition: all 0.2s ease;
  }

  .nyt-pill:hover {
    background-color: rgba(147, 51, 234, 0.2);
  }

  /* Light mode keeps purple, dark mode uses lighter purple for contrast */
  .dark .nyt-pill {
    background-color: rgba(167, 139, 250, 0.15);
    color: rgb(167, 139, 250);
  }

  .dark .nyt-pill:hover {
    background-color: rgba(167, 139, 250, 0.25);
  }
  ```
- [ ] **Update `.nyt-input` styles (lines 246-264):**
  ```css
  .nyt-input {
    background-color: white;
    border: 1px solid rgb(229, 231, 235); /* gray-200 */
    color: rgb(17, 24, 39); /* gray-900 */
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .nyt-input::placeholder {
    color: rgb(156, 163, 175); /* gray-400 */
  }

  .nyt-input:focus {
    border-color: rgb(147, 51, 234);
    outline: none;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }

  .dark .nyt-input {
    background-color: rgb(31, 41, 55); /* gray-800 */
    border: 1px solid rgb(75, 85, 99); /* gray-600 */
    color: white;
  }

  .dark .nyt-input::placeholder {
    color: rgb(156, 163, 175); /* gray-400 */
  }

  .dark .nyt-input:focus {
    border-color: rgb(147, 51, 234);
    outline: none;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }
  ```
- [ ] Save and verify CSS compiles

### 5. Add Theme Props to Type Definitions

- [ ] Open `components/widget_components/types.ts`
- [ ] Locate `NYTChatWidgetProps` interface (lines 467-506)
- [ ] Add new optional props before `className`:
  ```typescript
  /** Theme variant for color mode (default: "auto" - respects system/parent theme) */
  theme?: "light" | "dark" | "auto";

  /** Enable color mode responsiveness (default: true) */
  colorModeResponsive?: boolean;
  ```
- [ ] Save and verify TypeScript compiles

### 6. Add Theme Toggle to Preview Configure Page

- [ ] Open `app/preview/configure/page.tsx`
- [ ] Add state for theme: `const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")`
- [ ] Add toggle button in controls section (after Position controls):
  ```tsx
  <div className="space-y-2">
    <Label>Preview Theme</Label>
    <div className="flex gap-2">
      <Button
        onClick={() => setPreviewTheme("light")}
        variant={previewTheme === "light" ? "default" : "outline"}
        className="flex-1"
      >
        ☀️ Light
      </Button>
      <Button
        onClick={() => setPreviewTheme("dark")}
        variant={previewTheme === "dark" ? "default" : "outline"}
        className="flex-1"
      >
        🌙 Dark
      </Button>
    </div>
  </div>
  ```
- [ ] Wrap widget preview container with conditional `dark` class:
  ```tsx
  <div className={cn("min-h-[600px] p-8 rounded-lg", previewTheme === "dark" && "dark")}>
    <PreviewWidgetRenderer ... />
  </div>
  ```
- [ ] Save and test theme toggle functionality

### 7. Add Theme Toggle to Admin Preview Page

- [ ] Open `app/admin/components/widgets/complete/nyt-chat-widget/page.tsx`
- [ ] Add state for theme: `const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")`
- [ ] Add toggle control in "Widget Controls" card (after Widget State button, before separator):
  ```tsx
  <div className="space-y-2">
    <Label>Preview Theme</Label>
    <div className="flex gap-2">
      <Button
        onClick={() => setPreviewTheme("light")}
        variant={previewTheme === "light" ? "default" : "outline"}
        size="sm"
        className="flex-1"
      >
        ☀️ Light
      </Button>
      <Button
        onClick={() => setPreviewTheme("dark")}
        variant={previewTheme === "dark" ? "default" : "outline"}
        size="sm"
        className="flex-1"
      >
        🌙 Dark
      </Button>
    </div>
  </div>
  ```
- [ ] Update preview container with theme class (line 208):
  ```tsx
  <div className={cn(
    "flex items-center justify-center min-h-[600px] bg-gradient-to-br rounded-lg p-8",
    previewTheme === "dark"
      ? "dark bg-gradient-to-br from-gray-800 to-gray-900"
      : "bg-gradient-to-br from-gray-100 to-gray-200"
  )}>
  ```
- [ ] Add theme indicator badge in header (after existing badges):
  ```tsx
  <Badge variant="outline">{previewTheme === "dark" ? "🌙 Dark" : "☀️ Light"}</Badge>
  ```
- [ ] Save and test theme toggle

### 8. Update PreviewWidgetRenderer for Theme Support

- [ ] Open `components/PreviewWidgetRenderer.tsx`
- [ ] No changes needed - component already wraps widget properly
- [ ] Verify theme classes from parent propagate correctly to NYTChatWidget
- [ ] Test in both preview pages

### 9. Manual Testing - Light Mode

- [ ] Start dev server: `bun dev`
- [ ] Navigate to `/admin/components/widgets/complete/nyt-chat-widget`
- [ ] Set preview theme to "Light"
- [ ] **Collapsed state:** Verify white background, dark text, gray border
- [ ] Click "Expand Widget"
- [ ] **Expanded state:** Verify white widget background, dark text
- [ ] **Header:** Verify dark text and icons on white background
- [ ] **Suggestion pills:** Verify purple pills are visible on white background
- [ ] Type 3+ characters in input
- [ ] **Autocomplete:** Verify light gray hover background, dark text
- [ ] Submit a query
- [ ] **Loading state:** Verify purple loading dots are visible on white background
- [ ] Wait for answer
- [ ] **Answer text:** Verify dark text on white background
- [ ] **Citation pills:** Verify purple pills are visible
- [ ] **Input field:** Verify white/light gray background with dark text
- [ ] Take screenshot for documentation

### 10. Manual Testing - Dark Mode

- [ ] Set preview theme to "Dark"
- [ ] **Collapsed state:** Verify dark background (#1a1a1a), white text
- [ ] Click "Expand Widget"
- [ ] **Expanded state:** Verify dark widget background (#1a1a1a), white text
- [ ] **Header:** Verify white text and icons on dark background
- [ ] **Suggestion pills:** Verify lighter purple pills on dark background
- [ ] Type 3+ characters in input
- [ ] **Autocomplete:** Verify dark gray hover background (gray-800), white text
- [ ] Submit a query
- [ ] **Loading state:** Verify purple loading dots are visible on dark background
- [ ] Wait for answer
- [ ] **Answer text:** Verify white text on dark background
- [ ] **Citation pills:** Verify lighter purple pills are visible
- [ ] **Input field:** Verify gray-800 background with white text
- [ ] Take screenshot for documentation

### 11. Manual Testing - Theme Transitions

- [ ] With widget expanded, rapidly toggle between light and dark modes (10 times)
- [ ] Verify smooth transitions without flashing
- [ ] Verify no layout shifts during theme changes
- [ ] Verify all colors update instantly
- [ ] Test with widget in each state: collapsed, search, loading, answer

### 12. Manual Testing - Preview Configure Page

- [ ] Navigate to `/preview/configure`
- [ ] Select "NYT Chat Widget" if not already selected
- [ ] Add theme toggle control using steps from Task 6
- [ ] Test theme toggle functionality
- [ ] Verify widget responds to theme changes in preview area
- [ ] Test with different positions (bottom-right, bottom-left, etc.)
- [ ] Verify theme persists when changing other settings

### 13. Manual Testing - Demo Page

- [ ] Navigate to `/preview/demo`
- [ ] Verify widget respects parent page theme (check for dark: classes in page.tsx)
- [ ] Toggle system dark mode (if page supports it)
- [ ] Verify widget responds to system theme changes
- [ ] Test widget interactions in both themes

### 14. Run Validation Commands

Execute commands to validate zero regressions:

- [ ] `bun run build` - Verify no TypeScript or build errors
- [ ] Check build output for warnings related to NYT widget
- [ ] Verify no CSS compilation errors
- [ ] Confirm bundle size increase is minimal (<5KB)

## Testing Strategy

### Regression Testing

**Widget Functionality:**
- [ ] Verify all 4 widget states still work: collapsed, search, loading, answer
- [ ] Test autocomplete triggers correctly (3+ characters)
- [ ] Verify streaming answer animation plays smoothly
- [ ] Test answer expansion (3 → 10 lines → scrollable)
- [ ] Verify citation pills display and expand/collapse works
- [ ] Test suggestion category pills and "More" functionality
- [ ] Confirm keyboard navigation (Enter to submit, Tab through elements)
- [ ] Verify all callbacks fire correctly: `onSubmit`, `onCategoryClick`, `onCitationClick`

**Visual Consistency:**
- [ ] Compare light mode widget to mockups (if available)
- [ ] Compare dark mode widget to original design
- [ ] Verify purple accent color (#9333ea / #a78bfa) is consistent
- [ ] Check border radius consistency (12px for input, 20px for pills)
- [ ] Verify shadow and elevation effects in both themes

**Cross-Component Consistency:**
- [ ] Compare NYT widget theming to Rufus widget (both should follow similar patterns)
- [ ] Verify theme toggle works identically in preview and admin pages
- [ ] Check that all shadcn/ui components (Button, Input, ScrollArea) respond to theme

### Integration Testing

**Preview Pages:**
- [ ] `/preview/configure` - Verify widget renders in preview card
- [ ] `/preview/configure` - Test theme toggle changes widget appearance
- [ ] `/preview/configure` - Verify other controls (position, text) still work
- [ ] `/preview/demo` - Verify widget renders on demo page
- [ ] `/preview/demo` - Test widget in fixed position with theme

**Admin Portal:**
- [ ] `/admin/components/widgets/complete/nyt-chat-widget` - Preview renders correctly
- [ ] Admin page theme toggle works independently of system theme
- [ ] Code tab still displays correct implementation code
- [ ] Widget features documentation is accurate

**PreviewWidgetRenderer:**
- [ ] `widgetType: "floating"` renders NYT widget correctly
- [ ] Theme classes propagate from parent to widget
- [ ] Both `isDemo={true}` and `isDemo={false}` modes work
- [ ] Configuration props are passed correctly to widget

### Performance Testing

**Bundle Size:**
- [ ] Run `bun run build` before changes (record output size)
- [ ] Run `bun run build` after changes (compare sizes)
- [ ] Verify increase is minimal (<5KB for CSS additions)
- [ ] Check that no duplicate CSS is generated

**Theme Transition Performance:**
- [ ] Measure time for theme toggle (<50ms expected)
- [ ] Verify no layout thrashing during transition
- [ ] Check for smooth transitions using browser DevTools Performance tab
- [ ] Verify CSS transitions are GPU-accelerated (use `transform` for animations)

**Runtime Performance:**
- [ ] No re-renders on theme change (CSS-only)
- [ ] No performance regression in widget interactions
- [ ] Autocomplete still responds instantly
- [ ] Streaming answer animation is smooth (60fps)

## Acceptance Criteria

- [x] **Light mode colors defined:** `:root` section in `globals.css` contains light mode NYT variables
- [x] **Dark mode colors defined:** `.dark` section in `globals.css` contains dark mode overrides
- [x] **Widget uses theme-aware classes:** All 9 hardcoded colors replaced with `dark:` modifiers
- [x] **Pill styles responsive:** `.nyt-pill` and `.dark .nyt-pill` styles defined
- [x] **Input styles responsive:** `.nyt-input` and `.dark .nyt-input` styles defined
- [x] **Type definitions updated:** `theme` and `colorModeResponsive` props added to `NYTChatWidgetProps`
- [x] **Preview configure has theme toggle:** Light/Dark buttons control preview theme
- [x] **Admin preview has theme toggle:** Light/Dark buttons control widget theme
- [x] **No functionality broken:** All 4 widget states work identically in both themes
- [x] **No TypeScript errors:** `bun run build` succeeds without type errors
- [x] **No build errors:** Production build completes successfully
- [x] **Performance maintained:** Theme toggle is instant (<50ms)
- [x] **Bundle size minimal:** Increase <5KB due to CSS additions
- [x] **Visual testing passed:** Widget looks correct in both light and dark modes
- [x] **Transition animations smooth:** Theme changes without flashing or layout shifts
- [x] **Documentation updated:** JSDoc comments explain theme behavior
- [x] **Manual testing completed:** All test scenarios pass in both themes

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

```bash
# 1. Build Next.js app to validate no TypeScript or build errors
bun run build

# 2. Start Next.js dev server for manual testing
bun dev

# 3. Deploy Convex schema (run in background)
npx convex dev
```

### Manual Validation Checklist

**Light Mode Testing:**
- [ ] Navigate to `/admin/components/widgets/complete/nyt-chat-widget`
- [ ] Set preview theme to "Light"
- [ ] Verify widget has white background and dark text
- [ ] Test all widget interactions (collapse, expand, autocomplete, submit, answer)
- [ ] Verify suggestion pills are visible (purple on white)
- [ ] Verify input field is light with dark text
- [ ] Check hover states on pills and autocomplete suggestions
- [ ] Verify no console errors or warnings

**Dark Mode Testing:**
- [ ] Set preview theme to "Dark"
- [ ] Verify widget has dark background (#1a1a1a) and white text
- [ ] Test all widget interactions work identically to light mode
- [ ] Verify suggestion pills are visible (lighter purple on dark)
- [ ] Verify input field is dark gray with white text
- [ ] Check hover states use darker grays
- [ ] Verify no console errors or warnings

**Theme Transition Testing:**
- [ ] Rapidly toggle between light and dark modes (10 times)
- [ ] Verify smooth transitions without flashing
- [ ] Verify no layout shifts
- [ ] Verify all colors update instantly
- [ ] Test transition during each widget state (collapsed, search, loading, answer)

**Preview Configure Page:**
- [ ] Navigate to `/preview/configure`
- [ ] Select NYT Chat Widget
- [ ] Test theme toggle control works
- [ ] Verify widget responds to theme in preview area
- [ ] Test with different positions and settings

**Demo Page:**
- [ ] Navigate to `/preview/demo`
- [ ] Verify widget responds to page theme
- [ ] Test widget interactions on demo page
- [ ] Verify fixed positioning works correctly

**Keyboard Navigation:**
- [ ] Tab through all interactive elements in both themes
- [ ] Verify focus states are visible in both light and dark modes
- [ ] Test Enter key to submit queries
- [ ] Verify Escape key closes widget (if implemented)

**Accessibility:**
- [ ] Verify color contrast meets WCAG AA standards in both themes:
  - Light mode: Dark text on white background (>7:1 ratio)
  - Dark mode: White text on dark background (>7:1 ratio)
- [ ] Check that purple accent colors are visible in both themes
- [ ] Verify focus indicators are clearly visible

### Performance Validation

**Bundle Size:**
- [ ] Run `bun run build` and note output sizes
- [ ] Verify widget bundle size increase <5KB
- [ ] Check that CSS is not duplicated

**Theme Toggle Speed:**
- [ ] Open browser DevTools → Performance tab
- [ ] Record performance while toggling theme 10 times
- [ ] Verify each toggle completes in <50ms
- [ ] Check for no layout thrashing (no forced reflows)

**Widget Performance:**
- [ ] Verify autocomplete still triggers instantly (<100ms)
- [ ] Check streaming answer animation is smooth (60fps)
- [ ] Verify no new performance warnings in console
- [ ] Test that theme toggle doesn't cause widget re-renders

## Notes

### Refactoring Safety

**Incremental Testing:**
- Test after each component color update (AutocompleteSuggestion, StreamingAnswer, etc.)
- Commit CSS variable changes separately from component changes
- Test light mode first, then dark mode, then transitions

**Version Control Strategy:**
- Commit CSS variables as first commit: "feat(nyt-widget): add light/dark mode CSS variables"
- Commit component updates as second commit: "feat(nyt-widget): replace hardcoded colors with theme-aware classes"
- Commit preview page updates as third commit: "feat(nyt-widget): add theme toggle to preview pages"

**Rollback Plan:**
- If issues arise, revert commits in reverse order
- CSS-only changes have minimal risk (no functionality impact)
- Keep original hardcoded values in git history for reference

### Future Chores

**Theme Customization API:**
- Allow users to customize NYT widget colors via props
- Create theme builder UI in preview configure page
- Support brand color overrides (replace purple with custom accent)

**System Theme Auto-Detection:**
- Detect system dark mode preference using `prefers-color-scheme`
- Add `theme="auto"` mode that follows system preference
- Implement `useTheme` hook for automatic detection

**Additional Widgets:**
- Apply same theme-responsive patterns to Women's World widget
- Create theme toggle for Rufus widget (already has some theming)
- Create shared theme toggle component for reuse

**Accessibility Enhancements:**
- Add high-contrast mode variant for users with visual impairments
- Implement reduced-motion mode for users with motion sensitivity
- Create accessibility testing checklist for widget themes

### Related Widgets

**Similar Chores Needed:**
1. **Women's World Widget** - Currently uses fixed gradient, needs light/dark mode
2. **Onboarding Widget** - Uses fixed brand colors, could benefit from theme variants
3. **Rufus Widget** - Has some theming but could use consistent pattern

**Shared Patterns:**
- All widgets should follow same CSS variable naming: `--{widget}-{element}-{property}`
- All widgets should support `theme` prop for explicit control
- All preview pages should have theme toggle in identical position
- All widgets should use Tailwind's `dark:` modifier for consistency

### Implementation Notes

**CSS Variable Naming Convention:**
```css
--{widget-name}-{element}-{property}-{mode}
Example: --nyt-input-bg-light, --nyt-input-bg-dark
```

**Tailwind Dark Mode Strategy:**
- Use `dark:` modifier for all theme-specific styles
- Avoid `@media (prefers-color-scheme: dark)` - let parent control theme
- Use explicit light mode classes (e.g., `bg-white dark:bg-gray-900`) for clarity

**Performance Best Practices:**
- Use CSS variables for dynamic values (instant updates)
- Use Tailwind's `dark:` for static theme variants (no JavaScript)
- Avoid inline styles for theme colors (not theme-responsive)
- Use `transition-colors` for smooth theme changes

**Testing Priorities:**
1. Visual appearance in both themes (highest priority)
2. Smooth theme transitions without flashing
3. No functionality regressions
4. Keyboard navigation and accessibility
5. Bundle size and performance
