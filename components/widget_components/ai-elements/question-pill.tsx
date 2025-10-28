import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuestionPillProps } from "@/components/widget_components/types";

/**
 * QuestionPill Component
 * Reusable button component for displaying question suggestions
 */
export function QuestionPill({
  question,
  onClick,
  isSelected,
  className,
}: QuestionPillProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "rounded-[40px] bg-white shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap px-6 py-2 h-auto text-sm font-medium border-gray-200",
        isSelected &&
          "bg-gradient-to-r from-[#FB9649] to-[#A361E9] text-white border-transparent",
        className
      )}
    >
      {question}
    </Button>
  );
}
