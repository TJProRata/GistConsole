"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function Home() {
  const isAdmin = useQuery(api.admin.isAdmin);

  return (
    <main className="container mx-auto p-8">
        <SignedOut>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Welcome to Gist Widget Builder</h1>
            <p className="text-gray-600 mb-8">
              Chat widget builder for your applications
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/preview">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Preview Widget
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Try before you sign up - no account required
              </p>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">
              {isAdmin ? "Welcome Back Admin!" : "Welcome Back!"}
            </h1>
            <p className="mb-8 text-gray-600">
              You&apos;re signed in. Visit your dashboard to manage widgets.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline">
                    Admin Portal
                  </Button>
                </Link>
              )}
              <Link href="/preview">
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview Widget
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Test widget configurations without saving
              </p>
            </div>
          </div>
        </SignedIn>
    </main>
  );
}
