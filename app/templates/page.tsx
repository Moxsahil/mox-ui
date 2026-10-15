import JsonLd from "@/components/JsonLd";
import DocsShell from "@/components/docs/DocsShell";
import DocsGallery from "@/components/docs/DocsGallery";
import { fetchStarCount } from "@/lib/github";
import { pageMetadata, templatesJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "Browse Mox UI (MoxUI) templates: full landing pages you install with the shadcn CLI and own as source, built with React and Tailwind CSS.";

export const metadata = pageMetadata({
  title: "Templates",
  description: DESCRIPTION,
  path: "/templates",
});

export default async function TemplatesPage() {
  const stars = await fetchStarCount();

  return (
    <>
      <JsonLd data={templatesJsonLd(DESCRIPTION)} />
      <DocsShell stars={stars} wide>
        <DocsGallery kind="templates" />
      </DocsShell>
    </>
  );
}
