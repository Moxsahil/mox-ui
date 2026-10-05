"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  installCommand,
  PACKAGE_MANAGERS,
  type ComponentItem,
  type PackageManager,
} from "@/lib/components";
import { cn } from "@/lib/utils";

export default function TerminalCard({ item }: { item: ComponentItem }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [switched, setSwitched] = useState(false);
  const reduce = useReducedMotion();
  const file = `components/ui/${item.registry}.tsx`;

  const lines: { mark?: string; text: string }[] = [
    { mark: "$", text: installCommand(item, pm) ?? "" },
    { mark: "✔", text: "Checking registry." },
    ...(item.dependencies?.length
      ? [{ mark: "✔", text: "Installing dependencies." }]
      : []),
    { mark: "✔", text: "Created 1 file:" },
    { text: `  - ${file}` },
  ];

  return (
    <div className="w-full max-w-85 overflow-hidden rounded-[14px] bg-[#09090B]/90 text-[#FAFAFA] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)]">
      <div
        role="group"
        aria-label="Package manager"
        className="flex gap-0.5 border-b border-[#FAFAFA]/10 p-1.5"
      >
        {PACKAGE_MANAGERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={pm === option}
            onClick={() => {
              setSwitched(true);
              setPm(option);
            }}
            className={cn(
              "h-6.5 flex-1 cursor-pointer rounded-[7px] font-mono text-xs transition-colors duration-200",
              pm === option
                ? "bg-[#FAFAFA]/12 text-[#FAFAFA]"
                : "text-[#A1A1AA] hover:text-[#FAFAFA]",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div
        key={pm}
        className="whitespace-pre-wrap px-4 pb-4 pt-3.5 font-mono text-xs leading-[1.75] wrap-anywhere"
      >
        {lines.map((line, index) => (
          <motion.span
            key={index}
            className={cn("block", !line.mark && "text-[#A1A1AA]")}
            // the first render stays put so the card reads complete before hydration
            initial={reduce || !switched ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
              delay: index * 0.09,
            }}
          >
            {line.mark ? (
              <>
                <span
                  className={
                    line.mark === "$" ? "text-[#A1A1AA]" : "text-[#4ADE80]"
                  }
                >
                  {line.mark}
                </span>{" "}
                {line.text}
              </>
            ) : (
              line.text
            )}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
