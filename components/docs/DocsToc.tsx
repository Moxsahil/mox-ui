"use client";

import { useEffect, useRef, useState } from "react";
import { Bug, LayoutGrid, Lightbulb, ListFilter } from "lucide-react";
import { REGISTRY_HOMEPAGE, type ComponentItem } from "@/lib/components";
import { cn } from "@/lib/utils";
import { docsLinks } from "./docs";

export type TocSection = { id: string; label: string; depth?: 0 | 1 };

const ROW_HEIGHT = 50;
const TRACK_X = 14;
const TRACK_INDENT = 10;

function trackPath(sections: TocSection[]) {
  return sections.reduce((path, section, index) => {
    const x = TRACK_X + (section.depth ?? index % 2) * TRACK_INDENT;
    const y = index * ROW_HEIGHT;
    if (index === 0) return `M ${x} 8 V ${ROW_HEIGHT - 10}`;
    const previousX =
      TRACK_X + (sections[index - 1].depth ?? (index - 1) % 2) * TRACK_INDENT;
    const bend =
      x === previousX
        ? ""
        : ` C ${previousX} ${y + 2}, ${x} ${y - 2}, ${x} ${y + 10}`;
    return `${path}${bend} V ${y + ROW_HEIGHT - 10}`;
  }, "");
}

export default function DocsToc({
  item,
  title,
  sections,
  contribute = true,
}: {
  item?: ComponentItem;
  title?: string;
  sections: TocSection[];
  contribute?: boolean;
}) {
  const trackRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(sections[0]?.id);
  const [marker, setMarker] = useState({
    x: TRACK_X + (sections[0]?.depth ?? 0) * TRACK_INDENT,
    y: 8,
    distance: 0,
    total: Math.max(1, sections.length * ROW_HEIGHT),
  });
  const ids = sections.map((section) => section.id).join(",");
  const path = trackPath(sections);
  const topic = item?.name ?? title ?? "Documentation";
  const contributions = [
    {
      label: "Report an issue",
      href: item
        ? docsLinks(item).issue
        : `${REGISTRY_HOMEPAGE}/issues/new?title=${encodeURIComponent(`${topic}: `)}`,
      icon: Bug,
    },
    {
      label: "Request a feature",
      href: `${REGISTRY_HOMEPAGE}/issues/new?title=${encodeURIComponent(`${topic}: Feature request`)}`,
      icon: Lightbulb,
    },
    {
      label: "Request a new component",
      href: `${REGISTRY_HOMEPAGE}/issues/new?title=Component%20request`,
      icon: LayoutGrid,
    },
  ];

  useEffect(() => {
    const targets = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const track = trackRef.current;
    if (!track || targets.length === 0) return;
    const total = track.getTotalLength();
    const stops = targets.map((_, index) => {
      let low = 0;
      let high = total;
      for (let step = 0; step < 14; step++) {
        const middle = (low + high) / 2;
        if (track.getPointAtLength(middle).y < index * ROW_HEIGHT + 8)
          low = middle;
        else high = middle;
      }
      return (low + high) / 2;
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const atEnd = window.scrollY > 0 && window.scrollY >= maxScroll - 4;
      const offsets = targets.map((target) =>
        Math.max(0, target.getBoundingClientRect().top + window.scrollY - 120),
      );
      let index = 0;
      for (let current = 0; current < offsets.length; current++) {
        if (offsets[current] <= window.scrollY) index = current;
      }
      if (atEnd) index = targets.length - 1;
      const start = offsets[index];
      const end = offsets[index + 1] ?? maxScroll;
      const progress = atEnd
        ? 1
        : Math.min(
            1,
            Math.max(0, (window.scrollY - start) / Math.max(1, end - start)),
          );
      const distance =
        stops[index] + ((stops[index + 1] ?? total) - stops[index]) * progress;
      const point = track.getPointAtLength(distance);
      setActive(targets[index].id);
      setMarker({
        x: point.x,
        y: point.y,
        distance,
        total,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    const observer = new ResizeObserver(schedule);
    const content = document.getElementById("docs-content");
    if (content) observer.observe(content);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [ids, path]);

  return (
    <aside
      aria-label="On this page"
      className="hidden w-60 shrink-0 xl:block 2xl:w-68"
    >
      <div className="no-scrollbar sticky top-14 flex h-[calc(100svh-3.5rem)] w-60 flex-col gap-10 overflow-y-auto overscroll-contain bg-home-bg px-6 py-10 2xl:w-68">
        <nav aria-label="On this page" className="flex flex-col">
          <h2 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-home-muted">
            <ListFilter aria-hidden="true" className="size-4" />
            On this page
          </h2>
          <div className="relative mt-7">
            <svg
              aria-hidden="true"
              width="36"
              height={sections.length * ROW_HEIGHT}
              className="pointer-events-none absolute left-0 top-0 overflow-visible"
            >
              <path
                ref={trackRef}
                d={path}
                fill="none"
                stroke="var(--home-line)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {sections.length > 0 && (
                <g className="text-home-fg">
                  <path
                    d={path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={`${marker.distance} ${marker.total}`}
                  />
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="5"
                    fill="currentColor"
                    className="drop-shadow-[0_0_8px_var(--home-fg)]"
                  />
                </g>
              )}
            </svg>
            <ul>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={
                      active === section.id ? "location" : undefined
                    }
                    className={cn(
                      "flex h-[50px] items-center rounded-sm pr-2 text-sm font-medium transition-colors hover:text-home-fg motion-reduce:transition-none",
                      (section.depth ?? index % 2) ? "pl-11" : "pl-[30px]",
                      active === section.id
                        ? "font-semibold text-home-fg"
                        : "text-home-muted",
                    )}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {contribute && (
          <div>
            <h2 className="pb-3 text-sm font-semibold text-home-fg">
              Contribute
            </h2>
            <ul className="flex flex-col gap-2.5 text-sm text-home-muted">
              {contributions.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-sm transition-colors hover:text-home-fg motion-reduce:transition-none"
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
