import { bindFullscreenQuad, createProgram, hexToRgb } from "@/lib/webgl";

export const GLASS_PALETTE = {
  dark: { deep: "#2E5BE8", bright: "#D6E4FF" },
  light: { deep: "#1A3BB8", bright: "#5E8EFF" },
};

export type GlassPalette = { deep: string; bright: string };

export const GLASS_FADE_MS = 280;
export const GLASS_FADE = `opacity ${GLASS_FADE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;

// what shows before webgl is ready, without it, or with reduced motion
export const GLASS_FALLBACK =
  "bg-linear-to-b from-[#4F7DFF] to-[#1D3FBF] bg-clip-text pr-[0.08em] text-transparent dark:from-[#DBE7FF] dark:to-[#3A6FF0]";

export const ACCENT_PALETTE = {
  dark: { deep: "#2B5CFF", bright: "#9FBCFF" },
  light: { deep: "#1A44E0", bright: "#4D84FF" },
};

export const ACCENT_FALLBACK =
  "bg-linear-to-b from-[#4A82FF] to-[#1A44E0] bg-clip-text pr-[0.08em] text-transparent dark:from-[#AFC7FF] dark:to-[#2F62FF]";

export type GlassGeometry = {
  font: string;
  size: number;
  pad: number;
  baseline: number;
  lineHeight: number;
  width: number;
  height: number;
};

const VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

// r holds the crisp glyphs, g a blurred copy used as the glass height map
const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uWord;
uniform float uTime;
uniform vec2 uTexel;
uniform vec3 uDeep;
uniform vec3 uBright;

float height(vec2 p) {
  return texture2D(uWord, p).g;
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float cover = texture2D(uWord, uv).r;
  if (cover < 0.003) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float hx = height(uv + vec2(uTexel.x, 0.0)) - height(uv - vec2(uTexel.x, 0.0));
  float hy = height(uv + vec2(0.0, uTexel.y)) - height(uv - vec2(0.0, uTexel.y));
  vec3 n = normalize(vec3(-hx * 5.0, hy * 5.0, 1.0));

  vec3 l = normalize(vec3(cos(uTime * 0.6) * 0.8, 0.55 + sin(uTime * 0.45) * 0.3, 0.7));
  float diffuse = clamp(dot(n, l), 0.0, 1.0);
  float spec = pow(clamp(reflect(-l, n).z, 0.0, 1.0), 24.0);
  float rim = pow(1.0 - n.z, 1.5);
  float sweep = 1.0 - smoothstep(0.0, 0.09, abs(fract(uv.x * 0.55 + uv.y * 0.25 - uTime * 0.09) - 0.5));

  vec3 body = mix(uDeep, uBright, clamp(diffuse * 0.75 + (1.0 - uv.y) * 0.45, 0.0, 1.0));
  vec3 color = min(body + spec * 0.85 + rim * 0.3 + sweep * 0.22, 1.0);
  float alpha = cover * clamp(0.82 + rim * 0.25 + spec * 0.4, 0.0, 1.0);
  gl_FragColor = vec4(color * alpha, alpha);
}`;

export function measureGlass(
  text: HTMLElement,
  words: string[],
): GlassGeometry | null {
  const glyphs = (text.firstElementChild ?? text) as HTMLElement;
  const style = getComputedStyle(glyphs);
  const size = parseFloat(style.fontSize);
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return null;
  probe.font = font;
  const metrics = words.map((word) => probe.measureText(word));
  const ascent = metrics[0].fontBoundingBoxAscent;
  const descent = metrics[0].fontBoundingBoxDescent;
  const pad = Math.round(size * 0.3);
  const lineHeight = text.offsetHeight;
  return {
    font,
    size,
    pad,
    lineHeight,
    // same half-leading maths the browser uses, so the canvas sits exactly on the text
    baseline: pad + (lineHeight - (ascent + descent)) / 2 + ascent,
    // italic glyphs overhang their advance width, so leave room on the right
    width: Math.ceil(
      Math.max(...metrics.map((m) => m.width)) + size * 0.35 + pad * 2,
    ),
    height: Math.ceil(lineHeight + pad * 2),
  };
}

export function placeCanvas(
  canvas: HTMLCanvasElement,
  geo: GlassGeometry,
  dpr: number,
) {
  canvas.width = Math.round(geo.width * dpr);
  canvas.height = Math.round(geo.height * dpr);
  Object.assign(canvas.style, {
    width: `${geo.width}px`,
    height: `${geo.height}px`,
    left: `${-geo.pad}px`,
    top: `${-geo.pad}px`,
  });
}

// three box passes approximate a gaussian, enough to round the glass edges
function blurAlpha(source: Float32Array, w: number, h: number, r: number) {
  let a = source;
  const span = 2 * r + 1;
  for (let pass = 0; pass < 3; pass++) {
    const b = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let sum = 0;
      for (let x = -r; x <= r; x++)
        sum += a[row + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[row + x] = sum / span;
        sum +=
          a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
      }
    }
    const c = new Float32Array(w * h);
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = -r; y <= r; y++)
        sum += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        c[y * w + x] = sum / span;
        sum +=
          b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
    a = c;
  }
  return a;
}

export type GlassRenderer = {
  build: (geo: GlassGeometry, words: string[]) => void;
  draw: (index: number, seconds: number, palette: GlassPalette) => void;
  dispose: () => void;
};

export function createGlassRenderer(
  canvas: HTMLCanvasElement,
): GlassRenderer | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true });
  const compiled = gl && createProgram(gl, VERTEX, FRAGMENT);
  if (!gl || !compiled) return null;

  gl.useProgram(compiled.program);
  const quad = bindFullscreenQuad(gl, compiled.program, "aPosition");
  const uniform = (name: string) =>
    gl.getUniformLocation(compiled.program, name);
  const u = {
    word: uniform("uWord"),
    time: uniform("uTime"),
    texel: uniform("uTexel"),
    deep: uniform("uDeep"),
    bright: uniform("uBright"),
  };
  gl.uniform1i(u.word, 0);

  let textures: (WebGLTexture | null)[] = [];

  return {
    build(geo, words) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      placeCanvas(canvas, geo, dpr);
      const w = canvas.width;
      const h = canvas.height;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.texel, 1 / w, 1 / h);
      const blur = Math.max(2, Math.round(geo.size * dpr * 0.045));

      textures.forEach((texture) => gl.deleteTexture(texture));
      textures = words.map((word) => {
        const raster = document.createElement("canvas");
        raster.width = w;
        raster.height = h;
        const ctx = raster.getContext("2d", { willReadFrequently: true });
        const texture = gl.createTexture();
        if (!ctx || !texture) return texture;
        ctx.scale(dpr, dpr);
        ctx.font = geo.font;
        ctx.fillStyle = "#fff";
        ctx.fillText(word, geo.pad, geo.baseline);
        const pixels = ctx.getImageData(0, 0, w, h).data;
        const alpha = new Float32Array(w * h);
        for (let i = 0; i < alpha.length; i++) alpha[i] = pixels[i * 4 + 3];
        const soft = blurAlpha(alpha, w, h, blur);
        const packed = new Uint8Array(w * h * 4);
        for (let i = 0; i < alpha.length; i++) {
          packed[i * 4] = alpha[i];
          packed[i * 4 + 1] = soft[i];
          packed[i * 4 + 3] = 255;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          w,
          h,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          packed,
        );
        return texture;
      });
    },

    draw(index, seconds, palette) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[index]);
      gl.uniform1f(u.time, seconds);
      gl.uniform3fv(u.deep, hexToRgb(palette.deep));
      gl.uniform3fv(u.bright, hexToRgb(palette.bright));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    dispose() {
      textures.forEach((texture) => gl.deleteTexture(texture));
      gl.deleteBuffer(quad);
      compiled.dispose();
    },
  };
}
