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
    // Strong enum validation for category (12 valid categories)
    category: v.union(
      v.literal("Academic"),
      v.literal("Books"),
      v.literal("Business"),
      v.literal("gpa_publisher"),
      v.literal("Health"),
      v.literal("Lifestyle"),
      v.literal("News"),
      v.literal("Other"),
      v.literal("ProRata Internal"),
      v.literal("Reference"),
      v.literal("Sports"),
      v.literal("Uncategorized")
    ),
    // Strong enum validation for ingestion method
    ingestionMethod: v.union(
      v.literal("wordpress"),
      v.literal("rss")
    ),
    wordpressUrl: v.optional(v.string()),
    // RSS feeds array (includes primary RSS URL as first element)
    rssFeeds: v.optional(
      v.array(
        v.object({
          url: v.string(),
          username: v.optional(v.string()),
          password: v.optional(v.string()),
          countStart: v.optional(v.number()),
          countIncrement: v.optional(v.number()),
          // Fixed: Proper record type for custom headers
          customHeaders: v.optional(v.record(v.string(), v.string())),
        })
      )
    ),
    faviconStorageId: v.optional(v.id("_storage")),
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

    // Generate favicon URL from storage ID if provided
    let faviconUrl: string | undefined = undefined;
    if (args.faviconStorageId) {
      faviconUrl = (await ctx.storage.getUrl(args.faviconStorageId)) ?? undefined;
    }

    if (existing) {
      // Update existing configuration
      await ctx.db.patch(existing._id, {
        publicationName: args.publicationName,
        category: args.category,
        ingestionMethod: args.ingestionMethod,
        wordpressUrl: args.wordpressUrl,
        rssFeeds: args.rssFeeds,
        faviconStorageId: args.faviconStorageId,
        faviconUrl: faviconUrl,
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
        faviconStorageId: args.faviconStorageId,
        faviconUrl: faviconUrl,
        termsAccepted: args.termsAccepted,
        termsAcceptedAt: args.termsAccepted ? now : undefined,
        createdAt: now,
        updatedAt: now,
      });

      return { success: true, configId };
    }
  },
});
