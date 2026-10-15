"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { MoxMark } from "@/components/MoxLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { GithubLogo } from "@/components/logos";
import { SITE_GITHUB_URL, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export default function DocsHeader({ stars }: { stars?: number | null }) {
  const pathname = usePathname();
  const section = pathname.startsWith("/docs")
    ? "docs"
    : pathname.startsWith("/templates")
      ? "templates"
      : "components";
  const navLink = (active: boolean) =>
    cn("hover:text-home-fg", active && "font-semibold text-home-fg");
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
            href="/docs/introduction"
            aria-current={section === "docs" ? "page" : undefined}
            className={navLink(section === "docs")}
          >
            Docs
          </Link>
          <Link
            href="/components"
            aria-current={section === "components" ? "true" : undefined}
            className={navLink(section === "components")}
          >
            Components
          </Link>
          <Link
            href="/templates"
            aria-current={section === "templates" ? "page" : undefined}
            className={navLink(section === "templates")}
          >
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
            className="relative ml-1 flex h-8 items-center gap-1.5 pl-3 pr-1 text-xs text-home-muted before:absolute before:left-0 before:top-1.5 before:h-5 before:w-px before:bg-home-line hover:text-home-fg"
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
