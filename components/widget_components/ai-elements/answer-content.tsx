/**
 * AnswerContent Component
 * Structured answer with inline citation parsing and rendering
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { StreamingText } from "./streaming-text";
import { InlineCitation } from "./inline-citation";
import { getCitationId } from "@/lib/citation-utils";
import type { AnswerContentProps } from "../types";

const AnswerContent = React.forwardRef<HTMLDivElement, AnswerContentProps>(
  ({ answerText, isComplete, citations, onCitationClick, className }, ref) => {
    /**
     * Renders text with inline citations
     * Parses [1], [2] markers and replaces with InlineCitation components
     */
    const renderTextWithCitations = (text: string) => {
      const citationRegex = /\[(\d+)\]/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      // Find all citation markers in text
      while ((match = citationRegex.exec(text)) !== null) {
        const citationNumber = parseInt(match[1], 10);

        // Add text before citation
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }

        // Add InlineCitation component
        parts.push(
          <InlineCitation
            key={`citation-${citationNumber}-${match.index}`}
            citationNumber={citationNumber}
            onClick={() => onCitationClick(getCitationId(citationNumber))}
          />
        );

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text after last citation
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "prose prose-gray dark:prose-invert max-w-none",
          "prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
          "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed",
          "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
          "prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold",
          "prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6",
          "prose-li:text-gray-700 dark:prose-li:text-gray-300",
          className
        )}
      >
        {isComplete ? (
          // Complete answer with citations
          <div className="whitespace-pre-wrap">{renderTextWithCitations(answerText)}</div>
        ) : (
          // Streaming text with cursor
          <StreamingText text={answerText} isComplete={false} />
        )}
      </div>
    );
  }
);

AnswerContent.displayName = "AnswerContent";

export { AnswerContent };
