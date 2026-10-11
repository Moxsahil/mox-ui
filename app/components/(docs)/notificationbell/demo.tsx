"use client";

import { useState } from "react";
import { NotificationBell } from "@/components/ui/notification-bell";
import { usePreviewControl } from "@/components/preview/PreviewControls";

const STEP =
  "grid size-10 place-items-center rounded-full bg-[#F4F4F9] text-[#868593] transition-transform active:scale-90 disabled:opacity-40 disabled:active:scale-100 dark:bg-[#262626] dark:text-[#9B9AA7]";

function StepIcon({ plus }: { plus?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      {plus && <path d="M12 5v14" />}
    </svg>
  );
}

export default function NotificationBellPage() {
  const [count, setCount] = useState(8);
  const [color] = usePreviewControl("color", "red");

  const shade = color as "red" | "orange" | "green" | "blue" | "violet";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10">
      <NotificationBell count={count} size={72} color={shade} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCount((value) => Math.max(0, value - 1))}
          disabled={count === 0}
          aria-label="Remove a notification"
          className={STEP}
        >
          <StepIcon />
        </button>
        <button
          type="button"
          onClick={() => setCount((value) => value + 1)}
          aria-label="Add a notification"
          className={STEP}
        >
          <StepIcon plus />
        </button>
      </div>
    </div>
  );
}
