import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/lessons/**": ["./content/**/*"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
