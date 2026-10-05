"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import PreviewFallback from "@/components/gallery/PreviewFallback";
import PreviewVideo from "@/components/gallery/PreviewVideo";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  components,
  type ComponentCategory,
  type ComponentItem,
} from "@/lib/components";
import { cn } from "@/lib/utils";
import { WRAP } from "./wrap";

type Filter = "all" | ComponentCategory;

// px per second, so the rail keeps the same pace however many cards it holds
const SPEED = 42;
const MIN_DURATION = 30;

// items without a recording go last so the rail opens on motion
const ITEMS = [...components].sort(
  (a, b) => Number(Boolean(b.preview)) - Number(Boolean(a.preview)),
);

const FILTERS: { value: Filter; label: string; count: number }[] = [
  { value: "all", label: "All", count: components.length },
  ...CATEGORY_ORDER.map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
    count: components.filter((item) => item.category === category).length,
  })),
];

function RailCard({ item, clone }: { item: ComponentItem; clone?: boolean }) {
  return (
    <Link
      href={item.href}
      tabIndex={clone ? -1 : undefined}
      aria-hidden={clone || undefined}
      className="group/card mr-3.5 flex w-[clamp(260px,30vw,380px)] flex-none snap-start flex-col gap-3 sm:mr-6"
    >
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-home-line bg-[#0A0908] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card:-translate-y-1 group-hover/card:border-home-line-strong">
        {item.preview ? (
          <PreviewVideo src={item.preview} autoPlay />
        ) : (
          <PreviewFallback />
        )}
        <span className="absolute right-3 top-3 inline-flex h-7 -translate-y-1 items-center rounded-full bg-[#0A0807]/70 px-3 text-xs font-semibold text-[#F6F1EC] opacity-0 backdrop-blur-md transition-[opacity,transform] duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100">
          Open
        </span>
      </div>

      <div className="flex items-center gap-2 px-0.5 text-[15px]">
        <span className="font-semibold text-home-fg">{item.name}</span>
        {item.isNew && (
          <span className="rounded-full border border-current px-1.5 text-[11px] font-semibold leading-[18px] text-home-accent-ink">
            New
          </span>
        )}
        <span className="ml-auto text-[13px] text-home-muted">
          {CATEGORY_LABELS[item.category]}
        </span>
      </div>
    </Link>
  );
}

export default function ComponentRail() {
  const [filter, setFilter] = useState<Filter>("all");
  const [duration, setDuration] = useState(80);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const list =
    filter === "all" ? ITEMS : ITEMS.filter((item) => item.category === filter);
  const marquee = filter === "all" && !reduce;

  useEffect(() => {
    const track = trackRef.current;
    if (!marquee || !track) return;

    const measure = () =>
      setDuration(Math.max(MIN_DURATION, track.scrollWidth / 2 / SPEED));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [marquee]);

  return (
    <section aria-labelledby="rail-heading" className="pb-16 md:pb-28">
      <div
        className={cn(WRAP, "mb-7 flex flex-wrap items-center gap-x-5 gap-y-3")}
      >
        <h2
          id="rail-heading"
          className="text-[15px] font-medium text-home-fg-2"
        >
          <b className="font-bold text-home-fg">{components.length}</b>{" "}
          components:
        </h2>

        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-1"
        >
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[9px] px-3 text-sm transition-colors duration-200",
                filter === option.value
                  ? "bg-home-line-strong text-home-fg"
                  : "text-home-fg-2 hover:text-home-fg",
              )}
            >
              {option.label}
              <span className="font-mono text-[11px] text-home-muted">
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "group/rail relative",
          marquee
            ? "overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]"
            : "no-scrollbar snap-x snap-proximity overflow-x-auto",
        )}
      >
        <div
          ref={trackRef}
          style={
            marquee
              ? ({ "--rail-duration": `${duration}s` } as React.CSSProperties)
              : undefined
          }
          className={cn(
            "flex w-max",
            marquee
              ? "animate-[marquee-x_var(--rail-duration)_linear_infinite] group-focus-within/rail:[animation-play-state:paused] group-hover/rail:[animation-play-state:paused]"
              : "px-[max(1rem,calc((100%_-_70rem)/2))] sm:px-[max(2rem,calc((100%_-_70rem)/2))]",
          )}
        >
          {list.map((item) => (
            <RailCard key={item.href} item={item} />
          ))}
          {marquee &&
            list.map((item) => (
              <RailCard key={`${item.href}-clone`} item={item} clone />
            ))}
        </div>
      </div>
    </section>
  );
}
