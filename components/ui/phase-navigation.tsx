"use client";

import { Button } from "@/components/ui/button";

export type PhaseNavigationVariant = "prev" | "next";

export interface PhaseNavigationProps {
  variant: PhaseNavigationVariant;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function PhaseNavigation({
  variant,
  label,
  onClick,
  disabled = false,
}: PhaseNavigationProps) {
  const displayText = variant === "next" ? `Next: ${label}` : label;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className="p-0 h-auto hover:bg-transparent"
      style={{
        color: "var(--content-default, #151022)",
        fontSize: "12px",
        fontFamily: "Work Sans",
        fontWeight: 500,
        lineHeight: "16.80px",
        letterSpacing: "0.24px",
      }}
    >
      {displayText}
    </Button>
  );
}
