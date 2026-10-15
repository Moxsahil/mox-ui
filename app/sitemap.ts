import type { MetadataRoute } from "next";
import { components } from "@/lib/components";
import { LEGAL_UPDATED } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

// dates must reflect real content updates, google ignores lastmod once it proves unreliable
const STATIC_PAGES: { path: string; lastModified: string }[] = [
  { path: "/", lastModified: "2026-07-30" },
  { path: "/components", lastModified: "2026-10-15" },
  { path: "/docs/introduction", lastModified: "2026-10-10" },
  { path: "/docs/installation", lastModified: "2026-10-11" },
  { path: "/templates", lastModified: "2026-10-15" },
  { path: "/privacy", lastModified: LEGAL_UPDATED },
  { path: "/terms", lastModified: LEGAL_UPDATED },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const { path, lastModified } of STATIC_PAGES) {
    const url = new URL(path, SITE_URL).toString();
    pages.set(url, { url, lastModified: new Date(lastModified) });
  }

  for (const component of components) {
    const url = new URL(component.href, SITE_URL).toString();
    if (!pages.has(url)) pages.set(url, { url });
  }

  return [...pages.values()];
}
