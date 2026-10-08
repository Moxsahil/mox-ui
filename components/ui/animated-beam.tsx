"use client";

import {
  useEffect,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type RefObject,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "children"
> {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

type Geometry = {
  width: number;
  height: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = "currentColor",
  pathWidth = 1.5,
  pathOpacity = 0.08,
  gradientStartColor = "#3b82f6",
  gradientStopColor = "#8b5cf6",
  delay = 0,
  duration = 2.5,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  ...props
}: AnimatedBeamProps) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;

    if (!container || !from || !to) return;

    let frame = 0;

    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const start = from.getBoundingClientRect();
      const end = to.getBoundingClientRect();

      setGeometry({
        width: bounds.width,
        height: bounds.height,
        startX: start.left - bounds.left + start.width / 2 + startXOffset,
        startY: start.top - bounds.top + start.height / 2 + startYOffset,
        endX: end.left - bounds.left + end.width / 2 + endXOffset,
        endY: end.top - bounds.top + end.height / 2 + endYOffset,
      });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(scheduleMeasure);

    observer.observe(container);
    observer.observe(from);
    observer.observe(to);

    window.addEventListener("resize", scheduleMeasure);
    scheduleMeasure();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  const path = geometry
    ? `M ${geometry.startX},${geometry.startY} Q ${(geometry.startX + geometry.endX) / 2},${(geometry.startY + geometry.endY) / 2 - curvature} ${geometry.endX},${geometry.endY}`
    : "";

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      {...props}
      data-slot="animated-beam"
      fill="none"
      width={geometry?.width ?? 0}
      height={geometry?.height ?? 0}
      viewBox={
        geometry && geometry.width > 0 && geometry.height > 0
          ? `0 0 ${geometry.width} ${geometry.height}`
          : undefined
      }
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={geometry?.startX ?? 0}
          y1={geometry?.startY ?? 0}
          x2={geometry?.endX ?? 0}
          y2={geometry?.endY ?? 0}
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="25%" stopColor={gradientStartColor} stopOpacity="0.8" />
          <stop offset="60%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>

        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={path}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />

      {path && !reducedMotion && (
        <motion.path
          d={path}
          stroke={`url(#${id})`}
          strokeWidth={pathWidth * 1.8}
          strokeLinecap="round"
          strokeDasharray="45 155"
          filter={`url(#glow-${id})`}
          initial={{ strokeDashoffset: reverse ? 0 : 200 }}
          animate={{ strokeDashoffset: reverse ? 200 : 0 }}
          transition={{
            duration,
            delay,
            ease: [0.45, 0.05, 0.55, 0.95],
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      )}
    </svg>
  );
}
