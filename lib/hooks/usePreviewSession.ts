"use client";

import { useEffect, useState } from "react";

const PREVIEW_SESSION_KEY = "gist_preview_session_id";

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Hook to manage preview session ID
 * - Generates session ID if doesn't exist
 * - Persists in localStorage
 * - Provides cleanup method
 */
export function usePreviewSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get or create session ID
    const storedSessionId = localStorage.getItem(PREVIEW_SESSION_KEY);

    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = generateUUID();
      localStorage.setItem(PREVIEW_SESSION_KEY, newSessionId);
      setSessionId(newSessionId);
    }

    setIsLoading(false);
  }, []);

  const clearSession = () => {
    localStorage.removeItem(PREVIEW_SESSION_KEY);
    setSessionId(null);
  };

  const refreshSession = () => {
    const newSessionId = generateUUID();
    localStorage.setItem(PREVIEW_SESSION_KEY, newSessionId);
    setSessionId(newSessionId);
  };

  return {
    sessionId,
    isLoading,
    clearSession,
    refreshSession,
  };
}
