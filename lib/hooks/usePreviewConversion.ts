"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const PREVIEW_SESSION_KEY = "gist_preview_session_id";

/**
 * Hook to handle conversion of preview configuration to user configuration
 * Automatically runs when user signs up/signs in
 */
export function usePreviewConversion() {
  const { isSignedIn, isLoaded } = useUser();
  const convertPreview = useMutation(
    api.previewConfigurations.convertPreviewToUserConfig
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Get preview session ID from localStorage
    const sessionId = localStorage.getItem(PREVIEW_SESSION_KEY);
    if (!sessionId) return;

    // Guard: Validate sessionId is non-empty
    if (sessionId.trim() === '') {
      localStorage.removeItem(PREVIEW_SESSION_KEY);
      return;
    }

    // Convert preview to user configuration
    const convert = async () => {
      try {
        await convertPreview({ sessionId });

        // Clean up session ID after successful conversion
        localStorage.removeItem(PREVIEW_SESSION_KEY);

        console.log("Preview configuration converted successfully");
      } catch (err) {
        // Preview might not exist or already converted - silent handling in production
        if (process.env.NODE_ENV === 'development') {
          console.debug("Preview conversion not needed:", err);
        }
        // Clean up session ID anyway
        localStorage.removeItem(PREVIEW_SESSION_KEY);
      }
    };

    convert();
  }, [isSignedIn, isLoaded, convertPreview]);
}
