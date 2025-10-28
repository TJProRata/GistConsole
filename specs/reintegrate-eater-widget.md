# Chore: Reintegrate Eater Widget to Admin Widget Library and Add AI Components to Components AI Library

## Chore Description
The Eater Widget and its related components currently exist in the codebase but are not properly integrated into the admin components page at `/admin/components/widgets`. The widget component files are present in the file system (`components/widget_components/complete/eater-widget.tsx` and supporting components in `ai-elements/`), and there's even a preview page at `/admin/components/widgets/complete/eater-widget/page.tsx`, but the widget is not appearing in the Convex database queries that populate the admin interface.

This chore will:
1. **Add Eater Widget to the Admin Widget Library** - Update `getCompleteWidgetsList` Convex query to include Eater Widget in the "Widgets" tab at `/admin/components/widgets`
2. **Add Eater AI Components to the Components AI Library** - Update `getWidgetComponentsList` Convex query to include 4 Eater-specific components (eater-header, eater-question-pill, eater-search-input-section, eater-seed-question-pills) in the "AI Elements" tab

The Eater Widget is a food and restaurant discovery AI assistant featuring:
- Eater red (#E60001) brand color
- Premium Degular/Literata typography
- Signature red squiggle underlines on seed question pills
- Ultra-rounded 132px pill-shaped input
- Circular submit button
- Controlled/uncontrolled expansion states
- Navigation to Women's World Answer Page on submit

## Relevant Files
Use these files to resolve the chore:

- **`convex/components.ts`** (line 117-161) - Contains `getCompleteWidgetsList` query that needs to be updated to include the Eater Widget. Currently lists 5 widgets but Eater Widget is missing from the array.

- **`components/widget_components/index.ts`** (line 52) - Already exports `EaterWidget` from `./complete/eater-widget`, and exports related Eater components (EaterHeader, EaterQuestionPill, EaterSearchInputSection, EaterSeedQuestionPills) from ai-elements. No changes needed - this file is correctly configured.

- **`components/widget_components/complete/eater-widget.tsx`** (355 lines) - The complete Eater Widget implementation. File exists and is properly implemented with all features. No changes needed.

- **`app/admin/components/widgets/complete/eater-widget/page.tsx`** (426 lines) - Preview page for Eater Widget with interactive demo, variants, code examples, and props documentation. File exists and is complete. No changes needed.

- **`components/component-previews/widget-demos.tsx`** (line 437-520) - Contains demo components for Eater-related components (EaterHeaderDemo, EaterQuestionPillDemo, EaterSearchInputSectionDemo, EaterSeedQuestionPillsDemo, EaterWidgetDemo). Already properly implemented and registered in `WIDGET_DEMOS` mapping (line 543-547). No changes needed.

- **`components/widget_components/types.ts`** - TypeScript type definitions file. Need to verify if Eater Widget types are exported (EaterWidgetProps, EaterHeaderProps, etc.).

- **`app/admin/components/widgets/page.tsx`** (426 lines) - Main widgets browsing page that displays widget cards in tabs by category. Uses `getCompleteWidgetsList` query to fetch widgets. Once Convex query is updated, this page will automatically show the Eater Widget. No direct changes needed.

### Summary
The widget component files and preview page are fully implemented. The only missing pieces are:
1. **Admin Widget Library** - Adding the Eater Widget entry to the `getCompleteWidgetsList` Convex query (Widgets tab)
2. **Components AI Library** - Adding 4 Eater AI component entries to the `getWidgetComponentsList` Convex query (AI Elements tab)

The widget demos are already registered in `widget-demos.tsx`. We need to verify type exports and update both Convex queries to make the widget and its components visible in the admin interface.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Verify Eater Widget Type Exports
- Read `components/widget_components/types.ts` to check if Eater Widget types are properly exported
- Look for these type exports:
  - `EaterWidgetProps`
  - `EaterHeaderProps`
  - `EaterSearchInputProps`
  - `EaterSeedQuestionPillsProps`
  - `EaterQuestionPillProps`
- If types are missing, they are defined inline in `components/widget_components/complete/eater-widget.tsx` (lines 10-15) and need to be moved to `types.ts`
- If types exist but are not exported, add them to the exports list in `index.ts` (after line 101)

### Step 2: Add Eater Widget to Admin Widget Library (Complete Widgets Query)
- Edit `convex/components.ts` in the `getCompleteWidgetsList` query (lines 117-161)
- **Add Eater Widget to the Admin Widget Library** by adding this entry to the `completeWidgets` array after the `nyt-chat-widget` entry (after line 156):
  ```typescript
  {
    name: "eater-widget",
    path: "components/widget_components/complete/eater-widget.tsx",
    description: "Food and restaurant discovery AI assistant with Eater red branding, squiggle underlines, and ultra-rounded pill input",
    phases: 1,
    componentCount: 5,
  },
  ```
- Update the count comment on line 24 from `// Complete widgets count` value from 5 to 6
- Update the `completeWidgetsCount` variable on line 24 from 5 to 6
- Update the category breakdown object on line 32 `widgets: completeWidgetsCount` (value will now be 6)
- **Result**: Eater Widget will now appear in the "Widgets" tab at `/admin/components/widgets`

### Step 3: Add Eater AI Components to Components AI Library (Widget Components Query)
- Edit `convex/components.ts` in the `getWidgetComponentsList` query (lines 79-114)
- **Add Eater AI components to the Components AI Library** by adding the 4 Eater-specific components to the `ai-elements` array:
  - `eater-header`
  - `eater-question-pill`
  - `eater-search-input-section`
  - `eater-seed-question-pills`
- Add these entries after line 105 (after `search-input-section`):
  ```typescript
  { name: "eater-header", path: "components/widget_components/ai-elements/eater-header.tsx", category: "ai-elements", description: "Eater widget header with title and close button" },
  { name: "eater-question-pill", path: "components/widget_components/ai-elements/eater-question-pill.tsx", category: "ai-elements", description: "Individual Eater seed question button with red squiggle underline" },
  { name: "eater-search-input-section", path: "components/widget_components/ai-elements/eater-search-input-section.tsx", category: "ai-elements", description: "Eater search input with icon prefix and circular submit button" },
  { name: "eater-seed-question-pills", path: "components/widget_components/ai-elements/eater-seed-question-pills.tsx", category: "ai-elements", description: "Container for Eater seed question pills with squiggle underlines" },
  ```
- Update the count on line 21 from `widgetComponentsCount = 16` to `20` (adding 4 Eater components)
- Update the `ai-elements` count on line 30 from `"ai-elements": 10` to `"ai-elements": 14`
- **Result**: Eater AI components will now appear in the "AI Elements" tab at `/admin/components/widgets`

### Step 4: Verify SVG Asset
- Verify that `public/assets/svgs/eatersquiggle.svg` exists (it should based on file search results)
- This file is referenced in the Eater Widget component for the squiggle underline decoration
- No action needed if file exists

### Step 5: Deploy Convex Schema and Functions
- Run `npx convex dev` in the background to deploy the updated queries
- Wait for deployment to complete successfully
- Verify no deployment errors in the terminal output

### Step 6: Manual Validation - Admin Widget Library and Components AI Library
- Start the Next.js dev server with `bun dev`
- Navigate to `http://localhost:3000/admin/components/widgets`

#### Validate Admin Widget Library (Widgets Tab)
- Click on the "Widgets" tab (5th tab)
- Verify that the Eater Widget card appears in the list with:
  - Title: "eater widget" (formatted from kebab-case)
  - Description: "Food and restaurant discovery AI assistant with Eater red branding, squiggle underlines, and ultra-rounded pill input"
  - Badge: "1 Phases"
  - Badge: "5 Components"
  - Path: "components/widget_components/complete/eater-widget.tsx"
  - "View Preview" button link to `/admin/components/widgets/complete/eater-widget`
- Click "View Preview" button to navigate to the Eater Widget preview page
- Verify the preview page loads at `http://localhost:3000/admin/components/widgets/complete/eater-widget`
- Test the interactive demo:
  - Verify the widget displays with Eater red (#E60001) branding
  - Test expanding/collapsing with toggle buttons
  - Click seed question pills to populate input
  - Verify red squiggle underlines appear under pills
  - Type in the search input (ultra-rounded 132px pill shape)
  - Verify circular submit button appears
  - Test keyboard navigation (Enter to submit)
- Test the other tabs (Variants, Code, Props) to ensure they load correctly

#### Validate Components AI Library (AI Elements Tab)
- Navigate back to `http://localhost:3000/admin/components/widgets`
- Click on the "AI Elements" tab (3rd tab)
- Verify that the 4 Eater AI components appear in the list:
  1. **eater-header** - "Eater widget header with title and close button"
  2. **eater-question-pill** - "Individual Eater seed question button with red squiggle underline"
  3. **eater-search-input-section** - "Eater search input with icon prefix and circular submit button"
  4. **eater-seed-question-pills** - "Container for Eater seed question pills with squiggle underlines"
- Verify each component card shows:
  - Badge: "ai-elements"
  - Path: "components/widget_components/ai-elements/[component-name].tsx"
  - "View Preview" button
- Click "View Preview" on each Eater component to ensure preview pages load (they should use the demos from `widget-demos.tsx`)
- Navigate back to the Widgets tab to verify Eater Widget still appears

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete

## Notes

### Implementation Status
- The Eater Widget component and all supporting files are already fully implemented and functional
- The preview page at `/admin/components/widgets/complete/eater-widget/page.tsx` is complete with interactive demos, variants, code examples, and documentation
- The widget demos are already registered in `components/component-previews/widget-demos.tsx`
- No changes to the widget component itself are needed - it's production-ready

### What's Missing
The only missing pieces are the Convex database query entries:
1. **Admin Widget Library** - Eater Widget entry in `getCompleteWidgetsList` query
2. **Components AI Library** - 4 Eater AI component entries in `getWidgetComponentsList` query

### Expected Results
After this chore is complete:
- **Admin Widget Library (Widgets Tab)**: Will show 6 complete widgets (was 5)
  - Eater Widget will appear with preview page link
- **Components AI Library (AI Elements Tab)**: Will show 14 AI element components (was 10)
  - 4 Eater-specific components will be browsable and previewable
- **Total Widget Components**: Will increase from 16 to 20

### Additional Details
- The widget includes comprehensive accessibility features (ARIA labels, keyboard navigation, focus states)
- The widget automatically navigates to `/womens-world/answers?q=<question>` on submit (this may need to be updated to a valid route in the future)
- Eater brand color: #E60001 (Eater red)
- Typography: Degular (headings/pills) and Literata (input)
- Key feature: Red squiggle underlines on seed question pills
