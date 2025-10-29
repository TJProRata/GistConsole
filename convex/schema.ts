import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema
 *
 * Type Safety Enhancements (Breaking Changes):
 * - Strong enum validation for category and ingestionMethod
 * - Proper record type for customHeaders
 * - Primary RSS URL merged into rssFeeds[0]
 *
 * Security Warning:
 * - RSS feed passwords stored in plain text (see userProfiles table notes)
 */

export default defineSchema(
  {
  // Users table (synced from Clerk)
  // Purpose: Authentication data only (Clerk webhook sync)
  // Related: userProfiles table for extended business data
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // User Profiles table
  // Purpose: Extended user information beyond authentication
  // Separation: Authentication (users) vs. Business Logic (userProfiles)
  userProfiles: defineTable({
    userId: v.string(), // Reference to users.clerkId

    // Company Information
    companyName: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    industry: v.optional(v.string()),
    companySize: v.optional(
      v.union(
        v.literal("1-10"),
        v.literal("11-50"),
        v.literal("51-200"),
        v.literal("201-1000"),
        v.literal("1000+")
      )
    ),

    // Subscription & Trial
    subscriptionTier: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    isTrialActive: v.boolean(),
    trialEndsAt: v.optional(v.number()),

    // User Preferences
    preferences: v.optional(
      v.object({
        theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
        emailNotifications: v.optional(v.boolean()),
        language: v.optional(v.string()), // ISO 639-1 code (en, es, fr, etc.)
      })
    ),

    // Onboarding
    onboardingCompleted: v.boolean(),
    onboardingStep: v.optional(v.number()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_subscription", ["subscriptionTier"]),

  // Admin Action Logs
  // Purpose: Audit trail for administrative actions
  adminLogs: defineTable({
    adminId: v.id("users"), // Admin who performed action
    action: v.string(), // Description of action
    targetUserId: v.optional(v.id("users")), // User affected by action
    metadata: v.optional(v.any()), // Additional context
    timestamp: v.number(), // When action occurred
  })
    .index("by_admin_id", ["adminId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_target_user", ["targetUserId"]),

  // Gist Answers configurations
  // Purpose: Content ingestion settings per user
  gistConfigurations: defineTable({
    userId: v.string(), // Reference to user's Clerk ID

    // Publication Details
    publicationName: v.string(),

    // Category (Strong enum validation - 12 valid categories)
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

    // Ingestion Method (Strong enum validation)
    ingestionMethod: v.union(
      v.literal("wordpress"),
      v.literal("rss")
    ),

    // WordPress Configuration
    wordpressUrl: v.optional(v.string()),

    // RSS Feeds Configuration
    // Note: Primary RSS URL is stored in rssFeeds[0]
    // Security Warning: Passwords stored in plain text
    // TODO: Implement encryption for sensitive fields
    rssFeeds: v.optional(
      v.array(
        v.object({
          url: v.string(),
          username: v.optional(v.string()),
          password: v.optional(v.string()), // ⚠️ Plain text - security concern
          countStart: v.optional(v.number()),
          countIncrement: v.optional(v.number()),
          // Custom HTTP headers (key-value pairs)
          customHeaders: v.optional(v.record(v.string(), v.string())),
        })
      )
    ),

    // Favicon
    faviconStorageId: v.optional(v.id("_storage")),
    faviconUrl: v.optional(v.string()),

    // Terms & Conditions
    termsAccepted: v.boolean(),
    termsAcceptedAt: v.optional(v.number()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  // Widget Configurations
  // Purpose: Widget appearance and behavior settings
  // Separation: Widget display (widgetConfigurations) vs. Content ingestion (gistConfigurations)
  widgetConfigurations: defineTable({
    userId: v.string(), // Reference to user's Clerk ID
    gistConfigurationId: v.id("gistConfigurations"), // Link to content configuration

    // Widget Type
    widgetType: v.union(
      v.literal("floating"),
      v.literal("rufus"),
      v.literal("womensWorld")
    ),

    // Colors
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    textColor: v.optional(v.string()),
    useGradient: v.optional(v.boolean()),
    gradientStart: v.optional(v.string()),
    gradientEnd: v.optional(v.string()),

    // Dimensions
    width: v.optional(v.number()),
    height: v.optional(v.number()),

    // Behavior
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

    // Icons
    iconUrl: v.optional(v.string()),
    iconStorageId: v.optional(v.id("_storage")),

    // NYT Chat Widget Configuration
    collapsedText: v.optional(v.string()),
    title: v.optional(v.string()),
    placeholder: v.optional(v.string()),
    followUpPlaceholder: v.optional(v.string()),
    suggestionCategories: v.optional(v.array(v.string())),
    brandingText: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_gist_config_id", ["gistConfigurationId"]),

  // Preview Configurations (ephemeral, for unauthenticated users)
  // Purpose: Allow widget preview before sign-up
  // TTL: 24 hours (cleaned up by scheduled job)
  previewConfigurations: defineTable({
    sessionId: v.string(), // UUID for preview session
    apiKey: v.string(), // User's Gist API key (validation permissive for preview)

    // Widget Configuration
    widgetType: v.optional(
      v.union(
        v.literal("floating"),
        v.literal("rufus"),
        v.literal("womensWorld")
      )
    ),

    // Appearance Configuration
    configuration: v.optional(
      v.object({
        // Colors
        primaryColor: v.optional(v.string()),
        secondaryColor: v.optional(v.string()),
        backgroundColor: v.optional(v.string()),
        textColor: v.optional(v.string()),
        useGradient: v.optional(v.boolean()),
        gradientStart: v.optional(v.string()),
        gradientEnd: v.optional(v.string()),

        // Dimensions
        width: v.optional(v.number()),
        height: v.optional(v.number()),

        // Behavior
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

        // Icons
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
        womensWorldVariant: v.optional(v.union(v.literal("inline"), v.literal("floating"))),
      })
    ),

    // Timestamps
    createdAt: v.number(),
    expiresAt: v.number(), // Auto-cleanup after 24 hours
  })
    .index("by_session_id", ["sessionId"])
    .index("by_expiration", ["expiresAt"]),

  // Preview to User Mapping (tracks conversions)
  previewToUserMapping: defineTable({
    sessionId: v.string(), // Preview session ID
    userId: v.string(), // User's Clerk ID after sign-up
    converted: v.boolean(), // Whether preview was converted to user config
    convertedAt: v.optional(v.number()), // When conversion happened
  }).index("by_session_id", ["sessionId"]),
},
  { strictTableNameTypes: true }
);
