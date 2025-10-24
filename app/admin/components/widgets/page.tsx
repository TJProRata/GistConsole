"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package, Eye } from "lucide-react";
import Link from "next/link";

export default function WidgetComponentsPage() {
  const components = useQuery(api.components.getWidgetComponentsList);
  const completeWidgets = useQuery(api.components.getCompleteWidgetsList);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = components === undefined || completeWidgets === undefined;

  // Filter components by search query across all categories
  const filterComponents = (categoryComponents: any[]) => {
    if (!searchQuery) return categoryComponents;
    const query = searchQuery.toLowerCase();
    return categoryComponents.filter((component) =>
      component.name.toLowerCase().includes(query) ||
      component.path.toLowerCase().includes(query) ||
      component.description?.toLowerCase().includes(query)
    );
  };

  // Get filtered counts for each category
  const getFilteredCount = (categoryKey: string) => {
    if (categoryKey === "widgets") {
      if (!completeWidgets) return 0;
      return filterComponents(completeWidgets).length;
    }
    if (!components) return 0;
    return filterComponents(components[categoryKey as keyof typeof components] || []).length;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Widget Components</h1>
        <p className="text-gray-600 mt-2">
          Browse custom widget components organized by category.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search across all widget components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      {!isLoading && components && completeWidgets && (
        <div className="flex gap-4 text-sm text-gray-600">
          <span>
            Total Widget Components: <strong>
              {(components.icons?.length || 0) +
                (components.animations?.length || 0) +
                (components["ai-elements"]?.length || 0) +
                (components["ask-anything"]?.length || 0) +
                (completeWidgets?.length || 0)}
            </strong>
          </span>
          {searchQuery && (
            <>
              <span>•</span>
              <span>
                Filtered: <strong>
                  {getFilteredCount("icons") +
                    getFilteredCount("animations") +
                    getFilteredCount("ai-elements") +
                    getFilteredCount("ask-anything") +
                    getFilteredCount("widgets")}
                </strong>
              </span>
            </>
          )}
        </div>
      )}

      {/* Widget Tabs by Category */}
      <Tabs defaultValue="icons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="icons">
            Icons {!isLoading && `(${getFilteredCount("icons")})`}
          </TabsTrigger>
          <TabsTrigger value="animations">
            Animations {!isLoading && `(${getFilteredCount("animations")})`}
          </TabsTrigger>
          <TabsTrigger value="ai-elements">
            AI Elements {!isLoading && `(${getFilteredCount("ai-elements")})`}
          </TabsTrigger>
          <TabsTrigger value="ask-anything">
            Ask Anything {!isLoading && `(${getFilteredCount("ask-anything")})`}
          </TabsTrigger>
          <TabsTrigger value="widgets">
            Widgets {!isLoading && `(${getFilteredCount("widgets")})`}
          </TabsTrigger>
        </TabsList>

        {/* Icons Tab */}
        <TabsContent value="icons" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterComponents(components?.icons || []).map((component) => (
                  <Card key={component.name} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4" />
                        <Link
                          href={`/admin/components/widgets/${component.name}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {component.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {component.description || "Icon component"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          {component.path}
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/admin/components/widgets/${component.name}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Preview
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filterComponents(components?.icons || []).length === 0 && (
                  <p className="text-center text-gray-500 col-span-full py-8">
                    {searchQuery ? "No icons match your search." : "No icon components found."}
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Animations Tab */}
        <TabsContent value="animations" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 1 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterComponents(components?.animations || []).map((component) => (
                  <Card key={component.name} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4" />
                        <Link
                          href={`/admin/components/widgets/${component.name}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {component.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {component.description || "Animation component"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          {component.path}
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/admin/components/widgets/${component.name}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Preview
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filterComponents(components?.animations || []).length === 0 && (
                  <p className="text-center text-gray-500 col-span-full py-8">
                    {searchQuery ? "No animations match your search." : "No animation components found."}
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* AI Elements Tab */}
        <TabsContent value="ai-elements" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterComponents(components?.["ai-elements"] || []).map((component) => (
                  <Card key={component.name} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4" />
                        <Link
                          href={`/admin/components/widgets/${component.name}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {component.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {component.description || "AI element component"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          {component.path}
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/admin/components/widgets/${component.name}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Preview
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filterComponents(components?.["ai-elements"] || []).length === 0 && (
                  <p className="text-center text-gray-500 col-span-full py-8">
                    {searchQuery ? "No AI elements match your search." : "No AI element components found."}
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Ask Anything Tab */}
        <TabsContent value="ask-anything" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 1 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterComponents(components?.["ask-anything"] || []).map((component) => (
                  <Card key={component.name} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4" />
                        <Link
                          href={`/admin/components/widgets/${component.name}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {component.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {component.description || "Ask Anything component"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          {component.path}
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/admin/components/widgets/${component.name}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Preview
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filterComponents(components?.["ask-anything"] || []).length === 0 && (
                  <p className="text-center text-gray-500 col-span-full py-8">
                    {searchQuery ? "No ask-anything components match your search." : "No ask-anything components found."}
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Widgets Tab (Complete Widgets) */}
        <TabsContent value="widgets" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 1 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterComponents(completeWidgets || []).map((widget) => (
                  <Card key={widget.name} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4" />
                        <Link
                          href={`/admin/components/widgets/complete/${widget.name}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {widget.name.replace(/-/g, " ")}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {widget.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {widget.phases && (
                            <Badge variant="secondary" className="text-xs">
                              {widget.phases} Phases
                            </Badge>
                          )}
                          {widget.componentCount && (
                            <Badge variant="outline" className="text-xs">
                              {widget.componentCount} Components
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          {widget.path}
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/admin/components/widgets/complete/${widget.name}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Preview
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filterComponents(completeWidgets || []).length === 0 && (
                  <p className="text-center text-gray-500 col-span-full py-8">
                    {searchQuery ? "No complete widgets match your search." : "No complete widgets found."}
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
