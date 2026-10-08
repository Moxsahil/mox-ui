"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import GlassAccent from "@/components/home/GlassAccent";
import { components, templates, type PackageManager } from "@/lib/components";
import BrowseFrame from "./BrowseFrame";
import BrowseListing, { BrowseGrid } from "./BrowseListing";
import BrowseSidebar, {
  RESOURCE_LINKS,
  type SidebarEntry,
} from "./BrowseSidebar";
import PackageManagerSwitch from "./PackageManagerSwitch";
import { searchItems, sortItems } from "./views";

type TemplateView = "all" | "new";

const VIEWS: Record<
  TemplateView,
  { label: string; icon: "templates" | "new"; items: typeof templates }
> = {
  all: { label: "All templates", icon: "templates", items: templates },
  new: {
    label: "Newest",
    icon: "new",
    items: templates.filter((item) => item.isNew),
  },
};

const META = "Template";
const EMPTY_HINT = "Try a word like landing, dark or hero.";

export default function TemplatesBrowser({ stars }: { stars?: number | null }) {
  const view = useSearchParams().get("view");
  return <TemplatesShell view={view === "new" ? "new" : "all"} stars={stars} />;
}

export function TemplatesShell({
  view,
  stars,
}: {
  view: TemplateView;
  stars?: number | null;
}) {
  const [query, setQuery] = useState("");
  const [pm, setPm] = useState<PackageManager>("npm");
  const searching = query.trim().length > 0;
  const count = templates.length;

  // pushState keeps useSearchParams in sync without a server round trip
  const navigate = (next: TemplateView) => {
    setQuery("");
    window.history.pushState(
      null,
      "",
      next === "all" ? "/templates" : `/templates?view=${next}`,
    );
    window.scrollTo({ top: 0 });
  };

  const entry = (id: TemplateView): SidebarEntry => ({
    kind: "view",
    id,
    label: VIEWS[id].label,
    icon: VIEWS[id].icon,
    count: VIEWS[id].items.length,
    active: view === id,
    onSelect: () => navigate(id),
  });

  const sidebar = (
    <BrowseSidebar
      label="Templates navigation"
      searchLabel="Search templates"
      query={query}
      onQuery={setQuery}
      searching={searching}
      groups={[
        { entries: (["all", "new"] as const).map(entry) },
        {
          title: "Library",
          entries: [
            {
              kind: "link",
              label: "Components",
              href: "/components",
              icon: "all",
              count: components.length,
            },
            ...RESOURCE_LINKS,
          ],
        },
      ]}
      request={{
        title: "Need a different page?",
        text: "Tell us which template you want built next.",
        cta: "Request a template",
      }}
    />
  );

  const gridProps = {
    pm,
    noun: "template",
    wide: true,
    metaLabel: META,
    emptyHint: EMPTY_HINT,
    onClearSearch: () => setQuery(""),
  };

  return (
    <BrowseFrame
      crumbs={[
        { label: "Templates", href: "/templates" },
        { label: searching ? "Search" : VIEWS[view].label },
      ]}
      sidebar={sidebar}
      stars={stars}
      chips={(["all", "new"] as const).map((id) => ({
        id,
        label: VIEWS[id].label,
        count: VIEWS[id].items.length,
        active: !searching && view === id,
        onSelect: () => navigate(id),
      }))}
    >
      {searching ? (
        <BrowseListing
          {...gridProps}
          icon="search"
          title={`Results for “${query.trim()}”`}
          blurb="Matching names and descriptions."
          items={searchItems(query, templates)}
          query={query}
        />
      ) : view === "all" ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div className="min-w-0">
              <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                Start from a <GlassAccent>finished</GlassAccent> page.
              </h1>
              <p className="mt-2.5 text-[15.5px] leading-relaxed text-home-fg-2">
                {count} {count === 1 ? "template" : "templates"} so far, more on
                the way. Install one like a component, then restyle every line
                of it.
              </p>
            </div>
            <PackageManagerSwitch value={pm} onChange={setPm} />
          </div>
          <div className="mt-9">
            <BrowseGrid {...gridProps} items={sortItems(templates, "newest")} />
          </div>
        </>
      ) : (
        <BrowseListing
          {...gridProps}
          key={view}
          icon={VIEWS[view].icon}
          title={VIEWS[view].label}
          blurb="The latest templates in the registry."
          items={VIEWS[view].items}
        />
      )}
    </BrowseFrame>
  );
}
