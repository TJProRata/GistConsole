# Widget Feature: Rufus Widget - Amazon Shopping Assistant

## Feature Description

A shopping assistant widget designed to replicate Amazon's Rufus AI interface. The widget provides instant answers to product-related questions through an AI-powered chat interface. The design features two distinct states:

**Collapsed State (Initial):**
- Compact horizontal button with "Ask Rufus" text and orange sparkle icon
- Three visible seed question pills (light blue background, rounded)
- "Ask something else" pill in darker blue as the call-to-action
- Minimalist, space-efficient design

**Expanded State:**
- Full chat interface with "Rufus ai" header and Amazon branding
- Welcome message in light blue card with white background
- Question prompt "What do you need help with today?"
- Scrollable seed questions list (5+ visible questions)
- Scroll indicator (down arrow) for more questions
- Text input at bottom: "Ask Rufus a question"
- Menu (hamburger) and close (X) buttons in header

**Visual Design:**
- **Brand Colors**: Amazon orange (#FF9900) for branding, blue (#5F99CF) for interactive elements
- **Typography**: System fonts (Inter, SF Pro, Roboto) for clarity
- **Layout**: Clean white background with subtle shadows
- **Seed Questions**: Rounded pill buttons with light blue background (#E8F4FD)
- **Input**: Simple text input with blue border

**Interactions:**
- Click collapsed button to expand to full chat interface
- Click seed question to populate input (NOT auto-submit)
- Scroll seed questions list to see more options
- Type custom question in input field
- Submit question via Enter or send button
- Menu button for settings/options
- Close button to collapse widget

## User Story

As an **Amazon shopper browsing products**
I want to **ask questions about products and get instant AI-powered answers**
So that **I can make informed purchasing decisions without searching through reviews or descriptions**

## Widget Classification

**Category**: complete
**Embeddable**: yes (requires Bun bundling configuration for Amazon website integration)
**Complexity**: moderate

## Problem Statement

Online shoppers often have specific questions about products (size, compatibility, durability, etc.) that require searching through lengthy product descriptions, reviews, or Q&A sections. This creates friction in the purchase journey and can lead to abandoned carts or returns. Customers need instant, reliable answers to product questions in the moment they're shopping.

## Solution Statement

The Rufus Widget provides an AI-powered shopping assistant directly embedded in the product browsing experience. By featuring a collapsed state with visible seed questions, users can quickly access common queries. The expanded chat interface offers a scrollable list of curated questions and a free-form input for custom queries. The widget's design matches Amazon's brand identity while maintaining a clean, unobtrusive presence. Clicking seed questions populates the input (but doesn't auto-submit) to allow users to review and modify their question before sending.

## React Component Design (Thinking in React)

### Step 1: Component Hierarchy

```
RufusWidget (root)
├── RufusWidgetCollapsed
│   ├── CollapsedButton
│   │   ├── SparkleIcon (orange)
│   │   └── "Ask Rufus" text
│   ├── SeedQuestionPill (light blue) × 3
│   └── AskSomethingElsePill (dark blue CTA)
└── RufusWidgetExpanded
    ├── WidgetHeader
    │   ├── MenuButton (hamburger icon)
    │   ├── Title ("Rufus ai" + beta badge + Amazon logo)
    │   └── CloseButton (X icon)
    ├── WidgetContent (scrollable)
    │   ├── WelcomeCard
    │   │   ├── WelcomeHeading ("Welcome!")
    │   │   ├── WelcomeMessage (AI disclaimer)
    │   │   └── LearnMoreLink
    │   ├── QuestionPrompt ("What do you need help with today?")
    │   └── SeedQuestionsList (scrollable)
    │       ├── SeedQuestionPill × n
    │       └── ScrollIndicator (down arrow)
    └── WidgetFooter
        └── TextInput ("Ask Rufus a question")
```

**Component Responsibilities:**

- `RufusWidget`: Root container managing expanded/collapsed state
- `RufusWidgetCollapsed`: Horizontal compact view with 3 seed questions + CTA
- `RufusWidgetExpanded`: Full chat interface with scrollable questions
- `WidgetHeader`: Menu, title with branding, close button
- `WelcomeCard`: Introductory message with AI disclaimer
- `QuestionPrompt`: "What do you need help with today?" heading
- `SeedQuestionsList`: Scrollable container with all seed questions
- `SeedQuestionPill`: Individual question button
- `ScrollIndicator`: Down arrow showing more questions available
- `TextInput`: Input field for custom questions

### Step 2: Static Version (Props Only)

**Component Props:**

- `RufusWidget`:
  ```typescript
  {
    isExpanded: boolean;
    onExpandChange: (expanded: boolean) => void;
    collapsedText?: string; // default: "Ask Rufus"
    visibleSeedQuestionsCollapsed?: number; // default: 3
    seedQuestions?: string[]; // array of pre-populated questions
    welcomeHeading?: string; // default: "Welcome!"
    welcomeMessage?: string; // default: AI disclaimer text
    questionPrompt?: string; // default: "What do you need help with today?"
    inputPlaceholder?: string; // default: "Ask Rufus a question"
    showMenu?: boolean; // default: true
  }
  ```

- `RufusWidgetCollapsed`:
  ```typescript
  {
    collapsedText: string;
    seedQuestions: string[];
    visibleQuestions: number;
    onExpand: () => void;
    onQuestionClick: (question: string) => void;
  }
  ```

- `RufusWidgetExpanded`:
  ```typescript
  {
    welcomeHeading: string;
    welcomeMessage: string;
    questionPrompt: string;
    seedQuestions: string[];
    inputPlaceholder: string;
    showMenu: boolean;
    onClose: () => void;
    onMenuClick: () => void;
    onQuestionClick: (question: string) => void;
    onSubmit: (question: string) => void;
  }
  ```

- `SeedQuestionsList`:
  ```typescript
  {
    questions: string[];
    onQuestionClick: (question: string) => void;
    selectedQuestion?: string | null;
    showScrollIndicator: boolean;
  }
  ```

- `SeedQuestionPill`:
  ```typescript
  {
    question: string;
    onClick: () => void;
    isSelected?: boolean;
    variant?: "light" | "dark"; // light = light blue, dark = darker blue CTA
    className?: string;
  }
  ```

### Step 3: Minimal UI State

**Minimal State:**
- `isExpanded`: boolean - Widget expanded/collapsed (controlled from parent)
- `selectedQuestion`: string | null - Current question text in input
- `scrollPosition`: number - Scroll position in seed questions list (for scroll indicator)
- `showScrollIndicator`: boolean - Whether down arrow is visible (derived from scroll)

**Derived Values (NOT stored):**
- Input value is derived from `selectedQuestion` state
- Submit button disabled state is derived from `selectedQuestion.length === 0`
- Visible seed questions in collapsed state is derived from `visibleSeedQuestionsCollapsed` prop
- Scroll indicator visibility is derived from `scrollPosition` and list height

**Justification:**
- `isExpanded` is STATE because it changes over time based on user interaction
- `selectedQuestion` is STATE because it represents user's current query and changes with input/pill clicks
- `scrollPosition` is STATE because it tracks scroll location for UI feedback
- `showScrollIndicator` is DERIVED from scrollPosition - can compute if scrolled to bottom
- Everything else can be computed from these pieces of state

### Step 4: State Location

**State Ownership:**

- `isExpanded` lives in `RufusWidget` (root) - Controlled/uncontrolled pattern, can be controlled from parent or managed internally
- `selectedQuestion` lives in `RufusWidgetExpanded` - Only expanded state needs to manage input value
- `scrollPosition` lives in `SeedQuestionsList` - Only questions list needs to track scroll for indicator
- `showScrollIndicator` lives in `SeedQuestionsList` - Derived from scroll position, stays within list component

**Reasoning:**
- Root widget controls expansion because it affects the entire widget container
- Question selection only matters in expanded state, no need to lift to root
- Scroll state is encapsulated within the scrollable list component
- Each component owns its local UI state for better encapsulation

### Step 5: Inverse Data Flow

**Event Handlers:**

- `RufusWidget` passes `onExpandChange` down
  - Collapsed state calls it when user clicks "Ask Rufus" button or any seed question
  - Expanded state calls it when user clicks close button

- `RufusWidgetCollapsed` exposes `onQuestionClick` prop
  - Parent handles by expanding widget AND populating selectedQuestion
  - Internal handler: `onClick={() => { onQuestionClick(question); onExpand(); }}`

- `RufusWidgetExpanded` exposes `onSubmit` prop
  - Parent can handle question submission
  - Internal `handleInputChange` updates `selectedQuestion` state
  - Internal `handleSubmit` calls parent's `onSubmit` callback

- `SeedQuestionsList` exposes `onQuestionClick` prop
  - Parent (Expanded state) passes handler to populate input with clicked question
  - List internally calls `onQuestionClick(question)` when pill is clicked
  - Does NOT auto-submit - only populates input for user review

- `SeedQuestionPill` receives `onClick` prop
  - Calls parent's handler (from list) on click

**Data Flow Pattern:**
1. User clicks seed question pill in COLLAPSED state → `RufusWidgetCollapsed` calls `onQuestionClick(question)` AND `onExpand()` → Widget expands with question pre-populated in input
2. User clicks seed question pill in EXPANDED state → `SeedQuestionPill.onClick()` → `SeedQuestionsList.onQuestionClick(question)` → `RufusWidgetExpanded` updates `selectedQuestion` state → input populated (NOT submitted)
3. User types in input → `RufusWidgetExpanded.handleInputChange()` → updates `selectedQuestion` state directly
4. User submits → `RufusWidgetExpanded.handleSubmit()` → calls parent's `onSubmit(selectedQuestion)`

**CRITICAL DIFFERENCE**: Clicking seed questions POPULATES input but does NOT auto-submit. User must review and submit manually.

## TypeScript Type Definitions

### Prop Interfaces

```typescript
/**
 * Rufus Widget Props
 */
export interface RufusWidgetProps {
  /** Controls whether the widget is expanded or collapsed */
  isExpanded?: boolean;

  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;

  /** Default expanded state for uncontrolled mode */
  defaultExpanded?: boolean;

  /** Text shown in collapsed button state */
  collapsedText?: string;

  /** Number of seed questions visible in collapsed state */
  visibleSeedQuestionsCollapsed?: number;

  /** Pre-populated seed questions for suggestions */
  seedQuestions?: string[];

  /** Welcome heading in expanded state */
  welcomeHeading?: string;

  /** Welcome message with AI disclaimer */
  welcomeMessage?: string;

  /** Question prompt heading */
  questionPrompt?: string;

  /** Placeholder text for input */
  inputPlaceholder?: string;

  /** Show menu button in header */
  showMenu?: boolean;

  /** Callback when question is submitted */
  onSubmit?: (question: string) => void;

  /** Callback when menu button clicked */
  onMenuClick?: () => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Collapsed State Props
 */
export interface RufusWidgetCollapsedProps {
  /** Text for collapsed button */
  collapsedText: string;

  /** Seed questions to display */
  seedQuestions: string[];

  /** Number of visible questions */
  visibleQuestions: number;

  /** Handler to expand widget */
  onExpand: () => void;

  /** Handler when question clicked (expands AND populates) */
  onQuestionClick: (question: string) => void;
}

/**
 * Expanded State Props
 */
export interface RufusWidgetExpandedProps {
  /** Welcome heading */
  welcomeHeading: string;

  /** Welcome message */
  welcomeMessage: string;

  /** Question prompt heading */
  questionPrompt: string;

  /** Seed questions for list */
  seedQuestions: string[];

  /** Input placeholder */
  inputPlaceholder: string;

  /** Show menu button */
  showMenu: boolean;

  /** Handler to close widget */
  onClose: () => void;

  /** Handler for menu button */
  onMenuClick: () => void;

  /** Handler when question pill clicked (populates input, NOT submit) */
  onQuestionClick: (question: string) => void;

  /** Handler when question submitted */
  onSubmit: (question: string) => void;
}

/**
 * Seed Questions List Props
 */
export interface SeedQuestionsListProps {
  /** Array of question strings */
  questions: string[];

  /** Handler when question pill is clicked */
  onQuestionClick: (question: string) => void;

  /** Currently selected question (for highlighting) */
  selectedQuestion?: string | null;

  /** Show scroll indicator (down arrow) */
  showScrollIndicator: boolean;

  /** Variant for container styling */
  variant?: "collapsed" | "expanded";
}

/**
 * Seed Question Pill Props
 */
export interface SeedQuestionPillProps {
  /** Question text to display */
  question: string;

  /** Click handler */
  onClick: () => void;

  /** Whether this pill is selected */
  isSelected?: boolean;

  /** Visual variant */
  variant?: "light" | "dark" | "cta";

  /** Additional CSS classes */
  className?: string;
}

/**
 * Welcome Card Props
 */
export interface WelcomeCardProps {
  /** Welcome heading */
  heading: string;

  /** Welcome message */
  message: string;

  /** Learn more link URL */
  learnMoreUrl?: string;
}
```

### State Types

```typescript
/**
 * Widget internal state
 */
export interface RufusWidgetState {
  /** Current question text in input */
  selectedQuestion: string | null;

  /** Whether widget is expanded (uncontrolled mode) */
  internalExpanded: boolean;
}

/**
 * Seed questions list state
 */
export interface SeedQuestionsListState {
  /** Current scroll position */
  scrollPosition: number;

  /** Whether scrolled to bottom (for indicator) */
  isScrolledToBottom: boolean;
}
```

## Relevant Files

### Existing Files to Reference

- **`components/widget_components/complete/onboarding-widget.tsx`** - Reference for complete widget structure, multi-phase patterns (use Phase 0 as inspiration for collapsed → expanded transition)

- **`components/widget_components/complete/womens-world-widget.tsx`** - Reference for seed question carousel, pill styling, and input integration patterns

- **`components/ui/button.tsx`** - shadcn Button component for all interactive elements (pills, close, menu, submit)

- **`components/ui/card.tsx`** - shadcn Card component for welcome message container

- **`components/ui/input.tsx`** - shadcn Input component for "Ask Rufus a question" text field

- **`components/ui/scroll-area.tsx`** - shadcn ScrollArea for scrollable seed questions list

- **`components/ui/separator.tsx`** - Optional for visual dividers between questions

- **`components/widget_components/types.ts`** - TypeScript type definitions for all widget components, will be extended with Rufus Widget types

- **`components/widget_components/index.ts`** - Export barrel for widget components, must be updated to include new widget

- **`app/globals.css`** - Global styles including CSS custom properties for Amazon brand colors

- **`convex/components.ts`** - Component metadata for admin panel, must be updated to include Rufus Widget in complete widgets list

- **`package.json`** - Dependencies (no new dependencies needed)

### New Files

- **`components/widget_components/complete/rufus-widget.tsx`** - Main widget component implementation

- **`app/admin/components/widgets/complete/rufus-widget/page.tsx`** - Preview page for admin panel showcasing the widget with interactive demo

- **`specs/rufus-widget.md`** - This specification document

## shadcn/ui Components

### Component Reuse Checklist

- [x] Checked `components/ui/` for existing shadcn components
- [x] Checked `components/widget_components/` for existing widget components
- [x] Confirmed the needed functionality is NOT available in existing components
- [x] Verified that creating a variant won't suffice

### Existing Components to Use

**From `components/ui/`:**
- ✅ **Button** - For all interactive elements (collapsed button, pills, menu, close, CTA)
- ✅ **Card** - For welcome message container with white background
- ✅ **Input** - For "Ask Rufus a question" text field
- ✅ **ScrollArea** - For scrollable seed questions list with custom scrollbar
- ✅ **Separator** - Optional for visual dividers

### New Components to Add (DISCOURAGED)

**⚠️ No new shadcn components needed** - All functionality available with existing components

### Variants of Existing Components (ENCOURAGED)

- Create **"amazon-orange"** color in `app/globals.css`:
  ```css
  --color-amazon-orange: 255 153 0; /* #FF9900 */
  --color-rufus-blue: 95 153 207; /* #5F99CF */
  --color-rufus-blue-light: 232 244 253; /* #E8F4FD */
  --color-rufus-blue-dark: 67 110 156; /* #436E9C */
  ```

- Create **"pill"** variant of Button component using CVA for rounded seed question pills:
  ```css
  /* Light blue pill */
  .btn-pill-light {
    background-color: var(--color-rufus-blue-light);
    color: var(--color-rufus-blue);
    border-radius: 24px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 400;
  }

  /* Dark blue CTA pill */
  .btn-pill-dark {
    background-color: var(--color-rufus-blue-dark);
    color: white;
    border-radius: 24px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
  }
  ```

- Create **"rufus-input"** style for clean blue-bordered text input:
  ```css
  .rufus-input {
    border: 1px solid var(--color-rufus-blue);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
  }
  ```

### Custom Widget Components (Only if Necessary)

**No custom components needed** - All functionality can be achieved with:
- Existing `Button` component with className overrides for pills and actions
- Existing `Card` component for welcome message
- Existing `Input` component for question input
- Existing `ScrollArea` for scrollable questions list
- CSS variants in `globals.css` for Amazon branding

## Widget Integration

### Export Configuration

```typescript
// components/widget_components/index.ts

// Add to Complete Widgets section:
export { RufusWidget } from "./complete/rufus-widget";

// Add to Types section:
export type {
  RufusWidgetProps,
  RufusWidgetCollapsedProps,
  RufusWidgetExpandedProps,
  SeedQuestionsListProps,
  SeedQuestionPillProps,
  WelcomeCardProps,
  RufusWidgetState,
  SeedQuestionsListState
} from "./types";
```

### Preview Page Integration

**Location:** `app/admin/components/widgets/complete/rufus-widget/page.tsx`

**Demo Features:**
- Toggle between collapsed/expanded states
- Try clicking seed questions to populate input (NOT auto-submit)
- Test typing custom questions
- Test scrolling seed questions list with scroll indicator
- Dark mode toggle
- Code view with syntax highlighting
- Copy-to-clipboard for code snippet

**Interactive Controls:**
- Number of visible collapsed questions slider (1-5)
- Custom seed questions input
- Toggle menu button visibility
- Custom welcome message input

## Embeddable Widget Configuration

### Bundling Strategy

**Build Script**: `build/rufus-widget.ts`
**Output Format**: IIFE (Immediately Invoked Function Expression)
**Global API**: `window.RufusWidget`
**CSS Strategy**: Inline (embedded in JS bundle for single-file distribution)
**Bundle Target**: CDN deployment for embedding on Amazon product pages

### Build Configuration

```typescript
// build/rufus-widget.ts
import path from "path";

await Bun.build({
  entrypoints: ["./components/widget_components/complete/rufus-widget.tsx"],
  outdir: "./dist/widgets",
  format: "iife",
  target: "browser",
  minify: true,
  splitting: false,
  naming: "rufus-widget.min.js",
  external: [], // Bundle all dependencies
  packages: "bundle",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  loader: {
    ".tsx": "tsx",
    ".ts": "ts",
    ".css": "css",
  },
});

console.log("✅ Rufus Widget bundle created: dist/widgets/rufus-widget.min.js");
```

### Client Integration

```html
<!-- Usage example for Amazon product pages -->
<div id="rufus-widget-root"></div>

<!-- Load widget bundle from CDN -->
<script src="https://cdn.amazon.com/widgets/rufus-widget.min.js"></script>

<script>
  // Initialize widget
  const widget = new window.RufusWidget();

  widget.init({
    // Target container
    containerId: "rufus-widget-root",

    // Customization options
    collapsedText: "Ask Rufus",
    visibleSeedQuestionsCollapsed: 3,
    seedQuestions: [
      "Does it fit in most cup holders?",
      "Is the straw removable?",
      "Can it keep drinks hot?",
      "What do customers say?",
      "Is this bottle leak-proof?"
    ],
    welcomeHeading: "Welcome!",
    welcomeMessage: "Hi, I'm Rufus, your shopping assistant. My answers are powered by AI, so I may not always get things right.",
    questionPrompt: "What do you need help with today?",
    inputPlaceholder: "Ask Rufus a question",
    showMenu: true,

    // Event handlers
    onSubmit: (question) => {
      console.log("User asked:", question);
      // Send to AI backend, trigger response, etc.
    },
    onMenuClick: () => {
      console.log("Menu clicked");
      // Open settings/options modal
    }
  });
</script>
```

**Bundle Size Target:** <80KB minified (React + Radix UI components)

## Implementation Plan

### Phase 1: Foundation & Type Definitions

1. **Add CSS Variants** to `app/globals.css`:
   - Amazon orange color variable
   - Rufus blue shades (light, regular, dark)
   - Button pill variants (light, dark, CTA)
   - Input styling for Rufus branding

2. **Define TypeScript Types** in `components/widget_components/types.ts`:
   - `RufusWidgetProps`
   - `RufusWidgetCollapsedProps`
   - `RufusWidgetExpandedProps`
   - `SeedQuestionsListProps`
   - `SeedQuestionPillProps`
   - `WelcomeCardProps`
   - `RufusWidgetState`
   - `SeedQuestionsListState`

### Phase 2: Static Component Structure

Build components from leaf nodes to root (bottom-up):

1. **SeedQuestionPill Component** (leaf)
   - Button with `btn-pill-light`, `btn-pill-dark`, or `btn-pill-cta` className
   - Hover states and selected state styling
   - Props: question text, onClick, isSelected, variant

2. **WelcomeCard Component**
   - Card component with heading, message, and learn more link
   - Light blue background with white card
   - Props: heading, message, learnMoreUrl

3. **SeedQuestionsList Component**
   - ScrollArea wrapper for questions
   - Map questions to SeedQuestionPill components
   - ScrollIndicator (down arrow) at bottom when not scrolled to end
   - Props: questions, onQuestionClick, selectedQuestion, showScrollIndicator

4. **RufusWidgetCollapsed Component**
   - Horizontal layout with:
     - "Ask Rufus" button (orange sparkle icon)
     - 3 visible seed question pills (light blue)
     - "Ask something else" CTA pill (dark blue)
   - Props: collapsedText, seedQuestions, visibleQuestions, onExpand, onQuestionClick

5. **RufusWidgetExpanded Component**
   - Full chat interface with:
     - Header (menu, "Rufus ai" title, close button)
     - ScrollArea with WelcomeCard + QuestionPrompt + SeedQuestionsList
     - Footer with Input field
   - Props: welcomeHeading, welcomeMessage, questionPrompt, seedQuestions, inputPlaceholder, showMenu, onClose, onMenuClick, onQuestionClick, onSubmit

6. **RufusWidget Component** (root)
   - Conditional render based on isExpanded state
   - Render RufusWidgetCollapsed or RufusWidgetExpanded
   - Controlled/uncontrolled pattern for expansion state
   - Props: all configuration options

### Phase 3: State Management Integration

1. **Add Selection State** to `RufusWidgetExpanded`:
   - `const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)`
   - Pass `setSelectedQuestion` as `onQuestionClick` to SeedQuestionsList
   - Pass `selectedQuestion` as `value` to Input field
   - Derive submit button disabled state: `!selectedQuestion`

2. **Add Scroll State** to `SeedQuestionsList`:
   - `const [scrollPosition, setScrollPosition] = useState(0)`
   - `const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)`
   - Track scroll position in ScrollArea's onScroll handler
   - Compute showScrollIndicator from scroll state
   - Show down arrow when not scrolled to bottom

3. **Add Expansion State** to `RufusWidget`:
   - `const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)`
   - Implement controlled/uncontrolled pattern
   - `const isExpanded = controlledIsExpanded ?? internalExpanded`

### Phase 4: Inverse Data Flow (Event Handlers)

1. **SeedQuestionPill Click Handler**:
   - Receives `onClick` prop from parent
   - Calls `onClick()` when clicked

2. **Questions List Click (Expanded)**:
   - `onQuestionClick={(q) => setSelectedQuestion(q)}`
   - Passed down to each SeedQuestionPill
   - Does NOT submit - only populates input

3. **Questions List Click (Collapsed)**:
   - `onQuestionClick={(q) => { setSelectedQuestion(q); onExpand(); }}`
   - Expands widget AND pre-populates input with clicked question

4. **Input Change Handler**:
   - `onChange={(e) => setSelectedQuestion(e.target.value)}`
   - Updates selected question as user types

5. **Form Submit Handler**:
   - `onSubmit={(e) => { e.preventDefault(); props.onSubmit?.(selectedQuestion); }}`
   - Calls parent's onSubmit callback
   - Optionally clear input after submit

6. **Expand/Collapse Handlers**:
   - `onExpand={() => { setInternalExpanded(true); props.onExpandChange?.(true); }}`
   - `onClose={() => { setInternalExpanded(false); props.onExpandChange?.(false); }}`

### Phase 5: Styling & Polish

1. **Apply Amazon Branding**:
   - Orange sparkle icon in collapsed button
   - Amazon logo in expanded header
   - Blue color scheme for interactive elements

2. **Style Collapsed State**:
   - Horizontal layout with flex
   - 3 visible seed questions + CTA pill
   - Proper spacing between elements
   - Hover effects on all pills

3. **Style Expanded State**:
   - White background container
   - Clean header with proper spacing
   - Welcome card with light blue background
   - Scrollable questions list with custom scrollbar
   - Fixed input at bottom

4. **Style Seed Question Pills**:
   - Light blue background (`#E8F4FD`)
   - Blue text (`#5F99CF`)
   - Rounded corners (24px)
   - Hover: slightly darker background
   - Selected: darker blue border or background

5. **Style CTA Pill ("Ask something else")**:
   - Darker blue background (`#436E9C`)
   - White text
   - Same rounded shape
   - Hover: lighter background

6. **Responsive Design**:
   - Mobile: Stack collapsed pills vertically or reduce visible count to 2
   - Tablet: Optimize collapsed layout
   - Desktop: Full horizontal collapsed layout

7. **Animations**:
   - Smooth expand/collapse transition
   - Scroll indicator fade in/out
   - Hover effects on pills
   - Input focus effects

### Phase 6: Integration & Export

1. **Update `components/widget_components/index.ts`**:
   - Export `RufusWidget` component
   - Export all type definitions

2. **Update `components/widget_components/types.ts`**:
   - Add all Rufus Widget types

3. **Update `convex/components.ts`**:
   - Add Rufus Widget to `getCompleteWidgetsList` query
   - Increment `completeWidgetsCount` to 3
   - Update category breakdown

### Phase 7: Preview Page Creation

1. **Create Preview Page** at `app/admin/components/widgets/complete/rufus-widget/page.tsx`:
   - Import RufusWidget
   - Create interactive demo with state controls
   - Add dark mode toggle
   - Include code view with syntax highlighting
   - Add copy-to-clipboard functionality

2. **Test Preview Page**:
   - Navigate to `/admin/components/widgets` → Widgets tab
   - Verify widget card appears
   - Click "View Preview" to open preview page
   - Test all interactive features

### Phase 8: Bundling (Embeddable)

1. **Create Build Script** at `build/rufus-widget.ts`:
   - Configure Bun build for IIFE output
   - Set minification and bundling options
   - Add CSS inlining strategy

2. **Test Build**:
   ```bash
   bun run build:rufus-widget
   ```

3. **Create Standalone HTML Test**:
   - Create `test/rufus-widget.html`
   - Load bundle from dist
   - Test initialization and functionality

4. **Validate Bundle**:
   - Check bundle size (<80KB target)
   - Test in different browsers
   - Verify no console errors

### Phase 9: Testing & Validation

See Testing Strategy section below.

### Phase 10: Run Validation Commands

Execute all validation commands (see Validation Commands section).

## Step by Step Tasks

### Step 1: Create CSS Variants

- Add Amazon brand colors to `app/globals.css`:
  ```css
  --color-amazon-orange: 255 153 0;
  --color-rufus-blue: 95 153 207;
  --color-rufus-blue-light: 232 244 253;
  --color-rufus-blue-dark: 67 110 156;
  ```
- Add button pill variants (light, dark, CTA)
- Add input styling for blue border

### Step 2: Define TypeScript Types

- Open `components/widget_components/types.ts`
- Add all Rufus Widget type interfaces with JSDoc comments
- Run `bun run build` to validate types

### Step 3: Create SeedQuestionPill Component

- Create internal component within `rufus-widget.tsx`
- Implement as Button with variant-based styling
- Props: question, onClick, isSelected, variant
- Style with light blue or dark blue based on variant
- Add hover states

### Step 4: Create WelcomeCard Component

- Create internal component within `rufus-widget.tsx`
- Use Card from `@/components/ui/card`
- Props: heading, message, learnMoreUrl
- Style with light blue background
- Add heading, message paragraph, and optional link

### Step 5: Create SeedQuestionsList Component

- Create internal component within `rufus-widget.tsx`
- Use ScrollArea from `@/components/ui/scroll-area`
- Map questions to SeedQuestionPill components
- Add ScrollIndicator (down arrow icon) at bottom
- Props: questions, onQuestionClick, selectedQuestion, showScrollIndicator

### Step 6: Create RufusWidgetCollapsed Component

- Create internal component within `rufus-widget.tsx`
- Horizontal layout with flex
- "Ask Rufus" button with orange sparkle icon
- Slice first 3 seed questions (or visibleQuestions prop)
- "Ask something else" CTA pill (dark blue variant)
- Props: collapsedText, seedQuestions, visibleQuestions, onExpand, onQuestionClick

### Step 7: Create RufusWidgetExpanded Component

- Create internal component within `rufus-widget.tsx`
- Header: MenuButton + Title ("Rufus ai" + beta + logo) + CloseButton
- ScrollArea with WelcomeCard, QuestionPrompt heading, SeedQuestionsList
- Footer: Input field with placeholder "Ask Rufus a question"
- Props: all expanded state configuration

### Step 8: Create RufusWidget Root Component

- Create `components/widget_components/complete/rufus-widget.tsx`
- Use "use client" directive
- Implement controlled/uncontrolled isExpanded pattern
- Conditional render: isExpanded ? RufusWidgetExpanded : RufusWidgetCollapsed
- Pass all props through to appropriate child component

### Step 9: Add Selection State Management

- In RufusWidgetExpanded:
  - Add `useState<string | null>` for selectedQuestion
  - Pass selectedQuestion to Input as value
  - Pass setSelectedQuestion as onQuestionClick to SeedQuestionsList
  - Derive submit button disabled state

### Step 10: Add Scroll State Management

- In SeedQuestionsList:
  - Add `useState<number>` for scrollPosition
  - Add `useState<boolean>` for isScrolledToBottom
  - Track scroll with ScrollArea's onScroll handler
  - Show down arrow when not at bottom

### Step 11: Implement Input Change Handler

- In RufusWidgetExpanded:
  - Add onChange handler to Input
  - Update selectedQuestion state when user types

### Step 12: Implement Form Submit Handler

- In RufusWidgetExpanded:
  - Wrap Input in form element
  - Add onSubmit handler to form
  - Call props.onSubmit with selectedQuestion
  - Optionally clear input after submit

### Step 13: Implement Expansion State

- In RufusWidget:
  - Add `useState<boolean>` for internalExpanded
  - Implement controlled/uncontrolled pattern
  - Pass computed isExpanded to child components
  - Handle onExpand and onClose callbacks

### Step 14: Implement Collapsed Question Click

- In RufusWidgetCollapsed:
  - When seed question clicked, call BOTH:
    - `onQuestionClick(question)` to populate input
    - `onExpand()` to expand widget
  - Expanded state will have pre-populated input

### Step 15: Apply Collapsed State Styling

- Horizontal layout with flexbox
- Orange sparkle icon on "Ask Rufus" button
- Light blue pills for seed questions
- Dark blue pill for "Ask something else" CTA
- Proper spacing and alignment

### Step 16: Apply Expanded State Styling

- White background container
- Header with menu icon, title, close button
- Welcome card with light blue background
- Scrollable questions list
- Fixed input at bottom with blue border

### Step 17: Style Seed Question Pills

- Light variant: `#E8F4FD` background, `#5F99CF` text
- Dark variant: `#436E9C` background, white text
- CTA variant: same as dark but different text
- Hover: slightly darker/lighter
- Selected: border highlight

### Step 18: Add Scroll Indicator

- Down arrow icon at bottom of SeedQuestionsList
- Visible when not scrolled to bottom
- Fade out when scrolled to bottom
- Animate with smooth transition

### Step 19: Implement Responsive Design

- Mobile: Reduce collapsed visible questions to 2, stack vertically if needed
- Tablet: Optimize spacing and sizes
- Desktop: Full horizontal collapsed layout
- Test on different screen sizes

### Step 20: Add Animations

- Expand/collapse transition (height/opacity)
- Scroll indicator fade
- Pill hover effects (scale, shadow)
- Input focus ring

### Step 21: Export from index.ts

- Open `components/widget_components/index.ts`
- Add export for RufusWidget in Complete Widgets section
- Add exports for all types in Types section
- Run `bun run build` to validate exports

### Step 22: Update Convex Components Metadata

- Open `convex/components.ts`
- In `getCompleteWidgetsList` query, add Rufus Widget object
- Increment `completeWidgetsCount` to 3
- Update `categoryBreakdown.widgets` to 3
- Update `totalComponents` calculation

### Step 23: Create Preview Page

- Create `app/admin/components/widgets/complete/rufus-widget/page.tsx`
- Import RufusWidget component
- Create demo with state controls
- Add dark mode toggle
- Add code view with syntax highlighting
- Add copy-to-clipboard button

### Step 24: Test Preview Page

- Start dev server: `bun dev`
- Navigate to `/admin/components/widgets`
- Click on "Widgets" tab
- Verify Rufus Widget card appears
- Click "View Preview" button
- Test widget functionality

### Step 25: Create Build Script

- Create `build/rufus-widget.ts`
- Configure Bun build with IIFE format
- Add script to package.json: `"build:rufus-widget": "bun build/rufus-widget.ts"`

### Step 26: Test Build Process

- Run `bun run build:rufus-widget`
- Verify bundle created at `dist/widgets/rufus-widget.min.js`
- Check bundle size (target <80KB)

### Step 27: Create Standalone HTML Test

- Create `test/rufus-widget.html`
- Load bundle from dist
- Initialize widget with JavaScript API
- Test all features

### Step 28: Manual Testing

- Test collapsed → expanded transition
- Test clicking seed questions (populates input, not submit)
- Test typing custom questions
- Test form submission
- Test scrolling questions list
- Test scroll indicator visibility
- Test responsive behavior
- Test keyboard navigation

### Step 29: Run Validation Commands

Execute all validation commands (see Validation Commands section below)

## Testing Strategy

### Component Testing

**SeedQuestionPill Component:**
- ✅ Renders question text correctly
- ✅ onClick handler fires when clicked
- ✅ isSelected prop adds selected styling
- ✅ variant prop applies correct styling (light, dark, cta)
- ✅ Hover state applies visual feedback

**WelcomeCard Component:**
- ✅ Renders heading and message correctly
- ✅ Learn more link renders when URL provided
- ✅ Card styling with light blue background

**SeedQuestionsList Component:**
- ✅ Maps all questions to pills
- ✅ ScrollArea enables scrolling
- ✅ onQuestionClick fires with correct question
- ✅ Scroll indicator shows when not at bottom
- ✅ Scroll indicator hides when at bottom

**RufusWidgetCollapsed Component:**
- ✅ Shows "Ask Rufus" button with orange icon
- ✅ Shows correct number of visible seed questions
- ✅ Shows "Ask something else" CTA pill
- ✅ Clicking seed question calls onQuestionClick AND onExpand
- ✅ Horizontal layout with proper spacing

**RufusWidgetExpanded Component:**
- ✅ Renders header with menu, title, close button
- ✅ WelcomeCard displays in content area
- ✅ Question prompt heading displays
- ✅ SeedQuestionsList renders scrollable questions
- ✅ Input field renders at bottom
- ✅ Clicking seed question populates input (NOT auto-submit)
- ✅ Typing updates selectedQuestion state
- ✅ Submit fires with current question

**RufusWidget Component:**
- ✅ Renders collapsed state by default
- ✅ Expands when collapse button/seed question clicked
- ✅ Renders expanded state with full interface
- ✅ Close button collapses widget
- ✅ Controlled mode works with isExpanded prop
- ✅ Uncontrolled mode works with internal state

### Integration Testing

**Export Integration:**
- ✅ Widget exports from `index.ts` successfully
- ✅ Types export from `index.ts` successfully
- ✅ No circular dependencies
- ✅ No TypeScript errors on import

**Preview Page Integration:**
- ✅ Widget card appears in Widgets tab
- ✅ "View Preview" navigates to preview page
- ✅ Preview page renders widget without errors
- ✅ Interactive controls work
- ✅ Code view displays correctly
- ✅ Copy-to-clipboard works

**Build Integration:**
- ✅ Build script runs without errors
- ✅ Bundle output is valid IIFE JavaScript
- ✅ Bundle size under target (<80KB)
- ✅ Bundle initializes in standalone HTML

**Convex Integration:**
- ✅ `getCompleteWidgetsList` returns Rufus Widget
- ✅ Component stats updated correctly
- ✅ Admin panel displays widget

### Edge Cases

**Empty States:**
- ✅ No seed questions: collapsed shows only "Ask Rufus" button
- ✅ Empty selectedQuestion: submit button disabled
- ✅ No onSubmit handler: form submit does nothing gracefully

**Loading States:**
- ✅ Seed questions loading: show skeleton or empty state
- ✅ Widget initializing: graceful loading state

**Error States:**
- ✅ Invalid seed questions: filter out invalid values
- ✅ Form submit error: display error message

**Long Content:**
- ✅ Very long question text: truncate with ellipsis in pill
- ✅ Many seed questions: scrollable list performs well
- ✅ Long input value: input scrolls horizontally

**Mobile/Responsive:**
- ✅ Collapsed state adapts to narrow screens
- ✅ Expanded state scrolls properly on mobile
- ✅ Touch events work for all interactions
- ✅ Pills are appropriately sized for touch

**Accessibility:**
- ✅ Keyboard navigation works
- ✅ Focus visible on all elements
- ✅ Screen reader announces correctly
- ✅ ARIA labels present
- ✅ Form submitted with Enter
- ✅ Pills activated with Enter/Space
- ✅ Color contrast meets WCAG 2.1 AA

## Acceptance Criteria

- [x] Widget follows React 19.2 patterns ("use client", modern hooks)
- [x] Component hierarchy follows single responsibility
- [x] State management uses minimal state
- [x] TypeScript types defined in types.ts
- [x] Props interfaces documented with JSDoc
- [x] Exported from index.ts correctly
- [x] Tailwind CSS with Amazon brand colors
- [x] shadcn/ui components used (Button, Card, Input, ScrollArea)
- [x] Responsive design works on all devices
- [x] Accessibility standards met (WCAG 2.1 AA)
- [x] Preview page created
- [x] Build script working
- [x] No TypeScript errors
- [x] No build errors
- [x] Manual testing completed
- [x] Collapsed state shows 3 seed questions + CTA
- [x] Clicking seed questions populates input (NOT auto-submit)
- [x] Scroll indicator shows/hides based on scroll position
- [x] Amazon branding (orange sparkle, blue scheme)

## Validation Commands

Execute every command to validate the widget works correctly with zero regressions.

**Build Validation:**
```bash
bun run build
```
- ✅ Next.js build completes without TypeScript errors
- ✅ No build warnings

**Convex Schema Deployment:**
```bash
npx convex dev
```
- ✅ Convex functions deploy successfully
- ✅ `getCompleteWidgetsList` includes Rufus Widget
- ⚠️ Run in background (Terminal 1)

**Development Server:**
```bash
bun dev
```
- ✅ Next.js dev server starts without errors
- ✅ Navigate to http://localhost:3000
- ⚠️ Run in separate terminal (Terminal 2)

**Widget Bundle Build:**
```bash
bun run build:rufus-widget
```
- ✅ Build script executes without errors
- ✅ Bundle created at `dist/widgets/rufus-widget.min.js`
- ✅ Bundle size under 80KB target

**Unit Tests (if implemented):**
```bash
bun test
```
- ✅ All tests pass

### Manual Testing Checklist

**Admin Panel Navigation:**
- [x] Navigate to `/admin/components/widgets`
- [x] Verify "Widgets" tab shows (3) count
- [x] Verify Rufus Widget card appears
- [x] Card shows title, description, path
- [x] Card shows phase and component counts

**Preview Page:**
- [x] Click "View Preview" on widget card
- [x] Navigate to preview page
- [x] Widget renders without errors
- [x] Initially in collapsed state

**Collapsed State:**
- [x] Shows "Ask Rufus" with orange sparkle icon
- [x] Shows 3 seed question pills (light blue)
- [x] Shows "Ask something else" CTA (dark blue)
- [x] Horizontal layout with proper spacing
- [x] Click "Ask Rufus" expands widget
- [x] Click seed question expands AND populates input

**Expanded State:**
- [x] White background container
- [x] Header: menu icon, "Rufus ai" title + beta + logo, close button
- [x] Welcome card with light blue background
- [x] Heading "Welcome!"
- [x] AI disclaimer message
- [x] "What do you need help with today?" prompt
- [x] Scrollable seed questions list
- [x] Down arrow scroll indicator
- [x] Input at bottom: "Ask Rufus a question"

**Seed Questions Functionality:**
- [x] Click seed question populates input
- [x] Does NOT auto-submit when clicked
- [x] User can edit populated question before submitting
- [x] Selected question highlights in list

**Scrolling Functionality:**
- [x] Questions list scrolls smoothly
- [x] Scroll indicator visible when not at bottom
- [x] Scroll indicator hides when scrolled to bottom
- [x] ScrollArea custom scrollbar styled

**Input Functionality:**
- [x] Typing in input updates value
- [x] Placeholder visible when empty
- [x] Blue border on focus
- [x] Enter submits form

**Form Submission:**
- [x] Enter in input submits form (if onSubmit provided)
- [x] Submit triggers onSubmit callback
- [x] Form validation works

**Navigation:**
- [x] Close button collapses widget
- [x] Menu button clickable (if showMenu=true)

**Responsive Behavior:**
- [x] Mobile: Collapsed adapts layout
- [x] Tablet: Proper sizing
- [x] Desktop: Full horizontal layout

**Keyboard Navigation:**
- [x] Tab navigates through elements
- [x] Enter activates buttons
- [x] Space activates buttons
- [x] Focus visible
- [x] Focus order logical

**Accessibility:**
- [x] Screen reader announces widget
- [x] ARIA labels present
- [x] Color contrast meets WCAG 2.1 AA
- [x] Touch targets ≥44px

**Code View (Preview Page):**
- [x] Click "Code" tab
- [x] Syntax-highlighted code displays
- [x] Copy button works

**Standalone Bundle Test:**
- [x] Open `test/rufus-widget.html`
- [x] Widget loads without errors
- [x] JavaScript API works
- [x] All features work

## Notes

### Performance Considerations

**Scroll Optimization:**
- Use `onScroll` debouncing to prevent excessive state updates
- Virtual scrolling if seed questions list grows very large (>100 items)
- CSS transforms for smooth animations

**Component Rendering:**
- Wrap SeedQuestionPill in React.memo
- useCallback for event handlers
- Avoid inline functions in render

**Bundle Size:**
- Tree-shake unused Radix UI components
- Consider code-splitting if bundle >80KB
- Inline critical CSS

### Future Enhancements

**AI Integration:**
- Real-time AI response streaming
- Follow-up question suggestions
- Source citations for answers
- Confidence scoring

**Enhanced UI:**
- Voice input support
- Image/screenshot upload for product questions
- Question categories/filters
- Recent questions history

**Customization:**
- Theme variants (light/dark)
- Brand color customization
- Custom seed question categories
- Configurable welcome message

**Analytics:**
- Track popular questions
- Conversion tracking
- Time-to-first-interaction
- Question refinement patterns

**Accessibility:**
- High contrast mode
- Reduced motion mode
- Font size adjustments
- Voice output (TTS)

### Related Widgets

**onboarding-widget:**
- Shared expansion/collapse patterns
- Similar multi-component structure
- Could integrate Rufus as onboarding step

**womens-world-widget:**
- Similar seed question patterns
- Shared pill styling approaches
- Different use case but same interaction model

### Brand Alignment

**Amazon Rufus:**
- Target: All Amazon shoppers
- Context: Product browsing and research
- Tone: Helpful, conversational, transparent about AI
- Design: Clean, minimal, Amazon-branded

**Color Psychology:**
- Orange: Amazon brand recognition, energy, action
- Blue: Trust, reliability, calm
- White: Clean, simple, focused

**UX Goals:**
- Quick access to product information
- Non-intrusive presence (collapsed state)
- Transparent about AI limitations
- Encourage exploration with seed questions
