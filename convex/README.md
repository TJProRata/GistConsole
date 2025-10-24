# Convex Database Schema Documentation

## Overview

This Convex backend provides type-safe database operations for the Gist Console application with strong schema validation and separated concerns between authentication and business data.

## Database Tables

### users (Authentication Data)
**Purpose**: Stores user authentication data synced from Clerk webhooks.

**Fields**:
- `clerkId` (string): Clerk user ID (unique)
- `email` (string): User email address
- `name` (optional string): User's full name
- `imageUrl` (optional string): Profile image URL
- `createdAt` (number): Timestamp of user creation

**Indexes**:
- `by_clerk_id`: Query users by Clerk ID
- `by_email`: Query users by email address

**Related**: See `userProfiles` table for extended business data

---

### userProfiles (Extended User Data)
**Purpose**: Stores business and application-specific user information beyond authentication.

**Fields**:
- `userId` (string): Reference to `users.clerkId`
- `companyName` (optional string): User's company name
- `jobTitle` (optional string): User's job title
- `industry` (optional string): User's industry
- `companySize` (optional enum): "1-10" | "11-50" | "51-200" | "201-1000" | "1000+"
- `subscriptionTier` (enum): "free" | "pro" | "enterprise"
- `isTrialActive` (boolean): Whether trial is active
- `trialEndsAt` (optional number): Trial expiration timestamp
- `preferences` (optional object):
  - `theme`: "light" | "dark" | "system"
  - `emailNotifications`: boolean
  - `language`: ISO 639-1 code (e.g., "en", "es")
- `onboardingCompleted` (boolean): Whether onboarding is complete
- `onboardingStep` (optional number): Current onboarding step
- `createdAt` (number): Profile creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes**:
- `by_user_id`: Query profiles by user ID
- `by_subscription`: Query profiles by subscription tier

**API**: See `convex/userProfiles.ts` for CRUD operations

---

### gistConfigurations (Content Ingestion Settings)
**Purpose**: Stores content ingestion configuration per user.

**Fields**:
- `userId` (string): Reference to user's Clerk ID
- `publicationName` (string): Publication name for AI Search
- `category` (enum): One of 12 valid categories (see schema.ts)
- `ingestionMethod` (enum): "wordpress" | "rss"
- `wordpressUrl` (optional string): WordPress site URL
- `rssFeeds` (optional array): RSS feed configurations
  - `url` (string): Feed URL
  - `username` (optional string): HTTP auth username
  - `password` (optional string): ⚠️ Plain text password
  - `countStart` (optional number): Starting count value
  - `countIncrement` (optional number): Count increment value
  - `customHeaders` (optional record): HTTP headers (key-value pairs)
- `faviconStorageId` (optional Id): Convex storage ID for favicon
- `faviconUrl` (optional string): Public favicon URL
- `termsAccepted` (boolean): Terms acceptance status
- `termsAcceptedAt` (optional number): Terms acceptance timestamp
- `createdAt` (number): Configuration creation timestamp
- `updatedAt` (number): Last update timestamp

**Indexes**:
- `by_user_id`: Query configurations by user ID

**API**: See `convex/gistConfigurations.ts` for operations

---

## Schema Type Safety Enhancements

### Breaking Changes (Strong Typing)
This schema includes **strong enum validation** for better type safety:

1. **category**: Only accepts 12 valid category literals
2. **ingestionMethod**: Only accepts "wordpress" or "rss"
3. **customHeaders**: Properly typed as `record<string, string>`

**Migration Impact**: Existing data with invalid enum values will fail validation. See Migration Guide below.

---

## RSS URL Handling Strategy

### Primary RSS URL Merging
The primary RSS URL field (from the form) is **automatically merged** into `rssFeeds[0]`:

```typescript
// Form submits rssUrl: "https://example.com/feed"
// Backend stores: rssFeeds = [{ url: "https://example.com/feed" }, ...additionalFeeds]
```

**Benefits**:
- No schema changes needed (backward compatible)
- Single source of truth (all RSS URLs in one array)
- Simpler querying and display logic

**Implementation**: See `app/dashboard/page.tsx:194-212` for merge logic

---

## Security Warnings

### ⚠️ Plain Text Password Storage
RSS feed passwords are currently stored **unencrypted** in the database.

**Limitations**:
- Accessible to anyone with database access
- Not recommended for sensitive credentials
- Consider using environment variables for shared credentials

**Future Enhancements**:
- Implement encryption for sensitive fields
- Use Convex encrypted fields when available
- Consider OAuth for RSS authentication

---

## Data Separation Pattern

### Authentication vs. Business Data

**users table** (Clerk sync only):
- Managed by Clerk webhook (`app/api/webhook/clerk/route.ts`)
- Contains only auth-related data
- Auto-synced on user signup/update

**userProfiles table** (Application data):
- Managed by application logic (`convex/userProfiles.ts`)
- Contains business/feature data
- Auto-created on first dashboard visit

**Benefits**:
- Clean separation of concerns
- Can delete auth data without losing business data
- Easy to extend with new fields
- Better data modeling and queries

---

## Migration Guide

### Migrating Existing Data

If you have existing configurations with old schema formats:

```typescript
// Example migration for invalid categories
// convex/migrations.ts (create if needed)
export const migrateCategories = internalMutation({
  handler: async (ctx) => {
    const configs = await ctx.db.query("gistConfigurations").collect();

    for (const config of configs) {
      // Map old values to new enum
      const validCategory = mapOldCategory(config.category);
      if (validCategory !== config.category) {
        await ctx.db.patch(config._id, { category: validCategory });
      }
    }
  },
});
```

**Steps**:
1. Deploy new schema to development environment
2. Query existing data for invalid enum values
3. Run migration utilities to fix invalid data
4. Deploy to production with backward compatibility checks

---

## Usage Examples

### Query User Profile
```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function ProfileSettings() {
  const profile = useQuery(api.userProfiles.getUserProfile);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <p>Company: {profile.companyName}</p>
      <p>Subscription: {profile.subscriptionTier}</p>
    </div>
  );
}
```

### Create/Update User Profile
```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function OnboardingForm() {
  const createProfile = useMutation(api.userProfiles.createUserProfile);

  const handleSubmit = async (data) => {
    await createProfile({
      companyName: data.company,
      jobTitle: data.title,
      subscriptionTier: "free",
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Auto-Create Profile on First Login
```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function Dashboard() {
  const getOrCreateProfile = useMutation(api.userProfiles.getOrCreateUserProfile);

  useEffect(() => {
    // Auto-create profile if it doesn't exist
    getOrCreateProfile();
  }, []);

  return <div>Dashboard</div>;
}
```

---

## API Reference

### Files
- **`convex/schema.ts`**: Schema definitions with strong typing
- **`convex/users.ts`**: User authentication queries and helpers
- **`convex/userProfiles.ts`**: User profile CRUD operations
- **`convex/gistConfigurations.ts`**: Configuration save/load operations

### Resources
- Convex Documentation: https://docs.convex.dev
- Schema Reference: https://docs.convex.dev/database/schemas
- Type Safety: https://docs.convex.dev/database/types

---

## Future Enhancements

After this schema update, consider implementing:

1. **User Onboarding Flow**: Use `onboardingStep` and `onboardingCompleted`
2. **Subscription Management**: Build features around `subscriptionTier`
3. **Feature Flags**: Add `featureAccess` field for A/B testing
4. **User Settings Page**: UI for editing userProfile data
5. **Admin Dashboard**: Manage user profiles and subscriptions
6. **Analytics**: Track onboarding rates and subscription tiers
7. **Encrypted Credentials**: Implement encryption for RSS passwords
8. **Multi-tenant Support**: Add `organizationId` for team access
