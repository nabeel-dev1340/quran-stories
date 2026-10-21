import { page, K, W, RED, path, circle, ellipse, hcEye } from '../hc-kit.js';
export default () => page(false,
  // branch with leaves
  path('M60,700 C300,660 600,690 940,640', { fill: 'none', stroke: K, 'stroke-width': 34, 'stroke-linecap': 'round' }) +
  [[180, 680, -30, RED], [300, 670, 30, K], [760, 660, -30, K], [860, 650, 30, RED]].map(([x, y, r, c]) => ellipse(x, y - 40, 26, 60, { fill: c, transform: `rotate(${r} ${x} ${y - 40})` })).join('') +
  // tail, body, head, wing, beak, eye
  path('M330,520 L170,470 L210,590Z', { fill: K }) +
  ellipse(470, 520, 190, 140, { fill: K }) +
  circle(620, 380, 105, { fill: K }) +
  path('M380,470 C430,420 560,430 570,520 C520,600 400,600 360,540Z', { fill: RED }) +
  path('M715,360 L820,385 L715,420Z', { fill: RED }) +
  hcEye(645, 360, 36) +
  path('M440,650 L430,700 M520,650 L530,700', { stroke: K, 'stroke-width': 18, 'stroke-linecap': 'round' }));
