import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DocsInstallGuide from "@/components/docs/DocsInstallGuide";
import { READING_ORDER } from "@/components/docs/docs";

const description =
  "Set up a Next.js project with Tailwind CSS and shadcn, then add your first Mox UI component.";

export const metadata: Metadata = {
  title: "Installation",
  description,
  alternates: { canonical: "/docs/installation" },
  openGraph: {
    title: "Installation | Mox UI",
    description,
    url: "/docs/installation",
  },
};

const PAGER =
  "flex flex-col gap-1 rounded-[10px] border border-home-line px-4 py-3 text-sm transition-colors hover:border-home-line-strong hover:bg-home-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-fg motion-reduce:transition-none";

export default function InstallationPage() {
  const next = READING_ORDER[0];

  return (
    <article className="mx-auto w-full max-w-2xl pb-14">
      <header>
        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-home-fg">
          Installation
        </h1>
        <p className="mt-6 text-[14px] leading-7 text-home-fg-2 sm:text-[15px]">
          {description}
        </p>
      </header>

      <DocsInstallGuide />

      <nav
        aria-label="Documentation pagination"
        className="mt-12 grid gap-4 border-t border-home-line pt-8 sm:grid-cols-2"
      >
        <Link href="/docs/introduction" className={PAGER}>
          <span className="flex items-center gap-1 text-home-muted">
            <ChevronLeft aria-hidden="true" className="size-3.5" /> Previous
          </span>
          <span className="font-medium text-home-fg">Introduction</span>
        </Link>
        {next && (
          <Link href={next.href} className={`${PAGER} items-end text-right`}>
            <span className="flex items-center gap-1 text-home-muted">
              Next <ChevronRight aria-hidden="true" className="size-3.5" />
            </span>
            <span className="font-medium text-home-fg">{next.name}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
