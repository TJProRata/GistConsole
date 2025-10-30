# Widget Deployment & Configuration PRD

**Version:** 1.0
**Date:** October 29, 2025
**Status:** Planning

---

## 1. Overview

### Problem Statement
Current preview flow uses local React components that don't represent the actual production widget. This creates "works in preview, breaks in production" risk and configuration inconsistencies.

### Solution
Deploy widgets as standalone embeddable scripts (IIFE bundles) that can be loaded in an iframe during preview. What users see in preview IS the production widget.

### Goals
- ✅ Preview accuracy: Preview shows actual deployed widget
- ✅ Configuration simplicity: Single source of truth for widget config
- ✅ Deployment reliability: Static CDN hosting with Vercel
- ✅ Bundle efficiency: One bundle per widget type, shared by all users

---

## 2. Current State vs Proposed State

### Current Architecture
```
User → Preview UI → Local React Components → Configuration Props
                                ↓
                        (NOT production widget)
```

**Issues:**
- Config merge conflicts (40+ overlapping properties)
- Three competing seed question formats
- Dimension controls don't match widget behavior
- Placement filtering duplicated in UI and renderer
- Misleading UI for variant-specific features

### Proposed Architecture
```
User → Preview UI (iframe) → Deployed Widget Bundle (CDN)
                                      ↓
                              GistWidget.init(config)
                                      ↓
                              Same code as production
```

**Benefits:**
- Preview = Production (100% accuracy)
- Single config interface (GistWidget.init())
- No component duplication
- Real deployment testing during preview

---

## 3. Technical Architecture

### Bundling Strategy
- **Tool:** Bun 1.3.1
- **Format:** IIFE (Immediately Invoked Function Expression)
- **Output:** One bundle per widget type
  - `womens-world-floating.js`
  - `womens-world-inline.js`
  - `nyt-chat.js` (future)
  - `rufus.js` (future)

### Deployment
- **Platform:** Vercel
- **Method:** Static files (CDN)
- **URLs:**
  - `https://widgets.gist.com/womens-world-floating.js`
  - `https://widgets.gist.com/womens-world-inline.js`
- **Shared:** All users load same bundle, config passed at initialization

### Preview Integration
- **Method:** Iframe sandbox
- **Communication:** PostMessage API for real-time config updates
- **Page:** `/preview/configure` loads iframe with deployed widget

### Configuration Flow
```
1. User configures in preview UI
2. Config sent to iframe via postMessage
3. Widget calls GistWidget.init(config) or GistWidget.update(config)
4. User signs up → config saved to Convex
5. Production embed uses same config from Convex API
```

---

## 4. Widget Configuration Specification

### 4.1 Variant Selection
**User picks ONE variant upfront:**
- `floating` - Collapsible bottom-center widget
- `inline` - Always-expanded embeddable widget

### 4.2 Visual/Branding

#### Colors
- **Primary Color:** Buttons, accents (default: `#3b82f6`)
- **Gradient Start:** Gradient left color (default: `#3b82f6`)
- **Gradient End:** Gradient right color (default: `#8b5cf6`)
- **Text Color:** Widget text (default: `#ffffff`)
- **Background Color:** Widget background (default: rgba with opacity)

#### Branding
- **Logo Upload:**
  - Format: SVG only
  - Size: 1MB max
  - Placement: Hardcoded in widget (implementation detail)
- **Powered by Gist Button:** Always visible, not customizable

### 4.3 Behavior

#### Floating Variant Only
- **Open by Default:** Boolean (collapsed vs expanded on load)
- **Placement:** Bottom-center only (clean up left/right code)

#### Inline Variant
- No unique behavior settings (always expanded, embeds inline)

### 4.4 Content

#### Text Fields
- **Title:** Widget header (default: "Ask Anything")
- **Input Placeholder:** Search input placeholder (default: "Type your question...")
- **Collapsed Text:** Floating button text when collapsed (default: "Need Help?") - *Floating only*

#### Seed Questions
**Floating Variant:**
- **Seed Questions (0-12):** Single list, displays as auto-scroll carousel
- **Storage:** Use `seedQuestionsRow1` field only
- **Behavior:** Merges into single carousel array

**Inline Variant:**
- **Row 1 Questions (0-6):** Top row of seed questions
- **Row 2 Questions (0-6):** Bottom row of seed questions
- **Storage:** Use both `seedQuestionsRow1` and `seedQuestionsRow2`
- **Behavior:** Displays as two static rows

#### Auto-scroll
- **Toggle:** On/off (applies to carousel in floating, both rows in inline)
- **Speed:** Hardcoded (not user-configurable)

### 4.5 API/Functionality

#### Current (Faked)
- **API Key:** Text field (not validated, schema preserved)
- **Enable Streaming:** Toggle (not functional, schema preserved)

#### Future (Real)
- API key validates against Gist backend
- Streaming toggle actually enables/disables streaming responses

---

## 5. User Flow

### 5.1 Preview Flow (New)
```
1. Navigate to /preview/configure
2. Select variant (floating or inline)
3. Configure settings (all on one page):
   - Visual/Branding section
   - Behavior section (if floating)
   - Content section
   - API section (faked)
4. Live preview in iframe updates in real-time
5. Click "Save & Sign Up"
6. Redirect to Clerk sign-up
7. Webhook saves config to Convex
8. User receives embed code for production
```

### 5.2 Config UI Structure (Single Page)
```
┌─────────────────────────────────────────────┐
│ Widget Configuration                        │
├─────────────────────────────────────────────┤
│                                             │
│ [Variant Selection]                         │
│ ○ Floating Widget  ○ Inline Widget         │
│                                             │
│ ━━━ Visual & Branding ━━━                  │
│ Primary Color:      [#3b82f6] 🎨           │
│ Gradient Start:     [#3b82f6] 🎨           │
│ Gradient End:       [#8b5cf6] 🎨           │
│ Text Color:         [#ffffff] 🎨           │
│ Logo Upload:        [Choose SVG] (1MB max) │
│                                             │
│ ━━━ Behavior ━━━ (if floating)             │
│ ☑ Open by default                          │
│                                             │
│ ━━━ Content ━━━                            │
│ Title:              [Ask Anything______]   │
│ Placeholder:        [Type your question...] │
│ Collapsed Text:     [Need Help?______]     │  (if floating)
│                                             │
│ IF FLOATING:                                │
│   Seed Questions (0-12):                    │
│   1. [Question text________________]       │
│   2. [Question text________________]       │
│   [+ Add Question] (up to 12)               │
│                                             │
│ IF INLINE:                                  │
│   Seed Questions Row 1 (0-6):               │
│   1. [Question text________________]       │
│   [+ Add Question] (up to 6)                │
│                                             │
│   Seed Questions Row 2 (0-6):               │
│   1. [Question text________________]       │
│   [+ Add Question] (up to 6)                │
│                                             │
│ ☑ Auto-scroll seed questions               │
│                                             │
│ ━━━ API Settings ━━━                       │
│ API Key:            [••••••••••••••]       │
│ ☑ Enable streaming responses               │
│                                             │
│                    [Save & Sign Up →]      │
└─────────────────────────────────────────────┘

         ┌─────────────────────┐
         │   Live Preview      │
         │   (iframe)          │
         │                     │
         │  [Deployed Widget]  │
         │                     │
         └─────────────────────┘
```

---

## 6. Implementation Tasks

### 6.1 Widget Bundling (Bun)
- [ ] Create `scripts/build-widgets.ts`
  - Build `womens-world-floating.js` from entry point
  - Build `womens-world-inline.js` from entry point
  - Output to `dist/widgets/` directory
- [ ] Create widget entry points:
  - `src/widgets/womens-world-floating/index.tsx`
  - `src/widgets/womens-world-inline/index.tsx`
- [ ] Implement global API:
  - `window.GistWidget.init(config)`
  - `window.GistWidget.update(config)`
  - `window.GistWidget.destroy()`
- [ ] Configure Bun build settings:
  - Format: IIFE
  - Target: Browser
  - Minify: true
  - Splitting: false (single file)

### 6.2 Vercel Deployment
- [ ] Create `vercel.json` configuration:
  - Static file routes for `dist/widgets/*.js`
  - CORS headers for cross-origin embedding
  - Cache headers for CDN optimization
- [ ] Set up deployment workflow:
  - Build widgets during deploy
  - Output to `public/widgets/` directory
  - Verify CDN URLs work

### 6.3 Preview Page Refactor
- [ ] Update `/app/preview/configure/page.tsx`:
  - Remove local component imports
  - Create iframe container for widget preview
  - Implement postMessage communication
  - Debounce config updates to iframe
- [ ] Create iframe page `/app/widget-preview/page.tsx`:
  - Load deployed widget script
  - Listen for config messages
  - Call `GistWidget.init()` on mount
  - Call `GistWidget.update()` on config changes

### 6.4 Configuration Cleanup
- [ ] Remove conflicting code:
  - Delete placement left/right options (keep center only)
  - Remove dimension controls (width/height)
  - Simplify config merge logic (single source)
  - Remove "open by default" UI for inline variant
- [ ] Normalize seed questions:
  - Floating: Use `seedQuestionsRow1` only
  - Inline: Use both `seedQuestionsRow1` + `seedQuestionsRow2`
  - Remove old `seedQuestions` field from schema
- [ ] Update Convex schema:
  - Remove deprecated fields
  - Add `variant` field (floating/inline)
  - Add `logoUrl` field (SVG upload)

### 6.5 UI Updates
- [ ] Single-page config layout:
  - Variant selection at top
  - Conditional sections based on variant
  - Seed questions UI dynamically shows 1 or 2 rows
- [ ] Logo upload component:
  - SVG validation
  - 1MB size limit
  - Upload to Convex storage
- [ ] Remove misleading/unused controls:
  - Hide behavior section for inline variant
  - Hide collapsed text for inline variant

### 6.6 Schema & API
- [ ] Update `convex/schema.ts`:
  ```typescript
  previewConfigurations: defineTable({
    // Core
    variant: v.union(v.literal("floating"), v.literal("inline")),

    // Visual
    primaryColor: v.string(),
    gradientStart: v.string(),
    gradientEnd: v.string(),
    textColor: v.string(),
    backgroundColor: v.string(),
    logoUrl: v.optional(v.string()), // SVG upload

    // Behavior (floating only)
    openByDefault: v.boolean(),

    // Content
    title: v.string(),
    placeholder: v.string(),
    collapsedText: v.optional(v.string()), // Floating only

    // Seed questions
    seedQuestionsRow1: v.array(v.string()), // Floating: 0-12, Inline: 0-6
    seedQuestionsRow2: v.optional(v.array(v.string())), // Inline only: 0-6
    autoScroll: v.boolean(),

    // API (faked for now)
    apiKey: v.optional(v.string()),
    enableStreaming: v.optional(v.boolean()),

    // Metadata
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  ```

### 6.7 Documentation
- [ ] Widget embed guide for end users
- [ ] Configuration API reference
- [ ] Deployment architecture diagram
- [ ] Migration guide from old preview system

---

## 7. Success Criteria

### Functional Requirements
- ✅ Preview loads deployed widget in iframe (not local components)
- ✅ Real-time config updates reflect in preview without reload
- ✅ Widget bundles deploy to Vercel CDN successfully
- ✅ Config saves to Convex on user signup
- ✅ Variant-specific settings show/hide correctly in UI
- ✅ Seed questions behave correctly per variant (1 row vs 2 rows)
- ✅ Logo upload accepts SVG only, 1MB max

### Technical Requirements
- ✅ Widget bundle size <150KB minified (per widget)
- ✅ Preview iframe loads in <500ms
- ✅ Config updates apply in <100ms via postMessage
- ✅ Zero placement/dimension conflicts (code cleaned up)
- ✅ No console errors in production widget

### User Experience
- ✅ Single-page config (no tab switching)
- ✅ Live preview updates feel instant
- ✅ Clear variant selection (floating vs inline)
- ✅ Intuitive seed question management (0-12 or 0-6+0-6)
- ✅ Logo upload with clear format/size requirements

---

## 8. Out of Scope (Future Phases)

- Multiple widget types (NYT Chat, Rufus) - Phase 2
- Real API key validation - Phase 2
- Actual streaming responses - Phase 2
- Analytics dashboard - Phase 3
- Custom domain for widget hosting - Phase 3
- A/B testing for widget variants - Phase 3
- Advanced theming (custom fonts, spacing) - Phase 4

---

## 9. Risks & Mitigation

### Risk: Iframe security issues
**Mitigation:** Use postMessage with origin validation, CSP headers

### Risk: Bundle size bloat (React included)
**Mitigation:** Bun's built-in minification + gzip, target <150KB

### Risk: CORS issues on production
**Mitigation:** Configure Vercel headers early, test with ngrok

### Risk: Config schema changes break existing users
**Mitigation:** Versioned schema, migration scripts, backward compatibility

---

## 10. Timeline Estimate

**Phase 1: Bundling & Deployment (3-5 days)**
- Day 1-2: Bun build scripts + widget entry points
- Day 3: Vercel deployment + CDN testing
- Day 4-5: Global API implementation (init/update/destroy)

**Phase 2: Preview Refactor (2-3 days)**
- Day 1: Iframe integration + postMessage bridge
- Day 2: Config UI single-page layout
- Day 3: Testing & bug fixes

**Phase 3: Cleanup & Polish (2-3 days)**
- Day 1: Remove conflicting code (placement, dimensions)
- Day 2: Normalize seed questions, schema updates
- Day 3: Logo upload, final testing

**Total: 7-11 days**

---

## 11. Appendix: Config Schema Example

```typescript
// Example config passed to GistWidget.init()
{
  // Variant
  variant: "floating", // or "inline"

  // Visual
  primaryColor: "#3b82f6",
  gradientStart: "#3b82f6",
  gradientEnd: "#8b5cf6",
  textColor: "#ffffff",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  logoUrl: "https://storage.convex.cloud/...", // Optional

  // Behavior (floating only)
  openByDefault: true,

  // Content
  title: "Ask Anything",
  placeholder: "Type your question...",
  collapsedText: "Need Help?", // Floating only

  // Seed questions
  seedQuestionsRow1: [
    "What are your hours?",
    "Do you accept insurance?",
    // ... up to 12 for floating, 6 for inline
  ],
  seedQuestionsRow2: [ // Inline only
    "How do I schedule?",
    "What's your location?",
    // ... up to 6
  ],
  autoScroll: true,

  // API (faked)
  apiKey: "gist_1234567890",
  enableStreaming: true,
}
```

---

**End of PRD**
