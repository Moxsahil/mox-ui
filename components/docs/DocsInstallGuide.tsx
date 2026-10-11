"use client";

import { useState, type ReactNode } from "react";
import {
  REGISTRY_REPO,
  shadcnCommand,
  type PackageManager,
} from "@/lib/components";
import DocsCode from "./DocsCode";
import { TerminalLine } from "./DocsInstall";

const CREATE: Record<PackageManager, string> = {
  npm: "npx create-next-app@latest my-app",
  pnpm: "pnpm create next-app my-app",
  yarn: "yarn create next-app my-app",
  bun: "bun create next-app my-app",
};

const DEV: Record<PackageManager, string> = {
  npm: "npm run dev",
  pnpm: "pnpm dev",
  yarn: "yarn dev",
  bun: "bun dev",
};

const PROMPTS = `What is your project named? my-app
Would you like to use the recommended Next.js defaults?
    Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md
    No, reuse previous settings
    No, customize settings - Choose your own preferences`;

const PAGE = `import FluidOrb from "@/components/ui/fluid-orb"

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <FluidOrb size={280} color="#F75001" />
    </main>
  )
}`;

const TEXT = "text-[14px] leading-7 text-home-fg-2 sm:text-[15px]";

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-[13px] text-home-fg">{children}</code>;
}

export default function DocsInstallGuide() {
  const [pm, setPm] = useState<PackageManager>("pnpm");
  const terminal = (command: string) => (
    <TerminalLine command={command} pm={pm} onPmChange={setPm} />
  );

  const steps = [
    {
      id: "create-project",
      title: "Create a Next.js project",
      text: (
        <>
          Start a new app with <Code>create-next-app</Code>. Already have a
          React project with Tailwind CSS v4? Skip to step 3.
        </>
      ),
      body: terminal(CREATE[pm]),
    },
    {
      id: "project-options",
      title: "Use the recommended defaults",
      text: (
        <>
          Choose the first option. It sets up TypeScript, Tailwind CSS v4, and
          the App Router, which is everything Mox UI needs.
        </>
      ),
      body: <DocsCode code={PROMPTS} filename="Terminal" language="txt" />,
    },
    {
      id: "set-up-shadcn",
      title: "Set up shadcn",
      text: (
        <>
          Move into the project and run <Code>shadcn init</Code>. It adds the
          theme variables the components use, the <Code>cn</Code> helper in{" "}
          <Code>lib/utils.ts</Code>, and a <Code>components.json</Code> file
          that tells the CLI where components go.
        </>
      ),
      body: terminal(`cd my-app && ${shadcnCommand("init", pm)}`),
    },
    {
      id: "add-component",
      title: "Add a component",
      text: (
        <>
          Install fluid orb from the registry. The CLI copies its source to{" "}
          <Code>components/ui/fluid-orb.tsx</Code> and installs any packages it
          needs.
        </>
      ),
      body: terminal(shadcnCommand(`add ${REGISTRY_REPO}/fluid-orb`, pm)),
    },
    {
      id: "use-component",
      title: "Use it in a page",
      text: (
        <>
          Import the component and render it. Every component page has a usage
          example and the full list of props.
        </>
      ),
      body: <DocsCode code={PAGE} filename="app/page.tsx" />,
    },
    {
      id: "start-server",
      title: "Start the development server",
      text: (
        <>
          Run the app and open <Code>localhost:3000</Code> to see the orb.
        </>
      ),
      body: terminal(DEV[pm]),
    },
  ];

  return (
    <ol className="mt-10 flex flex-col">
      {steps.map((step, index) => (
        <li
          key={step.id}
          id={step.id}
          className="relative flex scroll-mt-24 gap-4 pb-12 last:pb-0"
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
          <div className="flex min-w-0 flex-1 flex-col gap-4 pt-0.5">
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-home-fg">
                {step.title}
              </h2>
              <p className={`mt-1.5 ${TEXT}`}>{step.text}</p>
            </div>
            {step.body}
          </div>
        </li>
      ))}
    </ol>
  );
}
