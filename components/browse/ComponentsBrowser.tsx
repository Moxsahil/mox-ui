"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import GlassAccent from "@/components/home/GlassAccent";
import {
  CATEGORY_ORDER,
  components,
  templates,
  type PackageManager,
} from "@/lib/components";
import BrowseFrame from "./BrowseFrame";
import BrowseListing from "./BrowseListing";
import BrowseShelf from "./BrowseShelf";
import BrowseSidebar, {
  RESOURCE_LINKS,
  type SidebarEntry,
} from "./BrowseSidebar";
import { ViewIcon } from "./icons";
import PackageManagerSwitch from "./PackageManagerSwitch";
import {
  COLLECTION_VIEWS,
  isBrowseView,
  itemsFor,
  searchItems,
  SHELF_VIEWS,
  sortItems,
  VIEW_BLURBS,
  VIEW_LABELS,
  type BrowseView,
} from "./views";

const EMPTY_HINT = "Try a word like orb, sidebar or input.";

export default function ComponentsBrowser({
  stars,
}: {
  stars?: number | null;
}) {
  const view = useSearchParams().get("view");
  return (
    <BrowserShell view={isBrowseView(view) ? view : "overview"} stars={stars} />
  );
}

export function BrowserShell({
  view,
  stars,
}: {
  view: BrowseView;
  stars?: number | null;
}) {
  const [query, setQuery] = useState("");
  const [pm, setPm] = useState<PackageManager>("npm");
  const searching = query.trim().length > 0;

  // pushState keeps useSearchParams in sync without a server round trip
  const navigate = (next: BrowseView) => {
    setQuery("");
    window.history.pushState(null, "", `/components?view=${next}`);
    window.scrollTo({ top: 0 });
  };

  const entry = (id: BrowseView): SidebarEntry => ({
    kind: "view",
    id,
    label: VIEW_LABELS[id],
    icon: id,
    count: id === "overview" ? undefined : itemsFor(id).length,
    active: view === id,
    onSelect: () => navigate(id),
  });

  const sidebar = (
    <BrowseSidebar
      label="Components navigation"
      searchLabel="Search components"
      query={query}
      onQuery={setQuery}
      searching={searching}
      groups={[
        { entries: COLLECTION_VIEWS.map(entry) },
        { title: "Categories", entries: CATEGORY_ORDER.map(entry) },
        {
          title: "More",
          entries: [
            {
              kind: "link",
              label: "Templates",
              href: "/templates",
              icon: "templates",
              count: templates.length,
            },
            ...RESOURCE_LINKS,
          ],
        },
      ]}
      request={{
        title: "Missing something?",
        text: "Tell us which component you want built next.",
        cta: "Request a component",
      }}
    />
  );

  const listingProps = {
    pm,
    noun: "component",
    emptyHint: EMPTY_HINT,
    onClearSearch: () => setQuery(""),
  };

  return (
    <BrowseFrame
      crumbs={[
        { label: "Components", href: "/components?view=overview" },
        { label: searching ? "Search" : VIEW_LABELS[view] },
      ]}
      sidebar={sidebar}
      stars={stars}
      chips={[...COLLECTION_VIEWS, ...CATEGORY_ORDER].map((id) => ({
        id,
        label: VIEW_LABELS[id],
        count: id === "overview" ? undefined : itemsFor(id).length,
        active: !searching && view === id,
        onSelect: () => navigate(id),
      }))}
    >
      {searching ? (
        <BrowseListing
          {...listingProps}
          icon="search"
          title={`Results for “${query.trim()}”`}
          blurb="Matching names, descriptions and categories."
          items={searchItems(query)}
          query={query}
        />
      ) : view === "overview" ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div className="min-w-0">
              <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                Every component, in <GlassAccent>motion</GlassAccent>.
              </h1>
              <p className="mt-2.5 text-[15.5px] leading-relaxed text-home-fg-2">
                {components.length} components across {CATEGORY_ORDER.length}{" "}
                categories. Hover a preview to play it, copy to install, open
                for props and code.
              </p>
            </div>
            <PackageManagerSwitch value={pm} onChange={setPm} />
          </div>

          {SHELF_VIEWS.map((id, index) => (
            <BrowseShelf
              key={id}
              id={id}
              index={index}
              label={VIEW_LABELS[id]}
              items={sortItems(itemsFor(id), "newest")}
              pm={pm}
              onViewAll={() => navigate(id)}
            />
          ))}
        </>
      ) : (
        <BrowseListing
          {...listingProps}
          key={view}
          icon={view}
          title={VIEW_LABELS[view]}
          blurb={VIEW_BLURBS[view]}
          items={itemsFor(view)}
          footer={
            <div className="mt-16 flex flex-col gap-3.5 border-t border-home-line pt-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-home-muted">
                Keep browsing
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_ORDER.filter((id) => id !== view).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => navigate(id)}
                    className="flex h-10 cursor-pointer items-center gap-2.25 rounded-full border border-home-line-strong px-3.5 pl-3 text-sm text-home-fg-2 transition-colors duration-150 hover:border-home-fg-2 hover:text-home-fg"
                  >
                    <ViewIcon view={id} className="size-4 text-home-blue" />
                    {VIEW_LABELS[id]}
                    <span className="font-mono text-[11px] text-home-muted">
                      {itemsFor(id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          }
        />
      )}
    </BrowseFrame>
  );
}
