"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { Squircle } from "@squircle-js/react";
import { cn } from "@/lib/utils";

const SQUIRCLE = { cornerRadius: 16, cornerSmoothing: 5 } as const;

type PreviewStage = {
  slot: HTMLElement | null;
  stage: RefObject<HTMLElement | null>;
};

const PreviewStageContext = createContext<PreviewStage | null>(null);

export const PreviewStageProvider = PreviewStageContext.Provider;

export default function PreviewPanel({
  children,
  className,
  inline = false,
}: {
  children: ReactNode;
  className?: string;
  inline?: boolean;
}) {
  const preview = useContext(PreviewStageContext);

  const panel = (
    <Squircle asChild {...SQUIRCLE}>
      <motion.div
        data-preview-panel
        drag
        dragConstraints={preview?.stage}
        dragMomentum={false}
        dragElastic={0}
        whileDrag={{ scale: 1.03 }}
        className={cn(
          "border-apple flex w-fit items-center bg-muted shadow-xl backdrop-blur",
          className,
        )}
      >
        <span
          aria-hidden
          className="cursor-grab text-foreground/30 transition-colors hover:text-foreground/60 active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </span>
        {children}
      </motion.div>
    </Squircle>
  );

  if (inline || !preview) return panel;
  // the slot only exists after the preview mounts, so a demo's panel joins it on the client
  return preview.slot ? createPortal(panel, preview.slot) : null;
}
