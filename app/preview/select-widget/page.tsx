"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PreviewFlowStepper } from "@/components/PreviewFlowStepper";
import { usePreviewSession } from "@/lib/hooks/usePreviewSession";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const steps = [
  { id: "api-key", name: "API Key", href: "/preview" },
  { id: "select-widget", name: "Widget Type", href: "/preview/select-widget" },
  { id: "configure", name: "Configure", href: "/preview/configure" },
  { id: "demo", name: "Preview", href: "/preview/demo" },
];

const widgetTypes = [
  {
    id: "floating",
    name: "Floating Widget",
    description:
      "A floating button that expands into a chat panel. Perfect for most websites.",
    icon: MessageCircle,
  },
  {
    id: "rufus",
    name: "Rufus Widget",
    description:
      "A centered modal chat interface. Great for focused conversations.",
    icon: MessageCircle,
  },
  {
    id: "womensWorld",
    name: "Women's World Widget",
    description: "A sidebar chat interface. Ideal for continuous assistance.",
    icon: MessageCircle,
  },
];

export default function SelectWidgetPage() {
  const router = useRouter();
  const { sessionId, isLoading: sessionLoading } = usePreviewSession();
  const [selectedType, setSelectedType] = useState<
    "floating" | "rufus" | "womensWorld" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewConfig = useQuery(
    api.previewConfigurations.getPreviewConfig,
    sessionId ? { sessionId } : "skip"
  );
  const updateWidgetType = useMutation(
    api.previewConfigurations.updateWidgetType
  );

  const handleSubmit = async () => {
    setError(null);

    if (!selectedType) {
      setError("Please select a widget type");
      return;
    }

    if (!sessionId) {
      setError("Session not initialized. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateWidgetType({
        sessionId,
        widgetType: selectedType,
      });

      // Navigate to configuration
      router.push("/preview/configure");
    } catch (err) {
      console.error("Error updating widget type:", err);
      setError("Failed to save widget type. Please try again.");
      setIsSubmitting(false);
    }
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
        <PreviewFlowStepper steps={steps} currentStep="select-widget" />
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Choose Your Widget Type</h1>
          <p className="text-muted-foreground">
            Select the widget style that best fits your website
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <RadioGroup
          value={selectedType || ""}
          onValueChange={(value) =>
            setSelectedType(value as "floating" | "rufus" | "womensWorld")
          }
          className="grid gap-4 md:grid-cols-3"
        >
          {widgetTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer border-2 p-6 transition-all hover:border-primary ${
                selectedType === type.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() =>
                setSelectedType(type.id as "floating" | "rufus" | "womensWorld")
              }
            >
              <div className="flex items-center gap-2 mb-4">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id} className="cursor-pointer">
                  {type.name}
                </Label>
              </div>

              <div className="mb-4 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/10">
                  <type.icon className="h-12 w-12 text-primary" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </Card>
          ))}
        </RadioGroup>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedType || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue to Configuration
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
