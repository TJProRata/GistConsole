import { mutation } from "./_generated/server";

/**
 * Migration: Add role field to existing users
 *
 * Purpose: Backfill the role field for users created before the role field was added to the schema
 * Default: All existing users get role "user" (secure default)
 *
 * Run this migration via Convex Dashboard → Functions → migrations:migrateUsersAddRoleField
 */
export const migrateUsersAddRoleField = mutation({
  handler: async (ctx) => {
    console.log("Starting migration: Add role field to existing users");

    // Query all users in the database
    const users = await ctx.db.query("users").collect();
    console.log(`Found ${users.length} total users in database`);

    let migratedCount = 0;
    let skippedCount = 0;

    // Check each user and add role if missing
    for (const user of users) {
      // TypeScript thinks role exists, but runtime data might not have it
      // Use type assertion to check for undefined
      if ((user as any).role === undefined) {
        console.log(`Migrating user: ${user.email} (${user.clerkId})`);

        await ctx.db.patch(user._id, {
          role: "user", // Default to "user" role for all existing users
        });

        migratedCount++;
      } else {
        console.log(`Skipping user (already has role): ${user.email}`);
        skippedCount++;
      }
    }

    console.log("Migration completed:");
    console.log(`- Users migrated: ${migratedCount}`);
    console.log(`- Users skipped: ${skippedCount}`);
    console.log(`- Total users: ${users.length}`);

    return {
      success: true,
      totalUsers: users.length,
      migratedCount,
      skippedCount,
      message: `Successfully migrated ${migratedCount} users to have role field`,
    };
  },
});
