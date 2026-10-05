import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { components, installCommand } from "@/lib/components";
import { cn } from "@/lib/utils";
import HeroWord from "./HeroWord";
import HeroOrb from "./HeroOrb";
import { WRAP } from "./wrap";

const ORB = components.find((item) => item.registry === "matrix-orb");
const ORB_COMMAND = ORB ? installCommand(ORB) : null;

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-4"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function HomeHero() {
  const split = ORB_COMMAND ? ORB_COMMAND.lastIndexOf("/") + 1 : 0;

  return (
    <section className="pb-12 pt-12 sm:pt-20 md:pb-18 md:pt-26">
      <div
        className={cn(
          WRAP,
          "grid items-center gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.75fr)]",
        )}
      >
        <div className="flex min-w-0 flex-col gap-5.5">
          {ORB && (
            <Link
              href={ORB.href}
              className="inline-flex w-fit items-center gap-2.5 rounded-full border border-home-line-strong py-1 pl-1 pr-3 text-[13px] text-home-fg-2 transition-colors duration-150 hover:border-home-fg-2"
            >
              <span className="rounded-full bg-home-fg px-2.5 py-0.5 text-xs font-semibold text-home-bg">
                New
              </span>
              Matrix orb and Animated counter
            </Link>
          )}

          {/* fixed breaks keep the rotating word on its own line, so a longer word never reflows the rest */}
          <h1 className="text-[clamp(2.5rem,5.4vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.035em]">
            The foundation of
            <br />
            <HeroWord />
            <br />
            interfaces.
          </h1>

          <p className="max-w-[34rem] text-[clamp(1rem,1.5vw,1.1875rem)] leading-relaxed text-home-fg-2">
            <span className="font-bold text-home-fg underline decoration-home-fg/35 decoration-2 underline-offset-[5px]">
              {components.length}
            </span>{" "}
            animated React components, all free. Each one is a single file you
            own, built with Tailwind CSS and Motion and installed with the
            shadcn CLI.
          </p>

          <div className="mt-1.5 flex flex-wrap gap-3">
            {ORB_COMMAND && (
              <div className="flex h-11.5 min-w-0 max-w-full items-center gap-2.5 rounded-full border border-home-line-strong bg-home-raised pl-4 pr-1.5">
                <span
                  aria-hidden
                  className="font-mono text-[13px] text-home-muted"
                >
                  $
                </span>
                <code className="min-w-0 truncate font-mono text-[13px] text-home-fg-2">
                  {ORB_COMMAND.slice(0, split)}
                  <span className="text-home-fg">
                    {ORB_COMMAND.slice(split)}
                  </span>
                </code>
                <CopyButton
                  value={ORB_COMMAND}
                  label="Copy install command"
                  className="size-8.5 rounded-full text-home-fg-2 hover:bg-home-line hover:text-home-fg"
                />
              </div>
            )}

            <Link
              href="/components"
              className="inline-flex h-11.5 items-center gap-2 rounded-full bg-home-fg px-5 text-[15px] font-semibold text-home-bg transition-[background-color,transform] duration-150 hover:bg-home-fg/85 active:scale-[0.97]"
            >
              Browse all {components.length}
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <HeroOrb />
      </div>
    </section>
  );
}
