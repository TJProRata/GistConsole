"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { VariantControls } from "@/components/VariantControls";
import { cn } from "@/lib/utils";
import type { VariantConfig } from "@/lib/types/component-preview";

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
  variants?: VariantConfig[];
  componentName?: string;
  defaultVariant?: string;
}

interface ComponentPreviewDemoProps {
  children: React.ReactNode;
  className?: string;
}

interface ComponentPreviewCodeProps {
  code: string;
  language?: string;
  className?: string;
}

// Context for managing dark mode and variant state
const PreviewContext = React.createContext<{
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  variant: string | null;
  setVariant: (value: string) => void;
  variants: VariantConfig[] | null;
} | null>(null);

const usePreviewContext = () => {
  const context = React.useContext(PreviewContext);
  if (!context) {
    throw new Error("Preview components must be used within ComponentPreview");
  }
  return context;
};

// Export for use in page components
export { usePreviewContext };

// Root component
export function ComponentPreview({
  children,
  className,
  variants,
  componentName,
  defaultVariant
}: ComponentPreviewProps) {
  const [isDark, setIsDark] = React.useState(false);
  const [variant, setVariantState] = React.useState<string | null>(null);

  // Load theme preference from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("component-preview-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  // Save theme preference to localStorage
  React.useEffect(() => {
    localStorage.setItem("component-preview-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Load saved variant from localStorage on mount
  React.useEffect(() => {
    if (componentName && variants && variants.length > 0) {
      const storageKey = `component-preview-variant-${componentName}`;
      const savedVariant = localStorage.getItem(storageKey);

      // Use saved variant if valid, otherwise use default or first variant
      if (savedVariant && variants.some(v => v.name === savedVariant)) {
        setVariantState(savedVariant);
      } else if (defaultVariant) {
        setVariantState(defaultVariant);
      } else {
        setVariantState(variants[0].name);
      }
    }
  }, [componentName, variants, defaultVariant]);

  // Save variant selection to localStorage
  const setVariant = React.useCallback((newVariant: string) => {
    setVariantState(newVariant);
    if (componentName) {
      const storageKey = `component-preview-variant-${componentName}`;
      try {
        localStorage.setItem(storageKey, newVariant);
      } catch (error) {
        // Gracefully handle localStorage errors (e.g., in private browsing mode)
        console.warn("Failed to save variant preference:", error);
      }
    }
  }, [componentName]);

  return (
    <PreviewContext.Provider value={{ isDark, setIsDark, variant, setVariant, variants: variants || null }}>
      <div className={cn("w-full", className)}>
        <Tabs defaultValue="preview" className="w-full">
          {/* Tab Controls */}
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              {/* Variant Controls */}
              {variants && variants.length > 1 && variant && (
                <>
                  <VariantControls
                    variants={variants}
                    selectedVariant={variant}
                    onVariantChange={setVariant}
                  />
                  <Separator orientation="vertical" className="h-6" />
                </>
              )}

              {/* Dark Mode Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          {children}
        </Tabs>
      </div>
    </PreviewContext.Provider>
  );
}

// Demo component (preview area)
export function ComponentPreviewDemo({ children, className }: ComponentPreviewDemoProps) {
  const { isDark } = usePreviewContext();

  return (
    <TabsContent value="preview" className="mt-0">
      <Card className={cn("border-2", className)}>
        <CardContent
          className={cn(
            "flex min-h-[350px] items-center justify-center p-8",
            isDark && "dark bg-slate-950 text-slate-50"
          )}
        >
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

// Code component (code display area)
export function ComponentPreviewCode({ code, language = "tsx", className }: ComponentPreviewCodeProps) {
  const { isDark } = usePreviewContext();

  return (
    <TabsContent value="code" className="mt-0">
      <CodeBlock
        code={code}
        language={language}
        theme={isDark ? "dark" : "light"}
        className={className}
      />
    </TabsContent>
  );
}

// Compound component exports
ComponentPreview.Demo = ComponentPreviewDemo;
ComponentPreview.Code = ComponentPreviewCode;
