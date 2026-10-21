// Building the Ka'bah (Quran 2:125-129, 22:26).
// The House being raised: a cube of stacked stones about two-thirds built,
// its top rows still uneven, a pile of stones and a basket beside it, the
// stone step to stand on (Maqam Ibrahim) and the dark Black Stone set in its
// corner. No kiswa yet. Rocky hills of Makkah, golden late-afternoon light,
// a few birds. No people.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  sparkle, farBird, grass, mountain, cloud, rays, eye, r1, T, lerp,
} from '../lib.js';

// ---------------------------------------------------------------- geometry
// Two faces of the cube meet at the front corner F. Each face is mapped by
// (u, v): u runs from the front corner (0) to the back corner (1), v from the
// ground (0) to the full planned height (1).
const HORIZON = 610;
const F = [500, 846];
const L = [262, 796];
const RB = [752, 798];
const TF = [500, 318];
const towardVP = (base, top, back) => {
  // the top edge runs from TF toward the same vanishing point as the bottom edge
  const vpx = base[0] + ((back[0] - base[0]) * (HORIZON - base[1])) / (back[1] - base[1]);
  const t = (back[0] - TF[0]) / (vpx - TF[0]);
  return [back[0], top[1] + t * (HORIZON - top[1])];
};
const TL = towardVP(F, TF, L);
const TR = towardVP(F, TF, RB);
const lp = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const faceL = (u, v) => lp(lp(F, L, u), lp(TF, TL, u), v);
const faceR = (u, v) => lp(lp(F, RB, u), lp(TF, TR, u), v);

// One stone of a course: a quad on the face sitting on its own mortar bed
// (so gaps read as mortar), softened with a round-joined stroke.
function stone(face, u0, u1, v0, v1, fill, mortar, hi) {
  const quad = (gu, gv) => [face(u0 + gu, v0 + gv), face(u1 - gu, v0 + gv), face(u1 - gu, v1 - gv), face(u0 + gu, v1 - gv)];
  const pts = (q) => q.map((p) => p.map(r1).join(',')).join(' ');
  let s = `<polygon points="${pts(quad(0, 0))}" fill="${mortar}"/>`;
  s += `<polygon points="${pts(quad(0.008, 0.011))}" fill="${fill}" stroke="${fill}" stroke-width="5" stroke-linejoin="round"/>`;
  const a = face(u0 + 0.02, v1 - 0.022);
  const b = face(u1 - 0.02, v1 - 0.022);
  s += path(`M${r1(a[0])},${r1(a[1])} L${r1(b[0])},${r1(b[1])}`, { stroke: hi, 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0.75 });
  return s;
}

// The courses of one face. `limit(row, u)` says whether a stone at that
// spot has been laid yet, which makes the top rows uneven.
function wall(face, { seed, colors, mortar, hi, rows, limit }) {
  const R = rng(seed);
  let s = '';
  let v = 0;
  for (let r = 0; r < rows.length; r++) {
    const v0 = v;
    const v1 = v + rows[r];
    v = v1;
    let u = r % 2 ? -R.range(0.05, 0.1) : 0;
    while (u < 1) {
      const w = R.range(0.16, 0.24);
      const u0 = Math.max(0, u);
      const u1 = Math.min(1, u + w);
      u += w;
      if (u1 - u0 < 0.04) continue;
      if (!limit(r, (u0 + u1) / 2)) continue;
      s += stone(face, u0, u1, v0, v1, R.pick(colors), mortar, hi);
    }
  }
  return s;
}

// ---------------------------------------------------------------- props
function looseStone(x, y, w, h, fill, dark, light, seed = 1) {
  const R = rng(seed);
  const pts = [[x - w / 2, y], [x - w * 0.5, y - h * R.range(0.6, 0.8)], [x - w * 0.2, y - h], [x + w * 0.3, y - h * R.range(0.9, 1)], [x + w * 0.5, y - h * 0.55], [x + w * 0.46, y]];
  return path(blob(pts, 0.5), { fill }) +
    path(blob([[x + w * 0.06, y], [x + w * 0.16, y - h * 0.7], [x + w * 0.3, y - h * 0.95], [x + w * 0.5, y - h * 0.55], [x + w * 0.46, y]], 0.5), { fill: dark, opacity: 0.7 }) +
    path(`M${r1(x - w * 0.36)},${r1(y - h * 0.8)} L${r1(x + w * 0.14)},${r1(y - h * 0.96)}`, { stroke: light, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 });
}

// The stone step (Maqam Ibrahim) with two soft footprint hollows on top.
function maqam(x, y) {
  const top = [[x - 46, y - 52], [x + 6, y - 64], [x + 50, y - 50], [x - 2, y - 38]];
  return (
    ellipse(x + 30, y + 4, 70, 12, { fill: C.ink, opacity: 0.16 }) +
    path(`M${x - 46},${y - 52} L${x - 2},${y - 38} L${x - 2},${y + 2} L${x - 46},${y - 12}Z`, { fill: '#E6C08A', stroke: '#E6C08A', 'stroke-width': 4, 'stroke-linejoin': 'round' }) +
    path(`M${x - 2},${y - 38} L${x + 50},${y - 50} L${x + 50},${y - 10} L${x - 2},${y + 2}Z`, { fill: '#BE9468', stroke: '#BE9468', 'stroke-width': 4, 'stroke-linejoin': 'round' }) +
    `<polygon points="${top.map((p) => p.map(r1).join(',')).join(' ')}" fill="#F3D7A8" stroke="#F3D7A8" stroke-width="4" stroke-linejoin="round"/>` +
    ellipse(x - 8, y - 52, 8, 4.2, { fill: '#C9A06C', transform: `rotate(-14 ${x - 8} ${y - 52})` }) +
    ellipse(x + 14, y - 55, 8, 4.2, { fill: '#C9A06C', transform: `rotate(-14 ${x + 14} ${y - 55})` }) +
    path(`M${x - 40},${y - 30} L${x - 8},${y - 20}`, { stroke: '#F6DDB0', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.7 })
  );
}

function basket(x, y) {
  const body = `M${x - 42},${y - 40} L${x + 42},${y - 40} C${x + 40},${y - 10} ${x + 30},${y} ${x},${y} C${x - 30},${y} ${x - 40},${y - 10} ${x - 42},${y - 40}Z`;
  let s = ellipse(x + 10, y + 2, 52, 8, { fill: C.ink, opacity: 0.16 });
  s += path(`M${x - 36},${y - 40} C${x - 30},${y - 92} ${x + 30},${y - 92} ${x + 36},${y - 40}`, { fill: 'none', stroke: C.wood2, 'stroke-width': 6, 'stroke-linecap': 'round' });
  s += looseStone(x - 16, y - 34, 34, 22, '#E2BC88', '#B98E5E', '#F6DDB0', 4) + looseStone(x + 14, y - 36, 30, 20, '#D9AE77', '#B08458', '#F6DDB0', 6);
  s += path(body, { fill: C.wood1 });
  for (let i = 1; i < 4; i++) s += path(`M${x - 42 + i * 2},${y - 40 + i * 10} Q${x},${y - 34 + i * 10} ${x + 42 - i * 2},${y - 40 + i * 10}`, { fill: 'none', stroke: C.wood2, 'stroke-width': 3, opacity: 0.8 });
  for (let i = -3; i <= 3; i++) s += path(`M${x + i * 11},${y - 40} L${x + i * 8},${y - 2}`, { stroke: C.wood2, 'stroke-width': 2, opacity: 0.5 });
  s += ellipse(x, y - 40, 42, 7, { fill: 'none', stroke: C.wood2, 'stroke-width': 4 });
  return s;
}

// A grey-lilac pigeon pecking or standing (faces right). (x, y) = feet.
function pigeon(x, y, { s = 1, flip = false, peck = false } = {}) {
  const body = '#B9B6D6';
  const dark = '#8F8BB8';
  const head = peck ? [30, -18] : [26, -48];
  return g({ transform: T(x, y, s, 0, flip) },
    ellipse(2, 2, 30, 5, { fill: C.ink, opacity: 0.15 }),
    path('M-28,-30 L-52,-26 L-46,-16Z', { fill: dark }),
    ellipse(0, -28, 30, 20, { fill: body }),
    ellipse(6, -20, 18, 10, { fill: '#D6D3EA' }),
    path(`M14,-36 C${head[0] - 10},${head[1] + 14} ${head[0] - 4},${head[1] + 4} ${head[0]},${head[1]} L${head[0] + 8},${head[1] + 10} C${head[0] + 4},${head[1] + 18} 26,-22 22,-18Z`, { fill: body }),
    path(`M14,-30 C18,-36 22,-38 26,-36 L28,-28 C24,-26 20,-24 18,-22Z`, { fill: '#8FCFAE', opacity: 0.7 }),
    circle(head[0], head[1], 11, { fill: body }),
    path(`M${head[0] + 9},${head[1] - 1} L${head[0] + 18},${head[1] + 3} L${head[0] + 9},${head[1] + 5}Z`, { fill: '#E8A0A8' }),
    eye(head[0] + 3, head[1] - 2, 2.8),
    ellipse(head[0] + 4, head[1] + 6, 3.2, 2, { fill: C.cheek, opacity: 0.65 }),
    path('M-16,-38 C-4,-44 12,-38 10,-26 C2,-20 -12,-22 -18,-28Z', { fill: dark }),
    path('M-12,-34 L4,-36 M-14,-28 L2,-30', { stroke: '#6E6A9C', 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0.6 }),
    path('M-4,-10 L-6,0 M6,-10 L8,0', { stroke: '#E58C9A', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }),
  );
}

export default function render() {
  const id = ids('s12');
  const R = rng(1212);
  const defs = [
    linear(id('sky'), [[0, '#86BCD8'], [0.35, '#B9D5DA'], [0.6, '#F5DDB0'], [0.82, '#FFD49A'], [1, '#FFE2B4']]),
    glowDef(id('sunGlow'), '#FFF0C4', 0.9),
    radial(id('goldAir'), [[0, '#FFE0A0', 0.5], [1, '#FFE0A0', 0]]),
    linear(id('ground'), [[0, '#EDC487'], [0.5, '#E2AE6E'], [1, '#D39A5E']]),
    radial(id('rayFade'), [[0.15, '#FFF3D0', 0.26], [1, '#FFF3D0', 0]], { cx: 140, cy: 400, r: 520, units: 'userSpaceOnUse' }),
    linear(id('shadeFace'), [[0, C.ink, 0.04], [1, C.ink, 0.16]], { x1: 500, y1: 0, x2: 760, y2: 0, units: 'userSpaceOnUse' }),
    glowDef(id('blessing'), '#FFF6D8', 0.6),
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');

  let body = '';
  // ---- golden late-afternoon sky with the sun low on the left
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += rays(140, 400, { n: 12, len: 520, spread: 300, dir: 10, width: 6, color: `url(#${id('rayFade')})`, op: 1 });
  body += circle(140, 400, 340, { fill: `url(#${id('sunGlow')})` });
  body += circle(140, 400, 72, { fill: '#FFE7A8', opacity: 0.45 });
  body += circle(140, 400, 62, { fill: '#FFDA86' });
  body += circle(132, 392, 46, { fill: '#FFF1C8', opacity: 0.6 });
  body += cloud(720, 200, 210, { fill: '#FFF4E2', shade: '#F6D3AE', seed: 3, opacity: 0.9 });
  body += cloud(905, 300, 150, { fill: '#FFF4E2', shade: '#F6D3AE', seed: 6, opacity: 0.85 });
  body += cloud(330, 130, 160, { fill: '#FFF7EA', shade: '#E9DCCB', seed: 9, opacity: 0.85 });
  body += farBird(640, 286, 1.2, '#8A6A7A', 0.55) + farBird(680, 270, 0.9, '#8A6A7A', 0.5) + farBird(860, 350, 1, '#8A6A7A', 0.5);

  // ---- rocky hills of Makkah all around, lit from the left
  const haze = (c, t) => mix(c, '#F4D6B0', t);
  for (const [mx, mw, mh, sd] of [[60, 300, 210, 1], [250, 280, 170, 2], [430, 260, 150, 3], [600, 300, 190, 4], [790, 320, 230, 5], [960, 280, 180, 6]]) {
    body += mountain(mx, 640, mw, mh, { light: haze(C.rock1, 0.5), dark: haze(C.rock2, 0.5), seed: sd, peakRound: 0.06 });
  }
  for (const [mx, mw, mh, sd] of [[-10, 300, 170, 7], [190, 260, 120, 8], [820, 280, 150, 9], [1010, 300, 190, 10]]) {
    body += mountain(mx, 650, mw, mh, { light: haze(C.rock1, 0.22), dark: haze(C.rock3, 0.3), seed: sd, peakRound: 0.07 });
  }
  // the valley floor
  body += path(ridge([[-20, 640], [200, 630], [420, 642], [640, 628], [860, 642], [1020, 632]], 1000), { fill: `url(#${id('ground')})` });
  body += ellipse(400, 620, 620, 210, { fill: `url(#${id('goldAir')})` });

  // ---- the long late-afternoon shadow of the House, falling to the right
  body += path(`M${F[0]},${F[1]} L${RB[0]},${RB[1]} L${RB[0] + 190},${RB[1] + 34} L${F[0] + 170},${F[1] + 50}Z`, { fill: C.ink, opacity: 0.12 });

  body += path(`M${L[0] - 10},${L[1] + 2} L${F[0]},${F[1] + 6} L${RB[0] + 12},${RB[1] + 2} L${RB[0]},${RB[1] + 12} L${F[0]},${F[1] + 16} L${L[0]},${L[1] + 10}Z`, { fill: C.ink, opacity: 0.16 });
  // ---- the House: stone courses on two faces, about two-thirds built
  const lit = ['#F0D3A2', '#EACA94', '#E3BE86', '#EDCD9A', '#E6C38C', '#F2D8AC'];
  const dim = ['#C9A27A', '#C29A72', '#BB936B', '#C69E76', '#B88E66'];
  const rows = [0.1, 0.085, 0.095, 0.08, 0.1, 0.09, 0.085, 0.08];
  // left face: the last rows are laid only part of the way along
  body += wall(faceL, { seed: 3, colors: lit, mortar: '#C9A06C', hi: '#FFF2D4', rows, limit: (r, u) => r < 7 || u < 0.5 });
  body += wall(faceR, { seed: 8, colors: dim, mortar: '#9C7756', hi: '#E2C29A', rows, limit: (r, u) => r < 7 || u < 0.34 });
  // a soft deepening of the shade across the right face
  const vTop = rows.slice(0, 7).reduce((a, b) => a + b, 0);
  body += path(`M${faceR(0, 0).map(r1)} L${faceR(1, 0).map(r1)} L${faceR(1, vTop).map(r1)} L${faceR(0, vTop).map(r1)}Z`, { fill: `url(#${id('shadeFace')})` });
  // the sunlit far edge of the left face
  body += path(`M${L[0] + 1},${L[1] - 4} L${faceL(1, vTop - 0.01).map(r1)}`, { stroke: '#FFF2D4', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 });
  // the corner edge catches the light
  body += path(`M${F[0]},${F[1] - 4} L${faceL(0, vTop - 0.01).map(r1)}`, { stroke: '#FFF2D4', 'stroke-width': 3, opacity: 0.55 });
  // the Black Stone set into the corner, low down
  const bs = faceL(0, 0.15);
  body += circle(bs[0], bs[1], 80, { fill: `url(#${id('blessing')})` });
  body += path(blob([[bs[0] - 24, bs[1] + 4], [bs[0] - 20, bs[1] - 22], [bs[0] + 2, bs[1] - 30], [bs[0] + 22, bs[1] - 18], [bs[0] + 24, bs[1] + 8], [bs[0] + 4, bs[1] + 28], [bs[0] - 16, bs[1] + 22]], 0.8), { fill: '#A88358' });
  body += path(blob([[bs[0] - 19, bs[1] + 3], [bs[0] - 16, bs[1] - 18], [bs[0] + 2, bs[1] - 25], [bs[0] + 18, bs[1] - 14], [bs[0] + 19, bs[1] + 6], [bs[0] + 3, bs[1] + 23], [bs[0] - 13, bs[1] + 18]], 0.8), { fill: '#2C2632' });
  body += path(blob([[bs[0] - 13, bs[1] - 4], [bs[0] - 10, bs[1] - 16], [bs[0] + 1, bs[1] - 20], [bs[0] + 4, bs[1] - 10], [bs[0] - 4, bs[1] - 2]], 0.8), { fill: '#4F4760', opacity: 0.9 });
  body += circle(bs[0] - 8, bs[1] - 13, 2.6, { fill: '#C9C0D8', opacity: 0.85 });
  // a few stones resting on the top, ready to be laid
  const onL = faceL(0.64, vTop);
  const onR = faceR(0.48, vTop);
  body += looseStone(onL[0], onL[1] + 2, 46, 28, '#EACA94', '#C29A72', '#FFF0CF', 2);
  body += looseStone(onR[0], onR[1] + 2, 42, 26, '#C9A27A', '#9C7756', '#E2C29A', 5);
  for (const [sx, sy, ss] of [[faceL(0.3, vTop + 0.1)[0], faceL(0.3, vTop + 0.1)[1], 12], [faceR(0.4, vTop + 0.08)[0], faceR(0.4, vTop + 0.08)[1], 9], [520, 330, 8]]) body += sparkle(sx, sy, ss, '#FFF6DC', { opacity: 0.9 });

  // ---- the stone step, the stone pile and the basket
  body += maqam(360, 904);
  const pile = [[650, 900, 62, 38], [712, 906, 66, 40], [772, 898, 58, 36], [680, 874, 56, 34], [742, 872, 54, 32], [712, 848, 48, 30], [812, 914, 50, 30]];
  pile.forEach(([px, py, pw, ph], i) => { body += looseStone(px, py, pw, ph, R.pick(lit), '#B98E5E', '#FFF0CF', 30 + i); });
  body += basket(600, 948);

  // ---- birds: two pigeons on the ground, two doves in the air
  body += pigeon(236, 930, { s: 0.85, peck: true });
  body += pigeon(470, 950, { s: 0.8, flip: true });
  for (const [bx, by, sc, fl] of [[300, 250, 0.72, false], [580, 210, 0.62, true]]) {
    body += g({ transform: T(bx, by, sc, 0, fl) },
      path('M-32,-2 L-58,-12 Q-62,0 -58,10Z', { fill: '#D9DDEA' }),
      path('M4,-4 C0,-34 -14,-60 -40,-74 Q-42,-62 -52,-60 Q-48,-48 -58,-42 Q-50,-32 -56,-24 C-40,-14 -16,-6 4,-4Z', { fill: '#C6CCE0', transform: 'translate(-8 -4) rotate(-24)' }),
      ellipse(0, 0, 34, 15, { fill: C.white }),
      circle(30, -8, 13, { fill: C.white }),
      path('M41,-10 L54,-6 L41,-2Z', { fill: '#E8A0A8' }),
      eye(34, -10, 3),
      ellipse(35, -2, 3.6, 2.2, { fill: C.cheek, opacity: 0.6 }),
      path('M4,-4 C0,-34 -14,-60 -40,-74 Q-42,-62 -52,-60 Q-48,-48 -58,-42 Q-50,-32 -56,-24 C-40,-14 -16,-6 4,-4Z', { fill: '#EEF1F8' }),
    );
  }

  // ---- foreground framing: rocks and dry tufts at the corners
  body += looseStone(60, 1006, 190, 110, '#C98E6E', '#A4614F', '#F0C6AE', 71);
  body += looseStone(950, 1008, 200, 120, '#C98E6E', '#A4614F', '#F0C6AE', 72);
  for (const [gx, gy, gh, sd] of [[170, 992, 50, 1], [860, 996, 54, 2], [120, 900, 36, 3], [900, 880, 34, 4]]) body += grass(gx, gy, { h: gh, fill: C.sand4, n: 5, seed: sd });
  // a little desert shrub with tiny flowers on each side
  for (const [bx, by, sc] of [[150, 868, 1], [880, 852, 0.9]]) {
    body += ellipse(bx, by + 2, 34 * sc, 6, { fill: C.ink, opacity: 0.14 });
    body += circle(bx - 14 * sc, by - 12 * sc, 16 * sc, { fill: mix(C.leaf3, C.sand3, 0.35) }) + circle(bx + 12 * sc, by - 10 * sc, 14 * sc, { fill: mix(C.leaf4, C.sand4, 0.35) }) + circle(bx, by - 22 * sc, 17 * sc, { fill: mix(C.leaf2, C.sand2, 0.3) });
    for (const [fx, fy] of [[-14, -20], [6, -30], [14, -14], [-2, -10]]) body += circle(bx + fx * sc, by + fy * sc, 3.2, { fill: C.rose1 });
  }

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
