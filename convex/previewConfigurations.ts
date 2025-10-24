import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Configuration object schema for reuse
const configurationSchema = v.object({
  primaryColor: v.optional(v.string()),
  secondaryColor: v.optional(v.string()),
  backgroundColor: v.optional(v.string()),
  textColor: v.optional(v.string()),
  useGradient: v.optional(v.boolean()),
  gradientStart: v.optional(v.string()),
  gradientEnd: v.optional(v.string()),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  placement: v.optional(
    v.union(
      v.literal("bottom-right"),
      v.literal("bottom-left"),
      v.literal("top-right"),
      v.literal("top-left")
    )
  ),
  openByDefault: v.optional(v.boolean()),
  iconUrl: v.optional(v.string()),
  iconStorageId: v.optional(v.id("_storage")),
  // NYT Chat Widget Configuration
  collapsedText: v.optional(v.string()),
  title: v.optional(v.string()),
  placeholder: v.optional(v.string()),
  followUpPlaceholder: v.optional(v.string()),
  suggestionCategories: v.optional(v.array(v.string())),
  brandingText: v.optional(v.string()),

  // Women's World Widget Configuration
  seedQuestions: v.optional(v.array(v.string())),
  autoScrollInterval: v.optional(v.number()),
});

// Create new preview configuration
export const createPreviewConfig = mutation({
  args: {
    sessionId: v.string(),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours from now

    // Check if preview already exists for this session
    const existing = await ctx.db
      .query("previewConfigurations")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      // Update existing preview
      await ctx.db.patch(existing._id, {
        apiKey: args.apiKey,
        expiresAt, // Extend expiration
      });
      return { success: true, previewId: existing._id };
    }

    // Create new preview
    const previewId = await ctx.db.insert("previewConfigurations", {
      sessionId: args.sessionId,
      apiKey: args.apiKey,
      createdAt: now,
      expiresAt,
    });

    return { success: true, previewId };
  },
});

// Update preview widget type
export const updateWidgetType = mutation({
  args: {
    sessionId: v.string(),
    widgetType: v.union(
      v.literal("floating"),
      v.literal("rufus"),
      v.literal("womensWorld")
    ),
  },
  handler: async (ctx, args) => {
    const preview = await ctx.db
      .query("previewConfigurations")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!preview) {
      throw new Error("Preview session not found");
    }

    await ctx.db.patch(preview._id, {
      widgetType: args.widgetType,
    });

    return { success: true };
  },
});

// Update preview configuration
export const updatePreviewConfig = mutation({
  args: {
    sessionId: v.string(),
    configuration: configurationSchema,
  },
  handler: async (ctx, args) => {
    const preview = await ctx.db
      .query("previewConfigurations")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!preview) {
      throw new Error("Preview session not found");
    }

    // Merge with existing configuration
    const updatedConfig = {
      ...preview.configuration,
      ...args.configuration,
    };

    await ctx.db.patch(preview._id, {
      configuration: updatedConfig,
    });

    return { success: true };
  },
});

// Get preview configuration by session ID
export const getPreviewConfig = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const preview = await ctx.db
      .query("previewConfigurations")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!preview) {
      return null;
    }

    // Check if expired (return null but don't delete - cleanup job handles deletion)
    if (preview.expiresAt < Date.now()) {
      return null;
    }

    return preview;
  },
});

// Convert preview configuration to user configuration after sign-up
export const convertPreviewToUserConfig = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Get preview configuration
    const preview = await ctx.db
      .query("previewConfigurations")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!preview) {
      throw new Error("Preview configuration not found");
    }

    // Check if already converted
    const mapping = await ctx.db
      .query("previewToUserMapping")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (mapping?.converted) {
      throw new Error("Preview already converted");
    }

    // Create user configuration
    // Note: This creates a gistConfiguration with minimal data
    // User can fill in the rest in the dashboard
    const now = Date.now();
    const configId = await ctx.db.insert("gistConfigurations", {
      userId: identity.subject,
      publicationName: "My Publication", // Default name
      category: "Uncategorized", // Default category
      ingestionMethod: "rss", // Default method
      termsAccepted: false, // User needs to accept terms
      createdAt: now,
      updatedAt: now,
    });

    // Create widget configuration if preview has widget data
    let widgetConfigId = null;
    if (preview.widgetType && preview.configuration) {
      try {
        widgetConfigId = await ctx.db.insert("widgetConfigurations", {
          userId: identity.subject,
          gistConfigurationId: configId,
          widgetType: preview.widgetType,
          ...preview.configuration,
          createdAt: now,
          updatedAt: now,
        });
      } catch (err) {
        // Log error but don't fail the conversion
        console.error("Failed to create widget configuration:", err);
      }
    }

    // Record conversion
    if (mapping) {
      await ctx.db.patch(mapping._id, {
        userId: identity.subject,
        converted: true,
        convertedAt: now,
      });
    } else {
      await ctx.db.insert("previewToUserMapping", {
        sessionId: args.sessionId,
        userId: identity.subject,
        converted: true,
        convertedAt: now,
      });
    }

    // Delete preview configuration
    await ctx.db.delete(preview._id);

    return { success: true, configId, widgetConfigId };
  },
});

// Delete preview configuration (explicit exit)
export const deletePreviewConfig = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const preview = await ctx.db
      .query("previewConfigurations")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (preview) {
      await ctx.db.delete(preview._id);
    }

    return { success: true };
  },
});

// Cleanup abandoned previews (scheduled function)
// Run every 6 hours
export const cleanupAbandonedPreviews = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();

    // Get all expired previews
    const expiredPreviews = await ctx.db
      .query("previewConfigurations")
      .withIndex("by_expiration")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    // Delete expired previews in batches
    let deletedCount = 0;
    for (const preview of expiredPreviews) {
      await ctx.db.delete(preview._id);
      deletedCount++;
    }

    console.log(`Cleaned up ${deletedCount} abandoned preview configurations`);

    return { success: true, deletedCount };
  },
});
