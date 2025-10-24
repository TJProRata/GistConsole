# Feature: Widget Configuration Page (Simplified Frontend-Only)

## Feature Description
Create a single-page widget configuration interface as a third navigation tab in the dashboard. This simplified version focuses on frontend UI/UX with mock data and static widget preview, allowing users to explore widget configuration options without backend implementation. The page demonstrates the widget configuration flow with a form-based interface and visual preview panel.

## User Story
As a site owner
I want to see and interact with a widget configuration interface
So that I can understand what options will be available and provide feedback on the design before backend implementation

## Problem Statement
The current dashboard only handles content ingestion and installation instructions. Before building the complex backend system (database schema, version control, embed code generation), we need to:
- Validate the widget configuration UI/UX design with stakeholders
- Test the form layout and information architecture
- Demonstrate the visual preview concept
- Gather user feedback on configuration options
- Iterate on design without backend complexity

## Solution Statement
Create a frontend-only widget configuration page as the third navigation item "Configure Widgets" in the existing dashboard sidebar. The page includes:

1. **Simple Navigation**: Add "Configure Widgets" to existing sidebar (no adaptive sidebar needed)
2. **Configuration Form**: Tabbed interface with widget settings (using mock data)
3. **Visual Preview**: Static preview panel showing widget appearance based on form inputs
4. **No Backend**: All state managed in React component state (no Convex mutations)
5. **Demonstration Focus**: Show what the interface will look like and how it will work

## Relevant Files
Use these files to implement the feature:

- `components/DashboardSidebar.tsx` - Add third navigation item "Configure Widgets"
  - Currently has 2 items: "Provide your content", "Install your widget"
  - Will add third item linking to `/dashboard/configure-widget`
  - Simple addition to existing `navigation` array

- `app/dashboard/layout.tsx` - Dashboard layout wrapper (no changes needed)
  - Already wraps all dashboard pages with sidebar
  - New page will automatically use this layout

- `app/dashboard/page.tsx` - Content ingestion form (reference for form patterns)
  - Use as reference for form structure using react-hook-form + zod
  - Follow existing styling patterns for consistency

- `components/ui/button.tsx` - Button component for form actions
- `components/ui/card.tsx` - Card component for preview container and form sections
- `components/ui/form.tsx` - Form components for all inputs
- `components/ui/input.tsx` - Text inputs for widget name, dimensions, etc.
- `components/ui/label.tsx` - Form field labels
- `components/ui/select.tsx` - Dropdowns for widget type, theme, placement
- `components/ui/checkbox.tsx` - Boolean toggles for features
- `components/ui/radio-group.tsx` - Mutually exclusive options (open state modes)
- `lib/utils.ts` - Utility functions including cn() for class merging

### New Files

#### Pages
- `app/dashboard/configure-widget/page.tsx` - Main widget configuration page with form and preview

#### Components
- `components/widgets/WidgetConfigurationForm.tsx` - Configuration form with tabs
- `components/widgets/WidgetPreviewPanel.tsx` - Static preview panel showing widget appearance
- `components/widgets/WidgetPreviewMock.tsx` - Mock widget component for preview

## shadcn/ui Components

### Existing Components to Use
- `components/ui/button.tsx` - Form actions, tab switching
- `components/ui/card.tsx` - Preview container, form section grouping
- `components/ui/form.tsx` - All form fields
- `components/ui/input.tsx` - Text inputs (name, dimensions)
- `components/ui/label.tsx` - Form labels
- `components/ui/select.tsx` - Dropdowns (type, theme, placement)
- `components/ui/checkbox.tsx` - Boolean toggles
- `components/ui/radio-group.tsx` - Open state modes

### New Components to Add
```bash
# Tabs for form organization
npx shadcn@latest add tabs

# Badge for widget type/status indicators
npx shadcn@latest add badge

# Textarea for seed questions
npx shadcn@latest add textarea

# Separator for visual sections
npx shadcn@latest add separator

# Slider for dimensions and timing
npx shadcn@latest add slider
```

### Custom Components to Create
- `WidgetConfigurationForm` - Form container with tabs following shadcn/ui patterns
- `WidgetPreviewPanel` - Preview container with device size selector
- `WidgetPreviewMock` - Static widget visualization (div-based, not functional)

All custom components follow shadcn/ui patterns:
- CVA for variants
- CSS variables for theming
- cn() utility for class merging
- Proper accessibility

## Implementation Plan

### Phase 1: Foundation
1. Add third navigation item to sidebar
2. Create basic page structure
3. Set up form state management with react-hook-form

### Phase 2: Core Implementation
1. Build tabbed form interface (Basics, Appearance, Behavior)
2. Implement form fields for each tab
3. Create static preview panel
4. Wire form state to preview updates

### Phase 3: Integration
1. Test navigation from existing pages
2. Ensure styling matches existing dashboard pages
3. Add form validation (client-side only)
4. Test responsive layout

## Step by Step Tasks

### Step 1: Add Navigation Item to Sidebar
- Open `components/DashboardSidebar.tsx`
- Add third item to navigation array:
  ```typescript
  {
    name: "Set up Gist Answers",
    items: [
      { name: "Provide your content", href: "/dashboard" },
      { name: "Install your widget", href: "/dashboard/install-widget" },
      { name: "Configure widgets", href: "/dashboard/configure-widget" },
    ],
  }
  ```
- Verify sidebar renders third item correctly

### Step 2: Install Required shadcn/ui Components
- Run installation commands:
  ```bash
  npx shadcn@latest add tabs
  npx shadcn@latest add badge
  npx shadcn@latest add textarea
  npx shadcn@latest add separator
  npx shadcn@latest add slider
  ```
- Verify components added to `components/ui/`

### Step 3: Create Widget Configuration Page Structure
- Create `app/dashboard/configure-widget/page.tsx`
- Set up basic page structure:
  - Page heading "Configure Your Widget"
  - Two-column layout: Form (left 2/3), Preview (right 1/3)
  - Use existing dashboard styling patterns
- Import required dependencies (react-hook-form, zod)
- Set up "use client" directive (client component)

### Step 4: Define Form Schema and Default Values
- Create zod schema for widget configuration:
  - Widget name (string, required)
  - Widget type (enum: "floating" | "rufus" | "womensWorld")
  - Placement (enum: "bottom-right" | "bottom-left" | "top-right" | "top-left")
  - Open state mode (enum: "toggle" | "alwaysOpen" | "teaser")
  - Primary color (string, hex color)
  - Width (number, pixels)
  - Height (number, pixels)
  - Seed questions (array of strings)
- Define default values:
  ```typescript
  {
    name: "My Widget",
    type: "floating",
    placement: "bottom-right",
    openStateMode: "toggle",
    primaryColor: "#8B5CF6",
    width: 400,
    height: 600,
    seedQuestions: ["What is this?", "How does it work?", "Tell me more"]
  }
  ```
- Set up react-hook-form with zod resolver

### Step 5: Build Tabs Component Structure
- Create `components/widgets/WidgetConfigurationForm.tsx`
- Implement Tabs component with three tabs:
  - **Basics**: Name, Type
  - **Appearance**: Colors, Dimensions
  - **Behavior**: Placement, Open State Mode, Seed Questions
- Use shadcn Tabs component
- Structure with `TabsList`, `TabsTrigger`, `TabsContent`
- Add icons to tabs (optional)

### Step 6: Implement Basics Tab
- Widget name input field
  - Label: "Widget Name"
  - Placeholder: "e.g., Help Widget"
  - Required validation
- Widget type selector
  - Label: "Widget Type"
  - Options: Floating Widget, Rufus Widget, Womens World Widget
  - Radio group or Select dropdown
  - Show description for each type
- Style with proper spacing and form layout

### Step 7: Implement Appearance Tab
- Primary color input
  - Label: "Primary Color"
  - Type: color picker (native input type="color")
  - Show hex value next to picker
- Width slider
  - Label: "Width (pixels)"
  - Range: 300-800px
  - Default: 400px
  - Show current value
- Height slider
  - Label: "Height (pixels)"
  - Range: 400-800px
  - Default: 600px
  - Show current value
- Section headers with Separator component

### Step 8: Implement Behavior Tab
- Placement selector
  - Label: "Placement"
  - Radio group with 4 options:
    - Bottom Right (default)
    - Bottom Left
    - Top Right
    - Top Left
  - Visual indicator for each option (small diagram or icon)
- Open state mode selector
  - Label: "Open State Behavior"
  - Radio group:
    - Toggle (open/close button)
    - Always Open (expanded by default)
    - Teaser (auto-open then close)
  - Description text for each mode
- Seed questions list
  - Label: "Seed Questions"
  - Textarea for each question (up to 5)
  - Add/remove question buttons
  - Character limit indicator (60 chars)

### Step 9: Create Preview Panel Component
- Create `components/widgets/WidgetPreviewPanel.tsx`
- Card container with header "Preview"
- Device size selector (Desktop/Mobile toggle)
- Preview area (fixed aspect ratio box)
- Render `WidgetPreviewMock` component
- Pass form values as props to preview

### Step 10: Create Mock Widget Preview Component
- Create `components/widgets/WidgetPreviewMock.tsx`
- Render static widget visualization using divs
- Accept props:
  - type, placement, primaryColor, width, height, seedQuestions
- Implement conditional rendering based on widget type:
  - **Floating**: Small circle button + expandable panel
  - **Rufus**: Centered card with seed questions
  - **Womens World**: Sidebar rail
- Style using inline styles or CSS based on props
- Show widget name at top
- Display seed questions in widget UI
- Use primaryColor for accents

### Step 11: Wire Form State to Preview
- In main page component, use form.watch() to get current values
- Pass watched values to WidgetPreviewPanel
- Ensure preview updates in real-time as form changes
- Test color changes, dimension changes, seed question changes
- Add debouncing if needed for performance

### Step 12: Add Form Actions
- "Save Draft" button (shows success toast, no actual save)
- "Reset to Defaults" button (resets form to default values)
- Position buttons at bottom of form
- Add confirmation dialog for reset action
- Style buttons consistently with existing dashboard

### Step 13: Add Validation and Error Handling
- Implement form validation:
  - Required fields (name, type)
  - Min/max values for dimensions
  - Character limits for seed questions
  - Valid hex color format
- Show inline error messages below fields
- Show validation summary at top of form
- Disable "Save Draft" if validation fails
- Test validation with invalid inputs

### Step 14: Style Responsive Layout
- Test form layout on different screen sizes
- Stack form and preview vertically on mobile
- Ensure tabs work on mobile (horizontal scroll or dropdown)
- Test form inputs on touch devices
- Adjust spacing and sizing for mobile

### Step 15: Add Loading States and Transitions
- Add loading spinner on "Save Draft" button (simulate 1s delay)
- Add success toast notification after save
- Add smooth transitions for tab switching
- Add fade-in animation for preview updates
- Test all interactive states

### Step 16: Accessibility Improvements
- Add ARIA labels to all form fields
- Ensure keyboard navigation works (tab through form)
- Add focus indicators to all interactive elements
- Test with keyboard only (no mouse)
- Verify color contrast for all text
- Add skip link if needed

### Step 17: Final Polish
- Match styling to existing dashboard pages
- Ensure consistent spacing and typography
- Add helpful descriptions/tooltips where needed
- Test all form interactions
- Fix any visual inconsistencies
- Add placeholder text for empty states

### Step 18: Validation
- Run all validation commands
- Test navigation between all three dashboard pages
- Verify no regressions in existing pages
- Test form submission flow
- Test preview updates
- Check browser console for errors

## Testing Strategy

### Unit Tests
No unit tests for MVP (frontend-only demonstration)

### Integration Tests
Manual testing:
- Navigation to configure widget page
- Tab switching
- Form input for all fields
- Preview updates based on form changes
- Form validation errors
- Save/reset button actions

### Edge Cases
- Very long widget name (200+ characters)
- Empty seed questions
- Invalid color format (if not using native color picker)
- Extreme dimension values (very small or very large)
- Mobile viewport (320px width)
- Keyboard-only navigation

## Acceptance Criteria

### Navigation
- [ ] "Configure widgets" appears in sidebar as third item
- [ ] Clicking item navigates to `/dashboard/configure-widget`
- [ ] Page loads without errors
- [ ] Active state shows in sidebar when on page

### Page Structure
- [ ] Page title "Configure Your Widget" displays
- [ ] Two-column layout: Form left, Preview right
- [ ] Responsive layout stacks on mobile
- [ ] Consistent styling with existing dashboard pages

### Form - Basics Tab
- [ ] Widget name input works
- [ ] Widget type selector works (3 options)
- [ ] Required validation on name
- [ ] Tab content displays correctly

### Form - Appearance Tab
- [ ] Primary color picker works
- [ ] Width slider adjusts value (300-800px)
- [ ] Height slider adjusts value (400-800px)
- [ ] Current values display next to sliders
- [ ] Color picker shows selected color

### Form - Behavior Tab
- [ ] Placement selector works (4 options)
- [ ] Open state mode selector works (3 options)
- [ ] Seed questions textarea works
- [ ] Add/remove question buttons work (up to 5)
- [ ] Character limit shows for questions

### Preview Panel
- [ ] Preview panel displays on right side
- [ ] Preview updates when form values change
- [ ] Widget type changes update preview visual
- [ ] Color changes apply to preview
- [ ] Dimensions affect preview size
- [ ] Seed questions appear in preview
- [ ] Placement affects preview position

### Form Actions
- [ ] "Save Draft" button shows loading state
- [ ] Success toast appears after save (mock)
- [ ] "Reset to Defaults" button works
- [ ] Reset shows confirmation dialog
- [ ] Reset restores default values

### Validation
- [ ] Required fields show error when empty
- [ ] Invalid values show inline errors
- [ ] Save button disabled when form invalid
- [ ] Validation messages clear when fixed

### Responsive Design
- [ ] Form works on mobile (320px)
- [ ] Preview stacks below form on mobile
- [ ] Tabs work on small screens
- [ ] All inputs accessible on touch devices

### Accessibility
- [ ] All form fields keyboard accessible
- [ ] Tab key navigates through form
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast meets standards

### No Regressions
- [ ] "Provide your content" page still works
- [ ] "Install your widget" page still works
- [ ] Sidebar navigation works
- [ ] User authentication works
- [ ] No console errors on any page

## Validation Commands

Execute every command to validate the feature works correctly with zero regressions.

```bash
# 1. Type check and build
bun run build

# 2. Start Convex (no schema changes, but should run without errors)
npx convex dev

# 3. Start Next.js dev server
bun dev

# 4. Manual Testing in Browser (http://localhost:3000)

## Navigate to Dashboard
- [ ] Go to /dashboard
- [ ] Verify "Provide your content" page loads
- [ ] Check sidebar shows 3 navigation items

## Navigate to Configure Widget Page
- [ ] Click "Configure widgets" in sidebar
- [ ] Verify page loads at /dashboard/configure-widget
- [ ] Check page title displays
- [ ] Verify form and preview panel visible

## Test Basics Tab
- [ ] Enter widget name
- [ ] Select each widget type
- [ ] Verify preview updates

## Test Appearance Tab
- [ ] Click Appearance tab
- [ ] Change primary color
- [ ] Adjust width slider
- [ ] Adjust height slider
- [ ] Verify preview reflects changes

## Test Behavior Tab
- [ ] Click Behavior tab
- [ ] Select different placements
- [ ] Select different open state modes
- [ ] Add/edit/remove seed questions
- [ ] Verify preview updates

## Test Preview Panel
- [ ] Verify preview shows on right side
- [ ] Change form values and watch preview update
- [ ] Verify preview matches selected widget type
- [ ] Verify colors, dimensions, seed questions visible

## Test Form Actions
- [ ] Click "Save Draft" button
- [ ] Verify loading state appears
- [ ] Verify success toast shows
- [ ] Click "Reset to Defaults"
- [ ] Verify confirmation dialog
- [ ] Confirm reset and verify form resets

## Test Validation
- [ ] Clear required widget name
- [ ] Verify error message appears
- [ ] Enter name and verify error clears
- [ ] Try to save with errors
- [ ] Verify save disabled or shows validation errors

## Test Responsive
- [ ] Resize browser to mobile width (375px)
- [ ] Verify form stacks vertically
- [ ] Verify tabs work on mobile
- [ ] Verify all inputs accessible

## Test Navigation
- [ ] Navigate to "Provide your content"
- [ ] Navigate to "Install your widget"
- [ ] Navigate back to "Configure widgets"
- [ ] Verify no errors in console

## Check for Errors
- [ ] Open browser console (F12)
- [ ] Verify zero errors
- [ ] Verify zero warnings related to app code
```

## Notes

### Simplified Scope
This is a **frontend-only demonstration** of the widget configuration interface. Key simplifications:

- **No Database**: No Convex schema changes, no data persistence
- **No Backend Logic**: No mutations, no version control, no embed code generation
- **Mock Data**: All widget configuration exists only in component state
- **Static Preview**: Preview is a styled div, not a functional widget
- **No Multi-Widget Management**: Single configuration form only (no list view, no CRUD)
- **No Adaptive Sidebar**: Simple third navigation item in existing sidebar

### Purpose
- Validate UI/UX design with stakeholders
- Demonstrate widget configuration options
- Test form layout and information architecture
- Gather feedback before backend implementation
- Iterate quickly on frontend design

### Next Steps (Future)
After stakeholder approval of this frontend demo:
1. Implement Convex schema for widget storage
2. Add widget list/management page
3. Implement CRUD operations
4. Add version control system
5. Build embed code generator
6. Create actual functional widget library

### Design Decisions

**Single Page**: Instead of complex routing (list → editor → new), use a single page with a form. This simplifies implementation and focuses on demonstrating the configuration interface.

**Tabs for Organization**: Three tabs (Basics, Appearance, Behavior) organize ~10 configuration fields into logical groups without overwhelming the user.

**Live Preview**: Real-time preview panel demonstrates how configuration changes affect widget appearance, helping users understand the impact of their choices.

**Mock Widget Types**: Show visual differences between Floating, Rufus, and Womens World widgets with simple div-based representations, not functional implementations.

**No Persistence**: Form state lives in React component state only. "Save" button shows success feedback but doesn't actually save. This allows rapid iteration without backend complexity.

### Widget Type Visual Differences

**Floating Widget** (bottom-right by default):
- Small circular button with icon
- Expandable panel (400x600px)
- Minimal screen footprint when closed

**Rufus Widget** (centered modal):
- Centered card (500x400px)
- Prominent seed questions grid
- Modal overlay background

**Womens World Widget** (sidebar rail):
- Full-height sidebar (300px wide)
- Always visible
- Magazine-style layout

### Form Field Organization

**Basics Tab** (Identity):
- Widget Name
- Widget Type (affects preview visual)

**Appearance Tab** (Visual Design):
- Primary Color (hex picker)
- Width (slider, 300-800px)
- Height (slider, 400-800px)

**Behavior Tab** (Interaction):
- Placement (4 corners for floating)
- Open State Mode (toggle, always open, teaser)
- Seed Questions (up to 5, 60 char limit each)

### Future Enhancements (Out of Scope)
- Theme presets
- Icon upload
- Advanced color customization (secondary, accent colors)
- Typography settings
- Animation preferences
- Targeting rules (URL patterns)
- Analytics integration
- Accessibility settings
- Tone/voice customization
- Multi-widget management
- Version history
- Embed code generation

### Technical Notes
- Use react-hook-form for form state (consistent with existing dashboard page)
- Use zod for validation schema
- Use native color input (type="color") for simplicity
- Use shadcn Slider for dimensions
- Use shadcn Tabs for organization
- All state management in component (useState via react-hook-form)
- No external state management library needed
- Preview component receives props via form.watch()
- Debounce preview updates if needed (useDebounce hook)

### Styling Approach
- Match existing dashboard pages (white background, clean layout)
- Use Tailwind CSS classes
- Use shadcn/ui component styles
- Two-column layout: 66% form, 33% preview
- Stack vertically on mobile (100% width each)
- Card component for sections
- Separator between form sections
- Consistent spacing (p-6, gap-6)

### Performance Considerations
- Form state updates on every keystroke
- Preview updates on every form change
- Debounce if preview updates are expensive
- Use React.memo for preview component if needed
- Keep preview rendering simple (div-based, no complex logic)

### Accessibility Requirements
- All form inputs have labels
- Required fields marked with aria-required
- Error messages associated with inputs (aria-describedby)
- Keyboard navigation works throughout form
- Focus indicators visible on all interactive elements
- Color contrast meets WCAG AA standards
- Preview panel has descriptive text for screen readers

### Browser Compatibility
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- Native color picker may vary by browser
- Test color picker fallback if needed
- Ensure slider component works on all browsers
