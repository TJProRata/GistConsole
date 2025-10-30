#!/usr/bin/env bun
/**
 * Widget Bundler - Builds embeddable IIFE widgets for CDN deployment
 *
 * Architecture:
 * - One bundle per widget type (womens-world.js, nyt-chat.js, rufus.js)
 * - IIFE format for browser compatibility
 * - React bundled inline (no external dependencies)
 * - Global API: window.GistWidget.init()
 * - Deployed to Vercel static files
 */

import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const WIDGETS = [
  {
    name: "womens-world",
    entry: "./widgets/womens-world/index.tsx",
    output: "womens-world.js",
  },
  {
    name: "nyt-chat",
    entry: "./widgets/nyt-chat/index.tsx",
    output: "nyt-chat.js",
  },
  {
    name: "rufus",
    entry: "./widgets/rufus/index.tsx",
    output: "rufus.js",
  },
] as const;

interface BuildResult {
  success: boolean;
  widget: string;
  size?: number;
  error?: string;
}

async function buildWidget(widget: typeof WIDGETS[number]): Promise<BuildResult> {
  console.log(`\n🔨 Building ${widget.name}...`);

  try {
    const result = await Bun.build({
      entrypoints: [widget.entry],
      outdir: "./public/widgets",
      format: "iife",
      target: "browser",
      minify: process.env.NODE_ENV === "production",
      splitting: false, // Single file output
      naming: widget.output,
      external: [], // Bundle everything including React
      define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
      },
      // Enable source maps for development
      sourcemap: process.env.NODE_ENV === "development" ? "external" : "none",
    });

    if (!result.success) {
      return {
        success: false,
        widget: widget.name,
        error: result.logs.join("\n"),
      };
    }

    const outputPath = join("./public/widgets", widget.output);
    const size = existsSync(outputPath)
      ? (await Bun.file(outputPath).size())
      : 0;

    return {
      success: true,
      widget: widget.name,
      size,
    };
  } catch (error) {
    return {
      success: false,
      widget: widget.name,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log("🚀 Gist Widget Builder");
  console.log("━".repeat(50));

  // Ensure output directory exists
  const outDir = "./public/widgets";
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
    console.log(`✅ Created output directory: ${outDir}`);
  }

  // Build all widgets in parallel
  const results = await Promise.all(
    WIDGETS.map(widget => buildWidget(widget))
  );

  // Display results
  console.log("\n📊 Build Results");
  console.log("━".repeat(50));

  let successCount = 0;
  let totalSize = 0;

  for (const result of results) {
    if (result.success) {
      successCount++;
      totalSize += result.size || 0;
      const sizeMB = ((result.size || 0) / 1024 / 1024).toFixed(2);
      console.log(`✅ ${result.widget.padEnd(20)} ${sizeMB}MB`);
    } else {
      console.error(`❌ ${result.widget.padEnd(20)} FAILED`);
      console.error(`   ${result.error}`);
    }
  }

  console.log("━".repeat(50));
  console.log(`Total: ${successCount}/${WIDGETS.length} widgets built`);
  console.log(`Combined size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);

  // Exit with error if any builds failed
  if (successCount < WIDGETS.length) {
    process.exit(1);
  }

  console.log("\n✨ Build complete! Widgets ready for deployment.");
  console.log(`📦 Output: ${outDir}`);
  console.log(`🌐 Deploy: vercel deploy`);
}

main();
