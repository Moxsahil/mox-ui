"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  activeComponent,
  PANEL_INFO,
  type PackageManager,
} from "@/lib/components";
import DocsCode from "./DocsCode";
import DocsFooter from "./DocsFooter";
import DocsHeader from "./DocsHeader";
import DocsInstall from "./DocsInstall";
import DocsOptions, { optionProps } from "./DocsOptions";
import DocsPreview from "./DocsPreview";
import DocsSidebar from "./DocsSidebar";
import DocsToc, { type TocSection } from "./DocsToc";
import { neighbours } from "./docs";

const H2 = "text-[22px] font-semibold tracking-tight";

const SCROLLABLE_PREVIEWS = new Set([
  "bouncesidebar",
  "hooksidebar",
  "proximitysidebar",
  "scrollprogressindicator",
]);

export default function DocsShell({
  stars,
  children,
}: {
  stars?: number | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const item = activeComponent(pathname);
  const [pm, setPm] = useState<PackageManager>("pnpm");
  const { previous, next } = item ? neighbours(item) : {};
  const sections: TocSection[] = [{ id: "preview", label: "Preview" }];
  if (item?.registry)
    sections.push({ id: "installation", label: "Installation" });
  if (item?.usage) sections.push({ id: "docs-usage", label: "Usage" });
  if (item && optionProps(item).length)
    sections.push({ id: "options", label: "Options" });
  if (item?.props?.length) sections.push({ id: "api", label: "Props" });

  return (
    <div className="home docs-page flex min-h-svh flex-1 flex-col bg-home-bg font-sans text-home-fg">
      <DocsHeader stars={stars} />
      <div className="flex flex-1 flex-col md:flex-row">
        <DocsSidebar current={item} />
        <main
          id="docs-content"
          className="min-w-0 flex-1 px-5 pb-14 pt-8 sm:px-8 md:pt-10 lg:px-12 2xl:px-20"
        >
          {item ? (
            <article key={item.href} className="mx-auto w-full max-w-280">
              <header className="mb-12">
                <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {item.name}
                </h1>
                {item.description && (
                  <p className="mt-3 text-[15px] leading-7 text-home-fg-2 sm:text-base">
                    {item.description}
                  </p>
                )}
              </header>
              <DocsPreview
                registry={item.registry}
                usage={item.usage}
                scrollable={SCROLLABLE_PREVIEWS.has(
                  item.href.split("/").filter(Boolean).pop() ?? "",
                )}
              >
                {children}
              </DocsPreview>
              <DocsInstall item={item} pm={pm} onPmChange={setPm} />
              {item.usage && (
                <section
                  id="docs-usage"
                  aria-labelledby="usage-title"
                  className="mt-12 scroll-mt-24"
                >
                  <h2 id="usage-title" className={H2}>
                    Usage
                  </h2>
                  <DocsCode
                    code={item.usage}
                    filename="app/page.tsx"
                    className="mt-5"
                  />
                </section>
              )}
              <DocsOptions item={item} />
              {!!item.props?.length && (
                <section
                  id="api"
                  aria-labelledby="api-title"
                  className="mt-12 scroll-mt-24"
                >
                  <h2 id="api-title" className={H2}>
                    Props
                  </h2>
                  <div className="mt-5 overflow-x-auto rounded-[10px] border border-home-line">
                    <table className="w-full min-w-150 border-collapse text-left text-[13px]">
                      <thead className="bg-home-surface font-mono text-xs text-home-fg-2">
                        <tr>
                          {["Prop", "Type", "Default", "Description"].map(
                            (head) => (
                              <th
                                key={head}
                                scope="col"
                                className="border-b border-home-line px-4 py-3 font-normal"
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
                            <th
                              scope="row"
                              className="px-4 py-3 align-top font-medium"
                            >
                              <code className="font-mono text-xs">
                                {prop.name}
                                {prop.required && (
                                  <span
                                    className="ml-1 text-home-muted"
                                    aria-label="required"
                                  >
                                    *
                                  </span>
                                )}
                              </code>
                            </th>
                            <td className="px-4 py-3 align-top text-home-fg-2">
                              <code className="font-mono text-xs">
                                {prop.type}
                              </code>
                            </td>
                            <td className="px-4 py-3 align-top text-home-fg-2">
                              <code className="font-mono text-xs">
                                {prop.default ?? "-"}
                              </code>
                            </td>
                            <td className="px-4 py-3 align-top leading-6 text-home-fg-2">
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
                <p className="mt-6 text-sm leading-7 text-home-fg-2">
                  {item.interaction}
                </p>
              )}
              <details className="mt-10 text-sm text-home-fg-2">
                <summary className="w-fit cursor-pointer py-2 font-medium text-home-fg">
                  Credits and license
                </summary>
                <div className="mt-3 space-y-3 leading-6">
                  {item.credits?.map((credit) => (
                    <p key={credit}>{credit}</p>
                  ))}
                  <p>{PANEL_INFO.keepInMind}</p>
                  <ul className="list-inside list-disc">
                    {PANEL_INFO.license.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <a
                    href={`mailto:${PANEL_INFO.contactEmail}`}
                    className="underline underline-offset-4"
                  >
                    Contact Mox UI
                  </a>
                </div>
              </details>
              <nav
                aria-label="More components"
                className="mt-12 grid gap-4 border-t border-home-line pt-8 sm:grid-cols-2"
              >
                {previous ? (
                  <Link
                    href={previous.href}
                    className="flex flex-col gap-1 rounded-[10px] border border-home-line px-4 py-3 transition-colors hover:bg-home-surface"
                  >
                    <span className="flex items-center gap-1 text-xs text-home-fg-2">
                      <ChevronLeft className="size-3.5" aria-hidden="true" />
                      Previous
                    </span>
                    <span className="text-sm font-medium">{previous.name}</span>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {next && (
                  <Link
                    href={next.href}
                    className="flex flex-col items-end gap-1 rounded-[10px] border border-home-line px-4 py-3 text-right transition-colors hover:bg-home-surface"
                  >
                    <span className="flex items-center gap-1 text-xs text-home-fg-2">
                      Next
                      <ChevronRight className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium">{next.name}</span>
                  </Link>
                )}
              </nav>
            </article>
          ) : (
            children
          )}
        </main>
        {item && <DocsToc key={item.href} item={item} sections={sections} />}
      </div>
      <DocsFooter />
    </div>
  );
}
