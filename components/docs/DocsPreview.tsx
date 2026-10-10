"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Maximize,
  Minimize,
  PanelsTopLeft,
  RotateCcw,
  Terminal,
} from "lucide-react";
import {
  fetchSource,
  SOURCE_ERROR,
} from "@/components/Description/fetchSource";
import { cn } from "@/lib/utils";
import DocsCode from "./DocsCode";
import DocsTabs from "./DocsTabs";

const TOOL =
  "flex size-8 cursor-pointer items-center justify-center rounded-md text-home-muted transition-colors hover:bg-home-raised hover:text-home-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-fg";

interface DocsPreviewProps {
  registry?: string;
  usage?: string;
  children: ReactNode;
  scrollable?: boolean;
}

export default function DocsPreview({
  registry,
  usage,
  children,
  scrollable = false,
}: DocsPreviewProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [source, setSource] = useState<string | null>(null);
  const [run, setRun] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);

  useEffect(() => {
    const sync = () => {
      setFullscreen(document.fullscreenElement === stageRef.current);
    };

    document.addEventListener("fullscreenchange", sync);

    return () => {
      document.removeEventListener("fullscreenchange", sync);
    };
  }, []);

  const loadSource = async () => {
    if (!registry) return;

    setSource(null);
    setSource(await fetchSource(registry));
  };

  const chooseTab = (next: "preview" | "code") => {
    setTab(next);

    if (next === "code" && registry && source === null) {
      void loadSource();
    }
  };

  const toggleFullscreen = async () => {
    setFullscreenError(false);

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (stageRef.current?.requestFullscreen) {
        await stageRef.current.requestFullscreen();
      } else {
        setFullscreenError(true);
      }
    } catch {
      setFullscreenError(true);
    }
  };

  const constrained = scrollable || fullscreen;

  return (
    <section
      id="preview"
      aria-label="Component preview and code"
      className="scroll-mt-24 overflow-hidden rounded-[10px] border border-home-line bg-home-bg"
    >
      {/* Preview / Code toolbar */}
      <div className="flex h-9 items-center justify-between border-b border-home-line bg-home-surface px-2">
        <DocsTabs
          id="component-demo"
          label="Preview or code"
          value={tab}
          onChange={chooseTab}
          options={[
            {
              id: "preview",
              label: "Preview",
              icon: <PanelsTopLeft className="size-3.5" aria-hidden="true" />,
            },
            {
              id: "code",
              label: "Code",
              icon: <Terminal className="size-3.5" aria-hidden="true" />,
            },
          ]}
        />

        {tab === "preview" && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRun((value) => value + 1)}
              aria-label="Replay preview"
              title="Replay preview"
              className={TOOL}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Show preview fullscreen"
              title="Show preview fullscreen"
              className={TOOL}
            >
              <Maximize className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Preview panel */}
      <div
        id="component-demo-preview-panel"
        role="tabpanel"
        aria-labelledby="component-demo-preview-tab"
        hidden={tab !== "preview"}
        tabIndex={0}
      >
        <div
          ref={stageRef}
          className={cn(
            "relative isolate flex w-full min-w-0 bg-home-bg",
            fullscreen
              ? "h-svh"
              : scrollable
                ? "h-[min(70svh,650px)] min-h-[350px]"
                : "min-h-[280px]",
          )}
        >
          <div
            key={run}
            className={cn(
              "w-full min-w-0",
              constrained
                ? "h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain"
                : "flex items-center justify-center p-4 sm:p-6 lg:p-8",
            )}
          >
            {children}
          </div>

          {/* Fullscreen exit button */}
          {fullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Exit fullscreen"
              title="Exit fullscreen"
              className={cn(
                TOOL,
                "absolute right-3 top-3 z-50 border border-home-line bg-home-bg",
              )}
            >
              <Minimize className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {fullscreenError && (
          <p
            role="status"
            className="border-t border-home-line px-4 py-2 text-xs text-home-fg-2"
          >
            Fullscreen is unavailable in this browser.
          </p>
        )}
      </div>

      {/* Code panel */}
      <div
        id="component-demo-code-panel"
        role="tabpanel"
        aria-labelledby="component-demo-code-tab"
        hidden={tab !== "code"}
        tabIndex={0}
        className="max-h-150 overflow-y-auto"
      >
        {registry && source === null ? (
          <p role="status" className="p-6 text-sm text-home-fg-2">
            Loading component source...
          </p>
        ) : source === SOURCE_ERROR ? (
          <div
            role="status"
            className="flex items-center gap-3 p-6 text-sm text-home-fg-2"
          >
            Unable to load source.
            <button
              type="button"
              onClick={loadSource}
              className="cursor-pointer text-home-fg underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : source || usage ? (
          <DocsCode
            code={source ?? usage!}
            filename={registry ? `${registry}.tsx` : "demo.tsx"}
            embedded
          />
        ) : (
          <p className="p-6 text-sm text-home-fg-2">
            Source is not available for this component.
          </p>
        )}
      </div>
    </section>
  );
}
