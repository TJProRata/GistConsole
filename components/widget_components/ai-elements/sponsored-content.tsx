import React from "react";
import { cn } from "@/lib/utils";

interface SponsoredContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  body: string;
  cta: {
    text: string;
    url: string;
  };
}

export const SponsoredContent = React.forwardRef<
  HTMLDivElement,
  SponsoredContentProps
>(({ title, body, cta, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-t border-b border-gray-300 py-1.5", className)}
      {...props}
    >
      {/* Sponsored Label */}
      <div className="text-center mb-2">
        <span
          className="text-xs text-gray-400"
          style={{ fontFamily: "Literata, serif" }}
        >
          Sponsored
        </span>
      </div>

      {/* Content */}
      <div
        className="text-center text-base"
        style={{ fontFamily: "Literata, serif", lineHeight: "1.6" }}
      >
        {/* Title with mixed formatting */}
        <div className="mb-2">
          {typeof title === "string" ? (
            <span className="text-gray-900">{title}</span>
          ) : (
            title
          )}
        </div>

        {/* Body Text */}
        <p className="text-gray-700 mb-2">{body}</p>

        {/* CTA Link */}
        <a
          href={cta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D1412B] underline hover:text-[#b03020] transition-colors"
        >
          {cta.text}
        </a>
      </div>
    </div>
  );
});

SponsoredContent.displayName = "SponsoredContent";
