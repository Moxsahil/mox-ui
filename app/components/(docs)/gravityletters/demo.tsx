"use client";

import GravityLetters from "@/components/ui/gravity-letters";
import { usePreviewControl } from "@/components/preview/PreviewControls";

export default function GravityLettersPage() {
  const [color] = usePreviewControl("color", "currentColor");

  return (
    <div className="flex h-full w-full items-center justify-center px-4">
      <GravityLetters
        color={color}
        type="both"
        className="h-[26rem] w-full max-w-xl rounded-3xl border border-foreground/20 dark:border-foreground/10"
      >
        <div className="pointer-events-none flex h-full items-center justify-center">
          <span className="text-sm font-medium text-foreground/40">
            Click anywhere in the box
          </span>
        </div>
      </GravityLetters>
    </div>
  );
}
