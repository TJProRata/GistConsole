"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  name: string;
  href: string;
}

interface PreviewFlowStepperProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

export function PreviewFlowStepper({
  steps,
  currentStep,
  className,
}: PreviewFlowStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Progress" className={cn("", className)}>
      <ol className="flex items-center justify-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.id === currentStep;
          const isUpcoming = index > currentIndex;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    {
                      "border-primary bg-primary text-primary-foreground":
                        isCompleted,
                      "border-primary bg-background text-primary": isCurrent,
                      "border-muted bg-muted text-muted-foreground":
                        isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn("ml-2 text-sm font-medium hidden sm:inline", {
                    "text-foreground": isCurrent,
                    "text-muted-foreground": !isCurrent,
                  })}
                >
                  {step.name}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn("mx-2 h-0.5 w-8 sm:w-16", {
                    "bg-primary": isCompleted,
                    "bg-muted": !isCompleted,
                  })}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
