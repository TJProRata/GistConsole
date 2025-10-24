"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Monitor platform usage, trends, and performance metrics.
        </p>
      </div>

      {/* Coming Soon Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Analytics Dashboard Coming Soon</AlertTitle>
        <AlertDescription>
          This page is under development. Check back soon for detailed analytics, charts, and insights about your platform usage.
        </AlertDescription>
      </Alert>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Track user signups over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Widget Usage</CardTitle>
            <CardDescription>Configuration creation trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Most used configuration categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Data visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Response times and uptime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Metrics dashboard coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future Features List */}
      <Card>
        <CardHeader>
          <CardTitle>Planned Features</CardTitle>
          <CardDescription>Analytics features in development</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Real-time user activity tracking</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Configuration usage statistics and trends</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Widget performance metrics (load times, interactions)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>User engagement analytics</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Export capabilities for reports</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Custom date range filters</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
