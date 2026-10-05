import Link from "next/link";
import { GithubLogo } from "@/components/logos";
import { components } from "@/lib/components";
import { SITE_GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import GlassAccent from "./GlassAccent";
import { WRAP } from "./wrap";

export default function HomeCta() {
  // the last section sits above the footer and lifts off it like a curtain
  return (
    <section className="relative z-10 rounded-b-3xl bg-home-bg shadow-[0_40px_80px_-30px_rgba(9,9,11,0.35)] sm:rounded-b-[32px] dark:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
      <div
        className={cn(WRAP, "flex flex-col items-start gap-6.5 py-24 md:py-36")}
      >
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-home-muted">
          {components.length} components, free and open source
        </span>

        <h2 className="max-w-[13em] text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.035em]">
          Crafted for <GlassAccent>developers</GlassAccent>.
          <br />
          Ready for your next build.
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/components"
            className="inline-flex h-11.5 items-center rounded-full bg-home-fg px-5 text-[15px] font-semibold text-home-bg transition-[background-color,transform] duration-150 hover:bg-home-fg/85 active:scale-[0.97]"
          >
            Browse components
          </Link>
          {SITE_GITHUB_URL && (
            <a
              href={SITE_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11.5 items-center gap-2 rounded-full border border-home-line-strong px-5 text-[15px] font-semibold transition-[border-color,transform] duration-150 hover:border-home-fg-2 active:scale-[0.97]"
            >
              <GithubLogo className="size-4" />
              Star on GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
