import { Suspense } from "react";
import type { Metadata } from "next";
import TemplatesBrowser, {
  TemplatesShell,
} from "@/components/browse/TemplatesBrowser";
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
    // the default view prerenders as the fallback, then the ?view= param takes over on the client
    <Suspense fallback={<TemplatesShell view="all" stars={stars} />}>
      <TemplatesBrowser stars={stars} />
    </Suspense>
  );
}
