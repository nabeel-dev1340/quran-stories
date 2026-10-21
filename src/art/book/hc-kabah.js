import { page, K, W, YEL, path, rect } from '../hc-kit.js';
export default () => {
  let rays = '';
  for (let i = 0; i < 24; i++) {
    const a1 = (i / 24) * Math.PI * 2;
    const a2 = a1 + Math.PI / 24;
    rays += path(`M500,470 L${500 + Math.cos(a1) * 900},${470 + Math.sin(a1) * 900} L${500 + Math.cos(a2) * 900},${470 + Math.sin(a2) * 900}Z`, { fill: K });
  }
  return page(false,
    rays + rect(150, 120, 700, 700, { rx: 120, fill: W }) +
    // the cube: left face, right face, top, gold band and door
    path('M250,330 L250,700 L500,760 L500,380Z', { fill: K }) +
    path('M500,380 L500,760 L760,700 L760,330Z', { fill: '#2E2E2E' }) +
    path('M250,330 L500,280 L760,330 L500,380Z', { fill: '#555555' }) +
    path('M250,410 L500,462 L500,510 L250,458Z', { fill: YEL }) +
    path('M500,462 L760,410 L760,458 L500,510Z', { fill: YEL }) +
    path('M590,742 L590,580 L680,562 L680,722Z', { fill: YEL }) +
    path('M230,712 L500,778 L780,712 L780,740 L500,806 L230,740Z', { fill: K }));
};
