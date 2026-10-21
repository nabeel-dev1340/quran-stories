// Welcome, guests! (Quran 11:69-73, 51:24-30)
// Ibrahim's hospitality at dusk: a big open tent glowing warmly inside; in
// front, a cloth spread with food - a large platter with a roasted dish,
// bread, dates, grapes and a water jug - with cushions set out for the
// guests. Lanterns, palms, resting camels and the first stars. No people.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth,
  sparkle, palm, lantern, eye, grass, shadow, r1, T,
} from '../lib.js';

// ---------------------------------------------------------------- creatures
// A camel resting on the sand with its legs folded under (faces right).
// (x, y) = middle of the body on the ground.
function restingCamel(x, y, { s = 1, flip = false, body = C.sand3, dark = C.sand4, light = C.sand2, sleepy = false, blanket } = {}) {
  const p = [];
  p.push(ellipse(0, 2, 120, 14, { fill: C.ink, opacity: 0.16 }));
  // folded hind leg (far) and tail
  p.push(path('M-96,-30 Q-112,-20 -106,-4', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  // body with hump
  p.push(path('M-100,0 C-106,-40 -84,-66 -50,-70 C-40,-118 16,-122 30,-72 C62,-70 90,-50 92,-20 C94,-6 88,0 76,0Z', { fill: body }));
  p.push(path('M-50,-70 C-40,-118 16,-122 30,-72 C10,-84 -28,-84 -50,-70Z', { fill: light, opacity: 0.7 }));
  if (blanket) {
    p.push(path('M-46,-74 C-30,-92 14,-92 30,-74 L36,-36 L-50,-36Z', { fill: blanket }));
    p.push(rect(-52, -42, 90, 9, { rx: 4, fill: mix(blanket, '#000000', 0.22) }));
    for (let i = 0; i < 5; i++) p.push(circle(-44 + i * 19, -30, 4, { fill: C.gold2 }));
  }
  // haunch of the folded hind leg
  p.push(ellipse(-58, -24, 34, 22, { fill: mix(body, dark, 0.35) }));
  p.push(ellipse(-64, -30, 16, 9, { fill: light, opacity: 0.5 }));
  // belly shade
  p.push(path('M-96,-10 C-60,2 40,2 88,-12 C88,-4 84,0 76,0 L-100,0Z', { fill: dark, opacity: 0.45 }));
  // folded front legs with a knobbly knee
  p.push(rect(30, -24, 76, 22, { rx: 11, fill: body }));
  p.push(ellipse(98, -14, 13, 11, { fill: light }));
  p.push(ellipse(110, -4, 14, 6, { fill: dark }));
  // neck rising in a soft curve, then the head
  p.push(path('M58,-56 C82,-70 94,-104 98,-136 L124,-136 C124,-96 110,-58 80,-36Z', { fill: body }));
  p.push(path('M92,-150 C96,-166 120,-172 138,-164 C156,-158 170,-150 170,-136 C170,-124 160,-120 148,-122 C134,-124 124,-120 116,-118 C100,-118 88,-132 92,-150Z', { fill: body }));
  p.push(ellipse(106, -166, 7, 11, { fill: dark, transform: 'rotate(-30 106 -166)' }));
  p.push(ellipse(160, -130, 4, 3, { fill: dark }));
  p.push(path('M150,-122 Q158,-118 166,-122', { fill: 'none', stroke: dark, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  p.push(eye(128, -148, 5, sleepy));
  p.push(ellipse(138, -134, 7, 4, { fill: C.cheek, opacity: 0.6 }));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// ---------------------------------------------------------------- food & things
function cushion(x, y, w, h, fill, { tassel = C.gold2 } = {}) {
  const dark = mix(fill, '#000000', 0.22);
  return (
    ellipse(x, y + h * 0.45, w * 0.55, h * 0.18, { fill: C.ink, opacity: 0.18 }) +
    rect(x - w / 2, y - h / 2, w, h, { rx: h * 0.45, fill: dark }) +
    rect(x - w / 2, y - h / 2 - h * 0.08, w, h * 0.92, { rx: h * 0.45, fill }) +
    path(`M${r1(x - w * 0.36)},${r1(y - h * 0.1)} Q${r1(x)},${r1(y + h * 0.08)} ${r1(x + w * 0.36)},${r1(y - h * 0.1)}`, { fill: 'none', stroke: mix(fill, '#FFFFFF', 0.35), 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }) +
    ellipse(x - w * 0.18, y - h * 0.32, w * 0.16, h * 0.1, { fill: C.white, opacity: 0.35 }) +
    circle(x, y - h * 0.05, h * 0.09, { fill: tassel }) +
    circle(x - w / 2 + 4, y + h * 0.2, h * 0.11, { fill: tassel }) +
    circle(x + w / 2 - 4, y + h * 0.2, h * 0.11, { fill: tassel })
  );
}

function platter(x, y) {
  let s = '';
  s += ellipse(x, y + 16, 118, 30, { fill: C.ink, opacity: 0.16 });
  s += ellipse(x, y + 6, 112, 34, { fill: C.gold4 });
  s += ellipse(x, y, 112, 34, { fill: C.gold3 });
  s += ellipse(x, y - 2, 96, 27, { fill: C.gold2 });
  s += ellipse(x - 30, y - 12, 34, 6, { fill: C.gold0, opacity: 0.6 });
  // a bed of golden rice
  s += ellipse(x, y - 6, 84, 20, { fill: '#FFF1CF' });
  const R = rng(5);
  for (let i = 0; i < 26; i++) s += ellipse(x + R.range(-74, 74), y - 6 + R.range(-14, 12), 3.4, 2, { fill: '#F5D9A0', opacity: 0.9 });
  // the roast: a plump, glossy golden-brown dish
  s += path(`M${x - 62},${y - 8} C${x - 66},${y - 46} ${x - 30},${y - 66} ${x + 4},${y - 64} C${x + 44},${y - 62} ${x + 70},${y - 40} ${x + 64},${y - 10} C${x + 40},${y + 4} ${x - 40},${y + 4} ${x - 62},${y - 8}Z`, { fill: C.wood1 });
  s += path(`M${x + 10},${y - 63} C${x + 46},${y - 60} ${x + 70},${y - 40} ${x + 64},${y - 10} C${x + 44},${y} ${x + 20},${y + 2} ${x + 4},${y + 2} C${x + 30},${y - 16} ${x + 34},${y - 44} ${x + 10},${y - 63}Z`, { fill: C.wood2, opacity: 0.7 });
  s += path(`M${x - 44},${y - 34} C${x - 36},${y - 52} ${x - 10},${y - 58} ${x + 8},${y - 54}`, { fill: 'none', stroke: C.wood0, 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.9 });
  s += path(`M${x - 34},${y - 46} C${x - 26},${y - 54} ${x - 14},${y - 56} ${x - 4},${y - 55}`, { fill: 'none', stroke: C.gold0, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 });
  // herbs and lemon slices
  for (const [hx, hy, rot] of [[x - 70, y - 10, -30], [x + 70, y - 12, 30], [x - 10, y + 2, 0]]) {
    s += ellipse(hx, hy, 11, 5, { fill: C.leaf3, transform: `rotate(${rot} ${hx} ${hy})` });
    s += ellipse(hx + 8, hy - 3, 8, 4, { fill: C.leaf2, transform: `rotate(${rot + 30} ${hx + 8} ${hy - 3})` });
  }
  s += ellipse(x + 42, y - 2, 9, 5, { fill: C.gold1 }) + ellipse(x + 42, y - 2, 6, 3, { fill: C.gold0 });
  // warm steam curls
  for (const dx of [-24, 6, 34]) s += path(`M${x + dx},${y - 72} q-10,-14 0,-26 q10,-12 0,-26`, { fill: 'none', stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.45 });
  return s;
}

function breads(x, y) {
  let s = shadow(x, y + 12, 120, 0.14);
  for (const [dx, dy] of [[-10, 4], [8, -4]]) {
    s += ellipse(x + dx, y + dy + 4, 52, 18, { fill: C.wood2 });
    s += ellipse(x + dx, y + dy, 52, 18, { fill: C.wood0 });
    s += ellipse(x + dx - 4, y + dy - 2, 38, 12, { fill: '#F2C894' });
    const R = rng(dx + 50);
    for (let i = 0; i < 6; i++) s += ellipse(x + dx + R.range(-30, 30), y + dy + R.range(-8, 6), 3, 2, { fill: C.wood2, opacity: 0.6 });
  }
  return s;
}

function bowlOfDates(x, y) {
  let s = shadow(x, y + 16, 110, 0.14);
  const R = rng(9);
  for (let i = 0; i < 11; i++) {
    const dx = R.range(-34, 34);
    const dy = -6 - R.range(0, 14) + Math.abs(dx) * 0.2;
    s += ellipse(x + dx, y + dy, 10, 7, { fill: i % 3 ? C.wood3 : C.wood4, transform: `rotate(${r1(R.range(-30, 30))} ${r1(x + dx)} ${r1(y + dy)})` });
    s += ellipse(x + dx - 3, y + dy - 2, 3.5, 2, { fill: C.wood1, opacity: 0.8 });
  }
  s += path(`M${x - 50},${y - 6} C${x - 46},${y + 22} ${x + 46},${y + 22} ${x + 50},${y - 6}Z`, { fill: C.water3 });
  s += path(`M${x - 50},${y - 6} C${x - 46},${y + 22} ${x - 6},${y + 20} ${x},${y + 16} C${x - 30},${y + 10} ${x - 44},${y + 2} ${x - 50},${y - 6}Z`, { fill: C.water2, opacity: 0.8 });
  s += ellipse(x, y - 6, 50, 9, { fill: 'none', stroke: C.water4, 'stroke-width': 3 });
  s += path(`M${x - 30},${y + 6} q15,6 30,0 q15,-6 30,0`, { fill: 'none', stroke: C.gold1, 'stroke-width': 2.5, opacity: 0.8 });
  return s;
}

function grapes(x, y) {
  let s = shadow(x, y + 30, 70, 0.14);
  s += ellipse(x + 18, y - 34, 18, 11, { fill: C.leaf3, transform: `rotate(-20 ${x + 18} ${y - 34})` });
  s += path(`M${x + 2},${y - 30} q4,-10 12,-14`, { fill: 'none', stroke: C.wood3, 'stroke-width': 3, 'stroke-linecap': 'round' });
  const rows = [[-14, 0, 14], [-21, -7, 7, 21], [-14, 0, 14], [-7, 7], [0]];
  rows.forEach((row, ri) => row.forEach((dx) => {
    const gx = x + dx;
    const gy = y - 22 + ri * 11;
    s += circle(gx, gy, 8, { fill: C.plum3 });
    s += circle(gx - 2.5, gy - 2.5, 2.6, { fill: C.plum1, opacity: 0.8 });
  }));
  return s;
}

function jug(x, y, s = 1) {
  return g({ transform: `translate(${x} ${y}) scale(${s})` },
    ellipse(0, 2, 30, 7, { fill: C.ink, opacity: 0.18 }),
    path('M-18,0 C-30,-24 -26,-46 -12,-54 L-12,-66 C-16,-70 -14,-74 -8,-74 L8,-74 C14,-74 16,-70 12,-66 L12,-54 C26,-46 30,-24 18,0Z', { fill: C.coral3 }),
    path('M4,-54 C22,-46 28,-24 18,0 L4,0 C14,-20 14,-40 4,-54Z', { fill: C.coral4, opacity: 0.5 }),
    path('M14,-62 C34,-62 34,-30 20,-24', { fill: 'none', stroke: C.coral3, 'stroke-width': 6, 'stroke-linecap': 'round' }),
    path('M-22,-30 Q0,-24 22,-30', { fill: 'none', stroke: C.gold1, 'stroke-width': 3, opacity: 0.8 }),
    ellipse(-10, -36, 4, 10, { fill: C.white, opacity: 0.35 }),
  );
}

function cup(x, y) {
  return ellipse(x, y + 2, 14, 4, { fill: C.ink, opacity: 0.16 }) +
    path(`M${x - 12},${y - 18} L${x + 12},${y - 18} L${x + 8},${y} L${x - 8},${y}Z`, { fill: C.coral3 }) +
    ellipse(x, y - 18, 12, 4, { fill: C.water2 }) +
    path(`M${x - 10},${y - 12} L${x + 10},${y - 12}`, { stroke: C.gold1, 'stroke-width': 2 });
}

// A long soft dusk cloud with a glowing underside.
function duskCloud(x, y, w, h, fill, light, op = 1, seed = 1) {
  const R = rng(seed);
  const bumps = [[-0.28, 0.55, 0.2], [-0.06, 0.9, 0.24], [0.17, 0.7, 0.2], [0.33, 0.4, 0.14]];
  return g({ opacity: op },
    g({ fill }, rect(x - w / 2, y - h, w, h, { rx: h / 2 }),
      bumps.map(([dx, dy, rr]) => ellipse(x + (dx + R.range(-0.03, 0.03)) * w, y - h * 0.5 - dy * h, rr * w, h * (0.9 + dy * 0.6)))),
    ellipse(x + w * 0.02, y - h * 0.24, w * 0.4, h * 0.22, { fill: light, opacity: 0.85 }),
  );
}

// ---------------------------------------------------------------- the tent
function bigTent(id) {
  const fabric = '#D26E58';
  const shade = '#A8503F';
  const stripe = '#F7DDBE';
  const roofPts = [[214, 452], [262, 392], [330, 352], [410, 372], [500, 326], [590, 372], [670, 352], [738, 392], [786, 452]];
  const outline = `${smooth(roofPts)} L828,652 L172,652Z`;
  let s = '';
  s += `<clipPath id="${id('tentClip')}"><path d="${outline}"/></clipPath>`;
  s += ellipse(500, 656, 345, 18, { fill: `url(#${id('tentShadow')})` });
  s += path(outline, { fill: fabric });
  s += g({ 'clip-path': `url(#${id('tentClip')})` },
    // the right half a touch darker (light comes from the left)
    path('M500,300 L900,300 L900,700 L560,700Z', { fill: shade, opacity: 0.32 }),
    rect(100, 520, 800, 16, { fill: stripe, opacity: 0.7 }),
    rect(100, 560, 800, 10, { fill: stripe, opacity: 0.55 }),
    // soft light on the upper roof
    rect(100, 300, 800, 160, { fill: `url(#${id('roofLight')})` }),
    // roof seams
    path('M330,352 L300,470 M670,352 L700,470 M500,326 L500,440', { stroke: shade, 'stroke-width': 3, opacity: 0.35 }),
    // a woven band with little triangles, like Bedouin sadu weaving
    rect(100, 388, 800, 18, { fill: '#8C3F3A' }),
    ...Array.from({ length: 34 }, (_, i) => {
      const tx = 104 + i * 24;
      return path(`M${tx},404 L${tx + 12},391 L${tx + 24},404Z`, { fill: i % 2 ? '#F7DDBE' : C.gold2, opacity: 0.9 });
    }),
  );
  // sunset rim light along the left of the roof
  s += path(smooth([[214, 452], [262, 392], [330, 352], [410, 372], [500, 326]]), { fill: 'none', stroke: '#FFD2A8', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 });
  // the open front: warm glowing inside
  const door = 'M300,652 L300,470 C300,452 316,446 332,446 L668,446 C684,446 700,452 700,470 L700,652Z';
  s += path(door, { fill: `url(#${id('inside')})` });
  s += `<clipPath id="${id('doorClip')}"><path d="${door}"/></clipPath>`;
  s += g({ 'clip-path': `url(#${id('doorClip')})` },
    // back wall drapes
    ...[340, 420, 500, 580, 660].map((dx) => path(`M${dx - 30},446 Q${dx},470 ${dx + 30},446 L${dx + 30},560 Q${dx},572 ${dx - 30},560Z`, { fill: C.gold2, opacity: 0.25 })),
    // rug on the floor
    path('M318,652 L350,592 L650,592 L682,652Z', { fill: C.coral3 }),
    path('M336,646 L362,600 L638,600 L664,646Z', { fill: 'none', stroke: C.gold1, 'stroke-width': 3 }),
    ...[400, 460, 520, 580].map((dx) => path(`M${dx},606 l12,10 l-12,10 l-12,-10Z`, { fill: C.gold1, opacity: 0.9 })),
    // cushions along the back
    cushion(372, 584, 84, 40, C.water2),
    cushion(500, 580, 96, 44, C.gold2, { tassel: C.coral3 }),
    cushion(628, 584, 84, 40, C.plum2),
    // a little brass lamp hanging in the middle
    circle(500, 520, 80, { fill: `url(#${id('lampGlow')})` }),
    lantern(500, 470, { s: 0.36, chain: 0 }),
    path('M500,446 L500,470', { stroke: C.gold4, 'stroke-width': 2 }),
  );
  // tied-back door flaps
  s += path('M300,446 C330,450 344,470 330,520 C322,560 300,590 292,652 L280,652 L280,446Z', { fill: mix(fabric, '#FFFFFF', 0.08) });
  s += path('M300,446 C318,452 326,470 318,512', { fill: 'none', stroke: shade, 'stroke-width': 3, opacity: 0.5 });
  s += path('M700,446 C670,450 656,470 670,520 C678,560 700,590 708,652 L720,652 L720,446Z', { fill: mix(fabric, shade, 0.4) });
  s += path('M700,446 C682,452 674,470 682,512', { fill: 'none', stroke: mix(shade, '#000000', 0.2), 'stroke-width': 3, opacity: 0.5 });
  s += circle(331, 520, 6, { fill: C.gold2 }) + circle(669, 520, 6, { fill: C.gold2 });
  // front poles
  s += rect(286, 440, 10, 212, { rx: 4, fill: C.wood2 }) + rect(704, 440, 10, 212, { rx: 4, fill: C.wood3 });
  // scalloped valance across the front with little tassels
  let val = 'M262,430 L738,430 L738,452';
  for (let i = 12; i > 0; i--) {
    const xa = 262 + (i / 12) * 476;
    const xb = 262 + ((i - 1) / 12) * 476;
    val += ` Q${r1((xa + xb) / 2)},472 ${r1(xb)},452`;
  }
  val += 'Z';
  s += path(val, { fill: '#8C3F3A' });
  s += path('M262,436 L738,436', { stroke: C.gold2, 'stroke-width': 3 });
  for (let i = 0; i < 12; i++) {
    const vx = 262 + ((i + 0.5) / 12) * 476;
    s += circle(vx, 449, 4, { fill: C.gold1 });
    s += path(`M${r1(vx)},466 L${r1(vx)},478`, { stroke: C.gold2, 'stroke-width': 2 });
    s += circle(vx, 481, 3.5, { fill: C.gold2 });
  }
  // light spilling out onto the sand
  s += path('M300,652 L700,652 L780,700 L220,700Z', { fill: `url(#${id('spill')})` });
  return s;
}

export default function render() {
  const id = ids('s10');
  const R = rng(1010);
  const defs = [
    linear(id('sky'), [[0, '#6E5FAE'], [0.32, '#A688C8'], [0.55, '#E3A9C0'], [0.75, '#F8C3A6'], [0.9, '#FFDCA6'], [1, '#FFE6B8']]),
    radial(id('sunset'), [[0, '#FFF0C4', 0.9], [0.35, '#FFD49A', 0.55], [1, '#FFD49A', 0]]),
    linear(id('sand'), [[0, '#F2C996'], [0.5, '#E9B47E'], [1, '#D99A68']]),
    linear(id('dunes'), [[0, '#D9A3A4'], [1, '#EDB79E']], { x2: 1, y2: 0 }),
    radial(id('inside'), [[0, '#FFF3C8'], [0.5, '#FFD98A'], [1, '#F2AE57']], { cx: 0.5, cy: 0.45, r: 0.7 }),
    linear(id('spill'), [[0, '#FFE2A0', 0.55], [1, '#FFE2A0', 0]]),
    glowDef(id('lampGlow'), '#FFF4C8', 0.9),
    radial(id('tentShadow'), [[0, C.ink, 0.22], [0.7, C.ink, 0.12], [1, C.ink, 0]]),
    linear(id('roofLight'), [[0, '#FFE2C4', 0.32], [1, '#FFE2C4', 0]]),
    glowDef(id('lantern'), '#FFE3A0', 0.75),
    glowDef(id('warm'), '#FFD58A', 0.55),
    linear(id('cloth'), [[0, '#FFF6E6'], [1, '#F6E2C4']]),
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');

  let body = '';
  // ---- dusk sky, the first stars
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += ellipse(160, 600, 520, 300, { fill: `url(#${id('sunset')})` });
  for (const [sx, sy, ss, c] of [[420, 70, 11, C.gold0], [610, 120, 8, C.white], [760, 60, 12, C.gold0], [880, 170, 7, C.white], [250, 150, 7, C.white], [540, 40, 6, C.white], [940, 80, 6, C.gold0]]) body += sparkle(sx, sy, ss, c, { opacity: 0.95 });
  for (let i = 0; i < 26; i++) body += circle(R() * 1000, R() * 260, R.range(1, 2.2), { fill: C.cream, opacity: R.range(0.4, 0.85) });
  // soft dusk clouds
  body += duskCloud(150, 300, 230, 22, '#F4BCC4', '#FFD9C2', 0.7, 2);
  body += duskCloud(850, 334, 200, 20, '#EAB0C4', '#FFD3C0', 0.6, 5);

  // ---- far dunes and the sand
  body += path(ridge([[-20, 600], [150, 572], [330, 590], [520, 566], [700, 586], [880, 568], [1020, 584]], 1000), { fill: `url(#${id('dunes')})` });
  body += path(ridge([[-20, 640], [200, 618], [430, 632], [640, 614], [860, 630], [1020, 618]], 1000), { fill: `url(#${id('sand')})` });

  // ---- palms behind the camels
  body += palm(208, 650, { h: 250, lean: -0.08, seed: 3, scale: 1, leaf: mix(C.leaf3, '#B07A9A', 0.25), leafMid: mix(C.leaf4, '#B07A9A', 0.25), leafDark: mix(C.leaf5, '#B07A9A', 0.25), trunk: mix(C.wood2, '#B07A9A', 0.2), trunkDark: mix(C.wood3, '#B07A9A', 0.2) });
  body += palm(812, 646, { h: 270, lean: 0.06, seed: 8, leaf: mix(C.leaf3, '#B07A9A', 0.25), leafMid: mix(C.leaf4, '#B07A9A', 0.25), leafDark: mix(C.leaf5, '#B07A9A', 0.25), trunk: mix(C.wood2, '#B07A9A', 0.2), trunkDark: mix(C.wood3, '#B07A9A', 0.2) });

  // ---- the big tent
  body += circle(500, 520, 380, { fill: `url(#${id('warm')})` });
  body += bigTent(id);

  // ---- resting camels on either side
  body += restingCamel(112, 706, { s: 0.68, blanket: C.water3 });
  body += restingCamel(890, 710, { s: 0.66, flip: true, sleepy: true, blanket: C.plum3 });

  // ---- lanterns hanging from the valance by the poles
  body += lantern(291, 456, { s: 0.5, glowId: id('lantern'), chain: 0 });
  body += lantern(709, 456, { s: 0.5, glowId: id('lantern'), chain: 0 });

  // ---- the cloth spread with food, cushions around it
  body += ellipse(500, 820, 360, 120, { fill: `url(#${id('warm')})`, opacity: 0.6 });
  const cloth = 'M282,738 L718,738 C742,738 752,746 758,760 L818,890 C822,904 812,912 796,912 L204,912 C188,912 178,904 182,890 L242,760 C248,746 258,738 282,738Z';
  body += path(cloth, { fill: C.ink, opacity: 0.12, transform: 'translate(0 8)' });
  body += path(cloth, { fill: `url(#${id('cloth')})` });
  body += path('M286,752 L714,752 L790,898 L210,898Z', { fill: 'none', stroke: C.coral2, 'stroke-width': 7, 'stroke-linejoin': 'round' });
  body += path('M300,764 L700,764 L770,886 L230,886Z', { fill: 'none', stroke: C.gold2, 'stroke-width': 2.5, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' });
  // the food
  body += bowlOfDates(650, 788);
  body += breads(352, 790);
  body += jug(270, 872, 1.05);
  body += cup(320, 880) + cup(700, 884);
  body += grapes(735, 860);
  body += platter(500, 838);
  // cushions for the guests
  body += cushion(186, 800, 104, 48, C.water2);
  body += cushion(814, 800, 104, 48, C.gold2, { tassel: C.coral3 });
  body += cushion(132, 900, 112, 52, C.plum2);
  body += cushion(868, 900, 112, 52, C.rose2, { tassel: C.gold1 });

  // ---- small framing details: grass tufts, pebbles
  for (const [gx, gy, gh, sd] of [[40, 990, 60, 1], [960, 992, 64, 2], [228, 980, 34, 3], [770, 984, 34, 4]]) body += grass(gx, gy, { h: gh, fill: '#B5835A', n: 5, seed: sd });
  body += ellipse(420, 960, 14, 6, { fill: '#C98E62' }) + ellipse(600, 972, 18, 7, { fill: '#C98E62' });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
