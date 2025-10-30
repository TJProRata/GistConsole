"use client";

/**
 * NewPageAnswerWidget Component
 * AI-powered Q&A widget with streaming answers, source attribution, and article recommendations
 */

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Import AI element components
import {
  AnswerWidgetContainer,
  AnswerWidgetHeader,
  AnswerWidgetContent,
  AnswerWidgetFooter,
} from "../ai-elements/answer_widget_container";
import { LoadingState } from "../ai-elements/loading-state";
import { QueryDisplay } from "../ai-elements/query-display";
import { AnswerContent } from "../ai-elements/answer-content";
import { DisclaimerBanner } from "../ai-elements/disclaimer-banner";
import { FeedbackButtons } from "../ai-elements/feedback-buttons";
import { RelatedQuestions } from "../ai-elements/related-questions";
import { RecommendedArticles } from "../ai-elements/recommended-articles";
// import { PromptInput } from "../ai-elements/prompt-input";
import { Input } from "@/components/ui/input";
import { NewSearchButton } from "../ai-elements/new-search-button";

// Import existing source attribution components (if available)
// import { SourceDistributionBar } from "../ai-elements/source-distribution-bar";

// Import types
import type {
  NewPageAnswerWidgetProps,
  AnswerPageWidgetState,
  NewPageAnswerData,
  Citation,
  ArticleRecommendation,
} from "../types";

const NewPageAnswerWidget = React.forwardRef<
  HTMLDivElement,
  NewPageAnswerWidgetProps
>(
  (
    {
      initialQuery,
      brandConfig,
      sources,
      sponsoredContent,
      onClose,
      onNewSearch,
      onArticleClick,
      onCitationClick,
      className,
    },
    ref
  ) => {
    // State management
    const [widgetState, setWidgetState] =
      useState<AnswerPageWidgetState>("input");
    const [currentQuery, setCurrentQuery] = useState(initialQuery || "");
    const [streamedText, setStreamedText] = useState("");
    const [answerData, setAnswerData] = useState<NewPageAnswerData | null>(
      null
    );
    const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Track if initial query has been auto-submitted
    const hasAutoSubmitted = useRef(false);

    // Auto-submit initial query on mount
    useEffect(() => {
      if (initialQuery && !hasAutoSubmitted.current) {
        hasAutoSubmitted.current = true;
        executeQuery(initialQuery);
      }
    }, [initialQuery]);

    /**
     * Execute query and stream OpenAI response
     */
    const executeQuery = useCallback(async (query: string) => {
      if (!query.trim()) return;

      try {
        // Reset state
        setError(null);
        setStreamedText("");
        setAnswerData(null);
        setFeedback(null);

        // Transition to loading state
        setWidgetState("loading");
        setCurrentQuery(query);

        // Call OpenAI streaming API
        const response = await fetch("/api/openai/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        // Transition to streaming state
        setWidgetState("streaming");

        // Read stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        if (!reader) {
          throw new Error("Response body is null");
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          setStreamedText(accumulatedText);
        }

        // Streaming complete - transition to complete state
        setWidgetState("complete");

        // Generate mock answer data for demo
        // In production, this would come from API response
        const mockCitations: Citation[] = [
          {
            id: "citation-1",
            number: 1,
            title: "Best Restaurants in LA - Eater LA",
            url: "https://la.eater.com/maps/best-restaurants-los-angeles",
            domain: "eater.com",
            publishedDate: "2024-01-15",
          },
          {
            id: "citation-2",
            number: 2,
            title: "LA Restaurant Guide - Grub Street",
            url: "https://www.grubstreet.com/bestofnewyork/los-angeles",
            domain: "grubstreet.com",
          },
          {
            id: "citation-3",
            number: 3,
            title: "Top 10 LA Restaurants - Thrillist",
            url: "https://www.thrillist.com/eat/los-angeles/best-restaurants-in-la",
            domain: "thrillist.com",
          },
        ];

        const mockRecommendations: ArticleRecommendation[] = [
          {
            id: "article-1",
            title: "The 38 Best Restaurants in Los Angeles",
            description:
              "From tacos to ramen to fine dining, these are the restaurants that define LA's food scene right now.",
            thumbnail: "https://picsum.photos/400/225?random=1",
            source: { name: "Eater LA" },
            relevanceScore: 95,
            url: "https://la.eater.com/maps/best-restaurants-los-angeles",
          },
          {
            id: "article-2",
            title: "Where to Eat in Downtown LA Right Now",
            description:
              "The best restaurants, bars, and cafes in DTLA's rapidly evolving food scene.",
            thumbnail: "https://picsum.photos/400/225?random=2",
            source: { name: "Grub Street" },
            relevanceScore: 88,
            url: "https://www.grubstreet.com/article/best-restaurants-downtown-la",
          },
          {
            id: "article-3",
            title: "LA's Most Iconic Food Experiences",
            description:
              "From food trucks to Michelin stars, discover the meals that capture the essence of Los Angeles.",
            thumbnail: "https://picsum.photos/400/225?random=3",
            source: { name: "Thrillist" },
            relevanceScore: 82,
            url: "https://www.thrillist.com/eat/los-angeles/iconic-la-food",
          },
        ];

        setAnswerData({
          text: accumulatedText,
          sources: mockCitations,
          relatedQuestions: [
            "What are the best Italian restaurants in LA?",
            "Where can I find the best tacos in Los Angeles?",
            "What are the most romantic restaurants in LA?",
          ],
          recommendations: mockRecommendations,
          confidence: 92,
        });
      } catch (err) {
        console.error("Error executing query:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setWidgetState("error");
      }
    }, []);

    /**
     * Handle query submission
     */
    const handleSubmitQuery = useCallback(
      (query: string) => {
        executeQuery(query);
        onNewSearch?.(query);
      },
      [executeQuery, onNewSearch]
    );

    /**
     * Handle feedback (thumbs up/down)
     */
    const handleFeedback = useCallback((type: "up" | "down") => {
      setFeedback(type);
      console.log(`Feedback: ${type}`);
      // In production, send analytics event
    }, []);

    /**
     * Handle related question click
     */
    const handleRelatedQuestion = useCallback(
      (question: string) => {
        setCurrentQuery(question);
        executeQuery(question);
      },
      [executeQuery]
    );

    /**
     * Handle article click
     */
    const handleArticleClick = useCallback(
      (articleId: string, url: string) => {
        console.log(`Article clicked: ${articleId}`);
        window.open(url, "_blank", "noopener,noreferrer");
        onArticleClick?.(articleId, url);
      },
      [onArticleClick]
    );

    /**
     * Handle citation click
     */
    const handleCitationClick = useCallback(
      (citationId: string) => {
        console.log(`Citation clicked: ${citationId}`);
        // Scroll to citation card
        const element = document.getElementById(citationId);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        onCitationClick?.(citationId);
      },
      [onCitationClick]
    );

    /**
     * Handle close button
     */
    const handleClose = useCallback(() => {
      if (onClose) {
        onClose();
      } else {
        // Reset to input state
        setWidgetState("input");
        setCurrentQuery("");
        setStreamedText("");
        setAnswerData(null);
        setFeedback(null);
        setError(null);
      }
    }, [onClose]);

    /**
     * Handle new search
     */
    const handleNewSearch = useCallback(() => {
      setWidgetState("input");
      setCurrentQuery("");
      setStreamedText("");
      setAnswerData(null);
      setFeedback(null);
      setError(null);
    }, []);

    // Apply brand theming via CSS variables
    const brandStyles = brandConfig
      ? {
          "--brand-primary": brandConfig.primaryColor,
          "--brand-secondary":
            brandConfig.secondaryColor || brandConfig.primaryColor,
          "--font-heading": brandConfig.fonts?.heading || "system-ui",
          "--font-body": brandConfig.fonts?.body || "system-ui",
        }
      : {};

    // Derived values
    const showLoadingState = widgetState === "loading";
    const showStreamingText =
      widgetState === "streaming" || widgetState === "complete";
    const showAnswer = widgetState === "complete";
    const showInput = widgetState === "input";

    return (
      <div
        ref={ref}
        className={cn("w-full flex justify-center", className)}
        style={brandStyles as React.CSSProperties}
      >
        <AnswerWidgetContainer className="min-h-[600px] flex flex-col">
          {/* Header */}
          <AnswerWidgetHeader>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {brandConfig?.name || "AI Answers"}
              </h1>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </AnswerWidgetHeader>

          {/* Content */}
          <AnswerWidgetContent className="flex-1 space-y-6">
            {/* Input State */}
            {showInput && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    What would you like to know?
                  </h2>
                  <p className="text-gray-600">
                    Ask any question and get AI-powered answers with sources.
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitQuery(currentQuery);
                  }}
                  className="w-full"
                >
                  <div className="flex gap-2">
                    <Input
                      variant="default"
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      placeholder={`Ask ${brandConfig?.name || "us"} anything...`}
                      className="flex-1"
                    />
                    <Button
                      variant="default"
                      type="submit"
                      disabled={!currentQuery.trim()}
                    >
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Loading State */}
            {showLoadingState && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <LoadingState phase="generating" />
                <p className="text-sm text-gray-600">
                  Generating your answer...
                </p>
              </div>
            )}

            {/* Answer Display */}
            {showStreamingText && (
              <>
                {/* Query Display */}
                <QueryDisplay query={currentQuery} />

                {/* Answer Content */}
                <AnswerContent
                  answerText={streamedText}
                  isComplete={widgetState === "complete"}
                  citations={answerData?.sources || []}
                  onCitationClick={handleCitationClick}
                />

                {/* Disclaimer */}
                {showAnswer && (
                  <>
                    <DisclaimerBanner text="AI-generated content may contain errors. Please verify important information." />
                    <Separator className="my-6" />
                  </>
                )}

                {/* Feedback Buttons */}
                {showAnswer && (
                  <FeedbackButtons
                    onThumbsUp={() => handleFeedback("up")}
                    onThumbsDown={() => handleFeedback("down")}
                    selected={feedback}
                  />
                )}

                {/* Related Questions */}
                {showAnswer && answerData?.relatedQuestions && (
                  <>
                    <Separator className="my-6" />
                    <RelatedQuestions
                      questions={answerData.relatedQuestions}
                      onQuestionClick={handleRelatedQuestion}
                    />
                  </>
                )}

                {/* Recommended Articles */}
                {showAnswer && answerData?.recommendations && (
                  <>
                    <Separator className="my-6" />
                    <RecommendedArticles
                      articles={answerData.recommendations}
                      onArticleClick={handleArticleClick}
                      heading="Recommended Reading"
                    />
                  </>
                )}

                {/* New Search Button */}
                {showAnswer && (
                  <>
                    <Separator className="my-6" />
                    <div className="flex justify-center">
                      <NewSearchButton onClick={handleNewSearch} />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Error State */}
            {widgetState === "error" && error && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-red-600">Error</h3>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
                <Button onClick={handleNewSearch} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </AnswerWidgetContent>

          {/* Footer Input (shown in answer state) */}
          {showAnswer && (
            <AnswerWidgetFooter>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get("followup") as string;
                  if (query?.trim()) {
                    handleSubmitQuery(query);
                    e.currentTarget.reset();
                  }
                }}
                className="w-full"
              >
                <div className="flex gap-2">
                  <Input
                    name="followup"
                    placeholder="Ask a follow-up question..."
                    className="flex-1"
                  />
                  <Button type="submit">Search</Button>
                </div>
              </form>
            </AnswerWidgetFooter>
          )}
        </AnswerWidgetContainer>
      </div>
    );
  }
);

NewPageAnswerWidget.displayName = "NewPageAnswerWidget";

export { NewPageAnswerWidget };
