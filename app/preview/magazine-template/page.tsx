import type { Metadata } from "next";
import MagazineTemplate from "@/components/ui/magazine-template";

export const metadata: Metadata = {
  title: "Magazine template preview",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MagazineTemplate />;
}
