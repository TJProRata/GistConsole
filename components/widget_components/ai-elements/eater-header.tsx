"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EaterHeaderProps } from "../types";

/**
 * Header Component
 * Widget title and close button
 */
export function EaterHeader({ title, onClose }: EaterHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1
        className="text-[32px] font-bold text-black leading-[32px]"
        style={{ fontFamily: "Degular, sans-serif" }}
      >
        {title}
      </h1>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-black/5"
        aria-label="Close widget"
      >
        <X className="h-5 w-5 text-black" aria-hidden="true" />
      </Button>
    </div>
  );
}
