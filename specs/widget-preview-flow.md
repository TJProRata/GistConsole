# Feature: Widget Preview Flow for Landing Page

## Feature Description
Implement a comprehensive widget preview flow that allows unauthenticated users to experience the platform before signing up. Users can enter a Gist API key, choose from 3 widget types (floating, rufus, womensWorld), configure widget appearance (colors, gradients, icons), preview the widget in a demo HTML site, and seamlessly convert their preview configuration into a saved configuration upon sign-up. The system will use ephemeral preview configurations stored in Convex that are automatically cleaned up if the user exits the flow, but persist to the user's account if they complete sign-up/sign-in.

## User Story
As a prospective user visiting the landing page
I want to preview and configure a widget before creating an account
So that I can understand the platform's capabilities and see my customizations before committing to sign-up

## Problem Statement
Currently, users must sign up before experiencing the widget configuration capabilities. This creates friction in the user journey and reduces conversion rates. Users cannot evaluate whether the platform meets their needs without creating an account first. There is no way for users to trial the widget customization experience or see how their branding would look in the widgets.

## Solution Statement
Create a multi-step preview flow starting from the landing page that guides users through:
1. API key entry (validation is permissive - any input accepted for preview purposes)
2. Widget type selection (floating, rufus, or womensWorld)
3. Configuration customization (colors/gradients, icons, dimensions, behavior)
4. Live preview in a demo HTML site
5. Seamless conversion to authenticated user with configuration preservation

The solution uses a `previewConfigurations` table in Convex to store ephemeral preview data, automatically cleaning up abandoned previews while preserving completed ones through the sign-up process.

## Relevant Files
Use these files to implement the feature:

### Existing Files
- **`app/page.tsx`** - Landing page where "Preview Widget" button will be added
  - Add new button to trigger preview flow
  - Maintain existing authenticated/unauthenticated state handling

- **`convex/schema.ts`** - Database schema definitions
  - Add new `previewConfigurations` table schema
  - Reference existing widget configuration schema patterns

- **`app/dashboard/configure-widget/page.tsx`** - Existing widget configuration page
  - Reference form structure and validation patterns
  - Reuse widget type selection patterns
  - Adapt configuration form logic

- **`convex/gistConfigurations.ts`** - Widget configuration mutations/queries
  - Reference save configuration patterns
  - Create preview-specific mutations

- **`components/ui/**`** - shadcn/ui components for forms and UI elements
  - Button, Card, Input, Select, RadioGroup, Slider, Badge, Dialog, Tabs

- **`lib/utils.ts`** - Utility functions including `cn()` helper

- **`proxy.ts`** - Route protection middleware (Clerk)
  - Ensure preview routes are public (not protected)

### New Files

#### **`app/preview/page.tsx`**
- Preview flow landing page with API key entry
- Conditional rendering based on flow stage
- Session storage for preview state management

#### **`app/preview/select-widget/page.tsx`**
- Widget type selection page (floating, rufus, womensWorld)
- Visual cards showing each widget type with descriptions
- Navigation to configuration stage

#### **`app/preview/configure/page.tsx`**
- Widget configuration form (adapted from dashboard configure-widget)
- Color/gradient picker
- Icon upload/selection
- Dimension controls (width, height)
- Behavior settings (placement, open state mode)
- Live preview panel showing real-time updates

#### **`app/preview/demo/page.tsx`**
- Full-page HTML demo site showing configured widget
- "Like this? Create an account" CTA button
- Widget rendered with user's configuration

#### **`convex/previewConfigurations.ts`**
- Queries and mutations for preview configurations
- `createPreviewConfig` - Create new preview configuration
- `updatePreviewConfig` - Update existing preview
- `getPreviewConfig` - Retrieve preview by session ID
- `convertPreviewToUserConfig` - Convert preview to user configuration after sign-up
- `cleanupAbandonedPreviews` - Scheduled job to delete old previews

#### **`components/PreviewWidgetRenderer.tsx`**
- Component to render widget preview with configuration
- Handles all 3 widget types (floating, rufus, womensWorld)
- Live updates from configuration state

#### **`lib/hooks/usePreviewSession.ts`**
- React hook to manage preview session ID
- Generates and persists session ID in localStorage
- Handles session cleanup

## shadcn/ui Components

### Existing Components to Use
- **`button.tsx`** - CTA buttons, navigation buttons, form actions
- **`card.tsx`** - Widget type selection cards, preview containers
- **`input.tsx`** - API key input, text inputs for configuration
- **`label.tsx`** - Form field labels
- **`form.tsx`** - Form structure and validation
- **`select.tsx`** - Dropdown selections for configuration options
- **`radio-group.tsx`** - Widget type selection, placement options
- **`slider.tsx`** - Dimension controls (width, height)
- **`badge.tsx`** - Widget type indicators, status badges
- **`tabs.tsx`** - Configuration sections (Basics, Appearance, Behavior)
- **`dialog.tsx`** - Confirmation dialogs for exit warnings
- **`separator.tsx`** - Visual section separators
- **`textarea.tsx`** - Multi-line input fields if needed

### New Components to Add
```bash
npx shadcn@latest add progress
```
- Use for multi-step progress indicator showing current stage in preview flow

```bash
npx shadcn@latest add alert
```
- Use for informational messages and validation feedback

```bash
npx shadcn@latest add skeleton
```
- Use for loading states when fetching/saving preview configurations

### Custom Components to Create
**`components/WidgetPreviewContainer.tsx`**
- Custom container following shadcn/ui patterns (CVA variants, forwardRef, CSS variables)
- Displays live widget preview with configuration
- Supports all 3 widget types with responsive behavior
- Uses CSS variables for theme integration

**`components/ColorGradientPicker.tsx`**
- Custom color/gradient picker following shadcn/ui patterns
- Supports solid colors and gradients
- Visual preview of selected colors
- Built with CVA for variants, proper TypeScript types

**`components/PreviewFlowStepper.tsx`**
- Multi-step navigation indicator
- Shows current step and completed steps
- Click to navigate between steps
- Following shadcn/ui design patterns

## Implementation Plan

### Phase 1: Foundation
1. **Database Schema**
   - Create `previewConfigurations` table in Convex schema
   - Define preview session ID structure (UUID-based)
   - Add timestamps for automatic cleanup
   - Create indexes for efficient querying

2. **Session Management**
   - Implement `usePreviewSession` hook for session ID generation
   - Set up localStorage persistence
   - Add session validation logic

3. **Route Structure**
   - Create `/preview` route directory structure
   - Configure public routes in `proxy.ts` middleware
   - Set up navigation flow between preview stages

### Phase 2: Core Implementation
1. **API Key Entry Stage**
   - Create landing page preview button
   - Build API key entry page with form validation
   - Implement permissive validation (any input accepted)
   - Create preview session on API key submission

2. **Widget Type Selection**
   - Build widget type selection page with visual cards
   - Display 3 widget types (floating, rufus, womensWorld)
   - Add descriptions and visual indicators
   - Save widget type to preview configuration

3. **Configuration Stage**
   - Adapt existing configure-widget page for preview context
   - Implement color/gradient picker
   - Add icon upload/selection
   - Create dimension controls
   - Build behavior settings (placement, open state)
   - Add live preview panel with real-time updates
   - Save configuration changes to previewConfigurations table

4. **Demo Preview Stage**
   - Create full-page demo HTML site
   - Render widget with user configuration
   - Add "Like this? Create an account" CTA
   - Implement smooth widget interaction

### Phase 3: Integration
1. **Sign-Up Conversion**
   - Implement preview configuration retrieval during sign-up
   - Create `convertPreviewToUserConfig` mutation
   - Transfer preview config to user's gistConfigurations
   - Clean up preview configuration after transfer

2. **Cleanup Automation**
   - Create scheduled Convex function for preview cleanup
   - Set TTL for preview configurations (24 hours)
   - Implement efficient batch deletion

3. **Exit Handling**
   - Add dialog confirmation for abandoning preview
   - Implement cleanup on explicit exit
   - Handle browser close/refresh scenarios

## Step by Step Tasks

### Step 1: Database Schema Setup
- Add `previewConfigurations` table to `convex/schema.ts`
  - Fields: sessionId (string), widgetType (enum), configuration (object), createdAt (number), expiresAt (number)
  - Indexes: by_session_id, by_expiration
- Add `previewToUserMapping` table for tracking conversions
  - Fields: sessionId (string), userId (string), converted (boolean), convertedAt (number)
  - Index: by_session_id

### Step 2: Preview Configuration Mutations and Queries
- Create `convex/previewConfigurations.ts`
- Implement `createPreviewConfig` mutation
- Implement `updatePreviewConfig` mutation
- Implement `getPreviewConfig` query
- Implement `convertPreviewToUserConfig` mutation
- Implement `cleanupAbandonedPreviews` scheduled function (runs every 6 hours)

### Step 3: Session Management Hook
- Create `lib/hooks/usePreviewSession.ts`
- Implement session ID generation (UUID v4)
- Add localStorage persistence logic
- Add session validation and retrieval
- Add cleanup on unmount

### Step 4: Update Route Protection
- Update `proxy.ts` to allow public access to `/preview` routes
- Maintain authentication protection for all other routes
- Test route access for authenticated and unauthenticated users

### Step 5: Add shadcn/ui Components
- Run `npx shadcn@latest add progress` to add Progress component
- Run `npx shadcn@latest add alert` to add Alert component
- Run `npx shadcn@latest add skeleton` to add Skeleton component

### Step 6: Create Preview Button on Landing Page
- Update `app/page.tsx`
- Add "Preview Widget" button for unauthenticated users
- Position below existing sign-in/sign-up messaging
- Link to `/preview` route

### Step 7: Build API Key Entry Page
- Create `app/preview/page.tsx`
- Build form with Input component for API key
- Add permissive validation (any non-empty input accepted)
- Create preview session and store in Convex
- Add loading state with Skeleton component
- Navigate to `/preview/select-widget` on success

### Step 8: Build Widget Type Selection Page
- Create `app/preview/select-widget/page.tsx`
- Create visual cards for each widget type (floating, rufus, womensWorld)
- Add descriptions and preview thumbnails
- Use RadioGroup for selection
- Save widget type to previewConfigurations
- Navigate to `/preview/configure` on selection

### Step 9: Create Custom Color Gradient Picker Component
- Create `components/ColorGradientPicker.tsx`
- Implement CVA variants for size and style
- Add color picker input (HTML5 color input)
- Add gradient mode toggle
- Add gradient stop controls
- Use forwardRef for DOM element access
- Add TypeScript types

### Step 10: Create Custom Preview Flow Stepper Component
- Create `components/PreviewFlowStepper.tsx`
- Implement 4-step indicator (API Key → Widget Type → Configure → Preview)
- Show current step, completed steps, and remaining steps
- Add click navigation between completed steps
- Use CVA for styling variants
- Follow shadcn/ui design patterns

### Step 11: Build Widget Configuration Page
- Create `app/preview/configure/page.tsx`
- Adapt form structure from `app/dashboard/configure-widget/page.tsx`
- Implement Tabs for configuration sections (Basics, Appearance, Behavior)
- Add color/gradient picker using custom ColorGradientPicker component
- Add dimension controls with Slider components
- Add placement options with RadioGroup
- Add behavior settings (open state mode)
- Create live preview panel with real-time updates
- Save configuration to previewConfigurations on change (debounced)
- Add "Preview in Demo" button to navigate to `/preview/demo`

### Step 12: Create Widget Preview Renderer Component
- Create `components/PreviewWidgetRenderer.tsx`
- Implement rendering for all 3 widget types
- Handle floating widget (button + expandable panel)
- Handle rufus widget (centered modal)
- Handle womensWorld widget (sidebar)
- Apply user configuration (colors, dimensions, placement)
- Use CSS variables for dynamic styling

### Step 13: Build Demo Preview Page
- Create `app/preview/demo/page.tsx`
- Create full-page demo HTML site layout
- Render PreviewWidgetRenderer with user configuration
- Add "Like this? Create an account" CTA button
- Position CTA in prominent location (center of page)
- Link CTA to Clerk sign-up flow with state preservation

### Step 14: Implement Preview to User Config Conversion
- Update `convex/previewConfigurations.ts`
- Implement `convertPreviewToUserConfig` mutation
- Retrieve preview configuration by session ID
- Create new gistConfiguration for authenticated user
- Copy all configuration fields from preview
- Delete preview configuration after successful conversion
- Return new configuration ID

### Step 15: Integrate Conversion with Sign-Up Flow
- Create `lib/hooks/usePreviewConversion.ts` hook
- Detect when user completes sign-up (Clerk webhook)
- Retrieve preview session ID from localStorage
- Call `convertPreviewToUserConfig` mutation
- Redirect user to dashboard with success message
- Clean up preview session ID from localStorage

### Step 16: Implement Exit Handling and Cleanup
- Add Dialog component to preview pages for exit confirmation
- Detect navigation away from preview flow
- Show "Your preview will be lost" warning
- Allow user to continue or cancel
- Implement browser beforeunload event handler
- Clean up preview configuration on explicit exit

### Step 17: Create Scheduled Cleanup Job
- Implement `cleanupAbandonedPreviews` in `convex/previewConfigurations.ts`
- Configure Convex cron job to run every 6 hours
- Query previewConfigurations where expiresAt < now
- Delete expired previews in batches
- Log cleanup statistics

### Step 18: Add Error Handling and Loading States
- Add error boundaries to all preview pages
- Implement error messages with Alert component
- Add loading states with Skeleton component during data fetching
- Add retry logic for failed mutations
- Display user-friendly error messages

### Step 19: Run Validation Commands
- Execute all validation commands to ensure feature works correctly with zero regressions
- Test preview flow end-to-end manually
- Verify configuration persistence and conversion
- Test cleanup automation
- Validate all routes are accessible

## Testing Strategy

### Unit Tests
- **usePreviewSession Hook**
  - Test session ID generation
  - Test localStorage persistence
  - Test session retrieval and validation

- **ColorGradientPicker Component**
  - Test color selection
  - Test gradient mode toggle
  - Test gradient stop controls

- **PreviewWidgetRenderer Component**
  - Test rendering for each widget type
  - Test configuration application
  - Test dynamic styling with CSS variables

### Integration Tests
- **Preview Flow Navigation**
  - Test navigation between all preview stages
  - Test back navigation and state preservation
  - Test exit handling and cleanup

- **Configuration Persistence**
  - Test saving configuration to previewConfigurations
  - Test retrieving configuration across stages
  - Test real-time preview updates

- **Sign-Up Conversion**
  - Test preview configuration retrieval after sign-up
  - Test conversion to user configuration
  - Test cleanup of preview configuration

### Edge Cases
- **Session Expiration**
  - Test behavior when preview session expires during flow
  - Verify automatic cleanup of expired sessions

- **Multiple Previews**
  - Test creating multiple preview sessions from same browser
  - Verify each session is isolated

- **Abandoned Previews**
  - Test automatic cleanup of abandoned previews after 24 hours
  - Verify no data leaks

- **Browser Refresh**
  - Test state restoration after browser refresh
  - Verify session ID persists in localStorage

- **Authentication Edge Cases**
  - Test preview flow when user is already authenticated
  - Test sign-in vs sign-up conversion paths
  - Test configuration merge if user already has configurations

## Acceptance Criteria
- [ ] Unauthenticated users can access the preview flow from the landing page
- [ ] API key entry accepts any non-empty input and creates a preview session
- [ ] Users can select from 3 widget types (floating, rufus, womensWorld)
- [ ] Configuration page allows customization of colors/gradients, dimensions, and behavior
- [ ] Live preview updates in real-time as configuration changes
- [ ] Demo page displays configured widget in full-page HTML site
- [ ] "Like this? Create an account" CTA triggers sign-up flow
- [ ] Preview configuration is converted to user configuration after successful sign-up
- [ ] Abandoned previews are automatically cleaned up after 24 hours
- [ ] Exit from preview flow shows confirmation dialog
- [ ] Preview configuration is deleted on explicit exit
- [ ] All preview routes are public (not protected by authentication)
- [ ] Session ID persists across page refreshes via localStorage
- [ ] Multiple preview sessions from same browser are isolated
- [ ] No TypeScript or build errors
- [ ] Zero regressions in existing functionality

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually test the feature end-to-end
- `bun test` - Run tests to validate the feature works with zero regressions (if tests exist)

### Manual Testing Checklist
1. **Landing Page**
   - [ ] "Preview Widget" button visible for unauthenticated users
   - [ ] Button links to `/preview` route

2. **API Key Entry**
   - [ ] Form accepts any non-empty input
   - [ ] Loading state displays during session creation
   - [ ] Navigation to widget type selection on success

3. **Widget Type Selection**
   - [ ] All 3 widget types displayed with visual cards
   - [ ] Widget type selection persists in preview configuration
   - [ ] Navigation to configuration page on selection

4. **Configuration Page**
   - [ ] Tabs switch between Basics, Appearance, and Behavior sections
   - [ ] Color picker updates preview in real-time
   - [ ] Gradient picker creates proper gradients
   - [ ] Dimension sliders update widget size
   - [ ] Placement options change widget position in preview
   - [ ] Configuration saves to Convex (debounced)
   - [ ] "Preview in Demo" button navigates to demo page

5. **Demo Preview**
   - [ ] Widget renders with user configuration
   - [ ] All widget interactions work (open, close, etc.)
   - [ ] CTA button displays prominently
   - [ ] CTA links to sign-up flow

6. **Sign-Up Conversion**
   - [ ] Sign-up flow preserves preview session ID
   - [ ] Preview configuration converts to user configuration
   - [ ] User redirected to dashboard after sign-up
   - [ ] Configuration visible in dashboard
   - [ ] Preview configuration deleted from previewConfigurations table

7. **Exit Handling**
   - [ ] Dialog appears when navigating away from preview
   - [ ] Dialog allows continue or cancel
   - [ ] Preview configuration deleted on explicit exit

8. **Cleanup Automation**
   - [ ] Expired previews (>24 hours) are deleted by scheduled job
   - [ ] No orphaned preview configurations remain

## Notes

### Technology Stack Integration
- **Bun 1.3.1**: Use `bun dev`, `bun run build`, and `bun add` for all package management
- **Next.js 16**: Use App Router with async components and React Server Components where appropriate
- **React 19.2**: Use latest hooks and patterns (no forwardRef needed for ref props in function components)
- **Convex**: Real-time database with automatic schema migrations
- **Clerk**: Authentication with webhook-based user sync

### Design Considerations
- **Color/Gradient Picker**: Consider using a library like `react-colorful` (add via `bun add react-colorful`) or building a custom picker following shadcn/ui patterns
- **Icon Upload**: Reference favicon upload implementation in `app/dashboard/page.tsx` for file handling patterns
- **Session TTL**: 24 hours is a reasonable default, but can be adjusted based on user feedback
- **Preview Limit**: Consider adding rate limiting to prevent abuse (e.g., max 10 previews per IP per hour)

### Future Enhancements
- **Preview Sharing**: Allow users to share preview link with team members
- **Preview Templates**: Pre-configured templates for common use cases
- **Advanced Customization**: Custom CSS injection, font selection, animation preferences
- **A/B Testing**: Track conversion rates from preview to sign-up
- **Preview Analytics**: Track which configurations lead to sign-ups

### Security Considerations
- **Session Validation**: Always validate preview session ID before allowing configuration updates
- **Rate Limiting**: Implement rate limiting on preview creation to prevent abuse
- **XSS Protection**: Sanitize all user inputs, especially in demo preview rendering
- **CSRF Protection**: Use Convex's built-in authentication for all mutations

### Performance Optimizations
- **Debounced Saves**: Configuration changes should be debounced (500ms) before saving to Convex
- **Optimistic Updates**: Use optimistic updates for smooth UI during configuration changes
- **Lazy Loading**: Lazy load widget preview renderer for faster initial page load
- **Code Splitting**: Split preview flow routes to reduce initial bundle size

### Accessibility Considerations
- **Keyboard Navigation**: Ensure all preview stages can be navigated via keyboard
- **Screen Reader Support**: Add proper ARIA labels and descriptions
- **Focus Management**: Manage focus when navigating between preview stages
- **Color Contrast**: Ensure color picker shows contrast ratio warnings for accessibility
