# Chore: Implement Favicon Upload Functionality

## Chore Description
The favicon upload section in `app/dashboard/page.tsx` (lines 300-320) is currently non-functional UI only. Users need the ability to upload PNG or JPG files (max 100KB, recommended 160x160px) and store them in Convex database using Convex File Storage. The uploaded favicon should be associated with the user's Gist configuration and retrievable for display.

This involves:
1. Creating Convex mutations for generating upload URLs and saving file metadata
2. Implementing client-side file upload logic with validation
3. Updating the dashboard form to handle file uploads
4. Storing the storage ID in the `gistConfigurations` table
5. Optional: Displaying uploaded favicon preview

## Relevant Files
Use these files to resolve the chore:

**Backend (Convex):**
- `convex/gistConfigurations.ts` - Contains `saveConfiguration` mutation that needs to accept `faviconStorageId` parameter. Already has `faviconUrl` field but needs to store storage ID instead.
- `convex/schema.ts` - Schema defines `faviconUrl` as optional string in `gistConfigurations` table. Need to understand if we should replace with `faviconStorageId` or add both.

**Frontend:**
- `app/dashboard/page.tsx` (lines 66-383) - Main form component with non-functional favicon upload UI. Needs file input, upload handler, and integration with form state.
- `components/ui/input.tsx` - Existing shadcn/ui Input component that may need file input variant or can be used as-is with `type="file"`.
- `components/ui/button.tsx` - Used for upload triggers and form actions.
- `components/ui/label.tsx` - Used for form field labels.

**Documentation:**
- `ai_docs/convex/convex_filestorage.md` - Reference for Convex file storage patterns (Method 1: Client Upload pattern).

### New Files
- `convex/files.ts` - New file containing mutations for file upload workflow:
  - `generateUploadUrl` mutation - Returns upload URL for client
  - `saveFavicon` mutation (optional) - Saves storage ID to configuration (or integrate into existing `saveConfiguration`)

## Step by Step Tasks

### Step 1: Create Convex File Upload Mutations
Create `convex/files.ts` with mutations for handling file uploads:
- `generateUploadUrl()` mutation - Generates and returns upload URL (expires in 1 hour)
- Follow Pattern 1: Client Direct Upload from `ai_docs/convex/convex_filestorage.md`
- Use proper TypeScript types: `Id<"_storage">` for storage IDs
- Import required dependencies: `mutation` from `./_generated/server`, `v` from `convex/values`

### Step 2: Update Convex Schema for Favicon Storage ID
Modify `convex/schema.ts`:
- Add `faviconStorageId` field to `gistConfigurations` table as `v.optional(v.id("_storage"))`
- Keep existing `faviconUrl` field for backward compatibility (will store pre-signed URL)
- Ensure proper indexing remains on `by_user_id`

### Step 3: Update saveConfiguration Mutation
Modify `convex/gistConfigurations.ts`:
- Add `faviconStorageId` to mutation args: `faviconStorageId: v.optional(v.id("_storage"))`
- Update both insert and patch operations to save `faviconStorageId`
- Generate and save `faviconUrl` using `ctx.storage.getUrl(faviconStorageId)` when storage ID is provided
- Handle case where `faviconStorageId` is undefined (no upload)

### Step 4: Implement Client-Side File Upload Logic
Modify `app/dashboard/page.tsx`:
- Add state: `const [faviconFile, setFaviconFile] = useState<File | null>(null)`
- Add state: `const [faviconPreview, setFaviconPreview] = useState<string | null>(null)`
- Add state: `const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)`
- Import `useMutation(api.files.generateUploadUrl)` for upload URL generation
- Create `handleFaviconChange` function:
  - Validate file type (PNG or JPG only)
  - Validate file size (max 100KB = 102400 bytes)
  - Generate preview using `URL.createObjectURL(file)`
  - Store file in state
  - Show error messages for invalid files
- Create `uploadFavicon` async function (called before form submit):
  - Generate upload URL via mutation
  - Upload file using fetch POST with `Content-Type` header
  - Extract `storageId` from response JSON
  - Return storage ID for form submission

### Step 5: Update Form UI with File Input
Modify `app/dashboard/page.tsx` favicon section (lines 300-320):
- Replace static non-functional UI with functional file input
- Use hidden `<input type="file" accept="image/png,image/jpeg" />` with ref
- Add click handler to button to trigger file input
- Display file name when file selected
- Show image preview when file selected (using `faviconPreview` state)
- Show upload progress state when `isUploadingFavicon` is true
- Add error message display for validation failures
- Maintain existing design: dashed border, Plus icon, drag-drop text styling
- Use existing shadcn/ui components: Button, Label (no new components needed)

### Step 6: Integrate Upload with Form Submission
Modify `app/dashboard/page.tsx` `onSubmit` handler:
- Before calling `saveConfiguration`, check if `faviconFile` exists
- If exists, call `uploadFavicon()` to get storage ID
- Pass `faviconStorageId` to `saveConfiguration` mutation
- Handle upload errors gracefully (show error, don't submit form)
- Clear file states after successful submission
- Maintain existing form validation and error handling

### Step 7: Run Validation Commands
Execute validation commands to ensure chore is complete with zero regressions:
- Deploy Convex schema changes and verify migrations
- Build Next.js app to catch TypeScript errors
- Start dev server and manually test:
  - File selection (valid PNG/JPG)
  - File validation (size limit, file type)
  - Upload progress indication
  - Form submission with favicon
  - Preview display
  - Error states
- Verify database storage in Convex dashboard

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `npx convex dev` - Deploy Convex schema and functions (run in background, verify no errors)
- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and manually validate:
  - Navigate to `/dashboard`
  - Click favicon upload area or browse button
  - Select valid PNG file (<100KB) - should show preview
  - Select invalid file (>100KB or wrong type) - should show error
  - Select valid file and submit form - should upload and save
  - Verify storage ID saved in Convex dashboard → `gistConfigurations` table
  - Verify file appears in Convex dashboard → File Storage
  - Test form submission without favicon - should work normally

## Notes
- **File Size Limit**: 100KB = 102400 bytes for validation check
- **File Types**: PNG (`image/png`) and JPG (`image/jpeg`, `image/jpg`) only
- **Upload Pattern**: Use Method 1 (Client Upload) from Convex file storage docs - two-step process (generate URL → upload → save ID)
- **Storage ID Type**: Use `Id<"_storage">` TypeScript type from `convex/_generated/dataModel`
- **URL Expiration**: Upload URLs expire in 1 hour - generate immediately before upload
- **Preview Cleanup**: Remember to revoke object URLs with `URL.revokeObjectURL()` to prevent memory leaks
- **Error Handling**: Display user-friendly error messages for:
  - File too large (>100KB)
  - Invalid file type (not PNG/JPG)
  - Upload failures (network issues)
  - Storage errors
- **UX Enhancements**: Consider adding:
  - Remove/clear uploaded file button
  - Drag-and-drop support (optional, current UI suggests it)
  - Image dimension validation (recommended 160x160px)
  - Compression suggestions for oversized files
- **Backward Compatibility**: Keep `faviconUrl` field populated with pre-signed URL for potential future use (e.g., displaying favicon without extra query)
