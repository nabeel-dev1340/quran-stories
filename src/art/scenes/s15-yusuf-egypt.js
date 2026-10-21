// Yusuf in Egypt (Quran 12:43-49, 12:54-56, 12:93-100).
// The years of plenty: the Nile, tall golden wheat, exactly seven fat and
// happy cows grazing in a green pasture, big round mud-brick granaries full
// of grain, palm trees and pyramids in the hazy distance. Sunny gold and green.
import {
  C, svgDoc, ids, rng, mix, linear, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob, smooth,
  sun, cloud, palm, farBird, bird, grass, flower, shimmer, eye, T, r1,
} from '../lib.js';

const SKY = '#BFE3EE';
const haze = (c, t = 0.5) => mix(c, SKY, t);

// ---------------------------------------------------------------- helpers
// A fat, happy cow, facing RIGHT. (x, y) = ground between the feet.
// graze: head down in the grass. happy: closed smiling eyes.
function cow(clipId, x, y, { s = 1, flip = false, body, dark, light, patch, muzzle = '#F7CFC0', hoof = '#5E4438', horn = '#F6EAD2', graze = false, happy = false } = {}) {
  const p = [];
  const legDark = mix(dark, '#000000', 0.1);
  // legs first: the round belly hangs over their tops
  for (const lx of [-40, 60]) p.push(rect(lx - 10, -80, 21, 80, { rx: 10, fill: legDark }), rect(lx - 10, -12, 21, 12, { rx: 5, fill: hoof }));
  for (const lx of [-62, 76]) p.push(rect(lx - 11, -78, 23, 78, { rx: 11, fill: body }), rect(lx - 8, -46, 6, 28, { rx: 3, fill: light, opacity: 0.55 }), rect(lx - 11, -13, 23, 13, { rx: 5, fill: hoof }));
  // tail with a tuft
  p.push(path('M-88,-124 C-108,-106 -102,-80 -106,-62', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  p.push(ellipse(-106, -56, 8, 12, { fill: patch || dark }));
  // body: a round, well-fed barrel
  const bodyD = blob([[-60, -156], [0, -166], [58, -158], [94, -128], [98, -88], [74, -52], [0, -42], [-66, -52], [-94, -88], [-90, -132]]);
  p.push(`<clipPath id="${clipId}"><path d="${bodyD}"/></clipPath>`);
  p.push(path(bodyD, { fill: body }));
  const inner = [];
  if (patch) {
    inner.push(path(blob([[-70, -160], [-18, -168], [-8, -122], [-40, -100], [-80, -116]]), { fill: patch }));
    inner.push(path(blob([[24, -142], [66, -150], [80, -112], [50, -98], [20, -112]]), { fill: patch }));
    inner.push(ellipse(-52, -66, 18, 11, { fill: patch }));
  }
  inner.push(ellipse(6, -34, 110, 32, { fill: dark, opacity: 0.42 }));
  inner.push(ellipse(-22, -150, 56, 14, { fill: light, opacity: 0.75 }));
  p.push(g({ 'clip-path': `url(#${clipId})` }, inner));
  // neck
  if (graze) p.push(path('M54,-156 C90,-148 114,-118 132,-86 L150,-62 L106,-52 C94,-72 78,-92 54,-98Z', { fill: body }));
  else p.push(path('M52,-150 C74,-166 98,-172 116,-162 L124,-112 C106,-100 84,-96 64,-100Z', { fill: body }));
  // head (tilted down when grazing)
  const hx = graze ? 140 : 130;
  const hy = graze ? -68 : -148;
  const hp = [];
  hp.push(ellipse(hx - 30, hy - 26, 23, 10, { fill: patch || dark, transform: `rotate(-22 ${hx - 30} ${hy - 26})` }));
  hp.push(ellipse(hx - 31, hy - 26, 14, 5, { fill: '#F2B6B0', transform: `rotate(-22 ${hx - 31} ${hy - 26})` }));
  hp.push(path(`M${hx - 8},${hy - 36} C${hx - 14},${hy - 54} ${hx - 4},${hy - 64} ${hx + 9},${hy - 62} C${hx + 2},${hy - 55} ${hx + 3},${hy - 45} ${hx + 8},${hy - 38}Z`, { fill: horn }));
  const headD = blob([[hx - 24, hy - 40], [hx + 16, hy - 44], [hx + 32, hy - 18], [hx + 42, hy + 18], [hx + 30, hy + 40], [hx - 6, hy + 42], [hx - 28, hy + 16], [hx - 32, hy - 16]]);
  hp.push(path(headD, { fill: body }));
  if (patch) hp.push(path(blob([[hx - 24, hy - 40], [hx + 4, hy - 43], [hx + 8, hy - 8], [hx - 22, hy + 2], [hx - 32, hy - 16]]), { fill: patch }));
  hp.push(path(blob([[hx - 28, hy + 16], [hx - 6, hy + 42], [hx + 10, hy + 40], [hx - 10, hy + 20]]), { fill: dark, opacity: 0.3 }));
  hp.push(ellipse(hx - 8, hy - 26, 12, 7, { fill: light, opacity: 0.6 }));
  hp.push(ellipse(hx + 18, hy + 22, 27, 20, { fill: muzzle, transform: `rotate(-10 ${hx + 18} ${hy + 22})` }));
  hp.push(ellipse(hx + 12, hy + 14, 10, 5, { fill: C.white, opacity: 0.4 }));
  hp.push(ellipse(hx + 28, hy + 17, 3.6, 2.8, { fill: '#B8796F' }), ellipse(hx + 14, hy + 22, 3.6, 2.8, { fill: '#B8796F' }));
  hp.push(path(`M${hx + 4},${hy + 33} q10,6 21,0`, { fill: 'none', stroke: '#B8796F', 'stroke-width': 3, 'stroke-linecap': 'round' }));
  hp.push(eye(hx + 5, hy - 12, 7, happy));
  hp.push(ellipse(hx - 6, hy + 6, 9, 5.4, { fill: C.cheek, opacity: 0.65 }));
  hp.push(path(`M${hx - 6},${hy - 42} q5,-9 11,-2 q5,-7 9,2`, { fill: 'none', stroke: patch || dark, 'stroke-width': 3.4, 'stroke-linecap': 'round' }));
  p.push(g(graze ? { transform: `rotate(28 ${hx} ${hy})` } : {}, hp));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// Round, beehive-shaped mud-brick granary. (x, y) = bottom centre.
function granary(clipId, x, y, w, h, { fill, dark, light, line, grain = C.gold2, grainDark = C.gold3 }) {
  const d = `M${r1(x - w / 2)},${r1(y)} L${r1(x - w / 2)},${r1(y - h * 0.42)} C${r1(x - w / 2)},${r1(y - h * 0.86)} ${r1(x - w * 0.26)},${r1(y - h)} ${r1(x)},${r1(y - h)} C${r1(x + w * 0.26)},${r1(y - h)} ${r1(x + w / 2)},${r1(y - h * 0.86)} ${r1(x + w / 2)},${r1(y - h * 0.42)} L${r1(x + w / 2)},${r1(y)}Z`;
  let s = `<clipPath id="${clipId}"><path d="${d}"/></clipPath>`;
  s += path(d, { fill });
  const courses = [];
  const nRows = 9;
  for (let i = 1; i < nRows; i++) {
    const yy = y - (h * i) / nRows;
    courses.push(path(`M${r1(x - w)},${r1(yy + 6)} Q${r1(x)},${r1(yy + 14)} ${r1(x + w)},${r1(yy + 6)}`, { fill: 'none', stroke: line, 'stroke-width': 2.4, opacity: 0.5 }));
    for (let k = -4; k <= 4; k++) {
      const jx = x + (k + (i % 2) * 0.5) * (w / 6);
      courses.push(path(`M${r1(jx)},${r1(yy + 10)} l0,${r1(h / nRows - 4)}`, { stroke: line, 'stroke-width': 2, opacity: 0.35 }));
    }
  }
  s += g({ 'clip-path': `url(#${clipId})` },
    ...courses,
    path(`M${r1(x + w * 0.12)},${r1(y - h - 10)} C${r1(x + w * 0.4)},${r1(y - h)} ${r1(x + w * 0.5)},${r1(y - h * 0.6)} ${r1(x + w * 0.3)},${r1(y + 10)} L${r1(x + w)},${r1(y + 10)} L${r1(x + w)},${r1(y - h - 10)}Z`, { fill: dark, opacity: 0.4 }),
    ellipse(x - w * 0.27, y - h * 0.6, w * 0.1, h * 0.24, { fill: light, opacity: 0.3 }),
  );
  // the opening at the top, heaped with grain
  s += ellipse(x, y - h + 4, w * 0.16, w * 0.06, { fill: dark });
  s += path(`M${r1(x - w * 0.14)},${r1(y - h + 4)} Q${r1(x)},${r1(y - h - w * 0.14)} ${r1(x + w * 0.14)},${r1(y - h + 4)}Z`, { fill: grain });
  s += path(`M${r1(x + w * 0.02)},${r1(y - h - w * 0.05)} Q${r1(x + w * 0.1)},${r1(y - h - w * 0.02)} ${r1(x + w * 0.14)},${r1(y - h + 4)} L${r1(x + w * 0.02)},${r1(y - h + 4)}Z`, { fill: grainDark, opacity: 0.5 });
  // a small arched door with grain spilling out
  const dw = w * 0.2;
  s += path(`M${r1(x - dw)},${r1(y)} L${r1(x - dw)},${r1(y - h * 0.18)} Q${r1(x)},${r1(y - h * 0.32)} ${r1(x + dw)},${r1(y - h * 0.18)} L${r1(x + dw)},${r1(y)}Z`, { fill: mix(dark, '#000000', 0.25) });
  s += path(`M${r1(x - dw * 1.5)},${r1(y + 4)} Q${r1(x - dw * 0.4)},${r1(y - h * 0.16)} ${r1(x + dw * 0.3)},${r1(y - h * 0.12)} Q${r1(x + dw * 1.2)},${r1(y - h * 0.06)} ${r1(x + dw * 1.6)},${r1(y + 4)}Z`, { fill: grain });
  s += path(`M${r1(x + dw * 0.3)},${r1(y - h * 0.12)} Q${r1(x + dw * 1.2)},${r1(y - h * 0.06)} ${r1(x + dw * 1.6)},${r1(y + 4)} L${r1(x + dw * 0.2)},${r1(y + 4)}Z`, { fill: grainDark, opacity: 0.45 });
  return s;
}

// A wheat stalk with a plump, braided ear and long awns. (x, y) = base.
function wheat(x, y, { h = 200, lean = 10, ear = C.gold2, earDark = C.gold3, awn = C.gold1, stem = C.gold3, w = 1 } = {}) {
  const tx = x + lean;
  const ty = y - h;
  const c1x = x + lean * 0.2;
  const c1y = y - h * 0.6;
  let s = path(`M${r1(x)},${r1(y)} Q${r1(c1x)},${r1(c1y)} ${r1(tx)},${r1(ty)}`, { fill: 'none', stroke: stem, 'stroke-width': r1(2.8 * w), 'stroke-linecap': 'round' });
  const dl = Math.hypot(tx - c1x, ty - c1y);
  const ux = (tx - c1x) / dl;
  const uy = (ty - c1y) / dl;
  const nx = -uy;
  const ny = ux;
  const n = 6;
  const kl = 11 * w;
  const kw = 6 * w;
  const baseAng = (Math.atan2(uy, ux) * 180) / Math.PI;
  let awns = '';
  for (let i = n - 1; i >= 0; i--) {
    const px = tx - ux * kl * 0.62 * i;
    const py = ty - uy * kl * 0.62 * i;
    for (const side of [-1, 1]) {
      const ex = px + nx * side * kw * 0.55;
      const ey = py + ny * side * kw * 0.55;
      s += ellipse(ex, ey, kl / 2, kw / 2, { fill: side < 0 ? ear : earDark, transform: `rotate(${r1(baseAng + side * 24)} ${r1(ex)} ${r1(ey)})` });
      const a2 = ((baseAng + side * 14) * Math.PI) / 180;
      awns += `M${r1(ex + Math.cos(a2) * kl * 0.4)},${r1(ey + Math.sin(a2) * kl * 0.4)} l${r1(Math.cos(a2) * kl * 2)},${r1(Math.sin(a2) * kl * 2)} `;
    }
  }
  s += ellipse(tx + ux * kl * 0.3, ty + uy * kl * 0.3, kl / 2, kw / 2, { fill: ear, transform: `rotate(${r1(baseAng)} ${r1(tx + ux * kl * 0.3)} ${r1(ty + uy * kl * 0.3)})` });
  s += path(awns, { fill: 'none', stroke: awn, 'stroke-width': r1(1.1 * w), 'stroke-linecap': 'round', opacity: 0.9 });
  return s;
}

// A small wheat stalk for the field edge (lighter to draw).
function wheatSmall(x, y, h, lean, ear, stem) {
  const tx = x + lean;
  const ty = y - h;
  return path(`M${r1(x)},${r1(y)} Q${r1(x + lean * 0.3)},${r1(y - h * 0.6)} ${r1(tx)},${r1(ty + h * 0.2)}`, { fill: 'none', stroke: stem, 'stroke-width': 2, 'stroke-linecap': 'round' }) +
    ellipse(tx, ty + h * 0.1, 4.2, h * 0.16, { fill: ear, transform: `rotate(${r1(lean * 0.8)} ${r1(tx)} ${r1(ty + h * 0.1)})` }) +
    path(`M${r1(tx - 1)},${r1(ty)} l${r1(-3 + lean * 0.2)},-12 M${r1(tx + 1)},${r1(ty)} l${r1(3 + lean * 0.2)},-12`, { stroke: ear, 'stroke-width': 1, opacity: 0.8 });
}

// A distant palm: a simple silhouette for the hazy far bank.
function farPalm(x, y, h, { trunk, leaf, lean = 0.06 }) {
  const tx = x + lean * h;
  const ty = y - h;
  let s = path(`M${r1(x - 2.6)},${r1(y)} Q${r1(x + lean * h * 0.2)},${r1(y - h * 0.5)} ${r1(tx - 1.4)},${r1(ty)} L${r1(tx + 1.4)},${r1(ty)} Q${r1(x + lean * h * 0.2 + 3)},${r1(y - h * 0.5)} ${r1(x + 2.6)},${r1(y)}Z`, { fill: trunk });
  const L = h * 0.42;
  for (const a of [-172, -142, -112, -80, -48, -16, 14, 166]) {
    const rad = (a * Math.PI) / 180;
    const ex = tx + Math.cos(rad) * L;
    const ey = ty + Math.sin(rad) * L * 0.55 + L * 0.42 * Math.abs(Math.cos(rad));
    const mx = tx + Math.cos(rad) * L * 0.5;
    const my = ty + Math.sin(rad) * L * 0.5 - L * 0.12;
    s += path(`M${r1(tx)},${r1(ty)} Q${r1(mx)},${r1(my - L * 0.1)} ${r1(ex)},${r1(ey)} Q${r1(mx)},${r1(my + L * 0.12)} ${r1(tx)},${r1(ty)}Z`, { fill: leaf });
  }
  return s;
}

// An ancient Nile boat: upturned hull, mast and a square sail between two
// yards. (x, y) = waterline centre.
function nileBoat(x, y, s = 1) {
  return g({ transform: T(x, y, s) },
    path('M0,-6 L0,-120', { stroke: '#8A6A4E', 'stroke-width': 3.4 }),
    path('M-40,-112 L40,-112 Q48,-74 40,-36 L-40,-36 Q-32,-74 -40,-112Z', { fill: '#FFFBF2' }),
    path('M10,-112 L40,-112 Q48,-74 40,-36 L10,-36 Q16,-74 10,-112Z', { fill: '#EADFCC', opacity: 0.85 }),
    path('M-44,-114 L44,-114 M-44,-34 L44,-34', { stroke: '#8A6A4E', 'stroke-width': 3.4, 'stroke-linecap': 'round' }),
    path('M-74,-30 C-62,-6 -40,6 0,6 C40,6 62,-6 74,-30 C58,-16 40,-10 0,-10 C-40,-10 -58,-16 -74,-30Z', { fill: '#9A6A44' }),
    path('M-60,-16 C-40,-8 40,-8 60,-16 L56,-11 C40,-4 -40,-4 -56,-11Z', { fill: '#C28D5E' }),
    ellipse(0, 12, 64, 4, { fill: '#2E7E98', opacity: 0.3 }),
  );
}

// Pyramid with a sunlit left face and a shaded right face. (x, y) = base centre.
function pyramid(x, y, w, h, light, dark) {
  return path(`M${r1(x - w / 2)},${r1(y)} L${r1(x)},${r1(y - h)} L${r1(x + w * 0.12)},${r1(y)}Z`, { fill: light }) +
    path(`M${r1(x + w * 0.12)},${r1(y)} L${r1(x)},${r1(y - h)} L${r1(x + w / 2)},${r1(y)}Z`, { fill: dark });
}

// ---------------------------------------------------------------- scene
export default function render() {
  const id = ids('s15');
  const R = rng(1515);
  const defs = [
    linear(id('sky'), [[0, '#7CC3DF'], [0.25, '#9FD3E6'], [0.38, SKY], [0.45, '#F3EBCB']]),
    glowDef(id('sunGlow'), '#FFF1C2', 0.85),
    linear(id('nile'), [[0, '#A8DDE2'], [1, '#4FAFC4']]),
    linear(id('field'), [[0, '#F2CF73'], [1, '#E2A945']]),
    linear(id('pasture'), [[0, '#A9D27F'], [1, '#6FB062']]),
    glowDef(id('plenty'), '#FFF4CC', 0.5),
    vignetteDef(id('vig'), C.ink, 0.17),
  ].join('');

  let body = '';
  // sky and sun
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(150, 128, 46, { fill: '#FFE9A6', core: '#FFF8DE', rays: 12, rayColor: '#FFF0C4', glowId: id('sunGlow') });
  body += cloud(460, 150, 210, { fill: C.white, shade: '#D9EEF3', seed: 3 });
  body += cloud(830, 110, 170, { fill: C.white, shade: '#D9EEF3', seed: 7, opacity: 0.95 });
  body += cloud(660, 300, 120, { fill: C.white, shade: '#E2F2F4', seed: 9, opacity: 0.8 });
  body += farBird(330, 230, 1.1, '#4F6A86', 0.55) + farBird(368, 214, 0.85, '#4F6A86', 0.5) + farBird(600, 220, 0.8, '#4F6A86', 0.45);

  // far desert with the pyramids in the haze
  body += path(ridge([[-20, 445], [200, 438], [420, 444], [640, 436], [860, 442], [1020, 438]]), { fill: haze(C.sand2, 0.55) });
  body += pyramid(780, 444, 230, 140, haze(C.sand1, 0.5), haze(C.sand3, 0.5));
  body += pyramid(905, 444, 150, 92, haze(C.sand1, 0.55), haze(C.sand3, 0.55));
  body += pyramid(655, 444, 110, 64, haze(C.sand1, 0.6), haze(C.sand3, 0.6));
  // far bank greenery and palms
  body += path(ridge([[-20, 462], [160, 452], [380, 460], [600, 450], [820, 458], [1020, 452]], 480), { fill: haze(C.leaf3, 0.45) });
  for (const [px, ph] of [[40, 66], [78, 52], [286, 60], [318, 46], [520, 70], [556, 54], [990, 64], [954, 50]]) {
    body += farPalm(px, 466, ph, { trunk: haze(C.wood2, 0.5), leaf: haze(C.leaf4, 0.45) });
  }

  // the Nile
  body += path('M-20,470 C200,466 420,474 620,468 C800,462 900,468 1020,466 L1020,540 C820,548 600,534 400,546 C220,556 100,546 -20,552Z', { fill: `url(#${id('nile')})` });
  body += shimmer(240, 498, { n: 4, w: 120, gap: 12, color: C.white, op: 0.6, seed: 2 });
  body += shimmer(760, 494, { n: 4, w: 110, gap: 12, color: C.white, op: 0.55, seed: 5 });
  body += nileBoat(548, 512, 0.52);
  body += nileBoat(880, 500, 0.34);

  // near bank: a tall golden wheat field (right) and the granaries (left)
  body += path(ridge([[-20, 548], [200, 540], [420, 548], [640, 538], [860, 546], [1020, 540]], 720), { fill: '#9CCB7A' });
  const fieldD = `${smooth([[300, 566], [480, 552], [700, 556], [880, 546], [1020, 552]])} L1020,720 L470,720 C400,716 352,690 330,640 L300,566Z`;
  body += `<clipPath id="${id('fieldClip')}"><path d="${fieldD}"/></clipPath>`;
  body += path(fieldD, { fill: `url(#${id('field')})` });
  let rowsD = '';
  for (let row = 0; row < 6; row++) {
    const yy = 572 + row * 19;
    let d = '';
    for (let x = 318 + (row % 2) * 8; x < 1010; x += 16) d += `M${r1(x)},${r1(yy + R.range(-2, 2))} l2,-${r1(8 + row * 1.6)} `;
    rowsD += path(d, { fill: 'none', stroke: row % 2 ? '#D99A3A' : '#F9DF92', 'stroke-width': r1(3.2 + row * 0.6), 'stroke-linecap': 'round', opacity: 0.6 });
  }
  body += g({ 'clip-path': `url(#${id('fieldClip')})` }, rowsD);
  // palms beside the granaries
  body += palm(52, 650, { h: 210, seed: 11, lean: 0.06 });
  body += palm(405, 606, { h: 150, seed: 12, lean: -0.1 });
  // the granaries, full of grain
  body += granary(id('gr1'), 160, 660, 150, 190, { fill: '#D9A86A', dark: '#B07A44', light: '#F2CC92', line: '#A8743F' });
  body += granary(id('gr2'), 300, 650, 120, 150, { fill: '#DDB077', dark: '#B5834F', light: '#F4D29C', line: '#AC7A46' });
  // a ladder leaning on the big granary
  body += g({},
    path('M222,660 L246,480 M246,660 L270,480', { stroke: '#8A5A2E', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    ...[0, 1, 2, 3, 4, 5].map((i) => path(`M${r1(224 + i * 3.6 - 1)},${r1(636 - i * 29)} L${r1(248 + i * 3.6 + 1)},${r1(636 - i * 29)}`, { stroke: '#A06C3A', 'stroke-width': 5, 'stroke-linecap': 'round' })),
  );

  // the green pasture, with the field's tall front row standing along its edge
  body += path(ridge([[-20, 700], [160, 688], [330, 700], [520, 704], [760, 702], [1020, 700]]), { fill: `url(#${id('pasture')})` });
  for (let x = 452; x < 1012; x += 12) {
    const hh = R.range(70, 96);
    body += wheatSmall(x + R.range(-3, 3), 706, hh, R.range(-6, 8), R() < 0.5 ? C.gold2 : '#F3CF6E', '#D9A23E');
  }
  body += circle(520, 820, 420, { fill: `url(#${id('plenty')})` });
  body += path(ridge([[-20, 960], [200, 948], [460, 962], [720, 950], [1020, 958]]), { fill: '#62A55A', opacity: 0.6 });
  for (let i = 0; i < 22; i++) body += grass(40 + R() * 920, 720 + R() * 260, { h: 18 + R() * 16, fill: R() < 0.5 ? '#5E9E58' : '#7DBB66', n: 4, seed: 60 + i });

  // flowers in the grass, in the gaps between the cows
  for (const [fx, fy, fr, fc] of [[352, 770, 8, C.coral1], [636, 812, 7, C.gold1], [470, 790, 7, C.white], [370, 975, 9, C.coral1], [660, 978, 8, C.gold1], [110, 975, 8, C.white], [250, 985, 7, C.gold1], [880, 975, 8, C.coral1], [910, 790, 7, C.white]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });

  // ----- exactly seven fat, happy cows (a back row of three, a front row of four)
  const brown = { body: '#B97A44', dark: '#8F5A30', light: '#D9A06A' };
  const cream = { body: '#F8EFE0', dark: '#DCCBB2', light: '#FFFFFF', patch: '#9C6436' };
  const gold = { body: '#E3AE5C', dark: '#BF8740', light: '#F5CD86' };
  const red = { body: '#C46E4C', dark: '#9C5038', light: '#DE916E' };
  const white = { body: '#FCF8F1', dark: '#DED3C4', light: '#FFFFFF', patch: '#6E5246' };
  const fawn = { body: '#D7B38A', dark: '#B48F68', light: '#ECCDA8' };
  const shadowAt = (cx, cy, w) => ellipse(cx, cy + 2, w, w * 0.13, { fill: '#2F6B3E', opacity: 0.22 });
  // back row of four
  body += shadowAt(222, 748, 62) + cow(id('c1'), 206, 748, { s: 0.48, ...gold, graze: true });
  body += shadowAt(392, 736, 62) + cow(id('c2'), 408, 736, { s: 0.48, flip: true, ...cream, happy: true });
  body += shadowAt(606, 752, 62) + cow(id('c3'), 590, 752, { s: 0.48, ...red, graze: true });
  body += shadowAt(800, 740, 62) + cow(id('c4'), 816, 740, { s: 0.48, flip: true, ...fawn });
  body += bird(578, 680, { s: 0.3, body: C.white, wing: '#E8E4DA', belly: C.white, beak: C.gold2 });
  // front row of three
  body += shadowAt(232, 912, 100) + cow(id('c5'), 206, 912, { s: 0.7, ...white });
  body += shadowAt(498, 940, 100) + cow(id('c6'), 524, 940, { s: 0.7, flip: true, ...brown, graze: true, happy: true });
  body += shadowAt(782, 918, 100) + cow(id('c7'), 760, 918, { s: 0.68, ...cream, happy: true });

  // foreground wheat framing the bottom corners
  for (const [wx, wh, wl] of [[-8, 300, 20], [16, 250, 30], [40, 200, 34], [-22, 210, 14]]) body += wheat(wx, 1010, { h: wh, lean: wl, w: 1.5, stem: '#D99A3A' });
  for (const [wx, wh, wl] of [[1008, 290, -20], [984, 240, -30], [962, 196, -34], [1022, 210, -14]]) body += wheat(wx, 1010, { h: wh, lean: wl, w: 1.5, stem: '#D99A3A' });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
