/**
 * NYT Chat Widget - Embeddable IIFE Entry Point
 *
 * Usage:
 *   <script src="https://widgets.gist.ai/nyt-chat.js"></script>
 *   <script>
 *     GistWidget.init({
 *       type: 'nyt-chat',
 *       containerId: 'gist-widget',
 *       config: { ... }
 *     });
 *   </script>
 *
 * TODO: Implement NYT chat widget component and integration
 */

import React from "react";
import { createRoot } from "react-dom/client";

declare global {
  interface Window {
    GistWidget: {
      init: (config: any) => { destroy: () => void };
      version: string;
    };
  }
}

// Placeholder implementation
if (typeof window !== "undefined") {
  window.GistWidget = {
    init: (config) => {
      console.warn("[NYT Chat Widget] Not yet implemented");
      return {
        destroy: () => {},
      };
    },
    version: "1.0.0",
  };
}
