# Feature: Widget Configurations Table with Preview Preservation

## Feature Description
Create a dedicated `widgetConfigurations` table in Convex to preserve widget appearance settings (colors, dimensions, placement, text customization) when users sign up after previewing a widget. This table will store widget-specific configuration separate from content ingestion settings (`gistConfigurations`), enabling users to maintain their carefully configured widget appearance from preview to production.

The feature will:
1. Add a new `widgetConfigurations` table to the Convex schema
2. Link widget configurations to gist configurations (1:1 relationship)
3. Preserve preview widget settings during user sign-up conversion
4. Provide queries and mutations for CRUD operations on widget configurations
5. Update the dashboard to display and manage widget configurations
6. Maintain backward compatibility with existing preview flow

## User Story
As a user who has configured a widget in the preview flow
I want my widget appearance settings to be automatically saved when I sign up
So that I don't have to reconfigure colors, placement, dimensions, and text customization in the dashboard

## Problem Statement
Currently, when users complete the preview flow (`/preview` → `/preview/configure` → `/preview/demo`) and sign up, their carefully configured widget appearance is lost. The `convertPreviewToUserConfig` mutation only creates a minimal `gistConfigurations` entry with default values, discarding all widget appearance data stored in `previewConfigurations`.

This creates a poor user experience where:
- Users spend time configuring widget colors, gradients, placement, and dimensions
- They see their configured widget in the demo
- After sign-up, all appearance settings are gone
- They must manually reconfigure everything in the dashboard

The root cause is a schema mismatch:
- `previewConfigurations` stores widget appearance (colors, dimensions, placement)
- `gistConfigurations` stores content ingestion settings (RSS feeds, WordPress URLs)
- No dedicated table exists for persisting widget appearance after conversion

## Solution Statement
Create a new `widgetConfigurations` table that:
1. Stores all widget appearance and behavior settings
2. References both `userId` and `gistConfigurationId` for proper data relationships
3. Preserves preview settings during conversion via enhanced `convertPreviewToUserConfig` mutation
4. Provides dedicated queries/mutations for widget configuration management
5. Integrates seamlessly with the existing dashboard configure widget page

The solution maintains separation of concerns:
- `gistConfigurations` → content ingestion settings (what content to display)
- `widgetConfigurations` → widget appearance settings (how to display it)

## Relevant Files
Use these files to implement the feature:

- **`convex/schema.ts`** - Add new `widgetConfigurations` table definition with proper indexes
  - Create table with widget appearance fields (colors, dimensions, placement, text)
  - Add foreign key relationship to `gistConfigurations` via `gistConfigurationId`
  - Index by `userId` and `gistConfigurationId` for efficient queries
  - Define strong enum validation for `widgetType` and `placement`

- **`convex/previewConfigurations.ts`** - Update conversion mutation to preserve widget settings
  - Modify `convertPreviewToUserConfig` to create `widgetConfigurations` entry
  - Transfer all appearance settings from `previewConfigurations.configuration`
  - Maintain existing gistConfiguration creation logic
  - Link new widget config to created gist config via ID

- **`lib/hooks/usePreviewConversion.ts`** - No changes needed (already handles conversion)
  - Current implementation calls `convertPreviewToUserConfig` automatically
  - localStorage cleanup works correctly
  - Hook will benefit from enhanced mutation without modifications

- **`app/dashboard/configure-widget/page.tsx`** - Update to work with new schema
  - Query `widgetConfigurations` instead of reading from `gistConfigurations`
  - Display existing widget config if available, otherwise show defaults
  - Save changes to `widgetConfigurations` table
  - Link widget config to selected gist configuration

- **`app/preview/demo/page.tsx`** - No changes needed
  - Already using `SignUpButton` with modal (recent fix)
  - Preview conversion happens automatically via `usePreviewConversion` hook

- **`components/PreviewWidgetRenderer.tsx`** - Verify compatibility
  - Ensure component can render from both preview and user widget configs
  - Configuration structure should match between both tables

### New Files

- **`convex/widgetConfigurations.ts`** - Widget configuration queries and mutations
  - `getWidgetConfig` - Query widget config by gistConfigurationId
  - `getUserWidgetConfigs` - Query all widget configs for a user
  - `createWidgetConfig` - Create new widget configuration
  - `updateWidgetConfig` - Update existing widget configuration
  - `deleteWidgetConfig` - Delete widget configuration
  - Helper functions for validation and defaults

## shadcn/ui Components
### Existing Components to Use
- **button** - Save/Cancel actions on configure widget page
- **card** - Display widget configuration sections
- **form** - Widget configuration form with validation
- **input** - Text inputs for custom text fields (title, placeholder, etc.)
- **label** - Form field labels
- **select** - Widget type and placement dropdowns
- **slider** - Width and height dimension controls
- **tabs** - Organize configuration sections (appearance, behavior, text)
- **badge** - Widget type indicators
- **separator** - Visual section separation
- **alert** - Success/error messages for save operations

### New Components to Add
- **toast** - User feedback for save/update operations
  ```bash
  npx shadcn@latest add toast
  ```
- **switch** - Toggle controls (useGradient, openByDefault)
  ```bash
  npx shadcn@latest add switch
  ```

### Custom Components to Create
- **ColorGradientPicker** - Already exists in `components/ColorGradientPicker.tsx`
  - Used for color selection with gradient support
  - Follows shadcn/ui patterns with forwardRef and cn() utility
  - No changes needed

## Implementation Plan
### Phase 1: Foundation
**Database Schema & Backend Infrastructure**

1. Create the `widgetConfigurations` table in `convex/schema.ts`
2. Define configuration schema matching `previewConfigurations.configuration` structure
3. Add proper indexes for efficient queries (`by_user_id`, `by_gist_config_id`)
4. Create `convex/widgetConfigurations.ts` with CRUD queries/mutations
5. Deploy schema changes to Convex

### Phase 2: Core Implementation
**Conversion Logic & Data Preservation**

1. Update `convertPreviewToUserConfig` mutation to create widget configuration
2. Transfer appearance settings from preview to widget config table
3. Link widget config to newly created gist config via foreign key
4. Add error handling for partial failures (gist config succeeds, widget config fails)
5. Test conversion flow end-to-end with various widget types

### Phase 3: Integration
**Dashboard & User Experience**

1. Update dashboard configure widget page to use new schema
2. Add toast notifications for save/update operations
3. Add switch components for boolean toggles (gradient, open by default)
4. Query and display existing widget configs from new table
5. Implement update/delete functionality with confirmation
6. Add loading states and error handling
7. Test full user journey: preview → sign up → dashboard configuration

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add Toast and Switch Components
- Run `npx shadcn@latest add toast` to add toast notifications
- Run `npx shadcn@latest add switch` to add toggle switches
- Verify components are added to `components/ui/toast.tsx` and `components/ui/switch.tsx`
- Test imports in a test file to ensure they work

### Step 2: Create Widget Configurations Schema
- Open `convex/schema.ts`
- Add `widgetConfigurations` table definition after `gistConfigurations`
- Include all fields from `previewConfigurations.configuration`:
  - Widget identification: `userId`, `gistConfigurationId`, `widgetType`
  - Colors: `primaryColor`, `secondaryColor`, `backgroundColor`, `textColor`
  - Gradient: `useGradient`, `gradientStart`, `gradientEnd`
  - Dimensions: `width`, `height`
  - Behavior: `placement`, `openByDefault`
  - Icons: `iconUrl`, `iconStorageId`
  - Text customization: `collapsedText`, `title`, `placeholder`, `followUpPlaceholder`, `suggestionCategories`, `brandingText`
  - Timestamps: `createdAt`, `updatedAt`
- Add indexes: `.index("by_user_id", ["userId"])`, `.index("by_gist_config_id", ["gistConfigurationId"])`
- Add strong enum validation for `widgetType` and `placement` (match preview schema)
- Run `npx convex dev` to deploy schema changes
- Verify table appears in Convex Dashboard → Data

### Step 3: Create Widget Configurations CRUD Functions
- Create new file `convex/widgetConfigurations.ts`
- Import schema validators and define reusable configuration object schema
- Implement `getWidgetConfig` query:
  - Args: `gistConfigurationId`
  - Returns widget config or null
  - Verify user owns the gist configuration
- Implement `getUserWidgetConfigs` query:
  - Args: none (uses authenticated user)
  - Returns all widget configs for current user
  - Include gist configuration details via join
- Implement `createWidgetConfig` mutation:
  - Args: `gistConfigurationId`, `widgetType`, `configuration` object
  - Validates user owns the gist config
  - Creates new widget configuration entry
  - Returns created config ID
- Implement `updateWidgetConfig` mutation:
  - Args: `widgetConfigId`, `configuration` object
  - Validates user owns the widget config
  - Updates configuration fields
  - Updates `updatedAt` timestamp
  - Returns success boolean
- Implement `deleteWidgetConfig` mutation:
  - Args: `widgetConfigId`
  - Validates user ownership
  - Deletes widget configuration
  - Returns success boolean
- Add helper function `getDefaultConfiguration` for widget type defaults
- Test all functions in Convex Dashboard → Functions panel

### Step 4: Update Preview Conversion Mutation
- Open `convex/previewConfigurations.ts`
- Locate `convertPreviewToUserConfig` mutation (lines 155-221)
- After creating `gistConfigurations` entry (line 190-198):
  - Extract `preview.widgetType` and `preview.configuration`
  - Only create widget config if both exist
  - Call `ctx.db.insert("widgetConfigurations", { ... })`
  - Include all configuration fields from preview
  - Link to `configId` via `gistConfigurationId: configId`
  - Add `userId: identity.subject`
  - Set `createdAt` and `updatedAt` timestamps
- Add error handling for widget config creation (log but don't fail conversion)
- Return both `configId` and `widgetConfigId` in success response
- Test conversion with preview data in Convex Dashboard

### Step 5: Update Dashboard Configure Widget Page - Query Integration
- Open `app/dashboard/configure-widget/page.tsx`
- Import Convex hooks: `import { useQuery, useMutation } from "convex/react"`
- Import API: `import { api } from "@/convex/_generated/api"`
- Add state for selected gist configuration: `const [selectedGistConfigId, setSelectedGistConfigId] = useState<Id<"gistConfigurations"> | null>(null)`
- Query user's gist configurations: `const gistConfigs = useQuery(api.gistConfigurations.getUserConfigs)`
- Query widget config when gist config selected: `const widgetConfig = useQuery(api.widgetConfigurations.getWidgetConfig, selectedGistConfigId ? { gistConfigurationId: selectedGistConfigId } : "skip")`
- Update form default values to use `widgetConfig` data when available
- Add gist configuration selector UI (dropdown or radio group)

### Step 6: Update Dashboard Configure Widget Page - Mutation Integration
- Add mutation hooks:
  - `const createWidgetConfig = useMutation(api.widgetConfigurations.createWidgetConfig)`
  - `const updateWidgetConfig = useMutation(api.widgetConfigurations.updateWidgetConfig)`
- Update `onSubmit` function:
  - Check if `widgetConfig` exists (update) or is null (create)
  - If creating: call `createWidgetConfig` with form values
  - If updating: call `updateWidgetConfig` with config ID and form values
  - Handle errors with try/catch and display toast notification
- Add toast provider to page layout
- Display success/error toasts based on mutation results
- Add loading states during save operations

### Step 7: Add Widget Configuration Management UI
- Add section to display existing widget configurations
- Show list of widget configs linked to gist configurations
- Include edit/delete actions for each config
- Add confirmation dialog for delete operations (use existing `dialog` component)
- Implement delete handler with `deleteWidgetConfig` mutation
- Add empty state when no widget configs exist
- Style with existing card and badge components

### Step 8: Add Toggle Switches for Boolean Fields
- Import `Switch` component: `import { Switch } from "@/components/ui/switch"`
- Replace checkbox for `useGradient` field with Switch component
- Replace checkbox for `openByDefault` field with Switch component
- Update form field rendering to use FormField + FormControl + Switch pattern
- Test toggle behavior and form validation
- Ensure switch states sync with form values correctly

### Step 9: Testing & Validation
- Clear browser localStorage and cookies
- Test preview flow with widget configuration:
  1. Navigate to `/preview`
  2. Enter API key and configure widget (colors, dimensions, placement, text)
  3. Navigate to `/preview/demo` and verify widget appearance
  4. Click "Create Account & Save" and complete sign-up
  5. Verify redirect to `/dashboard`
  6. Navigate to `/dashboard/configure-widget`
  7. Select the gist configuration created during conversion
  8. Verify widget configuration displays with preserved settings
  9. Modify settings and save
  10. Verify updates persist
- Test creating new widget configuration from dashboard
- Test deleting widget configuration with confirmation
- Test edge cases: missing preview config, conversion failure, duplicate configs
- Verify Convex tables in Dashboard:
  - `widgetConfigurations` has entry with correct data
  - `gistConfigurations` has linked entry
  - `previewConfigurations` entry is deleted

### Step 10: Run Validation Commands
- Execute all validation commands listed below
- Fix any TypeScript errors, build errors, or runtime errors
- Verify zero regressions in existing functionality
- Test complete user journey end-to-end
- Verify data integrity in Convex Dashboard

## Testing Strategy
### Unit Tests
- **Widget configuration validation**: Test schema validators for required fields, enum values, and type constraints
- **Default configuration generation**: Test `getDefaultConfiguration` helper returns correct defaults for each widget type
- **Configuration merging**: Test merging partial updates with existing configuration
- **User ownership validation**: Test queries reject unauthorized access to other users' configs

### Integration Tests
- **Preview to user conversion**: Test `convertPreviewToUserConfig` creates both gist and widget configurations
- **Widget config CRUD**: Test create, read, update, delete operations for widget configurations
- **Gist config linking**: Test widget configs correctly link to gist configs via foreign key
- **Query performance**: Test indexes provide efficient queries for user configs and gist config lookups

### Edge Cases
- **Preview conversion without widget type**: Conversion creates gist config only, no widget config (graceful degradation)
- **Preview conversion with partial configuration**: Missing optional fields default to undefined, conversion succeeds
- **Widget config deletion**: Deleting widget config doesn't affect linked gist config
- **Gist config deletion**: Cascade delete widget configs when gist config is deleted (add to deletion mutation)
- **Multiple widget configs per gist config**: Currently 1:1, but schema supports 1:many if needed in future
- **Concurrent updates**: Test optimistic locking or last-write-wins behavior
- **Invalid widget type**: Schema validation rejects invalid types before insert
- **Missing gist configuration**: Create widget config mutation fails with clear error message

## Acceptance Criteria
- [ ] `widgetConfigurations` table exists in Convex schema with proper fields and indexes
- [ ] `convex/widgetConfigurations.ts` file contains all CRUD queries and mutations
- [ ] `convertPreviewToUserConfig` mutation creates widget configuration when preview has widget data
- [ ] Preview widget settings (colors, dimensions, placement, text) are preserved after sign-up
- [ ] Dashboard configure widget page displays existing widget configurations
- [ ] Users can create new widget configurations from the dashboard
- [ ] Users can update existing widget configurations with immediate persistence
- [ ] Users can delete widget configurations with confirmation dialog
- [ ] Toast notifications appear for successful save/update/delete operations
- [ ] Switch components control gradient and open-by-default boolean settings
- [ ] Form validation prevents invalid widget configuration data
- [ ] Loading states display during async operations (queries and mutations)
- [ ] Error handling gracefully manages API failures with user-friendly messages
- [ ] All widget types (floating, rufus, womensWorld) are supported
- [ ] TypeScript types are correct with no build errors
- [ ] Zero regressions in existing preview or dashboard functionality
- [ ] Backward compatibility: existing preview flow works without widget configs

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npx shadcn@latest add toast` - Add toast notification component
- `npx shadcn@latest add switch` - Add switch toggle component
- `npx convex dev` - Deploy schema changes and test functions (keep running in background)
- `bun run build` - Build Next.js app to validate no TypeScript or build errors
- `bun dev` - Start Next.js dev server and manually test complete flow:
  1. Preview flow: `/preview` → configure widget → `/preview/demo` → sign up
  2. Verify widget config preserved in dashboard
  3. Create new widget config from dashboard
  4. Update existing widget config
  5. Delete widget config with confirmation
  6. Test all widget types (floating, rufus, womensWorld)
  7. Test switch toggles for gradient and open-by-default
  8. Test toast notifications for all operations
  9. Verify data in Convex Dashboard → Data → widgetConfigurations

### Manual Testing Checklist

**Test 1: Preview Conversion with Widget Settings**
1. Clear browser state (localStorage + cookies)
2. Navigate to `/preview`
3. Enter API key: "test-preview-widget"
4. Select widget type: "floating"
5. Configure appearance:
   - Use gradient: ON
   - Gradient: Blue (#3B82F6) to Purple (#8B5CF6)
   - Width: 400px
   - Height: 600px
   - Placement: bottom-right
   - Open by default: OFF
6. Navigate to `/preview/demo`
7. Verify widget displays with configured settings
8. Click "Create Account & Save"
9. Complete sign-up with test email
10. ✅ **Verify**: Redirected to `/dashboard`
11. Navigate to `/dashboard/configure-widget`
12. ✅ **Verify**: Widget configuration displays with preserved settings
13. Open Convex Dashboard → Data → `widgetConfigurations`
14. ✅ **Verify**: Entry exists with correct data (gradient colors, dimensions, placement)
15. Check `gistConfigurations` table
16. ✅ **Verify**: Widget config `gistConfigurationId` matches gist config `_id`

**Test 2: Create New Widget Configuration**
1. Stay on `/dashboard/configure-widget` from Test 1
2. Create new gist configuration if needed (or select different one)
3. Change widget settings:
   - Widget type: "rufus"
   - Use gradient: OFF
   - Primary color: Green (#10B981)
   - Width: 500px
   - Placement: bottom-left
4. Click "Save Configuration"
5. ✅ **Verify**: Toast notification displays "Widget configuration saved"
6. Refresh page
7. ✅ **Verify**: Settings persist correctly
8. Check Convex Dashboard
9. ✅ **Verify**: New `widgetConfigurations` entry created

**Test 3: Update Existing Widget Configuration**
1. Load existing widget config from Test 1
2. Modify settings:
   - Change gradient end color to Pink (#EC4899)
   - Change width to 450px
   - Toggle "Open by default" to ON
3. Click "Save Configuration"
4. ✅ **Verify**: Toast notification displays "Widget configuration updated"
5. Refresh page
6. ✅ **Verify**: Changes persist
7. Check Convex Dashboard
8. ✅ **Verify**: `updatedAt` timestamp changed, data matches

**Test 4: Delete Widget Configuration**
1. Navigate to widget configuration list/manager
2. Click delete on a widget configuration
3. ✅ **Verify**: Confirmation dialog appears
4. Click "Cancel"
5. ✅ **Verify**: Configuration not deleted
6. Click delete again and confirm
7. ✅ **Verify**: Toast notification displays "Widget configuration deleted"
8. ✅ **Verify**: Configuration removed from list
9. Check Convex Dashboard
10. ✅ **Verify**: Entry deleted from `widgetConfigurations` table
11. ✅ **Verify**: Linked gist config still exists (not cascade deleted)

**Test 5: Switch Component Behavior**
1. Navigate to configure widget page
2. Test "Use Gradient" switch:
   - Toggle ON → gradient color pickers appear
   - Toggle OFF → gradient pickers hidden, primary color picker shows
3. Test "Open by Default" switch:
   - Toggle ON → form value updates
   - Toggle OFF → form value updates
4. Save configuration
5. ✅ **Verify**: Switch states saved correctly
6. Reload page
7. ✅ **Verify**: Switch states restored from saved config

**Test 6: Widget Type Support**
1. Test each widget type separately:
   - Create config with type "floating" → save → verify
   - Create config with type "rufus" → save → verify
   - Create config with type "womensWorld" → save → verify
2. ✅ **Verify**: All widget types work correctly
3. ✅ **Verify**: Type-specific fields appear (e.g., NYT Chat Widget text fields for appropriate types)

**Test 7: Error Handling**
1. Attempt to save widget config with invalid data:
   - Missing required fields
   - Invalid color hex codes
   - Out-of-range dimensions
2. ✅ **Verify**: Form validation prevents submission
3. ✅ **Verify**: Clear error messages display
4. Simulate network failure (disable internet)
5. Attempt to save configuration
6. ✅ **Verify**: Error toast displays with helpful message
7. ✅ **Verify**: Loading state clears after timeout

## Notes

### Schema Design Decisions

**1:1 Relationship (Widget Config : Gist Config)**
- Current design assumes one widget configuration per gist configuration
- This matches the most common use case: one widget per content source
- Schema supports future 1:many if needed (multiple widget styles per content source)
- Index on `gistConfigurationId` enables efficient queries both ways

**Denormalized Widget Type**
- `widgetType` stored in `widgetConfigurations` even though it's in preview schema
- Enables querying all configs of specific type without joins
- Slight duplication but significant query performance improvement
- Consider adding validation: widget type should match gist config if applicable

**Optional Fields Philosophy**
- All appearance fields are optional for maximum flexibility
- Missing fields fall back to widget type defaults
- Partial updates preserve unspecified fields
- Enables gradual configuration building

### Migration Strategy

**No Breaking Changes**
- Existing preview flow continues to work without modifications
- `convertPreviewToUserConfig` gracefully handles missing widget data
- Users with existing gist configs can retroactively create widget configs
- No data migration needed for existing users

**Backward Compatibility**
- Dashboard configure widget page should handle:
  - Gist configs without widget configs (show defaults)
  - Preview configs without widget type (content-only preview)
  - Missing optional configuration fields (graceful defaults)

### Future Enhancements

**Widget Configuration Templates**
- Pre-built widget configuration templates users can apply
- Gallery of widget styles with one-click configuration
- Export/import widget configurations as JSON

**Multi-Widget Support**
- Allow multiple widget configurations per gist configuration
- Use case: different widget styles for mobile vs desktop
- A/B testing widget configurations

**Widget Configuration Versioning**
- Track widget config changes over time
- Rollback to previous configurations
- Audit trail for configuration changes

**Widget Preview in Dashboard**
- Live preview of widget as user configures it
- Reuse `PreviewWidgetRenderer` component
- Similar to `/preview/demo` but in dashboard

### Performance Considerations

**Query Optimization**
- Indexes on `userId` and `gistConfigurationId` enable fast lookups
- Consider adding compound index `["userId", "widgetType"]` for filtered queries
- Widget configs are small (< 2KB), pagination not needed initially

**Caching Strategy**
- Convex automatically caches query results
- Consider adding React Query for client-side caching if needed
- Widget config changes are infrequent, aggressive caching is safe

### Security Considerations

**Authorization**
- All mutations validate user ownership via `ctx.auth.getUserIdentity()`
- Widget configs can only be read/updated/deleted by owning user
- Admin access patterns: add admin override in queries if needed

**Data Validation**
- Schema enforces strong typing for enums and required fields
- Color hex codes validated with regex in form (client-side)
- Dimension ranges validated in form (300-800px)
- Consider adding server-side validation in mutations for security

### Dependencies

**No New Package Dependencies Required**
- shadcn/ui components added via CLI (copied to codebase)
- Convex schema changes are configuration, not dependencies
- All TypeScript types are generated by Convex

**shadcn/ui Components Added**
- `toast` - User feedback system
- `switch` - Boolean toggle controls

These components follow the shadcn/ui philosophy: copied into codebase, fully customizable, no external dependencies beyond Radix UI primitives (already installed).
