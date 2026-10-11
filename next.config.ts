import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://unavatar.io/x/*")],
  },
  // not redirect() in the page: throwing mid-render crashes react's dev timing on client navigations
  async redirects() {
    return [
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
