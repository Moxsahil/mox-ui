"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import {
  installCommand,
  PACKAGE_MANAGERS,
  type ComponentItem,
  type PackageManager,
} from "@/lib/components";
import { cn } from "@/lib/utils";
import {
  fetchSource,
  SOURCE_LOADING,
} from "@/components/Description/fetchSource";
import DocsCode from "./DocsCode";
import { dependencyNames, sourcePath } from "./docs";

const ADD: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

const UTILS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

type Method = "cli" | "manual";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  mono = false,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
  mono?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex gap-0.5 rounded-xl border border-home-line bg-home-raised/40 p-0.75"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "h-7.5 cursor-pointer rounded-[9px] px-3 transition-colors duration-150",
            mono ? "font-mono text-xs" : "text-[13.5px] font-medium",
            value === option.id
              ? "bg-home-raised text-home-fg"
              : "text-home-muted hover:text-home-fg",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function TerminalLine({
  command,
  large = false,
}: {
  command: string;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "dark flex items-center gap-2.5 rounded-2xl border border-white/8 bg-[#0C0C0F] pl-4.5 pr-2",
        large ? "min-h-14" : "min-h-12",
      )}
    >
      <span aria-hidden="true" className="font-mono text-sm text-[#8EB2FF]">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13.5px] text-[#E4E4E7] scrollbar-none">
        {command}
      </code>
      <CopyButton
        value={command}
        label="Copy command"
        className="size-9 rounded-xl text-[#A1A1AA] hover:bg-white/6 hover:text-white"
      />
    </div>
  );
}

export default function DocsInstall({
  item,
  pm,
  onPmChange,
}: {
  item: ComponentItem;
  pm: PackageManager;
  onPmChange: (pm: PackageManager) => void;
}) {
  const [method, setMethod] = useState<Method>("cli");
  const [source, setSource] = useState<string | null>(null);
  const command = installCommand(item, pm);
  if (!command || !item.registry) return null;

  const registry = item.registry;
  const deps = [...dependencyNames(item), "clsx", "tailwind-merge"];

  const choose = async (next: Method) => {
    setMethod(next);
    if (next !== "manual" || source) return;
    setSource(SOURCE_LOADING);
    setSource(await fetchSource(registry));
  };

  const steps = [
    {
      title: "Install the dependencies",
      text: dependencyNames(item).length
        ? "The component needs these packages, plus the two behind the cn helper."
        : "The component needs nothing extra. These two power the cn helper.",
      body: <TerminalLine command={`${ADD[pm]} ${deps.join(" ")}`} />,
    },
    {
      title: "Add the cn helper",
      text: "Skip this if your project already has it from shadcn.",
      body: <DocsCode code={UTILS} filename="lib/utils.ts" />,
    },
    {
      title: "Copy the source",
      text: "Paste the whole file into your components folder.",
      body: (
        <DocsCode
          code={source ?? SOURCE_LOADING}
          filename={sourcePath(item)}
          peek={16}
        />
      ),
    },
    {
      title: "Update the imports",
      text: "Point @/lib/utils at your cn helper if your path aliases differ.",
    },
  ];

  return (
    <section
      id="installation"
      aria-labelledby="installation-title"
      className="mt-16 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <h2
          id="installation-title"
          className="text-[28px] font-bold tracking-[-0.025em]"
        >
          Installation
        </h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <Segmented
            label="Install method"
            value={method}
            onChange={choose}
            options={[
              { id: "cli", label: "CLI" },
              { id: "manual", label: "Manual" },
            ]}
          />
          <Segmented
            label="Package manager"
            value={pm}
            onChange={onPmChange}
            mono
            options={PACKAGE_MANAGERS.map((id) => ({ id, label: id }))}
          />
        </div>
      </div>

      {method === "cli" ? (
        <div className="mt-4.5 flex flex-col gap-3">
          <TerminalLine command={command} large />
          <p className="text-sm leading-relaxed text-home-fg-2">
            Adds{" "}
            <code className="font-mono text-home-fg">{sourcePath(item)}</code>,
            and <code className="font-mono text-home-fg">lib/utils.ts</code> if
            your project does not have it yet. Needs shadcn 4.16 or newer, which{" "}
            <code className="font-mono text-home-fg">@latest</code> guarantees.
          </p>
        </div>
      ) : (
        <ol className="mt-5.5 flex flex-col">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4.5 pb-7.5">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-3.75 top-8.5 w-px bg-home-line-strong"
                />
              )}
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-home-line-strong bg-home-raised font-mono text-[13px]">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
                <h3 className="text-[16.5px] font-semibold">{step.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-home-fg-2">
                  {step.text}
                </p>
                {step.body}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
