import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * User Profiles - Extended user information beyond authentication
 *
 * Purpose: Store business logic data separately from auth data
 * - Company information (name, title, industry, size)
 * - Subscription details (tier, trial status)
 * - User preferences (theme, notifications, language)
 * - Onboarding progress
 *
 * Separation of Concerns:
 * - users table: Clerk auth data only (clerkId, email, name, imageUrl)
 * - userProfiles table: Business/application data (this file)
 */

// Get current user's profile
export const getUserProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    return profile;
  },
});

// Create a new user profile
export const createUserProfile = mutation({
  args: {
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
    subscriptionTier: v.optional(
      v.union(
        v.literal("free"),
        v.literal("pro"),
        v.literal("enterprise")
      )
    ),
    preferences: v.optional(
      v.object({
        theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
        emailNotifications: v.optional(v.boolean()),
        language: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Check if profile already exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) {
      throw new Error("User profile already exists. Use updateUserProfile instead.");
    }

    const now = Date.now();

    const profileId = await ctx.db.insert("userProfiles", {
      userId: identity.subject,
      companyName: args.companyName,
      jobTitle: args.jobTitle,
      industry: args.industry,
      companySize: args.companySize,
      subscriptionTier: args.subscriptionTier ?? "free",
      isTrialActive: args.subscriptionTier === "pro" || args.subscriptionTier === "enterprise",
      trialEndsAt: undefined,
      preferences: args.preferences,
      onboardingCompleted: false,
      onboardingStep: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, profileId };
  },
});

// Update existing user profile
export const updateUserProfile = mutation({
  args: {
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
    subscriptionTier: v.optional(
      v.union(
        v.literal("free"),
        v.literal("pro"),
        v.literal("enterprise")
      )
    ),
    isTrialActive: v.optional(v.boolean()),
    trialEndsAt: v.optional(v.number()),
    preferences: v.optional(
      v.object({
        theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
        emailNotifications: v.optional(v.boolean()),
        language: v.optional(v.string()),
      })
    ),
    onboardingCompleted: v.optional(v.boolean()),
    onboardingStep: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) {
      throw new Error("User profile not found. Use createUserProfile first.");
    }

    const now = Date.now();

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: now,
    };

    if (args.companyName !== undefined) updates.companyName = args.companyName;
    if (args.jobTitle !== undefined) updates.jobTitle = args.jobTitle;
    if (args.industry !== undefined) updates.industry = args.industry;
    if (args.companySize !== undefined) updates.companySize = args.companySize;
    if (args.subscriptionTier !== undefined) updates.subscriptionTier = args.subscriptionTier;
    if (args.isTrialActive !== undefined) updates.isTrialActive = args.isTrialActive;
    if (args.trialEndsAt !== undefined) updates.trialEndsAt = args.trialEndsAt;
    if (args.preferences !== undefined) updates.preferences = args.preferences;
    if (args.onboardingCompleted !== undefined) updates.onboardingCompleted = args.onboardingCompleted;
    if (args.onboardingStep !== undefined) updates.onboardingStep = args.onboardingStep;

    await ctx.db.patch(profile._id, updates);

    return { success: true, profileId: profile._id };
  },
});

// Get or create user profile (helper for auto-creation)
export const getOrCreateUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Try to get existing profile
    let profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    // Create profile if it doesn't exist
    if (!profile) {
      const now = Date.now();
      const profileId = await ctx.db.insert("userProfiles", {
        userId: identity.subject,
        subscriptionTier: "free",
        isTrialActive: false,
        onboardingCompleted: false,
        onboardingStep: 0,
        createdAt: now,
        updatedAt: now,
      });

      profile = await ctx.db.get(profileId);
    }

    return profile;
  },
});

// Helper: Mark onboarding as completed
export const completeOnboarding = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    await ctx.db.patch(profile._id, {
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Helper: Update onboarding step
export const updateOnboardingStep = mutation({
  args: {
    step: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    await ctx.db.patch(profile._id, {
      onboardingStep: args.step,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
