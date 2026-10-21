import { page, K, W, RED, circle, rings } from '../hc-kit.js';
import { crescent, star8, sparkle } from '../lib.js';
export default () => page(true,
  rings(500, 430, 330, 3, 46, '#2A2A2A') +
  crescent(470, 430, 250, { fill: W, angle: -30, thickness: 0.5 }) +
  star8(690, 300, 70, RED) + circle(690, 300, 24, { fill: K }) +
  [[160, 140], [860, 160], [120, 650], [880, 640], [300, 90], [760, 760]].map(([x, y], i) => (i % 2 ? sparkle(x, y, 26, W) : circle(x, y, 14, { fill: W }))).join(''));
