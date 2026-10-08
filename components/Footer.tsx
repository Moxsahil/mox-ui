"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { components, REGISTRY_HOMEPAGE } from "@/lib/components";
import { SUPPORT_EMAIL } from "@/lib/legal";
import {
  MARK_BALL,
  MARK_PATH,
  MARK_STROKE,
  WORDMARK_O,
  WORDMARK_VIEWBOX,
  WORDMARK_X,
} from "@/lib/logo";
import { SITE_GITHUB_URL, SITE_X_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { MoxMark } from "@/components/MoxLogo";
import { createSmoke } from "./footer/smoke";
import { GithubLogo, XLogo } from "./logos";

const SMOKE_BLUE = "#3B6FF0";
const NEWEST = components.find((item) => item.registry === "matrix-orb");

type FooterLink = { label: string; href: string; tag?: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Library",
    links: [
      { label: "Components", href: "/components" },
      { label: "Templates", href: "/templates" },
      ...(NEWEST
        ? [{ label: NEWEST.name, href: NEWEST.href, tag: "New" }]
        : []),
    ],
  },
  {
    title: "Build",
    links: [
      { label: "llms.txt", href: "/llms.txt" },
      { label: "GitHub", href: REGISTRY_HOMEPAGE },
      { label: "Report a bug", href: `${REGISTRY_HOMEPAGE}/issues` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

const SOCIALS = [
  ...(SITE_GITHUB_URL
    ? [{ label: "GitHub", href: SITE_GITHUB_URL, icon: GithubLogo }]
    : []),
  ...(SITE_X_URL
    ? [{ label: "X / Twitter", href: SITE_X_URL, icon: XLogo }]
    : []),
];

const STACK = ["React", "Tailwind CSS", "Motion", "shadcn CLI"];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const bounce = (t: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};

function FooterAnchor({
  href,
  className,
  children,
}: FooterLink & {
  className?: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Footer({ className }: { className?: string }) {
  const gradient = useId().replace(/:/g, "");
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letterRefs = useRef<(SVGGElement | null)[]>([]);
  const ballRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const content = contentRef.current;
    const canvas = canvasRef.current;
    const ball = ballRef.current;
    if (!footer || !content || !canvas || !ball) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const smoke = createSmoke(canvas, SMOKE_BLUE);
    if (!smoke) canvas.hidden = true;

    let onScreen = false;
    let raf = 0;
    let shown = 0;

    const apply = (p: number) => {
      content.style.transform = `translateY(${((1 - easeOut(p)) * 56).toFixed(1)}px)`;
      content.style.opacity = (0.25 + 0.75 * easeOut(p)).toFixed(3);
      canvas.style.opacity = (0.35 + 0.65 * p).toFixed(3);
      letterRefs.current.forEach((letter, i) => {
        const rise = clamp((p - 0.25 - i * 0.08) / 0.5);
        letter?.setAttribute(
          "transform",
          `translate(0 ${((1 - easeOut(rise)) * 40).toFixed(2)})`,
        );
      });
      // the ball drops in last and bounces to rest as the footer finishes uncovering
      const drop = clamp((p - 0.6) / 0.4);
      const y = -(1 - bounce(drop)) * 34;
      // the squash lets go over the final hop so the ball rests in its true shape
      const contact = clamp(1 - Math.abs(y) / 3) * clamp((1 - drop) / 0.04);
      const cx = MARK_BALL.cx;
      const ground = MARK_BALL.cy + MARK_BALL.ry;
      ball.setAttribute(
        "transform",
        `translate(0 ${y.toFixed(2)}) translate(${cx} ${ground}) scale(${(1 + 0.18 * contact).toFixed(3)} ${(1 - 0.22 * contact).toFixed(3)}) translate(${-cx} ${-ground})`,
      );
    };

    const frame = (now: number) => {
      raf = 0;
      const rect = footer.getBoundingClientRect();
      const revealed = clamp(
        (window.innerHeight - rect.top) / (rect.height || 1),
      );
      if (shown !== revealed) {
        shown =
          Math.abs(revealed - shown) < 0.001
            ? revealed
            : shown + (revealed - shown) * 0.14;
        apply(shown);
      }
      smoke?.draw(now, shown);
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduce) {
        apply(1);
        smoke?.draw(30_000, 1);
        return;
      }
      if (!raf && onScreen && !document.hidden)
        raf = requestAnimationFrame(frame);
    };

    const resizer = new ResizeObserver(([entry]) => {
      smoke?.resize(entry.contentRect.width, entry.contentRect.height);
      if (reduce) smoke?.draw(30_000, 1);
    });
    resizer.observe(footer);

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    observer.observe(footer);
    document.addEventListener("visibilitychange", start);

    // set the starting pose before the footer can be seen
    apply(reduce ? 1 : 0);

    return () => {
      cancelAnimationFrame(raf);
      resizer.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      smoke?.dispose();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className={cn(
        "relative mt-auto h-[min(100svh,800px)] [clip-path:inset(0)]",
        className,
      )}
    >
      {/* the clip window scrolls over a fixed layer, so the pin runs on the compositor; a transformed ancestor would break it */}
      <div className="fixed inset-x-0 bottom-0 isolate h-[min(100svh,800px)] overflow-hidden bg-[#07080C] text-[#F4F6FB]">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(59,111,240,0.45),transparent_70%)]"
        />
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 -z-20 size-full opacity-35"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,8,12,0.86)_0%,rgba(7,8,12,0.45)_45%,rgba(7,8,12,0)_75%)]"
        />

        <div
          ref={contentRef}
          className="mx-auto flex w-full max-w-[calc(1200px_+_2*var(--footer-gutter))] flex-col gap-[clamp(28px,4vh,48px)] px-(--footer-gutter) pt-[clamp(48px,9vh,104px)] [--footer-gutter:clamp(16px,4vw,40px)]"
        >
          <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="flex min-w-0 flex-col gap-5">
              <Link
                href="/"
                className="flex w-fit items-center gap-2.5 font-runde text-xl font-bold tracking-tight"
              >
                <MoxMark className="size-7" />
                Mox UI
              </Link>
              <p className="max-w-[14em] text-balance font-runde text-[clamp(26px,3vw,38px)] font-bold leading-[1.1] tracking-[-0.03em]">
                Every design{" "}
                <span className="bg-linear-to-b from-[#DBE7FF] to-[#3A6FF0] bg-clip-text pr-[0.08em] font-accent font-normal italic text-transparent [font-variation-settings:'SOFT'_100,'WONK'_1]">
                  matters
                </span>
                .
              </p>
              <div className="mt-1 flex flex-wrap gap-2.5">
                <Link
                  href="/components"
                  className="inline-flex h-10.5 items-center rounded-full bg-[#F4F6FB] px-4.5 font-runde text-sm font-semibold text-[#07080C] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.3,1.4,0.5,1)] hover:-translate-y-0.5 hover:bg-white"
                >
                  Browse components
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                      ).matches
                        ? "auto"
                        : "smooth",
                    })
                  }
                  className="group inline-flex h-10.5 cursor-pointer items-center gap-2.5 rounded-full border border-white/10 bg-white/5 pl-3.5 pr-4 font-runde text-sm backdrop-blur-sm transition-colors duration-150 hover:border-[#8EB2FF]/45 hover:text-[#8EB2FF]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.3,1.4,0.5,1)] group-hover:-translate-y-0.75"
                  >
                    <path d="M12 19V5M6 11l6-6 6 6" />
                  </svg>
                  Back to top
                </button>
              </div>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-6 sm:grid-cols-3"
            >
              {COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="mb-3.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[#E2E9FF]/60">
                    {column.title}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <FooterAnchor
                          {...link}
                          className="inline-flex items-center gap-2 font-runde text-[15px] transition-[color,transform] duration-200 ease-[cubic-bezier(0.3,1.4,0.5,1)] hover:translate-x-0.75 hover:text-[#8EB2FF]"
                        >
                          {link.label}
                          {link.tag && (
                            <span className="rounded-full border border-[#8EB2FF]/35 px-1.75 text-[10px] font-semibold tracking-[0.04em] text-[#8EB2FF]">
                              {link.tag}
                            </span>
                          )}
                        </FooterAnchor>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 border-t border-white/10 pt-4.5 font-runde text-[13px] text-[#E2E9FF]/60">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                Mox UI © {new Date().getFullYear()}. Free and open source under
                MIT.
              </span>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="transition-colors hover:text-[#8EB2FF]"
              >
                Support: {SUPPORT_EMAIL}
              </a>
            </span>
            <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {STACK.map((name) => (
                <span key={name}>{name}</span>
              ))}
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="transition-colors hover:text-[#8EB2FF]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </span>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-[clamp(16px,4vw,40px)]"
        >
          <svg
            viewBox={WORDMARK_VIEWBOX}
            className="-mb-[2%] block h-auto w-full max-w-330 overflow-visible"
          >
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F4F6FB" />
                <stop offset="0.55" stopColor="#AFC6FF" />
                <stop offset="1" stopColor="#3B6FF0" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <g
              ref={(node) => {
                letterRefs.current[0] = node;
              }}
            >
              <path
                d={MARK_PATH}
                fill="none"
                stroke={`url(#${gradient})`}
                strokeWidth={MARK_STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse
                ref={ballRef}
                {...MARK_BALL}
                fill={`url(#${gradient})`}
              />
            </g>
            <g
              ref={(node) => {
                letterRefs.current[1] = node;
              }}
            >
              <circle
                {...WORDMARK_O}
                fill="none"
                stroke={`url(#${gradient})`}
                strokeWidth={MARK_STROKE}
              />
            </g>
            <g
              ref={(node) => {
                letterRefs.current[2] = node;
              }}
            >
              <path
                d={WORDMARK_X}
                fill="none"
                stroke={`url(#${gradient})`}
                strokeWidth={MARK_STROKE}
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </div>
    </footer>
  );
}
