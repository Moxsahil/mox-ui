import type { ReactNode } from "react";
import CopyButton from "@/components/CopyButton";
import { components, installCommand } from "@/lib/components";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import GlassAccent from "./GlassAccent";
import CodeBento from "./CodeBento";
import {
  ClaudeLogo,
  CodexLogo,
  CursorLogo,
  ShadcnLogo,
  V0Logo,
} from "./StackLogos";
import TerminalCard from "./TerminalCard";
import { WRAP } from "./wrap";

const OTP = components.find((item) => item.registry === "otp-input");
const DELETE = components.find((item) => item.registry === "delete-button");
const DELETE_COMMAND = DELETE ? installCommand(DELETE) : null;

const LLMS = `${SITE_URL.replace(/^https?:\/\//, "")}/llms.txt`;

const PROMPT = DELETE_COMMAND
  ? `Add the Delete button from Mox UI with ${DELETE_COMMAND} and use it for every delete action in my app.`
  : null;

const AI_TOOLS: {
  name: string;
  logo: (props: { className?: string }) => ReactNode;
}[] = [
  { name: "Claude", logo: ClaudeLogo },
  { name: "Codex", logo: CodexLogo },
  { name: "v0", logo: V0Logo },
  { name: "Cursor", logo: CursorLogo },
];

const CARD =
  "relative isolate flex flex-col overflow-hidden rounded-[20px] shadow-[inset_0_0_0_1px_rgba(127,127,127,0.18)] lg:min-h-[500px]";
const ART = "flex flex-1 items-center justify-center px-5.5 pb-3 pt-8 min-w-0";
// one fixed height for every caption, so the titles line up across the row
// sizes follow 21st.dev's cards; one min height keeps the titles level across the row
const TEXT = "min-h-22 px-5 pb-6 pt-3 md:px-8 lg:min-h-29.5";
const TITLE = "flex h-8 items-center gap-2.5 text-[17px] font-semibold";
const DESC = "mt-2 max-w-[34ch] text-[16px] leading-relaxed";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
  >
    <path d="M4.5 12.5 9.5 17.5 19.5 7" />
  </svg>
);

const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="size-7"
  >
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-7">
    <path d="M12 2.5c.4 4.9 2.6 7.1 7.5 7.5-4.9.4-7.1 2.6-7.5 7.5-.4-4.9-2.6-7.1-7.5-7.5 4.9-.4 7.1-2.6 7.5-7.5Z" />
    <path d="M19 15.5c.2 2.2 1.1 3.1 3.3 3.3-2.2.2-3.1 1.1-3.3 3.3-.2-2.2-1.1-3.1-3.3-3.3 2.2-.2 3.1-1.1 3.3-3.3Z" />
  </svg>
);

export default function InstallPaths() {
  return (
    <section
      aria-labelledby="install-heading"
      className={cn(WRAP, "pb-18 md:pb-32")}
    >
      <div className="mb-9 flex max-w-xl flex-col gap-4 md:mb-14">
        <h2
          id="install-heading"
          className="text-balance text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.035em]"
        >
          One command.
          <br />
          <GlassAccent>Your</GlassAccent> code.
        </h2>
        <p className="max-w-lg text-[17px] text-home-fg-2">
          Every component ships through the shadcn registry. Run it yourself or
          hand it to your agent, and the source lands in your repo.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <article
          className={cn(
            CARD,
            "bg-[radial-gradient(120%_90%_at_15%_0%,#3F3F46,#18181B)] text-[#FAFAFA]",
          )}
        >
          <div className={ART}>{OTP && <TerminalCard item={OTP} />}</div>
          <div className={TEXT}>
            <h3 className={TITLE}>
              <ShadcnLogo className="size-7" />
              shadcn CLI
            </h3>
            <p className={cn(DESC, "text-[#FAFAFA]/75")}>
              Works with npm, pnpm, yarn and bun. Dependencies come along.
            </p>
          </div>
        </article>

        <article
          className={cn(
            CARD,
            "bg-[radial-gradient(70%_45%_at_22%_6%,rgba(255,255,255,0.9),transparent_70%),radial-gradient(55%_40%_at_88%_18%,rgba(199,210,254,0.95),transparent_70%),radial-gradient(85%_60%_at_55%_92%,rgba(23,51,170,0.95),transparent_72%),linear-gradient(180deg,#B4C2FF_0%,#5B7CFA_48%,#2340C9_100%)] text-white",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-linear-to-t from-black/45 to-transparent"
          />
          <div className={ART}>
            <div className="flex w-full max-w-82.5 flex-col gap-3.5 rounded-2xl bg-white p-4.5 text-[#09090B] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.06)]">
              <p className="text-[15px] font-semibold leading-snug">
                Add the Matrix orb from Mox UI to the voice screen
                <span
                  aria-hidden
                  className="ml-0.5 inline-block h-3.5 w-1.75 translate-y-0.5 animate-pulse bg-[#09090B]"
                />
              </p>
              <ul className="flex flex-col gap-2.5 text-[13px] text-[#71717A]">
                {[
                  ["Read", LLMS],
                  ["Ran", "npx shadcn@latest add mox/mox-ui/matrix-orb"],
                  ["Edited", "app/voice/page.tsx"],
                ].map(([verb, target]) => (
                  <li key={verb} className="grid grid-cols-[16px_1fr] gap-2">
                    <CheckIcon className="mt-0.5 size-3.5 text-[#16A34A]" />
                    <span>
                      {verb}{" "}
                      <span className="font-mono text-xs text-[#09090B] wrap-anywhere">
                        {target}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-[#09090B]/10 pt-3 text-xs">
                <span className="font-mono">
                  <span className="text-[#16A34A]">+18</span>{" "}
                  <span className="text-[#DC2626]">−2</span>
                </span>
                <span className="inline-flex h-7 items-center rounded-full bg-[#09090B] px-3 font-semibold text-[#FAFAFA]">
                  Review changes
                </span>
              </div>
            </div>
          </div>
          <div className={TEXT}>
            <h3 className={TITLE}>
              <FileIcon />
              Coding agents
            </h3>
            <p className={cn(DESC, "text-white/85")}>
              Your agent reads llms.txt and installs any component for you.
            </p>
          </div>
        </article>

        <article className={cn(CARD, "bg-[#F6F6F1] text-[#171717]")}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-16 top-16 size-72 rounded-full bg-[#4B73FF] opacity-40 blur-3xl" />
            <div className="absolute left-1/4 top-36 size-80 rounded-full bg-[#FF66F4] opacity-35 blur-3xl" />
            <div className="absolute -right-16 top-24 size-80 rounded-full bg-[#8B5CF6] opacity-35 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-[#F6F6F1]" />
          </div>
          <div className={ART}>
            {PROMPT && DELETE_COMMAND && (
              <div className="w-full max-w-85 overflow-hidden rounded-[14px] bg-[#1C1C1E] text-[#FAFAFA] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 py-2 pl-3.5 pr-2">
                  <span className="text-xs font-semibold">Prompt</span>
                  <CopyButton
                    value={PROMPT}
                    label="Copy prompt"
                    className="h-7 rounded-full bg-white px-3 text-xs font-semibold text-[#09090B] hover:text-[#09090B]"
                  >
                    Copy
                  </CopyButton>
                </div>
                <p className="px-3.5 py-3.5 text-[13px] leading-relaxed text-white/70">
                  {PROMPT.slice(0, PROMPT.indexOf(DELETE_COMMAND))}
                  <span className="font-mono text-xs text-white wrap-anywhere">
                    {DELETE_COMMAND}
                  </span>
                  {PROMPT.slice(
                    PROMPT.indexOf(DELETE_COMMAND) + DELETE_COMMAND.length,
                  )}
                </p>
                <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3.5 py-3">
                  <span className="text-xs text-white/55">Paste into</span>
                  <ul className="flex items-center gap-1.5">
                    {AI_TOOLS.map(({ name, logo: Logo }) => (
                      <li
                        key={name}
                        title={name}
                        className="grid size-8 place-items-center rounded-full bg-white"
                      >
                        <Logo className="size-4" />
                        <span className="sr-only">{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className={TEXT}>
            <h3 className={TITLE}>
              <SparkIcon />
              Prompt any AI tool
            </h3>
            <p className={cn(DESC, "text-[#525252]")}>
              Paste it into Claude, Codex or v0 to add the component.
            </p>
          </div>
        </article>
      </div>

      {DELETE?.usage && <CodeBento usage={DELETE.usage} />}
    </section>
  );
}
