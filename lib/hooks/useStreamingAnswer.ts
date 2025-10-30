"use client";

import { useState, useCallback, useRef } from "react";
import type { AnswerState } from "@/components/widget_components/types";

export interface UseStreamingAnswerReturn {
  /** Current state of the answer */
  answerState: AnswerState;
  /** Accumulated streamed text */
  streamedText: string;
  /** Error message if state is "error" */
  error: string | null;
  /** Start streaming an answer for the given query */
  startStreaming: (query: string) => Promise<void>;
  /** Reset to idle state */
  resetAnswer: () => void;
}

/**
 * Custom hook for managing OpenAI streaming answers.
 * Handles fetch to /api/openai/stream, text accumulation, and state transitions.
 *
 * @param apiUrl - Optional API server URL for external embeds (e.g., "https://gist-console.vercel.app")
 */
export function useStreamingAnswer(apiUrl?: string): UseStreamingAnswerReturn {
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback(async (query: string) => {
    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Reset state
    setStreamedText("");
    setError(null);
    setAnswerState("loading");

    try {
      // Construct endpoint URL (absolute if apiUrl provided, relative otherwise)
      const endpoint = apiUrl
        ? `${apiUrl.replace(/\/$/, '')}/api/openai/stream`
        : "/api/openai/stream";

      console.log("[useStreamingAnswer] Starting stream for query:", query);
      console.log("[useStreamingAnswer] API endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to generate answer",
          details: `HTTP ${response.status}`,
        }));
        throw new Error(errorData.error || "Failed to generate answer");
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      console.log("[useStreamingAnswer] Stream started successfully");
      setAnswerState("streaming");

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("[useStreamingAnswer] Stream complete");
          setAnswerState("complete");
          break;
        }

        // Decode chunk and accumulate
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setStreamedText(accumulatedText);
      }
    } catch (err) {
      // Don't set error state if aborted intentionally
      if (err instanceof Error && err.name === "AbortError") {
        console.log("[useStreamingAnswer] Stream aborted");
        return;
      }

      console.error("[useStreamingAnswer] Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setAnswerState("error");
    }
  }, []);

  const resetAnswer = useCallback(() => {
    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset state
    setAnswerState("idle");
    setStreamedText("");
    setError(null);
  }, []);

  return {
    answerState,
    streamedText,
    error,
    startStreaming,
    resetAnswer,
  };
}
