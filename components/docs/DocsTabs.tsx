"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function DocsTabs<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  panelId,
  className,
  tabClassName,
}: {
  id: string;
  label: string;
  value: T;
  options: readonly { id: T; label: string; icon?: ReactNode }[];
  onChange: (value: T) => void;
  panelId?: string;
  className?: string;
  tabClassName?: string;
}) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % options.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + options.length) % options.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = options.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(options[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("flex min-w-0 items-center gap-4", className)}
    >
      {options.map((option, index) => (
        <button
          key={option.id}
          ref={(element) => {
            tabs.current[index] = element;
          }}
          id={`${id}-${option.id}-tab`}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          aria-controls={panelId ?? `${id}-${option.id}-panel`}
          tabIndex={value === option.id ? 0 : -1}
          onKeyDown={(event) => move(event, index)}
          onClick={() => onChange(option.id)}
          className={cn(
            "relative inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 border-b border-transparent px-0.5 text-xs transition-colors duration-150 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-home-fg/50 focus-visible:ring-offset-2 focus-visible:ring-offset-home-bg motion-reduce:transition-none",
            value === option.id
              ? "border-current font-medium text-home-fg"
              : "text-home-muted hover:text-home-fg",
            tabClassName,
          )}
        >
          {option.icon && <span aria-hidden="true">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}
