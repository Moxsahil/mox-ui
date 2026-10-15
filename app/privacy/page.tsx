import LegalPage from "@/components/legal/LegalPage";
import { fetchStarCount } from "@/lib/github";
import { pageMetadata } from "@/lib/seo";
import { LEGAL_UPDATED, PRIVACY_SECTIONS } from "@/lib/legal";
import { SITE_NAME } from "@/lib/site";

const DESCRIPTION = `How ${SITE_NAME} handles your data: no accounts, no ads, no tracking cookies. What we collect, who processes it, how long we keep it, and how to reach us about it.`;

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: DESCRIPTION,
  path: "/privacy",
});

export default async function PrivacyPolicyPage() {
  const stars = await fetchStarCount();

  return (
    <LegalPage
      title="Privacy Policy"
      href="/privacy"
      stars={stars}
      updated={LEGAL_UPDATED}
      intro={DESCRIPTION}
      sections={PRIVACY_SECTIONS}
    />
  );
}
