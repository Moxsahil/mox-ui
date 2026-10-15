import DocsShell from "@/components/docs/DocsShell";
import DocsGallery from "@/components/docs/DocsGallery";
import { fetchStarCount } from "@/lib/github";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Templates",
  description:
    "Browse Mox UI (MoxUI) templates: full landing pages you install with the shadcn CLI and own as source, built with React and Tailwind CSS.",
  path: "/templates",
});

export default async function TemplatesPage() {
  const stars = await fetchStarCount();

  return (
    <DocsShell stars={stars} wide>
      <DocsGallery kind="templates" />
    </DocsShell>
  );
}
