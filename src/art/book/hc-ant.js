import { page, K, W, RED, rings, path, circle, ellipse, hcEye } from '../hc-kit.js';
export default () => page(true,
  rings(500, 980, 180, 5, 60, '#333333') +
  // legs
  path('M420,470 L330,390 L270,420 M450,500 L360,560 L300,640 M520,500 L600,580 L640,660 M560,470 L660,400 L720,430 M480,470 L470,600 L430,680 M520,470 L560,620 L600,690', { fill: 'none', stroke: W, 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }) +
  // body: head, thorax, abdomen
  ellipse(310, 330, 105, 95, { fill: W }) + ellipse(500, 440, 95, 75, { fill: W }) + ellipse(710, 470, 150, 120, { fill: W }) +
  path('M660,400 Q700,470 680,560 M740,380 Q790,470 760,580', { fill: 'none', stroke: K, 'stroke-width': 16, 'stroke-linecap': 'round' }) +
  // antennae
  path('M270,250 Q230,150 160,140 M340,240 Q360,150 300,100', { fill: 'none', stroke: W, 'stroke-width': 16, 'stroke-linecap': 'round' }) +
  circle(160, 140, 22, { fill: RED }) + circle(300, 100, 22, { fill: RED }) +
  hcEye(290, 320, 34) + ellipse(270, 380, 26, 15, { fill: RED }));
