"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubLogo } from "@/components/logos";
import { MoxMark } from "@/components/MoxLogo";
import { ChevronIcon, ExternalIcon, ViewIcon } from "@/components/browse/icons";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  components,
  REGISTRY_HOMEPAGE,
  templates,
  type ComponentCategory,
  type ComponentItem,
} from "@/lib/components";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

const ROW =
  "flex h-9 w-full items-center gap-2.75 rounded-[10px] px-2.5 text-left text-[14.5px] text-home-fg-2 transition-[color,box-shadow] duration-150 hover:text-home-fg hover:shadow-[inset_0_0_0_1px_var(--home-line)]";

export default function DocsSidebar({ current }: { current?: ComponentItem }) {
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [toggled, setToggled] = useState<
    Partial<Record<ComponentCategory, boolean>>
  >({});
  const [menuOpen, setMenuOpen] = useState(false);
  const needle = query.trim().toLowerCase();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing =
        target.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (event.key !== "/" || typing) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    asideRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  const groups = CATEGORY_ORDER.map((id) => ({
    id,
    total: components.filter((item) => item.category === id).length,
    items: components.filter(
      (item) =>
        item.category === id &&
        (!needle || item.name.toLowerCase().includes(needle)),
    ),
  })).filter((group) => !needle || group.items.length > 0);

  return (
    <aside
      ref={asideRef}
      aria-label="Components navigation"
      className="flex flex-col gap-3 border-b border-home-line bg-home-raised/40 px-4 py-3 md:sticky md:top-0 md:h-svh md:w-66 md:shrink-0 md:gap-5 md:overflow-y-auto md:border-b-0 md:border-r md:px-3.5 md:py-4.5"
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex h-9 shrink-0 items-center gap-2.5 px-1 text-[17px] font-bold tracking-tight md:px-2"
        >
          <MoxMark className="size-6" />
          {SITE_NAME}
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="docs-nav"
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-home-line-strong px-3.5 text-[13.5px] font-medium md:hidden"
        >
          Browse components
          <ChevronIcon
            className={cn(
              "size-3.5 transition-transform duration-200",
              menuOpen ? "-rotate-90" : "rotate-90",
            )}
          />
        </button>
      </div>

      <div
        id="docs-nav"
        className={cn("flex-col gap-5", menuOpen ? "flex" : "hidden md:flex")}
      >
        <label
          className={cn(
            "flex h-10 items-center gap-2.5 rounded-xl border bg-home-bg pl-3 pr-2 text-home-muted transition-colors duration-150",
            needle ? "border-home-blue/45" : "border-home-line",
          )}
        >
          <ViewIcon view="search" className="size-3.75 shrink-0" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a component"
            aria-label="Find a component"
            className="min-w-0 flex-1 bg-transparent text-sm text-home-fg outline-none placeholder:text-home-muted"
          />
          <kbd className="rounded-md border border-home-line px-1.5 font-mono text-[11px] text-home-muted">
            /
          </kbd>
        </label>

        <nav aria-label="Components" className="flex flex-col gap-5">
          <div className="flex flex-col gap-0.5">
            <Link href="/components" className={ROW}>
              <ViewIcon
                view="overview"
                className="size-4.25 shrink-0 text-home-muted"
              />
              <span className="flex-1">Overview</span>
            </Link>
            <Link href="/components?view=all" className={ROW}>
              <ViewIcon
                view="all"
                className="size-4.25 shrink-0 text-home-muted"
              />
              <span className="flex-1">All components</span>
              <span className="font-mono text-[11.5px] text-home-muted">
                {components.length}
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="px-2.5 pb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-home-muted">
              Categories
            </span>
            {groups.length === 0 && (
              <p className="px-2.5 py-1 text-[13.5px] text-home-muted">
                No component matches.
              </p>
            )}
            {groups.map((group) => {
              const holds = current?.category === group.id;
              const open = needle ? true : (toggled[group.id] ?? holds);
              return (
                <div key={group.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() =>
                      setToggled((state) => ({ ...state, [group.id]: !open }))
                    }
                    aria-expanded={open}
                    className={cn(
                      ROW,
                      "cursor-pointer",
                      holds && "text-home-fg",
                    )}
                  >
                    <ViewIcon
                      view={group.id}
                      className={cn(
                        "size-4.25 shrink-0",
                        holds ? "text-home-blue" : "text-home-muted",
                      )}
                    />
                    <span className="flex-1">{CATEGORY_LABELS[group.id]}</span>
                    <span className="font-mono text-[11.5px] text-home-muted">
                      {group.total}
                    </span>
                    <ChevronIcon
                      className={cn(
                        "size-3.25 text-home-muted transition-transform duration-200",
                        open && "rotate-90",
                      )}
                    />
                  </button>
                  {open && (
                    <ul className="mb-1.5 ml-4.5 mt-0.5 flex flex-col gap-px border-l border-home-line pl-2.5">
                      {group.items.map((item) => {
                        const active = item.href === pathname;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "flex h-8 items-center gap-2 rounded-lg px-2.5 text-sm transition-colors duration-150",
                                active
                                  ? "bg-home-fg/7 font-semibold text-home-fg"
                                  : "text-home-fg-2 hover:text-home-fg",
                              )}
                            >
                              <span className="truncate">{item.name}</span>
                              {item.isNew && (
                                <span
                                  aria-label="New"
                                  className="size-1.5 shrink-0 rounded-full bg-[#3B6FF0]"
                                />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="px-2.5 pb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-home-muted">
              More
            </span>
            <Link href="/templates" className={ROW}>
              <ViewIcon
                view="templates"
                className="size-4.25 shrink-0 text-home-muted"
              />
              <span className="flex-1">Templates</span>
              <span className="font-mono text-[11.5px] text-home-muted">
                {templates.length}
              </span>
            </Link>
            <a href="/llms.txt" className={ROW}>
              <ViewIcon
                view="llms"
                className="size-4.25 shrink-0 text-home-muted"
              />
              <span className="flex-1">llms.txt</span>
              <ExternalIcon className="size-3.25 text-home-muted" />
            </a>
            <a
              href={REGISTRY_HOMEPAGE}
              target="_blank"
              rel="noreferrer"
              className={ROW}
            >
              <GithubLogo className="size-4.25 shrink-0 text-home-muted" />
              <span className="flex-1">GitHub</span>
              <ExternalIcon className="size-3.25 text-home-muted" />
            </a>
          </div>
        </nav>
      </div>
    </aside>
  );
}
