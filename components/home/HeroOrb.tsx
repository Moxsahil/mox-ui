"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import MatrixOrb, { type MatrixOrbState } from "@/components/ui/matrix-orb";
import { useIsMobile } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const STATES: MatrixOrbState[] = ["idle", "listening", "thinking"];
const CYCLE_MS = 3800;

export default function HeroOrb() {
  const [state, setState] = useState<MatrixOrbState>("idle");
  const [picked, setPicked] = useState(false);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (picked || reduce) return;
    const timer = setInterval(
      () =>
        setState(
          (current) => STATES[(STATES.indexOf(current) + 1) % STATES.length],
        ),
      CYCLE_MS,
    );
    return () => clearInterval(timer);
  }, [picked, reduce]);

  return (
    <figure className="flex min-w-0 flex-col items-center gap-4">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,var(--home-glow-1),transparent)] opacity-70 blur-2xl"
        />
        <MatrixOrb
          state={state}
          size={isMobile ? 260 : 340}
          dots={13}
          color={resolvedTheme === "light" ? "#09090B" : "#FAFAFA"}
          className="relative [&_[role=status]]:sr-only"
        />
      </div>

      <div
        role="group"
        aria-label="Matrix orb state"
        className="flex gap-0.5 rounded-full border border-home-line bg-home-raised p-1"
      >
        {STATES.map((option) => {
          const selected = option === state;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setPicked(true);
                setState(option);
              }}
              className="relative h-7.5 cursor-pointer rounded-full px-3.5 text-[13px] capitalize outline-none focus-visible:ring-2 focus-visible:ring-home-fg/40"
            >
              {selected && (
                <motion.span
                  layoutId="hero-orb-state"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 34 }
                  }
                  className="absolute inset-0 rounded-full bg-home-line-strong"
                />
              )}
              <span
                className={cn(
                  "relative transition-colors duration-200",
                  selected
                    ? "text-home-fg"
                    : "text-home-muted hover:text-home-fg",
                )}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </figure>
  );
}
