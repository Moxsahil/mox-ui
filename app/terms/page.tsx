import LegalPage from "@/components/legal/LegalPage";
import { fetchStarCount } from "@/lib/github";
import { pageMetadata } from "@/lib/seo";
import { LEGAL_UPDATED, TERMS_SECTIONS } from "@/lib/legal";
import { SITE_NAME } from "@/lib/site";

const DESCRIPTION = `The terms for using ${SITE_NAME}: the free MIT licensed component registry, contributions, acceptable use and support.`;

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: DESCRIPTION,
  path: "/terms",
});

export default async function TermsOfServicePage() {
  const stars = await fetchStarCount();

  return (
    <LegalPage
      title="Terms of Service"
      href="/terms"
      stars={stars}
      updated={LEGAL_UPDATED}
      intro={DESCRIPTION}
      sections={TERMS_SECTIONS}
    />
  );
}
