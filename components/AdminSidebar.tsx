"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard, Users, Settings, BarChart3, FileText, Boxes, Box, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationSection {
  name: string;
  items: NavigationItem[];
}

const navigation: NavigationSection[] = [
  {
    name: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    name: "Management",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Configurations", href: "/admin/configurations", icon: FileText },
    ],
  },
  {
    name: "Components",
    items: [
      { name: "Overview", href: "/admin/components", icon: Boxes },
      { name: "UI Components", href: "/admin/components/ui-components", icon: Box },
      { name: "Widget Components", href: "/admin/components/widgets", icon: Package },
    ],
  },
  {
    name: "System",
    items: [
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <aside className="flex h-[calc(100vh-64px)] w-64 flex-col border-r border-gray-200 bg-white">
      {/* Admin Profile Section */}
      <div className="border-b border-gray-200 p-6">
        {isLoaded && user ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {user.fullName || user.emailAddresses[0]?.emailAddress}
            </p>
            <p className="text-xs text-blue-600 font-semibold">Administrator</p>
          </div>
        ) : (
          <div className="h-10 animate-pulse space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-24 rounded bg-gray-200"></div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Admin navigation">
        {navigation.map((section) => (
          <div key={section.name} className="space-y-1">
            {/* Section Header */}
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.name}
            </h3>

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-3 py-2 text-sm font-normal transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Back to User Dashboard */}
      <div className="border-t border-gray-200 p-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            ← Back to User Dashboard
          </Button>
        </Link>
      </div>
    </aside>
  );
}
