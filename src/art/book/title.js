// Title page: a golden arch (like a mihrab) with a lantern, over little dunes.
import { C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, rect, path, circle, ellipse, g, ridge, sparkle, star8, crescent, palm, camel, lantern } from '../lib.js';

export default function render() {
  const id = ids('title');
  const R = rng(3);
  const defs = [
    linear(id('inside'), [[0, '#FFF9EE'], [0.7, '#FDF0DA'], [1, '#F8E1BC']]),
    glowDef(id('lamp'), '#FFE6A6', 0.75),
    radial(id('sun'), [[0, '#FFE7B0', 0.9], [1, '#FFE7B0', 0]]),
  ].join('');
  const arch = (inset) => {
    const l = 120 + inset;
    const r = 880 - inset;
    const top = 120 + inset * 1.2;
    const shoulder = 330 + inset * 0.3;
    return `M${l},960 L${l},${shoulder} C${l},${top + 70} ${500 - 120},${top + 10} 500,${top - 40} C${500 + 120},${top + 10} ${r},${top + 70} ${r},${shoulder} L${r},960Z`;
  };
  let b = rect(0, 0, 1000, 1000, { fill: '#FBF5EA' });
  // inside of the arch
  b += path(arch(0), { fill: `url(#${id('inside')})` });
  b += g({}, path(arch(0), { fill: 'none', stroke: '#D9AE5B', 'stroke-width': 7 }), path(arch(16), { fill: 'none', stroke: '#E9C77E', 'stroke-width': 2.5 }));
  // little stars inside the arch top
  for (const [x, y, s] of [[300, 260, 10], [700, 250, 12], [360, 330, 6], [640, 330, 7], [250, 400, 6], [760, 420, 8]]) b += sparkle(x, y, s, '#E5A232', { opacity: 0.7 });
  // dunes and palms at the foot of the arch
  b += ellipse(500, 840, 300, 90, { fill: `url(#${id('sun')})` });
  b += path(ridge([[120, 860], [260, 820], [420, 846], [600, 812], [760, 836], [880, 820]], 960), { fill: '#F1D19A' });
  b += path(ridge([[120, 900], [300, 872], [500, 892], [700, 866], [880, 886]], 960), { fill: '#E7B877' });
  b += palm(250, 880, { h: 150, seed: 4, lean: -0.08 });
  b += palm(292, 888, { h: 110, seed: 6, lean: 0.12 });
  b += camel(700, 884, { s: 0.42, body: C.sand4, dark: C.sand5, light: C.sand3 });
  b += camel(780, 890, { s: 0.3, body: C.sand3, dark: C.sand4, light: C.sand2 });
  // base band under the arch
  b += rect(100, 950, 800, 20, { rx: 6, fill: '#D9AE5B' });
  // the lantern hanging over the arch
  b += glow(500, 90, 140, id('lamp'));
  b += lantern(500, 20, { s: 0.75, metal: '#D9962E', glass: '#FFDD85', chain: 30 });
  // corner stars
  for (const [x, y] of [[60, 60], [940, 60], [60, 940], [940, 940]]) b += star8(x, y, 16, '#E9C77E') + circle(x, y, 5, { fill: '#FBF5EA' });
  return svgDoc({ defs, body: b });
}
