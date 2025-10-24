# Feature: Complete Widget Preview Tab

## Feature Description
Add a new "Widgets" tab under the admin Widget Components section that displays full, interactive widget previews (not just individual components). The first widget to showcase is the OnboardingWidget, which is a complete, multi-phase onboarding experience combining all widget components together. This tab will follow the same preview pattern as the component library, showing live interactive demos with syntax-highlighted code and copy functionality.

## User Story
As an admin user
I want to view and interact with complete widget implementations in a preview tab
So that I can see how individual widget components work together in real-world scenarios and understand the full widget experience before using them in production

## Problem Statement
Currently, the Widget Components page (/admin/components/widgets) shows only individual widget components (icons, animations, AI elements, ask-anything) organized by category. However, there's no way to preview how these components work together as complete, functional widgets. The OnboardingWidget (`components/widget_components/complete/onboarding-widget.tsx`) is a sophisticated, multi-phase widget that combines many components together, but administrators have no visual way to explore or understand its functionality without digging into the code.

## Solution Statement
Create a fifth tab called "Widgets" on the Widget Components page that displays complete widget implementations with interactive previews. This tab will:
1. Use the same ComponentPreview pattern as UI Components for consistency
2. Display the OnboardingWidget as a live, interactive demo with its full 18-phase flow
3. Provide syntax-highlighted code snippets for the widget
4. Include navigation controls (Previous/Next) between different widgets (future-proof)
5. Show metadata like description, phase count, and component dependencies
6. Support dark mode toggle for preview testing

## Relevant Files
Use these files to implement the feature:

- `app/admin/components/widgets/page.tsx` - Current Widget Components page with 4 tabs (icons, animations, ai-elements, ask-anything). **Relevant because**: Need to add a 5th tab for "Widgets" following the existing tab pattern.

- `convex/components.ts` - Convex queries for component lists. **Relevant because**: Need to add a query to return complete widget metadata (name, description, path, dependencies).

- `convex/componentPreviews.ts` - Component preview data with code snippets and navigation. **Relevant because**: Need to add WIDGET_DATA array with onboarding-widget metadata and code, plus getWidgetPreview query.

- `components/ComponentPreview.tsx` - Reusable preview container with tabs and dark mode. **Relevant because**: Will be reused for widget previews with same UX as UI components.

- `components/CodeBlock.tsx` - Syntax highlighting component. **Relevant because**: Will display widget source code.

- `components/component-previews/widget-demos.tsx` - Existing demos for individual widget components. **Relevant because**: Need to add OnboardingWidgetDemo function.

- `components/widget_components/complete/onboarding-widget.tsx` - The complete onboarding widget to showcase. **Relevant because**: This is the first widget that will be displayed in the new tab.

- `components/widget_components/types.ts` - Widget types and interfaces. **Relevant because**: Contains OnboardingWidgetProps interface needed for demo.

### New Files
- `app/admin/components/widgets/complete/[widget]/page.tsx` - Dynamic route for individual complete widget previews (e.g., `/admin/components/widgets/complete/onboarding-widget`). Will render the ComponentPreview with live demo and code.

## shadcn/ui Components
### Existing Components to Use
- `Tabs, TabsContent, TabsList, TabsTrigger` from `components/ui/tabs.tsx` - For adding the new "Widgets" tab
- `Card, CardContent, CardHeader, CardTitle` from `components/ui/card.tsx` - For widget preview cards in the list
- `Button` from `components/ui/button.tsx` - For "View Preview" actions
- `Badge` from `components/ui/badge.tsx` - For displaying metadata (phase count, component count)
- `Skeleton` from `components/ui/skeleton.tsx` - For loading states
- `ScrollArea` from `components/ui/scroll-area.tsx` - For scrollable widget list

### New Components to Add
None - all required shadcn/ui components are already installed.

### Custom Components to Create
None - will reuse existing ComponentPreview, CodeBlock, and widget components.

## Implementation Plan
### Phase 1: Foundation
Set up the data layer and routing structure:
1. Add complete widgets data structure to Convex (widget metadata with descriptions, phase info, dependencies)
2. Create Convex query to fetch widget preview data with navigation
3. Create dynamic route for individual widget previews
4. Add OnboardingWidgetDemo component to widget-demos.tsx

### Phase 2: Core Implementation
Build the "Widgets" tab UI and preview pages:
1. Add "Widgets" tab to TabsList in widgets/page.tsx
2. Create TabsContent for "Widgets" displaying list of complete widgets
3. Implement widget preview page with ComponentPreview integration
4. Add widget source code to componentPreviews.ts
5. Wire up navigation between widgets

### Phase 3: Integration
Connect everything and ensure consistency:
1. Update component stats to include complete widgets count
2. Test dark mode toggle on widget preview
3. Verify copy-to-clipboard for widget code
4. Ensure responsive design matches existing tabs
5. Add loading and error states

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Convex Data Layer
- Add `WIDGET_DATA` array to `convex/componentPreviews.ts` with:
  - `name: "onboarding-widget"`
  - `description: "Complete multi-phase onboarding widget with 18 interactive phases"`
  - `category: "widgets"`
  - `phases: 18`
  - `componentCount: 13` (counts individual widget components used)
  - `dependencies: ["GlassWidgetContainer", "DualPhaseProgress", "PromptInput", ...]` (list key components)
  - Full source code snippet from `components/widget_components/complete/onboarding-widget.tsx` (truncated to ~200 lines focusing on key structure)
- Create `getWidgetPreview` query in `convex/componentPreviews.ts`:
  - Accept `widgetName: v.string()` parameter
  - Use `requireAdmin(ctx)`
  - Find widget in WIDGET_DATA array
  - Return widget with navigation metadata (previous/next widget names, current position, total count)
  - Return `null` if widget not found
- Create `getCompleteWidgetsList` query in `convex/components.ts`:
  - Use `requireAdmin(ctx)`
  - Return array with onboarding-widget metadata (name, path, description, phases, componentCount)
- Update `getComponentStats` in `convex/components.ts`:
  - Add `completeWidgets: 1` to returned stats
  - Update `totalComponents` to include complete widgets

### Step 2: Create OnboardingWidgetDemo Component
- Add `OnboardingWidgetDemo` function to `components/component-previews/widget-demos.tsx`:
  - Import OnboardingWidget from `@/components/widget_components/complete/onboarding-widget`
  - Create demo with `isExpanded={true}` and `onExpandChange` handler
  - Set fixed height container (720px) to contain the widget
  - Add helpful text like "Interactive 18-phase onboarding experience"
- Export in `WIDGET_DEMOS` mapping as `"onboarding-widget": OnboardingWidgetDemo`

### Step 3: Create Dynamic Widget Preview Route
- Create file `app/admin/components/widgets/complete/[widget]/page.tsx`:
  - Mark as "use client"
  - Import ComponentPreview, CodeBlock, widget-demos, Convex hooks
  - Accept `params: Promise<{ widget: string }>` interface
  - Use `use(params)` to unwrap widget name (Next.js 16 pattern)
  - Fetch widget data via `useQuery(api.componentPreviews.getWidgetPreview, { widgetName: widget })`
  - Render loading state with Skeleton components
  - Render error state with Alert if widget not found
  - Get demo component from `WIDGET_DEMOS[widget]`
  - Render breadcrumb: Admin / Components / Widget Components / Widgets / {widget name}
  - Display widget header with name, phase count badge, component count badge
  - Render Previous/Next navigation buttons using navigation metadata
  - Use ComponentPreview with .Demo and .Code sub-components
  - Add "Back to Widgets" button linking to `/admin/components/widgets?tab=widgets`

### Step 4: Add "Widgets" Tab to Widget Components Page
- Modify `app/admin/components/widgets/page.tsx`:
  - Add `widgets` tab to TabsList: `<TabsTrigger value="widgets">Widgets {!isLoading && '(1)'}</TabsTrigger>`
  - Update grid-cols from `grid-cols-4` to `grid-cols-5` in TabsList
  - Create new TabsContent for "widgets" value
  - Fetch complete widgets via `useQuery(api.components.getCompleteWidgetsList)`
  - Display widgets in grid layout matching other tabs (3 columns)
  - Each widget card shows:
    - Package icon
    - Widget name (clickable title)
    - Description
    - Badges for phase count and component count
    - "View Preview" button with Eye icon
  - Link cards and buttons to `/admin/components/widgets/complete/{widget-name}`
  - Filter widgets by search query
  - Show empty state: "No complete widgets found"

### Step 5: Update Statistics Display
- Modify stats section in `app/admin/components/widgets/page.tsx`:
  - Update total count calculation to include complete widgets from new query
  - Update filtered count to include `getFilteredCount("widgets")` when search is active
- Update `app/admin/components/page.tsx` (Components Overview):
  - Display complete widgets count from stats in Category Breakdown section
  - Add new card in category breakdown grid: "widgets: {count}"

### Step 6: Verify Widget Code Integration
- Ensure `convex/componentPreviews.ts` WIDGET_DATA includes properly formatted TypeScript code
- Code should focus on:
  - Component structure and key phases
  - Important state management (currentPhase, isStreaming, etc.)
  - Key UI patterns (streaming text, phase navigation, validation transitions)
  - Truncate repetitive phase definitions to keep code snippet under 250 lines
  - Include comment noting "// ... additional phases 6-17 follow same pattern"

### Step 7: Test Widget Preview End-to-End
- Run `npx convex dev` to deploy Convex queries
- Run `bun dev` and navigate to `/admin/components/widgets`
- Verify "Widgets" tab appears and displays correctly
- Click onboarding-widget card and verify preview loads
- Test interactive widget functionality (phase navigation, buttons, inputs)
- Toggle dark mode and verify widget displays correctly
- Test code tab and copy-to-clipboard functionality
- Navigate back to widgets list and verify search filtering works
- Test Previous/Next navigation buttons (should be disabled with only 1 widget)

### Step 8: Run Validation Commands
- Execute `bun run build` to verify TypeScript compilation
- Execute `npx convex dev` to deploy schema and functions
- Execute `bun dev` and manually test complete feature end-to-end
- Verify no console errors in browser
- Test all interactive elements (tabs, preview, navigation, copy)

## Testing Strategy
### Unit Tests
- Not applicable for this feature (UI-focused with no complex logic)

### Integration Tests
- Manual testing of widget preview page with live OnboardingWidget
- Test Convex query returns correct widget data
- Test navigation metadata (previous/next) calculates correctly
- Test ComponentPreview integrates correctly with widget demo

### Edge Cases
- Widget not found: Display error state with helpful message
- Empty search results in Widgets tab: Show "No widgets found" message
- Widget with no code: Handle gracefully (though all widgets should have code)
- Very long widget code: Ensure CodeBlock scrolls properly
- Dark mode: Widget should render correctly in both light and dark themes
- Mobile responsive: Widget preview should be usable on smaller screens
- Navigation with single widget: Previous/Next buttons should be disabled

## Acceptance Criteria
- [ ] "Widgets" tab appears as 5th tab in Widget Components page
- [ ] Clicking "Widgets" tab displays grid of complete widgets (currently 1: onboarding-widget)
- [ ] Widget card shows name, description, phase count badge, component count badge, and "View Preview" button
- [ ] Clicking widget card or "View Preview" navigates to `/admin/components/widgets/complete/onboarding-widget`
- [ ] Widget preview page displays breadcrumb navigation
- [ ] Widget preview shows live, interactive OnboardingWidget with all 18 phases functional
- [ ] Code tab displays syntax-highlighted widget source code
- [ ] Copy button successfully copies code to clipboard
- [ ] Dark mode toggle works correctly for widget preview
- [ ] Previous/Next navigation buttons are disabled (only 1 widget currently)
- [ ] "Back to Widgets" button returns to widgets tab
- [ ] Search filtering works on Widgets tab
- [ ] Component stats include complete widgets count
- [ ] Loading states display Skeleton components
- [ ] Error state displays Alert when widget not found
- [ ] Build completes without TypeScript errors
- [ ] No console errors during usage

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually test:
  - Navigate to `/admin/components/widgets`
  - Click "Widgets" tab (5th tab)
  - Verify onboarding-widget card displays with metadata
  - Click "View Preview" button
  - Verify `/admin/components/widgets/complete/onboarding-widget` loads
  - Interact with widget phases (click suggestions, navigate phases)
  - Toggle dark mode and verify widget renders correctly
  - Click "Code" tab and verify syntax highlighting
  - Click copy button and verify code copies to clipboard
  - Click "Back to Widgets" and verify return to list
  - Test search filtering on Widgets tab
  - Verify Previous/Next buttons are disabled

## Notes
- **Future Expansion**: This implementation is designed to support multiple complete widgets. When adding more widgets in the future:
  1. Add widget metadata to WIDGET_DATA in componentPreviews.ts
  2. Add widget entry to getCompleteWidgetsList in components.ts
  3. Create demo function in widget-demos.tsx
  4. Update stats count
  5. Navigation buttons will automatically enable

- **Widget Code Length**: The onboarding-widget.tsx file is 1088 lines. For the code snippet in componentPreviews.ts, we'll show the first ~200 lines (imports, types, main structure, 3-4 phase examples) with a comment indicating "// ... additional phases follow same pattern". This keeps the code preview useful without overwhelming the viewer.

- **Performance Consideration**: The OnboardingWidget is a complex component with animations. The preview may have higher resource usage than simple component previews. This is expected and acceptable for showcasing the full widget experience.

- **Responsive Design**: The OnboardingWidget is designed for a fixed width (348px expandedWidth). The preview page should center the widget with adequate padding on mobile devices.

- **Component Dependencies**: The onboarding-widget depends on 13+ individual widget components. All are already installed and working in the codebase. No new dependencies needed.
