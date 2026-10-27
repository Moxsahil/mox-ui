import type { Metadata } from "next";
import HeroSection from "@/components/ui/hero-section";

export const metadata: Metadata = {
  title: "Hero section preview",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HeroSection className="dark" />;
}
