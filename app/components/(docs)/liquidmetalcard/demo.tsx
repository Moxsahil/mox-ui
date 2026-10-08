"use client";

import { LiquidMetalIDCard } from "@/components/ui/liquid-metal-id-card";

export default function LiquidMetalCardDemo() {
  return (
    <div className="relative flex min-h-full w-full items-center justify-center bg-black px-4 py-12 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
        }}
      />
      <LiquidMetalIDCard
        name="Sahil Barak"
        cardType="Debit"
        cardNumber="4400 3534 2434 6521"
        expiry="09/31"
        className="z-10"
      />
    </div>
  );
}
