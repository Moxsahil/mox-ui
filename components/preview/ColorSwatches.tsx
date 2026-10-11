"use client";

import { usePathname } from "next/navigation";
import { activeComponent, cleanDefault, swatchProp } from "@/lib/components";
import { usePreviewControl } from "./PreviewControls";
import PreviewPanel from "./PreviewPanel";

export default function ColorSwatches({
  showLabel = false,
}: {
  showLabel?: boolean;
}) {
  const pathname = usePathname();
  const prop = swatchProp(activeComponent(pathname));

  const options = prop?.options ?? [];
  const [value, setValue] = usePreviewControl(
    prop?.name ?? "",
    cleanDefault(prop) ?? options[0] ?? "",
  );

  if (!prop || !prop.optionColors || options.length === 0) return null;

  return (
    <PreviewPanel inline className="gap-2.5 rounded-2xl px-3 py-2.5">
      {showLabel && (
        <span className="mr-0.5 text-xs font-medium text-foreground/55">
          {prop.name}
        </span>
      )}
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setValue(option)}
            aria-label={`Set ${prop.name} to ${option}`}
            aria-pressed={selected}
            title={option}
            className={`h-7 w-7 cursor-pointer rounded-xl shadow-xl transition-transform duration-150  ${
              selected
                ? "ring-2 ring-neutral-700 ring-offset-1 ring-offset-background"
                : ""
            }`}
            style={{ backgroundColor: prop.optionColors![option] }}
          />
        );
      })}
    </PreviewPanel>
  );
}
