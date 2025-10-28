# Chore: Align Inline Widget Colors with Modal Widget

## Chore Description
Ensure `womens-world-inline-widget.tsx` uses the exact same color styling as `womens-world-widget.tsx` (modal version) for visual consistency across both widget variations.

**Current State:**
- **Modal widget**: Uses CSS variable `var(--gradient-womens-world)` = `linear-gradient(180deg, #FEAC04 0%, #C79966 50%, #9C7BC8 100%)`
- **Inline widget**: Uses Tailwind gradient `from-[#FB9649] to-[#A361E9]` (incorrect colors)

**Goal:** Inline widget should use the same gradient, white text, and border styling as the modal widget.

## Relevant Files
Use these files to resolve the chore:

- `components/widget_components/complete/womens-world-widget.tsx` - **Reference source** - Modal widget with correct color scheme using `var(--gradient-womens-world)` CSS variable, white text (`text-white`), and glassmorphism styling
- `components/widget_components/complete/womens-world-inline-widget.tsx` - **Target file to update** - Inline widget currently using incorrect gradient colors that need to be replaced with CSS variable reference matching modal widget
- `app/globals.css` - **CSS variables definition** - Contains `--gradient-womens-world: linear-gradient(180deg, #FEAC04 0%, #C79966 50%, #9C7BC8 100%)` at line 68

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Background Gradient
Replace inline widget's hardcoded Tailwind gradient with CSS variable reference matching modal widget.

**File: `components/widget_components/complete/womens-world-inline-widget.tsx`**
- Read the file
- Find line 72: `light: "bg-gradient-to-br from-[#FB9649] to-[#A361E9]",`
- Replace with: `light: "",` (remove Tailwind gradient class)
- Find line 78-84 (container div with className)
- Update to use inline style with CSS variable:
```typescript
<div
  className={cn(
    "w-full rounded-2xl shadow-md border border-gray-200/50 overflow-hidden",
    className
  )}
  style={{
    maxWidth: `${maxWidth}px`,
    margin: "0 auto",
    background: variant === "light" ? "var(--gradient-womens-world)" : undefined
  }}
>
```

**Rationale**: Modal widget uses `background: "var(--gradient-womens-world)"` inline style (line 156). Inline widget should use the same approach for consistency rather than Tailwind classes which cannot access CSS variables.

### Step 2: Verify Text and Border Colors Match
Ensure text and border colors match modal widget's white theme.

**File: `components/widget_components/complete/womens-world-inline-widget.tsx`**
- Verify header text is `text-white` (line 88) ✓ Already correct
- Verify borders are `border-white/20` (lines 87, 105) ✓ Already correct

**Rationale**: Modal widget uses white text on gradient background. Inline widget already has these updates from previous change.

### Step 3: Update Variant Styles Object
Clean up the variantStyles object since light variant no longer needs Tailwind class.

**File: `components/widget_components/complete/womens-world-inline-widget.tsx`**
- Find lines 71-75 (variantStyles object)
- Update to:
```typescript
// Variant-specific background gradients
const variantStyles = {
  light: "", // Uses CSS variable via inline style
  neutral: "bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100",
  subtle: "bg-gradient-to-br from-gray-50 to-gray-100",
};
```

**Rationale**: Light variant background is now applied via inline style, not className. Keep neutral/subtle variants as Tailwind classes since they don't use the CSS variable.

### Step 4: Run Validation Commands
Verify TypeScript compilation and visual consistency.

- Run `bun run build` - Verify no TypeScript errors
- Start dev server: `bun dev`
- Navigate to `/admin/components/widgets` → click "Widgets" tab
- Click "View Preview" on both widgets:
  - **womens-world-widget** (modal)
  - **womens-world-inline-widget**
- Compare visual appearance:
  - ✅ Same gradient colors (gold → purple)
  - ✅ Same white text
  - ✅ Same white borders (20% opacity)
- Test inline widget with different variants:
  - `variant="light"` → Should use CSS variable gradient
  - `variant="neutral"` → Should use gray gradient
  - `variant="subtle"` → Should use subtle gray gradient

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete
- Manual visual validation:
  - ✅ Navigate to `/admin/components/widgets` → Widgets tab
  - ✅ Open "womens-world-widget" preview → verify gradient is gold → purple (FEAC04 → C79966 → 9C7BC8)
  - ✅ Open "womens-world-inline-widget" preview → verify gradient matches modal widget exactly
  - ✅ Compare side-by-side → both should have identical color schemes
  - ✅ Test inline widget variants:
    - Light: CSS variable gradient (gold → purple)
    - Neutral: Gray gradient
    - Subtle: Subtle gray gradient

## Notes

### Color Reference
**Correct gradient (from `globals.css` line 68):**
```css
--gradient-womens-world: linear-gradient(180deg, #FEAC04 0%, #C79966 50%, #9C7BC8 100%);
```
- Start: `#FEAC04` (gold)
- Middle: `#C79966` (rose gold)
- End: `#9C7BC8` (purple)

**Incorrect gradient (current inline widget):**
```css
from-[#FB9649] to-[#A361E9]
```
- Start: `#FB9649` (orange)
- End: `#A361E9` (purple)

### Implementation Pattern
Modal widget uses inline style to reference CSS variable:
```typescript
style={{
  background: "var(--gradient-womens-world)",
  width: `${width}px`,
  height: height ? `${height}px` : "auto",
}}
```

Inline widget should follow the same pattern for the `light` variant, while keeping Tailwind gradients for `neutral` and `subtle` variants that don't need the CSS variable.

### Why CSS Variable Instead of Tailwind?
1. **Single source of truth**: Gradient defined once in `globals.css`
2. **Consistency**: Both widgets reference the same gradient
3. **Maintainability**: Update gradient in one place to change both widgets
4. **Design system**: Follows CSS variable pattern used throughout the app
