import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get user's configuration
export const getUserConfiguration = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const config = await ctx.db
      .query("gistConfigurations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    return config;
  },
});

// Save or update configuration
export const saveConfiguration = mutation({
  args: {
    publicationName: v.string(),
    category: v.string(),
    ingestionMethod: v.string(),
    wordpressUrl: v.optional(v.string()),
    rssFeeds: v.optional(
      v.array(
        v.object({
          url: v.string(),
          username: v.optional(v.string()),
          password: v.optional(v.string()),
          countStart: v.optional(v.number()),
          countIncrement: v.optional(v.number()),
          customHeaders: v.optional(v.object({})),
        })
      )
    ),
    faviconUrl: v.optional(v.string()),
    termsAccepted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Check if configuration already exists
    const existing = await ctx.db
      .query("gistConfigurations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing configuration
      await ctx.db.patch(existing._id, {
        publicationName: args.publicationName,
        category: args.category,
        ingestionMethod: args.ingestionMethod,
        wordpressUrl: args.wordpressUrl,
        rssFeeds: args.rssFeeds,
        faviconUrl: args.faviconUrl,
        termsAccepted: args.termsAccepted,
        termsAcceptedAt: args.termsAccepted ? now : existing.termsAcceptedAt,
        updatedAt: now,
      });

      return { success: true, configId: existing._id };
    } else {
      // Create new configuration
      const configId = await ctx.db.insert("gistConfigurations", {
        userId: identity.subject,
        publicationName: args.publicationName,
        category: args.category,
        ingestionMethod: args.ingestionMethod,
        wordpressUrl: args.wordpressUrl,
        rssFeeds: args.rssFeeds,
        faviconUrl: args.faviconUrl,
        termsAccepted: args.termsAccepted,
        termsAcceptedAt: args.termsAccepted ? now : undefined,
        createdAt: now,
        updatedAt: now,
      });

      return { success: true, configId };
    }
  },
});
