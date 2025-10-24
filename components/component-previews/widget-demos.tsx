"use client";

import React, { useState } from "react";
import { BlueStar } from "@/components/widget_components/icons/blue-star";
import { ProfileBlank } from "@/components/widget_components/icons/profile-blank";
import { Wand } from "@/components/widget_components/icons/wand";
import { SearchingAnimation } from "@/components/widget_components/animations/searching-animation";
import { DualPhaseProgress } from "@/components/widget_components/ai-elements/dual-phase-progress";
import { SimpleProgressBar } from "@/components/widget_components/ai-elements/simple-progress-bar";
import { ReadinessScoreGauge } from "@/components/widget_components/ai-elements/readiness-score-gauge";
import { PricingCard } from "@/components/widget_components/ask-anything/pricing-card";
import { OnboardingWidget } from "@/components/widget_components/complete/onboarding-widget";
import { WomensWorldWidget } from "@/components/widget_components/complete/womens-world-widget";
import { GlassWidgetContainer, GlassWidgetHeader, GlassWidgetContent, GlassWidgetFooter } from "@/components/widget_components/ai-elements/glass_widget_container";
import { GifHousing } from "@/components/widget_components/ai-elements/gif-housing";
import { SuccessPhase } from "@/components/widget_components/ai-elements/success-phase";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputSubmit,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  GradientBorderContainer,
  GradientPlaceholderInput,
  IconButton,
  GradientSubmitButton
} from "@/components/widget_components/ai-elements/prompt-input";
import { PlusIcon, MicIcon } from "lucide-react";

// Assign compound components to PromptInput for easier usage
(PromptInput as any).Body = PromptInputBody;
(PromptInput as any).Textarea = PromptInputTextarea;
(PromptInput as any).Toolbar = PromptInputToolbar;
(PromptInput as any).Tools = PromptInputTools;
(PromptInput as any).Submit = PromptInputSubmit;
(PromptInput as any).Attachments = PromptInputAttachments;
(PromptInput as any).Attachment = PromptInputAttachment;
(PromptInput as any).ActionMenu = PromptInputActionMenu;
(PromptInput as any).ActionMenuTrigger = PromptInputActionMenuTrigger;
(PromptInput as any).ActionMenuContent = PromptInputActionMenuContent;
(PromptInput as any).ActionAddAttachments = PromptInputActionAddAttachments;

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

// AI Elements - Advanced Demos
export function GlassWidgetContainerDemo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex items-center justify-center p-8 min-h-[400px]">
      <GlassWidgetContainer
        isExpanded={isExpanded}
        onExpandChange={setIsExpanded}
        positioning="relative"
      >
        <GlassWidgetHeader>
          <h3 className="text-lg font-semibold">Widget Header</h3>
        </GlassWidgetHeader>
        <GlassWidgetContent>
          <p>Widget content goes here. Click to expand/collapse.</p>
        </GlassWidgetContent>
        <GlassWidgetFooter>
          <button className="text-sm text-gray-600">Action</button>
        </GlassWidgetFooter>
      </GlassWidgetContainer>
    </div>
  );
}

export function GifHousingDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <GifHousing
        gifSrc="/assets/preview.gif"
        alt="Preview animation"
      />
    </div>
  );
}

export function SuccessPhaseDemo() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[600px]">
      <SuccessPhase onContinue={() => console.log("Continue clicked")} />
    </div>
  );
}

export function PromptInputDemo(props?: { variant?: string }) {
  const variant = props?.variant || "glassmorphism";
  const PI = PromptInput as any;

  if (variant === "default") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <PromptInput
            variant="default"
            onSubmit={(message) => console.log(message)}
          >
            <PI.Body>
              <PI.Attachments>
                {(attachment: any) => (
                  <PI.Attachment key={attachment.id} data={attachment} />
                )}
              </PI.Attachments>
              <PI.Textarea placeholder="What would you like to know?" />
              <PI.Toolbar>
                <PI.Tools>
                  <PI.ActionMenu>
                    <PI.ActionMenuTrigger />
                    <PI.ActionMenuContent>
                      <PI.ActionAddAttachments label="Add photos or files" />
                    </PI.ActionMenuContent>
                  </PI.ActionMenu>
                </PI.Tools>
                <PI.Submit />
              </PI.Toolbar>
            </PI.Body>
          </PromptInput>
        </div>
      </div>
    );
  }

  // Glassmorphism variant (default)
  return (
    <div className="flex items-center justify-center p-8">
      <PromptInput
        variant="glassmorphism"
        onSubmit={(message) => console.log(message)}
        maxWidth={348}
      >
        <GradientBorderContainer maxWidth={348}>
          <div className="flex items-center gap-1 px-1.5 py-2 h-12">
            <IconButton
              icon={<PlusIcon className="size-5" />}
              aria-label="Add attachment"
            />
            <GradientPlaceholderInput placeholder="Ask me anything..." />
            <IconButton
              icon={<MicIcon className="size-5" />}
              aria-label="Voice input"
            />
            <GradientSubmitButton />
          </div>
        </GradientBorderContainer>
      </PromptInput>
    </div>
  );
}

// Add variant metadata
PromptInputDemo.variants = [
  {
    name: "glassmorphism",
    label: "Glassmorphism",
    description: "Minimal gradient-styled input with pill shape"
  },
  {
    name: "default",
    label: "Default",
    description: "Full-featured input with attachments and toolbar"
  }
];

PromptInputDemo.defaultVariant = "glassmorphism";

// Complete Widget Demos
export function OnboardingWidgetDemo() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[720px] p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600 mb-6">
          Interactive 18-phase onboarding experience
        </p>
        <OnboardingWidget
          isExpanded={isExpanded}
          onExpandChange={setIsExpanded}
        />
      </div>
    </div>
  );
}

export function WomensWorldWidgetDemo(props?: { width?: number; height?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[600px] p-8 bg-gradient-to-br from-orange-50 to-purple-50">
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600 mb-6">
          Health-focused Q&A widget with auto-scrolling seed questions
        </p>
        <WomensWorldWidget
          isExpanded={isExpanded}
          onExpandChange={setIsExpanded}
          onSubmit={(question) => console.log("Question submitted:", question)}
          width={props?.width}
          height={props?.height}
        />
      </div>
    </div>
  );
}

// Demo component mapping for dynamic rendering
export const WIDGET_DEMOS: Record<string, (props?: any) => React.ReactElement> = {
  "blue-star": BlueStarDemo,
  "profile-blank": ProfileBlankDemo,
  wand: WandDemo,
  "searching-animation": SearchingAnimationDemo,
  "dual-phase-progress": DualPhaseProgressDemo,
  "simple-progress-bar": SimpleProgressBarDemo,
  "readiness-score-gauge": ReadinessScoreGaugeDemo,
  "glass-widget-container": GlassWidgetContainerDemo,
  "gif-housing": GifHousingDemo,
  "success-phase": SuccessPhaseDemo,
  "prompt-input": PromptInputDemo,
  "pricing-card": PricingCardDemo,
  "onboarding-widget": OnboardingWidgetDemo,
  "womens-world-widget": WomensWorldWidgetDemo,
};
