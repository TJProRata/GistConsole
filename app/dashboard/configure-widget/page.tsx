"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "Widget name is required").max(100, "Name must be less than 100 characters"),
  type: z.enum(["floating", "rufus", "womensWorld"], {
    message: "Please select a widget type",
  }),
  placement: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
  openStateMode: z.enum(["toggle", "alwaysOpen", "teaser"]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  width: z.number().min(300).max(800),
  height: z.number().min(400).max(800),
  seedQuestions: z.array(z.string().max(60, "Question must be 60 characters or less")).max(5),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "My Widget",
  type: "floating",
  placement: "bottom-right",
  openStateMode: "toggle",
  primaryColor: "#8B5CF6",
  width: 400,
  height: 600,
  seedQuestions: ["What is this?", "How does it work?", "Tell me more"],
};

export default function ConfigureWidgetPage() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Watch form values for live preview
  const watchedValues = form.watch();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    console.log("Widget configuration:", values);
  };

  const handleReset = () => {
    if (confirm("Reset form to default values?")) {
      form.reset(defaultValues);
    }
  };

  const addSeedQuestion = () => {
    const current = form.getValues("seedQuestions");
    if (current.length < 5) {
      form.setValue("seedQuestions", [...current, ""]);
    }
  };

  const removeSeedQuestion = (index: number) => {
    const current = form.getValues("seedQuestions");
    form.setValue("seedQuestions", current.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configure Your Widget</h1>
        <p className="text-sm text-gray-600 mt-1">
          Design and customize your on-site search widget
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                </TabsList>

                {/* Basics Tab */}
                <TabsContent value="basics" className="space-y-6 mt-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Widget Name</FormLabel>
                        <FormDescription>
                          Choose a name for your widget (displayed in the widget header)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="e.g., Help Widget" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Widget Type</FormLabel>
                        <FormDescription>
                          Select the widget family that best fits your needs
                        </FormDescription>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select widget type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="floating">
                              <div>
                                <div className="font-medium">Floating Widget</div>
                                <div className="text-xs text-gray-500">
                                  Small button that expands into a panel
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="rufus">
                              <div>
                                <div className="font-medium">Rufus Widget</div>
                                <div className="text-xs text-gray-500">
                                  Centered modal with prominent seed questions
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="womensWorld">
                              <div>
                                <div className="font-medium">Womens World Widget</div>
                                <div className="text-xs text-gray-500">
                                  Always-open sidebar for deep engagement
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6 mt-6">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormDescription>
                          Choose the main color for your widget
                        </FormDescription>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <input
                              type="color"
                              {...field}
                              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                          </FormControl>
                          <Input
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-32"
                            placeholder="#8B5CF6"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width: {field.value}px</FormLabel>
                        <FormDescription>
                          Set the width of your widget panel
                        </FormDescription>
                        <FormControl>
                          <Slider
                            min={300}
                            max={800}
                            step={10}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height: {field.value}px</FormLabel>
                        <FormDescription>
                          Set the height of your widget panel
                        </FormDescription>
                        <FormControl>
                          <Slider
                            min={400}
                            max={800}
                            step={10}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Behavior Tab */}
                <TabsContent value="behavior" className="space-y-6 mt-6">
                  <FormField
                    control={form.control}
                    name="placement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement</FormLabel>
                        <FormDescription>
                          Choose where the widget appears on the page
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormItem>
                              <div
                                className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                  field.value === "bottom-right"
                                    ? "border-violet-600 bg-violet-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value="bottom-right" />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">
                                  Bottom Right
                                </FormLabel>
                              </div>
                            </FormItem>
                            <FormItem>
                              <div
                                className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                  field.value === "bottom-left"
                                    ? "border-violet-600 bg-violet-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value="bottom-left" />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">
                                  Bottom Left
                                </FormLabel>
                              </div>
                            </FormItem>
                            <FormItem>
                              <div
                                className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                  field.value === "top-right"
                                    ? "border-violet-600 bg-violet-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value="top-right" />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">
                                  Top Right
                                </FormLabel>
                              </div>
                            </FormItem>
                            <FormItem>
                              <div
                                className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                  field.value === "top-left"
                                    ? "border-violet-600 bg-violet-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value="top-left" />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">
                                  Top Left
                                </FormLabel>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="openStateMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open State Behavior</FormLabel>
                        <FormDescription>
                          How the widget opens and closes
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <FormItem>
                              <div
                                className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                  field.value === "toggle"
                                    ? "border-violet-600 bg-violet-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value="toggle" />
                                </FormControl>
                                <div className="flex-1">
                                  <FormLabel className="cursor-pointer font-medium">
                                    Toggle
                                  </FormLabel>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Standard open/close button. Closed by default.
                                  </p>
                                </div>
                              </div>
                            </FormItem>
                            <FormItem>
                              <div
                                className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                  field.value === "alwaysOpen"
                                    ? "border-violet-600 bg-violet-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value="alwaysOpen" />
                                </FormControl>
                                <div className="flex-1">
                                  <FormLabel className="cursor-pointer font-medium">
                                    Always Open
                                  </FormLabel>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Panel expanded by default. Can be minimized by user.
                                  </p>
                                </div>
                              </div>
                            </FormItem>
                            <FormItem>
                              <div
                                className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                  field.value === "teaser"
                                    ? "border-violet-600 bg-violet-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value="teaser" />
                                </FormControl>
                                <div className="flex-1">
                                  <FormLabel className="cursor-pointer font-medium">
                                    Teaser
                                  </FormLabel>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Auto-opens after delay, then closes unless engaged.
                                  </p>
                                </div>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Seed Questions</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Pre-written questions to help users get started (max 5)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSeedQuestion}
                        disabled={form.getValues("seedQuestions").length >= 5}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Question
                      </Button>
                    </div>

                    {form.watch("seedQuestions").map((_, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={`seedQuestions.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2">
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="e.g., How does this work?"
                                  className="resize-none"
                                  rows={2}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSeedQuestion(index)}
                                className="shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <FormMessage />
                              <span className="text-gray-500">
                                {field.value?.length || 0}/60
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset to Defaults
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
              </div>

              {/* Success Toast */}
              {showSuccessToast && (
                <div className="fixed bottom-4 right-4 rounded-lg bg-green-50 p-4 text-green-800 shadow-lg">
                  Widget configuration saved successfully!
                </div>
              )}
            </form>
          </Form>
        </div>

        {/* Preview Section (1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Preview</span>
                <Badge variant="secondary">{watchedValues.type}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WidgetPreview config={watchedValues} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Widget Preview Component
function WidgetPreview({ config }: { config: FormValues }) {
  const getPlacementStyle = () => {
    const base = "absolute";
    switch (config.placement) {
      case "bottom-right":
        return `${base} bottom-4 right-4`;
      case "bottom-left":
        return `${base} bottom-4 left-4`;
      case "top-right":
        return `${base} top-4 right-4`;
      case "top-left":
        return `${base} top-4 left-4`;
    }
  };

  if (config.type === "floating") {
    return (
      <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
        <div className={getPlacementStyle()}>
          {/* Floating button */}
          <div
            className="rounded-full h-14 w-14 flex items-center justify-center shadow-lg cursor-pointer mb-2"
            style={{ backgroundColor: config.primaryColor }}
          >
            <span className="text-white text-2xl">?</span>
          </div>
          {/* Expanded panel */}
          <div
            className="rounded-lg shadow-xl bg-white overflow-hidden"
            style={{
              width: `${Math.min(config.width, 300)}px`,
              height: `${Math.min(config.height, 400)}px`,
            }}
          >
            <div
              className="p-4 text-white font-medium"
              style={{ backgroundColor: config.primaryColor }}
            >
              {config.name}
            </div>
            <div className="p-4 space-y-2">
              {config.seedQuestions.slice(0, 3).map((q, i) => (
                <div
                  key={i}
                  className="text-xs p-2 bg-gray-50 rounded border border-gray-200 hover:border-violet-300"
                >
                  {q || "Empty question"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (config.type === "rufus") {
    return (
      <div className="relative bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
        <div
          className="rounded-lg shadow-2xl bg-white"
          style={{
            width: `${Math.min(config.width, 350)}px`,
            height: `${Math.min(config.height, 300)}px`,
          }}
        >
          <div
            className="p-4 text-white font-medium text-center"
            style={{ backgroundColor: config.primaryColor }}
          >
            {config.name}
          </div>
          <div className="p-4 space-y-2">
            <p className="text-xs text-gray-600 mb-3">How can we help you today?</p>
            {config.seedQuestions.slice(0, 3).map((q, i) => (
              <div
                key={i}
                className="text-xs p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-violet-300 cursor-pointer text-center"
              >
                {q || "Empty question"}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Womens World - sidebar
  return (
    <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden flex">
      <div
        className="bg-white border-r shadow-lg overflow-y-auto"
        style={{
          width: `${Math.min(config.width, 240)}px`,
          height: "100%",
        }}
      >
        <div
          className="p-4 text-white font-medium sticky top-0"
          style={{ backgroundColor: config.primaryColor }}
        >
          {config.name}
        </div>
        <div className="p-3 space-y-2">
          {config.seedQuestions.map((q, i) => (
            <div
              key={i}
              className="text-xs p-2 bg-gray-50 rounded border border-gray-200 hover:border-violet-300"
            >
              {q || "Empty question"}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="text-xs text-gray-400">Main content area</div>
      </div>
    </div>
  );
}
