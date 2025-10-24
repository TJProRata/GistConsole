"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
}

interface NavigationSection {
  name: string;
  items: NavigationItem[];
}

const navigation: NavigationSection[] = [
  {
    name: "Set up Gist Answers",
    items: [
      { name: "Provide your content", href: "/dashboard" },
      { name: "Install your widget", href: "/dashboard/install-widget" },
      { name: "Configure widgets", href: "/dashboard/configure-widget" },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <aside className="flex h-[calc(100vh-64px)] w-64 flex-col border-r border-gray-200 bg-white">
      {/* User Profile Section */}
      <div className="border-b border-gray-200 p-6">
        {isLoaded && user ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {user.fullName || user.emailAddresses[0]?.emailAddress}
            </p>
            <p className="text-xs text-gray-500">Partner Admin</p>
          </div>
        ) : (
          <div className="h-10 animate-pulse space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-24 rounded bg-gray-200"></div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Sidebar navigation">
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
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Support Link */}
      <div className="border-t border-gray-200 p-4">
        <Link href="mailto:support@gist.ai">
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Mail className="mr-2 h-4 w-4" />
            Support
          </Button>
        </Link>
      </div>
    </aside>
  );
}
