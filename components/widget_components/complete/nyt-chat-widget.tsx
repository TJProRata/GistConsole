"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {
  NYTChatWidgetProps,
  NYTWidgetState,
  AutocompleteListProps,
  AnswerDisplayProps,
  StreamingAnswerProps,
  CitationPillsProps,
  SuggestionCategoriesProps,
} from "../types";

/**
 * NYT Logo Component (simplified text version)
 */
function NYTLogo({ className }: { className?: string }) {
  return (
    <span className={cn("font-serif font-bold text-sm tracking-wide", className)}>
      The New York Times
    </span>
  );
}

/**
 * Category Pill Component
 */
function CategoryPill({
  category,
  onClick,
  accentColor,
  useGradient,
  gradientStart,
  gradientEnd,
}: {
  category: string;
  onClick: () => void;
  accentColor: string;
  useGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
}) {
  const pillStyle = useGradient
    ? {
        backgroundImage: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : { color: accentColor };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="nyt-pill flex items-center gap-1.5 h-auto whitespace-nowrap"
      style={pillStyle}
    >
      <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
      {category}
    </Button>
  );
}

/**
 * Citation Pill Component
 */
function CitationPill({
  citation,
  onClick,
  accentColor,
}: {
  citation: string;
  onClick: () => void;
  accentColor: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="nyt-pill flex items-center gap-1.5 h-auto whitespace-nowrap text-xs"
      style={{ color: accentColor }}
    >
      <Sparkles className="w-3 h-3" style={{ color: accentColor }} />
      {citation}
    </Button>
  );
}

/**
 * Suggestion Categories Component
 */
function SuggestionCategories({
  categories,
  visibleCount = 3,
  onCategoryClick,
  accentColor,
  useGradient,
  gradientStart,
  gradientEnd,
}: SuggestionCategoriesProps & {
  accentColor: string;
  useGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedCategories = showAll ? categories : categories.slice(0, visibleCount);
  const hasMore = categories.length > visibleCount;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedCategories.map((category, index) => (
        <CategoryPill
          key={index}
          category={category}
          onClick={() => onCategoryClick(category)}
          accentColor={accentColor}
          useGradient={useGradient}
          gradientStart={gradientStart}
          gradientEnd={gradientEnd}
        />
      ))}
      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="nyt-pill h-auto"
          style={{ color: accentColor }}
        >
          {showAll ? "Less" : "More"}
        </Button>
      )}
    </div>
  );
}

/**
 * Autocomplete Suggestion Component
 */
function AutocompleteSuggestion({
  suggestion,
  onClick,
}: {
  suggestion: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
    >
      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-sm text-gray-900 dark:text-white">{suggestion}</span>
    </button>
  );
}

/**
 * Autocomplete List Component
 */
function AutocompleteList({ query, suggestions, onSelect }: AutocompleteListProps) {
  if (!query || suggestions.length === 0) return null;

  return (
    <div className="space-y-1">
      {suggestions.map((suggestion, index) => (
        <AutocompleteSuggestion
          key={index}
          suggestion={suggestion}
          onClick={() => onSelect(suggestion)}
        />
      ))}
    </div>
  );
}

/**
 * Loading Indicator Component
 */
function LoadingIndicator({ accentColor }: { accentColor: string }) {
  const [stage, setStage] = useState(0);
  const stages = ["articles", "books", "videos", "podcasts"];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % stages.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: accentColor }} />
        <span
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ backgroundColor: accentColor, animationDelay: "0.1s" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ backgroundColor: accentColor, animationDelay: "0.2s" }}
        />
      </div>
      <span>Searching through {stages[stage]}...</span>
    </div>
  );
}

/**
 * Streaming Answer Component
 */
function StreamingAnswer({
  text,
  isLoading,
  isExpanded,
  onToggleExpand,
  maxLinesCollapsed = 3,
  maxLinesExpanded = 10,
  accentColor,
}: StreamingAnswerProps & { accentColor: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!text) return;

    setIsStreaming(true);
    setDisplayedText("");

    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsStreaming(false);
        clearInterval(streamInterval);
      }
    }, 20);

    return () => clearInterval(streamInterval);
  }, [text]);

  const lineCount = displayedText.split("\n").length;
  const needsExpansion = lineCount > maxLinesCollapsed;
  const needsScroll = lineCount > maxLinesExpanded;

  return (
    <div className="space-y-2">
      {needsScroll && isExpanded ? (
        <ScrollArea className="h-64">
          <p className="text-gray-900 dark:text-white text-sm leading-relaxed whitespace-pre-wrap">
            {displayedText}
          </p>
        </ScrollArea>
      ) : (
        <p
          className={cn(
            "text-gray-900 dark:text-white text-sm leading-relaxed whitespace-pre-wrap",
            !isExpanded && needsExpansion && "line-clamp-3"
          )}
        >
          {displayedText}
        </p>
      )}
      {needsExpansion && !needsScroll && (
        <button
          onClick={onToggleExpand}
          className="text-xs transition-colors flex items-center gap-1"
          style={{ color: accentColor }}
        >
          {isExpanded ? "Show less" : "Show more"}
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </button>
      )}
    </div>
  );
}

/**
 * Citation Pills Component
 */
function CitationPills({
  citations,
  visibleCount = 3,
  onCitationClick,
  accentColor,
}: CitationPillsProps & { accentColor: string }) {
  const [showAll, setShowAll] = useState(false);
  const displayedCitations = showAll ? citations : citations.slice(0, visibleCount);
  const hasMore = citations.length > visibleCount;

  if (citations.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedCitations.map((citation, index) => (
        <CitationPill
          key={index}
          citation={citation}
          onClick={() => onCitationClick(citation)}
          accentColor={accentColor}
        />
      ))}
      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="nyt-pill h-auto text-xs"
          style={{ color: accentColor }}
        >
          {showAll ? "Less" : "More"}
        </Button>
      )}
    </div>
  );
}

/**
 * Answer Display Component
 */
function AnswerDisplay({
  query,
  answer,
  citations,
  isLoading,
  isExpanded,
  onToggleExpand,
  onCitationClick,
  accentColor,
}: AnswerDisplayProps & { accentColor: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-gray-900 dark:text-white font-semibold text-base">{query}</h3>

      {isLoading ? (
        <LoadingIndicator accentColor={accentColor} />
      ) : (
        <>
          <StreamingAnswer
            text={answer}
            isLoading={isLoading}
            isExpanded={isExpanded}
            onToggleExpand={onToggleExpand}
            accentColor={accentColor}
          />
          <CitationPills citations={citations} onCitationClick={onCitationClick} accentColor={accentColor} />
        </>
      )}
    </div>
  );
}

/**
 * NYT Widget Collapsed State
 */
function NYTWidgetCollapsed({
  collapsedText,
  onExpand,
}: {
  collapsedText: string;
  onExpand: () => void;
}) {
  return (
    <Button
      onClick={onExpand}
      className="flex items-center gap-3 bg-white dark:bg-[rgb(var(--nyt-dark-bg))] text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[rgb(var(--nyt-gray-900))] border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg shadow-lg transition-all"
    >
      <Sparkles className="w-4 h-4" />
      <span className="font-medium">{collapsedText}</span>
      <NYTLogo className="text-xs opacity-70" />
    </Button>
  );
}

/**
 * NYT Widget Expanded State
 */
function NYTWidgetExpanded({
  title,
  suggestionCategories,
  placeholder,
  followUpPlaceholder,
  brandingText,
  currentState,
  query,
  answer,
  citations,
  isLoading,
  onClose,
  onSubmit,
  onCategoryClick,
  onCitationClick,
  accentColor,
  useGradient,
  gradientStart,
  gradientEnd,
}: {
  title: string;
  suggestionCategories: string[];
  placeholder: string;
  followUpPlaceholder: string;
  brandingText: string;
  currentState: NYTWidgetState;
  query: string | null;
  answer: string | null;
  citations: string[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (query: string) => void;
  onCategoryClick: (category: string) => void;
  onCitationClick: (citation: string) => void;
  accentColor: string;
  useGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [isAnswerExpanded, setIsAnswerExpanded] = useState(false);

  // Simulate autocomplete
  useEffect(() => {
    if (inputValue.length > 2 && currentState === "search") {
      // Mock autocomplete suggestions
      const mockSuggestions = [
        `${inputValue} today?`,
        `${inputValue} latest news?`,
        `${inputValue} analysis?`,
      ];
      setAutocompleteResults(mockSuggestions);
    } else {
      setAutocompleteResults([]);
    }
  }, [inputValue, currentState]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue("");
      setAutocompleteResults([]);
    }
  };

  const handleAutocompleteSelect = (suggestion: string) => {
    setInputValue(suggestion);
    onSubmit(suggestion);
    setAutocompleteResults([]);
  };

  const showSuggestions = currentState === "search" && inputValue === "";
  const showAutocomplete = currentState === "search" && autocompleteResults.length > 0;
  const showAnswer = currentState === "answer" && answer;

  return (
    <div className="w-[400px] bg-white dark:bg-[rgb(var(--nyt-dark-bg))] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="max-h-[500px]">
        <div className="p-4 space-y-4">
          {/* Suggestion Categories (initial state) */}
          {showSuggestions && (
            <SuggestionCategories
              categories={suggestionCategories}
              onCategoryClick={(category) => {
                setInputValue(category);
                onCategoryClick(category);
              }}
              accentColor={accentColor}
              useGradient={useGradient}
              gradientStart={gradientStart}
              gradientEnd={gradientEnd}
            />
          )}

          {/* Autocomplete List (typing state) */}
          {showAutocomplete && (
            <AutocompleteList
              query={inputValue}
              suggestions={autocompleteResults}
              onSelect={handleAutocompleteSelect}
            />
          )}

          {/* Answer Display (answer state) */}
          {showAnswer && (
            <AnswerDisplay
              query={query || ""}
              answer={answer}
              citations={citations}
              isLoading={isLoading}
              isExpanded={isAnswerExpanded}
              onToggleExpand={() => setIsAnswerExpanded(!isAnswerExpanded)}
              onCitationClick={onCitationClick}
              accentColor={accentColor}
            />
          )}

          {/* Loading State */}
          {currentState === "loading" && (
            <div className="space-y-4">
              <h3 className="text-gray-900 dark:text-white font-semibold text-base">{query}</h3>
              <LoadingIndicator accentColor={accentColor} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        {/* Search Input or Follow-up Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={showAnswer ? followUpPlaceholder : placeholder}
            className="nyt-input flex-1"
          />
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="text-white px-4"
            style={{ backgroundColor: accentColor }}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Branding */}
        <div className="text-center text-gray-600 dark:text-gray-500 text-xs">{brandingText}</div>
      </div>
    </div>
  );
}

/**
 * NYT Chat Widget - Main Component
 */
export function NYTChatWidget({
  isExpanded: controlledExpanded,
  onExpandChange,
  defaultExpanded = false,
  collapsedText = "Ask",
  title = "Ask New York Times Anything!",
  suggestionCategories = [
    "Top Stories",
    "Breaking News",
    "Generate a new Wordle",
    "Election Coverage",
    "Climate News",
  ],
  placeholder = "Ask anything",
  followUpPlaceholder = "Ask a follow up...",
  brandingText = "Powered by Gist Answers",
  onSubmit,
  onCategoryClick,
  onCitationClick,
  primaryColor = "#9333ea",
  useGradient = false,
  gradientStart = "#3b82f6",
  gradientEnd = "#8b5cf6",
  className,
}: NYTChatWidgetProps) {
  // Controlled vs Uncontrolled pattern
  const isControlled = controlledExpanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  // State machine
  const [widgetState, setWidgetState] = useState<NYTWidgetState>("search");
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);

  // Color styling helpers
  const accentColor = primaryColor;
  const gradientStyle = useGradient
    ? { backgroundImage: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }
    : { backgroundColor: accentColor };

  const getBorderStyle = () => {
    if (useGradient) {
      return {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderImage: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd}) 1`,
      };
    }
    return { borderColor: accentColor };
  };

  const handleExpandChange = useCallback(
    (expanded: boolean) => {
      if (!isControlled) {
        setInternalExpanded(expanded);
      }
      onExpandChange?.(expanded);

      // Reset state when collapsing
      if (!expanded) {
        setWidgetState("search");
        setCurrentQuery(null);
        setAnswer(null);
        setCitations([]);
      }
    },
    [isControlled, onExpandChange]
  );

  const handleSubmit = useCallback(
    (query: string) => {
      setCurrentQuery(query);
      setWidgetState("loading");

      // Call user callback
      onSubmit?.(query);

      // Simulate API call
      setTimeout(() => {
        const mockAnswer =
          "The latest developments indicate significant progress in climate negotiations. World leaders have convened to discuss concrete action plans for reducing carbon emissions by 2030. The agreement includes binding commitments from major economies and establishes a framework for monitoring and enforcement.\n\nExperts suggest this represents a turning point in global climate policy, though implementation challenges remain. The financial mechanisms proposed aim to support developing nations in their transition to renewable energy sources.";

        const mockCitations = [
          "Climate Summit 2024",
          "Paris Agreement Update",
          "IPCC Latest Report",
          "Renewable Energy Transition",
        ];

        setAnswer(mockAnswer);
        setCitations(mockCitations);
        setWidgetState("answer");
      }, 2000);
    },
    [onSubmit]
  );

  const handleCategoryClick = useCallback(
    (category: string) => {
      onCategoryClick?.(category);
      // Auto-submit category as query
      handleSubmit(category);
    },
    [onCategoryClick, handleSubmit]
  );

  const handleCitationClick = useCallback(
    (citation: string) => {
      onCitationClick?.(citation);
    },
    [onCitationClick]
  );

  return (
    <div className={cn("inline-block", className)}>
      {!isExpanded ? (
        <NYTWidgetCollapsed
          collapsedText={collapsedText}
          onExpand={() => handleExpandChange(true)}
        />
      ) : (
        <NYTWidgetExpanded
          title={title}
          suggestionCategories={suggestionCategories}
          placeholder={placeholder}
          followUpPlaceholder={followUpPlaceholder}
          brandingText={brandingText}
          currentState={widgetState}
          query={currentQuery}
          answer={answer}
          citations={citations}
          isLoading={widgetState === "loading"}
          onClose={() => handleExpandChange(false)}
          onSubmit={handleSubmit}
          onCategoryClick={handleCategoryClick}
          onCitationClick={handleCitationClick}
          accentColor={accentColor}
          useGradient={useGradient}
          gradientStart={gradientStart}
          gradientEnd={gradientEnd}
        />
      )}
    </div>
  );
}
