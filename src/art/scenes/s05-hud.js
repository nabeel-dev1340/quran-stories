// Hud and the Mighty Wind (Quran 7:65-72, 26:128-134, 46:24-25, 69:6-8, 89:6-8).
// Iram of the lofty pillars: very tall carved stone pillars and proud towers
// in a red-gold desert. A huge stylised wind - a dusty-purple cloud rolling
// in from the horizon, with spirals and streaks of sand - sweeps toward the
// city. On a calm hill to the left, a few small tents rest in peaceful
// golden light, kept safe. Dramatic but not frightening; no people.
import {
  C, svgDoc, ids, rng, mix, clamp, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g,
  ridge, smooth, blob, sparkle, palm, rays, eye, T, r1,
} from '../lib.js';

// ---------------------------------------------------------------- helpers
function spiral(cx, cy, r, { turns = 1.6, rot = 0, dir = 1 } = {}) {
  const pts = [];
  const n = Math.round(turns * 18);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = rot + dir * t * turns * Math.PI * 2;
    const rr = r * (0.12 + 0.88 * t);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smooth(pts);
}
// A tapered streak along a smooth curve (thick in the middle, thin at the ends).
function streak(points, width, fill, op = 1) {
  const n = 24;
  const sm = [];
  // sample the polyline with Catmull-Rom for a smooth centre line
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      sm.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  sm.push(points[points.length - 1]);
  const L = [];
  const Rr = [];
  for (let i = 0; i < sm.length; i++) {
    const a = sm[Math.max(0, i - 1)];
    const b = sm[Math.min(sm.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const t = i / (sm.length - 1);
    const w = (width / 2) * Math.sin(Math.PI * t) ** 0.8;
    L.push([sm[i][0] - (dy / len) * w, sm[i][1] + (dx / len) * w]);
    Rr.push([sm[i][0] + (dy / len) * w, sm[i][1] - (dx / len) * w]);
  }
  const d = 'M' + L.map((p) => p.map(r1).join(',')).join(' L') + ' L' + Rr.reverse().map((p) => p.map(r1).join(',')).join(' L') + 'Z';
  return path(d, { fill, opacity: op });
}

// Bedouin tent with stripes that follow its sloping sides. (x, y) = bottom centre.
function tent(x, y, { w = 140, h = 80, fill = C.coral1, dark = C.coral2, stripe = C.cream, inside = '#6B4234', lamp = C.gold1 } = {}) {
  const top = y - h;
  const sx = w * 0.36; // where the roof meets the sides
  const sy = top + h * 0.22;
  const sideX = (yy, sg) => x + sg * (sx + (w / 2 - sx) * ((yy - sy) / (y - sy)));
  let out = ellipse(x, y + 2, w * 0.56, 8, { fill: C.ink, opacity: 0.14 });
  out += path(`M${r1(x - w / 2)},${y} L${r1(x - sx)},${r1(sy)} Q${r1(x - w * 0.18)},${r1(top - h * 0.04)} ${x},${r1(top + h * 0.06)} Q${r1(x + w * 0.18)},${r1(top - h * 0.04)} ${r1(x + sx)},${r1(sy)} L${r1(x + w / 2)},${y}Z`, { fill });
  out += path(`M${r1(x + w * 0.06)},${r1(top + h * 0.07)} Q${r1(x + w * 0.2)},${r1(top - h * 0.03)} ${r1(x + sx)},${r1(sy)} L${r1(x + w / 2)},${y} L${r1(x + w * 0.14)},${y}Z`, { fill: dark, opacity: 0.6 });
  for (const t of [0.5, 0.72]) {
    const yy = top + h * t;
    out += path(`M${r1(sideX(yy, -1) + 2)},${r1(yy)} L${r1(sideX(yy, 1) - 2)},${r1(yy)}`, { stroke: stripe, 'stroke-width': r1(h * 0.06), opacity: 0.6 });
  }
  // open doorway with a warm lamp inside
  out += path(`M${r1(x - w * 0.12)},${y} L${r1(x - w * 0.04)},${r1(top + h * 0.4)} L${r1(x + w * 0.06)},${r1(top + h * 0.4)} L${r1(x + w * 0.14)},${y}Z`, { fill: inside });
  out += ellipse(x + w * 0.01, y - h * 0.18, w * 0.05, h * 0.09, { fill: lamp, opacity: 0.9 });
  out += circle(x, top + h * 0.02, 3.5, { fill: C.wood3 });
  return out;
}

// A camel resting with folded legs, facing right unless flipped.
function restingCamel(x, y, { s = 1, flip = false, body = C.sand3, dark = C.sand4, light = C.sand2, sleepy = false } = {}) {
  return g({ transform: T(x, y, s, 0, flip) },
    ellipse(0, 2, 120, 12, { fill: C.ink, opacity: 0.16 }),
    path('M-100,-50 Q-118,-34 -108,-14', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }),
    path('M-104,-24 C-112,-52 -96,-76 -66,-82 C-52,-124 -2,-136 20,-98 C30,-84 50,-80 70,-76 C92,-70 100,-50 98,-28 C96,-8 84,-2 64,-2 L-84,-2 C-98,-2 -104,-12 -104,-24Z', { fill: body }),
    path('M-66,-82 C-52,-124 -2,-136 20,-98 C-4,-118 -44,-114 -66,-82Z', { fill: light, opacity: 0.75 }),
    path('M-98,-12 C-100,-44 -62,-56 -42,-32 C-34,-18 -40,-4 -54,-2 L-84,-2 C-94,-2 -98,-6 -98,-12Z', { fill: dark, opacity: 0.3 }),
    path('M-90,-14 C-60,-4 40,-4 92,-16 C86,-6 76,-2 64,-2 L-84,-2 C-88,-2 -90,-8 -90,-14Z', { fill: dark, opacity: 0.45 }),
    ellipse(50, -9, 40, 11, { fill: body }),
    ellipse(80, -11, 13, 8, { fill: light }),
    path('M60,-72 C90,-86 108,-112 112,-146 L138,-146 C140,-104 116,-58 80,-40Z', { fill: body }),
    path('M112,-146 L138,-146 C139,-118 130,-92 114,-74 C124,-98 124,-124 112,-146Z', { fill: light, opacity: 0.45 }),
    g({ transform: 'translate(12 16)' },
      path('M92,-174 C96,-190 120,-196 138,-188 C156,-182 170,-174 170,-160 C170,-148 160,-144 148,-146 C134,-148 124,-144 116,-142 C100,-142 88,-156 92,-174Z', { fill: body }),
      ellipse(106, -190, 7, 11, { fill: dark, transform: 'rotate(-30 106 -190)' }),
      ellipse(160, -154, 4, 3, { fill: dark }),
      path('M150,-146 Q158,-142 166,-146', { fill: 'none', stroke: dark, 'stroke-width': 3, 'stroke-linecap': 'round' }),
      eye(128, -172, 5, sleepy),
      ellipse(138, -158, 7, 4, { fill: C.cheek, opacity: 0.6 }),
    ),
  );
}

// A very tall carved stone pillar. (x, y) = bottom centre.
function pillar(x, y, h, w, { lit = C.rock0, mid = C.rock1, shade = C.rock2, deep = C.rock3, carve = C.sand1 } = {}) {
  let out = '';
  const top = y - h;
  // stepped base
  out += rect(x - w * 0.85, y - 18, w * 1.7, 18, { fill: mid });
  out += rect(x - w * 0.7, y - 34, w * 1.4, 18, { fill: lit });
  out += rect(x + w * 0.1, y - 34, w * 0.6, 34, { fill: shade, opacity: 0.55 });
  // shaft, gently tapered, lit from the left
  const sb = w / 2;
  const st = w * 0.42;
  out += path(`M${r1(x - sb)},${y - 34} L${r1(x - st)},${r1(top + 40)} L${r1(x + st)},${r1(top + 40)} L${r1(x + sb)},${y - 34}Z`, { fill: mid });
  out += path(`M${r1(x - sb)},${y - 34} L${r1(x - st)},${r1(top + 40)} L${r1(x - st * 0.3)},${r1(top + 40)} L${r1(x - sb * 0.3)},${y - 34}Z`, { fill: lit });
  out += path(`M${r1(x + sb * 0.35)},${y - 34} L${r1(x + st * 0.35)},${r1(top + 40)} L${r1(x + st)},${r1(top + 40)} L${r1(x + sb)},${y - 34}Z`, { fill: shade });
  // flutes
  for (const f of [-0.62, -0.05, 0.6]) out += path(`M${r1(x + f * sb)},${y - 40} L${r1(x + f * st)},${r1(top + 46)}`, { stroke: deep, 'stroke-width': 1.8, opacity: 0.35 });
  // carved bands with little diamonds
  const bands = Math.max(2, Math.round(h / 130));
  for (let b = 1; b <= bands; b++) {
    const by = y - 34 - ((h - 74) * b) / (bands + 1);
    const bw = lerpW(sb, st, (y - 34 - by) / (h - 74));
    out += rect(x - bw - 2, by - 7, bw * 2 + 4, 14, { fill: carve, opacity: 0.9 });
    out += rect(x + bw * 0.35, by - 7, bw * 0.65 + 2, 14, { fill: shade, opacity: 0.45 });
    for (let k = -2; k <= 2; k++) out += path(`M${r1(x + k * bw * 0.4)},${r1(by - 4.5)} l4,4.5 l-4,4.5 l-4,-4.5Z`, { fill: deep, opacity: 0.55 });
  }
  // capital: a broad carved block with rolled ends
  out += rect(x - w * 0.6, top + 30, w * 1.2, 12, { fill: mid });
  out += rect(x - w * 0.78, top + 14, w * 1.56, 18, { fill: lit });
  for (let k = 0; k < 5; k++) out += path(`M${r1(x - w * 0.62 + k * w * 0.31)},${r1(top + 29)} l${r1(w * 0.155)},-11 l${r1(w * 0.155)},11Z`, { fill: deep, opacity: 0.4 });
  out += rect(x - w * 0.95, top, w * 1.9, 16, { fill: lit, rx: 3 });
  out += rect(x - w * 0.95, top + 12, w * 1.9, 4, { fill: carve, opacity: 0.8 });
  out += rect(x + w * 0.22, top, w * 0.73, 42, { fill: shade, opacity: 0.5 });
  out += path(`M${r1(x - w * 0.6)},${top} L${r1(x - w * 0.6)},${top - 10} L${r1(x - w * 0.3)},${top - 10} L${r1(x - w * 0.3)},${top - 18} L${r1(x + w * 0.3)},${top - 18} L${r1(x + w * 0.3)},${top - 10} L${r1(x + w * 0.6)},${top - 10} L${r1(x + w * 0.6)},${top}Z`, { fill: carve });
  out += path(`M${r1(x + w * 0.1)},${top} L${r1(x + w * 0.1)},${top - 18} L${r1(x + w * 0.3)},${top - 18} L${r1(x + w * 0.3)},${top - 10} L${r1(x + w * 0.6)},${top - 10} L${r1(x + w * 0.6)},${top}Z`, { fill: shade, opacity: 0.45 });
  return out;
}
const lerpW = (a, b, t) => a + (b - a) * clamp(t, 0, 1);

// A tall proud tower with carved windows and a crenellated top. (x, y) = bottom centre.
function tower(x, y, w, h, { lit = C.sand2, shade = C.sand4, dark = C.rock3, trim = C.sand1, seed = 1 } = {}) {
  const R = rng(seed);
  let out = rect(x - w / 2, y - h, w, h, { fill: lit });
  out += rect(x + w * 0.1, y - h, w * 0.4, h, { fill: shade, opacity: 0.6 });
  // crenellations
  const n = Math.max(3, Math.round(w / 26));
  for (let i = 0; i < n; i++) {
    const cw = w / n;
    out += path(`M${r1(x - w / 2 + i * cw + cw * 0.18)},${r1(y - h)} l0,-14 l${r1(cw * 0.22)},-8 l${r1(cw * 0.22)},8 l0,14Z`, { fill: i >= n / 2 + 0.5 ? mix(lit, shade, 0.6) : lit });
  }
  out += rect(x - w / 2 - 4, y - h - 2, w + 8, 8, { fill: trim, rx: 3 });
  // rows of tall arched windows
  const rows = Math.max(2, Math.round(h / 90));
  for (let r = 0; r < rows; r++) {
    const wy = y - h + 34 + r * ((h - 70) / rows);
    const cols = Math.max(1, Math.round(w / 46));
    for (let c = 0; c < cols; c++) {
      const wx = x - w / 2 + (w / cols) * (c + 0.5);
      out += path(`M${r1(wx - 6)},${r1(wy + 30)} L${r1(wx - 6)},${r1(wy + 8)} Q${r1(wx)},${r1(wy - 2)} ${r1(wx + 6)},${r1(wy + 8)} L${r1(wx + 6)},${r1(wy + 30)}Z`, { fill: dark, opacity: 0.75 + R() * 0.1 });
    }
    out += rect(x - w / 2, wy + 36, w, 6, { fill: trim, opacity: 0.6 });
  }
  return out;
}

// ---------------------------------------------------------------- the scene
export default function render() {
  const id = ids('s05');
  const R = rng(505);
  const defs = [
    linear(id('sky'), [[0, '#F7CF94'], [0.3, '#F0B98C'], [0.55, '#DA9C8C'], [0.8, '#BC93A6'], [1, '#A68CB3']], { x1: 0, y1: 300, x2: 1000, y2: 0, units: 'userSpaceOnUse' }),
    radial(id('horizon'), [[0, '#FFE2B0', 0.85], [1, '#FFE2B0', 0]]),
    glowDef(id('safe'), '#FFF0C2', 0.85),
    glowDef(id('lamp'), '#FFE08A', 0.8),
    linear(id('cloud'), [[0, '#6E5889'], [0.5, '#584574'], [1, '#463862']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    linear(id('desert'), [[0, '#F2C98A'], [0.45, '#E5A86E'], [1, '#B97A64']], { x1: 0, y1: 0, x2: 1000, y2: 0, units: 'userSpaceOnUse' }),
    linear(id('nearDune'), [[0, '#E7AF72'], [0.5, '#D4925F'], [1, '#9E6A63']], { x1: 0, y1: 0, x2: 1000, y2: 0, units: 'userSpaceOnUse' }),
    vignetteDef(id('vig'), C.ink, 0.22),
  ].join('');

  let body = '';
  // ------------------------------------------------------------ sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += ellipse(300, 640, 520, 200, { fill: `url(#${id('horizon')})` });
  body += glow(170, 120, 300, id('safe'));
  body += circle(170, 120, 46, { fill: '#FFF0C8', opacity: 0.9 }) + circle(162, 112, 32, { fill: '#FFF8E4', opacity: 0.7 });

  // ------------------------------------------------------------ the rolling wind-cloud
  const edge = [[470, 660], [500, 560], [548, 470], [612, 384], [690, 306], [780, 238], [880, 182], [990, 140], [1080, 120]];
  const billows = [];
  edge.forEach(([ex, ey], i) => {
    const rr = 62 + i * 8 + R.range(-6, 6);
    billows.push([ex + rr * 0.6, ey + rr * 0.35, rr]);
    if (i < edge.length - 1) {
      const [nx, ny] = edge[i + 1];
      billows.push([(ex + nx) / 2 + rr * 0.7, (ey + ny) / 2 + rr * 0.5, rr * 0.85]);
    }
  });
  const fillIn = 'M520,670 L560,480 L700,330 L900,200 L1060,160 L1060,670Z';
  body += g({ fill: '#3F3258', opacity: 0.6 }, billows.map(([a, b, c]) => circle(a + 16, b + 20, c)));
  body += g({ fill: `url(#${id('cloud')})` }, billows.map(([a, b, c]) => circle(a, b, c)), path(fillIn));
  // inner billows for a rolling look
  for (const [bx, by, br] of [[640, 520, 70], [760, 420, 80], [880, 330, 84], [980, 260, 76], [720, 600, 60], [860, 520, 74], [980, 450, 70], [940, 620, 64]]) {
    body += circle(bx + 8, by + 10, br, { fill: '#433660', opacity: 0.45 }) + circle(bx, by, br, { fill: '#5E4B7B', opacity: 0.9 });
  }
  // sunlit rims on the upper-left of each billow
  for (const [bx, by, br] of billows) {
    body += path(`M${r1(bx - br * 0.92)},${r1(by + br * 0.05)} A${r1(br * 0.94)},${r1(br * 0.94)} 0 0 1 ${r1(bx + br * 0.18)},${r1(by - br * 0.92)}`, { fill: 'none', stroke: '#B79BC0', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.6 });
  }
  for (const [sx, sy, sr, rot] of [[600, 470, 40, 0.4], [700, 360, 50, 1.2], [830, 270, 58, 2.1], [960, 210, 48, 1.6], [780, 470, 56, 2.6], [930, 380, 62, 0.8], [660, 600, 38, 3.0], [880, 560, 46, 1.9]]) {
    body += path(spiral(sx, sy, sr, { turns: 1.75, rot, dir: -1 }), { fill: 'none', stroke: '#A894C8', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 });
  }

  // ------------------------------------------------------------ far desert and the calm hill
  body += path(ridge([[-20, 640], [160, 620], [360, 634], [560, 618], [760, 636], [1020, 626]], 1000), { fill: `url(#${id('desert')})` });
  // soft golden light on the hill where the tents are safe
  body += rays(140, -40, { n: 6, len: 760, spread: 26, dir: 82, width: 4, color: '#FFF3D2', op: 0.16 });
  body += glow(200, 560, 300, id('safe'));
  body += path(ridge([[-20, 600], [80, 566], [200, 552], [320, 572], [430, 640], [520, 704], [640, 772]], 1000), { fill: '#EBB97F' });
  body += path(ridge([[-20, 620], [90, 592], [200, 584], [300, 600], [420, 660], [510, 724], [630, 790]], 1000), { fill: '#E2A774', opacity: 0.6 });

  // ------------------------------------------------------------ the city of Iram
  const cityTint = (c, k = 0.18) => mix(c, '#8E6A92', k);
  // back towers
  body += tower(640, 652, 90, 300, { lit: cityTint(C.sand2, 0.35), shade: cityTint(C.sand4, 0.35), dark: cityTint(C.rock3, 0.3), trim: cityTint(C.sand1, 0.35), seed: 2 });
  body += tower(770, 650, 110, 360, { lit: cityTint(C.rock0, 0.32), shade: cityTint(C.rock2, 0.32), dark: cityTint(C.rock4, 0.3), trim: cityTint(C.sand1, 0.32), seed: 3 });
  body += tower(900, 652, 96, 280, { lit: cityTint(C.sand2, 0.38), shade: cityTint(C.sand4, 0.38), dark: cityTint(C.rock3, 0.3), trim: cityTint(C.sand1, 0.35), seed: 4 });
  // city wall
  body += rect(470, 600, 560, 56, { fill: cityTint(C.sand3, 0.2) });
  body += rect(470, 594, 560, 10, { fill: cityTint(C.sand1, 0.2) });
  for (let x = 480; x < 1020; x += 30) body += rect(x, 582, 14, 14, { fill: cityTint(C.sand3, 0.2) });
  body += path('M700,656 L700,624 Q716,604 732,624 L732,656Z', { fill: cityTint(C.rock3, 0.2) });
  body += rect(850, 600, 180, 56, { fill: '#5E4A72', opacity: 0.25 });
  // the lofty pillars
  const pal = { lit: '#F6D3B0', mid: '#E4AA82', shade: '#B97C6E', deep: '#8A5552', carve: '#FBE3C2' };
  for (const [px, ph, pw] of [[505, 330, 34], [570, 430, 40], [690, 480, 44], [612, 380, 36], [820, 440, 42], [745, 360, 38], [900, 380, 38]]) {
    body += pillar(px, 668, ph, pw, pal);
  }
  // shadows of the coming wind on the right side of the city
  body += path('M840,690 L1020,690 L1020,520 Q940,560 840,690Z', { fill: '#5E4A72', opacity: 0.18 });

  // ------------------------------------------------------------ streaks of sand sweeping toward the city
  body += streak([[1040, 470], [900, 430], [760, 400], [620, 420], [520, 470]], 22, '#E7B07A', 0.75);
  body += streak([[1040, 560], [920, 520], [800, 500], [700, 520], [630, 560]], 18, '#F1C48D', 0.7);
  body += streak([[1030, 330], [930, 300], [820, 290], [720, 310]], 14, '#E2A07C', 0.6);
  body += streak([[1040, 640], [960, 610], [880, 600], [820, 616]], 14, '#F0C08A', 0.65);
  body += streak([[1040, 720], [930, 690], [820, 690], [730, 712], [680, 744]], 18, '#DFA275', 0.7);
  body += path(spiral(520, 456, 22, { turns: 1.4, rot: 3.6, dir: 1 }), { fill: 'none', stroke: '#E7B07A', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 });
  body += path(spiral(668, 740, 20, { turns: 1.4, rot: 3.4, dir: 1 }), { fill: 'none', stroke: '#DFA275', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 });
  for (let i = 0; i < 46; i++) {
    const x = 560 + R() * 460;
    const y = 280 + R() * 480;
    body += circle(x, y, R.range(1.4, 3.6), { fill: R() < 0.5 ? '#F6D1A0' : '#E8B184', opacity: r1(R.range(0.4, 0.85) * 100) / 100 });
  }

  // ------------------------------------------------------------ the tents kept safe
  body += palm(52, 600, { h: 240, seed: 3, lean: 0.1, dateColor: C.gold3 });
  body += tent(140, 586, { w: 132, h: 80, fill: '#F0E2CC', dark: '#D9C2A6', stripe: C.coral2 });
  body += tent(262, 566, { w: 150, h: 92, fill: C.coral1, dark: C.coral2, stripe: C.cream });
  body += tent(368, 610, { w: 116, h: 70, fill: '#F3D9A8', dark: '#DDB884', stripe: C.coral2 });
  body += glow(268, 556, 40, id('lamp')) + glow(146, 572, 32, id('lamp')) + glow(370, 598, 30, id('lamp'));
  body += restingCamel(200, 672, { s: 0.6, body: C.sand3, dark: C.sand4, light: C.sand2 });
  for (const [sx, sy, sz] of [[210, 470, 12], [330, 500, 9], [90, 500, 8], [400, 540, 7], [260, 430, 7]]) body += sparkle(sx, sy, sz, '#FFF6DC', { opacity: 0.95 });

  // ------------------------------------------------------------ foreground dunes
  body += path(ridge([[-20, 790], [160, 760], [380, 786], [600, 752], [820, 780], [1020, 760]], 1000), { fill: `url(#${id('nearDune')})` });
  // a big near dune with a sunny face and a shady face
  body += path(ridge([[-20, 880], [140, 846], [300, 830], [470, 858], [640, 900], [800, 880], [1020, 852]], 1000), { fill: '#EDBD80' });
  body += path('M300,830 C360,846 420,862 470,858 C560,880 600,904 640,900 C720,890 760,884 800,880 C900,868 960,858 1020,852 L1020,1000 L300,1000 C340,940 330,880 300,830Z', { fill: '#D8995F', opacity: 0.55 });
  body += path(smooth([[-20, 880], [140, 846], [300, 830], [470, 858]]), { fill: 'none', stroke: '#FBE1B4', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 });
  // low drifts of sand blowing in from the right, stopping well short of the tents' hill
  body += streak([[1040, 800], [940, 776], [840, 778], [760, 800]], 12, '#F3CB95', 0.7);
  body += streak([[1040, 846], [960, 830], [880, 836], [820, 856]], 10, '#F3CB95', 0.6);
  body += path(spiral(764, 796, 14, { turns: 1.3, rot: 3.4, dir: 1 }), { fill: 'none', stroke: '#F3CB95', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.75 });
  // ripples in the sand
  for (let i = 0; i < 16; i++) {
    const x = R() * 1000;
    const y = 870 + R() * 120;
    const w = 50 + R() * 70;
    body += path(`M${r1(x)},${r1(y)} q${r1(w / 2)},-7 ${r1(w)},0`, { fill: 'none', stroke: '#F9DDB0', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.45 });
  }
  // a trail of footprints leading up the hill to the tents (the believers came here safely)
  {
    const trail = [[560, 990], [520, 940], [470, 890], [420, 846], [380, 800], [350, 760], [330, 720], [316, 690]];
    for (let i = 0; i < trail.length - 1; i++) {
      const [ax, ay] = trail[i];
      const [bx, by] = trail[i + 1];
      for (const t of [0.25, 0.75]) {
        const x = ax + (bx - ax) * t;
        const y = ay + (by - ay) * t;
        const side = t < 0.5 ? -1 : 1;
        const sc = 0.5 + 0.5 * (y - 680) / 310;
        body += ellipse(x + side * 7 * sc, y, 5 * sc, 8.5 * sc, { fill: '#B97C55', opacity: 0.45, transform: `rotate(${r1(Math.atan2(by - ay, bx - ax) * 57.3 + 90)} ${r1(x + side * 7 * sc)} ${r1(y)})` });
      }
    }
  }
  // desert shrubs framing the lower left, pebbles on the right
  for (const [bx, by, bw] of [[40, 1004, 120], [130, 1006, 80]]) {
    body += g({ fill: '#8C8F5E' }, circle(bx - bw * 0.25, by - bw * 0.2, bw * 0.24), circle(bx, by - bw * 0.32, bw * 0.3), circle(bx + bw * 0.27, by - bw * 0.18, bw * 0.22));
    body += g({ fill: '#A7A86E' }, circle(bx - bw * 0.3, by - bw * 0.28, bw * 0.16), circle(bx - bw * 0.04, by - bw * 0.42, bw * 0.17));
  }
  for (const [px, py, pw] of [[880, 960, 46], [930, 976, 30], [820, 984, 24]]) body += ellipse(px, py, pw / 2, pw * 0.32, { fill: '#9E6A63' }) + ellipse(px - pw * 0.12, py - pw * 0.1, pw * 0.22, pw * 0.1, { fill: '#D7A487', opacity: 0.8 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
