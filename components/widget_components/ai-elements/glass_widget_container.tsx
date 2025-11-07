"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProfileBlank } from "@/components/widget_components/icons/profile-blank";

// ============================================================================
// CSS Gradient Border Styles
// ============================================================================

const gradientBorderStyles = `
  /* Border Mode - gradient border with white fill */
  .gradient-border-collapsed {
    position: relative;
    isolation: isolate;
  }
  .gradient-border-collapsed::before {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 0;
    padding: 2px;
    background: var(--gradient-brand);
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
  }
  .gradient-border-collapsed::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 2px;
    background: white;
    border-radius: calc(var(--radius-pill) - 2px);
  }

  /* Fill Mode - gradient background fill */
  .gradient-fill-collapsed {
    position: relative;
    background: var(--gradient-brand);
  }
  .gradient-fill-collapsed::after {
    display: none;
  }
`;

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface GlassWidgetContainerProps {
  /** Custom content for collapsed button state. Defaults to "Ask AI" button */
  collapsedContent?: React.ReactNode;

  /** Text content for collapsed button (used for auto-width calculation) */
  collapsedText?: string;

  /** Content shown when widget is expanded */
  children: React.ReactNode;

  /** Controlled expanded state */
  isExpanded?: boolean;

  /** Default expanded state for uncontrolled mode */
  defaultExpanded?: boolean;

  /** Callback when expanded state changes */
  onExpandChange?: (expanded: boolean) => void;

  /** Width when collapsed (default: 140) */
  collapsedWidth?: number;

  /** Height when collapsed (default: 48) */
  collapsedHeight?: number;

  /** Width when expanded (default: 392) */
  expandedWidth?: number;

  /** Height when expanded - NOT USED, kept for backward compatibility (height is now dynamic) */
  expandedHeight?: number;

  /** Positioning strategy (default: 'absolute') */
  positioning?: 'absolute' | 'relative' | 'fixed';

  /** Additional CSS classes */
  className?: string;

  /** Disable animations */
  disableAnimation?: boolean;

  /** Custom background for expanded state (default: glassmorphism white) */
  customBackground?: string;

  /** Custom gradient for collapsed button border (default: var(--gradient-brand)) */
  customGradientBorder?: string;

  /** Color mode for gradient styling (default: "border") */
  colorMode?: "border" | "fill";

  /** New appearance system - Border configuration */
  borderType?: "solid" | "gradient" | "none";
  borderColor?: string;

  /** New appearance system - Background configuration */
  backgroundType?: "solid" | "gradient" | "none";
  backgroundColor?: string;
  backgroundGradient?: string;

  /** AI Stars icon color configuration */
  aiStarsType?: "solid" | "gradient" | "none";
  aiStarsSolidColor?: string;
  aiStarsGradientStart?: string;
  aiStarsGradientEnd?: string;

  /** URL for custom icon SVG (fetched from storage) */
  customIconUrl?: string;

  /** Path to example icon SVG (e.g., "/svg_examples/filename.svg") */
  customIconPath?: string;

  /** @deprecated Use customIconUrl instead. Kept for backward compatibility. */
  customIconSvg?: string;
}

interface GlassWidgetSubComponentProps {
  children: React.ReactNode;
  className?: string;
  disableOverflow?: boolean;
}

// ============================================================================
// Default Collapsed Button
// ============================================================================

function DefaultCollapsedButton({ isAnimating }: { isAnimating?: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isAnimating ? "question" : "ask"}
        className="font-sans font-normal text-sm text-transparent bg-clip-text whitespace-nowrap"
        style={{
          backgroundImage: 'linear-gradient(90deg, #6F61EF 0%, #E19736 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isAnimating ? "How do I get one?" : "Ask"}
      </motion.span>
    </AnimatePresence>
  );
}

// ============================================================================
// AI Stars Gradient Generator
// ============================================================================

/**
 * Generate SVG gradient definitions based on configuration
 * Handles both solid (single-color gradient) and gradient (two-color) modes
 */
function generateSparkleGradients(
  type: "solid" | "gradient" | "none" | undefined,
  solidColor?: string,
  gradientStart?: string,
  gradientEnd?: string
) {
  // Default colors (fallback to original hardcoded values)
  const defaultGradient1 = { start: "#6F61EF", end: "#36E1AE" };
  const defaultGradient2 = { start: "#E19736", end: "#6F61EF" };

  if (type === "solid") {
    // Solid color: use same color for both start and end
    const color = solidColor || "#6F61EF";
    return {
      gradient0: { start: color, end: color },
      gradient1: { start: color, end: color },
      gradient2: { start: color, end: color },
      gradient3: { start: color, end: color },
      gradient4: { start: color, end: color },
      gradient5: { start: color, end: color },
    };
  }

  if (type === "gradient") {
    // Two-color gradient: alternate between main gradient and reversed
    const start = gradientStart || defaultGradient1.start;
    const end = gradientEnd || defaultGradient2.start;

    return {
      gradient0: { start, end: "#36E1AE" }, // Original pattern
      gradient1: { start: end, end: start }, // Reversed
      gradient2: { start, end: "#36E1AE" },
      gradient3: { start: end, end: start },
      gradient4: { start, end: "#36E1AE" },
      gradient5: { start: end, end: start },
    };
  }

  // Default (none or undefined): use original hardcoded colors
  return {
    gradient0: defaultGradient1,
    gradient1: defaultGradient2,
    gradient2: defaultGradient1,
    gradient3: defaultGradient2,
    gradient4: defaultGradient1,
    gradient5: defaultGradient2,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function GlassWidgetContainer({
  collapsedContent,
  collapsedText,
  children,
  isExpanded: controlledIsExpanded,
  defaultExpanded = false,
  onExpandChange,
  collapsedWidth,
  collapsedHeight = 48,
  expandedWidth = 392,
  expandedHeight, // Not used - kept for backward compatibility
  positioning = 'absolute',
  className,
  disableAnimation: _disableAnimation = false,
  customBackground,
  customGradientBorder,
  colorMode = "border",
  borderType,
  borderColor,
  backgroundType,
  backgroundColor,
  backgroundGradient,
  aiStarsType,
  aiStarsSolidColor,
  aiStarsGradientStart,
  aiStarsGradientEnd,
  customIconUrl,
  customIconPath,
  customIconSvg
}: GlassWidgetContainerProps) {
  // Controlled/Uncontrolled state pattern
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [allowDynamicHeight, setAllowDynamicHeight] = useState(false);
  const isExpanded = controlledIsExpanded ?? internalExpanded;

  const handleToggle = () => {
    if (!isExpanded) {
      // Expand
      if (controlledIsExpanded === undefined) {
        setInternalExpanded(true);
      }
      onExpandChange?.(true);
    } else {
      // Collapse
      if (controlledIsExpanded === undefined) {
        setInternalExpanded(false);
      }
      onExpandChange?.(false);
    }
  };

  const getContainerWidth = () => {
    if (isExpanded) return expandedWidth;

    // Auto-calculate width based on text length if not specified
    if (collapsedWidth === undefined && collapsedText) {
      // Formula: icon padding (84px) + text width (~8px per char) + buffer (16px)
      const textWidth = collapsedText.length * 8;
      const totalWidth = 84 + textWidth + 16;
      // Constrain between min (128px) and max (240px)
      return Math.max(128, Math.min(totalWidth, 240));
    }

    return collapsedWidth ?? 128; // Fallback to default
  };

  const getContainerHeight = () => {
    if (!isExpanded) return collapsedHeight;
    // After initial animation, return undefined to allow CSS min/max-height
    if (allowDynamicHeight) {
      console.log("🎯 Dynamic height enabled, returning undefined");
      return undefined;
    }
    const height = expandedHeight || 300;
    console.log("📐 Container height:", { expandedHeight, height, allowDynamicHeight });
    return height;
  };

  // Compute effective appearance settings (new system takes precedence)
  const hasNewAppearance = borderType || backgroundType;

  const effectiveBorderType = hasNewAppearance ? (borderType || "solid") : (customGradientBorder ? "gradient" : "solid");
  const effectiveBorderValue = borderType === "gradient" ? customGradientBorder : borderColor;
  const effectiveBackgroundType = hasNewAppearance ? (backgroundType || "none") : "none";
  const effectiveBackgroundValue = backgroundType === "gradient" ? backgroundGradient : backgroundColor;

  // Generate AI stars gradients based on configuration
  const sparkleGradients = generateSparkleGradients(
    aiStarsType,
    aiStarsSolidColor,
    aiStarsGradientStart,
    aiStarsGradientEnd
  );

  // Generate custom styles based on new appearance system
  const customAppearanceStyles = (effectiveBorderType === "solid" || effectiveBackgroundType === "solid" || effectiveBorderType === "gradient") ? `
    /* New appearance system - solid border with custom background */
    .appearance-collapsed-custom {
      position: relative;
      isolation: isolate;
      ${effectiveBorderType === "solid" && effectiveBorderValue ? `border: 2px solid ${effectiveBorderValue};` : ''}
      ${effectiveBorderType === "gradient" && effectiveBorderValue ? `
        background: ${effectiveBorderValue};
        -webkit-background-clip: border-box;
        background-clip: border-box;
      ` : ''}
      ${effectiveBackgroundType === "solid" && effectiveBackgroundValue ? `background-color: ${effectiveBackgroundValue} !important;` : ''}
      ${effectiveBackgroundType === "gradient" && effectiveBackgroundValue ? `background: ${effectiveBackgroundValue} !important;` : ''}
      ${effectiveBackgroundType === "none" && effectiveBorderType !== "gradient" ? `background-color: white !important;` : ''}
    }

    /* Gradient border mode - gradient border with custom or white fill */
    .appearance-gradient-border-custom {
      position: relative;
      isolation: isolate;
    }
    .appearance-gradient-border-custom::before {
      content: "";
      position: absolute;
      z-index: 0;
      inset: 0;
      padding: 2px;
      background: ${effectiveBorderValue || 'var(--gradient-brand)'};
      border-radius: inherit;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
    }
    .appearance-gradient-border-custom::after {
      content: "";
      position: absolute;
      z-index: 1;
      inset: 2px;
      background: ${effectiveBackgroundType === "solid" && effectiveBackgroundValue ? effectiveBackgroundValue : (effectiveBackgroundType === "gradient" && effectiveBackgroundValue ? effectiveBackgroundValue : 'white')};
      border-radius: calc(var(--radius-pill) - 2px);
    }
  ` : '';

  // Fallback to legacy system if new appearance not used
  const legacyGradientStyles = !hasNewAppearance && customGradientBorder ? `
    /* Legacy: Border Mode - custom gradient border with white fill */
    .gradient-border-collapsed-custom {
      position: relative;
      isolation: isolate;
    }
    .gradient-border-collapsed-custom::before {
      content: "";
      position: absolute;
      z-index: 0;
      inset: 0;
      padding: 2px;
      background: ${customGradientBorder};
      border-radius: inherit;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
    }
    .gradient-border-collapsed-custom::after {
      content: "";
      position: absolute;
      z-index: 1;
      inset: 2px;
      background: white;
      border-radius: calc(var(--radius-pill) - 2px);
    }

    /* Legacy: Fill Mode - custom gradient background fill */
    .gradient-fill-collapsed-custom {
      position: relative;
      background: ${customGradientBorder};
    }
    .gradient-fill-collapsed-custom::after {
      display: none;
    }
  ` : '';

  // Determine which CSS class to apply
  const gradientClass = hasNewAppearance
    ? (effectiveBorderType === "gradient"
        ? 'appearance-gradient-border-custom'
        : 'appearance-collapsed-custom')
    : (customGradientBorder
      ? (colorMode === "fill"
        ? 'gradient-fill-collapsed-custom'
        : 'gradient-border-collapsed-custom')
      : (colorMode === "fill"
        ? 'gradient-fill-collapsed'
        : 'gradient-border-collapsed'));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: gradientBorderStyles + customAppearanceStyles + legacyGradientStyles }} />
      <motion.div
        className={cn(
          positioning === 'absolute' ? "absolute" : positioning === 'fixed' ? "fixed" : "relative",
          !isExpanded && `cursor-pointer flex items-center justify-center gap-2 ${gradientClass}`,
          "font-sans",
          className
        )}
        onClick={!isExpanded ? handleToggle : undefined}
        layout
        initial={false}
        animate={{
          width: getContainerWidth(),
          height: allowDynamicHeight ? 'auto' : getContainerHeight(),
          borderRadius: isExpanded ? 24 : 40,
          ...(positioning !== 'relative' && {
            bottom: 24,
            left: '50%',
            x: '-50%'
          })
        }}
        style={{
          position: positioning === 'relative' ? 'relative' : positioning,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: isExpanded ? (customBackground || 'rgba(255, 255, 255, 0.95)') : 'transparent',
          backdropFilter: isExpanded && !customBackground ? 'blur(20px)' : undefined,
          border: isExpanded ? '1px solid rgba(255, 255, 255, 0.3)' : undefined,
          overflow: 'hidden',
          // Only constrain max, let content determine height
          maxHeight: allowDynamicHeight && isExpanded ? 810 : undefined,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.8
        }}
        onAnimationComplete={() => {
          // After initial expansion completes, enable dynamic height
          if (isExpanded && !allowDynamicHeight) {
            setAllowDynamicHeight(true);
          }
        }}
        onAnimationStart={() => {
          // Reset to fixed height when collapsing
          if (!isExpanded && allowDynamicHeight) {
            setAllowDynamicHeight(false);
          }
        }}
        suppressHydrationWarning
      >
      {/* Sparkle Icon - Locked to left 6px, visible only when collapsed */}
      {!isExpanded && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.69552 7.01627C9.76427 6.7668 10.1136 6.7668 10.1824 7.01626L11.1834 10.649C11.206 10.731 11.2674 10.7963 11.3472 10.8231L14.7048 11.9518C14.9356 12.0294 14.9356 12.3599 14.7048 12.4375L11.3472 13.5662C11.2674 13.593 11.206 13.6583 11.1834 13.7403L10.1824 17.373C10.1136 17.6225 9.76427 17.6225 9.69552 17.373L8.69444 13.7403C8.67185 13.6583 8.61046 13.593 8.53066 13.5662L5.17308 12.4375C4.94231 12.3599 4.94231 12.0294 5.17308 11.9518L8.53066 10.8231C8.61046 10.7963 8.67185 10.731 8.69444 10.649L9.69552 7.01627Z" fill="url(#paint0_linear_sparkle)"/>
            <path d="M9.69552 7.01627C9.76427 6.7668 10.1136 6.7668 10.1824 7.01626L11.1834 10.649C11.206 10.731 11.2674 10.7963 11.3472 10.8231L14.7048 11.9518C14.9356 12.0294 14.9356 12.3599 14.7048 12.4375L11.3472 13.5662C11.2674 13.593 11.206 13.6583 11.1834 13.7403L10.1824 17.373C10.1136 17.6225 9.76427 17.6225 9.69552 17.373L8.69444 13.7403C8.67185 13.6583 8.61046 13.593 8.53066 13.5662L5.17308 12.4375C4.94231 12.3599 4.94231 12.0294 5.17308 11.9518L8.53066 10.8231C8.61046 10.7963 8.67185 10.731 8.69444 10.649L9.69552 7.01627Z" fill="url(#paint1_linear_sparkle)"/>
            <path d="M16.6038 6.27924C16.6588 5.90692 17.189 5.90692 17.244 6.27925L17.4278 7.52323C17.4436 7.63025 17.5106 7.72247 17.6068 7.76967L18.8175 8.36374C19.0608 8.48316 19.0608 8.83416 18.8175 8.95358L17.6068 9.54765C17.5106 9.59485 17.4436 9.68707 17.4278 9.79409L17.244 11.0381C17.189 11.4104 16.6588 11.4104 16.6038 11.0381L16.42 9.79409C16.4042 9.68707 16.3372 9.59485 16.241 9.54765L15.0303 8.95358C14.7869 8.83416 14.7869 8.48316 15.0303 8.36374L16.241 7.76967C16.3372 7.72247 16.4042 7.63025 16.42 7.52323L16.6038 6.27924Z" fill="url(#paint2_linear_sparkle)"/>
            <path d="M16.6038 6.27924C16.6588 5.90692 17.189 5.90692 17.244 6.27925L17.4278 7.52323C17.4436 7.63025 17.5106 7.72247 17.6068 7.76967L18.8175 8.36374C19.0608 8.48316 19.0608 8.83416 18.8175 8.95358L17.6068 9.54765C17.5106 9.59485 17.4436 9.68707 17.4278 9.79409L17.244 11.0381C17.189 11.4104 16.6588 11.4104 16.6038 11.0381L16.42 9.79409C16.4042 9.68707 16.3372 9.59485 16.241 9.54765L15.0303 8.95358C14.7869 8.83416 14.7869 8.48316 15.0303 8.36374L16.241 7.76967C16.3372 7.72247 16.4042 7.63025 16.42 7.52323L16.6038 6.27924Z" fill="url(#paint3_linear_sparkle)"/>
            <path d="M15.7153 14.6663C15.7508 14.4203 16.1013 14.4203 16.1368 14.6663L16.3295 16.003C16.3416 16.0869 16.4011 16.1558 16.4817 16.1791L17.7052 16.5336C17.911 16.5932 17.911 16.8886 17.7052 16.9482L16.4817 17.3027C16.4011 17.326 16.3416 17.3949 16.3295 17.4788L16.1368 18.8155C16.1013 19.0615 15.7508 19.0615 15.7153 18.8155L15.5226 17.4788C15.5105 17.3949 15.4509 17.326 15.3704 17.3027L14.1469 16.9482C13.9411 16.8886 13.9411 16.5932 14.1469 16.5336L15.3704 16.1791C15.4509 16.1558 15.5105 16.0869 15.5226 16.003L15.7153 14.6663Z" fill="url(#paint4_linear_sparkle)"/>
            <path d="M15.7153 14.6663C15.7508 14.4203 16.1013 14.4203 16.1368 14.6663L16.3295 16.003C16.3416 16.0869 16.4011 16.1558 16.4817 16.1791L17.7052 16.5336C17.911 16.5932 17.911 16.8886 17.7052 16.9482L16.4817 17.3027C16.4011 17.326 16.3416 17.3949 16.3295 17.4788L16.1368 18.8155C16.1013 19.0615 15.7508 19.0615 15.7153 18.8155L15.5226 17.4788C15.5105 17.3949 15.4509 17.326 15.3704 17.3027L14.1469 16.9482C13.9411 16.8886 13.9411 16.5932 14.1469 16.5336L15.3704 16.1791C15.4509 16.1558 15.5105 16.0869 15.5226 16.003L15.7153 14.6663Z" fill="url(#paint5_linear_sparkle)"/>
            <defs>
              <linearGradient id="paint0_linear_sparkle" x1="5" y1="12.5" x2="19" y2="12.5" gradientUnits="userSpaceOnUse">
                <stop stopColor={sparkleGradients.gradient0.start}/>
                <stop offset="1" stopColor={sparkleGradients.gradient0.end}/>
              </linearGradient>
              <linearGradient id="paint1_linear_sparkle" x1="16.5792" y1="12.5" x2="5" y2="12.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.51447" stopColor={sparkleGradients.gradient1.start}/>
                <stop offset="1" stopColor={sparkleGradients.gradient1.end}/>
              </linearGradient>
              <linearGradient id="paint2_linear_sparkle" x1="5" y1="12.5" x2="19" y2="12.5" gradientUnits="userSpaceOnUse">
                <stop stopColor={sparkleGradients.gradient2.start}/>
                <stop offset="1" stopColor={sparkleGradients.gradient2.end}/>
              </linearGradient>
              <linearGradient id="paint3_linear_sparkle" x1="16.5792" y1="12.5" x2="5" y2="12.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.51447" stopColor={sparkleGradients.gradient3.start}/>
                <stop offset="1" stopColor={sparkleGradients.gradient3.end}/>
              </linearGradient>
              <linearGradient id="paint4_linear_sparkle" x1="5" y1="12.5" x2="19" y2="12.5" gradientUnits="userSpaceOnUse">
                <stop stopColor={sparkleGradients.gradient4.start}/>
                <stop offset="1" stopColor={sparkleGradients.gradient4.end}/>
              </linearGradient>
              <linearGradient id="paint5_linear_sparkle" x1="16.5792" y1="12.5" x2="5" y2="12.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.51447" stopColor={sparkleGradients.gradient5.start}/>
                <stop offset="1" stopColor={sparkleGradients.gradient5.end}/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Profile Icon - Locked to right 6px, visible only when collapsed */}
      {!isExpanded && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10">
          {customIconPath ? (
            <img
              src={customIconPath}
              alt="Custom icon"
              className="w-9 h-9"
            />
          ) : customIconUrl ? (
            <img
              src={customIconUrl}
              alt="Custom icon"
              className="w-9 h-9"
            />
          ) : customIconSvg ? (
            <div
              className="w-9 h-9"
              dangerouslySetInnerHTML={{ __html: customIconSvg }}
            />
          ) : (
            <ProfileBlank className="w-9 h-9" />
          )}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          /* Collapsed Button - Text only */
          <motion.div
            key="collapsed"
            className="flex items-center justify-center w-full pl-[34px] pr-[50px] relative z-[2]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {collapsedContent || <DefaultCollapsedButton isAnimating={false} />}
          </motion.div>
        ) : (
          /* Expanded Widget Content */
          <motion.div
            key="expanded"
            layout
            className="flex flex-col w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

export function GlassWidgetHeader({
  children,
  className
}: GlassWidgetSubComponentProps) {
  return (
    <motion.div layout className={cn("px-4 pt-4 shrink-0", className)}>
      {children}
    </motion.div>
  );
}

export function GlassWidgetContent({
  children,
  className,
  disableOverflow = false
}: GlassWidgetSubComponentProps) {
  return (
    <motion.div layout className={cn("px-4 py-2", !disableOverflow && "overflow-y-auto", className)}>
      {children}
    </motion.div>
  );
}

export function GlassWidgetFooter({
  children,
  className
}: GlassWidgetSubComponentProps) {
  return (
    <motion.div layout className={cn("px-4 pb-4 mt-auto shrink-0", className)}>
      {children}
    </motion.div>
  );
}

// ============================================================================
// Type Exports
// ============================================================================

export type { GlassWidgetContainerProps, GlassWidgetSubComponentProps };
