import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  components,
  type ComponentCategory,
  type ComponentItem,
} from "@/lib/components";

export type CollectionView = "overview" | "new" | "featured" | "all";
export type BrowseView = CollectionView | ComponentCategory;
export type BrowseSort = "newest" | "az";

export const COLLECTION_VIEWS: CollectionView[] = [
  "overview",
  "new",
  "featured",
  "all",
];

export const VIEW_LABELS: Record<BrowseView, string> = {
  overview: "Overview",
  new: "Newest",
  featured: "Featured",
  all: "All components",
  ...CATEGORY_LABELS,
};

export const VIEW_BLURBS: Record<Exclude<BrowseView, "overview">, string> = {
  new: "The latest additions to the registry.",
  featured: "A good place to start: the components people reach for first.",
  all: "Every component in the registry, ready to install.",
  display: "Counters, calendars, code blocks and other content that moves.",
  ai: "Orbs and loading states for voice and image generation.",
  navigation:
    "Sidebars, nav bars and scroll indicators that show where you are.",
  inputs: "Pickers, code inputs and buttons that confirm in place.",
  feedback: "Reactions and notifications that answer a tap.",
};

export function isBrowseView(value: string | null): value is BrowseView {
  return value !== null && value in VIEW_LABELS;
}

export function itemsFor(view: BrowseView): ComponentItem[] {
  switch (view) {
    case "overview":
    case "all":
      return components;
    case "new":
      return components.filter((item) => item.isNew);
    case "featured":
      return components.filter((item) => item.featured);
    default:
      return components.filter((item) => item.category === view);
  }
}

export function searchItems(
  query: string,
  pool: ComponentItem[] = components,
): ComponentItem[] {
  const needle = query.trim().toLowerCase();
  return pool.filter((item) =>
    [item.name, item.description, CATEGORY_LABELS[item.category]]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );
}

export function sortItems(items: ComponentItem[], sort: BrowseSort) {
  const order = new Map(components.map((item, index) => [item, index]));
  const visual = (item: ComponentItem) =>
    Number(!!(item.preview || item.image));
  return [...items].sort((a, b) =>
    sort === "az"
      ? a.name.localeCompare(b.name)
      : Number(!!b.isNew) - Number(!!a.isNew) ||
        visual(b) - visual(a) ||
        order.get(a)! - order.get(b)!,
  );
}

export function itemMeta(
  item: ComponentItem,
  label = CATEGORY_LABELS[item.category],
) {
  const deps = item.dependencies ?? [];
  const needs = deps.length
    ? deps[0].name + (deps.length > 1 ? ` +${deps.length - 1}` : "")
    : "no extra deps";
  return `${label} · ${needs}`;
}

export const SHELF_VIEWS: BrowseView[] = ["new", "featured", ...CATEGORY_ORDER];
