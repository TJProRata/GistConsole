/**
 * Citation Utility Functions
 * Parses citation markers from text and formats source data
 */

import type { Citation, SourceDistribution } from "@/components/widget_components/types";

/**
 * Parses citation markers [1], [2] from text and extracts citation data
 * @param text - Raw text with citation markers like "This is a fact[1]. Another fact[2]."
 * @param citations - Array of citation objects with metadata
 * @returns Object with parsed text segments and citation data
 */
export function parseCitationsFromText(
  text: string,
  citations: Citation[]
): {
  parsedText: string;
  citationMap: Map<number, Citation>;
} {
  // Create a map of citation numbers to citation objects
  const citationMap = new Map<number, Citation>();
  citations.forEach((citation) => {
    citationMap.set(citation.number, citation);
  });

  // Text is already formatted with [1], [2] markers from API
  // Just return it as-is for rendering
  return {
    parsedText: text,
    citationMap,
  };
}

/**
 * Extracts all citation numbers from text
 * @param text - Text with citation markers like [1], [2]
 * @returns Array of citation numbers found in text
 */
export function extractCitationNumbers(text: string): number[] {
  const citationRegex = /\[(\d+)\]/g;
  const matches = [...text.matchAll(citationRegex)];
  return matches.map((match) => parseInt(match[1], 10));
}

/**
 * Formats source distribution percentages for display
 * @param sources - Array of source distribution data
 * @returns Formatted string like "26% Eater, 20% Grub Street, 18% Thrillist"
 */
export function formatSourcePercentages(sources: SourceDistribution[]): string {
  if (sources.length === 0) return "";

  // Sort by percentage descending
  const sorted = [...sources].sort((a, b) => b.percentage - a.percentage);

  // Take top 3 sources
  const top3 = sorted.slice(0, 3);

  return top3.map((source) => `${source.percentage}% ${source.name}`).join(", ");
}

/**
 * Validates that percentages in source distribution sum to 100
 * @param sources - Array of source distribution data
 * @returns True if percentages sum to approximately 100 (within 1% tolerance)
 */
export function validateSourcePercentages(sources: SourceDistribution[]): boolean {
  const sum = sources.reduce((total, source) => total + source.percentage, 0);
  return Math.abs(sum - 100) < 1; // Allow 1% tolerance for rounding
}

/**
 * Generates citation ID from citation number
 * @param citationNumber - Citation number (1, 2, 3...)
 * @returns Citation ID string like "citation-1"
 */
export function getCitationId(citationNumber: number): string {
  return `citation-${citationNumber}`;
}

/**
 * Parses citation number from citation ID
 * @param citationId - Citation ID string like "citation-1"
 * @returns Citation number or null if invalid format
 */
export function parseCitationId(citationId: string): number | null {
  const match = citationId.match(/^citation-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
