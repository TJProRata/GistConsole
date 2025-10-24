"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ComponentPreview } from "@/components/ComponentPreview";
import { WIDGET_DEMOS } from "@/components/component-previews/widget-demos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PageProps {
  params: Promise<{ widget: string }>;
}

export default function WidgetPreviewPage({ params }: PageProps) {
  const { widget } = use(params);
  const widgetData = useQuery(api.componentPreviews.getWidgetComponentPreview, {
    widgetName: widget,
  });

  // Loading state
  if (widgetData === undefined) {
    return (
      <div className="p-8 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Navigation Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Preview Skeleton */}
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error state - widget not found
  if (widgetData === null) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Widget "{widget}" not found. Please check the widget name and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/admin/components/widgets">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Widget Components
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get the demo component
  const DemoComponent = WIDGET_DEMOS[widget];

  // Format category display name
  const categoryDisplay = widgetData.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground space-x-2">
        <Link href="/admin" className="hover:text-foreground">Admin</Link>
        <span>/</span>
        <Link href="/admin/components" className="hover:text-foreground">Components</Link>
        <span>/</span>
        <Link href="/admin/components/widgets" className="hover:text-foreground">
          Widget Components
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium capitalize">{widget.replace(/-/g, " ")}</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold capitalize">{widget.replace(/-/g, " ")}</h1>
          <Badge variant="secondary">{categoryDisplay}</Badge>
        </div>
        <p className="text-muted-foreground">{widgetData.description}</p>
      </div>

      {/* Navigation Between Widgets */}
      <div className="flex items-center justify-between border-y py-4">
        <div>
          {widgetData.navigation.previous ? (
            <Button asChild variant="outline">
              <Link href={`/admin/components/widgets/${widgetData.navigation.previous}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="capitalize">{widgetData.navigation.previous.replace(/-/g, " ")}</span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {widgetData.navigation.current} of {widgetData.navigation.total}
        </div>

        <div>
          {widgetData.navigation.next ? (
            <Button asChild variant="outline">
              <Link href={`/admin/components/widgets/${widgetData.navigation.next}`}>
                <span className="capitalize">{widgetData.navigation.next.replace(/-/g, " ")}</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Widget Preview */}
      {DemoComponent ? (
        <ComponentPreview>
          <ComponentPreview.Demo>
            <DemoComponent />
          </ComponentPreview.Demo>
          <ComponentPreview.Code code={widgetData.code} />
        </ComponentPreview>
      ) : (
        <Alert>
          <AlertDescription>
            Preview not available for this widget yet. Please check back later.
          </AlertDescription>
        </Alert>
      )}

      {/* Back Button */}
      <div className="pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/components/widgets">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Widget Components
          </Link>
        </Button>
      </div>
    </div>
  );
}
