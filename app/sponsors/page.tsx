import type { Metadata } from "next";
import Footer from "@/components/Footer";
import GooeyNavbar from "@/components/GooeyNavbar";
import HeroIntro from "@/components/HeroIntro";
import SponsorCta from "@/components/sponsors/SponsorCta";
import SponsorStats from "@/components/sponsors/SponsorStats";
import TierPricing from "@/components/sponsors/TierPricing";
import {
  PlatformTierGroup,
  TierGroup,
} from "@/components/sponsors/SponsorCards";
import { fetchPageviews } from "@/lib/databuddy";
import { fetchStarCount } from "@/lib/github";
import { OG_IMAGE, SITE_KEYWORDS } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { SUPPORT_EMAIL } from "@/lib/legal";
import { SPONSOR_X_URL } from "@/lib/sponsors";
import { MoxMark } from "@/components/MoxLogo";

const TITLE = `Sponsors | ${SITE_NAME}`;

const DESCRIPTION =
  "Sponsor Mox UI (MoxUI) and keep a free, open-source registry of animated React components available to every developer. Diamond, Gold and Silver tiers.";

export const metadata: Metadata = {
  title: "Sponsors",
  description: DESCRIPTION,
  keywords: [
    "mox ui sponsors",
    "sponsor mox ui",
    "open source sponsorship",
    "ui library sponsor",
    ...SITE_KEYWORDS,
  ],
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/sponsors",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default async function SponsorsPage() {
  const [stars, pageviews] = await Promise.all([
    fetchStarCount(),
    fetchPageviews(),
  ]);

  return (
    <>
      <section className="relative w-full p-1.5 md:p-2.5">
        <div
          className="relative flex min-h-[min(78svh,50rem)] w-full items-center justify-center overflow-hidden rounded-[45px] border border-black/[0.04] bg-[#F5F5F7] dark:border-transparent dark:border-apple dark:bg-[#121212]"
          style={{ cornerShape: "squircle" } as React.CSSProperties}
        >
          <GooeyNavbar stars={stars} />

          <MoxMark className="pointer-events-none absolute left-1/2 top-[68%] size-[860px] max-w-none -translate-x-1/2 -translate-y-1/2 text-black opacity-[0.05] dark:text-white dark:opacity-[0.07]" />
          <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(120%_75%_at_50%_-5%,rgba(255,255,255,0.07),transparent_60%)] dark:block" />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-3 px-4 pb-20 pt-28 text-center sm:gap-4 sm:px-6">
            <HeroIntro
              headline="Sponsors"
              sub="Your support keeps Mox UI free and open-source for developers everywhere."
            >
              <div className="mt-4">
                <SponsorCta href="#tiers">Become a Sponsor</SponsorCta>
              </div>
            </HeroIntro>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <SponsorStats stars={stars} pageviews={pageviews} />
        <TierPricing />

        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-5 pb-20 sm:px-6 md:pb-28">
          <PlatformTierGroup />
          <TierGroup
            tier="diamond"
            name="Diamond"
            emptyLabel="Be the first Diamond sponsor"
          />
          <TierGroup
            tier="gold"
            name="Gold"
            emptyLabel="Be the first Gold sponsor"
          />
          <TierGroup
            tier="silver"
            name="Silver"
            emptyLabel="Be the first Silver sponsor"
          />
        </section>

        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 pb-24 text-center sm:px-6 md:pb-32">
          <h2 className="text-balance font-runde text-2xl font-bold tracking-tight sm:text-3xl">
            Questions, or need a custom package?
          </h2>
          <p className="max-w-lg text-balance font-medium text-muted-foreground">
            Happy to put something together that fits how your team wants to
            show up.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <SponsorCta
              href={`mailto:${SUPPORT_EMAIL}`}
              variant="subtle"
              className="min-w-44"
            >
              Email me
            </SponsorCta>
            {SPONSOR_X_URL && (
              <SponsorCta
                href={SPONSOR_X_URL}
                variant="subtle"
                className="min-w-44"
              >
                DM on X
              </SponsorCta>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
