// Back cover: a camel caravan walks the dunes toward the crescent moon.
import { C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, rect, path, ellipse, g, ridge, starField, crescent, palm, camel, sparkle, star8 } from '../lib.js';

export default function render() {
  const id = ids('back');
  const R = rng(12);
  const defs = [
    linear(id('sky'), [[0, '#101B38'], [0.45, '#1D3266'], [0.7, '#5C4F95'], [0.86, '#E6A9A6'], [1, '#FFD6A5']]),
    glowDef(id('moon'), '#FFF2C6', 0.5),
    radial(id('hz'), [[0, '#FFE2B8', 0.8], [1, '#FFE2B8', 0]]),
  ].join('');
  let b = rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  b += starField({ seed: 77, n: 110, area: [0, 0, 1000, 640], twinkles: 14 });
  b += glow(500, 640, 260, id('moon')) + crescent(500, 640, 52, { fill: '#FFF0C8', angle: -25, thickness: 0.5 });
  b += ellipse(500, 760, 600, 140, { fill: `url(#${id('hz')})` });
  const haze = (c, t) => mix(c, '#B98AAE', t);
  b += path(ridge([[-20, 790], [200, 750], [420, 780], [640, 740], [860, 772], [1020, 750]], 1000), { fill: haze(C.sand3, 0.45) });
  for (const [x, h, sd] of [[110, 130, 2], [160, 100, 3], [890, 120, 5]]) b += palm(x, 790, { h, seed: sd, dates: false, trunk: haze(C.wood2, 0.5), trunkDark: haze(C.wood3, 0.5), leaf: haze(C.leaf3, 0.5), leafMid: haze(C.leaf4, 0.5), leafDark: haze(C.leaf5, 0.5) });
  b += path(ridge([[-20, 880], [220, 830], [480, 860], [720, 826], [1020, 856]], 1000), { fill: '#E9BE7E' });
  b += path(ridge([[-20, 940], [260, 912], [560, 934], [820, 906], [1020, 926]], 1000), { fill: '#D9A45E' });
  // caravan silhouettes on the middle dune
  const sil = '#6E4A5C';
  for (const [x, s] of [[300, 0.42], [400, 0.4], [495, 0.38], [575, 0.26]]) b += camel(x, 852 - (x - 300) * 0.02, { s, body: sil, dark: sil, light: sil });
  for (let i = 0; i < 12; i++) b += sparkle(R() * 1000, 300 + R() * 300, R.range(4, 8), '#FFF1CF', { opacity: 0.7 });
  b += star8(500, 520, 9, C.gold1);
  return svgDoc({ defs, body: b });
}
