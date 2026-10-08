"use client";

import { PACKAGE_MANAGERS, type PackageManager } from "@/lib/components";
import { cn } from "@/lib/utils";

export default function PackageManagerSwitch({
  value,
  onChange,
}: {
  value: PackageManager;
  onChange: (value: PackageManager) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[13px] text-home-muted">Copy for</span>
      <div
        role="radiogroup"
        aria-label="Package manager"
        className="flex gap-0.5 rounded-xl border border-home-line bg-home-raised/40 p-0.75"
      >
        {PACKAGE_MANAGERS.map((manager) => (
          <button
            key={manager}
            type="button"
            role="radio"
            aria-checked={value === manager}
            onClick={() => onChange(manager)}
            className={cn(
              "h-7.5 cursor-pointer rounded-[9px] px-2.75 font-mono text-xs transition-colors duration-150",
              value === manager
                ? "bg-home-raised text-home-fg"
                : "text-home-muted hover:text-home-fg",
            )}
          >
            {manager}
          </button>
        ))}
      </div>
    </div>
  );
}
