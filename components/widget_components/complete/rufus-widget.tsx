"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Menu, X, ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  RufusWidgetProps,
  RufusWidgetCollapsedProps,
  RufusWidgetExpandedProps,
  SeedQuestionsListProps,
  SeedQuestionPillProps,
  WelcomeCardProps,
} from "../types";

// Default seed questions
const DEFAULT_SEED_QUESTIONS = [
  "Does it fit in most cup holders?",
  "Is the straw removable?",
  "Can it keep drinks hot?",
  "What do customers say?",
  "Is this bottle leak-proof?",
  "What's the warranty coverage?",
  "How long does it keep drinks cold?",
  "Is it dishwasher safe?",
];

/**
 * Seed Question Pill Component
 */
const SeedQuestionPill: React.FC<SeedQuestionPillProps> = ({
  question,
  onClick,
  isSelected = false,
  variant = "light",
  className,
}) => {
  const variantClass =
    variant === "cta"
      ? "rufus-pill-cta"
      : variant === "dark"
      ? "rufus-pill-dark"
      : "rufus-pill-light";

  return (
    <button
      onClick={onClick}
      className={cn(
        variantClass,
        "whitespace-nowrap transition-all duration-200 hover:scale-[1.02]",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        className
      )}
      type="button"
    >
      {question}
    </button>
  );
};

/**
 * Welcome Card Component
 */
const WelcomeCard: React.FC<WelcomeCardProps> = ({
  heading,
  message,
  learnMoreUrl,
  customStyles,
}) => {
  return (
    <Card className="border-none shadow-none bg-[rgb(var(--color-rufus-blue-light))]" style={customStyles}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{heading}</h3>
        <p className="text-sm text-gray-700 mb-2">{message}</p>
        {learnMoreUrl && (
          <a
            href={learnMoreUrl}
            className="text-sm text-[rgb(var(--color-rufus-blue))] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Seed Questions List Component
 */
const SeedQuestionsList: React.FC<SeedQuestionsListProps> = ({
  questions,
  onQuestionClick,
  selectedQuestion,
  showScrollIndicator,
  variant = "expanded",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsScrolledToBottom(isAtBottom);
    };

    scrollElement.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <ScrollArea className="h-[200px]" ref={scrollRef}>
        <div className="flex flex-col gap-2 p-4">
          {questions.map((question, index) => (
            <SeedQuestionPill
              key={index}
              question={question}
              onClick={() => onQuestionClick(question)}
              isSelected={selectedQuestion === question}
              variant="light"
            />
          ))}
        </div>
      </ScrollArea>
      {showScrollIndicator && !isScrolledToBottom && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-[rgb(var(--color-rufus-blue))]" />
        </div>
      )}
    </div>
  );
};

/**
 * Collapsed Widget State Component
 */
const RufusWidgetCollapsed: React.FC<RufusWidgetCollapsedProps> = ({
  collapsedText,
  seedQuestions,
  visibleQuestions,
  onExpand,
  onQuestionClick,
}) => {
  const visibleSeedQuestions = seedQuestions.slice(0, visibleQuestions);

  const handleQuestionClick = (question: string) => {
    onQuestionClick(question);
    onExpand();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-lg shadow-md">
      <Button
        onClick={onExpand}
        className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-[rgb(var(--color-amazon-orange))]" />
        {collapsedText}
      </Button>
      {visibleSeedQuestions.map((question, index) => (
        <SeedQuestionPill
          key={index}
          question={question}
          onClick={() => handleQuestionClick(question)}
          variant="light"
        />
      ))}
      <SeedQuestionPill
        question="Ask something else"
        onClick={onExpand}
        variant="cta"
      />
    </div>
  );
};

/**
 * Expanded Widget State Component
 */
const RufusWidgetExpanded: React.FC<RufusWidgetExpandedProps> = ({
  welcomeHeading,
  welcomeMessage,
  questionPrompt,
  seedQuestions,
  inputPlaceholder,
  showMenu,
  onClose,
  onMenuClick,
  onQuestionClick,
  onSubmit,
  containerStyles,
  headerStyles,
  buttonStyles,
  inputStyles,
  welcomeCardStyles,
  scrollAreaStyles,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setInputValue(selectedQuestion);
  }, [selectedQuestion]);

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    onQuestionClick(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedQuestion(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden" style={containerStyles}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={headerStyles}>
        {showMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-lg font-semibold">Rufus</span>
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">BETA</span>
          <Sparkles className="w-4 h-4 text-[rgb(var(--color-amazon-orange))]" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="h-[400px]" style={scrollAreaStyles}>
        <div className="p-4 space-y-4">
          <WelcomeCard heading={welcomeHeading} message={welcomeMessage} customStyles={welcomeCardStyles} />
          <h3 className="text-base font-medium text-gray-800">
            {questionPrompt}
          </h3>
          <SeedQuestionsList
            questions={seedQuestions}
            onQuestionClick={handleQuestionClick}
            selectedQuestion={selectedQuestion}
            showScrollIndicator={true}
            variant="expanded"
          />
        </div>
      </ScrollArea>

      {/* Footer */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={handleInputChange}
            className="rufus-input flex-1"
            style={inputStyles}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim()}
            className="bg-[rgb(var(--color-rufus-blue))] hover:bg-[rgb(var(--color-rufus-blue-dark))] text-white"
            style={buttonStyles}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

/**
 * Rufus Widget - Amazon Shopping Assistant
 *
 * A shopping assistant widget designed to replicate Amazon's Rufus AI interface.
 * Features two states:
 * - Collapsed: Compact horizontal button with seed questions
 * - Expanded: Full chat interface with scrollable questions and input
 */
export const RufusWidget: React.FC<RufusWidgetProps> = ({
  isExpanded: controlledIsExpanded,
  onExpandChange,
  defaultExpanded = false,
  collapsedText = "Ask Rufus",
  visibleSeedQuestionsCollapsed = 3,
  seedQuestions = DEFAULT_SEED_QUESTIONS,
  welcomeHeading = "Welcome!",
  welcomeMessage = "Hi, I'm Rufus, your shopping assistant. My answers are powered by AI, so I may not always get things right.",
  questionPrompt = "What do you need help with today?",
  inputPlaceholder = "Ask Rufus a question",
  showMenu = true,
  onSubmit = () => {},
  onMenuClick = () => {},
  customColors,
  customGradient,
  customDimensions,
  className,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Controlled/uncontrolled pattern
  const isExpanded = controlledIsExpanded ?? internalExpanded;

  // Helper function to generate custom styles
  const getCustomStyles = () => {
    const styles: React.CSSProperties = {};

    if (customDimensions?.width) {
      styles.width = `${customDimensions.width}px`;
      styles.maxWidth = `${customDimensions.width}px`;
    }

    if (customDimensions?.height) {
      styles.maxHeight = `${customDimensions.height}px`;
    }

    return styles;
  };

  const getScrollAreaStyles = () => {
    const styles: React.CSSProperties = {};

    if (customDimensions?.height) {
      // Calculate ScrollArea height: total height - header (~68px) - footer (~68px)
      const contentHeight = customDimensions.height - 136;
      styles.height = `${Math.max(200, contentHeight)}px`; // Minimum 200px
    }

    return styles;
  };

  const getHeaderStyles = () => {
    const styles: React.CSSProperties = {};

    if (customGradient?.use && customGradient.start && customGradient.end) {
      styles.background = `linear-gradient(135deg, ${customGradient.start}, ${customGradient.end})`;
      styles.color = customColors?.text || 'white';
    } else if (customColors?.primary) {
      styles.backgroundColor = customColors.primary;
      styles.color = customColors?.text || 'white';
    }

    return styles;
  };

  const getButtonStyles = () => {
    const styles: React.CSSProperties = {};

    if (customColors?.primary) {
      styles.backgroundColor = customColors.primary;
      styles.color = customColors?.text || 'white';
      styles.borderColor = customColors.primary;
    }

    return styles;
  };

  const getInputStyles = () => {
    const styles: React.CSSProperties = {};

    if (customColors?.secondary) {
      styles.borderColor = customColors.secondary;
    }

    return styles;
  };

  const getWelcomeCardStyles = () => {
    const styles: React.CSSProperties = {};

    if (customColors?.background) {
      // Use a lighter variant of the background color
      styles.backgroundColor = customColors.background;
      styles.opacity = 0.1;
    }

    return styles;
  };

  const handleExpand = () => {
    setInternalExpanded(true);
    onExpandChange?.(true);
  };

  const handleClose = () => {
    setInternalExpanded(false);
    onExpandChange?.(false);
  };

  const handleQuestionClick = (question: string) => {
    // Just used for pre-populating in collapsed mode
    // The expanded component handles its own question selection
  };

  return (
    <div className={cn("w-full", className)}>
      {isExpanded ? (
        <RufusWidgetExpanded
          welcomeHeading={welcomeHeading}
          welcomeMessage={welcomeMessage}
          questionPrompt={questionPrompt}
          seedQuestions={seedQuestions}
          inputPlaceholder={inputPlaceholder}
          showMenu={showMenu}
          onClose={handleClose}
          onMenuClick={onMenuClick}
          onQuestionClick={handleQuestionClick}
          onSubmit={onSubmit}
          containerStyles={getCustomStyles()}
          headerStyles={getHeaderStyles()}
          buttonStyles={getButtonStyles()}
          inputStyles={getInputStyles()}
          welcomeCardStyles={getWelcomeCardStyles()}
          scrollAreaStyles={getScrollAreaStyles()}
        />
      ) : (
        <RufusWidgetCollapsed
          collapsedText={collapsedText}
          seedQuestions={seedQuestions}
          visibleQuestions={visibleSeedQuestionsCollapsed}
          onExpand={handleExpand}
          onQuestionClick={handleQuestionClick}
        />
      )}
    </div>
  );
};
