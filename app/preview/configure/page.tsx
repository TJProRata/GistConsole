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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    "bottom-right" | "bottom-left" | "top-right" | "top-left"
  >("bottom-right");
  const [width, setWidth] = useState([400]);
  const [height, setHeight] = useState([500]);

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
          },
        });
      } catch (err) {
        console.error("Error saving configuration:", err);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [sessionId, colorConfig, placement, width, height, previewConfig, updateConfig]);

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
              </TabsList>

              <TabsContent value="appearance" className="space-y-6">
                <ColorGradientPicker
                  value={colorConfig}
                  onChange={setColorConfig}
                />

                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Width: {width[0]}px</Label>
                      <Slider
                        value={width}
                        onValueChange={setWidth}
                        min={300}
                        max={600}
                        step={10}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Height: {height[0]}px</Label>
                      <Slider
                        value={height}
                        onValueChange={setHeight}
                        min={300}
                        max={700}
                        step={10}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="behavior">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Widget Placement</Label>
                      <RadioGroup value={placement} onValueChange={(v: any) => setPlacement(v)}>
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
                      </RadioGroup>
                    </div>
                  </div>
                </Card>
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
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
