"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import { GithubLogo } from "@/components/logos";
import { components, templates } from "@/lib/components";
import { SITE_GITHUB_URL, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { MoxMark } from "@/components/MoxLogo";
import { WRAP } from "./wrap";

const LINKS = [
  { label: "Docs", href: "/docs/introduction" },
  { label: "Components", href: "/components" },
  { label: "Templates", href: "/templates" },
];

const QUICK_START = "/components/animatedbeam";

const MENU = [
  { ...LINKS[0], meta: "Start here" },
  { ...LINKS[1], meta: String(components.length) },
  { ...LINKS[2], meta: String(templates.length) },
  ...(SITE_GITHUB_URL
    ? [{ label: "GitHub", href: SITE_GITHUB_URL, meta: "Star ↗" }]
    : []),
];

const THEMES = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const compact = new Intl.NumberFormat("en", { notation: "compact" });

const noop = () => () => {};

export default function HomeNav({ stars }: { stars?: number | null }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  // next-themes only knows the theme on the client, so the switch shows no selection until hydration is done
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0, r: 0 });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const current = MENU.findIndex(
    (item) => item.href.startsWith("/") && pathname.startsWith(item.href),
  );
  // touch never hovers, so the accent rests on the current page, else on components, the main destination
  const highlighted = hovered ?? (current >= 0 ? current : 1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      // keep focus between the close button and the menu, the page behind is covered
      const focusable = [
        toggleRef.current,
        ...(menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []),
      ].filter((element): element is HTMLElement => element !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    // the menu only exists below md, so close it if the viewport grows past that
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const toggle = () => {
    const button = toggleRef.current;
    if (!open && button) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setOrigin({
        x,
        y,
        r: Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        ),
      });
    }
    setHovered(null);
    setOpen((value) => !value);
  };

  const close = () => setOpen(false);

  const stagger = (index: number): CSSProperties => ({
    transitionDelay: open ? `${200 + index * 70}ms` : "0ms",
  });

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-transparent transition-colors duration-200",
          scrolled &&
            !open &&
            "border-home-line bg-home-bg/75 backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <div
          className={cn(WRAP, "flex h-15 items-center justify-between gap-4")}
        >
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <MoxMark className="size-6" />
            {SITE_NAME}
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 text-sm text-home-fg-2 md:flex"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-150 hover:text-home-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {SITE_GITHUB_URL && (
              <a
                href={SITE_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={`${SITE_NAME} on GitHub`}
                className="hidden h-8.5 items-center gap-1.5 rounded-full px-2.5 text-sm text-home-fg-2 transition-colors duration-150 hover:bg-home-line hover:text-home-fg md:inline-flex"
              >
                <GithubLogo className="size-4" />
                <span className="tabular-nums">
                  {stars != null ? compact.format(stars) : "Star"}
                </span>
              </a>
            )}

            <ThemeToggle
              className={cn(
                "rounded-full bg-transparent p-2 text-home-fg-2 transition-opacity duration-200 hover:bg-home-line hover:text-home-fg [&_svg]:size-4",
                open && "pointer-events-none opacity-0",
              )}
            />

            <Link
              href={QUICK_START}
              aria-hidden={open || undefined}
              tabIndex={open ? -1 : undefined}
              className={cn(
                "inline-flex h-8.5 items-center rounded-full bg-home-fg px-3.5 text-sm font-semibold text-home-bg transition-[background-color,opacity] duration-200 hover:bg-home-fg/85",
                open && "pointer-events-none opacity-0",
              )}
            >
              Quick start
            </Link>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="home-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={toggle}
              className={cn(
                "relative inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 motion-reduce:transition-none md:hidden",
                open
                  ? "bg-home-fg text-home-bg"
                  : "bg-home-line text-home-fg hover:bg-home-line-strong",
              )}
            >
              {[-1, 1].map((side) => (
                <span
                  key={side}
                  aria-hidden="true"
                  className="absolute h-0.5 w-4.5 rounded-full bg-current transition-transform duration-[420ms] ease-[cubic-bezier(0.3,1.4,0.5,1)] motion-reduce:transition-none"
                  style={{
                    transform: open
                      ? `rotate(${side * -45}deg)`
                      : `translateY(${side * 4}px)`,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="home-menu"
        className={cn(
          "fixed inset-0 z-40 bg-home-bg font-runde text-home-fg transition-[clip-path,visibility] duration-[640ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none md:hidden",
          !open && "invisible",
        )}
        style={{
          clipPath: `circle(${open ? origin.r : 0}px at ${origin.x}px ${origin.y}px)`,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-105 bg-[radial-gradient(80%_70%_at_50%_100%,rgb(59_111_240/0.45),transparent_70%),radial-gradient(40%_50%_at_90%_100%,rgb(142_178_255/0.2),transparent_70%)]"
        />

        <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-6 pt-19">
          <p
            className={cn(
              "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-home-muted transition-opacity duration-300 motion-reduce:transition-none",
              !open && "opacity-0",
            )}
            style={{ transitionDelay: open ? "160ms" : "0ms" }}
          >
            Menu
            <span aria-hidden="true" className="h-px flex-1 bg-home-line" />
            {components.length} components
          </p>

          <nav aria-label="Menu" className="mt-3.5">
            <ul>
              {MENU.map((item, index) => {
                const external = !item.href.startsWith("/");
                const active = highlighted === index;
                return (
                  <li
                    key={item.href}
                    className={cn(
                      "border-b border-home-line transition-[opacity,transform] duration-[620ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                      !open && "translate-y-6.5 opacity-0",
                    )}
                    style={stagger(index)}
                  >
                    <Link
                      href={item.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      aria-current={current === index ? "page" : undefined}
                      onClick={close}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(index)}
                      onBlur={() => setHovered(null)}
                      className="flex items-baseline gap-3.5 pb-3 pt-3.5"
                    >
                      <span
                        className={cn(
                          "w-5.5 font-mono text-xs transition-colors duration-200",
                          active ? "text-home-blue" : "text-home-muted",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-[clamp(36px,11.5vw,46px)] leading-[1.05]",
                          active
                            ? "font-accent font-normal italic tracking-[-0.02em] text-home-blue [font-variation-settings:'SOFT'_100,'WONK'_1]"
                            : "font-bold tracking-[-0.04em]",
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-xs text-home-muted">
                        {item.meta}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={cn(
              "mt-auto flex flex-col gap-3 pt-8 transition-[opacity,transform] duration-[620ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
              !open && "translate-y-6.5 opacity-0",
            )}
            style={stagger(MENU.length + 1)}
          >
            <div
              role="group"
              aria-label="Theme"
              className="grid grid-cols-3 gap-1 rounded-full border border-home-line bg-home-bg/60 p-1"
            >
              {THEMES.map((option) => {
                const selected = mounted && theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "h-10 cursor-pointer rounded-full text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none",
                      selected
                        ? "bg-home-fg text-home-bg"
                        : "text-home-fg-2 hover:text-home-fg",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <Link
              href={QUICK_START}
              onClick={close}
              className="flex h-13.5 items-center justify-between rounded-full bg-home-fg pl-5.5 pr-2 text-base font-semibold text-home-bg transition-colors duration-150 hover:bg-home-fg/90"
            >
              Quick start
              <span className="flex size-10 items-center justify-center rounded-full bg-home-bg text-home-fg">
                <ArrowRight aria-hidden="true" className="size-4.5" />
              </span>
            </Link>

            <p className="text-center text-[13px] text-home-muted">
              Free and open source under MIT.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
