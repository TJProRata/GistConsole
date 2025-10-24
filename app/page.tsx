"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const isAdmin = useQuery(api.admin.isAdmin);

  return (
    <main className="container mx-auto p-8">
        <SignedOut>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Welcome to Gist Console</h1>
            <p className="text-gray-600">
              Chat widget management console for your applications
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Please sign in to access your dashboard
            </p>
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
            </div>
          </div>
        </SignedIn>
    </main>
  );
}
