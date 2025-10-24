# Bug: Schema Validation Failed - Missing Required Role Field

## Bug Description
When running `npx convex dev`, Convex schema validation fails with the error:
```
Document with ID "jx7869r4kcdkpyb2nbpwgbh89x7t2mw2" in table "users" does not match the schema: Object is missing the required field `role`. Consider wrapping the field validator in `v.optional(...)` if this is expected.
```

**Symptoms:**
- Convex dev server fails to start
- Existing user documents cannot be validated against the updated schema
- Error specifically mentions missing `role` field in existing user record

**Expected Behavior:**
- Convex dev server should start successfully
- All existing user records should validate against the schema
- Schema changes should be backwards compatible with existing data

**Actual Behavior:**
- Schema validation fails due to existing user record missing the `role` field
- The user record was created before the `role` field was added to the schema
- Convex cannot proceed with the existing data structure

## Problem Statement
The `users` table schema was recently updated to include a required `role` field with type `v.union(v.literal("user"), v.literal("admin"))`. However, existing user records in the database were created before this field was added, causing them to fail schema validation. This is a classic data migration problem where schema evolution is not backwards compatible with existing data.

## Solution Statement
Implement a data migration strategy to add the missing `role` field to all existing user records. The solution has two parts:

1. **Create a migration mutation** that finds all users without the `role` field and adds `role: "user"` as the default value
2. **Run the migration** before deploying the schema change to ensure all existing records have the required field

This approach ensures backwards compatibility and allows the Convex dev server to start successfully.

## Steps to Reproduce
1. Have an existing Convex database with user records created before the `role` field was added
2. Update the `convex/schema.ts` to add the required `role` field to the `users` table
3. Run `npx convex dev`
4. Observe schema validation error: "Object is missing the required field `role`"

## Root Cause Analysis
The root cause is a **breaking schema change without data migration**:

1. **Initial State**: User records were created with fields: `clerkId`, `email`, `name`, `imageUrl`, `createdAt`
2. **Schema Update**: The `users` table schema was modified to add a **required** `role` field:
   ```typescript
   role: v.union(v.literal("user"), v.literal("admin"))
   ```
3. **Validation Failure**: When Convex loads the schema, it validates all existing documents against the new schema definition
4. **Missing Field**: Existing documents lack the `role` field, causing validation to fail
5. **Consequence**: The Convex dev server cannot start because data integrity validation fails

**Why This Happened:**
- The `role` field was added as a required field (not optional)
- No migration was run to backfill existing records with a default `role` value
- New users created via `getOrCreateUser` and `syncUser` mutations include `role: "user"`, but existing users don't have this field

**Schema Evolution Best Practice Violated:**
When adding required fields to existing tables, you must either:
- Make the field optional: `role: v.optional(v.union(...))`
- Run a data migration to backfill existing records before deploying the schema change
- Use a two-phase deployment: (1) add as optional, (2) migrate data, (3) make required

## Relevant Files
Use these files to fix the bug:

- **`convex/schema.ts`** (lines 21-31)
  - Contains the users table schema with the required `role` field
  - Need to temporarily make the field optional during migration

- **`convex/users.ts`** (lines 33-78, 89-126)
  - Contains `getOrCreateUser` and `syncUser` mutations that create new users with `role: "user"`
  - Both mutations correctly set the role for new users
  - Need to add a migration mutation here to backfill existing users

### New Files
- **`convex/migrations.ts`** (NEW)
  - Will contain data migration mutations
  - `migrateUsersAddRoleField` mutation to backfill missing role fields

## Step by Step Tasks

### Step 1: Create Migration File with Backfill Mutation
- Create `convex/migrations.ts` with a mutation to add the `role` field to existing users
- The mutation should:
  - Query all users in the database
  - Check if each user has a `role` field
  - If missing, patch the user record to add `role: "user"` as the default
  - Log the migration progress for each user
  - Return a count of migrated users

### Step 2: Make Role Field Optional Temporarily
- Modify `convex/schema.ts` to make the `role` field optional during migration:
  - Change `role: v.union(v.literal("user"), v.literal("admin"))` to `role: v.optional(v.union(v.literal("user"), v.literal("admin")))`
- This allows the schema to validate while we run the migration

### Step 3: Deploy Schema with Optional Role
- Run `npx convex dev` to deploy the schema with the optional role field
- This should succeed now that the field is optional
- The Convex dev server should start successfully

### Step 4: Run Migration Mutation via Convex Dashboard
- Open Convex Dashboard → Functions tab
- Find and execute `migrations:migrateUsersAddRoleField` mutation
- Verify in the response that it shows the number of users migrated
- Check the console logs to see which users were updated

### Step 5: Make Role Field Required Again
- Modify `convex/schema.ts` to make the `role` field required again:
  - Change `role: v.optional(v.union(v.literal("user"), v.literal("admin")))` back to `role: v.union(v.literal("user"), v.literal("admin"))`
- This restores the original schema intention now that all records have the field

### Step 6: Deploy Final Schema
- Run `npx convex dev` to deploy the schema with the required role field
- Schema validation should succeed for all existing users
- The Convex dev server should start successfully

### Step 7: Verify Migration Success
- Check Convex Dashboard → Data → users table
- Verify all users have the `role` field set to "user"
- Spot check a few user records to confirm the field exists
- Verify the user mentioned in the error (`tjmcgovern8@gmail.com`) now has a role field

### Step 8: Run Validation Commands
- Execute all validation commands listed below to ensure the bug is fully fixed
- Verify no TypeScript errors in the build
- Confirm the Next.js app runs without errors
- Test user authentication and admin portal access

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `npx convex dev` - Deploy Convex schema and verify no validation errors (should start successfully)
- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `bun dev` - Start the Next.js dev server and verify authentication still works
- Manual: Open Convex Dashboard → Data → users table and verify all users have `role` field
- Manual: Sign in to the app and verify home page loads correctly
- Manual: Check that existing users can access their dashboard
- Manual: Verify admin users (if any) can still access the admin portal

## Notes

### Migration Strategy Considerations
1. **Two-Phase Deployment**: This fix uses a two-phase approach (optional → migrate → required) which is safer for production
2. **Default Role**: All existing users are migrated to `role: "user"` as the default, which is the correct security posture
3. **Manual Admin Assignment**: Admins must still be manually assigned via the Convex Dashboard (as documented in README.md)

### Alternative Approaches (Not Recommended)
- **Keep Field Optional**: Would require null checks throughout the codebase and weaken type safety
- **Delete and Recreate Users**: Would lose existing data and break foreign key references
- **Manual Database Edit**: Not scalable and error-prone for multiple users

### Future Schema Changes
To prevent similar issues in the future:
1. Always make new fields optional initially
2. Run data migrations to backfill values
3. Only make fields required after confirming all records have the field
4. Consider using a migrations framework for complex schema evolution
5. Test schema changes against production-like data before deployment

### Security Notes
- The migration sets all existing users to `role: "user"`, which is the secure default
- No existing users will gain admin access through this migration
- Admin roles must still be explicitly granted via the Convex Dashboard
- The migration logs all changes for audit purposes
