"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const PREVIEW_SESSION_KEY = "gist_preview_session_id";
const PREVIEW_MODE_KEY = "gist_preview_mode";

/**
 * Hook to handle conversion of preview configuration to user configuration
 * Automatically runs when user signs up/signs in
 */
export function usePreviewConversion() {
  const { isSignedIn, isLoaded } = useUser();
  const convertPreview = useMutation(
    api.previewConfigurations.convertPreviewToUserConfig
  );
  const [conversionAttempted, setConversionAttempted] = useState(false);

  useEffect(() => {
    // Prevent multiple simultaneous conversion attempts
    if (!isLoaded || !isSignedIn || conversionAttempted) return;

    // Get preview session ID from localStorage
    const sessionId = localStorage.getItem(PREVIEW_SESSION_KEY);
    if (!sessionId) return;

    // Guard: Validate sessionId is non-empty
    if (sessionId.trim() === '') {
      localStorage.removeItem(PREVIEW_SESSION_KEY);
      localStorage.removeItem(PREVIEW_MODE_KEY);
      return;
    }

    // Check preview mode - skip conversion for authenticated preview sessions
    const previewMode = localStorage.getItem(PREVIEW_MODE_KEY);
    if (previewMode === 'authenticated_preview') {
      // This is a test preview for an authenticated user
      // Don't convert - just clean up the session
      localStorage.removeItem(PREVIEW_SESSION_KEY);
      localStorage.removeItem(PREVIEW_MODE_KEY);
      console.log("Authenticated preview session cleared (not converted)");
      return;
    }

    // Convert preview to user configuration (guest flow only)
    const convert = async () => {
      // Mark as attempted to prevent race conditions
      setConversionAttempted(true);

      try {
        await convertPreview({ sessionId });

        // Clean up session ID after successful conversion
        localStorage.removeItem(PREVIEW_SESSION_KEY);
        localStorage.removeItem(PREVIEW_MODE_KEY);

        console.log("Preview configuration converted successfully");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);

        // Expected cases - silent cleanup
        if (
          errorMessage.includes("already converted") ||
          errorMessage.includes("not found")
        ) {
          if (process.env.NODE_ENV === 'development') {
            console.debug("Preview conversion not needed:", errorMessage);
          }
          localStorage.removeItem(PREVIEW_SESSION_KEY);
          localStorage.removeItem(PREVIEW_MODE_KEY);
          return;
        }

        // Unexpected errors - log even in production
        console.error("Preview conversion failed:", err);
        localStorage.removeItem(PREVIEW_SESSION_KEY);
        localStorage.removeItem(PREVIEW_MODE_KEY);
      }
    };

    convert();
  }, [isSignedIn, isLoaded, convertPreview, conversionAttempted]);
}
