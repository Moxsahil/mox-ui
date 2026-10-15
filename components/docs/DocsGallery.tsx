"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleCheck, Video } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import PreviewFallback from "@/components/gallery/PreviewFallback";
import PreviewVideo from "@/components/gallery/PreviewVideo";
import { MoxMark } from "@/components/MoxLogo";
import {
  components,
  installCommand,
  templates,
  type ComponentItem,
} from "@/lib/components";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { COMPONENT_GROUPS } from "./docs";

const SLIDE =
  "transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:translate-y-0 group-focus-within/card:translate-y-0 motion-reduce:transition-none [@media(hover:none)]:translate-y-0";

type GallerySection = {
  id: string;
  title: string;
  note: string;
  items: ComponentItem[];
};

const GALLERIES = {
  components: {
    heading: "Components",
    intro: `${components.length} free, animated React components built with Tailwind CSS and Motion. Preview each one live, then install it with the shadcn CLI and own the source.`,
    sections: COMPONENT_GROUPS.map(({ id, label, note, items }) => ({
      id,
      title: label,
      note,
      items,
    })),
  },
  templates: {
    heading: "Templates",
    intro:
      "Complete landing pages you install with the shadcn CLI and adapt into your own site. Each one is free and ships as source you own.",
    sections: [
      {
        id: "templates",
        title: "On Mox UI",
        note: "Hosted in the registry, free to install with the shadcn CLI",
        items: templates,
      },
    ],
  },
} satisfies Record<
  string,
  { heading: string; intro: string; sections: GallerySection[] }
>;

function badgeFor(kind: keyof typeof GALLERIES, item: ComponentItem) {
  if (kind === "templates")
    return (
      <>
        <CircleCheck aria-hidden="true" className="size-3" />
        Free
      </>
    );
  return item.isNew ? "New" : null;
}

function GalleryCard({
  item,
  badge,
}: {
  item: ComponentItem;
  badge: ReactNode;
}) {
  const [playing, setPlaying] = useState(false);
  // touch screens never fire hover, so previews play while they are on screen instead
  const touch = useMediaQuery("(hover: none)");
  const command = installCommand(item);

  return (
    <li
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
      onFocus={() => setPlaying(true)}
      onBlur={() => setPlaying(false)}
      className="group/card overflow-hidden p-5"
    >
      <div className={cn("translate-y-4.5", SLIDE)}>
        <Link
          href={item.href}
          aria-label={item.name}
          className="relative block aspect-16/10 overflow-hidden bg-home-raised shadow-[inset_0_0_0_1px_#0000000a,0_1px_3px_#00000012] outline-none focus-visible:ring-4 focus-visible:ring-home-fg/20"
        >
          {item.preview ? (
            <PreviewVideo
              src={item.preview}
              playing={playing}
              autoPlay={touch}
            />
          ) : item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 1536px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <PreviewFallback />
          )}
          {item.preview && (
            <span className="pointer-events-none absolute left-2 top-2 z-20 rounded-sm bg-home-bg/90 px-1.5 py-1 backdrop-blur">
              <Video aria-hidden="true" className="size-3.5 text-home-fg" />
            </span>
          )}
          {badge && (
            <span className="pointer-events-none absolute right-2 top-2 z-20 flex items-center gap-1 rounded-md bg-home-fg px-2 py-0.5 text-[11px] font-semibold text-home-bg shadow-sm">
              {badge}
            </span>
          )}
        </Link>
        <div
          className={cn(
            "flex translate-y-7.5 items-center gap-2 px-1 pt-3",
            SLIDE,
          )}
        >
          <span className="flex size-4.5 shrink-0 items-center justify-center rounded-[30%] bg-home-raised shadow-[0_0.5px_1px_#00000040,inset_0_-3px_4px_#00000005]">
            <MoxMark className="size-3" />
          </span>
          <Link
            href={item.href}
            tabIndex={-1}
            aria-hidden="true"
            className="min-w-0 flex-1 truncate text-[13px] font-medium leading-4.5 text-home-fg/80"
          >
            {item.name}
          </Link>
          {command && (
            <CopyButton
              value={command}
              label={`Copy ${item.name} install command`}
              iconClassName="size-3"
              className="size-6 rounded-md text-home-muted hover:bg-home-raised hover:text-home-fg"
            />
          )}
        </div>
      </div>
    </li>
  );
}

export default function DocsGallery({
  kind,
}: {
  kind: keyof typeof GALLERIES;
}) {
  const { heading, intro, sections } = GALLERIES[kind];

  return (
    <div className="flex flex-col gap-10">
      <header className="px-1 pt-2">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-home-fg-2 sm:text-base">
          {intro}
        </p>
      </header>
      {sections
        .filter((section) => section.items.length > 0)
        .map((section) => (
          <section key={section.id} aria-labelledby={`${section.id}-heading`}>
            <div className="mb-3 flex items-baseline gap-3 px-1">
              <h2
                id={`${section.id}-heading`}
                className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-home-muted"
              >
                {section.title}
              </h2>
              <span className="text-[11px] text-home-muted/60">
                {section.note}
              </span>
            </div>
            <ul className="grid grid-cols-1 content-start items-start border-l-[0.5px] border-t-[0.5px] border-home-line sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 [&>*]:border-b-[0.5px] [&>*]:border-r-[0.5px] [&>*]:border-home-line">
              {section.items.map((item) => (
                <GalleryCard
                  key={item.href}
                  item={item}
                  badge={badgeFor(kind, item)}
                />
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
