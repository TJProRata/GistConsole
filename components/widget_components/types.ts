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

  /**
   * Pre-populated seed questions for first carousel row.
   * Use this for health/medical-focused questions.
   */
  seedQuestionsRow1?: string[];

  /**
   * Pre-populated seed questions for second carousel row.
   * Use this for wellness/lifestyle-focused questions.
   */
  seedQuestionsRow2?: string[];

  /**
   * @deprecated Use seedQuestionsRow1 and seedQuestionsRow2 instead for independent carousel rows.
   * This prop is maintained for backward compatibility. If provided without row-specific props,
   * the array will be split: first 6 items go to row 1, next 6 items go to row 2.
   */
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

  /**
   * Widget placement position for floating variant only (default: "bottom-right").
   * Controls where the widget appears on the page.
   * - "bottom-left": Fixed position at bottom-left corner
   * - "bottom-center": Fixed position at bottom-center
   * - "bottom-right": Fixed position at bottom-right corner
   */
  placement?: "bottom-left" | "bottom-center" | "bottom-right";

  /** Additional CSS classes */
  className?: string;

  /** Enable inline OpenAI streaming answers (default: false) */
  enableStreaming?: boolean;

  /** Callback when streaming answer completes successfully */
  onAnswerComplete?: (answer: string) => void;

  /** Callback when streaming answer encounters an error */
  onAnswerError?: (error: string) => void;
}

/**
 * Answer state for streaming responses
 */
export type AnswerState = "idle" | "loading" | "streaming" | "complete" | "error";

/**
 * Data structure for Women's World streaming answers
 */
export interface WomensWorldAnswerData {
  /** Accumulated answer text */
  text: string;
  /** Whether streaming is complete */
  isComplete: boolean;
  /** Error message if state is "error" */
  error?: string;
}

/**
 * Search Input Section Props
 */
export interface SearchInputSectionProps {
  /** Placeholder text */
  placeholder: string;

  /** Submit handler */
  onSubmit: (query: string) => void;

  /**
   * Seed questions for first carousel row.
   * These questions should be thematically distinct from row 2 (e.g., health/medical focus).
   */
  seedQuestionsRow1: string[];

  /**
   * Seed questions for second carousel row.
   * These questions should be thematically distinct from row 1 (e.g., wellness/lifestyle focus).
   */
  seedQuestionsRow2: string[];

  /**
   * @deprecated Use seedQuestionsRow1 and seedQuestionsRow2 instead for independent carousel rows.
   * This prop is maintained for backward compatibility only.
   */
  seedQuestions?: string[];

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

/**
 * Women's World Inline Widget TypeScript Type Definitions
 * Optimized for embedding within article content
 */

/**
 * Theme variants for inline widget styling
 */
export type WomensWorldInlineVariant = "light" | "neutral" | "subtle";

/**
 * Women's World Inline Widget Props
 * Compact, always-expanded variation optimized for article embedding
 */
export interface WomensWorldInlineWidgetProps {
  /** Widget title with sparkle emoji (default: "✨ Woman's World Answers") */
  title?: string;

  /** Placeholder text for search input (default: "Ask us your health questions") */
  placeholder?: string;

  /**
   * Pre-populated seed questions for first carousel row.
   * Use this for health/medical-focused questions.
   * Defaults to health-focused questions if not provided.
   */
  seedQuestionsRow1?: string[];

  /**
   * Pre-populated seed questions for second carousel row.
   * Use this for wellness/lifestyle-focused questions.
   * Defaults to wellness-focused questions if not provided.
   */
  seedQuestionsRow2?: string[];

  /** Auto-scroll interval in milliseconds (default: 35000) */
  autoScrollInterval?: number;

  /** Branding text for footer (default: "Powered by Gist.ai") */
  brandingText?: string;

  /** Callback when question is submitted */
  onSubmit?: (question: string) => void;

  /**
   * Maximum width in pixels (default: 640px for readable line length).
   * Widget will be responsive (100% width) up to this max-width.
   */
  maxWidth?: number;

  /**
   * Theme variant for article context (default: "light").
   * - light: Warm gradient (orange/pink tones)
   * - neutral: Cool gray gradient
   * - subtle: Minimal gray gradient
   */
  variant?: WomensWorldInlineVariant;

  /** Additional CSS classes */
  className?: string;

  /** Enable inline OpenAI streaming answers (default: false) */
  enableStreaming?: boolean;

  /** Callback when streaming answer completes successfully */
  onAnswerComplete?: (answer: string) => void;

  /** Callback when streaming answer encounters an error */
  onAnswerError?: (error: string) => void;
}

/**
 * Answer Page TypeScript Type Definitions
 * OpenAI streaming integration for Q&A answer pages
 */

/**
 * OpenAI Streaming Response Structure
 */
export interface OpenAIStreamChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content?: string;
      role?: "assistant";
    };
    finish_reason: "stop" | "length" | null;
  }>;
}

/**
 * Attribution Source Data
 */
export interface AttributionSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  publishedDate?: string;
  author?: string;
}

/**
 * Answer Page State Machine
 */
export type AnswerPageState = "input" | "loading" | "streaming" | "complete" | "error";

/**
 * Answer Data Structure
 */
export interface AnswerData {
  text: string;
  sources: AttributionSource[];
  relatedQuestions: string[];
  confidence?: number;
}

/**
 * Component Props
 */
export interface LoadingStateProps {
  phase: "generating" | "sources";
  className?: string;
}

export interface StreamingTextProps {
  text: string;
  isComplete: boolean;
  className?: string;
}

export interface AttributionBarProps {
  sourceCount: number;
  sources: AttributionSource[];
  onViewSources?: () => void;
  className?: string;
}

export interface AttributionCardsProps {
  sources: AttributionSource[];
  onCardClick?: (source: AttributionSource) => void;
  className?: string;
}

export interface FeedbackButtonsProps {
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  selected?: "up" | "down" | null;
  className?: string;
}

export interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  className?: string;
}

export interface NewSearchButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Eater Widget TypeScript Type Definitions
 */

export interface EaterWidgetProps {
  /** Controls whether the widget is expanded or collapsed (controlled mode) */
  isExpanded?: boolean;
  /** Callback when expand state changes */
  onExpandChange?: (expanded: boolean) => void;
  /** Initial expanded state (uncontrolled mode) */
  defaultExpanded?: boolean;
  /** Text shown in collapsed button state */
  collapsedText?: string;
  /** Main widget title */
  title?: string;
  /** Search input placeholder */
  placeholder?: string;
  /** Array of seed question strings */
  seedQuestions?: string[];
  /** Callback when question is submitted */
  onSubmit?: (question: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export interface EaterHeaderProps {
  /** Widget title */
  title?: string;
  /** Callback when close button is clicked */
  onClose?: () => void;
}

export interface EaterSearchInputProps {
  /** Input placeholder text */
  placeholder?: string;
  /** Current input value */
  value: string;
  /** Callback when input value changes */
  onChange: (value: string) => void;
  /** Callback when form is submitted */
  onSubmit: () => void;
  /** Whether submit button is enabled */
  canSubmit: boolean;
}

export interface EaterSeedQuestionPillsProps {
  /** Array of seed question strings */
  questions: string[];
  /** Callback when a question pill is clicked */
  onQuestionClick: (question: string) => void;
  /** Currently selected question */
  selectedQuestion?: string | null;
}

export interface EaterQuestionPillProps {
  /** Question text to display */
  question: string;
  /** Callback when pill is clicked */
  onClick: () => void;
  /** Whether this pill is selected */
  isSelected?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * New Page Answer Widget TypeScript Type Definitions
 * Full-page AI-powered Q&A widget with streaming answers and source attribution
 */

/**
 * New Page Answer Widget Props
 */
export interface NewPageAnswerWidgetProps {
  /** Initial query from URL parameter or POST body */
  initialQuery?: string;

  /** Brand configuration for theming */
  brandConfig?: BrandConfig;

  /** Pre-loaded source distribution data (optional, can be fetched) */
  sources?: SourceDistribution[];

  /** Sponsored content configuration (optional) */
  sponsoredContent?: SponsoredContentData;

  /** Callback when widget is closed */
  onClose?: () => void;

  /** Callback when new search is initiated */
  onNewSearch?: (query: string) => void;

  /** Callback when article is clicked */
  onArticleClick?: (articleId: string, url: string) => void;

  /** Callback when citation is clicked */
  onCitationClick?: (citationId: string) => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Brand Configuration
 */
export interface BrandConfig {
  /** Brand name (e.g., "Eater", "Woman's World") */
  name: string;

  /** Primary brand color (hex) */
  primaryColor: string;

  /** Secondary brand color (hex, optional) */
  secondaryColor?: string;

  /** Brand logo URL (optional) */
  logo?: string;

  /** Custom fonts */
  fonts?: {
    heading: string;
    body: string;
  };

  /** Custom gradient configuration */
  gradient?: {
    start: string;
    end: string;
  };
}

/**
 * Source Distribution Data
 */
export interface SourceDistribution {
  /** Source name */
  name: string;

  /** Percentage contribution (0-100) */
  percentage: number;

  /** Brand color (hex) */
  color: string;

  /** Source logo URL (optional) */
  logo?: string;
}

/**
 * Sponsored Content Data
 */
export interface SponsoredContentData {
  /** Sponsored content label */
  label?: string;

  /** Main heading */
  heading: string;

  /** Description text (2-3 sentences) */
  description: string;

  /** Call-to-action text */
  ctaText: string;

  /** Target URL */
  ctaUrl: string;

  /** Additional tracking parameters */
  tracking?: Record<string, string>;
}

/**
 * Article Recommendation Data
 */
export interface ArticleRecommendation {
  /** Unique article ID */
  id: string;

  /** Article title */
  title: string;

  /** Article description/excerpt */
  description: string;

  /** Thumbnail image URL */
  thumbnail: string;

  /** Source information */
  source: {
    name: string;
    logo?: string;
  };

  /** Relevance score (0-100) */
  relevanceScore: number;

  /** Article URL */
  url: string;
}

/**
 * Citation Data
 */
export interface Citation {
  /** Citation ID ([1], [2], etc.) */
  id: string;

  /** Citation number (1, 2, 3...) */
  number: number;

  /** Source article title */
  title: string;

  /** Source URL */
  url: string;

  /** Source domain */
  domain: string;

  /** Publication date (optional) */
  publishedDate?: string;

  /** Author (optional) */
  author?: string;
}

/**
 * Widget State Machine
 */
export type AnswerPageWidgetState = "input" | "loading" | "streaming" | "complete" | "error";

/**
 * Answer Data Structure (Extended for New Page Widget)
 */
export interface NewPageAnswerData {
  /** Streamed answer text */
  text: string;

  /** Source attribution data */
  sources: Citation[];

  /** Related follow-up questions */
  relatedQuestions: string[];

  /** Article recommendations */
  recommendations?: ArticleRecommendation[];

  /** Confidence score (0-100, optional) */
  confidence?: number;
}

/**
 * Widget Internal State
 */
export interface NewPageAnswerWidgetState {
  /** Current widget mode */
  widgetState: AnswerPageWidgetState;

  /** Current query text */
  currentQuery: string;

  /** Accumulated streamed text */
  streamedText: string;

  /** Complete answer data */
  answerData: NewPageAnswerData | null;

  /** User feedback selection */
  feedback: "up" | "down" | null;

  /** Error message */
  error: string | null;
}

/**
 * Query Display Props
 */
export interface QueryDisplayProps {
  /** Query text to display */
  query: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Answer Content Props
 */
export interface AnswerContentProps {
  /** Raw answer text with citation markers [1], [2] */
  answerText: string;

  /** Whether streaming is complete */
  isComplete: boolean;

  /** Citation data for inline references */
  citations: Citation[];

  /** Click handler for citations */
  onCitationClick: (citationId: string) => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Inline Citation Props
 */
export interface InlineCitationProps {
  /** Citation number (1, 2, 3...) */
  citationNumber: number;

  /** Click handler */
  onClick: () => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Disclaimer Banner Props
 */
export interface DisclaimerBannerProps {
  /** Disclaimer text */
  text: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Article Card Props
 */
export interface ArticleCardProps {
  /** Article title */
  title: string;

  /** Article description */
  description: string;

  /** Thumbnail image URL */
  thumbnail: string;

  /** Source name */
  sourceName: string;

  /** Source logo URL (optional) */
  sourceLogo?: string;

  /** Relevance score (0-100) */
  relevanceScore: number;

  /** Click handler */
  onClick: () => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Recommended Articles Props
 */
export interface RecommendedArticlesProps {
  /** Array of article recommendations */
  articles: ArticleRecommendation[];

  /** Article click handler */
  onArticleClick: (articleId: string, url: string) => void;

  /** Section heading (optional) */
  heading?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Answer Widget Container TypeScript Type Definitions
 * Inline container for full-page answer displays (760px fixed width)
 */

/**
 * Answer Widget Container Props
 */
export interface AnswerWidgetContainerProps {
  /** Container content */
  children: React.ReactNode;

  /** Additional CSS classes */
  className?: string;

  /** Forward ref to container div */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Answer Widget Sub-Component Props
 */
export interface AnswerWidgetSubComponentProps {
  /** Sub-component content */
  children: React.ReactNode;

  /** Additional CSS classes */
  className?: string;
}
