import Link from "next/link";
import { GithubLogo } from "@/components/logos";
import { MoxMark } from "@/components/MoxLogo";
import { SITE_GITHUB_URL, SITE_NAME } from "@/lib/site";

export default function DocsFooter() {
  return (
    <footer className="border-t border-home-line bg-home-bg px-5 pb-6 pt-8 text-sm">
      <div className="flex flex-col gap-8 pb-8 sm:flex-row sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <MoxMark className="size-6" />
            {SITE_NAME}
          </Link>
          <p className="mt-3 max-w-64 text-home-muted">
            Animated React components. Copy, paste, and make them yours.
          </p>
          <a
            href={SITE_GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`${SITE_NAME} on GitHub`}
            className="mt-5 flex size-8 items-center justify-center rounded-lg border border-home-line bg-home-raised text-home-muted hover:text-home-fg"
          >
            <GithubLogo className="size-4" />
          </a>
        </div>
        <div className="flex gap-12 sm:gap-16">
          <nav
            aria-label="Explore"
            className="flex flex-col gap-3 text-home-muted"
          >
            <h2 className="mb-1 font-medium text-home-fg">Explore</h2>
            <Link href="/components" className="hover:text-home-fg">
              Components
            </Link>
            <Link href="/templates" className="hover:text-home-fg">
              Templates
            </Link>
            <Link
              href="/components?view=overview"
              className="hover:text-home-fg"
            >
              Component gallery
            </Link>
          </nav>
          <nav
            aria-label="Resources"
            className="flex flex-col gap-3 text-home-muted"
          >
            <h2 className="mb-1 font-medium text-home-fg">Resources</h2>
            <a href="/llms.txt" className="hover:text-home-fg">
              llms.txt
            </a>
            <a
              href={`${SITE_GITHUB_URL}/issues`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-home-fg"
            >
              Support
            </a>
            <a
              href={SITE_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-home-fg"
            >
              Source code
            </a>
          </nav>
        </div>
      </div>
      <div className="border-t border-dashed border-home-line pt-5 text-xs text-home-muted">
        Built with React, Tailwind CSS, and Motion.
      </div>
    </footer>
  );
}
