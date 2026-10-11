import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PillNavbar from "@/components/PillNavbar";
import NotFoundHero from "@/components/not-found/NotFoundHero";
import { fetchStarCount } from "@/lib/github";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist. Browse the components instead.",
};

export default async function NotFound() {
  const stars = await fetchStarCount();

  return (
    <>
      <PillNavbar stars={stars} />

      <NotFoundHero />

      <Footer />
    </>
  );
}
