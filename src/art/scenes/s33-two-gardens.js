// The Two Gardens (Quran 18:32-44).
// Two lush gardens of grapevines side by side, bordered by date palms, with
// fields of crops between them and a river gushing through the middle
// (18:32-33). A bright, abundant summer day.
import {
  C, svgDoc, ids, rng, mix, linear, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, palm, sun, farBird, shimmer, grass, flower, bush, eye, r1, T, lerp,
} from '../lib.js';

const SKY = '#D4ECEE';
const HORIZON = 404;

// Perspective helpers: d = 0 at the horizon, 1 at the bottom of the page.
const depth = (y) => Math.max(0, (y - HORIZON) / (1010 - HORIZON));
const riverX = (y) => {
  const d = depth(y);
  return 505 + 70 * Math.sin(d * 5.5 + 0.3) * d ** 0.6 - 20 * d;
};
const riverW = (y) => 2 + 306 * depth(y) ** 1.3;
const cropW = (y) => 1 + 123 * depth(y) ** 1.3;
const bankL = (y) => riverX(y) - riverW(y) / 2;
const bankR = (y) => riverX(y) + riverW(y) / 2;
const gardenL = (y) => bankL(y) - cropW(y);
const gardenR = (y) => bankR(y) + cropW(y);
const haze = (c, y) => mix(c, SKY, 0.6 * (1 - Math.min(1, depth(y) / 0.75)) ** 1.5);

// A bunch of grapes hanging from (x, y). k = scale.
function bunch(x, y, k, { fill = C.plum3, dark = C.plum4, light = C.plum1 } = {}) {
  const r = 4.4 * k;
  if (k < 0.45) {
    // far away: one soft rounded cluster
    return path(`M${r1(x - r * 3)},${r1(y + r)} Q${r1(x)},${r1(y - r * 0.6)} ${r1(x + r * 3)},${r1(y + r)} Q${r1(x + r * 1.2)},${r1(y + r * 6)} ${r1(x)},${r1(y + r * 7.2)} Q${r1(x - r * 1.2)},${r1(y + r * 6)} ${r1(x - r * 3)},${r1(y + r)}Z`, { fill });
  }
  let s = path(`M${r1(x)},${r1(y - 2 * k)} L${r1(x + k)},${r1(y + 4 * k)}`, { stroke: C.leaf5, 'stroke-width': r1(1.8 * k), 'stroke-linecap': 'round' });
  s += path(`M${r1(x - r * 2.6)},${r1(y + r * 1.6)} Q${r1(x + r * 0.4)},${r1(y + r * 0.2)} ${r1(x + r * 3.2)},${r1(y + r * 1.8)} Q${r1(x + r * 1.8)},${r1(y + r * 6)} ${r1(x + r * 0.4)},${r1(y + r * 7.6)}Z`, { fill: dark });
  const rows = [4, 3, 2, 1];
  let hl = '';
  rows.forEach((n, i) => {
    for (let j = 0; j < n; j++) {
      const bx = x + (j - (n - 1) / 2) * r * 1.62;
      const by = y + r * 1.4 + i * r * 1.5;
      s += circle(bx, by, r, { fill });
      if (k > 0.7 && (i + j) % 2 === 0) hl += circle(bx - r * 0.35, by - r * 0.35, r * 0.3);
    }
  });
  if (hl) s += `<g fill="${light}" opacity="0.85">${hl}</g>`;
  return s;
}

// One row of grapevines on a trellis. Ground line at y, scale k.
function trellisRow(xa, xb, y, k, R) {
  const H = 66 * k;
  const tint = (c) => haze(c, y);
  const arc = (x) => -10 * k * Math.sin(Math.PI * Math.min(1, Math.max(0, (x - xa) / (xb - xa))));
  let s = path(`M${r1(xa)},${r1(y - 2 * k)} C${r1(xa + (xb - xa) * 0.3)},${r1(y - 14 * k)} ${r1(xa + (xb - xa) * 0.7)},${r1(y - 14 * k)} ${r1(xb)},${r1(y - 2 * k)} L${r1(xb + 10 * k)},${r1(y + 12 * k)} L${r1(xa - 10 * k)},${r1(y + 12 * k)}Z`, { fill: tint('#6FAE62'), opacity: 0.35 });
  s += path(`M${r1(xa)},${r1(y)} L${r1(xb)},${r1(y)}`, { stroke: tint(C.leaf3), 'stroke-width': r1(7 * k), 'stroke-linecap': 'round', opacity: 0.5 });
  let posts = '';
  for (let x = xa + 26 * k; x < xb - 6 * k; x += 84 * k) posts += `M${r1(x)},${r1(y)} L${r1(x)},${r1(y - H + arc(x))} `;
  s += path(posts, { stroke: tint(C.wood2), 'stroke-width': r1(6 * k), 'stroke-linecap': 'round' });
  // leafy canopy: a wavy band riding the top wire
  const top = [];
  const bot = [];
  for (let x = xa - 8 * k, i = 0; x <= xb + 8 * k; x += 15 * k, i++) {
    top.push([x, y - H - 16 * k + arc(x) - (i % 2 ? 5 : 0) * k + R.range(-2, 2) * k]);
    bot.push([x, y - H + 6 * k + arc(x) + (i % 3 === 1 ? 6 : 0) * k]);
  }
  const band = (dy) => smooth(top.map(([px, py]) => [px, py + dy])) + ' L' + bot.slice().reverse().map(([px, py]) => `${r1(px)},${r1(py + dy)}`).join(' L') + 'Z';
  s += path(band(6 * k), { fill: tint(C.leaf4) });
  s += path(band(0), { fill: tint(C.leaf3) });
  let hl = '';
  for (let x = xa + 10 * k; x < xb; x += 34 * k) hl += ellipse(x + R.range(-4, 4) * k, y - H - 10 * k + arc(x), 10 * k, 5 * k);
  s += `<g fill="${tint(C.leaf2)}" opacity="0.9">${hl}</g>`;
  for (let x = xa + 34 * k; x < xb - 14 * k; x += 60 * k) {
    s += bunch(x + R.range(-8, 8) * k, y - H + 6 * k + arc(x), k * R.range(0.85, 1.1), { fill: tint(C.plum3), dark: tint(C.plum4), light: tint(C.plum1) });
  }
  return s;
}

// A light-weight distant date palm.
function farPalm(x, y, h, seed, tint) {
  const R = rng(seed);
  const lean = R.range(-0.08, 0.08);
  const tx = x + lean * h;
  const ty = y - h;
  let s = path(`M${r1(x - h * 0.03)},${r1(y)} Q${r1(x + lean * h * 0.3)},${r1(y - h * 0.5)} ${r1(tx - h * 0.015)},${r1(ty)} L${r1(tx + h * 0.015)},${r1(ty)} Q${r1(x + lean * h * 0.3 + h * 0.02)},${r1(y - h * 0.5)} ${r1(x + h * 0.03)},${r1(y)}Z`, { fill: tint(C.wood2) });
  const frond = (deg, fill) => {
    const a = (deg * Math.PI) / 180;
    const L = h * R.range(0.4, 0.48);
    const droop = L * 0.45 * Math.abs(Math.cos(a));
    const tip = [tx + Math.cos(a) * L, ty + Math.sin(a) * L + droop];
    const mid = [tx + Math.cos(a) * L * 0.55, ty + Math.sin(a) * L * 0.55 - L * 0.08];
    const nx = -Math.sin(a) * L * 0.13;
    const ny = Math.cos(a) * L * 0.13;
    return path(`M${r1(tx)},${r1(ty)} Q${r1(mid[0] + nx)},${r1(mid[1] + ny)} ${r1(tip[0])},${r1(tip[1])} Q${r1(mid[0] - nx)},${r1(mid[1] - ny)} ${r1(tx)},${r1(ty)}Z`, { fill });
  };
  for (const d of [-150, -110, -70, -30]) s += frond(d + R.range(-6, 6), tint(C.leaf4));
  for (const d of [-175, -130, -90, -50, -5, 30, 150]) s += frond(d + R.range(-6, 6), tint(C.leaf3));
  s += circle(tx, ty + 2, h * 0.035, { fill: tint(C.leaf5) });
  return s;
}

// A big grape leaf with five rounded lobes. (x, y) = stem point, a = angle.
function grapeLeaf(x, y, size, a, { fill = C.leaf3, dark = C.leaf4, vein = C.leaf2 } = {}) {
  const k = size / 40;
  const lobe = (ang, len, w) => {
    const r = (ang * Math.PI) / 180;
    return ellipse(Math.cos(r) * len, Math.sin(r) * len, w, w * 0.8, { transform: `rotate(${ang} ${r1(Math.cos(r) * len)} ${r1(Math.sin(r) * len)})` });
  };
  const shape = [lobe(-90, 22, 18), lobe(-150, 18, 15), lobe(-30, 18, 15), lobe(150, 14, 12), lobe(30, 14, 12), circle(0, -12, 17)];
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)}) scale(${r1(k * 100) / 100})` },
    g({ fill: dark, transform: 'translate(2 3)' }, shape),
    g({ fill }, shape),
    path('M0,6 L0,-36 M0,-12 L-28,-28 M0,-12 L28,-28 M0,-4 L-22,6 M0,-4 L22,6', { stroke: vein, 'stroke-width': 2.2, 'stroke-linecap': 'round', fill: 'none', opacity: 0.8 }),
  );
}

// A clump of wheat stalks. (x, y) = base, k = scale.
function wheatClump(x, y, k, R, n = 5) {
  let stems = '';
  let ears = '';
  for (let j = 0; j < n; j++) {
    const off = (j - (n - 1) / 2) * 6 * k;
    const h = R.range(50, 74) * k;
    const lean = off * 1.7 + R.range(-6, 6) * k;
    const tx = x + off + lean;
    const ty = y - h;
    stems += `M${r1(x + off)},${r1(y)} Q${r1(x + off + lean * 0.2)},${r1(y - h * 0.5)} ${r1(tx)},${r1(ty)} `;
    const ang = (Math.atan2(-h, lean) * 180) / Math.PI + 90;
    ears += ellipse(tx, ty - 9 * k, 4.4 * k, 12 * k, { transform: `rotate(${r1(ang)} ${r1(tx)} ${r1(ty - 9 * k)})` });
  }
  return path(stems, { fill: 'none', stroke: '#D9A43E', 'stroke-width': r1(1.8 * k), 'stroke-linecap': 'round' }) + `<g fill="#F2C95C">${ears}</g>` + grass(x, y + 2, { h: 24 * k, n: 5, fill: C.leaf4, seed: Math.round(x) });
}

// A grapevine hanging into the top-left corner (mirror it for the right).
function cornerVine(seed) {
  const R = rng(seed);
  let s = path('M-30,34 C40,62 110,24 180,46 C220,58 250,52 280,66', { fill: 'none', stroke: C.wood2, 'stroke-width': 10, 'stroke-linecap': 'round' });
  s += path('M-30,34 C40,62 110,24 180,46', { fill: 'none', stroke: C.wood1, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.7 });
  s += path('M276,64 C294,74 298,94 284,100 C272,104 268,90 278,86', { fill: 'none', stroke: C.leaf4, 'stroke-width': 3, 'stroke-linecap': 'round' });
  for (const [x, y, sz, a] of [[6, 40, 58, 165], [70, 44, 52, 200], [150, 40, 50, 168], [214, 54, 42, 205], [-14, 96, 46, 140], [40, 0, 50, 10], [118, 6, 44, -16]]) {
    s += grapeLeaf(x, y, sz * R.range(0.92, 1.08), a + R.range(-8, 8));
  }
  s += bunch(110, 46, 1.8) + bunch(184, 52, 1.35);
  return s;
}

// A swimming duck, facing right.
function duck(x, y, s = 1, flip = false, body = C.cream, wing = C.wool2) {
  return g({ transform: T(x, y, s, 0, flip) },
    ellipse(0, 12, 46, 7, { fill: C.water4, opacity: 0.3 }),
    path('M-38,-6 C-40,-30 -10,-34 8,-26 C14,-44 34,-50 44,-36 C50,-28 46,-18 40,-14 C46,-8 40,8 20,10 L-26,10 C-34,8 -38,2 -38,-6Z', { fill: body }),
    path('M-30,-16 C-18,-26 4,-24 10,-12 C0,-4 -20,-4 -30,-16Z', { fill: wing }),
    path('M46,-34 L60,-30 L46,-25Z', { fill: C.gold2 }),
    eye(38, -36, 3.2),
    ellipse(41, -27, 4, 2.4, { fill: C.cheek, opacity: 0.6 }),
  );
}

// A little songbird perched (faces right). (x, y) = feet.
function songbird(x, y, s = 1, flip = false) {
  return g({ transform: T(x, y, s, 0, flip) },
    path('M-30,-30 L-56,-42 L-50,-24 Z', { fill: '#4F8CC4' }),
    ellipse(0, -34, 30, 23, { fill: '#6FA9D9' }),
    ellipse(6, -26, 19, 13, { fill: C.cream }),
    circle(22, -50, 16, { fill: '#6FA9D9' }),
    path('M36,-53 L50,-48 L36,-44Z', { fill: C.gold2 }),
    path('M-18,-42 C-6,-50 12,-44 10,-31 C4,-24 -14,-24 -22,-30Z', { fill: '#4F8CC4' }),
    eye(26, -53, 3.4),
    ellipse(30, -44, 4, 2.6, { fill: C.cheek, opacity: 0.6 }),
    path('M-4,-11 L-6,0 M8,-11 L10,0', { stroke: C.gold4, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }),
  );
}

// A butterfly. (x, y) = body centre.
function butterfly(x, y, s = 1, fill = C.gold1, dark = C.gold3, rot = 0) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})` },
    ellipse(-9, -7, 9, 11, { fill, transform: 'rotate(-30 -9 -7)' }),
    ellipse(9, -7, 9, 11, { fill, transform: 'rotate(30 9 -7)' }),
    ellipse(-7, 7, 6, 7, { fill: dark, transform: 'rotate(20 -7 7)' }),
    ellipse(7, 7, 6, 7, { fill: dark, transform: 'rotate(-20 7 7)' }),
    ellipse(0, 0, 2.2, 10, { fill: C.ink2 }),
  );
}

export default function render() {
  const id = ids('s33');
  const R = rng(33);
  const defs = [
    linear(id('sky'), [[0, '#76BFDC'], [0.45, '#A6D8E8'], [0.85, '#D4ECEE'], [1, '#E6F5EF']]),
    linear(id('river'), [[0, '#C4EBEA'], [0.25, '#8BD4DA'], [0.6, '#52B8C9'], [1, '#3197AF']], { x1: 0, y1: HORIZON, x2: 0, y2: 1010, units: 'userSpaceOnUse' }),
    linear(id('crop'), [[0, mix(C.gold1, SKY, 0.55)], [0.35, '#F3D77A'], [1, '#EDC45A']], { x1: 0, y1: HORIZON, x2: 0, y2: 1010, units: 'userSpaceOnUse' }),
    linear(id('ground'), [[0, mix(C.leaf1, SKY, 0.55)], [0.3, '#B2DA95'], [1, '#8FC878']], { x1: 0, y1: HORIZON, x2: 0, y2: 1010, units: 'userSpaceOnUse' }),
    linear(id('plot'), [[0, mix('#9CCF80', SKY, 0.4)], [0.5, '#9CCF80'], [1, '#88C273']], { x1: 0, y1: 470, x2: 0, y2: 850, units: 'userSpaceOnUse' }),
    glowDef(id('sunGlow'), '#FFF6D6', 0.85),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');

  let body = '';
  // ---- sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(330, 190, 52, { fill: '#FFE9A8', core: '#FFF8E0', glowId: id('sunGlow') });
  body += cloud(560, 170, 220, { fill: C.white, shade: '#CFE8F0', seed: 3 });
  body += cloud(840, 250, 170, { fill: C.white, shade: '#CFE8F0', seed: 6, opacity: 0.95 });
  body += cloud(110, 300, 140, { fill: C.white, shade: '#CFE8F0', seed: 8, opacity: 0.9 });
  body += farBird(660, 270, 1.1, '#5C8AA6', 0.6) + farBird(694, 256, 0.85, '#5C8AA6', 0.55) + farBird(410, 250, 0.9, '#5C8AA6', 0.5);

  // ---- far hills and the patchwork valley beyond the gardens
  body += path(ridge([[-20, 352], [110, 324], [250, 344], [370, 328], [450, 362], [510, 380], [600, 344], [760, 320], [900, 342], [1020, 326]]), { fill: mix(C.leaf2, SKY, 0.62) });
  body += path(ridge([[-20, 392], [150, 378], [300, 390], [440, 400], [560, 400], [700, 388], [850, 378], [1020, 390]]), { fill: mix(C.leaf3, SKY, 0.5) });
  body += rect(0, HORIZON - 6, 1000, 1010, { fill: `url(#${id('ground')})` });
  for (const [x0, x1, y0, c] of [[0, 240, 424, C.gold1], [610, 860, 428, C.gold1], [250, 450, 440, C.leaf2], [880, 1000, 444, C.leaf2]]) {
    body += path(`M${x0},${y0} C${x0 + 40},${y0 - 8} ${x1 - 40},${y0 - 8} ${x1},${y0} C${x1 - 40},${y0 + 8} ${x0 + 40},${y0 + 8} ${x0},${y0}Z`, { fill: mix(c, SKY, 0.45), opacity: 0.7 });
  }
  for (let i = 0; i < 16; i++) {
    const x = 20 + i * 64 + R.range(-15, 15);
    if (Math.abs(x - 505) < 40) continue;
    body += circle(x, 410 + R.range(-3, 3), R.range(6, 10), { fill: mix(C.leaf4, SKY, 0.58) });
  }

  // ---- crops between the gardens and the river gushing through the middle
  const ys = [];
  for (let y = HORIZON - 4; y <= 1016; y += 10) ys.push(y);
  const line = (f) => ys.map((y) => [f(y), y]);
  const poly2 = (a, b) => 'M' + a.map((p) => p.map(r1).join(',')).join(' L') + ' L' + b.slice().reverse().map((p) => p.map(r1).join(',')).join(' L') + 'Z';
  body += path(poly2(line((y) => gardenL(y) - 4 * depth(y)), line(bankL)), { fill: `url(#${id('crop')})` });
  body += path(poly2(line(bankR), line((y) => gardenR(y) + 4 * depth(y))), { fill: `url(#${id('crop')})` });
  for (const f of [0.25, 0.5, 0.75]) {
    const ys2 = ys.filter((y) => y > HORIZON + 14);
    body += path(smooth(ys2.map((y) => [lerp(gardenL(y), bankL(y), f), y])), { fill: 'none', stroke: '#D9AE48', 'stroke-width': 2.5, opacity: 0.5 });
    body += path(smooth(ys2.map((y) => [lerp(gardenR(y), bankR(y), f), y])), { fill: 'none', stroke: '#D9AE48', 'stroke-width': 2.5, opacity: 0.5 });
  }
  // little stalks all over the crop fields, larger as they come closer
  let stalks = '';
  for (let y = HORIZON + 16; y < 1000; y += 4 + 22 * depth(y)) {
    const k = 0.2 + depth(y) * 1.6;
    for (const [a, b] of [[gardenL(y), bankL(y)], [bankR(y), gardenR(y)]]) {
      const n = Math.max(2, Math.round((b - a) / (11 * k)));
      for (let j = 0; j < n; j++) {
        const x = lerp(a, b, (j + 0.5 + R.range(-0.3, 0.3)) / n);
        stalks += `M${r1(x)},${r1(y)} l${r1(-1.5 * k)},${r1(-7 * k)} M${r1(x)},${r1(y)} l${r1(1.5 * k)},${r1(-7 * k)} `;
      }
    }
  }
  body += path(stalks, { stroke: '#D6A940', 'stroke-width': 1.6, 'stroke-linecap': 'round', fill: 'none', opacity: 0.75 });
  // grassy river banks, then the water
  body += path(poly2(line((y) => bankL(y) - 3 - 9 * depth(y)), line((y) => bankR(y) + 3 + 9 * depth(y))), { fill: '#8CCB76' });
  body += path(poly2(line(bankL), line(bankR)), { fill: `url(#${id('river')})` });
  body += path(poly2(line(bankL), line((y) => bankL(y) + riverW(y) * 0.16)), { fill: C.water3, opacity: 0.35 });
  body += path(poly2(line((y) => bankR(y) - riverW(y) * 0.16), line(bankR)), { fill: C.water3, opacity: 0.35 });
  body += path(poly2(line((y) => riverX(y) - riverW(y) * 0.12), line((y) => riverX(y) + riverW(y) * 0.1)), { fill: C.white, opacity: 0.16 });
  for (let i = 0; i < 24; i++) {
    const y = HORIZON + 24 + (i / 24) ** 1.25 * 580 + R.range(-6, 6);
    const w = riverW(y);
    const x = riverX(y) + R.range(-0.28, 0.28) * w;
    const len = w * R.range(0.14, 0.28);
    body += path(`M${r1(x - len / 2)},${r1(y)} q${r1(len / 2)},${r1(-2 - depth(y) * 5)} ${r1(len)},0`, { fill: 'none', stroke: C.white, 'stroke-width': r1(1.4 + depth(y) * 2.8), 'stroke-linecap': 'round', opacity: 0.6 });
  }
  // the river comes out from between the far hills, behind a line of trees
  for (let i = 0; i < 9; i++) body += circle(462 + i * 11 + R.range(-2, 2), 408 + R.range(-2, 2), R.range(6, 9), { fill: mix(C.leaf4, SKY, 0.5) });

  // ---- the two gardens
  const yBack = 474;
  const yFront = 846;
  const plotL = [[-20, yBack], ...ys.filter((y) => y >= yBack && y <= yFront).map((y) => [gardenL(y) - 4 * depth(y), y]), [-20, yFront]];
  const plotR = [[1020, yBack], ...ys.filter((y) => y >= yBack && y <= yFront).map((y) => [gardenR(y) + 4 * depth(y), y]), [1020, yFront]];
  body += path('M' + plotL.map((p) => p.map(r1).join(',')).join(' L') + 'Z', { fill: `url(#${id('plot')})` });
  body += path('M' + plotR.map((p) => p.map(r1).join(',')).join(' L') + 'Z', { fill: `url(#${id('plot')})` });
  // palms bordering the far edge of each garden
  const tintAt = (y) => (c) => haze(c, y);
  for (const [px, h, sd] of [[60, 104, 1], [168, 124, 3], [262, 92, 4], [372, 110, 5], [438, 84, 6], [586, 86, 7], [650, 112, 8], [752, 96, 9], [846, 126, 10], [944, 100, 11]]) {
    body += farPalm(px + R.range(-6, 6), yBack + 4, h, sd, tintAt(yBack + 30));
  }
  // rows of vines, far to near, with a palm at each inner corner
  const rowsD = [0.15, 0.25, 0.36, 0.49, 0.63];
  rowsD.forEach((d) => {
    const y = HORIZON + d * 606;
    const k = 0.22 + 0.78 * ((d - 0.15) / 0.48);
    body += trellisRow(-30, gardenL(y) - 18 * k, y, k, R);
    body += trellisRow(gardenR(y) + 18 * k, 1030, y, k, R);
  });
  // low hedge along the near edge of each garden
  for (const [x0, x1] of [[-30, gardenL(yFront) - 4], [gardenR(yFront) + 4, 1030]]) {
    for (let x = x0; x < x1; x += 60) body += bush(x + 30, yFront + 10, { w: 76, fill: C.leaf3, dark: C.leaf4, light: C.leaf2, seed: Math.round(x) });
  }
  for (const [fx, fy, fc] of [[60, 836, C.coral1], [160, 840, C.rose1], [260, 834, C.gold1], [760, 838, C.rose1], [860, 832, C.coral1], [950, 840, C.gold1]]) body += flower(fx, fy, { r: 8, fill: fc, center: C.gold2 });

  // palms along the outer edges of the gardens
  body += palm(44, 862, { h: 330, seed: 23, lean: 0.08, dateColor: C.gold4 });
  body += palm(958, 866, { h: 320, seed: 24, lean: -0.08, dateColor: C.gold4 });

  // ---- the near river: ducks, sparkles, wheat along the banks
  for (const [y, ts] of [[884, [0.35, 0.78]], [940, [0.25, 0.7]], [1004, [0.45]]]) {
    const k = 0.8 + depth(y) * 0.5;
    for (const t of ts) {
      body += wheatClump(lerp(gardenL(y), bankL(y), t) + R.range(-8, 8), y, k, R);
      body += wheatClump(lerp(bankR(y), gardenR(y), 1 - t) + R.range(-8, 8), y, k, R);
    }
  }
  body += duck(riverX(920) - 50, 916, 0.9, false);
  body += duck(riverX(940) + 26, 944, 0.55, false, C.gold1, C.gold2);
  body += duck(riverX(950) + 74, 960, 0.5, false, C.gold1, C.gold2);
  for (const [sx, sy, ss] of [[riverX(700) - 40, 700, 10], [riverX(760) + 50, 760, 8], [riverX(620), 620, 7], [riverX(840) - 80, 840, 8], [riverX(860) + 90, 860, 9]]) body += sparkle(sx, sy, ss, C.white, { opacity: 0.85 });

  // ---- foreground: big vine leaves and bunches at the bottom corners
  for (const [lx, ly, ls, la] of [[40, 950, 70, -30], [120, 990, 64, 10], [-10, 880, 60, -60], [200, 1016, 56, 30]]) body += grapeLeaf(lx, ly, ls, la);
  body += bunch(96, 888, 2.3);
  for (const [lx, ly, ls, la] of [[960, 950, 70, 30], [880, 992, 64, -10], [1010, 880, 60, 60], [800, 1016, 56, -30]]) body += grapeLeaf(lx, ly, ls, la);
  body += bunch(910, 892, 2.2);
  body += songbird(230, 960, 0.7);
  body += butterfly(330, 600, 0.9, C.coral1, C.coral2, -10) + butterfly(700, 650, 0.8, C.gold1, C.gold3, 12);

  // vines hanging into the top corners frame the sky
  body += cornerVine(5);
  body += g({ transform: 'translate(1000 0) scale(-1 1)' }, cornerVine(9));

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
