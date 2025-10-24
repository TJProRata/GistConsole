import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
  // Users table (synced from Clerk)
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Gist Answers configurations
  gistConfigurations: defineTable({
    userId: v.string(), // Reference to user's Clerk ID
    publicationName: v.string(),
    category: v.string(),
    ingestionMethod: v.string(), // "wordpress" or "rss"
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
    termsAcceptedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),
},
  { strictTableNameTypes: true }
);
