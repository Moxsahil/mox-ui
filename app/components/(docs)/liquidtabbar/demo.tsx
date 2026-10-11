"use client";

import { LiquidTabBar } from "@/components/ui/liquid-tab-bar";
import { useIsMobile } from "@/lib/use-media-query";
import { BookIcon, BriefcaseIcon, HouseIcon, InfoIcon } from "./icons";

const items = [
  { label: "Home", icon: <HouseIcon /> },
  { label: "Changelog", icon: <BookIcon /> },
  { label: "Career", icon: <BriefcaseIcon /> },
  { label: "About", icon: <InfoIcon /> },
];

export default function LiquidTabBarPage() {
  const isMobile = useIsMobile();

  return (
    <div className="relative flex h-full items-center justify-center px-2">
      <LiquidTabBar
        items={items}
        size={isMobile ? "sm" : "md"}
        onSearch={() => {}}
      />
    </div>
  );
}
