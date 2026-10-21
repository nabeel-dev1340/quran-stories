// Goodnight: a sleepy village on the hills under the stars; everyone is resting.
import { C, svgDoc, ids, rng, mix, linear, glowDef, glow, rect, path, circle, ellipse, g, ridge, starField, crescent, cloud, palm, sheep, house, tree, sparkle } from '../lib.js';

function sleepingCat(x, y, s = 1) {
  return g({ transform: `translate(${x} ${y}) scale(${s})` },
    path('M-50,0 C-56,-34 -20,-48 10,-44 C40,-40 56,-22 52,0Z', { fill: '#E7A15A' }),
    path('M40,-6 C70,-6 74,-30 58,-34', { fill: 'none', stroke: '#E7A15A', 'stroke-width': 10, 'stroke-linecap': 'round' }),
    circle(-38, -26, 20, { fill: '#E7A15A' }),
    path('M-54,-38 L-50,-58 L-38,-44Z M-30,-44 L-20,-60 L-16,-40Z', { fill: '#E7A15A' }),
    path('M-46,-26 q4,4 8,0 M-34,-26 q4,4 8,0', { fill: 'none', stroke: C.ink, 'stroke-width': 2.2, 'stroke-linecap': 'round' }),
    ellipse(-42, -18, 4, 2.4, { fill: C.cheek, opacity: 0.7 }),
    path('M-10,-30 q10,-6 20,0 M6,-38 q8,-4 16,0', { fill: 'none', stroke: '#C9803F', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }),
  );
}

export default function render() {
  const id = ids('gn');
  const R = rng(31);
  const defs = [linear(id('sky'), [[0, '#101B38'], [0.6, '#1F3468'], [1, '#3A4C8A']]), glowDef(id('moon'), '#FFF2C6', 0.5), glowDef(id('win'), '#FFD98A', 0.75)].join('');
  const night = (c, t = 0.55) => mix(c, '#1F3468', t);
  let b = rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  b += starField({ seed: 9, n: 120, area: [0, 0, 1000, 620], twinkles: 16 });
  b += glow(120, 560, 180, id('moon')) + crescent(120, 560, 40, { fill: '#FFF0C8', angle: -28, thickness: 0.5 });
  b += cloud(150, 640, 260, { fill: '#2C3F78', seed: 3, opacity: 0.9 }) + cloud(880, 600, 220, { fill: '#2C3F78', seed: 8, opacity: 0.8 });
  // far hills
  b += path(ridge([[-20, 700], [200, 650], [420, 690], [650, 640], [860, 680], [1020, 650]], 1000), { fill: night(C.leaf4, 0.7) });
  // the little house with a warm window
  b += glow(640, 690, 160, id('win'));
  b += house(640, 760, { w: 150, h: 110, fill: night(C.sand2, 0.45), dark: night(C.sand3, 0.45), door: '#3B2A2A', windows: 0, dome: 52, domeColor: night(C.cream, 0.4) });
  b += path('M600,700 L600,672 Q616,656 632,672 L632,700Z', { fill: '#FFD98A' });
  b += tree(800, 770, { r: 70, trunkH: 60, leaf: night(C.leaf3, 0.5), leafDark: night(C.leaf4, 0.5), leafLight: night(C.leaf2, 0.5), trunk: night(C.wood2, 0.5) });
  b += palm(470, 780, { h: 210, seed: 12, trunk: night(C.wood2, 0.5), trunkDark: night(C.wood3, 0.5), leaf: night(C.leaf3, 0.5), leafMid: night(C.leaf4, 0.5), leafDark: night(C.leaf5, 0.5), dates: false });
  // near hill with sleeping sheep and cat
  b += path(ridge([[-20, 800], [180, 760], [400, 790], [620, 770], [840, 800], [1020, 780]], 1000), { fill: night(C.leaf3, 0.45) });
  b += path(ridge([[-20, 880], [220, 850], [500, 872], [760, 846], [1020, 866]], 1000), { fill: night(C.leaf4, 0.35) });
  b += sheep(230, 860, { s: 0.7, wool: '#DCD8E8', woolShade: '#B7B3CF', face: '#4A3F55' });
  b += sheep(330, 872, { s: 0.55, flip: true, wool: '#DCD8E8', woolShade: '#B7B3CF', face: '#4A3F55' });
  b += sleepingCat(760, 900, 1.1);
  b += path('M790,820 q10,-10 20,0 M808,800 q8,-8 16,0', { fill: 'none', stroke: '#F2C46A', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 });
  for (let i = 0; i < 10; i++) b += sparkle(R() * 1000, 700 + R() * 120, R.range(3, 6), '#FFF1CF', { opacity: 0.6 });
  return svgDoc({ defs, body: b });
}
