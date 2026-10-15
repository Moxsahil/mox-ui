import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // first, so old-domain urls hop straight to moxui.dev instead of chaining through the rules below
      {
        source: "/:path*",
        has: [{ type: "host", value: "mox-ui.vercel.app" }],
        destination: "https://moxui.dev/:path*",
        permanent: true,
      },
      {
        source: "/components/gooeynav",
        destination: "/components/liquidtabbar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
