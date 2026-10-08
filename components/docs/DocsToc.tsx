"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import {
  installCommand,
  type ComponentItem,
  type PackageManager,
} from "@/lib/components";
import { cn } from "@/lib/utils";
import { docsLinks } from "./docs";

export type TocSection = { id: string; label: string };

export default function DocsToc({
  item,
  sections,
  pm,
}: {
  item: ComponentItem;
  sections: TocSection[];
  pm: PackageManager;
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const ids = sections.map((section) => section.id).join(",");
  const command = installCommand(item, pm);
  const links = docsLinks(item);

  useEffect(() => {
    const order = ids.split(",");
    let frame = 0;
    // a section is current once its heading clears the sticky top bar, and the last one wins at the page end
    const update = () => {
      frame = 0;
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      let current = order[0];
      for (const id of order) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= 140) current = id;
      }
      setActive(atEnd ? order[order.length - 1] : current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return (
    <aside
      aria-label="On this page"
      className="sticky top-21 hidden w-54 shrink-0 flex-col gap-7 self-start pt-2 xl:flex 2xl:w-60"
    >
      <nav className="flex flex-col">
        <span className="pb-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-home-muted">
          On this page
        </span>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active === section.id ? "location" : undefined}
            className={cn(
              "flex h-7.5 items-center border-l pl-3 text-sm transition-colors duration-150",
              active === section.id
                ? "border-[#3B6FF0] text-home-fg"
                : "border-home-line text-home-muted hover:text-home-fg",
            )}
          >
            {section.label}
          </a>
        ))}
      </nav>

      {command && (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-home-line bg-home-surface p-3.5">
          <span className="text-[13.5px] font-semibold">Quick install</span>
          <div className="flex items-center gap-1.5 rounded-[10px] border border-home-line pl-2.5">
            <code className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-home-fg-2">
              add mox-ui/{item.registry}
            </code>
            <CopyButton
              value={command}
              label="Copy install command"
              className="size-8 rounded-lg text-home-fg-2 hover:text-home-fg"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 text-[13.5px]">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-home-muted">
          Contribute
        </span>
        <a
          href={links.edit}
          target="_blank"
          rel="noreferrer"
          className="text-home-fg-2 transition-colors hover:text-home-fg"
        >
          Edit this page
        </a>
        <a
          href={links.issue}
          target="_blank"
          rel="noreferrer"
          className="text-home-fg-2 transition-colors hover:text-home-fg"
        >
          Report an issue
        </a>
        {item.registry && (
          <a
            href={links.registry}
            className="text-home-fg-2 transition-colors hover:text-home-fg"
          >
            Registry JSON
          </a>
        )}
      </div>
    </aside>
  );
}
