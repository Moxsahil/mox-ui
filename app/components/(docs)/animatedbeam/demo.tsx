"use client";

import { forwardRef, useRef, type ComponentPropsWithoutRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const Circle = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="img"
        data-slot="animated-beam-node"
        {...props}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-2xl border border-border bg-card/90 p-2.5 shadow-sm backdrop-blur-md transition-all duration-300 motion-safe:hover:scale-105 hover:border-primary/40 hover:shadow-md motion-reduce:transition-none",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Circle.displayName = "Circle";

export default function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const driveRef = useRef<HTMLDivElement>(null);
  const notionRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const zapierRef = useRef<HTMLDivElement>(null);
  const messengerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[380px] w-full max-w-2xl items-center justify-center overflow-hidden rounded-2xl border border-border bg-background/50 p-6 shadow-sm backdrop-blur-xl sm:p-10"
    >
      <div className="flex size-full max-h-[240px] max-w-lg flex-col items-stretch justify-between gap-8">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={driveRef} aria-label="Google Drive">
            <Icons.googleDrive />
          </Circle>
          <Circle ref={docsRef} aria-label="Google Docs">
            <Icons.googleDocs />
          </Circle>
        </div>

        <div className="flex flex-row items-center justify-between">
          <Circle ref={notionRef} aria-label="Notion">
            <Icons.notion />
          </Circle>

          <Circle
            ref={hubRef}
            className="size-16 rounded-2xl border-primary/20 bg-card p-3.5 shadow-xl shadow-primary/10 ring-8 ring-primary/5"
            aria-label="OpenAI"
          >
            <Icons.openai />
          </Circle>

          <Circle ref={zapierRef} aria-label="Zapier">
            <Icons.zapier />
          </Circle>
        </div>

        <div className="flex flex-row items-center justify-between">
          <Circle ref={whatsappRef} aria-label="WhatsApp">
            <Icons.whatsapp />
          </Circle>
          <Circle ref={messengerRef} aria-label="Messenger">
            <Icons.messenger />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={driveRef}
        toRef={hubRef}
        curvature={-50}
        endYOffset={-6}
        gradientStartColor="#3b82f6"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={notionRef}
        toRef={hubRef}
        gradientStartColor="#06b6d4"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={whatsappRef}
        toRef={hubRef}
        curvature={50}
        endYOffset={6}
        gradientStartColor="#10b981"
        gradientStopColor="#06b6d4"
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={docsRef}
        toRef={hubRef}
        curvature={-50}
        endYOffset={-6}
        gradientStartColor="#f59e0b"
        gradientStopColor="#6366f1"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={zapierRef}
        toRef={hubRef}
        gradientStartColor="#f97316"
        gradientStopColor="#ec4899"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={messengerRef}
        toRef={hubRef}
        curvature={50}
        endYOffset={6}
        gradientStartColor="#8b5cf6"
        gradientStopColor="#6366f1"
      />
    </div>
  );
}

const Icons = {
  notion: () => (
    <svg
      aria-hidden="true"
      className="size-full fill-foreground"
      viewBox="0 0 100 100"
    >
      <path
        d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  ),
  openai: () => (
    <svg
      aria-hidden="true"
      className="size-full fill-foreground"
      viewBox="0 0 24 24"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  ),
  googleDrive: () => (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 87.3 78">
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
        fill="#00832d"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
        fill="#2684fc"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
        fill="#ffba00"
      />
    </svg>
  ),
  whatsapp: () => (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 175.216 175.552">
      <path
        d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
        fill="#25D366"
      />
      <path
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
        fill="#ffffff"
      />
    </svg>
  ),
  googleDocs: () => (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 47 65">
      <path
        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
        fill="#4285F4"
      />
      <polygon
        fill="#1A237E"
        opacity="0.2"
        points="30.6638281 16.4309659 47 32.8582386 47 17.7272727"
      />
      <path
        d="M11.75,47.2727273 L35.25,47.2727273 L35.25,44.3181818 L11.75,44.3181818 L11.75,47.2727273 Z M11.75,53.1818182 L29.375,53.1818182 L29.375,50.2272727 L11.75,50.2272727 L11.75,53.1818182 Z M11.75,32.5 L11.75,35.4545455 L35.25,35.4545455 L35.25,32.5 L11.75,32.5 Z M11.75,41.3636364 L35.25,41.3636364 L35.25,38.4090909 L11.75,38.4090909 L11.75,41.3636364 Z"
        fill="#F1F1F1"
      />
    </svg>
  ),
  zapier: () => (
    <svg
      aria-hidden="true"
      className="size-full fill-[#FF4F00]"
      viewBox="0 0 24 24"
    >
      <path d="M13.5 2L3 14h7v8l10.5-12h-7l0-8z" />
    </svg>
  ),
  messenger: () => (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 48 48">
      <path
        fill="#0084FF"
        d="M24,4C12.95,4,4,12.73,4,23.5c0,5.61,2.425,10.665,6.319,14.225V41.75c0,1.264,1.33,2.086,2.46,1.521l4.747-2.373c2.05,0.57,4.21,0.6,6.474,0.6c11.05,0,20-8.73,20-19.5S35.05,4,24,4z"
      />
      <path
        fill="#ffffff"
        d="M34.394,18.501l-5.7,4.22c-0.61,0.46-1.44,0.46-2.04,0.01L22.68,19.74c-1.68-1.25-4.06-0.82-5.19,0.94l-1.21,1.89l-4.11,6.68c-0.6,0.94,0.55,2.01,1.44,1.34l5.7-4.22c0.61-0.46,1.44-0.46,2.04-0.01l3.974,2.991c1.68,1.25,4.06,0.82,5.19-0.94l1.21-1.89l4.11-6.68C36.434,18.901,35.284,17.831,34.394,18.501z"
      />
    </svg>
  ),
};
