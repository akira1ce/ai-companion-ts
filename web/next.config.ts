import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/a-api/:path*",
        destination: "http://localhost:8787/:path*",
      },
    ];
  },
};

export default nextConfig;
