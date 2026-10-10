import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  components,
  installCommand,
  REGISTRY_HOMEPAGE,
  templates,
  type ComponentItem,
} from "@/lib/components";
import { SITE_URL } from "@/lib/site";

export const READING_ORDER = [
  ...components.filter((item) => item.featured && !templates.includes(item)),
  ...CATEGORY_ORDER.flatMap((id) =>
    components.filter(
      (item) =>
        item.category === id && !item.featured && !templates.includes(item),
    ),
  ),
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
