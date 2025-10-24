"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserSync } from "@/lib/hooks/useUserSync";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsAndConditionsDialog } from "@/components/TermsAndConditionsDialog";
import { RssFeedsModal, type RssFeed } from "@/components/RssFeedsModal";
import { Plus, X, Upload } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

const CATEGORIES = [
  "Academic",
  "Books",
  "Business",
  "gpa_publisher",
  "Health",
  "Lifestyle",
  "News",
  "Other",
  "ProRata Internal",
  "Reference",
  "Sports",
  "Uncategorized",
] as const;

const formSchema = z.object({
  publicationName: z.string().min(1, "Publication name is required"),
  category: z.enum(CATEGORIES, {
    message: "Please select a category",
  }),
  ingestionMethod: z.enum(["wordpress", "rss"], {
    message: "Please select an ingestion method",
  }),
  wordpressUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  rssUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DashboardPage() {
  // Automatically sync Clerk user to Convex database
  useUserSync();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showRssModal, setShowRssModal] = useState(false);
  const [rssFeeds, setRssFeeds] = useState<RssFeed[]>([]);

  // Favicon upload states
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [faviconError, setFaviconError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveConfiguration = useMutation(api.gistConfigurations.saveConfiguration);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicationName: "",
      category: undefined,
      ingestionMethod: "wordpress",
      wordpressUrl: "",
      rssUrl: "",
      termsAccepted: false,
    },
  });

  const watchIngestionMethod = form.watch("ingestionMethod");

  // Handle favicon file selection
  const handleFaviconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFaviconError(null);

    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setFaviconError("Please upload a PNG, JPG, or SVG file");
      return;
    }

    // Validate file size (max 100KB = 102400 bytes)
    const maxSize = 102400;
    if (file.size > maxSize) {
      setFaviconError("File size must be less than 100KB");
      return;
    }

    // Set file and generate preview
    setFaviconFile(file);
    const previewUrl = URL.createObjectURL(file);

    // Revoke previous preview URL to prevent memory leaks
    if (faviconPreview) {
      URL.revokeObjectURL(faviconPreview);
    }

    setFaviconPreview(previewUrl);
  };

  // Clear favicon selection
  const clearFavicon = () => {
    if (faviconPreview) {
      URL.revokeObjectURL(faviconPreview);
    }
    setFaviconFile(null);
    setFaviconPreview(null);
    setFaviconError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload favicon to Convex storage
  const uploadFavicon = async (): Promise<Id<"_storage"> | undefined> => {
    if (!faviconFile) return undefined;

    setIsUploadingFavicon(true);
    try {
      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": faviconFile.type },
        body: faviconFile,
      });

      if (!result.ok) {
        throw new Error("Failed to upload favicon");
      }

      const { storageId } = await result.json();
      return storageId as Id<"_storage">;
    } catch (error) {
      setFaviconError("Failed to upload favicon. Please try again.");
      throw error;
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Upload favicon if selected
      let faviconStorageId: Id<"_storage"> | undefined = undefined;
      if (faviconFile) {
        try {
          faviconStorageId = await uploadFavicon();
        } catch (uploadError) {
          setIsSubmitting(false);
          return; // Don't submit form if favicon upload fails
        }
      }

      // RSS URL Handling: Merge primary RSS URL into rssFeeds array
      // Strategy: Primary RSS URL (from form field) becomes rssFeeds[0]
      // Additional feeds (from modal) are appended after
      let finalRssFeeds: RssFeed[] | undefined = undefined;
      if (values.ingestionMethod === "rss") {
        if (values.rssUrl) {
          // Create primary feed object from form field
          const primaryFeed: RssFeed = {
            url: values.rssUrl,
            // No username/password/headers for primary feed (simplest case)
            // User can add these via the "Manage RSS Feeds" modal if needed
          };
          // Merge: [primary, ...additional feeds from modal]
          finalRssFeeds = [primaryFeed, ...rssFeeds];
        } else {
          // No primary URL, just use feeds from modal
          finalRssFeeds = rssFeeds.length > 0 ? rssFeeds : undefined;
        }
      }

      await saveConfiguration({
        publicationName: values.publicationName,
        category: values.category,
        ingestionMethod: values.ingestionMethod,
        wordpressUrl: values.wordpressUrl || undefined,
        rssFeeds: finalRssFeeds,
        faviconStorageId: faviconStorageId,
        termsAccepted: values.termsAccepted,
      });

      setSubmitSuccess(true);
      // Clear favicon states after successful submission
      clearFavicon();
      setIsSubmitting(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save configuration"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            How should we ingest your website content?
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Publication Name */}
            <FormField
              control={form.control}
              name="publicationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Publication <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormDescription>
                    This will be the name displayed in your AI Search setup and reports
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="e.g., The Metro Herald" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormDescription>
                    Select the category that best matches your publication
                  </FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ingestion Method */}
            <FormField
              control={form.control}
              name="ingestionMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Choose your method <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormDescription>
                    Ingest content using either the WordPress posts endpoint or RSS feeds.
                    If these options don't cover all your site content or you need help with
                    setup, please reach out via the Support link below. Please review our full{" "}
                    <a
                      href="https://platform.gist.ai/docs/content-policy-for-gist-answers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Content Policy
                    </a>
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-3"
                    >
                      <FormItem>
                        <div
                          className={`flex items-center space-x-3 rounded-lg border-2 p-4 ${
                            field.value === "wordpress"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <FormControl>
                            <RadioGroupItem value="wordpress" />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            Connect via CMS – we currently support WordPress
                          </FormLabel>
                        </div>
                      </FormItem>
                      <FormItem>
                        <div
                          className={`flex items-center space-x-3 rounded-lg border-2 p-4 ${
                            field.value === "rss"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <FormControl>
                            <RadioGroupItem value="rss" />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            Connect RSS Feed – import content from your RSS feed
                          </FormLabel>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* WordPress URL (Conditional) */}
            {watchIngestionMethod === "wordpress" && (
              <FormField
                control={form.control}
                name="wordpressUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Enter the URL of your WordPress posts endpoint. It typically looks like
                      https://yourwebsite.com/wp-json/wp/v2/posts. We'll continuously ingest
                      content from this WordPress site to power your AI Search answers.
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="e.g., https://yourwebsite.com/wp-json/wp/v2/posts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* RSS Feed (Conditional) */}
            {watchIngestionMethod === "rss" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="rssUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        You can just enter the URL for your RSS feed. Gist will crawl the pages
                        for AI Generated search.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="e.g., https://yourwebsite.com/rss" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRssModal(true)}
                  className="w-full"
                >
                  Add more RSS URLs
                </Button>
              </div>
            )}

            {/* Favicon Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Favicon</label>
              <p className="text-sm text-muted-foreground">
                Add your logo to the search and filters on the homepage. Recommended
                dimensions are 160 × 160 pixels.
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleFaviconChange}
                className="hidden"
              />

              {/* Upload area */}
              {!faviconPreview ? (
                <div
                  className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-gray-400 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingFavicon ? (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-gray-400 animate-pulse" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Plus className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Drop your image here or{" "}
                        <span className="text-blue-600 underline hover:text-blue-800">
                          browse
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">(PNG, JPG, or SVG, max 100KB)</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-4 rounded-lg border-2 border-gray-300 p-4">
                  <img
                    src={faviconPreview}
                    alt="Favicon preview"
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{faviconFile?.name}</p>
                    <p className="text-xs text-gray-500">
                      {faviconFile && (faviconFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFavicon}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Error message */}
              {faviconError && (
                <p className="text-sm text-red-600">{faviconError}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">
                      I agree to the <TermsAndConditionsDialog />
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="rounded-lg bg-green-50 p-4 text-green-800">
                Configuration saved successfully!
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="rounded-lg bg-red-50 p-4 text-red-800">
                {submitError}
              </div>
            )}
          </form>
        </Form>

        {/* RSS Feeds Modal */}
        <RssFeedsModal
          open={showRssModal}
          onOpenChange={setShowRssModal}
          rssFeeds={rssFeeds}
          onSave={(feeds) => {
            setRssFeeds(feeds);
            setShowRssModal(false);
          }}
        />
    </div>
  );
}
