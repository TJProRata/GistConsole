"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { EaterSearchInputProps } from "../types";

/**
 * Search Input Section Component
 * Input field with icon prefix and circular submit button
 */
export function EaterSearchInputSection({
  placeholder,
  value,
  onChange,
  onSubmit,
  canSubmit,
}: EaterSearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      <div className="relative flex items-center">
        {/* Icon prefix */}
        <div className="absolute left-4 flex items-center pointer-events-none">
          <Sparkles className="w-4 h-4 text-[#E60001]" aria-hidden="true" />
        </div>

        {/* Input field with ultra-high border radius */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-[53px]",
            "pl-12 pr-14", // Space for icon prefix and submit button
            "text-sm",
            "bg-white",
            "border-2 border-[#E60001]",
            "rounded-[132px]", // Ultra-high border radius (pill shape)
            "placeholder:text-black/60",
            "focus-visible:ring-2 focus-visible:ring-[#E60001] focus-visible:ring-offset-2",
            "transition-all duration-200"
          )}
          style={{ fontFamily: "Literata, serif" }}
          aria-label="Search input"
        />

        {/* Circular submit button */}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            "absolute right-2",
            "w-8 h-8 p-0",
            "rounded-full",
            "bg-black/50 hover:bg-black/70",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "flex items-center justify-center"
          )}
          aria-label="Submit question"
        >
          <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
