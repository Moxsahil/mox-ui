import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import DocsQuickInstall from "@/components/docs/DocsQuickInstall";
import { components, REGISTRY_HOMEPAGE } from "@/lib/components";
import { docsJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "A free, copy-paste library of animated React components and page templates, built with Tailwind CSS and Motion.";

const PAGE = { title: "Introduction", description, path: "/docs/introduction" };

export const metadata = pageMetadata(PAGE);

const CONTENTS = [
  {
    title: "Components",
    text: "Inputs, buttons, counters, and cards for the details people interact with every day.",
  },
  {
    title: "Motion and effects",
    text: "Animated beams, falling letters, and liquid surfaces that bring movement to your interface.",
  },
  {
    title: "Navigation and feedback",
    text: "Sidebars, menus, scroll indicators, notifications, and reactions that help people find their way and see what changed.",
  },
  {
    title: "AI interfaces",
    text: "Fluid and matrix orbs for voice states, plus image reveals for generated content.",
  },
  {
    title: "Page templates",
    text: "Complete SaaS and magazine layouts you can adapt into a starting point for your own site.",
  },
];

const PRINCIPLES = [
  {
    title: "Own the source.",
    text: "Components live in your project. Read, restyle, and change them without waiting for a library update.",
  },
  {
    title: "Make motion useful.",
    text: "Animation should explain a change, guide attention, or make an interaction feel natural.",
  },
  {
    title: "Respect preferences.",
    text: "Interactive components honor reduced motion with instant transitions or static states.",
  },
  {
    title: "Keep it adaptable.",
    text: "Familiar React props and Tailwind classes let you fit each component to your design.",
  },
];

const FAQS = [
  {
    question: "Is Mox UI free to use?",
    answer:
      "Yes. The code is available under the MIT license for personal and commercial projects. Keep the copyright and license notice with copies of the code.",
  },
  {
    question: "What does my project need?",
    answer:
      "Start with React and Tailwind CSS v4. Set up shadcn before using the install command. The CLI adds the component file and its dependencies, including Motion when needed.",
  },
  {
    question: "Can I use these components with shadcn/ui?",
    answer:
      "Yes. Mox UI follows shadcn conventions and installs into your project alongside your existing components. You can also copy the source from the manual installation guide.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes. Every component page includes a live preview, source code, and usage guidance. Adjust the props for quick changes, or edit the source to make it your own.",
  },
  {
    question: "Where do the designs come from?",
    answer:
      "Many components recreate and extend work from around the web. Component pages credit their references so you can explore the original ideas.",
  },
];

const SECTION = "mt-12 scroll-mt-24 border-t border-home-line pt-10";
const HEADING = "text-[22px] font-semibold tracking-[-0.025em] text-home-fg";
const TEXT = "text-[14px] leading-7 text-home-fg-2 sm:text-[15px]";
const LINK =
  "text-home-fg underline decoration-home-line-strong underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-fg";

export default function IntroductionPage() {
  const starter =
    components.find((item) => item.registry === "animated-beam") ??
    components[0];

  return (
    <article className="mx-auto w-full max-w-2xl pb-14">
      <JsonLd data={docsJsonLd(PAGE)} />
      <section
        id="introduction"
        aria-labelledby="introduction-heading"
        className="scroll-mt-24"
      >
        <h1
          id="introduction-heading"
          className="text-4xl font-semibold tracking-[-0.035em] text-home-fg"
        >
          Introduction
        </h1>
        <div className={`mt-6 space-y-6 ${TEXT}`}>
          <p>{description}</p>
          <p>
            Mox UI helps you add thoughtful interactions to your projects.
            Explore the live previews, find a component that fits, and bring its
            source into your app. From a small input to a full page, each piece
            is yours to customize.
          </p>
          <p>
            There is no Mox UI package to keep in sync. The shadcn CLI copies
            the files into your project and installs their dependencies. Work
            with them just like the rest of your code.
          </p>
          <p>
            Each component page brings the preview, code, installation guide,
            and available props together. Use the sidebar to explore the
            collection and try the interactions before adding them to your
            project.
          </p>
        </div>

        <div id="installation" className="mt-7 scroll-mt-24">
          <p className={`mb-4 ${TEXT}`}>
            Ready to try one? With React, Tailwind CSS, and shadcn set up, run
            this command in your project to add {starter.name.toLowerCase()}:
          </p>
          {starter.registry && <DocsQuickInstall registry={starter.registry} />}
          <p className={`mt-4 ${TEXT}`}>
            Starting from scratch? The{" "}
            <Link href="/docs/installation" className={LINK}>
              installation guide
            </Link>{" "}
            walks through setting up a new project.
          </p>
        </div>
      </section>

      <section
        id="whats-inside"
        aria-labelledby="whats-inside-heading"
        className={SECTION}
      >
        <h2 id="whats-inside-heading" className={HEADING}>
          What&apos;s inside
        </h2>
        <p className={`mt-4 ${TEXT}`}>
          Small interface details and complete layouts, ready to explore and
          adapt:
        </p>
        <ul className={`mt-5 list-disc space-y-3 pl-5 ${TEXT}`}>
          {CONTENTS.map((item) => (
            <li key={item.title} className="pl-1">
              <strong className="font-semibold text-home-fg">
                {item.title}:
              </strong>{" "}
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section
        id="philosophy"
        aria-labelledby="philosophy-heading"
        className={SECTION}
      >
        <h2 id="philosophy-heading" className={HEADING}>
          Philosophy
        </h2>
        <p className={`mt-4 ${TEXT}`}>
          A component should be easy to understand and feel at home in your
          project. These ideas guide the collection:
        </p>
        <ul className={`mt-5 list-disc space-y-3 pl-5 ${TEXT}`}>
          {PRINCIPLES.map((item) => (
            <li key={item.title} className="pl-1">
              <strong className="font-semibold text-home-fg">
                {item.title}
              </strong>{" "}
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className={SECTION}>
        <h2 id="faq-heading" className={HEADING}>
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-7">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-[15px] font-semibold text-home-fg">
                {faq.question}
              </h3>
              <p className={`mt-2 ${TEXT}`}>{faq.answer}</p>
            </div>
          ))}
          <div>
            <h3 className="text-[15px] font-semibold text-home-fg">
              How can I report a problem or contribute?
            </h3>
            <p className={`mt-2 ${TEXT}`}>
              Open an issue or a pull request on{" "}
              <a
                href={REGISTRY_HOMEPAGE}
                target="_blank"
                rel="noreferrer"
                className={LINK}
              >
                GitHub
              </a>
              . Bug reports, suggestions, and new component contributions are
              welcome.
            </p>
          </div>
        </div>
      </section>

      <nav
        aria-label="Documentation pagination"
        className="mt-12 border-t border-home-line pt-8"
      >
        <Link
          href="/docs/installation"
          className="flex flex-col items-end gap-1 rounded-[10px] border border-home-line px-4 py-3 text-sm transition-colors hover:border-home-line-strong hover:bg-home-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-fg motion-reduce:transition-none"
        >
          <span className="flex items-center gap-1 text-home-muted">
            Next <ChevronRight aria-hidden="true" className="size-3.5" />
          </span>
          <span className="font-medium text-home-fg">Installation</span>
        </Link>
      </nav>
    </article>
  );
}
