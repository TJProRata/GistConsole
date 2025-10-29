"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PreviewFlowStepper } from "@/components/PreviewFlowStepper";
import { ColorGradientPicker } from "@/components/ColorGradientPicker";
import { PreviewWidgetRenderer } from "@/components/PreviewWidgetRenderer";
import { usePreviewSession } from "@/lib/hooks/usePreviewSession";
import { ArrowRight, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const steps = [
  { id: "api-key", name: "API Key", href: "/preview" },
  { id: "select-widget", name: "Widget Type", href: "/preview/select-widget" },
  { id: "configure", name: "Configure", href: "/preview/configure" },
  { id: "demo", name: "Preview", href: "/preview/demo" },
];

export default function ConfigurePage() {
  const router = useRouter();
  const { sessionId, isLoading: sessionLoading } = usePreviewSession();
  const [error, setError] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  const previewConfig = useQuery(
    api.previewConfigurations.getPreviewConfig,
    sessionId ? { sessionId } : "skip"
  );
  const updateConfig = useMutation(
    api.previewConfigurations.updatePreviewConfig
  );

  const [colorConfig, setColorConfig] = useState({
    useGradient: false,
    primaryColor: "#3b82f6",
    gradientStart: "#3b82f6",
    gradientEnd: "#8b5cf6",
  });
  const [placement, setPlacement] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center"
  >("bottom-right");
  const [width, setWidth] = useState([400]);
  const [height, setHeight] = useState([500]);
  const [nytConfig, setNytConfig] = useState({
    collapsedText: "Ask",
    title: "Ask Anything!",
    placeholder: "Ask anything",
    followUpPlaceholder: "Ask a follow up...",
    suggestionCategories: ["Top Stories", "Breaking News", "Sports", "Technology"],
    brandingText: "Powered by Gist Answers",
  });
  const [womensWorldConfig, setWomensWorldConfig] = useState({
    collapsedText: "Ask AI",
    title: "✨ Woman's World Answers",
    placeholder: "Ask us your health questions",
    seedQuestions: [
      "What's the best bread for weight loss?",
      "How can I make Hamburger Helper healthier?",
      "Can I prevent dementia?",
      "Is there a link between trauma and autoimmune symptoms?",
      "What are natural ways to boost energy?",
      "How do I improve my gut health?",
    ],
    autoScrollInterval: 3000,
    brandingText: "Powered by Gist.ai",
    enableStreaming: true,
  });
  const [womensWorldVariant, setWomensWorldVariant] = useState<"inline" | "floating">("floating");
  const [openByDefault, setOpenByDefault] = useState(false);

  useEffect(() => {
    if (!sessionLoading && previewConfig) {
      if (!previewConfig.widgetType) {
        router.push("/preview/select-widget");
      }

      if (previewConfig.configuration) {
        const config = previewConfig.configuration;
        setColorConfig({
          useGradient: config.useGradient ?? false,
          primaryColor: config.primaryColor ?? "#3b82f6",
          gradientStart: config.gradientStart ?? "#3b82f6",
          gradientEnd: config.gradientEnd ?? "#8b5cf6",
        });
        setPlacement(config.placement ?? "bottom-right");
        setWidth([config.width ?? 400]);
        setHeight([config.height ?? 500]);
        setNytConfig({
          collapsedText: config.collapsedText ?? "Ask",
          title: config.title ?? "Ask Anything!",
          placeholder: config.placeholder ?? "Ask anything",
          followUpPlaceholder: config.followUpPlaceholder ?? "Ask a follow up...",
          suggestionCategories: config.suggestionCategories ?? ["Top Stories", "Breaking News", "Sports", "Technology"],
          brandingText: config.brandingText ?? "Powered by Gist Answers",
        });
        setWomensWorldConfig({
          collapsedText: config.collapsedText ?? "Ask AI",
          title: config.title ?? "✨ Woman's World Answers",
          placeholder: config.placeholder ?? "Ask us your health questions",
          seedQuestions: config.seedQuestions ?? [
            "What's the best bread for weight loss?",
            "How can I make Hamburger Helper healthier?",
            "Can I prevent dementia?",
            "Is there a link between trauma and autoimmune symptoms?",
            "What are natural ways to boost energy?",
            "How do I improve my gut health?",
          ],
          autoScrollInterval: config.autoScrollInterval ?? 3000,
          brandingText: config.brandingText ?? "Powered by Gist.ai",
        });
        setWomensWorldVariant(config.womensWorldVariant ?? "floating");
        setOpenByDefault(config.openByDefault ?? false);
      }
    }
  }, [previewConfig, sessionLoading, router]);

  // Debounced save
  useEffect(() => {
    if (!sessionId || !previewConfig) return;

    const timeout = setTimeout(async () => {
      try {
        await updateConfig({
          sessionId,
          configuration: {
            ...colorConfig,
            placement,
            width: width[0],
            height: height[0],
            textColor: "#ffffff",
            womensWorldVariant,
            openByDefault,
            ...(previewConfig.widgetType === "floating" ? nytConfig : womensWorldConfig),
          },
        });
      } catch (err) {
        console.error("Error saving configuration:", err);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [sessionId, colorConfig, placement, width, height, nytConfig, womensWorldConfig, womensWorldVariant, openByDefault, previewConfig, updateConfig]);

  const handleContinue = () => {
    router.push("/preview/demo");
  };

  if (sessionLoading || !previewConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <div className="mb-8">
        <PreviewFlowStepper steps={steps} currentStep="configure" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Configure Your Widget</h1>
          <p className="text-muted-foreground">
            Customize colors, dimensions, and behavior
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Configuration Panel */}
          <div>
            <Tabs defaultValue="appearance">
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

              <TabsContent value="appearance" className="space-y-6">
                <ColorGradientPicker
                  value={colorConfig}
                  onChange={setColorConfig}
                />
              </TabsContent>

              <TabsContent value="behavior">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Widget Placement</Label>
                      <RadioGroup value={placement} onValueChange={(v: any) => setPlacement(v)}>
                        {/* Women's World Widget: Only bottom positions */}
                        {previewConfig.widgetType === "womensWorld" ? (
                          <>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="bottom-left" id="bottom-left" />
                              <Label htmlFor="bottom-left">Bottom Left</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="bottom-center" id="bottom-center" />
                              <Label htmlFor="bottom-center">Bottom Center</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="bottom-right" id="bottom-right" />
                              <Label htmlFor="bottom-right">Bottom Right</Label>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Other widgets: All 4 corner positions */}
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="bottom-right" id="bottom-right" />
                              <Label htmlFor="bottom-right">Bottom Right</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="bottom-left" id="bottom-left" />
                              <Label htmlFor="bottom-left">Bottom Left</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="top-right" id="top-right" />
                              <Label htmlFor="top-right">Top Right</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="top-left" id="top-left" />
                              <Label htmlFor="top-left">Top Left</Label>
                            </div>
                          </>
                        )}
                      </RadioGroup>
                    </div>

                    {/* Dimensions: Variant-Specific Controls */}
                    {previewConfig.widgetType === "womensWorld" && (
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Dimensions</h4>

                        {/* Floating Variant: Width + Height */}
                        {womensWorldVariant === "floating" && (
                          <>
                            <div className="mb-4">
                              <Label>Widget Width: {width[0]}px</Label>
                              <Slider
                                value={width}
                                onValueChange={setWidth}
                                min={300}
                                max={500}
                                step={10}
                                className="mt-2"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Width of the expanded widget (floating variant)
                              </p>
                            </div>

                            <div>
                              <Label>Widget Height: {height[0]}px</Label>
                              <Slider
                                value={height}
                                onValueChange={setHeight}
                                min={400}
                                max={700}
                                step={10}
                                className="mt-2"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Height of the expanded widget (floating variant)
                              </p>
                            </div>
                          </>
                        )}

                        {/* Inline Variant: Max Width Only */}
                        {womensWorldVariant === "inline" && (
                          <div>
                            <Label>Max Width: {width[0]}px</Label>
                            <Slider
                              value={width}
                              onValueChange={setWidth}
                              min={400}
                              max={800}
                              step={20}
                              className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Maximum width constraint for inline widget (responsive within container)
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <Label className="mb-3 block">Preview Theme</Label>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setPreviewTheme("light")}
                          variant={previewTheme === "light" ? "default" : "outline"}
                          className="flex-1"
                        >
                          ☀️ Light
                        </Button>
                        <Button
                          onClick={() => setPreviewTheme("dark")}
                          variant={previewTheme === "dark" ? "default" : "outline"}
                          className="flex-1"
                        >
                          🌙 Dark
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Open by Default</Label>
                          <p className="text-sm text-muted-foreground">
                            Widget will be expanded when page loads
                          </p>
                        </div>
                        <Switch
                          checked={openByDefault}
                          onCheckedChange={setOpenByDefault}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {/* NYT Chat Widget Controls */}
                {previewConfig.widgetType === "floating" && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4">Widget Text Customization</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="collapsedText">Collapsed Button Text</Label>
                        <Input
                          id="collapsedText"
                          value={nytConfig.collapsedText}
                          onChange={(e) =>
                            setNytConfig({ ...nytConfig, collapsedText: e.target.value })
                          }
                          placeholder="Ask"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Text shown on the collapsed button
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="title">Widget Title</Label>
                        <Input
                          id="title"
                          value={nytConfig.title}
                          onChange={(e) =>
                            setNytConfig({ ...nytConfig, title: e.target.value })
                          }
                          placeholder="Ask Anything!"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Main title shown in the expanded widget
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="placeholder">Search Placeholder</Label>
                        <Input
                          id="placeholder"
                          value={nytConfig.placeholder}
                          onChange={(e) =>
                            setNytConfig({ ...nytConfig, placeholder: e.target.value })
                          }
                          placeholder="Ask anything"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Placeholder text for the search input
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="followUpPlaceholder">Follow-up Placeholder</Label>
                        <Input
                          id="followUpPlaceholder"
                          value={nytConfig.followUpPlaceholder}
                          onChange={(e) =>
                            setNytConfig({ ...nytConfig, followUpPlaceholder: e.target.value })
                          }
                          placeholder="Ask a follow up..."
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Placeholder for follow-up questions
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="brandingText">Branding Text</Label>
                        <Input
                          id="brandingText"
                          value={nytConfig.brandingText}
                          onChange={(e) =>
                            setNytConfig({ ...nytConfig, brandingText: e.target.value })
                          }
                          placeholder="Powered by Gist Answers"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Footer branding text
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="suggestionCategories">Suggestion Categories</Label>
                        <Textarea
                          id="suggestionCategories"
                          value={nytConfig.suggestionCategories.join(", ")}
                          onChange={(e) =>
                            setNytConfig({
                              ...nytConfig,
                              suggestionCategories: e.target.value
                                .split(",")
                                .map((c) => c.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Top Stories, Breaking News, Sports, Technology"
                          className="mt-2"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Comma-separated list of suggestion categories
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Women's World Widget Controls */}
                {previewConfig.widgetType === "womensWorld" && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4">Women's World Widget Customization</h3>

                    {/* Variant Selector */}
                    <div className="mb-6 pb-6 border-b">
                      <Label className="mb-3 block">Widget Variant</Label>
                      <RadioGroup
                        value={womensWorldVariant}
                        onValueChange={(value) => setWomensWorldVariant(value as "inline" | "floating")}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card
                            className={cn(
                              "cursor-pointer border-2 p-4 transition-all hover:border-primary",
                              womensWorldVariant === "floating" ? "border-primary bg-primary/5" : ""
                            )}
                            onClick={() => setWomensWorldVariant("floating")}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <RadioGroupItem value="floating" id="floating" />
                              <Label htmlFor="floating" className="cursor-pointer font-semibold">
                                Floating Widget
                              </Label>
                            </div>
                            <p className="text-xs text-muted-foreground ml-6">
                              Collapsible bottom-corner widget. Perfect for persistent availability without disrupting content.
                            </p>
                          </Card>

                          <Card
                            className={cn(
                              "cursor-pointer border-2 p-4 transition-all hover:border-primary",
                              womensWorldVariant === "inline" ? "border-primary bg-primary/5" : ""
                            )}
                            onClick={() => setWomensWorldVariant("inline")}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <RadioGroupItem value="inline" id="inline" />
                              <Label htmlFor="inline" className="cursor-pointer font-semibold">
                                Inline Widget
                              </Label>
                            </div>
                            <p className="text-xs text-muted-foreground ml-6">
                              Always-expanded embedded widget. Ideal for in-article placement and content integration.
                            </p>
                          </Card>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      {/* Collapsed Text Input - Only for Floating Variant */}
                      {womensWorldVariant === "floating" && (
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
                            Text shown on the collapsed button (floating variant only)
                          </p>
                        </div>
                      )}

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
                        <Label htmlFor="ww-seedQuestions">Seed Questions</Label>
                        <Textarea
                          id="ww-seedQuestions"
                          value={womensWorldConfig.seedQuestions.join("\n")}
                          onChange={(e) =>
                            setWomensWorldConfig({
                              ...womensWorldConfig,
                              seedQuestions: e.target.value
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
                          Enter one seed question per line for the carousel
                        </p>
                      </div>

                      <div>
                        <Label>Auto-scroll Interval: {womensWorldConfig.autoScrollInterval}ms</Label>
                        <Slider
                          value={[womensWorldConfig.autoScrollInterval]}
                          onValueChange={([value]) =>
                            setWomensWorldConfig({ ...womensWorldConfig, autoScrollInterval: value })
                          }
                          min={1000}
                          max={10000}
                          step={500}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          How often the carousel auto-scrolls (1-10 seconds)
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">OpenAI Streaming Answers</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable real-time AI-powered answers using OpenAI (requires OPENAI_API_KEY)
                            </p>
                          </div>
                          <Switch
                            checked={womensWorldConfig.enableStreaming}
                            onCheckedChange={(checked) =>
                              setWomensWorldConfig({ ...womensWorldConfig, enableStreaming: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Rufus Widget Controls */}
                {previewConfig.widgetType === "rufus" && (
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Rufus widget uses default configuration. Customize colors in the Appearance tab.
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={handleContinue}
            >
              Preview in Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Live Preview */}
          <div>
            <Card className="relative h-[600px] overflow-hidden">
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br",
                previewTheme === "dark"
                  ? "dark from-gray-900 to-gray-800"
                  : "from-gray-50 to-gray-100"
              )}>
                <div className="p-8">
                  <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    See your widget in real-time
                  </p>
                </div>

                {previewConfig.widgetType && (
                  <PreviewWidgetRenderer
                    widgetType={previewConfig.widgetType}
                    configuration={{
                      ...colorConfig,
                      placement,
                      width: width[0],
                      height: height[0],
                      textColor: "#ffffff",
                      womensWorldVariant,
                      openByDefault,
                      ...(previewConfig.widgetType === "floating" ? nytConfig : womensWorldConfig),
                    }}
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
