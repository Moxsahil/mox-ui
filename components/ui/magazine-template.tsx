"use client";

import { useId, useState, type ComponentProps, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { ArrowDownRight, ArrowRight, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type MagazineTemplateProps = ComponentProps<"main"> & {
  onSubscribe?: (email: string) => void | Promise<void>;
};

export default function MagazineTemplate({
  className,
  onMouseMove,
  onMouseLeave,
  onSubscribe,
  ...props
}: MagazineTemplateProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [subscription, setSubscription] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const id = useId();
  const sectionId = (name: string) => `${id}-${name}`;
  const navigation = [
    { label: "Issues", href: `#${sectionId("archive")}` },
    { label: "Shop", href: `#${sectionId("spotlight")}` },
    { label: "Membership", href: `#${sectionId("membership")}` },
  ];
  const visibleArticles = articles
    .map((article, index) => ({ ...article, index }))
    .filter((article) =>
      `${article.title} ${article.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    );
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    onMouseMove?.(e);
  };

  return (
    <main
      {...props}
      data-slot="magazine-template"
      onMouseMove={handleMouseMove}
      onMouseLeave={(event) => {
        setActiveIndex(-1);
        onMouseLeave?.(event);
      }}
      className={cn(
        "relative isolate min-h-screen w-full bg-[#f4f4f0] text-black [--font-serif:ui-serif,Georgia,Cambria,'Times_New_Roman',Times,serif] selection:bg-black selection:text-white [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-4 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none",
        className,
      )}
    >
      <FloatingImage
        activeIndex={activeIndex}
        x={mouseX}
        y={mouseY}
        articles={articles}
      />

      <nav
        aria-label="Magazine navigation"
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 mix-blend-difference text-white md:px-12"
      >
        <div className="text-xl font-bold tracking-tighter uppercase">
          Vogue.2125
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
          {navigation.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:underline underline-offset-4"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={searchOpen ? "Close story search" : "Search stories"}
            aria-expanded={searchOpen}
            aria-controls={sectionId("search")}
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
              setQuery("");
            }}
            className="cursor-pointer"
          >
            {searchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={sectionId("menu")}
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
              setQuery("");
            }}
            className="cursor-pointer md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div
          id={sectionId("menu")}
          onKeyDown={(event) => {
            if (event.key === "Escape") setMenuOpen(false);
          }}
          className="fixed inset-x-4 top-20 z-30 flex flex-col gap-6 border border-black bg-[#f4f4f0] p-6 text-xs font-bold uppercase tracking-widest md:hidden"
        >
          {navigation.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      {searchOpen && (
        <form
          role="search"
          id={sectionId("search")}
          onSubmit={(event) => {
            event.preventDefault();
            document.getElementById(sectionId("stories"))?.scrollIntoView();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setSearchOpen(false);
              setQuery("");
            }
          }}
          className="fixed inset-x-4 top-20 z-30 flex gap-4 border border-black bg-[#f4f4f0] p-6 md:inset-x-12"
        >
          <input
            type="search"
            aria-label="Search featured stories"
            placeholder="Search stories"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
            }}
            className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-offset-4"
          />
          <button
            type="submit"
            className="cursor-pointer font-mono text-xs uppercase tracking-widest"
          >
            Search
          </button>
        </form>
      )}

      <section className="relative w-full min-h-screen flex flex-col justify-between p-6 md:p-12 border-b border-black bg-[#f4f4f0] overflow-hidden pt-32 md:pt-32">
        <div className="absolute top-4 right-4 bottom-4 w-full md:w-[70%] z-0 rounded-sm overflow-hidden hidden md:block">
          <motion.div
            className="w-full h-full"
            initial={reducedMotion ? false : { scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <MagazineImage
              src="https://images.unsplash.com/photo-1679163096018-3f75b9c07246?q=80&w=1171&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale opacity-80"
              alt="Hero Editorial"
              loading="eager"
            />
          </motion.div>
        </div>

        <div className="absolute inset-x-4 top-24 bottom-4 z-0 rounded-sm overflow-hidden md:hidden">
          <MagazineImage
            src="https://images.unsplash.com/photo-1679163096018-3f75b9c07246?q=80&w=1171&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale opacity-60"
            alt="Hero Editorial"
            loading="eager"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#f4f4f0] via-[#f4f4f0]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex justify-between items-start md:items-end w-full max-w-7xl">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-black/70">
              Issue No. 14
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-black border-b border-black pb-1">
              The Earth Edition
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-black/70 right-0">
            MMXXIV
          </span>
        </div>

        <div className="relative w-full max-w-7xl flex flex-col justify-end mt-24 md:mt-0">
          <h1 className="font-serif text-[22vw] md:text-[14vw] leading-[0.75] tracking-tighter text-black uppercase mix-blend-normal">
            <motion.span
              initial={reducedMotion ? false : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block overflow-hidden"
            >
              AVANT
            </motion.span>
            <motion.span
              initial={reducedMotion ? false : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block italic md:ml-[15vw] overflow-hidden text-black md:text-white md:mix-blend-difference"
            >
              GARDE.
            </motion.span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-16 md:mt-24">
            <div className="md:col-span-4 font-mono text-xs leading-relaxed uppercase tracking-wide text-black md:text-white md:mix-blend-difference max-w-sm">
              <strong className="text-black md:text-white">
                Editorial Brief:
              </strong>
              <br />
              <br />A deep dive into the intersection of brutalist web
              architecture and high-end editorial layouts. Exploring the limits
              of digital space as a canvas for raw expression.
            </div>
            <div className="md:col-span-8 flex justify-start md:justify-end items-end md:mix-blend-difference">
              <a
                href={`#${sectionId("stories")}`}
                className="group rounded-full border border-black md:border-white px-8 py-4 text-black md:text-white hover:bg-black md:hover:bg-white hover:text-white md:hover:text-black transition-all duration-300 flex items-center gap-4"
              >
                <span className="uppercase text-xs font-bold tracking-widest">
                  Read Issue
                </span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Marquee text="Latest Stories &bull; Breaking News &bull; Visual Essays &bull; " />

      <section
        id={sectionId("stories")}
        className="scroll-mt-20 px-6 md:px-12 py-24 min-h-[50vh]"
      >
        <div className="mb-12 flex items-center gap-2">
          <span className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            Featured Stories
          </span>
        </div>

        <div className="flex flex-col" onMouseLeave={() => setActiveIndex(-1)}>
          {visibleArticles.map(({ index, ...article }) => (
            <ArticleRow
              key={index}
              index={index}
              {...article}
              setIndex={setActiveIndex}
              onFocus={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                mouseX.set(rect.right - 140);
                mouseY.set(rect.top + rect.height / 2);
                setActiveIndex(index);
              }}
            />
          ))}
          {visibleArticles.length === 0 && (
            <p
              role="status"
              className="border-t border-black py-12 font-mono text-sm"
            >
              No stories found. Try another title or category.
            </p>
          )}
        </div>
      </section>

      <EditorialSpotlight
        id={sectionId("spotlight")}
        subscribeHref={`#${sectionId("subscribe")}`}
      />
      <EditorsNote />
      <MinimalQuote />
      <VisualIndex />
      <CategoryList
        storiesHref={`#${sectionId("stories")}`}
        archiveHref={`#${sectionId("archive")}`}
      />
      <PremiumBanner
        id={sectionId("membership")}
        subscribeHref={`#${sectionId("subscribe")}`}
      />
      <TheArchive id={sectionId("archive")} />

      <footer
        id={sectionId("subscribe")}
        className="scroll-mt-20 bg-black text-[#f4f4f0] px-6 py-24 md:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-6xl md:text-8xl">Sub.</h2>
            <p className="mt-4 max-w-sm text-neutral-400">
              Subscribe to our weekly dispatch of digital artifacts and design
              critique.
            </p>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (!onSubscribe || subscription === "pending") return;
                const form = event.currentTarget;
                const email = String(new FormData(form).get("email") ?? "");
                setSubscription("pending");
                try {
                  await onSubscribe(email);
                  setSubscription("success");
                  form.reset();
                } catch {
                  setSubscription("error");
                }
              }}
              className="mt-8 flex border-b border-white/20 pb-2 focus-within:border-white"
            >
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                aria-label="Email address"
                placeholder="Email Address"
                className="min-w-0 w-full bg-transparent outline-none placeholder:text-neutral-600 font-mono uppercase"
              />
              <button
                type="submit"
                disabled={!onSubscribe || subscription === "pending"}
                className="cursor-pointer uppercase text-xs font-bold tracking-widest hover:text-white/70 disabled:cursor-default"
              >
                {subscription === "pending" ? "Sending" : "Submit"}
              </button>
            </form>
            <p role="status" className="mt-3 text-sm text-neutral-400">
              {subscription === "success"
                ? "You are subscribed."
                : subscription === "error"
                  ? "Unable to subscribe. Please try again."
                  : ""}
            </p>
          </div>
          <div className="flex flex-col justify-end text-right">
            <div className="flex justify-end gap-4 mb-8">
              {[
                { label: "Instagram", href: "https://www.instagram.com/" },
                { label: "Twitter", href: "https://x.com/" },
                { label: "Are.na", href: "https://www.are.na/" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="font-mono text-xs uppercase hover:underline"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <p className="font-mono text-[10px] text-neutral-600 uppercase">
              © 2125 The Agency. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const articles = [
  {
    title: "The Silicon Void",
    category: "Architecture",
    color: "bg-stone-500",
  },
  { title: "Digital Skin", category: "Fashion", color: "bg-red-700" },
  { title: "Neo-Tokyo Drift", category: "Culture", color: "bg-indigo-900" },
  { title: "Memory Lanes", category: "Photography", color: "bg-emerald-800" },
];

function Marquee({ text }: { text: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative flex overflow-hidden border-b border-black py-4 bg-neutral-100">
      <motion.div
        className="flex whitespace-nowrap"
        animate={reducedMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[0, 1].map((group) => (
          <div
            key={group}
            aria-hidden={group === 1 ? true : undefined}
            className="flex shrink-0"
          >
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                aria-hidden={index > 0 ? true : undefined}
                className="mx-4 text-xs font-bold uppercase tracking-widest text-black"
              >
                {text} ·
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function FloatingImage({
  activeIndex,
  x,
  y,
  articles,
}: {
  activeIndex: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  articles: Article[];
}) {
  const reducedMotion = useReducedMotion();
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        left: reducedMotion ? x : springX,
        top: reducedMotion ? y : springY,
        x: "-50%",
        y: "-50%",
      }}
      className="pointer-events-none fixed z-20 h-[300px] w-[220px] overflow-hidden hidden md:block"
    >
      <div className="relative h-full w-full">
        {articles.map((article, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: reducedMotion || isActive ? 1 : 0.8,
              }}
              transition={{ duration: reducedMotion ? 0 : 0.4 }}
              className="absolute inset-0 h-full w-full bg-neutral-800"
            >
              <div
                className={cn(
                  "h-full w-full object-cover opacity-80",
                  article.color,
                )}
              />

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-end text-white mix-blend-difference">
                  <span className="text-[10px] font-mono uppercase">
                    Fig. 0{index + 1}
                  </span>
                  <ArrowDownRight size={16} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

type Article = (typeof articles)[number];

function ArticleRow({
  index,
  title,
  category,
  setIndex,
  onFocus,
}: Article & {
  index: number;
  setIndex: (index: number) => void;
  onFocus: ComponentProps<"div">["onFocus"];
}) {
  return (
    <motion.div
      tabIndex={0}
      onFocus={onFocus}
      onBlur={() => setIndex(-1)}
      onMouseEnter={() => {
        setIndex(index);
      }}
      onMouseLeave={() => setIndex(-1)}
      className="group relative flex cursor-pointer items-center justify-between gap-4 border-t border-black py-12 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 px-4 md:px-0"
    >
      <div className="min-w-0 flex items-baseline gap-6 md:gap-12">
        <span className="font-mono text-xs text-neutral-400 shrink-0">
          0{index + 1}
        </span>
        <h2 className="min-w-0 break-words font-serif text-4xl md:text-6xl font-light tracking-tight text-neutral-900 group-hover:italic group-focus-visible:italic transition-all duration-300">
          {title}
        </h2>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-neutral-500 group-hover:text-black">
          {category}
        </span>
        <ArrowRight className="h-6 w-6 -rotate-45 text-neutral-300 transition-transform duration-300 group-hover:rotate-0 group-hover:text-black" />
      </div>
    </motion.div>
  );
}

function EditorsNote() {
  return (
    <section className="border-t border-black bg-[#f4f4f0] py-24 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden bg-neutral-200">
            <MagazineImage
              src="https://images.unsplash.com/photo-1631036119874-f338a1f8160b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGVkaXRvcmlhbCUyMGZhc2hpb24lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww"
              alt="Editor"
              className="h-full w-full object-cover grayscale transition-transform hover:scale-105 duration-700"
            />
            <div className="absolute -left-4 -bottom-4 italic font-serif text-6xl text-white mix-blend-difference">
              Anna.
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8">
              From the Editor
            </span>
            <h2 className="font-serif text-5xl md:text-7xl font-light mb-8 leading-tight">
              The Death of <br />{" "}
              <span className="italic text-neutral-400">Minimalism.</span>
            </h2>
            <div className="space-y-6 text-lg max-w-lg leading-relaxed text-neutral-700">
              <p>
                We spent the last decade stripping away character in the name of
                usability. We tore down the brutalist monuments and hand-drawn
                chaos to build sterile, white-walled digital hospitals.
              </p>
              <p>
                This issue explores the resurgence of texture, noise, and
                unapologetic opinion in design.
              </p>
            </div>
            <div className="mt-12 w-32 border-t border-black" />
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualIndex() {
  const reducedMotion = useReducedMotion();
  const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512418490979-92798cec1380?q=80&w=800&auto=format&fit=crop",
  ];

  return (
    <section className="border-t border-black bg-white px-6 py-24 md:px-12">
      <div className="mb-16 flex justify-between items-end">
        <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter">
          The Index
        </h2>
        <span className="font-mono text-xs uppercase tracking-widest hidden md:block">
          03 Selected Works
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
        {images.map((src, i) => (
          <motion.div
            key={i}
            className={cn(
              "relative group overflow-hidden bg-neutral-100",
              i === 1 ? "md:mt-24" : "md:mb-24",
            )}
            initial={reducedMotion ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <MagazineImage
                src={src}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                alt="Gallery item"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 text-white translate-y-full transition-transform duration-500 group-hover:translate-y-0">
              <div className="font-mono text-xs uppercase tracking-widest mb-2">
                Fig {i + 1}
              </div>
              <div className="font-serif text-2xl">
                Editorial Artifact {i + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategoryList({
  storiesHref,
  archiveHref,
}: {
  storiesHref: string;
  archiveHref: string;
}) {
  const reducedMotion = useReducedMotion();
  const categories = [
    "Fashion",
    "Architecture",
    "Technology",
    "Culture",
    "Archive",
  ];
  return (
    <section className="bg-black text-white px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-12 block">
          Directory
        </span>
        <div className="flex flex-col border-t border-white/20">
          {categories.map((cat, i) => (
            <motion.a
              key={cat}
              href={cat === "Archive" ? archiveHref : storiesHref}
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
              className="group flex items-center justify-between border-b border-white/20 py-8 relative overflow-hidden"
            >
              <motion.div
                variants={{ hover: { x: reducedMotion ? 0 : 20 } }}
                transition={{ ease: "easeOut", duration: 0.3 }}
                className="min-w-0 font-serif text-[clamp(1.5rem,7.5vw,2.25rem)] md:text-7xl font-light uppercase tracking-tighter group-hover:italic"
              >
                {cat}
              </motion.div>
              <div className="font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                0{i + 1}.
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumBanner({
  id,
  subscribeHref,
}: {
  id: string;
  subscribeHref: string;
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-20 h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 z-0">
        <MagazineImage
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Banner"
          className="h-full w-full object-cover object-center grayscale opacity-80"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 mix-blend-difference text-white">
        <h2 className="font-serif text-7xl md:text-[10vw] leading-none uppercase tracking-tighter mb-8">
          The Inner <span className="italic">Circle</span>
        </h2>
        <a
          href={subscribeHref}
          className="rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-neutral-200 transition-colors shadow-2xl"
        >
          Request Access
        </a>
      </div>
    </section>
  );
}

function MinimalQuote() {
  return (
    <section className="bg-[#f4f4f0] px-6 py-32 md:py-48 flex items-center justify-center border-t border-black">
      <div className="max-w-4xl text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-12 block">
          Thought Process
        </span>
        <h2 className="font-serif text-4xl md:text-7xl font-light leading-tight text-black">
          &ldquo;Simplicity is not the absence of clutter, that&apos;s a
          consequence of simplicity. Simplicity is somehow essentially
          describing the purpose and place of an object and product.&rdquo;
        </h2>
        <div className="mt-12 text-sm italic font-serif text-neutral-500">
          Dieter Rams
        </div>
      </div>
    </section>
  );
}

function EditorialSpotlight({
  id,
  subscribeHref,
}: {
  id: string;
  subscribeHref: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 bg-white px-6 py-24 md:px-12 border-t border-black"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <h2 className="font-serif text-5xl md:text-8xl lowercase tracking-tighter">
          obj. 001
        </h2>
        <div className="font-mono text-xs uppercase tracking-widest text-right max-w-xs leading-relaxed hidden md:block">
          The intersection of brutalism and utility. Designed for those who
          appreciate the raw truth of materials.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 lg:gap-8 items-center">
        <div className="md:col-span-3 flex flex-col justify-end h-full font-mono text-xs uppercase tracking-widest text-neutral-500 gap-8 pb-12">
          <div>
            <strong className="text-black block mb-2">Material</strong>
            Anodized Aluminum
          </div>
          <div>
            <strong className="text-black block mb-2">Weight</strong>
            450g
          </div>
          <div>
            <strong className="text-black block mb-2">Origin</strong>
            Kyoto, Japan
          </div>
        </div>

        <div className="md:col-span-6 relative aspect-[3/4] md:aspect-square bg-neutral-100 group overflow-hidden">
          <MagazineImage
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
            alt="Product"
            className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 mix-blend-multiply"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 mix-blend-overlay"></div>
        </div>

        <div className="md:col-span-3 flex justify-center md:justify-end">
          <a
            href={subscribeHref}
            className="h-32 w-32 rounded-full border border-black flex items-center justify-center font-serif text-xl italic hover:bg-black hover:text-white transition-colors"
          >
            Shop
          </a>
        </div>
      </div>
    </section>
  );
}

function TheArchive({ id }: { id: string }) {
  const reducedMotion = useReducedMotion();
  const archiveImages = [
    "https://images.unsplash.com/photo-1613339027986-b94d85708995?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1699378999301-8c88a6a237d9?q=80&w=764&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop",
  ];

  return (
    <section
      id={id}
      className="scroll-mt-20 bg-black text-white px-6 py-24 md:px-12 border-t border-black"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <h2 className="font-serif text-5xl md:text-8xl lowercase tracking-tighter">
          the archive.
        </h2>
        <a
          href={`#${id}-issues`}
          className="uppercase font-mono text-xs tracking-widest border-b border-white pb-1 hover:text-neutral-400 transition-colors self-start md:self-end"
        >
          View All Past Issues
        </a>
      </div>
      <div
        id={`${id}-issues`}
        className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
      >
        {archiveImages.map((src, i) => (
          <motion.div
            key={i}
            initial={reducedMotion ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[3/4] overflow-hidden bg-neutral-900 mb-6 relative">
              <MagazineImage
                src={src}
                alt={`Archive ${i + 1}`}
                className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
            </div>
            <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest border-t border-white/20 pt-4">
              <span>Issue 0{i + 1}</span>
              <span className="text-neutral-500">202{i}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MagazineImage({
  loading = "lazy",
  alt,
  ...props
}: ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element -- this template also installs in react projects without next/image
  return <img loading={loading} alt={alt} {...props} />;
}
