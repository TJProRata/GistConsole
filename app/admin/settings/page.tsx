"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure system-wide settings and preferences.
        </p>
      </div>

      {/* Coming Soon Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Settings Panel Coming Soon</AlertTitle>
        <AlertDescription>
          This page is under development. Check back soon for comprehensive system configuration options.
        </AlertDescription>
      </Alert>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>
                Basic system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Configuration form coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Application name and branding</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Default user roles and permissions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>System timezone and locale settings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Widget default configurations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure email notifications and templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Email settings form coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>SMTP server configuration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Email template customization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Notification preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Email testing and preview</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Manage security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Security settings form coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Password policies and requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Two-factor authentication settings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Session timeout configuration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>IP whitelist and blacklist management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>API key management</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Configure external service integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Integrations panel coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planned Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Analytics platforms (Google Analytics, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Payment gateways integration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Third-party authentication providers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Webhook configurations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
