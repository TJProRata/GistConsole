import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface EaterAttributionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  source: {
    name: string;
    logo?: string;
    percentage: number;
    color: string; // Dot color for percentage badge
  };
  article: {
    title: string;
    excerpt?: string;
    thumbnail?: string;
    url: string;
  };
}

export const EaterAttributionCard = React.forwardRef<
  HTMLDivElement,
  EaterAttributionCardProps
>(({ source, article, className, onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow",
        "w-[240px] h-[112px] flex-shrink-0",
        className
      )}
      style={{
        background: "rgba(245, 246, 248, 0.96)",
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      {...props}
    >
      {/* Header: Source Name + Percentage Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {source.logo && (
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src={source.logo}
                alt={source.name}
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
          )}
          <span
            className="text-xs font-bold text-gray-900"
            style={{ fontFamily: "Degular, sans-serif" }}
          >
            {source.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: source.color }}
          />
          <span
            className="text-xs font-bold text-gray-900"
            style={{ fontFamily: "Literata, serif" }}
          >
            {source.percentage}%
          </span>
        </div>
      </div>

      {/* Article Content with Optional Thumbnail */}
      <div className={cn("flex gap-2", article.thumbnail && "pr-20")}>
        <div className="flex-1 min-w-0">
          {/* Article Title */}
          <h3
            className="text-xs font-bold text-gray-900 line-clamp-2 mb-1"
            style={{ fontFamily: "Literata, serif", lineHeight: "1.3" }}
          >
            {article.title}
          </h3>

          {/* Article Excerpt */}
          {article.excerpt && (
            <p
              className="text-[10px] text-gray-600 line-clamp-2"
              style={{ fontFamily: "Literata, serif", lineHeight: "1.4" }}
            >
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Optional Thumbnail */}
        {article.thumbnail && (
          <div className="absolute right-3 top-3 w-[76px] h-[52px] rounded overflow-hidden flex-shrink-0">
            <Image
              src={article.thumbnail}
              alt={article.title}
              width={76}
              height={52}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
});

EaterAttributionCard.displayName = "EaterAttributionCard";
