"use client";

import { useState, type ReactNode } from "react";
import { REGISTRY_HOMEPAGE } from "@/lib/components";
import type { ComponentItem, PackageManager } from "@/lib/components";
import { cn } from "@/lib/utils";
import BrowseCard from "./BrowseCard";
import { ViewIcon, type IconName } from "./icons";
import { sortItems, type BrowseSort } from "./views";

const SORTS: { id: BrowseSort; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "az", label: "A–Z" },
];

type GridProps = {
  items: ComponentItem[];
  pm: PackageManager;
  noun: string;
  wide?: boolean;
  metaLabel?: string;
  query?: string;
  emptyHint: string;
  onClearSearch: () => void;
};

export function BrowseGrid({
  items,
  pm,
  noun,
  wide = false,
  metaLabel,
  query,
  emptyHint,
  onClearSearch,
}: GridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-22 text-center">
        <p className="text-lg font-semibold">
          Nothing matches “{query?.trim()}”.
        </p>
        <p className="text-[15px] text-home-fg-2">{emptyHint}</p>
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-1 h-10 cursor-pointer rounded-full border border-home-line-strong px-4.5 text-sm font-medium transition-colors duration-150 hover:border-home-fg-2"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-x-5 gap-y-8.5",
        wide
          ? "grid-cols-[repeat(auto-fill,minmax(min(100%,24rem),1fr))]"
          : "grid-cols-[repeat(auto-fill,minmax(17.5rem,1fr))]",
      )}
    >
      {items.map((item) => (
        <BrowseCard
          key={item.href}
          item={item}
          pm={pm}
          metaLabel={metaLabel}
          detailed
        />
      ))}
      <a
        href={`${REGISTRY_HOMEPAGE}/issues`}
        target="_blank"
        rel="noreferrer"
        className="flex aspect-16/11 flex-col items-center justify-center gap-2.5 rounded-[18px] border border-dashed border-home-line-strong p-5 text-center text-[13.5px] text-home-fg-2 transition-colors duration-200 hover:border-home-blue/50 hover:text-home-fg"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-home-raised text-home-blue">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-4.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold text-home-fg">
          Missing a {noun}?
        </span>
        Request one on GitHub
      </a>
    </div>
  );
}

export default function BrowseListing({
  icon,
  title,
  blurb,
  footer,
  ...grid
}: GridProps & {
  icon: IconName;
  title: string;
  blurb: string;
  footer?: ReactNode;
}) {
  const [sort, setSort] = useState<BrowseSort>("newest");
  const count = grid.items.length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-13 shrink-0 items-center justify-center rounded-[15px] border border-home-line bg-home-raised text-home-blue">
            <ViewIcon view={icon} className="size-5.5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.03em]">
              {title}
            </h1>
            <p className="mt-1 text-[15px] text-home-fg-2">{blurb}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-home-muted">
            {count} {grid.noun}
            {count === 1 ? "" : "s"}
          </span>
          {count > 1 && (
            <div
              role="radiogroup"
              aria-label="Sort"
              className="flex gap-0.5 rounded-xl border border-home-line bg-home-raised/40 p-0.75"
            >
              {SORTS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={sort === id}
                  onClick={() => setSort(id)}
                  className={cn(
                    "h-7.5 cursor-pointer rounded-[9px] px-3 text-[13px] transition-colors duration-150",
                    sort === id
                      ? "bg-home-raised text-home-fg"
                      : "text-home-muted hover:text-home-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-7.5">
        <BrowseGrid {...grid} items={sortItems(grid.items, sort)} />
      </div>

      {footer}
    </>
  );
}
