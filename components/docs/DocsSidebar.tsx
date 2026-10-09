"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  components,
  templates,
  type ComponentItem,
} from "@/lib/components";
import { cn } from "@/lib/utils";

const ROW =
  "flex min-h-8 items-center rounded-lg px-2 text-sm transition-colors hover:bg-home-raised hover:text-home-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-fg motion-reduce:transition-none";

export default function DocsSidebar({ current }: { current?: ComponentItem }) {
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const needle = query.trim().toLowerCase();
  const introductoryPage = current?.href ?? components[0].href;

  useEffect(() => {
    const openSearch = () => {
      setMenuOpen(true);
      setSearchOpen(true);
      requestAnimationFrame(() => searchRef.current?.focus());
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing =
        target.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (event.key !== "/" || typing) return;
      event.preventDefault();
      openSearch();
    };
    window.addEventListener("docs-search", openSearch);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("docs-search", openSearch);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const aside = asideRef.current;
    const selected = aside?.querySelector('[aria-current="page"]');
    if (!aside || !selected || !window.matchMedia("(min-width: 768px)").matches)
      return;
    const bounds = aside.getBoundingClientRect();
    const row = selected.getBoundingClientRect();
    if (row.bottom > bounds.bottom)
      aside.scrollTop += row.bottom - bounds.bottom;
    if (row.top < bounds.top) aside.scrollTop -= bounds.top - row.top;
  }, [pathname]);

  const matches = (item: ComponentItem) =>
    !needle || item.name.toLowerCase().includes(needle);
  const groups = [
    {
      id: "featured",
      label: "Featured Components",
      items: components.filter(
        (item) => item.featured && !templates.includes(item) && matches(item),
      ),
    },
    ...CATEGORY_ORDER.map((id) => ({
      id,
      label: CATEGORY_LABELS[id],
      items: components.filter(
        (item) =>
          item.category === id &&
          !item.featured &&
          !templates.includes(item) &&
          matches(item),
      ),
    })),
    { id: "templates", label: "Templates", items: templates.filter(matches) },
  ].filter((group) => group.items.length > 0);

  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
    document.getElementById("docs-search-trigger")?.focus();
  };

  return (
    <aside
      ref={asideRef}
      aria-label="Components navigation"
      className="no-scrollbar border-b border-home-line bg-home-bg md:sticky md:top-14 md:h-[calc(100svh-3.5rem)] md:w-60 md:shrink-0 md:self-start md:overflow-y-auto md:overscroll-contain md:border-b-0 md:border-r xl:w-64"
    >
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="docs-nav"
        className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 px-5 text-sm text-home-fg md:hidden"
      >
        <span className="truncate">{current?.name ?? "Components"}</span>
        <span className="flex items-center gap-2 text-home-muted">
          Browse
          <ChevronDown
            aria-hidden="true"
            className={cn("size-4", menuOpen && "rotate-180")}
          />
        </span>
      </button>
      <div
        id="docs-nav"
        className={cn(
          "flex-col gap-8 px-3 pb-8 pt-5 md:pt-8",
          menuOpen ? "flex" : "hidden md:flex",
        )}
      >
        {searchOpen && (
          <div className="flex h-9 items-center gap-2 rounded-lg border border-home-line bg-home-raised px-2 text-home-muted focus-within:border-home-muted">
            <Search aria-hidden="true" className="size-3.5 shrink-0" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeSearch();
              }}
              placeholder="Find a component"
              aria-label="Find a component"
              className="min-w-0 flex-1 bg-transparent text-sm text-home-fg outline-none placeholder:text-home-muted focus-visible:ring-1 focus-visible:ring-home-fg"
            />
            <button
              type="button"
              aria-label="Close component search"
              onClick={closeSearch}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded hover:text-home-fg"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        )}
        <nav aria-label="Components" className="flex flex-col gap-8">
          {!needle && (
            <div>
              <h2 className="px-2 pb-2.5 text-xs font-semibold text-home-muted">
                Getting Started
              </h2>
              <ul className="flex flex-col gap-0.5 text-home-muted">
                {[
                  {
                    label: "Introduction",
                    href: `${introductoryPage}#preview`,
                  },
                  {
                    label: "Installation",
                    href: `${introductoryPage}#installation`,
                  },
                  { label: "Browse all", href: "/components?view=overview" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={ROW}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {groups.map((group) => (
            <div key={group.id}>
              <h2 className="px-2 pb-2.5 text-xs font-semibold text-home-muted">
                {group.label}
              </h2>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = item.href === pathname;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          ROW,
                          active
                            ? "bg-home-raised font-medium text-home-fg"
                            : "text-home-muted",
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {groups.length === 0 && (
            <p role="status" className="px-2 text-sm text-home-muted">
              No components found.
            </p>
          )}
        </nav>
      </div>
    </aside>
  );
}
