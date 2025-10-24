"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Boxes, Package, FolderTree, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComponentsOverview() {
  const stats = useQuery(api.components.getComponentStats);

  const isLoading = stats === undefined;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Component Library</h1>
        <p className="text-gray-600 mt-2">
          Browse and manage UI components and widget components in your application.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total UI Components */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UI Components</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUIComponents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  shadcn/ui components
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Widget Components */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Widget Components</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalWidgetComponents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Individual components
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Complete Widgets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete Widgets</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.completeWidgets}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full widget implementations
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Components */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Components</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalComponents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all categories
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Component Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Library Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground mt-1">
              All components operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Browse Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                UI Components
              </CardTitle>
              <CardDescription>
                Browse shadcn/ui components used throughout the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/components/ui-components">
                <Button className="w-full">View UI Components</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Widget Components
              </CardTitle>
              <CardDescription>
                Explore custom widget components organized by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/components/widgets">
                <Button className="w-full">View Widget Components</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Breakdown */}
      {!isLoading && stats && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Widget Component Categories</h2>
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>
                Breakdown of widget components by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {category.replace("-", " ")}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
