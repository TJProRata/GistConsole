# Feature: Component Preview Pages with Live Examples

## Feature Description
Implement shadcn-style component preview pages that display visual examples and code snippets for each UI component and widget component in the system. Similar to shadcn.com/docs, each component will have its own dedicated page showing:
- Live interactive preview of the component with multiple variants
- Code snippet with syntax highlighting and copy functionality
- Component description and usage guidelines
- Navigation between components (prev/next buttons)
- Dark mode preview support

This enhances the admin portal's component library section by allowing administrators to visually browse, test, and understand each component before implementation.

## User Story
As an **admin user**
I want to **view live previews and code examples of each UI component and widget**
So that **I can understand how components look and work before using them in the application**

## Problem Statement
Currently, the admin components section only lists component names, categories, and file paths in tables. This provides minimal context about what each component actually does or how it looks. Admins need to:
- Navigate to the code file to see implementation
- Run the app to test component behavior
- Guess at available variants and props
- Manually test different component states

This creates friction in the development workflow and makes it difficult for admins to make informed decisions about component usage.

## Solution Statement
Create dedicated preview pages at `/admin/components/ui-components/{component}` and `/admin/components/widgets/{widget}` that render:
1. **Live Preview Section**: Interactive component demonstration with variant toggles
2. **Code Section**: Syntax-highlighted code with one-click copy functionality
3. **Component Navigation**: Previous/Next buttons to browse through components
4. **Dark Mode Toggle**: Preview components in both light and dark themes

This mirrors the excellent UX of shadcn.com/docs while maintaining the existing admin portal design patterns.

## Relevant Files
Use these files to implement the feature:

### Core Pages to Modify
- `app/admin/components/ui-components/page.tsx` - Update table rows to link to preview pages
- `app/admin/components/widgets/page.tsx` - Update cards to link to widget preview pages

### New Files
#### Dynamic Route Pages
- `app/admin/components/ui-components/[component]/page.tsx` - UI component preview page
- `app/admin/components/widgets/[widget]/page.tsx` - Widget component preview page

#### Convex Queries
- `convex/componentPreviews.ts` - New query file for component metadata and preview data

#### Preview Demo Components
- `components/component-previews/ui-demos.tsx` - Demo implementations for each UI component
- `components/component-previews/widget-demos.tsx` - Demo implementations for each widget component

#### Shared UI Components
- `components/ComponentPreview.tsx` - Reusable preview container with code display
- `components/CodeBlock.tsx` - Syntax-highlighted code block with copy button

## shadcn/ui Components

### Existing Components to Use
- `button` - Navigation buttons, copy button, variant toggles
- `card` - Preview container, code block container
- `tabs` - Switch between preview and code views
- `badge` - Component category/type badges
- `separator` - Visual dividers
- `scroll-area` - Scrollable code blocks
- `skeleton` - Loading states
- `alert` - Error states and usage warnings

### New Components to Add
```bash
npx shadcn@latest add code-block-wrapper
npx shadcn@latest add toggle-group
```

Note: `code-block-wrapper` may not exist in registry - will create custom component following shadcn patterns. `toggle-group` for switching between variants.

### Custom Components to Create
Following shadcn/ui patterns from `ai_docs/shadcn/shadcn_component_library_bp.md`:

1. **CodeBlock Component** (`components/CodeBlock.tsx`)
   - Use CVA for variants (dark/light themes)
   - React.forwardRef for DOM elements
   - CSS variables for theming
   - cn() utility for class merging
   - Built with syntax highlighting library (likely `react-syntax-highlighter` or `prism-react-renderer`)

2. **ComponentPreview Component** (`components/ComponentPreview.tsx`)
   - Compound component pattern (Preview.Root, Preview.Demo, Preview.Code)
   - Uses shadcn Card, Tabs, Button components
   - Manages preview/code view state
   - Integrates CodeBlock component

## Implementation Plan

### Phase 1: Foundation
1. **Add required dependencies** for syntax highlighting (react-syntax-highlighter, prism themes)
2. **Create Convex queries** for component metadata (descriptions, code snippets, preview data)
3. **Build reusable UI components** (CodeBlock, ComponentPreview) following shadcn patterns
4. **Set up dynamic route structure** for both UI components and widgets

### Phase 2: Core Implementation
1. **Implement UI component demo components** in `components/component-previews/ui-demos.tsx`
2. **Implement widget demo components** in `components/component-previews/widget-demos.tsx`
3. **Create UI component preview page** with navigation and dark mode
4. **Create widget preview page** with navigation and dark mode
5. **Update table/card links** in list pages to navigate to preview pages

### Phase 3: Integration
1. **Add navigation links** between components (prev/next buttons)
2. **Implement dark mode toggle** with theme persistence
3. **Add copy-to-clipboard functionality** for code blocks
4. **Integrate with existing admin layout** and sidebar navigation
5. **Add loading and error states** for all dynamic content

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Install Dependencies
- Install syntax highlighting library: `bun add react-syntax-highlighter @types/react-syntax-highlighter`
- Install clipboard functionality: `bun add copy-to-clipboard` (if not already installed)
- Verify installations in package.json

### Step 2: Create Convex Component Metadata Queries
- Create `convex/componentPreviews.ts`
- Add `getUIComponentPreview` query that returns:
  - Component name, description, category
  - Code snippet (string)
  - Available variants
  - Navigation info (next/previous component names)
- Add `getWidgetComponentPreview` query with same structure
- Use requireAdmin() for authorization
- Test queries in Convex dashboard

### Step 3: Build CodeBlock Component
- Create `components/CodeBlock.tsx`
- Implement syntax highlighting with react-syntax-highlighter
- Add copy-to-clipboard button with success state
- Use CVA for theme variants (light/dark)
- Apply shadcn design tokens (CSS variables)
- Include TypeScript types for all props
- Add "use client" directive for client-side clipboard API
- Write component following shadcn patterns (forwardRef, displayName, cn() utility)

### Step 4: Build ComponentPreview Container
- Create `components/ComponentPreview.tsx`
- Implement compound component pattern:
  - `ComponentPreview` (root container)
  - `ComponentPreview.Demo` (live preview area)
  - `ComponentPreview.Code` (code display with CodeBlock)
- Use shadcn Card component for container
- Use shadcn Tabs for preview/code switching
- Add dark mode toggle button
- Apply consistent padding and spacing
- Include TypeScript types and proper exports

### Step 5: Create UI Component Demo Implementations
- Create `components/component-previews/ui-demos.tsx`
- Implement demo functions for each UI component:
  - ButtonDemo (all variants: default, destructive, outline, secondary, ghost, link, sizes)
  - CardDemo (with header, content, footer)
  - BadgeDemo (all variants)
  - InputDemo (with label, validation states)
  - SelectDemo (with options)
  - TabsDemo (multiple tabs)
  - (Continue for all 20+ UI components)
- Each demo should showcase multiple variants/states
- Use realistic example content
- Include proper accessibility attributes

### Step 6: Create Widget Component Demo Implementations
- Create `components/component-previews/widget-demos.tsx`
- Implement demo functions organized by category:
  - **Icons**: BlueStar, ProfileBlank, Wand
  - **Animations**: SearchingAnimation
  - **AI Elements**: DualPhaseProgress, GifHousing, GlassWidgetContainer, PromptInput, ReadinessScoreGauge, SimpleProgressBar, SuccessPhase
  - **Ask Anything**: PricingCard
- Include mock data and realistic states
- Ensure components are properly imported from widget_components directory

### Step 7: Create UI Component Preview Page
- Create `app/admin/components/ui-components/[component]/page.tsx`
- Implement dynamic route with component slug parameter (async params per Next.js 16)
- Fetch component data with useQuery(api.componentPreviews.getUIComponentPreview)
- Render ComponentPreview with appropriate demo and code
- Add navigation buttons (Previous/Next component)
- Include breadcrumb navigation (Admin > Components > UI Components > [Component Name])
- Add "Copy Page" button linking to shadcn.com documentation
- Handle loading states with Skeleton components
- Handle error states with Alert component
- Add metadata for SEO

### Step 8: Create Widget Preview Page
- Create `app/admin/components/widgets/[widget]/page.tsx`
- Implement same structure as UI component page
- Adapt for widget component categories
- Include category badge in header
- Use widget-specific demo components
- Add same navigation and error handling patterns

### Step 9: Update List Pages with Preview Links
- Modify `app/admin/components/ui-components/page.tsx`:
  - Make component names clickable links to preview pages
  - Update table row hover states
  - Add "View Preview" icon/button in actions column
- Modify `app/admin/components/widgets/page.tsx`:
  - Add "View Preview" button to each card
  - Make card titles clickable
  - Update hover effects

### Step 10: Implement Navigation Between Components
- In both preview pages, add Previous/Next navigation:
  - Fetch list of components from Convex
  - Determine current component index
  - Link to adjacent components
  - Disable buttons at list boundaries
  - Show component names in button labels

### Step 11: Add Dark Mode Support
- Add dark mode toggle button to preview pages
- Store theme preference in localStorage
- Apply dark theme classes to preview containers
- Update CodeBlock component to match theme
- Test all components in both themes
- Ensure CSS variables work correctly in both modes

### Step 12: Implement Copy-to-Clipboard
- Test copy button in CodeBlock component
- Add toast notification on successful copy (use shadcn toast if available, or simple alert)
- Handle copy failures gracefully
- Add keyboard shortcut hint (Ctrl/Cmd + C)
- Verify clipboard permissions in browser

### Step 13: Add Admin Layout Integration
- Ensure preview pages inherit AdminSidebar layout
- Add "Component Preview" section to sidebar (optional)
- Verify authentication/authorization on preview routes
- Test navigation flow from dashboard → components → preview
- Ensure consistent header and spacing

### Step 14: Run Validation Commands
Execute the validation commands listed below to verify implementation

## Testing Strategy

### Unit Tests
- Test CodeBlock component renders correctly with different languages
- Test copy-to-clipboard functionality
- Test ComponentPreview state management (preview/code toggle)
- Test demo component rendering for each variant
- Test navigation logic (prev/next component calculation)

### Integration Tests
- Test dynamic route loading with valid component slugs
- Test Convex query integration and data fetching
- Test navigation between different component preview pages
- Test dark mode persistence across page navigations
- Test error handling for invalid component slugs

### Edge Cases
- **Invalid component slug**: Show 404 or redirect to component list
- **Component without demo**: Show fallback message with code only
- **Long code snippets**: Ensure scroll-area works properly
- **Network errors**: Display retry button with clear error message
- **First/last components**: Disable navigation buttons appropriately
- **Mobile responsive**: Test layout on small screens
- **Dark mode edge cases**: Ensure all text is readable in both themes

## Acceptance Criteria
1. ✅ Each UI component has a dedicated preview page at `/admin/components/ui-components/{component}`
2. ✅ Each widget has a dedicated preview page at `/admin/components/widgets/{widget}`
3. ✅ Preview pages display live interactive component demos
4. ✅ Preview pages show syntax-highlighted code with copy button
5. ✅ Copy button successfully copies code to clipboard with visual feedback
6. ✅ Previous/Next navigation buttons work correctly with proper boundary handling
7. ✅ Dark mode toggle switches preview theme and persists preference
8. ✅ Component list pages link to preview pages
9. ✅ Preview pages inherit admin layout and authentication
10. ✅ All demo components render without errors for all variants
11. ✅ Loading states use skeleton components
12. ✅ Error states display helpful messages
13. ✅ Mobile responsive layout works on all screen sizes
14. ✅ Breadcrumb navigation shows correct path
15. ✅ SEO metadata is present on all preview pages

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually test:
  1. Navigate to `/admin/components/ui-components`
  2. Click on a component (e.g., "button")
  3. Verify preview page loads at `/admin/components/ui-components/button`
  4. Test live component preview renders correctly
  5. Click "Code" tab to view code snippet
  6. Click copy button and verify code copies to clipboard
  7. Click "Previous" and "Next" buttons to navigate between components
  8. Toggle dark mode and verify theme changes
  9. Navigate to `/admin/components/widgets`
  10. Click on a widget (e.g., "blue-star")
  11. Verify widget preview page loads correctly
  12. Test all navigation, copy, and theme functionality
  13. Test invalid component slug (should handle gracefully)
  14. Test on mobile viewport (responsive layout)
- `bun test` - Run tests to validate the feature works with zero regressions (if tests exist)

## Notes

### Design Decisions
1. **Shadcn-style UX**: The preview pages mirror shadcn.com/docs for familiarity and proven usability
2. **Dynamic Routes**: Using Next.js 16 dynamic routes with async params for proper SSR support
3. **Compound Components**: ComponentPreview follows React compound component pattern for flexibility
4. **Theme Persistence**: Dark mode preference stored in localStorage for better UX
5. **Code Organization**: Separate demo files for UI and widget components maintains clarity

### Future Enhancements
- Add search functionality to quickly jump to any component
- Implement component variant playground (interactive prop editor)
- Add usage statistics (which components are most viewed)
- Enable component favoriting/bookmarking
- Add community-contributed examples
- Implement component version history
- Add accessibility testing results per component
- Create shareable links for specific component states

### Technical Considerations
- **Performance**: Use React.lazy() for demo components if bundle size becomes an issue
- **Code Storage**: Store code snippets in Convex vs. file system - chose Convex for consistency
- **Syntax Highlighting**: react-syntax-highlighter chosen for simplicity (alternatives: prism-react-renderer, shiki)
- **Dark Mode**: Using CSS variables from global theme vs. separate implementation
- **Navigation**: Consider breadcrumb library if navigation becomes more complex

### Dependencies Added
- `react-syntax-highlighter` - Syntax highlighting for code blocks
- `@types/react-syntax-highlighter` - TypeScript types
- `copy-to-clipboard` - Clipboard functionality (may already exist in project)
