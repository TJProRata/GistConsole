"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  placement?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left";
  openByDefault?: boolean;
  iconUrl?: string;
}

interface PreviewWidgetRendererProps {
  widgetType: "floating" | "rufus" | "womensWorld";
  configuration: WidgetConfiguration;
  className?: string;
}

export function PreviewWidgetRenderer({
  widgetType,
  configuration,
  className,
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

  // Floating Widget (button + expandable panel)
  if (widgetType === "floating") {
    return (
      <div className={cn(getPlacementClasses(), className)}>
        {isOpen && (
          <Card
            className="mb-4 w-80 animate-in slide-in-from-bottom-2"
            style={{
              width: configuration.width ? `${configuration.width}px` : "320px",
              height: configuration.height
                ? `${configuration.height}px`
                : "400px",
            }}
          >
            <div
              className="flex items-center justify-between p-4"
              style={getBackgroundStyle()}
            >
              <h3
                className="font-semibold"
                style={{ color: configuration.textColor || "#ffffff" }}
              >
                Chat with us
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                style={{ color: configuration.textColor || "#ffffff" }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                This is a preview of your floating widget. In production, this
                would display the chat interface.
              </p>
            </div>
          </Card>
        )}

        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          style={getBackgroundStyle()}
          onClick={() => setIsOpen(!isOpen)}
        >
          {configuration.iconUrl ? (
            <img
              src={configuration.iconUrl}
              alt="Widget icon"
              className="h-6 w-6"
            />
          ) : (
            <MessageCircle
              className="h-6 w-6"
              style={{ color: configuration.textColor || "#ffffff" }}
            />
          )}
        </Button>
      </div>
    );
  }

  // Rufus Widget (centered modal)
  if (widgetType === "rufus") {
    return (
      <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50", className)}>
        <Card
          className="w-full max-w-2xl animate-in zoom-in-95"
          style={{
            width: configuration.width ? `${configuration.width}px` : "640px",
            height: configuration.height ? `${configuration.height}px` : "480px",
          }}
        >
          <div
            className="flex items-center justify-between p-6"
            style={getBackgroundStyle()}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: configuration.textColor || "#ffffff" }}
            >
              Rufus Assistant
            </h2>
            <Button
              variant="ghost"
              size="icon"
              style={{ color: configuration.textColor || "#ffffff" }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground">
              This is a preview of your Rufus widget. In production, this would
              display the centered modal chat interface.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Women's World Widget (sidebar)
  if (widgetType === "womensWorld") {
    return (
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full animate-in slide-in-from-right",
          className
        )}
        style={{
          width: configuration.width ? `${configuration.width}px` : "400px",
        }}
      >
        <Card className="h-full rounded-none">
          <div
            className="flex items-center justify-between p-6"
            style={getBackgroundStyle()}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: configuration.textColor || "#ffffff" }}
            >
              Women's World Assistant
            </h2>
            <Button
              variant="ghost"
              size="icon"
              style={{ color: configuration.textColor || "#ffffff" }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              This is a preview of your Women's World sidebar widget. In
              production, this would display the sidebar chat interface.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
