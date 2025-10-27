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
  placement?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
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
  seedQuestions?: string[];
  autoScrollInterval?: number;
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

  // Women's World Widget (bottom-right position)
  if (widgetType === "womensWorld") {
    const positionClasses = isDemo
      ? "fixed bottom-4 right-4 z-50"
      : "absolute bottom-4 right-4";

    // Inject CSS variable override for gradient colors
    const gradientOverride =
      configuration.useGradient &&
      configuration.gradientStart &&
      configuration.gradientEnd
        ? `--gradient-womens-world: linear-gradient(180deg, ${configuration.gradientStart}, ${configuration.gradientEnd});`
        : "";

    return (
      <>
        {gradientOverride && (
          <style>{`
            :root {
              ${gradientOverride}
            }
          `}</style>
        )}
        <div className={cn(positionClasses, className)}>
          <WomensWorldWidget
            collapsedText={configuration.collapsedText || "Ask AI"}
            title={configuration.title || "✨ Woman's World Answers"}
            placeholder={
              configuration.placeholder || "Ask us your health questions"
            }
            seedQuestions={configuration.seedQuestions}
            autoScrollInterval={configuration.autoScrollInterval || 3000}
            brandingText={configuration.brandingText || "Powered by Gist.ai"}
            width={configuration.width || 392}
            height={configuration.height}
            onSubmit={(question) =>
              console.log("Preview: Question submitted:", question)
            }
          />
        </div>
      </>
    );
  }

  return null;
}
