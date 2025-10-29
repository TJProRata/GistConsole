"use client";

import React, { useState } from "react";
import { BlueStar } from "@/components/widget_components/icons/blue-star";
import { PoweredByButton } from "@/components/widget_components/icons/powered-by-button";
import { ProfileBlank } from "@/components/widget_components/icons/profile-blank";
import { Wand } from "@/components/widget_components/icons/wand";
import { SearchingAnimation } from "@/components/widget_components/animations/searching-animation";
import { DualPhaseProgress } from "@/components/widget_components/ai-elements/dual-phase-progress";
import { SimpleProgressBar } from "@/components/widget_components/ai-elements/simple-progress-bar";
import { ReadinessScoreGauge } from "@/components/widget_components/ai-elements/readiness-score-gauge";
import { QuestionPill } from "@/components/widget_components/ai-elements/question-pill";
import { SeedQuestionsCarousel } from "@/components/widget_components/ai-elements/seed-questions-carousel";
import { SearchInputSection } from "@/components/widget_components/ai-elements/search-input-section";
import { PricingCard } from "@/components/widget_components/ask-anything/pricing-card";
import { OnboardingWidget } from "@/components/widget_components/complete/onboarding-widget";
import { WomensWorldWidget } from "@/components/widget_components/complete/womens-world-widget";
import { WomensWorldInlineWidget } from "@/components/widget_components/complete/womens-world-inline-widget";
import { EaterWidget } from "@/components/widget_components/complete/eater-widget";
import { EaterHeader } from "@/components/widget_components/ai-elements/eater-header";
import { EaterQuestionPill } from "@/components/widget_components/ai-elements/eater-question-pill";
import { EaterSearchInputSection } from "@/components/widget_components/ai-elements/eater-search-input-section";
import { EaterSeedQuestionPills } from "@/components/widget_components/ai-elements/eater-seed-question-pills";
import { GlassWidgetContainer, GlassWidgetHeader, GlassWidgetContent, GlassWidgetFooter } from "@/components/widget_components/ai-elements/glass_widget_container";
import { AnswerWidgetContainer, AnswerWidgetHeader, AnswerWidgetContent, AnswerWidgetFooter } from "@/components/widget_components/ai-elements/answer_widget_container";
import { QueryDisplay } from "@/components/widget_components/ai-elements/query-display";
import { AnswerContent } from "@/components/widget_components/ai-elements/answer-content";
import { DisclaimerBanner } from "@/components/widget_components/ai-elements/disclaimer-banner";
import { SponsoredContent } from "@/components/widget_components/ai-elements/sponsored-content";
import { ArticleCard } from "@/components/widget_components/ai-elements/article-card";
import { RecommendedArticles } from "@/components/widget_components/ai-elements/recommended-articles";
import { FeedbackButtons } from "@/components/widget_components/ai-elements/feedback-buttons";
import { RelatedQuestions } from "@/components/widget_components/ai-elements/related-questions";
import { SourceDistributionBar } from "@/components/widget_components/ai-elements/source-distribution-bar";
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

export function PoweredByButtonDemo() {
  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-purple-50">
      <PoweredByButton />
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

export function QuestionPillDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex items-center gap-2 p-8">
      <QuestionPill
        question="What is the best diet for weight loss?"
        onClick={() => setSelected(!selected)}
        isSelected={selected}
      />
      <QuestionPill
        question="How can I improve my gut health?"
        onClick={() => {}}
        isSelected={false}
      />
    </div>
  );
}

export function SeedQuestionsCarouselDemo() {
  const [selected, setSelected] = useState("");

  const questions = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "Is there a link between trauma and autoimmune symptoms?",
    "How do I improve my gut health?",
    "What are signs of vitamin deficiency?",
  ];

  return (
    <div className="w-full max-w-2xl p-8">
      <SeedQuestionsCarousel
        questions={questions}
        autoScrollInterval={35000}
        onQuestionClick={setSelected}
        selectedQuestion={selected}
      />
    </div>
  );
}

export function SearchInputSectionDemo() {
  const seedQuestionsRow1 = [
    "What's the best bread for weight loss?",
    "Can I prevent dementia?",
    "How do I improve my gut health?",
  ];

  const seedQuestionsRow2 = [
    "How can I make Hamburger Helper healthier?",
    "What are natural ways to boost energy?",
    "What foods improve sleep quality?",
  ];

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl">
      <SearchInputSection
        placeholder="Ask us your health questions"
        onSubmit={(question) => console.log("Submitted:", question)}
        seedQuestionsRow1={seedQuestionsRow1}
        seedQuestionsRow2={seedQuestionsRow2}
        autoScrollInterval={35000}
      />
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

export function AnswerWidgetContainerDemo() {
  // Mock data for comprehensive demo
  const mockArticles = [
    {
      id: "1",
      title: "The Science Behind Dark Chocolate's Health Benefits",
      description: "New research reveals how flavonoids in dark chocolate can improve cardiovascular health and cognitive function.",
      url: "https://example.com/article-1",
      source: {
        name: "Healthline",
        logo: "https://picsum.photos/seed/healthline/40/40",
      },
      thumbnail: "https://picsum.photos/seed/choc1/400/225",
      relevanceScore: 92,
      publishedDate: "2024-10-15",
    },
    {
      id: "2",
      title: "How Much Dark Chocolate Should You Eat Daily?",
      description: "Nutritionists weigh in on the optimal amount of dark chocolate to consume for maximum health benefits.",
      url: "https://example.com/article-2",
      source: {
        name: "Medical News Today",
        logo: "https://picsum.photos/seed/medicalnews/40/40",
      },
      thumbnail: "https://picsum.photos/seed/choc2/400/225",
      relevanceScore: 88,
      publishedDate: "2024-10-12",
    },
    {
      id: "3",
      title: "Dark Chocolate vs Milk Chocolate: Nutrition Comparison",
      description: "Understanding the key differences in nutritional content and health impacts between dark and milk chocolate.",
      url: "https://example.com/article-3",
      source: {
        name: "WebMD",
        logo: "https://picsum.photos/seed/webmd/40/40",
      },
      thumbnail: "https://picsum.photos/seed/choc3/400/225",
      relevanceScore: 85,
      publishedDate: "2024-10-10",
    },
  ];

  const mockCitations = [
    {
      id: "citation-1",
      number: 1,
      title: "The Science Behind Dark Chocolate's Health Benefits",
      url: "https://healthline.com/nutrition/dark-chocolate-benefits",
      domain: "healthline.com",
      publishedDate: "2024-10-15",
    },
    {
      id: "citation-2",
      number: 2,
      title: "Dark Chocolate and Heart Health: What Research Says",
      url: "https://medicalnewstoday.com/articles/dark-chocolate-heart",
      domain: "medicalnewstoday.com",
      publishedDate: "2024-10-12",
    },
    {
      id: "citation-3",
      number: 3,
      title: "Flavonoids in Dark Chocolate: Cognitive Benefits",
      url: "https://webmd.com/diet/dark-chocolate-flavonoids",
      domain: "webmd.com",
      publishedDate: "2024-10-10",
    },
  ];

  const mockRelatedQuestions = [
    "Is 90% dark chocolate better than 70%?",
    "Can dark chocolate help with weight loss?",
    "What are the side effects of eating too much dark chocolate?",
    "How does dark chocolate compare to other antioxidant foods?",
  ];

  const mockSources = [
    { name: "Healthline", percentage: 26, color: "#E60001" },
    { name: "Medical News Today", percentage: 20, color: "#FF6B6B" },
    { name: "WebMD", percentage: 18, color: "#4ECDC4" },
    { name: "Mayo Clinic", percentage: 16, color: "#45B7D1" },
    { name: "Others", percentage: 20, color: "#96CEB4" },
  ];

  const answerTextWithCitations = `Dark chocolate contains powerful antioxidants and minerals that can significantly benefit your health when consumed in moderation.[1] Studies show it may help improve heart health by lowering blood pressure and reducing the risk of cardiovascular disease.[2]

Rich in flavonoids, dark chocolate can enhance brain function, improve mood, and provide anti-inflammatory properties.[3] The key is choosing chocolate with at least 70% cocoa content for maximum benefits.

Research indicates that regular consumption of dark chocolate can improve blood flow, reduce inflammation, and even help protect your skin from sun damage.[1] Additionally, the minerals found in quality dark chocolate—including iron, magnesium, and zinc—support various bodily functions.`;

  return (
    <div className="flex items-center justify-center p-8 min-h-[600px] bg-gray-50">
      <AnswerWidgetContainer>
        <AnswerWidgetHeader>
          <SourceDistributionBar sources={mockSources} className="mb-4" />
          <QueryDisplay query="What are the health benefits of dark chocolate?" />
          <p className="text-sm text-gray-600 mt-2">Based on 12 sources • Updated 2 hours ago</p>
        </AnswerWidgetHeader>

        <AnswerWidgetContent>
          <div className="space-y-6 py-4">
            {/* Main Answer with Citations */}
            <AnswerContent
              answerText={answerTextWithCitations}
              isComplete={true}
              citations={mockCitations}
              onCitationClick={(citationId) => {
                console.log(`Citation clicked: ${citationId}`);
              }}
            />

            {/* Disclaimer Banner */}
            <DisclaimerBanner
              text="AI-generated content may contain errors. Always verify health information with qualified healthcare providers."
              variant="default"
            />

            {/* Sponsored Content */}
            <SponsoredContent
              title={
                <>
                  <span className="font-bold">Premium Dark Chocolate</span>{" "}
                  <span className="font-normal">Collection</span>
                </>
              }
              body="Discover our curated selection of organic dark chocolate bars, sourced from sustainable farms worldwide. 70-90% cocoa options available."
              cta={{
                text: "Shop Now",
                url: "https://example.com/shop",
              }}
            />

            {/* Recommended Articles */}
            <RecommendedArticles
              articles={mockArticles}
              onArticleClick={(articleId, articleUrl) => {
                console.log(`Article clicked: ${articleId} - ${articleUrl}`);
              }}
            />

            {/* Feedback Buttons */}
            <div className="flex items-center justify-center gap-4 py-4">
              <FeedbackButtons
                onThumbsUp={() => console.log("Thumbs up!")}
                onThumbsDown={() => console.log("Thumbs down!")}
              />
            </div>

            {/* Related Questions */}
            <RelatedQuestions
              questions={mockRelatedQuestions}
              onQuestionClick={(question) => {
                console.log(`Related question clicked: ${question}`);
              }}
            />
          </div>
        </AnswerWidgetContent>

        <AnswerWidgetFooter>
          <div className="mt-4">
            <PromptInput
              variant="default"
              onSubmit={(message) => {
                console.log("New search query:", message);
              }}
            >
              <PromptInputBody>
                <PromptInputTextarea placeholder="Ask about health & nutrition..." />
                <PromptInputToolbar>
                  <PromptInputSubmit />
                </PromptInputToolbar>
              </PromptInputBody>
            </PromptInput>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t">
            <p className="text-xs text-gray-500">Generated with AI • Verify with healthcare provider</p>
            <button className="text-sm text-blue-600 hover:underline">View All Sources</button>
          </div>
        </AnswerWidgetFooter>
      </AnswerWidgetContainer>
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

export function WomensWorldInlineWidgetDemo(props?: {
  title?: string;
  placeholder?: string;
  seedQuestionsRow1?: string[];
  seedQuestionsRow2?: string[];
  autoScrollInterval?: number;
  maxWidth?: number;
  variant?: "light" | "neutral" | "subtle";
}) {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-3xl">
        <div className="prose prose-sm mb-8">
          <p className="text-gray-600">
            This inline widget is designed to be embedded naturally within article content.
            It maintains the same Q&A functionality but with a compact, article-friendly design.
          </p>
        </div>

        <WomensWorldInlineWidget
          title={props?.title}
          placeholder={props?.placeholder}
          seedQuestionsRow1={props?.seedQuestionsRow1}
          seedQuestionsRow2={props?.seedQuestionsRow2}
          autoScrollInterval={props?.autoScrollInterval}
          maxWidth={props?.maxWidth}
          variant={props?.variant}
          onSubmit={(question) => console.log("Question submitted:", question)}
        />

        <div className="prose prose-sm mt-8">
          <p className="text-gray-600">
            Article content continues naturally after the widget, creating a seamless reading experience.
          </p>
        </div>
      </div>
    </div>
  );
}

export function WomensWorldWidgetDemo(props?: {
  width?: number;
  height?: number;
  collapsedText?: string;
  title?: string;
  placeholder?: string;
  seedQuestionsRow1?: string[];
  seedQuestionsRow2?: string[];
  autoScrollInterval?: number;
  brandingText?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[600px] p-8 bg-gradient-to-br from-orange-50 to-purple-50">
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600 mb-6">
          Health Q&A widget with dual independent auto-scrolling seed question
          carousels
        </p>
        <WomensWorldWidget
          isExpanded={isExpanded}
          onExpandChange={setIsExpanded}
          onSubmit={(question) => console.log("Question submitted:", question)}
          width={props?.width}
          height={props?.height}
          collapsedText={props?.collapsedText}
          title={props?.title}
          placeholder={props?.placeholder}
          seedQuestionsRow1={props?.seedQuestionsRow1}
          seedQuestionsRow2={props?.seedQuestionsRow2}
          autoScrollInterval={props?.autoScrollInterval}
          brandingText={props?.brandingText}
        />
      </div>
    </div>
  );
}

// Eater Component Demos
export function EaterHeaderDemo() {
  return (
    <div className="flex items-center justify-center p-8 bg-[#EFD9CE]">
      <EaterHeader />
    </div>
  );
}

export function EaterQuestionPillDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex items-center gap-2 p-8 bg-[#EFD9CE]">
      <EaterQuestionPill
        question="Where can I find the best tacos in NYC?"
        onClick={() => setSelected(!selected)}
        isSelected={selected}
      />
      <EaterQuestionPill
        question="What are the top new restaurants this month?"
        onClick={() => {}}
        isSelected={false}
      />
    </div>
  );
}

export function EaterSearchInputSectionDemo() {
  const seedQuestions = [
    "Where can I find the best tacos in NYC?",
    "What are the top new restaurants?",
    "Best brunch spots near me?",
  ];

  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-md p-8 bg-[#EFD9CE] rounded-xl">
      <EaterSearchInputSection
        placeholder="Ask about restaurants..."
        value={value}
        onChange={setValue}
        onSubmit={() => console.log("Submitted:", value)}
        canSubmit={value.trim().length > 0}
      />
    </div>
  );
}

export function EaterSeedQuestionPillsDemo() {
  const [selected, setSelected] = useState("");

  const questions = [
    "Where can I find the best tacos in NYC?",
    "What are the top new restaurants this month?",
    "Best brunch spots near me?",
  ];

  return (
    <div className="w-full max-w-2xl p-8 bg-[#EFD9CE]">
      <EaterSeedQuestionPills
        questions={questions}
        onQuestionClick={setSelected}
        selectedQuestion={selected}
      />
    </div>
  );
}

export function EaterWidgetDemo() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[600px] p-8 bg-[#EFD9CE]">
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600 mb-6">
          Food discovery widget with restaurant recommendations
        </p>
        <EaterWidget
          isExpanded={isExpanded}
          onExpandChange={setIsExpanded}
          onSubmit={(question) => console.log("Question submitted:", question)}
        />
      </div>
    </div>
  );
}

// Demo component mapping for dynamic rendering
export const WIDGET_DEMOS: Record<string, (props?: any) => React.ReactElement> = {
  "blue-star": BlueStarDemo,
  "powered-by-button": PoweredByButtonDemo,
  "profile-blank": ProfileBlankDemo,
  wand: WandDemo,
  "searching-animation": SearchingAnimationDemo,
  "dual-phase-progress": DualPhaseProgressDemo,
  "simple-progress-bar": SimpleProgressBarDemo,
  "readiness-score-gauge": ReadinessScoreGaugeDemo,
  "question-pill": QuestionPillDemo,
  "seed-questions-carousel": SeedQuestionsCarouselDemo,
  "search-input-section": SearchInputSectionDemo,
  "glass-widget-container": GlassWidgetContainerDemo,
  "answer-widget-container": AnswerWidgetContainerDemo,
  "gif-housing": GifHousingDemo,
  "success-phase": SuccessPhaseDemo,
  "prompt-input": PromptInputDemo,
  "pricing-card": PricingCardDemo,
  "onboarding-widget": OnboardingWidgetDemo,
  "womens-world-inline-widget": WomensWorldInlineWidgetDemo,
  "womens-world-widget": WomensWorldWidgetDemo,
  "eater-header": EaterHeaderDemo,
  "eater-question-pill": EaterQuestionPillDemo,
  "eater-search-input-section": EaterSearchInputSectionDemo,
  "eater-seed-question-pills": EaterSeedQuestionPillsDemo,
  "eater-widget": EaterWidgetDemo,
};
