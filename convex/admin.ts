import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

/**
 * Admin Authorization Layer
 *
 * Security: All admin queries enforce server-side authorization
 * to prevent unauthorized access at the database level.
 */

// Helper: Check if current user is admin
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// Query: Check if current user has admin role
export const isAdmin = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return false;
    }
    return user.role === "admin";
  },
});

// Query: Get all users (admin-only)
export const getAllUsers = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db
      .query("users")
      .order("desc")
      .collect();

    return users;
  },
});

// Query: Get all configurations (admin-only)
export const getAllConfigurations = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const configs = await ctx.db
      .query("gistConfigurations")
      .order("desc")
      .collect();

    // Enrich with user data
    const enrichedConfigs = await Promise.all(
      configs.map(async (config) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", config.userId))
          .unique();

        return {
          ...config,
          userEmail: user?.email,
          userName: user?.name,
        };
      })
    );

    return enrichedConfigs;
  },
});

// Query: Get admin action logs (admin-only)
export const getAdminLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const limit = args.limit ?? 100;

    const logs = await ctx.db
      .query("adminLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);

    // Enrich with admin and target user names
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const admin = await ctx.db.get(log.adminId);
        const targetUser = log.targetUserId ? await ctx.db.get(log.targetUserId) : null;

        return {
          ...log,
          adminName: admin?.name ?? admin?.email,
          targetUserName: targetUser?.name ?? targetUser?.email,
        };
      })
    );

    return enrichedLogs;
  },
});

// Mutation: Log admin action
export const logAdminAction = mutation({
  args: {
    action: v.string(),
    targetUserId: v.optional(v.id("users")),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    const logId = await ctx.db.insert("adminLogs", {
      adminId: admin._id,
      action: args.action,
      targetUserId: args.targetUserId,
      metadata: args.metadata,
      timestamp: Date.now(),
    });

    return logId;
  },
});

// Query: Get user statistics (admin-only)
export const getUserStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const allUsers = await ctx.db.query("users").collect();
    const adminUsers = allUsers.filter(u => u.role === "admin");
    const regularUsers = allUsers.filter(u => u.role === "user");

    // Get users created in last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentUsers = allUsers.filter(u => u.createdAt >= thirtyDaysAgo);

    return {
      totalUsers: allUsers.length,
      adminCount: adminUsers.length,
      userCount: regularUsers.length,
      recentUsers: recentUsers.length,
    };
  },
});

// Query: Get configuration statistics (admin-only)
export const getConfigStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const allConfigs = await ctx.db.query("gistConfigurations").collect();

    const wordpressConfigs = allConfigs.filter(c => c.ingestionMethod === "wordpress");
    const rssConfigs = allConfigs.filter(c => c.ingestionMethod === "rss");

    // Count by category
    const categoryCount: Record<string, number> = {};
    allConfigs.forEach(config => {
      categoryCount[config.category] = (categoryCount[config.category] || 0) + 1;
    });

    return {
      totalConfigurations: allConfigs.length,
      wordpressCount: wordpressConfigs.length,
      rssCount: rssConfigs.length,
      categoryBreakdown: categoryCount,
    };
  },
});
