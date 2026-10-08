"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentItem, PackageManager } from "@/lib/components";
import { cn } from "@/lib/utils";
import BrowseCard from "./BrowseCard";
import { ChevronIcon } from "./icons";

const ARROW =
  "flex size-9 cursor-pointer items-center justify-center rounded-full border border-home-line-strong bg-home-bg text-home-fg transition-[opacity,border-color] duration-150 hover:border-home-fg-2 disabled:cursor-default disabled:opacity-30";

export default function BrowseShelf({
  id,
  index,
  label,
  items,
  pm,
  onViewAll,
}: {
  id: string;
  index: number;
  label: string;
  items: ComponentItem[];
  pm: PackageManager;
  onViewAll: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({
        start: track.scrollLeft <= 2,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
      });
    // the observer also fires once on observe, which sets the first state
    const resizer = new ResizeObserver(update);
    resizer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      resizer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, []);

  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const headingId = `shelf-${id}`;
  const scrollable = !(edges.start && edges.end);

  return (
    <section aria-labelledby={headingId} className="mt-12">
      <div className="mb-3.5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="font-mono text-xs text-home-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2
            id={headingId}
            className="truncate text-xl font-semibold tracking-tight"
          >
            {label}
          </h2>
          <span className="rounded-full bg-home-raised px-2 py-0.5 font-mono text-[11px] text-home-fg-2">
            {items.length}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onViewAll}
            className="flex h-9 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[13.5px] text-home-fg-2 transition-colors duration-150 hover:text-home-fg"
          >
            View all
            <ChevronIcon className="size-3.5" />
          </button>
          {scrollable && (
            <>
              <button
                type="button"
                aria-label={`Previous ${label}`}
                disabled={edges.start}
                onClick={() => page(-1)}
                className={ARROW}
              >
                <ChevronIcon direction="left" className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Next ${label}`}
                disabled={edges.end}
                onClick={() => page(1)}
                className={ARROW}
              >
                <ChevronIcon className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div
        ref={trackRef}
        className={cn(
          "-m-1.5 flex snap-x snap-mandatory gap-4 overflow-x-auto p-1.5 scrollbar-none [&::-webkit-scrollbar]:hidden",
          !edges.end && "mask-[linear-gradient(90deg,#000_88%,transparent)]",
        )}
      >
        {items.map((item) => (
          <BrowseCard
            key={item.href}
            item={item}
            pm={pm}
            className="w-64 shrink-0 snap-start sm:w-75"
          />
        ))}
      </div>
    </section>
  );
}
