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
  const [useExtendedPolling, setUseExtendedPolling] = useState(false);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRIES = 10;
  const BASE_DELAY = 100; // Start with 100ms
  const EXTENDED_POLL_INTERVAL = 2000; // 2 seconds for extended polling

  useEffect(() => {
    // Only attempt sync when user is loaded and signed in
    if (!isLoaded || !isSignedIn || !user || hasSynced.current) {
      return;
    }

    const attemptSync = async () => {
      try {
        const userId = await syncUser();

        if (userId === null) {
          // Auth context not ready yet - retry with exponential backoff or extended polling
          if (retryCount < MAX_RETRIES) {
            const delay = BASE_DELAY * Math.pow(2, retryCount);
            console.log(
              `Waiting for auth context (attempt ${retryCount + 1}/${MAX_RETRIES})`
            );

            retryTimerRef.current = setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, delay);
          } else if (!useExtendedPolling) {
            // Switch to extended polling after fast retries exhausted
            console.warn(
              "Max fast retries exceeded, switching to extended polling every 2s. This is normal for slow connections."
            );
            setUseExtendedPolling(true);

            retryTimerRef.current = setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, EXTENDED_POLL_INTERVAL);
          } else {
            // Continue extended polling
            retryTimerRef.current = setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, EXTENDED_POLL_INTERVAL);
          }
        } else {
          // Success - user synced
          hasSynced.current = true;
          const syncTime = retryCount * BASE_DELAY;
          console.log(`User synced to Convex database${retryCount > 0 ? ` (took ${retryCount} attempts)` : ""}`);
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
        } else {
          // Switch to extended polling on persistent errors
          retryTimerRef.current = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, EXTENDED_POLL_INTERVAL);
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
  }, [isLoaded, isSignedIn, user, syncUser, retryCount, useExtendedPolling]);
}
