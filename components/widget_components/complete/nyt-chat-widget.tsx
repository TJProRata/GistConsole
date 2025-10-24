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
}: {
  category: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="nyt-pill flex items-center gap-1.5 h-auto whitespace-nowrap"
    >
      <Sparkles className="w-3.5 h-3.5" />
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
}: {
  citation: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="nyt-pill flex items-center gap-1.5 h-auto whitespace-nowrap text-xs"
    >
      <Sparkles className="w-3 h-3" />
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
}: SuggestionCategoriesProps) {
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
        />
      ))}
      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="nyt-pill h-auto"
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
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-800 transition-colors rounded-lg"
    >
      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-sm text-white">{suggestion}</span>
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
function LoadingIndicator() {
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
        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
        <span
          className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        />
        <span
          className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
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
}: StreamingAnswerProps) {
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
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
            {displayedText}
          </p>
        </ScrollArea>
      ) : (
        <p
          className={cn(
            "text-white text-sm leading-relaxed whitespace-pre-wrap",
            !isExpanded && needsExpansion && "line-clamp-3"
          )}
        >
          {displayedText}
        </p>
      )}
      {needsExpansion && !needsScroll && (
        <button
          onClick={onToggleExpand}
          className="text-purple-400 text-xs hover:text-purple-300 transition-colors flex items-center gap-1"
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
}: CitationPillsProps) {
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
        />
      ))}
      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="nyt-pill h-auto text-xs"
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
}: AnswerDisplayProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-base">{query}</h3>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <StreamingAnswer
            text={answer}
            isLoading={isLoading}
            isExpanded={isExpanded}
            onToggleExpand={onToggleExpand}
          />
          <CitationPills citations={citations} onCitationClick={onCitationClick} />
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
      className="flex items-center gap-3 bg-[rgb(var(--nyt-dark-bg))] text-white hover:bg-[rgb(var(--nyt-gray-900))] border border-gray-700 px-4 py-3 rounded-lg shadow-lg transition-all"
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
    <div className="w-[400px] bg-[rgb(var(--nyt-dark-bg))] rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-white font-semibold text-lg">{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white h-8 w-8"
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
            />
          )}

          {/* Loading State */}
          {currentState === "loading" && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-base">{query}</h3>
              <LoadingIndicator />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-3">
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-4"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Branding */}
        <div className="text-center text-gray-500 text-xs">{brandingText}</div>
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
        />
      )}
    </div>
  );
}
