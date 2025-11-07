"use client";

import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorInput({ label, value, onChange }: ColorInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Validate and normalize hex color
  const normalizeColor = (color: string): string => {
    if (!color) return "#000000";

    // Remove any whitespace
    color = color.trim();

    // Add # if missing
    if (!color.startsWith("#")) {
      color = "#" + color;
    }

    // Validate hex format (#RGB or #RRGGBB)
    const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    if (!hexPattern.test(color)) {
      return value; // Return previous valid value
    }

    // Expand 3-digit hex to 6-digit
    if (color.length === 4) {
      color = "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }

    return color.toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = normalizeColor(e.target.value);
    onChange(newColor);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newColor = normalizeColor(e.target.value);
    onChange(newColor);
  };

  const handlePickerChange = (color: string) => {
    onChange(color.toUpperCase());
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        {/* Color preview swatch with popover picker */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "h-10 w-10 rounded border border-gray-300 flex-shrink-0 cursor-pointer",
                "hover:border-gray-400 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              )}
              style={{ backgroundColor: value }}
              title={`Click to pick color (${value})`}
              aria-label={`Pick color for ${label}`}
            />
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-3"
            align="start"
            side="bottom"
          >
            <div className="space-y-3">
              {/* Figma-style color picker */}
              <HexColorPicker
                color={value}
                onChange={handlePickerChange}
                style={{ width: "200px", height: "200px" }}
              />

              {/* Hex input field inside picker */}
              <div className="flex items-center space-x-2">
                <Label className="text-xs text-muted-foreground w-8">Hex</Label>
                <HexColorInput
                  color={value}
                  onChange={handlePickerChange}
                  prefixed
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1",
                    "text-sm font-mono transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Hex color input (external) */}
        <Input
          id={label}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="#000000"
          className="font-mono text-sm flex-1"
          maxLength={7}
        />
      </div>
    </div>
  );
}
