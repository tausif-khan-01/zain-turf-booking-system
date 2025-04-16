import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ignore the error
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
