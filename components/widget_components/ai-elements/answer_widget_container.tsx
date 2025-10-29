"use client";

/**
 * AnswerWidgetContainer Component
 * Inline container for full-page answer displays with fixed 760px width
 * No collapsed state - always expanded with vertical expansion
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnswerWidgetContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface AnswerWidgetSubComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const AnswerWidgetContainer = React.forwardRef<
  HTMLDivElement,
  AnswerWidgetContainerProps
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-[760px] bg-white",
        "outline outline-1 outline-[#E60001] outline-offset-[-1px]",
        "px-8 py-4",
        "overflow-hidden",
        className
      )}
      style={{
        borderRadius: "4px 40px 4px 40px", // top-left, top-right, bottom-right, bottom-left
      }}
    >
      {children}
    </div>
  );
});

AnswerWidgetContainer.displayName = "AnswerWidgetContainer";

export function AnswerWidgetHeader({
  children,
  className,
}: AnswerWidgetSubComponentProps) {
  return (
    <div className={cn("shrink-0", className)}>
      {children}
    </div>
  );
}

export function AnswerWidgetContent({
  children,
  className,
}: AnswerWidgetSubComponentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

export function AnswerWidgetFooter({
  children,
  className,
}: AnswerWidgetSubComponentProps) {
  return (
    <div className={cn("shrink-0 mt-auto", className)}>
      {children}
    </div>
  );
}
