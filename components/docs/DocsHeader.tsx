"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { MoxMark } from "@/components/MoxLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { GithubLogo } from "@/components/logos";
import { SITE_GITHUB_URL, SITE_NAME } from "@/lib/site";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export default function DocsHeader({ stars }: { stars?: number | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-home-line bg-home-bg">
      <a
        href="#docs-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-home-fg focus:px-3 focus:py-2 focus:text-home-bg"
      >
        Skip to content
      </a>
      <div className="flex h-14 items-center gap-6 px-4 sm:px-5 md:gap-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight"
        >
          <MoxMark className="size-6" />
          {SITE_NAME}
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm text-home-muted sm:flex"
        >
          <Link
            href="/components"
            aria-current="true"
            className="font-semibold text-home-fg"
          >
            Components
          </Link>
          <Link href="/templates" className="hover:text-home-fg">
            Templates
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            id="docs-search-trigger"
            type="button"
            aria-label="Search components"
            aria-keyshortcuts="/"
            onClick={() => window.dispatchEvent(new Event("docs-search"))}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-home-muted hover:bg-home-raised hover:text-home-fg"
          >
            <Search aria-hidden="true" className="size-4.5" />
          </button>
          <ThemeToggle className="size-8 rounded-lg bg-transparent p-1.75 text-home-muted hover:bg-home-raised hover:text-home-fg [&_svg]:size-4.5" />
          <a
            href={SITE_GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`${SITE_NAME} on GitHub`}
            className="ml-1 flex h-5 items-center gap-1.5 border-l border-home-line pl-3 text-xs text-home-muted hover:text-home-fg"
          >
            <GithubLogo className="size-4" />
            <span className="hidden tabular-nums sm:inline">
              {stars != null ? compact.format(stars) : "GitHub"}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
