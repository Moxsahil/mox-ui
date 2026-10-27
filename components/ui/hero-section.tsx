"use client";
/* eslint-disable @next/next/no-img-element -- plain img keeps the template free of next/image config */

import {
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";
import {
  BookOpen,
  ChartBar,
  ChevronDown,
  Cpu,
  Database,
  Gem,
  Globe,
  Layers,
  Menu,
  Notebook,
  Shapes,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ASSETS = "/assets/hero-section";

// scoped to the root so the template never leaks styles into the host page
const STYLES = `
[data-slot=hero-section] { --background: #fafafa; --foreground: #09090b; --primary: #6655fa; --primary-foreground: #fff; --border: #e4e4e7; --muted-foreground: #5e5e65; --card: #fff; --accent: #f5f5f5; background: var(--background); color: var(--foreground); font-family: var(--font-inter), Inter, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
[data-slot=hero-section]:is(.dark, .dark *) { color-scheme: dark; --background: #101012; --foreground: #f4f4f5; --primary: #6655fa; --primary-foreground: #fff; --border: #303035; --muted-foreground: #a6a6b0; --card: #1c1c20; --accent: #27272d; }
[data-slot=hero-section], [data-slot=hero-section] * { border-color: var(--border); }
[data-slot=hero-section] button, [data-slot=hero-section] a { -webkit-tap-highlight-color: transparent; }
[data-slot=hero-section] button { cursor: pointer; }
[data-slot=hero-section] a { text-decoration: none; }
[data-slot=hero-section] :focus-visible { outline: 2px solid var(--primary); outline-offset: 4px; }
[data-slot=hero-section] .site-header { position: fixed; inset: 0 0 auto; z-index: 30; background: rgb(250 250 250 / 85%); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
[data-slot=hero-section] .header-inner { max-width: 1024px; height: 71px; padding: 0 24px; margin: auto; display: flex; align-items: center; gap: 32px; }
[data-slot=hero-section] .brand { display: flex; align-items: center; gap: 5px; font-size: 19px; font-weight: 600; letter-spacing: -.7px; }
[data-slot=hero-section] .brand-mark { width: 20px; height: 20px; flex-shrink: 0; }
[data-slot=hero-section] .main-nav { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #48484e; }
[data-slot=hero-section] .main-nav > a, [data-slot=hero-section] .nav-trigger { padding: 8px 16px; border-radius: 9px; transition: background .2s, color .2s; }
[data-slot=hero-section] .nav-trigger { display: flex; align-items: center; gap: 8px; }
[data-slot=hero-section] .nav-trigger:hover, [data-slot=hero-section] .nav-trigger.expanded, [data-slot=hero-section] .main-nav > a:hover { background: #f0f0f0; color: #09090b; }
[data-slot=hero-section] .nav-trigger svg { transition: transform .2s; }
[data-slot=hero-section] .nav-trigger.expanded svg { transform: rotate(180deg); }
[data-slot=hero-section] .header-actions { margin-left: auto; display: flex; gap: 10px; }
[data-slot=hero-section] .action { display: inline-flex; align-items: center; justify-content: center; border: 1px solid #d9d9df; background: white; border-radius: 10px; padding: 8px 16px; font-size: 14px; line-height: 20px; font-weight: 500; box-shadow: 0 1px 2px #00000012, inset 0 1px 1px #ffffff60; transition: filter .2s, box-shadow .2s, transform .2s; }
[data-slot=hero-section] .action:hover { filter: brightness(.97); box-shadow: 0 3px 7px #00000012; }
[data-slot=hero-section] .action:active { transform: translateY(1px); }
[data-slot=hero-section] .action.primary { color: white; border-color: #5542df; background: var(--primary); box-shadow: inset 0 1px 1px #ffffff40, 0 3px 5px #00000013; }
[data-slot=hero-section] .header-actions .action { font-size: 12px; padding: 6px 13px; }
[data-slot=hero-section] .mobile-toggle { display: none; }
[data-slot=hero-section] .menu-backdrop { position: fixed; inset: 71px 0 0; z-index: 20; backdrop-filter: blur(7px); background: #fafafa30; animation: hero-section-veil-in .2s ease; }
[data-slot=hero-section] .mega-menu { max-width: 976px; margin: auto; padding: 20px 0 38px; border-top: 1px dotted #d4d4d8; animation: hero-section-menu-in .22s ease both; }
[data-slot=hero-section] .mega-menu h2 { color: #71717a; font-size: 12px; font-weight: 500; text-transform: uppercase; margin: 0 0 12px; }
[data-slot=hero-section] .product-grid { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 24px; }
[data-slot=hero-section] .product-grid > div + div { border-left: 1px solid var(--border); padding-left: 16px; }
[data-slot=hero-section] .menu-links { display: grid; gap: 12px; }
[data-slot=hero-section] .product-grid > div:nth-child(2) .menu-links, [data-slot=hero-section] .solutions-grid .menu-links { grid-template-columns: 1fr 1fr; }
[data-slot=hero-section] .menu-links a { display: flex; gap: 10px; align-items: center; border-radius: 8px; padding: 6px 0; }
[data-slot=hero-section] .menu-links a:hover { background: #eeeeef; }
[data-slot=hero-section] .menu-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 38px; height: 38px; border: 1px solid #e5e5e5; border-radius: 12px; box-shadow: 0 1px 1px #00000015; }
[data-slot=hero-section] .menu-links strong { display: block; font-size: 14px; font-weight: 500; }
[data-slot=hero-section] .menu-links small { display: block; font-size: 12px; color: #71717a; margin-top: 2px; }
[data-slot=hero-section] .changelog > a { font-size: 14px; font-weight: 500; }
[data-slot=hero-section] .changelog p { font-size: 12px; line-height: 1.6; color: #71717a; margin-top: 8px; }
[data-slot=hero-section] .solutions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
[data-slot=hero-section] .content-links { padding-left: 16px; border-left: 1px solid var(--border); display: flex; flex-direction: column; gap: 14px; }
[data-slot=hero-section] .content-links h2 { margin-bottom: 4px; }
[data-slot=hero-section] .content-links a { display: flex; gap: 12px; font-size: 14px; }
[data-slot=hero-section] .hero-copy { max-width: 1024px; padding: 158px 24px 79px; margin: auto; }
[data-slot=hero-section] .hero-copy h1 { font-size: 60px; line-height: 1; letter-spacing: -1.5px; font-weight: 600; max-width: 850px; margin: 0; }
[data-slot=hero-section] .hero-copy p { max-width: 460px; margin: 20px 0 24px; font-size: 20px; line-height: 28px; color: #5e5e65; }
[data-slot=hero-section] .hero-actions { display: flex; gap: 10px; }
[data-slot=hero-section] .showcase { position: relative; isolation: isolate; }
[data-slot=hero-section] .scenic-background { position: absolute; z-index: -2; width: 100%; height: 100%; object-fit: cover; top: 0; opacity: .55; mask-image: linear-gradient(transparent, #000 22%, #000 60%, transparent); }
[data-slot=hero-section] .tab-rule { border-block: 1px solid #d4d4d880; }
[data-slot=hero-section] .feature-tabs { max-width: 680px; margin: auto; display: grid; grid-template-columns: repeat(3, 1fr); }
[data-slot=hero-section] .tab-cell { padding: 11px 16px; display: flex; justify-content: center; border-left: 1px solid #d4d4d880; }
[data-slot=hero-section] .tab-cell:last-child { border-right: 1px solid #d4d4d880; }
[data-slot=hero-section] .tab-cell button { display: flex; align-items: center; gap: 9px; white-space: nowrap; padding: 10px 16px; border: 1px solid #dedee2; border-radius: 99px; font-size: 14px; color: #626269; background: #fafafa35; transition: background .25s, color .25s, box-shadow .25s; }
[data-slot=hero-section] .tab-cell button[aria-selected=true] { background: white; color: #09090b; box-shadow: 0 3px 6px #0000000d; }
[data-slot=hero-section] .tab-cell button:hover { color: #09090b; background: #ffffff80; }
[data-slot=hero-section] .dashboard-frame { position: relative; margin: -8px auto 0; width: calc(100% - 48px); max-width: 1074px; aspect-ratio: 1.57; border: 1px solid #d4d4d8; border-radius: 20px; padding: 12px; background: #ffffffa6; box-shadow: 0 0 0 4px #ffffff70 inset, 0 10px 45px #0000000a; overflow: hidden; }
[data-slot=hero-section] .dashboard-image { position: absolute; top: 12px; left: 12px; width: calc(100% - 24px); height: auto; border-radius: 10px; opacity: 0; filter: blur(5px); transform: translateY(8px); transition: opacity .4s ease, filter .4s ease, transform .4s ease; }
[data-slot=hero-section] .dashboard-image.is-active { opacity: 1; filter: blur(0); transform: translateY(0); }
[data-slot=hero-section] .showcase-fade { position: absolute; inset: 45% 0 -1px; pointer-events: none; background: linear-gradient(transparent, var(--background) 90%); }
[data-slot=hero-section] .trusted { max-width: 1024px; padding: 76px 24px 72px; margin: auto; }
[data-slot=hero-section] .trusted > p { text-align: center; color: #626269; font-size: 18px; line-height: 28px; }
[data-slot=hero-section] .trusted > p span { color: #18181b; }
@keyframes hero-section-menu-in{from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); }}
@keyframes hero-section-veil-in{from { opacity: 0; } to { opacity: 1; }}
@media(max-width: 767px) {
  [data-slot=hero-section] .header-inner { height: 64px; padding: 0 24px; gap: 16px; }
  [data-slot=hero-section] .header-actions { gap: 8px; }
  [data-slot=hero-section] .header-actions .action:first-child { display: none; }
  [data-slot=hero-section] .mobile-toggle { display: block; }
  [data-slot=hero-section] .main-nav { display: none; }
  [data-slot=hero-section] .main-nav.mobile-open { display: flex; position: absolute; top: 64px; left: 0; right: 0; padding: 16px 24px; background: #fafafa; flex-wrap: wrap; gap: 4px; }
  [data-slot=hero-section] .main-nav > a, [data-slot=hero-section] .nav-trigger { padding: 8px 10px; }
  [data-slot=hero-section] .mega-menu { margin-top: 55px; padding: 20px 24px; max-height: 65vh; overflow: auto; }
  [data-slot=hero-section] .product-grid, [data-slot=hero-section] .solutions-grid { grid-template-columns: 1fr; gap: 24px; }
  [data-slot=hero-section] .product-grid > div + div, [data-slot=hero-section] .content-links { border-left: 0; padding-left: 0; }
  [data-slot=hero-section] .menu-backdrop { top: 64px; }
  [data-slot=hero-section] .hero-copy { padding: 125px 24px 56px; }
  [data-slot=hero-section] .hero-copy h1 { font-size: 40px; line-height: 1.06; letter-spacing: -1.2px; }
  [data-slot=hero-section] .desktop-break { display: none; }
  [data-slot=hero-section] .hero-copy p { font-size: 18px; line-height: 27px; margin-top: 24px; }
  [data-slot=hero-section] .feature-tabs { width: 100%; }
  [data-slot=hero-section] .tab-cell { padding: 12px 4px; }
  [data-slot=hero-section] .tab-cell button { padding: 9px 10px; font-size: 11px; gap: 5px; }
  [data-slot=hero-section] .tab-cell button svg { width: 13px; }
  [data-slot=hero-section] .dashboard-frame { width: calc(100% - 24px); padding: 5px; border-radius: 12px; aspect-ratio: 1.35; }
  [data-slot=hero-section] .dashboard-image { top: 6px; left: 6px; width: calc(100% - 12px); border-radius: 6px; }
  [data-slot=hero-section] .trusted { padding-top: 36px; }
  [data-slot=hero-section] .trusted > p { font-size: 15px; line-height: 24px; }
}
@media(prefers-reduced-motion: reduce) {
  [data-slot=hero-section], [data-slot=hero-section] *, [data-slot=hero-section]::before, [data-slot=hero-section] *::before, [data-slot=hero-section]::after, [data-slot=hero-section] *::after { animation: none !important; transition: none !important; }
}
[data-slot=hero-section]:is(.dark, .dark *) .site-header { background: rgb(16 16 18 / 88%); }
[data-slot=hero-section]:is(.dark, .dark *) .main-nav, [data-slot=hero-section]:is(.dark, .dark *) .hero-copy p, [data-slot=hero-section]:is(.dark, .dark *) .trusted > p, [data-slot=hero-section]:is(.dark, .dark *) .mega-menu h2, [data-slot=hero-section]:is(.dark, .dark *) .menu-links small, [data-slot=hero-section]:is(.dark, .dark *) .changelog p { color: var(--muted-foreground); }
[data-slot=hero-section]:is(.dark, .dark *) .nav-trigger:hover, [data-slot=hero-section]:is(.dark, .dark *) .nav-trigger.expanded, [data-slot=hero-section]:is(.dark, .dark *) .main-nav > a:hover, [data-slot=hero-section]:is(.dark, .dark *) .menu-links a:hover { background: var(--accent); color: var(--foreground); }
[data-slot=hero-section]:is(.dark, .dark *) .action { color: var(--foreground); background: var(--card); border-color: var(--border); box-shadow: inset 0 1px 0 #ffffff0c, 0 2px 4px #00000030; }
[data-slot=hero-section]:is(.dark, .dark *) .action:hover { filter: brightness(1.15); }
[data-slot=hero-section]:is(.dark, .dark *) .action.primary { background: var(--primary); color: var(--primary-foreground); border-color: #8577ff; }
[data-slot=hero-section]:is(.dark, .dark *) .menu-backdrop { background: #10101270; }
[data-slot=hero-section]:is(.dark, .dark *) .mega-menu, [data-slot=hero-section]:is(.dark, .dark *) .menu-icon, [data-slot=hero-section]:is(.dark, .dark *) .tab-rule, [data-slot=hero-section]:is(.dark, .dark *) .tab-cell, [data-slot=hero-section]:is(.dark, .dark *) .tab-cell:last-child { border-color: var(--border); }
[data-slot=hero-section]:is(.dark, .dark *) .menu-icon { background: var(--card); }
[data-slot=hero-section]:is(.dark, .dark *) .main-nav.mobile-open { background: var(--background); }
[data-slot=hero-section]:is(.dark, .dark *) .scenic-background { opacity: .28; filter: brightness(.65) saturate(.7); }
[data-slot=hero-section]:is(.dark, .dark *) .tab-cell button { color: var(--muted-foreground); border-color: var(--border); background: #18181c80; }
[data-slot=hero-section]:is(.dark, .dark *) .tab-cell button:hover, [data-slot=hero-section]:is(.dark, .dark *) .tab-cell button[aria-selected=true] { color: var(--foreground); background: var(--accent); border-color: #45454e; box-shadow: 0 2px 8px #00000030; }
[data-slot=hero-section]:is(.dark, .dark *) .dashboard-frame { background: #1c1c20cc; border-color: var(--border); box-shadow: inset 0 0 0 4px #ffffff04, 0 10px 45px #00000040; }
[data-slot=hero-section]:is(.dark, .dark *) .dashboard-image { filter: invert(.93) hue-rotate(180deg) blur(5px); }
[data-slot=hero-section]:is(.dark, .dark *) .dashboard-image.is-active { filter: invert(.93) hue-rotate(180deg) blur(0); }
[data-slot=hero-section]:is(.dark, .dark *) .trusted > p span { color: var(--foreground); }
[data-slot=hero-section] .company-rail > p { max-width: 590px; margin-inline: auto; }
[data-slot=hero-section] .company-rail .company-category { color: var(--muted-foreground); font: inherit; transition: color 200ms ease; }
[data-slot=hero-section] .company-rail .company-category[aria-pressed=true], [data-slot=hero-section] .company-rail .company-category:hover { color: var(--foreground); }
[data-slot=hero-section] .company-logo-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: center; gap: 32px; margin-top: 64px; perspective: 800px; }
[data-slot=hero-section] .company-logo-slot { position: relative; height: 40px; }
[data-slot=hero-section] .company-logo-layer { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; filter: blur(6px); transform: translateY(24px) scale(.5); transition: opacity 400ms ease-out, filter 400ms ease-out, transform 400ms cubic-bezier(.22,1,.36,1); transition-delay: var(--logo-delay); pointer-events: none; }
[data-slot=hero-section] .company-logo-layer[data-active=true] { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); transition-delay: calc(200ms + var(--logo-delay)); }
[data-slot=hero-section] .company-logo-layer img { width: auto; max-width: 110px; height: 28px; object-fit: contain; filter: brightness(0); }
[data-slot=hero-section]:is(.dark, .dark *) .company-logo-layer img { filter: brightness(0) invert(1); }
@media(max-width: 767px) {
  [data-slot=hero-section] .company-logo-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 40px; gap: 24px; }
  [data-slot=hero-section] .company-logo-layer img { max-width: 90px; height: 24px; }
}
@media(prefers-reduced-motion: reduce) {
  [data-slot=hero-section] .company-logo-layer { transform: none; filter: none; }
}
`;

const features = [
  {
    name: "AI",
    description: "Generate Insights and Recommendations",
    icon: Sparkles,
    href: "#ux",
  },
  {
    name: "Performance",
    description: "Lightning-fast load times",
    icon: Zap,
    href: "#performance",
  },
  {
    name: "Security",
    description: "Keep your data safe and secure",
    icon: Shield,
    href: "#security",
  },
];
const moreFeatures = [
  {
    name: "Automation",
    description: "Automate your workflow",
    icon: Workflow,
    href: "#ux",
  },
  {
    name: "Scalability",
    description: "Scale your application",
    icon: Layers,
    href: "#performance",
  },
  {
    name: "Backup",
    description: "Keep your data backed up",
    icon: Database,
    href: "#backup",
  },
  {
    name: "Security",
    description: "Keep your data safe and secure",
    icon: Shield,
    href: "#security",
  },
  {
    name: "Partnerships",
    description: "Get help when you need it",
    icon: Gem,
    href: "#support",
  },
  {
    name: "Mobile App",
    description: "Get help when you need it",
    icon: Smartphone,
    href: "#mobile",
  },
];
const solutions = [
  {
    name: "Marketplace",
    description: "Find and buy AI tools",
    icon: ShoppingBag,
    href: "#marketplace",
  },
  {
    name: "API Integration",
    description: "Integrate AI tools into your app",
    icon: Cpu,
    href: "#api",
  },
  moreFeatures[4],
  moreFeatures[5],
];

const tabs = [
  { label: "Task Management", image: `${ASSETS}/tasks.png`, icon: Globe },
  { label: "Analytics", image: `${ASSETS}/analytics.png`, icon: ChartBar },
  { label: "AI Copilot", image: `${ASSETS}/copilot.png`, icon: Sparkles },
];

const groups = [
  {
    category: "Generative AI Companies",
    logos: ["openai", "bolt", "cisco", "hulu", "spotify"],
  },
  {
    category: "Hosting Providers",
    logos: ["supabase", "cisco", "hulu", "spotify", "vercel"],
  },
  {
    category: "Payments Providers",
    logos: ["stripe", "paypal", "vercel", "cisco", "beacon"],
  },
  {
    category: "Streaming Providers",
    logos: ["prime-video", "hulu", "spotify", "cisco", "beacon"],
  },
];
const names: Record<string, string> = {
  openai: "OpenAI",
  bolt: "Bolt",
  cisco: "Cisco",
  hulu: "Hulu",
  spotify: "Spotify",
  supabase: "Supabase",
  vercel: "Vercel",
  stripe: "Stripe",
  paypal: "PayPal",
  beacon: "Beacon",
  "prime-video": "Prime Video",
};

function FeatureLinks({ items }: { items: typeof features }) {
  return (
    <div className="menu-links">
      {items.map((item) => (
        <a href={item.href} key={item.name}>
          <span className="menu-icon">
            <item.icon size={17} />
          </span>
          <span>
            <strong>{item.name}</strong>
            <small>{item.description}</small>
          </span>
        </a>
      ))}
    </div>
  );
}

function HeroHeader() {
  const [open, setOpen] = useState<"Product" | "Solutions" | null>(null);
  const [mobile, setMobile] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, []);

  return (
    <>
      {(open || mobile) && (
        <div
          className="menu-backdrop"
          onClick={() => {
            setOpen(null);
            setMobile(false);
          }}
          aria-hidden="true"
        />
      )}
      <header className="site-header" onMouseLeave={() => setOpen(null)}>
        <div className="header-inner">
          <a className="brand" href="#" aria-label="Orbit home">
            <svg
              className="brand-mark"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="10"
                cy="10"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="15"
                cy="5"
                r="3"
                fill="currentColor"
                stroke="var(--background)"
                strokeWidth="2"
              />
            </svg>
            orbit
          </a>
          <nav
            className={mobile ? "main-nav mobile-open" : "main-nav"}
            aria-label="Main navigation"
          >
            {(["Product", "Solutions"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={
                  open === item ? "nav-trigger expanded" : "nav-trigger"
                }
                aria-expanded={open === item}
                aria-controls={menuId}
                onMouseEnter={() => setOpen(item)}
                onClick={() => setOpen(open === item ? null : item)}
              >
                {item}
                <ChevronDown size={12} />
              </button>
            ))}
            <a href="#" onMouseEnter={() => setOpen(null)}>
              Pricing
            </a>
            <a href="#" onMouseEnter={() => setOpen(null)}>
              Company
            </a>
          </nav>
          <div className="header-actions">
            <a className="action" href="#">
              Login
            </a>
            <a className="action primary" href="#">
              Get Started
            </a>
          </div>
          <button
            type="button"
            className="mobile-toggle"
            aria-label={mobile ? "Close navigation" : "Open navigation"}
            aria-expanded={mobile}
            onClick={() => {
              setMobile(!mobile);
              setOpen(null);
            }}
          >
            {mobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="mega-menu" id={menuId} key={open}>
            {open === "Product" ? (
              <div className="product-grid">
                <div>
                  <h2>Features</h2>
                  <FeatureLinks items={features} />
                </div>
                <div>
                  <h2>More Features</h2>
                  <FeatureLinks items={moreFeatures} />
                </div>
                <div className="changelog">
                  <h2>Changelog</h2>
                  <a href="#">Multimodal Learning</a>
                  <p>
                    Explore how our platform integrates text, image, and audio
                    processing into a unified framework.
                  </p>
                </div>
              </div>
            ) : (
              <div className="solutions-grid">
                <div>
                  <h2>Use Cases</h2>
                  <FeatureLinks items={solutions} />
                </div>
                <div className="content-links">
                  <h2>Content</h2>
                  <a href="#">
                    <BookOpen size={17} />
                    Announcements
                  </a>
                  <a href="#">
                    <Shapes size={17} />
                    Resources
                  </a>
                  <a href="#">
                    <Notebook size={17} />
                    Blog
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}

function CompanyRail() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // re-arms on every change so a clicked group gets its full 3.2s
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      clearTimeout(timer);
      if (!paused && !reducedMotion.matches && !document.hidden) {
        timer = setTimeout(
          () => setActive((current) => (current + 1) % groups.length),
          3200,
        );
      }
    };
    sync();
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearTimeout(timer);
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [active, paused]);

  return (
    <section
      className="trusted company-rail"
      aria-label="Trusted by leading teams"
      // only keyboard focus pauses: hover or a clicked button would otherwise stall the rail indefinitely
      onFocus={(event) => {
        if (event.target.matches(":focus-visible")) setPaused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <p>
        Orbit is trusted by leading teams from{" "}
        {groups.map((group, index) => (
          <span key={group.category}>
            <button
              type="button"
              className="company-category"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              {group.category}
            </button>
            {index < groups.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <div
        className="company-logo-grid"
        aria-label={`${groups[active].category} company logos`}
      >
        {[0, 1, 2, 3, 4].map((slot) => (
          <div
            className="company-logo-slot"
            key={slot}
            style={{ "--logo-delay": `${slot * 55}ms` } as CSSProperties}
          >
            {groups.map((group, index) => (
              <div
                key={group.category}
                className="company-logo-layer"
                data-active={active === index}
                aria-hidden={active !== index}
              >
                <img
                  src={`${ASSETS}/logos/${group.logos[slot]}.svg`}
                  alt={names[group.logos[slot]]}
                  width={110}
                  height={32}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HeroSection({
  className,
  ...props
}: ComponentProps<"div">) {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabId = (index: number) => `${id}-tab-${index}`;
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;

  return (
    <div data-slot="hero-section" className={cn(className)} {...props}>
      <style>{STYLES}</style>
      <HeroHeader />
      <main>
        <section className="hero-section" aria-labelledby={titleId}>
          <div className="hero-copy">
            <h1 id={titleId}>
              Payments infrastructure
              <br className="desktop-break" /> built for SaaS that Scales
            </h1>
            <p>
              Streamline your team&apos;s meetings with our AI-driven assistant,
              open source and works.
            </p>
            <div className="hero-actions">
              <a className="action primary" href="#">
                Get Started
              </a>
              <a className="action" href="#">
                Watch Demo
              </a>
            </div>
          </div>
          <div className="showcase">
            <img
              className="scenic-background"
              src={`${ASSETS}/background.jpg`}
              alt=""
            />
            <div className="tab-rule">
              <div
                className="feature-tabs"
                role="tablist"
                aria-label="Product preview"
              >
                {tabs.map((tab, index) => (
                  <div className="tab-cell" key={tab.label}>
                    <button
                      type="button"
                      role="tab"
                      id={tabId(index)}
                      aria-selected={index === active}
                      aria-controls={panelId}
                      tabIndex={index === active ? 0 : -1}
                      onClick={() => setActive(index)}
                      onKeyDown={(event) => {
                        const next =
                          event.key === "ArrowRight"
                            ? (index + 1) % 3
                            : event.key === "ArrowLeft"
                              ? (index + 2) % 3
                              : event.key === "Home"
                                ? 0
                                : event.key === "End"
                                  ? 2
                                  : null;
                        if (next !== null) {
                          event.preventDefault();
                          setActive(next);
                          document.getElementById(tabId(next))?.focus();
                        }
                      }}
                    >
                      <tab.icon size={16} strokeWidth={1.6} />
                      {tab.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="dashboard-frame"
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId(active)}
              tabIndex={0}
            >
              {tabs.map((tab, index) => (
                <img
                  key={tab.image}
                  className={`dashboard-image ${index === active ? "is-active" : ""}`}
                  src={tab.image}
                  alt={`${tab.label} dashboard`}
                  aria-hidden={index !== active}
                />
              ))}
            </div>
            <div className="showcase-fade" />
          </div>
        </section>
        <CompanyRail />
      </main>
    </div>
  );
}
