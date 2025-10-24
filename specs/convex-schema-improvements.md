# Feature: Convex Schema Type Safety and User Profile Enhancement

## Feature Description
Improve the Convex database schema with strong type safety for enums, proper validation, and add a dedicated user profile table to store additional user information beyond basic authentication data. This feature addresses critical type safety issues in the `gistConfigurations` table (weak enum typing, RSS URL handling) and creates a new `userProfiles` table to store extended user information such as company details, role, subscription status, and preferences.

## User Story
As a **Gist Console developer**
I want **strongly typed database schemas with proper validation and separated user profile data**
So that **the application prevents invalid data, has better data modeling, and can store rich user information beyond authentication**

## Problem Statement
The current Convex schema has several critical issues:

### Type Safety Problems
1. **Weak category typing**: Accepts any string instead of valid categories
2. **Weak ingestion method typing**: Accepts any string instead of "wordpress" | "rss"
3. **Missing RSS URL field**: Form collects primary RSS URL but never saves it
4. **Weak custom headers typing**: Uses `v.object({})` instead of `v.record(v.string(), v.string())`

### Data Modeling Issues
5. **No user profile table**: Authentication data mixed with business logic
6. **Limited user information**: Can't store company, role, subscription, preferences
7. **Security concern**: RSS passwords stored in plain text (needs documentation)

### Architecture Issues
8. **users table limited to auth**: Only stores Clerk sync data (clerkId, email, name, imageUrl)
9. **Missing user metadata**: No place for onboarding status, feature flags, settings

## Solution Statement
Implement a comprehensive schema improvement plan:

### Phase 1: Type Safety Fixes (Breaking Changes)
- Add strong enum validation for `category` using `v.union()` with all 12 category literals
- Add strong enum validation for `ingestionMethod` using `v.union("wordpress", "rss")`
- Fix `customHeaders` typing from `v.object({})` to `v.record(v.string(), v.string())`
- Handle RSS URL by combining primary URL with additional feeds in `rssFeeds` array

### Phase 2: New User Profile Table
- Create `userProfiles` table linked to `users` via `userId` reference
- Store company name, job title, industry, company size
- Store subscription tier, trial status, feature access
- Store user preferences (theme, notifications, language)
- Store onboarding progress and completion status
- Add indexes for efficient querying by subscription tier and status

### Phase 3: Migration Support
- Update mutations to handle both old and new schema formats
- Add migration queries to assist with data transformation
- Document schema changes and migration path
- Add security documentation for plain text password limitation

## Relevant Files

### Existing Files to Modify

- **`convex/schema.ts`** (lines 1-45)
  - Current schema definition with weak typing
  - Needs enum validation for category and ingestionMethod
  - Needs custom headers type fix
  - Needs new userProfiles table definition
  - Reason: Central schema definition for all Convex tables

- **`convex/gistConfigurations.ts`** (lines 1-92)
  - Contains `saveConfiguration` mutation with weak argument validation
  - Needs updated args to match schema enum types
  - Needs RSS URL handling logic (merge into rssFeeds array)
  - Reason: Primary mutation for configuration saves

- **`convex/users.ts`** (lines 1-125)
  - Contains user helper functions
  - Needs query/mutation for userProfiles CRUD
  - Reason: Logical place for user-related database operations

- **`app/dashboard/page.tsx`** (lines 1-383)
  - Form submit handler needs RSS URL merge logic
  - May benefit from user profile data loading
  - Reason: Primary consumer of gistConfigurations mutations

### New Files

- **`convex/userProfiles.ts`**
  - Queries and mutations for user profile management
  - Helper functions for profile access control
  - Profile creation/update/read operations
  - Reason: Dedicated file for user profile business logic

- **`convex/migrations.ts`** (Optional)
  - Migration utilities for schema updates
  - Data transformation helpers
  - Reason: Support existing data migration to new schema

## shadcn/ui Components

### Existing Components to Use
Not applicable - this is a backend schema enhancement with no UI changes in this phase.

### New Components to Add
None - UI enhancements for user profiles will be a separate feature.

### Custom Components to Create
None for this feature.

## Implementation Plan

### Phase 1: Foundation (Schema Type Safety)
Update the core schema with strong typing and validation to prevent invalid data from entering the database.

**Tasks:**
- Add enum validators for category and ingestionMethod fields
- Fix customHeaders typing to use proper record type
- Add comprehensive field documentation comments
- Add security warning comments for plain text passwords

### Phase 2: Core Implementation (New User Profile Table)
Create the userProfiles table with rich user information storage capabilities.

**Tasks:**
- Define userProfiles table schema with all fields
- Add indexes for common query patterns (by_user_id, by_subscription_tier)
- Create CRUD operations in convex/userProfiles.ts
- Implement profile creation logic (auto-create on first login)
- Add helper functions for profile access

### Phase 3: Integration (RSS URL Fix & Migration Support)
Integrate RSS URL handling and provide migration utilities.

**Tasks:**
- Update saveConfiguration mutation to merge primary RSS URL into rssFeeds[0]
- Update dashboard form submit to handle RSS URL properly
- Add backward compatibility checks for existing configurations
- Document migration path for existing data
- Add TypeScript types for new schema

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Backup Current Schema Documentation
- Read current `convex/schema.ts` completely
- Document all existing tables and their structures
- Note any existing indexes and their purposes
- Create backup comments showing old schema structure

### Step 2: Update gistConfigurations Schema with Strong Types
- Open `convex/schema.ts`
- Replace `category: v.string()` with full `v.union()` of 12 category literals
- Replace `ingestionMethod: v.string()` with `v.union(v.literal("wordpress"), v.literal("rss"))`
- Replace `customHeaders: v.optional(v.object({}))` with `v.optional(v.record(v.string(), v.string()))`
- Add JSDoc comments explaining each field's purpose
- Add security warning comment for `password` field in rssFeeds

### Step 3: Create userProfiles Table Schema
- Add new `userProfiles` table definition to `convex/schema.ts` after `users` table
- Include fields: userId (v.string() - reference to users.clerkId), companyName, jobTitle, industry, companySize
- Include fields: subscriptionTier (enum: "free", "pro", "enterprise"), isTrialActive, trialEndsAt
- Include fields: preferences (object with theme, notifications, language settings)
- Include fields: onboardingCompleted, onboardingStep, createdAt, updatedAt
- Add index: `.index("by_user_id", ["userId"])`
- Add index: `.index("by_subscription", ["subscriptionTier"])`

### Step 4: Create userProfiles CRUD Operations
- Create new file `convex/userProfiles.ts`
- Import necessary Convex server types (query, mutation, QueryCtx, MutationCtx)
- Create `getUserProfile` query that fetches profile by current user's Clerk ID
- Create `createUserProfile` mutation with all required fields
- Create `updateUserProfile` mutation that patches existing profile
- Add helper function `getOrCreateUserProfile` for auto-creation logic
- Add TypeScript interfaces for profile data structures

### Step 5: Update gistConfigurations Mutation Args
- Open `convex/gistConfigurations.ts`
- Update `saveConfiguration` mutation args validators to match new schema enums
- Change category arg from `v.string()` to match schema union type
- Change ingestionMethod arg from `v.string()` to match schema union type
- Update customHeaders arg to `v.optional(v.record(v.string(), v.string()))`
- Add validation logic to ensure category and ingestionMethod are valid

### Step 6: Implement RSS URL Handling Logic
- In `convex/gistConfigurations.ts` saveConfiguration mutation
- Add logic to check if primary rssUrl is provided when ingestionMethod is "rss"
- If rssUrl exists, create primary feed object: `{ url: rssUrl, ...optional fields }`
- Merge primary feed into rssFeeds array as first element: `[primaryFeed, ...rssFeeds]`
- Update database insert/patch to store merged array
- Add comment explaining RSS URL handling strategy

### Step 7: Update Dashboard Form Submit Handler
- Open `app/dashboard/page.tsx`
- Modify `onSubmit` function to extract `values.rssUrl` when ingestionMethod is "rss"
- Create primary RSS feed object if rssUrl exists
- Merge primary feed with additional feeds from modal: `[{ url: values.rssUrl }, ...rssFeeds]`
- Pass merged array to saveConfiguration mutation
- Add comment explaining RSS URL merge logic

### Step 8: Add TypeScript Type Definitions
- Create TypeScript type for Category enum matching schema union
- Create TypeScript type for IngestionMethod enum matching schema union
- Export types from `convex/_generated/dataModel.ts` or create separate types file
- Update form schema in dashboard to use exported types for validation
- Ensure type safety across entire stack (schema → mutation → form)

### Step 9: Add Migration Utilities (Optional)
- Create `convex/migrations.ts` if needed for existing data
- Add query to list configurations with old category/ingestionMethod formats
- Add mutation to batch update configurations to new enum format
- Document migration process in file comments
- Add safety checks to prevent data loss during migration

### Step 10: Document Schema Changes
- Update `convex/README.md` with new schema structure
- Document userProfiles table purpose and fields
- Document migration path from old to new schema
- Add security warning about plain text passwords in RSS feeds
- Document RSS URL handling strategy
- Add examples of querying new userProfiles table

### Step 11: Deploy and Test Schema Changes
- Run `npx convex dev` to deploy new schema to development environment
- Verify schema validation in Convex dashboard
- Test creating new configuration with enum validation
- Test creating new user profile
- Verify indexes are created correctly
- Check dashboard data browser for table structures

### Step 12: Test End-to-End Workflows
- Test complete configuration creation flow with RSS ingestion
- Verify primary RSS URL is merged into rssFeeds array correctly
- Test configuration update with category/ingestionMethod changes
- Test user profile creation on first login
- Test user profile updates
- Verify all enum fields reject invalid values
- Test backward compatibility with existing configurations

### Step 13: Run Validation Commands
- Execute all validation commands listed below
- Verify zero TypeScript errors
- Verify zero build errors
- Verify all tests pass
- Manually test complete workflows in browser

## Testing Strategy

### Unit Tests
- Test enum validation rejects invalid category values
- Test enum validation rejects invalid ingestionMethod values
- Test customHeaders accepts valid record format
- Test customHeaders rejects non-string values
- Test RSS URL merge logic creates correct array structure
- Test userProfile CRUD operations work correctly
- Test helper functions (getOrCreateUserProfile) handle all cases

### Integration Tests
- Test full configuration save with new schema validation
- Test user profile auto-creation on first dashboard visit
- Test configuration load with RSS URL array structure
- Test form submission with primary RSS URL merging
- Test migration from old to new schema formats
- Test index performance for common query patterns

### Edge Cases
- **Invalid category**: Mutation should reject with validation error
- **Invalid ingestion method**: Mutation should reject with validation error
- **Empty RSS URL**: Should not create empty feed in array
- **Primary RSS URL with additional feeds**: Should merge correctly
- **Switching from WordPress to RSS**: Should clear wordpressUrl, handle rssFeeds
- **Switching from RSS to WordPress**: Should clear rssFeeds, handle wordpressUrl
- **User profile doesn't exist**: Should auto-create with defaults
- **Duplicate user profile creation**: Should handle gracefully (update instead)
- **Plain text password storage**: Should work but log security warning
- **Custom headers with non-string values**: Should reject with type error
- **Missing optional fields**: Should handle gracefully with undefined
- **Concurrent profile updates**: Should handle with Convex's transactional guarantees

## Acceptance Criteria

1. ✅ gistConfigurations.category only accepts valid category enum values
2. ✅ gistConfigurations.ingestionMethod only accepts "wordpress" or "rss"
3. ✅ gistConfigurations.customHeaders properly typed as record<string, string>
4. ✅ Primary RSS URL field merges into rssFeeds[0] on save
5. ✅ userProfiles table exists with all specified fields
6. ✅ userProfiles has indexes on by_user_id and by_subscription
7. ✅ getUserProfile query returns user's profile data
8. ✅ createUserProfile mutation creates new profile with validation
9. ✅ updateUserProfile mutation updates existing profile
10. ✅ getOrCreateUserProfile helper auto-creates profile if missing
11. ✅ Schema deploys successfully with no validation errors
12. ✅ Existing configurations continue to work (backward compatibility)
13. ✅ Dashboard form correctly handles RSS URL merging
14. ✅ TypeScript compilation succeeds with new types
15. ✅ Invalid enum values are rejected by Convex with clear error messages
16. ✅ Security warning documented for plain text password storage
17. ✅ Migration documentation exists for existing data
18. ✅ All indexes created successfully in Convex dashboard

## Validation Commands

Execute every command to validate the feature works correctly with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background, verify successful deployment)
- Verify in Convex Dashboard:
  - Navigate to Data → Schema tab
  - Verify gistConfigurations table shows enum types for category and ingestionMethod
  - Verify userProfiles table exists with all fields
  - Verify indexes exist: by_user_id (users), by_user_id (gistConfigurations), by_user_id (userProfiles), by_subscription (userProfiles)
- `bun dev` - Start the Next.js dev server and manually test end-to-end:
  - Create new configuration with RSS ingestion method
  - Enter primary RSS URL and additional feeds via modal
  - Save configuration and verify in Convex dashboard data browser
  - Verify rssFeeds array contains primary URL as first element
  - Try to save configuration with invalid category (should fail)
  - Try to save configuration with invalid ingestion method (should fail)
  - Verify user profile auto-created on dashboard visit
  - Test configuration update (change category, change ingestion method)
  - Verify all changes persist correctly
  - Check browser console for any TypeScript or runtime errors

## Notes

### Breaking Changes
This feature introduces **breaking schema changes** that require careful deployment:

1. **Enum validation**: Existing configurations with invalid category/ingestionMethod values will fail validation
2. **Custom headers type change**: Existing configurations with non-string custom header values will fail
3. **Migration path**: Existing data should be validated and potentially migrated before deploying

### Deployment Strategy
**Recommended approach:**

1. **Development testing**: Deploy to dev environment first, test thoroughly
2. **Data validation**: Query existing data for invalid enum values
3. **Migration**: Run migration utilities to fix invalid data
4. **Staged rollout**: Deploy schema changes with backward compatibility
5. **Monitor**: Watch logs for validation errors after deployment

### RSS URL Handling Decision
**Chosen approach**: Merge primary RSS URL into `rssFeeds[0]`

**Rationale:**
- No schema changes needed (backward compatible)
- Simpler implementation (frontend-only change)
- Consistent data structure (all RSS URLs in one array)
- Easier to query and display (single source of truth)

**Alternative**: Add separate `rssUrl` field to schema
- Would require schema migration
- Creates redundancy (two places for RSS URLs)
- More complex validation logic

### Security Warning: Plain Text Passwords
**Current implementation stores RSS feed passwords in plain text.**

**Documented limitations:**
- RSS feed credentials stored unencrypted in Convex database
- Accessible to anyone with database access
- Not recommended for sensitive credentials

**Future enhancements:**
- Add encryption layer for sensitive fields
- Use environment variables for shared credentials
- Implement Convex encrypted fields when available
- Consider OAuth for RSS feed authentication

### User Profile Table Purpose
The `userProfiles` table separates **authentication data** (users table) from **business/application data** (userProfiles table):

**users table** (Clerk sync):
- Clerk ID, email, name, imageUrl
- Authentication-related data only
- Managed by Clerk webhook sync

**userProfiles table** (application data):
- Company, job title, industry
- Subscription tier, trial status
- Preferences, onboarding status
- Business logic and feature flags

**Benefits:**
- Clean separation of concerns
- Can delete user auth without losing business data
- Easy to extend with new fields
- Better data modeling and queries

### Future Enhancements
After this feature, consider:

1. **User onboarding flow**: Use onboardingStep and onboardingCompleted fields
2. **Subscription management**: Build features around subscriptionTier
3. **Feature flags**: Add featureAccess field for A/B testing
4. **User settings page**: UI for editing userProfile data
5. **Admin dashboard**: View/manage user profiles and subscriptions
6. **Analytics**: Track onboarding completion rates, subscription tiers
7. **Encrypted credentials**: Implement encryption for sensitive RSS passwords
8. **Multi-tenant support**: Add organizationId for team-based access

### Convex Schema Best Practices Applied
Following official Convex documentation patterns:

1. **Use indexes**: Added indexes for common query patterns
2. **Strong typing**: Use v.union() for enums instead of v.string()
3. **Validation**: Validate at schema level, not just in mutations
4. **Optional fields**: Use v.optional() for nullable fields
5. **Timestamps**: Store as numbers (Date.now()) for easy sorting
6. **References**: Use string IDs for cross-table references (userId → clerkId)
7. **Record types**: Use v.record() for key-value objects (customHeaders)
8. **Documentation**: Add comments explaining schema design decisions

### TypeScript Integration
Full type safety across the stack:

```typescript
// Schema → Generated Types
import { Doc, Id } from "@/convex/_generated/dataModel";

// Type-safe category
type Category = Doc<"gistConfigurations">["category"];

// Type-safe user profile
type UserProfile = Doc<"userProfiles">;

// Type-safe mutations
const profile = await ctx.db.get(id); // Returns UserProfile | null
```

### Performance Considerations
- **Indexes**: Added for common queries (by_user_id, by_subscription)
- **Query efficiency**: Single query per user for profile data
- **Reactive updates**: Convex automatically updates queries when data changes
- **Caching**: Convex handles caching automatically
- **No N+1 queries**: Helper functions use efficient patterns

### Data Migration Example
If existing data needs migration:

```typescript
// convex/migrations.ts
export const migrateCategories = internalMutation({
  handler: async (ctx) => {
    const configs = await ctx.db.query("gistConfigurations").collect();

    for (const config of configs) {
      // Map old values to new enum
      const validCategory = mapOldCategory(config.category);
      if (validCategory !== config.category) {
        await ctx.db.patch(config._id, { category: validCategory });
      }
    }
  },
});
```

### React 19.2 Integration
No changes needed for React patterns - this is pure backend enhancement. User profiles can be queried using standard Convex React hooks:

```typescript
// Future usage in components
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function ProfileSettings() {
  const profile = useQuery(api.userProfiles.getUserProfile);
  // Reactive updates when profile changes
}
```
