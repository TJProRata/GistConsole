import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
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
            <h1 className="mb-4 text-4xl font-bold">Welcome Back!</h1>
            <p className="mb-8 text-gray-600">
              You&apos;re signed in. Visit your dashboard to manage widgets.
            </p>
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </SignedIn>
    </main>
  );
}
