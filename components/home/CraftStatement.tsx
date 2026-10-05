"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import GlassAccent from "./GlassAccent";
import { WRAP } from "./wrap";

const ACCENT_WORD = "care";
const WORDS =
  `Recreated with ${ACCENT_WORD}. Most components start from great work around the web, then get rebuilt, extended and credited on their own page.`.split(
    " ",
  );

function Word({
  word,
  index,
  progress,
  reduce,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const start = index / WORDS.length;
  const opacity = useTransform(
    progress,
    [start, start + 1 / WORDS.length],
    [0, 1],
  );

  if (word.startsWith(ACCENT_WORD)) {
    return (
      <span>
        <GlassAccent>{ACCENT_WORD}</GlassAccent>
        {word.slice(ACCENT_WORD.length)}
      </span>
    );
  }

  // the dim copy stays in flow so the sentence reads in full before any scroll
  return (
    // inline-block gives the bright copy a real box to cover, an inline span offsets it by the leading
    <span className="relative inline-block">
      <span className="text-home-muted">{word}</span>
      <motion.span
        aria-hidden
        style={{ opacity: reduce ? 1 : opacity }}
        className="absolute inset-0 text-home-fg"
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function CraftStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  return (
    <section
      aria-label="How components are made"
      className={cn(WRAP, "pb-18 pt-6 md:pb-32 md:pt-12")}
    >
      <p
        ref={ref}
        className="max-w-[19em] text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.04em]"
      >
        {WORDS.map((word, index) => (
          <span key={index}>
            <Word
              word={word}
              index={index}
              progress={scrollYProgress}
              reduce={reduce}
            />
            {index < WORDS.length - 1 && " "}
          </span>
        ))}
      </p>
    </section>
  );
}
