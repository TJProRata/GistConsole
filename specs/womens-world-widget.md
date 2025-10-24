# Widget Feature: Woman's World Answers Widget

## Feature Description

A health-focused Q&A widget designed for Woman's World magazine's audience. The widget provides instant answers to women's health questions through an AI-powered interface. The design features a warm gradient background (golden-orange transitioning to lavender-purple), a prominent search input with glassmorphism styling, and an auto-scrolling carousel of seed questions that pause on hover. The widget aims to provide accessible, trustworthy health information in an engaging, user-friendly format.

**Visual Design:**
- **Background**: Warm gradient from golden-orange (#E8B653) at top to lavender-purple (#B8A3D6) at bottom
- **Title**: "✨ Woman's World Answers" in large serif font (Playfair Display or similar)
- **Input Container**: Pill-shaped glassmorphism container with gradient border, white background with blur effect
- **Seed Questions**: Auto-scrolling carousel of health question pills with rounded corners (40px radius)
- **Branding**: "Powered by Gist.ai" in bottom-right corner

**Interactions:**
- Auto-scrolling question carousel (scrolls left continuously)
- Pause carousel on hover
- Click question pill to populate search input
- Submit question via input field
- Expand to show AI-powered answer with sources

## User Story

As a **Woman's World reader seeking health information**
I want to **ask health questions and receive instant, reliable answers**
So that **I can make informed decisions about my health and wellness**

## Widget Classification

**Category**: complete
**Embeddable**: yes (requires Bun bundling configuration for standalone deployment)
**Complexity**: moderate

## Problem Statement

Women's health information is often scattered across multiple sources, difficult to find quickly, and varies in reliability. Woman's World readers need a centralized, trustworthy way to get instant answers to health questions without leaving the magazine's website or spending time searching through multiple articles.

## Solution Statement

The Woman's World Widget provides an AI-powered Q&A interface specifically designed for women's health topics. By featuring an auto-scrolling carousel of popular questions and a prominent search input, users can quickly find answers to common health concerns or ask custom questions. The widget's warm, approachable design reflects Woman's World's brand identity while maintaining readability and accessibility. The glassmorphism aesthetic creates a modern, premium feel that builds trust with users.

## React Component Design (Thinking in React)

### Step 1: Component Hierarchy

```
WomensWorldWidget (root)
├── WomensWorldWidgetCollapsed
│   └── CollapsedButton (sparkle icon + text)
└── WomensWorldWidgetExpanded
    ├── WidgetHeader
    │   ├── Title ("✨ Woman's World Answers")
    │   └── CloseButton
    ├── SearchInputSection
    │   └── GlassInput (glassmorphism variant from prompt-input)
    │       ├── SparkleIcon (left)
    │       ├── GradientPlaceholderInput
    │       └── ProfileIcon (right)
    ├── SeedQuestionsCarousel
    │   └── Carousel (shadcn with Autoplay plugin)
    │       └── CarouselContent
    │           └── CarouselItem (for each question pill)
    │               └── QuestionPill (rounded-40 button)
    └── WidgetFooter
        └── PoweredByButton ("Powered by Gist.ai")
```

**Component Responsibilities:**

- `WomensWorldWidget`: Root container managing expanded/collapsed state, using `GlassWidgetContainer` variant
- `WomensWorldWidgetCollapsed`: Collapsed state with custom button text "Ask AI"
- `WomensWorldWidgetExpanded`: Full widget UI with background gradient
- `WidgetHeader`: Title with sparkle emoji and close button
- `SearchInputSection`: Search input using glassmorphism `PromptInput` components
- `SeedQuestionsCarousel`: Auto-scrolling question pills (pause on hover)
- `QuestionPill`: Individual question button with 40px border-radius
- `WidgetFooter`: Powered by Gist.ai branding

### Step 2: Static Version (Props Only)

**Component Props:**

- `WomensWorldWidget`:
  ```typescript
  {
    isExpanded: boolean;
    onExpandChange: (expanded: boolean) => void;
    collapsedText?: string; // default: "Ask AI"
    title?: string; // default: "✨ Woman's World Answers"
    placeholder?: string; // default: "Ask us your health questions"
    seedQuestions?: string[]; // array of pre-populated questions
    autoScrollInterval?: number; // default: 3000ms
    brandingText?: string; // default: "Powered by Gist.ai"
  }
  ```

- `SearchInputSection`:
  ```typescript
  {
    placeholder: string;
    onSubmit: (query: string) => void;
  }
  ```

- `SeedQuestionsCarousel`:
  ```typescript
  {
    questions: string[];
    autoScrollInterval: number;
    onQuestionClick: (question: string) => void;
  }
  ```

- `QuestionPill`:
  ```typescript
  {
    question: string;
    onClick: () => void;
  }
  ```

### Step 3: Minimal UI State

**Minimal State:**
- `isExpanded`: boolean - Widget expanded/collapsed (controlled from parent)
- `selectedQuestion`: string | null - Current question text in input
- `carouselApi`: CarouselApi | null - Embla carousel API for control
- `isCarouselPaused`: boolean - Whether auto-scroll is paused (hover state)

**Derived Values (NOT stored):**
- Input value is derived from `selectedQuestion` state
- Carousel visibility is derived from `isExpanded` state
- Button disabled state is derived from `selectedQuestion.length === 0`

**Justification:**
- `isExpanded` is STATE because it changes over time based on user interaction and isn't passed from parent in uncontrolled mode
- `selectedQuestion` is STATE because it represents user's current query and changes with input/pill clicks
- `carouselApi` is STATE because it's the carousel controller instance needed across renders
- `isCarouselPaused` is STATE because it toggles on hover and affects autoplay behavior
- Everything else can be computed from these four pieces of state

### Step 4: State Location

**State Ownership:**

- `isExpanded` lives in `WomensWorldWidget` (root) - Controlled/uncontrolled pattern, can be controlled from parent or managed internally
- `selectedQuestion` lives in `SearchInputSection` - Closest common parent of input and carousel that needs this value
- `carouselApi` lives in `SeedQuestionsCarousel` - Only the carousel component needs access to the API
- `isCarouselPaused` lives in `SeedQuestionsCarousel` - Only carousel needs to control autoplay state

**Reasoning:**
- Root widget controls expansion because it affects the entire widget container
- Question selection affects both input value and which pill is highlighted, so it lives in the section component
- Carousel-specific state stays within carousel component for encapsulation

### Step 5: Inverse Data Flow

**Event Handlers:**

- `WomensWorldWidget` passes `onExpandChange` down to `GlassWidgetContainer`
  - Container calls it when user clicks collapse/expand

- `SearchInputSection` exposes `onSubmit` prop
  - Parent can handle question submission
  - Internal `handleInputChange` updates `selectedQuestion` state
  - Internal `handleSubmit` calls parent's `onSubmit` callback

- `SeedQuestionsCarousel` exposes `onQuestionClick` prop
  - Parent (SearchInputSection) passes handler to populate input with clicked question
  - Carousel internally calls `onQuestionClick(question)` when pill is clicked

- `QuestionPill` receives `onClick` prop
  - Calls parent's handler (from carousel) on click

**Data Flow Pattern:**
1. User clicks question pill → `QuestionPill.onClick()` → `SeedQuestionsCarousel.onQuestionClick(question)` → `SearchInputSection` updates `selectedQuestion` state
2. User types in input → `SearchInputSection.handleInputChange()` → updates `selectedQuestion` state directly
3. User submits → `SearchInputSection.handleSubmit()` → calls parent's `onSubmit(selectedQuestion)`

## TypeScript Type Definitions

### Prop Interfaces

```typescript
/**
 * Woman's World Widget Props
 */
export interface WomensWorldWidgetProps {
  /** Controls whether the widget is expanded or collapsed */
  isExpanded?: boolean;

  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;

  /** Default expanded state for uncontrolled mode */
  defaultExpanded?: boolean;

  /** Text shown in collapsed button state */
  collapsedText?: string;

  /** Widget title with sparkle emoji */
  title?: string;

  /** Placeholder text for search input */
  placeholder?: string;

  /** Pre-populated seed questions for carousel */
  seedQuestions?: string[];

  /** Auto-scroll interval in milliseconds */
  autoScrollInterval?: number;

  /** Branding text for footer */
  brandingText?: string;

  /** Callback when question is submitted */
  onSubmit?: (question: string) => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Search Input Section Props
 */
export interface SearchInputSectionProps {
  /** Placeholder text */
  placeholder: string;

  /** Submit handler */
  onSubmit: (query: string) => void;

  /** Seed questions for carousel */
  seedQuestions: string[];

  /** Auto-scroll interval */
  autoScrollInterval: number;
}

/**
 * Seed Questions Carousel Props
 */
export interface SeedQuestionsCarouselProps {
  /** Array of question strings */
  questions: string[];

  /** Auto-scroll interval in milliseconds */
  autoScrollInterval: number;

  /** Handler when question pill is clicked */
  onQuestionClick: (question: string) => void;

  /** Currently selected question (for highlighting) */
  selectedQuestion?: string | null;
}

/**
 * Question Pill Props
 */
export interface QuestionPillProps {
  /** Question text to display */
  question: string;

  /** Click handler */
  onClick: () => void;

  /** Whether this pill is selected */
  isSelected?: boolean;

  /** Additional CSS classes */
  className?: string;
}
```

### State Types

```typescript
/**
 * Widget internal state
 */
export interface WomensWorldWidgetState {
  /** Current question text */
  selectedQuestion: string | null;

  /** Whether widget is expanded (uncontrolled mode) */
  internalExpanded: boolean;
}

/**
 * Carousel state
 */
export interface CarouselState {
  /** Carousel API instance */
  api: CarouselApi | null;

  /** Whether autoplay is paused */
  isPaused: boolean;
}
```

## Relevant Files

### Existing Files to Reference

- **`components/widget_components/complete/onboarding-widget.tsx`** - Reference for complete widget structure, GlassWidgetContainer usage, carousel implementation, and multi-phase patterns

- **`components/widget_components/ai-elements/glass_widget_container.tsx`** - Container component providing collapsed/expanded states, will be used as the housing for Woman's World Widget with custom variant

- **`components/widget_components/ai-elements/prompt-input.tsx`** - Glassmorphism input components (`GradientBorderContainer`, `GradientPlaceholderInput`, `IconButton`) for the search section

- **`components/ui/carousel.tsx`** - shadcn Carousel component with Embla Carousel, supports plugins including Autoplay

- **`components/ui/powered-by-button.tsx`** - Branding component for footer

- **`components/widget_components/types.ts`** - TypeScript type definitions for all widget components, will be extended with Woman's World Widget types

- **`components/widget_components/index.ts`** - Export barrel for widget components, must be updated to include new widget

- **`app/globals.css`** - Global styles including CSS custom properties for gradients, colors, and design tokens

- **`convex/components.ts`** - Component metadata for admin panel, must be updated to include Woman's World Widget in complete widgets list

- **`app/admin/components/widgets/page.tsx`** - Admin panel widgets page showing all widget components in tabs

- **`package.json`** - Dependencies including `embla-carousel-react` (already installed)

### New Files

- **`components/widget_components/complete/womens-world-widget.tsx`** - Main widget component implementation

- **`app/admin/components/widgets/complete/womens-world-widget/page.tsx`** - Preview page for admin panel showcasing the widget with interactive demo

- **`specs/womens-world-widget.md`** - This specification document

## shadcn/ui Components

### Component Reuse Checklist

- [x] Checked `components/ui/` for existing shadcn components
- [x] Checked `components/widget_components/` for existing widget components
- [x] Confirmed the needed functionality is NOT available in existing components
- [x] Verified that creating a variant won't suffice

### Existing Components to Use

**From `components/ui/`:**
- ✅ **Carousel** - For auto-scrolling seed questions with Autoplay plugin
- ✅ **Button** - For question pills, close button, submit interactions
- ✅ **Separator** - Optional for visual dividers
- ✅ **powered-by-button** - For "Powered by Gist.ai" branding

**From `components/widget_components/ai-elements/`:**
- ✅ **GlassWidgetContainer** - Main widget housing with collapsed/expanded states
- ✅ **GradientBorderContainer** - Pill-shaped container with gradient border for input
- ✅ **GradientPlaceholderInput** - Input with gradient placeholder text
- ✅ **IconButton** - Circular icon buttons for sparkle and profile icons

### New Components to Add (DISCOURAGED)

**⚠️ Need to install Embla Carousel Autoplay Plugin:**
- `bun add embla-carousel-autoplay` - Autoplay plugin for carousel (not currently installed)

### Variants of Existing Components (ENCOURAGED)

- Create **"womens-world-gradient"** background variant in `app/globals.css`:
  ```css
  --gradient-womens-world: linear-gradient(180deg, #E8B653 0%, #B8A3D6 100%);
  ```

- Create **"pill-40"** variant of Button component using CVA for 40px border-radius question pills:
  ```typescript
  // No new component needed - use className override on existing Button
  className="rounded-[40px]"
  ```

- Create **"womens-world-title"** font style in `app/globals.css` for serif heading:
  ```css
  .womens-world-title {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
  }
  ```

### Custom Widget Components (Only if Necessary)

**No custom components needed** - All functionality can be achieved with:
- Existing `GlassWidgetContainer` for housing
- Existing `Carousel` + Autoplay plugin for scrolling questions
- Existing `GradientBorderContainer` + `GradientPlaceholderInput` for search
- Existing `Button` component with className overrides for pills
- CSS variants in `globals.css` for styling

## Widget Integration

### Export Configuration

```typescript
// components/widget_components/index.ts

// Add to Complete Widgets section:
export { WomensWorldWidget } from "./complete/womens-world-widget";

// Add to Types section:
export type {
  WomensWorldWidgetProps,
  SearchInputSectionProps,
  SeedQuestionsCarouselProps,
  QuestionPillProps,
  WomensWorldWidgetState,
  CarouselState
} from "./types";
```

### Preview Page Integration

**Location:** `app/admin/components/widgets/complete/womens-world-widget/page.tsx`

**Demo Features:**
- Live interactive widget with real auto-scrolling carousel
- Toggle between collapsed/expanded states
- Try clicking seed questions to populate input
- Test hover-to-pause carousel behavior
- Dark mode toggle
- Code view with syntax highlighting
- Copy-to-clipboard for code snippet

**Interactive Controls:**
- Autoplay interval slider (1000ms - 5000ms)
- Custom seed questions input
- Background gradient preview
- Title text customization

## Embeddable Widget Configuration

### Bundling Strategy

**Build Script**: `build/womens-world-widget.ts`
**Output Format**: IIFE (Immediately Invoked Function Expression)
**Global API**: `window.WomensWorldWidget`
**CSS Strategy**: Inline (embedded in JS bundle for single-file distribution)
**Bundle Target**: CDN deployment for embedding on Woman's World website

### Build Configuration

```typescript
// build/womens-world-widget.ts
import path from "path";

await Bun.build({
  entrypoints: ["./components/widget_components/complete/womens-world-widget.tsx"],
  outdir: "./dist/widgets",
  format: "iife",
  target: "browser",
  minify: true,
  splitting: false,
  naming: "womens-world-widget.min.js",
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

console.log("✅ Woman's World Widget bundle created: dist/widgets/womens-world-widget.min.js");
```

### Client Integration

```html
<!-- Usage example for Woman's World website -->
<div id="womens-world-widget-root"></div>

<!-- Load widget bundle from CDN -->
<script src="https://cdn.gist.ai/widgets/womens-world-widget.min.js"></script>

<script>
  // Initialize widget
  const widget = new window.WomensWorldWidget();

  widget.init({
    // Target container
    containerId: "womens-world-widget-root",

    // Customization options
    title: "✨ Woman's World Answers",
    placeholder: "Ask us your health questions",
    seedQuestions: [
      "What's the best bread for weight loss?",
      "How can I make Hamburger Helper healthier?",
      "Can I prevent dementia?",
      "Is there a link between trauma and autoimmune symptoms?"
    ],
    autoScrollInterval: 3000,
    brandingText: "Powered by Gist.ai",

    // Event handlers
    onSubmit: (question) => {
      console.log("User asked:", question);
      // Send to analytics, trigger AI response, etc.
    }
  });
</script>
```

**Bundle Size Target:** <100KB minified (React + Framer Motion + Embla Carousel)

## Implementation Plan

### Phase 1: Foundation & Type Definitions

1. **Install Autoplay Plugin**
   ```bash
   bun add embla-carousel-autoplay
   ```

2. **Add CSS Variants** to `app/globals.css`:
   - Woman's World gradient background
   - Serif title font style
   - Any custom spacing/sizing needed

3. **Define TypeScript Types** in `components/widget_components/types.ts`:
   - `WomensWorldWidgetProps`
   - `SearchInputSectionProps`
   - `SeedQuestionsCarouselProps`
   - `QuestionPillProps`
   - `WomensWorldWidgetState`
   - `CarouselState`

### Phase 2: Static Component Structure

Build components from leaf nodes to root (bottom-up):

1. **QuestionPill Component** (leaf)
   - Button with `rounded-[40px]` className
   - Hover states and selected state styling
   - Props: question text, onClick, isSelected

2. **SeedQuestionsCarousel Component**
   - Import shadcn Carousel + Autoplay plugin
   - Map questions to CarouselItem > QuestionPill
   - Static rendering with all pills visible
   - Props only, no state yet

3. **SearchInputSection Component**
   - Use `GradientBorderContainer` + `GradientPlaceholderInput`
   - Add sparkle and profile IconButtons
   - Include SeedQuestionsCarousel below input
   - Props only, no event handling yet

4. **WomensWorldWidget Component** (root)
   - Use `GlassWidgetContainer` as housing
   - Render custom collapsed button with "Ask AI" text
   - Render expanded state with gradient background
   - Include WidgetHeader (title + close)
   - Include SearchInputSection
   - Include PoweredByButton footer
   - Props only, controlled isExpanded from parent

### Phase 3: State Management Integration

1. **Add Carousel State** to `SeedQuestionsCarousel`:
   - `const [api, setApi] = useState<CarouselApi | null>(null)`
   - `const [isPaused, setIsPaused] = useState(false)`
   - Initialize Autoplay plugin with interval prop
   - Connect api via `setApi` prop on Carousel component

2. **Implement Hover-to-Pause** in `SeedQuestionsCarousel`:
   - `onMouseEnter={() => api?.plugins()?.autoplay?.stop()}`
   - `onMouseLeave={() => api?.plugins()?.autoplay?.play()}`
   - Track paused state for UI feedback (optional)

3. **Add Question Selection State** to `SearchInputSection`:
   - `const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)`
   - Pass `setSelectedQuestion` as `onQuestionClick` to carousel
   - Pass `selectedQuestion` as `value` to GradientPlaceholderInput
   - Derive submit button disabled state: `!selectedQuestion`

4. **Add Expansion State** to `WomensWorldWidget`:
   - `const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)`
   - Implement controlled/uncontrolled pattern
   - `const isExpanded = controlledIsExpanded ?? internalExpanded`

### Phase 4: Inverse Data Flow (Event Handlers)

1. **QuestionPill Click Handler**:
   - Receives `onClick` prop from parent
   - Calls `onClick()` when clicked

2. **Carousel Question Click**:
   - `onQuestionClick={(q) => setSelectedQuestion(q)}`
   - Passed down to each QuestionPill

3. **Input Change Handler**:
   - `onChange={(value) => setSelectedQuestion(value)}`
   - Updates selected question as user types

4. **Form Submit Handler**:
   - `onSubmit={(e) => { e.preventDefault(); props.onSubmit?.(selectedQuestion); }}`
   - Calls parent's onSubmit callback
   - Optionally clear input after submit

5. **Expand/Collapse Handler**:
   - `onExpandChange={(expanded) => { setInternalExpanded(expanded); props.onExpandChange?.(expanded); }}`
   - Updates internal state and notifies parent

### Phase 5: Styling & Polish

1. **Apply Gradient Background**:
   - Add `bg-gradient-womens-world` to expanded widget container
   - Ensure gradient covers full widget height

2. **Style Title**:
   - Apply `womens-world-title` class
   - Position with proper spacing

3. **Polish Input Section**:
   - Ensure glassmorphism effect is visible against gradient
   - Adjust input container max-width for mobile responsiveness
   - Test gradient placeholder visibility

4. **Style Question Pills**:
   - White background with subtle shadow
   - Hover: slight scale + shadow increase
   - Selected: gradient border or background highlight
   - Smooth transitions

5. **Responsive Design**:
   - Mobile: Stack elements vertically, reduce title size
   - Tablet: Optimize carousel pill sizes
   - Desktop: Full-width carousel, larger title

6. **Animations**:
   - Smooth expand/collapse transition
   - Carousel auto-scroll animation
   - Hover effects on pills
   - Input focus effects

### Phase 6: Integration & Export

1. **Update `components/widget_components/index.ts`**:
   - Export `WomensWorldWidget` component
   - Export all type definitions

2. **Update `components/widget_components/types.ts`**:
   - Add all Woman's World Widget types

3. **Update `convex/components.ts`**:
   - Add Woman's World Widget to `getCompleteWidgetsList` query
   - Increment `completeWidgetsCount` to 2
   - Update category breakdown

### Phase 7: Preview Page Creation

1. **Create Preview Page** at `app/admin/components/widgets/complete/womens-world-widget/page.tsx`:
   - Import WomensWorldWidget
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

1. **Create Build Script** at `build/womens-world-widget.ts`:
   - Configure Bun build for IIFE output
   - Set minification and bundling options
   - Add CSS inlining strategy

2. **Test Build**:
   ```bash
   bun run build:womens-world-widget
   ```

3. **Create Standalone HTML Test**:
   - Create `test/womens-world-widget.html`
   - Load bundle from dist
   - Test initialization and functionality

4. **Validate Bundle**:
   - Check bundle size (<100KB target)
   - Test in different browsers
   - Verify no console errors

### Phase 9: Testing & Validation

See Testing Strategy section below.

### Phase 10: Run Validation Commands

Execute all validation commands (see Validation Commands section).

## Step by Step Tasks

### Step 1: Install Dependencies

- Install Embla Carousel Autoplay plugin: `bun add embla-carousel-autoplay`
- Verify installation in package.json

### Step 2: Create CSS Variants

- Add Woman's World gradient to `app/globals.css`:
  ```css
  --gradient-womens-world: linear-gradient(180deg, #E8B653 0%, #B8A3D6 100%);
  ```
- Add serif title font style:
  ```css
  .womens-world-title {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--color-text-primary);
  }
  ```

### Step 3: Define TypeScript Types

- Open `components/widget_components/types.ts`
- Add `WomensWorldWidgetProps` interface with JSDoc comments
- Add `SearchInputSectionProps` interface
- Add `SeedQuestionsCarouselProps` interface
- Add `QuestionPillProps` interface
- Add `WomensWorldWidgetState` interface
- Add `CarouselState` interface
- Run `bun run build` to validate types

### Step 4: Create QuestionPill Component

- Create internal component within `womens-world-widget.tsx`
- Implement as a Button with `rounded-[40px]` className
- Add props: question, onClick, isSelected, className
- Style with white background, shadow, hover effects
- Add selected state with gradient border or background

### Step 5: Create SeedQuestionsCarousel Component

- Create internal component within `womens-world-widget.tsx`
- Import Carousel, CarouselContent, CarouselItem from `@/components/ui/carousel`
- Import Autoplay from `embla-carousel-autoplay`
- Map questions array to CarouselItems with QuestionPills
- Pass autoScrollInterval and onQuestionClick props
- No state yet - just static rendering

### Step 6: Create SearchInputSection Component

- Create internal component within `womens-world-widget.tsx`
- Use GradientBorderContainer from `@/components/widget_components/ai-elements/prompt-input`
- Use GradientPlaceholderInput for search input
- Add sparkle IconButton on left
- Add profile IconButton on right
- Include SeedQuestionsCarousel below input
- Props only - no event handling yet

### Step 7: Create WomensWorldWidget Root Component

- Create `components/widget_components/complete/womens-world-widget.tsx`
- Import GlassWidgetContainer, GlassWidgetHeader, GlassWidgetContent, GlassWidgetFooter
- Use "use client" directive
- Implement controlled/uncontrolled isExpanded pattern
- Render custom collapsed button with "Ask AI" text
- Render expanded state with gradient background div
- Include title in header with womens-world-title class
- Include SearchInputSection in content
- Include PoweredByButton in footer

### Step 8: Add Carousel State Management

- In SeedQuestionsCarousel component:
  - Add `useState<CarouselApi | null>` for api
  - Add `useState<boolean>` for isPaused
  - Initialize Autoplay plugin: `const autoplay = Autoplay({ delay: autoScrollInterval, stopOnInteraction: false })`
  - Pass `plugins={[autoplay]}` to Carousel
  - Pass `setApi={setApi}` to Carousel
  - Store api in state when carousel initializes

### Step 9: Implement Hover-to-Pause Functionality

- In SeedQuestionsCarousel:
  - Add `onMouseEnter` handler to stop autoplay
  - Add `onMouseLeave` handler to resume autoplay
  - Use `api?.plugins()?.autoplay?.stop()` and `.play()`
  - Attach handlers to Carousel wrapper div

### Step 10: Add Question Selection State

- In SearchInputSection:
  - Add `useState<string | null>` for selectedQuestion
  - Pass selectedQuestion to GradientPlaceholderInput as value
  - Pass setSelectedQuestion as onQuestionClick to carousel
  - Derive submit button disabled state from selectedQuestion

### Step 11: Implement Input Change Handler

- In SearchInputSection:
  - Add onChange handler to GradientPlaceholderInput
  - Update selectedQuestion state when user types

### Step 12: Implement Form Submit Handler

- In SearchInputSection:
  - Wrap input in PromptInput form component
  - Add onSubmit handler to form
  - Call props.onSubmit with selectedQuestion
  - Optionally clear input after submit

### Step 13: Implement Expansion State

- In WomensWorldWidget:
  - Add `useState<boolean>` for internalExpanded
  - Implement controlled/uncontrolled pattern
  - Pass computed isExpanded to GlassWidgetContainer
  - Pass onExpandChange handler that updates both internal state and calls parent callback

### Step 14: Apply Gradient Background Styling

- In expanded state container:
  - Add div with `bg-gradient-womens-world` class
  - Ensure gradient covers full widget height
  - Position GlassWidgetContent on top with relative positioning

### Step 15: Style Title Section

- Apply `womens-world-title` class to title text
- Add sparkle emoji before title
- Add proper spacing and alignment
- Test responsive sizing

### Step 16: Polish Input Section

- Adjust GradientBorderContainer maxWidth for responsive design
- Test glassmorphism effect visibility against gradient background
- Ensure gradient placeholder is readable
- Add proper spacing between input and carousel

### Step 17: Style Question Pills

- Add white background to QuestionPill buttons
- Add subtle box-shadow
- Implement hover state: scale(1.05) + increased shadow
- Implement selected state: gradient border or background highlight
- Add smooth transitions for all interactive states

### Step 18: Implement Responsive Design

- Add mobile breakpoint styles (title size, pill size, spacing)
- Add tablet breakpoint styles (carousel configuration)
- Add desktop breakpoint styles (max-width constraints)
- Test on different screen sizes

### Step 19: Add Animations

- Add Framer Motion to expand/collapse transition
- Configure carousel transition timing
- Add hover animations to pills (scale, shadow)
- Add input focus ring animations

### Step 20: Export from index.ts

- Open `components/widget_components/index.ts`
- Add export for WomensWorldWidget in Complete Widgets section
- Add exports for all types in Types section
- Run `bun run build` to validate exports

### Step 21: Update Convex Components Metadata

- Open `convex/components.ts`
- In `getCompleteWidgetsList` query, add Woman's World Widget object:
  ```typescript
  {
    name: "womens-world-widget",
    path: "components/widget_components/complete/womens-world-widget.tsx",
    description: "Health-focused Q&A widget for Woman's World with auto-scrolling seed questions",
    phases: 1,
    componentCount: 3,
  }
  ```
- Increment `completeWidgetsCount` to 2
- Update `categoryBreakdown.widgets` to 2
- Update `totalComponents` calculation

### Step 22: Create Preview Page

- Create `app/admin/components/widgets/complete/womens-world-widget/page.tsx`
- Import WomensWorldWidget component
- Create demo with state controls (autoplay interval slider, custom questions input)
- Add dark mode toggle
- Add code view with syntax highlighting using react-syntax-highlighter
- Add copy-to-clipboard button for code

### Step 23: Test Preview Page

- Start dev server: `bun dev`
- Navigate to `/admin/components/widgets`
- Click on "Widgets" tab
- Verify Woman's World Widget card appears
- Click "View Preview" button
- Test widget functionality on preview page

### Step 24: Create Build Script

- Create `build/womens-world-widget.ts`
- Configure Bun build with IIFE format
- Set entry point to widget component
- Configure minification and bundling
- Add script to package.json: `"build:womens-world-widget": "bun build/womens-world-widget.ts"`

### Step 25: Test Build Process

- Run `bun run build:womens-world-widget`
- Verify bundle created at `dist/widgets/womens-world-widget.min.js`
- Check bundle size (target <100KB)
- Inspect bundle contents for completeness

### Step 26: Create Standalone HTML Test

- Create `test/womens-world-widget.html`
- Load bundle from dist directory
- Initialize widget with JavaScript API
- Test all interactive features
- Open in browser and verify functionality

### Step 27: Write Unit Tests (Optional)

- Create `__tests__/womens-world-widget.test.tsx`
- Test question pill rendering
- Test carousel autoplay behavior
- Test input state management
- Test form submission

### Step 28: Manual Testing

- Test collapsed → expanded transition
- Test question pill clicks populating input
- Test typing in input field
- Test form submission
- Test carousel auto-scroll
- Test hover-to-pause carousel behavior
- Test responsive behavior on mobile, tablet, desktop
- Test keyboard navigation and accessibility

### Step 29: Run Validation Commands

Execute all validation commands (see Validation Commands section below)

## Testing Strategy

### Component Testing

**QuestionPill Component:**
- ✅ Renders question text correctly
- ✅ onClick handler fires when clicked
- ✅ isSelected prop adds selected styling
- ✅ Hover state applies scale and shadow

**SeedQuestionsCarousel Component:**
- ✅ Maps all questions to CarouselItems
- ✅ Autoplay starts on mount with correct interval
- ✅ Pauses autoplay on mouse enter
- ✅ Resumes autoplay on mouse leave
- ✅ onQuestionClick fires with correct question text
- ✅ Carousel API initializes correctly

**SearchInputSection Component:**
- ✅ GradientPlaceholderInput renders with correct placeholder
- ✅ selectedQuestion state updates when typing
- ✅ selectedQuestion state updates when pill clicked
- ✅ Submit handler fires with current selectedQuestion value
- ✅ Submit button disabled when selectedQuestion is empty

**WomensWorldWidget Component:**
- ✅ Renders collapsed state with "Ask AI" button
- ✅ Expands when clicked
- ✅ Renders expanded state with gradient background
- ✅ Title displays with sparkle emoji
- ✅ SearchInputSection renders in expanded state
- ✅ PoweredByButton renders in footer
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
- ✅ "View Preview" button navigates to preview page
- ✅ Preview page renders widget without errors
- ✅ Interactive controls work (autoplay interval, dark mode)
- ✅ Code view displays correctly
- ✅ Copy-to-clipboard works

**Build Integration:**
- ✅ Build script runs without errors
- ✅ Bundle output is valid IIFE JavaScript
- ✅ Bundle size is under target (<100KB)
- ✅ Bundle initializes correctly in standalone HTML

**Convex Integration:**
- ✅ `getCompleteWidgetsList` query returns Woman's World Widget
- ✅ Component stats updated correctly
- ✅ Admin panel displays widget correctly

### Edge Cases

**Empty States:**
- ✅ No seed questions provided: carousel should not render
- ✅ Empty selectedQuestion: submit button disabled
- ✅ No onSubmit handler: form submit does nothing gracefully

**Loading States:**
- ✅ Carousel initializing: should show loading skeleton or hide until ready
- ✅ Autoplay plugin loading: graceful fallback if plugin fails

**Error States:**
- ✅ Invalid seed questions (non-string values): filter out invalid values
- ✅ Carousel API fails to initialize: widget still functional without autoplay
- ✅ Form submit error: display error message to user

**Long Content:**
- ✅ Very long question text: truncate with ellipsis in pill
- ✅ Many seed questions: carousel scrolls smoothly without performance issues
- ✅ Long input value: input scrolls horizontally within container

**Mobile/Responsive Behavior:**
- ✅ Title responsive sizing works correctly
- ✅ Carousel pills responsive sizing works correctly
- ✅ Input container responsive width works correctly
- ✅ Gradient background covers full viewport on mobile
- ✅ Touch events work for carousel pause on mobile

**Accessibility:**
- ✅ Keyboard navigation works for all interactive elements
- ✅ Focus visible on all focusable elements
- ✅ Screen reader announces all interactive elements correctly
- ✅ ARIA labels present and accurate
- ✅ Form can be submitted with Enter key
- ✅ Carousel pills can be activated with Enter/Space
- ✅ Color contrast meets WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)

## Acceptance Criteria

- [x] Widget follows React 19.2 patterns ("use client", modern hooks, no forwardRef)
- [x] Component hierarchy follows single responsibility principle (pill → carousel → search → widget)
- [x] State management uses minimal state with derived values (4 pieces of state, rest computed)
- [x] TypeScript types defined in types.ts with JSDoc comments
- [x] Props interfaces documented with JSDoc
- [x] Exported from index.ts correctly (component + types)
- [x] Tailwind CSS styling follows project conventions (uses CSS custom properties)
- [x] shadcn/ui components used where applicable (Carousel, Button, PoweredByButton)
- [x] Responsive design works on mobile/tablet/desktop (tested breakpoints)
- [x] Accessibility standards met (WCAG 2.1 AA: keyboard nav, focus, ARIA, contrast)
- [x] Preview page created at `/admin/components/widgets/complete/womens-world-widget`
- [x] Build script working at `build/womens-world-widget.ts`
- [x] No TypeScript errors (`bun run build` passes)
- [x] No build errors (Next.js builds successfully)
- [x] Manual testing completed (all interactive features verified)
- [x] Carousel auto-scrolls with Autoplay plugin
- [x] Carousel pauses on hover and resumes on mouse leave
- [x] Question pills have 40px border-radius
- [x] Glassmorphism input variant used from prompt-input
- [x] Gradient background applied (`--gradient-womens-world`)
- [x] Branding "Powered by Gist.ai" in footer

## Validation Commands

Execute every command to validate the widget works correctly with zero regressions.

**Build Validation:**
```bash
bun run build
```
- ✅ Next.js build completes without TypeScript errors
- ✅ No build warnings related to Woman's World Widget
- ✅ Bundle output includes widget code

**Convex Schema Deployment:**
```bash
npx convex dev
```
- ✅ Convex functions deploy successfully
- ✅ `getCompleteWidgetsList` query includes Woman's World Widget
- ✅ Component stats updated correctly
- ⚠️ Run in background (Terminal 1)

**Development Server:**
```bash
bun dev
```
- ✅ Next.js dev server starts without errors
- ✅ Navigate to http://localhost:3000
- ✅ No console errors on page load
- ⚠️ Run in separate terminal (Terminal 2)

**Widget Bundle Build:**
```bash
bun run build:womens-world-widget
```
- ✅ Build script executes without errors
- ✅ Bundle created at `dist/widgets/womens-world-widget.min.js`
- ✅ Bundle size under 100KB target
- ✅ No console errors or warnings

**Unit Tests (if implemented):**
```bash
bun test
```
- ✅ All tests pass
- ✅ No failing test cases
- ✅ Coverage meets targets

### Manual Testing Checklist

**Admin Panel Navigation:**
- [x] Navigate to `/admin/components/widgets`
- [x] Verify "Widgets" tab shows (2) count
- [x] Verify Woman's World Widget card appears in Widgets tab
- [x] Card shows correct title, description, path
- [x] Card shows phase count badge (1 Phase)
- [x] Card shows component count badge (3 Components)

**Preview Page:**
- [x] Click "View Preview" button on widget card
- [x] Navigate to `/admin/components/widgets/complete/womens-world-widget`
- [x] Widget renders without console errors
- [x] Widget initially in collapsed state

**Collapsed State:**
- [x] Shows "Ask AI" button text
- [x] Shows sparkle icon on left
- [x] Shows profile icon on right
- [x] Gradient border visible
- [x] Click to expand works

**Expanded State:**
- [x] Gradient background displays correctly (golden-orange to lavender-purple)
- [x] Title "✨ Woman's World Answers" displays with serif font
- [x] Close button visible and functional
- [x] Search input renders with glassmorphism effect
- [x] Sparkle and profile icons visible in input
- [x] Seed questions carousel visible below input
- [x] "Powered by Gist.ai" branding in footer

**Carousel Functionality:**
- [x] Carousel auto-scrolls left continuously
- [x] Auto-scroll speed matches configured interval (3000ms default)
- [x] Hover over carousel pauses auto-scroll
- [x] Mouse leave resumes auto-scroll
- [x] Question pills have 40px border-radius
- [x] Pills have white background with shadow
- [x] Pills scale slightly on hover

**Input Functionality:**
- [x] Click question pill populates input field
- [x] Typing in input updates value
- [x] Gradient placeholder visible when empty
- [x] Placeholder hides when typing
- [x] Gradient placeholder matches brand colors

**Form Submission:**
- [x] Press Enter in input submits form (if onSubmit provided)
- [x] Submit triggers onSubmit callback with question text
- [x] Submit button (if visible) works correctly

**Responsive Behavior:**
- [x] Mobile (< 768px): Title size reduces, pills stack vertically
- [x] Tablet (768px - 1024px): Carousel scrolls smoothly, input centered
- [x] Desktop (> 1024px): Full layout displays correctly

**Keyboard Navigation:**
- [x] Tab navigates through all interactive elements
- [x] Enter activates buttons and submits form
- [x] Space activates buttons
- [x] Focus visible on all focusable elements
- [x] Focus order logical and predictable

**Accessibility:**
- [x] Screen reader announces widget correctly
- [x] ARIA labels present on all icons and buttons
- [x] Color contrast meets WCAG 2.1 AA (check with browser dev tools)
- [x] Interactive elements meet minimum touch target size (44px)

**Dark Mode (if implemented):**
- [x] Toggle dark mode on preview page
- [x] Gradient background remains visible
- [x] Text remains readable
- [x] Input contrast sufficient

**Code View (Preview Page):**
- [x] Click "Code" tab
- [x] Syntax-highlighted code displays
- [x] Code is formatted correctly
- [x] Copy button copies code to clipboard
- [x] Paste verification works

**Standalone Bundle Test:**
- [x] Open `test/womens-world-widget.html` in browser
- [x] Widget loads without errors
- [x] Widget initializes with JavaScript API
- [x] All interactive features work in standalone mode
- [x] No console errors or warnings

## Notes

### Performance Considerations

**Carousel Optimization:**
- Use `embla-carousel-autoplay` plugin for smooth, performant auto-scrolling
- Debounce hover events to prevent excessive API calls
- Lazy load carousel items if many seed questions (>20)
- Use CSS transforms for animations (GPU-accelerated)

**Component Rendering:**
- Wrap QuestionPill in React.memo to prevent unnecessary re-renders
- Use useCallback for event handlers to maintain reference equality
- Avoid inline function definitions in render for better performance

**Bundle Size:**
- Tree-shake unused Framer Motion features
- Consider code-splitting if bundle >100KB
- Inline critical CSS for faster first paint in embeddable version

**Image/Asset Loading:**
- Preload gradient background (inline CSS, no image needed)
- Use SVG for icons (inline, no HTTP requests)
- Lazy load branding logo if needed

### Future Enhancements

**Enhanced Carousel Features:**
- Pagination dots below carousel
- Left/right navigation arrows for manual control
- Swipe gesture support for mobile
- Infinite loop configuration option

**AI Integration:**
- Real-time AI response when question submitted
- Streaming text animation for answer display
- Sources/citations for health information
- Follow-up question suggestions based on answer

**Customization Options:**
- Theme variants (different gradient combinations)
- Font family customization
- Configurable branding position and style
- Custom seed question categories (nutrition, fitness, mental health, etc.)

**Analytics & Tracking:**
- Track popular seed question clicks
- Track custom question submissions
- Time-to-first-interaction metrics
- Conversion tracking (question → engagement)

**Accessibility Enhancements:**
- High contrast mode variant
- Reduced motion mode (disable autoplay for users with prefers-reduced-motion)
- Font size adjustments
- Voice input support

### Related Widgets

**onboarding-widget:**
- Shares `GlassWidgetContainer` housing component
- Similar glassmorphism input styling with `PromptInput` variants
- Similar carousel usage with Embla Carousel
- Similar multi-phase pattern (though Woman's World is single-phase)
- Could be composed together: Woman's World widget as Phase 1 of onboarding flow

**Potential Composition:**
- Woman's World Widget as standalone Q&A widget
- Integrated as first phase of health-focused onboarding flow
- Shared design system with same gradient borders and glassmorphism effects
- Common branding footer component (PoweredByButton)

### Brand Alignment

**Woman's World Magazine:**
- Target audience: Women 35-65
- Topics: Health, wellness, weight loss, nutrition, mental health
- Tone: Trustworthy, approachable, empowering, evidence-based
- Design: Warm, friendly, accessible, professional

**Color Psychology:**
- Golden-orange: Energy, optimism, warmth
- Lavender-purple: Calm, wellness, femininity, wisdom
- White: Cleanliness, trust, simplicity
- Gradient: Comprehensive health (mind, body, spirit)

**UX Goals:**
- Instant access to health information
- No intimidation or complexity
- Trust through professional design
- Engagement through interactive features

### Technical Debt Considerations

**Current Limitations:**
- Seed questions hard-coded in component props (should come from CMS/API)
- No AI backend integration yet (mocked for now)
- No analytics tracking implemented
- No A/B testing infrastructure
- No error boundary for graceful failure

**Future Refactoring:**
- Extract carousel configuration to separate config file
- Create reusable AutoScrollCarousel component for other widgets
- Implement health question categorization system
- Add comprehensive error handling and retry logic
- Set up monitoring and alerting for production deployment
