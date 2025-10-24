"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export type GifHousingProps = HTMLAttributes<HTMLDivElement> & {
  /** Source URL for the GIF */
  gifSrc: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Width of the container (default: auto) */
  width?: number | string;
  /** Height of the container (default: auto) */
  height?: number | string;
  /** Aspect ratio (e.g., "16/9", "1/1") - overrides height if provided */
  aspectRatio?: string;
};

/**
 * GifHousing - Glassmorphism-styled container for displaying GIF previews
 *
 * Matches the existing glass widget aesthetic with blur effects and rounded corners.
 * Designed for use in onboarding flows to preview widget behavior.
 *
 * @example
 * ```tsx
 * <GifHousing
 *   gifSrc="/assets/widget-demo.gif"
 *   alt="Widget preview"
 *   aspectRatio="16/9"
 * />
 * ```
 */
export const GifHousing = ({
  gifSrc,
  alt = "GIF preview",
  width = "100%",
  height = "auto",
  aspectRatio,
  className,
  ...props
}: GifHousingProps) => {
  return (
    <div
      className={cn(
        // Glass morphism styling
        "relative overflow-hidden rounded-3xl border border-white/30",
        "bg-white/10 backdrop-blur-md",
        "shadow-lg",
        className
      )}
      style={{
        width,
        height: aspectRatio ? undefined : height,
        aspectRatio: aspectRatio || undefined,
      }}
      {...props}
    >
      {/* GIF Image */}
      <img
        src={gifSrc}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%)",
        }}
      />
    </div>
  );
};
