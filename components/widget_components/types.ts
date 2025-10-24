/**
 * OnboardingWidget TypeScript Type Definitions
 */

/**
 * Variant types for onboarding widget
 */
export type OnboardingVariant = "demo" | "gist-creation";

/**
 * Gist creation data collected through the onboarding flow
 */
export interface GistCreationData {
  type: "person" | "product" | "place";
  title: string;
  slug: string;
  goal: "book" | "buy" | "waitlist";
  audience: "prospects" | "fans" | "investors";
  vibe: "friendly" | "professional" | "bold";
  source_url: string;
  hero_style?: "image" | "video" | "gradient";
  cta_placement?: string;
  preview_choice?: string;
  publish_decision?: string;
}

/**
 * Form state for gist creation
 */
export interface GistFormState {
  type: "person" | "product" | "place" | null;
  title: string;
  slug: string;
  goal: "book" | "buy" | "waitlist" | null;
  audience: "prospects" | "fans" | "investors" | null;
  vibe: "friendly" | "professional" | "bold" | null;
  source_url: string;
  hero_style: "image" | "video" | "gradient" | null;
  cta_placement: string;
  preview_choice: string;
  publish_decision: string;
}

/**
 * Form actions for reducer
 */
export type GistFormAction =
  | { type: "SET_TYPE"; payload: "person" | "product" | "place" }
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_SLUG"; payload: string }
  | { type: "SET_GOAL"; payload: "book" | "buy" | "waitlist" }
  | { type: "SET_AUDIENCE"; payload: "prospects" | "fans" | "investors" }
  | { type: "SET_VIBE"; payload: "friendly" | "professional" | "bold" }
  | { type: "SET_SOURCE_URL"; payload: string }
  | { type: "SET_HERO_STYLE"; payload: "image" | "video" | "gradient" }
  | { type: "SET_CTA_PLACEMENT"; payload: string }
  | { type: "SET_PREVIEW_CHOICE"; payload: string }
  | { type: "SET_PUBLISH_DECISION"; payload: string }
  | { type: "RESET_FORM" };

/**
 * API response from create-preview endpoint
 */
export interface CreatePreviewResponse {
  success: boolean;
  previewUrl: string;
  slug: string;
  gistId?: string;
}

export interface OnboardingWidgetProps {
  /** Controls whether the widget is expanded or collapsed */
  isExpanded: boolean;
  /** Callback when expand state changes */
  onExpandChange: (expanded: boolean) => void;
  /** Widget variant (demo or gist-creation) */
  variant?: OnboardingVariant;
  /** Callback when gist creation is complete */
  onComplete?: (data: CreatePreviewResponse) => void;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
}

export interface PhaseState {
  /** Current phase number (1-15) */
  currentPhase: number;
  /** Whether user can proceed to next phase */
  canProceed: boolean;
  /** User responses and selections */
  responses: Record<string, unknown>;
}

export type Phase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface PhaseConfig {
  /** Phase number */
  phase: Phase;
  /** Phase title */
  title: string;
  /** Phase description */
  description?: string;
  /** Whether this phase requires user input */
  requiresInput: boolean;
}
