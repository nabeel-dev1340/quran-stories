// High-contrast kit for newborn pages: only black, white and one bold red.
import { svgDoc, rect, path, circle, ellipse, g, poly } from './lib.js';

export const K = '#111111';
export const W = '#FFFFFF';
export const RED = '#D62F2F';
export const YEL = '#F2B200';

export const page = (dark, body) => svgDoc({ defs: '', body: rect(0, 0, 1000, 1000, { fill: dark ? K : W }) + body });

// Bold concentric rings (a favourite for newborn eyes).
export function rings(cx, cy, r0, n, step, color) {
  let s = '';
  for (let i = 0; i < n; i++) s += circle(cx, cy, r0 + i * step, { fill: 'none', stroke: color, 'stroke-width': step / 2 });
  return s;
}
// Zig-zag band (waves, grass) across the page.
export function zigzag(y, h, w, color, x0 = -40, x1 = 1040) {
  let d = `M${x0},${y + h}`;
  for (let x = x0; x <= x1; x += w) d += ` L${x + w / 2},${y} L${x + w},${y + h}`;
  return path(d, { fill: 'none', stroke: color, 'stroke-width': h * 0.42, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
}
// Checkerboard strip.
export function checks(y, size, cols, a, b) {
  let s = '';
  for (let r = 0; r < 2; r++) for (let c = 0; c < cols; c++) s += rect(c * size, y + r * size, size, size, { fill: (r + c) % 2 ? a : b });
  return s;
}
// Bold eye: a white ring around a black pupil (reads on either background).
export const hcEye = (x, y, r) => circle(x, y, r, { fill: W }) + circle(x, y, r * 0.55, { fill: K }) + circle(x + r * 0.2, y - r * 0.2, r * 0.18, { fill: W });
export { path, circle, ellipse, g, rect, poly };
