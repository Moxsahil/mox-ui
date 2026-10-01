import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://unavatar.io/x/*")],
  },
};

export default nextConfig;
