"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";
import Link from "next/link";

export default function UIComponentsPage() {
  const components = useQuery(api.components.getUIComponentsList);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = components === undefined;

  // Filter components by search query
  const filteredComponents = components?.filter((component) => {
    const query = searchQuery.toLowerCase();
    return (
      component.name.toLowerCase().includes(query) ||
      component.path.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">UI Components</h1>
        <p className="text-gray-600 mt-2">
          Browse all shadcn/ui components installed in the application.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by component name or path..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      {!isLoading && (
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total Components: <strong>{components.length}</strong></span>
          {searchQuery && (
            <>
              <span>•</span>
              <span>Filtered: <strong>{filteredComponents?.length}</strong></span>
            </>
          )}
        </div>
      )}

      {/* Components Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Path</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredComponents && filteredComponents.length > 0 ? (
              // Display filtered components
              filteredComponents.map((component) => (
                <TableRow key={component.name} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/components/ui-components/${component.name}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {component.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{component.category}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 font-mono text-xs">
                    {component.path}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/components/ui-components/${component.name}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Preview
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? "No components match your search query."
                    : "No components found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
