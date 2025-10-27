"use client";

import { useState, useRef, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { X, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import { ProfileBlank } from "@/components/widget_components/icons/profile-blank";
import { cn } from "@/lib/utils";
import type {
  WomensWorldWidgetProps,
  SearchInputSectionProps,
  SeedQuestionsCarouselProps,
  QuestionPillProps,
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
// QuestionPill Component
// ============================================================================

function QuestionPill({
  question,
  onClick,
  isSelected,
  className,
}: QuestionPillProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "rounded-[40px] bg-white shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap px-6 py-2 h-auto text-sm font-medium border-gray-200",
        isSelected &&
          "bg-gradient-to-r from-[#FB9649] to-[#A361E9] text-white border-transparent",
        className
      )}
    >
      {question}
    </Button>
  );
}

// ============================================================================
// SeedQuestionsCarousel Component
// ============================================================================

function SeedQuestionsCarousel({
  questions,
  autoScrollInterval,
  onQuestionClick,
  selectedQuestion,
}: SeedQuestionsCarouselProps) {
  // Refs for animation control
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  // Calculate duration based on autoScrollInterval prop (convert ms to seconds)
  const scrollDuration = autoScrollInterval / 1000;

  // Duplicate questions array for seamless infinite loop
  const duplicatedQuestions = [...questions, ...questions];

  // Initialize animation on mount and restart when autoScrollInterval changes
  useEffect(() => {
    if (carouselRef.current) {
      animationRef.current = animate(
        carouselRef.current,
        { x: ["0%", "-50%"] },
        {
          duration: scrollDuration,
          repeat: Infinity,
          ease: "linear",
        }
      );
    }

    // Cleanup animation on unmount or when autoScrollInterval changes
    return () => {
      animationRef.current?.stop();
    };
  }, [autoScrollInterval, scrollDuration]);

  // Pause animation on hover
  const handleMouseEnter = () => {
    animationRef.current?.pause();
  };

  // Resume animation on mouse leave
  const handleMouseLeave = () => {
    animationRef.current?.play();
  };

  return (
    <div
      className="w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={carouselRef}
        className="flex gap-2"
        style={{ width: "fit-content" }}
      >
        {duplicatedQuestions.map((question, index) => (
          <QuestionPill
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
            isSelected={selectedQuestion === question}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SearchInputSection Component
// ============================================================================

function SearchInputSection({
  placeholder,
  onSubmit,
  seedQuestions,
  seedQuestionsRow1,
  seedQuestionsRow2,
  autoScrollInterval,
}: SearchInputSectionProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestion.trim()) {
      onSubmit(selectedQuestion);
    }
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Glassmorphism Input Container */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-[40px] p-[2px] bg-gradient-to-r from-[#FB9649] to-[#A361E9]">
            <div className="absolute inset-[2px] rounded-[38px] bg-white/80 backdrop-blur-sm" />
          </div>

          {/* Input Content */}
          <div className="relative flex items-center gap-2 px-4 py-3">
            {/* Sparkle Icon */}
            <Sparkles className="w-5 h-5 text-[#FB9649] flex-shrink-0" />

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-400"
            />

            {/* Submit Button (Search Icon) */}
            {selectedQuestion && (
              <button
                type="submit"
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FB9649] to-[#A361E9] flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            )}

            {/* Profile Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <ProfileBlank className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </form>

      {/* Seed Questions Carousels - Dual Rows */}
      {(seedQuestionsRow1.length > 0 || seedQuestionsRow2.length > 0) && (
        <div className="flex flex-col gap-2 w-full">
          {seedQuestionsRow1.length > 0 && (
            <SeedQuestionsCarousel
              questions={seedQuestionsRow1}
              autoScrollInterval={autoScrollInterval}
              onQuestionClick={handleQuestionClick}
              selectedQuestion={selectedQuestion}
            />
          )}
          {seedQuestionsRow2.length > 0 && (
            <SeedQuestionsCarousel
              questions={seedQuestionsRow2}
              autoScrollInterval={autoScrollInterval}
              onQuestionClick={handleQuestionClick}
              selectedQuestion={selectedQuestion}
            />
          )}
        </div>
      )}
    </div>
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
  autoScrollInterval = 35000,
  brandingText = "Powered by Gist.ai",
  onSubmit,
  width = 392,
  height,
  className,
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

  const handleExpandChange = (expanded: boolean) => {
    setInternalExpanded(expanded);
    onExpandChange?.(expanded);
  };

  const handleSubmit = (question: string) => {
    onSubmit?.(question);
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
      <div className={cn("relative", className)}>
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
              <h2 className="womens-world-title text-white">{title}</h2>
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
              <SearchInputSection
                placeholder={placeholder}
                onSubmit={handleSubmit}
                seedQuestionsRow1={row1Questions}
                seedQuestionsRow2={row2Questions}
                autoScrollInterval={autoScrollInterval}
              />
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
