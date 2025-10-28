"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  AttributionSource,
} from "@/components/widget_components/types";

export default function AnswersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const hasAutoSubmitted = useRef(false);

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

  // Query execution logic (shared between form submit and auto-submit)
  const executeQuery = useCallback(async () => {
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
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status}`);
      }

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
        sources: mockSources,
        relatedQuestions: mockRelatedQuestions,
      });

    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setPageState("error");
    }
  }, [query]);

  // Form submit handler
  const handleSubmitQuery = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await executeQuery();
  }, [executeQuery]);

  // Auto-submit on initial query from URL (runs once)
  useEffect(() => {
    if (initialQuery && pageState === "loading" && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      executeQuery();
    }
  }, [initialQuery, pageState, executeQuery]);

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
  {
    id: "2",
    title: "Understanding Carbohydrates and Nutrition",
    url: "https://www.womansworld.com/posts/health/carbs-guide",
    domain: "womansworld.com",
    publishedDate: "2024-01-10",
  },
];

const mockRelatedQuestions = [
  "What are the healthiest types of bread?",
  "How many slices of bread can I eat per day?",
  "Are whole grain breads better for weight loss?",
];
