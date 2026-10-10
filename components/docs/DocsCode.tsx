"use client";

import { useId, useState } from "react";
import { Terminal } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import CopyButton from "@/components/CopyButton";
import { cn } from "@/lib/utils";

const THEME: PrismTheme = {
  plain: { color: "var(--home-fg)", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype"],
      style: { color: "var(--home-muted)", fontStyle: "italic" },
    },
    {
      types: ["keyword", "builtin", "important"],
      style: { color: "var(--code-keyword)" },
    },
    {
      types: ["string", "attr-value", "template-string", "char"],
      style: { color: "var(--code-string)" },
    },
    {
      types: ["number", "boolean", "constant"],
      style: { color: "var(--code-number)" },
    },
    {
      types: ["tag", "class-name", "maybe-class-name", "function"],
      style: { color: "var(--code-function)" },
    },
    {
      types: ["attr-name", "property"],
      style: { color: "var(--code-keyword)" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "var(--home-fg-2)" },
    },
  ],
};

export default function DocsCode({
  code,
  filename,
  language = "tsx",
  lineNumbers = false,
  peek,
  note,
  embedded = false,
  className,
}: {
  code: string;
  filename?: string;
  language?: string;
  lineNumbers?: boolean;
  peek?: number;
  note?: string;
  embedded?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const lines = code.replace(/\n+$/, "").split("\n");
  const total = lines.length;
  const collapsible = peek !== undefined && total > peek;
  const collapsed = collapsible && !expanded;
  const shown = (collapsed ? lines.slice(0, peek) : lines).join("\n");

  return (
    <div
      className={cn(
        "overflow-hidden bg-home-bg text-home-fg [--code-function:#9a3412] [--code-keyword:#1d4ed8] [--code-number:#a16207] [--code-string:#0f766e] dark:[--code-function:#fdba74] dark:[--code-keyword:#93c5fd] dark:[--code-number:#fcd34d] dark:[--code-string:#5eead4]",
        !embedded && "rounded-[10px] border border-home-line",
        className,
      )}
    >
      <div className="flex h-8.5 items-center justify-between gap-3 border-b border-home-line bg-home-surface pl-4 pr-2">
        <span className="flex min-w-0 items-center gap-2 text-xs text-home-muted">
          <Terminal aria-hidden="true" className="size-3 shrink-0" />
          <span className="truncate">{filename ?? language}</span>
        </span>
        <CopyButton
          value={code}
          label={filename ? `Copy ${filename}` : "Copy code"}
          className="size-7 rounded-md text-home-muted hover:bg-home-raised hover:text-home-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-fg"
        />
      </div>

      <div
        id={id}
        role="region"
        aria-label={filename ? `${filename} source code` : "Source code"}
        tabIndex={0}
        className={cn(
          "relative overflow-x-auto py-4 font-mono text-[13px] leading-[1.65] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-home-fg/50",
          expanded && "max-h-160 overflow-y-auto",
        )}
      >
        <Highlight code={shown} language={language} theme={THEME}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="min-w-max">
              <code>
                {tokens.map((line, index) => {
                  const lineProps = getLineProps({ line });
                  return (
                    <span
                      key={index}
                      {...lineProps}
                      className={cn(lineProps.className, "flex pr-4")}
                    >
                      {lineNumbers && (
                        <span
                          aria-hidden="true"
                          className="w-12 shrink-0 select-none pr-4 text-right text-home-muted"
                        >
                          {index + 1}
                        </span>
                      )}
                      <span className={cn(!lineNumbers && "pl-4")}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </span>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
        {collapsed && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-home-bg"
          />
        )}
      </div>

      {collapsible && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-home-line px-4 py-2">
          <span className="text-xs text-home-muted">
            {note ?? `${total} lines`}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={id}
            className="h-7 cursor-pointer rounded-md border border-home-line-strong px-2.5 text-xs text-home-fg transition-colors duration-150 hover:bg-home-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-fg motion-reduce:transition-none"
          >
            {expanded ? "Collapse" : `Show all ${total} lines`}
          </button>
        </div>
      )}
    </div>
  );
}
