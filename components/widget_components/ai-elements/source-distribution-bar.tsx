import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Source {
  name: string;
  percentage: number;
  color: string;
}

interface SourceDistributionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sources: Source[];
}

export const SourceDistributionBar = React.forwardRef<
  HTMLDivElement,
  SourceDistributionBarProps
>(({ sources, className, ...props }, ref) => {
  const sortedSources = [...sources].sort((a, b) => b.percentage - a.percentage);

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {/* Top Bar: Proportional Color Sections */}
      <div className="flex h-1.5 rounded-full overflow-hidden">
        {sortedSources.map((source, index) => (
          <div
            key={source.name}
            className={cn(
              index === 0 && "rounded-l-full",
              index === sortedSources.length - 1 && "rounded-r-full"
            )}
            style={{
              backgroundColor: source.color,
              flexBasis: `${source.percentage}%`,
            }}
          />
        ))}
      </div>

      {/* Bottom Labels: Glassmorphism Pill */}
      <div
        className="flex items-center justify-center gap-4 px-4 py-2 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {sortedSources.map((source) => (
          <div key={source.name} className="flex items-center gap-2">
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "Literata, serif" }}
            >
              {source.percentage}%
            </span>
            <span
              className="text-sm text-gray-700"
              style={{ fontFamily: "Literata, serif" }}
            >
              {source.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

SourceDistributionBar.displayName = "SourceDistributionBar";
