"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PreviewFlowStepper } from "@/components/PreviewFlowStepper";
import { usePreviewSession } from "@/lib/hooks/usePreviewSession";
import { ArrowRight, Loader2 } from "lucide-react";

const steps = [
  { id: "api-key", name: "API Key", href: "/preview" },
  { id: "select-widget", name: "Widget Type", href: "/preview/select-widget" },
  { id: "configure", name: "Configure", href: "/preview/configure" },
  { id: "demo", name: "Preview", href: "/preview/demo" },
];

export default function PreviewPage() {
  const router = useRouter();
  const { sessionId, isLoading: sessionLoading } = usePreviewSession();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPreview = useMutation(api.previewConfigurations.createPreviewConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log("Form submitted");
    console.log("API Key:", apiKey);
    console.log("Session ID:", sessionId);

    if (!apiKey.trim()) {
      setError("Please enter your Gist API key");
      return;
    }

    if (!sessionId) {
      setError("Session not initialized. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Calling createPreview mutation...");
      const result = await createPreview({
        sessionId,
        apiKey: apiKey.trim(),
      });
      console.log("Mutation result:", result);

      // Navigate to widget type selection
      console.log("Navigating to /preview/select-widget");
      router.push("/preview/select-widget");
    } catch (err) {
      console.error("Error creating preview:", err);
      setError(`Failed to create preview: ${err instanceof Error ? err.message : String(err)}`);
      setIsSubmitting(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <div className="mb-8">
        <PreviewFlowStepper steps={steps} currentStep="api-key" />
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Preview Your Widget</h1>
            <p className="text-muted-foreground">
              Enter your Gist API key to start building your custom chat widget.
              No account required.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="api-key">Gist API Key</Label>
              <Input
                id="api-key"
                type="text"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-2"
                disabled={isSubmitting}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Your API key is only used for preview purposes and is stored
                temporarily.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Preview...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
