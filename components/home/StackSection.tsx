import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import GlassAccent from "./GlassAccent";
import {
  BunLogo,
  MotionLogo,
  NpmLogo,
  PnpmLogo,
  ReactLogo,
  ShadcnLogo,
  TailwindLogo,
  TypeScriptLogo,
  YarnLogo,
} from "./StackLogos";
import { WRAP } from "./wrap";

type Tool = {
  name: string;
  logo: (props: { className?: string }) => ReactNode;
};

const BUILT_WITH: Tool[] = [
  { name: "React", logo: ReactLogo },
  { name: "Tailwind CSS", logo: TailwindLogo },
  { name: "Motion", logo: MotionLogo },
  { name: "TypeScript", logo: TypeScriptLogo },
];

const INSTALLS_WITH: Tool[] = [
  { name: "shadcn CLI", logo: ShadcnLogo },
  { name: "npm", logo: NpmLogo },
  { name: "pnpm", logo: PnpmLogo },
  { name: "yarn", logo: YarnLogo },
  { name: "bun", logo: BunLogo },
];

function ToolList({ label, tools }: { label: string; tools: Tool[] }) {
  return (
    <div>
      <p className="mb-4.5 text-[15px] text-home-fg-2">{label}</p>
      <ul className="flex flex-wrap gap-x-7.5 gap-y-4.5">
        {tools.map(({ name, logo: Logo }) => (
          <li
            key={name}
            className="flex items-center gap-2.5 text-[19px] font-bold tracking-tight text-home-fg-2"
          >
            <Logo className="shrink-0" />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StackSection() {
  return (
    <section aria-label="Stack" className={cn(WRAP, "py-18 md:py-32")}>
      <p className="max-w-[20em] text-balance text-[clamp(1.75rem,3.9vw,3rem)] font-bold leading-[1.12] tracking-[-0.035em]">
        Built on the stack you <GlassAccent>already</GlassAccent> ship.{" "}
        <span className="text-home-muted">
          React, Tailwind CSS and Motion, delivered by the shadcn CLI. Nothing
          new to learn.
        </span>
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10 md:mt-16">
        <ToolList label="Built with:" tools={BUILT_WITH} />
        <ToolList label="Installs with:" tools={INSTALLS_WITH} />
      </div>
    </section>
  );
}
