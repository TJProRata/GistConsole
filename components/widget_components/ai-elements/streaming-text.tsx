"use client";

import { cn } from "@/lib/utils";
import type { StreamingTextProps } from "@/components/widget_components/types";

export function StreamingText({ text, isComplete, className }: StreamingTextProps) {
  return (
    <div className={cn("prose prose-gray max-w-none", className)}>
      <p className="text-base leading-relaxed text-gray-900">
        {text}
        {!isComplete && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
