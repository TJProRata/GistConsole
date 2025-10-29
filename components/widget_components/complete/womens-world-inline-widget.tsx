"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section";
import { WomensWorldAnswerDisplay } from "@/components/widget_components/ai-elements/womens-world-answer-display";
import { useStreamingAnswer } from "@/lib/hooks/useStreamingAnswer";
import { cn } from "@/lib/utils";
import type { WomensWorldInlineWidgetProps } from "@/components/widget_components/types";

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default seed questions for first carousel row (health/medical focus).
 * These questions target specific health concerns and medical topics.
 */
const DEFAULT_SEED_QUESTIONS_ROW_1 = [
  "What's the best bread for weight loss?",
  "Can I prevent dementia?",
  "Is there a link between trauma and autoimmune symptoms?",
  "How do I improve my gut health?",
  "What are signs of vitamin deficiency?",
  "Can exercise reduce inflammation?",
];

/**
 * Default seed questions for second carousel row (wellness/lifestyle focus).
 * These questions focus on daily wellness practices and lifestyle improvements.
 */
const DEFAULT_SEED_QUESTIONS_ROW_2 = [
  "How can I make Hamburger Helper healthier?",
  "What are natural ways to boost energy?",
  "Best morning routine for productivity?",
  "How much water should I drink daily?",
  "What foods improve sleep quality?",
  "Natural remedies for stress relief?",
];

// ============================================================================
// WomensWorldInlineWidget Component
// ============================================================================

/**
 * Women's World Inline Widget
 * Compact, always-expanded variation optimized for embedding between paragraphs within article content.
 *
 * Features:
 * - No collapsed/expanded state transitions (always visible)
 * - Responsive width (100% up to maxWidth)
 * - Compact, article-friendly design
 * - Dual auto-scrolling seed question carousels
 * - Glassmorphism input styling
 * - Theme variants for different article contexts
 */
export function WomensWorldInlineWidget({
  title = "✨ Woman's World Answers",
  placeholder = "Ask us your health questions",
  seedQuestionsRow1 = DEFAULT_SEED_QUESTIONS_ROW_1,
  seedQuestionsRow2 = DEFAULT_SEED_QUESTIONS_ROW_2,
  autoScrollInterval = 35000,
  brandingText = "Powered by Gist.ai",
  onSubmit,
  maxWidth = 640,
  variant = "light",
  className,
  enableStreaming = false,
  onAnswerComplete,
  onAnswerError,
}: WomensWorldInlineWidgetProps) {
  const router = useRouter();

  // Streaming state management
  const { answerState, streamedText, error, startStreaming, resetAnswer } =
    useStreamingAnswer();
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const handleSubmit = async (question: string) => {
    // Always call the onSubmit callback for backward compatibility
    onSubmit?.(question);

    // If streaming is enabled, start streaming the answer inline
    if (enableStreaming) {
      setLastQuery(question);
      setShowAnswer(true);

      try {
        await startStreaming(question);
        // Call onAnswerComplete callback if provided
        if (streamedText && answerState === "complete") {
          onAnswerComplete?.(streamedText);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate answer";
        onAnswerError?.(errorMessage);
      }
    } else {
      // Original behavior: Navigate to answers page
      router.push(`/admin/components/widgets/complete/answers?q=${encodeURIComponent(question)}`);
    }
  };

  const handleNewSearch = () => {
    setShowAnswer(false);
    resetAnswer();
  };

  const handleRetry = () => {
    if (lastQuery) {
      startStreaming(lastQuery);
    }
  };

  // Variant-specific background gradients
  const variantStyles = {
    light: "", // Uses CSS variable via inline style
    neutral: "bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100",
    subtle: "bg-gradient-to-br from-gray-50 to-gray-100",
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl shadow-md border border-gray-200/50 overflow-hidden",
        variantStyles[variant],
        className
      )}
      style={{
        maxWidth: `${maxWidth}px`,
        margin: "0 auto",
        background: variant === "light" ? "var(--gradient-womens-world)" : undefined
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/20">
        <AnimatePresence mode="wait">
          {!showAnswer && (
            <motion.h2
              key="title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="womens-world-title text-white text-center text-lg font-semibold"
            >
              {title}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {!showAnswer ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SearchInputSection
                placeholder={placeholder}
                onSubmit={handleSubmit}
                seedQuestionsRow1={seedQuestionsRow1}
                seedQuestionsRow2={seedQuestionsRow2}
                autoScrollInterval={autoScrollInterval}
              />
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <WomensWorldAnswerDisplay
                answerState={answerState}
                text={streamedText}
                error={error}
                onNewSearch={handleNewSearch}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-3 border-t border-white/20">
        <PoweredByButton />
      </div>
    </div>
  );
}
