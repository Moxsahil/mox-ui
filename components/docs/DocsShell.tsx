"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrowseFrame from "@/components/browse/BrowseFrame";
import { ChevronIcon } from "@/components/browse/icons";
import CopyButton from "@/components/CopyButton";
import {
  activeComponent,
  CATEGORY_LABELS,
  PANEL_INFO,
  type PackageManager,
} from "@/lib/components";
import DocsActions from "./DocsActions";
import DocsCode from "./DocsCode";
import DocsInstall from "./DocsInstall";
import DocsOptions, { optionProps } from "./DocsOptions";
import DocsPreview from "./DocsPreview";
import DocsSidebar from "./DocsSidebar";
import DocsToc, { type TocSection } from "./DocsToc";
import { dependencyNames, neighbours } from "./docs";

const H2 = "text-[28px] font-bold tracking-[-0.025em]";
const NAV =
  "flex size-9 items-center justify-center rounded-full border border-home-line-strong text-home-fg-2 transition-colors duration-150 hover:border-home-fg-2 hover:text-home-fg";

export default function DocsShell({
  stars,
  children,
}: {
  stars?: number | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const item = activeComponent(pathname);
  const [pm, setPm] = useState<PackageManager>("npm");
  const sidebar = <DocsSidebar current={item} />;

  if (!item) {
    return (
      <BrowseFrame
        crumbs={[
          { label: "Components", href: "/components" },
          { label: "Preview" },
        ]}
        sidebar={sidebar}
        stars={stars}
      >
        <div className="h-[clamp(26rem,75svh,48rem)] overflow-hidden rounded-3xl bg-card">
          {children}
        </div>
      </BrowseFrame>
    );
  }

  const { previous, next } = neighbours(item);
  const deps = dependencyNames(item);
  const sections: TocSection[] = [{ id: "preview", label: "Preview" }];
  if (item.registry)
    sections.push({ id: "installation", label: "Installation" });
  if (item.usage) sections.push({ id: "usage", label: "Usage" });
  if (optionProps(item).length)
    sections.push({ id: "options", label: "Options" });
  if (item.props?.length) sections.push({ id: "api", label: "API reference" });
  if (item.interaction)
    sections.push({ id: "interaction", label: "Interaction" });
  sections.push({ id: "credits", label: "Credits and license" });

  return (
    <BrowseFrame
      crumbs={[
        { label: "Components", href: "/components" },
        {
          label: CATEGORY_LABELS[item.category],
          href: `/components?view=${item.category}`,
        },
        { label: item.name },
      ]}
      sidebar={sidebar}
      stars={stars}
      actions={
        <div className="mr-1 flex items-center gap-1.5">
          {previous && (
            <Link
              href={previous.href}
              aria-label={`Previous: ${previous.name}`}
              className={NAV}
            >
              <ChevronIcon direction="left" className="size-4" />
            </Link>
          )}
          {next && (
            <Link
              href={next.href}
              aria-label={`Next: ${next.name}`}
              className={NAV}
            >
              <ChevronIcon className="size-4" />
            </Link>
          )}
        </div>
      }
    >
      <div
        key={item.href}
        className="mx-auto flex w-full max-w-360 items-start gap-10 2xl:gap-14"
      >
        <article className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/components?view=${item.category}`}
              className="flex h-6.5 items-center rounded-full border border-home-line-strong px-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-home-fg-2 transition-colors duration-150 hover:text-home-fg"
            >
              {CATEGORY_LABELS[item.category]}
            </Link>
            {item.isNew && (
              <span className="flex h-6.5 items-center rounded-full bg-[#2E5BE8] px-2.5 text-xs font-semibold text-white">
                New
              </span>
            )}
            {item.featured && (
              <span className="flex h-6.5 items-center rounded-full bg-home-blue/14 px-2.5 text-xs font-semibold text-home-blue">
                Featured
              </span>
            )}
          </div>
          <h1 className="mt-4 text-[clamp(2.25rem,4.5vw,3rem)] font-bold leading-[1.04] tracking-[-0.035em]">
            {item.name}
          </h1>
          {item.description && (
            <p className="mt-3.5 max-w-[36em] text-lg leading-relaxed text-home-fg-2">
              {item.description}
            </p>
          )}
          <p className="mt-4 flex flex-wrap items-center gap-x-4.5 gap-y-2 font-mono text-xs text-home-muted">
            <span>
              {deps.length ? `Needs ${deps.join(", ")}` : "No extra packages"}
            </span>
            <span aria-hidden="true">·</span>
            <span>1 file</span>
            <span aria-hidden="true">·</span>
            <span>MIT</span>
          </p>
          <DocsActions item={item} />

          <DocsPreview usage={item.usage}>{children}</DocsPreview>

          <DocsInstall item={item} pm={pm} onPmChange={setPm} />

          {item.usage && (
            <section
              id="usage"
              aria-labelledby="usage-title"
              className="mt-16 scroll-mt-24"
            >
              <h2 id="usage-title" className={H2}>
                Usage
              </h2>
              <p className="mb-4.5 mt-2.5 text-[15px] leading-relaxed text-home-fg-2">
                Import it from your components folder and render it anywhere.
              </p>
              <DocsCode code={item.usage} filename="app/page.tsx" />
            </section>
          )}

          <DocsOptions item={item} />

          {item.props && item.props.length > 0 && (
            <section
              id="api"
              aria-labelledby="api-title"
              className="mt-16 scroll-mt-24"
            >
              <h2 id="api-title" className={H2}>
                API reference
              </h2>
              <p className="mb-4.5 mt-2.5 text-[15px] leading-relaxed text-home-fg-2">
                Options you can pass to customize this component.
              </p>
              <div className="overflow-x-auto rounded-[18px] border border-home-line">
                <table className="w-full min-w-170 border-collapse text-sm">
                  <thead>
                    <tr className="text-left font-mono text-[11px] uppercase tracking-[0.08em] text-home-muted">
                      {["Prop", "Type", "Default", "Description"].map(
                        (head) => (
                          <th
                            key={head}
                            scope="col"
                            className="border-b border-home-line px-4.5 py-3.25 font-normal"
                          >
                            {head}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {item.props.map((prop) => (
                      <tr
                        key={prop.name}
                        className="border-b border-home-line last:border-b-0"
                      >
                        <td className="px-4.5 py-3.5 align-top">
                          <code className="font-mono text-[13px] text-home-blue">
                            {prop.name}
                            {prop.required && (
                              <span className="text-home-muted">*</span>
                            )}
                          </code>
                        </td>
                        <td className="px-4.5 py-3.5 align-top">
                          <code className="font-mono text-[12.5px] text-home-fg">
                            {prop.type}
                          </code>
                        </td>
                        <td className="px-4.5 py-3.5 align-top">
                          <code className="font-mono text-[12.5px] text-home-fg-2">
                            {prop.default ?? "-"}
                          </code>
                        </td>
                        <td className="px-4.5 py-3.5 align-top leading-relaxed text-home-fg-2">
                          {prop.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {item.interaction && (
            <section
              id="interaction"
              aria-labelledby="interaction-title"
              className="mt-16 scroll-mt-24"
            >
              <h2 id="interaction-title" className={H2}>
                Interaction
              </h2>
              <p className="mt-3.5 max-w-[42em] text-base leading-relaxed text-home-fg-2">
                {item.interaction}
              </p>
            </section>
          )}

          <section
            id="credits"
            aria-labelledby="credits-title"
            className="mt-16 scroll-mt-24"
          >
            <h2 id="credits-title" className={H2}>
              Credits and license
            </h2>
            <div className="mt-4.5 grid gap-px overflow-hidden rounded-[18px] border border-home-line bg-home-line sm:grid-cols-2">
              <div className="flex flex-col gap-2.5 bg-home-bg p-5">
                <h3 className="text-[15px] font-semibold">Keep in mind</h3>
                {item.credits && item.credits.length > 0 && (
                  <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-home-fg">
                    {item.credits.map((credit) => (
                      <li key={credit}>{credit}</li>
                    ))}
                  </ul>
                )}
                <p className="text-sm leading-relaxed text-home-fg-2">
                  {PANEL_INFO.keepInMind}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 bg-home-bg p-5">
                <h3 className="text-[15px] font-semibold">License and usage</h3>
                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-home-fg-2">
                  {PANEL_INFO.license.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-1.5 pt-2 text-sm text-home-fg-2">
                  {PANEL_INFO.contactNote}
                  <CopyButton
                    value={PANEL_INFO.contactEmail}
                    label={`Copy email (${PANEL_INFO.contactEmail})`}
                    className="size-8 rounded-lg text-home-fg-2 hover:text-home-fg"
                  />
                </div>
              </div>
            </div>
          </section>

          <nav
            aria-label="More components"
            className="mt-18 grid gap-3.5 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={previous.href}
                className="flex flex-col gap-1.5 rounded-[18px] border border-home-line px-5 py-4.5 transition-colors duration-200 hover:border-home-blue/45"
              >
                <span className="text-[13px] text-home-muted">Previous</span>
                <span className="flex items-center gap-2 text-[17px] font-semibold">
                  <ChevronIcon direction="left" className="size-4" />
                  {previous.name}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.href}
                className="flex flex-col items-end gap-1.5 rounded-[18px] border border-home-line px-5 py-4.5 text-right transition-colors duration-200 hover:border-home-blue/45"
              >
                <span className="text-[13px] text-home-muted">Next</span>
                <span className="flex items-center gap-2 text-[17px] font-semibold">
                  {next.name}
                  <ChevronIcon className="size-4" />
                </span>
              </Link>
            )}
          </nav>
        </article>

        <DocsToc item={item} sections={sections} pm={pm} />
      </div>
    </BrowseFrame>
  );
}
