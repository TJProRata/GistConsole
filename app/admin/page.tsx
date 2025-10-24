"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileText, Activity, Settings, Boxes } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const userStats = useQuery(api.admin.getUserStats);
  const configStats = useQuery(api.admin.getConfigStats);

  const isLoading = userStats === undefined || configStats === undefined;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your platform's users, configurations, and system health.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {userStats.recentUsers} new in last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Configurations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{configStats.totalConfigurations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {configStats.wordpressCount} WP, {configStats.rssCount} RSS
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Admin Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{userStats.adminCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {userStats.userCount} regular users
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manage Users
              </CardTitle>
              <CardDescription>
                View, edit, and manage user accounts and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full">View Users</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Widget Configurations
              </CardTitle>
              <CardDescription>
                Review and manage all widget configurations across users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/configurations">
                <Button className="w-full">View Configurations</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                Component Library
              </CardTitle>
              <CardDescription>
                Browse UI components and widget library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/components">
                <Button className="w-full">View Components</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                Monitor platform usage, trends, and performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/analytics">
                <Button className="w-full">View Analytics</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Breakdown */}
      {!isLoading && configStats && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Configuration Categories</h2>
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>
                Breakdown of configurations by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(configStats.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{category}</p>
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
