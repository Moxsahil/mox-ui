import type { BrowseView } from "./views";

const PATHS: Record<BrowseView | "templates" | "llms" | "search", string> = {
  overview:
    "M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z",
  new: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  featured:
    "M12 4.5l2.3 4.7 5.2.75-3.75 3.65.9 5.15L12 16.3l-4.65 2.45.9-5.15L4.5 9.95l5.2-.75z",
  all: "M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z",
  templates: "M4 4h16v6H4zM4 13.5h7V20H4zM14.5 13.5H20V20h-5.5z",
  display: "M3.5 5.5h17v11h-17zM9 20h6M12 16.5V20",
  ai: "M12 3c.55 3.7 2.6 5.75 6.3 6.3-3.7.55-5.75 2.6-6.3 6.3-.55-3.7-2.6-5.75-6.3-6.3C9.4 8.75 11.45 6.7 12 3zM18.5 15.5c.25 1.55 1.1 2.4 2.65 2.65-1.55.25-2.4 1.1-2.65 2.65-.25-1.55-1.1-2.4-2.65-2.65 1.55-.25 2.4-1.1 2.65-2.65z",
  navigation: "M4 4.5h16v15H4zM9.5 4.5v15M6.3 8.5h1M6.3 11.5h1",
  inputs: "M3.5 7h17v10h-17zM7.5 10v4",
  feedback: "M6 16.5v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  llms: "M7 4.5h7l4 4V19.5H7zM14 4.5v4h4M9.5 12.5h5M9.5 15.5h5",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-3.5-3.5",
};

export type IconName = keyof typeof PATHS;

export function ViewIcon({
  view,
  className,
}: {
  view: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[view]} />
    </svg>
  );
}

export function ChevronIcon({
  direction = "right",
  className,
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={direction === "right" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
    </svg>
  );
}

export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
