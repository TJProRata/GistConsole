# Bug: Double Header on Dashboard Pages

## Bug Description
The dashboard pages are displaying two identical "Gist Console" headers stacked on top of each other. This creates a poor user experience with duplicated navigation and wastes vertical screen space. The expected behavior is to show only one header at the top of the page.

**Expected Behavior:** Single header with "Gist Console" branding and user authentication buttons
**Actual Behavior:** Two identical headers stacked vertically

## Problem Statement
The root cause is improper layout architecture. Both the home page (`app/page.tsx`) and the dashboard layout (`app/dashboard/layout.tsx`) are independently rendering the `<Header />` component. When Next.js nests layouts (root layout → dashboard layout → page), the header appears twice because:

1. The dashboard layout renders `<Header />`
2. The component tree passes through multiple layout boundaries
3. There's no global layout handling the header at the root level

## Solution Statement
Move the `<Header />` component to the root layout (`app/layout.tsx`) so it appears once across all pages. This follows Next.js best practices for shared UI elements and eliminates the duplication. Remove the redundant `<Header />` calls from individual pages and nested layouts.

## Steps to Reproduce
1. Start the development server: `bun dev`
2. Navigate to `http://localhost:3000` and sign in with Clerk
3. Click "Go to Dashboard" or navigate to `/dashboard`
4. Observe two identical "Gist Console" headers stacked vertically
5. The first header appears at the very top, the second appears below it

## Root Cause Analysis
The bug stems from a misunderstanding of Next.js layout hierarchy:

**Current (Broken) Architecture:**
```
Root Layout (app/layout.tsx)
  ├─ No Header
  ├─ Home Page (app/page.tsx)
  │   └─ Renders <Header /> ✓
  └─ Dashboard Layout (app/dashboard/layout.tsx)
      ├─ Renders <Header /> ✓ (DUPLICATE!)
      └─ Dashboard Pages
```

**Why This Causes Double Headers:**
- The home page works fine because it only renders one `<Header />`
- Dashboard pages render the dashboard layout, which includes `<Header />`
- If there's any parent layout also rendering `<Header />`, we get duplicates
- The image shows two headers, suggesting layout nesting is causing the issue

**Correct Architecture:**
```
Root Layout (app/layout.tsx)
  ├─ Renders <Header /> once ✓
  ├─ Home Page (app/page.tsx)
  │   └─ No header (inherits from root)
  └─ Dashboard Layout (app/dashboard/layout.tsx)
      ├─ No header (inherits from root)
      └─ Dashboard Pages
```

## Relevant Files
Use these files to fix the bug:

- `app/layout.tsx` - Root layout where the Header should be rendered globally
  - Currently does NOT render the Header component
  - Needs to be updated to include `<Header />` once for all pages

- `app/page.tsx` - Home page
  - Currently renders `<Header />` explicitly (line 8)
  - This should be removed since root layout will handle it

- `app/dashboard/layout.tsx` - Dashboard-specific layout
  - Currently renders `<Header />` explicitly (line 11)
  - This should be removed since root layout will handle it

- `components/Header.tsx` - The Header component itself
  - No changes needed, component is functioning correctly
  - The issue is WHERE it's being rendered, not HOW

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add Header to Root Layout
- Open `app/layout.tsx`
- Import the Header component: `import { Header } from "@/components/Header";`
- Add `<Header />` inside the `<body>` tag, before `{children}`
- This ensures all pages inherit the header without duplication

### Step 2: Remove Header from Home Page
- Open `app/page.tsx`
- Remove the `import { Header } from "@/components/Header";` line (line 2)
- Remove the `<Header />` component from the JSX (line 8)
- Change the fragment wrapper to just return the `<main>` element directly
- The home page will now inherit the header from the root layout

### Step 3: Remove Header from Dashboard Layout
- Open `app/dashboard/layout.tsx`
- Remove the `import { Header } from "@/components/Header";` line (line 2)
- Remove the `<Header />` component from the JSX (line 11)
- The dashboard layout will now inherit the header from the root layout
- Keep the sidebar and main content structure intact

### Step 4: Validate the Fix
- Run `bun run build` to ensure no TypeScript errors
- Start the dev server with `bun dev`
- Navigate to the home page and verify single header appears
- Navigate to `/dashboard` and verify single header appears
- Navigate to `/dashboard/install-widget` and verify single header appears
- Verify the sidebar is still present on dashboard pages
- Verify authentication buttons (Sign In, Sign Up, UserButton) work correctly

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and test:
  1. Visit `http://localhost:3000` - Should show ONE header on home page
  2. Sign in with Clerk
  3. Navigate to `/dashboard` - Should show ONE header (not two)
  4. Navigate to `/dashboard/install-widget` - Should show ONE header
  5. Verify sidebar is still visible on dashboard pages
  6. Verify UserButton works correctly in header
  7. Sign out and verify Sign In/Sign Up buttons appear in header
  8. Check browser console for any errors

## Notes

### Why This Approach is Correct
Following Next.js layout best practices:
- **Shared UI in Root Layout**: Components that appear on all pages (like headers, footers) should live in the root layout
- **Layout Composition**: Child layouts should only add page-specific UI (like the sidebar for dashboard pages)
- **Single Source of Truth**: Having one place that renders the header prevents duplication and makes future updates easier

### Alternative Approaches Considered (and why they're wrong)
1. **Conditional rendering in nested layouts** - Adds unnecessary complexity and fragile logic
2. **Passing props to disable header** - Anti-pattern in Next.js, breaks layout composition model
3. **Using context to track if header is rendered** - Over-engineered solution for a simple architectural fix

### Future Considerations
- If certain pages need to hide the header, use a context provider or route-based logic in the root layout
- If the dashboard header needs to be different from the home page header, create separate Header components or use variants
- Currently all pages share the same header, which is the correct UX for this application
