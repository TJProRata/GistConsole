"use client";

export interface SimpleProgressBarProps {
  currentPhase: number;
  totalPhases?: number;
}

export function SimpleProgressBar({
  currentPhase,
  totalPhases = 8,
}: SimpleProgressBarProps) {
  const progressPercentage = ((currentPhase + 1) / totalPhases) * 100;

  return (
    <div className="w-full h-1 rounded-full overflow-hidden bg-gray-200">
      <div
        className="h-full transition-all duration-500 ease-out rounded-full"
        style={{
          width: `${progressPercentage}%`,
          background:
            "linear-gradient(275deg, #E1E1E1 0%, #E19736 51%, #6F61EF 100%)",
        }}
      />
    </div>
  );
}
