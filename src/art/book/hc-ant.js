import { page, K, W, RED, rings, path, circle, ellipse, hcEye } from '../hc-kit.js';
export default () => page(true,
  rings(500, 980, 180, 5, 60, '#333333') +
  // six legs from the middle body, three to each side, with bent knees
  path('M470,470 L370,520 L320,650 M500,485 L495,580 L450,680 M530,470 L620,540 L680,650 M455,455 L360,430 L300,500 M505,470 L540,560 L560,660 M545,450 L650,450 L730,520', { fill: 'none', stroke: W, 'stroke-width': 20, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }) +
  // body: head, thorax, abdomen
  ellipse(310, 330, 105, 95, { fill: W }) + ellipse(500, 440, 95, 75, { fill: W }) + ellipse(710, 470, 150, 120, { fill: W }) +
  path('M660,400 Q700,470 680,560 M740,380 Q790,470 760,580', { fill: 'none', stroke: K, 'stroke-width': 16, 'stroke-linecap': 'round' }) +
  // antennae
  path('M270,250 Q230,150 160,140 M340,240 Q360,150 300,100', { fill: 'none', stroke: W, 'stroke-width': 16, 'stroke-linecap': 'round' }) +
  circle(160, 140, 22, { fill: RED }) + circle(300, 100, 22, { fill: RED }) +
  hcEye(290, 320, 34) + ellipse(270, 380, 26, 15, { fill: RED }));
