"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Form schema
const formSchema = z.object({
  widgetType: z.enum(["floating", "rufus", "womensWorld"], {
    message: "Please select a widget type",
  }),
  placement: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
  useGradient: z.boolean(),
  primaryColor: z.string().optional(),
  gradientStart: z.string().optional(),
  gradientEnd: z.string().optional(),
  width: z.number().min(300).max(800),
  height: z.number().min(400).max(800),
  openByDefault: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  widgetType: "floating",
  placement: "bottom-right",
  useGradient: true,
  gradientStart: "#3B82F6",
  gradientEnd: "#8B5CF6",
  width: 400,
  height: 600,
  openByDefault: false,
};

export default function ConfigureWidgetPage() {
  const { toast } = useToast();
  const [selectedGistConfigId, setSelectedGistConfigId] = useState<
    Id<"gistConfigurations"> | null
  >(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [widgetConfigToDelete, setWidgetConfigToDelete] = useState<
    Id<"widgetConfigurations"> | null
  >(null);

  // Queries
  const gistConfigs = useQuery(api.gistConfigurations.getUserConfigs);
  const widgetConfig = useQuery(
    api.widgetConfigurations.getWidgetConfig,
    selectedGistConfigId ? { gistConfigurationId: selectedGistConfigId } : "skip"
  );
  const userWidgetConfigs = useQuery(api.widgetConfigurations.getUserWidgetConfigs);

  // Mutations
  const createWidgetConfig = useMutation(api.widgetConfigurations.createWidgetConfig);
  const updateWidgetConfig = useMutation(api.widgetConfigurations.updateWidgetConfig);
  const deleteWidgetConfig = useMutation(api.widgetConfigurations.deleteWidgetConfig);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Auto-select first gist config
  useEffect(() => {
    if (gistConfigs && gistConfigs.length > 0 && !selectedGistConfigId) {
      setSelectedGistConfigId(gistConfigs[0]._id);
    }
  }, [gistConfigs, selectedGistConfigId]);

  // Update form when widget config loads
  useEffect(() => {
    if (widgetConfig) {
      form.reset({
        widgetType: widgetConfig.widgetType,
        placement: widgetConfig.placement || "bottom-right",
        useGradient: widgetConfig.useGradient || false,
        primaryColor: widgetConfig.primaryColor,
        gradientStart: widgetConfig.gradientStart,
        gradientEnd: widgetConfig.gradientEnd,
        width: widgetConfig.width || 400,
        height: widgetConfig.height || 600,
        openByDefault: widgetConfig.openByDefault || false,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [widgetConfig, form]);

  const watchedValues = form.watch();

  const onSubmit = async (values: FormValues) => {
    if (!selectedGistConfigId) {
      toast({
        title: "Error",
        description: "Please select a gist configuration",
        variant: "destructive",
      });
      return;
    }

    try {
      if (widgetConfig) {
        // Update existing
        await updateWidgetConfig({
          widgetConfigId: widgetConfig._id,
          configuration: {
            primaryColor: values.primaryColor,
            gradientStart: values.gradientStart,
            gradientEnd: values.gradientEnd,
            useGradient: values.useGradient,
            width: values.width,
            height: values.height,
            placement: values.placement,
            openByDefault: values.openByDefault,
          },
        });
        toast({
          title: "Success",
          description: "Widget configuration updated successfully",
        });
      } else {
        // Create new
        await createWidgetConfig({
          gistConfigurationId: selectedGistConfigId,
          widgetType: values.widgetType,
          configuration: {
            primaryColor: values.primaryColor,
            gradientStart: values.gradientStart,
            gradientEnd: values.gradientEnd,
            useGradient: values.useGradient,
            width: values.width,
            height: values.height,
            placement: values.placement,
            openByDefault: values.openByDefault,
          },
        });
        toast({
          title: "Success",
          description: "Widget configuration created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!widgetConfigToDelete) return;

    try {
      await deleteWidgetConfig({ widgetConfigId: widgetConfigToDelete });
      toast({
        title: "Success",
        description: "Widget configuration deleted successfully",
      });
      setDeleteDialogOpen(false);
      setWidgetConfigToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive",
      });
    }
  };

  if (!gistConfigs) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (gistConfigs.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <Alert>
          <AlertDescription>
            You need to create a gist configuration first before configuring a widget.
            Please go to the dashboard and create a configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Toaster />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configure Your Widget</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Design and customize your widget appearance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gist Configuration Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedGistConfigId || ""}
                onValueChange={(value) => setSelectedGistConfigId(value as Id<"gistConfigurations">)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a gist configuration" />
                </SelectTrigger>
                <SelectContent>
                  {gistConfigs.map((config) => (
                    <SelectItem key={config._id} value={config._id}>
                      {config.publicationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Widget Configuration Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                </TabsList>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6 mt-6">
                  <FormField
                    control={form.control}
                    name="widgetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Widget Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!!widgetConfig}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="floating">Floating Widget</SelectItem>
                            <SelectItem value="rufus">Rufus Widget</SelectItem>
                            <SelectItem value="womensWorld">Women's World Widget</SelectItem>
                          </SelectContent>
                        </Select>
                        {widgetConfig && (
                          <FormDescription className="text-xs">
                            Widget type cannot be changed after creation
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="useGradient"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Use Gradient</FormLabel>
                          <FormDescription>
                            Enable gradient colors instead of solid color
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchedValues.useGradient ? (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="gradientStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gradient Start Color</FormLabel>
                            <div className="flex items-center gap-4">
                              <FormControl>
                                <input
                                  type="color"
                                  {...field}
                                  className="h-10 w-20 rounded border cursor-pointer"
                                />
                              </FormControl>
                              <Input
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-32"
                                placeholder="#3B82F6"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gradientEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gradient End Color</FormLabel>
                            <div className="flex items-center gap-4">
                              <FormControl>
                                <input
                                  type="color"
                                  {...field}
                                  className="h-10 w-20 rounded border cursor-pointer"
                                />
                              </FormControl>
                              <Input
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-32"
                                placeholder="#8B5CF6"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <input
                                type="color"
                                {...field}
                                className="h-10 w-20 rounded border cursor-pointer"
                              />
                            </FormControl>
                            <Input
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-32"
                              placeholder="#8B5CF6"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />

                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width: {field.value}px</FormLabel>
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
                        <FormLabel>Widget Placement</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            {[
                              { value: "bottom-right", label: "Bottom Right" },
                              { value: "bottom-left", label: "Bottom Left" },
                              { value: "top-right", label: "Top Right" },
                              { value: "top-left", label: "Top Left" },
                            ].map((option) => (
                              <FormItem key={option.value}>
                                <div
                                  className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer ${
                                    field.value === option.value
                                      ? "border-primary bg-primary/5"
                                      : "border-muted"
                                  }`}
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option.value} />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer font-normal">
                                    {option.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="openByDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Open by Default</FormLabel>
                          <FormDescription>
                            Widget opens automatically when page loads
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {widgetConfig ? "Update Configuration" : "Create Configuration"}
                </Button>
              </div>
            </form>
          </Form>

          {/* Existing Configurations */}
          {userWidgetConfigs && userWidgetConfigs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Widget Configurations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userWidgetConfigs.map((config) => (
                    <div
                      key={config._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {config.gistConfiguration?.publicationName || "Unknown"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="secondary" className="mr-2">
                            {config.widgetType}
                          </Badge>
                          {config.placement} · {config.width}x{config.height}px
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setWidgetConfigToDelete(config._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Preview</span>
                <Badge variant="secondary">{watchedValues.widgetType}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted rounded-lg h-96">
                {/* Simple preview placeholder */}
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Widget Preview
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Widget Configuration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this widget configuration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
