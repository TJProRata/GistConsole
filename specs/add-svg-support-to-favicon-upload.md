# Chore: Add SVG Support to Favicon Upload

## Chore Description
Currently, the favicon upload functionality only accepts PNG and JPG files. This chore extends the file type validation to also accept SVG files (image/svg+xml). SVG is a common and recommended format for favicons due to its scalability and small file size.

Changes needed:
1. Update file type validation to include SVG (image/svg+xml)
2. Update the file input accept attribute to include SVG
3. Update user-facing text to reflect SVG support
4. Ensure SVG files work with existing preview functionality

## Relevant Files
Use these files to resolve the chore:

**Frontend:**
- `app/dashboard/page.tsx` - Main dashboard form component containing favicon upload logic
  - Line 109: `validTypes` array needs to include "image/svg+xml"
  - Line 111: Error message needs to update from "PNG or JPG" to "PNG, JPG, or SVG"
  - Line 411: File input `accept` attribute needs to include "image/svg+xml"
  - Line 436: UI help text needs to update from "(PNG or JPG, max 100KB)" to "(PNG, JPG, or SVG, max 100KB)"

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update File Type Validation
Modify `app/dashboard/page.tsx` in the `handleFaviconChange` function:
- Add "image/svg+xml" to the `validTypes` array (line 109)
- Update error message from "Please upload a PNG or JPG file" to "Please upload a PNG, JPG, or SVG file" (line 111)
- Maintain existing file size validation (100KB max applies to all formats)

### Step 2: Update File Input Accept Attribute
Modify `app/dashboard/page.tsx`:
- Update the hidden file input's `accept` attribute (line 411)
- Change from `accept="image/png,image/jpeg"` to `accept="image/png,image/jpeg,image/svg+xml"`
- This enables proper file picker filtering for SVG files

### Step 3: Update User-Facing Text
Modify `app/dashboard/page.tsx`:
- Update help text in the upload area (line 436)
- Change from "(PNG or JPG, max 100KB)" to "(PNG, JPG, or SVG, max 100KB)"
- Update description text (line 402-405) if needed to mention SVG support explicitly
- No changes needed to preview functionality (SVG works with object URLs and img tags)

### Step 4: Run Validation Commands
Execute validation commands to ensure the chore is complete with zero regressions:
- Build the Next.js app to catch TypeScript errors
- Verify no compilation issues
- Manually test SVG upload in dev environment

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and manually validate:
  - Navigate to `/dashboard`
  - Click favicon upload area
  - File picker should show SVG files as selectable
  - Select valid SVG file (<100KB) - should show preview
  - Select SVG file (>100KB) - should show size error
  - Select valid PNG file - should still work (regression test)
  - Select valid JPG file - should still work (regression test)
  - Submit form with SVG favicon - should upload and save
  - Verify storage in Convex dashboard

## Notes
- **SVG MIME Type**: Standard MIME type is `image/svg+xml` (not `image/svg`)
- **Preview Compatibility**: SVG files work natively with `URL.createObjectURL()` and `<img>` tags, no special handling needed
- **File Size**: 100KB limit still applies to SVG files (most SVG favicons are <10KB)
- **Security**: SVG files are stored as-is in Convex storage. No sanitization needed for storage, but consider sanitization if rendering SVG inline (current implementation uses img tag which is safe)
- **Browser Support**: All modern browsers support SVG favicons
- **No Backend Changes**: Convex file storage handles SVG files identically to PNG/JPG (binary blob storage)
- **Backward Compatibility**: Existing PNG/JPG uploads continue to work unchanged
