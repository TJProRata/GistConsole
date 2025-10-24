"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export type DualPhaseProgressProps = HTMLAttributes<HTMLDivElement> & {
  /** Current phase index (0-based) */
  currentPhase: number;
  /** Total number of phases in phase 1 */
  phase1Total?: number;
  /** Total number of phases in phase 2 */
  phase2Total?: number;
};

/**
 * DualPhaseProgress - Split progress bar for multi-phase onboarding flows
 *
 * Shows two progress bars that fill sequentially:
 * - Phase 1 (steps 0-7): First bar fills from 0-100%
 * - Phase 2 (step 8+): First bar stays at 100%, second bar fills
 *
 * @example
 * ```tsx
 * <DualPhaseProgress
 *   currentPhase={5}
 *   phase1Total={8}
 *   phase2Total={1}
 * />
 * ```
 */
export const DualPhaseProgress = ({
  currentPhase,
  phase1Total = 8,
  phase2Total = 1,
  className,
  ...props
}: DualPhaseProgressProps) => {
  // Determine which phase we're in
  const isPhase2 = currentPhase >= phase1Total;

  // Calculate progress for each phase bar
  const phase1Progress = isPhase2
    ? 100
    : ((currentPhase + 1) / phase1Total) * 100;

  const phase2Progress = isPhase2
    ? (((currentPhase - phase1Total + 1) / phase2Total) * 100)
    : 0;

  return (
    <div
      className={cn("flex items-center gap-2 w-full", className)}
      {...props}
    >
      {/* Phase 1 Progress Bar */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-primary/20">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${phase1Progress}%`,
            background: 'linear-gradient(90deg, #6F61EF 0%, #E19736 100%)',
          }}
        />
      </div>

      {/* Phase 2 Progress Bar */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-primary/20">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${phase2Progress}%`,
            background: 'linear-gradient(90deg, #6F61EF 0%, #E19736 100%)',
          }}
        />
      </div>
    </div>
  );
};
