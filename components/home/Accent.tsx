import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function Accent({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "pr-[0.06em] font-accent font-normal italic tracking-[-0.005em] [font-variation-settings:'SOFT'_100,'WONK'_1]",
        className,
      )}
      {...props}
    />
  );
}
