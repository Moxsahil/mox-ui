"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

// the edge heading toward the new tab springs ahead and the other trails, so the lens stretches like liquid
const LEAD = { type: "spring", stiffness: 520, damping: 40 } as const;
const TRAIL = { type: "spring", stiffness: 240, damping: 30 } as const;
const MORPH = { type: "spring", stiffness: 380, damping: 34 } as const;
const SWAP = { duration: 0.2 } as const;
const INSTANT = { duration: 0 } as const;

// apple-style liquid glass, shared by the bar and the detached search button
const GLASS =
  "backdrop-blur-[14px] backdrop-saturate-[1.8] [background-image:radial-gradient(120%_90%_at_30%_0%,rgba(255,255,255,0.7),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.2))] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.4),inset_0_0_0_1px_rgba(255,255,255,0.5),0_0_0_1px_rgba(9,9,11,0.06),0_1px_2px_rgba(9,9,11,0.08),0_10px_28px_-12px_rgba(9,9,11,0.35)] dark:[background-image:radial-gradient(120%_90%_at_30%_0%,rgba(255,255,255,0.16),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.5),0_12px_32px_-12px_rgba(0,0,0,0.8)]";

const LENS =
  "bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.6),0_0_0_1px_rgba(9,9,11,0.04),0_2px_8px_rgba(9,9,11,0.08)] dark:bg-white/[0.14] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_0_0_1px_rgba(255,255,255,0.08)]";

// button is the bar's height: the tab's padding and icon plus the bar's 4px inset on each side.
// field is the bar's width while searching, so a short tab list still leaves room to type
const SIZES = {
  xs: {
    item: "px-3 py-2 text-[11px] [&_svg]:size-4",
    icon: "size-4",
    button: "size-10",
    input: "gap-2 pl-4 pr-3 text-xs",
    field: 220,
  },
  sm: {
    item: "px-3.5 py-2.5 text-xs [&_svg]:size-[18px]",
    icon: "size-[18px]",
    button: "size-[46px]",
    input: "gap-2 pl-4.5 pr-3.5 text-sm",
    field: 260,
  },
  md: {
    item: "px-4.5 py-3 text-sm [&_svg]:size-5",
    icon: "size-5",
    button: "size-13",
    input: "gap-2.5 pl-5 pr-4 text-sm",
    field: 300,
  },
  lg: {
    item: "px-5 py-3.5 text-base [&_svg]:size-6",
    icon: "size-6",
    button: "size-15",
    input: "gap-3 pl-6 pr-5 text-base",
    field: 340,
  },
} as const;

export type LiquidTabBarSize = keyof typeof SIZES;

type NavItem = { label: string; href?: string; icon?: ReactNode };

export type LiquidTabBarItem = string | NavItem;

const toItem = (item: LiquidTabBarItem): NavItem =>
  typeof item === "string" ? { label: item } : item;

export type LiquidTabBarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: LiquidTabBarItem[];
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  size?: LiquidTabBarSize;
  activeColor?: string;
  onSearch?: (query: string) => void;
  searchLabel?: string;
  closeLabel?: string;
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function LiquidTabBar({
  items,
  value,
  defaultValue = 0,
  onChange,
  size = "md",
  activeColor = "#0A84FF",
  onSearch,
  searchLabel = "Search",
  closeLabel = "Close search",
  className,
  ...props
}: LiquidTabBarProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const placed = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [barWidth, setBarWidth] = useState<number>();

  const routeIndex = items.findIndex((item) => toItem(item).href === pathname);
  const [uncontrolled, setUncontrolled] = useState(() =>
    routeIndex === -1 ? defaultValue : routeIndex,
  );
  const [seenRoute, setSeenRoute] = useState(routeIndex);

  // in render, not an effect: an effect here cascades renders
  if (routeIndex !== seenRoute) {
    setSeenRoute(routeIndex);
    if (routeIndex !== -1 && value === undefined) setUncontrolled(routeIndex);
  }

  const active = value ?? uncontrolled;

  // both edges as insets, so each can spring on its own without a derived width
  const left = useMotionValue(0);
  const right = useMotionValue(0);
  // hidden until measured, so a server render never shows a lens across the whole bar
  const shown = useMotionValue(0);

  useLayoutEffect(() => {
    const list = listRef.current;
    const place = (glide: boolean) => {
      const item = itemRefs.current[active];
      if (!item || !list) return;
      const from = item.offsetLeft;
      const to = list.offsetWidth - from - item.offsetWidth;
      if (!glide || reduced || !placed.current) {
        left.jump(from);
        right.jump(to);
        shown.jump(1);
        placed.current = true;
        return;
      }
      const forward = from > left.get();
      animate(left, from, forward ? TRAIL : LEAD);
      animate(right, to, forward ? LEAD : TRAIL);
    };

    place(true);
    if (!list) return;
    setBarWidth(list.offsetWidth);
    // the first callback reports the size it already has; only a real resize should snap the lens
    let seen = list.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (list.offsetWidth === seen) return;
      seen = list.offsetWidth;
      setBarWidth(seen);
      place(false);
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, [active, reduced, left, right, shown, items.length, size]);

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  const closeSearch = () => {
    setSearching(false);
    setQuery("");
    onSearch?.("");
    toggleRef.current?.focus();
  };

  return (
    <nav
      data-slot="liquid-tab-bar"
      className={cn("inline-flex items-stretch gap-2.5", className)}
      {...props}
    >
      <motion.div
        data-slot="liquid-tab-bar-bar"
        className={cn("relative rounded-full", GLASS)}
        initial={false}
        animate={
          barWidth
            ? {
                width: searching
                  ? Math.max(barWidth, SIZES[size].field)
                  : barWidth,
              }
            : undefined
        }
        transition={reduced ? INSTANT : MORPH}
      >
        <ul
          ref={listRef}
          inert={searching}
          className={cn(
            "relative isolate flex w-max items-center p-1 transition-opacity duration-200 motion-reduce:transition-none",
            searching && "opacity-0",
          )}
        >
          <motion.li
            aria-hidden
            data-slot="liquid-tab-bar-lens"
            className={cn(
              "pointer-events-none absolute inset-y-1 -z-10 rounded-full",
              LENS,
            )}
            style={{ left, right, opacity: shown }}
          />
          {items.map((item, i) => {
            const { label, href, icon } = toItem(item);
            const isActive = i === active;
            const itemProps = {
              "data-slot": "liquid-tab-bar-item",
              "data-active": isActive,
              "aria-current": isActive ? (href ? "page" : true) : undefined,
              "aria-label": icon ? label : undefined,
              title: icon ? label : undefined,
              className: cn(
                "flex cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-current/40 motion-reduce:transition-none [&_svg]:shrink-0",
                SIZES[size].item,
                !isActive && "text-neutral-800 dark:text-white/85",
              ),
              style: isActive ? { color: activeColor } : undefined,
              onClick: () => {
                if (value === undefined) setUncontrolled(i);
                onChange?.(i);
              },
            } as const;

            return (
              <li
                key={`${i}-${label}`}
                ref={(node) => {
                  itemRefs.current[i] = node;
                }}
                className="relative"
              >
                {href ? (
                  <Link href={href} {...itemProps}>
                    {icon ?? label}
                  </Link>
                ) : (
                  <button type="button" {...itemProps}>
                    {icon ?? label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <AnimatePresence initial={false}>
          {searching && (
            <motion.form
              key="search"
              role="search"
              data-slot="liquid-tab-bar-field"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduced ? INSTANT : SWAP}
              onSubmit={(event) => {
                event.preventDefault();
                onSearch?.(query);
              }}
              className={cn(
                "absolute inset-0 flex items-center",
                SIZES[size].input,
              )}
            >
              <input
                ref={inputRef}
                type="search"
                value={query}
                placeholder={searchLabel}
                aria-label={searchLabel}
                onChange={(event) => {
                  setQuery(event.target.value);
                  onSearch?.(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch();
                }}
                className="min-w-0 flex-1 bg-transparent text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white dark:placeholder:text-white/50 [&::-webkit-search-cancel-button]:appearance-none"
              />
              <SearchIcon
                className={cn(
                  "shrink-0 text-neutral-800 dark:text-white/85",
                  SIZES[size].icon,
                )}
              />
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {onSearch && (
        <button
          ref={toggleRef}
          type="button"
          data-slot="liquid-tab-bar-search"
          aria-label={searching ? closeLabel : searchLabel}
          aria-expanded={searching}
          title={searching ? closeLabel : searchLabel}
          onClick={() => (searching ? closeSearch() : setSearching(true))}
          className={cn(
            "flex shrink-0 cursor-pointer items-center justify-center self-center rounded-full text-neutral-800 outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-current/40 active:scale-95 motion-reduce:transition-none dark:text-white/85",
            SIZES[size].button,
            GLASS,
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={searching ? "close" : "search"}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={reduced ? INSTANT : SWAP}
              className="flex"
            >
              {searching ? (
                <CloseIcon className={SIZES[size].icon} />
              ) : (
                <SearchIcon className={SIZES[size].icon} />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      )}
    </nav>
  );
}
