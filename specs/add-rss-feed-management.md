# Chore: Add RSS Feed Management with Modal Dialog

## Chore Description
Add comprehensive RSS feed management functionality to the dashboard when users select "Connect RSS Feed" as their ingestion method. This includes:

1. **Main Form Section** (when RSS is selected):
   - Description text: "You can just enter the URL for your RSS feed. Gist will crawl the pages for AI Generated search."
   - Single RSS URL input field with placeholder "e.g., https://yourwebsite.com/rss"
   - "Add more RSS URLs" button to open modal

2. **Modal Dialog** ("Manage RSS Feeds"):
   - Opens when "Add more RSS URLs" button is clicked
   - Contains form with multiple fields:
     - **Add New RSS Feed** section with URL input
     - **Username** field (optional, for protected feeds)
     - **Password** field (optional, for protected feeds)
     - **Count Start** field (optional, for rate limiting)
     - **Count Increment** field (optional, for rate limiting)
     - **Custom Key-Value Pair** (3 pairs: Key 1/Value 1, Key 2/Value 2, Key 3/Value 3) for HTTP headers
   - "Add RSS Feed" button to add feed to list
   - **RSS Feeds (N)** list showing all added feeds with edit icons
   - "Cancel" and "Save" buttons

## Relevant Files
Use these files to resolve the chore:

- **app/dashboard/page.tsx** (333 lines)
  - Main dashboard with form implementation
  - Currently has conditional WordPress URL field
  - Need to add conditional RSS section with input and button
  - Need to integrate RSS feeds modal

- **convex/schema.ts** (29 lines)
  - Database schema definition
  - Need to update `gistConfigurations` table to support multiple RSS feeds
  - Need to add fields for RSS feed credentials and custom headers

- **convex/gistConfigurations.ts** (77 lines)
  - Mutations and queries for configurations
  - Need to update to handle RSS feeds array

- **components/ui/dialog.tsx** (122 lines)
  - Existing dialog component from shadcn/ui
  - Will be used for RSS feeds modal

- **components/ui/input.tsx** (23 lines)
  - Existing input component
  - Will be used for all form fields in modal

- **components/ui/button.tsx** (57 lines)
  - Existing button component
  - Will be used for "Add more RSS URLs", "Add RSS Feed", "Cancel", "Save" buttons

### New Files

- **components/RssFeedsModal.tsx**
  - New component for "Manage RSS Feeds" modal dialog
  - Contains form for adding RSS feeds with all fields
  - Manages list of RSS feeds
  - Handles add/edit/delete operations

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Convex Schema for RSS Feeds
- Open `convex/schema.ts`
- Update `gistConfigurations` table to include:
  - `rssFeeds` - array of objects containing:
    - `url` (string) - RSS feed URL
    - `username` (optional string) - for protected feeds
    - `password` (optional string) - for protected feeds
    - `countStart` (optional number) - initial counter value
    - `countIncrement` (optional number) - counter increment value
    - `customHeaders` (optional object) - key-value pairs for HTTP headers
  - Replace `wordpressUrl` optional field with this new structure
- Save file
- Schema will auto-deploy when Convex dev is running

### Step 2: Update Convex Mutations for RSS Feeds
- Open `convex/gistConfigurations.ts`
- Update `saveConfiguration` mutation args to accept:
  - `rssFeeds` as optional array of feed objects
- Update mutation handler to save RSS feeds array
- Update `getUserConfiguration` query to return RSS feeds
- Save file

### Step 3: Create RssFeedsModal Component
- Create `components/RssFeedsModal.tsx`
- Import Dialog components, Input, Button, Label
- Create state for:
  - `rssFeeds` array (list of added feeds)
  - `newFeed` object (current form values: url, username, password, countStart, countIncrement, key1, value1, key2, value2, key3, value3)
  - `editingIndex` (for editing existing feeds)
- Implement form fields:
  - Add New RSS Feed URL input
  - Username input (optional)
  - Password input (optional, type="password")
  - Count Start input (optional, type="number")
  - Count Increment input (optional, type="number")
  - 3 sets of Key/Value inputs for custom headers
- Implement "Add RSS Feed" button handler:
  - Validate URL is not empty
  - Add feed to `rssFeeds` array
  - Clear form fields
  - Show feed in "RSS Feeds (N)" list
- Implement feed list display:
  - Show all feeds with edit icons
  - Click edit icon to populate form with feed data
  - Allow editing and re-saving
- Implement "Save" button:
  - Call onSave callback with rssFeeds array
  - Close modal
- Implement "Cancel" button:
  - Close modal without saving
- Follow shadcn/ui patterns with proper TypeScript types

### Step 4: Update Dashboard Form Schema for RSS
- Open `app/dashboard/page.tsx`
- Update `formSchema` Zod object:
  - Remove `wordpressUrl` field
  - Add `wordpressUrl` as optional (keep for WordPress method)
  - Add `rssUrl` field (optional string with URL validation) for primary RSS URL
- Update `FormValues` type inference

### Step 5: Add RSS Input Section to Dashboard
- In `app/dashboard/page.tsx`, after the ingestion method radio group
- Add conditional rendering: `{watchIngestionMethod === "rss" && ...}`
- Inside conditional, add:
  - FormDescription with text: "You can just enter the URL for your RSS feed. Gist will crawl the pages for AI Generated search."
  - FormField for `rssUrl` with Input component
  - Placeholder: "e.g., https://yourwebsite.com/rss"
  - URL validation error messages
- Below the input, add "Add more RSS URLs" button
  - Use Button component with variant="outline"
  - onClick handler opens RssFeedsModal

### Step 6: Integrate RssFeedsModal in Dashboard
- Import `RssFeedsModal` component in dashboard
- Add state for `showRssModal` boolean
- Add state for `rssFeeds` array
- Add RssFeedsModal component:
  - Pass `open={showRssModal}`
  - Pass `onOpenChange={setShowRssModal}`
  - Pass `rssFeeds={rssFeeds}`
  - Pass `onSave={(feeds) => { setRssFeeds(feeds); setShowRssModal(false); }}`
- Update form submission to include RSS feeds array

### Step 7: Update Form Submission Logic
- In `onSubmit` handler, update `saveConfiguration` mutation call
- Pass `rssFeeds` array when ingestion method is "rss"
- Pass `wordpressUrl` when ingestion method is "wordpress"
- Handle success/error states appropriately

### Step 8: Add Form Default Values for RSS
- In `useForm` hook, update `defaultValues`:
  - Add `rssUrl: ""`
- Initialize `rssFeeds` state as empty array `[]`

### Step 9: Test and Validate
- Run `bun run build` to check for TypeScript errors
- Start `npx convex dev` to deploy schema changes
- Start `bun dev` to test in browser
- Test workflow:
  1. Select "Connect RSS Feed" radio option
  2. Verify RSS URL input appears with description text
  3. Enter a test RSS URL
  4. Click "Add more RSS URLs" button
  5. Verify modal opens with "Manage RSS Feeds" title
  6. Fill out form fields (URL, username, password, etc.)
  7. Click "Add RSS Feed" button
  8. Verify feed appears in list
  9. Click edit icon to modify feed
  10. Click "Save" to close modal
  11. Submit main form
  12. Verify data saves to Convex correctly

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

```bash
# Build Next.js app to validate no TypeScript or build errors
bun run build

# Deploy Convex schema and functions (run in background)
npx convex dev

# Start Next.js dev server and manually test the feature end-to-end
bun dev

# Manual testing checklist:
# 1. Navigate to /dashboard
# 2. Select "Connect RSS Feed" ingestion method
# 3. Verify RSS description text appears
# 4. Verify RSS URL input field appears with correct placeholder
# 5. Enter test RSS URL (e.g., https://example.com/rss)
# 6. Click "Add more RSS URLs" button
# 7. Verify modal opens with correct title "Manage RSS Feeds"
# 8. Verify all form fields are present:
#    - Add New RSS Feed URL input
#    - Username input
#    - Password input
#    - Count Start input
#    - Count Increment input
#    - Key 1/Value 1, Key 2/Value 2, Key 3/Value 3 inputs
# 9. Fill in RSS feed URL
# 10. Optionally fill in username/password for protected feed
# 11. Optionally fill in custom headers
# 12. Click "Add RSS Feed" button
# 13. Verify feed appears in "RSS Feeds (1)" list below
# 14. Click edit icon on feed
# 15. Verify form populates with feed data
# 16. Modify and click "Add RSS Feed" again
# 17. Verify feed updates in list
# 18. Add another RSS feed
# 19. Verify list shows "RSS Feeds (2)"
# 20. Click "Cancel" and verify modal closes without saving
# 21. Re-open modal and verify feeds are still there
# 22. Click "Save" and verify modal closes
# 23. Fill out remaining form fields (publication, category, terms)
# 24. Submit main form
# 25. Verify success message
# 26. Check Convex dashboard to confirm RSS feeds array saved correctly
# 27. Refresh page and verify RSS feeds persist
# 28. Switch to WordPress method and verify WordPress URL field shows
# 29. Switch back to RSS and verify RSS fields show again
```

## Notes

### Design Considerations
1. **RSS Feeds Array Structure**:
   ```typescript
   interface RssFeed {
     url: string;
     username?: string;
     password?: string;
     countStart?: number;
     countIncrement?: number;
     customHeaders?: Record<string, string>; // key-value pairs
   }
   ```

2. **Modal Behavior**:
   - Modal opens when "Add more RSS URLs" is clicked
   - Primary RSS URL from main form can be pre-populated as first feed in modal
   - Modal maintains its own state until "Save" is clicked
   - "Cancel" discards changes
   - "Save" commits changes to parent component

3. **Form Validation**:
   - RSS URL is required in main form
   - Additional RSS URLs in modal must be valid URLs
   - Username/password are optional (only needed for protected feeds)
   - Count start/increment are optional (for rate limiting)
   - Custom headers are optional (Key 1 requires Value 1, etc.)

4. **Security Considerations**:
   - Passwords will be stored in Convex (consider encryption in future)
   - Custom headers can contain authentication tokens
   - Validate URL format to prevent injection attacks

5. **User Experience**:
   - Primary RSS URL in main form for simple case (single feed)
   - "Add more RSS URLs" button for advanced case (multiple feeds, credentials, headers)
   - Modal provides comprehensive management interface
   - List shows all configured feeds for easy review
   - Edit functionality allows modifications without re-entering all data

### Future Enhancements
- Add RSS feed validation (ping URL to check if valid)
- Add delete button for individual feeds in list
- Add drag-and-drop reordering of feeds
- Add feed preview (show first few items from RSS feed)
- Add bulk import from OPML file
- Add password visibility toggle
- Encrypt passwords before storing in database
- Add feed refresh interval configuration
- Add feed filtering/categorization
