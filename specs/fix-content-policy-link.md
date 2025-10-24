# Bug: Content Policy Link Not Opening

## Bug Description
The "Content Policy" link in the dashboard page (`app/dashboard/page.tsx`) does not navigate anywhere when clicked. The link appears as clickable text with proper styling (blue underline, hover effects) but clicking it has no effect. Users expect to be taken to the content policy documentation.

**Expected behavior:** Clicking "Content Policy" opens https://platform.gist.ai/docs/content-policy-for-gist-answers in a new tab
**Actual behavior:** Clicking "Content Policy" does nothing (the link just has `href="#"`)

## Problem Statement
The Content Policy link at line 186-189 in `app/dashboard/page.tsx` is a non-functional anchor tag (`<a href="#">`) that doesn't navigate to the actual content policy documentation at https://platform.gist.ai/docs/content-policy-for-gist-answers.

## Solution Statement
Update the anchor tag's `href` attribute to point to the correct URL (https://platform.gist.ai/docs/content-policy-for-gist-answers) and add proper attributes for opening in a new tab (`target="_blank"` and `rel="noopener noreferrer"` for security).

## Steps to Reproduce
1. Navigate to http://localhost:3000/dashboard (requires authentication)
2. Scroll to the "Choose your method" section
3. Click the "Content Policy" link in the description text
4. Observe that nothing happens - no navigation occurs

## Root Cause Analysis
The root cause is that the Content Policy link was implemented with a placeholder href:

```tsx
// app/dashboard/page.tsx:186-189
<a
  href="#"
  className="text-blue-600 underline hover:text-blue-800"
>
  Content Policy
</a>
```

This is just a static link with `href="#"` instead of the actual content policy URL.

## Relevant Files
Use these files to fix the bug:

- **`app/dashboard/page.tsx`** (lines 186-189) - Contains the non-functional Content Policy anchor tag that needs its href updated

## Step by Step Tasks

### Step 1: Update Content Policy Link
- Locate the Content Policy anchor tag in `app/dashboard/page.tsx` (lines 186-189)
- Change `href="#"` to `href="https://platform.gist.ai/docs/content-policy-for-gist-answers"`
- Add `target="_blank"` attribute to open in a new tab
- Add `rel="noopener noreferrer"` for security best practices (prevents the new page from accessing window.opener)
- Maintain existing className styling (`text-blue-600 underline hover:text-blue-800`)

### Step 2: Test the Implementation
- Start the development server (`bun dev`)
- Navigate to the dashboard and click the Content Policy link
- Verify it opens https://platform.gist.ai/docs/content-policy-for-gist-answers in a new tab
- Verify the link styling remains unchanged
- Verify form submission still works (Submit button)

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and manually test:
  1. Navigate to http://localhost:3000/dashboard
  2. Click "Content Policy" link - verify it opens https://platform.gist.ai/docs/content-policy-for-gist-answers in a new tab
  3. Verify link styling matches existing pattern
  4. Verify form submission still works (Submit button)
  5. Verify no console errors

## Notes
- Use `target="_blank"` to open in a new tab so users don't lose their form progress
- Use `rel="noopener noreferrer"` for security - prevents the new page from accessing window.opener and avoids leaking referrer information
- No new components or dependencies are needed - this is a simple attribute change
- The existing styling (`text-blue-600 underline hover:text-blue-800`) should be preserved
