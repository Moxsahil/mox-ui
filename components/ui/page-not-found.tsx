"use client";

import type { ComponentProps, CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";
import CircleAnimation from "@/components/not-found/CircleAnimation";
import { cn } from "@/lib/utils";
import styles from "./page-not-found.module.css";

const ACTION_CLASS_NAME =
  "inline-flex h-8.5 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-3.5 text-sm font-semibold text-black transition-colors duration-150 hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none";

const FIGURES = [
  { src: "standing", top: "0%", duration: "1.5s", rotation: "-90deg" },
  { src: "tumbling", top: "10%", duration: "3s", rotation: "-540deg" },
  { src: "falling", top: "20%", duration: "5s", rotation: "-1800deg" },
  { src: "standing", top: "25%", duration: "2.5s", rotation: "-600deg" },
  { src: "standing", top: "35%", duration: "2s", rotation: "-2400deg" },
];

export default function NotFoundPage({
  className,
  ...props
}: ComponentProps<"main">) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  return (
    <main
      data-slot="page-not-found"
      className={cn(
        styles.scene,
        "relative isolate flex min-h-[calc(100svh-3.75rem)] flex-1 items-center justify-center overflow-hidden bg-home-bg px-6 py-16",
        className,
      )}
      {...props}
    >
      <CircleAnimation />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-difference"
      >
        {FIGURES.map((figure, index) => (
          <div
            key={index}
            className={styles.traveler}
            style={
              {
                top: figure.top,
                "--travel-duration": figure.duration,
                "--rotation": figure.rotation,
              } as CSSProperties
            }
          >
            <Image
              src={`/images/not-found/${figure.src}.svg`}
              alt=""
              width={160}
              height={160}
              className={cn(styles.figure, index === 0 && styles.sideways)}
              unoptimized
            />
          </div>
        ))}
        <Image
          src="/images/not-found/resting.svg"
          alt=""
          width={160}
          height={160}
          className="absolute bottom-[5%] left-[4%] h-auto w-[18%] max-w-40"
          unoptimized
        />
      </div>

      <div
        className={cn(
          styles.message,
          "relative z-10 flex w-full max-w-lg flex-col items-center text-center text-white mix-blend-difference",
        )}
      >
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="my-4 text-8xl font-bold leading-none tracking-tight sm:text-[7rem]">
          404
        </p>
        <p className="max-w-sm text-sm leading-6 sm:text-base">
          The page you are looking for might have been removed, renamed, or
          moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-6">
          <button type="button" onClick={goBack} className={ACTION_CLASS_NAME}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Go back
          </button>
          <Link href="/" className={ACTION_CLASS_NAME}>
            <House aria-hidden="true" className="size-4" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
