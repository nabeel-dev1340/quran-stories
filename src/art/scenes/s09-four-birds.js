// Four birds come flying (Quran 2:260).
// Exactly four different, colourful birds - a peacock, a rooster, a pigeon
// and a crane (the Quran does not name them; these follow a classical tafsir
// list) - fly joyfully from four different hilltops toward a soft light in
// the centre, wings spread, with gentle motion trails. Bright morning.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge,
  sparkle, cloud, bush, grass, flower, eye, r1, T,
} from '../lib.js';

// ---------------------------------------------------------------- birds
// A spread wing with scalloped feather tips; root at (0, 0), raised up-back.
function wing(len, { fill, dark, light, tip } = {}) {
  const k = len / 100;
  const P = (x, y) => `${r1(x * k)},${r1(y * k)}`;
  const d = `M${P(14, 2)} C${P(10, -40)} ${P(-4, -78)} ${P(-34, -100)} Q${P(-38, -86)} ${P(-50, -86)} Q${P(-48, -70)} ${P(-60, -64)} Q${P(-54, -48)} ${P(-64, -38)} Q${P(-50, -28)} ${P(-48, -14)} C${P(-30, -2)} ${P(-6, 6)} ${P(14, 2)}Z`;
  const inner = `M${P(12, 0)} C${P(8, -30)} ${P(-2, -56)} ${P(-18, -72)} C${P(-24, -50)} ${P(-30, -30)} ${P(-40, -14)} C${P(-24, -4)} ${P(-4, 4)} ${P(12, 0)}Z`;
  const tips = tip ? path(`M${P(-34, -100)} Q${P(-38, -86)} ${P(-50, -86)} Q${P(-48, -70)} ${P(-60, -64)} C${P(-46, -66)} ${P(-34, -80)} ${P(-34, -100)}Z`, { fill: tip }) : '';
  return path(d, { fill }) + tips + path(inner, { fill: light, opacity: 0.55 }) +
    path(`M${P(-20, -60)} Q${P(-30, -44)} ${P(-44, -30)} M${P(-8, -44)} Q${P(-18, -30)} ${P(-30, -18)}`, { fill: 'none', stroke: dark, 'stroke-width': r1(2.4 * k), 'stroke-linecap': 'round', opacity: 0.45 });
}
const farWing = (len, o) => g({ transform: 'translate(-6 -12) rotate(-32)' }, wing(len, o));
const nearWing = (len, o) => g({ transform: 'translate(8 -6)' }, wing(len, o));

// All birds face right (flip to face left); (x, y) = body centre; rot tilts.
function peacock(x, y, { s = 1, flip = false, rot = 0 } = {}) {
  const blue = '#2E7DC0';
  const blueD = '#1F5E9A';
  const teal = C.water2;
  const parts = [];
  // tail train: a long green fan streaming behind, dotted with eyes
  parts.push(path('M-28,-2 C-80,-30 -150,-34 -186,-8 C-196,6 -190,26 -176,36 C-140,52 -80,40 -28,14Z', { fill: C.leaf4 }));
  parts.push(path('M-28,0 C-80,-20 -140,-22 -172,-4 C-178,8 -172,20 -160,26 C-124,38 -76,30 -28,10Z', { fill: C.leaf3 }));
  for (const [ex, ey, r] of [[-172, 6, 1.1], [-140, -16, 1], [-140, 22, 1], [-106, -8, 0.9], [-106, 18, 0.9], [-74, 4, 0.8]]) {
    parts.push(ellipse(ex, ey, 13 * r, 10 * r, { fill: C.gold2 }));
    parts.push(ellipse(ex + 1, ey, 8 * r, 6.4 * r, { fill: blue }));
    parts.push(circle(ex + 2, ey, 3.2 * r, { fill: C.night1 }));
  }
  parts.push(farWing(92, { fill: mix(teal, C.water4, 0.35), dark: C.water5, light: C.water1 }));
  parts.push(ellipse(0, 0, 40, 22, { fill: blue, transform: 'rotate(-12)' }));
  parts.push(ellipse(4, 8, 26, 12, { fill: blueD, opacity: 0.5, transform: 'rotate(-12)' }));
  parts.push(path('M22,-8 C28,-26 34,-36 44,-40 L52,-28 C44,-22 38,-10 34,0Z', { fill: blue }));
  parts.push(circle(46, -40, 16, { fill: blue }));
  for (const [dx, dy] of [[-6, -26], [0, -30], [6, -26]]) {
    parts.push(path(`M46,-54 L${46 + dx},${-54 + dy}`, { stroke: blueD, 'stroke-width': 2, 'stroke-linecap': 'round' }));
    parts.push(circle(46 + dx, -54 + dy, 4.5, { fill: teal }));
  }
  parts.push(path('M60,-42 L72,-38 L60,-33Z', { fill: C.gold2 }));
  parts.push(path('M44,-46 Q52,-50 58,-44', { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.9 }));
  parts.push(eye(51, -42, 3.6));
  parts.push(ellipse(55, -32, 4.5, 2.8, { fill: C.cheek, opacity: 0.7 }));
  parts.push(nearWing(104, { fill: teal, dark: C.water4, light: C.water0 }));
  return g({ transform: T(x, y, s, rot, flip) }, parts);
}

function rooster(x, y, { s = 1, flip = false, rot = 0 } = {}) {
  const comb = C.coral3;
  const wingC = C.coral2;
  const parts = [];
  for (const [ex, ey, w, c] of [[-96, -60, 9, C.leaf5], [-104, -30, 9, C.water5], [-96, 0, 8, C.leaf4], [-84, 20, 7, C.water4]]) {
    parts.push(path(`M-30,-4 Q${r1(ex * 0.6)},${r1(ey - 40)} ${ex},${ey}`, { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' }));
  }
  parts.push(farWing(88, { fill: mix(wingC, C.coral4, 0.4), dark: C.coral4, light: C.coral1 }));
  parts.push(ellipse(0, 0, 40, 24, { fill: C.gold3, transform: 'rotate(-12)' }));
  parts.push(ellipse(6, 8, 26, 13, { fill: C.gold4, opacity: 0.45, transform: 'rotate(-12)' }));
  parts.push(path('M20,-10 C26,-28 32,-40 44,-44 L54,-30 C46,-22 40,-10 34,0Z', { fill: C.gold2 }));
  parts.push(circle(46, -42, 16, { fill: C.gold2 }));
  parts.push(circle(38, -58, 6, { fill: comb }), circle(46, -61, 6.5, { fill: comb }), circle(54, -58, 6, { fill: comb }));
  parts.push(ellipse(58, -28, 4.5, 7, { fill: comb }));
  parts.push(path('M60,-44 L72,-40 L60,-35Z', { fill: C.gold1 }));
  parts.push(eye(51, -44, 3.6));
  parts.push(ellipse(54, -35, 4.5, 2.8, { fill: C.cheek, opacity: 0.7 }));
  parts.push(nearWing(100, { fill: wingC, dark: C.coral4, light: C.gold1 }));
  return g({ transform: T(x, y, s, rot, flip) }, parts);
}

function pigeon(x, y, { s = 1, flip = false, rot = 0 } = {}) {
  const body = '#C4BCE6';
  const bodyD = '#9F95CF';
  const parts = [];
  parts.push(path('M-34,-2 L-66,-14 Q-70,0 -66,12 Z', { fill: bodyD }));
  parts.push(path('M-62,-11 Q-66,0 -62,9 L-56,7 Q-59,0 -56,-8Z', { fill: C.plum3, opacity: 0.6 }));
  parts.push(farWing(84, { fill: bodyD, dark: C.plum3, light: C.plum0 }));
  parts.push(ellipse(0, 0, 38, 22, { fill: body, transform: 'rotate(-10)' }));
  parts.push(ellipse(6, 9, 24, 11, { fill: C.plum0, opacity: 0.8, transform: 'rotate(-10)' }));
  parts.push(path('M22,-8 C26,-22 32,-30 40,-32 L48,-20 C42,-14 38,-6 34,2Z', { fill: body }));
  parts.push(path('M26,-12 C30,-20 34,-24 40,-24 L44,-16 C38,-12 34,-6 32,0Z', { fill: '#7FCBA6', opacity: 0.8 }));
  parts.push(path('M28,-6 C32,-12 36,-14 42,-14 L42,-8 C38,-6 34,-2 32,4Z', { fill: '#B07FD2', opacity: 0.7 }));
  parts.push(circle(42, -34, 14, { fill: body }));
  parts.push(path('M54,-35 L64,-31 L54,-28Z', { fill: '#E8A0A8' }));
  parts.push(eye(47, -36, 3.4));
  parts.push(ellipse(50, -27, 4.2, 2.6, { fill: C.cheek, opacity: 0.7 }));
  parts.push(nearWing(96, { fill: body, dark: C.plum3, light: C.white }));
  parts.push(path('M0,20 Q-4,26 -10,28 M8,20 Q6,27 0,30', { fill: 'none', stroke: C.rose2, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  return g({ transform: T(x, y, s, rot, flip) }, parts);
}

function crane(x, y, { s = 1, flip = false, rot = 0 } = {}) {
  const body = '#EEF1F6';
  const grey = '#B9C6DA';
  const dark = C.ink2;
  const parts = [];
  parts.push(path('M-30,8 L-110,20 M-30,4 L-112,10', { stroke: '#8A8FA8', 'stroke-width': 4, 'stroke-linecap': 'round' }));
  parts.push(path('M-36,-4 L-70,-12 Q-74,0 -70,10 Z', { fill: mix(dark, grey, 0.3) }));
  parts.push(farWing(104, { fill: mix(grey, C.night3, 0.25), dark, light: body, tip: mix(dark, grey, 0.35) }));
  parts.push(ellipse(0, 0, 46, 22, { fill: body, transform: 'rotate(-4)' }));
  parts.push(ellipse(4, 7, 30, 9, { fill: grey, opacity: 0.6 }));
  parts.push(path('M30,-8 C48,-14 66,-20 86,-22 L88,-12 C68,-8 50,-2 32,4Z', { fill: body }));
  parts.push(path('M52,-14 C64,-18 76,-20 86,-21 L87,-15 C76,-14 64,-11 54,-8Z', { fill: dark, opacity: 0.8 }));
  parts.push(circle(94, -22, 15, { fill: body }));
  parts.push(path('M86,-34 Q95,-42 104,-32 Q96,-34 88,-29Z', { fill: C.coral3 }));
  parts.push(circle(97, -34, 6.5, { fill: C.coral3 }));
  parts.push(path('M106,-25 L132,-18 L106,-15Z', { fill: C.gold3 }));
  parts.push(eye(99, -24, 4));
  parts.push(ellipse(100, -13, 4.6, 2.6, { fill: C.cheek, opacity: 0.7 }));
  parts.push(nearWing(108, { fill: grey, dark, light: body, tip: mix(dark, grey, 0.2) }));
  return g({ transform: T(x, y, s, rot, flip) }, parts);
}

// ---------------------------------------------------------------- scene bits
// A flight path: a row of soft dots along a cubic curve from the hilltop
// (a) to just behind the bird (b), growing and brightening toward the bird.
function flightPath(a, c1, c2, b, { color = C.white, n = 16, r0 = 2.2, r1x = 6.5 } = {}) {
  let out = '';
  const at = (t) => [0, 1].map((k) => (1 - t) ** 3 * a[k] + 3 * (1 - t) ** 2 * t * c1[k] + 3 * (1 - t) * t * t * c2[k] + t ** 3 * b[k]);
  // a faint soft ribbon under the dots
  const pts = [];
  for (let i = 0; i <= 30; i++) pts.push(at(i / 30));
  out += path('M' + pts.map((p) => p.map(r1).join(',')).join(' L'), { fill: 'none', stroke: color, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.18 });
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const [x, y] = at(t);
    out += circle(x, y, r0 + (r1x - r0) * t, { fill: i % 3 === 2 ? C.gold0 : color, opacity: r1((0.35 + 0.6 * t) * 100) / 100 });
  }
  return out;
}
// Two or three curved speed lines just behind a bird.
function swoosh(x, y, ang, { len = 70, color = C.white, op = 0.75 } = {}) {
  let out = '';
  for (const [dy, l] of [[-14, 0.8], [0, 1], [14, 0.7]]) {
    out += path(`M0,${dy} q${r1(-len * l * 0.5)},${r1(-6)} ${r1(-len * l)},${r1(dy * 0.25)}`, { fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: op });
  }
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})` }, out);
}

// A rounded hill: a smooth dome whose feet run down off the page, lit on
// the left, shaded on the right, with a pale rim along its crown.
function hill(peak, halfW, { light, dark, top }) {
  const [px, py] = peak;
  const L = px - halfW;
  const Rr = px + halfW;
  const d = `M${r1(L - halfW * 0.6)},1010 C${r1(L)},${r1(py + 260)} ${r1(px - halfW * 0.62)},${r1(py)} ${r1(px)},${r1(py)} C${r1(px + halfW * 0.62)},${r1(py)} ${r1(Rr)},${r1(py + 260)} ${r1(Rr + halfW * 0.6)},1010Z`;
  const shade = `M${r1(px + 4)},${r1(py)} C${r1(px + halfW * 0.62)},${r1(py)} ${r1(Rr)},${r1(py + 260)} ${r1(Rr + halfW * 0.6)},1010 L${r1(px + halfW * 0.25)},1010 C${r1(px + halfW * 0.5)},${r1(py + 240)} ${r1(px + halfW * 0.4)},${r1(py + 60)} ${r1(px + 4)},${r1(py)}Z`;
  // the pale crown follows the real top curve, tucked just inside the edge
  const cub = (p0, p1, p2, p3, t) => [0, 1].map((k) => (1 - t) ** 3 * p0[k] + 3 * (1 - t) ** 2 * t * p1[k] + 3 * (1 - t) * t * t * p2[k] + t ** 3 * p3[k]);
  const lc = [[L - halfW * 0.6, 1010], [L, py + 260], [px - halfW * 0.62, py], [px, py]];
  const rc = [[px, py], [px + halfW * 0.62, py], [Rr, py + 260], [Rr + halfW * 0.6, 1010]];
  const crown = [];
  for (let i = 0; i <= 8; i++) crown.push(cub(...lc, 0.8 + 0.2 * (i / 8)));
  for (let i = 1; i <= 5; i++) crown.push(cub(...rc, 0.12 * (i / 5)));
  const cap = 'M' + crown.map(([x, y]) => `${r1(x)},${r1(y + 5)}`).join(' L');
  return path(d, { fill: light }) + path(shade, { fill: dark, opacity: 0.4 }) + path(cap, { fill: 'none', stroke: top, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.75 });
}

export default function render() {
  const id = ids('s09');
  const R = rng(909);
  const CX = 500;
  const CY = 380;
  const defs = [
    linear(id('sky'), [[0, '#62B2D6'], [0.35, '#8ECBE5'], [0.62, '#C4E6EF'], [0.8, '#EAF6F2'], [1, '#FFF6E2']]),
    glowDef(id('sunGlow'), '#FFF4D0', 0.8),
    glowDef(id('call'), '#FFF8DC', 0.95),
    radial(id('callRing'), [[0.55, '#FFFFFF', 0], [0.75, '#FFFFFF', 0.25], [1, '#FFFFFF', 0]]),
    linear(id('meadow'), [[0, C.leaf2], [1, C.leaf3]]),
    vignetteDef(id('vig'), C.ink, 0.16),
  ].join('');

  const haze = (c, t = 0.5) => mix(c, '#CBE8EE', t);
  let body = '';
  // ---- morning sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += circle(70, 70, 260, { fill: `url(#${id('sunGlow')})` });
  body += circle(70, 70, 74, { fill: '#FFE7A0', opacity: 0.45 });
  body += circle(70, 70, 64, { fill: '#FFE08C' });
  body += circle(60, 60, 46, { fill: '#FFF2C8', opacity: 0.6 });
  body += cloud(330, 140, 190, { fill: C.white, shade: '#D8EEF5', seed: 3, opacity: 0.95 });
  body += cloud(845, 120, 230, { fill: C.white, shade: '#D8EEF5', seed: 7, opacity: 0.95 });
  body += cloud(505, 640, 130, { fill: C.white, shade: '#DDF0F3', seed: 2, opacity: 0.55 });

  // ---- the soft light the birds are coming to
  body += circle(CX, CY, 330, { fill: `url(#${id('call')})` });
  body += circle(CX, CY, 150, { fill: `url(#${id('callRing')})` });
  body += circle(CX, CY, 210, { fill: `url(#${id('callRing')})`, opacity: 0.6 });

  // ---- far range and the four hills (two on each side)
  body += path(ridge([[-20, 660], [160, 636], [340, 652], [500, 630], [660, 650], [840, 634], [1020, 652]], 1000), { fill: haze(C.leaf2, 0.62) });
  const tops = [[92, 478], [908, 468], [196, 702], [806, 698]];
  body += hill(tops[0], 230, { light: haze(C.leaf2, 0.34), dark: haze(C.leaf4, 0.36), top: '#F2FBE6' });
  body += hill(tops[1], 230, { light: haze(C.leaf2, 0.34), dark: haze(C.leaf4, 0.36), top: '#F2FBE6' });
  body += hill(tops[2], 250, { light: mix(C.leaf2, C.leaf1, 0.35), dark: C.leaf3, top: '#F6FFE8' });
  body += hill(tops[3], 250, { light: mix(C.leaf2, C.leaf1, 0.35), dark: C.leaf3, top: '#F6FFE8' });
  // little trees on the far hills' shoulders for scale
  for (const [tx, ty, sc] of [[200, 560, 0.6], [800, 548, 0.6], [30, 545, 0.5], [968, 540, 0.5]]) {
    body += path(`M${tx - 3},${ty} L${tx - 2},${ty - 26 * sc} L${tx + 2},${ty - 26 * sc} L${tx + 3},${ty}Z`, { fill: haze(C.wood2, 0.3) });
    body += circle(tx + 2, ty - 42 * sc, 24 * sc, { fill: haze(C.leaf4, 0.3) });
    body += circle(tx - 2, ty - 46 * sc, 20 * sc, { fill: haze(C.leaf3, 0.3) });
  }

  // sparkles on each hilltop where a bird rose
  for (const [tx, ty] of tops) {
    body += sparkle(tx - 16, ty - 14, 9, C.white, { opacity: 0.95 }) + sparkle(tx + 16, ty - 20, 6, C.gold0) + sparkle(tx + 1, ty - 34, 5, C.white, { opacity: 0.85 });
  }

  // sparkles around the light in the middle
  for (const [sx, sy, ss] of [[CX, CY - 6, 18], [CX - 50, CY + 36, 8], [CX + 52, CY - 42, 9], [CX + 32, CY + 56, 6], [CX - 44, CY - 56, 7]]) body += sparkle(sx, sy, ss, '#FFF8E0');

  // ---- flight paths from each hilltop, then the four birds heading in
  body += flightPath(tops[0], [80, 330], [130, 250], [228, 248], { color: '#F4F0FF' });
  body += flightPath(tops[1], [920, 320], [870, 240], [776, 244], { color: '#FFF1D8' });
  body += flightPath(tops[2], [186, 660], [176, 610], [184, 580], { color: '#E4FFF6', n: 7 });
  body += flightPath(tops[3], [826, 650], [810, 590], [764, 548], { color: '#F2F6FF', n: 9 });
  body += swoosh(236, 252, 8, { color: C.white });
  body += swoosh(768, 246, 172, { color: C.white });
  body += swoosh(758, 536, 196, { color: C.white, len: 56 });

  body += pigeon(300, 258, { s: 1.08, rot: 10 });
  body += rooster(706, 252, { s: 1.08, flip: true, rot: 10 });
  body += peacock(362, 506, { s: 1.0, rot: -16 });
  body += crane(654, 500, { s: 0.94, flip: true, rot: -14 });

  // ---- foreground meadow framing the bottom
  body += path(ridge([[-20, 850], [160, 820], [380, 846], [600, 828], [820, 846], [1020, 822]], 1000), { fill: `url(#${id('meadow')})` });
  body += bush(70, 900, { w: 180, fill: C.leaf3, dark: C.leaf4, light: C.leaf2, seed: 2 });
  body += bush(955, 895, { w: 190, fill: C.leaf3, dark: C.leaf4, light: C.leaf2, seed: 6 });
  const fcols = [[C.coral1, C.gold1], [C.rose1, C.gold1], [C.gold1, C.coral2], [C.cream, C.gold2], [C.plum1, C.gold1]];
  for (let i = 0; i < 26; i++) {
    const x = 60 + R() * 880;
    const y = 870 + R() * 100;
    const [pc, cc] = R.pick(fcols);
    body += grass(x + R.range(-8, 8), y + 10, { h: R.range(20, 34), fill: R() < 0.5 ? C.leaf3 : C.leaf4, n: 4, seed: i + 3 });
    body += flower(x, y, { r: R.range(8, 12), fill: pc, center: cc, stemH: 10, stem: C.leaf4, rot: R() * 70 });
  }
  for (const [gx, gy, gh, sd] of [[20, 1004, 110, 11], [160, 1006, 70, 12], [990, 1006, 120, 13], [850, 1008, 70, 14]]) body += grass(gx, gy, { h: gh, fill: C.leaf4, n: 6, seed: sd, spread: 1.3 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
