import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // not redirect() in the page: throwing mid-render crashes react's dev timing on client navigations
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
        source: "/components",
        missing: [{ type: "query", key: "view" }],
        destination: "/components/animatedbeam",
        permanent: false,
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
