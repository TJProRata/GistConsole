import { cn } from "@/lib/utils";
import type { AttributionCardsProps, AttributionSource } from "@/components/widget_components/types";

export function AttributionCards({
  sources,
  onCardClick,
  className,
}: AttributionCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
      {sources.map((source) => (
        <AttributionCard
          key={source.id}
          source={source}
          onClick={() => onCardClick?.(source)}
        />
      ))}
    </div>
  );
}

function AttributionCard({
  source,
  onClick,
}: {
  source: AttributionSource;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 p-4 rounded-lg border border-gray-200",
        "bg-white hover:bg-gray-50 transition-colors",
        "text-left"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
          {source.title}
        </h4>
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" x2="21" y1="14" y2="3" />
        </svg>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium">{source.domain}</span>
        {source.publishedDate && (
          <>
            <span>•</span>
            <span>{source.publishedDate}</span>
          </>
        )}
      </div>
    </button>
  );
}
