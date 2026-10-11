import type { Metadata } from "next";
import DocsGallery from "@/components/docs/DocsGallery";
import DocsShell from "@/components/docs/DocsShell";
import { fetchStarCount } from "@/lib/github";
import { SITE_KEYWORDS, componentsJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Browse every Mox UI (MoxUI) component in action: animated React components built with Tailwind CSS and Motion. Install any of them with the shadcn CLI.",
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/components?view=overview",
  },
};

export default async function ComponentsIndexPage() {
  const stars = await fetchStarCount();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(componentsJsonLd()) }}
      />
      <DocsShell stars={stars} wide>
        <DocsGallery kind="components" />
      </DocsShell>
    </>
  );
}
