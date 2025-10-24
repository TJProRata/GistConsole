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

  /** Custom color overrides for theming */
  customColors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };

  /** Custom gradient configuration */
  customGradient?: {
    start?: string;
    end?: string;
    use?: boolean;
  };

  /** Custom dimensions for widget size */
  customDimensions?: {
    width?: number;
    height?: number;
  };

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

  /** Custom styles for container */
  containerStyles?: React.CSSProperties;

  /** Custom styles for header */
  headerStyles?: React.CSSProperties;

  /** Custom styles for submit button */
  buttonStyles?: React.CSSProperties;

  /** Custom styles for input */
  inputStyles?: React.CSSProperties;

  /** Custom styles for welcome card */
  welcomeCardStyles?: React.CSSProperties;

  /** Custom styles for scroll area */
  scrollAreaStyles?: React.CSSProperties;
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

  /** Custom styles for card */
  customStyles?: React.CSSProperties;
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

/**
 * NYT Chat Widget TypeScript Type Definitions
 */

/**
 * Widget state machine type
 */
export type NYTWidgetState = "collapsed" | "search" | "loading" | "answer";

/**
 * NYT Chat Widget Props
 */
export interface NYTChatWidgetProps {
  /** Controls whether the widget is expanded or collapsed */
  isExpanded?: boolean;

  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;

  /** Default expanded state for uncontrolled mode */
  defaultExpanded?: boolean;

  /** Text shown in collapsed button state */
  collapsedText?: string;

  /** Main widget title */
  title?: string;

  /** Suggestion categories for initial view */
  suggestionCategories?: string[];

  /** Search input placeholder */
  placeholder?: string;

  /** Follow-up input placeholder */
  followUpPlaceholder?: string;

  /** Branding text at footer */
  brandingText?: string;

  /** Callback when question is submitted */
  onSubmit?: (query: string) => void;

  /** Callback when category clicked */
  onCategoryClick?: (category: string) => void;

  /** Callback when citation clicked */
  onCitationClick?: (citation: string) => void;

  /** Theme variant for color mode (default: "auto" - respects system/parent theme) */
  theme?: "light" | "dark" | "auto";

  /** Enable color mode responsiveness (default: true) */
  colorModeResponsive?: boolean;

  /** Primary accent color (default: "#9333ea" purple) */
  primaryColor?: string;

  /** Use gradient for borders and styling (default: false) */
  useGradient?: boolean;

  /** Gradient start color (used when useGradient=true) */
  gradientStart?: string;

  /** Gradient end color (used when useGradient=true) */
  gradientEnd?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Expanded State Props
 */
export interface NYTWidgetExpandedProps {
  /** Widget title */
  title: string;

  /** Suggestion categories */
  suggestionCategories: string[];

  /** Search placeholder */
  placeholder: string;

  /** Follow-up placeholder */
  followUpPlaceholder: string;

  /** Branding text */
  brandingText: string;

  /** Current widget state */
  currentState: NYTWidgetState;

  /** Current search query */
  query: string | null;

  /** Answer text */
  answer: string | null;

  /** Citation sources */
  citations: string[];

  /** Loading state */
  isLoading: boolean;

  /** Close handler */
  onClose: () => void;

  /** Submit handler */
  onSubmit: (query: string) => void;

  /** Category click handler */
  onCategoryClick: (category: string) => void;

  /** Citation click handler */
  onCitationClick: (citation: string) => void;
}

/**
 * Autocomplete List Props
 */
export interface AutocompleteListProps {
  /** Current query */
  query: string;

  /** Suggested completions */
  suggestions: string[];

  /** Selection handler */
  onSelect: (suggestion: string) => void;
}

/**
 * Answer Display Props
 */
export interface AnswerDisplayProps {
  /** User's query */
  query: string;

  /** AI response */
  answer: string;

  /** Source citations */
  citations: string[];

  /** Loading state */
  isLoading: boolean;

  /** Answer expanded state */
  isExpanded: boolean;

  /** Toggle expand handler */
  onToggleExpand: () => void;

  /** Citation click handler */
  onCitationClick: (citation: string) => void;
}

/**
 * Streaming Answer Props
 */
export interface StreamingAnswerProps {
  /** Answer text to display */
  text: string;

  /** Loading/streaming state */
  isLoading: boolean;

  /** Expanded state */
  isExpanded: boolean;

  /** Toggle handler */
  onToggleExpand: () => void;

  /** Max lines in collapsed state */
  maxLinesCollapsed?: number;

  /** Max lines in expanded state */
  maxLinesExpanded?: number;
}

/**
 * Citation Pills Props
 */
export interface CitationPillsProps {
  /** Citation sources */
  citations: string[];

  /** Visible count before "More" */
  visibleCount?: number;

  /** Citation click handler */
  onCitationClick: (citation: string) => void;
}

/**
 * Suggestion Categories Props
 */
export interface SuggestionCategoriesProps {
  /** Category labels */
  categories: string[];

  /** Visible count before "More" */
  visibleCount?: number;

  /** Category click handler */
  onCategoryClick: (category: string) => void;
}

/**
 * Widget internal state
 */
export interface NYTChatWidgetState {
  /** Current widget mode */
  widgetState: NYTWidgetState;

  /** Current query text */
  currentQuery: string;

  /** AI response */
  answer: string | null;

  /** Source citations */
  citations: string[];

  /** Answer expansion state */
  isAnswerExpanded: boolean;

  /** Autocomplete suggestions */
  autocompleteResults: string[];

  /** Internal expanded state (uncontrolled mode) */
  internalExpanded: boolean;
}
