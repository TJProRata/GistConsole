"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StreamingText } from "@/components/widget_components/ai-elements/streaming-text";
import { cn } from "@/lib/utils";
import type { AnswerState } from "@/components/widget_components/types";

const answerDisplayVariants = cva(
  "relative rounded-3xl p-6 transition-all duration-300",
  {
    variants: {
      state: {
        loading: "min-h-[200px]",
        streaming: "min-h-[200px]",
        complete: "min-h-[200px]",
        error: "min-h-[120px]",
      },
    },
    defaultVariants: {
      state: "loading",
    },
  }
);

export interface WomensWorldAnswerDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof answerDisplayVariants> {
  /** Current answer state */
  answerState: AnswerState;
  /** Streamed answer text */
  text: string;
  /** Error message if state is "error" */
  error?: string | null;
  /** Callback when user clicks "New Search" */
  onNewSearch?: () => void;
  /** Callback to retry after error */
  onRetry?: () => void;
}

const WomensWorldAnswerDisplay = React.forwardRef<
  HTMLDivElement,
  WomensWorldAnswerDisplayProps
>(
  (
    {
      answerState,
      text,
      error,
      onNewSearch,
      onRetry,
      className,
      ...props
    },
    ref
  ) => {
    const isComplete = answerState === "complete";
    const isError = answerState === "error";
    const isLoading = answerState === "loading";

    return (
      <>
        {/* Inject gradient border styles */}
        <style>{`
          .gradient-border-answer {
            position: relative;
            isolation: isolate;
          }
          .gradient-border-answer::before {
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
          .gradient-border-answer::after {
            content: "";
            position: absolute;
            z-index: 1;
            inset: 2px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 22px;
          }
        `}</style>

        <div
          ref={ref}
          className={cn(
            answerDisplayVariants({ state: answerState }),
            "gradient-border-answer",
            className
          )}
          role="region"
          aria-label="Answer display"
          aria-live="polite"
          aria-busy={answerState === "loading" || answerState === "streaming"}
          {...props}
        >
          <div className="relative z-10">
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#FB9649] animate-pulse" />
                  <span className="text-sm font-medium text-gray-600">
                    Searching for your answer...
                  </span>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/6" />
              </div>
            )}

            {/* Streaming/Complete State */}
            {(answerState === "streaming" || isComplete) && text && (
              <div className="space-y-4">
                <StreamingText
                  text={text}
                  isComplete={isComplete}
                  className="text-gray-800"
                />
                {isComplete && onNewSearch && (
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={onNewSearch}
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-[#FB9649] to-[#A361E9] text-white border-0 hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      New Search
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-xl">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Unable to generate answer
                    </h3>
                    <p className="text-sm text-gray-600">
                      {error || "An unexpected error occurred. Please try again."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  {onRetry && (
                    <Button
                      onClick={onRetry}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Try Again
                    </Button>
                  )}
                  {onNewSearch && (
                    <Button
                      onClick={onNewSearch}
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-[#FB9649] to-[#A361E9] text-white border-0 hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      New Search
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

WomensWorldAnswerDisplay.displayName = "WomensWorldAnswerDisplay";

export { WomensWorldAnswerDisplay, answerDisplayVariants };
