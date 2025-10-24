/**
 * Script to run the role field migration
 *
 * Usage: bun run scripts/run-migration.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Error: NEXT_PUBLIC_CONVEX_URL not found in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function runMigration() {
  console.log("🚀 Starting migration: Add role field to existing users\n");

  try {
    const result = await client.mutation(api.migrations.migrateUsersAddRoleField, {});

    console.log("✅ Migration completed successfully!\n");
    console.log("Results:");
    console.log(`  - Total users: ${result.totalUsers}`);
    console.log(`  - Users migrated: ${result.migratedCount}`);
    console.log(`  - Users skipped: ${result.skippedCount}`);
    console.log(`\n${result.message}`);

    if (result.migratedCount > 0) {
      console.log("\n✨ Next step: Make the role field required again in convex/schema.ts");
    } else {
      console.log("\n✨ All users already have the role field!");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
