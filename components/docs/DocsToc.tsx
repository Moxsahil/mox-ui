"use client";

import { useEffect, useState } from "react";
import { Bug, LayoutGrid, Lightbulb } from "lucide-react";
import { REGISTRY_HOMEPAGE, type ComponentItem } from "@/lib/components";
import { cn } from "@/lib/utils";
import { docsLinks } from "./docs";

export type TocSection = { id: string; label: string };

export default function DocsToc({
  item,
  sections,
}: {
  item: ComponentItem;
  sections: TocSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const ids = sections.map((section) => section.id).join(",");
  const links = docsLinks(item);
  const contributions = [
    { label: "Report an issue", href: links.issue, icon: Bug },
    {
      label: "Request a feature",
      href: `${REGISTRY_HOMEPAGE}/issues/new?title=${encodeURIComponent(`${item.name}: Feature request`)}`,
      icon: Lightbulb,
    },
    {
      label: "Request a new component",
      href: `${REGISTRY_HOMEPAGE}/issues/new?title=Component%20request`,
      icon: LayoutGrid,
    },
  ];

  useEffect(() => {
    const order = ids.split(",").filter(Boolean);
    let frame = 0;
    const update = () => {
      frame = 0;
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      let current = order[0];
      for (const id of order) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= 120) current = id;
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
      className="no-scrollbar sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 flex-col gap-6 self-start overflow-y-auto border-l border-home-line px-6 py-6 xl:flex 2xl:w-68"
    >
      <nav aria-label="On this page" className="flex flex-col">
        <h2 className="pb-3 text-sm font-semibold text-home-fg">
          On This Page
        </h2>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active === section.id ? "location" : undefined}
            className={cn(
              "flex min-h-7 items-center rounded-sm text-sm transition-colors hover:text-home-fg motion-reduce:transition-none",
              active === section.id
                ? "font-medium text-home-fg"
                : "text-home-muted",
            )}
          >
            {section.label}
          </a>
        ))}
      </nav>
      <div>
        <h2 className="pb-3 text-sm font-semibold text-home-fg">Contribute</h2>
        <ul className="flex flex-col gap-2.5 text-sm text-home-muted">
          {contributions.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-sm transition-colors hover:text-home-fg motion-reduce:transition-none"
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
