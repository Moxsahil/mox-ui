"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect, useId } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Nfc } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiquidMetalIDCardProps extends React.ComponentPropsWithoutRef<"div"> {
  name?: string;
  cardType?: string;
  cardNumber?: string;
  expiry?: string;
}

function CardChip() {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 48 36"
      className="h-9 w-12"
      role="img"
      aria-label="Card chip"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4d4d4" />
          <stop offset="45%" stopColor="#737373" />
          <stop offset="75%" stopColor="#e5e5e5" />
          <stop offset="100%" stopColor="#a3a3a3" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="46"
        height="34"
        rx="7"
        fill={`url(#${gradientId})`}
        stroke="#d4d4d4"
        strokeOpacity="0.5"
      />
      <g fill="none" stroke="#404040" strokeWidth="0.8">
        <rect x="16" y="9" width="16" height="18" rx="4" />
        <path d="M16 12H1M16 24H1M32 12h15M32 24h15M24 1v8M24 27v8M8 1l8 8M40 1l-8 8M8 35l8-8M40 35l-8-8" />
      </g>
    </svg>
  );
}

export function LiquidMetalIDCard({
  name = "Sahil Barak",
  cardType = "Debit",
  cardNumber = "1234 5678 9012 3456",
  expiry = "09/29",
  className,
  style,
  onClick,
  onKeyDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: LiquidMetalIDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      if (ctx && ctx.state !== "closed") {
        void ctx.close().catch(() => {});
      }
    };
  }, []);

  const playFlipSound = useCallback(async () => {
    try {
      let ctx = audioContextRef.current;

      if (!ctx || ctx.state === "closed") {
        const AudioContextConstructor =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextConstructor) return;
        ctx = new AudioContextConstructor();
        audioContextRef.current = ctx;
      }

      if (ctx.state !== "running") await ctx.resume();
      if (audioContextRef.current !== ctx || ctx.state !== "running") return;

      const duration = 0.4;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.Q.value = 0.8;
      bandpass.frequency.setValueAtTime(200, ctx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(
        800,
        ctx.currentTime + duration * 0.3,
      );
      bandpass.frequency.exponentialRampToValueAtTime(
        300,
        ctx.currentTime + duration,
      );

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(2000, ctx.currentTime);
      lowpass.frequency.exponentialRampToValueAtTime(
        4000,
        ctx.currentTime + duration * 0.4,
      );
      lowpass.frequency.exponentialRampToValueAtTime(
        1500,
        ctx.currentTime + duration,
      );

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(
        0.35,
        ctx.currentTime + duration * 0.3,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration,
      );

      whiteNoise.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.onended = () => {
        whiteNoise.disconnect();
        bandpass.disconnect();
        lowpass.disconnect();
        gainNode.disconnect();
      };
      whiteNoise.start(ctx.currentTime);
      whiteNoise.stop(ctx.currentTime + duration);
    } catch {
      return;
    }
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 200,
    damping: 25,
  });
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(e);
      if (e.defaultPrevented || reduced || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(
        -0.5,
        Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5),
      );
      const y = Math.max(
        -0.5,
        Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5),
      );
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY, onMouseMove, reduced],
  );

  const flipCard = () => {
    setIsFlipped((value) => !value);
    mouseX.set(0);
    mouseY.set(0);
    void playFlipSound();
  };

  return (
    <div
      ref={cardRef}
      data-slot="liquid-metal-id-card"
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "Flip card to front" : "Flip card to back"}
      aria-pressed={isFlipped}
      {...props}
      className={cn(
        "relative w-full max-w-[420px] cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-neutral-400",
        className,
      )}
      style={{ perspective: "1500px", containerType: "inline-size", ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!event.defaultPrevented) setIsHovered(true);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) flipCard();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          event.defaultPrevented ||
          event.nativeEvent.isComposing ||
          event.keyCode === 229
        )
          return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!event.repeat) event.currentTarget.click();
        }
      }}
    >
      <motion.div
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          animate={{
            rotateY: isFlipped ? 180 : 0,
            scale: reduced ? 1 : isFlipped ? [1, 1.05, 1] : 1,
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
          transition={{
            rotateY: {
              duration: reduced ? 0 : 0.8,
              ease: [0.4, 0, 0.2, 1],
            },
            scale: {
              duration: reduced ? 0 : 0.8,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.5, 1],
            },
          }}
          className="relative h-[260px] w-full rounded-2xl"
        >
          <motion.div
            aria-hidden={isFlipped}
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
            animate={{
              opacity: isFlipped ? 0 : 1,
              filter: reduced ? "none" : isFlipped ? "blur(8px)" : "blur(0px)",
            }}
            transition={{
              duration: reduced ? 0 : 0.4,
              ease: "easeInOut",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1f1f1f 75%, #0a0a0a 100%)
              `,
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: reduced
                  ? "0% 0%"
                  : isHovered
                    ? ["0% 0%", "100% 100%", "0% 0%"]
                    : ["0% 0%", "50% 50%", "0% 0%"],
              }}
              transition={{
                duration: reduced ? 0 : isHovered ? 4 : 8,
                repeat: reduced ? 0 : Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                background: `
                radial-gradient(ellipse 80% 50% at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 70%, rgba(255,255,255,0.06) 0%, transparent 50%),
                radial-gradient(ellipse 100% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)
              `,
                backgroundSize: "200% 200%",
              }}
            />
            <motion.div
              className="absolute inset-0 opacity-60"
              animate={{
                background:
                  isHovered && !reduced
                    ? [
                        "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                        "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 55%, transparent 75%)",
                        "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                      ]
                    : "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              }}
              transition={{
                duration: reduced ? 0 : 3,
                repeat: reduced ? 0 : Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: isHovered && !reduced ? [0.3, 0.6, 0.3] : 0.3,
              }}
              transition={{
                duration: reduced ? 0 : 2,
                repeat: reduced ? 0 : Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                background: `
                conic-gradient(from 0deg at 30% 30%, 
                  transparent 0deg, 
                  rgba(255,255,255,0.1) 60deg, 
                  transparent 120deg,
                  rgba(255,255,255,0.05) 180deg,
                  transparent 240deg,
                  rgba(255,255,255,0.08) 300deg,
                  transparent 360deg
                )
              `,
              }}
            />
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-2xl"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduced ? { duration: 0 } : undefined}
            >
              <motion.div
                className="absolute w-[300%] h-full"
                animate={{
                  x: reduced ? "-200%" : ["-200%", "100%"],
                }}
                transition={{
                  duration: reduced ? 0 : 5,
                  repeat: reduced ? 0 : Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatDelay: reduced ? 0 : 2,
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%, transparent 100%)",
                  transform: "skewX(-25deg)",
                }}
              />
            </motion.div>
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
                padding: "1px",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
              }}
            />
            <div
              className="absolute inset-[1px] rounded-2xl"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.3)",
              }}
            />
            <div
              className="relative h-full p-[clamp(1rem,7.62cqw,2rem)] flex flex-col justify-between"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="shrink-0 space-y-4">
                  <p className="text-xs font-mono tracking-[0.3em] text-neutral-200">
                    HDFC BANK
                  </p>
                  <div className="flex items-center gap-3">
                    <CardChip />
                    <Nfc
                      className="h-6 w-6 text-neutral-300"
                      strokeWidth={1.5}
                      role="img"
                      aria-label="Contactless payment"
                    />
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <motion.div
                    className="w-2 h-2 shrink-0 rounded-full bg-white"
                    animate={{
                      opacity: reduced ? 0.5 : [0.5, 1, 0.5],
                      boxShadow: reduced
                        ? "0 0 4px rgba(255,255,255,0.5)"
                        : [
                            "0 0 4px rgba(255,255,255,0.5)",
                            "0 0 8px rgba(255,255,255,0.8)",
                            "0 0 4px rgba(255,255,255,0.5)",
                          ],
                    }}
                    transition={{
                      duration: reduced ? 0 : 2,
                      repeat: reduced ? 0 : Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <span
                    className="truncate text-[10px] font-mono tracking-[0.3em] text-neutral-400 uppercase"
                    title={cardType}
                  >
                    {cardType}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <motion.h2
                  className="truncate text-[clamp(0.8125rem,5.715cqw,1.5rem)] font-mono font-light leading-8 tracking-wider text-white"
                  title={cardNumber}
                  style={{
                    textShadow: "0 2px 10px rgba(255,255,255,0.1)",
                  }}
                >
                  {cardNumber}
                </motion.h2>
                <p
                  className="truncate text-sm tracking-[0.25em] uppercase"
                  title={name}
                  style={{
                    background:
                      "linear-gradient(90deg, #888 0%, #fff 50%, #888 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {name}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] font-mono">
                    Valid thru
                  </p>
                  <p className="font-mono text-xs tracking-wider text-neutral-300">
                    {expiry}
                  </p>
                </div>

                <motion.div
                  className="w-14 h-10 flex items-center justify-center"
                  animate={{
                    opacity: isHovered ? 1 : 0.7,
                  }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Visa"
                    className="h-auto w-14 fill-white"
                  >
                    <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
                  </svg>
                </motion.div>
              </div>
            </div>
            <motion.div
              className="absolute bottom-3 left-1/2 -translate-x-1/2"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: isHovered ? 0.5 : 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                Click to flip
              </span>
            </motion.div>
          </motion.div>
          <motion.div
            aria-hidden={!isFlipped}
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            animate={{
              opacity: isFlipped ? 1 : 0,
              filter: reduced ? "none" : isFlipped ? "blur(0px)" : "blur(8px)",
            }}
            transition={{
              duration: reduced ? 0 : 0.4,
              ease: "easeInOut",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                linear-gradient(225deg, #0f0f0f 0%, #1a1a1a 30%, #0a0a0a 60%, #151515 100%)
              `,
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: reduced
                  ? "0% 0%"
                  : ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: reduced ? 0 : 10,
                repeat: reduced ? 0 : Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                background: `
                radial-gradient(ellipse 60% 40% at 70% 40%, rgba(255,255,255,0.06) 0%, transparent 50%),
                radial-gradient(ellipse 80% 60% at 30% 60%, rgba(255,255,255,0.04) 0%, transparent 50%)
              `,
                backgroundSize: "200% 200%",
              }}
            />
            <div
              className="absolute inset-[1px] rounded-2xl"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.3)",
              }}
            />
            <div className="relative h-full p-[clamp(1rem,7.62cqw,2rem)] flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-[10px] font-mono tracking-[0.2em] text-neutral-300">
                  HDFC BANK
                </span>
                <span
                  className="truncate text-[9px] font-mono tracking-[0.3em] text-neutral-400 uppercase"
                  title={cardType}
                >
                  {cardType}
                </span>
              </div>
              <div
                className="-mx-[clamp(1rem,7.62cqw,2rem)] h-10 shrink-0 bg-black/80 border-y border-white/5"
                aria-hidden="true"
              />
              <div className="flex items-center gap-4">
                <div
                  className="min-w-0 flex-1 truncate rounded-sm bg-neutral-300/10 px-4 py-3 text-sm italic text-neutral-300"
                  title={name}
                >
                  {name}
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-mono tracking-widest text-neutral-400">
                    CVV
                  </p>
                  <p className="font-mono text-sm tracking-widest text-neutral-200">
                    •••
                  </p>
                </div>
              </div>
              <p className="text-[9px] leading-relaxed text-neutral-400">
                Designed for your everyday. Keep your card details secure.
              </p>
              <div className="flex items-center justify-between gap-2 text-[9px] font-mono tracking-wider text-neutral-500">
                <span>CONCEPT CARD · NOT FOR PAYMENT</span>
                <span>{cardNumber.replace(/\s/g, "").slice(-4)}</span>
              </div>
              <motion.div
                className="absolute bottom-3 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.5 }}
              >
                <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                  Click to flip back
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
