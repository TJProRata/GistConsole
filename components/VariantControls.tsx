"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { VariantConfig } from "@/lib/types/component-preview";

interface VariantControlsProps {
  variants: VariantConfig[];
  selectedVariant: string;
  onVariantChange: (variant: string) => void;
  className?: string;
}

/**
 * VariantControls - Renders appropriate variant selection UI based on variant count
 *
 * - 2-3 variants: ToggleGroup (horizontal toggle buttons)
 * - 4-5 variants: RadioGroup (vertical radio buttons with labels)
 * - 6+ variants: Select (dropdown for space efficiency)
 */
export function VariantControls({
  variants,
  selectedVariant,
  onVariantChange,
  className
}: VariantControlsProps) {
  // Don't render if no variants or only one variant
  if (!variants || variants.length <= 1) {
    return null;
  }

  const variantCount = variants.length;

  // 2-3 variants: Use ToggleGroup for compact horizontal layout
  if (variantCount <= 3) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Label htmlFor="variant-toggle" className="text-sm font-medium">
          Variant:
        </Label>
        <ToggleGroup
          id="variant-toggle"
          type="single"
          value={selectedVariant}
          onValueChange={(value) => {
            if (value) onVariantChange(value);
          }}
          aria-label="Select component variant"
        >
          {variants.map((variant) => (
            <ToggleGroupItem
              key={variant.name}
              value={variant.name}
              aria-label={variant.description || `${variant.label} variant`}
              className="text-xs"
            >
              {variant.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
  }

  // 4-5 variants: Use RadioGroup for clear selection with descriptions
  if (variantCount <= 5) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-sm font-medium">Variant:</Label>
        <RadioGroup
          value={selectedVariant}
          onValueChange={onVariantChange}
          aria-label="Select component variant"
        >
          {variants.map((variant) => (
            <div key={variant.name} className="flex items-center space-x-2">
              <RadioGroupItem
                value={variant.name}
                id={`variant-${variant.name}`}
                aria-describedby={
                  variant.description ? `variant-${variant.name}-desc` : undefined
                }
              />
              <Label
                htmlFor={`variant-${variant.name}`}
                className="text-sm font-normal cursor-pointer"
              >
                {variant.label}
                {variant.description && (
                  <span
                    id={`variant-${variant.name}-desc`}
                    className="text-xs text-muted-foreground ml-1"
                  >
                    - {variant.description}
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // 6+ variants: Use Select dropdown for space efficiency
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label htmlFor="variant-select" className="text-sm font-medium">
        Variant:
      </Label>
      <Select value={selectedVariant} onValueChange={onVariantChange}>
        <SelectTrigger
          id="variant-select"
          className="w-[180px]"
          aria-label="Select component variant"
        >
          <SelectValue placeholder="Select variant" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem
              key={variant.name}
              value={variant.name}
              aria-describedby={
                variant.description ? `variant-${variant.name}-desc` : undefined
              }
            >
              {variant.label}
              {variant.description && (
                <span
                  id={`variant-${variant.name}-desc`}
                  className="text-xs text-muted-foreground ml-1"
                >
                  - {variant.description}
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
