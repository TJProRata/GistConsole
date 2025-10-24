# Gist Console - Project Memory

## Project Vision

Two-part system for chat widget management:

1. **Console (Admin Panel)** ✅ (Phase 1 Complete)
   - Clerk authentication with sign in/sign up
   - Protected dashboard route
   - User management via Convex database
   - Widget configuration UI (pending)

2. **Chat Widget Library** (Phase 2 - Not Started)
   - Customizable, embeddable chat widgets
   - Integration with console settings
   - Real-time chat functionality

## Current Implementation Status

### ✅ Completed (Phase 1)

**Authentication:**
- Clerk integration for authentication
- Middleware-based route protection
- User sync to Convex database
- Sign in/sign up modals
- UserButton with account management

**Database:**
- Convex backend configured
- Users table with Clerk ID mapping
- Type-safe queries and mutations
- Helper functions for user access

**UI:**
- Home page with Header component
- Dashboard page (protected route)
- shadcn/ui components integrated
- Responsive layout with Tailwind CSS

**Tech Stack:**
- Next.js 16 with Turbopack
- React 19.2
- TypeScript 5.9.3
- Clerk authentication
- Convex database
- Bun runtime

### 🔄 Current Architecture

```
User Authentication Flow:
User → Clerk Modal → JWT Token → Next.js → Convex Database

Provider Hierarchy:
ClerkProvider
  └─ ConvexProviderWithClerk (connects Clerk auth to Convex)
      └─ App Components

Middleware Protection:
Request → middleware.ts → Check auth → Allow/Redirect
```

### 📋 Pending Tasks

**Phase 1 Completion:**
- [ ] Widget configuration UI in dashboard
- [ ] Widget settings CRUD operations
- [ ] Widget preview component

**Phase 2 (Chat Widget Library):**
- [ ] Design widget architecture
- [ ] Build embeddable widget component
- [ ] Real-time chat functionality
- [ ] Widget customization API
- [ ] Documentation for widget integration

## Key Files

**Authentication:**
- `middleware.ts` - Route protection
- `app/layout.tsx` - ClerkProvider wrapper
- `app/ConvexClientProvider.tsx` - Clerk + Convex integration
- `components/Header.tsx` - Auth UI (SignIn/SignUp/UserButton)

**Database:**
- `convex/schema.ts` - Users table definition
- `convex/auth.config.ts` - Clerk domain configuration
- `convex/users.ts` - User queries and helpers

**Pages:**
- `app/page.tsx` - Home with auth buttons
- `app/dashboard/page.tsx` - Protected dashboard

## Environment Setup

Required `.env.local` variables:
```bash
# Clerk (Manual)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_DOMAIN=https://calm-turkey-7.clerk.accounts.dev

# Convex (Auto-generated)
CONVEX_DEPLOYMENT=dev:kindly-pigeon-464
NEXT_PUBLIC_CONVEX_URL=https://kindly-pigeon-464.convex.cloud
```

## Migration Notes

**Oct 23, 2025:** Migrated from Convex Auth to Clerk
- **Reason:** Next.js 16 compatibility (Convex Auth had async headers() incompatibility)
- **Changes:** Replaced Convex Auth with Clerk, updated all auth patterns
- **Files Deleted:** `components/auth/*`, `convex/auth.ts`, `convex/http.ts`
- **Files Created:** `middleware.ts`, `components/Header.tsx`, `convex/auth.config.ts`
- **Status:** ✅ Migration successful, app fully functional

## Development Commands

```bash
# Start Convex backend (Terminal 1)
npx convex dev

# Start Next.js frontend (Terminal 2)
bun dev

# Visit
http://localhost:3000
```
