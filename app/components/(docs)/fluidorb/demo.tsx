"use client";

import FluidOrb from "@/components/ui/fluid-orb";
import { usePreviewControl } from "@/components/preview/PreviewControls";

export default function FluidOrbPage() {
  const [color] = usePreviewControl("color", "#1A73F2");

  return (
    <div className="flex h-full items-center justify-center">
      <FluidOrb size={200} color={color} />
    </div>
  );
}
