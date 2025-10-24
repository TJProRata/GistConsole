"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
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

// Context for managing dark mode state
const PreviewContext = React.createContext<{
  isDark: boolean;
  setIsDark: (value: boolean) => void;
} | null>(null);

const usePreviewContext = () => {
  const context = React.useContext(PreviewContext);
  if (!context) {
    throw new Error("Preview components must be used within ComponentPreview");
  }
  return context;
};

// Root component
export function ComponentPreview({ children, className }: ComponentPreviewProps) {
  const [isDark, setIsDark] = React.useState(false);

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

  return (
    <PreviewContext.Provider value={{ isDark, setIsDark }}>
      <div className={cn("w-full", className)}>
        <Tabs defaultValue="preview" className="w-full">
          {/* Tab Controls */}
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

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
