# Engineering Handoff Documentation

**Project:** Gist Widget Builder
**Version:** Phase 1 Complete, Phase 2 In Planning
**Last Updated:** November 6, 2025
**Status:** Production-Ready (Admin Console), Development (Embeddable Widgets)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack Details](#tech-stack-details)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Admin Portal](#admin-portal)
7. [Widget Bundling System](#widget-bundling-system)
8. [Work-in-Progress Features](#work-in-progress-features)
9. [Technical Debt & Security Concerns](#technical-debt--security-concerns)
10. [Phase 2 Implementation Plan](#phase-2-implementation-plan)
11. [Developer Onboarding Guide](#developer-onboarding-guide)
12. [Key Architecture Patterns](#key-architecture-patterns)
13. [Troubleshooting Guide](#troubleshooting-guide)
14. [File Structure Reference](#file-structure-reference)
15. [Project Resources](#project-resources)

---

## Executive Summary

### Project Purpose
Gist Widget Builder is a two-part system for creating and managing embeddable chat widgets:
1. **Admin Console** (Phase 1 - Complete): Dashboard for configuring widget appearance, behavior, and content ingestion
2. **Embeddable Widget Library** (Phase 2 - In Development): Standalone IIFE bundles for embedding on third-party websites

### Current Status

#### ✅ Phase 1 Complete
- Clerk authentication with webhook user sync
- Protected routes via Next.js 16 `proxy.ts`
- Admin portal with role-based access control
- Component library management (UI + Widget + Complete Widgets)
- Interactive widget previews with syntax-highlighted code
- Real-time Convex database integration
- Users, Configurations, Analytics sections

#### 🔄 Phase 2 In Progress
- Widget bundling system (working but has issues)
- OpenAI streaming integration (partial)
- Preview flow architecture (needs refactoring)
- Real Gist API integration (currently faked)
- Production widget deployment (planned)

### Tech Stack Summary
- **Runtime:** Bun 1.3.1
- **Framework:** Next.js 16 (Turbopack)
- **UI Library:** React 19.2
- **Language:** TypeScript 5.9.3
- **Auth:** Clerk
- **Database:** Convex
- **Styling:** Tailwind CSS v4 + shadcn/ui

---

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Admin Users          │  Regular Users     │  End Customers │
│  (role: admin)        │  (role: user)      │  (widget views)│
└──────────┬────────────┴────────────┬───────────────┬────────┘
           │                         │               │
           ▼                         ▼               ▼
┌──────────────────────┐  ┌─────────────────┐  ┌────────────┐
│   Admin Portal       │  │   Dashboard     │  │   Widget   │
│   /admin/*           │  │   /dashboard    │  │  (embedded)│
└──────────┬───────────┘  └────────┬────────┘  └─────┬──────┘
           │                       │                  │
           └───────────────────────┴──────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Clerk Authentication      │
                    │   (JWT + Webhook)           │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Next.js 16 App Router     │
                    │   - proxy.ts (protection)   │
                    │   - API routes              │
                    │   - Server Components       │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Convex Database           │
                    │   - Real-time queries       │
                    │   - Server functions        │
                    │   - File storage            │
                    └─────────────────────────────┘
```

### Authentication Flow

```
1. User Signs Up/In → Clerk Modal
                      ↓
2. Clerk Generates JWT Token
                      ↓
3. Webhook Fires → /api/webhook/clerk
                      ↓
4. User Synced to Convex (users table)
                      ↓
5. Client Uses ConvexProviderWithClerk
                      ↓
6. Authenticated Queries to Convex
```

**Dual-Layer Auth:**
- **Primary:** Clerk webhook → immediate Convex sync
- **Fallback:** Client-side `useUserSync` hook (reliability)

### Data Flow

```
User Action → React Component → Convex Mutation/Query
                                       ↓
                              Convex Real-time Update
                                       ↓
                              UI Re-renders (optimistic)
```

---

## Tech Stack Details

### Core Technologies

| Component | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Bun** | 1.3.1 | JavaScript runtime & package manager | Ultra-fast, drop-in Node.js replacement |
| **Next.js** | 16.0.0 | React framework | Turbopack bundler, async APIs, RSC |
| **React** | 19.2.0 | UI library | `<Activity>`, `useEffectEvent`, Actions API |
| **TypeScript** | 5.9.3 | Type safety | `import defer`, `node20` resolution |
| **Clerk** | 6.34.0 | Authentication | JWT tokens, webhooks, pre-built UI |
| **Convex** | 1.18.0 | Backend database | Real-time, type-safe, serverless |
| **Tailwind CSS** | 4.x | Styling | Utility-first, JIT compilation |
| **shadcn/ui** | Latest | Component library | Radix primitives, CVA variants |

### Key Dependencies

**UI & Interactions:**
- `@radix-ui/*` - Headless accessible components
- `framer-motion` - Animations
- `lucide-react` - Icons
- `embla-carousel-react` - Carousel components

**Forms & Validation:**
- `react-hook-form` - Form management
- `zod` - Schema validation
- `@hookform/resolvers` - Form resolvers

**Development Tools:**
- `openai` - OpenAI API integration
- `svix` - Webhook verification
- `react-syntax-highlighter` - Code highlighting

### Framework-Specific Features

**Next.js 16:**
- `proxy.ts` replaces `middleware.ts` for route protection
- All request APIs are async: `params`, `searchParams`, `cookies()`, `headers()`
- React Server Components by default
- Turbopack for faster builds

**React 19.2:**
- `<Activity>` component for visibility control
- `useEffectEvent` for non-reactive Effect logic
- Actions API for async transitions
- `ref` as direct prop (no `forwardRef`)

**TypeScript 5.9.3:**
- `import defer` for lazy loading
- `node20` module resolution
- Cached type instantiations (better performance)

---

## Database Schema

### Overview
Convex database with 7 tables managing users, configurations, widgets, and admin features.

### Tables

#### 1. `users` - Authentication Data
**Purpose:** Clerk user sync (webhook primary, client fallback)

```typescript
{
  clerkId: string,           // Clerk user ID (unique)
  email: string,             // User email
  name?: string,             // Display name
  imageUrl?: string,         // Profile picture
  role: "user" | "admin",    // Access level
  createdAt: number          // Timestamp
}
```

**Indexes:** `by_clerk_id`, `by_email`, `by_role`

#### 2. `userProfiles` - Extended User Data
**Purpose:** Business logic and user preferences (separate from auth)

```typescript
{
  userId: string,                    // Reference to users.clerkId

  // Company Info
  companyName?: string,
  jobTitle?: string,
  industry?: string,
  companySize?: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+",

  // Subscription
  subscriptionTier: "free" | "pro" | "enterprise",
  isTrialActive: boolean,
  trialEndsAt?: number,

  // Preferences
  preferences?: {
    theme?: "light" | "dark" | "system",
    emailNotifications?: boolean,
    language?: string  // ISO 639-1 code
  },

  // Onboarding
  onboardingCompleted: boolean,
  onboardingStep?: number,

  createdAt: number,
  updatedAt: number
}
```

**Indexes:** `by_user_id`, `by_subscription`

#### 3. `adminLogs` - Audit Trail
**Purpose:** Track administrative actions for security/compliance

```typescript
{
  adminId: Id<"users">,        // Admin who performed action
  action: string,              // Description of action
  targetUserId?: Id<"users">,  // Affected user (if applicable)
  metadata?: any,              // Additional context
  timestamp: number            // When action occurred
}
```

**Indexes:** `by_admin_id`, `by_timestamp`, `by_target_user`

#### 4. `gistConfigurations` - Content Ingestion Settings
**Purpose:** Configure RSS/WordPress content sources per user

```typescript
{
  userId: string,                    // Reference to user's Clerk ID
  publicationName: string,           // Publication display name
  category: "Academic" | "Books" | "Business" | "gpa_publisher" |
            "Health" | "Lifestyle" | "News" | "Other" |
            "ProRata Internal" | "Reference" | "Sports" | "Uncategorized",
  ingestionMethod: "wordpress" | "rss",

  // WordPress Config
  wordpressUrl?: string,

  // RSS Feeds Config
  rssFeeds?: [{
    url: string,
    username?: string,
    password?: string,            // ⚠️ PLAIN TEXT - Security concern!
    countStart?: number,
    countIncrement?: number,
    customHeaders?: Record<string, string>
  }],

  // Favicon
  faviconStorageId?: Id<"_storage">,
  faviconUrl?: string,

  // Terms
  termsAccepted: boolean,
  termsAcceptedAt?: number,

  createdAt: number,
  updatedAt: number
}
```

**⚠️ Security Warning:** RSS passwords stored in plain text (line 132 of schema.ts). TODO: Implement encryption.

**Indexes:** `by_user_id`

#### 5. `widgetConfigurations` - Widget Appearance & Behavior
**Purpose:** Widget display settings (separate from content ingestion)

```typescript
{
  userId: string,                              // Reference to user's Clerk ID
  gistConfigurationId: Id<"gistConfigurations">, // Link to content config

  widgetType: "floating" | "rufus" | "womensWorld",

  // Colors
  primaryColor?: string,
  secondaryColor?: string,
  backgroundColor?: string,
  textColor?: string,
  useGradient?: boolean,
  gradientStart?: string,
  gradientEnd?: string,

  // Behavior
  placement?: "bottom-right" | "bottom-left" | "bottom-center" |
              "top-right" | "top-left",
  openByDefault?: boolean,

  // Deprecated (backward compatibility)
  width?: number,                    // ⚠️ No longer used in UI
  height?: number,                   // ⚠️ No longer used in UI

  // Icons
  iconUrl?: string,
  iconStorageId?: Id<"_storage">,
  logoUrl?: string,

  // NYT Chat Widget
  collapsedText?: string,
  title?: string,
  placeholder?: string,
  followUpPlaceholder?: string,
  suggestionCategories?: string[],
  brandingText?: string,

  // Women's World Widget
  seedQuestionsRow1?: string[],      // Floating: 0-12, Inline: 0-6
  seedQuestionsRow2?: string[],      // Inline only: 0-6
  autoScroll?: boolean,
  variant?: "inline" | "floating",
  enableStreaming?: boolean,

  // Deprecated Women's World fields (backward compatibility)
  seedQuestions?: string[],          // ⚠️ Replaced by Row1/Row2
  autoScrollInterval?: number,       // ⚠️ Replaced by autoScroll
  womensWorldVariant?: "inline" | "floating", // ⚠️ Replaced by variant

  createdAt: number,
  updatedAt: number
}
```

**Indexes:** `by_user_id`, `by_gist_config_id`

#### 6. `previewConfigurations` - Ephemeral Preview Sessions
**Purpose:** Allow widget preview before sign-up (24h TTL)

```typescript
{
  sessionId: string,            // UUID for preview session
  apiKey: string,               // User's Gist API key (validation permissive)
  widgetType?: "floating" | "rufus" | "womensWorld",
  configuration?: {
    // Same structure as widgetConfigurations
    // All fields optional for flexible preview
  },
  createdAt: number,
  expiresAt: number             // Auto-cleanup after 24 hours
}
```

**Indexes:** `by_session_id`, `by_expiration`

#### 7. `previewToUserMapping` - Conversion Tracking
**Purpose:** Track which preview sessions converted to user accounts

```typescript
{
  sessionId: string,            // Preview session ID
  userId: string,               // User's Clerk ID after sign-up
  converted: boolean,           // Whether preview was converted
  convertedAt?: number          // When conversion happened
}
```

**Indexes:** `by_session_id`

### Schema Relationships

```
users (1) ─────── (1) userProfiles
  │
  ├─ (1:N) ─────── adminLogs (as admin)
  ├─ (1:N) ─────── adminLogs (as target)
  ├─ (1:N) ─────── gistConfigurations
  └─ (1:N) ─────── widgetConfigurations

gistConfigurations (1) ─── (N) widgetConfigurations

previewConfigurations (1) ─ (1) previewToUserMapping
```

---

## Authentication System

### Dual-Layer Architecture

**Why Two Layers?**
- **Webhook (Primary):** Immediate sync, reliable for most cases
- **Client Fallback:** Handles webhook failures, network issues, edge cases

### Layer 1: Clerk Webhook (Primary)

**Endpoint:** `/app/api/webhook/clerk/route.ts`

**Flow:**
```
1. User signs up in Clerk
   ↓
2. Clerk fires webhook to /api/webhook/clerk
   ↓
3. Webhook verifies signature (CLERK_WEBHOOK_SECRET)
   ↓
4. Creates/updates user in Convex users table
   ↓
5. User immediately available in app
```

**Events Handled:**
- `user.created` - New user signup
- `user.updated` - Profile changes
- `user.deleted` - Account deletion

**Setup:**
1. Configure webhook URL in Clerk Dashboard
2. Subscribe to user events
3. Copy signing secret to `CLERK_WEBHOOK_SECRET`
4. Test with ngrok for local development

### Layer 2: Client Fallback

**Hook:** `lib/hooks/useUserSync.ts`

**Triggers:**
- First app load after signup
- Webhook failure detection
- User profile changes

**Flow:**
```
1. useUserSync runs on authenticated pages
   ↓
2. Checks if user exists in Convex
   ↓
3. If missing, creates user from Clerk data
   ↓
4. Ensures user always synced
```

### JWT Configuration

**Required Environment Variables:**
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_DOMAIN=https://your-app.clerk.accounts.dev
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev  # Critical!
CLERK_WEBHOOK_SECRET=whsec_...

# Convex (must match Clerk domain)
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev
```

**⚠️ Critical:** `CLERK_JWT_ISSUER_DOMAIN` must be set in BOTH `.env.local` AND Convex Dashboard Environment Variables.

### Route Protection

**File:** `proxy.ts` (replaces `middleware.ts` in Next.js 16)

**Public Routes:**
- `/` - Home page
- `/sign-in` - Clerk sign-in
- `/sign-up` - Clerk sign-up
- `/api/webhook` - Webhooks

**Protected Routes:**
- `/dashboard` - User dashboard
- `/admin` - Admin portal (role check)
- All other routes

**Implementation:**
```typescript
// proxy.ts
export default clerkMiddleware((auth, request) => {
  const isPublicRoute = createRouteMatcher([
    "/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhook"
  ])(request);

  if (!isPublicRoute) {
    auth().protect();
  }
});
```

### Admin Authorization

**Server-Side:** All admin queries use `requireAdmin()` helper in `convex/admin.ts`

```typescript
// convex/admin.ts
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user || user.role !== "admin") {
    throw new Error("Not authorized");
  }

  return user;
}
```

**Client-Side:** Admin layout checks role and redirects non-admins to `/dashboard`

---

## Admin Portal

### Overview
Role-based admin interface at `/admin` with comprehensive management features.

### Features

#### 1. Dashboard (`/admin`)
- User statistics (total, new today, admins)
- Configuration statistics (total, by widget type, inactive)
- Component library statistics (UI components, widget components, complete widgets)
- Quick actions and navigation

#### 2. User Management (`/admin/users`)
- View all users with search/filter
- Display name, email, role, join date
- Future: Edit roles, suspend accounts

#### 3. Configuration Management (`/admin/configurations`)
- View all widget configurations
- Search by publication name
- Filter by category (12 categories)
- View configuration details

#### 4. Component Library (`/admin/components`)
- **Overview** (`/admin/components`): Statistics for all component types
- **UI Components** (`/admin/components/ui-components`): Browse shadcn/ui components with search
- **Widget Components** (`/admin/components/widgets`): Browse widget components by category
  - Icons
  - Animations
  - AI Elements
  - Ask Anything
  - **Complete Widgets** (full implementations)

#### 5. Complete Widget Previews
Interactive demos with live functionality:

**Onboarding Widget** (`/admin/components/widgets/complete/onboarding-widget`):
- 18-phase multi-step onboarding flow
- Form validation, search, results, paywall
- Dark mode toggle
- Syntax-highlighted code with copy-to-clipboard

**Women's World Widget** (`/admin/components/widgets/complete/answers`):
- Health Q&A widget with auto-scrolling carousel
- Glassmorphism input styling (40px pill radius)
- Hover-to-pause carousel functionality
- Click pill to populate input

#### 6. Analytics (`/admin/analytics`)
- Placeholder UI (not connected to real data)
- Future: Usage metrics, conversion rates, widget performance

#### 7. Settings (`/admin/settings`)
- Placeholder UI (system-wide preferences)
- Future: Default configurations, feature flags

### Setting Up First Admin User

**Step-by-Step:**
1. Start Convex dev server: `npx convex dev`
2. Sign in to app (creates user record)
3. Open [Convex Dashboard](https://dashboard.convex.dev)
4. Navigate to Data → `users` table
5. Find your user by email
6. Click "Edit" (pencil icon)
7. Change `role` from `"user"` to `"admin"`
8. Click "Save"
9. Refresh app → "Admin Portal" button appears

### Security

**Authorization:**
- Server-side: All queries use `requireAdmin()` (database-level enforcement)
- Client-side: Admin layout redirects non-admins
- Immutable roles: Only changeable via Convex Dashboard

**Audit Trail:**
- All admin actions logged to `adminLogs` table
- Includes admin ID, action, target user, metadata, timestamp

---

## Widget Bundling System

### Current Implementation

**Status:** ✅ Working but has issues (bundle size, architecture mismatch)

### Architecture

**Bundler:** Bun 1.3.1
**Format:** IIFE (Immediately Invoked Function Expression)
**Output:** One bundle per widget type

### Build Process

**Script:** `scripts/build-widgets.ts`

**Steps:**
1. Compile Tailwind CSS (`app/globals.css` → `src/widgets/compiled.css`)
2. Bundle each widget entry point with Bun
3. Inline CSS using custom plugin (`scripts/css-inline-plugin.ts`)
4. Minify (whitespace, identifiers, syntax)
5. Output to `dist/widgets/`
6. Optionally stage for deployment to `deploy/`

**Commands:**
```bash
# Build only
bun run build:widgets

# Build + stage for Vercel
bun run deploy:widgets
```

### Bundle Configuration

```typescript
// scripts/build-widgets.ts
{
  entrypoints: [config.entrypoint],
  outdir: OUTPUT_DIR,
  format: "iife",              // Browser-compatible
  target: "browser",
  splitting: false,            // Single file output
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true
  },
  sourcemap: "none",
  external: [],                // Bundle everything (including React)
  plugins: [cssInlinePlugin],
  naming: config.outputName
}
```

### CSS Inlining Plugin

**Purpose:** Eliminate separate CSS file, prevent FOUC

**Mechanism:**
```typescript
// scripts/css-inline-plugin.ts
1. Read CSS file content
2. Minify CSS (remove comments, whitespace)
3. Escape special characters for JS string
4. Generate JS code to inject <style> tag
5. Return as JavaScript module
```

**Result:** CSS automatically injected into `<head>` on widget load

### Widget Entry Points

#### Women's World Floating Widget

**File:** `src/widgets/womens-world-floating/index.tsx`

**Global API:**
```typescript
// Exposed on window.GistWidget
{
  init(config: GistWidgetConfig): void,
  update(config: Partial<GistWidgetConfig>): void,
  destroy(): void
}

// Auto-initialize if window.GistWidgetConfig exists
```

**Usage:**
```html
<script src="https://cdn.example.com/womens-world-floating.js"></script>
<div id="gist-widget-root"></div>
<script>
  GistWidget.init({
    containerId: "gist-widget-root",
    title: "✨ Woman's World Answers",
    seedQuestionsRow1: ["Question 1", "Question 2"],
    enableStreaming: true
  });
</script>
```

#### Women's World Inline Widget

**File:** `src/widgets/womens-world-inline/index.tsx`

**Similar API to floating, variant-specific rendering**

### Bundle Output

**Location:** `dist/widgets/`

**Current Sizes:**
- `womens-world-floating.js` - 662KB (minified)
- `womens-world-inline.js` - 634KB (minified)

**⚠️ Issue:** Exceeds 500KB warning threshold, target is <150KB per PRD

### Deployment

**Configuration:** `vercel.json`

**CORS Headers:**
```json
{
  "source": "/(womens-world-floating|womens-world-inline).js",
  "headers": [
    { "key": "Access-Control-Allow-Origin", "value": "*" },
    { "key": "Content-Type", "value": "application/javascript; charset=utf-8" },
    { "key": "Cache-Control", "value": "public, max-age=3600" }
  ]
}
```

**Build Command:** `bun run build:widgets && bun run build`

**Staging:**
- `deploy/` directory contains final bundles + assets
- `deploy/demo.html` provides test page
- Ready for `cd deploy && vercel --prod`

### Known Issues

#### 1. Bundle Size Exceeds Target
- **Current:** 662KB / 634KB
- **Target:** <150KB per widget (per PRD)
- **Cause:** React 19.2 bundled inline (~100KB base)
- **Potential Solutions:**
  - External React via CDN
  - Code splitting (not compatible with IIFE)
  - Aggressive tree shaking
  - Remove unused dependencies

#### 2. Preview Architecture Mismatch
- **Current:** Preview loads local React components
- **Desired:** Preview loads deployed widget bundles via iframe
- **Impact:** "Works in preview, breaks in production" risk
- **Solution:** Refactor preview flow per PRD section 6.3

#### 3. Configuration Conflicts
- **Issue:** 40+ overlapping widget config properties
- **Examples:**
  - Three seed question formats (seedQuestions, Row1, Row2)
  - Deprecated dimension controls (width/height)
  - Variant-specific features shown for all variants
- **Solution:** Normalize schema per PRD section 6.4

### Alternative Bundler

**File:** `scripts/build-widgets.bun.ts`

**Status:** ⚠️ Unused/older version

**Differences:**
- Outputs to `public/widgets/` instead of `dist/widgets/`
- No CSS inlining plugin
- No deployment staging
- Parallel builds instead of sequential

**Note:** `build-widgets.ts` is the current active bundler

---

## Work-in-Progress Features

### 1. OpenAI Streaming Integration

**Status:** 🔄 Partially Implemented

**Current State:**
- Route exists: `/app/api/openai/stream/route.ts`
- Works for Women's World widget
- Uses GPT-4 model with health-focused system prompt
- Streams responses via Server-Sent Events

**Limitations:**
- Not generalized for other widget types
- Hardcoded system prompt (health/wellness focus)
- No error recovery beyond basic try-catch
- Requires `OPENAI_API_KEY` environment variable

**Code:**
```typescript
// app/api/openai/stream/route.ts
POST /api/openai/stream
Body: { query: string }
Response: text/event-stream (streaming chunks)
```

**TODO:**
- Generalize for multiple widget types
- Make system prompts configurable
- Add retry logic and error recovery
- Implement rate limiting
- Add usage tracking

### 2. Preview Flow Architecture

**Status:** 🔄 Needs Major Refactoring

**Current Architecture (Problematic):**
```
User → Preview UI → Local React Components → Configuration Props
```

**Issues:**
- Preview uses local components, not deployed bundles
- "Works in preview, breaks in production" risk
- Configuration merge conflicts (40+ properties)
- No real testing of production widget

**Desired Architecture (Per PRD):**
```
User → Preview UI (iframe) → Deployed Widget Bundle (CDN)
                                    ↓
                            GistWidget.init(config)
                                    ↓
                            Same code as production
```

**Components Affected:**
- `app/preview/configure/page.tsx` - Configuration UI
- `app/preview/demo/page.tsx` - Preview display
- `components/IframeWidgetPreview.tsx` - Iframe component
- `lib/hooks/usePreviewSession.ts` - Session management

**Required Changes:**
1. Create iframe sandbox for widget preview
2. Implement postMessage bridge for config updates
3. Load deployed bundles (not local components)
4. Debounce config updates to iframe
5. Handle iframe security (origin validation, CSP)

**Reference:** `docs/widget-deployment-prd.md` section 2 & 6.3

### 3. Widget Configuration System

**Status:** 🔄 Needs Normalization

**Issues:**

#### Seed Questions (Three Competing Formats)
```typescript
// Format 1: Deprecated
seedQuestions: string[]

// Format 2: Row-based (inline)
seedQuestionsRow1: string[]  // 0-6
seedQuestionsRow2: string[]  // 0-6

// Format 3: Row-based (floating)
seedQuestionsRow1: string[]  // 0-12 (merged into carousel)
```

**Problem:** UI doesn't know which format to use, causes merge conflicts

#### Deprecated Fields (Backward Compatibility)
```typescript
// Still in schema but unused in UI
width?: number               // ⚠️ Deprecated
height?: number              // ⚠️ Deprecated
autoScrollInterval?: number  // ⚠️ Deprecated → autoScroll boolean
womensWorldVariant?: string  // ⚠️ Deprecated → variant
```

#### Placement Filtering
- Duplicated logic in UI and renderer
- Only "bottom-center" used for floating widgets
- Other placements (left/right) cause layout issues

**TODO:**
- Remove deprecated fields after data migration
- Standardize on single seed question format per variant
- Remove unused placement options
- Simplify configuration merge logic
- Update UI to match actual widget behavior

### 4. Iframe Preview System

**Status:** 🔄 Planned but Not Implemented

**Current:** Direct component rendering
**Planned:** Iframe sandbox with postMessage

**Requirements:**
1. Create `/app/widget-preview/page.tsx` iframe target
2. Load deployed widget script in iframe
3. Listen for config messages from parent
4. Call `GistWidget.init()` on mount
5. Call `GistWidget.update()` on config changes
6. Validate message origins for security
7. Handle iframe errors gracefully

**Benefits:**
- Preview = Production (100% accuracy)
- Real deployment testing
- No component duplication
- Proper sandboxing

**Reference:** `docs/widget-deployment-prd.md` section 3 & 6.3

### 5. Real Gist API Integration

**Status:** 🔄 Currently Faked

**Current State:**
- API key field exists in configuration
- Validation is permissive (any string accepted)
- No actual content ingestion
- `enableStreaming` toggle does nothing (except in Women's World OpenAI integration)

**What's Missing:**
- API key validation against Gist backend
- RSS feed ingestion
- WordPress content ingestion
- Content processing pipeline
- Real-time content updates
- Error handling for failed ingestions

**Schema Ready:**
- `gistConfigurations` table has all fields
- `rssFeeds` array supports multiple feeds
- Custom headers for authenticated feeds

**TODO:**
- Implement Gist API client
- Add API key validation endpoint
- Build content ingestion workers
- Connect configuration to ingestion
- Add ingestion status monitoring
- Implement error recovery

### 6. Analytics Dashboard

**Status:** 🔄 UI Exists, No Real Data

**Current State:**
- Route: `/admin/analytics`
- Shows placeholder UI
- No database connection
- No metrics collection

**Planned Features:**
- Widget usage statistics
- User engagement metrics
- Conversion rates (preview → signup)
- API call volume
- Error rates
- Performance metrics

**TODO:**
- Define analytics schema
- Implement event tracking
- Connect UI to real data
- Add data visualizations
- Implement date range filtering
- Add export functionality

### 7. RSS Password Encryption

**Status:** ⚠️ Security Issue - Plain Text Storage

**Current:** Passwords stored in plain text in `convex/schema.ts:132`

**Code:**
```typescript
// convex/schema.ts line 131-132
password?: v.optional(v.string()), // ⚠️ Plain text - security concern
// TODO: Implement encryption for sensitive fields
```

**Required:**
1. Implement encryption at rest
2. Use Convex secrets or external key management
3. Encrypt before storing in database
4. Decrypt only when needed for ingestion
5. Add migration to encrypt existing passwords
6. Update schema to indicate encrypted field

**Priority:** 🔴 High - Security vulnerability

---

## Technical Debt & Security Concerns

### Security Issues

#### 1. Plain Text Password Storage 🔴 CRITICAL

**Location:** `convex/schema.ts:132`

**Issue:**
```typescript
rssFeeds: v.optional(v.array(v.object({
  url: v.string(),
  username: v.optional(v.string()),
  password: v.optional(v.string()),  // ⚠️ PLAIN TEXT!
  // ...
})))
```

**Risk:** RSS feed passwords exposed if database compromised

**Solution:**
1. Implement encryption using Convex environment variables for key
2. Encrypt passwords before storage
3. Decrypt only when needed for ingestion
4. Migrate existing passwords
5. Update schema documentation

**Priority:** Immediate

#### 2. No Encryption for Sensitive Fields

**Affected Fields:**
- RSS feed passwords
- API keys (currently faked but will be real)
- Custom auth headers

**Recommendation:**
- Use field-level encryption
- Store encryption keys in Convex environment variables
- Implement decrypt-only-when-needed pattern
- Add encryption helpers in `convex/` directory

#### 3. CORS Headers Allow All Origins

**Current:** `vercel.json` has `"Access-Control-Allow-Origin": "*"`

**Risk:** Widget bundles can be embedded anywhere

**Consideration:** This may be intentional for public widget embedding, but consider:
- Rate limiting by origin
- Allowlist for premium customers
- Usage tracking per domain

### Configuration Conflicts

#### 1. Deprecated Fields (Backward Compatibility)

**Deprecated but Still in Schema:**
```typescript
// widgetConfigurations & previewConfigurations
width?: number                    // ⚠️ No longer used in UI
height?: number                   // ⚠️ No longer used in UI
seedQuestions?: string[]          // ⚠️ Replaced by Row1/Row2
autoScrollInterval?: number       // ⚠️ Replaced by autoScroll boolean
womensWorldVariant?: string       // ⚠️ Replaced by variant
```

**Impact:**
- Schema bloat
- Confusion for developers
- Potential merge conflicts
- Backward compatibility burden

**Solution:**
1. Create migration script
2. Move data from old fields to new fields
3. Remove deprecated fields from schema
4. Update TypeScript types
5. Test all existing configurations

#### 2. Seed Questions Format Confusion

**Three Competing Formats:**

```typescript
// Old format (deprecated)
seedQuestions: string[]

// Inline widget (two rows)
seedQuestionsRow1: string[]  // 0-6 questions
seedQuestionsRow2: string[]  // 0-6 questions

// Floating widget (carousel)
seedQuestionsRow1: string[]  // 0-12 questions (merged into carousel)
seedQuestionsRow2: undefined // Not used
```

**Problem:** UI logic is complex and error-prone

**Solution:**
- Standardize on Row1/Row2 format
- Remove `seedQuestions` field
- Document clear variant-specific limits
- Update UI to enforce limits per variant

#### 3. Placement Duplication

**Issue:** Placement logic duplicated in:
- Configuration UI (`app/preview/configure/page.tsx`)
- Widget renderer components
- Schema validation

**Result:**
- Inconsistent behavior
- Maintenance burden
- Easy to introduce bugs

**Solution:**
- Create single source of truth for placement options
- Use TypeScript const assertions for type safety
- Centralize placement logic in shared utility
- Remove unused placement options (only bottom-center for floating)

### Architecture Misalignment

#### 1. Preview vs. Production Widget Mismatch

**Current Architecture:**
```
Preview: React Component (local)
Production: IIFE Bundle (deployed)
```

**Problem:** Different code paths = "works in preview, breaks in production"

**Impact:**
- Configuration bugs only caught in production
- Difficult to reproduce issues
- User confusion when widget behaves differently
- No real deployment testing

**Solution (Per PRD):**
```
Preview: Iframe → Deployed Bundle
Production: <script> → Deployed Bundle
Same code path!
```

**Reference:** `docs/widget-deployment-prd.md` section 2

#### 2. PostMessage Bridge Not Implemented

**Planned:** Real-time config updates via postMessage
**Current:** Direct React prop updates

**Missing:**
- Iframe communication layer
- Message validation
- Debouncing for performance
- Error handling
- Origin validation

**Required for Phase 2**

#### 3. Widget Variants Not Fully Isolated

**Issue:** UI shows options for all variants regardless of selection

**Example:**
- "Open by default" shown for inline variant (doesn't apply)
- Seed question limits not enforced per variant
- Collapsed text shown for inline variant (unused)

**Solution:**
- Conditional UI based on variant selection
- Hide irrelevant options
- Enforce variant-specific validation
- Update schema with variant-specific types

### Bundle Size Issues

#### 1. Exceeds Target Size

**Current:**
- Floating: 662KB
- Inline: 634KB

**Target (Per PRD):**
- <150KB per widget

**Problem:** 4.4x larger than target

**Causes:**
- React 19.2 bundled inline (~100KB)
- All dependencies included
- No code splitting
- Suboptimal tree shaking

**Potential Solutions:**

**Option A: External React (Recommended)**
```html
<!-- Host loads React from CDN -->
<script crossorigin src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
<!-- Widget bundle assumes React is global -->
<script src="https://cdn.example.com/womens-world-floating.js"></script>
```

**Pros:** Reduces bundle to ~50-80KB
**Cons:** Requires host to load React, version coordination

**Option B: Aggressive Tree Shaking**
- Analyze bundle with `esbuild --analyze`
- Remove unused Radix UI primitives
- Minimize third-party dependencies
- Use smaller alternatives (e.g., date-fns → day.js)

**Option C: Code Splitting (Not Compatible with IIFE)**
- Would require ES modules
- Breaks `<script>` tag embedding
- Not recommended for this use case

**Recommendation:** Implement Option A with fallback to bundled React

#### 2. CSS Not Optimized

**Current:** Full Tailwind CSS compiled and inlined

**Issues:**
- Unused classes included
- No PurgeCSS optimization
- Duplicated styles across widgets

**Solution:**
- Use Tailwind JIT with proper content paths
- Purge unused styles per widget
- Extract shared styles
- Consider CSS-in-JS for dynamic styles

#### 3. No Bundle Analysis

**Missing:** Bundle size tracking and analysis

**Needed:**
- `esbuild --analyze` or `webpack-bundle-analyzer` equivalent
- CI/CD checks for bundle size regression
- Per-module size breakdown
- Dependency size audit

---

## Phase 2 Implementation Plan

### Overview

**Reference:** `docs/widget-deployment-prd.md` (comprehensive specification)

**Timeline:** 7-11 days (per PRD section 10)

**Goal:** Production-ready embeddable widgets with accurate preview system

### Priority Tasks

#### 1. Refactor Preview Flow (High Priority)

**Issue:** Preview uses local components, not deployed bundles

**Tasks:**
- [ ] Create `/app/widget-preview/page.tsx` iframe target
- [ ] Implement postMessage bridge for config updates
- [ ] Update `/app/preview/configure/page.tsx` to use iframe
- [ ] Add debouncing for real-time config updates
- [ ] Implement origin validation for security
- [ ] Add loading states and error handling

**Estimated Time:** 2-3 days

**Reference:** PRD section 6.3

#### 2. Implement PostMessage Bridge (High Priority)

**Requirements:**
```typescript
// Parent window (preview UI)
iframe.contentWindow.postMessage({
  type: 'WIDGET_CONFIG_UPDATE',
  config: { primaryColor: '#3b82f6', ... }
}, 'https://trusted-origin.com');

// Iframe (widget preview)
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://trusted-origin.com') return;
  if (event.data.type === 'WIDGET_CONFIG_UPDATE') {
    GistWidget.update(event.data.config);
  }
});
```

**Tasks:**
- [ ] Define message protocol (types, validation)
- [ ] Implement sender in preview UI
- [ ] Implement receiver in widget preview page
- [ ] Add origin whitelist
- [ ] Implement error handling
- [ ] Add message logging for debugging

**Estimated Time:** 1-2 days

**Reference:** PRD section 3

#### 3. Normalize Configuration Schema (High Priority)

**Issues:**
- Deprecated fields (`width`, `height`, `seedQuestions`, etc.)
- Three competing seed question formats
- Variant-specific fields shown for all variants

**Tasks:**
- [ ] Create migration script for deprecated fields
- [ ] Standardize on Row1/Row2 seed question format
- [ ] Remove deprecated fields from schema
- [ ] Update TypeScript types across codebase
- [ ] Add variant-specific validation
- [ ] Test all existing configurations

**Estimated Time:** 2-3 days

**Reference:** PRD section 6.4

#### 4. Reduce Bundle Size (Medium Priority)

**Target:** <150KB per widget (currently 662KB/634KB)

**Tasks:**
- [ ] Implement external React via CDN option
- [ ] Analyze bundle with `esbuild --analyze`
- [ ] Remove unused dependencies
- [ ] Optimize Tailwind CSS purging
- [ ] Implement tree shaking improvements
- [ ] Add bundle size checks to CI/CD
- [ ] Document bundle optimization strategy

**Estimated Time:** 2-3 days

**Reference:** PRD section 6.1

#### 5. Implement Real Gist API Integration (Medium Priority)

**Current:** API key validation is faked

**Tasks:**
- [ ] Create Gist API client
- [ ] Implement API key validation endpoint
- [ ] Build RSS feed ingestion worker
- [ ] Build WordPress ingestion worker
- [ ] Add ingestion status monitoring
- [ ] Implement error recovery
- [ ] Add ingestion logs/analytics

**Estimated Time:** 3-5 days

**Reference:** Out of scope for Phase 2, but foundational

#### 6. Add Encryption for Sensitive Fields (High Priority - Security)

**Issue:** RSS passwords in plain text (`convex/schema.ts:132`)

**Tasks:**
- [ ] Implement encryption helpers in Convex
- [ ] Add encryption key to Convex environment variables
- [ ] Encrypt passwords before storage
- [ ] Create migration to encrypt existing passwords
- [ ] Update schema documentation
- [ ] Add decrypt-only-when-needed pattern

**Estimated Time:** 1-2 days

**Priority:** 🔴 Critical Security Issue

#### 7. Implement Analytics Dashboard (Low Priority)

**Current:** Placeholder UI at `/admin/analytics`

**Tasks:**
- [ ] Define analytics events and schema
- [ ] Implement event tracking
- [ ] Create analytics queries in Convex
- [ ] Connect UI to real data
- [ ] Add data visualizations
- [ ] Implement date range filtering
- [ ] Add export functionality

**Estimated Time:** 3-4 days

**Reference:** Can be deferred to Phase 3

### Success Criteria

**From PRD Section 7:**

#### Functional Requirements
- ✅ Preview loads deployed widget in iframe (not local components)
- ✅ Real-time config updates reflect in preview without reload
- ✅ Widget bundles deploy to Vercel CDN successfully
- ✅ Config saves to Convex on user signup
- ✅ Variant-specific settings show/hide correctly in UI
- ✅ Seed questions behave correctly per variant
- ✅ Logo upload accepts SVG only, 1MB max

#### Technical Requirements
- ✅ Widget bundle size <150KB minified (per widget)
- ✅ Preview iframe loads in <500ms
- ✅ Config updates apply in <100ms via postMessage
- ✅ Zero placement/dimension conflicts
- ✅ No console errors in production widget

#### User Experience
- ✅ Single-page config (no tab switching)
- ✅ Live preview updates feel instant
- ✅ Clear variant selection (floating vs inline)
- ✅ Intuitive seed question management
- ✅ Logo upload with clear format/size requirements

### Timeline Estimate (Per PRD Section 10)

**Phase 1: Bundling & Deployment (3-5 days)**
- ✅ Complete (bundling works, needs optimization)

**Phase 2: Preview Refactor (2-3 days)**
- 🔄 In Progress (this plan)

**Phase 3: Cleanup & Polish (2-3 days)**
- 🔄 Pending (schema migration, encryption)

**Total: 7-11 days**

### Out of Scope (Future Phases)

**From PRD Section 8:**
- Multiple widget types (NYT Chat, Rufus) - Phase 3
- Real streaming for all widgets - Phase 3
- Custom domain for widget hosting - Phase 3
- A/B testing for widget variants - Phase 3
- Advanced theming (fonts, spacing) - Phase 4

---

## Developer Onboarding Guide

### Prerequisites

**System Requirements:**
- **Node.js:** 20.9.0 or higher (LTS)
- **Bun:** 1.3.1 (JavaScript runtime & package manager)
- **Git:** Latest version
- **ngrok:** For webhook testing (optional but recommended)

**Accounts Required:**
- **Clerk:** Authentication provider ([clerk.com](https://clerk.com))
- **Convex:** Backend database ([convex.dev](https://convex.dev))
- **Vercel:** Deployment (optional, for production)
- **OpenAI:** For streaming integration (optional)

### Initial Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd gist-console
```

#### 2. Install Dependencies
```bash
bun install
```

#### 3. Create Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create new application
3. Go to **API Keys** page
4. Copy publishable and secret keys

#### 4. Set Up Convex Project

```bash
npx convex dev
```

This will:
- Create Convex project (or link existing)
- Generate `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Deploy database schema
- Start dev server

#### 5. Configure Environment Variables

Create `.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_DOMAIN=https://your-app.clerk.accounts.dev
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev

# Clerk Webhook (for user sync)
CLERK_WEBHOOK_SECRET=whsec_...

# Convex (auto-generated by npx convex dev)
CONVEX_DEPLOYMENT=dev:...
NEXT_PUBLIC_CONVEX_URL=https://....convex.cloud

# OpenAI (optional - for Women's World widget streaming)
OPENAI_API_KEY=sk-...
```

#### 6. Configure Convex Environment Variable

**⚠️ Critical Step:**

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Click "Add Environment Variable"
5. Add:
   - **Name:** `CLERK_JWT_ISSUER_DOMAIN`
   - **Value:** `https://your-app.clerk.accounts.dev` (same as your `CLERK_DOMAIN`)
6. Click "Save"

This is **required** for Clerk-Convex authentication.

### Development Workflow

#### Terminal Setup (3 Terminals)

**Terminal 1: Convex Dev Server**
```bash
npx convex dev
```
- Watches `convex/` directory
- Auto-deploys schema changes
- Shows query/mutation logs
- Keep running during development

**Terminal 2: Next.js Dev Server**
```bash
bun dev
```
- Starts at `http://localhost:3000`
- Hot module replacement
- React Fast Refresh
- Turbopack bundler

**Terminal 3: ngrok (Webhook Testing)**
```bash
ngrok http 3000
```
- Exposes local server to internet
- Required for Clerk webhooks
- Get HTTPS URL for webhook endpoint

#### Setting Up Webhooks

1. Start ngrok: `ngrok http 3000`
2. Copy HTTPS URL (e.g., `https://abc123.ngrok.io`)
3. Go to [Clerk Dashboard](https://dashboard.clerk.com) → **Webhooks**
4. Click "Add Endpoint"
5. **Endpoint URL:** `https://abc123.ngrok.io/api/webhook/clerk`
6. **Subscribe to events:**
   - `user.created`
   - `user.updated`
   - `user.deleted`
7. Click "Create"
8. Copy **Signing Secret** (starts with `whsec_`)
9. Add to `.env.local` as `CLERK_WEBHOOK_SECRET`
10. Restart Next.js server

#### Testing Webhooks

1. Sign up with test account in app
2. Check ngrok inspector at `http://localhost:4040`
3. Verify webhook request received
4. Check Convex Dashboard → Data → `users` table
5. User should appear immediately

### Building Widgets

#### Development Build
```bash
bun run build:widgets
```

Output: `dist/widgets/`
- `womens-world-floating.js` (662KB)
- `womens-world-inline.js` (634KB)

#### Production Build with Deployment Staging
```bash
bun run deploy:widgets
```

Output: `deploy/`
- Widget bundles
- Static assets (`assets/`)
- Demo HTML page

Then deploy:
```bash
cd deploy
vercel --prod
```

### Key Commands

```bash
# Development
bun dev                 # Start Next.js dev server
npx convex dev         # Start Convex dev server
ngrok http 3000        # Expose local server for webhooks

# Building
bun run build          # Build Next.js app for production
bun run build:widgets  # Build widget bundles only
bun run deploy:widgets # Build + stage for deployment

# Production
bun start              # Start production Next.js server

# Testing (if tests exist)
bun test               # Run test suite

# Linting
bun run lint           # Run ESLint
```

### Setting Up First Admin User

**After First Sign-In:**

1. Ensure Convex dev server is running
2. Sign in to app (creates user record)
3. Open [Convex Dashboard](https://dashboard.convex.dev)
4. Navigate to **Data** → `users` table
5. Find your user by email or `clerkId`
6. Click "Edit" (pencil icon)
7. Change `role` field from `"user"` to `"admin"`
8. Click "Save"
9. Refresh app → "Admin Portal" button appears on home page

### Common Tasks

#### Adding New Widget Component

1. Create component in `components/widget_components/`
2. Export from `components/widget_components/index.ts`
3. Add to appropriate category (icons, animations, ai-elements, etc.)
4. Update type definitions in `components/widget_components/types.ts`
5. Test in admin component library preview

#### Updating Database Schema

1. Modify `convex/schema.ts`
2. Convex dev server auto-deploys changes
3. If adding fields, consider backward compatibility
4. If removing fields, create migration script first
5. Test with existing data

#### Adding New Admin Page

1. Create page in `app/admin/[page-name]/page.tsx`
2. Use `requireAdmin()` helper for authorization
3. Add navigation link to `components/AdminSidebar.tsx`
4. Test with admin and non-admin users

---

## Key Architecture Patterns

### Next.js 16 Patterns

#### Async Request APIs

**All request APIs are now async:**

```typescript
// ✅ Correct
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ query: string }>;
}) {
  const { slug } = await params;
  const { query } = await searchParams;
  return <div>{slug}</div>;
}

// ❌ Incorrect (old pattern)
export default function Page({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { query: string };
}) {
  return <div>{params.slug}</div>;  // Error!
}
```

**Headers, Cookies, DraftMode:**

```typescript
import { cookies, headers, draftMode } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const draft = await draftMode();

  return <div>{cookieStore.get("session")?.value}</div>;
}
```

#### Route Protection (proxy.ts)

**Replaces `middleware.ts` in Next.js 16:**

```typescript
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook"
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### React 19.2 Patterns

#### Activity Component

**Control visibility without unmounting:**

```typescript
import { Activity } from "react";

function TabContainer() {
  const [tab, setTab] = useState("home");

  return (
    <>
      <Activity mode={tab === "home" ? "visible" : "hidden"}>
        <HomePage />  {/* State preserved when hidden */}
      </Activity>

      <Activity mode={tab === "profile" ? "visible" : "hidden"}>
        <ProfilePage />
      </Activity>
    </>
  );
}
```

#### useEffectEvent Hook

**Extract non-reactive logic from Effects:**

```typescript
import { useEffectEvent } from "react";

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification("Connected!", theme);  // Uses latest theme
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on("connected", onConnected);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);  // Only roomId in deps, theme changes don't reconnect
}
```

#### Actions API

**Async functions in transitions:**

```typescript
function UpdateProfile() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await updateProfile(formData);
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="username" />
      <button disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

#### Ref as Prop

**No more `forwardRef`:**

```typescript
// ✅ React 19.2 - Direct ref prop
function Input({ ref }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} />;
}

// ❌ Old way (deprecated but still works)
const Input = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```

### Convex Patterns

#### Real-time Queries

```typescript
// convex/users.ts
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();
  },
});

// Component (auto-updates)
function UserProfile({ userId }: { userId: string }) {
  const user = useQuery(api.users.getUser, { userId });

  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

#### Optimistic Updates

```typescript
// convex/configurations.ts
export const updateConfig = mutation({
  args: {
    configId: v.id("widgetConfigurations"),
    primaryColor: v.string()
  },
  handler: async (ctx, { configId, primaryColor }) => {
    await ctx.db.patch(configId, { primaryColor, updatedAt: Date.now() });
  },
});

// Component with optimistic update
function ColorPicker({ configId }: { configId: Id<"widgetConfigurations"> }) {
  const updateConfig = useMutation(api.configurations.updateConfig);

  const handleChange = (color: string) => {
    // UI updates immediately, syncs to server in background
    updateConfig({ configId, primaryColor: color });
  };

  return <input type="color" onChange={(e) => handleChange(e.target.value)} />;
}
```

#### Server Functions with Authorization

```typescript
// convex/admin.ts
export const requireAdmin = async (
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users">> => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user || user.role !== "admin") {
    throw new Error("Not authorized");
  }

  return user;
};

// Use in admin queries
export const getAllUsers = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);  // Throws if not admin
    return await ctx.db.query("users").collect();
  },
});
```

### shadcn/ui Patterns

#### CVA Variants

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### CSS Variables

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... */
  }
}
```

### TypeScript 5.9.3 Patterns

#### Import Defer

```typescript
// Lazy load expensive modules
import defer * as analytics from './analytics.js';

// Module only executes when accessed
function trackEvent() {
  analytics.track('event');  // Executes now
}
```

#### Node20 Module Resolution

```json
{
  "compilerOptions": {
    "module": "node20",
    "moduleResolution": "node20",
    "target": "es2023"
  }
}
```

#### Type Guards

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}

function handleData(data: unknown) {
  if (isUser(data)) {
    console.log(data.email);  // TypeScript knows data is User
  }
}
```

---

## Troubleshooting Guide

### Webhook Issues

#### Webhook Not Firing

**Symptoms:** User signs up but doesn't appear in Convex `users` table

**Checks:**
1. Verify ngrok is running: `http://localhost:4040`
2. Check webhook URL in Clerk Dashboard matches ngrok URL
3. Confirm `CLERK_WEBHOOK_SECRET` in `.env.local` matches Clerk
4. Restart Next.js server after adding webhook secret
5. Check webhook logs in Clerk Dashboard
6. Verify webhook events are subscribed (user.created, user.updated, user.deleted)

**Fix:**
```bash
# Restart servers in order
1. Stop Next.js server (Ctrl+C in Terminal 2)
2. Restart ngrok (Terminal 3): ngrok http 3000
3. Update webhook URL in Clerk Dashboard with new ngrok URL
4. Restart Next.js (Terminal 2): bun dev
5. Test with new signup
```

#### Webhook 401 Unauthorized

**Cause:** Webhook signature verification failed

**Fix:**
1. Copy signing secret from Clerk Dashboard
2. Update `CLERK_WEBHOOK_SECRET` in `.env.local`
3. Restart Next.js server
4. Test webhook

### Build Errors

#### "Cannot find module" Errors

**Common Causes:**
- Missing `bun install`
- Stale lock file
- Module not in dependencies

**Fix:**
```bash
rm -rf node_modules bun.lockb
bun install
```

#### TypeScript Async API Errors

**Error:** `Property 'slug' does not exist on type 'Promise<{ slug: string }>'`

**Cause:** Forgot to await params/searchParams

**Fix:**
```typescript
// ❌ Wrong
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <div>{params.slug}</div>;  // Error!
}

// ✅ Correct
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div>{slug}</div>;
}
```

#### React 19 Ref Errors

**Error:** `Function components cannot be given refs`

**Cause:** Using old `forwardRef` pattern

**Fix:**
```typescript
// ❌ Old pattern
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// ✅ New pattern
function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

### Widget Bundle Issues

#### CSS Not Compiling

**Error:** `Failed to compile Tailwind CSS`

**Checks:**
1. Verify `tailwind.config.ts` exists
2. Check `app/globals.css` has Tailwind directives
3. Ensure Tailwind is in dependencies

**Fix:**
```bash
# Reinstall Tailwind
bun add -D tailwindcss postcss autoprefixer

# Regenerate config
bunx tailwindcss init -p

# Try build again
bun run build:widgets
```

#### Bun Build Errors

**Error:** `Cannot bundle React module`

**Cause:** Usually import path issues

**Fix:**
```typescript
// Check import paths in widget entry
// ❌ Wrong
import { Widget } from "components/widget";

// ✅ Correct
import { Widget } from "@/components/widget_components/complete/widget";
```

#### Bundle Size Warning

**Warning:** `Bundle size exceeds 500KB target`

**Expected:** Current bundles are 662KB/634KB

**Action:** This is a known issue. See [Bundle Size Issues](#bundle-size-issues) section for planned optimizations.

### Convex Errors

#### "Not authenticated" Errors

**Cause:** JWT issuer domain mismatch

**Fix:**
1. Verify `CLERK_JWT_ISSUER_DOMAIN` in `.env.local`
2. Verify `CLERK_JWT_ISSUER_DOMAIN` in Convex Dashboard → Environment Variables
3. Ensure both match exactly (including https://)
4. Redeploy Convex: `npx convex deploy`

#### Schema Sync Errors

**Error:** `Schema mismatch`

**Cause:** Convex schema out of sync with code

**Fix:**
```bash
# Redeploy schema
npx convex dev

# Or force deploy
npx convex deploy --yes
```

#### Query Returns Null

**Checks:**
1. User exists in database (check Convex Dashboard)
2. Index exists for query
3. Query arguments are correct

**Debug:**
```typescript
// Add logging
export const getUser = query({
  handler: async (ctx, { userId }) => {
    console.log("Querying for userId:", userId);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();
    console.log("Found user:", user);
    return user;
  },
});
```

### Admin Access Issues

#### Admin Portal Button Not Showing

**Cause:** User role is not "admin"

**Fix:**
1. Open [Convex Dashboard](https://dashboard.convex.dev)
2. Go to Data → `users` table
3. Find your user
4. Edit role to "admin"
5. Refresh app

#### Redirected to Dashboard from Admin Page

**Cause:** Client-side role check failing

**Checks:**
1. Clear browser cache
2. Sign out and sign back in
3. Verify role in Convex Dashboard
4. Check browser console for errors

### Preview Configuration Issues

#### Config Not Saving

**Cause:** Preview session expired (24h TTL)

**Fix:**
1. Start new preview session
2. Check browser console for errors
3. Verify Convex connection

#### Config Not Updating in Preview

**Cause:** React state not updating

**Fix:**
1. Check browser console for errors
2. Verify `useQuery` is not returning `undefined`
3. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

#### Variant Selection Not Working

**Cause:** UI showing wrong fields for selected variant

**Temporary Workaround:** This is a known issue. Some fields are shown for all variants. Ignore fields that don't apply to your variant.

**Permanent Fix:** Planned for Phase 2 (see [Phase 2 Implementation Plan](#phase-2-implementation-plan))

---

## File Structure Reference

### Root Directory

```
gist-console/
├── .claude/                    # Claude Code configuration
│   ├── commands/              # Custom slash commands
│   └── settings.json          # Claude settings
├── ai_docs/                   # Framework documentation
│   ├── bun_docs/             # Bun 1.3.1 docs
│   ├── convexdocs/           # Convex integration docs
│   ├── next_js_docs/         # Next.js 16 docs
│   ├── react_docs/           # React 19.2 docs
│   ├── shadcn/               # shadcn/ui best practices
│   └── typescript_docs/      # TypeScript 5.9.3 docs
├── app/                       # Next.js 16 App Router
├── components/                # React components
├── convex/                    # Convex backend
├── deploy/                    # 🔄 Deployment staging (widget bundles)
├── dist/                      # 🔄 Build output (widget bundles)
├── docs/                      # Project documentation
├── lib/                       # Utilities and hooks
├── public/                    # Static assets
├── scripts/                   # Build scripts
├── specs/                     # Feature specifications
├── src/                       # Widget source code
├── widgets/                   # Widget entry points (alternative structure)
├── CLAUDE.md                  # ⚠️ Project summary for AI
├── README.md                  # ⚠️ Main documentation
├── package.json              # Dependencies
├── proxy.ts                   # ⚠️ Route protection (Next.js 16)
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
└── vercel.json               # ⚠️ Deployment config
```

### App Directory (Next.js 16)

```
app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home page
├── globals.css               # Global styles + Tailwind
├── ConvexClientProvider.tsx  # ⚠️ Convex + Clerk integration
├── admin/                     # ⚠️ Admin portal
│   ├── layout.tsx            # Admin layout with sidebar + auth check
│   ├── page.tsx              # Admin dashboard
│   ├── users/                # User management
│   │   └── page.tsx
│   ├── configurations/       # Configuration management
│   │   └── page.tsx
│   ├── components/           # Component library
│   │   ├── page.tsx         # Overview
│   │   ├── ui-components/   # shadcn/ui components
│   │   │   ├── page.tsx     # List view
│   │   │   └── [component]/ # Individual component preview
│   │   └── widgets/          # Widget components
│   │       ├── page.tsx      # Tabbed category view
│   │       ├── [widget]/     # Individual widget preview
│   │       └── complete/     # ⚠️ Complete widget implementations
│   │           ├── answers/page.tsx           # Women's World preview
│   │           ├── onboarding-widget/page.tsx # Onboarding preview
│   │           ├── eater-widget/page.tsx      # (additional widgets)
│   │           └── ...
│   ├── analytics/            # Analytics dashboard (placeholder)
│   │   └── page.tsx
│   └── settings/             # System settings (placeholder)
│       └── page.tsx
├── dashboard/                 # User dashboard
│   ├── layout.tsx            # Dashboard layout
│   ├── page.tsx              # Main dashboard
│   ├── configure-widget/     # Widget configuration
│   │   └── page.tsx
│   └── install-widget/       # Installation guide
│       └── page.tsx
├── preview/                   # ⚠️ Preview flow (needs refactoring)
│   ├── page.tsx              # API key entry
│   ├── select-widget/        # Widget type selection
│   │   └── page.tsx
│   ├── configure/            # ⚠️ Configuration UI (uses local components)
│   │   └── page.tsx
│   └── demo/                 # Preview demo
│       └── page.tsx
└── api/                       # API routes
    ├── webhook/
    │   └── clerk/
    │       └── route.ts      # ⚠️ User sync webhook
    └── openai/
        └── stream/
            └── route.ts      # ⚠️ OpenAI streaming (partial)
```

### Components Directory

```
components/
├── ui/                        # ⚠️ shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── form.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   ├── carousel.tsx
│   └── ... (35+ components)
├── widget_components/         # ⚠️ Widget-specific components
│   ├── types.ts              # Widget type definitions
│   ├── index.ts              # Barrel export
│   ├── icons/                # Icon components
│   │   ├── blue-star.tsx
│   │   ├── thumbs-up.tsx
│   │   ├── thumbs-down.tsx
│   │   └── ...
│   ├── animations/           # Animation components
│   │   └── searching-animation.tsx
│   ├── ai-elements/          # AI widget building blocks
│   │   ├── answer-content.tsx
│   │   ├── attribution-bar.tsx
│   │   ├── feedback-buttons.tsx
│   │   ├── loading-state.tsx
│   │   ├── prompt-input.tsx
│   │   ├── seed-questions-carousel.tsx
│   │   ├── streaming-text.tsx
│   │   └── ... (30+ AI elements)
│   ├── ask-anything/         # Ask Anything widget parts
│   │   └── pricing-card.tsx
│   └── complete/             # ⚠️ Complete widget implementations
│       ├── womens-world-widget.tsx           # Floating variant
│       ├── womens-world-inline-widget.tsx    # Inline variant
│       ├── onboarding-widget.tsx             # 18-phase onboarding
│       ├── nyt-chat-widget.tsx
│       ├── rufus-widget.tsx
│       ├── eater-widget.tsx
│       └── ...
├── AdminSidebar.tsx          # ⚠️ Admin navigation
├── DashboardSidebar.tsx      # User dashboard navigation
├── Header.tsx                # App header with auth UI
├── CodeBlock.tsx             # Syntax-highlighted code
├── ColorGradientPicker.tsx   # Color/gradient picker
├── ComponentPreview.tsx      # Component preview container
├── IframeWidgetPreview.tsx   # ⚠️ Iframe preview (incomplete)
├── PreviewFlowStepper.tsx    # Preview flow steps
├── PreviewWidgetRenderer.tsx # ⚠️ Widget renderer (uses local components)
├── RssFeedsModal.tsx         # RSS feed configuration
├── TermsAndConditionsDialog.tsx
└── VariantControls.tsx       # Widget variant controls
```

### Convex Directory

```
convex/
├── _generated/               # Auto-generated by Convex
│   ├── api.d.ts
│   ├── api.js
│   ├── dataModel.d.ts
│   ├── server.d.ts
│   └── server.js
├── schema.ts                 # ⚠️ Database schema (7 tables)
├── auth.config.ts            # ⚠️ Clerk authentication config
├── users.ts                  # ⚠️ User queries/mutations
├── userProfiles.ts           # User profile operations
├── admin.ts                  # ⚠️ Admin authorization + queries
├── gistConfigurations.ts     # Content ingestion config
├── widgetConfigurations.ts   # Widget appearance config
├── previewConfigurations.ts  # Preview session management
├── components.ts             # Component library queries
├── componentPreviews.ts      # Component preview data
├── files.ts                  # File storage operations
├── migrations.ts             # Database migrations
└── README.md                 # Convex setup instructions
```

### Scripts Directory

```
scripts/
├── build-widgets.ts          # ⚠️ Current widget bundler (Bun)
├── build-widgets.bun.ts      # ⚠️⚠️ Alternative bundler (unused)
├── css-inline-plugin.ts      # ⚠️ CSS inlining plugin for Bun
└── run-migration.ts          # Database migration runner
```

### Widget Source (src/widgets)

```
src/widgets/
├── compiled.css              # 🔄 Compiled Tailwind CSS (build output)
├── womens-world-floating/
│   └── index.tsx             # ⚠️ Floating widget entry point + global API
└── womens-world-inline/
    └── index.tsx             # ⚠️ Inline widget entry point + global API
```

### Alternative Widget Structure (widgets/)

```
widgets/                      # ⚠️⚠️ Alternative structure (not actively used)
├── womens-world/
│   └── index.tsx
├── nyt-chat/
│   └── index.tsx
└── rufus/
    └── index.tsx
```

### Deployment Directories

```
dist/widgets/                 # 🔄 Build output (widget bundles)
├── womens-world-floating.js  # 662KB (built)
└── womens-world-inline.js    # 634KB (built)

deploy/                       # 🔄 Vercel deployment staging
├── .vercel/                 # Vercel config
├── assets/                  # Static assets (SVGs, images)
│   └── svgs/
├── demo.html                # Test/demo page
├── womens-world-floating.js # Staged bundle
└── womens-world-inline.js   # Staged bundle
```

### Documentation

```
docs/
├── authentication.md         # ⚠️ Full auth system docs
├── widget-deployment-prd.md  # ⚠️ Phase 2 PRD (comprehensive)
└── ENGINEERING_HANDOFF.md    # ⚠️ This document
```

### Specifications

```
specs/
├── README.md                 # Spec management guidelines
├── active/                   # Current work
│   └── 2025-11-06-1111-engineering-handoff-documentation.md
├── completed/                # Finished specs
│   └── ...
└── archived/                 # Old/deprecated specs
    └── ...
```

### Library Utilities

```
lib/
├── utils.ts                  # ⚠️ Utility functions (cn helper)
├── citation-utils.ts         # Citation parsing utilities
├── types/
│   └── component-preview.ts  # Component preview types
└── hooks/
    ├── useUserSync.ts        # ⚠️ Client-side user sync (fallback)
    ├── usePreviewSession.ts  # ⚠️ Preview session management
    ├── usePreviewConversion.ts # Preview → user conversion
    └── useStreamingAnswer.ts # OpenAI streaming hook
```

### Legend

- ⚠️ = Critical/important file
- ⚠️⚠️ = Deprecated or needs attention
- 🔄 = Build output or temporary directory

---

## Project Resources

### Dashboards & Services

**Convex Dashboard:**
- URL: [dashboard.convex.dev](https://dashboard.convex.dev)
- Access: Database tables, functions, logs, environment variables
- Use: Set admin users, view/edit data, monitor queries

**Clerk Dashboard:**
- URL: [dashboard.clerk.com](https://dashboard.clerk.com)
- Access: Users, webhooks, API keys, analytics
- Use: Configure webhooks, manage auth settings, view user activity

**Vercel Dashboard:**
- URL: [vercel.com](https://vercel.com)
- Access: Deployments, domains, environment variables, analytics
- Use: Deploy widgets, configure CORS, monitor performance

### Documentation Links

**Internal Docs:**
- [README.md](../README.md) - Setup and quickstart
- [CLAUDE.md](../CLAUDE.md) - Project summary
- [authentication.md](./authentication.md) - Auth system details
- [widget-deployment-prd.md](./widget-deployment-prd.md) - Phase 2 PRD
- [ENGINEERING_HANDOFF.md](./ENGINEERING_HANDOFF.md) - This document

**External Docs:**
- [Next.js 16](https://nextjs.org/docs) - Framework documentation
- [React 19.2](https://react.dev) - React documentation
- [Convex](https://docs.convex.dev) - Backend documentation
- [Clerk](https://clerk.com/docs) - Authentication documentation
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework
- [Bun](https://bun.sh/docs) - Runtime documentation

### Code Style & Conventions

**TypeScript:**
- Strict mode enabled
- No `any` types (use `unknown` with type guards)
- Explicit return types for public APIs
- Prefer `interface` over `type` for objects

**React 19.2:**
- Use `<Activity>` for visibility control
- Use `useEffectEvent` for non-reactive logic
- Use Actions API for async transitions
- Use `ref` as direct prop (no `forwardRef`)

**Next.js 16:**
- Always await params, searchParams, cookies, headers
- Use Server Components by default
- Mark Client Components with `'use client'`
- Use `proxy.ts` for route protection

**shadcn/ui:**
- Maintain CVA variants
- Use CSS variables for theming
- Keep forwardRef patterns for compatibility
- Follow accessibility best practices

**Convex:**
- Use typed queries and mutations
- Implement server-side authorization
- Use indexes for query performance
- Follow real-time patterns

**File Naming:**
- Components: `PascalCase.tsx` or `kebab-case.tsx`
- Utilities: `camelCase.ts` or `kebab-case.ts`
- Types: `types.ts` or `kebab-case.types.ts`
- Tests: `*.test.ts` or `*.spec.ts`

### Testing Requirements

**Current State:** No test suite implemented

**Recommended:**
- **Unit Tests:** Vitest for utilities and hooks
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright for critical user flows
- **Coverage Target:** 80%+ for critical paths

**Priority Testing:**
1. Authentication flow
2. Admin authorization
3. Widget configuration
4. Preview flow
5. Webhook handling

### Deployment Process

**Development:**
```bash
1. npx convex dev        # Deploy schema/functions
2. bun dev               # Start Next.js
3. ngrok http 3000       # Webhook testing
```

**Widget Building:**
```bash
1. bun run build:widgets # Build bundles
2. Verify bundle sizes   # Should be <150KB (currently 662KB/634KB)
3. Test demo.html        # Verify bundles work
```

**Production:**
```bash
1. bun run build:widgets # Build widgets
2. bun run build         # Build Next.js
3. npx convex deploy     # Deploy backend
4. vercel --prod         # Deploy frontend
5. Verify widgets load   # Test production URLs
```

### Support & Questions

**For Questions:**
1. Check this handoff document first
2. Review relevant documentation ([authentication.md](./authentication.md), [widget-deployment-prd.md](./widget-deployment-prd.md))
3. Search codebase for examples
4. Check Convex/Clerk/Next.js docs
5. Contact previous developer (if available)

**For Issues:**
1. Check [Troubleshooting Guide](#troubleshooting-guide)
2. Review error logs (browser console, Convex logs)
3. Test in isolation (minimal reproduction)
4. Document findings
5. Create issue in project repository (if applicable)

**Common Gotchas:**
- Forgetting to await Next.js 16 async APIs
- Not restarting server after env var changes
- Webhook secret mismatch between Clerk and .env.local
- `CLERK_JWT_ISSUER_DOMAIN` not set in Convex Dashboard
- Preview session expiring after 24 hours
- Bundle size warnings (expected until Phase 2 optimization)

---

## Conclusion

This document provides a comprehensive overview of the Gist Widget Builder project as of November 6, 2025. Phase 1 is complete and production-ready. Phase 2 requires significant refactoring of the preview flow and widget bundling system.

**Key Takeaways:**
- ✅ Admin console is stable and feature-complete
- 🔄 Widget bundling works but has bundle size issues
- 🔴 Preview flow needs major refactoring (local components → deployed bundles via iframe)
- 🔴 Security concerns exist (plain text passwords)
- 📋 Comprehensive PRD exists for Phase 2 implementation

**Next Steps:**
1. Review [Phase 2 Implementation Plan](#phase-2-implementation-plan)
2. Read [widget-deployment-prd.md](./widget-deployment-prd.md) for detailed requirements
3. Set up development environment using [Developer Onboarding Guide](#developer-onboarding-guide)
4. Prioritize security fixes (password encryption)
5. Begin preview flow refactoring

Good luck with the project! 🚀
