"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentItem } from "@/lib/components";
import { cn } from "@/lib/utils";
import { aiPrompt, docsLinks, pageMarkdown } from "./docs";

const PILL =
  "flex h-10 cursor-pointer items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors duration-150";

function useCopied() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 1500);
    } catch {}
  };
  return { copied, copy };
}

export default function DocsActions({ item }: { item: ComponentItem }) {
  const { copied, copy } = useCopied();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const links = docsLinks(item);
  const ask = encodeURIComponent(
    `Read ${links.page} and help me use the ${item.name} component from Mox UI.`,
  );

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (
        event instanceof MouseEvent &&
        menuRef.current?.contains(event.target as Node)
      )
        return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => copy("prompt", aiPrompt(item))}
        className={cn(PILL, "bg-home-fg text-home-bg hover:bg-home-fg/85")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-3.75"
        >
          <path d="M12 3c.55 3.7 2.6 5.75 6.3 6.3-3.7.55-5.75 2.6-6.3 6.3-.55-3.7-2.6-5.75-6.3-6.3C9.4 8.75 11.45 6.7 12 3z" />
        </svg>
        <span aria-live="polite">
          {copied === "prompt" ? "Prompt copied" : "Copy prompt"}
        </span>
      </button>

      {item.registry && (
        <a
          href={links.v0}
          target="_blank"
          rel="noreferrer"
          className={cn(
            PILL,
            "border border-home-line-strong hover:border-home-fg-2",
          )}
        >
          Open in v0
        </a>
      )}

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className={cn(
            PILL,
            "border border-home-line-strong pr-3 hover:border-home-fg-2",
          )}
        >
          Copy page
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform duration-200",
              menuOpen && "rotate-180",
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute left-0 top-12 z-20 flex w-66 flex-col rounded-2xl border border-home-line-strong bg-home-bg p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => copy("markdown", pageMarkdown(item))}
              className="flex cursor-pointer flex-col items-start gap-0.5 rounded-[10px] px-2.5 py-2.25 text-left hover:bg-home-raised"
            >
              <span className="text-sm font-medium">
                {copied === "markdown"
                  ? "Copied as Markdown"
                  : "Copy page as Markdown"}
              </span>
              <span className="text-[12.5px] text-home-muted">
                Paste it into any AI chat or doc
              </span>
            </button>
            {[
              {
                label: "Open in ChatGPT",
                href: `https://chatgpt.com/?q=${ask}`,
              },
              {
                label: "Open in Claude",
                href: `https://claude.ai/new?q=${ask}`,
              },
            ].map((link) => (
              <a
                key={link.label}
                role="menuitem"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-0.5 rounded-[10px] px-2.5 py-2.25 hover:bg-home-raised"
              >
                <span className="text-sm font-medium">{link.label}</span>
                <span className="text-[12.5px] text-home-muted">
                  Ask questions about this page
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {item.source && (
        <a
          href={item.source}
          target="_blank"
          rel="noreferrer"
          className={cn(PILL, "text-home-fg-2 hover:text-home-fg")}
        >
          View source
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-3.25"
          >
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
      )}
    </div>
  );
}
