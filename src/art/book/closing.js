// "A Dua for You": an empty wooden cradle with a starry blanket under the night sky.
import { C, svgDoc, ids, rng, linear, glowDef, glow, rect, path, circle, ellipse, g, starField, crescent, cloud, star8, sparkle, lantern } from '../lib.js';

function cradle(x, y) {
  const parts = [
    // rockers
    path('M-190,40 C-120,92 120,92 190,40', { fill: 'none', stroke: C.wood3, 'stroke-width': 16, 'stroke-linecap': 'round' }),
    // legs
    path('M-130,-10 L-150,62 M130,-10 L150,62', { stroke: C.wood3, 'stroke-width': 14, 'stroke-linecap': 'round' }),
    // basket body
    path('M-170,-110 L170,-110 C166,-30 120,20 0,22 C-120,20 -166,-30 -170,-110Z', { fill: C.wood1 }),
    path('M-170,-110 L170,-110 C168,-84 160,-62 146,-44 L-146,-44 C-160,-62 -168,-84 -170,-110Z', { fill: C.wood0 }),
    ...[-120, -60, 0, 60, 120].map((px) => path(`M${px},-108 C${px * 0.95},-60 ${px * 0.85},-20 ${px * 0.7},14`, { stroke: C.wood2, 'stroke-width': 3, fill: 'none', opacity: 0.55 })),
    // hood
    path('M60,-110 C60,-230 230,-230 214,-110Z', { fill: C.wood1 }),
    path('M78,-110 C80,-206 206,-206 196,-110Z', { fill: C.wood3 }),
    // soft blanket with stars, a pillow at the hood end
    ellipse(120, -118, 56, 26, { fill: C.wool0 }),
    path('M-176,-110 C-160,-150 -90,-160 -40,-140 C10,-162 70,-150 104,-122 L110,-110Z', { fill: '#9FCBE6' }),
    path('M-176,-110 C-160,-150 -90,-160 -40,-140 C-30,-132 -24,-122 -20,-110Z', { fill: '#7FB8DC' }),
    ...[[-120, -128], [-60, -138], [0, -136], [56, -126]].map(([a, bb]) => star8(a, bb, 8, C.white, { opacity: 0.9 })),
    path('M-120,-110 C-118,-86 -90,-78 -70,-88 L-68,-110Z', { fill: '#9FCBE6' }),
  ];
  return g({ transform: `translate(${x} ${y})` }, parts);
}

export default function render() {
  const id = ids('closing');
  const R = rng(8);
  const defs = [linear(id('sky'), [[0, '#16244A'], [0.6, '#24396E'], [1, '#41508F']]), glowDef(id('warm'), '#FFE3A6', 0.6), glowDef(id('moon'), '#FFF2C6', 0.45), glowDef(id('lamp'), '#FFD98A', 0.65)].join('');
  let b = rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  b += starField({ seed: 74, n: 80, area: [0, 0, 1000, 700], twinkles: 12 });
  b += glow(150, 600, 150, id('moon')) + crescent(150, 600, 38, { fill: '#FFF0C8', angle: -20, thickness: 0.5 });
  b += cloud(150, 990, 420, { fill: '#33477F', seed: 2 }) + cloud(860, 1000, 460, { fill: '#33477F', seed: 6 });
  b += glow(500, 840, 330, id('warm'));
  b += ellipse(500, 958, 230, 18, { fill: '#0E1834', opacity: 0.35 });
  b += cradle(500, 880);
  b += lantern(830, 600, { s: 0.7, glowId: id('lamp'), chain: 0 });
  b += path('M830,600 C830,560 900,520 1000,520', { fill: 'none', stroke: '#C27F22', 'stroke-width': 3 });
  for (let i = 0; i < 14; i++) b += sparkle(300 + R() * 400, 640 + R() * 140, R.range(4, 9), '#FFF1CF', { opacity: R.range(0.5, 0.95) });
  return svgDoc({ defs, body: b });
}
