# Chore: Integrate Rufus Widget into Preview Flow

## Chore Description

Replace the placeholder Rufus widget in the preview flow (`PreviewWidgetRenderer`) with the full implementation from `components/widget_components/complete/rufus-widget.tsx`. Make the Rufus widget responsive to configuration styling props (colors, dimensions, text color, gradients) so users can customize the widget appearance in the preview flow before signing up.

Currently, the preview flow shows a basic placeholder Card component for the Rufus widget. The goal is to replace this with the actual RufusWidget component and ensure it responds to user-configured colors, dimensions, and styles from the preview configuration page.

## Relevant Files

Use these files to resolve the chore:

- **`components/PreviewWidgetRenderer.tsx`** (lines 140-178) - Currently renders placeholder Rufus widget; needs to import and use RufusWidget component with configuration-responsive styling

- **`components/widget_components/complete/rufus-widget.tsx`** (full file) - The complete RufusWidget implementation with collapsed/expanded states, seed questions, and Amazon brand styling. Needs to accept style props for customization.

- **`components/widget_components/types.ts`** - Contains TypeScript interfaces for widget component props including RufusWidgetProps; may need to extend to support style customization props

- **`app/preview/configure/page.tsx`** - Configuration page where users set colors, dimensions, and placement; already saves configuration to Convex with color, gradient, width, height, and placement settings

- **`app/preview/demo/page.tsx`** - Demo page that renders PreviewWidgetRenderer with configuration; ensures integration works end-to-end

- **`app/globals.css`** (lines 97-227) - Contains Rufus widget CSS custom properties (--color-amazon-orange, --color-rufus-blue, etc.) and pill/input styles that may need to be made responsive to configuration

### New Files

No new files required. All changes will be made to existing files.

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Extend RufusWidget Props Interface

- Open `components/widget_components/types.ts`
- Locate the `RufusWidgetProps` interface
- Add optional style customization props:
  - `customColors?: { primary?: string; secondary?: string; background?: string; text?: string }`
  - `customGradient?: { start?: string; end?: string; use?: boolean }`
  - `customDimensions?: { width?: number; height?: number }`
- Ensure backwards compatibility by making all new props optional with sensible defaults

### Step 2: Update RufusWidget to Accept Style Props

- Open `components/widget_components/complete/rufus-widget.tsx`
- Update the `RufusWidget` component to accept the new style props from RufusWidgetProps interface
- Create a `getCustomStyles()` helper function inside RufusWidget that:
  - Returns inline style objects based on customColors, customGradient, and customDimensions props
  - Falls back to default CSS custom properties (--color-rufus-blue, etc.) when custom props not provided
- Apply custom styles to:
  - **Collapsed state**: Background, border colors for pills and button
  - **Expanded state**: Header background (gradient or solid), card dimensions, input border color, submit button background
  - **Welcome card**: Background color using light variant of custom colors
  - **Seed question pills**: Background and text colors
- Ensure the widget remains visually coherent when custom colors are applied (maintain contrast, accessibility)

### Step 3: Update PreviewWidgetRenderer for Rufus Widget

- Open `components/PreviewWidgetRenderer.tsx`
- Import `RufusWidget` from `@/components/widget_components`
- Replace the placeholder Rufus widget code (lines 140-178) with RufusWidget component implementation
- Pass configuration props to RufusWidget:
  - Map `configuration.primaryColor` → `customColors.primary`
  - Map `configuration.secondaryColor` → `customColors.secondary`
  - Map `configuration.backgroundColor` → `customColors.background`
  - Map `configuration.textColor` → `customColors.text`
  - Map `configuration.useGradient`, `gradientStart`, `gradientEnd` → `customGradient`
  - Map `configuration.width`, `configuration.height` → `customDimensions`
- Set `isExpanded={true}` and `onExpandChange={() => {}}` to show expanded state by default in preview
- Ensure proper positioning: Center the widget on the page (not fixed positioning like floating widgets)
- Remove placeholder Card component and placeholder text

### Step 4: Test Configuration Integration

- Start Convex dev server: `npx convex dev` (background)
- Start Next.js dev server: `bun dev`
- Navigate to `/preview` in browser
- Complete the preview flow:
  1. Enter API key → Continue
  2. Select "Rufus Widget" → Continue
  3. Configure appearance (colors, gradient, dimensions) on `/preview/configure`
  4. Observe live preview updates in real-time as you change configuration
  5. Click "Preview in Demo" → Navigate to `/preview/demo`
- Validate the Rufus widget on demo page:
  - Widget displays in expanded state
  - Custom colors applied to header, pills, buttons, input borders
  - Custom gradient applied if enabled
  - Custom dimensions (width/height) respected
  - Widget remains visually coherent and accessible
  - Seed questions clickable and populate input field
  - Submit button functional

### Step 5: Test Edge Cases

- Test with default configuration (no customization):
  - Widget should display with Amazon brand colors (orange/blue)
  - Default dimensions should be reasonable (400-500px width)
- Test with extreme configurations:
  - Very wide widget (600px)
  - Very narrow widget (300px)
  - Dark gradient (black to dark gray)
  - High contrast colors
- Verify accessibility:
  - Text readable against background colors
  - Input focus states visible
  - Button hover states clear
- Test responsiveness on mobile viewport (if applicable)

### Step 6: Clean Up and Verify Build

- Remove any unused imports from modified files
- Ensure TypeScript types are correct (no `any` types)
- Remove console.log statements if any were added during development
- Run `bun run build` to validate no TypeScript or build errors

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete:
  - Navigate to `/preview` → Complete flow → Verify Rufus widget shows with custom styles on demo page
  - Test color customization (solid and gradient)
  - Test dimension customization (width and height sliders)
  - Test seed question interactions (click to populate input)
  - Test submit button (input validation and disabled state)
  - Verify no console errors in browser dev tools

## Notes

- The Rufus widget uses CSS custom properties defined in `app/globals.css` (lines 97-227) for default Amazon brand colors. These should be overridden via inline styles when custom configuration is provided.

- The widget has two states (collapsed and expanded). For the preview flow demo page, we want to show the **expanded state** by default so users can see the full interface.

- Ensure backwards compatibility: The RufusWidget should work without custom style props (falling back to defaults) so it doesn't break the admin preview page at `/admin/components/widgets/complete/rufus-widget`.

- The configuration page already has color pickers and sliders for customization. No changes needed there - we're just connecting the configuration to the widget rendering.

- Consider accessibility: When custom colors are applied, ensure sufficient contrast between text and backgrounds for readability (WCAG AA compliance).

- The widget is designed to be centered on the demo page (not fixed position like floating widgets). Use flexbox or similar to center it properly within the page layout.
