# Gist Widget Builder

Chat widget management system: Admin console (Phase 1) + embeddable widget library (Phase 2).

## Stack

**Runtime:** Bun 1.3.1
**Framework:** Next.js 16 (Turbopack) + React 19.2 + TypeScript 5.9.3
**Auth:** Clerk (webhook + client fallback)
**Database:** Convex
**UI:** shadcn/ui + Tailwind CSS

## Status

### ✅ Phase 1 (Complete)
- Clerk auth + protected routes
- Webhook user sync to Convex
- Dashboard with Gist Answers config form
- Users & gistConfigurations tables
- Admin portal with role-based access control
- Admin dashboard: Users, Configurations, Components sections
- Component library management (UI + Widget components)
- Complete widget preview system (interactive demos with code)

### 🔄 Phase 2 (Pending)
- Embeddable chat widget library
- Real-time chat functionality
- Widget customization API
- Analytics dashboard with real data
- Advanced component usage tracking

## Architecture

```
User → Clerk (JWT) → Next.js → Convex
         ↓ webhook
      User Sync
```

**Auth:** Dual-layer (webhook primary, client fallback)
**Routes:** Public: `/`, `/sign-in`, `/sign-up`, `/api/webhook` | Protected: all others
**Providers:** ClerkProvider → ConvexProviderWithClerk → App

## Quick Reference

**Docs:**
- `docs/authentication.md` - Full auth system
- `README.md` - Setup + webhook config

**Key Files:**
- `proxy.ts` - Route protection
- `app/api/webhook/clerk/route.ts` - User sync webhook
- `convex/schema.ts` - Database schema
- `convex/users.ts` - User queries/mutations
- `convex/admin.ts` - Admin authorization & queries
- `convex/components.ts` - Component library queries
- `components/AdminSidebar.tsx` - Admin navigation

**Env Vars:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CONVEX_URL=https://....convex.cloud
```

**Dev:**
```bash
npx convex dev  # Terminal 1
bun dev         # Terminal 2
ngrok http 3000 # Terminal 3 (webhook testing)
```

## Recent Changes

**Oct 24, 2025:** Complete Widget Preview Tab - interactive demos with 18-phase onboarding widget
**Oct 24, 2025:** Added Admin Components Section (UI + Widget component browsing)
**Oct 24, 2025:** Schema migration fix (added role field to existing users)
**Oct 23, 2025:** Clerk webhook integration (fix: user sync reliability)
**Oct 23, 2025:** Migrated Convex Auth → Clerk (Next.js 16 compat)
