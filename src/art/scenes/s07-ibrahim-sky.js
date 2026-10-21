// Ibrahim looks at the sky (Quran 6:75-79).
// One wide desert sky that turns, left to right, from deep night with one
// bright star, through a big glowing moon, to a golden sunrise over the
// dunes. They all set; Allah never sets. No people: Ibrahim's presence is
// shown by a small tent with a warm lamp, a lone palm and his sleeping sheep.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth,
  sparkle, palm, farBird, rays, eye, grass, lerp, r1, T,
} from '../lib.js';

// Dense points along the same Catmull-Rom curve that smooth() draws.
function sampleCurve(points, per = 14) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const u = 1 - t;
      out.push([
        u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0],
        u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1],
      ]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

// A dune band: gradient body, a soft darkening toward its foot, the slope
// facing away from the sunrise (left) in shadow, and a rim of light along
// each crest (the rim gradient fades it out on the night side).
function duneBand(points, { fill, depthId, shade = C.ink, shadeOp = 0.22, rim, rimOp = 0.5, depth = 60, bottom = 1000 } = {}) {
  const band = ridge(points, bottom);
  let s = path(band, { fill });
  if (depthId) s += path(band, { fill: `url(#${depthId})` });
  const per = 14;
  const pts = sampleCurve(points, per);
  for (let i = 1; i < points.length; i++) {
    const crest = points[i];
    const trough = points[i - 1];
    if (crest[1] >= trough[1]) continue; // only slopes that rise to the right
    const seg = pts.slice((i - 1) * per, i * per + 1);
    const d0 = 'M' + seg.map((p) => p.map(r1).join(',')).join(' L');
    const ctl = [lerp(trough[0], crest[0], 0.62), lerp(trough[1], crest[1], 0.45) + depth];
    const back = ` Q${r1(ctl[0])},${r1(ctl[1])} ${r1(trough[0])},${r1(trough[1])}Z`;
    s += path(d0 + back, { fill: shade, opacity: shadeOp });
  }
  if (rim) s += path(smooth(points), { fill: 'none', stroke: rim, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: rimOp });
  return s;
}

// A sheep lying down asleep, legs tucked in (faces right).
function sleepySheep(x, y, { s = 1, flip = false, wool = '#F3EFF8', woolShade = '#C8C0DC', face = '#6E5F7C', seed = 1 } = {}) {
  const R = rng(seed);
  const parts = [];
  parts.push(ellipse(4, 1, 74, 10, { fill: C.ink, opacity: 0.22 }));
  // tucked hooves peeking out
  parts.push(ellipse(-30, -3, 11, 6, { fill: mix(face, C.ink, 0.3) }), ellipse(24, -2, 11, 6, { fill: mix(face, C.ink, 0.3) }));
  const puffs = [];
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * 0.95 + (Math.PI * 1.1 * i) / 8;
    puffs.push([Math.cos(a) * 50, -32 + Math.sin(a) * 24, 19 + R.range(-2, 3)]);
  }
  parts.push(g({ fill: woolShade }, puffs.map(([a, b, c]) => circle(a + 3, b + 4, c)), ellipse(2, -24, 60, 24)));
  parts.push(g({ fill: wool }, puffs.map(([a, b, c]) => circle(a, b, c)), ellipse(-2, -28, 56, 23)));
  // a soft moonlit highlight on the back
  parts.push(ellipse(-14, -50, 22, 8, { fill: C.white, opacity: 0.5 }));
  // head resting forward on the sand
  parts.push(ellipse(58, -22, 21, 17, { fill: face, transform: 'rotate(8 58 -22)' }));
  parts.push(ellipse(42, -36, 12, 5.5, { fill: mix(face, C.ink, 0.25), transform: 'rotate(28 42 -36)' }));
  parts.push(g({ fill: wool }, circle(50, -40, 9), circle(61, -42, 8), circle(70, -37, 6)));
  parts.push(eye(63, -24, 4.4, true));
  parts.push(ellipse(70, -15, 5, 2.8, { fill: C.cheek, opacity: 0.6 }));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// A small Bedouin tent lit from the right by the dawn, a lamp glowing in
// its open doorway. (x, y) = bottom centre.
function nightTent(x, y, w, h, { fill = '#A06B8A', shade = '#6A4A74', stripe = '#F6D8C2', lampId, clipId } = {}) {
  const top = y - h;
  const outline = `M${r1(x - w / 2)},${r1(y)} L${r1(x - w * 0.4)},${r1(top + h * 0.2)} Q${r1(x - w * 0.22)},${r1(top - h * 0.06)} ${r1(x - w * 0.02)},${r1(top + h * 0.06)} Q${r1(x + w * 0.2)},${r1(top - h * 0.1)} ${r1(x + w * 0.4)},${r1(top + h * 0.16)} L${r1(x + w / 2)},${r1(y)}Z`;
  let s = `<clipPath id="${clipId}"><path d="${outline}"/></clipPath>`;
  s += path(outline, { fill });
  s += g({ 'clip-path': `url(#${clipId})` },
    // the half away from the sunrise in shade
    path(`M${r1(x - w * 0.6)},${r1(top - 20)} L${r1(x - w * 0.02)},${r1(top - 20)} L${r1(x - w * 0.1)},${r1(y + 5)} L${r1(x - w * 0.6)},${r1(y + 5)}Z`, { fill: shade, opacity: 0.55 }),
    rect(x - w * 0.6, top + h * 0.44, w * 1.2, h * 0.07, { fill: stripe, opacity: 0.6 }),
    rect(x - w * 0.6, top + h * 0.62, w * 1.2, h * 0.07, { fill: stripe, opacity: 0.6 }),
    // warm rim where the dawn touches the right edge
    path(`M${r1(x + w * 0.4)},${r1(top + h * 0.16)} L${r1(x + w / 2)},${r1(y)}`, { stroke: '#FFC9A8', 'stroke-width': 7, opacity: 0.55 }),
  );
  // a darker roof band with a scalloped hem
  let hem = `M${r1(x - w * 0.6)},${r1(top - 30)} L${r1(x + w * 0.6)},${r1(top - 30)} L${r1(x + w * 0.6)},${r1(top + h * 0.3)}`;
  const n = 10;
  for (let i = n; i > 0; i--) {
    const xa = x - w * 0.45 + (i / n) * w * 0.9;
    const xb = x - w * 0.45 + ((i - 1) / n) * w * 0.9;
    hem += ` L${r1(xa)},${r1(top + h * 0.26)} Q${r1((xa + xb) / 2)},${r1(top + h * 0.36)} ${r1(xb)},${r1(top + h * 0.26)}`;
  }
  hem += ` L${r1(x - w * 0.6)},${r1(top + h * 0.26)}Z`;
  s += g({ 'clip-path': `url(#${clipId})` }, path(hem, { fill: mix(shade, fill, 0.35), opacity: 0.7 }));
  // open doorway with the lamp light, and a folded-back flap
  s += circle(x + w * 0.02, y - h * 0.3, h * 0.95, { fill: `url(#${lampId})`, opacity: 0.6 });
  s += path(`M${r1(x - w * 0.11)},${r1(y)} L${r1(x - w * 0.03)},${r1(top + h * 0.34)} L${r1(x + w * 0.07)},${r1(top + h * 0.34)} L${r1(x + w * 0.15)},${r1(y)}Z`, { fill: '#FFC56E' });
  s += path(`M${r1(x - w * 0.06)},${r1(y)} L${r1(x - w * 0.01)},${r1(top + h * 0.5)} L${r1(x + w * 0.05)},${r1(top + h * 0.5)} L${r1(x + w * 0.1)},${r1(y)}Z`, { fill: '#FFEBB5' });
  s += path(`M${r1(x + w * 0.07)},${r1(top + h * 0.34)} L${r1(x + w * 0.21)},${r1(y - h * 0.08)} L${r1(x + w * 0.15)},${r1(y)}Z`, { fill: mix(fill, '#FFFFFF', 0.12) });
  // pole tips and ropes
  s += path(`M${r1(x - w * 0.02)},${r1(top + h * 0.06)} L${r1(x - w * 0.02)},${r1(top - h * 0.06)}`, { stroke: '#5A3E60', 'stroke-width': 5, 'stroke-linecap': 'round' });
  s += path(`M${r1(x - w * 0.4)},${r1(top + h * 0.2)} L${r1(x - w * 0.62)},${r1(y)} M${r1(x + w * 0.4)},${r1(top + h * 0.16)} L${r1(x + w * 0.62)},${r1(y)}`, { fill: 'none', stroke: '#CDAFC0', 'stroke-width': 2, opacity: 0.6 });
  s += circle(x - w * 0.62, y, 3, { fill: '#CDAFC0', opacity: 0.7 }) + circle(x + w * 0.62, y, 3, { fill: '#CDAFC0', opacity: 0.7 });
  return s;
}

// The big round moon with gentle soft spots.
function moon(x, y, r, glowId) {
  return (
    circle(x, y, r * 3.2, { fill: `url(#${glowId})` }) +
    circle(x, y, r * 1.14, { fill: '#FFF6DE', opacity: 0.22 }) +
    circle(x, y, r * 1.06, { fill: '#FFF6DE', opacity: 0.3 }) +
    circle(x, y, r, { fill: '#FFF2D2' }) +
    path(`M${r1(x + r * 0.2)},${r1(y - r * 0.98)} A${r1(r)},${r1(r)} 0 0 1 ${r1(x + r * 0.2)},${r1(y + r * 0.98)} A${r1(r * 1.25)},${r1(r * 1.25)} 0 0 0 ${r1(x + r * 0.2)},${r1(y - r * 0.98)}Z`, { fill: '#EED9B4', opacity: 0.55 }) +
    circle(x - r * 0.32, y - r * 0.18, r * 0.2, { fill: '#F2DFB9', opacity: 0.8 }) +
    circle(x + r * 0.22, y + r * 0.34, r * 0.15, { fill: '#F2DFB9', opacity: 0.8 }) +
    circle(x + r * 0.36, y - r * 0.36, r * 0.1, { fill: '#F2DFB9', opacity: 0.7 }) +
    circle(x - r * 0.12, y + r * 0.5, r * 0.08, { fill: '#F2DFB9', opacity: 0.7 }) +
    circle(x - r * 0.38, y - r * 0.42, r * 0.26, { fill: C.white, opacity: 0.35 })
  );
}

// The one bright star: a long four-point twinkle over a short diagonal one.
function brightStar(x, y, s, glowId) {
  return (
    circle(x, y, s * 3.6, { fill: `url(#${glowId})` }) +
    g({ transform: `rotate(45 ${r1(x)} ${r1(y)})` }, sparkle(x, y, s * 0.5, '#E6EEFF', { opacity: 0.9 })) +
    sparkle(x, y, s, C.white) +
    circle(x, y, s * 0.16, { fill: C.white })
  );
}

// A long, soft dawn cloud: a flat base with a few low bumps and a
// glowing underside.
function wisp(x, y, w, h, fill, light, op = 1, seed = 1) {
  const R = rng(seed);
  const bumps = [[-0.28, 0.55, 0.2], [-0.06, 0.9, 0.24], [0.17, 0.7, 0.2], [0.33, 0.4, 0.14]];
  return g({ opacity: op },
    g({ fill }, rect(x - w / 2, y - h, w, h, { rx: h / 2 }),
      bumps.map(([dx, dy, rr]) => ellipse(x + (dx + R.range(-0.03, 0.03)) * w, y - h * 0.5 - dy * h, rr * w, h * (0.9 + dy * 0.6)))),
    ellipse(x + w * 0.02, y - h * 0.24, w * 0.4, h * 0.22, { fill: light, opacity: 0.85 }),
  );
}

export default function render() {
  const id = ids('s07');
  const R = rng(607);
  const user = { x1: 0, y1: 0, x2: 1000, y2: 0, units: 'userSpaceOnUse' };
  const defs = [
    // the sky turns from night (left) to sunrise (right)
    linear(id('sky'), [
      [0, '#111B3A'], [0.17, '#17264C'], [0.33, '#243A6E'], [0.47, '#434B8C'],
      [0.59, '#7664A9'], [0.71, '#B488B6'], [0.83, '#EEA9A3'], [1, '#FFD8A8'],
    ], { x2: 1, y2: 0 }),
    radial(id('skyTop'), [[0, '#0A1230', 0.55], [0.6, '#0A1230', 0.2], [1, '#0A1230', 0]], { cx: 150, cy: -80, r: 950, units: 'userSpaceOnUse' }),
    radial(id('skyLav'), [[0, '#8C6CC0', 0.75], [0.55, '#A783C6', 0.35], [1, '#A783C6', 0]], { cx: 1000, cy: -40, r: 620, units: 'userSpaceOnUse' }),
    radial(id('dawn'), [[0, '#FFF1CC', 0.95], [0.22, '#FFDDA6', 0.72], [0.55, '#F7B39E', 0.3], [1, '#F7B39E', 0]]),
    radial(id('nightHaze'), [[0, '#5A74B0', 0.4], [1, '#5A74B0', 0]]),
    glowDef(id('moonGlow'), '#FFF4D8', 0.42),
    glowDef(id('starGlow'), '#CFE0FF', 0.6),
    glowDef(id('sunGlow'), '#FFE7B0', 0.85),
    glowDef(id('lamp'), '#FFD58A', 0.9),
    radial(id('rayFade'), [[0.25, '#FFF3D0', 0.4], [1, '#FFF3D0', 0]], { cx: 838, cy: 668, r: 380, units: 'userSpaceOnUse' }),
    radial(id('pool'), [[0, '#FFD58A', 0.7], [1, '#FFD58A', 0]]),
    linear(id('far'), [[0, '#36447D'], [0.45, '#7062A0'], [0.68, '#C291A8'], [0.84, '#EFB39A'], [1, '#F8CCA2']], user),
    linear(id('mid'), [[0, '#27325F'], [0.4, '#4C4D87'], [0.62, '#A07194'], [0.8, '#DC9881'], [1, '#EFB282']], user),
    linear(id('rimFar'), [[0, '#FFE4C2', 0], [0.4, '#FFE4C2', 0.05], [0.7, '#FFE4C2', 0.7], [1, '#FFF0D2', 1]], user),
    linear(id('rimMid'), [[0, '#FFD9B4', 0], [0.45, '#FFD9B4', 0.1], [0.75, '#FFD9B4', 0.8], [1, '#FFE6C4', 1]], user),
    linear(id('foot'), [[0, C.ink, 0], [1, C.ink, 0.28]]),
    linear(id('hill'), [[0, '#283364'], [0.6, '#343D72'], [1, '#544A7C']], { x1: 0, y1: 0, x2: 740, y2: 0, units: 'userSpaceOnUse' }),
    linear(id('hillTop'), [[0, '#5A6AAE', 0.35], [0.35, '#5A6AAE', 0]]),
    linear(id('near'), [[0, '#C98A7E'], [0.5, '#E3A07D'], [1, '#F2BA86']], { x1: 560, y1: 0, x2: 1000, y2: 0, units: 'userSpaceOnUse' }),
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');

  let body = '';
  // ---- sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('skyTop')})` });
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('skyLav')})` });
  body += ellipse(850, 665, 780, 480, { fill: `url(#${id('dawn')})` });
  body += ellipse(200, 650, 460, 130, { fill: `url(#${id('nightHaze')})` });

  // faint far stars, fading out as the night gives way to day
  for (let i = 0; i < 80; i++) {
    const x = 25 + R() * 600;
    const y = 25 + R() * 580 * R() ** 0.45;
    if ((x - 190) ** 2 + (y - 230) ** 2 < 100 ** 2) continue;
    if ((x - 505) ** 2 + (y - 300) ** 2 < 170 ** 2) continue;
    const fade = Math.max(0, 1 - x / 640);
    const op = fade * R.range(0.35, 0.9);
    if (op < 0.06) continue;
    body += circle(x, y, R.range(1, 2.5), { fill: R() < 0.22 ? C.gold0 : '#DCE6FF', opacity: r1(op * 100) / 100 });
  }

  // long soft clouds glowing pink and gold on the dawn side
  body += wisp(712, 468, 250, 22, '#E5A3B6', '#FFD7BC', 0.85, 2);
  body += wisp(942, 400, 210, 18, '#EFB0AE', '#FFE2BE', 0.8, 3);
  body += wisp(610, 572, 160, 14, '#EDAEAB', '#FFE2BE', 0.65, 4);

  // star, moon, sun - the three lights that all set
  body += brightStar(190, 230, 48, id('starGlow'));
  body += moon(505, 300, 98, id('moonGlow'));
  body += circle(838, 668, 300, { fill: `url(#${id('sunGlow')})` });
  body += rays(838, 668, { n: 15, len: 380, spread: 176, dir: -90, width: 3.2, color: `url(#${id('rayFade')})`, op: 1 });
  body += circle(838, 668, 112, { fill: '#FFE9B0', opacity: 0.4 });
  body += circle(838, 668, 100, { fill: '#FFD77E' });
  body += circle(830, 660, 84, { fill: '#FFF0C8', opacity: 0.5 });
  body += farBird(700, 520, 1.3, '#9A5E78', 0.55) + farBird(742, 500, 1, '#9A5E78', 0.5) + farBird(668, 492, 0.85, '#9A5E78', 0.45);

  // ---- land: far dunes, mid dunes, near dune, near hill
  body += duneBand([[-20, 658], [130, 640], [290, 652], [450, 632], [620, 654], [770, 640], [930, 664], [1020, 652]], { fill: `url(#${id('far')})`, shadeOp: 0.14, depth: 70, rim: `url(#${id('rimFar')})`, rimOp: 0.8 });
  body += duneBand([[-20, 738], [140, 704], [300, 726], [470, 694], [640, 732], [800, 704], [960, 728], [1030, 716]], { fill: `url(#${id('mid')})`, depthId: id('foot'), shadeOp: 0.2, depth: 90, rim: `url(#${id('rimMid')})`, rimOp: 0.85 });

  // near-right golden dune framing the corner, with wind ripples
  body += duneBand([[560, 1010], [700, 936], [860, 884], [1030, 862]], { fill: `url(#${id('near')})`, shadeOp: 0.16, depth: 70, rim: '#FFEACB', rimOp: 0.75 });
  for (const [x0, y0, w] of [[820, 930, 120], [760, 968, 150], [900, 958, 90], [870, 990, 130]]) {
    body += path(`M${x0},${y0} q${w * 0.5},-14 ${w},-6`, { fill: 'none', stroke: '#B97462', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.35 });
  }
  for (const [gx, gy, gh, sd] of [[905, 902, 44, 3], [940, 896, 32, 4], [700, 960, 30, 6]]) body += grass(gx, gy, { h: gh, fill: '#A0624E', n: 5, seed: sd });
  body += ellipse(820, 905, 16, 7, { fill: '#B97462', opacity: 0.6 }) + ellipse(816, 902, 7, 3, { fill: '#FFE3C4', opacity: 0.6 });

  // near-left hill, moonlit on top, warm-rimmed on its sunrise side
  const hill = 'M-20,792 C80,766 210,768 330,782 C450,796 560,826 640,876 C690,908 722,952 742,1020 L-20,1020Z';
  body += path(hill, { fill: `url(#${id('hill')})` });
  body += path(hill, { fill: `url(#${id('hillTop')})` });
  body += path('M360,786 C460,800 560,828 640,876 C690,908 722,952 742,1020', { fill: 'none', stroke: '#F5B99D', 'stroke-width': 4, opacity: 0.6, 'stroke-linecap': 'round' });
  body += path('M-20,792 C80,766 210,768 330,782', { fill: 'none', stroke: '#9FB0E6', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' });

  // lone palm, standing clear below the star
  const pt = (c, t) => mix(c, '#1E2A55', t);
  body += ellipse(96, 784, 44, 7, { fill: C.ink, opacity: 0.25 });
  body += palm(92, 786, { h: 268, lean: 0.14, seed: 7, dates: false, trunk: pt(C.wood2, 0.36), trunkDark: pt(C.wood3, 0.4), leaf: pt(C.leaf3, 0.32), leafMid: pt(C.leaf4, 0.38), leafDark: pt(C.leaf5, 0.45) });

  body += grass(92, 790, { h: 30, fill: '#2C3566', n: 6, seed: 41, spread: 1.1 });

  // the tent with a warm lamp glowing inside
  body += ellipse(322, 806, 150, 14, { fill: C.ink, opacity: 0.25 });
  body += nightTent(322, 804, 236, 128, { lampId: id('lamp'), clipId: id('tentClip') });
  body += ellipse(330, 814, 80, 12, { fill: `url(#${id('pool')})` });

  // sleeping sheep
  body += sleepySheep(478, 852, { s: 0.92, seed: 2 });
  body += sleepySheep(592, 896, { s: 0.8, seed: 5, flip: true });
  body += sleepySheep(330, 892, { s: 1.0, seed: 9 });


  // a little clay water jug by the tent
  body += ellipse(212, 818, 22, 5, { fill: C.ink, opacity: 0.25 });
  body += path('M200,816 C192,800 194,786 204,780 L203,772 L217,772 L216,780 C226,786 228,800 220,816Z', { fill: '#B4706A' });
  body += path('M212,780 C224,788 226,802 218,816 L220,816 C228,800 226,786 216,780Z', { fill: '#7E4F5E', opacity: 0.6 });
  body += rect(201, 768, 18, 6, { rx: 3, fill: '#C98478' });
  body += ellipse(204, 792, 3, 7, { fill: '#F2B8A0', opacity: 0.5 });

  // tufts, little desert flowers and pebbles along the near hill
  for (const [gx, gy, gh, sd] of [[52, 870, 46, 11], [290, 975, 38, 12], [520, 960, 34, 13], [640, 982, 30, 14]]) body += grass(gx, gy, { h: gh, fill: '#3E4580', n: 6, seed: sd });
  for (const [fx, fy, fr] of [[250, 918, 6], [272, 930, 5], [470, 948, 5], [90, 880, 6]]) {
    body += circle(fx, fy, fr, { fill: '#B9A6E0', opacity: 0.85 }) + circle(fx, fy, fr * 0.4, { fill: C.gold1, opacity: 0.9 });
  }
  body += ellipse(262, 972, 22, 9, { fill: '#39407A' }) + ellipse(256, 968, 10, 4, { fill: '#6874B4', opacity: 0.6 });
  body += ellipse(420, 990, 16, 7, { fill: '#39407A' });

  body += sleepySheep(196, 950, { s: 0.62, seed: 12 });

  // framing grass in the near corners
  body += grass(40, 1004, { h: 150, fill: '#1C2347', n: 7, seed: 31, spread: 1.6 });
  body += grass(14, 1006, { h: 100, fill: '#283161', n: 4, seed: 32, spread: 1.2 });
  body += grass(970, 1006, { h: 120, fill: '#9C5E4C', n: 6, seed: 33, spread: 1.5 });
  body += grass(918, 1008, { h: 70, fill: '#B7735C', n: 4, seed: 34 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
