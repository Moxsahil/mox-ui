import { Fragment } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import DocsToc from "@/components/docs/DocsToc";
import HomeNav from "@/components/home/HomeNav";
import type { LegalSection } from "@/lib/legal";
import { cn } from "@/lib/utils";

const LINKABLE = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

const IS_LINK = /^(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)$/;

const DOCUMENTS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const TEXT = "text-[14px] leading-7 text-home-fg-2 sm:text-[15px]";
const LINK =
  "text-home-fg underline decoration-home-line-strong underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-fg";

const DATE = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

const formatDate = (iso: string) => DATE.format(new Date(iso));

const slug = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function linkify(text: string) {
  return text.split(LINKABLE).map((part, index) => {
    if (!IS_LINK.test(part)) return <Fragment key={index}>{part}</Fragment>;

    const trailing = part.endsWith(".") ? "." : "";
    const target = trailing ? part.slice(0, -1) : part;
    const href = target.includes("@") ? `mailto:${target}` : target;

    return (
      <Fragment key={index}>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className={LINK}
        >
          {target}
        </a>
        {trailing}
      </Fragment>
    );
  });
}

export default function LegalPage({
  title,
  href,
  stars,
  updated,
  intro,
  sections,
}: {
  title: string;
  href: string;
  stars?: number | null;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  const toc = sections.map((section) => ({
    id: slug(section.heading),
    label: section.heading,
  }));

  return (
    <div className="home flex min-h-svh flex-1 flex-col bg-home-bg font-runde text-home-fg">
      <HomeNav stars={stars} />

      {/* overflow-clip, not hidden: a scroll container would break the sticky toc */}
      <div className="relative z-10 flex flex-1 flex-col overflow-clip rounded-b-3xl bg-home-bg shadow-[0_40px_80px_-30px_rgba(9,9,11,0.35)] ring-1 ring-home-line sm:rounded-b-4xl dark:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="mx-auto flex w-full max-w-[74rem] flex-1 justify-center gap-10 px-4 sm:px-8">
          <main
            id="docs-content"
            className="w-full max-w-2xl min-w-0 pb-20 pt-12 md:pt-16"
          >
            <article>
              <header className="border-b border-home-line pb-10">
                <nav
                  aria-label="Legal documents"
                  className="inline-flex rounded-full border border-home-line bg-home-raised p-1 text-[13px]"
                >
                  {DOCUMENTS.map((document) => (
                    <Link
                      key={document.href}
                      href={document.href}
                      aria-current={document.href === href ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3 py-1 font-medium text-home-muted transition-colors duration-150 hover:text-home-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-fg motion-reduce:transition-none",
                        document.href === href &&
                          "bg-home-bg text-home-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-home-line",
                      )}
                    >
                      {document.label}
                    </Link>
                  ))}
                </nav>

                <h1 className="mt-8 text-4xl font-semibold tracking-[-0.035em] text-home-fg sm:text-[44px]">
                  {title}
                </h1>
                <p className={cn("mt-5", TEXT)}>{intro}</p>
                <p className="mt-5 text-[13px] text-home-muted">
                  Last updated{" "}
                  <time dateTime={updated}>{formatDate(updated)}</time>
                </p>
              </header>

              {sections.map((section, index) => (
                <section
                  key={section.heading}
                  id={toc[index].id}
                  aria-labelledby={`${toc[index].id}-heading`}
                  className={cn(
                    "scroll-mt-24 pt-10",
                    index > 0 && "mt-10 border-t border-home-line",
                  )}
                >
                  <h2
                    id={`${toc[index].id}-heading`}
                    className="text-[22px] font-semibold tracking-[-0.025em] text-home-fg"
                  >
                    {section.heading}
                  </h2>

                  {section.body && (
                    <div className={cn("mt-4 space-y-4", TEXT)}>
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{linkify(paragraph)}</p>
                      ))}
                    </div>
                  )}

                  {section.list && (
                    <ul className={cn("mt-4 list-disc space-y-3 pl-5", TEXT)}>
                      {section.list.map((item) => (
                        <li key={item} className="pl-1">
                          {linkify(item)}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>
          </main>

          <DocsToc title={title} sections={toc} contribute={false} />
        </div>
      </div>

      <Footer className="mt-3 [clip-path:inset(0_round_24px_24px_0_0)] sm:[clip-path:inset(0_round_32px_32px_0_0)]" />
    </div>
  );
}
