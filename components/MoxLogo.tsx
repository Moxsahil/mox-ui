import type { ComponentProps } from "react";
import {
  MARK_BALL,
  MARK_PATH,
  MARK_STROKE,
  MARK_VIEWBOX,
  WORDMARK_O,
  WORDMARK_VIEWBOX,
  WORDMARK_X,
} from "@/lib/logo";
import { cn } from "@/lib/utils";

type MarkProps = ComponentProps<"svg"> & { ballClassName?: string };

const STROKE = {
  stroke: "currentColor",
  strokeWidth: MARK_STROKE,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function MarkShapes({ ballClassName }: { ballClassName?: string }) {
  return (
    <>
      <path d={MARK_PATH} {...STROKE} />
      <ellipse {...MARK_BALL} fill="currentColor" className={ballClassName} />
    </>
  );
}

export function MoxMark({ className, ballClassName, ...props }: MarkProps) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      fill="none"
      aria-hidden
      data-slot="mox-mark"
      className={cn("shrink-0", className)}
      {...props}
    >
      <MarkShapes ballClassName={ballClassName} />
    </svg>
  );
}

export function MoxWordmark({ className, ballClassName, ...props }: MarkProps) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      fill="none"
      role="img"
      aria-label="mox"
      data-slot="mox-wordmark"
      className={cn("shrink-0", className)}
      {...props}
    >
      <MarkShapes ballClassName={ballClassName} />
      <circle {...WORDMARK_O} {...STROKE} />
      <path d={WORDMARK_X} {...STROKE} />
    </svg>
  );
}
