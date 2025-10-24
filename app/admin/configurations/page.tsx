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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const CATEGORIES = [
  "All",
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

export default function ConfigurationsPage() {
  const configurations = useQuery(api.admin.getAllConfigurations);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const isLoading = configurations === undefined;

  // Filter configurations by search query and category
  const filteredConfigs = configurations?.filter((config) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      config.publicationName.toLowerCase().includes(query) ||
      config.userEmail?.toLowerCase().includes(query) ||
      config.userName?.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "All" || config.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Widget Configurations</h1>
        <p className="text-gray-600 mt-2">
          View and manage all widget configurations across all users.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by publication, user, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      {!isLoading && (
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total Configurations: <strong>{configurations.length}</strong></span>
          <span>•</span>
          <span>WordPress: <strong>{configurations.filter(c => c.ingestionMethod === "wordpress").length}</strong></span>
          <span>•</span>
          <span>RSS: <strong>{configurations.filter(c => c.ingestionMethod === "rss").length}</strong></span>
          {(searchQuery || categoryFilter !== "All") && (
            <>
              <span>•</span>
              <span>Filtered: <strong>{filteredConfigs?.length}</strong></span>
            </>
          )}
        </div>
      )}

      {/* Configurations Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Publication</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredConfigs && filteredConfigs.length > 0 ? (
              // Display filtered configurations
              filteredConfigs.map((config) => (
                <TableRow key={config._id}>
                  <TableCell className="font-medium">
                    {config.publicationName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{config.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        config.ingestionMethod === "wordpress"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {config.ingestionMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex flex-col">
                      <span className="text-sm">{config.userName || "No name"}</span>
                      <span className="text-xs text-gray-500">{config.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(config.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-gray-400">
                      View details
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchQuery || categoryFilter !== "All"
                    ? "No configurations match your filters."
                    : "No configurations found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
