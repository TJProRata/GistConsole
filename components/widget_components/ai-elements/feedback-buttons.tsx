import { cn } from "@/lib/utils";
import { ThumbsUpIcon } from "@/components/widget_components/icons/thumbs-up";
import { ThumbsDownIcon } from "@/components/widget_components/icons/thumbs-down";
import type { FeedbackButtonsProps } from "@/components/widget_components/types";

export function FeedbackButtons({
  onThumbsUp,
  onThumbsDown,
  selected,
  className,
}: FeedbackButtonsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={onThumbsUp}
        className={cn(
          "p-2 rounded-full transition-colors",
          selected === "up"
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
        aria-label="Helpful answer"
      >
        <ThumbsUpIcon className="w-5 h-5" />
      </button>

      <button
        onClick={onThumbsDown}
        className={cn(
          "p-2 rounded-full transition-colors",
          selected === "down"
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
        aria-label="Not helpful"
      >
        <ThumbsDownIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
