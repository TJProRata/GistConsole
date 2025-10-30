import React from "react";
import { createRoot } from "react-dom/client";
import { WomensWorldWidget } from "@/components/widget_components/complete/womens-world-widget";
import type { WomensWorldWidgetProps } from "@/components/widget_components/types";
import "../compiled.css";

/**
 * Women's World Floating Widget - Global API Entry Point
 *
 * This is the IIFE bundle entry point that exposes a global API
 * for embedding the floating widget via <script> tag.
 *
 * Usage:
 *   <script src="https://your-cdn.vercel.app/womens-world-floating.js"></script>
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

export interface GistWidgetConfig extends Omit<WomensWorldWidgetProps, "isExpanded" | "onExpandChange"> {
  containerId: string;
}

class GistWidgetAPI {
  private root: ReturnType<typeof createRoot> | null = null;
  private container: HTMLElement | null = null;
  private currentConfig: GistWidgetConfig | null = null;

  /**
   * Initialize the widget and mount it to the DOM
   */
  init(config: GistWidgetConfig): void {
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

    // Render widget with uncontrolled mode (internal state)
    const { containerId, ...widgetProps } = config;
    this.root.render(
      <React.StrictMode>
        <WomensWorldWidget
          {...widgetProps}
          defaultExpanded={false}
        />
      </React.StrictMode>
    );

    console.log("GistWidget: Initialized successfully");
  }

  /**
   * Update widget configuration
   */
  update(config: Partial<Omit<GistWidgetConfig, "containerId">>): void {
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
        <WomensWorldWidget
          {...widgetProps}
          defaultExpanded={false}
        />
      </React.StrictMode>
    );

    console.log("GistWidget: Updated successfully");
  }

  /**
   * Destroy the widget and clean up resources
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
    console.log("GistWidget: Destroyed successfully");
  }
}

// Create global instance
const widgetInstance = new GistWidgetAPI();

// Expose to window
declare global {
  interface Window {
    GistWidget: typeof widgetInstance;
    GistWidgetConfig?: GistWidgetConfig;
  }
}

if (typeof window !== "undefined") {
  window.GistWidget = widgetInstance;

  // Auto-initialize if config exists
  if (window.GistWidgetConfig) {
    console.log("GistWidget: Auto-initializing with window.GistWidgetConfig");
    widgetInstance.init(window.GistWidgetConfig);
  }
}

export { widgetInstance as GistWidget };
