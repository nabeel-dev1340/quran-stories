// Adam and the Beautiful Garden (Quran 2:30-37, 7:19-25, 20:117-121).
// The Garden in gentle golden light: a waterfall feeding a clear river,
// fruit everywhere (pomegranates, grapes, figs, dates) and, standing a little
// apart on its own knoll, the one special tree with silvery-blue leaves and
// softly glowing fruit. A peacock, a doe with her fawn and little birds live
// here in peace. No serpent, no apple, no people.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g,
  ridge, smooth, blob, sparkle, cloud, palm, bush, grass, flower, rock, bird, flyingBird, farBird, rays, eye, T, r1,
} from '../lib.js';

// ---------------------------------------------------------------- fruit and leaves
// Hanging pomegranate: rosy-red, stalk on top and its star crown pointing
// down (never an apple). open = a split showing the jewel-like seeds.
function pomegranate(x, y, r, { open = false, stalkTo } = {}) {
  const red = '#CF5560';
  const dark = '#A63E4E';
  const crown = [];
  for (let i = 0; i <= 6; i++) {
    const px = x - r * 0.4 + r * 0.8 * (i / 6);
    const tip = i % 2 === 0;
    crown.push([px, y + r * (tip ? 1.34 : 1.0) - (tip && (i === 0 || i === 6) ? r * 0.1 : 0)]);
  }
  let out = '';
  if (stalkTo) out += path(`M${r1(stalkTo[0])},${r1(stalkTo[1])} Q${r1(x - r * 0.25)},${r1((stalkTo[1] + y - r) / 2)} ${r1(x)},${r1(y - r * 0.9)}`, { fill: 'none', stroke: C.wood3, 'stroke-width': r1(r * 0.16), 'stroke-linecap': 'round' });
  out += path(`M${r1(x - r * 0.42)},${r1(y + r * 0.7)} ` + crown.map(([a, b]) => `L${r1(a)},${r1(b)}`).join(' ') + ` L${r1(x + r * 0.42)},${r1(y + r * 0.7)}Z`, { fill: dark, stroke: dark, 'stroke-width': r1(r * 0.08), 'stroke-linejoin': 'round' });
  out += ellipse(x, y, r * 1.04, r * 0.96, { fill: red });
  out += path(`M${r1(x + r * 0.2)},${r1(y - r * 0.94)} A${r1(r)},${r1(r * 0.96)} 0 0 1 ${r1(x + r * 0.2)},${r1(y + r * 0.95)} A${r1(r * 1.3)},${r1(r * 1.3)} 0 0 0 ${r1(x + r * 0.2)},${r1(y - r * 0.94)}Z`, { fill: dark, opacity: 0.45 });
  out += circle(x - r * 0.3, y - r * 0.28, r * 0.42, { fill: '#E98A7A', opacity: 0.75 });
  out += circle(x - r * 0.42, y - r * 0.42, r * 0.14, { fill: C.white, opacity: 0.75 });
  if (open) {
    // a split in the skin showing the jewel-like seeds
    const ox = x + r * 0.16;
    const oy = y + r * 0.12;
    out += ellipse(ox, oy, r * 0.5, r * 0.56, { fill: '#F8DCC8', transform: `rotate(-14 ${r1(ox)} ${r1(oy)})` });
    for (const [dx, dy] of [[-0.22, -0.3], [0.04, -0.34], [0.26, -0.2], [-0.3, -0.04], [-0.04, -0.08], [0.22, 0.06], [-0.2, 0.2], [0.06, 0.22], [0.26, 0.3], [-0.06, 0.42]]) {
      out += circle(ox + dx * r, oy + dy * r, r * 0.13, { fill: '#D93F5E' });
      out += circle(ox + dx * r - r * 0.04, oy + dy * r - r * 0.04, r * 0.04, { fill: C.white, opacity: 0.85 });
    }
  }
  return out;
}

function grapeBunch(x, y, s = 1, { fill = C.plum3, light = C.plum1, dark = C.plum4, stem = C.wood3 } = {}) {
  const rows = [4, 4, 3, 3, 2, 1];
  const r = 9 * s;
  let out = path(`M${r1(x)},${r1(y - 16 * s)} Q${r1(x + 4 * s)},${r1(y - 6 * s)} ${r1(x)},${r1(y + r * 0.4)}`, { fill: 'none', stroke: stem, 'stroke-width': r1(3 * s), 'stroke-linecap': 'round' });
  rows.forEach((n, i) => {
    for (let k = 0; k < n; k++) {
      const px = x + (k - (n - 1) / 2) * r * 1.62 + (i % 2 ? r * 0.18 : -r * 0.1);
      const py = y + r + i * r * 1.38;
      out += circle(px + r * 0.12, py + r * 0.16, r, { fill: dark });
      out += circle(px, py, r * 0.94, { fill });
      out += circle(px - r * 0.32, py - r * 0.32, r * 0.28, { fill: light, opacity: 0.85 });
    }
  });
  return out;
}

// Palmate grape leaf. (x, y) = where the stalk joins.
function grapeLeaf(x, y, r, rot, fill = C.leaf3, dark = C.leaf4, vein = C.leaf1) {
  const lobes = [[0, -1.02, 0.46], [0.66, -0.66, 0.4], [-0.66, -0.66, 0.4], [0.62, -0.12, 0.32], [-0.62, -0.12, 0.32], [0, -0.5, 0.56]];
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})` },
    g({ fill: dark }, lobes.map(([a, b, c]) => circle(a * r + r * 0.06, b * r + r * 0.08, c * r))),
    g({ fill }, lobes.map(([a, b, c]) => circle(a * r, b * r, c * r))),
    path(`M0,0 L0,${r1(-r * 1.1)} M0,${r1(-r * 0.25)} L${r1(r * 0.62)},${r1(-r * 0.66)} M0,${r1(-r * 0.25)} L${r1(-r * 0.62)},${r1(-r * 0.66)} M0,${r1(-r * 0.1)} L${r1(r * 0.62)},${r1(-r * 0.1)} M0,${r1(-r * 0.1)} L${r1(-r * 0.62)},${r1(-r * 0.1)}`, { fill: 'none', stroke: vein, 'stroke-width': r1(Math.max(1.4, r * 0.05)), 'stroke-linecap': 'round', opacity: 0.6 }),
  );
}

// Deeply lobed fig leaf. (x, y) = where the stalk joins; lobes point "up" before rotation.
function figLeaf(x, y, r, rot, fill = C.leaf3, dark = C.leaf4, vein = C.leaf1) {
  const lobes = [[-90, 1.0], [-38, 0.82], [-142, 0.82], [8, 0.55], [172, 0.55]];
  const shape = (dx, dy, col) => g({ fill: col },
    circle(dx, dy, r * 0.34),
    ...lobes.map(([a, L]) => {
      const rad = (a * Math.PI) / 180;
      const cx = dx + Math.cos(rad) * r * L * 0.52;
      const cy = dy + Math.sin(rad) * r * L * 0.52;
      return ellipse(cx, cy, r * L * 0.52, r * 0.26 * (0.7 + L * 0.3), { transform: `rotate(${a} ${r1(cx)} ${r1(cy)})` });
    }));
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})` },
    shape(r * 0.05, r * 0.07, dark),
    shape(0, 0, fill),
    path(lobes.map(([a, L]) => {
      const rad = (a * Math.PI) / 180;
      return `M0,0 L${r1(Math.cos(rad) * r * L * 0.9)},${r1(Math.sin(rad) * r * L * 0.9)}`;
    }).join(' '), { fill: 'none', stroke: vein, 'stroke-width': r1(Math.max(1.5, r * 0.04)), 'stroke-linecap': 'round', opacity: 0.55 }),
  );
}

function fig(x, y, r, fill = C.plum3, dark = C.plum4, light = C.plum1) {
  const d = (k) => `M${r1(x)},${r1(y - r * 1.5 * k)} C${r1(x + r * 0.4)},${r1(y - r * 1.3)} ${r1(x + r)},${r1(y - r * 0.6)} ${r1(x + r)},${r1(y)} C${r1(x + r)},${r1(y + r * 0.7)} ${r1(x + r * 0.5)},${r1(y + r)} ${r1(x)},${r1(y + r)} C${r1(x - r * 0.5)},${r1(y + r)} ${r1(x - r)},${r1(y + r * 0.7)} ${r1(x - r)},${r1(y)} C${r1(x - r)},${r1(y - r * 0.6)} ${r1(x - r * 0.4)},${r1(y - r * 1.3)} ${r1(x)},${r1(y - r * 1.5 * k)}Z`;
  return (
    path(`M${r1(x)},${r1(y - r * 1.45)} L${r1(x + r * 0.1)},${r1(y - r * 1.9)}`, { stroke: C.leaf5, 'stroke-width': r1(r * 0.22), 'stroke-linecap': 'round' }) +
    path(d(1), { fill }) +
    path(`M${r1(x + r * 0.1)},${r1(y - r * 1.2)} C${r1(x + r * 0.8)},${r1(y - r * 0.6)} ${r1(x + r * 0.9)},${r1(y + r * 0.6)} ${r1(x + r * 0.2)},${r1(y + r * 0.98)} C${r1(x + r * 0.7)},${r1(y + r * 0.4)} ${r1(x + r * 0.6)},${r1(y - r * 0.6)} ${r1(x + r * 0.1)},${r1(y - r * 1.2)}Z`, { fill: dark, opacity: 0.5 }) +
    ellipse(x - r * 0.38, y - r * 0.2, r * 0.22, r * 0.4, { fill: light, opacity: 0.55, transform: `rotate(15 ${r1(x - r * 0.38)} ${r1(y - r * 0.2)})` })
  );
}

// Long pointed leaf from its base (x, y); ang in degrees.
function leaf(x, y, len, ang, w, fill, vein) {
  const d = `M0,0 C${r1(len * 0.3)},${r1(-w)} ${r1(len * 0.72)},${r1(-w * 0.8)} ${r1(len)},0 C${r1(len * 0.72)},${r1(w * 0.8)} ${r1(len * 0.3)},${r1(w)} 0,0Z`;
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})` },
    path(d, { fill }),
    path(`M0,0 C${r1(len * 0.35)},${r1(-w * 0.12)} ${r1(len * 0.7)},${r1(-w * 0.1)} ${r1(len * 0.96)},0`, { fill: 'none', stroke: vein, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.55 }),
  );
}

// ---------------------------------------------------------------- creatures
function peacock(x, y, { s = 1, flip = false } = {}) {
  const parts = [];
  const bx = -26;
  const by = -64;
  const Rf = 138;
  // the fanned tail: a soft green fan, feather shafts and eye-spots
  parts.push(path(`M${bx},${by} L${r1(bx + Math.cos(Math.PI * 1.04) * Rf)},${r1(by + Math.sin(Math.PI * 1.04) * Rf)} A${Rf},${Rf} 0 0 1 ${r1(bx + Math.cos(Math.PI * 1.96) * Rf)},${r1(by + Math.sin(Math.PI * 1.96) * Rf)}Z`, { fill: C.leaf3 }));
  parts.push(path(`M${bx},${by} L${r1(bx + Math.cos(Math.PI * 1.04) * Rf * 0.72)},${r1(by + Math.sin(Math.PI * 1.04) * Rf * 0.72)} A${Rf * 0.72},${Rf * 0.72} 0 0 1 ${r1(bx + Math.cos(Math.PI * 1.96) * Rf * 0.72)},${r1(by + Math.sin(Math.PI * 1.96) * Rf * 0.72)}Z`, { fill: C.leaf2, opacity: 0.7 }));
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.08 + (0.84 * i) / (n - 1));
    const ex = bx + Math.cos(a) * Rf * 0.86;
    const ey = by + Math.sin(a) * Rf * 0.86;
    parts.push(path(`M${bx},${by} L${r1(ex)},${r1(ey)}`, { stroke: C.leaf4, 'stroke-width': 2.2, opacity: 0.6 }));
    parts.push(ellipse(ex, ey, 15, 12, { fill: C.gold2, transform: `rotate(${r1((a * 180) / Math.PI + 90)} ${r1(ex)} ${r1(ey)})` }));
    parts.push(ellipse(ex, ey + 1, 10, 8, { fill: C.water3, transform: `rotate(${r1((a * 180) / Math.PI + 90)} ${r1(ex)} ${r1(ey + 1)})` }));
    parts.push(circle(ex, ey + 1.5, 4.5, { fill: C.water6 }));
  }
  for (let i = 0; i < n - 1; i++) {
    const a = Math.PI * (1.12 + (0.76 * i) / (n - 2));
    const ex = bx + Math.cos(a) * Rf * 0.56;
    const ey = by + Math.sin(a) * Rf * 0.56;
    parts.push(ellipse(ex, ey, 8, 6.5, { fill: C.gold2, transform: `rotate(${r1((a * 180) / Math.PI + 90)} ${r1(ex)} ${r1(ey)})` }));
    parts.push(circle(ex, ey + 0.8, 3.6, { fill: C.water4 }));
  }
  // legs
  parts.push(path('M-2,-30 L-4,0 M14,-30 L16,0', { stroke: C.stone2, 'stroke-width': 4, 'stroke-linecap': 'round' }));
  parts.push(path('M-12,0 L4,0 M6,0 L24,0', { stroke: C.stone2, 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
  // body
  parts.push(ellipse(6, -60, 28, 36, { fill: C.water4 }));
  parts.push(ellipse(10, -64, 22, 30, { fill: C.water3 }));
  // folded wing with soft bars
  parts.push(path('M-22,-74 C-12,-92 12,-84 14,-62 C14,-44 -6,-34 -22,-44 C-30,-52 -30,-64 -22,-74Z', { fill: C.sand2 }));
  parts.push(path('M-20,-66 Q-6,-72 8,-66 M-22,-54 Q-6,-60 10,-54', { fill: 'none', stroke: C.sand4, 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0.7 }));
  // neck and head
  parts.push(path('M4,-88 C6,-104 12,-118 20,-126 L38,-120 C30,-108 30,-96 30,-80Z', { fill: C.water3 }));
  parts.push(circle(29, -130, 14, { fill: C.water3 }));
  parts.push(path('M24,-132 C28,-138 38,-138 40,-130 C36,-132 30,-131 24,-132Z', { fill: C.white, opacity: 0.85 }));
  parts.push(path('M41,-133 L54,-128 L41,-124Z', { fill: C.gold3 }));
  parts.push(eye(35, -132, 3.4));
  parts.push(ellipse(36, -122, 4, 2.6, { fill: C.cheek, opacity: 0.6 }));
  // crest
  for (const [cx, cy] of [[18, -160], [26, -164], [34, -161]]) {
    parts.push(path(`M28,-142 L${cx},${cy}`, { stroke: C.water4, 'stroke-width': 1.8, 'stroke-linecap': 'round' }));
    parts.push(circle(cx, cy, 3.6, { fill: C.water3 }));
  }
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// Deer facing right. pose 'drink' lowers the head to the water.
function deer(x, y, { s = 1, flip = false, coat = C.wood1, dark = C.wood2, light = '#F7E4C8', hoof = C.wood4, spots = false, drink = false } = {}) {
  const parts = [ellipse(0, 2, 80, 9, { fill: C.ink, opacity: 0.12 })];
  parts.push(rect(-50, -84, 12, 86, { rx: 6, fill: dark }), rect(30, -84, 12, 86, { rx: 6, fill: dark }));
  parts.push(rect(-50, -8, 12, 10, { rx: 5, fill: hoof }), rect(30, -8, 12, 10, { rx: 5, fill: hoof }));
  parts.push(ellipse(-70, -112, 11, 15, { fill: coat, transform: 'rotate(-30 -70 -112)' }));
  parts.push(ellipse(-72, -106, 7, 10, { fill: light, transform: 'rotate(-30 -72 -106)' }));
  parts.push(path('M-74,-108 C-76,-134 -44,-146 -6,-144 C30,-142 58,-134 64,-110 C68,-86 44,-74 -6,-74 C-50,-74 -72,-84 -74,-108Z', { fill: coat }));
  parts.push(path('M-60,-88 C-30,-76 30,-76 56,-90 C48,-78 30,-74 -6,-74 C-40,-74 -54,-80 -60,-88Z', { fill: light, opacity: 0.9 }));
  parts.push(path('M-66,-118 C-56,-136 -24,-142 4,-140 C-24,-134 -48,-128 -66,-118Z', { fill: mix(coat, '#FFFFFF', 0.3), opacity: 0.8 }));
  if (spots) for (const [a, b, r] of [[-36, -118, 5.5], [-14, -126, 5.5], [8, -122, 5], [-26, -104, 4.5], [-2, -110, 4.5], [20, -108, 4], [-48, -104, 4]]) parts.push(circle(a, b, r, { fill: light, opacity: 0.9 }));
  parts.push(rect(-40, -86, 13, 88, { rx: 6.5, fill: coat }), rect(42, -86, 13, 88, { rx: 6.5, fill: coat }));
  parts.push(rect(-40, -8, 13, 10, { rx: 5, fill: hoof }), rect(42, -8, 13, 10, { rx: 5, fill: hoof }));
  if (drink) {
    parts.push(path('M18,-140 C58,-140 96,-110 120,-72 L142,-58 C118,-82 92,-100 60,-96 C52,-96 46,-100 44,-104Z', { fill: coat }));
    parts.push(path('M60,-96 C92,-100 118,-82 142,-58 L134,-56 C114,-76 90,-90 62,-90Z', { fill: light, opacity: 0.55 }));
    parts.push(ellipse(110, -72, 9, 19, { fill: dark, transform: 'rotate(-120 110 -72)' }));
    parts.push(g({ transform: 'rotate(58 128 -50)' },
      ellipse(128, -50, 24, 19, { fill: coat }),
      ellipse(148, -42, 15, 11, { fill: light }),
      circle(161, -44, 4.5, { fill: C.ink }),
    ));
    parts.push(ellipse(122, -78, 9, 19, { fill: coat, transform: 'rotate(-70 122 -78)' }));
    parts.push(ellipse(122, -78, 4.5, 12, { fill: C.rose1, transform: 'rotate(-70 122 -78)' }));
    parts.push(eye(134, -52, 4.4, true));
    parts.push(ellipse(132, -38, 6, 4, { fill: C.cheek, opacity: 0.6, transform: 'rotate(58 132 -38)' }));
  } else {
    parts.push(path('M34,-128 C44,-150 52,-166 60,-182 L86,-176 C80,-156 72,-132 62,-110Z', { fill: coat }));
    parts.push(path('M58,-120 C66,-140 74,-158 80,-176 L86,-176 C80,-156 72,-132 62,-110Z', { fill: light, opacity: 0.55 }));
    parts.push(ellipse(54, -202, 9, 19, { fill: dark, transform: 'rotate(-62 54 -202)' }));
    parts.push(ellipse(92, -206, 9, 19, { fill: coat, transform: 'rotate(52 92 -206)' }));
    parts.push(ellipse(92, -206, 4.5, 12, { fill: C.rose1, transform: 'rotate(52 92 -206)' }));
    parts.push(ellipse(76, -188, 25, 21, { fill: coat }));
    parts.push(ellipse(96, -178, 16, 12, { fill: light }));
    parts.push(circle(110, -180, 4.5, { fill: C.ink }));
    parts.push(eye(82, -192, 4.6));
    parts.push(ellipse(88, -178, 6.5, 4, { fill: C.cheek, opacity: 0.6 }));
  }
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

function butterfly(x, y, { s = 1, rot = 0, wing = C.gold2, wing2 = C.coral2, spot = C.cream, bodyC = C.ink2 } = {}) {
  const up = 'M0,-2 C6,-30 38,-40 46,-22 C52,-8 34,4 0,0Z';
  const lo = 'M0,2 C20,2 36,14 30,30 C24,42 6,30 0,6Z';
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})` },
    path(up, { fill: wing }), path(up, { fill: wing, transform: 'scale(-1 1)' }),
    path(lo, { fill: wing2 }), path(lo, { fill: wing2, transform: 'scale(-1 1)' }),
    circle(28, -18, 6, { fill: spot, opacity: 0.85 }), circle(-28, -18, 6, { fill: spot, opacity: 0.85 }),
    ellipse(0, 4, 3.6, 15, { fill: bodyC }),
    path('M-1,-9 Q-5,-20 -11,-25 M1,-9 Q5,-20 11,-25', { fill: 'none', stroke: bodyC, 'stroke-width': 2, 'stroke-linecap': 'round' }),
    circle(-11, -25, 2.4, { fill: bodyC }), circle(11, -25, 2.4, { fill: bodyC }),
  );
}

// ---------------------------------------------------------------- the special tree
function specialTree(x, y, { fruitGlow, R }) {
  const cx = x;
  const cy = y - 252;
  let out = '';
  // roots and trunk in soft silver-lavender
  out += path(`M${x - 44},${y + 4} C${x - 26},${y - 6} ${x - 22},${y - 30} ${x - 20},${y - 70} C${x - 18},${y - 120} ${x - 30},${y - 150} ${x - 70},${y - 200} L${x - 50},${y - 214} C${x - 20},${y - 180} ${x - 6},${y - 168} ${x},${y - 172} C${x + 8},${y - 170} ${x + 30},${y - 190} ${x + 60},${y - 220} L${x + 78},${y - 204} C${x + 40},${y - 160} ${x + 22},${y - 120} ${x + 22},${y - 70} C${x + 22},${y - 30} ${x + 30},${y - 6} ${x + 48},${y + 4}Z`, { fill: '#B9B3CF' });
  out += path(`M${x + 4},${y - 170} C${x + 14},${y - 172} ${x + 34},${y - 192} ${x + 60},${y - 220} L${x + 78},${y - 204} C${x + 40},${y - 160} ${x + 22},${y - 120} ${x + 22},${y - 70} C${x + 22},${y - 30} ${x + 30},${y - 6} ${x + 48},${y + 4} L${x + 8},${y + 4} C${x + 10},${y - 40} ${x + 8},${y - 110} ${x + 4},${y - 170}Z`, { fill: '#958DB0', opacity: 0.55 });
  out += path(`M${x - 12},${y - 20} C${x - 10},${y - 60} ${x - 8},${y - 100} ${x - 16},${y - 140}`, { fill: 'none', stroke: '#E4E0F0', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.6 });
  // branches reaching up into the canopy
  out += path(`M${x - 60},${y - 206} C${x - 90},${y - 240} ${x - 110},${y - 262} ${x - 128},${y - 300} M${x + 70},${y - 212} C${x + 96},${y - 250} ${x + 104},${y - 280} ${x + 118},${y - 316} M${x - 2},${y - 172} C${x + 4},${y - 230} ${x - 6},${y - 280} ${x + 4},${y - 330}`, { fill: 'none', stroke: '#A39BBE', 'stroke-width': 12, 'stroke-linecap': 'round' });
  // canopy: silvery-blue lobes
  const lobes = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10 + 0.15;
    lobes.push([cx + Math.cos(a) * 140, cy + Math.sin(a) * 82, R.range(62, 74)]);
  }
  lobes.push([cx - 40, cy - 30, 90], [cx + 50, cy - 20, 88], [cx, cy + 20, 92]);
  // a fringe of small pointed leaves all round the edge
  const leafy = (lx, ly, len, ang, fill) => ellipse(lx, ly, len, len * 0.38, { fill, transform: `rotate(${r1(ang)} ${r1(lx)} ${r1(ly)})` });
  let fringeBack = '';
  let fringe = '';
  for (let i = 0; i < 64; i++) {
    const a = (Math.PI * 2 * i) / 64 + R.range(-0.04, 0.04);
    const ex = cx + Math.cos(a) * 200;
    const ey = cy + Math.sin(a) * 136;
    const deg = (a * 180) / Math.PI;
    const len = R.range(16, 22);
    fringeBack += leafy(ex + 6, ey + 9, len, deg, '#7FA2C3');
    fringe += leafy(ex, ey, len, deg + R.range(-20, 20), Math.sin(a) < -0.2 && Math.cos(a) < 0.4 ? '#C4DCEE' : '#A4C3DD');
  }
  out += fringeBack;
  out += g({ fill: '#86A9C9' }, lobes.map(([a, b, c]) => circle(a + 8, b + 12, c)));
  out += fringe;
  out += g({ fill: '#AFCDE4' }, lobes.map(([a, b, c]) => circle(a, b, c)));
  // shady pockets lower right, give the crown depth
  out += g({ fill: '#95B7D3', opacity: 0.8 }, circle(cx + 70, cy + 60, 44), circle(cx + 130, cy + 22, 34), circle(cx - 10, cy + 80, 40), circle(cx - 96, cy + 70, 30));
  out += g({ fill: '#D5E8F4', opacity: 0.9 }, circle(cx - 92, cy - 52, 50), circle(cx - 30, cy - 82, 46), circle(cx - 128, cy, 34), circle(cx + 30, cy - 92, 30));
  // leaf tufts for texture
  for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI * 2;
    const d = Math.sqrt(R());
    const tx = cx + Math.cos(a) * 150 * d;
    const ty = cy + Math.sin(a) * 92 * d;
    const lit = tx - cx + (ty - cy) * 1.2 < -40;
    const col = lit ? '#DCECF6' : '#9CBBD6';
    out += leafy(tx, ty, R.range(9, 13), R.range(-180, 180), col);
  }
  out += g({ fill: '#F2F8FC', opacity: 0.7 }, circle(cx - 100, cy - 66, 18), circle(cx - 44, cy - 98, 14));
  // glowing fruit
  const fruitPts = [[-120, 10], [-70, -50], [-10, -70], [60, -60], [118, -10], [-96, 64], [-30, 20], [40, 30], [100, 60], [0, 96], [-150, -40], [150, -60], [-60, 110], [70, 110]];
  for (const [dx, dy] of fruitPts) {
    const fx = cx + dx;
    const fy = cy + dy;
    out += glow(fx, fy, 30, fruitGlow);
    out += ellipse(fx, fy, 9.5, 11, { fill: '#FFE7A1' });
    out += ellipse(fx - 1.5, fy - 1.5, 6.5, 7.5, { fill: '#FFF7DA' });
    out += circle(fx - 3, fy - 4, 2.2, { fill: C.white });
  }
  return out;
}

// ---------------------------------------------------------------- the scene
export default function render() {
  const id = ids('s02');
  const R = rng(202);
  const skyTint = '#FFEBC8';
  const far = (c) => mix(c, skyTint, 0.58);
  const mid = (c) => mix(c, skyTint, 0.28);
  const defs = [
    linear(id('sky'), [[0, '#F7D3A3'], [0.32, '#FFE3B6'], [0.62, '#FFF1D6'], [1, '#FFF7E6']]),
    glowDef(id('heaven'), '#FFF8E2', 0.95),
    glowDef(id('treeGlow'), '#FFF3CC', 0.85),
    glowDef(id('fruitGlow'), '#FFE69A', 0.9),
    glowDef(id('mist'), '#FFFFFF', 0.85),
    linear(id('fall'), [[0, C.water0], [0.5, '#BDEAEA'], [1, C.water1]]),
    linear(id('river'), [[0, '#BFEBEA'], [0.35, C.water1], [1, C.water2]]),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');

  let body = '';
  // ------------------------------------------------------------ sky and light
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += glow(470, 40, 520, id('heaven'));
  body += cloud(170, 250, 210, { fill: '#FFF6E8', shade: '#F6D8BC', seed: 3, opacity: 0.95 });
  body += cloud(820, 290, 180, { fill: '#FFF6E8', shade: '#F6D8BC', seed: 6, opacity: 0.9 });
  body += cloud(560, 130, 120, { fill: '#FFF8EE', shade: '#F8E0C6', seed: 9, opacity: 0.7 });
  body += flyingBird(330, 330, { s: 0.42, body: C.white, wing: C.gold0 }) + flyingBird(385, 300, { s: 0.34, up: false, body: C.white, wing: C.gold0 });
  body += farBird(700, 200, 1, '#C79A6E', 0.5) + farBird(735, 186, 0.8, '#C79A6E', 0.45);

  // ------------------------------------------------------------ far land
  body += path(ridge([[-20, 560], [120, 530], [300, 548], [470, 520], [640, 540], [820, 515], [1020, 535]], 700), { fill: far(C.leaf2) });
  for (const [tx, ty, tr] of [[90, 545, 26], [140, 540, 20], [380, 540, 22], [600, 540, 24], [650, 538, 18], [880, 530, 24]]) {
    body += circle(tx, ty - tr, tr, { fill: far(C.leaf3) }) + circle(tx - tr * 0.3, ty - tr * 1.3, tr * 0.5, { fill: far(C.leaf1) });
  }
  body += path(ridge([[-20, 600], [160, 572], [340, 590], [520, 566], [700, 588], [880, 570], [1020, 584]], 760), { fill: far(C.leaf3) });
  // a distant silver river winding across the far meadow
  {
    const fr = [[470, 586, 1], [400, 592, 3], [300, 589, 5], [190, 597, 7], [80, 594, 9], [-20, 600, 11]];
    body += path(`${smooth(fr.map(([x, y, w]) => [x, y - w * 0.5]))} L${smooth(fr.map(([x, y, w]) => [x, y + w * 0.6]).reverse()).slice(1)} Z`, { fill: mix(C.water1, skyTint, 0.3) });
    body += path(smooth(fr.slice(1).map(([x, y]) => [x, y - 0.5])), { fill: 'none', stroke: C.white, 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: 0.7 });
  }

  // mid hills and date palms on the left
  body += path(ridge([[-20, 650], [140, 624], [320, 640], [520, 622], [720, 640], [1020, 628]], 1000), { fill: mid(C.leaf2) });
  body += palm(96, 706, { h: 255, seed: 4, lean: 0.06, dateColor: C.coral3, trunk: mid(C.wood2), trunkDark: mid(C.wood3), leaf: mid(C.leaf3), leafMid: mid(C.leaf4), leafDark: mid(C.leaf5) });
  body += palm(214, 712, { h: 205, seed: 9, lean: -0.1, dateColor: C.gold3, trunk: mid(C.wood2), trunkDark: mid(C.wood3), leaf: mid(C.leaf3), leafMid: mid(C.leaf4), leafDark: mid(C.leaf5) });
  body += bush(300, 712, { w: 100, seed: 3, fill: mid(C.leaf3), dark: mid(C.leaf4), light: mid(C.leaf2) });
  body += bush(70, 722, { w: 120, seed: 5, fill: mid(C.leaf3), dark: mid(C.leaf4), light: mid(C.leaf2) });

  // ------------------------------------------------------------ the waterfall cliff on the right
  const stone = '#EED6BE';
  const stoneDark = '#D7B497';
  body += path(blob([[690, 700], [700, 600], [736, 500], [812, 450], [900, 446], [1000, 452], [1040, 520], [1040, 720], [860, 724]], 1), { fill: stone });
  body += path(blob([[890, 470], [960, 456], [1040, 500], [1040, 720], [930, 720], [920, 600]], 1), { fill: stoneDark, opacity: 0.6 });
  body += path('M716,600 Q760,588 800,598 M732,540 Q770,530 806,538 M900,560 Q950,548 1000,560 M910,630 Q960,618 1010,630', { fill: 'none', stroke: stoneDark, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.5 });
  body += bush(750, 500, { w: 110, seed: 7 }) + bush(960, 470, { w: 140, seed: 8 }) + bush(708, 610, { w: 70, seed: 2 });
  for (const [fx, fy, c] of [[730, 470, C.rose1], [760, 458, C.white], [940, 430, C.gold1], [985, 440, C.rose1], [915, 446, C.white]]) body += flower(fx, fy, { r: 8, fill: c, center: C.gold2 });
  // the falling water
  body += path('M806,462 C812,446 878,444 884,460 C884,470 806,472 806,462Z', { fill: stoneDark, opacity: 0.8 });
  body += path('M816,462 C816,530 810,600 802,660 L888,660 C880,600 874,530 874,462Z', { fill: `url(#${id('fall')})` });
  body += path('M812,466 C814,450 876,448 878,464 C870,458 822,458 812,466Z', { fill: C.water0 });
  body += path('M818,458 C830,452 860,452 872,458', { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 });
  for (const [sx, sy, sl] of [[826, 470, 120], [838, 500, 140], [850, 466, 170], [862, 520, 120], [832, 600, 50], [858, 610, 44], [846, 560, 60]]) {
    body += path(`M${sx},${sy} L${sx - (sy - 450) * 0.08},${sy + sl}`, { stroke: C.white, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.7 });
  }

  // ------------------------------------------------------------ the knoll and the special tree
  body += path(ridge([[300, 720], [400, 664], [520, 640], [640, 660], [740, 720]], 760), { fill: C.leaf1 });
  body += ellipse(520, 652, 150, 22, { fill: '#E8F5CF', opacity: 0.7 });
  body += glow(520, 400, 360, id('treeGlow'));
  body += specialTree(520, 650, { fruitGlow: id('fruitGlow'), R });
  for (const [fx, fy, c] of [[430, 672, C.white], [452, 660, C.rose0], [600, 662, C.white], [622, 674, C.gold0], [380, 690, C.rose1], [660, 690, C.white], [470, 686, C.gold1], [575, 684, C.rose1]]) body += flower(fx, fy, { r: 7, fill: c, center: C.gold2 });
  for (const [sx, sy, sz] of [[340, 300, 12], [700, 260, 14], [300, 430, 8], [740, 420, 10], [520, 150, 9], [640, 190, 7], [400, 210, 8]]) body += sparkle(sx, sy, sz, C.white, { opacity: 0.9 });

  // gentle rays of golden light
  body += rays(470, -60, { n: 9, len: 1200, spread: 80, dir: 90, width: 4, color: '#FFF7DD', op: 0.13 });

  // ------------------------------------------------------------ the river
  const centre = [[800, 676, 24], [700, 694, 28], [580, 712, 34], [470, 736, 46], [392, 796, 70], [380, 884, 110], [420, 1020, 170]];
  const lb = centre.map(([x, y, w]) => [x, y - w * 0.3 - 4]);
  const rb = centre.map(([x, y, w]) => [x, y + w * 0.3 + 4]);
  void lb; void rb;
  const L = centre.map(([x, y, w], i) => (i < 3 ? [x, y - w * 0.4] : [x - w, y]));
  const Rr = centre.map(([x, y, w], i) => (i < 3 ? [x, y + w * 0.45] : [x + w, y]));
  const riverD = (A, B) => `${smooth(A)} L${smooth(B.slice().reverse()).slice(1)} Z`;
  body += path(riverD(L.map(([x, y]) => [x - 4, y - 4]), Rr.map(([x, y]) => [x + 4, y + 4])), { fill: '#E9F3D2' });
  body += path(riverD(L, Rr), { fill: `url(#${id('river')})` });
  for (const [rx, ry, rw, op] of [[700, 694, 50, 0.6], [560, 712, 60, 0.55], [430, 760, 50, 0.5], [380, 840, 70, 0.5], [420, 930, 90, 0.45], [330, 900, 50, 0.4], [470, 980, 70, 0.4]]) {
    body += path(`M${rx - rw / 2},${ry} q${rw / 2},-6 ${rw},0`, { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: op });
  }
  for (const [sx, sy, sz] of [[600, 708, 8], [450, 790, 9], [400, 950, 7]]) body += sparkle(sx, sy, sz, C.white, { opacity: 0.85 });
  // the pool under the falls, with soft foam and mist
  body += ellipse(846, 672, 126, 26, { fill: C.water1 });
  body += ellipse(846, 668, 100, 16, { fill: '#C8F0EE' });
  body += glow(846, 656, 120, id('mist'));
  for (let i = 0; i < 16; i++) body += circle(806 + R() * 80, 652 + R() * 16, R.range(5, 10), { fill: C.white, opacity: r1(R.range(0.35, 0.7) * 100) / 100 });
  body += path('M770,676 q30,-6 60,0 M860,680 q30,-6 60,0', { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 });

  // ------------------------------------------------------------ foreground meadows
  body += path(ridge([[-20, 780], [120, 768], [250, 784], [330, 820], [370, 880], [330, 1000]], 1000), { fill: C.leaf2 });
  body += path(ridge([[470, 1000], [480, 900], [520, 830], [640, 790], [800, 776], [1020, 768]], 1000), { fill: C.leaf2 });
  body += path(ridge([[-20, 860], [140, 846], [280, 870], [330, 930], [320, 1000]], 1000), { fill: C.leaf3, opacity: 0.5 });
  body += path(ridge([[500, 1000], [530, 900], [700, 870], [880, 860], [1020, 864]], 1000), { fill: C.leaf3, opacity: 0.5 });
  // flowers everywhere
  const pal = [C.rose1, C.coral1, C.gold1, C.white, C.plum1, C.rose2, C.coral2];
  for (let i = 0; i < 46; i++) {
    const left = i % 2 === 0;
    const fx = left ? R() * 330 : 520 + R() * 480;
    const fy = left ? 800 + R() * 190 : 810 + R() * 180;
    if (!left && fx < 760 && fy < 900) continue; // keep the deer clear
    if (left && fx > 110 && fx < 300 && fy < 920) continue; // and the peacock
    body += flower(fx, fy, { r: R.range(8, 13), fill: R.pick(pal), center: C.gold2, stemH: R.range(8, 16), rot: R() * 70 });
  }

  // the doe drinking and her fawn
  body += deer(616, 892, { s: 0.8, flip: true, drink: true });
  body += deer(738, 866, { s: 0.52, flip: true, spots: true });
  // the peacock
  body += peacock(205, 905, { s: 0.92 });
  body += butterfly(470, 600, { s: 0.55, rot: 10, wing: C.rose1, wing2: C.plum2 });
  body += butterfly(330, 790, { s: 0.6, rot: -12, wing: C.gold1, wing2: C.coral2 });

  // ------------------------------------------------------------ framing branches
  // top left: a pomegranate branch
  body += path('M-20,250 C60,210 140,150 250,128 C300,118 340,124 372,140', { fill: 'none', stroke: C.wood3, 'stroke-width': 13, 'stroke-linecap': 'round' });
  body += path('M120,176 C140,120 170,90 210,70 M250,128 C270,100 300,84 330,80', { fill: 'none', stroke: C.wood3, 'stroke-width': 7, 'stroke-linecap': 'round' });
  for (const [lx, ly, len, ang] of [[30, 222, 70, -100], [60, 206, 64, 40], [96, 190, 70, -120], [140, 166, 66, 30], [170, 104, 62, -60], [196, 78, 56, -150], [212, 140, 70, -90], [262, 126, 60, 50], [300, 92, 60, -40], [330, 82, 54, 10], [350, 134, 58, 70], [372, 140, 60, 10], [-6, 240, 70, 80]]) {
    body += leaf(lx, ly, len, ang, 13, C.leaf4, C.leaf2);
  }
  body += pomegranate(26, 274, 22, { stalkTo: [28, 226] }) + pomegranate(92, 240, 32, { open: true, stalkTo: [96, 194] }) + pomegranate(198, 186, 26, { stalkTo: [196, 142] }) + pomegranate(306, 156, 22, { stalkTo: [304, 122] });
  body += bird(248, 128, { s: 0.55, flip: false, body: C.gold2, wing: C.gold3, belly: C.gold0, beak: C.coral2 });
  // top right: a grapevine with bunches of grapes
  body += path('M600,-20 C660,40 740,60 820,58 C900,56 960,80 1030,130', { fill: 'none', stroke: C.wood2, 'stroke-width': 12, 'stroke-linecap': 'round' });
  body += path('M760,60 C780,90 774,110 790,120 M930,72 C944,96 960,98 970,110', { fill: 'none', stroke: C.wood2, 'stroke-width': 3, 'stroke-linecap': 'round' });
  body += grapeBunch(700, 64, 1.05) + grapeBunch(850, 72, 1.2, { fill: C.leaf1, light: C.leaf0, dark: C.leaf2 }) + grapeBunch(985, 112, 1.1);
  for (const [lx, ly, lr, rot] of [[630, 20, 46, 150], [670, 44, 40, -160], [760, 56, 50, 170], [800, 50, 44, -140], [900, 58, 52, 160], [940, 70, 46, -170], [1000, 98, 50, 140], [740, 40, 40, 20]]) {
    body += grapeLeaf(lx, ly, lr, rot, C.leaf3, C.leaf4, C.leaf1);
  }
  body += bird(880, 64, { s: 0.55, flip: true, body: C.sky0, wing: C.water3, belly: C.sky2, beak: C.gold2 });
  // bottom right: a fig branch
  body += path('M1030,830 C980,820 930,800 880,770', { fill: 'none', stroke: C.wood2, 'stroke-width': 10, 'stroke-linecap': 'round' });
  for (const [lx, ly, lr, rot] of [[880, 772, 62, -60], [940, 800, 70, -10], [990, 822, 60, 40], [915, 790, 56, -120], [1010, 850, 66, 120]]) body += figLeaf(lx, ly, lr, rot, C.leaf3, C.leaf4, C.leaf1);
  body += fig(905, 820, 16) + fig(960, 848, 18) + fig(870, 800, 14, C.leaf2, C.leaf3, C.leaf0) + fig(1000, 872, 15);
  // bottom left: tall grass
  for (const [gx, gh, sd] of [[16, 90, 1], [60, 70, 2], [110, 60, 3]]) body += grass(gx, 1006, { h: gh, n: 6, seed: sd, fill: C.leaf4 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
