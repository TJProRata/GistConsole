"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/widget_components/ai-elements/loading-state";
import { StreamingText } from "@/components/widget_components/ai-elements/streaming-text";
import { FeedbackButtons } from "@/components/widget_components/ai-elements/feedback-buttons";
import { RelatedQuestions } from "@/components/widget_components/ai-elements/related-questions";
import { NewSearchButton } from "@/components/widget_components/ai-elements/new-search-button";
import { EaterHeader } from "@/components/widget_components/ai-elements/eater-header";
import { SourceDistributionBar } from "@/components/widget_components/ai-elements/source-distribution-bar";
import { EaterAttributionCard } from "@/components/widget_components/ai-elements/eater-attribution-card";
import { SponsoredContent } from "@/components/widget_components/ai-elements/sponsored-content";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

type AnswerPageState = "input" | "loading" | "streaming" | "complete" | "error";

interface EaterSource {
  id: string;
  name: string;
  logo?: string;
  percentage: number;
  color: string;
  article: {
    title: string;
    excerpt: string;
    thumbnail?: string;
    url: string;
  };
}

interface AnswerData {
  text: string;
  sources: EaterSource[];
  relatedQuestions: string[];
}

export default function EaterAnswersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const hasAutoSubmitted = useRef(false);

  // State Management
  const [pageState, setPageState] = useState<AnswerPageState>(
    initialQuery ? "loading" : "input"
  );
  const [query, setQuery] = useState(initialQuery);
  const [streamedText, setStreamedText] = useState("");
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived Values
  const showLoadingState = pageState === "loading";
  const showStreamingText = pageState === "streaming" || pageState === "complete";
  const showAnswer = pageState === "complete";
  const canSubmitNewQuery = query.trim().length > 0 && pageState === "input";

  // Query Execution
  const executeQuery = useCallback(async () => {
    if (!query.trim()) return;

    setPageState("loading");
    setError(null);

    try {
      // Phase 1: Loading state
      console.log("[Eater] Submitting query:", query);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Phase 2: Start streaming
      setPageState("streaming");

      // Call OpenAI API with Eater-specific system prompt
      const response = await fetch("/api/openai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          systemPrompt:
            "You are Eater, an expert on food and restaurants. Provide detailed, helpful answers about restaurants, food, dining, recipes, and culinary topics. Use a friendly, knowledgeable tone.",
        }),
        credentials: "include",
      });

      console.log("[Eater] API response status:", response.status);

      if (!response.ok) {
        console.log("[Eater] Entering error handling");
        let errorMessage = `API request failed with status ${response.status}`;

        const errorText = await response.text();
        console.log("[Eater] Error response body:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          console.log("[Eater] Parsed error data:", errorData);
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.details) {
              errorMessage += ` (${errorData.details})`;
            }
          }
        } catch (parseError) {
          console.log("[Eater] JSON parse failed, using raw text");
          if (errorText) {
            errorMessage = errorText;
          }
        }

        // Add helpful context based on status code
        if (response.status === 404) {
          errorMessage =
            "API endpoint not found. Please check that the server is running correctly.";
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = "Authentication error. Please sign in again.";
        } else if (response.status === 500) {
          errorMessage = `Server error: ${errorMessage}`;
        }

        console.error("[Eater] Final error message:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("[Eater] Streaming started");
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

      console.log("[Eater] Streaming complete");

      // Phase 3: Complete with sources
      setPageState("complete");
      setAnswerData({
        text: accumulatedText,
        sources: mockEaterSources,
        relatedQuestions: mockRelatedQuestions,
      });
    } catch (err) {
      console.error("[Eater] Query error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setPageState("error");
    }
  }, [query]);

  // Form Submit Handler
  const handleSubmitQuery = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await executeQuery();
    },
    [executeQuery]
  );

  // Auto-submit on initial query from URL
  useEffect(() => {
    if (initialQuery && pageState === "loading" && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      executeQuery();
    }
  }, [initialQuery, pageState, executeQuery]);

  const handleFeedback = useCallback((type: "up" | "down") => {
    setFeedback(type);
    console.log("[Eater] Feedback:", type);
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

  const handleSourceClick = useCallback((source: EaterSource) => {
    window.open(source.article.url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Eater Header */}
      <EaterHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-[#241C15] mb-2"
            style={{ fontFamily: "Degular, sans-serif" }}
          >
            🍴 Ask Eater
          </h1>
          <p
            className="text-gray-600"
            style={{ fontFamily: "Literata, serif" }}
          >
            Ask us about food and restaurants
          </p>
        </div>

        {/* Loading State */}
        {showLoadingState && <LoadingState phase="generating" />}

        {/* Streaming Answer Display */}
        {showStreamingText && (
          <div className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-[#E60001]">
            {/* Source Distribution Bar */}
            {answerData && (
              <SourceDistributionBar
                sources={[
                  { name: "Eater", percentage: 26, color: "#E60001" },
                  { name: "Grub Street", percentage: 20, color: "#ACCA5B" },
                  { name: "Thrillist", percentage: 18, color: "#ED6142" },
                ]}
              />
            )}

            {/* Question Title */}
            {answerData && (
              <h2
                className="text-2xl font-bold text-[#241C15]"
                style={{
                  fontFamily: "Degular, sans-serif",
                  lineHeight: "1.4",
                }}
              >
                {query}
              </h2>
            )}

            {/* Streaming Answer Text */}
            <div
              style={{
                fontFamily: "Literata, serif",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#000",
              }}
            >
              <StreamingText
                text={streamedText}
                isComplete={pageState === "complete"}
              />
            </div>

            {/* Complete State Content */}
            {showAnswer && answerData && (
              <>
                {/* Feedback Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <FeedbackButtons
                    onThumbsUp={() => handleFeedback("up")}
                    onThumbsDown={() => handleFeedback("down")}
                    selected={feedback}
                  />
                </div>

                {/* Sponsored Content */}
                <SponsoredContent
                  title={
                    <>
                      <span className="font-bold">
                        Discover the finest dining experiences
                      </span>
                      <span className="italic">
                        {" "}
                        — where flavor, atmosphere, and service unite.
                      </span>
                    </>
                  }
                  body="The Essential Eater Guide is available on Audible, featuring insider tips from top chefs and food critics."
                  cta={{
                    text: "Listen on Audible",
                    url: "https://www.audible.com",
                  }}
                />

                {/* Attribution Cards */}
                <div>
                  <h3
                    className="text-lg font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Degular, sans-serif" }}
                  >
                    Sources
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-4">
                    {answerData.sources.map((source) => (
                      <EaterAttributionCard
                        key={source.id}
                        source={{
                          name: source.name,
                          logo: source.logo,
                          percentage: source.percentage,
                          color: source.color,
                        }}
                        article={source.article}
                        onClick={() => handleSourceClick(source)}
                      />
                    ))}
                  </div>
                </div>

                {/* Related Questions */}
                <RelatedQuestions
                  questions={answerData.relatedQuestions}
                  onQuestionClick={handleRelatedQuestion}
                />

                {/* New Search Button */}
                <div className="flex justify-center pt-4">
                  <NewSearchButton onClick={handleNewSearch} />
                </div>
              </>
            )}
          </div>
        )}

        {/* Error State */}
        {pageState === "error" && (
          <div className="text-center py-8 bg-red-50 rounded-lg border-2 border-[#E60001]">
            <p className="text-red-600 font-medium">{error}</p>
            <NewSearchButton onClick={handleNewSearch} className="mt-4" />
          </div>
        )}

        {/* Bottom Input: "Ask Eater with AI" */}
        {pageState === "input" && (
          <form onSubmit={handleSubmitQuery}>
            <div
              className="flex items-center gap-3 px-6 py-4 bg-white mx-auto max-w-2xl"
              style={{
                border: "2px solid #E60001",
                borderRadius: "132px",
              }}
            >
              <Sparkles className="w-4 h-4 text-[#E60001] flex-shrink-0" />
              <Input
                type="text"
                placeholder="Ask Eater with AI"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                style={{
                  fontFamily: "Literata, serif",
                  color: "rgba(0, 0, 0, 0.9)",
                }}
              />
              <Button
                type="submit"
                disabled={!canSubmitNewQuery}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 p-0 flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </Button>
            </div>
          </form>
        )}

        {/* Disclaimer */}
        <p
          className="text-center text-xs text-gray-500 mt-4"
          style={{ fontFamily: "Literata, serif" }}
        >
          Gist.ai can make mistakes, please verify responses.
        </p>
      </div>
    </div>
  );
}

// Mock Data: Eater Sources
const mockEaterSources: EaterSource[] = [
  {
    id: "1",
    name: "Eater",
    percentage: 24,
    color: "#FFAF01",
    article: {
      title: "The Best Bakeries in Los Angeles, According to Eater Editors",
      excerpt:
        "From sourdough to croissants, these are the bakeries LA locals swear by.",
      thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      url: "https://la.eater.com/maps/best-bakeries-los-angeles",
    },
  },
  {
    id: "2",
    name: "Grub Street",
    percentage: 20,
    color: "#EE4A3B",
    article: {
      title: "The Fro-Yo Wars Have Moved Downtown",
      excerpt:
        "A new wave of frozen yogurt shops is taking over downtown LA's dining scene.",
      thumbnail: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      url: "https://www.grubstreet.com/2024/froyo-wars-downtown",
    },
  },
  {
    id: "3",
    name: "Eater",
    percentage: 2,
    color: "#FFAF01",
    article: {
      title: "The Best Wine Bars to Sip, Swirl, and Savor in Los Angeles",
      excerpt:
        "Whether you're a sommelier or casual enthusiast, these wine bars deliver.",
      thumbnail: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
      url: "https://la.eater.com/maps/best-wine-bars-los-angeles",
    },
  },
  {
    id: "4",
    name: "Thrillist",
    percentage: 18,
    color: "#ED6142",
    article: {
      title: "The 15 Best Pizza Places in Los Angeles",
      excerpt:
        "From Neapolitan to New York-style, LA's pizza scene is thriving.",
      thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      url: "https://www.thrillist.com/eat/los-angeles/best-pizza-los-angeles",
    },
  },
];

// Mock Data: Related Questions
const mockRelatedQuestions = [
  "What are the best Italian restaurants in NYC?",
  "Where can I find authentic ramen in LA?",
  "What wine pairs well with steak?",
];
