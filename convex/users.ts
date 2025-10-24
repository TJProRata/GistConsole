import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper: Get current user or throw error
export async function getCurrentUserOrThrow(
  ctx: QueryCtx | MutationCtx
): Promise<{ _id: Id<"users">; clerkId: string; email: string }> {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
}

// Helper: Get current user or return null
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  // Find user by Clerk ID
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  return user;
}

// Get or create user (called from webhook or first auth)
export const getOrCreateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      // Update user data if needed
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Get current user profile
export const currentUser = query({
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// Sync current authenticated user to database
// Returns user ID on success, null if auth context not ready yet
export const syncUser = mutation({
  handler: async (ctx): Promise<Id<"users"> | null> => {
    const identity = await ctx.auth.getUserIdentity();

    // Return null if auth context isn't ready (not an error, just timing)
    if (!identity) {
      return null;
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existingUser) {
      // Update user data
      await ctx.db.patch(existingUser._id, {
        email: identity.email ?? "",
        name: identity.name,
        imageUrl: identity.pictureUrl,
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      name: identity.name,
      imageUrl: identity.pictureUrl,
      createdAt: Date.now(),
    });

    return userId;
  },
});
