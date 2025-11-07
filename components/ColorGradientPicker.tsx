"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ColorGradientPickerProps {
  value?: {
    useGradient: boolean;
    primaryColor: string;
    gradientStart: string;
    gradientEnd: string;
    colorMode: "border" | "fill";
  };
  onChange?: (value: {
    useGradient: boolean;
    primaryColor: string;
    gradientStart: string;
    gradientEnd: string;
    colorMode: "border" | "fill";
  }) => void;
  className?: string;
}

export function ColorGradientPicker({
  value = {
    useGradient: false,
    primaryColor: "#3b82f6",
    gradientStart: "#3b82f6",
    gradientEnd: "#8b5cf6",
    colorMode: "border" as "border" | "fill",
  },
  onChange,
  className,
}: ColorGradientPickerProps) {
  const handleToggleGradient = () => {
    onChange?.({
      ...value,
      useGradient: !value.useGradient,
    });
  };

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      ...value,
      primaryColor: e.target.value,
    });
  };

  const handleGradientStartChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange?.({
      ...value,
      gradientStart: e.target.value,
    });
  };

  const handleGradientEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      ...value,
      gradientEnd: e.target.value,
    });
  };

  const previewStyle = value.useGradient
    ? {
        background: `linear-gradient(135deg, ${value.gradientStart}, ${value.gradientEnd})`,
      }
    : {
        backgroundColor: value.primaryColor,
      };

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between">
          <Label>Color Mode</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleGradient}
          >
            {value.useGradient ? "Gradient" : "Solid"}
          </Button>
        </div>

        {/* Preview */}
        <div>
          <Label>Preview</Label>
          <div
            className="mt-2 h-24 rounded-md border"
            style={previewStyle}
          />
        </div>

        {/* Color Inputs */}
        {value.useGradient ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor="gradient-start">Gradient Start</Label>
              <div className="mt-1 flex gap-2">
                <input
                  id="gradient-start"
                  type="color"
                  value={value.gradientStart}
                  onChange={handleGradientStartChange}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={value.gradientStart}
                  onChange={handleGradientStartChange}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gradient-end">Gradient End</Label>
              <div className="mt-1 flex gap-2">
                <input
                  id="gradient-end"
                  type="color"
                  value={value.gradientEnd}
                  onChange={handleGradientEndChange}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={value.gradientEnd}
                  onChange={handleGradientEndChange}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="mt-1 flex gap-2">
              <input
                id="primary-color"
                type="color"
                value={value.primaryColor}
                onChange={handlePrimaryColorChange}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={value.primaryColor}
                onChange={handlePrimaryColorChange}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
