"use client";

import { useMemo, useState } from "react";
import AnimatedCounter from "@/components/ui/animated-counter";

const MAX = 150_000;
const ROLL = 0.5;
const TICKS = 41;
const ACCENT = "#FF0000";

function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 180"
      role="img"
      aria-label="YouTube"
      className={className}
    >
      <path
        fill="#FF0000"
        d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
      />
      <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
    </svg>
  );
}

export default function AnimatedCounterPage() {
  const [value, setValue] = useState(12_480);
  const marker = Math.round((value / MAX) * (TICKS - 1));

  // the ruler only changes when the dash crosses a tick, not on every pixel of the drag
  const ticks = useMemo(
    () =>
      Array.from({ length: TICKS }, (_, index) =>
        // the dash is a tick rather than an overlay, so it lands dead on one
        index === marker ? (
          <span
            key={index}
            style={{ backgroundColor: ACCENT }}
            className="-mx-[0.5px] h-7 w-[3px] rounded-full"
          />
        ) : (
          <span
            key={index}
            className={`w-0.5 rounded-full transition-[height,background-color] duration-200 motion-reduce:transition-none ${
              index < marker
                ? "h-5 bg-[#3C3C43] dark:bg-[#EBEBF5]"
                : "h-3.5 bg-[#C2C2CC] dark:bg-[#3C3C43]"
            }`}
          />
        ),
      ),
    [marker],
  );

  return (
    // full width, so the ruler keeps its size while the number gains or loses digits
    <div className="flex h-full w-full flex-col items-center justify-center gap-14 p-6">
      <div className="flex flex-col items-center gap-1">
        <AnimatedCounter
          value={value}
          duration={ROLL}
          grouping="indian"
          prefix={
            <YouTubeLogo className="mr-[0.3em] block h-[0.72em] w-auto" />
          }
          // a mono comma sits in a full character advance, so pull the gaps back in
          className="font-mono text-6xl font-medium tracking-tight text-foreground [&_[data-slot=animated-counter-mark]]:-mx-[0.1em] sm:text-7xl"
        />
        <span className="text-sm font-medium text-foreground/50">
          Subscribers
        </span>
      </div>

      <div className="relative w-full max-w-sm rounded-xl px-px has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[#868593]">
        <div aria-hidden className="flex h-8 items-end justify-between">
          {ticks}
        </div>

        <input
          type="range"
          min={0}
          max={MAX}
          step={1}
          value={value}
          aria-label="Subscriber count"
          onChange={(event) => setValue(event.target.valueAsNumber)}
          className="absolute inset-0 h-full w-full cursor-grab appearance-none bg-transparent opacity-0 outline-none active:cursor-grabbing"
        />
      </div>
    </div>
  );
}
