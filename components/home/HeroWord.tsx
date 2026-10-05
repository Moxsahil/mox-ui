"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import useMeasure from "react-use-measure";
import Accent from "./Accent";
import {
  createGlassRenderer,
  GLASS_FADE,
  GLASS_FADE_MS,
  GLASS_FALLBACK,
  GLASS_PALETTE,
  measureGlass,
  placeCanvas,
  type GlassGeometry,
} from "./glass";

// the first word is the headline as written, the rest are how these components feel
const WORDS = ["exceptional", "tactile", "playful", "memorable"];
const HOLD_MS = 3400;
const TRAVEL_MS = 1100;
// the first 35% of the travel staggers dots left to right, so letters hand off in reading order
const STAGGER = 0.35;
// the width and period start moving while the dots are mid-air, not before they leave
const SWAP_AT = GLASS_FADE_MS + TRAVEL_MS * 0.4;

const spring = { type: "spring", stiffness: 160, damping: 24 } as const;

type Point = { x: number; y: number };
type Dot = { from: Point; to: Point; delay: number; hop: number };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function sampleDots(word: string, geo: GlassGeometry) {
  const canvas = document.createElement("canvas");
  canvas.width = geo.width;
  canvas.height = geo.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.font = geo.font;
  ctx.fillText(word, geo.pad, geo.baseline);
  const { data } = ctx.getImageData(0, 0, geo.width, geo.height);
  const step = Math.max(2, Math.round(geo.size / 24));
  const points: Point[] = [];
  for (let y = 0; y < geo.height; y += step) {
    for (let x = 0; x < geo.width; x += step) {
      if (data[(y * geo.width + x) * 4 + 3] > 128) points.push({ x, y });
    }
  }
  return points.sort((a, b) => a.x - b.x || a.y - b.y);
}

export default function HeroWord() {
  const [index, setIndex] = useState(0);
  const [sizer, bounds] = useMeasure();
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const textRef = useRef<HTMLSpanElement>(null);
  const glassRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<HTMLCanvasElement>(null);
  const paletteRef = useRef(GLASS_PALETTE.dark);
  const word = WORDS[index];

  useEffect(() => {
    paletteRef.current =
      resolvedTheme === "light" ? GLASS_PALETTE.light : GLASS_PALETTE.dark;
  }, [resolvedTheme]);

  useEffect(() => {
    const text = textRef.current;
    const glassCanvas = glassRef.current;
    const dotCanvas = dotsRef.current;
    const dots = dotCanvas?.getContext("2d");
    if (reduce || !text || !glassCanvas || !dotCanvas || !dots) return;

    // glass is optional: without webgl the crisp gradient text is the resting layer
    const glass = createGlassRenderer(glassCanvas);

    let geo: GlassGeometry | null = null;
    let glassReady = false;
    let disposed = false;
    let visible = true;
    let current = 0;
    let glassRaf = 0;
    let hopRaf = 0;
    let timer = 0;
    let swap = 0;
    let rebuild = 0;

    const rest = () => (glassReady ? glassCanvas : text);

    const renderGlass = (now: number) => {
      glassRaf = 0;
      if (disposed || !glassReady || !glass) return;
      glass.draw(current, now / 1000, paletteRef.current);
      if (visible && !document.hidden)
        glassRaf = requestAnimationFrame(renderGlass);
    };

    const resume = () => {
      if (!glassRaf && glassReady && visible && !document.hidden)
        glassRaf = requestAnimationFrame(renderGlass);
    };

    const morph = () => {
      if (!geo || !visible || document.hidden) {
        timer = window.setTimeout(morph, HOLD_MS);
        return;
      }
      const g = geo;
      const next = (current + 1) % WORDS.length;
      const a = sampleDots(WORDS[current], g);
      const b = sampleDots(WORDS[next], g);
      if (!a.length || !b.length) {
        current = next;
        setIndex(next);
        timer = window.setTimeout(morph, HOLD_MS);
        return;
      }

      const count = Math.max(a.length, b.length);
      const flight: Dot[] = Array.from({ length: count }, (_, i) => ({
        from: a[Math.floor((i * a.length) / count)],
        to: b[Math.floor((i * b.length) / count)],
        delay: (i / count) * TRAVEL_MS * STAGGER + Math.random() * 60,
        hop: g.size * (0.12 + Math.random() * 0.4),
      }));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      placeCanvas(dotCanvas, g, dpr);
      dots.setTransform(dpr, 0, 0, dpr, 0, 0);
      // the dots carry the glass colors, bright at the top and deep at the bottom
      const palette = paletteRef.current;
      const tint = dots.createLinearGradient(0, g.pad, 0, g.pad + g.lineHeight);
      tint.addColorStop(0, palette.bright);
      tint.addColorStop(1, palette.deep);
      dots.fillStyle = tint;

      const size = Math.max(1.2, g.size / 44);
      const travel = TRAVEL_MS * (1 - STAGGER);
      const draw = (elapsed: number) => {
        dots.clearRect(0, 0, g.width, g.height);
        for (const d of flight) {
          const t = easeInOut(
            Math.min(1, Math.max(0, (elapsed - d.delay) / travel)),
          );
          const x = d.from.x + (d.to.x - d.from.x) * t;
          const y =
            d.from.y + (d.to.y - d.from.y) * t - Math.sin(Math.PI * t) * d.hop;
          dots.fillRect(x - size / 2, y - size / 2, size, size);
        }
      };

      draw(0);
      dotCanvas.style.opacity = "1";
      rest().style.opacity = "0";

      // the resting layer swaps to the next word while it is hidden behind the dots
      swap = window.setTimeout(() => {
        current = next;
        setIndex(next);
      }, SWAP_AT);

      const start = performance.now() + GLASS_FADE_MS;
      const hop = (now: number) => {
        const elapsed = Math.max(0, now - start);
        draw(elapsed);
        if (elapsed < TRAVEL_MS + 60) {
          hopRaf = requestAnimationFrame(hop);
          return;
        }
        rest().style.opacity = "1";
        dotCanvas.style.opacity = "0";
        timer = window.setTimeout(morph, HOLD_MS);
      };
      hopRaf = requestAnimationFrame(hop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    observer.observe(text);

    const resizer = new ResizeObserver(() => {
      if (!geo) return;
      window.clearTimeout(rebuild);
      rebuild = window.setTimeout(() => {
        geo = measureGlass(text, WORDS);
        if (geo && glass && glassReady) glass.build(geo, WORDS);
        resume();
      }, 120);
    });
    resizer.observe(text);

    document.addEventListener("visibilitychange", resume);

    document.fonts.ready.then(() => {
      if (disposed) return;
      geo = measureGlass(text, WORDS);
      if (!geo) return;
      if (glass) {
        glass.build(geo, WORDS);
        glassReady = true;
        glassCanvas.style.opacity = "1";
        text.style.opacity = "0";
        resume();
      }
      timer = window.setTimeout(morph, HOLD_MS);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(glassRaf);
      cancelAnimationFrame(hopRaf);
      window.clearTimeout(timer);
      window.clearTimeout(swap);
      window.clearTimeout(rebuild);
      observer.disconnect();
      resizer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      glass?.dispose();
      text.style.opacity = "1";
      glassCanvas.style.opacity = "0";
      dotCanvas.style.opacity = "0";
    };
  }, [reduce]);

  return (
    <>
      <span className="sr-only">{WORDS[0]}</span>
      {/* width animates to the next word so the period glides instead of jumping */}
      <motion.span
        aria-hidden
        initial={false}
        animate={bounds.width ? { width: bounds.width } : undefined}
        transition={reduce ? { duration: 0 } : spring}
        className="relative inline-block"
      >
        <span ref={sizer} className="invisible absolute left-0 top-0">
          <Accent className={GLASS_FALLBACK}>{word}</Accent>
        </span>
        {/* opacity is driven from the effect, so React never resets it mid-morph */}
        <span
          ref={textRef}
          className="relative inline-block"
          style={{ transition: GLASS_FADE }}
        >
          <Accent className={GLASS_FALLBACK}>{word}</Accent>
        </span>
        <canvas
          ref={glassRef}
          className="pointer-events-none absolute opacity-0"
          style={{ transition: GLASS_FADE }}
        />
        <canvas
          ref={dotsRef}
          className="pointer-events-none absolute opacity-0"
          style={{ transition: GLASS_FADE }}
        />
      </motion.span>
    </>
  );
}
