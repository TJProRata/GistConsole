---
description: "Prime new session on Women's World Widget streaming implementation"
---

# Gist Console - Women's World Widget Streaming Context

## Project Overview

**Two-part widget system**: Admin console (Phase 1 ✅) + embeddable widget library (Phase 2 🔄)

**Current focus**: Women's World health Q&A widget with OpenAI GPT-4 streaming

---

## Tech Stack

- **Runtime**: Bun 1.3.1
- **Framework**: Next.js 16 (Turbopack) + React 19.2
- **Auth**: Clerk (webhook + client fallback)
- **Database**: Convex (real-time)
- **UI**: shadcn/ui + Tailwind CSS v4
- **AI**: OpenAI GPT-4 (streaming)

---

## Architecture

### Widget Deployment
```
User Browser
  ↓ Load widget from CDN
https://wwwidget.vercel.app/womens-world-floating.js (647KB IIFE bundle)
  ↓ Submit question
  ↓ POST to API server
https://gist-console.vercel.app/api/openai/stream
  ↓ Stream from OpenAI
GPT-4 → Server → Browser (character-by-character)
```

### Build Pipeline
```bash
bun run build:widgets
  ↓
1. Compile Tailwind CSS → src/widgets/compiled.css
2. Bundle React 19.2 widgets (IIFE format)
3. Inline CSS via custom plugin (no external stylesheet)
4. Output to dist/widgets/
   - womens-world-floating.js (647KB)
   - womens-world-inline.js (619KB)
```

---

## Key Files

**Widget Entry Points**:
- `src/widgets/womens-world-floating/index.tsx` - Global API (window.GistWidget)
- `src/widgets/womens-world-inline/index.tsx` - Inline variant

**Components**:
- `components/widget_components/complete/womens-world-widget.tsx` - Main widget
- `components/widget_components/ai-elements/womens-world-answer-display.tsx` - Streaming UI

**Streaming Logic**:
- `lib/hooks/useStreamingAnswer.ts` - Custom hook (ReadableStream API)
- `app/api/openai/stream/route.ts` - Server endpoint (OpenAI integration)

**Build Scripts**:
- `scripts/build-widgets.ts` - Bun bundler (IIFE + CSS inlining)
- `scripts/css-inline-plugin.ts` - Injects CSS as `<style>` tags

**Config**:
- `vercel.json` - Build command + CORS headers
- `.env.local` - OPENAI_API_KEY (local)
- Vercel Dashboard → Environment Variables (production)

---

## Streaming Implementation

### Flow
```
1. User submits question
2. Widget calls handleSubmit(query)
3. useStreamingAnswer hook:
   - POST to apiUrl/api/openai/stream
   - Read stream chunks via ReadableStream
   - Accumulate text incrementally
   - Update UI on every chunk (typewriter effect)
4. API endpoint:
   - Validate query + API key
   - Stream from OpenAI GPT-4
   - Return text/event-stream
5. Answer display:
   - idle → loading → streaming → complete
   - Blinking cursor animation
   - New search button
```

### Key Props
```typescript
GistWidget.init({
  containerId: "womens-world-widget",
  enableStreaming: true,              // ✅ Activates streaming
  apiUrl: "http://localhost:3000",    // ✅ Required for cross-origin
  // Production: "https://gist-console.vercel.app"
  placement: "bottom-center",
  seedQuestionsRow1: [...],
  seedQuestionsRow2: [...]
});
```

---

## Current Status

### ✅ Complete
- Widget bundling (Bun IIFE format)
- CSS inlining (no external stylesheet)
- Global API (init/update/destroy)
- Streaming hook implementation
- API endpoint with OpenAI integration
- CORS headers configured
- Local testing setup
- Production test page created

### 🔄 In Progress
- Vercel environment variable configuration
- Production streaming tests

### ⚠️ Known Issues
- Bundle size: 647KB (target <500KB)
- Missing protocol in apiUrl causes 405 errors
- Dual build scripts (old + new)

---

## Testing

### Local Setup
```bash
# Terminal 1 - Convex
npx convex dev

# Terminal 2 - Next.js
bun dev

# Terminal 3 - Build widgets
bun run build:widgets

# Terminal 4 - Serve test page
python3 -m http.server 8080
open http://localhost:8080/test-widget.html
```

**Test configuration**:
- Widget: `https://wwwidget.vercel.app/womens-world-floating.js` (CDN)
- API: `http://localhost:3000/api/openai/stream` (local)

### Production Setup
```bash
# Deploy main app
git push origin master  # Auto-deploys to gist-console.vercel.app

# Deploy widgets
bun run deploy:widgets
cd deploy
vercel --prod  # Deploys to wwwidget.vercel.app

# Configure env var
# Vercel Dashboard → gist-console → Settings → Environment Variables
# Add: OPENAI_API_KEY=sk-proj-... (all scopes)
# Redeploy

# Test
open https://wwwidget.vercel.app/test-widget-prod.html
```

---

## Environment Variables

### Local (.env.local) ✅
```bash
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_CONVEX_URL=https://kindly-pigeon-464.convex.cloud
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### Production (Vercel Dashboard) ⏳
```bash
OPENAI_API_KEY=sk-proj-... (NEEDS TO BE ADDED)
NEXT_PUBLIC_CONVEX_URL=https://...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

---

## Deployment Targets

**Main App** (gist-console.vercel.app):
- Next.js admin console
- API endpoints (/api/openai/stream)
- Convex integration
- Clerk auth

**Widget CDN** (wwwidget.vercel.app):
- IIFE bundles (womens-world-floating.js, womens-world-inline.js)
- Static assets (SVGs, demo pages)
- Separate Vercel project

---

## Common Commands

```bash
# Build widgets
bun run build:widgets

# Deploy widgets with staging
bun run deploy:widgets

# Start dev
bun dev

# Production build (runs build:widgets first)
bun run build:prod
```

---

## Next Steps

1. Add OPENAI_API_KEY to Vercel environment variables
2. Redeploy gist-console to load env var
3. Test production streaming at https://wwwidget.vercel.app/test-widget-prod.html
4. Optimize bundle size (647KB → <500KB target)
5. Remove duplicate build scripts
6. Implement iframe-based preview (per PRD in docs/widget-deployment-prd.md)

---

## Quick Verification

**Widget works?**
```javascript
// Browser console
window.GistWidget  // Should be object with {init, update, destroy}
```

**Streaming works?**
```bash
# Check logs
[useStreamingAnswer] Stream started successfully
[OpenAI Stream] Stream started successfully
```

**CORS works?**
```bash
# Network tab
/api/openai/stream → Status 200, Type: text/event-stream
Access-Control-Allow-Origin: * ✓
```

---

## Documentation

- `README.md` - Setup instructions
- `CLAUDE.md` - Project summary
- `docs/widget-deployment-prd.md` - Complete deployment architecture
- `ai_docs/next_js_docs/next_js_update.md` - Next.js 16 patterns
- `ai_docs/react_docs/react_update.md` - React 19.2 patterns

---

**Status**: Streaming implementation complete ✅ | Production env var configuration pending ⏳
