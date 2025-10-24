"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = useQuery(api.admin.isAdmin);
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admin users to dashboard
    if (isAdmin === false) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  // Loading state while checking admin status
  if (isAdmin === undefined) {
    return (
      <div className="flex h-screen">
        <div className="w-64 border-r border-gray-200 bg-white p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Show nothing while redirecting non-admin users
  if (isAdmin === false) {
    return null;
  }

  // Render admin layout for admin users
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
