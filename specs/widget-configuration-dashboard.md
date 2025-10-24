# Feature: Widget Configuration Dashboard

## Feature Description
Create a comprehensive widget configuration dashboard that allows site owners to create, manage, and customize on-site Search/Answer Widgets with live preview capabilities. The dashboard supports three distinct widget families (Floating, Rufus-type, and "Womens World") with extensive configuration options including open state logic, seed questions, modal vs dedicated page routing, theming, icon customization, tone/voice settings, and more. Each widget configuration includes version history with diff viewing and rollback capabilities, plus one-line embed code generation for easy deployment.

## User Story
As a site owner
I want to create and manage customizable Search/Answer widgets with live preview and versioning
So that I can deploy on-brand, behavior-optimized widgets to my site with confidence and maintain control over their configuration over time

## Problem Statement
Site owners need a powerful yet intuitive way to configure complex widget behaviors without writing code. The current system only handles content ingestion but lacks widget creation, customization, and deployment capabilities. Users need:
- Visual configuration interface for complex widget behaviors
- Real-time preview across device sizes and states
- Version control for configuration changes
- Easy embed code generation
- Multi-widget management (create, activate, duplicate, archive)
- Granular control over appearance, behavior, and content

## Solution Statement
Build a comprehensive widget configuration dashboard structured as a third navigation item "Configure Widgets" with an adaptive sidebar that transforms based on context. The dashboard provides:

1. **Widget Management Interface**: List view with search/filter, status badges, quick actions (Activate, Duplicate, Archive)
2. **Multi-Tab Editor**: Segmented form with tabs (Basics, Behavior, Seeds, Appearance, Tone, Targeting, Analytics, Accessibility)
3. **Live Preview Panel**: Right-side preview with device switcher (Desktop/Tablet/Mobile), route testing (modal vs page), state simulation, reduced-motion toggle
4. **Version Control**: Version history bar with diff viewing and rollback capabilities
5. **Adaptive Navigation**: Context-sensitive left nav that switches between onboarding stages (current) and widget management sections (Widgets, Themes, Tones, Analytics, Embed, Experiments, Logs)

## Relevant Files
Use these files to implement the feature:

- `components/DashboardSidebar.tsx` - Current sidebar with onboarding stages navigation. Will become adaptive sidebar that switches context based on active route.
- `app/dashboard/layout.tsx` - Dashboard layout wrapper. Will conditionally render different sidebar modes.
- `app/dashboard/page.tsx` - Content ingestion form. Remains unchanged as first onboarding step.
- `app/dashboard/install-widget/page.tsx` - Widget installation step. Remains unchanged as second onboarding step.
- `convex/schema.ts` - Database schema. Will add new `widgets` table and related tables.
- `convex/gistConfigurations.ts` - Content configuration queries/mutations. Will add widget queries/mutations.
- `components/ui/button.tsx` - Button component for actions and navigation.
- `components/ui/card.tsx` - Card component for widget list items and preview container.
- `components/ui/form.tsx` - Form components for widget configuration editor.
- `components/ui/input.tsx` - Input component for text fields.
- `components/ui/select.tsx` - Select component for dropdowns.
- `components/ui/label.tsx` - Label component for form fields.
- `components/ui/checkbox.tsx` - Checkbox component for boolean settings.
- `components/ui/radio-group.tsx` - Radio group for mutually exclusive options.
- `lib/utils.ts` - Utility functions including cn() for class merging.

### New Files

#### Pages & Layouts
- `app/dashboard/widgets/page.tsx` - Widget list/management page (third nav item)
- `app/dashboard/widgets/[widgetId]/page.tsx` - Widget editor page with tabbed configuration interface
- `app/dashboard/widgets/new/page.tsx` - New widget creation page (select widget type first)

#### Components - Widget Management
- `components/widgets/WidgetList.tsx` - Widget list with search, filter, status badges, quick actions
- `components/widgets/WidgetCard.tsx` - Individual widget card in list view
- `components/widgets/WidgetTypeSelector.tsx` - Widget type selection (Floating, Rufus, Womens World)

#### Components - Widget Editor
- `components/widgets/WidgetEditor.tsx` - Main editor container with tabs and live preview
- `components/widgets/WidgetEditorTabs.tsx` - Tab navigation (Basics, Behavior, Seeds, Appearance, Tone, Targeting, Analytics, Accessibility)
- `components/widgets/tabs/BasicsTab.tsx` - Widget name, description, type, status
- `components/widgets/tabs/BehaviorTab.tsx` - Open state modes, placement, timing settings
- `components/widgets/tabs/SeedsTab.tsx` - Seed questions management
- `components/widgets/tabs/AppearanceTab.tsx` - Theme, icon, colors, dimensions
- `components/widgets/tabs/ToneTab.tsx` - Tone/voice settings
- `components/widgets/tabs/TargetingTab.tsx` - URL patterns, user segments
- `components/widgets/tabs/AnalyticsTab.tsx` - Analytics configuration
- `components/widgets/tabs/AccessibilityTab.tsx` - Accessibility settings

#### Components - Live Preview
- `components/widgets/WidgetPreview.tsx` - Live preview container with device switcher
- `components/widgets/preview/DeviceSwitcher.tsx` - Desktop/Tablet/Mobile selector
- `components/widgets/preview/StateSimulator.tsx` - Simulate closed/open/teaser states
- `components/widgets/preview/PreviewFrame.tsx` - Iframe or simulated widget preview

#### Components - Version Control
- `components/widgets/VersionBar.tsx` - Version history with diff and rollback
- `components/widgets/VersionHistory.tsx` - Version list with timestamps
- `components/widgets/VersionDiff.tsx` - Side-by-side configuration diff viewer

#### Components - Embed & Export
- `components/widgets/EmbedCodeGenerator.tsx` - Generate one-line embed code
- `components/widgets/EmbedCodeDisplay.tsx` - Display and copy embed code

#### Adaptive Sidebar Components
- `components/sidebars/OnboardingSidebar.tsx` - Extract current sidebar to separate component
- `components/sidebars/WidgetManagementSidebar.tsx` - New sidebar for widget management context
- `components/DashboardSidebarWrapper.tsx` - Wrapper that conditionally renders correct sidebar

#### Convex Backend
- `convex/widgets.ts` - Widget CRUD operations and queries
- `convex/widgetVersions.ts` - Version history management
- `convex/widgetThemes.ts` - Theme presets management
- `convex/widgetTones.ts` - Tone/voice presets management
- `convex/widgetAnalytics.ts` - Analytics queries (future)

#### Types & Utilities
- `lib/types/widget.ts` - TypeScript types for widget configuration
- `lib/constants/widgetDefaults.ts` - Default configuration values
- `lib/utils/widgetValidation.ts` - Widget configuration validation utilities
- `lib/utils/embedCodeGenerator.ts` - Embed code generation logic

## shadcn/ui Components

### Existing Components to Use
- `components/ui/button.tsx` - Actions, navigation, tab switching
- `components/ui/card.tsx` - Widget cards, preview container, section containers
- `components/ui/form.tsx` - All form fields in editor tabs
- `components/ui/input.tsx` - Text inputs for names, URLs, dimensions
- `components/ui/label.tsx` - Form field labels
- `components/ui/select.tsx` - Dropdowns for themes, tones, device types
- `components/ui/checkbox.tsx` - Boolean toggles
- `components/ui/radio-group.tsx` - Mutually exclusive options (open state modes)
- `components/ui/dialog.tsx` - Confirmation dialogs for delete, rollback actions

### New Components to Add
```bash
# Tabs for editor interface
npx shadcn@latest add tabs

# Badges for status indicators
npx shadcn@latest add badge

# Switch for toggle settings
npx shadcn@latest add switch

# Textarea for multi-line inputs (seed questions, custom CSS)
npx shadcn@latest add textarea

# Separator for visual section breaks
npx shadcn@latest add separator

# Tooltip for help text and info icons
npx shadcn@latest add tooltip

# Popover for additional options and settings
npx shadcn@latest add popover

# Accordion for collapsible sections in editor
npx shadcn@latest add accordion

# Slider for numeric ranges (timing settings, dimensions)
npx shadcn@latest add slider

# Command palette for widget search and quick actions
npx shadcn@latest add command

# Dropdown menu for widget actions (duplicate, archive, delete)
npx shadcn@latest add dropdown-menu

# Toggle group for mutually exclusive visual options
npx shadcn@latest add toggle-group

# Alert for warnings and important notices
npx shadcn@latest add alert
```

### Custom Components to Create
All custom components will follow shadcn/ui patterns:
- Use CVA (class-variance-authority) for variant management
- Use React.forwardRef for DOM elements
- Use CSS variables for theming (--widget-primary, --widget-secondary, etc.)
- Use cn() utility for class name merging
- Maintain accessibility (ARIA labels, keyboard navigation, semantic HTML)
- Follow composition patterns (compound components where appropriate)

## Implementation Plan

### Phase 1: Foundation (Database & Navigation)
Set up the database schema and adaptive navigation structure:

1. **Database Schema Design**: Create Convex tables for widgets, widget versions, themes, tones
2. **Adaptive Sidebar Architecture**: Refactor sidebar to be context-aware and render different navigation based on route
3. **Route Structure**: Create page structure for widget management and editor
4. **Type Definitions**: Define comprehensive TypeScript types for all widget configuration options

### Phase 2: Widget Management Interface
Build the widget list and management capabilities:

1. **Widget List Page**: Create list view with search, filter, sorting
2. **Widget Cards**: Build widget card components with status badges and quick actions
3. **Widget Type Selection**: Create widget type selector for new widgets
4. **CRUD Operations**: Implement create, read, update, delete operations in Convex

### Phase 3: Widget Editor - Core Tabs
Implement the main configuration tabs:

1. **Editor Container**: Build tabbed editor container with tab navigation
2. **Basics Tab**: Widget name, description, type, status, URL patterns
3. **Behavior Tab**: Open state modes (Open/Close, Always Open, Close→Open→Close), placement, timing
4. **Seeds Tab**: Seed questions management (add, edit, reorder, delete)
5. **Appearance Tab**: Theme selection, icon upload, color customization, dimensions

### Phase 4: Widget Editor - Advanced Tabs
Implement advanced configuration tabs:

1. **Tone Tab**: Tone/voice settings and personality customization
2. **Targeting Tab**: URL pattern matching, user segment targeting
3. **Analytics Tab**: Analytics provider integration settings
4. **Accessibility Tab**: Reduced motion, high contrast, screen reader optimizations

### Phase 5: Live Preview System
Build the live preview with device simulation:

1. **Preview Container**: Create preview panel with device switcher
2. **Device Simulation**: Implement Desktop/Tablet/Mobile viewport switching
3. **State Simulation**: Build controls to simulate closed/open/teaser states
4. **Real-time Updates**: Connect editor changes to preview updates
5. **Route Testing**: Modal vs dedicated page preview modes

### Phase 6: Version Control
Implement version history and rollback:

1. **Version History**: Create version list with timestamps and change descriptions
2. **Version Diff**: Build side-by-side configuration diff viewer
3. **Rollback Functionality**: Implement version rollback with confirmation
4. **Auto-versioning**: Automatic version creation on save

### Phase 7: Embed Code & Deployment
Build embed code generation and deployment features:

1. **Embed Code Generator**: Generate one-line embed script based on configuration
2. **Copy to Clipboard**: Implement copy functionality with success feedback
3. **Installation Instructions**: Provide context-specific installation guidance
4. **Widget Activation**: Status management (draft, active, archived)

### Phase 8: Integration & Polish
Final integration, testing, and refinements:

1. **Navigation Integration**: Ensure adaptive sidebar works seamlessly across all contexts
2. **Data Persistence**: Ensure all configurations save and load correctly
3. **Form Validation**: Comprehensive validation for all editor fields
4. **Error Handling**: User-friendly error messages and recovery flows
5. **Loading States**: Skeleton loaders and loading indicators
6. **Responsive Design**: Ensure all interfaces work on different screen sizes
7. **Accessibility Audit**: WCAG compliance check and improvements

## Step by Step Tasks

### Step 1: Design and Implement Convex Database Schema
- Read existing `convex/schema.ts` to understand current patterns
- Design `widgets` table schema with fields:
  - `userId` (string) - Reference to user's Clerk ID
  - `name` (string) - Widget display name
  - `description` (optional string) - Widget description
  - `type` (enum: "floating" | "rufus" | "womensWorld") - Widget family type
  - `status` (enum: "draft" | "active" | "archived") - Widget status
  - `currentVersion` (number) - Current version number
  - `config` (object) - Full widget configuration (nested structure)
  - `embedCode` (string) - Generated embed code
  - `createdAt` (number) - Creation timestamp
  - `updatedAt` (number) - Last update timestamp
- Design `widgetVersions` table schema:
  - `widgetId` (id reference) - Parent widget ID
  - `version` (number) - Version number
  - `config` (object) - Configuration snapshot
  - `changeDescription` (optional string) - What changed
  - `createdBy` (string) - User who created version
  - `createdAt` (number) - Version timestamp
- Design `widgetThemes` table (preset themes):
  - `name` (string) - Theme name
  - `colors` (object) - Color palette
  - `typography` (object) - Font settings
  - `isDefault` (boolean) - Default theme flag
- Design `widgetTones` table (preset tones):
  - `name` (string) - Tone name (e.g., "Professional", "Friendly", "Concise")
  - `systemPrompt` (string) - System prompt for AI tone
  - `examples` (array) - Example responses
  - `isDefault` (boolean) - Default tone flag
- Add indexes for efficient querying
- Update `convex/schema.ts` with new tables

### Step 2: Define TypeScript Types for Widget Configuration
- Create `lib/types/widget.ts` with comprehensive type definitions
- Define `WidgetType` enum: "floating" | "rufus" | "womensWorld"
- Define `WidgetStatus` enum: "draft" | "active" | "archived"
- Define `OpenStateMode` enum: "toggle" | "alwaysOpen" | "teaser"
- Define `Placement` type for floating widget position
- Define `WidgetConfig` interface with all configuration sections:
  - `basics`: name, description, type, status
  - `behavior`: openStateMode, placement, timingSettings
  - `seeds`: array of seed questions
  - `appearance`: theme, icon, colors, dimensions
  - `tone`: tonePreset, customInstructions
  - `targeting`: urlPatterns, userSegments
  - `analytics`: provider, trackingId, events
  - `accessibility`: reducedMotion, highContrast, screenReader
- Define `Widget` interface matching Convex schema
- Define `WidgetVersion` interface for version history
- Define `WidgetTheme` and `WidgetTone` interfaces
- Export all types for use across application

### Step 3: Create Widget Constants and Defaults
- Create `lib/constants/widgetDefaults.ts`
- Define default configuration for each widget type:
  - Floating widget defaults (bottom-right placement, toggle mode)
  - Rufus-type widget defaults (seed questions, centered modal)
  - Womens World widget defaults (always-open, left rail)
- Define default themes with color palettes
- Define default tones with system prompts
- Define validation rules (min/max dimensions, timing ranges)
- Export default configurations

### Step 4: Implement Convex Widget Operations
- Create `convex/widgets.ts` with CRUD operations:
  - `listWidgets` query: Get all widgets for authenticated user with filtering/sorting
  - `getWidget` query: Get single widget by ID with version history
  - `createWidget` mutation: Create new widget with initial version
  - `updateWidget` mutation: Update widget and create new version
  - `duplicateWidget` mutation: Clone existing widget
  - `archiveWidget` mutation: Archive widget (soft delete)
  - `activateWidget` mutation: Set widget status to active
  - `generateEmbedCode` mutation: Generate embed script for widget
- Create `convex/widgetVersions.ts`:
  - `getVersionHistory` query: Get all versions for widget
  - `getVersionDiff` query: Compare two versions and return differences
  - `rollbackToVersion` mutation: Restore widget to previous version
  - `createVersion` mutation: Manually create version snapshot
- Create `convex/widgetThemes.ts`:
  - `listThemes` query: Get available theme presets
  - `createTheme` mutation: Create custom theme
- Create `convex/widgetTones.ts`:
  - `listTones` query: Get available tone presets
  - `createTone` mutation: Create custom tone
- Add proper authentication checks using `ctx.auth.getUserIdentity()`
- Add error handling and validation

### Step 5: Refactor Sidebar for Adaptive Navigation
- Rename `components/DashboardSidebar.tsx` to `components/sidebars/OnboardingSidebar.tsx`
- Extract current sidebar navigation logic to separate component
- Create `components/sidebars/WidgetManagementSidebar.tsx` with new navigation structure:
  - Widgets (list view)
  - Themes (preset management)
  - Tones (voice settings)
  - Analytics (future)
  - Embed (installation guide)
  - Experiments (A/B testing - future)
  - Logs (widget activity - future)
- Create `components/DashboardSidebarWrapper.tsx`:
  - Use `usePathname()` to detect current route
  - Conditionally render `OnboardingSidebar` for `/dashboard` and `/dashboard/install-widget`
  - Conditionally render `WidgetManagementSidebar` for `/dashboard/widgets/**`
  - Include user profile section at top (shared across both sidebars)
  - Include support link at bottom (shared across both sidebars)
- Update `app/dashboard/layout.tsx` to use `DashboardSidebarWrapper`
- Ensure smooth transitions between sidebar contexts

### Step 6: Add Required shadcn/ui Components
- Run component installation commands:
  ```bash
  npx shadcn@latest add tabs
  npx shadcn@latest add badge
  npx shadcn@latest add switch
  npx shadcn@latest add textarea
  npx shadcn@latest add separator
  npx shadcn@latest add tooltip
  npx shadcn@latest add popover
  npx shadcn@latest add accordion
  npx shadcn@latest add slider
  npx shadcn@latest add command
  npx shadcn@latest add dropdown-menu
  npx shadcn@latest add toggle-group
  npx shadcn@latest add alert
  ```
- Verify all components are added to `components/ui/`
- Test each component to ensure proper installation

### Step 7: Create Widget List Page and Components
- Create `app/dashboard/widgets/page.tsx`:
  - Page header with "Configure Widgets" title
  - Search input for filtering widgets by name
  - Status filter dropdown (All, Draft, Active, Archived)
  - Sort dropdown (Newest, Oldest, Name A-Z, Name Z-Z)
  - "Create New Widget" button
  - Grid or list layout of widget cards
  - Empty state when no widgets exist
  - Loading skeleton during data fetch
- Create `components/widgets/WidgetCard.tsx`:
  - Widget name and description
  - Widget type badge (Floating, Rufus, Womens World)
  - Status badge (Draft, Active, Archived) with color coding
  - Last updated timestamp
  - Quick action buttons (Edit, Duplicate, Archive/Delete)
  - Click to navigate to editor
  - Hover effects and transitions
- Create `components/widgets/WidgetList.tsx`:
  - Container for widget cards with responsive grid
  - Integrate with Convex `listWidgets` query
  - Implement search filtering (client-side)
  - Implement status filtering
  - Implement sorting
  - Handle loading and error states
  - Empty state component
- Add proper TypeScript types for all components
- Style components following existing dashboard patterns

### Step 8: Create Widget Type Selection Flow
- Create `app/dashboard/widgets/new/page.tsx`:
  - Page header "Create New Widget"
  - Three large cards for widget type selection:
    - **Floating Widget**: Icon, description, "Great for quick answers"
    - **Rufus Widget**: Icon, description, "Perfect for guided discovery"
    - **Womens World Widget**: Icon, description, "Ideal for deep engagement"
  - Each card clickable to create widget of that type
  - Visual preview/illustration for each type
  - Comparison table showing key differences
- Create `components/widgets/WidgetTypeSelector.tsx`:
  - Reusable widget type selection component
  - Large clickable cards with icons
  - Type descriptions and use cases
  - onClick handler to create widget and navigate to editor
  - Visual indicators on hover
- Implement creation flow:
  - Select type → Create draft widget with defaults → Navigate to editor
  - Use Convex `createWidget` mutation
  - Pass widget ID to editor route

### Step 9: Build Widget Editor Container and Tab Navigation
- Create `app/dashboard/widgets/[widgetId]/page.tsx`:
  - Fetch widget data using Convex `getWidget` query
  - Display widget name and status in header
  - Render `WidgetEditor` component
  - Handle loading and error states
  - 404 handling for invalid widget IDs
- Create `components/widgets/WidgetEditor.tsx`:
  - Three-column layout: Editor tabs (left/center), Live preview (right)
  - Tab navigation using shadcn Tabs component
  - Tab list: Basics, Behavior, Seeds, Appearance, Tone, Targeting, Analytics, Accessibility
  - Tab content area with form sections
  - Auto-save functionality with debouncing
  - Save status indicator ("Saved", "Saving...", "Error")
  - "Publish" button to activate widget
  - Version bar at bottom
- Create `components/widgets/WidgetEditorTabs.tsx`:
  - Tab navigation component with active state
  - Icon for each tab
  - Validation indicator (error/warning badges)
  - Responsive behavior for smaller screens
  - Keyboard navigation support
- Add form state management using react-hook-form
- Implement auto-save with debounced mutation calls
- Add confirmation dialog for unsaved changes on navigation

### Step 10: Implement Basics Tab
- Create `components/widgets/tabs/BasicsTab.tsx`:
  - Widget name input (required)
  - Widget description textarea
  - Widget type display (read-only, set on creation)
  - Status selector (Draft, Active, Archived)
  - URL pattern input for targeting specific pages
  - Created date and last updated display
  - Form validation using zod schema
- Use shadcn form components for all inputs
- Add inline validation and error messages
- Implement character counters for name/description
- Style section headers with separators
- Add tooltips for complex settings

### Step 11: Implement Behavior Tab
- Create `components/widgets/tabs/BehaviorTab.tsx`:
  - **Open State Mode** (radio group):
    - Toggle: Standard open/close button
    - Always Open: Expanded by default, optional minimize
    - Teaser: Auto-open flow (closed → open → closed)
  - **Placement Settings** (conditional on widget type):
    - For Floating widgets:
      - Position selector (top-left, top-right, bottom-left, bottom-right)
      - Offset sliders (X and Y from edge)
      - Safe area toggle for mobile
    - For other types: Different placement logic
  - **Teaser Timing Settings** (conditional on teaser mode):
    - Delay before auto-open (slider, 0-30 seconds)
    - Display duration (slider, 5-60 seconds)
    - Scroll trigger percentage (slider, 0-100%)
  - **Interaction Settings**:
    - Allow user dismissal toggle
    - Remember user preference toggle
    - Auto-focus on open toggle
- Use accordion for organized sections
- Add visual preview of placement in small diagram
- Implement conditional rendering based on widget type and mode
- Add range sliders with value displays
- Validate timing constraints (e.g., open delay < close delay)

### Step 12: Implement Seeds Tab
- Create `components/widgets/tabs/SeedsTab.tsx`:
  - List of seed questions with reordering (drag handles)
  - Add new seed question button
  - Edit inline or in modal
  - Delete with confirmation
  - Character limit per seed (recommended: 60-80 chars)
  - Preview how seeds appear in widget
  - Suggested seeds based on widget type
  - Import seeds from CSV (future enhancement)
  - Category grouping (optional)
- Use accordion or card-based layout for each seed
- Implement drag-and-drop reordering
- Add validation for duplicate seeds
- Show character count for each seed
- Preview seeds in widget context

### Step 13: Implement Appearance Tab
- Create `components/widgets/tabs/AppearanceTab.tsx`:
  - **Theme Selection**:
    - Preset theme dropdown
    - Custom theme editor toggle
  - **Custom Theme Editor** (when enabled):
    - Primary color picker
    - Secondary color picker
    - Background color picker
    - Text color picker
    - Accent color picker
  - **Icon Settings**:
    - Icon upload (similar to favicon upload)
    - Icon shape (circle, square, rounded)
    - Icon size slider
  - **Dimensions** (conditional on widget type):
    - Width (slider or input)
    - Height (slider or input)
    - Max width/height
    - Responsive behavior toggles
  - **Border and Shadows**:
    - Border radius slider
    - Box shadow preset selector
  - **Typography** (future):
    - Font family selector
    - Font size presets
- Use color pickers (custom or library)
- Add live preview updates as user changes settings
- Validate color contrast for accessibility
- Show visual samples of themes
- Implement theme preset saving (future)

### Step 14: Implement Tone Tab
- Create `components/widgets/tabs/ToneTab.tsx`:
  - **Tone Preset Selector**:
    - Dropdown with preset tones (Professional, Friendly, Concise, Detailed, etc.)
    - Description of each tone
    - Example response for each tone
  - **Custom Tone Editor**:
    - System prompt textarea
    - Response length preference (Brief, Moderate, Detailed)
    - Formality level slider (Casual to Formal)
    - Personality traits checkboxes (Helpful, Enthusiastic, Empathetic, etc.)
    - Technical level slider (Simple to Expert)
  - **Response Guidelines**:
    - Citation style preference
    - Preferred response structure
    - Forbidden topics/words (optional)
  - **Tone Testing**:
    - Test question input
    - Generate sample response button
    - Display sample response with tone applied
- Use textarea with rich formatting (future)
- Add tone preset management (save custom tones)
- Implement sample response generation (future - requires AI integration)
- Show character limits for system prompts

### Step 15: Implement Targeting Tab
- Create `components/widgets/tabs/TargetingTab.tsx`:
  - **URL Pattern Matching**:
    - List of URL patterns (wildcards supported)
    - Include/exclude toggle per pattern
    - Pattern validation and testing
    - Examples: `/blog/*`, `/products/**`, `!*/admin/*`
  - **User Segmentation**:
    - Show to all users vs specific segments
    - Authenticated users only toggle
    - New visitors vs returning visitors
    - Custom user attributes (future)
  - **Geographic Targeting** (future):
    - Country/region selector
    - Language preference
  - **Time-based Targeting** (future):
    - Date range
    - Time of day
    - Day of week
  - **Device Targeting**:
    - Desktop/tablet/mobile toggles
    - Browser type (future)
- Add URL pattern tester (input URL, see if it matches)
- Implement pattern validation
- Show match count preview (future - requires analytics)
- Add segment creation and management (future)

### Step 16: Implement Analytics Tab
- Create `components/widgets/tabs/AnalyticsTab.tsx`:
  - **Analytics Provider**:
    - Provider selector (Google Analytics, Mixpanel, Custom, None)
    - Tracking ID input
    - Custom endpoint URL (for custom provider)
  - **Event Tracking**:
    - Widget open/close events toggle
    - Question asked event toggle
    - Answer viewed event toggle
    - Link clicked event toggle
    - Custom event configuration (future)
  - **Data Collection**:
    - Collect user feedback toggle
    - Anonymize user data toggle
    - Data retention period selector
  - **Privacy & Compliance**:
    - Cookie consent integration
    - GDPR compliance toggle
    - Privacy policy link
- Add provider-specific setup instructions
- Implement event preview (show what data is tracked)
- Add test event firing (future)
- Show analytics dashboard link (future)

### Step 17: Implement Accessibility Tab
- Create `components/widgets/tabs/AccessibilityTab.tsx`:
  - **Motion & Animation**:
    - Respect reduced motion preference toggle
    - Disable animations toggle
    - Animation duration slider
  - **Contrast & Visibility**:
    - High contrast mode toggle
    - Minimum contrast ratio validator
    - Focus indicator style selector
  - **Screen Reader Support**:
    - ARIA labels customization
    - Live region announcements toggle
    - Descriptive text for icon-only buttons
  - **Keyboard Navigation**:
    - Keyboard shortcuts enabled toggle
    - Custom keyboard shortcut configuration
    - Tab order customization
  - **Font & Readability**:
    - Minimum font size
    - Line height multiplier
    - Dyslexia-friendly font toggle (future)
  - **Compliance Checklist**:
    - WCAG 2.1 AA compliance indicator
    - Accessibility audit button (future)
- Add accessibility testing tools integration (future)
- Show compliance score and recommendations
- Implement contrast ratio checker
- Add keyboard shortcut conflict detection

### Step 18: Build Live Preview Panel
- Create `components/widgets/WidgetPreview.tsx`:
  - Preview container with device frame simulation
  - Device switcher (Desktop 1920x1080, Tablet 768x1024, Mobile 375x667)
  - Route mode switcher (Modal, Dedicated Page)
  - State simulator controls (Closed, Open, Teaser sequence)
  - Reduced motion toggle
  - Refresh preview button
  - Full screen preview toggle
- Create `components/widgets/preview/DeviceSwitcher.tsx`:
  - Device buttons with icons
  - Active state highlighting
  - Viewport dimensions display
  - Custom dimension input (future)
- Create `components/widgets/preview/StateSimulator.tsx`:
  - State buttons (Closed, Open, Teaser)
  - Teaser flow playback controls (play, pause, restart)
  - Current state indicator
- Create `components/widgets/preview/PreviewFrame.tsx`:
  - Iframe or simulated preview rendering
  - Apply current widget configuration
  - Handle preview updates on config changes
  - Security: sandbox iframe attributes
  - Responsive to device size changes
- Implement real-time preview updates using React state/context
- Add debouncing for performance
- Handle preview loading states
- Add error boundaries for preview crashes

### Step 19: Implement Version Control System
- Create `components/widgets/VersionBar.tsx`:
  - Version history dropdown/panel toggle
  - Current version display
  - "Save as New Version" button
  - Version count indicator
  - Expand/collapse animation
- Create `components/widgets/VersionHistory.tsx`:
  - List of versions with:
    - Version number
    - Timestamp
    - User who created (future - multi-user support)
    - Change description
    - Restore button
  - Pagination for many versions
  - Search/filter versions by date range
  - Compare versions button
- Create `components/widgets/VersionDiff.tsx`:
  - Side-by-side configuration comparison
  - Highlight changed fields
  - Show added/removed/modified values
  - Color coding (green for additions, red for deletions, yellow for modifications)
  - Collapsible sections for each config category
  - "Restore This Version" button
- Implement version creation on save
- Add confirmation dialog for rollback
- Implement diff algorithm for configuration comparison
- Add version change description input
- Handle edge cases (rollback to current version, delete versions)

### Step 20: Build Embed Code Generator
- Create `components/widgets/EmbedCodeGenerator.tsx`:
  - Generate button
  - Configuration preview (show what will be embedded)
  - Code output display with syntax highlighting
  - Copy to clipboard button with success feedback
  - Code format selector (HTML, React, WordPress, etc.)
  - Advanced options:
    - Async loading toggle
    - Preload toggle
    - Custom initialization code
- Create `components/widgets/EmbedCodeDisplay.tsx`:
  - Code block with syntax highlighting
  - Copy button with clipboard API
  - Success/error toast notifications
  - Code explanation/annotations
  - Installation instructions
  - Troubleshooting section
- Create `lib/utils/embedCodeGenerator.ts`:
  - Generate HTML embed code
  - Generate React component code
  - Generate WordPress shortcode
  - Include widget configuration as data attributes
  - Minify code option
  - Version embedding for cache busting
- Implement clipboard copy with fallback
- Add code validation before generation
- Show preview of embedded widget (similar to live preview)
- Add "Test Embed" button that opens in new tab

### Step 21: Integrate Widget Management Actions
- Implement duplicate widget functionality:
  - Add "Duplicate" button to widget card
  - Show confirmation dialog with name input
  - Call Convex `duplicateWidget` mutation
  - Navigate to editor for new duplicate
  - Success toast notification
- Implement archive widget functionality:
  - Add "Archive" button to widget card (for active/draft widgets)
  - Show confirmation dialog
  - Call Convex `archiveWidget` mutation
  - Update widget list without full reload
  - Success toast notification
- Implement activate widget functionality:
  - Add "Activate" button (for draft/archived widgets)
  - Validation: Check all required fields are filled
  - Show validation errors if incomplete
  - Call Convex `activateWidget` mutation
  - Update status badge and widget list
  - Success toast notification
- Implement delete widget functionality (for archived widgets):
  - Add "Delete" button to archived widgets
  - Strong confirmation dialog (type widget name to confirm)
  - Call Convex delete mutation
  - Remove from widget list
  - Success toast notification
- Add undo/redo for destructive actions (future)
- Implement bulk actions (select multiple, archive/delete) (future)

### Step 22: Implement Form Validation and Error Handling
- Create `lib/utils/widgetValidation.ts`:
  - Validation functions for each tab
  - Cross-field validation (e.g., teaser timing constraints)
  - URL pattern validation
  - Color contrast validation
  - Required field checks
  - Character limit enforcement
- Add zod schemas for each configuration section
- Implement form-level validation on save
- Show inline validation errors in editor
- Add validation summary at top of editor
- Implement tab error indicators (badge count of errors per tab)
- Add "Fix All Errors" guidance
- Handle backend validation errors from Convex
- Add validation bypass for drafts (warn but allow save)
- Show validation status in save button ("Save Draft" vs "Publish")

### Step 23: Add Loading States and Skeletons
- Create skeleton loaders for:
  - Widget list page (card skeletons)
  - Widget editor tabs (form field skeletons)
  - Live preview (placeholder frame)
  - Version history (list item skeletons)
- Implement loading states for:
  - Data fetching (initial page load)
  - Mutations (saving, duplicating, archiving)
  - Preview updates
  - Embed code generation
- Add loading spinners for:
  - Save button during mutation
  - Quick action buttons
  - Copy to clipboard button
- Implement optimistic updates for better UX:
  - Widget list updates immediately on archive/activate
  - Editor shows saved state before server confirmation
  - Rollback on mutation failure
- Add progress indicators for long operations
- Implement retry mechanisms for failed requests

### Step 24: Style Responsive Layouts
- Ensure widget list works on mobile:
  - Stack widget cards vertically
  - Simplify card layout (hide secondary actions)
  - Responsive search/filter bar
- Ensure widget editor works on tablet:
  - Stack preview below editor on smaller screens
  - Tabs convert to dropdown selector
  - Form inputs stack vertically
- Ensure adaptive sidebar collapses on mobile:
  - Hamburger menu for navigation
  - Overlay sidebar that slides in
  - Close on navigation
- Add breakpoint-specific styles using Tailwind responsive utilities
- Test all pages at common breakpoints (320px, 768px, 1024px, 1920px)
- Ensure touch-friendly hit targets (44px minimum)
- Add mobile-specific interactions (swipe to dismiss, etc.)

### Step 25: Accessibility Audit and Improvements
- Keyboard navigation:
  - Tab through all interactive elements
  - Enter/Space to activate buttons
  - Arrow keys for tabs and lists
  - Escape to close dialogs
  - Focus trap in modals
- Screen reader support:
  - Add ARIA labels to all icons and buttons
  - Use semantic HTML (nav, main, aside, section)
  - Add ARIA live regions for status updates
  - Ensure form errors are announced
  - Add skip links
- Color contrast:
  - Verify all text meets WCAG AA (4.5:1 normal, 3:1 large)
  - Test status badge colors
  - Check link colors
  - Validate button states
- Focus management:
  - Visible focus indicators on all interactive elements
  - Focus returns to trigger after modal close
  - Focus moves to error message on validation failure
- Reduced motion:
  - Respect `prefers-reduced-motion` media query
  - Add toggle in accessibility tab
  - Disable animations when enabled
- Test with screen reader (VoiceOver, NVDA, or JAWS)
- Run automated accessibility audit (axe, Lighthouse)
- Fix all critical and serious issues

### Step 26: End-to-End Testing
- Test complete user flows:
  - **Flow 1: Create New Floating Widget**
    1. Navigate to "Configure Widgets"
    2. Click "Create New Widget"
    3. Select "Floating Widget"
    4. Fill in all required fields across all tabs
    5. Test live preview updates
    6. Save and publish widget
    7. Generate embed code
    8. Verify widget appears in list as active
  - **Flow 2: Edit Existing Widget**
    1. Open widget from list
    2. Modify configuration in multiple tabs
    3. Verify auto-save works
    4. Check version history
    5. Rollback to previous version
    6. Re-publish widget
  - **Flow 3: Duplicate and Archive Widget**
    1. Duplicate existing widget
    2. Modify duplicate
    3. Archive original widget
    4. Verify list updates correctly
  - **Flow 4: Full Configuration Coverage**
    1. Create widget of each type
    2. Test all open state modes
    3. Configure all appearance options
    4. Set up targeting rules
    5. Configure analytics
    6. Enable accessibility features
- Test error scenarios:
  - Invalid widget ID
  - Network failures during save
  - Validation errors
  - Permission errors
- Test edge cases:
  - Very long widget names
  - Many seed questions (50+)
  - Complex URL patterns
  - Rapid configuration changes
- Verify data persistence:
  - Reload page after save
  - Navigate away and back
  - Check version history accuracy
- Test multi-tab behavior:
  - Open same widget in two tabs
  - Make changes in both
  - Verify conflict handling

### Step 27: Performance Optimization
- Optimize queries:
  - Add proper indexes to Convex tables
  - Paginate widget list for users with many widgets
  - Lazy load version history
  - Debounce search/filter operations
- Optimize preview:
  - Debounce preview updates (500ms)
  - Use React.memo for preview components
  - Optimize re-renders with React.useMemo
- Optimize form state:
  - Use controlled inputs efficiently
  - Debounce auto-save (2-3 seconds)
  - Batch state updates
- Code splitting:
  - Lazy load editor tabs
  - Lazy load preview components
  - Split widget type selectors
- Bundle optimization:
  - Tree-shake unused code
  - Optimize imports
  - Use dynamic imports for heavy components
- Measure performance:
  - Use React DevTools Profiler
  - Monitor Convex query performance
  - Check bundle size with `next build`
  - Monitor Core Web Vitals

### Step 28: Documentation and Help Content
- Add inline help:
  - Tooltips on complex settings
  - "Learn more" links to documentation
  - Example values in form placeholders
  - Help text under form fields
- Create user guide:
  - Getting started guide
  - Widget type comparison
  - Configuration best practices
  - Troubleshooting common issues
- Add contextual help:
  - Empty state instructions
  - First-time user onboarding
  - Feature announcements
- Create developer documentation:
  - Embed code installation guide
  - API reference (future)
  - Webhook integration (future)
  - Customization guide

### Step 29: Final Integration Testing
- Test adaptive sidebar:
  - Navigate from onboarding to widget management
  - Verify sidebar changes context correctly
  - Ensure user profile displays in both contexts
  - Test support link in both sidebars
- Test cross-feature interactions:
  - Create widget, navigate to content ingestion, return to widgets
  - Verify state persistence across navigation
  - Test logout/login flow
  - Verify permissions and user isolation
- Test all quick actions:
  - Edit, duplicate, archive, activate, delete
  - Verify toast notifications
  - Check widget list updates
- Verify embed code works:
  - Test generated code in sandbox environment
  - Verify widget loads correctly
  - Test all configuration options in embedded widget
- Run full regression test:
  - Ensure onboarding flow still works
  - Verify content ingestion page unchanged
  - Test install widget page (Phase 2)
  - Check authentication flows

### Step 30: Final Validation
- Run all validation commands listed below
- Fix any TypeScript errors
- Fix any build errors
- Fix any console warnings
- Ensure zero regressions in existing features
- Document any known issues or limitations
- Create handoff documentation for Phase 2 (actual widget rendering)

## Testing Strategy

### Unit Tests
- Widget validation utilities:
  - Test URL pattern matching
  - Test color contrast validation
  - Test timing constraint validation
  - Test required field checks
- Embed code generator:
  - Test HTML generation
  - Test React code generation
  - Test configuration embedding
  - Test code minification
- Version diff algorithm:
  - Test simple config changes
  - Test nested object changes
  - Test array changes (seed questions)
  - Test edge cases (empty configs, identical versions)

### Integration Tests
- Widget CRUD operations:
  - Create widget → verify in database
  - Update widget → verify version creation
  - Duplicate widget → verify new widget with copied config
  - Archive widget → verify status change
- Form state management:
  - Edit form → auto-save → reload → verify persistence
  - Edit multiple tabs → save → verify all changes persisted
  - Validation errors → fix → save → verify success
- Version control:
  - Create versions → verify history
  - Rollback → verify config restored
  - Compare versions → verify diff accuracy
- Preview system:
  - Change config → verify preview updates
  - Switch devices → verify responsive preview
  - Simulate states → verify state changes

### Edge Cases
- Widget with no versions (new widget)
- Widget with 100+ versions (pagination)
- Widget with very long name (200+ characters)
- Widget with 50+ seed questions
- Invalid widget ID in URL
- Network failure during save
- Concurrent edits (future - multi-user)
- Missing required fields on publish attempt
- Archived widget edit attempt
- URL pattern edge cases (wildcards, special characters)
- Color picker edge cases (invalid hex, extreme values)
- Timing constraints (0 seconds, negative values, very large values)
- Empty state in all sections
- User with 0 widgets
- User with 100+ widgets

## Acceptance Criteria

### Navigation & Structure
- [ ] Third navigation item "Configure Widgets" appears in adaptive sidebar
- [ ] Sidebar switches context between onboarding (content/install) and widget management
- [ ] Widget management sidebar shows: Widgets, Themes, Tones, Analytics, Embed, Experiments, Logs
- [ ] User profile appears at top of both sidebar contexts
- [ ] Support link appears at bottom of both sidebar contexts
- [ ] Navigation between contexts is smooth without layout shift

### Widget List & Management
- [ ] Widget list page displays all user's widgets
- [ ] Search filters widgets by name
- [ ] Status filter shows Draft/Active/Archived widgets
- [ ] Sort options work (Newest, Oldest, Name)
- [ ] Widget cards show name, type, status, last updated, quick actions
- [ ] "Create New Widget" button navigates to type selector
- [ ] Empty state appears when no widgets exist
- [ ] Loading skeleton displays during data fetch
- [ ] Quick actions (Edit, Duplicate, Archive) work correctly
- [ ] Status badges use correct colors (gray=draft, green=active, red=archived)

### Widget Type Selection
- [ ] Type selector page shows three widget types
- [ ] Each type has description and visual preview
- [ ] Clicking type creates widget and navigates to editor
- [ ] Created widget has correct default configuration for type

### Widget Editor - Structure
- [ ] Editor loads widget data correctly
- [ ] Tab navigation shows all 8 tabs
- [ ] Clicking tabs switches content correctly
- [ ] Active tab is highlighted
- [ ] Tabs show validation error indicators
- [ ] Auto-save works with debouncing
- [ ] Save status indicator updates ("Saving...", "Saved", "Error")
- [ ] "Publish" button activates widget (if valid)

### Widget Editor - Basics Tab
- [ ] Widget name input works
- [ ] Description textarea works
- [ ] Widget type displays correctly (read-only)
- [ ] Status selector changes status
- [ ] URL patterns input works
- [ ] Form validation shows errors
- [ ] Character counters work

### Widget Editor - Behavior Tab
- [ ] Open state mode selection works (Toggle, Always Open, Teaser)
- [ ] Placement settings show for Floating widgets
- [ ] Position selector works (4 corners)
- [ ] Offset sliders adjust position
- [ ] Teaser timing settings appear when teaser mode selected
- [ ] All timing sliders work correctly
- [ ] Conditional rendering works based on widget type and mode

### Widget Editor - Seeds Tab
- [ ] Seed questions list displays
- [ ] Add new seed button works
- [ ] Edit seed inline works
- [ ] Delete seed with confirmation works
- [ ] Reorder seeds (drag-drop) works
- [ ] Character limit validation works
- [ ] Preview shows seeds in context

### Widget Editor - Appearance Tab
- [ ] Theme preset selector works
- [ ] Custom theme editor shows color pickers
- [ ] Icon upload works (similar to favicon)
- [ ] Dimension sliders adjust size
- [ ] Border radius slider works
- [ ] Live preview updates on appearance changes
- [ ] Color contrast validation works

### Widget Editor - Tone Tab
- [ ] Tone preset selector works
- [ ] Preset descriptions display
- [ ] Custom tone editor allows system prompt editing
- [ ] Response length preference selector works
- [ ] Formality slider works
- [ ] Personality trait checkboxes work

### Widget Editor - Targeting Tab
- [ ] URL pattern list displays
- [ ] Add/remove URL patterns works
- [ ] Include/exclude toggle works per pattern
- [ ] Pattern validation works
- [ ] User segmentation toggles work
- [ ] Device targeting toggles work

### Widget Editor - Analytics Tab
- [ ] Analytics provider selector works
- [ ] Tracking ID input works
- [ ] Event tracking toggles work
- [ ] Privacy/compliance toggles work
- [ ] Provider-specific instructions show

### Widget Editor - Accessibility Tab
- [ ] Reduced motion toggle works
- [ ] High contrast toggle works
- [ ] Minimum contrast validator works
- [ ] Screen reader settings work
- [ ] Keyboard navigation settings work
- [ ] Compliance checklist displays

### Live Preview
- [ ] Preview panel displays on right side
- [ ] Device switcher changes preview size
- [ ] Desktop/Tablet/Mobile views work correctly
- [ ] State simulator controls work
- [ ] Preview updates in real-time as config changes
- [ ] Reduced motion toggle affects preview
- [ ] Full screen preview mode works
- [ ] Preview handles errors gracefully

### Version Control
- [ ] Version bar displays current version
- [ ] Version history lists all versions
- [ ] Version timestamps are accurate
- [ ] Version diff shows configuration changes
- [ ] Diff highlights additions (green), deletions (red), modifications (yellow)
- [ ] Rollback restores previous configuration
- [ ] Rollback shows confirmation dialog
- [ ] New version created on save

### Embed Code
- [ ] Generate embed code button works
- [ ] Code displays with syntax highlighting
- [ ] Copy to clipboard works
- [ ] Success feedback shows on copy
- [ ] Code format selector works (HTML, React, etc.)
- [ ] Generated code includes widget configuration
- [ ] Advanced options (async, preload) work
- [ ] Installation instructions display

### Widget Actions
- [ ] Duplicate widget creates copy with new name
- [ ] Archive widget changes status to archived
- [ ] Activate widget changes status to active (if valid)
- [ ] Delete archived widget removes from list
- [ ] All actions show confirmation dialogs
- [ ] All actions show success toast notifications
- [ ] Widget list updates after actions

### Data Persistence
- [ ] Widget configurations save to Convex
- [ ] Page reload restores current state
- [ ] Navigate away and back maintains state
- [ ] Version history persists across sessions
- [ ] User can only see/edit own widgets

### Validation & Error Handling
- [ ] Required fields show validation errors
- [ ] Invalid inputs show inline errors
- [ ] Tab error indicators show error count
- [ ] Publish blocked if validation fails
- [ ] Form-level validation runs on save
- [ ] Backend validation errors display correctly
- [ ] Network errors show user-friendly messages
- [ ] Invalid widget ID shows 404 page

### Performance
- [ ] Widget list loads quickly (<1s for 50 widgets)
- [ ] Editor loads quickly (<1s)
- [ ] Auto-save is debounced (2-3s delay)
- [ ] Preview updates are debounced (500ms delay)
- [ ] No unnecessary re-renders
- [ ] Build completes without errors
- [ ] Bundle size is reasonable

### Responsive Design
- [ ] Widget list works on mobile (320px+)
- [ ] Widget editor works on tablet (768px+)
- [ ] Live preview stacks on smaller screens
- [ ] Navigation works on all screen sizes
- [ ] Touch targets are 44px minimum

### Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all elements
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] ARIA labels present on icon buttons
- [ ] Form errors announced to screen readers
- [ ] Semantic HTML used throughout
- [ ] Reduced motion respected
- [ ] Screen reader testing passes

### Convex Schema
- [ ] `widgets` table exists with correct fields
- [ ] `widgetVersions` table exists
- [ ] `widgetThemes` table exists
- [ ] `widgetTones` table exists
- [ ] Indexes created for efficient queries
- [ ] All mutations handle authentication
- [ ] All queries filter by user

### TypeScript
- [ ] No TypeScript errors in build
- [ ] All types exported from `lib/types/widget.ts`
- [ ] All components have proper types
- [ ] All Convex queries/mutations have proper types

### No Regressions
- [ ] Onboarding flow (content ingestion) still works
- [ ] Install widget page still works
- [ ] Header component works correctly
- [ ] User authentication works
- [ ] Existing routes work
- [ ] No console errors on any page

## Validation Commands

Execute every command to validate the feature works correctly with zero regressions.

```bash
# 1. Type check
bun run build

# 2. Deploy Convex schema (terminal 1, keep running)
npx convex dev

# 3. Start Next.js dev server (terminal 2)
bun dev

# 4. Manual Testing Checklist (in browser at localhost:3000)

## Test Adaptive Sidebar Navigation
- [ ] Navigate to /dashboard → verify OnboardingSidebar shows
- [ ] Navigate to /dashboard/install-widget → verify OnboardingSidebar shows
- [ ] Navigate to /dashboard/widgets → verify WidgetManagementSidebar shows
- [ ] Verify smooth transition between sidebar contexts

## Test Widget List
- [ ] Go to /dashboard/widgets
- [ ] Verify empty state if no widgets exist
- [ ] Click "Create New Widget" → verify type selector appears
- [ ] Create widget of each type (Floating, Rufus, Womens World)
- [ ] Verify widgets appear in list with correct types
- [ ] Test search filter
- [ ] Test status filter
- [ ] Test sort options
- [ ] Test quick action buttons (Edit, Duplicate, Archive)

## Test Widget Editor
- [ ] Click Edit on a widget → verify editor loads
- [ ] Navigate through all 8 tabs → verify all load correctly
- [ ] Fill in Basics tab → verify auto-save works
- [ ] Configure Behavior tab → verify conditional fields show/hide correctly
- [ ] Add seed questions in Seeds tab → verify add/edit/delete/reorder works
- [ ] Change appearance in Appearance tab → verify live preview updates
- [ ] Select tone in Tone tab → verify preset works
- [ ] Add URL pattern in Targeting tab → verify pattern validation
- [ ] Configure analytics in Analytics tab → verify provider-specific fields
- [ ] Enable accessibility features → verify toggles work

## Test Live Preview
- [ ] Verify preview shows on right side
- [ ] Switch devices (Desktop/Tablet/Mobile) → verify preview resizes
- [ ] Simulate states (Closed/Open/Teaser) → verify state changes
- [ ] Toggle reduced motion → verify preview responds
- [ ] Make config changes → verify preview updates in real-time

## Test Version Control
- [ ] Save widget → verify new version created
- [ ] Open version history → verify version list
- [ ] View version diff → verify changes highlighted
- [ ] Rollback to previous version → verify config restored
- [ ] Verify confirmation dialog on rollback

## Test Embed Code
- [ ] Click "Generate Embed Code"
- [ ] Verify code displays with syntax highlighting
- [ ] Click copy button → verify success feedback
- [ ] Switch code format (HTML/React) → verify different code
- [ ] Verify configuration is embedded in code

## Test Widget Actions
- [ ] Duplicate widget → verify new widget created
- [ ] Archive widget → verify status changes
- [ ] Activate archived widget → verify status changes
- [ ] Delete archived widget → verify removed from list
- [ ] Verify all actions show confirmations and success toasts

## Test Validation
- [ ] Try to publish widget without required fields → verify blocked with errors
- [ ] Fix validation errors → verify can publish
- [ ] Enter invalid color value → verify inline validation
- [ ] Enter invalid URL pattern → verify pattern validation
- [ ] Test teaser timing constraints → verify validation

## Test Error Handling
- [ ] Navigate to invalid widget ID (/dashboard/widgets/invalid_id)
- [ ] Verify 404 or error page
- [ ] Test network failure (disconnect WiFi, try to save)
- [ ] Verify user-friendly error message

## Test Responsive Design
- [ ] Resize browser to mobile width (375px)
- [ ] Verify widget list stacks correctly
- [ ] Verify sidebar collapses or becomes overlay
- [ ] Resize to tablet (768px)
- [ ] Verify editor and preview stack vertically
- [ ] Resize to desktop (1920px)
- [ ] Verify optimal layout

## Test Accessibility
- [ ] Tab through all interactive elements → verify focus visible
- [ ] Press Enter/Space on buttons → verify activation
- [ ] Use arrow keys in tabs → verify navigation
- [ ] Press Escape in dialogs → verify close
- [ ] Open browser DevTools → run Lighthouse accessibility audit
- [ ] Verify no critical/serious issues

## Test Performance
- [ ] Check browser console for errors (should be zero)
- [ ] Check network tab for failed requests
- [ ] Test with 10+ widgets in list → verify acceptable load time
- [ ] Make rapid changes in editor → verify debounced auto-save
- [ ] Run `bun run build` → verify reasonable bundle size

## Test No Regressions
- [ ] Navigate to /dashboard → verify content ingestion form works
- [ ] Submit content form → verify saves correctly
- [ ] Navigate to /dashboard/install-widget → verify page loads
- [ ] Test header authentication → verify UserButton works
- [ ] Logout and login → verify all features still work
```

## Notes

### Database Design Decisions

**Nested Configuration Object**: The `config` field in the `widgets` table stores the entire widget configuration as a nested object. This allows for flexible schema evolution without database migrations. Alternative: Normalize into separate tables (widgetBehavior, widgetAppearance, etc.), but that adds complexity for MVP.

**Version History as Separate Table**: Widget versions are stored in a separate `widgetVersions` table rather than as an array in the widget document. This prevents document size issues with many versions and allows efficient querying of version history.

**Themes and Tones as Separate Tables**: Preset themes and tones are stored in separate tables so they can be:
1. Shared across widgets
2. Updated centrally (all widgets using a theme get updates)
3. Managed independently (add/remove presets without touching widget configs)
4. Used as templates for custom configurations

**User Isolation**: All queries filter by `userId` to ensure users only see their own widgets. This is enforced at the Convex function level with `ctx.auth.getUserIdentity()`.

### Adaptive Sidebar Strategy

**Context Switching**: The sidebar adapts based on the current route:
- `/dashboard` and `/dashboard/install-widget` → OnboardingSidebar (original navigation)
- `/dashboard/widgets/**` → WidgetManagementSidebar (new widget management navigation)

**Implementation**: A wrapper component (`DashboardSidebarWrapper`) uses `usePathname()` to detect the route and conditionally renders the appropriate sidebar. This avoids duplication and maintains a single source of truth for user profile and support sections.

**User Experience**: Users naturally progress through onboarding (content → install) and then move to widget configuration. The sidebar changes to reflect their current context, providing relevant navigation options.

### Widget Type Differences

**Floating Widget**:
- Placement: 4 corners with offset control
- Open states: All three modes (Toggle, Always Open, Teaser)
- Use case: Quick answers, minimal screen real estate

**Rufus Widget**:
- Placement: Centered modal or dedicated page
- Open states: Toggle or triggered by seed question click
- Use case: Guided discovery with prominent seed questions
- Seed questions are the primary UI element

**Womens World Widget**:
- Placement: Always-open sidebar (left or right rail)
- Open states: Always Open (cannot be closed)
- Use case: Deep engagement, magazine-style browsing
- Designed for content exploration and discovery

### Live Preview Implementation

**Preview Strategy**: Use an iframe to isolate widget rendering from the dashboard app. This prevents CSS conflicts and allows true preview of embedded widget. Alternative: Render widget directly in preview panel, but this risks style leakage.

**Real-time Updates**: Use React state/context to pass configuration to preview component. Debounce updates (500ms) to avoid excessive re-renders on rapid typing.

**Device Simulation**: Use CSS transforms to scale preview frame to different device sizes. Show device frame chrome for visual context. Alternative: Resize iframe directly, but scaling provides better visual consistency.

**State Simulation**: For Teaser mode, implement playback controls (play, pause, restart) to simulate the auto-open/close sequence. This helps users understand timing settings visually.

### Version Control Strategy

**Automatic Versioning**: Create new version on every save (not on every keystroke). Use auto-save with debouncing (2-3 seconds) to balance between too many versions and lost work.

**Version Comparison**: Implement a deep diff algorithm that compares configuration objects recursively. Color-code changes (green=added, red=deleted, yellow=modified). Show both old and new values side-by-side.

**Rollback Safety**: Always show confirmation dialog before rollback. Rollback creates a new version (doesn't delete history). This ensures no data is ever lost and provides an audit trail.

### Embed Code Strategy

**One-Line Embed**: Generate a single `<script>` tag that:
1. Loads widget JavaScript asynchronously
2. Embeds widget configuration as data attributes
3. Initializes widget automatically on page load

**Example**:
```html
<script
  src="https://cdn.gist.ai/widget.js"
  data-widget-id="widget_123"
  data-config='{"type":"floating","placement":"bottom-right",...}'
  async
></script>
```

**Configuration Embedding**: Embed full configuration to avoid additional network requests. Use base64 encoding if config is large. Alternative: Fetch config via API using widget ID, but this adds latency.

**Code Formats**: Support multiple formats (HTML, React, WordPress shortcode) to cover different user needs. Each format has the same underlying logic but different syntax.

### Future Enhancements

**Phase 2: Actual Widget Rendering**
- Build the actual widget JavaScript library that renders on user sites
- Implement widget behavior (open/close, seed questions, AI search)
- Connect to AI backend for answer generation
- Handle widget-to-parent page communication

**Phase 3: Analytics & Insights**
- Widget usage dashboard (impressions, opens, questions asked)
- Popular seed questions analysis
- User engagement metrics
- A/B testing framework

**Phase 4: Advanced Features**
- Multi-language support for widgets
- Custom branding (white-label)
- Advanced targeting (geo, time-based, custom attributes)
- Widget marketplace (share widget templates)
- API access for programmatic widget management

### Technical Debt & Known Limitations

**MVP Scope**: This feature focuses on widget configuration UI and backend, not actual widget rendering (that's Phase 2). The live preview will be a simulated preview, not a fully functional widget.

**Performance**: With many widgets (100+), pagination should be implemented. Current implementation loads all widgets at once.

**Multi-user**: Current design assumes single-user per account. Future: Add user roles (admin, editor, viewer) and collaborative editing.

**Offline Support**: No offline capability. All changes require network connection. Future: Implement offline queue and sync when online.

**Mobile Editor**: Editor is optimized for tablet+. Mobile phone editing is possible but not ideal due to complex forms. Consider mobile-specific simplified editor.

**Widget Testing**: No automated testing for widget behavior (that's Phase 2). Manual testing via live preview only.

### Dependencies to Add

All shadcn/ui components are installed via `npx shadcn@latest add` (no npm dependencies).

**Potential Additional Libraries**:
- `react-color` or `@uiw/react-color` for color pickers (if shadcn doesn't have one)
- `react-beautiful-dnd` or `@dnd-kit/core` for drag-and-drop seed reordering
- `prismjs` or `highlight.js` for embed code syntax highlighting
- `diff` library for version comparison algorithm

**Note**: Evaluate necessity before adding. Prefer building custom solutions using existing primitives when feasible to minimize dependencies.

### SEO & Metadata Considerations

Since this is an authenticated dashboard, SEO is not a primary concern. However:
- Add proper page titles for each route
- Add meta descriptions for bookmarking clarity
- Use semantic HTML for better accessibility
- Consider Open Graph tags for link sharing (internal tools)

### Security Considerations

**Authentication**: All Convex queries/mutations verify authentication using `ctx.auth.getUserIdentity()`. Unauthenticated requests are rejected.

**Authorization**: Users can only access their own widgets. Widget ID is not sufficient; user ID must match.

**Input Validation**: All user inputs are validated on both client (zod) and server (Convex validators). Never trust client-side validation alone.

**XSS Prevention**: Sanitize all user-generated content before displaying (widget names, descriptions, seed questions). Use React's built-in escaping.

**Embed Code Security**: Generated embed code should use CSP-friendly techniques. Avoid inline scripts when possible. Use SRI (Subresource Integrity) for widget script.

**Version History Access**: Only widget owner can view version history. No public access to configuration details.

### Accessibility Compliance

**WCAG 2.1 AA Target**: All interfaces should meet WCAG 2.1 AA standards:
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation: All features accessible without mouse
- Screen reader: Proper ARIA labels and semantic HTML
- Focus management: Visible focus indicators, logical tab order
- Motion: Respect `prefers-reduced-motion`, provide toggle
- Forms: Clear labels, error messages, instructions

**Testing**: Use automated tools (Lighthouse, axe) and manual testing with screen reader.

### Internationalization (i18n)

**MVP**: English only. All text is hardcoded in components.

**Future**: Implement i18n with `next-intl` or similar:
- Extract all strings to translation files
- Support multiple languages (Spanish, French, German, etc.)
- RTL support for Arabic, Hebrew
- Date/time localization
- Number formatting

### Analytics & Monitoring

**User Analytics**: Track user interactions within dashboard:
- Widget creation frequency
- Most used tabs/features
- Time to complete widget setup
- Abandonment rates

**Error Tracking**: Implement error boundary and error reporting:
- Sentry or similar for production errors
- Log Convex mutation failures
- Track validation errors

**Performance Monitoring**: Track performance metrics:
- Page load times
- Preview update latency
- Auto-save frequency
- Version history load time

### Development Workflow

**Branch Strategy**: Create feature branch `feature/widget-configuration-dashboard`

**Commit Strategy**: Atomic commits per task step with descriptive messages

**Code Review**: Self-review using validation commands, then peer review if available

**Deployment**: Deploy to staging environment first, test thoroughly, then production

**Rollback Plan**: Keep previous version deployable. Use feature flags to disable new feature if needed.

### Documentation to Create

**User-Facing**:
- Widget configuration guide (help docs)
- Video tutorial (future)
- FAQs
- Troubleshooting guide

**Developer-Facing**:
- Widget type specification
- Configuration schema documentation
- Embed code API reference
- Convex schema documentation
- Component API documentation (JSDoc)

### Performance Benchmarks

**Target Metrics**:
- Widget list load: <1s for 50 widgets
- Editor load: <1s
- Auto-save latency: <500ms
- Preview update: <500ms after debounce
- Build time: <30s
- Bundle size: <500KB (excluding vendor)

**Optimization Strategies**:
- Code splitting by route
- Lazy load editor tabs
- Memoize expensive computations
- Debounce search/filter
- Paginate large lists
- Optimize images and icons
- Use React.memo strategically
