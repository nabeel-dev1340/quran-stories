// The Great Ram (Quran 37:99-111).
// A magnificent, fluffy ram with big curled horns stands on a rocky hilltop
// at sunrise, glowing softly - "a great sacrifice" sent by Allah. The mood is
// relief and joy: a dawn sky, desert flowers and birds. No knife, no altar.
import {
  C, svgDoc, ids, rng, mix, lerp, linear, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, farBird, flyingBird, bird, flower, grass, eye, T, r1,
} from '../lib.js';

// ---------------------------------------------------------------- helpers
// A tapered spiral (for horns): outline points and the centre line.
function spiral(cx, cy, { r0, rEnd, a0, turns, w0, w1, steps = 64 }) {
  const outer = [];
  const inner = [];
  const mid = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ((a0 - t * turns * 360) * Math.PI) / 180;
    const r = lerp(r0, rEnd, t ** 0.85);
    const w = lerp(w0, w1, t ** 0.9);
    outer.push([cx + Math.cos(a) * (r + w / 2), cy + Math.sin(a) * (r + w / 2)]);
    inner.push([cx + Math.cos(a) * (r - w / 2), cy + Math.sin(a) * (r - w / 2)]);
    mid.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, a, w, t]);
  }
  return { outer, inner, mid };
}
// Closed band between two point lists running the same way.
const band = (a, b) => `${smooth(a)} L${b[b.length - 1].map(r1).join(',')} ${smooth(b.slice().reverse()).replace(/^M[^C]*/, '')}Z`;

// A big coiled horn: base colour, shaded inner coil, growth ridges, highlight.
function horn(cx, cy, o, { base, shade, light, ridgeC }) {
  const sp = spiral(cx, cy, o);
  const n = sp.mid.length - 1;
  let s = path(band(sp.outer, sp.inner), { fill: base });
  const half = sp.mid.map(([x, y]) => [x, y]);
  s += path(band(half, sp.inner), { fill: shade, opacity: 0.5 });
  for (let i = 4; i < n - 3; i += 4) {
    const [x, y, a, w] = sp.mid[i];
    const c = Math.cos(a);
    const sn = Math.sin(a);
    s += path(`M${r1(x - c * w * 0.47)},${r1(y - sn * w * 0.47)} Q${r1(x + sn * w * 0.16)},${r1(y - c * w * 0.16)} ${r1(x + c * w * 0.47)},${r1(y + sn * w * 0.47)}`, { fill: 'none', stroke: ridgeC, 'stroke-width': r1(Math.max(1.6, w * 0.08)), 'stroke-linecap': 'round', opacity: 0.4 });
  }
  const hl = sp.mid.slice(2, Math.round(n * 0.5)).map(([x, y, a, w]) => [x + Math.cos(a) * w * 0.25, y + Math.sin(a) * w * 0.25]);
  s += path(smooth(hl), { fill: 'none', stroke: light, 'stroke-width': r1(o.w0 * 0.18), 'stroke-linecap': 'round', opacity: 0.85 });
  const tip = sp.mid[n];
  s += circle(tip[0], tip[1], tip[3] / 2, { fill: base });
  return s;
}

// Fluffy wool: a ring of puffs around an ellipse, with a shade layer offset
// away from the light (lx = local x direction the light comes from).
function woolMass(cx, cy, rx, ry, { n = 14, pr = 30, wool, shade, light, rim, seed = 1, lx = -1, sh = 7 }) {
  const R = rng(seed);
  const puffs = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + R.range(-0.08, 0.08);
    const top = Math.sin(a) < 0 ? 1.08 : 0.94;
    puffs.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, pr * top * R.range(0.88, 1.12)]);
  }
  const dx = -lx * sh * 0.7;
  const dy = sh;
  const lit = puffs.filter(([a, b]) => b < cy - ry * 0.3 && (a - cx) * lx > -rx * 0.2);
  return (
    (rim ? g({ fill: rim }, puffs.map(([a, b, c]) => circle(a + lx * 4, b - 4, c))) : '') +
    g({ fill: shade }, puffs.map(([a, b, c]) => circle(a + dx, b + dy, c)), ellipse(cx + dx, cy + dy, rx, ry)) +
    g({ fill: wool }, puffs.map(([a, b, c]) => circle(a, b, c)), ellipse(cx, cy, rx, ry)) +
    g({ fill: light, opacity: 0.35 }, lit.slice(0, 3).map(([a, b, c]) => ellipse(a + lx * c * 0.1, b - c * 0.3, c * 0.42, c * 0.28)))
  );
}

// Little "c" curls for wool texture.
function curls(cx, cy, rx, ry, { n = 16, color, seed = 2, size = 9, width = 3, op = 0.42 }) {
  const R = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2;
    const rr = Math.sqrt(R()) * 0.8;
    const x = cx + Math.cos(a) * rx * rr;
    const y = cy + Math.sin(a) * ry * rr;
    const k = size * R.range(0.8, 1.2);
    d += `M${r1(x - k * 0.7)},${r1(y - k * 0.3)} Q${r1(x - k * 0.5)},${r1(y + k * 0.7)} ${r1(x + k * 0.6)},${r1(y + k * 0.3)} `;
  }
  return path(d, { fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', opacity: op });
}

// The great ram, drawn facing RIGHT. (x, y) = ground between the feet.
// Light comes from the screen's left, so its local direction flips with him.
function greatRam(x, y, { s = 1, flip = false, woolFill } = {}) {
  const lx = flip ? 1 : -1;
  const wool = woolFill || '#FFFAF1';
  const woolShade = '#E9D3BF';
  const woolLight = '#FFFFFF';
  const curl = '#DEC5AE';
  const face = '#F9EADC';
  const faceShade = '#E9CDB6';
  const muzzle = '#FBE4D8';
  const leg = '#D7BCA5';
  const legFar = '#BFA18A';
  const hoof = '#866456';
  const rim = '#FFE1A0';
  const hornCols = { base: '#EFC98D', shade: '#C9955A', light: '#FFF2D0', ridgeC: '#A47442' };
  const farHornCols = { base: '#D2A86E', shade: '#AF7F49', light: '#E8C994', ridgeC: '#8E6338' };
  const p = [];
  const legShape = (cx, top, w, fill, hoofC, litSide) => {
    let s2 = path(`M${cx - w / 2},${top} L${cx - w / 2},-12 Q${cx - w / 2},0 ${cx - w / 2 + 6},0 L${cx + w / 2 - 6},0 Q${cx + w / 2},0 ${cx + w / 2},-12 L${cx + w / 2},${top}Z`, { fill });
    s2 += path(`M${cx - w / 2},-16 L${cx + w / 2},-16 L${cx + w / 2},-10 Q${cx + w / 2},0 ${cx + w / 2 - 6},0 L${cx - w / 2 + 6},0 Q${cx - w / 2},0 ${cx - w / 2},-10Z`, { fill: hoofC });
    if (litSide) s2 += rect(litSide > 0 ? cx + w / 2 - 9 : cx - w / 2 + 3, top + 6, 6, -top - 30, { rx: 3, fill: C.white, opacity: 0.3 });
    return s2;
  };
  // legs first, so the wool hangs over their tops
  p.push(legShape(-30, -90, 26, legFar, mix(hoof, '#000000', 0.2)));
  p.push(legShape(94, -90, 26, legFar, mix(hoof, '#000000', 0.2)));
  p.push(legShape(-66, -92, 28, leg, hoof, lx));
  p.push(legShape(58, -92, 28, leg, hoof, lx));
  // tail
  p.push(circle(-118 - lx * 3, -128 + 5, 20, { fill: woolShade }), circle(-118, -128, 20, { fill: wool }));
  // far horn, peeking out above the head
  const hx = 150;
  const hy = -238;
  p.push(horn(hx + 2, hy - 30, { r0: 38, rEnd: 12, a0: -40, turns: 0.62, w0: 28, w1: 12 }, farHornCols));
  // body, with a golden rim where the sunrise touches the wool
  p.push(woolMass(-6, -130, 104, 58, { n: 15, pr: 33, wool, shade: woolShade, light: woolLight, rim, seed: 7, lx }));
  p.push(curls(-6, -124, 96, 46, { n: 13, color: curl, seed: 4 }));
  // chest ruff
  p.push(woolMass(102, -178, 36, 52, { n: 9, pr: 26, wool, shade: woolShade, light: woolLight, rim, seed: 9, lx, sh: 5 }));
  p.push(curls(102, -170, 28, 36, { n: 4, color: curl, seed: 12, size: 8 }));
  // head
  const head = blob([
    [hx - 10, hy - 58], [hx + 28, hy - 48], [hx + 52, hy - 14], [hx + 68, hy + 24], [hx + 56, hy + 52],
    [hx + 20, hy + 60], [hx - 20, hy + 38], [hx - 38, hy - 2], [hx - 32, hy - 40],
  ]);
  p.push(path(head, { fill: rim, transform: `translate(${lx * 4} -3)` }));
  p.push(path(head, { fill: face }));
  p.push(path(blob([[hx - 38, hy - 2], [hx - 20, hy + 38], [hx + 20, hy + 60], [hx + 10, hy + 32], [hx - 14, hy + 10]]), { fill: faceShade, opacity: 0.75 }));
  p.push(ellipse(hx + 44, hy + 32, 25, 21, { fill: muzzle }));
  p.push(ellipse(hx + 40, hy + 22, 12, 6, { fill: C.white, opacity: 0.45 }));
  p.push(path(`M${hx + 54},${hy + 22} q6,4 8,11`, { fill: 'none', stroke: '#B88479', 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
  p.push(path(`M${hx + 36},${hy + 46} q11,7 22,-1`, { fill: 'none', stroke: '#B88479', 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
  // near horn: a big coil curling back and down beside the head
  p.push(horn(hx - 30, hy - 4, { r0: 58, rEnd: 13, a0: -58, turns: 1.22, w0: 42, w1: 13 }, hornCols));
  // woolly forehead tuft
  p.push(g({ fill: woolShade }, circle(hx + 6, hy - 48, 15), circle(hx + 24, hy - 42, 12)));
  p.push(g({ fill: wool }, circle(hx + 4, hy - 52, 15), circle(hx + 22, hy - 46, 12), circle(hx + 35, hy - 36, 9)));
  // eye and cheek
  p.push(eye(hx + 26, hy - 2, 9));
  p.push(ellipse(hx + 22, hy + 20, 12, 7, { fill: C.cheek, opacity: 0.65 }));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// A small desert shrub with tiny blossoms. (x, y) = bottom centre.
function shrub(x, y, { w = 120, fill, dark, light, blossom, seed = 3 }) {
  const R = rng(seed);
  const parts = [];
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    parts.push([x + (t - 0.5) * w * 0.8 + R.range(-6, 6), y - w * (0.16 + Math.sin(t * Math.PI) * 0.22) + R.range(-5, 5), w * R.range(0.15, 0.21)]);
  }
  let s = g({ fill: dark }, parts.map(([a, b, c]) => circle(a + 4, b + 5, c)), ellipse(x, y - w * 0.08, w * 0.48, w * 0.1));
  s += g({ fill }, parts.map(([a, b, c]) => circle(a, b, c)));
  s += g({ fill: light, opacity: 0.75 }, parts.slice(0, 4).map(([a, b, c]) => circle(a - c * 0.25, b - c * 0.3, c * 0.45)));
  for (let i = 0; i < 10; i++) {
    const [a, b, c] = parts[i % parts.length];
    s += flower(a + R.range(-c, c) * 0.7, b + R.range(-c, c * 0.4) * 0.7, { r: 6, fill: blossom, center: C.gold1 });
  }
  return s;
}

// A boulder with a sunlit top-left rim and a shaded right side (clipped).
function boulder(clipId, pts, { base, light, dark, crack }) {
  const d = blob(pts);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const w = x1 - x0;
  const h = y1 - y0;
  let s = `<clipPath id="${clipId}"><path d="${d}"/></clipPath>`;
  s += path(d, { fill: base });
  s += g({ 'clip-path': `url(#${clipId})` },
    path(blob([[x0 + w * 0.62, y0 - 10], [x1 + 20, y0 + h * 0.2], [x1 + 20, y1 + 20], [x0 + w * 0.5, y1 + 20], [x0 + w * 0.7, y0 + h * 0.45]]), { fill: dark }),
    ellipse(x0 + w * 0.32, y0 + h * 0.02, w * 0.36, h * 0.2, { fill: light, opacity: 0.9 }),
    crack ? path(`M${r1(x0 + w * 0.55)},${r1(y0 + h * 0.3)} q${r1(w * 0.06)},${r1(h * 0.2)} ${r1(-w * 0.02)},${r1(h * 0.42)}`, { fill: 'none', stroke: dark, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }) : '',
  );
  return s;
}

// A little butterfly, wings open. (x, y) = body centre.
function butterfly(x, y, { s = 1, wing = C.rose1, wing2 = C.gold1, rot = 0 } = {}) {
  return g({ transform: T(x, y, s, rot) },
    ellipse(-11, -8, 11, 9, { fill: wing, transform: 'rotate(-25 -11 -8)' }),
    ellipse(11, -8, 11, 9, { fill: wing, transform: 'rotate(25 11 -8)' }),
    ellipse(-8, 7, 7, 6, { fill: wing2 }),
    ellipse(8, 7, 7, 6, { fill: wing2 }),
    ellipse(0, 0, 2.6, 10, { fill: C.ink2 }),
    path('M-1,-9 q-4,-8 -8,-10 M1,-9 q4,-8 8,-10', { fill: 'none', stroke: C.ink2, 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
  );
}

// ---------------------------------------------------------------- scene
export default function render() {
  const id = ids('s13');
  const defs = [
    linear(id('sky'), [[0, '#9C8BCB'], [0.26, '#C3A1D3'], [0.46, '#EDADC0'], [0.6, '#F8BFA7'], [0.72, '#FFD8AC'], [1, '#FFEBC8']]),
    glowDef(id('sunGlow'), '#FFF1CA', 0.95),
    glowDef(id('ramGlow'), '#FFE6A8', 0.8),
    `<radialGradient id="${id('ray')}" cx="205" cy="600" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF3D4" stop-opacity="0.32"/><stop offset="1" stop-color="#FFF3D4" stop-opacity="0"/></radialGradient>`,
    `<radialGradient id="${id('wool')}" cx="40" cy="-200" r="190" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#FFF8EE"/><stop offset="1" stop-color="#F4E4D2"/></radialGradient>`,
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');

  const haze = '#F2B9C0';
  const far = (c) => mix(c, haze, 0.58);
  const mid = (c) => mix(c, haze, 0.3);
  const rockA = { base: '#D99682', light: '#F3C3A9', dark: '#B67262', crack: true };
  const rockB = { base: '#C98271', light: '#E8AD95', dark: '#A4625A', crack: true };
  let body = '';

  // sky, rising sun and soft rays
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  for (let i = 0; i < 9; i++) {
    const a = ((-150 + i * 15) * Math.PI) / 180;
    const w = (i % 2 ? 2.2 : 3.6) * (Math.PI / 180);
    body += path(`M205,600 L${r1(205 + Math.cos(a - w) * 900)},${r1(600 + Math.sin(a - w) * 900)} L${r1(205 + Math.cos(a + w) * 900)},${r1(600 + Math.sin(a + w) * 900)}Z`, { fill: `url(#${id('ray')})` });
  }
  body += circle(205, 600, 340, { fill: `url(#${id('sunGlow')})` });
  body += sun(205, 600, 64, { fill: '#FFE6AE', core: '#FFF6DC' });
  body += cloud(170, 245, 210, { fill: '#FBE0DC', shade: '#EFC0C6', seed: 4, opacity: 0.92 });
  body += cloud(540, 140, 150, { fill: '#F6DCE3', shade: '#E4BDD0', seed: 6, opacity: 0.8 });
  body += cloud(870, 290, 210, { fill: '#FBE3DA', shade: '#F0C4C2', seed: 8, opacity: 0.9 });
  body += sparkle(370, 100, 9, C.white, { opacity: 0.8 }) + sparkle(720, 80, 7, C.white, { opacity: 0.7 }) + sparkle(940, 140, 6, C.white, { opacity: 0.6 });

  // far mountains (hazy lavender) - the ram's wool stands out against them
  body += path(ridge([[-20, 575], [90, 535], [190, 575], [300, 515], [400, 470], [500, 448], [600, 466], [700, 430], [820, 478], [920, 455], [1020, 490]]), { fill: far(C.plum2) });
  body += path(ridge([[-20, 615], [120, 590], [260, 626], [380, 580], [520, 566], [660, 590], [800, 552], [920, 580], [1020, 565]]), { fill: far(C.rock2) });
  // birds flying toward the sunrise
  body += flyingBird(150, 352, { s: 0.48, flip: true, body: '#FFF6EC', wing: '#F3CDBF' });
  body += flyingBird(232, 300, { s: 0.36, flip: true, body: '#FFF6EC', wing: '#F3CDBF', up: false });
  body += farBird(90, 430, 1.1, '#8A6A9A', 0.5) + farBird(330, 250, 0.9, '#8A6A9A', 0.45) + farBird(60, 470, 0.8, '#8A6A9A', 0.4);

  // mid hills
  body += path(ridge([[-20, 700], [110, 664], [240, 680], [330, 655], [420, 690]]), { fill: mid(C.rock1) });
  body += path(ridge([[600, 690], [720, 652], [840, 662], [940, 630], [1020, 650]]), { fill: mid(C.rock1) });

  // soft golden glow of mercy around the ram (behind the rocks and the ram)
  body += circle(540, 540, 380, { fill: `url(#${id('ramGlow')})` });

  // the ram's rocky hilltop: a cluster of rounded boulders
  body += path(ridge([[120, 1000], [200, 840], [300, 770], [420, 740], [560, 730], [700, 742], [800, 790], [880, 860], [940, 1000]]), { fill: '#C47F6E' });
  body += boulder(id('b1'), [[210, 880], [240, 790], [330, 752], [430, 776], [460, 870], [340, 900]], rockB);
  body += boulder(id('b2'), [[640, 880], [668, 776], [770, 740], [866, 800], [890, 880], [770, 905]], rockB);
  body += boulder(id('b0'), [[345, 790], [372, 712], [470, 684], [600, 680], [712, 694], [762, 752], [730, 810], [540, 828]], rockA);
  // little flowers growing in the cracks
  for (const [fx, fy, fr, fc] of [[372, 718, 9, C.rose1], [392, 728, 7, C.gold1], [726, 716, 8, C.coral1], [748, 730, 7, C.rose1], [292, 790, 7, C.gold1], [470, 790, 7, C.rose0]]) {
    body += grass(fx + 2, fy + 12, { h: 24, fill: '#6E9C76', n: 4, seed: fx });
    body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });
  }

  // warm light on the rock where he stands
  body += g({ 'clip-path': `url(#${id('b0')})` }, ellipse(540, 702, 220, 44, { fill: '#FFE3B0', opacity: 0.4 }));
  // the great ram, facing the sunrise
  body += g({ 'clip-path': `url(#${id('b0')})` }, ellipse(548, 700, 150, 14, { fill: '#8C4F48', opacity: 0.22 }));
  body += greatRam(552, 700, { s: 1.12, flip: true, woolFill: `url(#${id('wool')})` });
  // grass and flowers around his hooves: a grassy hilltop
  for (const [gx, gy, gh, sd] of [[418, 706, 30, 1], [522, 708, 26, 2], [600, 706, 24, 3], [668, 704, 30, 4], [470, 712, 20, 5]]) body += grass(gx, gy, { h: gh, fill: '#6E9C76', n: 5, seed: sd });
  body += flower(436, 700, { r: 7, fill: C.rose0, center: C.gold2 }) + flower(652, 698, { r: 7, fill: C.gold1, center: C.coral2 }) + flower(560, 704, { r: 6, fill: C.coral0, center: C.gold2 });

  // sparkles of joy around him
  for (const [sx, sy, ss] of [[310, 520, 13], [790, 410, 15], [820, 560, 10], [330, 640, 8], [700, 330, 10], [440, 330, 8], [860, 470, 7]]) body += sparkle(sx, sy, ss, '#FFF7DE');

  // foreground framing: rocks, shrubs, grasses and a little bird
  body += path(ridge([[-20, 905], [90, 880], [220, 915], [350, 948], [500, 962], [650, 955], [790, 925], [910, 890], [1020, 905]]), { fill: '#B06F61' });
  body += boulder(id('f1'), [[-30, 1010], [-20, 880], [60, 840], [150, 870], [190, 960], [120, 1010]], { base: '#A86759', light: '#C98676', dark: '#8C5149' });
  body += boulder(id('f2'), [[830, 1010], [850, 900], [930, 862], [1030, 880], [1030, 1010]], { base: '#A86759', light: '#C98676', dark: '#8C5149' });
  body += shrub(215, 940, { w: 160, fill: '#7DA67B', dark: '#5B886A', light: '#A9CB92', blossom: C.rose1, seed: 5 });
  body += shrub(770, 948, { w: 140, fill: '#7DA67B', dark: '#5B886A', light: '#A9CB92', blossom: C.gold1, seed: 9 });
  for (const [gx, gy, gh] of [[60, 860, 60], [330, 965, 44], [640, 968, 40], [905, 880, 64], [985, 885, 52]]) body += grass(gx, gy, { h: gh, fill: '#5B886A', n: 6, seed: gx + 3 });
  for (const [fx, fy, fr, fc] of [[300, 968, 10, C.coral1], [420, 975, 9, C.rose0], [560, 978, 10, C.gold1], [690, 972, 9, C.rose1]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });
  body += bird(118, 862, { s: 0.6, body: C.coral1, wing: C.coral2, belly: C.coral0 });
  for (const [px, py, pw] of [[380, 958, 22], [404, 962, 14], [610, 960, 18], [520, 985, 16]]) body += ellipse(px, py, pw / 2, pw * 0.3, { fill: '#9A5E52', opacity: 0.8 }) + ellipse(px - pw * 0.12, py - pw * 0.1, pw * 0.22, pw * 0.1, { fill: '#D99682', opacity: 0.8 });
  body += butterfly(300, 880, { s: 0.9, wing: C.rose1, wing2: C.rose0, rot: -12 });
  body += butterfly(790, 840, { s: 0.75, wing: C.gold1, wing2: C.gold0, rot: 14 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
