# Feature: Gist Answers Onboarding Form

## Feature Description
Replace the current dashboard placeholder with a comprehensive "Set up Gist Answers" onboarding form that collects publication details, content ingestion method, favicon, and terms acceptance. This form will be the primary entry point for users to configure their AI-powered search widget.

The form includes:
- **Publication name** input field
- **Category** dropdown selector with 13 predefined categories
- **Content ingestion method** selection (WordPress CMS or RSS Feed)
- **WordPress endpoint URL** input field (conditionally shown)
- **Favicon upload** with drag-and-drop support
- **Terms and conditions** checkbox with modal overlay
- **Save** button to submit the configuration

## User Story
As a publisher setting up Gist Answers
I want to configure my publication details and content ingestion method
So that I can start providing AI-powered search to my readers

## Problem Statement
The current dashboard shows only a welcome message with no actionable functionality. Users need a streamlined onboarding experience to:
1. Input their publication information
2. Select how their content should be ingested (WordPress or RSS)
3. Upload their favicon for branding
4. Accept terms and conditions
5. Complete the initial setup to activate their Gist Answers service

## Solution Statement
Create a multi-section form using React Hook Form + Zod validation, shadcn/ui components, and Convex mutations. The form will:
- Use controlled form state with validation
- Show/hide conditional fields based on ingestion method selection
- Implement a modal dialog for terms and conditions
- Handle file uploads for favicon images
- Store configuration data in Convex database
- Provide clear visual feedback and error handling

## Relevant Files
Use these files to implement the feature:

- **app/dashboard/page.tsx** - Main dashboard page to be transformed into onboarding form
  - Currently shows welcome card
  - Will be replaced with multi-section form
  - Already has Header component and user authentication check

- **convex/schema.ts** - Database schema
  - Need to add new `gistConfigurations` table for storing form data
  - Already has users table with Clerk integration

- **components/Header.tsx** - Navigation header
  - Already exists and working
  - Will remain unchanged

- **components/ui/button.tsx** - Button component
  - Already exists (shadcn/ui)
  - Will be used for Save button and modal actions

- **components/ui/input.tsx** - Input component
  - Already exists (shadcn/ui)
  - Will be used for Publication and URL fields

- **components/ui/label.tsx** - Label component
  - Already exists (shadcn/ui)
  - Will be used for form labels

- **components/ui/form.tsx** - Form component
  - Already exists (shadcn/ui with react-hook-form)
  - Will be used for form structure and validation

- **lib/utils.ts** - Utility functions
  - Already has cn() for class merging
  - Will remain unchanged

### New Files

- **components/ui/select.tsx** - Select/dropdown component (needs to be added)
  - Required for Category dropdown
  - Will be added via `npx shadcn@latest add select`

- **components/ui/radio-group.tsx** - Radio group component (needs to be added)
  - Required for ingestion method selection
  - Will be added via `npx shadcn@latest add radio-group`

- **components/ui/checkbox.tsx** - Checkbox component (needs to be added)
  - Required for terms and conditions acceptance
  - Will be added via `npx shadcn@latest add checkbox`

- **components/ui/dialog.tsx** - Dialog/modal component (needs to be added)
  - Required for terms and conditions modal overlay
  - Will be added via `npx shadcn@latest add dialog`

- **components/TermsAndConditionsDialog.tsx** - Custom dialog wrapper
  - Wraps shadcn/ui Dialog with terms content
  - Contains verbatim terms text from user requirements

- **convex/gistConfigurations.ts** - Convex mutations and queries
  - Create mutation to save configuration
  - Query to fetch user's configuration
  - Handles favicon file storage (if needed)

## shadcn/ui Components
### Existing Components to Use
- `button` - Save button, dialog actions
- `card` - Form container (can reuse existing)
- `input` - Publication name, WordPress URL
- `label` - Form field labels
- `form` - Form structure with react-hook-form integration

### New Components to Add
```bash
npx shadcn@latest add select
npx shadcn@latest add radio-group
npx shadcn@latest add checkbox
npx shadcn@latest add dialog
```

### Custom Components to Create
- **TermsAndConditionsDialog** - Dialog wrapper following shadcn/ui patterns
  - Uses Dialog primitive from `components/ui/dialog.tsx`
  - Implements scroll container for long terms content
  - Follows CVA patterns for consistent styling
  - Uses forwardRef and proper accessibility attributes

## Implementation Plan

### Phase 1: Foundation
1. Add required shadcn/ui components (select, radio-group, checkbox, dialog)
2. Update Convex schema with `gistConfigurations` table
3. Create Convex mutations/queries for configuration management
4. Set up form validation schema with Zod

### Phase 2: Core Implementation
1. Build the main form structure with React Hook Form
2. Implement Publication and Category fields
3. Add ingestion method selection (WordPress/RSS)
4. Implement conditional WordPress URL field
5. Add favicon upload component
6. Create Terms and Conditions dialog
7. Implement form submission logic

### Phase 3: Integration
1. Connect form to Convex mutations
2. Add loading and error states
3. Implement success feedback
4. Test end-to-end flow
5. Validate accessibility and responsive design

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add Required shadcn/ui Components
- Run `npx shadcn@latest add select` to add dropdown component
- Run `npx shadcn@latest add radio-group` to add radio button group
- Run `npx shadcn@latest add checkbox` to add checkbox component
- Run `npx shadcn@latest add dialog` to add modal dialog component
- Verify all components are in `components/ui/` directory

### Step 2: Update Convex Schema
- Open `convex/schema.ts`
- Add `gistConfigurations` table with fields:
  - `userId` (string) - Reference to user's Clerk ID
  - `publicationName` (string) - Publication name
  - `category` (string) - Selected category
  - `ingestionMethod` (string) - "wordpress" or "rss"
  - `wordpressUrl` (optional string) - WordPress posts endpoint URL
  - `faviconUrl` (optional string) - Stored favicon URL
  - `termsAccepted` (boolean) - Terms acceptance flag
  - `termsAcceptedAt` (optional number) - Timestamp of acceptance
  - `createdAt` (number) - Creation timestamp
  - `updatedAt` (number) - Last update timestamp
- Add index by userId
- Deploy schema with `npx convex dev`

### Step 3: Create Convex Mutations and Queries
- Create `convex/gistConfigurations.ts`
- Implement `saveConfiguration` mutation:
  - Accept form data
  - Validate user authentication
  - Upsert configuration (update if exists, insert if new)
  - Return success/error status
- Implement `getUserConfiguration` query:
  - Get current user from auth
  - Query configuration by userId
  - Return configuration or null
- Test mutations in Convex dashboard

### Step 4: Create Terms and Conditions Dialog Component
- Create `components/TermsAndConditionsDialog.tsx`
- Use Dialog primitive from `components/ui/dialog.tsx`
- Implement component structure:
  - DialogTrigger as link text "terms and conditions"
  - DialogContent with ScrollArea for long content
  - DialogHeader with title "Terms and Conditions"
  - DialogDescription with verbatim terms text
  - DialogFooter with "Close" button
- Follow shadcn/ui patterns: forwardRef, CVA variants, accessibility
- Style with Tailwind and CSS variables

### Step 5: Create Form Validation Schema
- In `app/dashboard/page.tsx`, create Zod schema:
  - publicationName: string, required, min 1 character
  - category: enum of 13 categories
  - ingestionMethod: enum ["wordpress", "rss"]
  - wordpressUrl: string, optional, URL validation
  - faviconFile: optional file validation
  - termsAccepted: boolean, must be true
- Use `@hookform/resolvers/zod` for validation

### Step 6: Build Main Form Structure
- Transform `app/dashboard/page.tsx`:
  - Keep Header component
  - Replace Card content with Form component
  - Use `useForm` hook with Zod schema
  - Implement form layout with proper spacing
  - Add form title "How should we ingest your website content?"
  - Create form sections with proper semantic HTML

### Step 7: Implement Publication Name Field
- Add FormField for publication name
- Use Input component from shadcn/ui
- Add Label "Publication" with required asterisk (*)
- Add description text "This will be the name displayed in your AI Search setup and reports"
- Add placeholder "e.g., The Metro Herald"
- Connect to react-hook-form with field name "publicationName"

### Step 8: Implement Category Dropdown
- Add FormField for category
- Use Select component from shadcn/ui
- Add Label "Category" with required asterisk (*)
- Add description text "Select the category that best matches your publication"
- Add placeholder "Select option..."
- Populate with 13 categories:
  - Academic
  - Books
  - Business
  - gpa_publisher
  - Health
  - Lifestyle
  - News
  - Other
  - ProRata Internal
  - Reference
  - Sports
  - Uncategorized
- Connect to react-hook-form with field name "category"

### Step 9: Implement Ingestion Method Selection
- Add FormField for ingestion method
- Use RadioGroup component from shadcn/ui
- Add Label "Choose your method" with required asterisk (*)
- Add description text with Content Policy link
- Add two radio options with proper styling:
  - "Connect via CMS – we currently support WordPress" (value: "wordpress")
  - "Connect RSS Feed – import content from your RSS feed" (value: "rss")
- Apply border styling to selected option (blue border)
- Connect to react-hook-form with field name "ingestionMethod"

### Step 10: Implement Conditional WordPress URL Field
- Add FormField for WordPress URL
- Conditionally render based on ingestionMethod === "wordpress"
- Use Input component
- Add description text about WordPress posts endpoint format
- Add placeholder "e.g., https://yourwebsite.com/wp-json/wp/v2/posts"
- Connect to react-hook-form with field name "wordpressUrl"
- Add URL format validation

### Step 11: Implement Favicon Upload
- Add FormField for favicon
- Create drag-and-drop upload area:
  - Dashed border container
  - Plus icon in center
  - "Drop your image here or browse" text
  - File size limit "(PNG or JPG, max 100KB)"
- Handle file selection and preview
- Validate file type (PNG/JPG) and size (max 100KB)
- Store file data for upload

### Step 12: Implement Terms Acceptance Checkbox
- Add FormField for terms acceptance
- Use Checkbox component
- Add text "I agree to the " with TermsAndConditionsDialog trigger
- Connect to react-hook-form with field name "termsAccepted"
- Add validation to require checked state

### Step 13: Implement Save Button
- Add Button component with variant "default"
- Set text to "Save"
- Add purple/violet background color to match design
- Connect to form onSubmit handler
- Disable when form is submitting
- Show loading state during submission

### Step 14: Implement Form Submission Logic
- Create onSubmit handler:
  - Extract form data from react-hook-form
  - Call Convex mutation `saveConfiguration`
  - Handle file upload if favicon provided
  - Show success message on completion
  - Handle errors with user feedback
- Add loading state management
- Add error state management

### Step 15: Add Loading and Success States
- Add conditional rendering for loading state
- Add success message after save
- Add error message display for failed saves
- Ensure proper user feedback throughout flow

### Step 16: Test and Validate
- Run `bun run build` to check for TypeScript errors
- Start `npx convex dev` to deploy schema
- Start `bun dev` to test application
- Test all form fields and validation
- Test WordPress URL conditional rendering
- Test terms dialog open/close
- Test form submission and data persistence
- Verify responsive design on mobile/tablet/desktop
- Check accessibility with keyboard navigation

## Testing Strategy

### Unit Tests
- Zod schema validation for all field types
- Form field validation rules
- Conditional rendering logic for WordPress URL
- File upload validation (type and size)
- Terms acceptance requirement

### Integration Tests
- Full form submission flow
- Convex mutation integration
- User authentication check
- Form state persistence
- Error handling and recovery

### Edge Cases
- Submitting without required fields
- Invalid URL format in WordPress field
- File upload exceeding size limit
- Unsupported file types for favicon
- Terms not accepted before submit
- Network errors during save
- Duplicate configuration handling
- Long publication names
- Special characters in inputs
- Concurrent form submissions

## Acceptance Criteria
- [ ] Form displays correctly with all fields matching the design
- [ ] Publication name field is required and validates
- [ ] Category dropdown contains all 13 categories
- [ ] Ingestion method selection works with visual feedback (border highlight)
- [ ] WordPress URL field shows/hides based on ingestion method selection
- [ ] Favicon upload accepts PNG/JPG files up to 100KB
- [ ] Terms and conditions link opens modal with scrollable content
- [ ] Terms modal contains verbatim terms text
- [ ] Form cannot be submitted without checking terms
- [ ] Save button submits form data to Convex
- [ ] Configuration persists to database correctly
- [ ] Form shows loading state during submission
- [ ] Success message displays after successful save
- [ ] Error messages display for validation failures
- [ ] Form is responsive on mobile, tablet, and desktop
- [ ] Keyboard navigation works for all form elements
- [ ] Screen readers can navigate form properly

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

```bash
# Build Next.js app to validate no TypeScript or build errors
bun run build

# Deploy Convex schema and functions (run in background)
npx convex dev

# Start Next.js dev server and manually test the feature end-to-end
bun dev

# Manual testing checklist:
# 1. Navigate to /dashboard
# 2. Verify form renders with all fields
# 3. Fill out publication name
# 4. Select a category from dropdown
# 5. Select WordPress ingestion method - verify URL field appears
# 6. Select RSS ingestion method - verify URL field disappears
# 7. Click terms and conditions link - verify modal opens
# 8. Scroll through terms content - verify all text visible
# 9. Close modal
# 10. Check terms checkbox
# 11. Click Save without filling required fields - verify validation errors
# 12. Fill all required fields and click Save - verify success
# 13. Refresh page - verify configuration persists (if implementing fetch)
# 14. Test on mobile viewport - verify responsive design
# 15. Test keyboard navigation - verify accessibility
```

## Notes

### Tech Stack Used
- **Next.js 16** (App Router, React 19.2, TypeScript) - Main framework
- **Clerk** - User authentication (already integrated)
- **Convex** - Backend database and mutations
- **shadcn/ui** - UI component library (button, card, input, label, form, select, radio-group, checkbox, dialog)
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons (for plus icon in upload)
- **CVA (class-variance-authority)** - Component variants

### Design Decisions
1. **Form validation**: Using Zod schema with react-hook-form for type-safe validation
2. **State management**: React Hook Form handles form state, Convex handles persistence
3. **File upload**: Client-side validation before potential upload to Convex or external storage
4. **Terms modal**: Using shadcn/ui Dialog for accessible modal implementation
5. **Conditional rendering**: WordPress URL field shows/hides based on radio selection
6. **Styling**: Following shadcn/ui patterns with Tailwind utilities and CSS variables

### Future Considerations
- Add file upload to Convex or external storage (e.g., Cloudinary, S3)
- Implement progress indicator for multi-step onboarding
- Add ability to edit configuration after initial save
- Consider adding RSS feed URL input when RSS method is selected
- Add preview of how the widget will look with selected favicon
- Implement email confirmation after setup completion
- Add analytics tracking for onboarding completion rate
- Consider adding tooltips for complex fields
- Add ability to test WordPress endpoint connection before saving
- Implement automatic favicon fetching from publication URL

### Accessibility Notes
- All form fields have proper labels and ARIA attributes
- Terms modal is keyboard navigable and screen reader friendly
- Radio buttons use native radio input for proper keyboard behavior
- Error messages are associated with their fields via ARIA
- Focus management in modal dialog
- Color contrast meets WCAG AA standards
- Touch targets are at least 44x44px for mobile

### Terms and Conditions Content
The verbatim terms text will be provided by the user in "[Pasted text #2 +72 lines]" - this content must be copied exactly as provided into the TermsAndConditionsDialog component.
