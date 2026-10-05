"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Accent from "./Accent";
import {
  ACCENT_FALLBACK,
  ACCENT_PALETTE,
  createGlassRenderer,
  GLASS_FADE,
  measureGlass,
} from "./glass";

export default function GlassAccent({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paletteRef = useRef(ACCENT_PALETTE.dark);

  useEffect(() => {
    paletteRef.current =
      resolvedTheme === "light" ? ACCENT_PALETTE.light : ACCENT_PALETTE.dark;
  }, [resolvedTheme]);

  useEffect(() => {
    const text = textRef.current;
    const canvas = canvasRef.current;
    if (reduce || !text || !canvas) return;
    const renderer = createGlassRenderer(canvas);
    if (!renderer) return;

    // each word catches the light at its own moment instead of all in sync
    const offset = Math.random() * 20;
    let ready = false;
    let disposed = false;
    let visible = false;
    let raf = 0;
    let rebuild = 0;

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !ready) return;
      renderer.draw(0, now / 1000 + offset, paletteRef.current);
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const resume = () => {
      if (!raf && ready && visible && !document.hidden)
        raf = requestAnimationFrame(frame);
    };

    const build = () => {
      const geo = measureGlass(text, [children]);
      if (!geo) return false;
      renderer.build(geo, [children]);
      return true;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    observer.observe(text);

    const resizer = new ResizeObserver(() => {
      if (!ready) return;
      window.clearTimeout(rebuild);
      rebuild = window.setTimeout(() => {
        if (build()) resume();
      }, 120);
    });
    resizer.observe(text);

    document.addEventListener("visibilitychange", resume);

    document.fonts.ready.then(() => {
      if (disposed || !build()) return;
      ready = true;
      canvas.style.opacity = "1";
      text.style.opacity = "0";
      resume();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(rebuild);
      observer.disconnect();
      resizer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      renderer.dispose();
      text.style.opacity = "1";
      canvas.style.opacity = "0";
    };
  }, [reduce, children]);

  return (
    <span className="relative inline-block">
      {/* the real word stays in the page for selection and screen readers, only hidden behind the glass */}
      <span
        ref={textRef}
        className="relative inline-block"
        style={{ transition: GLASS_FADE }}
      >
        <Accent className={cn(ACCENT_FALLBACK, className)}>{children}</Accent>
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute opacity-0"
        style={{ transition: GLASS_FADE }}
      />
    </span>
  );
}
