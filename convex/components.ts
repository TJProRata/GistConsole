import { query } from "./_generated/server";
import { requireAdmin } from "./admin";

/**
 * Component Management Queries (Admin-Only)
 *
 * Provides visibility into the component library for administrative purposes.
 * Note: Component lists are manually maintained for initial implementation.
 * Future enhancement: Automate with file system scanning via Convex actions.
 */

// Query: Get component statistics
export const getComponentStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    // Manually counted components from components/ui/ directory
    const uiComponentsCount = 19; // accordion, alert, badge, button, card, carousel, dropdown-menu, form, input, label, phase-navigation, scroll-area, select, separator, skeleton, slider, table, tabs, textarea

    // Manually counted widget components
    const widgetComponentsCount = 21; // 4 icons + 1 animation + 15 ai-elements + 1 ask-anything

    // Complete widgets count
    const completeWidgetsCount = 7; // onboarding-widget, womens-world-widget, womens-world-inline-widget, rufus-widget, nyt-chat-widget, eater-widget, new-page-answer-widget

    // Category breakdown for widget components
    const categoryBreakdown = {
      icons: 4, // blue-star, profile-blank, wand, powered-by-button
      animations: 1, // searching-animation
      "ai-elements": 15, // dual-phase-progress, gif-housing, glass-widget-container, answer-widget-container, prompt-input, readiness-score-gauge, simple-progress-bar, success-phase, question-pill, seed-questions-carousel, search-input-section, eater-header, eater-question-pill, eater-search-input-section, eater-seed-question-pills
      "ask-anything": 1, // pricing-card
      widgets: completeWidgetsCount, // complete widget implementations (in complete/ folder)
    };

    return {
      totalUIComponents: uiComponentsCount,
      totalWidgetComponents: widgetComponentsCount,
      completeWidgets: completeWidgetsCount,
      totalComponents: uiComponentsCount + widgetComponentsCount + completeWidgetsCount,
      categoryBreakdown,
    };
  },
});

// Query: Get UI components list (shadcn/ui)
export const getUIComponentsList = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    // Manually maintained list of shadcn/ui components
    // Future: Automate with file system scanning
    const uiComponents = [
      { name: "accordion", path: "components/ui/accordion.tsx", category: "shadcn/ui" },
      { name: "alert", path: "components/ui/alert.tsx", category: "shadcn/ui" },
      { name: "badge", path: "components/ui/badge.tsx", category: "shadcn/ui" },
      { name: "button", path: "components/ui/button.tsx", category: "shadcn/ui" },
      { name: "card", path: "components/ui/card.tsx", category: "shadcn/ui" },
      { name: "carousel", path: "components/ui/carousel.tsx", category: "shadcn/ui" },
      { name: "dropdown-menu", path: "components/ui/dropdown-menu.tsx", category: "shadcn/ui" },
      { name: "form", path: "components/ui/form.tsx", category: "shadcn/ui" },
      { name: "input", path: "components/ui/input.tsx", category: "shadcn/ui" },
      { name: "label", path: "components/ui/label.tsx", category: "shadcn/ui" },
      { name: "phase-navigation", path: "components/ui/phase-navigation.tsx", category: "shadcn/ui" },
      { name: "scroll-area", path: "components/ui/scroll-area.tsx", category: "shadcn/ui" },
      { name: "select", path: "components/ui/select.tsx", category: "shadcn/ui" },
      { name: "separator", path: "components/ui/separator.tsx", category: "shadcn/ui" },
      { name: "skeleton", path: "components/ui/skeleton.tsx", category: "shadcn/ui" },
      { name: "slider", path: "components/ui/slider.tsx", category: "shadcn/ui" },
      { name: "table", path: "components/ui/table.tsx", category: "shadcn/ui" },
      { name: "tabs", path: "components/ui/tabs.tsx", category: "shadcn/ui" },
      { name: "textarea", path: "components/ui/textarea.tsx", category: "shadcn/ui" },
    ];

    return uiComponents;
  },
});

// Query: Get widget components list (organized by category)
export const getWidgetComponentsList = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    // Manually maintained list of widget components organized by subdirectory
    // Future: Automate with file system scanning
    const widgetComponents = {
      icons: [
        { name: "blue-star", path: "components/widget_components/icons/blue-star.tsx", category: "icons", description: "Blue star icon component" },
        { name: "powered-by-button", path: "components/widget_components/icons/powered-by-button.tsx", category: "icons", description: "Powered by Gist.ai branding button" },
        { name: "profile-blank", path: "components/widget_components/icons/profile-blank.tsx", category: "icons", description: "Blank profile icon component" },
        { name: "wand", path: "components/widget_components/icons/wand.tsx", category: "icons", description: "Magic wand icon component" },
      ],
      animations: [
        { name: "searching-animation", path: "components/widget_components/animations/searching-animation.tsx", category: "animations", description: "Loading animation for search" },
      ],
      "ai-elements": [
        { name: "dual-phase-progress", path: "components/widget_components/ai-elements/dual-phase-progress.tsx", category: "ai-elements", description: "Two-phase progress indicator" },
        { name: "gif-housing", path: "components/widget_components/ai-elements/gif-housing.tsx", category: "ai-elements", description: "Container for animated GIF content" },
        { name: "glass-widget-container", path: "components/widget_components/ai-elements/glass_widget_container.tsx", category: "ai-elements", description: "Glassmorphism styled container" },
        { name: "answer-widget-container", path: "components/widget_components/ai-elements/answer_widget_container.tsx", category: "ai-elements", description: "Inline container for full-page answer displays (760px fixed width, red outline)" },
        { name: "prompt-input", path: "components/widget_components/ai-elements/prompt-input.tsx", category: "ai-elements", description: "AI prompt input field with suggestions" },
        { name: "readiness-score-gauge", path: "components/widget_components/ai-elements/readiness-score-gauge.tsx", category: "ai-elements", description: "Visual gauge for readiness score" },
        { name: "simple-progress-bar", path: "components/widget_components/ai-elements/simple-progress-bar.tsx", category: "ai-elements", description: "Basic progress bar component" },
        { name: "success-phase", path: "components/widget_components/ai-elements/success-phase.tsx", category: "ai-elements", description: "Success state display component" },
        { name: "question-pill", path: "components/widget_components/ai-elements/question-pill.tsx", category: "ai-elements", description: "Reusable question button with gradient selection state" },
        { name: "seed-questions-carousel", path: "components/widget_components/ai-elements/seed-questions-carousel.tsx", category: "ai-elements", description: "Auto-scrolling carousel with pause-on-hover functionality" },
        { name: "search-input-section", path: "components/widget_components/ai-elements/search-input-section.tsx", category: "ai-elements", description: "Glassmorphism input with dual auto-scrolling seed question carousels" },
        { name: "eater-header", path: "components/widget_components/ai-elements/eater-header.tsx", category: "ai-elements", description: "Eater widget header with title and close button" },
        { name: "eater-question-pill", path: "components/widget_components/ai-elements/eater-question-pill.tsx", category: "ai-elements", description: "Individual Eater seed question button with red squiggle underline" },
        { name: "eater-search-input-section", path: "components/widget_components/ai-elements/eater-search-input-section.tsx", category: "ai-elements", description: "Eater search input with icon prefix and circular submit button" },
        { name: "eater-seed-question-pills", path: "components/widget_components/ai-elements/eater-seed-question-pills.tsx", category: "ai-elements", description: "Container for Eater seed question pills with squiggle underlines" },
      ],
      "ask-anything": [
        { name: "pricing-card", path: "components/widget_components/ask-anything/pricing-card.tsx", category: "ask-anything", description: "Pricing plan card component" },
      ],
    };

    return widgetComponents;
  },
});

// Query: Get complete widgets list
export const getCompleteWidgetsList = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const completeWidgets = [
      {
        name: "onboarding-widget",
        path: "components/widget_components/complete/onboarding-widget.tsx",
        description: "Complete multi-phase onboarding widget with 18 interactive phases",
        phases: 18,
        componentCount: 13,
      },
      {
        name: "womens-world-widget",
        path: "components/widget_components/complete/womens-world-widget.tsx",
        description: "Health-focused Q&A widget for Woman's World with auto-scrolling seed questions",
        phases: 1,
        componentCount: 3,
      },
      {
        name: "womens-world-inline-widget",
        path: "components/widget_components/complete/womens-world-inline-widget.tsx",
        description: "Compact inline Q&A widget optimized for embedding between article paragraphs",
        phases: 1,
        componentCount: 4,
      },
      {
        name: "rufus-widget",
        path: "components/widget_components/complete/rufus-widget.tsx",
        description: "Amazon Rufus AI shopping assistant with collapsed/expanded states and seed questions",
        phases: 2,
        componentCount: 5,
      },
      {
        name: "nyt-chat-widget",
        path: "components/widget_components/complete/nyt-chat-widget.tsx",
        description: "New York Times news Q&A assistant with dark theme, autocomplete, streaming answers, and citation pills",
        phases: 4,
        componentCount: 11,
      },
      {
        name: "eater-widget",
        path: "components/widget_components/complete/eater-widget.tsx",
        description: "Food and restaurant discovery AI assistant with Eater red branding, squiggle underlines, and ultra-rounded pill input",
        phases: 1,
        componentCount: 5,
      },
      {
        name: "new-page-answer-widget",
        path: "components/widget_components/complete/new-page-answer-widget.tsx",
        description: "Full-page AI-powered Q&A widget with OpenAI streaming, citations, source attribution, article recommendations, and user feedback",
        phases: 5,
        componentCount: 9,
      },
    ];

    return completeWidgets;
  },
});
