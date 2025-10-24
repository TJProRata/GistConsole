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
},
  { strictTableNameTypes: true }
);
