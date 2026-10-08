import type { Metadata } from "next";
import AnimatedBeamDemo from "@/app/components/(docs)/animatedbeam/demo";

export const metadata: Metadata = {
  title: "Animated beam preview",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-8">
      <h1 className="sr-only">Animated beam preview</h1>
      <AnimatedBeamDemo />
    </main>
  );
}
