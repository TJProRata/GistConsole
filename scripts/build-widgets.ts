#!/usr/bin/env bun

import { cssInlinePlugin } from "./css-inline-plugin";
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";

/**
 * Widget Bundler for Gist Console
 *
 * Builds self-contained IIFE bundles for Women's World widgets
 * using Bun 1.3.1 bundler with CSS inlining.
 *
 * Features:
 * - IIFE format for <script> tag embedding
 * - Minified bundles with tree shaking
 * - Inline CSS (no separate stylesheet)
 * - React 19.2 + all dependencies bundled
 * - Global API exposure (window.GistWidget)
 *
 * Usage:
 *   bun run scripts/build-widgets.ts           # Build only
 *   bun run scripts/build-widgets.ts --deploy  # Build + stage for Vercel
 */

interface BuildConfig {
  entrypoint: string;
  outputName: string;
  variant: "floating" | "inline";
}

const WIDGETS: BuildConfig[] = [
  {
    entrypoint: "./src/widgets/womens-world-floating/index.tsx",
    outputName: "womens-world-floating.js",
    variant: "floating",
  },
  {
    entrypoint: "./src/widgets/womens-world-inline/index.tsx",
    outputName: "womens-world-inline.js",
    variant: "inline",
  },
];

const OUTPUT_DIR = "./dist/widgets";
const DEPLOY_DIR = "./deploy";

/**
 * Build a single widget bundle
 */
async function buildWidget(config: BuildConfig): Promise<void> {
  console.log(`\n📦 Building ${config.variant} widget...`);
  console.log(`   Entry: ${config.entrypoint}`);
  console.log(`   Output: ${OUTPUT_DIR}/${config.outputName}`);

  try {
    const result = await Bun.build({
      entrypoints: [config.entrypoint],
      outdir: OUTPUT_DIR,
      format: "iife",
      target: "browser",
      splitting: false, // Required for IIFE
      minify: {
        whitespace: true,
        identifiers: true,
        syntax: true,
      },
      sourcemap: "none",
      external: [], // Bundle everything
      plugins: [cssInlinePlugin],
      naming: config.outputName,
    });

    if (!result.success) {
      console.error(`❌ Build failed for ${config.variant}:`);
      for (const log of result.logs) {
        console.error(log);
      }
      throw new Error(`Build failed for ${config.variant}`);
    }

    // Get file size
    const outputPath = join(OUTPUT_DIR, config.outputName);
    const stats = statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`✅ Built successfully: ${sizeKB} KB`);

    // Warn if bundle is too large
    if (stats.size > 500 * 1024) {
      console.warn(`⚠️  Warning: Bundle size exceeds 500KB target`);
    }
  } catch (error) {
    console.error(`❌ Build error for ${config.variant}:`, error);
    throw error;
  }
}

/**
 * Compile Tailwind CSS for widgets
 */
async function compileTailwindCSS(): Promise<void> {
  console.log("🎨 Compiling Tailwind CSS...");

  try {
    const proc = Bun.spawn([
      "npx",
      "tailwindcss",
      "-i",
      "./app/globals.css",
      "-o",
      "./src/widgets/compiled.css",
      "--minify",
    ]);

    await proc.exited;

    if (proc.exitCode === 0) {
      const stats = statSync("./src/widgets/compiled.css");
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ Tailwind CSS compiled: ${sizeKB} KB\n`);
    } else {
      throw new Error("Tailwind CSS compilation failed");
    }
  } catch (error) {
    console.error("❌ Failed to compile Tailwind CSS:", error);
    throw error;
  }
}

/**
 * Build all widgets
 */
async function buildAll(): Promise<void> {
  console.log("🚀 Starting widget build process...\n");

  // Compile Tailwind CSS first
  await compileTailwindCSS();

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }

  // Build each widget
  for (const widget of WIDGETS) {
    await buildWidget(widget);
  }

  console.log("\n✨ All widgets built successfully!\n");
}

/**
 * Copy files recursively
 */
function copyRecursive(src: string, dest: string): void {
  if (!existsSync(src)) {
    console.warn(`⚠️  Source not found: ${src}`);
    return;
  }

  const stat = statSync(src);

  if (stat.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    const files = readdirSync(src);
    for (const file of files) {
      copyRecursive(join(src, file), join(dest, file));
    }
  } else {
    copyFileSync(src, dest);
  }
}

/**
 * Stage files for Vercel deployment
 */
async function deploy(): Promise<void> {
  console.log("\n📤 Staging files for deployment...\n");

  // Create deploy directory
  if (!existsSync(DEPLOY_DIR)) {
    mkdirSync(DEPLOY_DIR, { recursive: true });
    console.log(`📁 Created deploy directory: ${DEPLOY_DIR}`);
  }

  // Copy widget bundles
  console.log("📋 Copying widget bundles...");
  for (const widget of WIDGETS) {
    const src = join(OUTPUT_DIR, widget.outputName);
    const dest = join(DEPLOY_DIR, widget.outputName);

    if (existsSync(src)) {
      copyFileSync(src, dest);
      const stats = statSync(dest);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ✅ ${widget.outputName} (${sizeKB} KB)`);
    } else {
      console.error(`   ❌ Missing: ${widget.outputName}`);
    }
  }

  // Copy static assets
  const assetsDir = "./public/assets";
  const deployAssetsDir = join(DEPLOY_DIR, "assets");

  if (existsSync(assetsDir)) {
    console.log("\n📋 Copying static assets...");
    copyRecursive(assetsDir, deployAssetsDir);
    console.log(`   ✅ Assets copied to ${deployAssetsDir}`);
  }

  console.log("\n✅ Deployment staging complete!");
  console.log(`\n📁 Deploy directory: ${DEPLOY_DIR}`);
  console.log("   Ready for: cd deploy && vercel --prod\n");
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const shouldDeploy = args.includes("--deploy");

  try {
    // Always build first
    await buildAll();

    // Deploy if requested
    if (shouldDeploy) {
      await deploy();
    } else {
      console.log("💡 Tip: Run with --deploy to stage for Vercel\n");
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Build process failed:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  main();
}
