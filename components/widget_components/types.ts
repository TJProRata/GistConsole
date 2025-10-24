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

/**
 * Woman's World Widget TypeScript Type Definitions
 */

/**
 * Woman's World Widget Props
 */
export interface WomensWorldWidgetProps {
  /** Controls whether the widget is expanded or collapsed */
  isExpanded?: boolean;

  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;

  /** Default expanded state for uncontrolled mode */
  defaultExpanded?: boolean;

  /** Text shown in collapsed button state */
  collapsedText?: string;

  /** Widget title with sparkle emoji */
  title?: string;

  /** Placeholder text for search input */
  placeholder?: string;

  /** Pre-populated seed questions for carousel */
  seedQuestions?: string[];

  /** Auto-scroll interval in milliseconds */
  autoScrollInterval?: number;

  /** Branding text for footer */
  brandingText?: string;

  /** Callback when question is submitted */
  onSubmit?: (question: string) => void;

  /** Optional width in pixels for expanded state (default: 392). Preview-only feature. */
  width?: number;

  /** Optional max-height constraint in pixels for expanded state (default: auto). Preview-only feature. */
  height?: number;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Search Input Section Props
 */
export interface SearchInputSectionProps {
  /** Placeholder text */
  placeholder: string;

  /** Submit handler */
  onSubmit: (query: string) => void;

  /** Seed questions for dual carousels (displayed in two rows) */
  seedQuestions: string[];

  /** Auto-scroll interval in milliseconds (applies to both carousel rows) */
  autoScrollInterval: number;
}

/**
 * Seed Questions Carousel Props
 */
export interface SeedQuestionsCarouselProps {
  /** Array of question strings */
  questions: string[];

  /** Auto-scroll interval in milliseconds */
  autoScrollInterval: number;

  /** Handler when question pill is clicked */
  onQuestionClick: (question: string) => void;

  /** Currently selected question (for highlighting) */
  selectedQuestion?: string | null;
}

/**
 * Question Pill Props
 */
export interface QuestionPillProps {
  /** Question text to display */
  question: string;

  /** Click handler */
  onClick: () => void;

  /** Whether this pill is selected */
  isSelected?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Widget internal state
 */
export interface WomensWorldWidgetState {
  /** Current question text */
  selectedQuestion: string | null;

  /** Whether widget is expanded (uncontrolled mode) */
  internalExpanded: boolean;
}

// Import and re-export CarouselApi type
import type { CarouselApi } from "@/components/ui/carousel";
export type { CarouselApi };

/**
 * Carousel state
 */
export interface CarouselState {
  /** Carousel API instance */
  api: CarouselApi | null;

  /** Whether autoplay is paused */
  isPaused: boolean;
}

/**
 * Rufus Widget TypeScript Type Definitions
 */

/**
 * Rufus Widget Props
 */
export interface RufusWidgetProps {
  /** Controls whether the widget is expanded or collapsed */
  isExpanded?: boolean;

  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;

  /** Default expanded state for uncontrolled mode */
  defaultExpanded?: boolean;

  /** Text shown in collapsed button state */
  collapsedText?: string;

  /** Number of seed questions visible in collapsed state */
  visibleSeedQuestionsCollapsed?: number;

  /** Pre-populated seed questions for suggestions */
  seedQuestions?: string[];

  /** Welcome heading in expanded state */
  welcomeHeading?: string;

  /** Welcome message with AI disclaimer */
  welcomeMessage?: string;

  /** Question prompt heading */
  questionPrompt?: string;

  /** Placeholder text for input */
  inputPlaceholder?: string;

  /** Show menu button in header */
  showMenu?: boolean;

  /** Callback when question is submitted */
  onSubmit?: (question: string) => void;

  /** Callback when menu button clicked */
  onMenuClick?: () => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Collapsed State Props
 */
export interface RufusWidgetCollapsedProps {
  /** Text for collapsed button */
  collapsedText: string;

  /** Seed questions to display */
  seedQuestions: string[];

  /** Number of visible questions */
  visibleQuestions: number;

  /** Handler to expand widget */
  onExpand: () => void;

  /** Handler when question clicked (expands AND populates) */
  onQuestionClick: (question: string) => void;
}

/**
 * Expanded State Props
 */
export interface RufusWidgetExpandedProps {
  /** Welcome heading */
  welcomeHeading: string;

  /** Welcome message */
  welcomeMessage: string;

  /** Question prompt heading */
  questionPrompt: string;

  /** Seed questions for list */
  seedQuestions: string[];

  /** Input placeholder */
  inputPlaceholder: string;

  /** Show menu button */
  showMenu: boolean;

  /** Handler to close widget */
  onClose: () => void;

  /** Handler for menu button */
  onMenuClick: () => void;

  /** Handler when question pill clicked (populates input, NOT submit) */
  onQuestionClick: (question: string) => void;

  /** Handler when question submitted */
  onSubmit: (question: string) => void;
}

/**
 * Seed Questions List Props
 */
export interface SeedQuestionsListProps {
  /** Array of question strings */
  questions: string[];

  /** Handler when question pill is clicked */
  onQuestionClick: (question: string) => void;

  /** Currently selected question (for highlighting) */
  selectedQuestion?: string | null;

  /** Show scroll indicator (down arrow) */
  showScrollIndicator: boolean;

  /** Variant for container styling */
  variant?: "collapsed" | "expanded";
}

/**
 * Seed Question Pill Props
 */
export interface SeedQuestionPillProps {
  /** Question text to display */
  question: string;

  /** Click handler */
  onClick: () => void;

  /** Whether this pill is selected */
  isSelected?: boolean;

  /** Visual variant */
  variant?: "light" | "dark" | "cta";

  /** Additional CSS classes */
  className?: string;
}

/**
 * Welcome Card Props
 */
export interface WelcomeCardProps {
  /** Welcome heading */
  heading: string;

  /** Welcome message */
  message: string;

  /** Learn more link URL */
  learnMoreUrl?: string;
}

/**
 * Widget internal state
 */
export interface RufusWidgetState {
  /** Current question text in input */
  selectedQuestion: string | null;

  /** Whether widget is expanded (uncontrolled mode) */
  internalExpanded: boolean;
}

/**
 * Seed questions list state
 */
export interface SeedQuestionsListState {
  /** Current scroll position */
  scrollPosition: number;

  /** Whether scrolled to bottom (for indicator) */
  isScrolledToBottom: boolean;
}
