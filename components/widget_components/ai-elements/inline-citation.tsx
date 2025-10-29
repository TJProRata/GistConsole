/**
 * InlineCitation Component
 * Superscript citation reference with click handler
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { InlineCitationProps } from "../types";

const citationVariants = cva(
  "inline-flex items-center justify-center cursor-pointer transition-colors hover:bg-blue-200 dark:hover:bg-blue-800",
  {
    variants: {
      variant: {
        default: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900",
        subtle: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800",
      },
      size: {
        sm: "text-[0.65rem] px-1 py-0.5 rounded",
        md: "text-[0.7rem] px-1.5 py-0.5 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface InlineCitationComponentProps
  extends InlineCitationProps,
    VariantProps<typeof citationVariants> {}

const InlineCitation = React.forwardRef<HTMLButtonElement, InlineCitationComponentProps>(
  ({ citationNumber, onClick, className, variant, size }, ref) => {
    return (
      <sup className="inline-block align-super mx-0.5">
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          className={cn(citationVariants({ variant, size }), className)}
          aria-label={`Citation ${citationNumber}`}
        >
          [{citationNumber}]
        </button>
      </sup>
    );
  }
);

InlineCitation.displayName = "InlineCitation";

export { InlineCitation, citationVariants };
