import type { ReactNode } from "react";
import { REGISTRY_HOMEPAGE, REGISTRY_REPO } from "@/lib/components";
import { cn } from "@/lib/utils";
import GlassAccent from "./GlassAccent";
import { WRAP } from "./wrap";

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-home-line bg-home-raised px-1.5 py-px font-mono text-[13px] text-home-fg">
      {children}
    </code>
  );
}

const FAQS: { question: string; answer: ReactNode }[] = [
  {
    question: "What is Mox UI?",
    answer:
      "A free, open-source registry of animated React components. Each one is a single file built with Tailwind CSS and Motion, and you install it with the shadcn CLI.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. Use and modify components in personal and commercial projects. Attribution is appreciated. Please don't resell them as your own kit.",
  },
  {
    question: "How do I install a component?",
    answer: (
      <>
        Run <Code>{`npx shadcn@latest add ${REGISTRY_REPO}/<name>`}</Code> in
        your React project. pnpm, yarn and bun work too. The CLI adds the file
        and any dependency it needs.
      </>
    ),
  },
  {
    question: "Do components work with shadcn/ui?",
    answer: (
      <>
        Yes. They follow shadcn conventions: <Code>cn()</Code> merges your{" "}
        <Code>className</Code>, other props spread onto the root, and the root
        carries a <Code>data-slot</Code>.
      </>
    ),
  },
  {
    question: "What does my project need?",
    answer:
      "React and Tailwind CSS. Most components animate with Motion, which the CLI installs for you.",
  },
  {
    question: "Do animations respect reduced motion?",
    answer: (
      <>
        Yes. Interactive components honor <Code>prefers-reduced-motion</Code>{" "}
        and settle into instant or static states.
      </>
    ),
  },
  {
    question: "Are these original designs?",
    answer:
      "Most are recreations of great work from around the web, reverse-engineered and extended. Each component page credits its sources.",
  },
];

const PlusIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden
    className="size-3.5 justify-self-end text-home-muted transition-[transform,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45 group-open:text-home-fg group-hover/q:text-home-blue"
  >
    <path d="M8 2v12M2 8h12" />
  </svg>
);

export default function HomeFaq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className={cn(WRAP, "py-18 md:py-32")}
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="flex flex-col gap-4.5 self-start lg:sticky lg:top-24">
          <h2
            id="faq-heading"
            className="text-balance text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.035em]"
          >
            Questions,
            <br />
            <GlassAccent>answered</GlassAccent>
          </h2>
          <p className="max-w-[22rem] text-home-fg-2">
            Everything you need to know about installing and using Mox UI. Still
            stuck?{" "}
            <a
              href={`${REGISTRY_HOMEPAGE}/issues`}
              target="_blank"
              rel="noreferrer"
              className="text-home-fg underline decoration-home-line-strong underline-offset-4 transition-colors hover:text-home-blue hover:decoration-home-blue"
            >
              Open an issue on GitHub
            </a>
            .
          </p>
        </div>

        <div>
          {FAQS.map((faq, index) => (
            <details
              key={faq.question}
              name="faq"
              open={index === 0}
              className="faq-item group border-b border-home-line"
            >
              <summary className="group/q grid cursor-pointer list-none grid-cols-[1.75rem_1fr_20px] items-center gap-2 py-5.5 text-[17px] font-semibold tracking-[-0.015em] sm:grid-cols-[2.25rem_1fr_20px] [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[11px] font-medium text-home-muted transition-colors duration-150 group-hover/q:text-home-blue/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="transition-[color,translate] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/q:translate-x-1 group-hover/q:text-home-blue group-focus-visible/q:text-home-blue motion-reduce:transition-none">
                  {faq.question}
                </span>
                <PlusIcon />
              </summary>
              <p className="max-w-160 pb-6 pr-7 text-home-fg-2 sm:pl-11">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
