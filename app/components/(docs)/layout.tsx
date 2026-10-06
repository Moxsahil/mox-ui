import DocsShell from "@/components/docs/DocsShell";
import { PreviewControlsProvider } from "@/components/preview/PreviewControls";
import { fetchStarCount } from "@/lib/github";

export default async function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stars = await fetchStarCount();

  return (
    <PreviewControlsProvider>
      <DocsShell stars={stars}>{children}</DocsShell>
    </PreviewControlsProvider>
  );
}
