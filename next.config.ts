import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16
  // Enable file system caching for faster subsequent builds
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  // Set Turbopack root to current directory to avoid lockfile warnings
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Optional: Enable Cache Components (opt-in explicit caching)
  // Uncomment when ready to use "use cache" directives
  // cacheComponents: true,
};

export default nextConfig;
