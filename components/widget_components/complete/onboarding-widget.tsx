"use client";

import { useState, Fragment, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { PricingCard } from "@/components/widget_components/ask-anything/pricing-card";
import {
  GlassWidgetContainer,
  GlassWidgetHeader,
  GlassWidgetContent,
  GlassWidgetFooter
} from "@/components/widget_components/ai-elements/glass_widget_container";
import { GifHousing } from "@/components/widget_components/ai-elements/gif-housing";
import { DualPhaseProgress } from "@/components/widget_components/ai-elements/dual-phase-progress";
import {
  PromptInput,
  type PromptInputMessage,
  GradientBorderContainer,
  GradientPlaceholderInput,
  IconButton,
  GradientSubmitButton
} from "@/components/widget_components/ai-elements/prompt-input";
import { PlusIcon, MicIcon, X, Mic, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, UserCircle, Check, Loader2, Sparkles, Zap } from "lucide-react";
import { BlueStar } from "@/components/widget_components/icons/blue-star";
import { Wand } from "@/components/widget_components/icons/wand";
import { PhaseNavigation } from "@/components/ui/phase-navigation";
import { SimpleProgressBar } from "@/components/widget_components/ai-elements/simple-progress-bar";
import { SearchingAnimation } from "@/components/widget_components/animations/searching-animation";
import { SuccessPhase } from "@/components/widget_components/ai-elements/success-phase";
import { ReadinessScoreGauge } from "@/components/widget_components/ai-elements/readiness-score-gauge";

interface OnboardingWidgetProps {
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

// Streaming text animation component - defined outside to prevent remounting
const StreamingText = ({ text, className, onComplete }: { text: string; className?: string; onComplete?: () => void }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const prevTextRef = useRef(text);
  const characters = useMemo(() => text.split(''), [text]);

  // Only reset animation state when text ACTUALLY changes
  useEffect(() => {
    if (prevTextRef.current !== text) {
      setHasAnimated(false);
      prevTextRef.current = text;
    }
  }, [text]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.1,
      }
    }
  };

  const child = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // After animation completes: render static text (no motion)
  if (hasAnimated) {
    return <p className={className}>{text}</p>;
  }

  // Before animation completes: render animated text
  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => {
        setHasAnimated(true);
        onComplete?.();
      }}
      key={text}
    >
      {characters.map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={child}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

// CDN URL with fallback for asset loading
const cdnUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL || '';

// Phase titles for navigation (phases 0-7)
const phaseTitles = [
  "Get Started",
  "Context",
  "Online Presence",
  "Socials",
  "Goals",
  "Audience",
  "[Ad] Paywall",
  "Connections",
  "Customization"
];

export function OnboardingWidget({ isExpanded, onExpandChange }: OnboardingWidgetProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [isInValidationTransition, setIsInValidationTransition] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Auto-transition from Phase 11 to Phase 12 after 3 seconds
  useEffect(() => {
    if (currentPhase === 11) {
      const timer = setTimeout(() => {
        setCurrentPhase(12);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentPhase]);

  // Auto-transition from Phase 13 to Phase 14 after 3 seconds
  useEffect(() => {
    if (currentPhase === 13) {
      const timer = setTimeout(() => {
        setCurrentPhase(14);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentPhase]);

  // Validation transition animation timing
  useEffect(() => {
    if (isInValidationTransition) {
      const targetPhase = currentPhase + 1;

      // Show loading spinner for 1 second
      const checkmarkTimer = setTimeout(() => {
        setShowCheckmark(true);
      }, 1000);

      // Complete transition after checkmark shows (1.8s total)
      const completeTimer = setTimeout(() => {
        setIsInValidationTransition(false);
        setShowCheckmark(false);
        setCurrentPhase(targetPhase);
      }, 1800);

      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isInValidationTransition, currentPhase]);

  // Track carousel slide changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect(); // Set initial state

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Reset streaming state when phase changes
  useEffect(() => {
    setIsStreaming(true);
  }, [currentPhase]);

  const handlePromptSubmit = (message: PromptInputMessage) => {
    // Handle prompt submission
  };

  // Phase data structure
  const phases = [
    {
      heading: "How do I get one?",
      description: "Setup takes minutes. We'll ask a few questions, connect your content, and generate a ready-to-install widget.",
      suggestions: ["Get started now", "Tell me more", "Book a demo"]
    },
    {
      heading: "Set your context",
      description: "Tell us who you are. We'll personalize the next steps around your role—no permissions yet.",
      suggestions: ["Business details", "Target audience", "Key services"]
    },
    {
      heading: "Where will you add it?",
      description: "Choose the main place you'll install the widget. This sets default placement and install instructions—content connections come later.",
      suggestions: ["Website", "Landing page", "Multiple pages"]
    },
    {
      heading: "Add your socials",
      description: "Choose the channels you want surfaced in answers and links. We'll connect accounts later—this just set priorities.",
      suggestions: ["Instagram", "Twitter/X", "LinkedIn"]
    },
    {
      heading: "What do you hope to achieve?",
      description: "Pick a primary focus—your widget will still support the others. We'll tune prompts, CTAs, and metrics to match.\n• Grow: reach new people (traffic, views, followers)\n• Earn: drive conversions (sales, bookings, leads)\n• Retain: resolve questions fast (self-serve answers, fewer tickets)",
      suggestions: ["Grow my podcast", "Sell my merch", "Retain listeners"]
    },
    {
      heading: "Choose your top outcome",
      description: "Pick what you want highlighted when someone searches. We'll prioritize this in answers and links—everything else still shows.",
      suggestions: ["Best-selling product", "Book a service / appointment", "Contact info"]
    },
    {
      heading: "Choose your plan",
      description: "",
      suggestions: ["Compare plans", "See features", "Contact sales"],
      showPricing: true
    },
    {
      heading: "Connect your content",
      description: "Start with one source—you can add more later. We only read what you approve, and you can disconnect anytime.",
      suggestions: ["Website content", "Help center", "Product docs"]
    },
    {
      heading: "Recommended for [location]",
      description: "Based on your responses, here's the widget configuration we recommend for your business.",
      suggestions: ["Deploy now", "Review settings", "Need help"],
      showGifPreview: true
    },
    {
      heading: "Pick a widget size",
      description: "Choose Small, Medium, or Large. You can change this later.",
      suggestions: ["Small", "Medium", "Large"],
      showGifPreview: true
    },
    {
      heading: "Set your widget's \"call to action\"",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      suggestions: ["Automatic", "Manual"],
      showGifPreview: true
    },
    {
      heading: "Creating your widget",
      description: "",
      suggestions: [],
      showSearchingAnimation: true
    },
    {
      heading: "",
      description: "",
      suggestions: [],
      showSuccessScreen: true
    },
    {
      heading: "",
      description: "",
      suggestions: [],
      showReadinessTracking: true
    },
    {
      heading: "Here's your readiness score. We'll test it out by talking, tapping, and typing.",
      description: "",
      suggestions: [],
      showReadinessScore: true
    },
    {
      heading: "",
      description: "",
      suggestions: [],
      showVoiceTest: true
    },
    {
      heading: "",
      description: "",
      suggestions: [],
      showResponseEvaluation: true
    },
    {
      heading: "",
      description: "",
      suggestions: [],
      showReadinessActions: true
    }
  ];

  // Pricing cards data
  const pricingPlans = [
    {
      title: "Starter",
      price: "$29",
      features: [
        { icon: 'question' as const, text: "Up to 300 answers/mo" },
        { icon: 'world' as const, text: "1 website" },
        { icon: 'pencil' as const, text: "Basic customization" }
      ],
      ctaText: "Get Started"
    },
    {
      badge: "Most Popular",
      title: "Grow",
      price: "$79",
      features: [
        { icon: 'question' as const, text: "Up to 900 answers/mo" },
        { icon: 'world' as const, text: "3 websites" },
        { icon: 'pencil' as const, text: "Full customization" }
      ],
      ctaText: "Choose Grow"
    },
    {
      title: "Scale",
      price: "$199",
      features: [
        { icon: 'question' as const, text: "Unlimited answers" },
        { icon: 'world' as const, text: "Unlimited websites" },
        { icon: 'pencil' as const, text: "White-label + API" }
      ],
      ctaText: "Go Premium"
    }
  ];

  const currentPhaseData = phases[currentPhase];

  const handleSuggestionClick = (suggestion: string) => {
    // Trigger validation transition from Phase 5 → 6 and Phase 6 → 7
    if (currentPhase === 5 || currentPhase === 6) {
      setIsInValidationTransition(true);
    } else {
      setCurrentPhase(prev => Math.min(prev + 1, 17));
    }
  };

  const handlePricingSelect = (planTitle: string) => {
    // Trigger validation transition from Phase 6 → 7
    if (currentPhase === 6) {
      setIsInValidationTransition(true);
    } else {
      setCurrentPhase(prev => Math.min(prev + 1, 17));
    }
  };

  const handleMoreClick = () => {
    // Handle more button click
  };

  const calculatedHeight = Math.min(
    isInValidationTransition ? 700 : currentPhase === 0 ? 380 : currentPhase === 12 ? 680 : currentPhase === 13 ? 261 : currentPhase === 14 ? 400 : currentPhase === 17 ? 720 : currentPhase === 16 ? 720 : currentPhase === 15 ? 720 : currentPhase === 6 ? 700 : (currentPhase === 8 || currentPhase === 9 || currentPhase === 10) ? 720 : currentPhase === 11 ? 261 : 480,
    810
  );

  return (
    <GlassWidgetContainer
      isExpanded={isExpanded}
      onExpandChange={onExpandChange}
      positioning="relative"
      expandedHeight={calculatedHeight}
    >
      {/* Validation Transition - Phase 5 → 6 */}
      {isInValidationTransition ? (
        <div className="flex flex-col items-center justify-center h-full" style={{ background: 'white', minHeight: '700px', height: '700px' }}>
          <AnimatePresence mode="wait">
            {!showCheckmark ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--gradient-brand)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                <Loader2 className="w-16 h-16 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="checkmark"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                className="rounded-full p-4"
                style={{ background: 'var(--gradient-brand)' }}
              >
                <Check className="w-12 h-12 text-white stroke-[3]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Validation text */}
          <motion.p
            className="mt-4 text-lg font-medium text-text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {showCheckmark ? "Got it!" : "Processing..."}
          </motion.p>
        </div>
      ) : (
        <>
          {/* Normal Phase Content */}
          {currentPhase <= 7 && (
        <GlassWidgetHeader className="flex flex-col gap-1.5">
          {/* Phase Navigation */}
          <div className="flex justify-between items-start w-full">
            {currentPhase > 0 ? (
              <PhaseNavigation
                variant="prev"
                label={phaseTitles[currentPhase - 1]}
                onClick={() => setCurrentPhase(prev => Math.max(prev - 1, 0))}
              />
            ) : (
              <div />
            )}
            <PhaseNavigation
              variant="next"
              label={phaseTitles[currentPhase + 1]}
              onClick={() => setCurrentPhase(prev => Math.min(prev + 1, 7))}
            />
          </div>

          {/* Progress Bar */}
          <SimpleProgressBar currentPhase={currentPhase} totalPhases={8} />
        </GlassWidgetHeader>
      )}

      {currentPhase !== 11 && currentPhase !== 12 && currentPhase !== 13 && currentPhase !== 15 && currentPhase !== 16 && currentPhase !== 17 && currentPhase > 7 && (
        <GlassWidgetHeader>
          {currentPhase !== 14 && (
            <DualPhaseProgress currentPhase={currentPhase} phase1Total={8} phase2Total={4} />
          )}
        </GlassWidgetHeader>
      )}

      <GlassWidgetContent
        className={cn(
          currentPhase === 6 ? "overflow-visible" : "",
          // Phase 12 needs explicit height due to absolute positioned content
          currentPhase === 12 ? "h-[680px]" : "",
          // Add flex-1 for phases with scrollable internal content
          [15, 16, 17].includes(currentPhase) ? "flex-1" : ""
        )}
      >
        {/* Success Screen (Phase 12) */}
        {currentPhaseData.showSuccessScreen ? (
          <SuccessPhase onContinue={() => setCurrentPhase(13)} />
        ) : (
          /* AI Response Section */
          <motion.div layout="position" className="space-y-4">
            {/* Heading Section */}
            <div className="space-y-1">
              <h2 className={currentPhase === 14 ? "text-xl font-bold text-text-primary" : "text-heading font-heading font-medium leading-heading tracking-heading text-text-primary break-words"}>
                {currentPhaseData.heading}
              </h2>
            </div>

            {/* Description Section */}
            {currentPhaseData.description && (
              <div className="space-y-1">
                <StreamingText
                  key={`streaming-${currentPhase}`}
                  text={currentPhaseData.description}
                  className="text-sm text-text-primary leading-description break-words"
                  onComplete={() => setIsStreaming(false)}
                />
              </div>
            )}

            {/* SearchingAnimation (Phase 11) */}
            {currentPhaseData.showSearchingAnimation && (
              <div className="flex justify-center">
                <SearchingAnimation
                  prefix="Configuring your widget"
                  items={["location", "favicon", "location", "size"]}
                  interval={2000}
                  isActive={true}
                />
              </div>
            )}

            {/* Readiness Tracking (Phase 13) */}
            {currentPhaseData.showReadinessTracking && (
              <>
                <h2 className="text-heading font-heading font-medium leading-heading tracking-heading text-text-primary break-words">Tracking your readiness score</h2>
                <div className="flex justify-center">
                  <SearchingAnimation
                    prefix="Readiness score:"
                    items={["25%", "50%", "75%", "100%"]}
                    interval={2000}
                    isActive={true}
                  />
                </div>
              </>
            )}

            {/* Readiness Score (Phase 14) */}
            {currentPhaseData.showReadinessScore && (
              <div className="flex flex-col items-center justify-center px-4 h-full">
                <ReadinessScoreGauge score={87} size={240} animate={true} />
              </div>
            )}

            {/* Voice Test Mode (Phase 15) */}
            {currentPhaseData.showVoiceTest && (
              <div className="flex flex-col items-center justify-center h-full py-8">
                {/* Top Section: Readiness Score Card */}
                <div className="flex flex-col items-center gap-6 px-4 w-full max-w-md">
                  {/* Readiness Score Module */}
                  <div className="w-full">
                    <div className="p-5 bg-white rounded-[10px] border-t-[10px] border-[#E1E1E1] shadow-[0px_4px_16px_rgba(0,0,0,0.15)]">
                      <div className="flex flex-col gap-5">
                        {/* Text */}
                        <div className="text-center">
                          <span className="text-text-muted text-base-alt font-semibold leading-score">
                            Readiness score:
                          </span>
                          <span className="text-text-black text-base-alt font-semibold leading-score">
                            {' '}87%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full">
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
                            <div
                              className="h-full bg-gradient-brand transition-all duration-500 ease-out"
                              style={{
                                width: '87%',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-center text-text-primary font-normal leading-tight">
                    <span className="text-display">Let&apos;s </span>
                    <span className="text-display font-bold">test</span>
                    <span className="text-display"> voice mode</span>
                  </h2>
                </div>

                {/* Middle Section: Voice Visualization */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden">
                    <img
                      src={`${cdnUrl}/assets/celebration.gif`}
                      alt="Voice waveform visualization"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Readiness Score with Actions (Phase 17) */}
            {currentPhaseData.showReadinessActions && (
              <div className="flex flex-col h-full">
                {/* Navigation Header with Progress */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPhase(prev => Math.max(prev - 1, 0))}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    aria-label="Previous phase"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2 flex-1">
                    {/* Segment 1: Completed */}
                    <div className="h-1 flex-1 rounded-full bg-gray-300" />

                    {/* Segment 2: Active (gradient) */}
                    <div className="h-1 flex-1 rounded-full bg-gradient-brand" />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPhase(prev => Math.min(prev + 1, 17))}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    aria-label="Next phase"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Page Title */}
                <div className="text-center px-4 pb-4">
                  <h3 className="text-heading font-heading font-medium leading-heading tracking-heading text-text-primary break-words">
                    Add more info
                  </h3>
                </div>

                {/* Main Content - Scrollable */}
                <div className="flex-1 px-4 overflow-y-auto">
                  {/* Section Title */}
                  <h2 className="text-heading font-heading font-medium leading-heading tracking-heading text-text-primary break-words mb-8">
                    Readiness Score
                  </h2>

                  {/* Score Display with Sparkle Badge */}
                  <div className="flex justify-center mb-8">
                    <div className="relative inline-block">
                      <ReadinessScoreGauge score={97} size={240} animate={true} />

                      {/* Sparkle Badge */}
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100">
                        <Sparkles className="w-6 h-6 text-accent-amber" />
                      </div>
                    </div>
                  </div>

                  {/* Action List */}
                  <div className="space-y-0">
                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-transparent"
                    >
                      <Sparkles className="w-5 h-5 mr-3 text-accent-blue flex-shrink-0" />
                      <span className="text-base text-text-primary">Add content source</span>
                    </Button>

                    <Separator className="border-dashed" />

                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-transparent"
                    >
                      <Sparkles className="w-5 h-5 mr-3 text-accent-blue flex-shrink-0" />
                      <span className="text-base text-text-primary">Enter website URL</span>
                    </Button>

                    <Separator className="border-dashed" />

                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-transparent"
                    >
                      <Sparkles className="w-5 h-5 mr-3 text-accent-blue flex-shrink-0" />
                      <span className="text-base text-text-primary">Add goals</span>
                    </Button>
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-center pt-6 pb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                      className="rounded-[20px] px-2.5 py-1 gap-1 border border-black text-black hover:bg-transparent"
                      style={{
                        background: 'var(--background-action-secondary, rgba(255, 255, 255, 0.10))'
                      }}
                    >
                      <Zap className="size-4" />
                      Try it now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Response Evaluation (Phase 16) */}
            {currentPhaseData.showResponseEvaluation && (
              <div className="flex flex-col h-full">
                {/* Phase Navigator */}
                <div className="flex items-center justify-between px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPhase(prev => Math.max(prev - 1, 0))}
                    className="w-8 h-8 rounded-full"
                    aria-label="Previous phase"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <h3 className="text-base font-medium text-text-primary">
                    Improve readiness
                  </h3>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentPhase(prev => Math.min(prev + 1, 17))}
                    className="w-8 h-8 rounded-full"
                    aria-label="Next phase"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Response Card */}
                <div className="flex-1 px-4 overflow-y-auto">
                  <div className="rounded-2xl border-2 border-accent-green bg-white p-5 space-y-4">
                    {/* Intro Text */}
                    <p className="text-sm text-text-secondary">
                      This is an example of a great response. Do you agree?
                    </p>

                    {/* Question Title */}
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold text-text-primary">
                        Test question #2: Top podcast
                      </h4>

                      {/* Podcast List */}
                      <ul className="space-y-1 ml-4">
                        <li className="text-sm text-text-secondary">
                          • &quot;Tana Mongeau Exposed&quot; (Ep. 103)
                        </li>
                        <li className="text-sm text-text-secondary">
                          • &quot;Why They Won&apos;t F*ck You&quot; (Ep. 29)
                        </li>
                        <li className="text-sm text-text-secondary">
                          • &quot;The 3rd Roommate Speaks&quot; (Ep. 84)
                        </li>
                      </ul>
                    </div>

                    {/* Feedback Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {}}
                        className="w-10 h-10 hover:bg-green-50"
                        aria-label="This is a good response"
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {}}
                        className="w-10 h-10 hover:bg-red-50"
                        aria-label="This is not a good response"
                      >
                        <ThumbsDown className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Menu */}
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="w-full justify-start text-left h-auto py-3 px-4"
                    >
                      <PlusIcon className="w-4 h-4 mr-3 text-text-tertiary" />
                      <span className="text-sm text-text-secondary">Try again</span>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="w-full justify-start text-left h-auto py-3 px-4"
                    >
                      <PlusIcon className="w-4 h-4 mr-3 text-text-tertiary" />
                      <span className="text-sm text-text-secondary">Edit it</span>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="w-full justify-start text-left h-auto py-3 px-4"
                    >
                      <PlusIcon className="w-4 h-4 mr-3 text-text-tertiary" />
                      <span className="text-sm text-text-secondary">Use this one instead...</span>
                    </Button>

                    {/* CTA Button */}
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPhase(17)}
                        className="rounded-[20px] px-2.5 py-1 gap-1 border border-black text-black hover:bg-transparent"
                        style={{
                          background: 'var(--background-action-secondary, rgba(255, 255, 255, 0.10))'
                        }}
                      >
                        <Zap className="size-4" />
                        Try it now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Carousel (Phase 6) */}
            {currentPhaseData.showPricing && (
              <div className="space-y-3">
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-gray-900">Because you chose Grow</p>
                  <p className="text-xs text-gray-600">Estimated usage: ~600-900 answers/mo</p>
                </div>
                <Carousel
                  opts={{ align: "center", loop: false }}
                  setApi={setCarouselApi}
                  className="w-full mx-auto"
                >
                  <CarouselContent className="-ml-4">
                    {pricingPlans.map((plan, index) => (
                      <CarouselItem key={index} className="pl-4 basis-[70%]">
                        <PricingCard {...plan} onSelect={() => handlePricingSelect(plan.title)} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2">
                  {pricingPlans.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => carouselApi?.scrollTo(index)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        activeSlide === index
                          ? "w-6 bg-gradient-to-r from-[#6F61EF] to-[#E19736]"
                          : "w-2 bg-gray-300"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* GIF Preview (Phases 8, 9, 10) */}
            {currentPhaseData.showGifPreview && (
              <div className="space-y-4">
                <GifHousing
                  gifSrc={`${cdnUrl}/assets/preview.gif`}
                  alt="Widget behavior preview"
                  className="mx-auto max-w-sm"
                />
              </div>
            )}
          </motion.div>
        )}
      </GlassWidgetContent>

      {/* Action Buttons Section */}
      {currentPhaseData.suggestions && currentPhaseData.suggestions.length > 0 && (
        <motion.div
          layout="position"
          className="px-4 mt-auto mb-2 flex flex-col shrink-0"
        >
          {currentPhaseData.suggestions.map((suggestion, index) => (
            <Fragment key={suggestion}>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isStreaming}
                className={cn(
                  "justify-start text-left h-[30px] px-0 leading-[140%] hover:bg-transparent",
                  isStreaming && "opacity-50 cursor-not-allowed"
                )}
                style={{
                  color: 'var(--content-default, #151022)',
                  fontFamily: 'var(--font-family-accent, "Work Sans")'
                }}
              >
                <BlueStar className="w-5 h-5 mr-3" />
                {suggestion}
              </Button>
              {index < currentPhaseData.suggestions.length - 1 && <Separator className="border-t border-dashed border-gray-300 bg-transparent my-1" />}
            </Fragment>
          ))}

          {/* More Button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMoreClick}
              disabled={isStreaming}
              className={cn(
                "rounded-[20px] px-2.5 py-1 gap-1 border border-black hover:bg-transparent",
                isStreaming && "opacity-50 cursor-not-allowed"
              )}
              style={{
                background: 'var(--background-action-secondary, rgba(255, 255, 255, 0.10))',
                color: 'var(--content-default, #151022)',
                fontSize: '16px',
                fontFamily: 'Work Sans',
                fontWeight: 500,
                lineHeight: '22.40px',
                letterSpacing: '0.32px'
              }}
            >
              <Wand className="w-3.5 h-3.5" />
              More
            </Button>
          </div>
        </motion.div>
      )}

      {currentPhase !== 12 && (
        <GlassWidgetFooter>
          <motion.div layout="position">
          {currentPhase === 17 ? (
            /* Phase 17: Gradient Placeholder Footer */
            <>
              <PromptInput
                variant="glassmorphism"
                onSubmit={(message) => {}}
                maxWidth={348}
              >
                <GradientBorderContainer maxWidth={348}>
                  <div className="flex items-center gap-1 px-1.5 py-2 h-12">
                    <IconButton
                      icon={<PlusIcon className="size-5" />}
                      aria-label="Add attachment"
                    />
                    <GradientPlaceholderInput
                      placeholder="To improve your score, I recommend..."
                      name="recommendation"
                    />
                    <IconButton
                      icon={<MicIcon className="size-5" />}
                      aria-label="Voice input"
                    />
                    <IconButton
                      icon={<UserCircle className="size-6" />}
                      aria-label="User profile"
                    />
                  </div>
                </GradientBorderContainer>
              </PromptInput>

              {/* Branding */}
              <div className="flex justify-center pb-1 pt-5">
                <PoweredByButton />
              </div>
            </>
          ) : currentPhase === 15 ? (
            /* Phase 15: Circular Action Buttons */
            <div className="flex justify-center pb-4">
              <div className="p-3 bg-transparent rounded-full border border-[rgba(21,16,34,0.30)] flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPhase(16)}
                  className="w-[72px] h-[72px] rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                  aria-label="Continue to evaluation"
                >
                  <X className="w-6 h-6 text-black" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {}}
                  className="w-[72px] h-[72px] rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                  aria-label="Activate microphone"
                >
                  <Mic className="w-6 h-6 text-black" />
                </Button>
              </div>
            </div>
          ) : currentPhase === 16 ? (
            /* Phase 16: Grade Input Footer */
            <>
              <PromptInput
                variant="glassmorphism"
                onSubmit={(message) => {}}
                maxWidth={348}
              >
                <GradientBorderContainer maxWidth={348}>
                  <div className="flex items-center gap-1 px-1.5 py-2 h-12">
                    <IconButton
                      icon={<PlusIcon className="size-5" />}
                      aria-label="Add attachment"
                    />
                    <GradientPlaceholderInput
                      placeholder="Grade the answer"
                      name="grade"
                    />
                    <IconButton
                      icon={<MicIcon className="size-5" />}
                      aria-label="Voice input"
                    />
                    <IconButton
                      icon={<UserCircle className="size-6" />}
                      aria-label="User profile"
                    />
                  </div>
                </GradientBorderContainer>
              </PromptInput>

              {/* Branding */}
              <div className="flex justify-center pb-1 pt-5">
                <PoweredByButton />
              </div>
            </>
          ) : currentPhase === 14 ? (
            /* Phase 14: Test Voice Mode Button */
            <>
              <div className="px-4 pb-3">
                <Button
                  onClick={() => setCurrentPhase(15)}
                  className="w-full bg-gradient-brand text-white hover:opacity-90"
                >
                  Test Voice Mode
                </Button>
              </div>
              <div className="flex justify-center pb-1 pt-5">
                <PoweredByButton />
              </div>
            </>
          ) : (currentPhase === 6 || currentPhase === 13) ? (
            /* Phase 6 & 13: Powered by button only */
            <div className="flex justify-center pb-1 pt-5">
              <PoweredByButton />
            </div>
          ) : (
            <>
              {/* Glassmorphism variant - pill-shaped input with gradient border */}
              <PromptInput
                variant="glassmorphism"
                onSubmit={handlePromptSubmit}
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

              {/* Branding */}
              <div className="flex justify-center pb-1 pt-5">
                <PoweredByButton />
              </div>
            </>
          )}
          </motion.div>
        </GlassWidgetFooter>
      )}
        </>
      )}
    </GlassWidgetContainer>
  );
}
