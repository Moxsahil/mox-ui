"use client";

import { useState } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import CopyButton from "@/components/CopyButton";
import { cn } from "@/lib/utils";

// code stays on a dark surface in both themes, so one palette covers it and the root carries .dark
const THEME: PrismTheme = {
  plain: { color: "#E4E4E7", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype"],
      style: { color: "#71717A", fontStyle: "italic" },
    },
    { types: ["keyword", "builtin", "important"], style: { color: "#8EB2FF" } },
    {
      types: ["string", "attr-value", "template-string", "char"],
      style: { color: "#E9C46A" },
    },
    { types: ["number", "boolean", "constant"], style: { color: "#F0A27A" } },
    {
      types: ["tag", "class-name", "maybe-class-name"],
      style: { color: "#7DD3FC" },
    },
    { types: ["function"], style: { color: "#C4B5FD" } },
    { types: ["attr-name", "property"], style: { color: "#BFDBFE" } },
    { types: ["punctuation", "operator"], style: { color: "#A1A1AA" } },
  ],
};

export default function DocsCode({
  code,
  filename,
  language = "tsx",
  lineNumbers = true,
  peek,
  note,
  className,
}: {
  code: string;
  filename?: string;
  language?: string;
  lineNumbers?: boolean;
  peek?: number;
  note?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const lines = code.replace(/\n+$/, "").split("\n");
  const total = lines.length;
  const collapsible = peek !== undefined && total > peek;
  const collapsed = collapsible && !expanded;
  const shown = (collapsed ? lines.slice(0, peek) : lines).join("\n");

  return (
    <div
      className={cn(
        "dark overflow-hidden rounded-2xl border border-white/8 bg-[#0C0C0F] text-[#E4E4E7]",
        className,
      )}
    >
      <div className="flex min-h-10.5 items-center justify-between gap-3 border-b border-white/6 pl-3.5 pr-2">
        <span className="truncate font-mono text-xs text-[#A1A1AA]">
          {filename ?? language}
        </span>
        <CopyButton
          value={code}
          label={filename ? `Copy ${filename}` : "Copy code"}
          className="size-8 rounded-lg text-[#A1A1AA] hover:bg-white/6 hover:text-white"
        />
      </div>

      <div
        className={cn(
          "relative overflow-x-auto py-3.5 font-mono text-[13px] leading-[1.75]",
          expanded && "max-h-160 overflow-y-auto",
        )}
      >
        <Highlight code={shown} language={language} theme={THEME}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="min-w-max">
              {tokens.map((line, index) => {
                const lineProps = getLineProps({ line });
                return (
                  <div
                    key={index}
                    {...lineProps}
                    className={cn(lineProps.className, "flex pr-6")}
                  >
                    {lineNumbers && (
                      <span
                        aria-hidden="true"
                        className="w-12 shrink-0 select-none pr-4.5 text-right text-[#52525B]"
                      >
                        {index + 1}
                      </span>
                    )}
                    <span className={cn(!lineNumbers && "pl-4")}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
        {collapsed && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-22 bg-linear-to-b from-transparent to-[#0C0C0F]"
          />
        )}
      </div>

      {collapsible && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/6 px-3.5 py-2.5">
          <span className="text-[12.5px] text-[#8B8B93]">
            {note ?? `${total} lines`}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="h-8 cursor-pointer rounded-[9px] border border-white/12 px-3 text-[13px] text-white transition-colors duration-150 hover:border-white/25"
          >
            {expanded ? "Collapse" : `Show all ${total} lines`}
          </button>
        </div>
      )}
    </div>
  );
}
