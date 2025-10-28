# Chore: Move Shared Components to AI Elements

## Chore Description
Move three shared widget components from `components/widget_components/shared/` to `components/widget_components/ai-elements/` and add admin display sections for them:

1. **question-pill.tsx** - Reusable question button component
2. **seed-questions-carousel.tsx** - Auto-scrolling carousel with pause-on-hover
3. **search-input-section.tsx** - Glassmorphism input with dual carousels

These components should be treated as AI elements alongside the existing ai-elements components (dual-phase-progress, simple-progress-bar, readiness-score-gauge, etc.) and should have preview entries in the admin Components section.

## Relevant Files
Use these files to resolve the chore:

### Files to Move (3 files)
- `components/widget_components/shared/question-pill.tsx` - **Source file to move** - Reusable question button with gradient selection state
- `components/widget_components/shared/seed-questions-carousel.tsx` - **Source file to move** - Auto-scroll carousel using Framer Motion animate function
- `components/widget_components/shared/search-input-section.tsx` - **Source file to move** - Glassmorphism input container with dual carousels

### Files to Update (Import Path Changes)
- `components/widget_components/complete/womens-world-widget.tsx` - **Update imports** - Change from `@/components/widget_components/shared/` to `@/components/widget_components/ai-elements/`
- `components/widget_components/complete/womens-world-inline-widget.tsx` - **Update imports** - Change from `@/components/widget_components/shared/` to `@/components/widget_components/ai-elements/`
- `components/widget_components/shared/seed-questions-carousel.tsx` - **Update import** (before move) - Change QuestionPill import from `./question-pill` to `@/components/widget_components/ai-elements/question-pill` (will update again after move)
- `components/widget_components/shared/search-input-section.tsx` - **Update import** (before move) - Change SeedQuestionsCarousel import from `./seed-questions-carousel` to `@/components/widget_components/ai-elements/seed-questions-carousel` (will update again after move)

### Files to Update (Metadata)
- `convex/components.ts` - **Update component counts** - Increment ai-elements count from 7 to 10, update category breakdown
- `convex/componentPreviews.ts` - **Add preview entries** - Add 3 new component preview entries for question-pill, seed-questions-carousel, search-input-section in WIDGET_COMPONENTS_DATA array
- `components/component-previews/widget-demos.tsx` - **Add demo components** - Add 3 new demo components (QuestionPillDemo, SeedQuestionsCarouselDemo, SearchInputSectionDemo) and add to WIDGET_DEMOS mapping

### Directory to Remove (After Move)
- `components/widget_components/shared/` - **Delete directory** - Should be empty after moving all 3 files

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update Internal Import Paths (Before Move)
Before moving files, update internal imports within the shared components to use absolute paths so they continue working after the move.

- Read `components/widget_components/shared/seed-questions-carousel.tsx`
- Update line 5: Change `import { QuestionPill } from "./question-pill";` to `import { QuestionPill } from "@/components/widget_components/ai-elements/question-pill";`
- Read `components/widget_components/shared/search-input-section.tsx`
- Update line 6: Change `import { SeedQuestionsCarousel } from "./seed-questions-carousel";` to `import { SeedQuestionsCarousel } from "@/components/widget_components/ai-elements/seed-questions-carousel";`

**Why**: Internal imports must be updated before the move to prevent circular dependency issues. The carousel depends on QuestionPill, and SearchInputSection depends on both. After moving to ai-elements, relative imports won't resolve correctly.

### Step 2: Move Files to ai-elements Directory
Move all three shared component files to the ai-elements directory.

- Use Bash `mv` command to move files:
  - `mv components/widget_components/shared/question-pill.tsx components/widget_components/ai-elements/question-pill.tsx`
  - `mv components/widget_components/shared/seed-questions-carousel.tsx components/widget_components/ai-elements/seed-questions-carousel.tsx`
  - `mv components/widget_components/shared/search-input-section.tsx components/widget_components/ai-elements/search-input-section.tsx`
- Verify files were moved successfully with `ls components/widget_components/ai-elements/`
- Verify shared directory is empty with `ls components/widget_components/shared/`
- Remove empty shared directory with `rmdir components/widget_components/shared/`

**Why**: Move files first before updating imports in consuming components to ensure clean file organization.

### Step 3: Update Import Paths in Complete Widgets
Update import statements in the complete widget components to reference the new ai-elements location.

**File: `components/widget_components/complete/womens-world-widget.tsx`**
- Read the file
- Find line with: `import { SearchInputSection } from "@/components/widget_components/shared/search-input-section";`
- Replace with: `import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section";`

**File: `components/widget_components/complete/womens-world-inline-widget.tsx`**
- Read the file
- Find line with: `import { SearchInputSection } from "@/components/widget_components/shared/search-input-section";`
- Replace with: `import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section";`

**Why**: Complete widgets reference these components and need updated import paths to continue functioning.

### Step 4: Update Convex Component Metadata
Update component counts and category breakdown in the Convex components query.

**File: `convex/components.ts`**
- Read the file
- Find line 30: `"ai-elements": 7,`
- Replace with: `"ai-elements": 10,` (adding 3 new components: question-pill, seed-questions-carousel, search-input-section)
- Find line 20: `const widgetComponentsCount = 13;`
- Replace with: `const widgetComponentsCount = 16;` (total widget components: 4 icons + 1 animation + 10 ai-elements + 1 ask-anything)

**Why**: Admin dashboard displays component statistics from this metadata. Accurate counts ensure proper reporting.

### Step 5: Add Component Preview Entries
Add preview metadata entries for the three new AI element components.

**File: `convex/componentPreviews.ts`**
- Read the WIDGET_COMPONENTS_DATA array (around line 495-650)
- Add three new entries in the ai-elements section (after readiness-score-gauge, around line 610):

```typescript
  {
    name: "question-pill",
    description: "Reusable question button with gradient selection state and pill shape (40px border-radius)",
    category: "ai-elements",
    code: `import { QuestionPill } from "@/components/widget_components/ai-elements/question-pill"

export function QuestionPillDemo() {
  const [selected, setSelected] = React.useState(false)

  return (
    <div className="flex items-center gap-2 p-8">
      <QuestionPill
        question="What is the best diet for weight loss?"
        onClick={() => setSelected(!selected)}
        isSelected={selected}
      />
      <QuestionPill
        question="How can I improve my gut health?"
        onClick={() => {}}
        isSelected={false}
      />
    </div>
  )
}`,
  },
  {
    name: "seed-questions-carousel",
    description: "Auto-scrolling carousel for seed questions with pause-on-hover functionality using Framer Motion",
    category: "ai-elements",
    code: `import { SeedQuestionsCarousel } from "@/components/widget_components/ai-elements/seed-questions-carousel"

export function SeedQuestionsCarouselDemo() {
  const [selected, setSelected] = React.useState("")

  const questions = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "Is there a link between trauma and autoimmune symptoms?",
    "How do I improve my gut health?",
    "What are signs of vitamin deficiency?",
  ]

  return (
    <div className="w-full max-w-2xl p-8">
      <SeedQuestionsCarousel
        questions={questions}
        autoScrollInterval={35000}
        onQuestionClick={setSelected}
        selectedQuestion={selected}
      />
    </div>
  )
}`,
  },
  {
    name: "search-input-section",
    description: "Glassmorphism input with dual auto-scrolling seed question carousels, gradient border, and profile icon",
    category: "ai-elements",
    code: `import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section"

export function SearchInputSectionDemo() {
  const seedQuestionsRow1 = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "How do I improve my gut health?",
  ]

  const seedQuestionsRow2 = [
    "How can I make Hamburger Helper healthier?",
    "What are natural ways to boost energy?",
    "What foods improve sleep quality?",
  ]

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl">
      <SearchInputSection
        placeholder="Ask us your health questions"
        onSubmit={(question) => console.log("Submitted:", question)}
        seedQuestionsRow1={seedQuestionsRow1}
        seedQuestionsRow2={seedQuestionsRow2}
        autoScrollInterval={35000}
      />
    </div>
  )
}`,
  },
```

**Why**: Admin component preview pages use this metadata to display component information, code examples, and interactive demos.

### Step 6: Add Demo Components
Add three demo component functions and register them in the WIDGET_DEMOS mapping.

**File: `components/component-previews/widget-demos.tsx`**
- Read the file
- Add imports at the top (after line 18):
```typescript
import { QuestionPill } from "@/components/widget_components/ai-elements/question-pill";
import { SeedQuestionsCarousel } from "@/components/widget_components/ai-elements/seed-questions-carousel";
import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section";
```

- Add demo components after ReadinessScoreGaugeDemo (around line 117):

```typescript
export function QuestionPillDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex items-center gap-2 p-8">
      <QuestionPill
        question="What is the best diet for weight loss?"
        onClick={() => setSelected(!selected)}
        isSelected={selected}
      />
      <QuestionPill
        question="How can I improve my gut health?"
        onClick={() => {}}
        isSelected={false}
      />
    </div>
  );
}

export function SeedQuestionsCarouselDemo() {
  const [selected, setSelected] = useState("");

  const questions = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "Is there a link between trauma and autoimmune symptoms?",
    "How do I improve my gut health?",
    "What are signs of vitamin deficiency?",
  ];

  return (
    <div className="w-full max-w-2xl p-8">
      <SeedQuestionsCarousel
        questions={questions}
        autoScrollInterval={35000}
        onQuestionClick={setSelected}
        selectedQuestion={selected}
      />
    </div>
  );
}

export function SearchInputSectionDemo() {
  const seedQuestionsRow1 = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "How do I improve my gut health?",
  ];

  const seedQuestionsRow2 = [
    "How can I make Hamburger Helper healthier?",
    "What are natural ways to boost energy?",
    "What foods improve sleep quality?",
  ];

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl">
      <SearchInputSection
        placeholder="Ask us your health questions"
        onSubmit={(question) => console.log("Submitted:", question)}
        seedQuestionsRow1={seedQuestionsRow1}
        seedQuestionsRow2={seedQuestionsRow2}
        autoScrollInterval={35000}
      />
    </div>
  );
}
```

- Add to WIDGET_DEMOS mapping (around line 375):
```typescript
  "question-pill": QuestionPillDemo,
  "seed-questions-carousel": SeedQuestionsCarouselDemo,
  "search-input-section": SearchInputSectionDemo,
```

**Why**: Demo components render interactive examples in the admin preview pages. The WIDGET_DEMOS mapping enables dynamic component lookup by name.

### Step 7: Run Validation Commands
Stop dev server if running, run build to verify no TypeScript errors, then restart servers.

- Stop dev server if running (Ctrl+C in terminal)
- Run `bun run build` - Verify no TypeScript errors, no build errors
- Start Convex dev: `npx convex dev` (in separate terminal)
- Start Next.js dev: `bun dev` (in separate terminal)
- Navigate to admin components page: `http://localhost:3000/admin/components/widgets`
- Click "AI Elements" tab
- Verify 10 components display (should now include question-pill, seed-questions-carousel, search-input-section)
- Click through each new component preview and verify:
  - Code tab displays correctly
  - Demo tab renders interactive component
  - Component functions as expected (click, hover, scroll interactions)
- Navigate to complete widgets (Widgets tab)
- Verify Women's World Widget and Women's World Inline Widget still function correctly (regression test)

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run build` - Build the Next.js app to validate no TypeScript or build errors
- `npx convex dev` - Deploy Convex schema and functions (run in background)
- `bun dev` - Start the Next.js dev server and manually validate the chore is complete
- Manual validation checklist:
  - ✅ Navigate to `/admin/components/widgets` → AI Elements tab
  - ✅ Verify 10 AI element components display (previously 7, now includes question-pill, seed-questions-carousel, search-input-section)
  - ✅ Click "View Preview" on question-pill → verify demo renders and click interaction works
  - ✅ Click "View Preview" on seed-questions-carousel → verify auto-scroll and hover-to-pause works
  - ✅ Click "View Preview" on search-input-section → verify glassmorphism input, dual carousels, and submit works
  - ✅ Navigate to Widgets tab → verify Women's World Widget preview still works (regression test)
  - ✅ Navigate to Widgets tab → verify Women's World Inline Widget preview still works (regression test)
  - ✅ Verify `/admin/components` overview shows updated statistics (10 AI elements, 16 total widget components)

## Notes

### Why Move to ai-elements?
These components were originally placed in a `shared/` directory but are conceptually AI-focused UI elements:
- **question-pill**: Interactive suggestion button used in conversational AI interfaces
- **seed-questions-carousel**: Auto-scrolling question suggestions for AI chat widgets
- **search-input-section**: Glassmorphism AI input with conversational UI patterns

They belong in `ai-elements/` alongside other AI-focused components like prompt-input, glass-widget-container, and success-phase.

### Component Dependencies
- **question-pill**: No dependencies (standalone component using shadcn Button)
- **seed-questions-carousel**: Depends on QuestionPill (must update import before move)
- **search-input-section**: Depends on SeedQuestionsCarousel (must update import before move)

### Import Path Strategy
Update internal imports BEFORE moving files to prevent resolution issues during the move operation. Use absolute paths (`@/components/widget_components/ai-elements/...`) instead of relative paths (`./...`) to ensure imports continue working after the move.

### Testing Strategy
1. **Build validation**: Ensure TypeScript compilation succeeds with zero errors
2. **Admin UI validation**: Verify all 3 new components appear in AI Elements tab
3. **Interactive validation**: Test demo functionality (clicks, hover, scroll, input)
4. **Regression validation**: Verify existing widgets (Women's World, Women's World Inline) still work correctly
5. **Metadata validation**: Verify component counts updated correctly in admin overview
