"use client";

import { useState } from "react";
import { cleanDefault, type ComponentItem } from "@/lib/components";
import { cn } from "@/lib/utils";
import DocsCode from "./DocsCode";
import { componentName } from "./docs";

export function optionProps(item: ComponentItem) {
  return (item.props ?? []).filter((prop) => prop.options?.length);
}

export default function DocsOptions({ item }: { item: ComponentItem }) {
  const props = optionProps(item);
  const [picked, setPicked] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      props.map((prop) => [prop.name, cleanDefault(prop) ?? prop.options![0]]),
    ),
  );
  if (props.length === 0) return null;

  const name = componentName(item);
  const attributes = props
    .filter((prop) => picked[prop.name] !== cleanDefault(prop))
    .map((prop) => ` ${prop.name}="${picked[prop.name]}"`)
    .join("");

  return (
    <section
      id="options"
      aria-labelledby="options-title"
      className="mt-16 scroll-mt-24"
    >
      <h2
        id="options-title"
        className="text-[28px] font-bold tracking-[-0.025em]"
      >
        Options
      </h2>
      <p className="mt-2.5 text-[15px] leading-relaxed text-home-fg-2">
        Pick a value to see the prop you would pass. Defaults are left out.
      </p>

      <div className="mt-4.5 overflow-hidden rounded-[20px] border border-home-line bg-home-surface">
        <div className="flex flex-col gap-5 p-5">
          {props.map((prop) => (
            <div key={prop.name} className="flex flex-col gap-2.5">
              <span className="font-mono text-[12.5px] text-home-blue">
                {prop.name}
              </span>
              <div
                role="radiogroup"
                aria-label={prop.name}
                className="flex flex-wrap gap-2"
              >
                {prop.options!.map((option) => {
                  const active = picked[prop.name] === option;
                  const swatch = prop.optionColors?.[option];
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() =>
                        setPicked((current) => ({
                          ...current,
                          [prop.name]: option,
                        }))
                      }
                      className={cn(
                        "flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 font-mono text-[12.5px] transition-colors duration-150",
                        active
                          ? "border-home-blue/60 bg-home-blue/10 text-home-fg"
                          : "border-home-line-strong text-home-fg-2 hover:border-home-fg-2 hover:text-home-fg",
                      )}
                    >
                      {swatch && (
                        <span
                          aria-hidden="true"
                          className="size-3.5 rounded-full border border-black/10"
                          style={{ background: swatch }}
                        />
                      )}
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-home-line p-3.5">
          <DocsCode
            code={`<${name}${attributes} />`}
            filename="snippet.tsx"
            lineNumbers={false}
          />
        </div>
      </div>
    </section>
  );
}
