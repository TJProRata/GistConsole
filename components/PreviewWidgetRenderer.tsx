"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RufusWidget,
  NYTChatWidget,
  WomensWorldWidget,
  WomensWorldInlineWidget,
} from "@/components/widget_components";

interface WidgetConfiguration {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  useGradient?: boolean;
  gradientStart?: string;
  gradientEnd?: string;
  width?: number;
  height?: number;
  placement?: "bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left";
  openByDefault?: boolean;
  iconUrl?: string;
  // NYT Chat Widget Configuration
  collapsedText?: string;
  title?: string;
  placeholder?: string;
  followUpPlaceholder?: string;
  suggestionCategories?: string[];
  brandingText?: string;

  // Women's World Widget Configuration
  seedQuestions?: string[]; // Backward compatibility - old format
  seedQuestionsRow1?: string[]; // New format - Row 1
  seedQuestionsRow2?: string[]; // New format - Row 2
  autoScrollInterval?: number;
  womensWorldVariant?: "inline" | "floating";
  enableStreaming?: boolean;
}

interface PreviewWidgetRendererProps {
  widgetType: "floating" | "rufus" | "womensWorld";
  configuration: WidgetConfiguration;
  className?: string;
  /** Use fixed positioning for demo page, absolute for preview card */
  isDemo?: boolean;
}

export function PreviewWidgetRenderer({
  widgetType,
  configuration,
  className,
  isDemo = false,
}: PreviewWidgetRendererProps) {
  const [isOpen, setIsOpen] = React.useState(
    configuration.openByDefault ?? false
  );

  const getBackgroundStyle = () => {
    if (configuration.useGradient) {
      return {
        background: `linear-gradient(135deg, ${
          configuration.gradientStart || "#3b82f6"
        }, ${configuration.gradientEnd || "#8b5cf6"})`,
      };
    }
    return {
      backgroundColor: configuration.primaryColor || "#3b82f6",
    };
  };

  const getPlacementClasses = () => {
    const placement = configuration.placement || "bottom-right";
    const baseClasses = "fixed z-50";

    switch (placement) {
      case "bottom-right":
        return `${baseClasses} bottom-4 right-4`;
      case "bottom-left":
        return `${baseClasses} bottom-4 left-4`;
      case "top-right":
        return `${baseClasses} top-4 right-4`;
      case "top-left":
        return `${baseClasses} top-4 left-4`;
      default:
        return `${baseClasses} bottom-4 right-4`;
    }
  };

  // Floating Widget (NYT Chat Widget - bottom-center position)
  if (widgetType === "floating") {
    const positionClasses = isDemo
      ? "fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      : "absolute bottom-4 left-1/2 -translate-x-1/2";

    return (
      <div className={cn(positionClasses, className)}>
        <NYTChatWidget
          collapsedText={configuration.collapsedText || "Ask"}
          title={configuration.title || "Ask Anything!"}
          placeholder={configuration.placeholder || "Ask anything"}
          followUpPlaceholder={
            configuration.followUpPlaceholder || "Ask a follow up..."
          }
          suggestionCategories={
            configuration.suggestionCategories || [
              "Top Stories",
              "Breaking News",
              "Sports",
              "Technology",
            ]
          }
          brandingText={configuration.brandingText || "Powered by Gist Answers"}
          primaryColor={configuration.primaryColor}
          useGradient={configuration.useGradient}
          gradientStart={configuration.gradientStart}
          gradientEnd={configuration.gradientEnd}
          onSubmit={(query) =>
            console.log("Preview: Question submitted:", query)
          }
          onCategoryClick={(category) =>
            console.log("Preview: Category clicked:", category)
          }
          onCitationClick={(citation) =>
            console.log("Preview: Citation clicked:", citation)
          }
        />
      </div>
    );
  }

  // Rufus Widget (bottom-center, responsive to container)
  if (widgetType === "rufus") {
    const positionClasses = isDemo
      ? "fixed bottom-4 left-0 right-0 z-40"
      : "absolute bottom-4 left-0 right-0";

    return (
      <div
        className={cn(
          positionClasses,
          "flex items-end justify-center",
          className
        )}
      >
        <RufusWidget
          defaultExpanded={configuration.openByDefault ?? false}
          customColors={{
            primary: configuration.primaryColor,
            secondary: configuration.secondaryColor,
            background: configuration.backgroundColor,
            text: configuration.textColor,
          }}
          customGradient={{
            use: configuration.useGradient,
            start: configuration.gradientStart,
            end: configuration.gradientEnd,
          }}
          customDimensions={{
            width: configuration.width,
            height: configuration.height,
          }}
        />
      </div>
    );
  }

  // Women's World Widget (inline or floating based on variant)
  if (widgetType === "womensWorld") {
    const variant = configuration.womensWorldVariant ?? "floating";

    // Inject CSS variable override for gradient colors
    const gradientOverride =
      configuration.useGradient &&
      configuration.gradientStart &&
      configuration.gradientEnd
        ? `--gradient-womens-world: linear-gradient(180deg, ${configuration.gradientStart}, ${configuration.gradientEnd});`
        : "";

    // Inline Variant (embedded, always-expanded)
    if (variant === "inline") {
      // Handle both old format (seedQuestions array) and new format (seedQuestionsRow1/Row2)
      let row1: string[] | undefined;
      let row2: string[] | undefined;

      if (configuration.seedQuestionsRow1 && configuration.seedQuestionsRow2) {
        // New format - use directly
        row1 = configuration.seedQuestionsRow1;
        row2 = configuration.seedQuestionsRow2;
      } else if (configuration.seedQuestions) {
        // Old format - split for backward compatibility
        row1 = configuration.seedQuestions.slice(0, 3);
        row2 = configuration.seedQuestions.slice(3, 6);
      }

      return (
        <>
          {gradientOverride && (
            <style>{`
              :root {
                ${gradientOverride}
              }
            `}</style>
          )}
          <div className={cn("mx-auto", className)}>
            <WomensWorldInlineWidget
              title={configuration.title || "✨ Woman's World Answers"}
              placeholder={
                configuration.placeholder || "Ask us your health questions"
              }
              seedQuestionsRow1={row1}
              seedQuestionsRow2={row2}
              autoScrollInterval={configuration.autoScrollInterval || 35000}
              brandingText={configuration.brandingText || "Powered by Gist.ai"}
              maxWidth={configuration.width || 640}
              enableStreaming={configuration.enableStreaming}
              onSubmit={(question) =>
                console.log("Preview: Question submitted:", question)
              }
              onAnswerComplete={(answer) =>
                console.log("Preview: Answer complete:", answer)
              }
              onAnswerError={(error) =>
                console.error("Preview: Answer error:", error)
              }
            />
          </div>
        </>
      );
    }

    // Floating Variant (bottom-corner, collapsible)
    // Filter placement to only bottom positions (Women's World widget only supports bottom)
    const validPlacements: Array<"bottom-left" | "bottom-center" | "bottom-right"> = [
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];
    const womensWorldPlacement = validPlacements.includes(
      configuration.placement as any
    )
      ? (configuration.placement as "bottom-left" | "bottom-center" | "bottom-right")
      : "bottom-right";

    // Handle both old format (seedQuestions array) and new format (seedQuestionsRow1/Row2)
    // WomensWorldWidget expects a single array, so combine if using new format
    let seedQuestions: string[] | undefined;

    if (configuration.seedQuestionsRow1 && configuration.seedQuestionsRow2) {
      // New format - combine both rows into single array
      seedQuestions = [...configuration.seedQuestionsRow1, ...configuration.seedQuestionsRow2];
    } else if (configuration.seedQuestions) {
      // Old format - use directly
      seedQuestions = configuration.seedQuestions;
    }

    return (
      <>
        {gradientOverride && (
          <style>{`
            :root {
              ${gradientOverride}
            }
          `}</style>
        )}
        <WomensWorldWidget
          collapsedText={configuration.collapsedText || "Ask AI"}
          title={configuration.title || "✨ Woman's World Answers"}
          placeholder={
            configuration.placeholder || "Ask us your health questions"
          }
          seedQuestions={seedQuestions}
          autoScrollInterval={configuration.autoScrollInterval || 35000}
          brandingText={configuration.brandingText || "Powered by Gist.ai"}
          width={configuration.width || 392}
          height={configuration.height}
          placement={womensWorldPlacement}
          enableStreaming={configuration.enableStreaming}
          onSubmit={(question) =>
            console.log("Preview: Question submitted:", question)
          }
          onAnswerComplete={(answer) =>
            console.log("Preview: Answer complete:", answer)
          }
          onAnswerError={(error) =>
            console.error("Preview: Answer error:", error)
          }
        />
      </>
    );
  }

  return null;
}
