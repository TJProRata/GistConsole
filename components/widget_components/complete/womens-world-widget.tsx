"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section";
import { WomensWorldAnswerDisplay } from "@/components/widget_components/ai-elements/womens-world-answer-display";
import {
  GlassWidgetContainer,
  GlassWidgetHeader,
  GlassWidgetContent,
  GlassWidgetFooter,
} from "@/components/widget_components/ai-elements/glass_widget_container";
import { useStreamingAnswer } from "@/lib/hooks/useStreamingAnswer";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
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
// Collapsed Button Component
// ============================================================================

/**
 * Custom collapsed button for Women's World Widget.
 * Displays gradient text only (icons are rendered by GlassWidgetContainer).
 */
function WomensWorldCollapsedButton({ collapsedText }: { collapsedText: string }) {
  return (
    <span className="font-sans font-normal text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#FB9649] to-[#A361E9]">
      {collapsedText}
    </span>
  );
}

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
  autoScrollInterval = 40000,
  brandingText = "Powered by Gist.ai",
  onSubmit,
  width = 392,
  height,
  placement = "bottom-right",
  className,
  enableStreaming = false,
  apiUrl,
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

  // Streaming state management
  const { answerState, streamedText, error, startStreaming, resetAnswer } =
    useStreamingAnswer(apiUrl);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

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

  const handleClose = () => {
    onExpandChange?.(false);
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

  // Determine positioning strategy
  const positioning = placement ? "relative" : "fixed";

  // Set fixed height when showing answer to prevent expansion/contraction during streaming
  // Use undefined for search view to allow dynamic height that fits content
  const containerHeight = showAnswer ? 600 : undefined;

  // Widget content
  const widgetContent = (
    <GlassWidgetContainer
      collapsedContent={<WomensWorldCollapsedButton collapsedText={collapsedText} />}
      isExpanded={controlledIsExpanded}
      defaultExpanded={defaultExpanded}
      onExpandChange={onExpandChange}
      collapsedWidth={140}
      collapsedHeight={48}
      expandedWidth={width}
      expandedHeight={containerHeight}
      positioning={positioning}
      className={className}
      customBackground="var(--gradient-womens-world)"
      customGradientBorder="linear-gradient(90deg, #FB9649 0%, #A361E9 100%)"
    >
      {/* Header */}
      <GlassWidgetHeader className="relative flex items-center justify-center px-6 py-4 flex-shrink-0">
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
          onClick={handleClose}
          className="absolute right-6 top-4 hover:bg-white/20 rounded-full"
          aria-label="Close widget"
        >
          <X className="w-5 h-5 text-white" />
        </Button>
      </GlassWidgetHeader>

      {/* Content */}
      <GlassWidgetContent className="px-6 py-4 flex-1" disableOverflow={showAnswer}>
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
            <ScrollArea className="h-[480px]">
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
            </ScrollArea>
          )}
        </AnimatePresence>
      </GlassWidgetContent>

      {/* Footer */}
      <GlassWidgetFooter className="flex justify-end px-6 py-4 flex-shrink-0">
        <PoweredByButton />
      </GlassWidgetFooter>
    </GlassWidgetContainer>
  );

  // Wrap in placement div if placement is specified
  if (placement) {
    return (
      <div className={getPlacementClasses()}>
        {widgetContent}
      </div>
    );
  }

  return widgetContent;
}
