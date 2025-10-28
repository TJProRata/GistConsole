import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NewSearchButtonProps } from "@/components/widget_components/types";

export function NewSearchButton({ onClick, className }: NewSearchButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "w-full sm:w-auto",
        "bg-gradient-to-r from-orange-500 to-purple-600",
        "text-white font-semibold",
        "hover:shadow-lg transition-shadow",
        "border-0",
        className
      )}
    >
      <svg
        className="w-5 h-5 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      New Search
    </Button>
  );
}
