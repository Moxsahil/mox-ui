"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import DocsCode from "./DocsCode";

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORTS: {
  id: Viewport;
  label: string;
  width: string;
  icon: string;
}[] = [
  {
    id: "desktop",
    label: "Full width",
    width: "100%",
    icon: "M3.5 5.5h17v11h-17zM9 20h6M12 16.5V20",
  },
  {
    id: "tablet",
    label: "Tablet width, 768 px",
    width: "768px",
    icon: "M6 3h12a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 6 3zM11 18h2",
  },
  {
    id: "mobile",
    label: "Phone width, 390 px",
    width: "390px",
    icon: "M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3zM11 18h2",
  },
];

const TOOL =
  "flex size-9 cursor-pointer items-center justify-center rounded-[10px] text-home-fg-2 transition-colors duration-150 hover:bg-home-line hover:text-home-fg";

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4.25"
    >
      <path d={d} />
    </svg>
  );
}

export default function DocsPreview({
  usage,
  hint,
  children,
}: {
  usage?: string;
  hint?: string;
  children: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [run, setRun] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const sync = () =>
      setFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const current = VIEWPORTS.find((option) => option.id === viewport)!;

  return (
    <section
      id="preview"
      aria-label="Preview"
      className="mt-9 scroll-mt-24 overflow-hidden rounded-3xl border border-home-line bg-home-surface"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-home-line p-2.5">
        <div
          role="tablist"
          aria-label="Preview or code"
          className="flex gap-0.5 rounded-xl bg-home-raised p-0.75"
        >
          {(["preview", "code"] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls={`docs-${id}`}
              onClick={() => setTab(id)}
              className={cn(
                "h-8 cursor-pointer rounded-[9px] px-3.5 text-[13.5px] font-medium capitalize transition-colors duration-150",
                tab === id
                  ? "bg-home-bg text-home-fg shadow-sm"
                  : "text-home-muted hover:text-home-fg",
              )}
            >
              {id}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 lg:flex">
            {VIEWPORTS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setViewport(option.id)}
                aria-label={option.label}
                aria-pressed={viewport === option.id}
                className={cn(
                  TOOL,
                  viewport === option.id && "bg-home-line text-home-fg",
                )}
              >
                <Glyph d={option.icon} />
              </button>
            ))}
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-home-line" />
          </div>
          <button
            type="button"
            onClick={() => {
              setTab("preview");
              setRun((value) => value + 1);
            }}
            aria-label="Replay preview"
            className={TOOL}
          >
            <Glyph d="M4 4v6h6M20 12a8 8 0 1 1-2.34-5.66L20 8.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("preview");
              stageRef.current?.requestFullscreen?.().catch(() => {});
            }}
            aria-label="Show preview fullscreen"
            className={TOOL}
          >
            <Glyph d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </button>
        </div>
      </div>

      <div id="docs-preview" role="tabpanel" hidden={tab !== "preview"}>
        <div ref={stageRef} className="flex justify-center bg-card p-3 sm:p-5">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-2xl transition-[max-width] duration-500 ease-[cubic-bezier(0.3,1.1,0.4,1)] motion-reduce:transition-none",
              fullscreen
                ? "h-[calc(100svh-2.5rem)]"
                : "h-[clamp(26rem,62svh,40rem)]",
              viewport !== "desktop" && "border border-home-line-strong",
            )}
            style={{ maxWidth: current.width }}
          >
            <div key={run} className="h-full w-full overflow-auto">
              {children}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-home-line px-4 py-2.5 text-[12.5px] text-home-muted">
          <span>{current.label}</span>
          {hint && <span>{hint}</span>}
        </div>
      </div>

      <div
        id="docs-code"
        role="tabpanel"
        hidden={tab !== "code"}
        className="p-3.5"
      >
        {usage ? (
          <DocsCode code={usage} filename="demo.tsx" />
        ) : (
          <p className="p-4 text-sm text-home-fg-2">
            This component has no usage snippet yet. The full source is in the
            manual installation steps.
          </p>
        )}
      </div>
    </section>
  );
}
