"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import PreviewFallback from "@/components/gallery/PreviewFallback";
import PreviewVideo from "@/components/gallery/PreviewVideo";
import {
  installCommand,
  type ComponentItem,
  type PackageManager,
} from "@/lib/components";
import { cn } from "@/lib/utils";
import { itemMeta } from "./views";

export default function BrowseCard({
  item,
  pm,
  detailed = false,
  metaLabel,
  className,
}: {
  item: ComponentItem;
  pm: PackageManager;
  detailed?: boolean;
  metaLabel?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const command = installCommand(item, pm);

  return (
    <article
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
      onFocus={() => setPlaying(true)}
      onBlur={() => setPlaying(false)}
      className={cn("group/card flex min-w-0 flex-col gap-3", className)}
    >
      {/* the name below is the focusable link, so the preview stays out of the tab order */}
      <Link
        href={item.href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-16/11 overflow-hidden rounded-[18px] border border-home-line bg-home-raised transition-[border-color,box-shadow] duration-200 group-hover/card:border-home-blue/45 group-hover/card:shadow-[0_0_0_4px_rgb(59_111_240/0.12)]"
      >
        {item.preview ? (
          <PreviewVideo src={item.preview} playing={playing} />
        ) : item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="object-cover object-top transition-[object-position] duration-2400 ease-in-out group-hover/card:object-bottom motion-reduce:transition-none"
          />
        ) : (
          <PreviewFallback />
        )}
        {item.isNew && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#2E5BE8] px-2 py-0.5 text-[11px] font-semibold text-white">
            New
          </span>
        )}
      </Link>

      <div className="flex items-start gap-3 px-1">
        <div className="min-w-0 flex-1">
          <Link
            href={item.href}
            className="block truncate text-[15px] font-semibold tracking-tight transition-colors duration-150 hover:text-home-blue"
          >
            {item.name}
          </Link>
          {detailed && item.description && (
            <p className="mt-1 text-sm leading-relaxed text-home-fg-2">
              {item.description}
            </p>
          )}
          <p className="mt-1 font-mono text-[11px] text-home-muted">
            {itemMeta(item, metaLabel)}
          </p>
        </div>
        {command && (
          <CopyButton
            value={command}
            label={`Copy ${item.name} install command`}
            className="size-9 rounded-full border border-home-line-strong text-home-fg-2 hover:border-home-fg-2 hover:text-home-fg"
          />
        )}
      </div>
    </article>
  );
}
