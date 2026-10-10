import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ComponentsBrowser, {
  BrowserShell,
} from "@/components/browse/ComponentsBrowser";
import { components } from "@/lib/components";
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

export default async function ComponentsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const { view } = await searchParams;

  if (view === undefined) {
    redirect(components[0].href);
  }

  const stars = await fetchStarCount();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(componentsJsonLd()) }}
      />
      <Suspense fallback={<BrowserShell view="overview" stars={stars} />}>
        <ComponentsBrowser stars={stars} />
      </Suspense>
    </>
  );
}
