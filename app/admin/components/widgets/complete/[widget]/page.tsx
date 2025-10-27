"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ComponentPreview } from "@/components/ComponentPreview";
import { WIDGET_DEMOS } from "@/components/component-previews/widget-demos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PageProps {
  params: Promise<{ widget: string }>;
}

export default function CompleteWidgetPreviewPage({ params }: PageProps) {
  const { widget } = use(params);
  const widgetData = useQuery(api.componentPreviews.getWidgetPreview, {
    widgetName: widget,
  });

  // Dimension controls state (only for womens-world-widget)
  const [widgetWidth, setWidgetWidth] = useState(392);

  // Women's World Widget configuration state
  const [womensWorldConfig, setWomensWorldConfig] = useState({
    collapsedText: "Ask AI",
    title: "✨ Woman's World Answers",
    placeholder: "Ask us your health questions",
    seedQuestionsRow1: [
      "What's the best bread for weight loss?",
      "Can I prevent dementia?",
      "Is there a link between trauma and autoimmune symptoms?",
      "How do I improve my gut health?",
      "What are signs of vitamin deficiency?",
      "Can exercise reduce inflammation?",
    ],
    seedQuestionsRow2: [
      "How can I make Hamburger Helper healthier?",
      "What are natural ways to boost energy?",
      "Best morning routine for productivity?",
      "How much water should I drink daily?",
      "What foods improve sleep quality?",
      "Natural remedies for stress relief?",
    ],
    autoScrollInterval: 35000,
    brandingText: "Powered by Gist.ai",
  });

  // Loading state
  if (widgetData === undefined) {
    return (
      <div className="p-8 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Metadata Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Navigation Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Preview Skeleton */}
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error state - widget not found
  if (widgetData === null) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Widget "{widget}" not found. Please check the widget name and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/admin/components/widgets?tab=widgets">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Widgets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get the demo component
  const DemoComponent = WIDGET_DEMOS[widget];

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground space-x-2">
        <Link href="/admin" className="hover:text-foreground">Admin</Link>
        <span>/</span>
        <Link href="/admin/components" className="hover:text-foreground">Components</Link>
        <span>/</span>
        <Link href="/admin/components/widgets" className="hover:text-foreground">
          Widget Components
        </Link>
        <span>/</span>
        <Link href="/admin/components/widgets?tab=widgets" className="hover:text-foreground">
          Widgets
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium capitalize">{widget.replace(/-/g, " ")}</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold capitalize">{widget.replace(/-/g, " ")}</h1>
        </div>
        <p className="text-muted-foreground">{widgetData.description}</p>
        <div className="flex gap-2">
          {widgetData.phases && (
            <Badge variant="secondary">
              {widgetData.phases} Phases
            </Badge>
          )}
          {widgetData.componentCount && (
            <Badge variant="outline">
              {widgetData.componentCount} Components
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation Between Widgets */}
      <div className="flex items-center justify-between border-y py-4">
        <div>
          {widgetData.navigation.previous ? (
            <Button asChild variant="outline">
              <Link href={`/admin/components/widgets/complete/${widgetData.navigation.previous}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="capitalize">{widgetData.navigation.previous.replace(/-/g, " ")}</span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {widgetData.navigation.current} of {widgetData.navigation.total}
        </div>

        <div>
          {widgetData.navigation.next ? (
            <Button asChild variant="outline">
              <Link href={`/admin/components/widgets/complete/${widgetData.navigation.next}`}>
                <span className="capitalize">{widgetData.navigation.next.replace(/-/g, " ")}</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Widget Configuration Controls - Admin Preview Only */}
      {widget === "womens-world-widget" && (
        <div className="mb-6 p-4 border rounded-lg bg-white">
          <h3 className="text-sm font-semibold mb-4">Widget Configuration (Preview Only)</h3>

          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="appearance" className="flex-1">
                Appearance
              </TabsTrigger>
              <TabsTrigger value="behavior" className="flex-1">
                Behavior
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1">
                Content
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="widget-width">Width</Label>
                  <span className="text-sm text-muted-foreground">{widgetWidth}px</span>
                </div>
                <Slider
                  id="widget-width"
                  min={392}
                  max={800}
                  step={8}
                  value={[widgetWidth]}
                  onValueChange={(value) => setWidgetWidth(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Adjust width to test widget responsiveness. Current width: {widgetWidth}px
                </p>
              </div>
            </TabsContent>

            {/* Behavior Tab */}
            <TabsContent value="behavior" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-scroll-interval">Auto-scroll Interval</Label>
                  <span className="text-sm text-muted-foreground">{womensWorldConfig.autoScrollInterval}ms</span>
                </div>
                <Slider
                  id="auto-scroll-interval"
                  min={30000}
                  max={40000}
                  step={500}
                  value={[womensWorldConfig.autoScrollInterval]}
                  onValueChange={(value) =>
                    setWomensWorldConfig({ ...womensWorldConfig, autoScrollInterval: value[0] })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  How often the carousel auto-scrolls (30-40 seconds)
                </p>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="ww-collapsedText">Collapsed Button Text</Label>
                <Input
                  id="ww-collapsedText"
                  value={womensWorldConfig.collapsedText}
                  onChange={(e) =>
                    setWomensWorldConfig({ ...womensWorldConfig, collapsedText: e.target.value })
                  }
                  placeholder="Ask AI"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Text shown on the collapsed button
                </p>
              </div>

              <div>
                <Label htmlFor="ww-title">Widget Title</Label>
                <Input
                  id="ww-title"
                  value={womensWorldConfig.title}
                  onChange={(e) =>
                    setWomensWorldConfig({ ...womensWorldConfig, title: e.target.value })
                  }
                  placeholder="✨ Woman's World Answers"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Main title shown in the expanded widget
                </p>
              </div>

              <div>
                <Label htmlFor="ww-placeholder">Search Placeholder</Label>
                <Input
                  id="ww-placeholder"
                  value={womensWorldConfig.placeholder}
                  onChange={(e) =>
                    setWomensWorldConfig({ ...womensWorldConfig, placeholder: e.target.value })
                  }
                  placeholder="Ask us your health questions"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Placeholder text for the search input
                </p>
              </div>

              <div>
                <Label htmlFor="ww-brandingText">Branding Text</Label>
                <Input
                  id="ww-brandingText"
                  value={womensWorldConfig.brandingText}
                  onChange={(e) =>
                    setWomensWorldConfig({ ...womensWorldConfig, brandingText: e.target.value })
                  }
                  placeholder="Powered by Gist.ai"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Footer branding text
                </p>
              </div>

              <div>
                <Label htmlFor="ww-seedQuestionsRow1">
                  Seed Questions - Row 1
                </Label>
                <Textarea
                  id="ww-seedQuestionsRow1"
                  value={womensWorldConfig.seedQuestionsRow1.join("\n")}
                  onChange={(e) =>
                    setWomensWorldConfig({
                      ...womensWorldConfig,
                      seedQuestionsRow1: e.target.value
                        .split("\n")
                        .map((q) => q.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="One question per line"
                  className="mt-2"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  First carousel row (one question per line). Health/medical
                  focus recommended.
                </p>
              </div>

              <div>
                <Label htmlFor="ww-seedQuestionsRow2">
                  Seed Questions - Row 2
                </Label>
                <Textarea
                  id="ww-seedQuestionsRow2"
                  value={womensWorldConfig.seedQuestionsRow2.join("\n")}
                  onChange={(e) =>
                    setWomensWorldConfig({
                      ...womensWorldConfig,
                      seedQuestionsRow2: e.target.value
                        .split("\n")
                        .map((q) => q.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="One question per line"
                  className="mt-2"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Second carousel row (one question per line). Wellness/lifestyle
                  focus recommended.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Widget Preview */}
      {DemoComponent ? (
        <ComponentPreview>
          <ComponentPreview.Demo>
            {widget === "womens-world-widget" ? (
              <DemoComponent
                width={widgetWidth}
                seedQuestionsRow1={womensWorldConfig.seedQuestionsRow1}
                seedQuestionsRow2={womensWorldConfig.seedQuestionsRow2}
                collapsedText={womensWorldConfig.collapsedText}
                title={womensWorldConfig.title}
                placeholder={womensWorldConfig.placeholder}
                autoScrollInterval={womensWorldConfig.autoScrollInterval}
                brandingText={womensWorldConfig.brandingText}
              />
            ) : (
              <DemoComponent />
            )}
          </ComponentPreview.Demo>
          <ComponentPreview.Code code={widgetData.code} />
        </ComponentPreview>
      ) : (
        <Alert>
          <AlertDescription>
            Preview not available for this widget yet. Please check back later.
          </AlertDescription>
        </Alert>
      )}

      {/* Back Button */}
      <div className="pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/components/widgets?tab=widgets">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Widgets
          </Link>
        </Button>
      </div>
    </div>
  );
}
