import { mutation, query } from "./_generated/server";
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
  placement: v.optional(
    v.union(
      v.literal("bottom-right"),
      v.literal("bottom-left"),
      v.literal("bottom-center"),
      v.literal("top-right"),
      v.literal("top-left")
    )
  ),
  openByDefault: v.optional(v.boolean()),

  // Deprecated: Legacy dimension controls (no longer used)
  // Maintained for backward compatibility only
  width: v.optional(v.number()),
  height: v.optional(v.number()),

  iconUrl: v.optional(v.string()),
  iconStorageId: v.optional(v.id("_storage")),
  logoUrl: v.optional(v.string()),
  collapsedText: v.optional(v.string()),
  title: v.optional(v.string()),
  placeholder: v.optional(v.string()),
  followUpPlaceholder: v.optional(v.string()),
  suggestionCategories: v.optional(v.array(v.string())),
  brandingText: v.optional(v.string()),
  // Women's World Widget Configuration
  seedQuestionsRow1: v.optional(v.array(v.string())),
  seedQuestionsRow2: v.optional(v.array(v.string())),
  autoScroll: v.optional(v.boolean()),
  variant: v.optional(v.union(v.literal("inline"), v.literal("floating"))),
  enableStreaming: v.optional(v.boolean()),

  // Deprecated: Old Women's World Widget fields (replaced by new equivalents)
  // Maintained for backward compatibility only
  seedQuestions: v.optional(v.array(v.string())),
  autoScrollInterval: v.optional(v.number()),
  womensWorldVariant: v.optional(v.union(v.literal("inline"), v.literal("floating"))),
});

// Get widget configuration by gist configuration ID
export const getWidgetConfig = query({
  args: {
    gistConfigurationId: v.id("gistConfigurations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Verify user owns the gist configuration
    const gistConfig = await ctx.db.get(args.gistConfigurationId);
    if (!gistConfig) {
      throw new Error("Gist configuration not found");
    }

    if (gistConfig.userId !== identity.subject) {
      throw new Error("Unauthorized access to gist configuration");
    }

    // Get widget configuration
    const widgetConfig = await ctx.db
      .query("widgetConfigurations")
      .withIndex("by_gist_config_id", (q) =>
        q.eq("gistConfigurationId", args.gistConfigurationId)
      )
      .first();

    return widgetConfig;
  },
});

// Get all widget configurations for current user
export const getUserWidgetConfigs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const widgetConfigs = await ctx.db
      .query("widgetConfigurations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();

    // Enrich with gist configuration details
    const enrichedConfigs = await Promise.all(
      widgetConfigs.map(async (config) => {
        const gistConfig = await ctx.db.get(config.gistConfigurationId);
        return {
          ...config,
          gistConfiguration: gistConfig,
        };
      })
    );

    return enrichedConfigs;
  },
});

// Create new widget configuration
export const createWidgetConfig = mutation({
  args: {
    gistConfigurationId: v.id("gistConfigurations"),
    widgetType: v.union(
      v.literal("floating"),
      v.literal("rufus"),
      v.literal("womensWorld")
    ),
    configuration: configurationSchema,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Verify user owns the gist configuration
    const gistConfig = await ctx.db.get(args.gistConfigurationId);
    if (!gistConfig) {
      throw new Error("Gist configuration not found");
    }

    if (gistConfig.userId !== identity.subject) {
      throw new Error("Unauthorized access to gist configuration");
    }

    const now = Date.now();

    const widgetConfigId = await ctx.db.insert("widgetConfigurations", {
      userId: identity.subject,
      gistConfigurationId: args.gistConfigurationId,
      widgetType: args.widgetType,
      ...args.configuration,
      createdAt: now,
      updatedAt: now,
    });

    return widgetConfigId;
  },
});

// Update existing widget configuration
export const updateWidgetConfig = mutation({
  args: {
    widgetConfigId: v.id("widgetConfigurations"),
    configuration: configurationSchema,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Verify user owns the widget configuration
    const widgetConfig = await ctx.db.get(args.widgetConfigId);
    if (!widgetConfig) {
      throw new Error("Widget configuration not found");
    }

    if (widgetConfig.userId !== identity.subject) {
      throw new Error("Unauthorized access to widget configuration");
    }

    await ctx.db.patch(args.widgetConfigId, {
      ...args.configuration,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete widget configuration
export const deleteWidgetConfig = mutation({
  args: {
    widgetConfigId: v.id("widgetConfigurations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Verify user owns the widget configuration
    const widgetConfig = await ctx.db.get(args.widgetConfigId);
    if (!widgetConfig) {
      throw new Error("Widget configuration not found");
    }

    if (widgetConfig.userId !== identity.subject) {
      throw new Error("Unauthorized access to widget configuration");
    }

    await ctx.db.delete(args.widgetConfigId);

    return { success: true };
  },
});

// Helper function to get default configuration by widget type
export function getDefaultConfiguration(
  widgetType: "floating" | "rufus" | "womensWorld"
) {
  const defaults = {
    floating: {
      useGradient: true,
      gradientStart: "#3B82F6",
      gradientEnd: "#8B5CF6",
      width: 400,
      height: 600,
      placement: "bottom-right" as const,
      openByDefault: false,
    },
    rufus: {
      primaryColor: "#FF9900",
      backgroundColor: "#FFFFFF",
      textColor: "#232F3E",
      width: 380,
      height: 500,
      placement: "bottom-right" as const,
      openByDefault: false,
    },
    womensWorld: {
      useGradient: true,
      gradientStart: "#EC4899",
      gradientEnd: "#8B5CF6",
      width: 420,
      height: 650,
      placement: "bottom-right" as const,
      openByDefault: false,
      enableStreaming: false,
    },
  };

  return defaults[widgetType];
}
