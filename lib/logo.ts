// the mark is a lowercase m drawn as a bouncing ball's path, on a 64 unit grid
export const MARK_VIEWBOX = "6 5 54 54";
export const MARK_STROKE = 8;

// the second hump is 64% as tall and 80% as wide as the first, true to a ball bouncing back at 80% speed
export const MARK_PATH =
  "M12 18V46M12 28.5A10.5 10.5 0 0 1 33 28.5V46M33 36.5A8.5 8.5 0 0 1 50 36.5V44.6";

// squashed where it lands, so it sits on the same ground line as the legs
export const MARK_BALL = { cx: 50.8, cy: 44.6, rx: 7.6, ry: 5.6 };

export const WORDMARK_VIEWBOX = "4 10 143 44";
export const WORDMARK_O = { cx: 86, cy: 32, r: 14 };
export const WORDMARK_X = "M115 18L139 46M139 18L115 46";

export function markSvg(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" fill="none"><path d="${MARK_PATH}" stroke="${color}" stroke-width="${MARK_STROKE}" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="${MARK_BALL.cx}" cy="${MARK_BALL.cy}" rx="${MARK_BALL.rx}" ry="${MARK_BALL.ry}" fill="${color}"/></svg>`;
}
