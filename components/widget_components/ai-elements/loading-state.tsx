import { cn } from "@/lib/utils";
import type { LoadingStateProps } from "@/components/widget_components/types";

export function LoadingState({ phase, className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 py-12", className)}>
      {/* Animated Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{
            borderTopColor: "rgb(249, 115, 22)", // orange-500
            borderRightColor: "rgb(147, 51, 234)", // purple-600
          }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-base font-medium text-gray-700">
        {phase === "generating" ? "Generating answer..." : "Getting sources..."}
      </p>
    </div>
  );
}
