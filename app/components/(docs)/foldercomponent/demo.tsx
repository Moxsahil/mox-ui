"use client";

import FolderComponent from "@/components/ui/folder-component";
import { usePreviewControl } from "@/components/preview/PreviewControls";
import { useIsMobile } from "@/lib/use-media-query";

export default function FolderComponentPage() {
  const [color] = usePreviewControl("color", "black");
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full items-center justify-center">
      <FolderComponent
        color={color as "black" | "white" | "blue"}
        size={isMobile ? "sm" : "md"}
      />
    </div>
  );
}
