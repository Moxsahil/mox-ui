"use client";

import { useEffect, useRef } from "react";

const DURATION = 5000;
const SWEEP_DURATION = 1400;

export default function CircleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const circles = Array.from({ length: 300 }, (_, index) => ({
      x: 1.2 + (((index % 20) + Math.random()) / 20) * 1.8,
      y: -0.2 + ((Math.floor(index / 20) + Math.random()) / 15) * 1.4,
      scale: 0.6 + Math.random() * 0.8,
    }));
    const startedAt = performance.now();
    let frame = 0;
    let width = 1;
    let height = 1;
    let finished = motion.matches;
    let background = "";
    let surface = "";

    const readColors = () => {
      const styles = getComputedStyle(canvas);
      background = styles.getPropertyValue("--home-fg").trim() || "#fafafa";
      surface = styles.getPropertyValue("--home-bg").trim() || "#09090b";
    };

    const draw = (now: number) => {
      const elapsed = now - startedAt;
      context.clearRect(0, 0, width, height);

      if (finished || elapsed >= DURATION) {
        finished = true;
        cancelAnimationFrame(frame);
        frame = 0;
        return;
      }

      const sweep = Math.min(elapsed / SWEEP_DURATION, 1);
      const drift = Math.max(
        0,
        (elapsed - SWEEP_DURATION) / (DURATION - SWEEP_DURATION),
      );
      const distance = (sweep * 1.4 + drift * 0.3) * width;
      const radius =
        width / 1000 +
        sweep * width * 0.1 +
        drift * Math.max(width, height) * 0.18;

      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.fillStyle = surface;

      for (const circle of circles) {
        context.beginPath();
        context.arc(
          circle.x * width - distance,
          circle.y * height,
          radius * circle.scale,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now());
    };

    const animate = (now: number) => {
      draw(now);
      if (!finished) frame = requestAnimationFrame(animate);
    };

    const onMotionChange = () => {
      if (!motion.matches) return;
      finished = true;
      draw(performance.now());
    };

    const themeObserver = new MutationObserver(() => {
      readColors();
      draw(performance.now());
    });
    const resizeObserver = new ResizeObserver(resize);

    readColors();
    resize();
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", onMotionChange);
    if (!finished) frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", onMotionChange);
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
