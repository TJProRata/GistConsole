/**
 * Women's World Widget - Embeddable IIFE Entry Point
 *
 * Usage:
 *   <script src="https://widgets.gist.ai/womens-world.js"></script>
 *   <script>
 *     GistWidget.init({
 *       type: 'womens-world',
 *       variant: 'floating', // or 'inline'
 *       containerId: 'gist-widget', // Required for inline variant
 *       config: {
 *         title: '✨ Woman's World Answers',
 *         placeholder: 'Ask your health questions',
 *         seedQuestionsRow1: [...],
 *         seedQuestionsRow2: [...],
 *         // ... other config
 *       }
 *     });
 *   </script>
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { WomensWorldWidget } from "../../components/widget_components/complete/womens-world-widget";
import { WomensWorldInlineWidget } from "../../components/widget_components/complete/womens-world-inline-widget";
import type { WomensWorldWidgetProps } from "../../components/widget_components/types";

// Global type definitions
declare global {
  interface Window {
    GistWidget: GistWidgetAPI;
  }
}

interface WidgetConfig {
  type: "womens-world";
  variant?: "floating" | "inline";
  containerId?: string; // Required for inline variant
  config?: Partial<WomensWorldWidgetProps>;
}

interface WidgetInstance {
  destroy: () => void;
  update: (config: Partial<WomensWorldWidgetProps>) => void;
}

interface GistWidgetAPI {
  init: (config: WidgetConfig) => WidgetInstance;
  version: string;
}

class WomensWorldWidgetManager {
  private root: ReturnType<typeof createRoot> | null = null;
  private container: HTMLElement | null = null;
  private currentConfig: WidgetConfig | null = null;

  init(config: WidgetConfig): WidgetInstance {
    // Validate configuration
    if (!config || config.type !== "womens-world") {
      throw new Error("Invalid widget configuration: type must be 'womens-world'");
    }

    const variant = config.variant || "floating";

    // For inline variant, containerId is required
    if (variant === "inline" && !config.containerId) {
      throw new Error("containerId is required for inline variant");
    }

    // Store current configuration
    this.currentConfig = config;

    // Create or find container
    if (variant === "inline") {
      // Find existing container for inline variant
      this.container = document.getElementById(config.containerId!);
      if (!this.container) {
        throw new Error(`Container not found: ${config.containerId}`);
      }
    } else {
      // Create container for floating variant
      this.container = document.createElement("div");
      this.container.id = "gist-womens-world-widget";
      this.container.style.position = "fixed";
      this.container.style.zIndex = "9999";
      document.body.appendChild(this.container);
    }

    // Initialize React root
    this.root = createRoot(this.container);

    // Render appropriate variant
    this.render();

    // Return instance API
    return {
      destroy: () => this.destroy(),
      update: (newConfig) => this.update(newConfig),
    };
  }

  private render() {
    if (!this.root || !this.currentConfig) return;

    const variant = this.currentConfig.variant || "floating";
    const widgetConfig = this.currentConfig.config || {};

    if (variant === "inline") {
      this.root.render(
        <React.StrictMode>
          <WomensWorldInlineWidget {...widgetConfig} />
        </React.StrictMode>
      );
    } else {
      this.root.render(
        <React.StrictMode>
          <WomensWorldWidget
            {...widgetConfig}
            defaultExpanded={false}
          />
        </React.StrictMode>
      );
    }
  }

  update(config: Partial<WomensWorldWidgetProps>) {
    if (!this.currentConfig) {
      throw new Error("Widget not initialized");
    }

    // Merge new configuration
    this.currentConfig = {
      ...this.currentConfig,
      config: {
        ...this.currentConfig.config,
        ...config,
      },
    };

    // Re-render with updated config
    this.render();
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    if (this.container && this.currentConfig?.variant === "floating") {
      // Only remove container if it was created by us (floating variant)
      this.container.remove();
    }

    this.container = null;
    this.currentConfig = null;
  }
}

// Initialize global API
if (typeof window !== "undefined") {
  const manager = new WomensWorldWidgetManager();

  window.GistWidget = {
    init: (config: WidgetConfig) => manager.init(config),
    version: "1.0.0",
  };

  // Auto-initialize if data attributes are present
  if (document.currentScript) {
    const script = document.currentScript as HTMLScriptElement;
    const autoInit = script.getAttribute("data-auto-init");

    if (autoInit === "true") {
      document.addEventListener("DOMContentLoaded", () => {
        const variant = script.getAttribute("data-variant") as "floating" | "inline" || "floating";
        const containerId = script.getAttribute("data-container-id") || undefined;

        try {
          window.GistWidget.init({
            type: "womens-world",
            variant,
            containerId,
            config: {},
          });
        } catch (error) {
          console.error("[GistWidget] Auto-initialization failed:", error);
        }
      });
    }
  }
}
