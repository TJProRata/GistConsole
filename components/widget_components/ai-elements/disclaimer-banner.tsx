/**
 * DisclaimerBanner Component
 * GPT disclaimer with specific styling
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { DisclaimerBannerProps } from "../types";

const disclaimerVariants = cva(
  "w-full text-center transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
        subtle: "bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400",
      },
      size: {
        sm: "text-xs px-3 py-2",
        md: "text-sm px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface DisclaimerBannerComponentProps
  extends DisclaimerBannerProps,
    VariantProps<typeof disclaimerVariants> {}

const DisclaimerBanner = React.forwardRef<
  HTMLDivElement,
  DisclaimerBannerComponentProps
>(({ text, className, variant, size }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(disclaimerVariants({ variant, size }), className)}
      role="note"
      aria-label="Disclaimer"
    >
      <p className="leading-relaxed">{text}</p>
    </div>
  );
});

DisclaimerBanner.displayName = "DisclaimerBanner";

export { DisclaimerBanner, disclaimerVariants };
