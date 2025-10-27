# Chore: Move PoweredByButton to Widget Components Icons Directory

## Chore Description
Move the `PoweredByButton` component from `components/ui/powered-by-button.tsx` to `components/widget_components/icons/powered-by-button.tsx` to organize it correctly with other widget-specific icon components. Update all import statements across the codebase to reference the new location and ensure the component displays correctly.

The `PoweredByButton` is not a general-purpose UI component (like shadcn/ui components) but rather a widget-specific branding icon that belongs alongside other widget icon components like `ProfileBlank`, `BlueStar`, and `Wand`.

## Relevant Files
Use these files to resolve the chore:

- **`components/ui/powered-by-button.tsx`** (MOVE SOURCE)
  - Current location of the PoweredByButton component
  - Needs to be moved to widget_components/icons/ directory
  - Uses SVG from public/assets/svgs/poweredbyfooter.svg
  - References NEXT_PUBLIC_CDN_BASE_URL environment variable

- **`components/widget_components/icons/powered-by-button.tsx`** (MOVE DESTINATION - NEW FILE)
  - New location for the component
  - Should follow same pattern as other icon components (profile-blank.tsx, blue-star.tsx, wand.tsx)
  - Maintain existing functionality including CDN URL support

- **`components/widget_components/complete/womens-world-widget.tsx`** (UPDATE IMPORT)
  - Imports PoweredByButton from old location
  - Line 7: `import { PoweredByButton } from "@/components/ui/powered-by-button";`
  - Needs to update to new location: `@/components/widget_components/icons/powered-by-button`

- **`components/widget_components/complete/onboarding-widget.tsx`** (UPDATE IMPORT)
  - Imports PoweredByButton from old location
  - Needs to update to new location

- **`convex/componentPreviews.ts`** (UPDATE IMPORT)
  - Imports PoweredByButton from old location for code preview generation
  - Needs to update to new location

- **`components/widget_components/icons/profile-blank.tsx`** (REFERENCE)
  - Example of proper icon component pattern in the icons directory
  - Shows TypeScript interface pattern with SVGProps extension

- **`public/assets/svgs/poweredbyfooter.svg`** (ASSET REFERENCE)
  - SVG asset referenced by PoweredByButton component
  - No changes needed - stays in current location

### New Files
- **`components/widget_components/icons/powered-by-button.tsx`** - New location for moved component

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create PoweredByButton in New Location
- Copy `components/ui/powered-by-button.tsx` to `components/widget_components/icons/powered-by-button.tsx`
- Verify the file content is identical after copy
- Ensure the component maintains all existing functionality:
  - CDN URL environment variable support (`NEXT_PUBLIC_CDN_BASE_URL`)
  - Fallback to local public path when CDN not configured
  - Proper SVG rendering with correct dimensions (145x14)
  - Accessibility attributes (aria-label)
  - External link attributes (target="_blank", rel="noopener noreferrer")
  - Hover opacity transition effect

### Step 2: Update Import in womens-world-widget.tsx
- Open `components/widget_components/complete/womens-world-widget.tsx`
- Find import statement: `import { PoweredByButton } from "@/components/ui/powered-by-button";`
- Replace with: `import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";`
- Verify the component is still used in the footer section (line ~352)
- Ensure no other references to old import path exist in the file

### Step 3: Update Import in onboarding-widget.tsx
- Open `components/widget_components/complete/onboarding-widget.tsx`
- Find import statement with PoweredByButton from old location
- Replace with: `import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";`
- Verify the component is still used correctly in the widget footer

### Step 4: Update Import in convex/componentPreviews.ts
- Open `convex/componentPreviews.ts`
- Find import statement (line 834): `import { PoweredByButton } from "@/components/ui/powered-by-button";`
- Replace with: `import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";`
- This ensures code preview generation still works correctly

### Step 5: Delete Old File
- Remove the old file: `components/ui/powered-by-button.tsx`
- Verify no other files are importing from the old location
- Search codebase for any remaining references to `@/components/ui/powered-by-button`

### Step 6: Verify Display Correctness
- Start the development server
- Navigate to Women's World Widget preview page: `/admin/components/widgets/complete/womens-world-widget`
- Expand the widget and verify PoweredByButton displays in footer:
  - "Powered by Gist.ai" text is visible
  - Correct font size and color
  - Hover effect works (opacity transition)
  - Link opens to https://www.gistanswers.ai/ in new tab
- Navigate to Onboarding Widget preview page
- Expand widget and verify PoweredByButton displays correctly in footer
- Test both with and without NEXT_PUBLIC_CDN_BASE_URL environment variable

### Step 7: Run Validation Commands
- Execute all validation commands listed below
- Verify zero TypeScript errors
- Verify zero build errors
- Verify no import errors or missing module errors
- Manually test widget display as described in Step 6

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate the component displays correctly
- Manual validation steps:
  1. Navigate to `http://localhost:3000/admin/components/widgets/complete/womens-world-widget`
  2. Expand the widget and verify PoweredByButton displays in footer with correct styling
  3. Click the PoweredByButton and verify link opens to https://www.gistanswers.ai/ in new tab
  4. Navigate to `http://localhost:3000/admin/components/widgets/complete/onboarding-widget`
  5. Verify PoweredByButton displays correctly in onboarding widget footer
  6. Check browser console for any import errors or warnings

## Notes
- **Why this move is needed**: The PoweredByButton is a widget-specific branding icon, not a general-purpose UI component. It belongs with other widget icons like ProfileBlank, BlueStar, and Wand in the `components/widget_components/icons/` directory.
- **Component Pattern**: The PoweredByButton follows a different pattern than other icon components because it loads an external SVG file rather than rendering inline SVG. This is acceptable and doesn't need to change.
- **CDN Support**: The component supports both CDN-hosted and local SVG loading via the `NEXT_PUBLIC_CDN_BASE_URL` environment variable. This functionality must be preserved.
- **SVG Asset**: The actual SVG file (`public/assets/svgs/poweredbyfooter.svg`) stays in its current location - only the React component is being moved.
- **Import Pattern**: After the move, all imports will use `@/components/widget_components/icons/powered-by-button` which is consistent with other widget icon imports like `@/components/widget_components/icons/profile-blank`.
- **No Visual Changes**: This is purely an organizational refactor - no visual or functional changes to the component's appearance or behavior.
