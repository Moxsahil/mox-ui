"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { GithubLogo } from "@/components/logos";
import { MoxMark } from "@/components/MoxLogo";
import { REGISTRY_HOMEPAGE } from "@/lib/components";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ExternalIcon, ViewIcon, type IconName } from "./icons";

type EntryIcon = IconName | "github";

export type SidebarEntry =
  | {
      kind: "view";
      id: string;
      label: string;
      icon: EntryIcon;
      count?: number;
      active: boolean;
      onSelect: () => void;
    }
  | {
      kind: "link";
      label: string;
      href: string;
      icon: EntryIcon;
      count?: number;
      external?: boolean;
    };

export type SidebarGroup = { title?: string; entries: SidebarEntry[] };

export const RESOURCE_LINKS: SidebarEntry[] = [
  {
    kind: "link",
    label: "llms.txt",
    href: "/llms.txt",
    icon: "llms",
    external: true,
  },
  {
    kind: "link",
    label: "GitHub",
    href: REGISTRY_HOMEPAGE,
    icon: "github",
    external: true,
  },
];

const ROW =
  "flex h-9.5 w-full items-center gap-2.75 rounded-[10px] px-2.5 text-left text-[14.5px] transition-[background-color,color,box-shadow] duration-150 hover:shadow-[inset_0_0_0_1px_var(--home-line)]";

function Icon({ icon, active }: { icon: EntryIcon; active?: boolean }) {
  const className = cn(
    "size-4.25 shrink-0",
    active ? "text-home-blue" : "text-home-muted",
  );
  return icon === "github" ? (
    <GithubLogo className={className} />
  ) : (
    <ViewIcon view={icon} className={className} />
  );
}

function Count({ value, active }: { value?: number; active?: boolean }) {
  if (value === undefined) return null;
  return (
    <span
      className={cn(
        "font-mono text-[11.5px]",
        active ? "text-home-fg" : "text-home-muted",
      )}
    >
      {value}
    </span>
  );
}

export default function BrowseSidebar({
  label,
  searchLabel,
  query,
  onQuery,
  searching,
  groups,
  request,
}: {
  label: string;
  searchLabel: string;
  query: string;
  onQuery: (query: string) => void;
  searching: boolean;
  groups: SidebarGroup[];
  request: { title: string; text: string; cta: string };
}) {
  const searchRef = useRef<HTMLInputElement>(null);

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

  return (
    <aside
      aria-label={label}
      className="flex items-center gap-3 border-b border-home-line bg-home-raised/40 px-4 py-3 md:sticky md:top-0 md:h-svh md:w-66 md:shrink-0 md:flex-col md:items-stretch md:gap-5 md:overflow-y-auto md:border-b-0 md:border-r md:px-3.5 md:py-4.5"
    >
      <Link
        href="/"
        className="flex h-9 shrink-0 items-center gap-2.5 px-1 text-[17px] font-bold tracking-tight md:px-2"
      >
        <MoxMark className="size-6" />
        {SITE_NAME}
      </Link>

      <label
        className={cn(
          "flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-xl border bg-home-bg pl-3 pr-2 text-home-muted transition-colors duration-150 md:flex-none",
          searching ? "border-home-blue/45" : "border-home-line",
        )}
      >
        <ViewIcon view="search" className="size-3.75 shrink-0" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={searchLabel}
          aria-label={searchLabel}
          className="min-w-0 flex-1 bg-transparent text-sm text-home-fg outline-none placeholder:text-home-muted"
        />
        <kbd className="rounded-md border border-home-line px-1.5 font-mono text-[11px] text-home-muted">
          /
        </kbd>
      </label>

      <nav aria-label="Browse" className="hidden flex-col gap-5.5 md:flex">
        {groups.map((group, index) => (
          <div key={group.title ?? index} className="flex flex-col gap-0.5">
            {group.title && (
              <span className="px-2.5 pb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-home-muted">
                {group.title}
              </span>
            )}
            {group.entries.map((entry) => {
              if (entry.kind === "view") {
                const active = !searching && entry.active;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={entry.onSelect}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      ROW,
                      "cursor-pointer",
                      active
                        ? "bg-home-fg/7 text-home-fg"
                        : "text-home-fg-2 hover:text-home-fg",
                    )}
                  >
                    <Icon icon={entry.icon} active={active} />
                    <span className="flex-1">{entry.label}</span>
                    <Count value={entry.count} active={active} />
                  </button>
                );
              }

              const content = (
                <>
                  <Icon icon={entry.icon} />
                  <span className="flex-1">{entry.label}</span>
                  {entry.external ? (
                    <ExternalIcon className="size-3.25 text-home-muted" />
                  ) : (
                    <Count value={entry.count} />
                  )}
                </>
              );
              const className = cn(ROW, "text-home-fg-2 hover:text-home-fg");
              return entry.external ? (
                <a
                  key={entry.label}
                  href={entry.href}
                  target={entry.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <Link key={entry.label} href={entry.href} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto hidden flex-col gap-2.5 rounded-2xl border border-home-line bg-home-bg p-4 md:flex">
        <span className="text-sm font-semibold">{request.title}</span>
        <span className="text-[13px] leading-normal text-home-fg-2">
          {request.text}
        </span>
        <a
          href={`${REGISTRY_HOMEPAGE}/issues`}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center justify-center rounded-[10px] bg-home-fg text-[13.5px] font-semibold text-home-bg transition-colors duration-150 hover:bg-home-fg/85"
        >
          {request.cta}
        </a>
      </div>
    </aside>
  );
}
