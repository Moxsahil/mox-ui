import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { components } from "@/lib/components";
import { markSvg } from "@/lib/logo";
import { OG_IMAGE } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const alt = OG_IMAGE.alt;
export const size = { width: OG_IMAGE.width, height: OG_IMAGE.height };
export const contentType = OG_IMAGE.type;

const BG = "#09090B";
const FG = "#FAFAFA";
const FG_2 = "#A1A1AA";
const MUTED = "#71717A";

const ORB_SIZE = 460;
const GRID = 13;

// satori reads ttf but not woff2, so the brand's cal sans carries the type here
const calSans = await readFile(
  join(process.cwd(), "public/fonts/CalSans-Regular.ttf"),
);
const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg(FG)).toString("base64")}`;

// the matrix orb's idle frame at t = 0, same math as components/ui/matrix-orb.tsx
function orbDots() {
  const half = (GRID - 1) / 2;
  const scale = 0.88;
  const spacing = (ORB_SIZE * 0.74) / (GRID - 1);
  const maxRadius = spacing * 0.6;
  const center = ORB_SIZE / 2;
  const dots: { x: number; y: number; r: number }[] = [];

  for (let iy = 0; iy < GRID; iy++) {
    for (let ix = 0; ix < GRID; ix++) {
      const nx = (ix - half) / half;
      const ny = (iy - half) / half;
      const d = Math.hypot(nx, ny);
      if (d > 1.12) continue;
      const intensity = 0.62 + 0.12 * Math.sin(-d * 2.4);
      const r = maxRadius * Math.exp(-d * d * 1.7) * intensity * scale;
      if (r < 0.5) continue;
      dots.push({
        x: center + (ix - half) * spacing * scale,
        y: center + (iy - half) * spacing * scale,
        r,
      });
    }
  }
  return dots;
}

const DOTS = orbDots();

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        padding: 72,
        background: BG,
        backgroundImage:
          "radial-gradient(circle at 84% 50%, rgba(255,255,255,0.09) 0%, rgba(9,9,11,0) 42%), radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05) 0%, rgba(9,9,11,0) 38%)",
        color: FG,
        fontFamily: "Cal Sans",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -40,
          top: (OG_IMAGE.height - ORB_SIZE) / 2,
          width: ORB_SIZE,
          height: ORB_SIZE,
          display: "flex",
        }}
      >
        {DOTS.map((dot, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: dot.x - dot.r,
              top: dot.y - dot.r,
              width: dot.r * 2,
              height: dot.r * 2,
              borderRadius: dot.r,
              background: FG,
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 720,
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={markSrc} width={46} height={46} alt="" />
          <div style={{ fontSize: 38, letterSpacing: -0.5 }}>Mox UI</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              lineHeight: 1.04,
              letterSpacing: -1.5,
            }}
          >
            <span>The foundation of</span>
            <span style={{ color: FG_2 }}>exceptional</span>
            <span>interfaces.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 560,
              fontSize: 30,
              lineHeight: 1.35,
              color: FG_2,
            }}
          >
            {`${components.length} animated React components. One file each, installed with the shadcn CLI.`}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: MUTED }}>
          {SITE_URL.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Cal Sans", data: calSans, style: "normal", weight: 400 },
      ],
    },
  );
}
