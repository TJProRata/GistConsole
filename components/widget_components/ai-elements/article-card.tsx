/**
 * ArticleCard Component
 * Recommended article card with thumbnail, badges, and clamped text
 */

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ArticleCardProps } from "../types";

const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  (
    {
      title,
      description,
      thumbnail,
      sourceName,
      sourceLogo,
      relevanceScore,
      onClick,
      className,
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden cursor-pointer transition-all hover:shadow-lg",
          "border border-gray-200 dark:border-gray-700",
          "hover:border-gray-300 dark:hover:border-gray-600",
          className
        )}
        onClick={onClick}
      >
        {/* Article Thumbnail */}
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <CardContent className="p-4">
          {/* Source Badge and Relevance Score */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {sourceLogo && (
                <div className="relative w-4 h-4 rounded-full overflow-hidden">
                  <Image src={sourceLogo} alt={sourceName} fill className="object-cover" />
                </div>
              )}
              <Badge variant="secondary" className="text-xs font-medium">
                {sourceName}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs text-gray-600 dark:text-gray-400">
              {relevanceScore}% match
            </Badge>
          </div>

          {/* Article Title - 2 line clamp */}
          <h3
            className={cn(
              "text-base font-semibold text-gray-900 dark:text-gray-100",
              "leading-snug mb-2",
              "line-clamp-2"
            )}
          >
            {title}
          </h3>

          {/* Article Description - 3 line clamp */}
          <p
            className={cn(
              "text-sm text-gray-600 dark:text-gray-400",
              "leading-relaxed",
              "line-clamp-3"
            )}
          >
            {description}
          </p>
        </CardContent>
      </Card>
    );
  }
);

ArticleCard.displayName = "ArticleCard";

export { ArticleCard };
