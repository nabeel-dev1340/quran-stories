// The Garden Owners Who Forgot to Share (Quran 68:17-33).
// One orchard, shown twice: on the left it is lush and laden with fruit in
// the dawn light; on the right it is the same orchard after the night -
// dark, bare and withered (68:19-20). Empty harvest baskets wait at the
// closed gate. Calm, never frightening.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, rays, farBird, bird, grass, flower, tree, bush, shadow, eye, r1, T, lerp,
} from '../lib.js';

// Warm (left) and cool (right) versions of a colour.
const COOL = '#7D879C';
const warmLit = (c) => mix(c, '#FFD9A8', 0.12);
const cool = (c, t = 0.55) => mix(c, COOL, t);

// A bare, withered tree with the same footprint as the kit's tree().
function bareTree(x, y, { r = 90, trunkH = 90, seed = 11, bark = '#6E645E', barkLight = '#8A8078' } = {}) {
  const R = rng(seed);
  const cy = y - trunkH - r * 0.75;
  let s = path(`M${r1(x - r * 0.1)},${r1(y)} Q${r1(x - r * 0.06)},${r1(y - trunkH * 0.6)} ${r1(x - r * 0.16)},${r1(cy + r * 0.3)} L${r1(x + r * 0.12)},${r1(cy + r * 0.3)} Q${r1(x + r * 0.06)},${r1(y - trunkH * 0.6)} ${r1(x + r * 0.1)},${r1(y)}Z`, { fill: bark });
  s += path(`M${r1(x - r * 0.1)},${r1(y)} Q${r1(x - r * 0.06)},${r1(y - trunkH * 0.6)} ${r1(x - r * 0.16)},${r1(cy + r * 0.3)} L${r1(x - r * 0.06)},${r1(cy + r * 0.3)} Q${r1(x - r * 0.01)},${r1(y - trunkH * 0.6)} ${r1(x - r * 0.02)},${r1(y)}Z`, { fill: barkLight, opacity: 0.6 });
  const base = [x, cy + r * 0.32];
  let br = '';
  let tw = '';
  for (const a0 of [-150, -118, -90, -62, -30]) {
    const a = ((a0 + R.range(-8, 8)) * Math.PI) / 180;
    const L = r * R.range(0.78, 0.98);
    const mid = [base[0] + Math.cos(a) * L * 0.5 + R.range(-6, 6), base[1] + Math.sin(a) * L * 0.5];
    const end = [base[0] + Math.cos(a) * L, base[1] + Math.sin(a) * L * 0.86];
    br += `M${r1(base[0])},${r1(base[1])} Q${r1(mid[0])},${r1(mid[1])} ${r1(end[0])},${r1(end[1])} `;
    for (const side of [-1, 1]) {
      const b = a + side * R.range(0.35, 0.6);
      const st = [lerp(base[0], end[0], 0.55), lerp(base[1], end[1], 0.55)];
      const l2 = L * R.range(0.32, 0.45);
      tw += `M${r1(st[0])},${r1(st[1])} q${r1(Math.cos(b) * l2 * 0.5)},${r1(Math.sin(b) * l2 * 0.5 - 3)} ${r1(Math.cos(b) * l2)},${r1(Math.sin(b) * l2)} `;
    }
  }
  s += path(br, { fill: 'none', stroke: bark, 'stroke-width': r1(Math.max(2, r * 0.1)), 'stroke-linecap': 'round' });
  s += path(tw, { fill: 'none', stroke: bark, 'stroke-width': r1(Math.max(1.4, r * 0.055)), 'stroke-linecap': 'round' });
  return s;
}

// A woven harvest basket, empty. (x, y) = bottom centre.
function basket(x, y, { w = 120, h = 80, tilt = 0, fill = C.sand3, dark = C.sand4, light = C.sand2 } = {}) {
  const p = [];
  p.push(ellipse(0, 2, w * 0.56, w * 0.08, { fill: C.ink, opacity: 0.16 }));
  p.push(path(`M${-w / 2},${-h} L${w / 2},${-h} C${w * 0.46},${-h * 0.4} ${w * 0.38},0 ${w * 0.26},0 L${-w * 0.26},0 C${-w * 0.38},0 ${-w * 0.46},${-h * 0.4} ${-w / 2},${-h}Z`, { fill }));
  p.push(path(`M${w * 0.12},${-h} L${w / 2},${-h} C${w * 0.46},${-h * 0.4} ${w * 0.38},0 ${w * 0.26},0 L${w * 0.06},0 C${w * 0.14},${-h * 0.4} ${w * 0.14},${-h * 0.7} ${w * 0.12},${-h}Z`, { fill: dark, opacity: 0.45 }));
  let weave = '';
  for (let i = 1; i < 4; i++) {
    const yy = -h + (h * i) / 4;
    const hw = lerp(w / 2, w * 0.27, i / 4) * 0.98;
    weave += `M${r1(-hw)},${r1(yy)} Q0,${r1(yy + h * 0.08)} ${r1(hw)},${r1(yy)} `;
  }
  p.push(path(weave, { fill: 'none', stroke: dark, 'stroke-width': 3, opacity: 0.55, 'stroke-linecap': 'round' }));
  let ribs = '';
  for (let i = -3; i <= 3; i++) ribs += `M${r1(i * w * 0.13)},${r1(-h + 4)} L${r1(i * w * 0.075)},-3 `;
  p.push(path(ribs, { fill: 'none', stroke: light, 'stroke-width': 2.4, opacity: 0.6 }));
  // the empty inside and the rim
  p.push(ellipse(0, -h, w / 2, w * 0.13, { fill: C.wood3 }));
  p.push(ellipse(0, -h + w * 0.035, w * 0.42, w * 0.085, { fill: C.wood4, opacity: 0.6 }));
  p.push(path(`M${-w / 2},${-h} A${w / 2},${r1(w * 0.13)} 0 0 0 ${w / 2},${-h}`, { fill: 'none', stroke: light, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  p.push(path(`M${-w / 2},${-h} A${w / 2},${r1(w * 0.13)} 0 0 1 ${w / 2},${-h}`, { fill: 'none', stroke: fill, 'stroke-width': 5, 'stroke-linecap': 'round' }));
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${tilt})` }, p);
}

// A little round sparrow, faces right. (x, y) = feet.
function sparrow(x, y, s = 1, flip = false, { body = '#A98B73', belly = '#EADCCB', wing = '#7F6656', cap = '#8C6F5C' } = {}) {
  return g({ transform: T(x, y, s, 0, flip) },
    path('M-26,-26 L-50,-34 L-44,-18 Z', { fill: wing }),
    ellipse(0, -30, 30, 24, { fill: body }),
    ellipse(7, -22, 18, 13, { fill: belly }),
    circle(20, -46, 16, { fill: body }),
    path('M8,-58 C16,-66 30,-62 34,-52 C24,-56 14,-56 8,-50Z', { fill: cap }),
    path('M34,-48 L46,-44 L34,-40Z', { fill: C.gold3 }),
    path('M-18,-38 C-6,-46 12,-40 10,-28 C4,-20 -14,-20 -22,-26Z', { fill: wing }),
    eye(25, -48, 3.4),
    ellipse(28, -40, 4, 2.4, { fill: C.cheek, opacity: 0.6 }),
    path('M-4,-8 L-6,0 M8,-8 L10,0', { stroke: C.gold4, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }),
  );
}

// A small rabbit sitting, faces right. (x, y) = ground under its middle.
function rabbit(x, y, s = 1, flip = false) {
  const fur = '#E9DCCB';
  const dark = '#CDBBA6';
  return g({ transform: T(x, y, s, 0, flip) },
    ellipse(0, 2, 40, 7, { fill: C.ink, opacity: 0.12 }),
    circle(-34, -18, 9, { fill: C.white }),
    ellipse(-4, -26, 34, 27, { fill: fur }),
    ellipse(-12, -14, 18, 14, { fill: dark, opacity: 0.5 }),
    ellipse(14, -4, 12, 5, { fill: fur }),
    ellipse(14, -84, 7, 24, { fill: fur, transform: 'rotate(-12 14 -84)' }),
    ellipse(14, -82, 3.4, 17, { fill: C.rose1, transform: 'rotate(-12 14 -82)' }),
    ellipse(28, -82, 7, 22, { fill: dark, transform: 'rotate(10 28 -82)' }),
    circle(22, -48, 21, { fill: fur }),
    eye(30, -52, 3.6),
    ellipse(41, -45, 3, 2.4, { fill: C.rose2 }),
    ellipse(32, -40, 5, 3, { fill: C.cheek, opacity: 0.6 }),
  );
}

export default function render() {
  const id = ids('s34');
  const R = rng(34);
  const defs = [
    linear(id('skyW'), [[0, '#E9A9B4'], [0.4, '#F7C3AC'], [0.75, '#FFDDB0'], [1, '#FFEFD0']]),
    linear(id('skyC'), [[0, '#64718D'], [0.45, '#8590A8'], [0.8, '#A7AFC0'], [1, '#BDC3CF']]),
    linear(id('groundW'), [[0, '#B9D88F'], [1, '#7DBB6A']]),
    linear(id('groundC'), [[0, '#A39C8F'], [1, '#7E776D']]),
    glowDef(id('sunGlow'), '#FFF0C8', 0.9),
    glowDef(id('warm'), '#FFE6B8', 0.55),
    vignetteDef(id('vig'), C.ink, 0.22),
    `<mask id="${id('coolMask')}" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000"><rect width="1000" height="1000" fill="url(#${id('maskGrad')})"/></mask>`,
    linear(id('maskGrad'), [[0, '#000000'], [0.38, '#000000'], [0.5, '#7F7F7F'], [0.64, '#FFFFFF'], [1, '#FFFFFF']], { x1: 0, y1: 0, x2: 1, y2: 0 }),
  ].join('');

  // Everything is drawn twice - warm and cool - and the cool copy fades in
  // across the middle through a soft gradient mask.
  const scene = (warm) => {
    const W = (c) => (warm ? warmLit(c) : cool(c));
    let s = '';
    s += rect(0, 0, 1000, 1000, { fill: `url(#${id(warm ? 'skyW' : 'skyC')})` });
    if (warm) {
      s += sun(150, 452, 64, { fill: '#FFE3A1', core: '#FFF6DA', glowId: id('sunGlow') });
      s += rays(150, 452, { n: 9, len: 900, spread: 50, dir: -8, width: 4, color: '#FFF1CF', op: 0.14 });
      s += cloud(300, 220, 200, { fill: '#FFE8DA', shade: '#F6C6B8', seed: 2, opacity: 0.9 });
      s += cloud(90, 300, 130, { fill: '#FFEADF', shade: '#F8CFC0', seed: 5, opacity: 0.85 });
      s += farBird(330, 330, 1.1, '#9A6B78', 0.5) + farBird(366, 316, 0.85, '#9A6B78', 0.45);
    } else {
      s += cloud(720, 180, 260, { fill: '#9AA2B4', shade: '#7D879C', seed: 3, opacity: 0.8 });
      s += cloud(910, 300, 180, { fill: '#A2A9BA', shade: '#868FA2', seed: 7, opacity: 0.75 });
      s += cloud(560, 290, 160, { fill: '#A7AEBF', shade: '#8B93A6', seed: 9, opacity: 0.6 });
    }
    // far hills
    s += path(ridge([[-20, 520], [140, 478], [300, 500], [460, 470], [620, 496], [780, 468], [920, 490], [1020, 476]]), { fill: warm ? '#E9B8A6' : '#8E97AA' });
    s += path(ridge([[-20, 560], [180, 536], [380, 552], [560, 534], [760, 552], [1020, 538]]), { fill: warm ? '#C9C38E' : '#8F9298' });
    // orchard floor
    s += path(ridge([[-20, 584], [250, 574], [500, 580], [750, 572], [1020, 582]]), { fill: `url(#${id(warm ? 'groundW' : 'groundC')})` });
    return s;
  };

  // The orchard trees: identical rows on both sides; the left ones lush,
  // the right ones bare. Positions mirror so it reads as one orchard.
  const rowsSpec = [
    { y: 600, r: 30, th: 26, xs: [40, 120, 200, 280, 360, 440] },
    { y: 660, r: 46, th: 40, xs: [70, 190, 310, 430] },
    { y: 760, r: 70, th: 62, xs: [110, 300] },
  ];
  const fruitCols = [C.coral3, C.gold3];
  let trees = '';
  rowsSpec.forEach((row, ri) => {
    const fade = 0.35 - ri * 0.15;
    row.xs.forEach((x, i) => {
      const seed = 300 + ri * 10 + i;
      // left: lush, lit by dawn
      const lc = (c) => mix(warmLit(c), '#F2C7AE', fade);
      trees += shadow(x + 10, row.y + 2, row.r * 2.2, 0.12);
      trees += tree(x, row.y, { r: row.r, trunkH: row.th, seed, leaf: lc(C.leaf3), leafDark: lc(C.leaf4), leafLight: lc('#B6DC8C'), trunk: lc(C.wood2), fruit: lc(fruitCols[(i + ri) % 2]), fruitN: 16 });
      // right: the same tree, bare
      const rc = (c) => mix(c, '#9AA2B4', fade + 0.15);
      const xr = 1000 - x;
      trees += shadow(xr - 6, row.y + 2, row.r * 2.2, 0.1, '#3C4152');
      trees += bareTree(xr, row.y, { r: row.r, trunkH: row.th, seed, bark: rc('#5F5852'), barkLight: rc('#7E756D') });
    });
  });

  let body = '';
  body += scene(true);
  body += g({ mask: `url(#${id('coolMask')})` }, scene(false));
  body += trees;

  // dry leaves and tufts under the bare trees, flowers under the lush ones
  for (let i = 0; i < 26; i++) {
    const x = 560 + R() * 440;
    const y = 600 + R() * 200;
    body += ellipse(x, y, R.range(4, 7), R.range(2, 3.4), { fill: R() < 0.5 ? '#8A7562' : '#6F6158', opacity: 0.8, transform: `rotate(${r1(R.range(-40, 40))} ${r1(x)} ${r1(y)})` });
  }
  for (const [gx, gy, sd] of [[620, 712, 1], [760, 690, 2], [880, 740, 3], [960, 690, 4], [700, 790, 5]]) body += grass(gx, gy, { h: 24, n: 5, fill: '#8C8270', seed: sd });
  for (const [fx, fy, fc] of [[60, 720, C.rose1], [150, 700, C.gold1], [230, 742, C.coral1], [380, 712, C.rose1], [440, 760, C.gold1], [30, 790, C.coral1], [250, 800, C.rose1]]) body += flower(fx, fy, { r: 8, fill: fc, center: C.gold2 });
  for (const [gx, gy, sd] of [[90, 740, 6], [200, 716, 7], [340, 760, 8], [420, 724, 9]]) body += grass(gx, gy, { h: 26, n: 6, fill: C.leaf4, seed: sd });

  // ---- the fence and the closed gate across the orchard
  const fenceY = 836;
  let posts = '';
  let rails = '';
  for (let x = -10; x <= 1010; x += 64) {
    if (x > 410 && x < 590) continue;
    posts += rect(x - 7, fenceY - 92, 14, 98, { rx: 4 });
  }
  rails += rect(-20, fenceY - 74, 440, 10, { rx: 5 }) + rect(-20, fenceY - 34, 440, 10, { rx: 5 });
  rails += rect(580, fenceY - 74, 440, 10, { rx: 5 }) + rect(580, fenceY - 34, 440, 10, { rx: 5 });
  const fence = g({ fill: C.wood2 }, posts, rails);
  body += fence;
  body += g({ mask: `url(#${id('coolMask')})` }, g({ fill: '#6F6A68' }, posts, rails));
  // gate posts and the two closed gate leaves
  body += rect(408, fenceY - 120, 22, 128, { rx: 5, fill: C.wood3 }) + rect(570, fenceY - 120, 22, 128, { rx: 5, fill: '#5E5450' });
  body += circle(419, fenceY - 124, 13, { fill: C.wood2 }) + circle(581, fenceY - 124, 13, { fill: '#6F6460' });
  // the gate: upright boards rising to a gentle arch, two cross rails
  const gateTop = (x) => fenceY - 96 - 26 * Math.sin((Math.PI * (x - 432)) / 136);
  const gate = (col, colDark) => {
    let s = '';
    for (let i = 0; i < 8; i++) {
      const x0 = 432 + i * 17;
      const top = Math.min(gateTop(x0), gateTop(x0 + 15));
      s += rect(x0 + 1, top, 15, fenceY - top, { rx: 4, fill: i % 2 ? col : mix(col, '#FFFFFF', 0.1) });
    }
    s += rect(430, fenceY - 82, 140, 12, { rx: 5, fill: colDark }) + rect(430, fenceY - 34, 140, 12, { rx: 5, fill: colDark });
    s += circle(500, fenceY - 58, 6, { fill: colDark });
    return s;
  };
  body += gate(C.wood1, C.wood3);
  body += g({ mask: `url(#${id('coolMask')})` }, gate('#8C817C', '#5E5450'));

  // ---- the path to the gate and the empty baskets waiting there
  const pathD = `M440,${fenceY + 4} C430,900 380,960 340,1010 L660,1010 C620,960 570,900 560,${fenceY + 4}Z`;
  body += path(pathD, { fill: '#E8CF9F' });
  body += g({ mask: `url(#${id('coolMask')})` }, path(pathD, { fill: '#A9A39C' }));
  body += basket(420, 930, { w: 120, h: 78, tilt: -4 });
  body += basket(560, 950, { w: 132, h: 84, tilt: 3, fill: '#BFA27E', dark: '#9A7F60', light: '#D8C09E' });
  body += basket(488, 984, { w: 104, h: 66, tilt: -2 });

  // ---- foreground: a fruit-laden branch on the left, a bare one on the right
  body += path('M-20,110 C80,130 170,170 250,240', { fill: 'none', stroke: C.wood2, 'stroke-width': 16, 'stroke-linecap': 'round' });
  body += path('M120,150 C150,120 190,110 220,112', { fill: 'none', stroke: C.wood2, 'stroke-width': 8, 'stroke-linecap': 'round' });
  for (let i = 0; i < 16; i++) {
    const t = (i + 0.5) / 16;
    const bx = lerp(-10, 250, t);
    const by = lerp(108, 240, t ** 1.4);
    const side = i % 2 ? 1 : -1;
    const a = side > 0 ? R.range(40, 80) : R.range(-130, -90);
    const lx = bx + Math.cos((a * Math.PI) / 180) * 20;
    const ly = by + Math.sin((a * Math.PI) / 180) * 20;
    body += ellipse(lx, ly, 22, 10, { fill: i % 3 ? C.leaf3 : C.leaf4, transform: `rotate(${r1(a)} ${r1(lx)} ${r1(ly)})` });
    body += path(`M${r1(lx - Math.cos((a * Math.PI) / 180) * 16)},${r1(ly - Math.sin((a * Math.PI) / 180) * 16)} L${r1(lx + Math.cos((a * Math.PI) / 180) * 16)},${r1(ly + Math.sin((a * Math.PI) / 180) * 16)}`, { stroke: C.leaf2, 'stroke-width': 2, opacity: 0.7, 'stroke-linecap': 'round' });
  }
  for (const [fx, fy, fr, fc] of [[60, 160, 22, C.coral3], [120, 196, 20, C.gold3], [190, 236, 24, C.coral3], [230, 150, 18, C.gold3], [20, 200, 18, C.gold3]]) {
    body += circle(fx, fy, fr, { fill: fc }) + circle(fx - fr * 0.35, fy - fr * 0.35, fr * 0.3, { fill: C.white, opacity: 0.55 }) + path(`M${fx},${fy - fr} l-3,-8`, { stroke: C.wood3, 'stroke-width': 3, 'stroke-linecap': 'round' });
  }
  body += bird(160, 140, { s: 0.6, body: C.coral2, wing: C.coral3, belly: C.coral0 });
  body += path('M1020,100 C930,130 850,170 780,240', { fill: 'none', stroke: '#5F5852', 'stroke-width': 16, 'stroke-linecap': 'round' });
  body += path('M880,150 C850,120 810,108 780,112 M960,118 C950,90 930,70 910,62 M820,200 C790,190 770,196 752,210', { fill: 'none', stroke: '#5F5852', 'stroke-width': 7, 'stroke-linecap': 'round' });
  body += sparrow(586, fenceY - 132, 0.62, true, { body: '#9A8F8C', belly: '#DDD6D0', wing: '#77706E', cap: '#837A77' });
  body += rabbit(230, 818, 0.8);

  // foreground grass: green on the left, dry on the right
  for (const [fx, sd, col] of [[30, 1, C.leaf4], [120, 2, C.leaf3], [250, 3, C.leaf4], [750, 4, '#8C8270'], [880, 5, '#7C7366'], [970, 6, '#8C8270']]) body += grass(fx, 1004, { h: 60, n: 7, fill: col, seed: sd, spread: 1.4 });
  body += flower(70, 960, { r: 11, fill: C.rose1, center: C.gold2 }) + flower(190, 980, { r: 9, fill: C.gold1, center: C.coral2 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
