"use client";

/**
 * New Page Answer Widget Preview Page
 * Interactive demo with theme customization and code display
 */

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { NewPageAnswerWidget } from "@/components/widget_components";
import type { BrandConfig } from "@/components/widget_components/types";

type ThemePreset = "default" | "eater" | "womens-world" | "custom";

const themePresets: Record<ThemePreset, BrandConfig> = {
  default: {
    name: "Gist Answers",
    primaryColor: "#6F61EF",
    secondaryColor: "#E19736",
    fonts: {
      heading: "system-ui, sans-serif",
      body: "system-ui, sans-serif",
    },
  },
  eater: {
    name: "Eater",
    primaryColor: "#E60001",
    secondaryColor: "#FFAF01",
    fonts: {
      heading: "Degular, sans-serif",
      body: "Literata, serif",
    },
  },
  "womens-world": {
    name: "Woman's World",
    primaryColor: "#FF6B6B",
    secondaryColor: "#A855F7",
    gradient: {
      start: "#FF6B6B",
      end: "#A855F7",
    },
    fonts: {
      heading: "system-ui, sans-serif",
      body: "system-ui, sans-serif",
    },
  },
  custom: {
    name: "Custom Brand",
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    fonts: {
      heading: "system-ui, sans-serif",
      body: "system-ui, sans-serif",
    },
  },
};

export default function NewPageAnswerWidgetPreview() {
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>("default");
  const [customBrand, setCustomBrand] = useState<BrandConfig>(themePresets.custom);
  const [testQuery, setTestQuery] = useState("What are the best restaurants in Los Angeles?");
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentBrand = selectedTheme === "custom" ? customBrand : themePresets[selectedTheme];

  const handleCopyCode = () => {
    const code = `import { NewPageAnswerWidget } from "@/components/widget_components";

<NewPageAnswerWidget
  initialQuery="${testQuery}"
  brandConfig={{
    name: "${currentBrand.name}",
    primaryColor: "${currentBrand.primaryColor}",
    secondaryColor: "${currentBrand.secondaryColor}",
    fonts: {
      heading: "${currentBrand.fonts?.heading}",
      body: "${currentBrand.fonts?.body}"
    }
  }}
  onClose={() => console.log("Widget closed")}
  onNewSearch={(query) => console.log("New search:", query)}
  onArticleClick={(id, url) => window.open(url, "_blank")}
/>`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/components/widgets"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Widgets
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              New Page Answer Widget
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered Q&A widget with streaming answers, source attribution, and article recommendations
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Complete Widget</Badge>
            <Badge variant="outline">Embeddable</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Configuration</CardTitle>
              <CardDescription>Customize the widget's appearance and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Preset Selector */}
              <div className="space-y-2">
                <Label>Theme Preset</Label>
                <Select value={selectedTheme} onValueChange={(v) => setSelectedTheme(v as ThemePreset)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Gist)</SelectItem>
                    <SelectItem value="eater">Eater</SelectItem>
                    <SelectItem value="womens-world">Woman's World</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Custom Theme Controls (only shown when custom selected) */}
              {selectedTheme === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand-name">Brand Name</Label>
                    <Input
                      id="brand-name"
                      value={customBrand.name}
                      onChange={(e) =>
                        setCustomBrand({ ...customBrand, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={customBrand.primaryColor}
                        onChange={(e) =>
                          setCustomBrand({ ...customBrand, primaryColor: e.target.value })
                        }
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={customBrand.primaryColor}
                        onChange={(e) =>
                          setCustomBrand({ ...customBrand, primaryColor: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={customBrand.secondaryColor}
                        onChange={(e) =>
                          setCustomBrand({ ...customBrand, secondaryColor: e.target.value })
                        }
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={customBrand.secondaryColor}
                        onChange={(e) =>
                          setCustomBrand({ ...customBrand, secondaryColor: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Test Query */}
              <div className="space-y-2">
                <Label htmlFor="test-query">Test Query</Label>
                <Input
                  id="test-query"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  placeholder="Enter a test question..."
                />
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Interactive demonstration of the widget with current configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`flex items-center justify-center min-h-[800px] p-8 ${
                  darkMode ? "dark bg-gray-900" : "bg-gray-50"
                }`}
              >
                <NewPageAnswerWidget
                  initialQuery={testQuery}
                  brandConfig={currentBrand}
                  onClose={() => console.log("Widget closed")}
                  onNewSearch={(query) => console.log("New search:", query)}
                  onArticleClick={(id, url) => {
                    console.log("Article clicked:", id, url);
                    window.open(url, "_blank", "noopener,noreferrer");
                  }}
                  onCitationClick={(id) => console.log("Citation clicked:", id)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Implementation Code</CardTitle>
                  <CardDescription>
                    Copy and paste this code to use the widget in your project
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">
                  {`import { NewPageAnswerWidget } from "@/components/widget_components";

<NewPageAnswerWidget
  initialQuery="${testQuery}"
  brandConfig={{
    name: "${currentBrand.name}",
    primaryColor: "${currentBrand.primaryColor}",
    secondaryColor: "${currentBrand.secondaryColor}",
    fonts: {
      heading: "${currentBrand.fonts?.heading}",
      body: "${currentBrand.fonts?.body}"
    }
  }}
  onClose={() => console.log("Widget closed")}
  onNewSearch={(query) => console.log("New search:", query)}
  onArticleClick={(id, url) => window.open(url, "_blank")}
  onCitationClick={(id) => console.log("Citation clicked:", id)}
/>`}
                </code>
              </pre>
            </CardContent>
          </Card>

          {/* Props Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Props Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">initialQuery (optional)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Initial query from URL parameter or POST body. Widget auto-submits on mount if provided.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">brandConfig (optional)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Brand configuration for theming (name, colors, fonts, gradient).
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">onClose (optional)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Callback when widget close button is clicked.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">onNewSearch (optional)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Callback when new search is initiated with query parameter.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">onArticleClick (optional)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Callback when article card is clicked with article ID and URL.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">onCitationClick (optional)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Callback when inline citation is clicked with citation ID.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
