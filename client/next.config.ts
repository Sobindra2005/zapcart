import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Disable telemetry in production
  experimental: {
    // Add any experimental features here if needed
  },
};

export default nextConfig;
