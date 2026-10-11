import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  components,
  installCommand,
  REGISTRY_HOMEPAGE,
  templates,
  type ComponentCategory,
  type ComponentItem,
} from "@/lib/components";
import { SITE_URL } from "@/lib/site";
import type { TocSection } from "./DocsToc";

export const GUIDES: Partial<
  Record<string, { title: string; sections: TocSection[] }>
> = {
  "/docs/introduction": {
    title: "Introduction",
    sections: [
      { id: "introduction", label: "Introduction" },
      { id: "whats-inside", label: "What's inside" },
      { id: "philosophy", label: "Philosophy" },
      { id: "faq", label: "FAQ" },
    ],
  },
  "/docs/installation": {
    title: "Installation",
    sections: [
      { id: "create-project", label: "Create a project" },
      { id: "project-options", label: "Recommended defaults" },
      { id: "set-up-shadcn", label: "Set up shadcn" },
      { id: "add-component", label: "Add a component" },
      { id: "use-component", label: "Use it in a page" },
      { id: "start-server", label: "Start the server" },
    ],
  },
};

const CATEGORY_NOTES: Record<ComponentCategory, string> = {
  display: "Counters, calendars, code blocks and other content that moves",
  ai: "Orbs and loading states for voice and image generation",
  navigation:
    "Sidebars, nav bars and scroll indicators that show where you are",
  inputs: "Pickers, code inputs and buttons that confirm in place",
  feedback: "Reactions and notifications that answer a tap",
};

export const COMPONENT_GROUPS: {
  id: string;
  label: string;
  note: string;
  items: ComponentItem[];
}[] = [
  {
    id: "featured",
    label: "Featured Components",
    note: "The components people reach for first",
    items: components.filter(
      (item) => item.featured && !templates.includes(item),
    ),
  },
  ...CATEGORY_ORDER.map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
    note: CATEGORY_NOTES[id],
    items: components.filter(
      (item) =>
        item.category === id && !item.featured && !templates.includes(item),
    ),
  })),
];

export const READING_ORDER = [
  ...COMPONENT_GROUPS.flatMap((group) => group.items),
  ...templates,
];

export function neighbours(item: ComponentItem) {
  const index = READING_ORDER.indexOf(item);
  return {
    previous: index > 0 ? READING_ORDER[index - 1] : undefined,
    next:
      index >= 0 && index < READING_ORDER.length - 1
        ? READING_ORDER[index + 1]
        : undefined,
  };
}

export function sourcePath(item: ComponentItem) {
  return `components/ui/${item.registry}.tsx`;
}

export function componentName(item: ComponentItem) {
  const match = item.usage?.match(
    /import\s+(?:\{\s*([A-Z]\w*)[^}]*\}|([A-Z]\w*))/,
  );
  return match?.[1] ?? match?.[2] ?? item.name.replace(/\s+/g, "");
}

export function dependencyNames(item: ComponentItem) {
  return (item.dependencies ?? []).map((dep) => dep.name);
}

export const docsLinks = (item: ComponentItem) => ({
  page: `${SITE_URL}${item.href}`,
  registry: `/r/${item.registry}.json`,
  v0: `https://v0.dev/chat/api/open?url=${encodeURIComponent(
    `${SITE_URL}/r/${item.registry}.json`,
  )}`,
  edit: `${REGISTRY_HOMEPAGE}/edit/main/lib/components.ts`,
  issue: `${REGISTRY_HOMEPAGE}/issues/new?title=${encodeURIComponent(
    `${item.name}: `,
  )}`,
});

export function aiPrompt(item: ComponentItem) {
  const install = installCommand(item);
  return [
    `Add the ${item.name} component from Mox UI to this project.`,
    install && `Run \`${install}\`, which adds ${sourcePath(item)}.`,
    item.description,
    `Docs, props and usage: ${SITE_URL}${item.href}`,
  ]
    .filter(Boolean)
    .join(" ");
}

export function pageMarkdown(item: ComponentItem) {
  const install = installCommand(item);
  const lines = [
    `# ${item.name}`,
    "",
    item.description ?? "",
    "",
    `Category: ${CATEGORY_LABELS[item.category]}`,
  ];
  if (install) lines.push("", "## Installation", "", "```bash", install, "```");
  if (item.usage) lines.push("", "## Usage", "", "```tsx", item.usage, "```");
  if (item.props?.length) {
    lines.push("", "## Props", "", "| Prop | Type | Default | Description |");
    lines.push("| --- | --- | --- | --- |");
    for (const prop of item.props) {
      lines.push(
        `| ${prop.name} | \`${prop.type}\` | ${prop.default ?? "-"} | ${prop.description} |`,
      );
    }
  }
  if (item.interaction) {
    lines.push("", "## Interaction", "", item.interaction);
  }
  lines.push("", `Docs: ${SITE_URL}${item.href}`);
  return lines.join("\n");
}
