import { page, K, W, RED, checks, path, rect, circle } from '../hc-kit.js';
import { camel } from '../lib.js';
export default () => page(false,
  checks(760, 60, 17, K, W) +
  camel(470, 760, { s: 2.35, body: K, dark: '#444444', light: K }) +
  // saddle blanket with white stripes
  path('M370,358 C400,300 520,290 560,350 L548,420 L382,420Z', { fill: RED }) +
  path('M392,392 L540,392', { stroke: W, 'stroke-width': 12 }) +
  circle(771, 214, 15, { fill: W }) + circle(771, 214, 7, { fill: K }));
