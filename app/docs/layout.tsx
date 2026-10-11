import DocsShell from "@/components/docs/DocsShell";
import { fetchStarCount } from "@/lib/github";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stars = await fetchStarCount();

  return <DocsShell stars={stars}>{children}</DocsShell>;
}
