/**
 * RecommendedArticles Component
 * Grid container for article cards with responsive layout
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./article-card";
import type { RecommendedArticlesProps } from "../types";

const RecommendedArticles = React.forwardRef<HTMLDivElement, RecommendedArticlesProps>(
  ({ articles, onArticleClick, heading = "Related Articles", className }, ref) => {
    if (articles.length === 0) return null;

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {/* Section Heading */}
        {heading && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {heading}
          </h3>
        )}

        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div
          className={cn(
            "grid gap-4",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              description={article.description}
              thumbnail={article.thumbnail}
              sourceName={article.source.name}
              sourceLogo={article.source.logo}
              relevanceScore={article.relevanceScore}
              onClick={() => onArticleClick(article.id, article.url)}
            />
          ))}
        </div>
      </div>
    );
  }
);

RecommendedArticles.displayName = "RecommendedArticles";

export { RecommendedArticles };
