# Feature: Dashboard Configuration Data Persistence

## Feature Description
Implement full data persistence for the Gist Console dashboard configuration form. Currently, the dashboard form captures publication settings, ingestion methods, RSS feeds, and terms acceptance, but lacks the ability to load existing configurations when users return to the dashboard. This feature will enable users to view their previously saved configuration, edit it seamlessly, and maintain a complete configuration lifecycle (create, read, update).

## User Story
As a **Gist Console user**
I want to **see my previously saved configuration when I visit the dashboard**
So that **I can review, update, or verify my settings without having to re-enter everything from scratch**

## Problem Statement
The current implementation only supports creating and saving new configurations (via `saveConfiguration` mutation), but does not load existing configurations when users navigate to the dashboard. This creates a poor user experience where:

1. Users cannot see what settings they previously configured
2. Every dashboard visit appears as a blank form, requiring re-entry of all data
3. Users have no way to verify their current configuration status
4. Updates to existing configurations are not intuitive (form appears empty even when configuration exists)
5. No visual indication of whether a configuration has been saved or not

## Solution Statement
Implement a complete read-update workflow by:

1. **Loading existing configurations on page load** using the existing `getUserConfiguration` query from `convex/gistConfigurations.ts`
2. **Pre-populating form fields** with saved data when configuration exists
3. **Displaying appropriate UI states** (new configuration vs. editing existing)
4. **Handling edge cases** like favicon upload fields and RSS feeds array
5. **Providing visual feedback** to indicate saved vs. unsaved state

The solution will leverage the existing Convex backend structure (schema and queries already in place) and focus entirely on the frontend data-loading implementation.

## Relevant Files

### Existing Files to Modify

- **`app/dashboard/page.tsx`** (lines 1-383)
  - Current dashboard page with form implementation
  - Already has `saveConfiguration` mutation integrated
  - Needs to add `getUserConfiguration` query
  - Needs to pre-populate form with loaded data
  - Needs loading state handling

- **`convex/gistConfigurations.ts`** (lines 1-92)
  - Contains `getUserConfiguration` query (lines 5-19) - already implemented ✅
  - Contains `saveConfiguration` mutation (lines 22-91) - already implemented ✅
  - No changes needed - backend is ready

- **`convex/schema.ts`** (lines 17-41)
  - Defines `gistConfigurations` table schema
  - Includes all necessary fields (publicationName, category, ingestionMethod, etc.)
  - No changes needed - schema is complete

- **`components/RssFeedsModal.tsx`** (lines 1-371)
  - Manages RSS feeds in modal dialog
  - Already accepts initial `rssFeeds` prop
  - No changes needed - compatible with loaded data

### New Files
None required - all necessary backend infrastructure exists.

## shadcn/ui Components

### Existing Components to Use
- **button** (`components/ui/button.tsx`) - Already in use for form submission
- **form** (`components/ui/form.tsx`) - Already in use for form structure
- **input** (`components/ui/input.tsx`) - Already in use for text inputs
- **label** (`components/ui/label.tsx`) - Already in use for form labels
- **select** (`components/ui/select.tsx`) - Already in use for category dropdown
- **radio-group** (`components/ui/radio-group.tsx`) - Already in use for ingestion method
- **checkbox** (`components/ui/checkbox.tsx`) - Already in use for terms acceptance
- **card** (`components/ui/card.tsx`) - Could be used for displaying saved configuration status

### New Components to Add
```bash
# Add skeleton component for loading states
npx shadcn@latest add skeleton

# Add badge component for status indicators
npx shadcn@latest add badge

# Add alert component for error/success messages
npx shadcn@latest add alert
```

### Custom Components to Create
None needed - existing shadcn/ui components provide all required functionality.

## Implementation Plan

### Phase 1: Foundation
Set up data loading infrastructure and state management for existing configurations.

**Tasks:**
- Import `getUserConfiguration` query from Convex API
- Add `useQuery` hook to fetch user's configuration on component mount
- Implement loading state UI (skeleton loaders while data fetches)
- Add error handling for query failures

### Phase 2: Core Implementation
Populate form fields with loaded configuration data and handle update workflow.

**Tasks:**
- Extract configuration data from query result
- Pre-populate `react-hook-form` default values with loaded data
- Handle optional fields (wordpressUrl, rssFeeds, faviconUrl)
- Update RSS feeds modal to receive initial feeds from loaded config
- Implement conditional rendering for "new" vs "editing" states
- Add visual indicators (badge/alert) showing configuration status

### Phase 3: Integration
Integrate loading workflow with existing save functionality and edge cases.

**Tasks:**
- Test full create-read-update workflow
- Verify form reset behavior after successful save
- Test edge cases (no configuration, partial data, switching ingestion methods)
- Add proper TypeScript typing for configuration data
- Ensure favicon upload placeholder handles existing favicon URLs
- Verify terms acceptance checkbox behavior with loaded data

## Step by Step Tasks

### Step 1: Add Required shadcn/ui Components
- Run `npx shadcn@latest add skeleton` to add loading skeleton component
- Run `npx shadcn@latest add badge` to add status badge component
- Run `npx shadcn@latest add alert` to add alert notification component
- Verify components are installed in `components/ui/` directory

### Step 2: Set Up Data Loading Infrastructure
- Import `useQuery` from `convex/react` at top of `app/dashboard/page.tsx`
- Import `api.gistConfigurations.getUserConfiguration` from Convex API
- Add `useQuery` hook call to fetch user's configuration on component mount
- Add TypeScript type for loaded configuration data matching Convex schema
- Import `Skeleton` component from `@/components/ui/skeleton` for loading states

### Step 3: Implement Loading State UI
- Add conditional rendering for loading state when `configuration === undefined`
- Create skeleton placeholders matching form layout (publication name, category, method, etc.)
- Position skeleton loaders to match actual form field positions
- Add loading indicator for form section while data fetches

### Step 4: Pre-populate Form with Loaded Data
- Update `form.useForm()` default values to use loaded configuration data
- Map configuration fields to form fields (publicationName → publicationName, etc.)
- Handle optional fields with fallback values (wordpressUrl || "", rssFeeds || [])
- Use `form.reset()` to update form when configuration loads (useEffect with dependency on configuration)
- Ensure ingestionMethod pre-selection matches loaded data ("wordpress" or "rss")

### Step 5: Handle RSS Feeds Pre-population
- Update initial `rssFeeds` state to use loaded configuration data
- Pass loaded RSS feeds array to `RssFeedsModal` component via props
- Verify RSS feeds modal correctly displays pre-loaded feeds
- Test adding new feeds to existing loaded feeds array
- Ensure RSS feeds persist correctly when switching between ingestion methods

### Step 6: Add Configuration Status Indicators
- Import `Badge` component from `@/components/ui/badge`
- Add conditional badge display showing "New Configuration" or "Last Updated: {date}"
- Display badge near page title with appropriate variant (outline for new, default for existing)
- Format `updatedAt` timestamp to human-readable date (use `new Date(config.updatedAt).toLocaleDateString()`)
- Add optional "Configuration Saved" success alert after successful save using `Alert` component

### Step 7: Handle Edge Cases and Error States
- Add error handling for failed query (display error alert with retry button)
- Handle case where configuration exists but has partial/missing data
- Test behavior when user switches from WordPress to RSS and vice versa with existing data
- Verify terms acceptance checkbox correctly reflects saved `termsAccepted` value
- Add placeholder handling for favicon field (display existing favicon URL if present)

### Step 8: Add TypeScript Types and Validation
- Create type alias for loaded configuration matching Convex schema
- Add proper typing for `getUserConfiguration` query result
- Ensure form values type matches both new and loaded configuration structures
- Add type guards for optional configuration fields
- Verify TypeScript compilation with `bun run build`

### Step 9: Test Full CRUD Workflow
- Test creating new configuration from blank form
- Test loading existing configuration and verifying all fields populate correctly
- Test updating existing configuration and verifying changes persist
- Test switching ingestion methods with existing configuration
- Test RSS feeds array persistence across updates
- Test terms acceptance persistence and display

### Step 10: Run Validation Commands
- Run `bun run build` to validate no TypeScript or build errors
- Start `npx convex dev` to deploy schema and functions (background)
- Start `bun dev` and manually test complete workflow:
  - Create new configuration and save
  - Refresh page and verify configuration loads correctly
  - Edit configuration and save updates
  - Verify updates persist on page refresh
  - Test all ingestion methods and edge cases
  - Verify success/error messages display appropriately

## Testing Strategy

### Unit Tests
- Test form pre-population logic with mocked configuration data
- Test default value handling for optional fields (wordpressUrl, rssFeeds, faviconUrl)
- Test RSS feeds array transformation from Convex schema to component state
- Test date formatting for "Last Updated" badge display
- Test form reset behavior when configuration loads

### Integration Tests
- Test full page load → query → form population flow
- Test query loading states and error states
- Test mutation success triggering form refresh
- Test RSS feeds modal integration with loaded data
- Test ingestion method switching with pre-loaded data

### Edge Cases
- **No existing configuration**: Form displays blank with "New Configuration" badge
- **Partial configuration data**: Missing optional fields display as empty, form remains valid
- **Query error**: Error alert displays with retry button, form remains usable
- **Switching ingestion methods**: Form correctly clears/shows relevant fields based on loaded method
- **RSS feeds with authentication**: Username/password fields correctly pre-populate in modal
- **Custom headers in RSS feeds**: Custom headers object correctly maps to modal inputs
- **Terms already accepted**: Checkbox displays as checked, terms acceptance date shows
- **Favicon URL exists**: Display existing favicon URL in placeholder or preview area
- **Very long publication names**: Input handles overflow gracefully
- **Multiple rapid saves**: Form handles sequential saves without state corruption

## Acceptance Criteria

1. ✅ When a user with an existing configuration visits the dashboard, all form fields pre-populate with their saved data
2. ✅ When a user with no configuration visits the dashboard, the form displays as blank with a "New Configuration" indicator
3. ✅ Loading states display appropriate skeleton loaders while configuration data fetches
4. ✅ Error states display helpful error messages with retry options if query fails
5. ✅ RSS feeds array correctly loads into modal when user clicks "Add more RSS URLs"
6. ✅ Status badge displays "New Configuration" or "Last Updated: {date}" based on configuration state
7. ✅ Ingestion method (WordPress/RSS) correctly pre-selects based on loaded configuration
8. ✅ Category dropdown correctly pre-selects the saved category value
9. ✅ Terms and conditions checkbox reflects saved acceptance state
10. ✅ Favicon field displays existing favicon URL if present in configuration
11. ✅ Updating an existing configuration successfully saves changes and refreshes display
12. ✅ Switching between ingestion methods preserves appropriate data (clears irrelevant fields)
13. ✅ Success message displays after successful save and configuration reloads
14. ✅ Form validation works identically for new and existing configurations
15. ✅ TypeScript compilation succeeds with no type errors related to configuration loading

## Validation Commands

Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background, verify deployment succeeds)
- `bun dev` - Start the Next.js dev server and manually test the feature end-to-end:
  - Navigate to dashboard as authenticated user
  - Verify blank form displays for new user with "New Configuration" badge
  - Fill out and save configuration
  - Refresh page and verify configuration loads correctly with all fields populated
  - Edit configuration (change publication name, category, add RSS feed)
  - Save changes and verify updates persist
  - Verify "Last Updated" badge displays correct date
  - Test switching between WordPress and RSS ingestion methods
  - Test loading state by throttling network in DevTools
  - Test error state by temporarily disconnecting from Convex
  - Verify all form validations still work correctly
  - Verify success/error messages display appropriately

## Notes

### Backend Status
The Convex backend is **already complete** and requires no changes:
- ✅ `gistConfigurations` table exists in schema with all required fields
- ✅ `getUserConfiguration` query exists and returns user's configuration
- ✅ `saveConfiguration` mutation handles both create and update operations
- ✅ Authentication via Clerk is already integrated

### Frontend Implementation Focus
This feature is **purely a frontend data-loading enhancement**. The implementation focuses on:
- Using existing `getUserConfiguration` query
- Pre-populating react-hook-form with loaded data
- Handling loading and error states gracefully
- Improving UX with status indicators

### Favicon Handling
The favicon upload functionality is currently a placeholder (static UI, no file upload logic). This feature will:
- Display existing favicon URL if present in configuration
- Maintain the placeholder UI for future file upload implementation
- Not implement actual file upload (out of scope for this feature)

### Future Enhancements
After this feature, consider:
- Implementing actual favicon file upload using Convex file storage
- Adding configuration history/versioning
- Adding configuration validation feedback (test WordPress URL, validate RSS feeds)
- Adding configuration duplication/templates for multi-publication setups
- Adding delete configuration functionality with confirmation dialog

### React 19.2 Patterns
This implementation follows React 19.2 best practices:
- Uses `useQuery` hook for reactive data fetching from Convex
- Implements proper loading states (component returns loading UI when `data === undefined`)
- Uses form state management with react-hook-form and zod validation
- Follows controlled component patterns for all form inputs
- Uses `useEffect` for form reset when configuration loads (dependency on query result)

### Performance Considerations
- Query is cached by Convex and automatically updates on mutations
- Form only re-renders when configuration data changes (reactive query)
- Skeleton loaders prevent layout shift during data loading
- No unnecessary re-renders (form values controlled by react-hook-form)
