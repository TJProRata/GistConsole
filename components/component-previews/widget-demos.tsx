"use client";

import { BlueStar } from "@/components/widget_components/icons/blue-star";
import { ProfileBlank } from "@/components/widget_components/icons/profile-blank";
import { Wand } from "@/components/widget_components/icons/wand";
import { SearchingAnimation } from "@/components/widget_components/animations/searching-animation";
import { DualPhaseProgress } from "@/components/widget_components/ai-elements/dual-phase-progress";
import { SimpleProgressBar } from "@/components/widget_components/ai-elements/simple-progress-bar";
import { ReadinessScoreGauge } from "@/components/widget_components/ai-elements/readiness-score-gauge";
import { PricingCard } from "@/components/widget_components/ask-anything/pricing-card";

// Icon Demos
export function BlueStarDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <BlueStar />
    </div>
  );
}

export function ProfileBlankDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <ProfileBlank />
    </div>
  );
}

export function WandDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <Wand />
    </div>
  );
}

// Animation Demos
export function SearchingAnimationDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <SearchingAnimation />
    </div>
  );
}

// AI Elements Demos
export function DualPhaseProgressDemo() {
  return (
    <div className="w-full max-w-md mx-auto p-8">
      <DualPhaseProgress currentPhase={5} phase1Total={8} phase2Total={1} />
    </div>
  );
}

export function SimpleProgressBarDemo() {
  return (
    <div className="w-full max-w-md mx-auto p-8">
      <SimpleProgressBar currentPhase={6} totalPhases={8} />
    </div>
  );
}

export function ReadinessScoreGaugeDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <ReadinessScoreGauge score={85} />
    </div>
  );
}

// Ask Anything Demos
export function PricingCardDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <PricingCard
        badge="Most Popular"
        title="Pro Plan"
        price="$29"
        features={[
          { icon: "question" as const, text: "Unlimited searches" },
          { icon: "world" as const, text: "Priority support" },
          { icon: "pencil" as const, text: "Advanced analytics" },
        ]}
        ctaText="Get Started"
        onSelect={() => console.log("Pro plan selected")}
      />
    </div>
  );
}

// Demo component mapping for dynamic rendering
export const WIDGET_DEMOS: Record<string, () => React.ReactElement> = {
  "blue-star": BlueStarDemo,
  "profile-blank": ProfileBlankDemo,
  wand: WandDemo,
  "searching-animation": SearchingAnimationDemo,
  "dual-phase-progress": DualPhaseProgressDemo,
  "simple-progress-bar": SimpleProgressBarDemo,
  "readiness-score-gauge": ReadinessScoreGaugeDemo,
  "pricing-card": PricingCardDemo,
};
