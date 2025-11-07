"use client";

import { useEffect, useRef } from "react";

/**
 * IframeWidgetPreview - Production Widget Loader (Phase 2)
 *
 * Status: NOT USED - Pending Phase 2 (Embeddable Widget Library)
 *
 * This component loads production widget bundles from CDN/dist folder.
 * Currently not used because widget bundles don't exist yet.
 * Preview flow uses PreviewWidgetRenderer instead (local React components).
 *
 * Required for Phase 2:
 * - Build widget bundles: womens-world-floating.js, nyt-chat.js, rufus.js
 * - Deploy bundles to CDN or /public/dist/widgets/
 * - Implement postMessage configuration API in bundles
 *
 * Original Architecture:
 * - Iframe loads HTML document that includes widget script from CDN
 * - Configuration passed via postMessage API
 * - Isolated from parent page (security & styling)
 * - Represents actual production widget experience
 */

interface IframeWidgetPreviewProps {
  widgetType: "womensWorld" | "womensWorldInline" | "nytChat" | "rufus" | "floating";
  configuration: Record<string, any>;
  baseUrl?: string; // CDN base URL (default: process.env.NEXT_PUBLIC_WIDGET_CDN_URL or /dist/widgets for local)
}

export function IframeWidgetPreview({
  widgetType,
  configuration,
  baseUrl,
}: IframeWidgetPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use environment variable for CDN URL or fallback to local dev
  const widgetBaseUrl = baseUrl ||
    process.env.NEXT_PUBLIC_WIDGET_CDN_URL ||
    "/dist/widgets";

  // Map widget type to bundle filename
  const widgetScriptMap = {
    womensWorld: "womens-world-floating.js",
    womensWorldInline: "womens-world-inline.js",
    nytChat: "nyt-chat.js",
    rufus: "rufus.js",
    floating: "womens-world-floating.js",
  };

  const scriptUrl = `${widgetBaseUrl}/${widgetScriptMap[widgetType]}`;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Wait for iframe to load
    const handleLoad = () => {
      // Send configuration to widget via postMessage
      iframe.contentWindow?.postMessage(
        {
          type: "GIST_WIDGET_CONFIG",
          widgetType,
          configuration,
        },
        "*"
      );
    };

    iframe.addEventListener("load", handleLoad);

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [widgetType, configuration]);

  // Generate iframe HTML document
  const iframeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gist Widget Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #gist-widget-container {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="gist-widget-container"></div>

  <!-- Load widget script from CDN -->
  <script src="${scriptUrl}"></script>

  <script>
    // Listen for configuration from parent
    window.addEventListener("message", function(event) {
      if (event.data.type === "GIST_WIDGET_CONFIG") {
        const { widgetType, configuration } = event.data;

        // Initialize widget with configuration
        if (window.GistWidget) {
          try {
            // Initialize with full configuration including containerId
            window.GistWidget.init({
              containerId: "gist-widget-container",
              ...configuration,
            });
            console.log("[IframePreview] Widget initialized:", widgetType);
          } catch (error) {
            console.error("[IframePreview] Widget initialization failed:", error);
          }
        } else {
          console.error("[IframePreview] GistWidget not loaded from:", "${scriptUrl}");
        }
      }
    });

    // Request initial configuration from parent
    window.parent.postMessage({ type: "GIST_WIDGET_READY" }, "*");
  </script>
</body>
</html>
  `;

  return (
    <iframe
      ref={iframeRef}
      srcDoc={iframeHtml}
      title="Widget Preview"
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
}
