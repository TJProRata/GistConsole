"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import { ProfileBlank } from "@/components/widget_components/icons/profile-blank";
import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section";
import { WomensWorldAnswerDisplay } from "@/components/widget_components/ai-elements/womens-world-answer-display";
import { useStreamingAnswer } from "@/lib/hooks/useStreamingAnswer";
import { cn } from "@/lib/utils";
import type {
  WomensWorldWidgetProps,
} from "@/components/widget_components/types";

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
// WomensWorldWidget Component
// ============================================================================

export function WomensWorldWidget({
  isExpanded: controlledIsExpanded,
  onExpandChange,
  defaultExpanded = false,
  collapsedText = "Ask AI",
  title = "✨ Woman's World Answers",
  placeholder = "Ask us your health questions",
  seedQuestions,
  seedQuestionsRow1,
  seedQuestionsRow2,
  autoScrollInterval = 35000,
  brandingText = "Powered by Gist.ai",
  onSubmit,
  width = 392,
  height,
  placement = "bottom-right",
  className,
  enableStreaming = false,
  onAnswerComplete,
  onAnswerError,
}: WomensWorldWidgetProps) {
  // Backward compatibility fallback logic
  const row1Questions =
    seedQuestionsRow1 ??
    seedQuestions?.slice(0, 6) ??
    DEFAULT_SEED_QUESTIONS_ROW_1;
  const row2Questions =
    seedQuestionsRow2 ??
    seedQuestions?.slice(6, 12) ??
    DEFAULT_SEED_QUESTIONS_ROW_2;

  // Controlled/uncontrolled pattern
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledIsExpanded ?? internalExpanded;

  // Streaming state management
  const { answerState, streamedText, error, startStreaming, resetAnswer } =
    useStreamingAnswer();
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const handleExpandChange = (expanded: boolean) => {
    setInternalExpanded(expanded);
    onExpandChange?.(expanded);
  };

  const handleSubmit = async (question: string) => {
    // Always call the onSubmit callback for backward compatibility
    onSubmit?.(question);

    // If streaming is enabled, start streaming the answer
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

  // Get placement classes based on placement prop
  const getPlacementClasses = () => {
    switch (placement) {
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50";
      case "bottom-center":
        return "fixed bottom-4 left-1/2 -translate-x-1/2 z-50";
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50";
      default:
        return "fixed bottom-4 right-4 z-50";
    }
  };

  return (
    <>
      {/* Inject gradient border styles */}
      <style>{`
        .gradient-border-collapsed {
          position: relative;
          isolation: isolate;
        }
        .gradient-border-collapsed::before {
          content: "";
          position: absolute;
          z-index: 0;
          inset: 0;
          padding: 2px;
          background: linear-gradient(90deg, #FB9649 0%, #A361E9 100%);
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }
        .gradient-border-collapsed::after {
          content: "";
          position: absolute;
          z-index: 1;
          inset: 2px;
          background: white;
          border-radius: 40px;
        }
      `}</style>

      {/* Widget Container */}
      <div className={cn(getPlacementClasses(), className)}>
        {/* Collapsed State */}
        {!isExpanded && (
          <motion.button
            onClick={() => handleExpandChange(true)}
            className="gradient-border-collapsed rounded-[40px] cursor-pointer"
            style={{
              width: "140px",
              height: "48px",
            }}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative z-10 flex items-center justify-center gap-2 h-full px-4">
              <Sparkles className="w-4 h-4 text-[#FB9649]" />
              <span className="font-sans font-normal text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#FB9649] to-[#A361E9]">
                {collapsedText}
              </span>
              <ProfileBlank className="w-4 h-4 text-gray-600" />
            </div>
          </motion.button>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-xl"
            style={{
              background: "var(--gradient-womens-world)",
              width: `${width}px`,
              height: height ? `${height}px` : "auto",
              display: height ? "flex" : "block",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div className="relative flex items-center justify-center px-6 py-4 flex-shrink-0">
              <AnimatePresence mode="wait">
                {!showAnswer && (
                  <motion.h2
                    key="title"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="womens-world-title text-white"
                  >
                    {title}
                  </motion.h2>
                )}
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleExpandChange(false)}
                className="absolute right-6 top-4 hover:bg-white/20 rounded-full"
                aria-label="Close widget"
              >
                <X className="w-5 h-5 text-white" />
              </Button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
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
                      seedQuestionsRow1={row1Questions}
                      seedQuestionsRow2={row2Questions}
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
            <div className="flex justify-end px-6 py-4 flex-shrink-0">
              <PoweredByButton />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
