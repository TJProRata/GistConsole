"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PreviewWidgetRenderer } from "@/components/PreviewWidgetRenderer";
import { usePreviewSession } from "@/lib/hooks/usePreviewSession";
import { Loader2, Sparkles } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();
  const { sessionId, isLoading: sessionLoading } = usePreviewSession();

  const previewConfig = useQuery(
    api.previewConfigurations.getPreviewConfig,
    sessionId ? { sessionId } : "skip"
  );

  React.useEffect(() => {
    if (!sessionLoading && previewConfig) {
      if (!previewConfig.widgetType || !previewConfig.configuration) {
        router.push("/preview/configure");
      }
    }
  }, [previewConfig, sessionLoading, router]);

  if (sessionLoading || !previewConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Demo Site Content */}
      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Widget in Action
            </h1>
            <p className="text-xl text-muted-foreground">
              This is how your widget will appear on your website
            </p>
          </header>

          {/* Demo Content */}
          <div className="space-y-8">
            <div className="rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome to Your Demo Site
              </h2>
              <p className="text-muted-foreground mb-4">
                This is a sample page showing how your configured widget will
                appear to visitors. The widget is fully functional and
                positioned exactly as you configured it.
              </p>
              <p className="text-muted-foreground mb-4">
                Try interacting with the widget to see how it behaves. Notice
                the colors, placement, and overall appearance match your
                configuration.
              </p>
            </div>

            <div className="rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground mb-6">
                Create an account to save your configuration and integrate this
                widget into your website.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button size="lg" className="w-full flex-1">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Account & Save
                  </Button>
                </SignUpButton>

                <Link href="/preview/configure" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full">
                    Edit Configuration
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <h3 className="text-xl font-semibold mb-3">
                What Happens Next?
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>
                    Create your account - your preview configuration will be
                    saved automatically
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>
                    Get your widget embed code from the dashboard
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>
                    Add the code to your website and you're live!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Render the actual widget */}
      {previewConfig.widgetType && previewConfig.configuration && (
        <PreviewWidgetRenderer
          widgetType={previewConfig.widgetType}
          configuration={previewConfig.configuration}
          isDemo={true}
        />
      )}
    </div>
  );
}
