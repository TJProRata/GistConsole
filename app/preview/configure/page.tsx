"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PreviewFlowStepper } from "@/components/PreviewFlowStepper";
import { ColorGradientPicker } from "@/components/ColorGradientPicker";
import { PreviewWidgetRenderer } from "@/components/PreviewWidgetRenderer";
import { ExampleIconSelector } from "@/components/ExampleIconSelector";
import { usePreviewSession } from "@/lib/hooks/usePreviewSession";
import { useAppearanceConfig } from "@/lib/hooks/useAppearanceConfig";
import AppearanceSection from "@/components/AppearanceSection";
import SortableCategoryList from "@/components/SortableCategoryList";
import { ArrowRight, Loader2, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    colorMode: "border" as "border" | "fill",
  });
  const [nytConfig, setNytConfig] = useState({
    collapsedText: "Ask",
    title: "Ask Anything!",
    placeholder: "Ask anything",
    followUpPlaceholder: "Ask a follow up...",
    customIconSvg: "",
  });
  const [suggestionCategories, setSuggestionCategories] = useState<string[]>([
    "Top Stories",
    "Breaking News",
    "Sports",
    "Technology",
  ]);
  const [womensWorldConfig, setWomensWorldConfig] = useState({
    collapsedText: "Ask AI",
    title: "✨ Woman's World Answers",
    placeholder: "Ask us your health questions",
    seedQuestionsRow1: [
      "What's the best bread for weight loss?",
      "Can I prevent dementia?",
      "Is there a link between trauma and autoimmune symptoms?",
    ],
    seedQuestionsRow2: [
      "How can I make Hamburger Helper healthier?",
      "What are natural ways to boost energy?",
      "How do I improve my gut health?",
    ],
    autoScroll: true,
    brandingText: "Powered by Gist.ai",
    enableStreaming: true,
  });
  const [variant, setVariant] = useState<"inline" | "floating">("floating");
  const [placement, setPlacement] = useState<"bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left">("bottom-right");
  const [openByDefault, setOpenByDefault] = useState(false);

  // New appearance configuration hook
  const { border, background, text, aiStars, setBorder, setBackground, setText, setAiStars, merged } = useAppearanceConfig();

  // Custom Icon File Upload State
  const [customIconFile, setCustomIconFile] = useState<File | null>(null);
  const [customIconPreview, setCustomIconPreview] = useState<string | null>(null);
  const [customIconStorageId, setCustomIconStorageId] = useState<Id<"_storage"> | null>(null);
  const [customIconPath, setCustomIconPath] = useState<string | null>(null);
  const [customIconError, setCustomIconError] = useState<string | null>(null);
  const [isUploadingCustomIcon, setIsUploadingCustomIcon] = useState(false);
  const customIconInputRef = useRef<HTMLInputElement>(null);

  // Convex hooks for custom icon file upload
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const customIconUrl = useQuery(
    api.files.getUrl,
    customIconStorageId ? { storageId: customIconStorageId } : "skip"
  );

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
          colorMode: config.colorMode ?? "border",
        });
        setNytConfig({
          collapsedText: config.collapsedText ?? "Ask",
          title: config.title ?? "Ask Anything!",
          placeholder: config.placeholder ?? "Ask anything",
          followUpPlaceholder: config.followUpPlaceholder ?? "Ask a follow up...",
          customIconSvg: (config as any).customIconSvg ?? "",
        });

        // Load suggestion categories into separate state
        setSuggestionCategories(config.suggestionCategories ?? ["Top Stories", "Breaking News", "Sports", "Technology"]);

        // Load custom icon storage ID into separate state for file upload management
        if ((config as any).customIconStorageId) {
          setCustomIconStorageId((config as any).customIconStorageId);
        }

        const configAny = config as any;
        const row1 = configAny.seedQuestionsRow1 ?? [
          "What's the best bread for weight loss?",
          "Can I prevent dementia?",
          "Is there a link between trauma and autoimmune symptoms?",
        ];
        const row2 = configAny.seedQuestionsRow2 ?? [
          "How can I make Hamburger Helper healthier?",
          "What are natural ways to boost energy?",
          "How do I improve my gut health?",
        ];

        setWomensWorldConfig({
          collapsedText: config.collapsedText ?? "Ask AI",
          title: config.title ?? "✨ Woman's World Answers",
          placeholder: config.placeholder ?? "Ask us your health questions",
          seedQuestionsRow1: row1,
          seedQuestionsRow2: row2,
          autoScroll: configAny.autoScroll ?? true,
          brandingText: config.brandingText ?? "Powered by Gist.ai",
          enableStreaming: configAny.enableStreaming ?? true,
        });
        setVariant(configAny.variant ?? "floating");
        setOpenByDefault(config.openByDefault ?? false);
      }
    }
  }, [previewConfig, sessionLoading, router]);

  // Debounced save
  useEffect(() => {
    if (!sessionId || !previewConfig) return;

    const timeout = setTimeout(async () => {
      try {
        const baseConfig = {
          ...colorConfig,
          placement: "bottom-center" as const,
          variant,
          openByDefault,
          ...(previewConfig.widgetType === "womensWorld" ? womensWorldConfig : {
            ...nytConfig,
            suggestionCategories, // Add suggestionCategories array
          }),
          ...merged, // New appearance configuration (spread last to take precedence)
        };

        // Remove null customIconStorageId from nytConfig spread
        if ((baseConfig as any).customIconStorageId === null) {
          delete (baseConfig as any).customIconStorageId;
        }

        // Add customIconStorageId if it exists
        if (customIconStorageId) {
          (baseConfig as any).customIconStorageId = customIconStorageId;
        }

        // Add customIconPath if it exists
        if (customIconPath) {
          (baseConfig as any).customIconPath = customIconPath;
        }

        await updateConfig({
          sessionId,
          configuration: baseConfig as any,
        });
      } catch (err) {
        console.error("Error saving configuration:", err);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [sessionId, colorConfig, nytConfig, womensWorldConfig, suggestionCategories, variant, openByDefault, customIconStorageId, customIconPath, previewConfig, updateConfig, merged]);

  const handleContinue = () => {
    router.push("/preview/demo");
  };

  // Custom Icon File Upload Handlers
  const handleCustomIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes("svg")) {
      setCustomIconError("Please upload an SVG file");
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setCustomIconError("File size must be less than 1MB");
      return;
    }

    setCustomIconError(null);
    setCustomIconFile(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setCustomIconPreview(previewUrl);

    // Auto-upload the file
    uploadCustomIcon(file);
  };

  const uploadCustomIcon = async (file: File) => {
    setIsUploadingCustomIcon(true);
    setCustomIconError(null);

    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Failed to upload file");
      }

      const { storageId } = await result.json();
      setCustomIconStorageId(storageId);

      // Update nytConfig with the new storageId
      setNytConfig((prev) => ({
        ...prev,
        customIconSvg: "", // Clear deprecated field
      }));
    } catch (error) {
      console.error("Error uploading custom icon:", error);
      setCustomIconError("Failed to upload icon. Please try again.");
      clearCustomIcon();
    } finally {
      setIsUploadingCustomIcon(false);
    }
  };

  const clearCustomIcon = () => {
    if (customIconPreview) {
      URL.revokeObjectURL(customIconPreview);
    }
    setCustomIconFile(null);
    setCustomIconPreview(null);
    setCustomIconStorageId(null);
    setCustomIconPath(null);
    setCustomIconError(null);
    setNytConfig((prev) => ({
      ...prev,
      customIconSvg: "",
    }));
    if (customIconInputRef.current) {
      customIconInputRef.current.value = "";
    }
  };

  const handleSelectExample = (path: string) => {
    // Clear uploaded file state
    clearCustomIcon();

    // Set the example path
    setCustomIconPath(path);
    setCustomIconError(null);
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
                {/* Three independent appearance sections */}
                <AppearanceSection
                  title="Button Border"
                  value={border}
                  onChange={setBorder}
                  showNoneOption={false}
                />

                <AppearanceSection
                  title="Button Background"
                  value={background}
                  onChange={setBackground}
                  showNoneOption={false}
                />

                <AppearanceSection
                  title="Button Text"
                  value={text}
                  onChange={setText}
                  showNoneOption={false}
                />

                <AppearanceSection
                  title="AI Stars Icon"
                  value={aiStars}
                  onChange={setAiStars}
                  showNoneOption={false}
                />
              </TabsContent>

              <TabsContent value="behavior">
                <Card className="p-4">
                  <div className="space-y-4">
                    {previewConfig.widgetType === "floating" && (
                      <div>
                        <Label htmlFor="placement">Widget Placement</Label>
                        <Select value={placement} onValueChange={(value: typeof placement) => setPlacement(value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-center">Bottom Center</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Position of the widget on the page
                        </p>
                      </div>
                    )}
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
                        <Label htmlFor="suggestionCategories">Suggestion Categories</Label>
                        <SortableCategoryList
                          categories={suggestionCategories}
                          onChange={setSuggestionCategories}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Categories shown as quick suggestions (drag to reorder)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="custom-icon-upload">Custom Icon SVG (Optional)</Label>

                        <input
                          ref={customIconInputRef}
                          type="file"
                          accept=".svg,image/svg+xml"
                          onChange={handleCustomIconChange}
                          className="hidden"
                          id="custom-icon-upload"
                        />

                        <div className="mt-2 space-y-3">
                          {!customIconFile ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => customIconInputRef.current?.click()}
                              disabled={isUploadingCustomIcon}
                              className="w-full"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {isUploadingCustomIcon ? "Uploading..." : "Upload SVG Icon"}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
                              {customIconPreview && (
                                <img
                                  src={customIconPreview}
                                  alt="Custom icon preview"
                                  className="w-9 h-9 flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{customIconFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(customIconFile.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearCustomIcon}
                                disabled={isUploadingCustomIcon}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {/* Example Icon Selector - only show when no file and no example selected */}
                          {!customIconFile && !customIconPath && (
                            <>
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                  <span className="bg-background px-2 text-muted-foreground">
                                    Or browse examples
                                  </span>
                                </div>
                              </div>

                              <ExampleIconSelector
                                onSelect={handleSelectExample}
                                selectedPath={customIconPath}
                              />
                            </>
                          )}

                          {/* Show preview of selected example icon */}
                          {customIconPath && !customIconFile && (
                            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
                              <img
                                src={customIconPath}
                                alt="Selected example icon"
                                className="w-9 h-9 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Example Icon</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {customIconPath.split('/').pop()}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearCustomIcon}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {customIconError && (
                            <p className="text-xs text-destructive">{customIconError}</p>
                          )}

                          <p className="text-xs text-muted-foreground">
                            Upload an SVG file (max 1MB), choose an example icon, or leave empty for default profile icon
                          </p>
                        </div>
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
                        value={variant}
                        onValueChange={(value) => setVariant(value as "inline" | "floating")}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card
                            className={cn(
                              "cursor-pointer border-2 p-4 transition-all hover:border-primary",
                              variant === "floating" ? "border-primary bg-primary/5" : ""
                            )}
                            onClick={() => setVariant("floating")}
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
                              variant === "inline" ? "border-primary bg-primary/5" : ""
                            )}
                            onClick={() => setVariant("inline")}
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
                      {variant === "floating" && (
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
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          First carousel row (one question per line). Health/medical focus recommended.
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
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Second carousel row (one question per line). Wellness/lifestyle focus recommended.
                        </p>
                      </div>

                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Auto-scroll Seed Questions</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically scroll through seed questions
                          </p>
                        </div>
                        <Switch
                          checked={womensWorldConfig.autoScroll}
                          onCheckedChange={(checked) =>
                            setWomensWorldConfig({ ...womensWorldConfig, autoScroll: checked })
                          }
                        />
                      </div>

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
                      placement: "bottom-center",
                      womensWorldVariant: variant,
                      openByDefault,
                      ...(previewConfig.widgetType === "womensWorld" ? womensWorldConfig : {
                        ...nytConfig,
                        suggestionCategories,
                      }),
                      customIconStorageId: customIconStorageId || undefined,
                      customIconUrl: customIconUrl || undefined,
                      customIconPath: customIconPath || undefined,
                      ...merged,
                    }}
                    isDemo={false}
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
