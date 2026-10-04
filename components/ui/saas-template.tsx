"use client";
/* eslint-disable @next/next/no-img-element -- next/image would force every installer to whitelist the cdn host */

import { useId, useState, type ComponentProps } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Getting started", href: "#getting-started" },
  { label: "Components", href: "#components" },
  { label: "Documentation", href: "#documentation" },
];

const DASHBOARD_SRC =
  "https://cdn.21st.dev/assets/mirror/a9/a9c7043f8f41ca34d70f771cba29b4ba6d11ef8f5f51c90d21f220fea109d6af.png";
const GLOW_SRC =
  "https://cdn.21st.dev/assets/mirror/ab/abe6d8090cc14780b846eee062024e4e03274c99d38188554239cd312a7180fa.png";

const KEYFRAMES = `
@keyframes saas-template-fade-in {
  from { opacity: 0; transform: translateY(10px); }
}
@keyframes saas-template-slide-down {
  from { opacity: 0; transform: translateY(-10px); }
}`;

const BUTTON_VARIANTS = {
  default: "bg-white text-black hover:bg-gray-100",
  ghost: "text-white hover:bg-gray-800/50",
  gradient:
    "bg-linear-to-b from-white via-white/95 to-white/60 text-black motion-safe:hover:scale-105 motion-safe:active:scale-95",
};

const BUTTON_SIZES = {
  sm: "h-10 px-5 text-sm",
  lg: "h-12 px-8 text-base",
};

function Button({
  variant = "default",
  size = "sm",
  className,
  ...props
}: ComponentProps<"button"> & {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...props}
    />
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    // sticky, not fixed, so the header stays inside whatever frame hosts the template
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">Logo</div>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 @3xl:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 @3xl:flex">
            <Button variant="ghost">Sign in</Button>
            <Button>Sign up</Button>
          </div>

          <button
            type="button"
            className="text-white @3xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls={menuId}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id={menuId}
          className="border-t border-gray-800/50 bg-black/95 backdrop-blur-md motion-safe:animate-[saas-template-slide-down_0.3s_ease-out] @3xl:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 border-t border-gray-800/50 pt-4">
              <Button variant="ghost">Sign in</Button>
              <Button>Sign up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col items-center px-6 pb-20 pt-6 motion-safe:animate-[saas-template-fade-in_0.6s_ease-out] @3xl:pb-24">
      <aside className="mb-8 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 backdrop-blur-sm">
        <span className="whitespace-nowrap text-center text-xs text-gray-400">
          New version of template is out!
        </span>
        <a
          href="#new-version"
          className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-400 transition-all hover:text-white motion-safe:active:scale-95"
        >
          Read more
          <ArrowRight size={12} />
        </a>
      </aside>

      <h1 className="mb-6 max-w-3xl bg-linear-to-b from-white via-white to-white/60 bg-clip-text px-6 text-center text-4xl font-medium leading-tight tracking-[-0.05em] text-transparent @3xl:text-5xl @5xl:text-6xl">
        Give your big idea <br />
        the website it deserves
      </h1>

      <p className="mb-10 max-w-2xl px-6 text-center text-sm text-gray-400 @3xl:text-base">
        Landing page kit template with React, Shadcn/ui and Tailwind <br />
        that you can copy/paste into your project.
      </p>

      <div className="relative z-10 mb-16 flex items-center gap-4">
        <Button variant="gradient" size="lg" className="rounded-lg">
          Get started
        </Button>
      </div>

      <div className="relative w-full max-w-5xl pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[23%] left-1/2 z-0 w-[90%] -translate-x-1/2"
        >
          <img src={GLOW_SRC} alt="" className="h-auto w-full" />
        </div>
        <img
          src={DASHBOARD_SRC}
          alt="Dashboard preview showing analytics and metrics interface"
          className="relative z-10 h-auto w-full rounded-lg shadow-2xl"
        />
      </div>
    </section>
  );
}

export default function SaasTemplate({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="saas-template"
      className={cn("@container min-h-screen bg-black text-white", className)}
      {...props}
    >
      <style>{KEYFRAMES}</style>
      <Navigation />
      <Hero />
    </div>
  );
}
