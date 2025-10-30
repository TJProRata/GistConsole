import React from "react";
import { createRoot } from "react-dom/client";
import { WomensWorldInlineWidget } from "@/components/widget_components/complete/womens-world-inline-widget";
import type { WomensWorldInlineWidgetProps } from "@/components/widget_components/types";
import "../compiled.css";

/**
 * Women's World Inline Widget - Global API Entry Point
 *
 * This is the IIFE bundle entry point that exposes a global API
 * for embedding the inline widget via <script> tag.
 *
 * The inline widget is always expanded and optimized for article embedding.
 *
 * Usage:
 *   <script src="https://your-cdn.vercel.app/womens-world-inline.js"></script>
 *   <div id="gist-widget-root"></div>
 *   <script>
 *     GistWidget.init({
 *       containerId: "gist-widget-root",
 *       title: "✨ Woman's World Answers",
 *       seedQuestionsRow1: ["Question 1", "Question 2"],
 *       enableStreaming: true
 *     });
 *   </script>
 */

export interface GistWidgetInlineConfig extends WomensWorldInlineWidgetProps {
  containerId: string;
}

class GistWidgetInlineAPI {
  private root: ReturnType<typeof createRoot> | null = null;
  private container: HTMLElement | null = null;
  private currentConfig: GistWidgetInlineConfig | null = null;

  /**
   * Initialize the inline widget and mount it to the DOM
   */
  init(config: GistWidgetInlineConfig): void {
    if (typeof document === "undefined") {
      console.error("GistWidget: Cannot initialize in non-browser environment");
      return;
    }

    // Get container element
    const container = document.getElementById(config.containerId);
    if (!container) {
      console.error(`GistWidget: Container #${config.containerId} not found`);
      return;
    }

    // Clean up existing instance
    this.destroy();

    // Store references
    this.container = container;
    this.currentConfig = config;

    // Create React root
    this.root = createRoot(container);

    // Render inline widget (always expanded)
    const { containerId, ...widgetProps } = config;
    this.root.render(
      <React.StrictMode>
        <WomensWorldInlineWidget {...widgetProps} />
      </React.StrictMode>
    );

    console.log("GistWidget (Inline): Initialized successfully");
  }

  /**
   * Update inline widget configuration
   */
  update(config: Partial<Omit<GistWidgetInlineConfig, "containerId">>): void {
    if (!this.root || !this.currentConfig) {
      console.error("GistWidget: Must call init() before update()");
      return;
    }

    // Merge config
    this.currentConfig = {
      ...this.currentConfig,
      ...config,
    };

    // Re-render with updated config
    const { containerId, ...widgetProps } = this.currentConfig;
    this.root.render(
      <React.StrictMode>
        <WomensWorldInlineWidget {...widgetProps} />
      </React.StrictMode>
    );

    console.log("GistWidget (Inline): Updated successfully");
  }

  /**
   * Destroy the inline widget and clean up resources
   */
  destroy(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    if (this.container) {
      this.container.innerHTML = "";
      this.container = null;
    }

    this.currentConfig = null;
    console.log("GistWidget (Inline): Destroyed successfully");
  }
}

// Create global instance
const widgetInstance = new GistWidgetInlineAPI();

// Expose to window
declare global {
  interface Window {
    GistWidget: typeof widgetInstance;
    GistWidgetConfig?: GistWidgetInlineConfig;
  }
}

if (typeof window !== "undefined") {
  window.GistWidget = widgetInstance;

  // Auto-initialize if config exists
  if (window.GistWidgetConfig) {
    console.log("GistWidget (Inline): Auto-initializing with window.GistWidgetConfig");
    widgetInstance.init(window.GistWidgetConfig);
  }
}

export { widgetInstance as GistWidget };
