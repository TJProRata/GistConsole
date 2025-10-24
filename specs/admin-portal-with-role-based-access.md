# Feature: Admin Portal with Role-Based Access

## Feature Description
Implement a comprehensive admin portal system with role-based access control. When an admin user signs in, they see a personalized welcome message ("Welcome Back Admin!") and have access to an "Admin Portal" button on the home page. The admin portal provides centralized access to user management, widget configurations, analytics, and system settings. The system includes database schema updates for user roles, Convex authorization queries, protected admin routes, and a dedicated admin interface.

## User Story
As an **admin user**
I want to **access a dedicated admin portal with management capabilities**
So that **I can manage users, monitor widget configurations, view analytics, and configure system settings from a centralized dashboard**

## Problem Statement
Currently, all users have the same access level and experience. There is no distinction between regular users and administrators. Admins need elevated privileges to:
- View and manage all users in the system
- Access all widget configurations across all users
- Monitor system-wide analytics and usage metrics
- Configure system-level settings
- Perform administrative actions with proper logging

Without role-based access control, administrators cannot efficiently manage the platform, and there's no separation of concerns between user and admin functionality.

## Solution Statement
Implement a complete role-based access control (RBAC) system with the following components:

1. **Database Schema**: Add `role` field to users table with "user" and "admin" literal types
2. **Authorization Layer**: Create Convex admin queries for checking roles and fetching admin-only data
3. **Home Page Updates**: Conditionally render "Welcome Back Admin!" and "Admin Portal" button based on user role
4. **Admin Portal Routes**: Create protected `/admin` routes with automatic redirect for non-admins
5. **Admin Dashboard**: Build a comprehensive admin interface with navigation to users, configurations, analytics, and settings
6. **Security**: Implement server-side authorization checks and admin action logging

This solution provides a secure, scalable foundation for administrative functionality while maintaining clear separation between user and admin experiences.

## Relevant Files
Use these files to implement the feature:

**Database & Backend**:
- `convex/schema.ts` - Add role field to users table, create adminLogs table
- `convex/users.ts` - Helper functions for getting current user (will use role field)
- `convex/gistConfigurations.ts` - Existing configurations queries (reference for admin queries)

**Authentication & Authorization**:
- `proxy.ts` - Add /admin routes to protected routes (currently uses clerkMiddleware)
- `app/api/webhook/clerk/route.ts` - Webhook for user sync (may need role sync from Clerk metadata)

**Home Page (Admin Detection)**:
- `app/page.tsx` - Add conditional rendering for admin welcome message and Admin Portal button
- `components/ui/button.tsx` - Existing button component (use for Admin Portal button)

**Admin Portal Interface**:
- `app/admin/layout.tsx` - NEW: Admin layout with role check and redirect
- `app/admin/page.tsx` - NEW: Admin dashboard overview
- `app/admin/users/page.tsx` - NEW: User management page
- `app/admin/configurations/page.tsx` - NEW: All widget configurations page
- `app/admin/analytics/page.tsx` - NEW: System analytics page
- `app/admin/settings/page.tsx` - NEW: System settings page

**Components**:
- `components/AdminSidebar.tsx` - NEW: Admin navigation sidebar
- `components/ui/card.tsx` - Existing card component (use for admin stats/metrics)
- `components/ui/tabs.tsx` - Existing tabs component (use for admin navigation)
- `components/ui/badge.tsx` - Existing badge component (use for user roles/status)

**Utilities**:
- `lib/utils.ts` - Existing utility functions (cn() for class merging)

### New Files
- `convex/admin.ts` - Admin-specific queries and mutations (isAdmin, getAllUsers, getAllConfigurations, etc.)
- `app/admin/layout.tsx` - Admin layout with authorization and navigation
- `app/admin/page.tsx` - Admin dashboard overview
- `app/admin/users/page.tsx` - User management interface
- `app/admin/configurations/page.tsx` - All configurations management
- `app/admin/analytics/page.tsx` - System analytics dashboard
- `app/admin/settings/page.tsx` - System settings interface
- `components/AdminSidebar.tsx` - Admin navigation component
- `components/ui/table.tsx` - Table component for user/config lists (add via shadcn CLI)

## shadcn/ui Components
### Existing Components to Use
- `button.tsx` - For Admin Portal button, action buttons
- `card.tsx` - For dashboard metrics, stat cards, content containers
- `badge.tsx` - For user roles, status indicators
- `tabs.tsx` - For admin dashboard navigation (if using tab-based UI)
- `separator.tsx` - For visual separation in admin layouts
- `dialog.tsx` - For confirmation dialogs, modals
- `form.tsx` - For admin forms (settings, user editing)
- `input.tsx` - For search fields, form inputs
- `label.tsx` - For form labels
- `select.tsx` - For dropdowns (role selection, filters)

### New Components to Add
```bash
npx shadcn@latest add table
npx shadcn@latest add alert
npx shadcn@latest add skeleton
```

- `table.tsx` - For user management tables, configuration lists
- `alert.tsx` - For admin notifications, warnings, success messages
- `skeleton.tsx` - For loading states in admin dashboard

### Custom Components to Create
None required - shadcn/ui components provide all necessary UI primitives. Admin-specific components (AdminSidebar) will be composed from existing shadcn components following the patterns from `DashboardSidebar.tsx`.

## Implementation Plan
### Phase 1: Foundation
1. **Database Schema**: Update `convex/schema.ts` to add role field to users table and create adminLogs table for audit trail
2. **Admin Queries**: Create `convex/admin.ts` with authorization helpers (isAdmin, requireAdmin) and admin-specific queries
3. **User Helper Updates**: Ensure `convex/users.ts` helpers return role information
4. **Seed Admin User**: Manually set first admin user via Convex dashboard (role = "admin")

### Phase 2: Core Implementation
5. **Home Page Updates**: Modify `app/page.tsx` to detect admin role and render "Welcome Back Admin!" + "Admin Portal" button
6. **Admin Layout**: Create `app/admin/layout.tsx` with role check, redirect logic, and AdminSidebar
7. **Admin Dashboard**: Create `app/admin/page.tsx` with overview metrics and navigation cards
8. **Add shadcn Components**: Install table, alert, and skeleton components via CLI
9. **AdminSidebar Component**: Create `components/AdminSidebar.tsx` following DashboardSidebar pattern

### Phase 3: Integration
10. **Admin Pages**: Create user management (`app/admin/users/page.tsx`), configurations (`app/admin/configurations/page.tsx`), analytics (`app/admin/analytics/page.tsx`), and settings (`app/admin/settings/page.tsx`) pages
11. **Route Protection**: Verify proxy.ts properly protects /admin routes
12. **Testing**: Manual end-to-end testing of admin flows
13. **Documentation**: Update README.md with admin setup instructions

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Database Schema Updates
- Update `convex/schema.ts` to add `role` field to users table:
  - Add `role: v.union(v.literal("user"), v.literal("admin"))` to users table
  - Set default value consideration (existing users will be "user")
- Create `adminLogs` table in `convex/schema.ts`:
  - `adminId: v.id("users")` - Admin who performed action
  - `action: v.string()` - Description of action
  - `targetUserId: v.optional(v.id("users"))` - User affected by action
  - `metadata: v.optional(v.any())` - Additional context
  - `timestamp: v.number()` - When action occurred
- Deploy schema changes: `npx convex dev`

### Step 2: Admin Authorization Layer
- Create `convex/admin.ts` with authorization functions:
  - `isAdmin` query: Check if current user has admin role
  - `requireAdmin` helper: Throw error if not admin (use in other queries)
  - `getAllUsers` query: Return all users (admin-only)
  - `getAllConfigurations` query: Return all gistConfigurations (admin-only)
  - `logAdminAction` mutation: Log admin actions to adminLogs table
- Test queries in Convex dashboard

### Step 3: Seed Admin User
- Manually set admin role in Convex dashboard:
  - Go to Data → users table
  - Find your user (by clerkId or email)
  - Edit record and set `role` to `"admin"`
- Verify admin status using `isAdmin` query in Convex dashboard

### Step 4: Home Page Admin Detection
- Update `app/page.tsx`:
  - Import `useQuery` from "convex/react"
  - Import `api` from "@/convex/_generated/api"
  - Query `api.admin.isAdmin` in SignedIn section
  - Conditionally render "Welcome Back Admin!" instead of "Welcome Back!" when isAdmin is true
  - Add "Admin Portal" button below "Go to Dashboard" button when isAdmin is true
  - Style Admin Portal button with different variant (e.g., `variant="outline"`)
- Test by signing in as admin user

### Step 5: Install shadcn Components
- Add table component: `npx shadcn@latest add table`
- Add alert component: `npx shadcn@latest add alert`
- Add skeleton component: `npx shadcn@latest add skeleton`
- Verify components are added to `components/ui/`

### Step 6: Admin Sidebar Component
- Create `components/AdminSidebar.tsx`:
  - Use `DashboardSidebar.tsx` as reference for structure
  - Create navigation sections: "Dashboard", "User Management", "Widget Management", "System"
  - Navigation items:
    - Dashboard: `/admin`
    - Users: `/admin/users`
    - Configurations: `/admin/configurations`
    - Analytics: `/admin/analytics`
    - Settings: `/admin/settings`
  - Use active link highlighting with `usePathname` hook
  - Include admin profile section at top
  - Follow shadcn/ui patterns (Button, Link components)

### Step 7: Admin Layout with Authorization
- Create `app/admin/layout.tsx`:
  - Make it a client component ("use client")
  - Query `api.admin.isAdmin` using `useQuery` from convex/react
  - Show loading state while checking admin status (Skeleton component)
  - Redirect to `/dashboard` using `redirect` from next/navigation if not admin
  - Render AdminSidebar + children in flex layout
  - Use same layout pattern as dashboard (sidebar + main content)

### Step 8: Admin Dashboard Overview
- Create `app/admin/page.tsx`:
  - Query `api.admin.getAllUsers` and `api.admin.getAllConfigurations`
  - Display summary cards using Card component:
    - Total Users count
    - Total Configurations count
    - Active Users (placeholder for now)
    - System Status (placeholder)
  - Create navigation cards to other admin pages
  - Use grid layout for responsive design
  - Follow existing dashboard styling patterns

### Step 9: User Management Page
- Create `app/admin/users/page.tsx`:
  - Query `api.admin.getAllUsers`
  - Render users in Table component (columns: Name, Email, Role, Created, Actions)
  - Add search/filter functionality (Input component)
  - Display role badges using Badge component
  - Add placeholder action buttons (Edit, Delete - implement later)
  - Handle loading states with Skeleton
  - Handle empty states with appropriate messaging

### Step 10: Configurations Management Page
- Create `app/admin/configurations/page.tsx`:
  - Query `api.admin.getAllConfigurations`
  - Render configurations in Table component (columns: Publication, Category, Method, User, Created)
  - Add search/filter by category or ingestion method
  - Display category badges using Badge component
  - Show user email for each configuration
  - Add view details action (navigate to user's dashboard)
  - Handle loading and empty states

### Step 11: Analytics Page (Placeholder)
- Create `app/admin/analytics/page.tsx`:
  - Create placeholder layout with Card components
  - Add sections for:
    - User Growth (chart placeholder)
    - Widget Usage (chart placeholder)
    - Popular Categories (list)
    - System Performance (metrics)
  - Use Alert component to indicate "Coming Soon" features
  - Layout with responsive grid

### Step 12: Settings Page (Placeholder)
- Create `app/admin/settings/page.tsx`:
  - Create placeholder layout with Form components
  - Add sections for:
    - System Configuration (form placeholder)
    - Email Settings (form placeholder)
    - Security Settings (form placeholder)
  - Use Alert component to indicate "Coming Soon" features
  - Use Tabs component to organize settings sections

### Step 13: Route Protection Verification
- Verify `proxy.ts` middleware:
  - Confirm /admin routes are NOT in public routes list
  - Confirm middleware protects all non-public routes
  - Test by accessing /admin while logged out (should redirect to sign-in)
  - Test by accessing /admin as regular user (AdminLayout should redirect to dashboard)

### Step 14: End-to-End Testing
- Manual testing scenarios:
  - Sign in as regular user → Verify no "Admin Portal" button on home page
  - Sign in as admin → Verify "Welcome Back Admin!" and "Admin Portal" button
  - Click "Admin Portal" → Verify redirect to `/admin` dashboard
  - Navigate to each admin page → Verify data loads correctly
  - Test table sorting, search, and filters
  - Test loading states by throttling network
  - Test empty states by using fresh database
  - Verify non-admin user cannot access /admin routes (redirect to dashboard)
  - Verify admin action logging (check adminLogs table in Convex dashboard)

### Step 15: Build Validation
- Run `bun run build` to validate TypeScript and Next.js build
- Fix any TypeScript errors or build warnings
- Verify all imports resolve correctly
- Confirm no linting errors

### Step 16: Documentation
- Update `README.md` with admin setup section:
  - How to set admin role in Convex dashboard
  - Admin portal feature overview
  - Security considerations
- Update `CLAUDE.md` with admin portal status
- Add comments to new files explaining purpose and usage

## Testing Strategy
### Unit Tests
- **Admin Authorization**:
  - Test `isAdmin` query returns correct boolean for admin/non-admin users
  - Test `requireAdmin` helper throws error for non-admin users
  - Test `getAllUsers` query only returns data for admin users
- **Component Rendering**:
  - Test AdminSidebar renders correct navigation items
  - Test active link highlighting works correctly
  - Test admin badge display in user tables

### Integration Tests
- **Admin Flow**:
  - Test admin user sees correct home page elements
  - Test admin can navigate to all admin pages
  - Test non-admin user cannot access admin routes
  - Test admin layout redirects non-admin users
- **Data Loading**:
  - Test admin queries fetch correct data
  - Test loading states display correctly
  - Test empty states display when no data
- **Authorization**:
  - Test server-side authorization prevents unauthorized access
  - Test admin action logging works correctly

### Edge Cases
- User with no role field (legacy data) - should default to "user"
- User changes role while logged in - should reflect immediately
- Admin accessing empty database - should show appropriate empty states
- Network errors during admin queries - should show error messages
- Concurrent admin actions - should log all actions correctly
- Admin deletes their own account - should handle gracefully
- Browser back button from admin portal - should maintain admin context
- Direct URL access to admin pages while not logged in - should redirect to sign-in
- Direct URL access to admin pages as regular user - should redirect to dashboard

## Acceptance Criteria
- [ ] Users table has `role` field with "user" and "admin" literal types
- [ ] adminLogs table exists with proper schema for action tracking
- [ ] `convex/admin.ts` contains `isAdmin`, `requireAdmin`, `getAllUsers`, `getAllConfigurations`, and `logAdminAction` functions
- [ ] Home page shows "Welcome Back Admin!" for admin users
- [ ] Home page shows "Admin Portal" button for admin users
- [ ] "Admin Portal" button links to `/admin` route
- [ ] `/admin` layout checks admin role and redirects non-admins to `/dashboard`
- [ ] AdminSidebar component renders with correct navigation structure
- [ ] Admin dashboard (`/admin`) displays user and configuration counts
- [ ] User management page (`/admin/users`) displays all users in table format
- [ ] Configurations page (`/admin/configurations`) displays all configurations
- [ ] Analytics page (`/admin/analytics`) exists with placeholder content
- [ ] Settings page (`/admin/settings`) exists with placeholder content
- [ ] Table component displays data correctly with search/filter functionality
- [ ] Badge component shows user roles and categories clearly
- [ ] Loading states use Skeleton component appropriately
- [ ] Empty states display helpful messages
- [ ] Non-admin users cannot access any `/admin` routes
- [ ] Admin actions are logged to adminLogs table
- [ ] All admin pages are responsive and follow existing design patterns
- [ ] TypeScript compilation succeeds with no errors
- [ ] Build process completes successfully
- [ ] README.md updated with admin setup instructions

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npx convex dev` - Deploy Convex schema and functions (run in background, Terminal 1)
- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server (Terminal 2)
- **Manual Testing Checklist**:
  - [ ] Sign in as admin user
  - [ ] Verify "Welcome Back Admin!" message on home page
  - [ ] Click "Admin Portal" button
  - [ ] Verify redirect to `/admin` dashboard
  - [ ] Verify user count and configuration count display correctly
  - [ ] Navigate to `/admin/users` and verify user table loads
  - [ ] Search/filter users by name or email
  - [ ] Navigate to `/admin/configurations` and verify configuration table loads
  - [ ] Filter configurations by category
  - [ ] Navigate to `/admin/analytics` and verify placeholder page loads
  - [ ] Navigate to `/admin/settings` and verify placeholder page loads
  - [ ] Sign out and sign in as regular user
  - [ ] Verify no "Admin Portal" button on home page
  - [ ] Manually navigate to `/admin` in browser
  - [ ] Verify redirect to `/dashboard` (not admin portal)
  - [ ] Check Convex dashboard → Data → adminLogs table for logged actions

## Notes
### Security Considerations
- **Server-Side Authorization**: All admin queries use `requireAdmin` to enforce authorization at the database level, not just UI level
- **Role Assignment**: Initial admin role must be manually set via Convex dashboard to prevent unauthorized privilege escalation
- **Audit Trail**: All admin actions logged to adminLogs table for accountability and security monitoring
- **Route Protection**: Middleware protects routes, layout adds additional client-side check for UX

### Future Enhancements
- **User Role Management**: Add UI for admins to change user roles (requires additional mutations and confirmation dialogs)
- **Configuration Editing**: Allow admins to edit or delete user configurations
- **Analytics Implementation**: Integrate real analytics data and charts (consider recharts or similar library)
- **Settings Implementation**: Add actual system settings with persistence
- **Export Functionality**: Export user lists and configurations to CSV
- **Activity Feed**: Show recent admin actions in dashboard overview
- **Permissions Granularity**: Expand beyond admin/user to support multiple permission levels
- **Clerk Metadata Sync**: Sync role to Clerk user metadata for cross-system consistency

### Admin User Setup
To set the first admin user:
1. Run `npx convex dev` to deploy schema
2. Sign in to your app to create your user record
3. Go to Convex Dashboard → Data → users table
4. Find your user record by email or clerkId
5. Click "Edit" and set `role` field to `"admin"`
6. Click "Save"
7. Refresh your app - you should now see admin features

### Design Patterns
- Follow existing dashboard sidebar pattern for consistency
- Use shadcn/ui components exclusively for UI primitives
- Maintain consistent spacing, colors, and typography with existing pages
- Use loading skeletons for better perceived performance
- Implement optimistic UI updates where appropriate
- Follow React 19.2 patterns (useOptimistic, useActionState for future forms)

### Performance Considerations
- User and configuration queries may become slow with large datasets - consider pagination in future
- Skeleton components provide better UX than spinners for loading states
- Consider implementing virtual scrolling for large tables (future enhancement)
- Admin dashboard should cache queries appropriately (Convex handles this automatically)
