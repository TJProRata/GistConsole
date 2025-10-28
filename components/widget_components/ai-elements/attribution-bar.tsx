import { cn } from "@/lib/utils";
import type { AttributionBarProps } from "@/components/widget_components/types";

export function AttributionBar({
  sourceCount,
  sources,
  onViewSources,
  className,
}: AttributionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg",
        "bg-gray-50 border border-gray-200",
        className
      )}
    >
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        <span className="font-medium">{sourceCount} sources</span>
      </div>

      {onViewSources && (
        <button
          onClick={onViewSources}
          className="ml-auto text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </button>
      )}
    </div>
  );
}
