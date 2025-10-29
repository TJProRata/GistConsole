/**
 * QueryDisplay Component
 * Bold, large-font query heading with brand font support
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import type { QueryDisplayProps } from "../types";

const QueryDisplay = React.forwardRef<HTMLHeadingElement, QueryDisplayProps>(
  ({ query, className }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100",
          "leading-tight mb-6",
          "font-[var(--font-heading,system-ui)]",
          className
        )}
        style={{
          fontFamily: "var(--font-heading, system-ui)",
        }}
      >
        {query}
      </h2>
    );
  }
);

QueryDisplay.displayName = "QueryDisplay";

export { QueryDisplay };
