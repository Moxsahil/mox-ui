"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { GithubLogo } from "@/components/logos";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_GITHUB_URL, SITE_NAME } from "@/lib/site";
import { useStarCount } from "@/lib/use-star-count";
import { cn } from "@/lib/utils";
import { ChevronIcon } from "./icons";

export type FrameChip = {
  id: string;
  label: string;
  count?: number;
  active: boolean;
  onSelect: () => void;
};

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export type FrameCrumb = { label: string; href?: string };

export default function BrowseFrame({
  crumbs,
  sidebar,
  chips = [],
  actions,
  stars,
  children,
}: {
  crumbs: FrameCrumb[];
  sidebar: ReactNode;
  chips?: FrameChip[];
  actions?: ReactNode;
  stars?: number | null;
  children: ReactNode;
}) {
  const liveStars = useStarCount(stars);

  return (
    <div className="home flex min-h-svh flex-1 flex-col bg-home-bg font-runde text-home-fg md:flex-row">
      {sidebar}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-15 items-center justify-between gap-4 border-b border-home-line bg-home-bg/80 px-4 backdrop-blur-xl backdrop-saturate-150 md:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-2 text-sm"
          >
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <span
                  key={crumb.label}
                  className={cn(
                    "flex items-center gap-2",
                    last ? "min-w-0" : "shrink-0 max-sm:hidden",
                  )}
                >
                  {last ? (
                    <span aria-current="page" className="truncate font-medium">
                      {crumb.label}
                    </span>
                  ) : crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-home-muted transition-colors duration-150 hover:text-home-fg"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-home-muted">{crumb.label}</span>
                  )}
                  {!last && (
                    <ChevronIcon className="size-3.5 shrink-0 text-home-muted" />
                  )}
                </span>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-1.5">
            {actions}
            {SITE_GITHUB_URL && (
              <a
                href={SITE_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={`${SITE_NAME} on GitHub`}
                className="inline-flex h-8.5 items-center gap-1.5 rounded-full px-2.5 text-sm text-home-fg-2 transition-colors duration-150 hover:bg-home-line hover:text-home-fg"
              >
                <GithubLogo className="size-4" />
                <span className="hidden tabular-nums sm:inline">
                  {liveStars != null ? compact.format(liveStars) : "Star"}
                </span>
              </a>
            )}
            <ThemeToggle className="rounded-full bg-transparent p-2 text-home-fg-2 hover:bg-home-line hover:text-home-fg [&_svg]:size-4" />
            <Link
              href="/#install-heading"
              className="inline-flex h-8.5 items-center rounded-full bg-home-fg px-3.5 text-sm font-semibold text-home-bg transition-colors duration-150 hover:bg-home-fg/85"
            >
              Quick start
            </Link>
          </div>
        </header>

        {chips.length > 0 && (
          <nav
            aria-label={`${crumbs[0]?.label ?? "Page"} views`}
            className="flex gap-2 overflow-x-auto border-b border-home-line px-4 py-3 scrollbar-none md:hidden [&::-webkit-scrollbar]:hidden"
          >
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.onSelect}
                aria-current={chip.active ? "page" : undefined}
                className={cn(
                  "flex h-9 shrink-0 cursor-pointer items-center gap-1.75 rounded-full border px-3.25 text-[13.5px] font-medium transition-colors duration-150",
                  chip.active
                    ? "border-home-fg bg-home-fg text-home-bg"
                    : "border-home-line-strong text-home-fg-2",
                )}
              >
                {chip.label}
                {chip.count !== undefined && (
                  <span className="font-mono text-[11px] opacity-65">
                    {chip.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        )}

        <main className="px-4 pb-24 pt-6 md:px-8 md:pt-9">{children}</main>
      </div>
    </div>
  );
}
