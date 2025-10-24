# Feature: Dashboard Sidebar Navigation

## Feature Description
Add a persistent sidebar navigation menu to the dashboard that displays on all dashboard-related pages. The sidebar will contain navigation links for "Set up Gist Answers" (which includes "Provide your content" - the current dashboard page, and "Install your widget" - a new blank page). This creates a consistent navigation pattern for the multi-step widget configuration workflow.

## User Story
As a user configuring my Gist widget
I want to see a sidebar with clear navigation steps
So that I can understand the configuration workflow and easily navigate between setup phases

## Problem Statement
The current dashboard page exists in isolation without clear navigation or indication of next steps. Users need a way to understand the overall configuration workflow and navigate between different setup phases (content configuration and widget installation).

## Solution Statement
Implement a persistent left sidebar navigation menu that:
1. Displays the user profile (name/avatar) at the top
2. Shows a hierarchical navigation structure with "Set up Gist Answers" as the parent and two child items
3. Highlights the active page
4. Is present on all dashboard-related pages
5. Provides a consistent layout wrapper for dashboard content

## Relevant Files
Use these files to implement the feature:

- `app/dashboard/page.tsx` - Current "Provide your content" page, needs to be wrapped in sidebar layout
- `app/layout.tsx` - Root layout with ClerkProvider and ConvexClientProvider
- `components/Header.tsx` - Existing header component with authentication UI
- `components/ui/button.tsx` - shadcn/ui Button component for navigation items
- `lib/utils.ts` - Contains cn() utility for class name merging
- `middleware.ts` - Route protection configuration (may need to add new route)

### New Files

- `app/dashboard/layout.tsx` - New dashboard-specific layout with sidebar navigation
- `components/DashboardSidebar.tsx` - Sidebar navigation component with user profile and menu items
- `app/dashboard/install-widget/page.tsx` - New blank page for widget installation step

## shadcn/ui Components
### Existing Components to Use
- `components/ui/button.tsx` - For navigation menu items (variant="ghost" for unselected, variant="default" or custom styling for active state)
- `components/ui/card.tsx` - Potentially for user profile section at top of sidebar

### New Components to Add
No new shadcn/ui components needed from the registry. The sidebar will use existing Button components and custom styling.

### Custom Components to Create
- `DashboardSidebar` - Custom sidebar navigation component following shadcn/ui patterns:
  - Uses CVA for active/inactive state variants
  - Uses React.forwardRef pattern (not required for non-DOM components, but good practice)
  - Uses CSS variables for theming (bg-sidebar, text-sidebar-foreground, etc.)
  - Uses cn() utility for class merging
  - Maintains accessibility with proper ARIA labels and semantic HTML

## Implementation Plan
### Phase 1: Foundation
Create the dashboard layout structure that will wrap all dashboard pages with the sidebar navigation. This includes:
1. Creating the dashboard-specific layout file (`app/dashboard/layout.tsx`)
2. Building the sidebar component with basic structure
3. Setting up navigation data structure and routing

### Phase 2: Core Implementation
Implement the sidebar navigation component with all visual and functional requirements:
1. User profile section at top (using Clerk user data)
2. Hierarchical navigation menu with parent/child structure
3. Active state highlighting based on current route
4. Responsive styling matching the reference design
5. Integration with Next.js Link component for navigation

### Phase 3: Integration
Connect the sidebar to existing pages and create the new installation page:
1. Verify current dashboard page works within new layout
2. Create blank "Install your widget" page
3. Test navigation between pages
4. Ensure Header component works correctly with sidebar layout

## Step by Step Tasks

### Step 1: Create Dashboard Layout with Sidebar Structure
- Create `app/dashboard/layout.tsx` that wraps all dashboard pages
- Set up flex layout with sidebar and main content area
- Include Header component at the top
- Ensure proper responsive behavior (sidebar should be fixed width, content should flex)

### Step 2: Build DashboardSidebar Component Foundation
- Create `components/DashboardSidebar.tsx`
- Import necessary dependencies (Link from next/link, useUser from Clerk, usePathname from next/navigation)
- Define navigation structure as typed constant:
  ```typescript
  const navigation = [
    {
      name: 'Set up Gist Answers',
      items: [
        { name: 'Provide your content', href: '/dashboard' },
        { name: 'Install your widget', href: '/dashboard/install-widget' }
      ]
    }
  ]
  ```
- Set up component structure with user profile section and navigation section

### Step 3: Implement User Profile Section
- Use `useUser()` hook from Clerk to get current user data
- Display user name and email at top of sidebar
- Add "Support" link at bottom of sidebar (matching reference design)
- Style with appropriate spacing and text sizing
- Use Clerk's UserButton component or custom avatar display

### Step 4: Implement Navigation Menu with Active States
- Use `usePathname()` hook to detect current route
- Map through navigation structure to render menu items
- Apply active state styling when current pathname matches href
- Use Button component with variant="ghost" for inactive items
- Add custom active state styling (blue background, as shown in reference)
- Ensure proper indentation for child menu items

### Step 5: Style Sidebar to Match Reference Design
- Set fixed width for sidebar (approximately 240-280px based on reference)
- Add white background with border-right
- Style navigation items:
  - Parent items: Bold or medium weight font
  - Child items: Indented, regular weight
  - Active state: Blue background (bg-blue-50 or similar), blue text
  - Hover states: Subtle background change
- Add proper spacing between sections
- Style Support link at bottom with mail icon

### Step 6: Create Install Widget Page
- Create `app/dashboard/install-widget/page.tsx`
- Add basic page structure with heading "Install your widget"
- Add placeholder content indicating this feature is coming soon
- Ensure page is wrapped by dashboard layout automatically
- Use proper TypeScript types for Next.js page component

### Step 7: Test Navigation and Layout Integration
- Verify sidebar appears on both dashboard pages
- Test navigation between "Provide your content" and "Install your widget"
- Ensure active state highlighting works correctly
- Verify Header component displays correctly with sidebar
- Test responsive behavior at different screen sizes
- Ensure existing dashboard form functionality is not affected

### Step 8: Accessibility and Final Polish
- Add proper ARIA labels to navigation elements
- Ensure keyboard navigation works (tab through menu items, enter to activate)
- Add aria-current="page" to active navigation items
- Verify color contrast meets WCAG AA standards
- Test with screen reader (if available) or ensure semantic HTML
- Add smooth transition effects for hover/active states

### Step 9: Validation
Execute all validation commands to ensure the feature works correctly with zero regressions:
- Run build to check for TypeScript errors
- Start dev server and manually test both pages
- Verify navigation, layout, and existing form functionality
- Check browser console for errors

## Testing Strategy
### Unit Tests
- Test that DashboardSidebar renders with correct navigation structure
- Test that active state is applied based on current pathname
- Test that user profile section displays Clerk user data correctly
- Test that navigation links have correct href attributes

### Integration Tests
- Test navigation between dashboard pages updates active state
- Test that sidebar persists across page navigations
- Test that Header component and sidebar work together without layout issues
- Test that form submission on "Provide your content" page still works

### Edge Cases
- User not authenticated (should redirect via middleware before seeing sidebar)
- Very long publication names in user profile section (should truncate or wrap)
- Narrow viewport widths (sidebar should remain fixed width with content scrolling)
- Direct navigation to `/dashboard/install-widget` (should show correct active state)
- Empty user name from Clerk (should handle gracefully with fallback)

## Acceptance Criteria
- [ ] Sidebar appears on all pages under `/dashboard` route
- [ ] Sidebar displays user name and email from Clerk at the top
- [ ] Navigation menu shows "Set up Gist Answers" parent with two child items
- [ ] "Provide your content" menu item links to `/dashboard`
- [ ] "Install your widget" menu item links to `/dashboard/install-widget`
- [ ] Active menu item is highlighted with blue background
- [ ] Support link appears at bottom of sidebar
- [ ] New "Install your widget" page exists and is accessible
- [ ] Existing dashboard form functionality remains unaffected
- [ ] Navigation between pages works smoothly
- [ ] Layout is responsive and matches reference design
- [ ] Keyboard navigation and accessibility standards are met
- [ ] No TypeScript errors in build
- [ ] No console errors during navigation

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background, should have no changes)
- `bun dev` - Start the Next.js dev server and manually test:
  - Navigate to `/dashboard` and verify sidebar appears
  - Verify "Provide your content" is highlighted as active
  - Click "Install your widget" and verify navigation works
  - Verify "Install your widget" is now highlighted as active
  - Navigate back to "Provide your content" and verify active state updates
  - Submit the form on "Provide your content" page and verify it still works
  - Check Header component displays correctly
  - Verify Support link is clickable
  - Test responsive behavior by resizing browser window
  - Check browser console for any errors

## Notes

### Design Considerations
Based on the reference image:
- Sidebar has white background with subtle right border
- Active navigation item has light blue background (similar to bg-blue-50 or bg-violet-50 to match the Save button)
- User profile section at top shows name with "Partner Admin" role indicator
- Support link at bottom has mail icon
- Navigation items are left-aligned with appropriate padding
- Child menu items are indented relative to parent

### Future Enhancements
- Add more sections to sidebar as additional features are developed
- Implement collapsible sidebar for mobile views
- Add notifications or status indicators to menu items
- Implement keyboard shortcuts for navigation
- Add breadcrumbs in main content area for additional context

### Technical Notes
- Dashboard layout will wrap all pages in `/dashboard` directory automatically via Next.js nested layouts
- `usePathname()` hook from `next/navigation` provides client-side routing awareness
- Clerk's `useUser()` hook provides access to authenticated user data
- Component should use "use client" directive since it uses hooks (usePathname, useUser)
- Navigation structure could be extracted to a separate constants file for easier maintenance
