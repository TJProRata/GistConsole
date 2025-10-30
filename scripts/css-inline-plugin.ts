import type { BunPlugin } from "bun";

/**
 * CSS Inline Plugin for Bun
 *
 * Inlines CSS files into JavaScript bundles by injecting <style> tags at runtime.
 * This eliminates the need for separate CSS file loading and prevents FOUC.
 *
 * Usage:
 *   import "./styles.css"; // In your entry point
 *   // CSS will be automatically injected into <head> as <style> tag
 */
export const cssInlinePlugin: BunPlugin = {
  name: "css-inline-plugin",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      // Read CSS file content
      const css = await Bun.file(args.path).text();

      // Minify CSS: remove comments, excess whitespace, and newlines
      const minifiedCSS = css
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/\s*([{}:;,>~+])\s*/g, "$1") // Remove space around special chars
        .trim();

      // Escape special characters for JavaScript string
      const escapedCSS = minifiedCSS
        .replace(/\\/g, "\\\\") // Escape backslashes
        .replace(/`/g, "\\`") // Escape backticks
        .replace(/\$/g, "\\$"); // Escape dollar signs

      // Generate JavaScript code to inject CSS
      const jsCode = `
        (() => {
          if (typeof document !== "undefined") {
            const style = document.createElement("style");
            style.textContent = \`${escapedCSS}\`;
            document.head.appendChild(style);
          }
        })();
      `;

      return {
        contents: jsCode,
        loader: "js",
      };
    });
  },
};
