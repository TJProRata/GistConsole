"use client";

import { Sparkles } from "lucide-react";

interface SuccessPhaseProps {
  onContinue?: () => void;
}

export const SuccessPhase = ({ onContinue }: SuccessPhaseProps) => {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL || '';

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* GIF Background Layer (z-10) */}
      <div className="absolute inset-0 z-10 opacity-70">
        <img
          src={`${cdnUrl}/assets/celebration.gif`}
          alt="Celebration background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Layer (z-30) - centered bottom area */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[80px] w-full max-w-[313px] z-30 flex flex-col items-center gap-5 px-4">
        {/* Congratulations Text */}
        <div className="flex flex-col items-center gap-3 w-full">
          <h1 className="text-center w-full">
            <span className="text-[40px] font-normal">🎉</span>
            <span className="text-[40px] font-bold text-white">Congrats</span>
          </h1>
          <p className="text-center w-full text-[32px] font-normal text-white leading-tight">
            Your widget has been created!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Train Now Button */}
          <button
            onClick={onContinue}
            className="w-full px-2.5 py-2.5 bg-gradient-to-r from-[rgba(225,151,54,0.4)] to-[rgba(111,97,239,0.4)] rounded-[22px] flex items-center justify-center gap-1"
          >
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-white text-base font-medium tracking-[0.32px]">Train now</span>
          </button>

          {/* Skip Button */}
          <button
            onClick={onContinue}
            className="w-full px-5 py-2.5 bg-white/5 rounded-[22px]"
          >
            <span className="text-white text-base font-medium tracking-[0.32px]">Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
