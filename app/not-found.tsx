import type { Metadata } from "next";
import HomeNav from "@/components/home/HomeNav";
import NotFoundPage from "@/components/ui/page-not-found";
import { fetchStarCount } from "@/lib/github";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist. Browse the components instead.",
};

export default async function NotFound() {
  const stars = await fetchStarCount();

  return (
    <div className="home flex min-h-svh flex-1 flex-col bg-home-bg font-runde text-home-fg">
      <HomeNav stars={stars} />
      <NotFoundPage />
    </div>
  );
}
