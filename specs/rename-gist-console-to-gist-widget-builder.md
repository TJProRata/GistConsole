# Chore: Rename "Gist Console" to "Gist Widget Builder"

## Chore Description
Replace all references of "Gist Console" with "Gist Widget Builder" throughout the codebase to reflect the updated product branding. This includes:
- UI text in React components
- Documentation files (README, CLAUDE.md, docs/)
- HTML metadata (page titles, descriptions)
- Code comments and references
- Package.json name field

The change affects user-facing text, documentation, and metadata but does not impact:
- Directory names or file paths (repository remains `gist-console`)
- Environment variables
- Database schemas or API endpoints
- Git history

## Relevant Files
Use these files to resolve the chore:

### Documentation Files
- **`README.md`** - Main project documentation with multiple references to "Gist Console" in headers, descriptions, and feature lists
- **`CLAUDE.md`** - Project status document and quick reference guide with "Gist Console" in title and throughout
- **`convex/README.md`** - Convex database schema documentation with references in overview and usage examples
- **`docs/authentication.md`** - Authentication system documentation with references in title and flow descriptions

### User-Facing Components
- **`app/layout.tsx`** - Root layout with metadata (title and description) containing "Gist Console"
- **`app/page.tsx`** - Home page with welcome message showing "Gist Console" to signed-out users
- **`components/Header.tsx`** - Site header displaying "Gist Console" branding in the header bar

### Configuration Files
- **`package.json`** - Package name field set to "gist-console" (will remain unchanged per requirements, but reviewing for consistency)

### Files to Exclude
- Git history files (`.git/logs/**`) - Contains historical references but should not be modified
- Log files (`logs/**/*.json`) - Runtime logs that should not be modified
- Lock files (`bun.lock`) - Auto-generated, should not be manually edited
- Spec files in `specs/` directory (except for new files) - Historical specifications

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Documentation Files
Update all documentation files to use "Gist Widget Builder" instead of "Gist Console":

- **`README.md`**: Replace "Gist Console" with "Gist Widget Builder" in:
  - Line 1: Main heading
  - Line 3: Project description
  - Line 251: Authentication flow section reference
  - Line 303: Admin portal overview section
- **`CLAUDE.md`**: Replace "Gist Console" with "Gist Widget Builder" in:
  - Line 1: Main heading
- **`convex/README.md`**: Replace "Gist Console" with "Gist Widget Builder" in:
  - Line 5: Overview section describing the application
- **`docs/authentication.md`**: Replace "Gist Console" with "Gist Widget Builder" in:
  - Line 3: Document title/overview
  - Line 7: Overview section

### Step 2: Update User-Facing Components
Update React components to display "Gist Widget Builder" to users:

- **`app/layout.tsx`**: Update metadata object (lines 7-10):
  - `title`: Change from "Gist Console" to "Gist Widget Builder"
  - `description`: Change from "Chat widget management console" to "Chat widget management builder"
- **`app/page.tsx`**: Update home page welcome message (line 16):
  - Change `<h1>` text from "Welcome to Gist Console" to "Welcome to Gist Widget Builder"
  - Update description (line 18) from "Chat widget management console" to "Chat widget builder"
- **`components/Header.tsx`**: Update header branding (line 15):
  - Change `<h1>` text from "Gist Console" to "Gist Widget Builder"

### Step 3: Validation Commands
Execute every command to validate the chore is complete with zero regressions.

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and manually validate:
  - Home page displays "Welcome to Gist Widget Builder"
  - Header shows "Gist Widget Builder" branding
  - Browser tab title shows "Gist Widget Builder"
  - Sign in and verify authenticated home page works correctly
- `grep -r "Gist Console" README.md CLAUDE.md app/ components/ convex/README.md docs/authentication.md` - Search for any remaining "Gist Console" references in updated files (should return no results)

## Notes

### What Changed
- All user-facing references now display "Gist Widget Builder"
- All documentation now references "Gist Widget Builder"
- HTML metadata (page title, description) updated for branding consistency

### What Did NOT Change
- Repository directory name remains `gist-console` (no file system changes)
- Package.json `name` field remains `gist-console` (npm convention for URL-safe names)
- Git history and logs remain unchanged
- Database schemas, API endpoints, and environment variables unchanged
- File paths, import statements, and directory structure unchanged

### Branding Rationale
"Gist Widget Builder" better reflects the product's purpose as a tool for building and customizing chat widgets, rather than just a management console. The "builder" terminology emphasizes the creation and customization aspects of the platform.
