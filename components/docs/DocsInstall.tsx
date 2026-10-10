"use client";

import { useEffect, useId, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { LOGOS } from "@/components/logos";
import {
  installCommand,
  PACKAGE_MANAGERS,
  type ComponentItem,
  type PackageManager,
} from "@/lib/components";
import { cn } from "@/lib/utils";
import {
  fetchSource,
  SOURCE_ERROR,
} from "@/components/Description/fetchSource";
import DocsCode from "./DocsCode";
import DocsTabs from "./DocsTabs";
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

const METHOD_OPTIONS = [
  { id: "cli", label: "CLI" },
  { id: "manual", label: "Manual" },
] as const;

const PACKAGE_OPTIONS = PACKAGE_MANAGERS.map((id) => {
  const Logo = LOGOS[id];
  return { id, label: id, icon: <Logo className="size-3" /> };
});

type Method = (typeof METHOD_OPTIONS)[number]["id"];

export function TerminalLine({
  command,
  large = false,
  pm,
  onPmChange,
}: {
  command: string;
  large?: boolean;
  pm?: PackageManager;
  onPmChange?: (pm: PackageManager) => void;
}) {
  const id = useId();
  return (
    <div className="overflow-hidden rounded-[10px] border border-home-line bg-home-bg">
      <div className="flex h-8.5 items-center justify-between gap-2 border-b border-home-line bg-home-surface pl-3.5 pr-2">
        {pm && onPmChange ? (
          <DocsTabs
            id={id}
            panelId={`${id}-command-panel`}
            label="Package manager"
            value={pm}
            onChange={onPmChange}
            options={PACKAGE_OPTIONS}
            className="gap-3 overflow-x-auto"
            tabClassName="h-8.5 text-[11px]"
          />
        ) : (
          <span className="text-xs text-home-muted">Terminal</span>
        )}
        <CopyButton
          value={command}
          label="Copy command"
          className="size-7 rounded-md text-home-muted hover:bg-home-raised hover:text-home-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-fg"
        />
      </div>
      <div
        id={pm && onPmChange ? `${id}-command-panel` : undefined}
        role={pm && onPmChange ? "tabpanel" : undefined}
        aria-labelledby={pm && onPmChange ? `${id}-${pm}-tab` : undefined}
        tabIndex={0}
        className={cn(
          "flex items-center overflow-x-auto px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-home-fg/50",
          large ? "min-h-14" : "min-h-12",
        )}
      >
        <code className="whitespace-nowrap font-mono text-[13px] text-home-fg">
          {command}
        </code>
      </div>
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
  const [method, setMethod] = useState<Method>("manual");
  const [source, setSource] = useState<{
    registry: string;
    code: string;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const id = useId();
  const registry = item.registry;
  const command = installCommand(item, pm);

  useEffect(() => {
    if (!registry) return;
    let cancelled = false;
    void fetchSource(registry).then((code) => {
      if (!cancelled) setSource({ registry, code });
    });
    return () => {
      cancelled = true;
    };
  }, [registry, attempt]);

  if (!command || !registry) return null;

  const code = source?.registry === registry ? source.code : null;
  const deps = [
    ...new Set([...dependencyNames(item), "clsx", "tailwind-merge"]),
  ];
  const steps = [
    {
      title: "Install the packages",
      body: (
        <TerminalLine
          command={`${ADD[pm]} ${deps.join(" ")}`}
          pm={pm}
          onPmChange={onPmChange}
        />
      ),
    },
    {
      title: "Add the utility file",
      body: <DocsCode code={UTILS} filename="lib/utils.ts" language="ts" />,
    },
    {
      title: "Copy and paste the code into your project",
      body:
        code === SOURCE_ERROR ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-home-line p-4">
            <p role="status" className="text-sm text-home-muted">
              Unable to load the component source.
            </p>
            <button
              type="button"
              onClick={() => {
                setSource(null);
                setAttempt((value) => value + 1);
              }}
              className="cursor-pointer rounded-md border border-home-line-strong px-3 py-1.5 text-xs hover:bg-home-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-fg"
            >
              Try again
            </button>
          </div>
        ) : code === null ? (
          <div
            role="status"
            className="rounded-[10px] border border-home-line p-4 text-sm text-home-muted"
          >
            Loading source…
          </div>
        ) : (
          <DocsCode code={code} filename={sourcePath(item)} />
        ),
    },
    {
      title: "Update the import paths to match your project",
      body: (
        <p className="text-[13px] leading-relaxed text-home-muted">
          Point <code className="font-mono text-home-fg">@/lib/utils</code> to
          your utility file if your path aliases differ.
        </p>
      ),
    },
  ];

  return (
    <section
      id="installation"
      aria-labelledby="installation-title"
      className="mt-12 scroll-mt-24"
    >
      <h2
        id="installation-title"
        className="text-[22px] font-semibold tracking-[-0.025em]"
      >
        Installation
      </h2>
      <DocsTabs
        id={id}
        label="Installation method"
        value={method}
        onChange={setMethod}
        options={METHOD_OPTIONS}
        className="mt-6 border-b border-home-line px-1.5"
      />

      <div
        id={`${id}-cli-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-cli-tab`}
        hidden={method !== "cli"}
        className="pt-8 outline-none focus-visible:ring-2 focus-visible:ring-home-fg/50"
        tabIndex={0}
      >
        <TerminalLine command={command} pm={pm} onPmChange={onPmChange} large />
        <p className="mt-3 text-[13px] leading-relaxed text-home-muted">
          Run this command from your project directory to add the component and
          its dependencies.
        </p>
      </div>

      <div
        id={`${id}-manual-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-manual-tab`}
        hidden={method !== "manual"}
        className="pt-8 outline-none focus-visible:ring-2 focus-visible:ring-home-fg/50"
        tabIndex={0}
      >
        <ol className="flex flex-col">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex gap-3 pb-10 last:pb-0"
            >
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-3.5 top-7 w-px bg-home-line"
                />
              )}
              <span className="relative flex size-7 shrink-0 items-center justify-center rounded-[5px] border border-home-line bg-home-surface text-xs font-medium">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
                <h3 className="text-sm font-medium">{step.title}</h3>
                {step.body}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
