import type { Metadata } from "next";
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
        <HomeFaq />
        <HomeCta />
      </main>

      <Footer className="-mt-8" />
    </div>
  );
}
