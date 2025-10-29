"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  EaterWidgetProps,
  EaterHeaderProps,
  EaterSearchInputProps,
  EaterSeedQuestionPillsProps,
  EaterQuestionPillProps,
} from "../types";

// Default constants
const DEFAULT_TITLE = "Ask Eater with AI";
const DEFAULT_PLACEHOLDER = "Ask Anything";
const DEFAULT_SEED_QUESTIONS = [
  "Recommendations for local wineries?",
  "Featured local festivals and fairs?",
  "Best restaurant reviews for 2025?",
];
const DEFAULT_COLLAPSED_TEXT = "Ask Eater";

/**
 * Squiggle Underline SVG Component
 * Red wavy underline decoration for seed question pills
 */
function SquiggleUnderline({ className }: { className?: string }) {
  return (
    <svg
      width="115"
      height="6"
      viewBox="0 0 115 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute left-1/2 -translate-x-1/2", className)}
      aria-hidden="true"
    >
      <path
        d="M0.403931 5.37228C2.40391 2.62971 4.4039 -0.11267 6.40388 0.622152C8.40386 1.35697 10.4038 5.56919 12.404 5.37228C14.404 5.17538 16.404 0.569536 18.404 0.622152C20.404 0.674966 22.4039 5.38644 24.4039 5.37228C26.4039 5.35813 28.4039 0.618365 30.4039 0.622152C32.4039 0.625939 34.4038 5.37328 36.404 5.37228C38.404 5.37129 40.404 0.621953 42.404 0.622152C44.4039 0.62255 46.4039 5.37228 48.4039 5.37228C50.4039 5.37209 52.4039 0.622152 54.4039 0.622152C56.4038 0.622152 58.404 5.37228 60.404 5.37228C62.404 5.37228 64.404 0.622351 66.404 0.622152C68.4039 0.622152 70.4039 5.37189 72.4039 5.37228C74.4039 5.37248 76.4039 0.623148 78.4039 0.622152C80.404 0.621155 82.404 5.3685 84.404 5.37228C86.404 5.37607 88.404 0.636302 90.4039 0.622152C92.4039 0.608001 94.4039 5.31947 96.4039 5.37228C98.4039 5.4249 100.404 0.819061 102.404 0.622152C104.404 0.425243 106.404 4.63746 108.404 5.37228C110.404 6.10711 112.404 3.36473 114.404 0.622152"
        stroke="#E60001"
      />
    </svg>
  );
}

/**
 * Question Pill Component
 * Individual seed question button with red squiggle underline
 */
function EaterQuestionPill({
  question,
  onClick,
  isSelected = false,
  className,
}: EaterQuestionPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center",
        "px-4 py-1 pb-3", // Extra padding bottom for squiggle
        "text-xs font-semibold uppercase tracking-wide",
        "text-[#414141] hover:text-[#E60001]",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60001] focus-visible:ring-offset-2",
        "rounded-full", // Pill shape
        isSelected && "text-[#E60001]",
        className
      )}
      type="button"
    >
      <span className="relative z-10" style={{ fontFamily: "Degular, sans-serif" }}>
        {question}
      </span>
      <SquiggleUnderline className="bottom-0" />
    </button>
  );
}

/**
 * Seed Question Pills Container
 * Displays array of question pills with squiggle underlines
 */
function EaterSeedQuestionPills({
  questions,
  onQuestionClick,
  selectedQuestion,
}: EaterSeedQuestionPillsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
      {questions.map((question, index) => (
        <EaterQuestionPill
          key={`${question}-${index}`}
          question={question}
          onClick={() => onQuestionClick(question)}
          isSelected={selectedQuestion === question}
        />
      ))}
    </div>
  );
}

/**
 * Search Input Section Component
 * Input field with icon prefix and circular submit button
 */
function EaterSearchInputSection({
  placeholder,
  value,
  onChange,
  onSubmit,
  canSubmit,
}: EaterSearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      <div className="relative flex items-center">
        {/* Icon prefix */}
        <div className="absolute left-4 flex items-center pointer-events-none">
          <Sparkles className="w-4 h-4 text-[#E60001]" aria-hidden="true" />
        </div>

        {/* Input field with ultra-high border radius */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-[53px]",
            "pl-12 pr-14", // Space for icon prefix and submit button
            "text-sm",
            "bg-white",
            "border-2 border-[#E60001]",
            "rounded-[132px]", // Ultra-high border radius (pill shape)
            "placeholder:text-black/60",
            "focus-visible:ring-2 focus-visible:ring-[#E60001] focus-visible:ring-offset-2",
            "transition-all duration-200"
          )}
          style={{ fontFamily: "Literata, serif" }}
          aria-label="Search input"
        />

        {/* Circular submit button */}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            "absolute right-2",
            "w-8 h-8 p-0",
            "rounded-full",
            "bg-black/50 hover:bg-black/70",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "flex items-center justify-center"
          )}
          aria-label="Submit question"
        >
          <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Header Component
 * Widget title and close button
 */
function EaterHeader({ title, onClose }: EaterHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1
        className="text-[32px] font-bold text-black leading-[32px]"
        style={{ fontFamily: "Degular, sans-serif" }}
      >
        {title}
      </h1>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-black/5"
        aria-label="Close widget"
      >
        <X className="h-5 w-5 text-black" aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * Eater Widget
 * Food and restaurant discovery AI assistant with Eater branding
 *
 * Features:
 * - Eater red (#E60001) brand color
 * - Premium typography (Degular/Literata)
 * - Signature squiggle underlines on seed questions
 * - Ultra-rounded pill-shaped input (132px border radius)
 * - Circular submit button
 * - Controlled/uncontrolled expansion state
 * - Redirects to Women's World Answer Page on submit
 *
 * @example
 * ```tsx
 * // Uncontrolled mode
 * <EaterWidget
 *   defaultExpanded={false}
 * />
 *
 * // Controlled mode
 * <EaterWidget
 *   isExpanded={isOpen}
 *   onExpandChange={setIsOpen}
 *   seedQuestions={customQuestions}
 * />
 * ```
 */
export function EaterWidget({
  isExpanded,
  onExpandChange,
  defaultExpanded = false,
  collapsedText = DEFAULT_COLLAPSED_TEXT,
  title = DEFAULT_TITLE,
  placeholder = DEFAULT_PLACEHOLDER,
  seedQuestions = DEFAULT_SEED_QUESTIONS,
  onSubmit,
  className,
}: EaterWidgetProps) {
  // Hooks
  const router = useRouter();

  // State management
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [inputValue, setInputValue] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Derived values
  const isControlled = isExpanded !== undefined;
  const effectiveExpanded = isControlled ? isExpanded : internalExpanded;
  const canSubmit = inputValue.trim().length > 0;

  // Event handlers
  const handleClose = () => {
    if (isControlled) {
      onExpandChange?.(false);
    } else {
      setInternalExpanded(false);
    }
  };

  const handleExpand = () => {
    if (isControlled) {
      onExpandChange?.(true);
    } else {
      setInternalExpanded(true);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Clear selected question when user types manually
    if (selectedQuestion) {
      setSelectedQuestion(null);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    // Navigate to Eater Answer Page with query parameter
    const encodedQuery = encodeURIComponent(inputValue);
    router.push(`/admin/components/widgets/complete/eater-answers?q=${encodedQuery}`);

    // Note: Don't clear input - user may want to reference their question
    // Note: Don't call onSubmit callback - navigation replaces this behavior
  };

  const handleQuestionClick = (question: string) => {
    // Populate input with clicked question
    setInputValue(question);
    // Mark as selected for highlighting
    setSelectedQuestion(question);
  };

  // Collapsed state
  if (!effectiveExpanded) {
    return (
      <button
        onClick={handleExpand}
        className={cn(
          "inline-flex items-center justify-center",
          "px-6 py-3",
          "bg-white",
          "border-2 border-[#E60001]",
          "rounded-full",
          "text-base font-semibold text-[#E60001]",
          "hover:bg-[#E60001] hover:text-white",
          "transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60001] focus-visible:ring-offset-2",
          className
        )}
        style={{ fontFamily: "Degular, sans-serif" }}
        aria-label="Expand Eater widget"
      >
        {collapsedText}
      </button>
    );
  }

  // Expanded state
  return (
    <div
      className={cn(
        "w-full max-w-[977px] mx-auto",
        "bg-white",
        "border-2 border-[#E60001]",
        "rounded-lg",
        "p-8",
        "shadow-lg",
        className
      )}
    >
      <EaterHeader title={title} onClose={handleClose} />

      <EaterSearchInputSection
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        canSubmit={canSubmit}
      />

      <EaterSeedQuestionPills
        questions={seedQuestions}
        onQuestionClick={handleQuestionClick}
        selectedQuestion={selectedQuestion}
      />
    </div>
  );
}
