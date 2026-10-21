import { page, K, W, RED, zigzag, path, circle, ellipse, hcEye } from '../hc-kit.js';
export default () => page(true,
  // spout
  path('M470,250 C440,180 400,160 360,170 M500,250 L500,150 M530,250 C560,180 600,160 640,170', { fill: 'none', stroke: W, 'stroke-width': 26, 'stroke-linecap': 'round' }) +
  circle(360, 168, 22, { fill: W }) + circle(640, 168, 22, { fill: W }) + circle(500, 140, 24, { fill: RED }) +
  // body and tail
  path('M180,470 C180,330 330,260 500,262 C700,264 800,360 800,470 C800,560 720,620 500,624 C330,628 180,580 180,470Z', { fill: W }) +
  path('M790,470 C840,420 880,360 930,330 C920,400 920,440 960,500 C900,500 850,520 800,540Z', { fill: W }) +
  path('M210,520 C300,590 600,610 760,540 C700,600 600,622 500,624 C360,626 250,590 210,520Z', { fill: '#BBBBBB' }) +
  hcEye(330, 420, 34) + ellipse(300, 492, 30, 18, { fill: RED }) +
  path('M240,470 Q300,520 380,486', { fill: 'none', stroke: K, 'stroke-width': 12, 'stroke-linecap': 'round' }) +
  zigzag(700, 46, 100, W) + zigzag(790, 46, 100, RED) + zigzag(870, 30, 80, W));
