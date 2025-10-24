# Widget Feature: NYT Chat Widget - News Q&A Assistant

## Feature Description

A dark-themed chat widget inspired by the New York Times interface for asking questions about news and content. The widget features an elegant design with a compact collapsed state expanding to a full chat interface with search suggestions, autocomplete, streaming text answers, expandable answer sections, and citation pills.

**Collapsed State (Initial):**
- Compact dark button with sparkle icon and NYT logo
- Text: "Ask" with The New York Times branding
- Minimalist, sophisticated design

**Expanded State - Initial View (Image #4):**
- Dark background (#1a1a1a or similar)
- Header: "Ask New York Times Anything!"
- Sparkle icon for visual branding
- 3+ suggestion categories with sparkle icons:
  - "✨ Top Stories"
  - "✨ Breaking News"
  - "✨ Generate a new Wordle"
  - "More" button for additional categories
- Clean search input with placeholder "Ask anything"
- Powered by branding at bottom

**Search Interaction Flow:**
- Click search input → suggestions disappear (Image #5)
- Start typing → autocomplete appears (Image #6)
  - Shows 3 suggested completions based on input
  - Example: "What did Trump say?" → "What did Travis Scott do?" → "What did Trotsky mean by revolution?"
- Search button or Enter submits query

**Answer Loading State (Image #7):**
- Shows submitted query as heading
- Loading indicator: "Searching through articles... books... videos... podcasts"
- Streaming text animation as answer loads
- Answer bounded to 3 lines initially
- Citation pills appear below answer:
  - "✨ Trump impeachment"
  - "✨ Fed interest rate announcement"
  - "✨ Elon Musk vs Trump"
  - "More" button for additional citations

**Answer Expanded State (Image #8, #9):**
- Full answer visible (up to 10 lines)
- If answer exceeds 10 lines → scrollable area
- Citation pills remain visible
- Follow-up input at bottom: "Ask a follow up..."
- Powered by branding

**Visual Design:**
- **Color Scheme**: Dark theme (#1a1a1a background, white text, purple accents)
- **Typography**: Clean sans-serif (Inter, system fonts)
- **Layout**: Centered, card-based with rounded corners
- **Icons**: Sparkle (✨) for branding and categories
- **Animations**: Streaming text, smooth expand/collapse

**Interactions:**
- Click collapsed button to expand
- Click search input to hide suggestions
- Type to trigger autocomplete
- Click autocomplete suggestion or press Enter to search
- Answer streams in with animation
- Click to expand answer from 3 to 10 lines
- Scroll if answer exceeds 10 lines
- Click citation pills to explore related content
- Ask follow-up questions

## User Story

As a **New York Times reader researching news topics**
I want to **ask natural language questions and get AI-powered answers with citations**
So that **I can quickly find relevant information across articles, books, videos, and podcasts**

## Widget Classification

**Category**: complete
**Embeddable**: yes (requires Bun bundling for NYT website integration)
**Complexity**: complex

## Problem Statement

News readers often have specific questions about current events, historical context, or topic explanations that require searching through multiple articles, navigating complex site structures, or piecing together information from various sources. The traditional search interface doesn't understand natural language queries or provide direct answers with proper context and citations.

## Solution Statement

The NYT Chat Widget provides an AI-powered Q&A interface that understands natural language questions and delivers direct answers with streaming text animation. The widget features intelligent autocomplete, answer length control (3 lines → 10 lines → scrollable), citation pills for source attribution, and a sophisticated dark theme matching NYT's premium brand identity. The multi-state interface (collapsed → search → loading → answer → follow-up) creates an engaging conversational experience.

## React Component Design (Thinking in React)

### Step 1: Component Hierarchy

```
NYTChatWidget (root)
├── NYTWidgetCollapsed
│   ├── SparkleIcon
│   └── NYTLogo
└── NYTWidgetExpanded
    ├── WidgetHeader
    │   └── Title ("Ask New York Times Anything!")
    ├── WidgetContent (scrollable)
    │   ├── SuggestionCategories (initial state)
    │   │   ├── CategoryPill × 3+ ("Top Stories", "Breaking News", etc.)
    │   │   └── MoreButton
    │   ├── AutocompleteList (typing state)
    │   │   └── AutocompleteSuggestion × 3
    │   ├── AnswerDisplay (answer state)
    │   │   ├── QueryHeading
    │   │   ├── LoadingIndicator (searching state)
    │   │   ├── StreamingAnswer
    │   │   │   ├── AnswerText (3 lines | 10 lines | scrollable)
    │   │   │   └── ExpandToggle
    │   │   └── CitationPills
    │   │       ├── CitationPill × n
    │   │       └── MoreButton
    │   └── FollowUpInput (answer state)
    └── WidgetFooter
        ├── SearchInput ("Ask anything")
        └── PoweredByBranding
```

**Component Responsibilities:**

- `NYTChatWidget`: Root managing state machine (collapsed | search | loading | answer)
- `NYTWidgetCollapsed`: Compact dark button with NYT branding
- `NYTWidgetExpanded`: Full chat interface container
- `WidgetHeader`: Title with sparkle icon
- `SuggestionCategories`: Initial view with category pills
- `CategoryPill`: Individual suggestion category
- `AutocompleteList`: Dynamic suggestions based on input
- `AutocompleteSuggestion`: Individual autocomplete item
- `AnswerDisplay`: Complete answer section
- `LoadingIndicator`: Multi-stage search animation
- `StreamingAnswer`: Animated text reveal with expand control
- `CitationPills`: Source attribution pills
- `FollowUpInput`: Secondary input for conversation
- `SearchInput`: Main search field
- `PoweredByBranding`: Footer attribution

### Step 2: Static Version (Props Only)

**Component Props:**

- `NYTChatWidget`:
  ```typescript
  {
    isExpanded: boolean;
    onExpandChange: (expanded: boolean) => void;
    collapsedText?: string; // default: "Ask"
    title?: string; // default: "Ask New York Times Anything!"
    suggestionCategories?: string[]; // ["Top Stories", "Breaking News", ...]
    placeholder?: string; // default: "Ask anything"
    followUpPlaceholder?: string; // default: "Ask a follow up..."
    brandingText?: string; // default: "Powered by Gist Answers"
    onSubmit?: (query: string) => void;
    onCategoryClick?: (category: string) => void;
    onCitationClick?: (citation: string) => void;
  }
  ```

- `NYTWidgetExpanded`:
  ```typescript
  {
    title: string;
    suggestionCategories: string[];
    placeholder: string;
    followUpPlaceholder: string;
    brandingText: string;
    currentState: "search" | "loading" | "answer";
    query: string | null;
    answer: string | null;
    citations: string[];
    isLoading: boolean;
    onClose: () => void;
    onSubmit: (query: string) => void;
    onCategoryClick: (category: string) => void;
    onCitationClick: (citation: string) => void;
  }
  ```

- `AutocompleteList`:
  ```typescript
  {
    query: string;
    suggestions: string[];
    onSelect: (suggestion: string) => void;
  }
  ```

- `AnswerDisplay`:
  ```typescript
  {
    query: string;
    answer: string;
    citations: string[];
    isLoading: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onCitationClick: (citation: string) => void;
  }
  ```

- `StreamingAnswer`:
  ```typescript
  {
    text: string;
    isLoading: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    maxLinesCollapsed?: number; // default: 3
    maxLinesExpanded?: number; // default: 10
  }
  ```

- `CitationPills`:
  ```typescript
  {
    citations: string[];
    visibleCount?: number; // default: 3
    onCitationClick: (citation: string) => void;
  }
  ```

### Step 3: Minimal UI State

**Minimal State:**
- `widgetState`: "collapsed" | "search" | "loading" | "answer" - Widget state machine
- `currentQuery`: string - Current search query
- `answer`: string | null - AI response text
- `citations`: string[] - Source citations
- `isAnswerExpanded`: boolean - Answer expanded from 3 to 10 lines
- `autocompleteResults`: string[] - Live autocomplete suggestions

**Derived Values (NOT stored):**
- Show suggestions: `widgetState === "search" && currentQuery === ""`
- Show autocomplete: `widgetState === "search" && currentQuery.length > 0`
- Show answer: `widgetState === "answer" && answer !== null`
- Show loading: `widgetState === "loading"`
- Answer preview (3 lines): derived from `answer` and `isAnswerExpanded`
- Citation count: `citations.length`
- Needs scroll: `answer.split('\n').length > 10`

**Justification:**
- `widgetState` is STATE - represents current UI mode
- `currentQuery` is STATE - user input that changes
- `answer` is STATE - fetched async data
- `citations` is STATE - part of answer response
- `isAnswerExpanded` is STATE - user interaction preference
- `autocompleteResults` is STATE - dynamic async data
- Everything else computed from these pieces

### Step 4: State Location

**State Ownership:**

- `widgetState` lives in `NYTChatWidget` (root) - Controls entire widget flow
- `currentQuery` lives in `NYTWidgetExpanded` - Local to expanded view
- `answer` lives in `NYTWidgetExpanded` - Fetched data for display
- `citations` lives in `NYTWidgetExpanded` - Part of answer response
- `isAnswerExpanded` lives in `AnswerDisplay` - Component-specific UI state
- `autocompleteResults` lives in `NYTWidgetExpanded` - Search-related data

**Reasoning:**
- Root manages collapsed/expanded at highest level
- Expanded state manages search/loading/answer flow
- Answer display manages its own expand/collapse
- Data flows down, event handlers flow up

### Step 5: Inverse Data Flow

**Event Handlers:**

- `NYTChatWidget` passes `onExpandChange` down
  - Collapsed state calls it when clicked
  - Expanded state calls it when closed

- `NYTWidgetExpanded` exposes `onSubmit` prop
  - Parent handles search execution
  - Internal handler updates `currentQuery` state
  - Triggers state transition: search → loading

- `AutocompleteList` exposes `onSelect` prop
  - Parent populates input with selection
  - Auto-submits search

- `AnswerDisplay` exposes `onToggleExpand` prop
  - Parent updates `isAnswerExpanded` state
  - Component re-renders with expanded content

- `CitationPills` exposes `onCitationClick` prop
  - Parent handles navigation/modal

**Data Flow Pattern:**
1. User types in search input → `onChange` updates `currentQuery` → triggers autocomplete fetch
2. User selects autocomplete → `onSelect` updates `currentQuery` → auto-submits
3. Submit triggered → `onSubmit` callback → state transition to "loading" → fetch answer
4. Answer received → state transition to "answer" → display with streaming animation
5. User clicks expand → `onToggleExpand` → `isAnswerExpanded` toggles → re-render
6. User clicks citation → `onCitationClick` → external navigation

## TypeScript Type Definitions

### Prop Interfaces

```typescript
/**
 * Widget state machine type
 */
export type NYTWidgetState = "collapsed" | "search" | "loading" | "answer";

/**
 * NYT Chat Widget Props
 */
export interface NYTChatWidgetProps {
  /** Controls whether the widget is expanded or collapsed */
  isExpanded?: boolean;

  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;

  /** Default expanded state for uncontrolled mode */
  defaultExpanded?: boolean;

  /** Text shown in collapsed button state */
  collapsedText?: string;

  /** Main widget title */
  title?: string;

  /** Suggestion categories for initial view */
  suggestionCategories?: string[];

  /** Search input placeholder */
  placeholder?: string;

  /** Follow-up input placeholder */
  followUpPlaceholder?: string;

  /** Branding text at footer */
  brandingText?: string;

  /** Callback when question is submitted */
  onSubmit?: (query: string) => void;

  /** Callback when category clicked */
  onCategoryClick?: (category: string) => void;

  /** Callback when citation clicked */
  onCitationClick?: (citation: string) => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Expanded State Props
 */
export interface NYTWidgetExpandedProps {
  /** Widget title */
  title: string;

  /** Suggestion categories */
  suggestionCategories: string[];

  /** Search placeholder */
  placeholder: string;

  /** Follow-up placeholder */
  followUpPlaceholder: string;

  /** Branding text */
  brandingText: string;

  /** Current widget state */
  currentState: NYTWidgetState;

  /** Current search query */
  query: string | null;

  /** Answer text */
  answer: string | null;

  /** Citation sources */
  citations: string[];

  /** Loading state */
  isLoading: boolean;

  /** Close handler */
  onClose: () => void;

  /** Submit handler */
  onSubmit: (query: string) => void;

  /** Category click handler */
  onCategoryClick: (category: string) => void;

  /** Citation click handler */
  onCitationClick: (citation: string) => void;
}

/**
 * Autocomplete List Props
 */
export interface AutocompleteListProps {
  /** Current query */
  query: string;

  /** Suggested completions */
  suggestions: string[];

  /** Selection handler */
  onSelect: (suggestion: string) => void;
}

/**
 * Answer Display Props
 */
export interface AnswerDisplayProps {
  /** User's query */
  query: string;

  /** AI response */
  answer: string;

  /** Source citations */
  citations: string[];

  /** Loading state */
  isLoading: boolean;

  /** Answer expanded state */
  isExpanded: boolean;

  /** Toggle expand handler */
  onToggleExpand: () => void;

  /** Citation click handler */
  onCitationClick: (citation: string) => void;
}

/**
 * Streaming Answer Props
 */
export interface StreamingAnswerProps {
  /** Answer text to display */
  text: string;

  /** Loading/streaming state */
  isLoading: boolean;

  /** Expanded state */
  isExpanded: boolean;

  /** Toggle handler */
  onToggleExpand: () => void;

  /** Max lines in collapsed state */
  maxLinesCollapsed?: number;

  /** Max lines in expanded state */
  maxLinesExpanded?: number;
}

/**
 * Citation Pills Props
 */
export interface CitationPillsProps {
  /** Citation sources */
  citations: string[];

  /** Visible count before "More" */
  visibleCount?: number;

  /** Citation click handler */
  onCitationClick: (citation: string) => void;
}

/**
 * Suggestion Categories Props
 */
export interface SuggestionCategoriesProps {
  /** Category labels */
  categories: string[];

  /** Visible count before "More" */
  visibleCount?: number;

  /** Category click handler */
  onCategoryClick: (category: string) => void;
}
```

### State Types

```typescript
/**
 * Widget internal state
 */
export interface NYTChatWidgetState {
  /** Current widget mode */
  widgetState: NYTWidgetState;

  /** Current query text */
  currentQuery: string;

  /** AI response */
  answer: string | null;

  /** Source citations */
  citations: string[];

  /** Answer expansion state */
  isAnswerExpanded: boolean;

  /** Autocomplete suggestions */
  autocompleteResults: string[];

  /** Internal expanded state (uncontrolled mode) */
  internalExpanded: boolean;
}
```

## Relevant Files

### Existing Files to Reference

- **`components/widget_components/complete/rufus-widget.tsx`** - Reference for complete widget, collapsed/expanded pattern, seed questions, input handling

- **`components/widget_components/complete/womens-world-widget.tsx`** - Reference for dark theme, glassmorphism styling, input design

- **`components/widget_components/complete/onboarding-widget.tsx`** - Reference for multi-state widget (phases), complex state machine

- **`components/ui/button.tsx`** - shadcn Button for all interactive elements

- **`components/ui/input.tsx`** - shadcn Input for search field

- **`components/ui/scroll-area.tsx`** - shadcn ScrollArea for answer overflow

- **`components/ui/skeleton.tsx`** - shadcn Skeleton for loading states

- **`components/widget_components/types.ts`** - Type definitions, will be extended with NYT widget types

- **`components/widget_components/index.ts`** - Export barrel, must be updated

- **`app/globals.css`** - Global styles, add NYT dark theme colors

- **`convex/components.ts`** - Component metadata for admin panel

### New Files

- **`components/widget_components/complete/nyt-chat-widget.tsx`** - Main widget component

- **`app/admin/components/widgets/complete/nyt-chat-widget/page.tsx`** - Preview page

- **`specs/nyt-chat-widget.md`** - This specification

## shadcn/ui Components

### Component Reuse Checklist

- [x] Checked `components/ui/` for existing shadcn components
- [x] Checked `components/widget_components/` for existing widget components
- [x] Confirmed the needed functionality is NOT available in existing components
- [x] Verified that creating a variant won't suffice

### Existing Components to Use

**From `components/ui/`:**
- ✅ **Button** - Collapsed trigger, category pills, citation pills, "More" buttons
- ✅ **Input** - Search input and follow-up input
- ✅ **ScrollArea** - Answer overflow scrolling
- ✅ **Skeleton** - Loading states
- ✅ **Card** - Answer container (optional)

### New Components to Add (DISCOURAGED)

**⚠️ No new shadcn components needed**

### Variants of Existing Components (ENCOURAGED)

- Create **NYT dark theme** in `app/globals.css`:
  ```css
  --nyt-dark-bg: 26 26 26; /* #1a1a1a */
  --nyt-dark-text: 255 255 255; /* white */
  --nyt-purple: 147 51 234; /* #9333ea */
  --nyt-gray-600: 75 85 99; /* #4b5563 */
  --nyt-gray-800: 31 41 55; /* #1f2937 */
  ```

- Create **pill button** variant:
  ```css
  .btn-nyt-pill {
    background-color: rgba(147, 51, 234, 0.1);
    color: rgb(147, 51, 234);
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 400;
  }

  .btn-nyt-pill:hover {
    background-color: rgba(147, 51, 234, 0.2);
  }
  ```

- Create **dark input** style:
  ```css
  .input-nyt-dark {
    background-color: rgb(31, 41, 55);
    border: 1px solid rgb(75, 85, 99);
    color: white;
    border-radius: 12px;
  }

  .input-nyt-dark::placeholder {
    color: rgb(156, 163, 175);
  }
  ```

### Custom Widget Components (Only if Necessary)

**Streaming Text Animation Component:**
- Custom component for character-by-character reveal
- Uses `requestAnimationFrame` or interval
- Props: `text`, `speed`, `onComplete`
- Necessary because shadcn doesn't provide animation utilities

## Widget Integration

### Export Configuration

```typescript
// components/widget_components/index.ts

// Add to Complete Widgets section:
export { NYTChatWidget } from "./complete/nyt-chat-widget";

// Add to Types section:
export type {
  NYTChatWidgetProps,
  NYTWidgetExpandedProps,
  AutocompleteListProps,
  AnswerDisplayProps,
  StreamingAnswerProps,
  CitationPillsProps,
  SuggestionCategoriesProps,
  NYTChatWidgetState,
  NYTWidgetState
} from "./types";
```

### Preview Page Integration

**Location:** `app/admin/components/widgets/complete/nyt-chat-widget/page.tsx`

**Demo Features:**
- Toggle collapsed/expanded
- Simulate search → loading → answer flow
- Test autocomplete functionality
- Test answer expansion (3 → 10 lines → scroll)
- Test citation pill clicks
- Dark mode toggle
- Code view with syntax highlighting

**Interactive Controls:**
- Custom suggestion categories
- Answer length slider
- Streaming animation speed
- Custom placeholder text

## Embeddable Widget Configuration

### Bundling Strategy

**Build Script**: `build/nyt-chat-widget.ts`
**Output Format**: IIFE
**Global API**: `window.NYTChatWidget`
**CSS Strategy**: Inline (dark theme embedded)
**Bundle Target**: CDN deployment for NYT website

### Build Configuration

```typescript
// build/nyt-chat-widget.ts
await Bun.build({
  entrypoints: ["./components/widget_components/complete/nyt-chat-widget.tsx"],
  outdir: "./dist/widgets",
  format: "iife",
  target: "browser",
  minify: true,
  splitting: false,
  naming: "nyt-chat-widget.min.js",
  external: [],
  packages: "bundle",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
```

### Client Integration

```html
<!-- NYT Article Page Integration -->
<div id="nyt-chat-widget-root"></div>
<script src="https://cdn.nytimes.com/widgets/nyt-chat-widget.min.js"></script>
<script>
  const widget = new window.NYTChatWidget();
  widget.init({
    containerId: "nyt-chat-widget-root",
    title: "Ask New York Times Anything!",
    suggestionCategories: [
      "Top Stories",
      "Breaking News",
      "Generate a new Wordle",
      "Election Coverage",
      "Climate News"
    ],
    onSubmit: async (query) => {
      // Send to NYT AI backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ query })
      });
      return response.json();
    },
    onCitationClick: (citation) => {
      // Navigate to article
      window.location.href = `/article/${citation}`;
    }
  });
</script>
```

## Implementation Plan

### Phase 1: Foundation & Type Definitions
- Add NYT dark theme CSS variables to `globals.css`
- Define TypeScript types in `types.ts`
- Create button and input variants

### Phase 2: Static Component Structure (Bottom-Up)

1. **CategoryPill** (leaf) - Button with purple pill styling
2. **CitationPill** (leaf) - Similar to category pill
3. **AutocompleteSuggestion** (leaf) - Clickable suggestion item
4. **SuggestionCategories** - Grid of category pills + More button
5. **AutocompleteList** - List of suggestions with search icon
6. **LoadingIndicator** - Multi-stage animation ("Searching through...")
7. **StreamingAnswer** - Text reveal with expand toggle
8. **CitationPills** - Row of citation pills + More
9. **AnswerDisplay** - Complete answer section (query + answer + citations)
10. **SearchInput** - Dark themed input with submit
11. **NYTWidgetCollapsed** - Compact dark button
12. **NYTWidgetExpanded** - Full interface container
13. **NYTChatWidget** (root) - State machine orchestrator

### Phase 3: State Management Integration

1. Add `widgetState` state machine to root
2. Add `currentQuery` state to expanded view
3. Add `autocompleteResults` state
4. Add `answer` and `citations` state
5. Add `isAnswerExpanded` state to AnswerDisplay

### Phase 4: Inverse Data Flow

1. Connect collapsed → expanded transition
2. Connect search input to autocomplete
3. Connect autocomplete selection to submit
4. Connect submit to loading state
5. Connect loading to answer display
6. Connect expand toggle to answer state
7. Connect citation clicks to external handler

### Phase 5: Streaming & Animations

1. Implement character-by-character streaming
2. Add loading stage animations
3. Add expand/collapse transitions
4. Add hover effects
5. Add focus states

### Phase 6: Integration & Export

1. Export from `index.ts`
2. Update `types.ts`
3. Update `convex/components.ts`
4. Create preview page

### Phase 7: Bundling

1. Create build script
2. Test bundle
3. Create standalone HTML test

### Phase 8: Testing & Validation

See Testing Strategy section.

## Step by Step Tasks

### Step 1: Add CSS Variables
- NYT dark theme colors to `globals.css`
- Purple accent color
- Dark gray shades

### Step 2: Define TypeScript Types
- Add all NYT widget types to `types.ts`
- Include JSDoc comments

### Step 3: Create CategoryPill Component
- Internal component
- Button with purple pill styling
- Sparkle icon prefix

### Step 4: Create CitationPill Component
- Similar to CategoryPill
- Different icon or styling

### Step 5: Create SuggestionCategories Component
- Grid layout
- Map categories to CategoryPill
- "More" button

### Step 6: Create AutocompleteSuggestion Component
- Search icon prefix
- Clickable suggestion

### Step 7: Create AutocompleteList Component
- Map suggestions to AutocompleteSuggestion
- Handle selection

### Step 8: Create LoadingIndicator Component
- Multi-stage text animation
- "Searching through articles... books... videos... podcasts"

### Step 9: Create StreamingAnswer Component
- Character-by-character reveal
- Line clamping (3 lines default)
- Expand toggle
- Scroll if >10 lines

### Step 10: Create CitationPills Component
- Row of citation pills
- "More" button if >3

### Step 11: Create AnswerDisplay Component
- Query heading
- LoadingIndicator or StreamingAnswer
- CitationPills

### Step 12: Create SearchInput Component
- Dark themed Input
- Submit handler

### Step 13: Create NYTWidgetCollapsed Component
- Dark button
- Sparkle icon
- NYT logo

### Step 14: Create NYTWidgetExpanded Component
- Header with title
- Conditional content:
  - SuggestionCategories (search state, empty query)
  - AutocompleteList (search state, typing)
  - AnswerDisplay (loading/answer state)
- SearchInput or FollowUpInput (based on state)
- PoweredBy footer

### Step 15: Create NYTChatWidget Root Component
- "use client" directive
- State machine: collapsed | search | loading | answer
- Controlled/uncontrolled pattern
- Conditional render based on state

### Step 16: Implement State Machine
- collapsed → search (expand)
- search → loading (submit)
- loading → answer (response received)
- answer → search (new query)

### Step 17: Implement Autocomplete Logic
- Fetch suggestions on input change
- Debounce API calls
- Display suggestions
- Handle selection

### Step 18: Implement Streaming Animation
- Use interval or RAF
- Character-by-character reveal
- Adjustable speed
- Stop on complete

### Step 19: Implement Answer Expansion
- Default: 3 lines with `-webkit-line-clamp`
- Expanded: 10 lines
- Scroll: if >10 lines, ScrollArea

### Step 20: Style Dark Theme
- Background: `#1a1a1a`
- Text: white
- Accents: purple
- Input: dark gray

### Step 21: Add Loading Animations
- Stage 1: "Searching through articles..."
- Stage 2: "books..."
- Stage 3: "videos..."
- Stage 4: "podcasts"

### Step 22: Export from index.ts
- Add exports
- Run build to validate

### Step 23: Update Convex Metadata
- Add to `getCompleteWidgetsList`
- Increment counts

### Step 24: Create Preview Page
- Interactive demo
- State controls
- Code view

### Step 25: Create Build Script
- Bun IIFE configuration
- Test build

### Step 26: Create Standalone HTML Test
- Load bundle
- Test initialization

### Step 27: Manual Testing
- All user flows
- Responsive design
- Keyboard navigation

### Step 28: Run Validation Commands
- `bun run build`
- `npx convex dev`
- `bun dev`
- `bun run build:nyt-chat-widget`

## Testing Strategy

### Component Testing
- CategoryPill renders with sparkle
- AutocompleteList shows suggestions
- StreamingAnswer animates correctly
- Answer expansion works
- Citation pills clickable

### Integration Testing
- State machine transitions
- Autocomplete API integration
- Answer API integration
- Export validation
- Preview page functionality

### Edge Cases
- Empty autocomplete results
- Very long answers (scrolling)
- No citations
- Slow network (loading state)
- Multiple rapid queries

### Accessibility
- Keyboard navigation
- ARIA labels
- Focus management
- Color contrast (dark theme)
- Touch targets ≥44px

## Acceptance Criteria

- [x] Widget follows React 19.2 patterns
- [x] State machine implementation
- [x] TypeScript types defined
- [x] Exported correctly
- [x] Dark theme matches NYT style
- [x] shadcn/ui components used
- [x] Streaming animation smooth
- [x] Answer expansion works (3→10→scroll)
- [x] Autocomplete functional
- [x] Citation pills display
- [x] Responsive design
- [x] Accessibility compliant
- [x] Preview page created
- [x] Build script working
- [x] No errors

## Validation Commands

```bash
bun run build
npx convex dev
bun dev
bun run build:nyt-chat-widget
```

### Manual Testing Checklist

**Collapsed State:**
- [x] Dark button displays
- [x] Sparkle icon visible
- [x] NYT logo shown
- [x] Click expands widget

**Expanded - Search State:**
- [x] Title displays
- [x] Suggestion categories show
- [x] Search input ready
- [x] Click input hides suggestions

**Autocomplete:**
- [x] Typing triggers suggestions
- [x] 3 suggestions display
- [x] Click selects and submits

**Loading State:**
- [x] Query heading shows
- [x] Loading animation plays
- [x] Stages cycle through

**Answer State:**
- [x] Answer streams in
- [x] 3 lines default
- [x] Expand toggle works
- [x] 10 lines expanded
- [x] Scroll if longer
- [x] Citations display
- [x] Follow-up input shown

**Interactions:**
- [x] Category pills clickable
- [x] Citation pills clickable
- [x] "More" buttons work
- [x] Close collapses widget

## Notes

### Performance Considerations
- Debounce autocomplete (300ms)
- Virtualize long answer lists
- Optimize streaming animation (RAF)
- Lazy load answer content

### Future Enhancements
- Voice input
- Multi-turn conversations
- Conversation history
- Bookmarking answers
- Share functionality
- Real citation linking
- Answer confidence scores

### Related Widgets
- **rufus-widget**: Similar Q&A pattern
- **womens-world-widget**: Dark theme reference
- **onboarding-widget**: Multi-state pattern
