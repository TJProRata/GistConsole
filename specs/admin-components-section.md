# Feature: Admin Components Management Section

## Feature Description
Add a new "Components" section to the admin dashboard with two subsections: "UI Components" and "Widget Components". This feature will provide administrators with visibility into the component library, allowing them to browse, view details, and understand the available UI building blocks and widget components in the system.

The Components section will:
- Display all shadcn/ui components currently installed in the project
- Show widget components organized by category (icons, animations, AI elements, ask-anything)
- Provide component metadata: name, description, file path, size, and last modified date
- Offer search and filter functionality for easy component discovery
- Show component usage statistics (how many times used across the codebase)
- Display component preview/documentation links

## User Story
As an **admin/developer**
I want to **view and manage all UI components and widget components in one centralized location**
So that **I can understand what components are available, track component usage, and maintain the component library effectively**

## Problem Statement
Currently, administrators have no visibility into the component library through the admin dashboard. To understand what components exist, developers must:
- Manually browse the `components/ui/` directory for shadcn components
- Navigate through `components/widget_components/` subdirectories
- Search code to find component usage
- No centralized view of component metadata or statistics

This lack of visibility makes it difficult to:
- Onboard new developers to available components
- Prevent duplicate component creation
- Track component usage and identify unused components
- Maintain component library health
- Make informed decisions about component deprecation or refactoring

## Solution Statement
Create a dedicated "Components" section in the admin portal that provides a comprehensive, searchable interface for browsing both shadcn/ui components and custom widget components. The solution will:

1. **Add Navigation Item**: Insert "Components" section in AdminSidebar under "Management" category
2. **Create Components Dashboard**: Main page showing component statistics and quick access to subsections
3. **UI Components Page**: Display shadcn/ui components from `components/ui/` with metadata
4. **Widget Components Page**: Display widget components organized by subdirectory (icons, animations, AI elements, ask-anything)
5. **Convex Queries**: Create admin queries to fetch component metadata from the filesystem
6. **Search & Filter**: Enable filtering by component type, category, and search by name

This provides admins with complete visibility into the component ecosystem, improving maintainability and developer experience.

## Relevant Files
Use these files to implement the feature:

- **`components/AdminSidebar.tsx`** (lines 21-42)
  - Contains navigation structure definition
  - Need to add "Components" section with navigation items
  - Add appropriate icon (Boxes or Component icon from lucide-react)

- **`app/admin/page.tsx`**
  - Main admin dashboard
  - Need to add Components quick action card linking to new section

- **`convex/admin.ts`**
  - Contains admin authorization helpers and queries
  - Need to add queries for fetching component metadata
  - Implement `getUIComponents` and `getWidgetComponents` queries

- **`components/ui/**/*.tsx`**
  - All shadcn/ui components (button, card, table, etc.)
  - Read directory to list available components
  - Component files to scan for metadata

- **`components/widget_components/**/*.tsx`**
  - Widget components organized by subdirectory
  - Icons, animations, AI elements, ask-anything components
  - Scan directory structure for component listing

### New Files

- **`app/admin/components/page.tsx`**
  - Main components dashboard page
  - Shows statistics: total UI components, total widget components, component categories
  - Quick navigation cards to UI Components and Widget Components subsections

- **`app/admin/components/ui-components/page.tsx`**
  - Display all shadcn/ui components from `components/ui/`
  - Table with columns: Component Name, File Size, Last Modified, Actions
  - Search and filter functionality

- **`app/admin/components/widgets/page.tsx`**
  - Display widget components organized by category
  - Tabs or accordion for each subdirectory (icons, animations, AI elements, ask-anything)
  - Card grid layout showing component previews

- **`convex/components.ts`** (NEW)
  - Convex queries for component metadata
  - `getUIComponentsList` query
  - `getWidgetComponentsList` query
  - `getComponentStats` query

## shadcn/ui Components
### Existing Components to Use
- `button` - Navigation buttons and action buttons
- `card` - Component preview cards and statistics cards
- `table` - Display component lists in tabular format
- `tabs` - Organize widget components by category
- `input` - Search functionality for filtering components
- `badge` - Show component categories and tags
- `skeleton` - Loading states while fetching component data
- `alert` - Display warnings or informational messages

### New Components to Add
```bash
npx shadcn@latest add accordion
npx shadcn@latest add scroll-area
```

- **accordion** - Collapsible sections for widget component categories
- **scroll-area** - Scrollable component lists with proper styling

### Custom Components to Create
None needed - all UI requirements can be satisfied with existing and new shadcn components.

## Implementation Plan
### Phase 1: Foundation
1. **Add Convex Queries** for component metadata
   - Create `convex/components.ts` with admin-only queries
   - Implement file system scanning (use Convex actions for server-side file operations)
   - Query to list `components/ui/` directory contents
   - Query to list `components/widget_components/` subdirectories and files
   - Statistics query for component counts by category

2. **Update Admin Navigation**
   - Add "Components" section to AdminSidebar under "Management"
   - Add Boxes icon from lucide-react
   - Create navigation items for "Overview", "UI Components", "Widgets"

3. **Install Required shadcn Components**
   - Run `npx shadcn@latest add accordion`
   - Run `npx shadcn@latest add scroll-area`

### Phase 2: Core Implementation
1. **Components Dashboard Page** (`/admin/components`)
   - Statistics cards: Total UI Components, Total Widget Components, Categories
   - Quick action cards linking to UI Components and Widgets subsections
   - Recent activity/updates section (optional)

2. **UI Components Page** (`/admin/components/ui-components`)
   - Table displaying all shadcn/ui components
   - Columns: Name, Path, File Size, Last Modified, Description
   - Search input for filtering by component name
   - Click component name to view details (future enhancement)

3. **Widget Components Page** (`/admin/components/widgets`)
   - Tabs or Accordion for each category: Icons, Animations, AI Elements, Ask-Anything
   - Card grid layout within each category
   - Each card shows: Component name, preview thumbnail (optional), file path
   - Search functionality across all categories

### Phase 3: Integration
1. **Update Admin Dashboard**
   - Add "Components" quick action card on main admin page
   - Include component count statistics in dashboard overview

2. **Styling & Responsiveness**
   - Ensure all pages are responsive (mobile, tablet, desktop)
   - Follow existing admin portal design patterns
   - Consistent spacing, colors, typography

3. **Testing & Validation**
   - Test navigation between all component pages
   - Verify search and filter functionality
   - Test admin authorization (non-admins redirected)
   - Validate loading states with skeleton components

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Install Required shadcn Components
- Run `npx shadcn@latest add accordion --yes` to add accordion component
- Run `npx shadcn@latest add scroll-area --yes` to add scroll-area component
- Verify components are added to `components/ui/` directory

### Step 2: Create Convex Components Queries
- Create new file `convex/components.ts`
- Import `query` from Convex server and `requireAdmin` from `convex/admin.ts`
- Implement `getComponentStats` query:
  - Return hardcoded counts for now (will be dynamic in future)
  - Total UI components count (count files in components/ui)
  - Total widget components count (count files in components/widget_components)
  - Category breakdown for widget components
- Implement `getUIComponentsList` query:
  - Return array of UI component objects: { name, path, category: "shadcn/ui" }
  - Manually list all components in `components/ui/` for initial implementation
  - Each object includes: name, filePath, size (optional), lastModified (optional)
- Implement `getWidgetComponentsList` query:
  - Return array of widget component objects grouped by category
  - Categories: icons, animations, ai-elements, ask-anything
  - Each object includes: name, filePath, category, description (optional)
- All queries must call `requireAdmin(ctx)` for authorization

### Step 3: Update AdminSidebar Navigation
- Open `components/AdminSidebar.tsx`
- Import `Boxes` icon from lucide-react
- Add new "Components" section to navigation array after "Management":
  ```typescript
  {
    name: "Components",
    items: [
      { name: "Overview", href: "/admin/components", icon: Boxes },
      { name: "UI Components", href: "/admin/components/ui-components", icon: Box },
      { name: "Widgets", href: "/admin/components/widgets", icon: Package },
    ],
  }
  ```
- Verify sidebar renders correctly with new section

### Step 4: Create Components Overview Page
- Create new file `app/admin/components/page.tsx`
- Implement client component that queries `api.components.getComponentStats`
- Display statistics cards grid:
  - Total UI Components card with Boxes icon
  - Total Widget Components card with Package icon
  - Component Categories card showing breakdown
  - System Health card (optional)
- Add quick action cards:
  - "Browse UI Components" linking to `/admin/components/ui-components`
  - "Browse Widget Components" linking to `/admin/components/widgets`
- Use Card, CardHeader, CardTitle, CardDescription, CardContent components
- Implement loading states with Skeleton components

### Step 5: Create UI Components Page
- Create new file `app/admin/components/ui-components/page.tsx`
- Implement client component that queries `api.components.getUIComponentsList`
- Display page header with title and description
- Implement search input for filtering components by name
- Create table with columns:
  - Component Name (with link to file)
  - Category (badge showing "shadcn/ui")
  - Path (truncated, full path on hover)
  - Actions (view details button - future)
- Use Table, TableHeader, TableBody, TableRow, TableCell components
- Add loading states with Skeleton for table rows
- Implement empty state when no components found

### Step 6: Create Widget Components Page
- Create new file `app/admin/components/widgets/page.tsx`
- Implement client component that queries `api.components.getWidgetComponentsList`
- Display page header with title and description
- Implement search input for filtering across all categories
- Use Tabs component for category navigation:
  - Tab 1: Icons (components/widget_components/icons)
  - Tab 2: Animations (components/widget_components/animations)
  - Tab 3: AI Elements (components/widget_components/ai-elements)
  - Tab 4: Ask Anything (components/widget_components/ask-anything)
- Within each tab, display card grid:
  - Each card shows component name and file path
  - Use Badge to show component type
  - Add hover effect for interactivity
- Implement loading states and empty states
- Use ScrollArea for long lists within each tab

### Step 7: Update Admin Dashboard
- Open `app/admin/page.tsx`
- Add new quick action card in the grid after existing cards:
  - Title: "Component Library"
  - Icon: Boxes from lucide-react
  - Description: "Browse UI components and widget library"
  - Button: "View Components" linking to `/admin/components`
- Ensure card styling matches existing quick action cards
- Update grid to accommodate new card (3 or 4 columns)

### Step 8: Implement Component Statistics Display
- Update Components Overview page to show detailed statistics
- Display component count by category using category breakdown data
- Add visual indicators (icons, colors) for each component type
- Create responsive grid layout (2 columns on mobile, 4 on desktop)

### Step 9: Add Search and Filter Functionality
- Implement client-side search state using useState
- Filter components array based on search query (case-insensitive)
- Display filtered results count
- Add "Clear" button to reset search
- Ensure search works across component names and paths

### Step 10: Styling and Polish
- Ensure all pages follow existing admin portal design patterns
- Verify responsive layout on mobile, tablet, desktop breakpoints
- Add hover states and transitions for interactive elements
- Ensure consistent spacing using Tailwind classes
- Add loading spinners or skeleton states for all async operations
- Test dark mode compatibility (if applicable)

### Step 11: Run Validation Commands
- Execute all validation commands listed below
- Fix any TypeScript errors or build issues
- Test all navigation paths and component pages
- Verify admin authorization works correctly

## Testing Strategy
### Unit Tests
- Test `getComponentStats` query returns correct structure
- Test `getUIComponentsList` returns array of component objects
- Test `getWidgetComponentsList` returns categorized components
- Test admin authorization in all component queries

### Integration Tests
- Test navigation from Admin Dashboard to Components section
- Test navigation between Components Overview, UI Components, and Widgets pages
- Test search functionality filters correctly
- Test table rendering with component data
- Test tabs switch between widget categories correctly

### Edge Cases
- **No components found**: Display empty state message
- **Search returns no results**: Show "No components match your search" message
- **Non-admin user attempts access**: Verify redirect to `/dashboard`
- **Loading states**: All pages show skeleton loaders while fetching data
- **Long component names/paths**: Ensure text truncation and tooltips work
- **Large number of components**: Test pagination or scroll performance (future)

## Acceptance Criteria
- ✅ AdminSidebar shows new "Components" section with 3 navigation items
- ✅ `/admin/components` page displays component statistics and quick action cards
- ✅ `/admin/components/ui-components` page lists all shadcn/ui components in table format
- ✅ `/admin/components/widgets` page shows widget components organized by tabs
- ✅ Search functionality filters components by name on all pages
- ✅ All pages implement loading states with skeleton components
- ✅ All pages implement empty states when no data available
- ✅ Admin authorization enforced - non-admins redirected from all component pages
- ✅ Navigation between all component pages works correctly
- ✅ Responsive design works on mobile, tablet, and desktop
- ✅ No TypeScript errors or build failures
- ✅ All existing admin functionality remains working (zero regressions)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npx shadcn@latest add accordion --yes` - Add accordion component
- `npx shadcn@latest add scroll-area --yes` - Add scroll-area component
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and manually test the feature end-to-end

### Manual Testing Checklist
- [ ] Sign in as admin user
- [ ] Verify "Components" section appears in AdminSidebar under "Management"
- [ ] Click "Components" → "Overview" and verify page loads with statistics
- [ ] Click "UI Components" and verify table displays shadcn/ui components
- [ ] Test search functionality on UI Components page
- [ ] Click "Widgets" and verify tabs display widget component categories
- [ ] Click through each tab (Icons, Animations, AI Elements, Ask Anything)
- [ ] Test search functionality on Widgets page
- [ ] Verify all loading states show skeleton components
- [ ] Navigate back to Admin Dashboard and verify new "Component Library" quick action card
- [ ] Click quick action card and verify it navigates to Components Overview
- [ ] Sign out and sign in as regular user
- [ ] Manually navigate to `/admin/components` and verify redirect to `/dashboard`
- [ ] Verify all existing admin pages (Users, Configurations, Analytics, Settings) still work correctly

## Notes

### Implementation Approach: Hardcoded vs Dynamic
For the initial implementation, component lists will be **manually hardcoded** in the Convex queries. This avoids complexity of server-side file system operations in Convex actions.

**Phase 1 (Initial)**: Hardcoded component arrays in `convex/components.ts`
- Manually list all components in `components/ui/`
- Manually list all widget components by category
- Simple, fast, no file system operations needed

**Phase 2 (Future Enhancement)**: Dynamic file system scanning
- Use Convex actions with Node.js file system APIs
- Automatically detect new components when added
- Extract metadata (file size, last modified, JSDoc comments)
- More complex but provides real-time accuracy

### Future Enhancements
1. **Component Preview**: Click component name to see rendered preview
2. **Component Documentation**: Display JSDoc comments and prop types
3. **Usage Statistics**: Scan codebase to show how many times each component is used
4. **Dependency Graph**: Show component dependencies and relationships
5. **Component Versioning**: Track component updates and changes over time
6. **Export/Import**: Export component catalog as JSON for documentation
7. **Component Search**: Full-text search across component code and documentation
8. **Component Health**: Detect unused components, outdated patterns, accessibility issues

### Design Decisions
- **Tabs vs Accordion**: Using Tabs for widget categories provides better UX with clear category separation
- **Table vs Card Grid**: UI Components use table for dense information display; Widget Components use card grid for visual browsing
- **Client-side Search**: Simple filtering in browser for fast response; can upgrade to server-side search later if needed
- **Manual Component Lists**: Avoiding complexity of file system operations; can automate in Phase 2

### Scalability Considerations
- Current design assumes <100 total components
- For larger libraries (>100), implement pagination or virtual scrolling
- Consider server-side search and filtering for large datasets
- Component metadata caching may be needed for performance

### Security Notes
- All component queries enforce `requireAdmin(ctx)` authorization
- No sensitive data exposed in component metadata
- File paths are relative, not absolute system paths
- No file content is returned, only metadata
