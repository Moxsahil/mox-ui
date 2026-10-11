import type { Metadata } from "next";
import DocsShell from "@/components/docs/DocsShell";
import DocsGallery from "@/components/docs/DocsGallery";
import { fetchStarCount } from "@/lib/github";
import { SITE_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse Mox UI (MoxUI) templates: full landing pages you install with the shadcn CLI and own as source, built with React and Tailwind CSS.",
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/templates",
  },
};

export default async function TemplatesPage() {
  const stars = await fetchStarCount();

  return (
    <DocsShell stars={stars} wide>
      <DocsGallery kind="templates" />
    </DocsShell>
  );
}
