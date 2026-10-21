// Baby Ismail and the Zamzam spring (Quran 14:37, 2:158; details from
// Sahih al-Bukhari). The barren rocky valley of Makkah - there is no Ka'bah
// yet. Safa (left) and Marwa (right) are two small rocky hills with a path
// between them; in the middle fresh water gushes up from the sand into a
// sparkling pool. Birds begin to circle above; a single tree gives a little
// shade and an empty water-skin lies by the pool. No people.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  sparkle, cloud, grass, eye, r1, T,
} from '../lib.js';

// One faceted boulder lit from the upper left. (x, y) = bottom centre.
function boulder(x, y, w, h, { seed = 1, light = C.rock1, mid = C.rock2, dark = C.rock3, top = C.rock0 } = {}) {
  const R = rng(seed);
  const P = (fx, fy) => [x + fx * w, y - fy * h];
  const pts = [P(-0.5, 0), P(-0.52 + R.range(-0.03, 0.03), R.range(0.42, 0.56)), P(-R.range(0.26, 0.34), R.range(0.86, 0.96)), P(R.range(-0.04, 0.06), 1), P(R.range(0.3, 0.36), R.range(0.8, 0.9)), P(0.5, R.range(0.34, 0.46)), P(0.47, 0)];
  let s = path(blob(pts, 0.55), { fill: mid });
  // the lit top-left facet
  s += path(blob([pts[1], pts[2], pts[3], P(0.12, 0.72), P(-0.12, 0.5), P(-0.42, 0.3)], 0.5), { fill: light });
  // the shaded right side
  s += path(blob([P(0.14, 0.86), pts[4], pts[5], pts[6], P(0.14, 0), P(0.2, 0.46)], 0.5), { fill: dark, opacity: 0.75 });
  // a sunny glint
  s += ellipse(x - w * 0.18, y - h * 0.78, w * 0.12, h * 0.05, { fill: top, opacity: 0.85, transform: `rotate(-18 ${r1(x - w * 0.18)} ${r1(y - h * 0.78)})` });
  // a crack
  s += path(`M${r1(x + w * 0.02)},${r1(y - h * 0.62)} l${r1(w * 0.06)},${r1(h * 0.14)} l${r1(-w * 0.03)},${r1(h * 0.12)}`, { fill: 'none', stroke: dark, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.6 });
  return s;
}

// A small rocky hill: a craggy heap of boulders. (x, y) = foot centre.
function rockyHill(x, y, w, h, { seed = 1 } = {}) {
  const R = rng(seed);
  let s = ellipse(x + w * 0.04, y + 2, w * 0.56, 14, { fill: C.ink, opacity: 0.12 });
  // the hill's sandy-rocky mound
  s += path(`M${r1(x - w * 0.62)},${r1(y + 6)} C${r1(x - w * 0.5)},${r1(y - h * 0.5)} ${r1(x - w * 0.2)},${r1(y - h * 0.62)} ${r1(x)},${r1(y - h * 0.62)} C${r1(x + w * 0.24)},${r1(y - h * 0.62)} ${r1(x + w * 0.5)},${r1(y - h * 0.46)} ${r1(x + w * 0.62)},${r1(y + 6)}Z`, { fill: mix(C.rock2, C.sand3, 0.45) });
  s += path(`M${r1(x + w * 0.1)},${r1(y - h * 0.6)} C${r1(x + w * 0.3)},${r1(y - h * 0.58)} ${r1(x + w * 0.52)},${r1(y - h * 0.4)} ${r1(x + w * 0.62)},${r1(y + 6)} L${r1(x + w * 0.2)},${r1(y + 6)}Z`, { fill: C.rock3, opacity: 0.3 });
  // back row, the big crown boulder, then the front row
  const layout = [
    [-0.28, -0.02, 0.42, 0.62], [0.26, -0.03, 0.4, 0.56],
    [-0.02, 0.02, 0.5, 1.0],
    [-0.4, 0.06, 0.3, 0.38], [0.4, 0.06, 0.28, 0.34], [-0.12, 0.08, 0.3, 0.4], [0.16, 0.09, 0.26, 0.3],
  ];
  for (const [fx, fy, fw, fh] of layout) {
    s += boulder(x + fx * w + R.range(-6, 6), y + fy * h * 0.4, fw * w, fh * h, { seed: Math.floor(R() * 1000) });
  }
  // a few pebbles at the foot
  for (let i = 0; i < 4; i++) {
    const px = x + R.range(-0.5, 0.5) * w;
    s += ellipse(px, y + R.range(4, 16), R.range(6, 12), R.range(4, 6), { fill: C.rock2 }) + ellipse(px - 2, y + 2, 4, 2, { fill: C.rock0, opacity: 0.7 });
  }
  return s;
}

// A flat-topped acacia tree. (x, y) = base of the trunk.
function acacia(x, y, { s = 1 } = {}) {
  const parts = [];
  parts.push(path('M-8,0 C-6,-40 -10,-70 -30,-104 L-22,-108 C-6,-84 0,-64 2,-50 C8,-70 22,-92 40,-108 L48,-102 C30,-86 14,-60 10,-30 L10,0Z', { fill: C.wood3 }));
  parts.push(path('M2,-50 C8,-70 22,-92 40,-108 L48,-102 C30,-86 14,-60 10,-30 L10,0 L4,0Z', { fill: C.wood4, opacity: 0.5 }));
  // the umbrella canopy: a dark under-layer, then lit puffs
  const puffs = [[-104, -116, 30], [-66, -132, 38], [-20, -140, 42], [26, -138, 40], [70, -128, 36], [104, -114, 28]];
  parts.push(g({ fill: C.leaf5 }, puffs.map(([px, py, pr]) => ellipse(px + 4, py + 10, pr * 1.1, pr * 0.62)), rect(-126, -122, 252, 22, { rx: 11 })));
  parts.push(g({ fill: C.leaf4 }, puffs.map(([px, py, pr]) => ellipse(px, py, pr * 1.1, pr * 0.6))));
  parts.push(g({ fill: C.leaf3, opacity: 0.9 }, puffs.slice(0, 4).map(([px, py, pr]) => ellipse(px - 6, py - 8, pr * 0.7, pr * 0.32))));
  parts.push(g({ fill: C.leaf2, opacity: 0.7 }, ellipse(-60, -146, 22, 8), ellipse(-16, -156, 20, 7)));
  // tiny yellow blossoms
  for (const [bx, by] of [[-90, -124], [-40, -150], [10, -146], [56, -140], [90, -122], [-70, -112], [30, -122]]) parts.push(circle(bx, by, 3.4, { fill: C.gold1 }));
  return g({ transform: T(x, y, s) }, parts);
}

// An empty goatskin water-bag lying flat on the sand: deflated, with its
// tied leg-stubs, a cord at the neck and a carrying strap. (x, y) = centre.
function waterSkin(x, y, { s = 1, rot = 0 } = {}) {
  const leather = '#B97A4A';
  const dark = '#8E5734';
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})` },
    ellipse(2, 14, 72, 10, { fill: C.ink, opacity: 0.15 }),
    // carrying strap lying in a loop behind
    path('M-56,4 C-86,10 -96,24 -70,30 C-40,36 -10,28 6,20', { fill: 'none', stroke: dark, 'stroke-width': 5, 'stroke-linecap': 'round' }),
    // the flat, empty bag
    path('M-58,8 C-66,-8 -54,-24 -30,-22 C-10,-30 20,-28 42,-18 C58,-12 62,4 48,12 C20,18 -24,20 -48,16 C-54,14 -58,12 -58,8Z', { fill: leather }),
    path('M-54,12 C-24,8 18,8 54,0 C58,6 56,10 48,12 C20,18 -24,20 -48,16Z', { fill: dark, opacity: 0.55 }),
    // tied leg-stubs
    path('M-40,-18 C-46,-30 -40,-36 -32,-32 C-30,-26 -32,-22 -32,-20Z', { fill: leather }),
    path('M8,-27 C8,-40 18,-42 22,-36 C22,-30 18,-28 16,-26Z', { fill: leather }),
    circle(-38, -28, 3, { fill: dark }) + circle(16, -36, 3, { fill: dark }),
    // soft wrinkles and a light sheen: it is empty
    path('M-34,-10 q10,8 2,18 M-6,-14 q10,8 2,18 M22,-12 q8,8 0,16', { fill: 'none', stroke: dark, 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0.6 }),
    path('M-44,-12 C-30,-20 -8,-22 12,-20', { fill: 'none', stroke: '#E0A877', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }),
    // stitched edge
    path('M-52,6 C-20,12 20,12 50,4', { fill: 'none', stroke: '#E9C59E', 'stroke-width': 2, 'stroke-dasharray': '3 6', 'stroke-linecap': 'round', opacity: 0.8 }),
    // the neck with its cord
    path('M46,-12 C58,-16 70,-14 74,-8 C76,-2 70,4 60,2 C54,0 50,-2 46,0Z', { fill: leather }),
    path('M58,-14 L61,2', { stroke: '#F2D9A6', 'stroke-width': 3.5, 'stroke-linecap': 'round' }),
    path('M61,0 q10,6 4,16 M60,0 q-4,10 -12,12', { fill: 'none', stroke: '#F2D9A6', 'stroke-width': 2.4, 'stroke-linecap': 'round' }),
  );
}

// Short horizontal glints on the water.
function shimmerDash(x, y, w) {
  return path(`M${r1(x - w / 2)},${r1(y)} L${r1(x + w / 2)},${r1(y)}`, { stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }) +
    path(`M${r1(x - w * 0.3)},${r1(y + 9)} L${r1(x + w * 0.2)},${r1(y + 9)}`, { stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.5 });
}

// A white bird circling, wings spread. (x, y) = body centre; faces right.
function circlingBird(x, y, { s = 1, flip = false, up = true, rot = 0 } = {}) {
  const wingUp = 'M4,-4 C0,-34 -14,-60 -40,-74 Q-42,-62 -52,-60 Q-48,-48 -58,-42 Q-50,-32 -56,-24 C-40,-14 -16,-6 4,-4Z';
  const wingDown = 'M4,0 C0,24 -14,44 -38,54 Q-40,44 -50,42 Q-46,32 -56,28 C-40,16 -16,6 4,0Z';
  return g({ transform: T(x, y, s, rot, flip) },
    path('M-32,-2 L-58,-12 Q-62,0 -58,10Z', { fill: '#D9E4EE' }),
    up ? path(wingUp, { fill: '#C9D6E4', transform: 'translate(-8 -4) rotate(-24)' }) : '',
    ellipse(0, 0, 34, 15, { fill: C.white }),
    ellipse(4, 6, 22, 7, { fill: '#E3ECF3' }),
    circle(30, -8, 13, { fill: C.white }),
    path('M41,-10 L54,-6 L41,-2Z', { fill: C.gold2 }),
    eye(34, -10, 3),
    ellipse(35, -2, 3.6, 2.2, { fill: C.cheek, opacity: 0.6 }),
    path(up ? wingUp : wingDown, { fill: '#EEF3F8' }),
    path(up ? 'M-40,-74 Q-42,-62 -52,-60 Q-48,-48 -58,-42 C-48,-48 -42,-60 -40,-74Z' : 'M-38,54 Q-40,44 -50,42 Q-46,32 -56,28 C-48,36 -42,46 -38,54Z', { fill: '#A9B8CC' }),
  );
}

export default function render() {
  const id = ids('s11');
  const R = rng(1111);
  const defs = [
    linear(id('sky'), [[0, '#5AAAD3'], [0.4, '#86C6E2'], [0.75, '#C8E7EE'], [1, '#F6EFD8']]),
    glowDef(id('sunGlow'), '#FFF6D6', 0.85),
    linear(id('sand'), [[0, '#F6DCA6'], [0.4, '#EFC98B'], [1, '#E2B06E']]),
    radial(id('pool'), [[0, '#E8FBF8'], [0.3, '#A9E6E4'], [0.75, '#5BBFCB'], [1, '#3398B0']], { cx: 0.5, cy: 0.42, r: 0.6 }),
    glowDef(id('mercy'), '#FFF2C4', 0.7),
    radial(id('wet'), [[0.6, '#C99A5E', 0.55], [1, '#C99A5E', 0]]),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');
  const haze = (c, t) => mix(c, '#CFE6EC', t);

  let body = '';
  // ---- hot bright sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += circle(150, 120, 230, { fill: `url(#${id('sunGlow')})` });
  body += circle(150, 120, 62, { fill: '#FFF1BE' });
  body += circle(142, 112, 44, { fill: '#FFFBEA', opacity: 0.7 });
  body += cloud(820, 170, 200, { fill: C.white, shade: '#DCEEF4', seed: 4, opacity: 0.9 });
  body += cloud(470, 110, 130, { fill: C.white, shade: '#DCEEF4', seed: 8, opacity: 0.75 });

  // ---- the rugged mountains of Makkah around the valley
  const far = [[-20, 470], [60, 380], [130, 420], [210, 340], [300, 410], [380, 372], [470, 430], [560, 380], [650, 420], [740, 350], [830, 400], [920, 336], [1020, 420]];
  body += path(ridge(far, 1000), { fill: haze(C.rock2, 0.55) });
  body += path(ridge(far.map(([x, y], i) => [x + 18, y + 26 + (i % 2) * 14]), 1000), { fill: haze(C.rock3, 0.6), opacity: 0.45 });
  const mid = [[-20, 540], [90, 480], [200, 520], [320, 470], [430, 520], [560, 488], [690, 526], [800, 476], [910, 510], [1020, 470]];
  body += path(ridge(mid, 1000), { fill: haze(C.rock2, 0.35) });
  body += path(ridge(mid.map(([x, y], i) => [x + 22, y + 30 + (i % 2) * 10]), 1000), { fill: haze(C.rock3, 0.4), opacity: 0.4 });

  // ---- the valley floor
  body += path(ridge([[-20, 600], [200, 586], [420, 598], [640, 584], [860, 596], [1020, 588]], 1000), { fill: `url(#${id('sand')})` });

  // ---- Safa (left) and Marwa (right): two small rocky hills
  body += rockyHill(160, 690, 330, 230, { seed: 3 });
  body += rockyHill(850, 684, 310, 210, { seed: 7 });

  // ---- the path between them, with a few soft footprints
  body += path('M240,700 C350,656 450,644 520,646 C600,648 690,660 770,700 C690,680 600,672 520,672 C440,672 350,682 240,700Z', { fill: '#D9AE72', opacity: 0.35, transform: 'translate(0 4)' });
  body += path('M240,700 C350,656 450,644 520,646 C600,648 690,660 770,700 C690,680 600,672 520,672 C440,672 350,682 240,700Z', { fill: '#FFF0CC' });
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9;
    const px = 290 + t * 430;
    const py = 676 - Math.sin(Math.PI * t) * 20 + (i % 2 ? 4 : -4);
    body += ellipse(px, py, 5.5, 2.8, { fill: '#D9AE72', opacity: 0.6 });
  }

  // ---- the single acacia and its little shade
  body += ellipse(318, 812, 140, 26, { fill: C.ink, opacity: 0.12 });
  body += acacia(318, 808, { s: 1.12 });

  // ---- Zamzam: water gushing up from the sand into a small pool
  const PX = 530;
  const PY = 786;
  body += circle(PX, PY - 50, 280, { fill: `url(#${id('mercy')})` });
  const poolPts = [];
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    const k = 1 + R.range(-0.05, 0.05);
    poolPts.push([PX + Math.cos(a) * 196 * k, PY + Math.sin(a) * 54 * k]);
  }
  body += path(blob(poolPts.map(([x, y]) => [PX + (x - PX) * 1.1, PY + (y - PY) * 1.22 + 4])), { fill: `url(#${id('wet')})` });
  body += path(blob(poolPts.map(([x, y]) => [PX + (x - PX) * 1.04, PY + (y - PY) * 1.08 + 3])), { fill: '#CF9E5E' });
  body += path(blob(poolPts), { fill: `url(#${id('pool')})` });
  body += path(blob(poolPts.map(([x, y]) => [PX + (x - PX) * 0.97, y - 6])).replace(/Z$/, ''), { fill: 'none', stroke: '#2F8FA8', 'stroke-width': 3, opacity: 0.25 });
  // stones around the rim
  for (const [sx, sy, sw] of [[350, 772, 30], [372, 806, 22], [700, 768, 26], [716, 800, 30], [440, 830, 20], [622, 834, 24]]) {
    body += ellipse(sx, sy, sw * 0.5, sw * 0.3, { fill: C.rock2 }) + ellipse(sx - sw * 0.1, sy - sw * 0.1, sw * 0.24, sw * 0.1, { fill: C.rock0, opacity: 0.8 });
  }
  // ripple arcs spreading from the spring
  for (const [rx, ry, op] of [[150, 36, 0.45], [110, 26, 0.55], [70, 16, 0.7]]) {
    body += path(`M${PX - rx},${PY} A${rx},${ry} 0 0 0 ${PX + rx},${PY}`, { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: op });
    body += path(`M${PX - rx * 0.7},${PY - ry * 0.7} A${rx},${ry} 0 0 1 ${PX - rx * 0.1},${PY - ry}`, { fill: 'none', stroke: C.white, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: op * 0.7 });
  }
  body += shimmerDash(PX + 80, PY + 22, 40) + shimmerDash(PX - 110, PY + 14, 30);
  // the spring bubbling up from the sand: a frothy dome and uneven jets
  const jets = [[0, 140, 0, 34], [-50, 98, -0.42, 24], [54, 110, 0.4, 26], [-24, 74, -0.2, 18], [28, 80, 0.22, 18]];
  for (const [jx, jh, lean, jw] of jets) {
    const bx = PX + jx * 0.4;
    const tx = PX + jx + lean * 40;
    const ty = PY - jh;
    const jet = (k) => `M${r1(bx - jw * 0.5 * k)},${r1(PY - 10)} C${r1(bx - jw * 0.45 * k)},${r1(PY - jh * 0.5)} ${r1(tx - jw * 0.32 * k)},${r1(ty + jh * 0.25)} ${r1(tx)},${r1(ty - 2 * (k - 1))} C${r1(tx + jw * 0.32 * k)},${r1(ty + jh * 0.25)} ${r1(bx + jw * 0.45 * k)},${r1(PY - jh * 0.5)} ${r1(bx + jw * 0.5 * k)},${r1(PY - 10)}Z`;
    body += path(jet(1.25), { fill: C.water2, opacity: 0.85 });
    body += path(jet(1), { fill: '#BDEEEC' });
    body += path(`M${r1(bx - jw * 0.15)},${r1(PY - 12)} C${r1(bx - jw * 0.12)},${r1(PY - jh * 0.5)} ${r1(tx - jw * 0.1)},${r1(ty + jh * 0.3)} ${r1(tx)},${r1(ty + 6)}`, { fill: 'none', stroke: C.white, 'stroke-width': r1(jw * 0.22), 'stroke-linecap': 'round', opacity: 0.9 });
    // a little splash at the tip of each jet: a soft tip and flung droplets
    body += ellipse(tx, ty + 2, jw * 0.3, jw * 0.22, { fill: '#E6FAF8' });
    for (const [ddx, ddy, dr] of [[-0.55, -0.35, 0.16], [0.5, -0.45, 0.14], [-0.15, -0.8, 0.12], [0.85, 0.1, 0.12], [-0.9, 0.15, 0.11]]) {
      body += circle(tx + ddx * jw, ty + ddy * jw, Math.max(2.2, dr * jw), { fill: C.white, opacity: 0.95 });
    }
  }
  // the rounded mound of welling water and its froth
  body += path(`M${PX - 58},${PY - 2} C${PX - 54},${PY - 34} ${PX - 26},${PY - 50} ${PX},${PY - 50} C${PX + 26},${PY - 50} ${PX + 54},${PY - 34} ${PX + 58},${PY - 2}Z`, { fill: '#A9E6E4' });
  body += path(`M${PX - 40},${PY - 14} C${PX - 34},${PY - 34} ${PX - 14},${PY - 42} ${PX + 2},${PY - 42}`, { fill: 'none', stroke: C.white, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.85 });
  for (const [fx, fy, fr] of [[-56, -2, 12], [-36, 2, 14], [-12, 4, 12], [12, 3, 14], [36, 2, 13], [56, -1, 11], [-24, -8, 8], [24, -9, 8]]) body += circle(PX + fx, PY + fy, fr, { fill: C.white, opacity: 0.92 });
  // droplets thrown up and out
  for (let i = 0; i < 20; i++) {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 20;
    const d = R.range(60, 120);
    const dx = PX + Math.cos(a) * d * 1.2;
    const dy = PY - 70 + Math.sin(a) * d * 0.55 + Math.abs(Math.cos(a)) * 50;
    body += circle(dx, dy, R.range(2.6, 5.4), { fill: R() < 0.5 ? C.white : '#BDEEEC', opacity: R.range(0.75, 1) });
  }
  // sparkles of blessing
  for (const [sx, sy, ss] of [[PX, PY - 140, 16], [PX - 70, PY - 112, 10], [PX + 74, PY - 120, 12], [PX - 150, PY - 30, 9], [PX + 156, PY - 40, 10], [PX + 30, PY - 170, 8], [PX - 36, PY - 160, 7]]) body += sparkle(sx, sy, ss, C.white);

  // the empty water-skin by the pool
  body += waterSkin(760, 872, { s: 1.05, rot: -4 });

  // a little bird already drinking at the edge
  body += g({ transform: T(385, 812, 0.62) },
    path('M-30,-30 L-58,-40 L-52,-24 Z', { fill: C.sand4 }),
    ellipse(0, -34, 32, 24, { fill: C.sand3 }),
    ellipse(6, -26, 20, 14, { fill: C.sand1 }),
    circle(26, -40, 17, { fill: C.sand3 }),
    path('M38,-36 L50,-26 L36,-30Z', { fill: C.gold2 }),
    path('M-18,-44 C-6,-52 14,-46 12,-32 C6,-24 -14,-24 -22,-30Z', { fill: C.sand4 }),
    eye(30, -44, 3.6),
    ellipse(34, -34, 4, 2.6, { fill: C.cheek, opacity: 0.6 }),
    path('M-4,-10 L-6,0 M8,-10 L10,0', { stroke: C.gold4, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }),
  );

  // ---- birds beginning to circle above the water
  body += ellipse(530, 450, 230, 58, { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-dasharray': '2 14', 'stroke-linecap': 'round', opacity: 0.8 });
  body += circlingBird(640, 400, { s: 0.62, flip: true, up: false });
  body += circlingBird(400, 404, { s: 0.6, flip: true, up: true });
  body += circlingBird(340, 480, { s: 0.85, up: false, rot: 10 });
  body += circlingBird(712, 492, { s: 0.88, up: true, rot: -12 });

  // ---- foreground: sand, pebbles and dry tufts framing the bottom
  body += path(ridge([[-20, 930], [180, 900], [420, 926], [640, 908], [860, 928], [1020, 900]], 1000), { fill: '#E2B06E', opacity: 0.6 });
  for (const [px, py, pw] of [[80, 950, 60], [150, 975, 34], [880, 958, 70], [940, 930, 40], [600, 968, 26]]) {
    body += ellipse(px, py, pw * 0.5, pw * 0.26, { fill: C.rock2 }) + ellipse(px - pw * 0.12, py - pw * 0.08, pw * 0.2, pw * 0.08, { fill: C.rock0, opacity: 0.8 });
  }
  for (const [gx, gy, gh, sd] of [[40, 940, 70, 1], [214, 968, 40, 2], [800, 960, 46, 3], [968, 924, 64, 4]]) body += grass(gx, gy, { h: gh, fill: C.sand4, n: 5, seed: sd });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
