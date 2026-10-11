"use client";

import { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const SHOWN = { opacity: 1, scale: 1, rotate: "0deg" };
const hidden = (turn: number) => ({
  opacity: 0,
  scale: 0,
  rotate: `${turn}deg`,
});

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);

  const toggle = () => {
    const dark = resolvedTheme !== "dark";
    setTheme(dark ? "dark" : "light");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [incoming, outgoing] = dark
      ? [moonRef.current, sunRef.current]
      : [sunRef.current, moonRef.current];
    // web animations, not css transitions: disableTransitionOnChange freezes transitions during the switch
    incoming?.animate([hidden(90), SHOWN], {
      duration: 500,
      easing: "cubic-bezier(0.3, 1.4, 0.5, 1)",
    });
    outgoing?.animate([SHOWN, hidden(-90)], {
      duration: 250,
      easing: "cubic-bezier(0.4, 0, 1, 1)",
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center rounded-lg bg-secondary p-2 text-foreground/80 transition-colors hover:text-foreground",
        className,
      )}
    >
      <Sun
        ref={sunRef}
        aria-hidden="true"
        className="size-5 dark:scale-0 dark:opacity-0"
      />
      <Moon
        ref={moonRef}
        aria-hidden="true"
        className="absolute inset-0 m-auto size-5 scale-0 opacity-0 dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}
