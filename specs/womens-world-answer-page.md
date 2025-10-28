# Women's World Answer Page Feature Specification

## Overview
Create interactive Q&A answer page at `/admin/components/widgets/complete/answers` with OpenAI streaming integration for Women's World Widget.

**Tech Stack:** Bun 1.3.1, Next.js 16, React 19.2, TypeScript 5.9.3, shadcn/ui, Tailwind CSS

---

## React Component Hierarchy (Thinking in React - Step 1)

```
AnswersPage (page.tsx)
├── GradientBorderContainer (reused from prompt-input.tsx)
│   ├── GradientPlaceholderInput (reused from prompt-input.tsx)
│   └── GradientSubmitButton (reused from prompt-input.tsx)
├── LoadingState (NEW: /ai-elements/loading-state.tsx)
│   ├── LoadingSpinner (inline)
│   └── LoadingText (inline)
├── StreamingAnswerDisplay (NEW: /ai-elements/streaming-answer-display.tsx)
│   ├── StreamingText (NEW: /ai-elements/streaming-text.tsx)
│   ├── AttributionBar (NEW: /ai-elements/attribution-bar.tsx)
│   ├── AttributionCards (NEW: /ai-elements/attribution-cards.tsx)
│   │   └── AttributionCard (inline)
│   ├── FeedbackButtons (NEW: /ai-elements/feedback-buttons.tsx)
│   │   ├── ThumbsUpIcon (NEW: /icons/thumbs-up.tsx)
│   │   └── ThumbsDownIcon (NEW: /icons/thumbs-down.tsx)
│   └── RelatedQuestions (NEW: /ai-elements/related-questions.tsx)
│       └── RelatedQuestionPill (inline)
├── NewSearchButton (NEW: /ai-elements/new-search-button.tsx)
└── PoweredByButton (reused from /icons/powered-by-button.tsx)
```

**Component Count:** 7 new components + 3 reused = 10 total

---

## TypeScript Type Definitions (Thinking in React - Step 2)

### Core Types

```typescript
// components/widget_components/types.ts - ADD TO EXISTING FILE

/**
 * OpenAI Streaming Response Structure
 */
export interface OpenAIStreamChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content?: string;
      role?: "assistant";
    };
    finish_reason: "stop" | "length" | null;
  }>;
}

/**
 * Attribution Source Data
 */
export interface AttributionSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  publishedDate?: string;
  author?: string;
}

/**
 * Answer Page State Machine
 */
export type AnswerPageState = "input" | "loading" | "streaming" | "complete" | "error";

/**
 * Answer Data Structure
 */
export interface AnswerData {
  text: string;
  sources: AttributionSource[];
  relatedQuestions: string[];
  confidence?: number;
}

/**
 * Component Props
 */
export interface LoadingStateProps {
  phase: "generating" | "sources";
  className?: string;
}

export interface StreamingTextProps {
  text: string;
  isComplete: boolean;
  className?: string;
}

export interface AttributionBarProps {
  sourceCount: number;
  sources: AttributionSource[];
  onViewSources?: () => void;
  className?: string;
}

export interface AttributionCardsProps {
  sources: AttributionSource[];
  onCardClick?: (source: AttributionSource) => void;
  className?: string;
}

export interface FeedbackButtonsProps {
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  selected?: "up" | "down" | null;
  className?: string;
}

export interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  className?: string;
}

export interface NewSearchButtonProps {
  onClick: () => void;
  className?: string;
}
```

---

## State Management Plan (Thinking in React - Steps 3 & 4)

### Minimal State (DRY Principle)

**State Variables (page.tsx):**
```typescript
const [pageState, setPageState] = useState<AnswerPageState>("input");
const [query, setQuery] = useState("");
const [streamedText, setStreamedText] = useState("");
const [answerData, setAnswerData] = useState<AnswerData | null>(null);
const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
const [error, setError] = useState<string | null>(null);
```

**Derived Values (computed):**
```typescript
const isLoading = pageState === "loading" || pageState === "streaming";
const showAnswer = pageState === "complete";
const showLoadingState = pageState === "loading";
const showStreamingText = pageState === "streaming" || pageState === "complete";
const canSubmitNewQuery = query.trim().length > 0 && pageState === "input";
```

**State Location:** All state lives in `AnswersPage` root component (common parent)

---

## Data Flow (Thinking in React - Step 5)

### Inverse Data Flow Pattern

```typescript
// Parent → Child (Props Down)
AnswersPage passes:
  - query → GradientPlaceholderInput (value prop)
  - pageState → LoadingState (conditional render)
  - streamedText → StreamingText (text prop)
  - answerData.sources → AttributionBar, AttributionCards (data props)
  - answerData.relatedQuestions → RelatedQuestions (data prop)

// Child → Parent (Events Up)
Child components call handlers:
  - GradientPlaceholderInput → onChange(newQuery) → setQuery
  - GradientSubmitButton → onSubmit → handleSubmitQuery
  - FeedbackButtons → onThumbsUp/Down → handleFeedback
  - RelatedQuestions → onQuestionClick → handleRelatedQuestion
  - NewSearchButton → onClick → handleNewSearch
```

---

## Component Implementation Details

### 1. LoadingState Component

**File:** `components/widget_components/ai-elements/loading-state.tsx`

**Purpose:** Display loading phases with animated text

**Static Structure:**
```tsx
export function LoadingState({ phase, className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 py-12", className)}>
      {/* Animated Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{
            borderTopColor: 'var(--gradient-brand)',
            borderRightColor: 'var(--gradient-brand)'
          }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-base font-medium text-gray-700">
        {phase === "generating" ? "Generating answer..." : "Getting sources..."}
      </p>
    </div>
  );
}
```

**State:** None (pure props)

---

### 2. StreamingText Component

**File:** `components/widget_components/ai-elements/streaming-text.tsx`

**Purpose:** Animate text reveal character-by-character

**Implementation:**
```tsx
export function StreamingText({ text, isComplete, className }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20); // 20ms per character = ~50 chars/second
      return () => clearTimeout(timer);
    }
  }, [text, currentIndex]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <div className={cn("prose prose-gray max-w-none", className)}>
      <p className="text-base leading-relaxed text-gray-900">
        {displayedText}
        {!isComplete && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
```

**State:** `displayedText`, `currentIndex` (local animation state)

---

### 3. AttributionBar Component

**File:** `components/widget_components/ai-elements/attribution-bar.tsx`

**Purpose:** Compact source count display above answer

**Implementation:**
```tsx
export function AttributionBar({
  sourceCount,
  sources,
  onViewSources,
  className
}: AttributionBarProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg",
      "bg-gray-50 border border-gray-200",
      className
    )}>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <svg className="w-4 h-4" /* source icon SVG */ />
        <span className="font-medium">{sourceCount} sources</span>
      </div>

      {onViewSources && (
        <button
          onClick={onViewSources}
          className="ml-auto text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </button>
      )}
    </div>
  );
}
```

**State:** None (pure props)

---

### 4. AttributionCards Component

**File:** `components/widget_components/ai-elements/attribution-cards.tsx`

**Purpose:** Display source cards in grid layout

**Implementation:**
```tsx
export function AttributionCards({
  sources,
  onCardClick,
  className
}: AttributionCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
      {sources.map((source) => (
        <AttributionCard
          key={source.id}
          source={source}
          onClick={() => onCardClick?.(source)}
        />
      ))}
    </div>
  );
}

function AttributionCard({
  source,
  onClick
}: {
  source: AttributionSource;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 p-4 rounded-lg border border-gray-200",
        "bg-white hover:bg-gray-50 transition-colors",
        "text-left"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
          {source.title}
        </h4>
        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium">{source.domain}</span>
        {source.publishedDate && (
          <>
            <span>•</span>
            <span>{source.publishedDate}</span>
          </>
        )}
      </div>
    </button>
  );
}
```

**State:** None (pure props)

---

### 5. FeedbackButtons Component

**File:** `components/widget_components/ai-elements/feedback-buttons.tsx`

**Purpose:** Thumbs up/down feedback controls

**Implementation:**
```tsx
import { ThumbsUpIcon } from "@/components/widget_components/icons/thumbs-up";
import { ThumbsDownIcon } from "@/components/widget_components/icons/thumbs-down";

export function FeedbackButtons({
  onThumbsUp,
  onThumbsDown,
  selected,
  className
}: FeedbackButtonsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={onThumbsUp}
        className={cn(
          "p-2 rounded-full transition-colors",
          selected === "up"
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
        aria-label="Helpful answer"
      >
        <ThumbsUpIcon className="w-5 h-5" />
      </button>

      <button
        onClick={onThumbsDown}
        className={cn(
          "p-2 rounded-full transition-colors",
          selected === "down"
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
        aria-label="Not helpful"
      >
        <ThumbsDownIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
```

**State:** None (controlled by parent via `selected` prop)

---

### 6. ThumbsUpIcon & ThumbsDownIcon Components

**Files:**
- `components/widget_components/icons/thumbs-up.tsx`
- `components/widget_components/icons/thumbs-down.tsx`

**Implementation:**
```tsx
// thumbs-up.tsx
export function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

// thumbs-down.tsx (rotate thumbs-up 180deg)
export function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}
```

---

### 7. RelatedQuestions Component

**File:** `components/widget_components/ai-elements/related-questions.tsx`

**Purpose:** Display related question pills

**Implementation:**
```tsx
export function RelatedQuestions({
  questions,
  onQuestionClick,
  className
}: RelatedQuestionsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-gray-700">
        Related Questions
      </h3>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <RelatedQuestionPill
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
          />
        ))}
      </div>
    </div>
  );
}

function RelatedQuestionPill({
  question,
  onClick
}: {
  question: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full",
        "bg-gradient-to-r from-orange-50 to-purple-50",
        "border border-gray-200",
        "text-sm font-medium text-gray-700",
        "hover:shadow-md transition-shadow"
      )}
    >
      {question}
    </button>
  );
}
```

**State:** None (pure props)

---

### 8. NewSearchButton Component

**File:** `components/widget_components/ai-elements/new-search-button.tsx`

**Purpose:** Button variant to start new search

**Implementation:**
```tsx
import { Button } from "@/components/ui/button";

export function NewSearchButton({ onClick, className }: NewSearchButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "w-full sm:w-auto",
        "bg-gradient-to-r from-orange-500 to-purple-600",
        "text-white font-semibold",
        "hover:shadow-lg transition-shadow",
        "border-0",
        className
      )}
    >
      <svg className="w-5 h-5 mr-2" /* search icon */ />
      New Search
    </Button>
  );
}
```

**State:** None (pure props)

---

## Page Implementation (AnswersPage)

### File Structure
```
app/
└── admin/
    └── components/
        └── widgets/
            └── complete/
                └── answers/
                    └── page.tsx  (NEW)
```

### Page Implementation

```tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GradientBorderContainer, GradientPlaceholderInput, GradientSubmitButton } from "@/components/widget_components/ai-elements/prompt-input";
import { LoadingState } from "@/components/widget_components/ai-elements/loading-state";
import { StreamingText } from "@/components/widget_components/ai-elements/streaming-text";
import { AttributionBar } from "@/components/widget_components/ai-elements/attribution-bar";
import { AttributionCards } from "@/components/widget_components/ai-elements/attribution-cards";
import { FeedbackButtons } from "@/components/widget_components/ai-elements/feedback-buttons";
import { RelatedQuestions } from "@/components/widget_components/ai-elements/related-questions";
import { NewSearchButton } from "@/components/widget_components/ai-elements/new-search-button";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import type {
  AnswerPageState,
  AnswerData,
  AttributionSource
} from "@/components/widget_components/types";

export default function AnswersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Minimal State (Step 3)
  const [pageState, setPageState] = useState<AnswerPageState>(
    initialQuery ? "loading" : "input"
  );
  const [query, setQuery] = useState(initialQuery);
  const [streamedText, setStreamedText] = useState("");
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived Values (Computed)
  const showLoadingState = pageState === "loading";
  const showStreamingText = pageState === "streaming" || pageState === "complete";
  const showAnswer = pageState === "complete";
  const canSubmitNewQuery = query.trim().length > 0 && pageState === "input";

  // Event Handlers (Step 5: Inverse Data Flow)
  const handleSubmitQuery = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setPageState("loading");
    setError(null);

    try {
      // Phase 1: Loading state
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Phase 2: Start streaming
      setPageState("streaming");

      // Call OpenAI API (streaming)
      const response = await fetch("/api/openai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedText += chunk;
        setStreamedText(accumulatedText);
      }

      // Phase 3: Complete with sources
      setPageState("complete");
      setAnswerData({
        text: accumulatedText,
        sources: mockSources, // Replace with real API response
        relatedQuestions: mockRelatedQuestions,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPageState("error");
    }
  }, [query]);

  const handleFeedback = useCallback((type: "up" | "down") => {
    setFeedback(type);
    // TODO: Send feedback to analytics API
  }, []);

  const handleRelatedQuestion = useCallback((question: string) => {
    setQuery(question);
    setPageState("input");
    setStreamedText("");
    setAnswerData(null);
    setFeedback(null);
  }, []);

  const handleNewSearch = useCallback(() => {
    setQuery("");
    setPageState("input");
    setStreamedText("");
    setAnswerData(null);
    setFeedback(null);
  }, []);

  const handleSourceClick = useCallback((source: AttributionSource) => {
    window.open(source.url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✨ Woman's World Answers
          </h1>
          <p className="text-gray-600">
            Ask us your health questions
          </p>
        </div>

        {/* Search Input (Always Visible) */}
        <div className="mb-8">
          <form onSubmit={handleSubmitQuery}>
            <GradientBorderContainer maxWidth={900}>
              <div className="flex items-center gap-3 px-4 py-4">
                <GradientPlaceholderInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Ask us your health questions..."
                  name="query"
                />
                <GradientSubmitButton disabled={!canSubmitNewQuery} />
              </div>
            </GradientBorderContainer>
          </form>
        </div>

        {/* Loading State */}
        {showLoadingState && (
          <LoadingState phase="generating" />
        )}

        {/* Streaming Answer Display */}
        {showStreamingText && (
          <div className="space-y-6 bg-white rounded-2xl shadow-lg p-8">
            {/* Attribution Bar */}
            {answerData && (
              <AttributionBar
                sourceCount={answerData.sources.length}
                sources={answerData.sources}
              />
            )}

            {/* Streaming Text */}
            <StreamingText
              text={streamedText}
              isComplete={pageState === "complete"}
            />

            {/* Feedback + Attribution Cards (Complete State Only) */}
            {showAnswer && answerData && (
              <>
                <div className="flex items-center justify-between pt-4 border-t">
                  <FeedbackButtons
                    onThumbsUp={() => handleFeedback("up")}
                    onThumbsDown={() => handleFeedback("down")}
                    selected={feedback}
                  />
                </div>

                <AttributionCards
                  sources={answerData.sources}
                  onCardClick={handleSourceClick}
                />

                <RelatedQuestions
                  questions={answerData.relatedQuestions}
                  onQuestionClick={handleRelatedQuestion}
                />

                <div className="flex justify-center pt-4">
                  <NewSearchButton onClick={handleNewSearch} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Error State */}
        {pageState === "error" && (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
            <NewSearchButton onClick={handleNewSearch} className="mt-4" />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-center mt-8">
          <PoweredByButton />
        </div>
      </div>
    </div>
  );
}

// Mock data (replace with real API)
const mockSources: AttributionSource[] = [
  {
    id: "1",
    title: "The Science Behind Bread and Weight Loss",
    url: "https://www.womansworld.com/posts/health/bread-weight-loss",
    domain: "womansworld.com",
    publishedDate: "2024-01-15",
  },
  // ... more sources
];

const mockRelatedQuestions = [
  "What are the healthiest types of bread?",
  "How many slices of bread can I eat per day?",
  "Are whole grain breads better for weight loss?",
];
```

---

## API Route Implementation

### File: `app/api/openai/stream/route.ts`

```typescript
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid query" },
        { status: 400 }
      );
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful health and wellness assistant for Woman's World magazine. Provide accurate, evidence-based answers to health questions.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Create readable stream for client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}
```

---

## Widget Integration (womens-world-inline-widget.tsx)

### Update onSubmit Handler

```tsx
// components/widget_components/complete/womens-world-inline-widget.tsx

import { useRouter } from "next/navigation";

export function WomensWorldInlineWidget({ ... }: WomensWorldInlineWidgetProps) {
  const router = useRouter();

  const handleSubmit = (question: string) => {
    // Navigate to answers page with query parameter
    router.push(`/admin/components/widgets/complete/answers?q=${encodeURIComponent(question)}`);

    // Optional: call parent onSubmit if provided
    onSubmit?.(question);
  };

  // ... rest of component
}
```

---

## File Update Checklist

### New Files to Create (7 components)
- [ ] `app/admin/components/widgets/complete/answers/page.tsx`
- [ ] `app/api/openai/stream/route.ts`
- [ ] `components/widget_components/ai-elements/loading-state.tsx`
- [ ] `components/widget_components/ai-elements/streaming-text.tsx`
- [ ] `components/widget_components/ai-elements/attribution-bar.tsx`
- [ ] `components/widget_components/ai-elements/attribution-cards.tsx`
- [ ] `components/widget_components/ai-elements/feedback-buttons.tsx`
- [ ] `components/widget_components/ai-elements/related-questions.tsx`
- [ ] `components/widget_components/ai-elements/new-search-button.tsx`
- [ ] `components/widget_components/icons/thumbs-up.tsx`
- [ ] `components/widget_components/icons/thumbs-down.tsx`

### Files to Update
- [ ] `components/widget_components/types.ts` (add new interfaces)
- [ ] `components/widget_components/index.ts` (export new components)
- [ ] `components/widget_components/complete/womens-world-inline-widget.tsx` (add navigation)
- [ ] `.env.local` (add OPENAI_API_KEY)
- [ ] `package.json` (add openai dependency if not present)

---

## Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-...your-key-here...
```

---

## Dependencies

```json
{
  "dependencies": {
    "openai": "^4.20.0"
  }
}
```

Install: `bun add openai`

---

## Testing Checklist

### Component Tests
- [ ] LoadingState renders both phases correctly
- [ ] StreamingText animates character-by-character
- [ ] AttributionBar displays correct source count
- [ ] AttributionCards render in grid layout
- [ ] FeedbackButtons toggle selection state
- [ ] ThumbsUp/Down icons render correctly
- [ ] RelatedQuestions render as pills
- [ ] NewSearchButton triggers reset

### Integration Tests
- [ ] Page receives query from URL param
- [ ] Submit triggers loading → streaming → complete flow
- [ ] OpenAI API streams response correctly
- [ ] Related question click updates query
- [ ] New search resets all state
- [ ] Error state displays on API failure
- [ ] Feedback buttons send analytics events

### E2E Tests
- [ ] User submits question from widget → navigates to answer page
- [ ] Loading state displays for 1.5s
- [ ] Answer streams in real-time
- [ ] Sources display after answer completes
- [ ] Clicking source opens new tab
- [ ] Related questions trigger new search
- [ ] New search button resets page

---

## Design System Compliance

### Colors (Tailwind CSS)
- **Primary Gradient:** `from-orange-500 to-purple-600` (var(--gradient-brand))
- **Background:** `from-orange-50 via-white to-purple-50`
- **Text:** `text-gray-900` (primary), `text-gray-600` (secondary)
- **Borders:** `border-gray-200`
- **Feedback:** `bg-green-100` (thumbs up), `bg-red-100` (thumbs down)

### Typography
- **Headings:** `text-3xl font-bold` (h1), `text-sm font-semibold` (h3)
- **Body:** `text-base leading-relaxed`
- **Small:** `text-sm` (labels), `text-xs` (metadata)

### Spacing
- **Container:** `max-w-4xl mx-auto px-4 py-8`
- **Section Gaps:** `space-y-6` (major), `space-y-3` (minor)
- **Card Padding:** `p-8` (large), `p-4` (small)

### Border Radius
- **Pills:** `rounded-full` (40px)
- **Cards:** `rounded-2xl` (16px), `rounded-lg` (8px)
- **Container:** `rounded-[40px]` (glassmorphism)

### Shadows
- **Cards:** `shadow-lg`
- **Hover:** `hover:shadow-md transition-shadow`

---

## Accessibility Requirements

### ARIA Labels
- [ ] All buttons have `aria-label` attributes
- [ ] Loading state has `role="status"` and `aria-live="polite"`
- [ ] Feedback buttons indicate current selection via `aria-pressed`
- [ ] Attribution cards have descriptive link text

### Keyboard Navigation
- [ ] Tab order follows visual flow (input → submit → sources → related → new search)
- [ ] Enter key submits form
- [ ] Space bar activates buttons
- [ ] Escape key clears error state

### Screen Reader Support
- [ ] Loading phases announced ("Generating answer", "Getting sources")
- [ ] Streaming text updates announced incrementally
- [ ] Source count announced ("5 sources found")
- [ ] Feedback selection announced ("Marked as helpful")

### Color Contrast
- [ ] All text meets WCAG AA (4.5:1 for body text, 3:1 for large text)
- [ ] Interactive elements have visible focus indicators
- [ ] Error messages use icons + text (not color alone)

---

## Performance Targets

### Loading Times
- [ ] Initial page load: <2s
- [ ] API response start: <1.5s
- [ ] Streaming latency: <50ms per chunk
- [ ] Source cards render: <100ms

### Bundle Size
- [ ] Total page JS: <150KB (gzipped)
- [ ] Component-level code splitting
- [ ] Lazy load attribution cards (below fold)

### Accessibility
- [ ] Lighthouse Accessibility score: 100
- [ ] No ARIA errors in axe DevTools
- [ ] Screen reader tested (VoiceOver + NVDA)

---

## Future Enhancements

### Phase 2 Features
- [ ] Answer history (localStorage)
- [ ] Share answer link
- [ ] Copy answer to clipboard
- [ ] Print-friendly view
- [ ] Multi-language support
- [ ] Voice input (speech-to-text)
- [ ] Answer bookmarking

### Analytics Events
- [ ] Track query submissions
- [ ] Measure answer satisfaction (feedback ratio)
- [ ] Monitor source click-through rate
- [ ] Analyze related question usage
- [ ] Track new search frequency

---

## Summary

**Total New Components:** 7 + 2 icons = 9 files
**Total Files Updated:** 4 files
**API Routes:** 1 route
**Environment Variables:** 1 variable
**Dependencies:** 1 package (openai)

**Implementation Time Estimate:** 8-12 hours
- Component creation: 4-6 hours
- API integration: 2-3 hours
- Testing: 2-3 hours

**React 19.2 Best Practices Applied:**
✅ Single Responsibility Principle (each component does one thing)
✅ Minimal state (DRY - compute derived values)
✅ One-way data flow (props down, events up)
✅ Controlled components (form inputs)
✅ Composition over configuration
✅ Proper TypeScript typing
✅ Accessibility-first design
✅ Performance optimization (streaming, lazy loading)

---

**Created:** 2025-10-27
**Last Updated:** 2025-10-27
**Status:** Ready for Implementation ✅
