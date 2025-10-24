"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo, type HTMLAttributes } from "react";

export type ReadinessScoreGaugeProps = HTMLAttributes<HTMLDivElement> & {
  score: number; // 0-100
  size?: number; // default 240
  animate?: boolean; // default true
};

// Color mapping based on score ranges (defined outside component)
const getScoreColor = (score: number): string => {
  if (score < 33) return "#EF4444"; // red-500 (Low)
  if (score < 66) return "#FFBF66"; // orange-400 (Medium)
  return "#2EFFAA"; // green-400 (High)
};

// SVG path calculation for arc (semi-circle from left to right)
const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    1,
    end.x,
    end.y,
  ].join(" ");
};

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } => {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
};

export const ReadinessScoreGauge = ({
  score: targetScore,
  size = 240,
  animate = true,
  className,
  ...props
}: ReadinessScoreGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(animate ? 0 : targetScore);

  // Clamp score to 0-100 range
  const clampedScore = Math.max(0, Math.min(100, targetScore));

  // Animation effect
  useEffect(() => {
    if (!animate) {
      setAnimatedScore(clampedScore);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startScore = 0;

    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentScore = startScore + (clampedScore - startScore) * easeProgress;
      setAnimatedScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };

    requestAnimationFrame(animateScore);
  }, [clampedScore, animate]);

  // Derive color from animated score
  const color = useMemo(() => getScoreColor(animatedScore), [animatedScore]);

  // Derive status label from score
  const status = useMemo(() => {
    if (animatedScore < 33) return "Low";
    if (animatedScore < 66) return "Medium";
    return "High";
  }, [animatedScore]);

  // SVG dimensions (scaled by size prop)
  const viewBoxWidth = 240;
  const viewBoxHeight = 120;
  const centerX = viewBoxWidth / 2;
  const centerY = 110;
  const radius = 100;
  const strokeWidth = 12.86;

  // Calculate arc angles for semi-circle (180° at left, 0° at right)
  // In standard coordinates: 180° = left, 270° = bottom, 0° = right
  const startAngle = 180;
  const endAngle = 180 + (animatedScore / 100) * 180; // 180° to 360°

  // Background arc (full semi-circle from left to right)
  const backgroundPath = describeArc(centerX, centerY, radius, 180, 360);

  // Foreground arc (partial, based on score)
  const foregroundPath = describeArc(centerX, centerY, radius, startAngle, endAngle);

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-2", className)}
      {...props}
    >
      {/* Gauge Container */}
      <svg
        width={size}
        height={(size * viewBoxHeight) / viewBoxWidth}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background arc (light gray) */}
        <path
          d={backgroundPath}
          stroke="rgba(21, 16, 34, 0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Foreground arc (colored) */}
        <path
          d={foregroundPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            transition: animate ? "stroke 0.3s ease" : "none",
          }}
        />

        {/* Score text */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="font-light"
          fill="#000000"
          style={{ fontSize: "44px", lineHeight: "27.5px" }}
        >
          {Math.round(animatedScore)}%
        </text>
      </svg>

      {/* Footer Labels */}
      <div className="flex justify-between items-center w-full px-2">
        <span className="text-xs font-medium text-muted-foreground">Low</span>
        <span
          className="text-xs font-medium"
          style={{
            color,
            transition: animate ? "color 0.3s ease" : "none",
          }}
        >
          {status}
        </span>
        <span className="text-xs font-medium text-muted-foreground">High</span>
      </div>
    </div>
  );
};
