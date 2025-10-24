"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Automatically syncs the authenticated Clerk user to the Convex database.
 * Implements retry logic with exponential backoff to handle auth context timing.
 * Call this hook in protected pages to ensure the user exists in Convex.
 */
export function useUserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  const hasSynced = useRef(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRIES = 5;
  const BASE_DELAY = 100; // Start with 100ms

  useEffect(() => {
    // Only attempt sync when user is loaded and signed in
    if (!isLoaded || !isSignedIn || !user || hasSynced.current) {
      return;
    }

    const attemptSync = async () => {
      try {
        const userId = await syncUser();

        if (userId === null) {
          // Auth context not ready yet - retry with exponential backoff
          if (retryCount < MAX_RETRIES) {
            const delay = BASE_DELAY * Math.pow(2, retryCount);
            console.log(
              `Auth context not ready, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`
            );

            retryTimerRef.current = setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, delay);
          } else {
            console.error(
              "Failed to sync user after maximum retries. Auth context may not be initialized."
            );
          }
        } else {
          // Success - user synced
          hasSynced.current = true;
          console.log("User synced to Convex database");
        }
      } catch (error) {
        // Actual error (not auth timing issue)
        console.error("Failed to sync user:", error);

        // Retry on error if we haven't exceeded max attempts
        if (retryCount < MAX_RETRIES) {
          const delay = BASE_DELAY * Math.pow(2, retryCount);
          retryTimerRef.current = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, delay);
        }
      }
    };

    attemptSync();

    // Cleanup timeout on unmount
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [isLoaded, isSignedIn, user, syncUser, retryCount]);
}
