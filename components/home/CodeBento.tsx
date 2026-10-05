"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import AnimatedCounter from "@/components/ui/animated-counter";
import CodeBlock from "@/components/ui/code-block";
import { DeleteButton } from "@/components/ui/delete-button";
import { cn } from "@/lib/utils";
import { MoxMark } from "@/components/MoxLogo";

type View = "preview" | "code";

const VIEWS: { value: View; label: string }[] = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
];

const COUNTER_START = 12_480;
const COUNTER_MAX = 9_999_999;
const STEPS = [
  { label: "−100", delta: -100 },
  { label: "+1", delta: 1 },
  { label: "+1,000", delta: 1000 },
];

const DOTS =
  "bg-[radial-gradient(var(--home-line-strong)_1px,transparent_1.4px)] bg-size-[16px_16px]";

const SHEET =
  "absolute inset-0 flex flex-col overflow-hidden rounded-[14px] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

const BEHIND =
  "pointer-events-none z-1 translate-x-4 -translate-y-4.5 scale-95 opacity-50";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7.5 w-fit items-center rounded-full border border-home-line bg-home-raised px-3.5 text-[13px] text-home-fg">
      {children}
    </span>
  );
}

export default function CodeBento({ usage }: { usage: string }) {
  const [view, setView] = useState<View>("preview");
  const [value, setValue] = useState(COUNTER_START);
  const reduce = useReducedMotion();

  const nudge = (next: number) =>
    setValue(Math.min(COUNTER_MAX, Math.max(0, next)));
  // spread across magnitudes so places come and go
  const shuffle = () => nudge(Math.round(10 ** (1 + Math.random() * 5)));

  return (
    <div className="mt-5 grid overflow-hidden rounded-[22px] border border-home-line-strong bg-home-surface lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <article className="flex min-w-0 flex-col gap-5.5 p-5.5 sm:p-9">
        <div className="flex min-h-[350px] flex-col">
          <div
            role="tablist"
            aria-label="Delete button view"
            className="flex w-fit gap-0.5 rounded-full border border-home-line bg-home-raised p-1"
          >
            {VIEWS.map((option) => {
              const selected = view === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  id={`bento-tab-${option.value}`}
                  aria-controls={`bento-sheet-${option.value}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setView(option.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                      return;
                    event.preventDefault();
                    setView(view === "preview" ? "code" : "preview");
                  }}
                  className="relative h-7.5 cursor-pointer rounded-full px-3.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-home-fg/40"
                >
                  {selected && (
                    <motion.span
                      layoutId="bento-view"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      className="absolute inset-0 rounded-full bg-home-line-strong"
                    />
                  )}
                  <span
                    className={cn(
                      "relative transition-colors duration-200",
                      selected ? "text-home-fg" : "text-home-muted",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-7 min-h-[290px] flex-1">
            <div
              id="bento-sheet-code"
              role="tabpanel"
              aria-labelledby="bento-tab-code"
              inert={view !== "code"}
              className={cn(SHEET, view === "code" ? "z-2" : BEHIND)}
            >
              <CodeBlock
                code={usage}
                language="tsx"
                filename="demo.tsx"
                accent="#71717A"
                showLineNumbers
                className="h-full"
              />
            </div>

            <div
              id="bento-sheet-preview"
              role="tabpanel"
              aria-labelledby="bento-tab-preview"
              inert={view !== "preview"}
              className={cn(
                SHEET,
                "border border-home-line-strong bg-home-raised",
                view === "preview" ? "z-2" : BEHIND,
              )}
            >
              <div className="flex h-10.5 shrink-0 items-center gap-2.5 border-b border-home-line px-3.5 text-[13px] font-semibold">
                <MoxMark className="size-4" />
                Delete button
                <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-home-muted">
                  <span className="size-1.5 rounded-full bg-[#3DBE6A]" />
                  Live
                </span>
              </div>
              <div
                className={cn("relative grid flex-1 place-items-center", DOTS)}
              >
                <DeleteButton />
                <p className="absolute inset-x-0 bottom-3.5 text-center text-xs text-home-muted">
                  Click the bin. Escape backs out.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[21px] font-bold tracking-[-0.025em]">
            Real code, ready to ship
          </h3>
          <p className="mt-1.5 max-w-[30rem] text-[15px] text-home-fg-2">
            React and Tailwind with shadcn conventions:{" "}
            <code className="font-mono text-[13px] text-home-fg">cn()</code>{" "}
            merges your classes, other props spread onto the root, and{" "}
            <code className="font-mono text-[13px] text-home-fg">
              data-slot
            </code>{" "}
            marks it.
          </p>
        </div>
      </article>

      <article className="flex min-w-0 flex-col gap-5.5 border-t border-home-line p-5.5 sm:p-9 lg:border-l lg:border-t-0">
        <div className="flex min-h-[350px] flex-col">
          <Pill>Animated counter</Pill>

          <div className="mt-7 flex flex-1 flex-col gap-4">
            <div
              className={cn(
                "grid min-h-[200px] flex-1 place-items-center rounded-[14px] border border-home-line",
                DOTS,
              )}
            >
              <AnimatedCounter
                value={value}
                className="text-[clamp(3rem,6.4vw,4.75rem)] font-bold tracking-tight text-home-fg"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <code className="min-w-0 font-mono text-[13px] text-home-fg-2 wrap-anywhere">
                &lt;
                <span className="text-home-accent-ink">
                  AnimatedCounter
                </span>{" "}
                value=&#123;{value}&#125; /&gt;
              </code>
              <div className="flex flex-wrap gap-1.5">
                {STEPS.map((step) => (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => nudge(value + step.delta)}
                    className="h-8 cursor-pointer rounded-[9px] border border-home-line-strong px-3 font-mono text-xs text-home-fg-2 transition-[color,border-color,transform] duration-150 hover:border-home-fg-2 hover:text-home-fg active:scale-95"
                  >
                    {step.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={shuffle}
                  className="h-8 cursor-pointer rounded-[9px] border border-home-line-strong px-3 font-mono text-xs text-home-fg-2 transition-[color,border-color,transform] duration-150 hover:border-home-fg-2 hover:text-home-fg active:scale-95"
                >
                  Random
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[21px] font-bold tracking-[-0.025em]">
            Every prop, live
          </h3>
          <p className="mt-1.5 max-w-[30rem] text-[15px] text-home-fg-2">
            Docs pages come with live controls, so you can feel a component
            before you install it.
          </p>
        </div>
      </article>
    </div>
  );
}
