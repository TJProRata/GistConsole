"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ColorInput from "./ColorInput";

export interface AppearanceSectionValue {
  type: "solid" | "gradient" | "none";
  solidColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
}

interface AppearanceSectionProps {
  title: string;
  value: AppearanceSectionValue;
  onChange: (value: AppearanceSectionValue) => void;
  showNoneOption?: boolean;
}

export default function AppearanceSection({
  title,
  value,
  onChange,
  showNoneOption = true,
}: AppearanceSectionProps) {
  const handleTypeChange = (newType: string) => {
    onChange({
      ...value,
      type: newType as "solid" | "gradient" | "none",
    });
  };

  const handleSolidColorChange = (color: string) => {
    onChange({
      ...value,
      solidColor: color,
    });
  };

  const handleGradientStartChange = (color: string) => {
    onChange({
      ...value,
      gradientStart: color,
    });
  };

  const handleGradientEndChange = (color: string) => {
    onChange({
      ...value,
      gradientEnd: color,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Style type selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Style</Label>
          <RadioGroup value={value.type} onValueChange={handleTypeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solid" id={`${title}-solid`} />
              <Label htmlFor={`${title}-solid`} className="font-normal cursor-pointer">
                Solid
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gradient" id={`${title}-gradient`} />
              <Label htmlFor={`${title}-gradient`} className="font-normal cursor-pointer">
                Gradient
              </Label>
            </div>
            {showNoneOption && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id={`${title}-none`} />
                <Label htmlFor={`${title}-none`} className="font-normal cursor-pointer">
                  None
                </Label>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Conditional color inputs based on type */}
        {value.type === "solid" && (
          <ColorInput
            label="Color"
            value={value.solidColor || "#3b82f6"}
            onChange={handleSolidColorChange}
          />
        )}

        {value.type === "gradient" && (
          <div className="space-y-4">
            <ColorInput
              label="Start Color"
              value={value.gradientStart || "#3b82f6"}
              onChange={handleGradientStartChange}
            />
            <ColorInput
              label="End Color"
              value={value.gradientEnd || "#8b5cf6"}
              onChange={handleGradientEndChange}
            />

            {/* Gradient preview strip */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Preview</Label>
              <div
                className="h-5 rounded border border-gray-300"
                style={{
                  background: `linear-gradient(to right, ${value.gradientStart || "#3b82f6"}, ${value.gradientEnd || "#8b5cf6"})`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
