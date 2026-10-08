"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { GithubLogo } from "@/components/logos";
import { SITE_GITHUB_URL, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { MoxMark } from "@/components/MoxLogo";
import { WRAP } from "./wrap";

const LINKS = [
  { label: "Components", href: "/components" },
  { label: "Templates", href: "/templates" },
];

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export default function HomeNav({ stars }: { stars?: number | null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-colors duration-200",
        scrolled &&
          "border-home-line bg-home-bg/75 backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <div className={cn(WRAP, "flex h-15 items-center justify-between gap-4")}>
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <MoxMark className="size-6" />
          {SITE_NAME}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-sm text-home-fg-2 md:flex"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-150 hover:text-home-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
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
                {stars != null ? compact.format(stars) : "Star"}
              </span>
            </a>
          )}

          <ThemeToggle className="rounded-full bg-transparent p-2 text-home-fg-2 hover:bg-home-line hover:text-home-fg [&_svg]:size-4" />

          <Link
            href="/components"
            className="inline-flex h-8.5 items-center rounded-full bg-home-fg px-3.5 text-sm font-semibold text-home-bg transition-colors duration-150 hover:bg-home-fg/85"
          >
            Quick start
          </Link>
        </div>
      </div>
    </header>
  );
}
