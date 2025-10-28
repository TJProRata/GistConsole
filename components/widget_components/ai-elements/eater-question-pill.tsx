"use client";

import { cn } from "@/lib/utils";
import type { EaterQuestionPillProps } from "../types";

/**
 * Squiggle Underline SVG Component
 * Red wavy underline decoration for seed question pills
 */
function SquiggleUnderline({ className }: { className?: string }) {
  return (
    <svg
      width="115"
      height="6"
      viewBox="0 0 115 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute left-1/2 -translate-x-1/2", className)}
      aria-hidden="true"
    >
      <path
        d="M0.403931 5.37228C2.40391 2.62971 4.4039 -0.11267 6.40388 0.622152C8.40386 1.35697 10.4038 5.56919 12.404 5.37228C14.404 5.17538 16.404 0.569536 18.404 0.622152C20.404 0.674966 22.4039 5.38644 24.4039 5.37228C26.4039 5.35813 28.4039 0.618365 30.4039 0.622152C32.4039 0.625939 34.4038 5.37328 36.404 5.37228C38.404 5.37129 40.404 0.621953 42.404 0.622152C44.4039 0.62255 46.4039 5.37228 48.4039 5.37228C50.4039 5.37209 52.4039 0.622152 54.4039 0.622152C56.4038 0.622152 58.404 5.37228 60.404 5.37228C62.404 5.37228 64.404 0.622351 66.404 0.622152C68.4039 0.622152 70.4039 5.37189 72.4039 5.37228C74.4039 5.37248 76.4039 0.623148 78.4039 0.622152C80.404 0.621155 82.404 5.3685 84.404 5.37228C86.404 5.37607 88.404 0.636302 90.4039 0.622152C92.4039 0.608001 94.4039 5.31947 96.4039 5.37228C98.4039 5.4249 100.404 0.819061 102.404 0.622152C104.404 0.425243 106.404 4.63746 108.404 5.37228C110.404 6.10711 112.404 3.36473 114.404 0.622152"
        stroke="#E60001"
      />
    </svg>
  );
}

/**
 * Question Pill Component
 * Individual seed question button with red squiggle underline
 */
export function EaterQuestionPill({
  question,
  onClick,
  isSelected = false,
  className,
}: EaterQuestionPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center",
        "px-4 py-1 pb-3", // Extra padding bottom for squiggle
        "text-xs font-semibold uppercase tracking-wide",
        "text-[#414141] hover:text-[#E60001]",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60001] focus-visible:ring-offset-2",
        "rounded-full", // Pill shape
        isSelected && "text-[#E60001]",
        className
      )}
      type="button"
    >
      <span className="relative z-10" style={{ fontFamily: "Degular, sans-serif" }}>
        {question}
      </span>
      <SquiggleUnderline className="bottom-0" />
    </button>
  );
}
