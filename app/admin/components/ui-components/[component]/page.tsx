"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ComponentPreview } from "@/components/ComponentPreview";
import { UI_DEMOS } from "@/components/component-previews/ui-demos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PageProps {
  params: Promise<{ component: string }>;
}

export default function UIComponentPreviewPage({ params }: PageProps) {
  const { component } = use(params);
  const componentData = useQuery(api.componentPreviews.getUIComponentPreview, {
    componentName: component,
  });

  // Loading state
  if (componentData === undefined) {
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

  // Error state - component not found
  if (componentData === null) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Component "{component}" not found. Please check the component name and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/admin/components/ui-components">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Components
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get the demo component
  const DemoComponent = UI_DEMOS[component];

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground space-x-2">
        <Link href="/admin" className="hover:text-foreground">Admin</Link>
        <span>/</span>
        <Link href="/admin/components" className="hover:text-foreground">Components</Link>
        <span>/</span>
        <Link href="/admin/components/ui-components" className="hover:text-foreground">
          UI Components
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium capitalize">{component}</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold capitalize">{component}</h1>
          <Badge variant="secondary">{componentData.category}</Badge>
        </div>
        <p className="text-muted-foreground">{componentData.description}</p>
      </div>

      {/* Navigation Between Components */}
      <div className="flex items-center justify-between border-y py-4">
        <div>
          {componentData.navigation.previous ? (
            <Button asChild variant="outline">
              <Link href={`/admin/components/ui-components/${componentData.navigation.previous}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="capitalize">{componentData.navigation.previous}</span>
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
          {componentData.navigation.current} of {componentData.navigation.total}
        </div>

        <div>
          {componentData.navigation.next ? (
            <Button asChild variant="outline">
              <Link href={`/admin/components/ui-components/${componentData.navigation.next}`}>
                <span className="capitalize">{componentData.navigation.next}</span>
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

      {/* Component Preview */}
      {DemoComponent ? (
        <ComponentPreview>
          <ComponentPreview.Demo>
            <DemoComponent />
          </ComponentPreview.Demo>
          <ComponentPreview.Code code={componentData.code} />
        </ComponentPreview>
      ) : (
        <Alert>
          <AlertDescription>
            Preview not available for this component yet. Please check back later.
          </AlertDescription>
        </Alert>
      )}

      {/* Back Button */}
      <div className="pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/components/ui-components">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to All Components
          </Link>
        </Button>
      </div>
    </div>
  );
}
