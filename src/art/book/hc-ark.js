import { page, K, W, RED, zigzag, path, rect, circle } from '../hc-kit.js';
export default () => page(false,
  // roof, cabin with round windows, hull with white planks
  path('M300,340 L500,230 L700,340Z', { fill: RED }) +
  rect(330, 340, 340, 150, { fill: K }) +
  [400, 500, 600].map((x) => circle(x, 415, 34, { fill: W }) + circle(x, 415, 16, { fill: K })).join('') +
  path('M170,490 L830,490 C810,600 720,660 600,668 L400,668 C280,660 190,600 170,490Z', { fill: K }) +
  path('M205,545 L795,545 M250,605 L750,605', { stroke: W, 'stroke-width': 18, 'stroke-linecap': 'round' }) +
  zigzag(690, 46, 90, K) + zigzag(770, 46, 90, RED) + zigzag(850, 30, 70, K));
