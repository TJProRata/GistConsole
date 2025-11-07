"use client";

import * as React from "react";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Example SVG files from /public/svg_examples/
const EXAMPLE_ICONS = [
  { name: "Gist Favicon 1", path: "/svg_examples/gist_favicon-1.svg" },
  { name: "Gist Favicon", path: "/svg_examples/gist_favicon.svg" },
  { name: "Infimeo", path: "/svg_examples/Infimeo.svg" },
  { name: "Times 2", path: "/svg_examples/times2.svg" },
  { name: "Complex", path: "/svg_examples/Complex.svg" },
  { name: "Times", path: "/svg_examples/times.svg" },
  { name: "Payments Dive", path: "/svg_examples/Payments Dive.svg" },
  { name: "Vulture", path: "/svg_examples/Vulture.svg" },
  { name: "Woman's World", path: "/svg_examples/Womans_World.svg" },
];

interface ExampleIconSelectorProps {
  /** Callback when an example icon is selected */
  onSelect: (path: string) => void;

  /** Currently selected icon path */
  selectedPath?: string | null;

  /** Custom trigger button content (optional) */
  triggerContent?: React.ReactNode;

  /** Custom CSS classes for trigger button */
  triggerClassName?: string;
}

export function ExampleIconSelector({
  onSelect,
  selectedPath,
  triggerContent,
  triggerClassName,
}: ExampleIconSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (path: string) => {
    onSelect(path);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full", triggerClassName)}
        >
          {triggerContent || "Browse Examples"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">Example Icons</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Select a pre-made icon to use in your widget
            </p>
          </div>

          {/* Grid of example icons - 5 columns */}
          <div className="grid grid-cols-5 gap-2">
            {EXAMPLE_ICONS.map((icon) => (
              <button
                key={icon.path}
                type="button"
                onClick={() => handleSelect(icon.path)}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-2 rounded-md border-2 transition-all",
                  "hover:border-primary hover:bg-accent",
                  selectedPath === icon.path
                    ? "border-primary bg-accent"
                    : "border-transparent bg-muted/30"
                )}
                title={icon.name}
              >
                {/* Icon preview */}
                <div className="w-[60px] h-[60px] flex items-center justify-center bg-white rounded">
                  <img
                    src={icon.path}
                    alt={icon.name}
                    className="w-9 h-9 object-contain"
                  />
                </div>

                {/* Check mark for selected */}
                {selectedPath === icon.path && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                {/* Filename (truncated) */}
                <span className="text-[10px] text-center text-muted-foreground line-clamp-2 w-full">
                  {icon.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
