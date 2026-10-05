import type { Metadata } from "next";
// import Link from "next/link";
import { fetchStarCount } from "@/lib/github";
import ComponentRail from "@/components/home/ComponentRail";
import CraftStatement from "@/components/home/CraftStatement";
import HomeCta from "@/components/home/HomeCta";
import HomeFaq from "@/components/home/HomeFaq";
import HomeHero from "@/components/home/HomeHero";
import HomeNav from "@/components/home/HomeNav";
import InstallPaths from "@/components/home/InstallPaths";
import StackSection from "@/components/home/StackSection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import Footer from "@/components/Footer";
// import { OpenSlotCard, PlatformSponsorCard } from "@/components/sponsors/SponsorCards";
// import { PLATFORM_CARD_HEIGHT, PLATFORM_SPONSORS } from "@/lib/sponsors";

// const LOWEST_TIER_PRICE = Math.min(...TIERS.map((tier) => tier.price));

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const stars = await fetchStarCount();

  return (
    <div className="home flex flex-1 flex-col bg-home-bg font-runde text-home-fg">
      <HomeNav stars={stars} />

      <main>
        <div className="home-hero relative isolate">
          <div
            aria-hidden
            className="home-hero-glow pointer-events-none absolute inset-x-0 -top-15 bottom-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_84%,transparent)]"
          />
          <HomeHero />
          <ComponentRail />
        </div>
        <StackSection />
        <InstallPaths />
        <CraftStatement />
        <TestimonialsSection />
        {/* <BackersSection /> */}
        <HomeFaq />
        <HomeCta />
      </main>

      <Footer className="-mt-8" />
    </div>
  );
}

// function BackersSection() {
//   return (
//     <section
//       id="sponsors"
//       className="mx-auto flex w-full max-w-7xl scroll-mt-24 flex-col items-center gap-12 px-6 py-24 text-center md:py-32"
//     >
//       <h2 className="max-w-2xl text-balance font-runde text-3xl font-bold tracking-tight sm:text-4xl">
//         {PLATFORM_SPONSORS.length > 0
//           ? `${SITE_NAME} is backed and supported by the finest`
//           : `Back ${SITE_NAME} and get your logo in front of developers`}
//       </h2>
//
//       <div className="flex w-full flex-col items-center gap-8">
//         <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
//           {PLATFORM_SPONSORS.map((sponsor) => (
//             <PlatformSponsorCard key={sponsor.name} sponsor={sponsor} />
//           ))}
//           <OpenSlotCard height={PLATFORM_CARD_HEIGHT} />
//         </div>
//
//         <Link
//           href="/sponsors"
//           className="font-runde text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors duration-150 ease-out hover:text-foreground"
//         >
//           Become a sponsor &rarr;
//         </Link>
//       </div>
//
//       {/* <Link
//         href="/sponsors"
//         className="font-runde text-sm font-semibold text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
//       >
//         Sponsorship from ${LOWEST_TIER_PRICE}/month. See all tiers &rarr;
//       </Link> */}
//     </section>
//   );
// }
