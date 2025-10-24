"use client";

import { useUserSync } from "@/lib/hooks/useUserSync";

export default function InstallWidgetPage() {
  // Automatically sync Clerk user to Convex database
  useUserSync();

  return (
    <div className="container mx-auto max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Install your widget</h1>
        <p className="mt-2 text-gray-600">
          Widget installation and configuration instructions will be available here soon.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Widget Installation
          </h2>
          <p className="text-sm text-gray-500">
            This feature is coming soon. You'll be able to copy your widget embed code and
            customize its appearance here.
          </p>
        </div>
      </div>
    </div>
  );
}
