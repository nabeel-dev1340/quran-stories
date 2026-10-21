// Nuh and the Great Ark (Quran 11:36-44, 23:27-28, 54:11-15).
// The great wooden ark of planks and nails rides big rolling waves, steady
// and safe. Animals in pairs peek out: giraffes above the roof, lions and
// elephants at the windows, rabbits over the rail, two little birds on the
// ridge. Rain falls from blue-grey clouds on the left; on the right the
// clouds part and warm sunlight breaks through toward a far mountain top
// (al-Judi). No rainbow, no dove with an olive branch, no people.
import {
  C, svgDoc, ids, rng, mix, clamp, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g,
  ridge, smooth, waveBand, sparkle, cloud, sun, rays, foam, shimmer, bird, farBird, eye, T, r1,
} from '../lib.js';

// ---------------------------------------------------------------- animal heads
function giraffe(x, y, { s = 1, flip = false, neckH = 150 } = {}) {
  const coat = C.gold2;
  const spot = C.sand4;
  const parts = [
    path(`M-11,0 C-10,${-neckH * 0.5} -8,${-neckH * 0.9} -7,${-neckH} L9,${-neckH} C10,${-neckH * 0.9} 12,${-neckH * 0.5} 13,0Z`, { fill: coat }),
    path(`M5,0 C6,${-neckH * 0.5} 8,${-neckH * 0.9} 9,${-neckH} L13,${-neckH * 0.5} C13,${-neckH * 0.3} 13,${-neckH * 0.1} 13,0Z`, { fill: C.gold3, opacity: 0.5 }),
    path(`M-9.6,${-neckH * 0.12} C-9,${-neckH * 0.5} -7.6,${-neckH * 0.85} -6.6,${-neckH * 0.97}`, { fill: 'none', stroke: C.wood2, 'stroke-width': 4.5, 'stroke-linecap': 'round' }),
  ];
  for (let i = 0; i < 6; i++) {
    const yy = -14 - i * (neckH - 30) / 5;
    parts.push(ellipse(i % 2 ? 3 : -1, yy, 6, 7.5, { fill: spot, opacity: 0.85, transform: `rotate(${i % 2 ? 20 : -15} ${i % 2 ? 3 : -1} ${r1(yy)})` }));
  }
  const hy = -neckH - 8;
  parts.push(
    path(`M-2,${hy - 14} L-5,${hy - 32} M8,${hy - 14} L8,${hy - 32}`, { stroke: C.sand4, 'stroke-width': 4.5, 'stroke-linecap': 'round' }),
    circle(-5, hy - 33, 4.5, { fill: C.wood2 }), circle(8, hy - 33, 4.5, { fill: C.wood2 }),
    ellipse(-14, hy - 10, 11, 5, { fill: C.gold3, transform: `rotate(-25 -14 ${hy - 10})` }),
    ellipse(8, hy, 22, 15, { fill: coat, transform: `rotate(18 8 ${hy})` }),
    ellipse(24, hy + 8, 13, 10, { fill: mix(coat, '#FFFFFF', 0.45), transform: `rotate(18 24 ${hy + 8})` }),
    circle(31, hy + 7, 2.2, { fill: C.wood3 }),
    eye(10, hy - 4, 4),
    ellipse(14, hy + 7, 5, 3, { fill: C.cheek, opacity: 0.6 }),
  );
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// Elephant face peeking out of a window. (x, y) = chin at the sill.
function elephant(x, y, { s = 1, tilt = 0 } = {}) {
  const grey = '#A9ADC4';
  const dark = '#8C90AB';
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${tilt}) scale(${s})` },
    ellipse(-30, -40, 24, 29, { fill: dark, transform: 'rotate(-12 -30 -40)' }),
    ellipse(-30, -40, 15, 19, { fill: C.rose1, opacity: 0.7, transform: 'rotate(-12 -30 -40)' }),
    ellipse(30, -40, 24, 29, { fill: dark, transform: 'rotate(12 30 -40)' }),
    ellipse(30, -40, 15, 19, { fill: C.rose1, opacity: 0.7, transform: 'rotate(12 30 -40)' }),
    ellipse(0, -40, 25, 27, { fill: grey }),
    path('M-8,-30 C-10,-10 -8,6 -2,14 C4,22 14,20 16,12 C12,14 8,12 6,6 C4,-4 6,-18 8,-30Z', { fill: grey }),
    path('M-2,14 C4,22 14,20 16,12 C12,14 8,12 6,6Z', { fill: dark, opacity: 0.6 }),
    ellipse(-6, -56, 12, 6, { fill: '#C3C7DA', opacity: 0.9 }),
    eye(-10, -42, 3.6), eye(10, -42, 3.6),
    ellipse(-15, -31, 5, 3, { fill: C.cheek, opacity: 0.6 }), ellipse(15, -31, 5, 3, { fill: C.cheek, opacity: 0.6 }),
  );
}

// Lion face peeking out of a window. (x, y) = chin at the sill.
function lion(x, y, { s = 1, tilt = 0, mane = C.coral2 } = {}) {
  const face = C.gold1;
  const maneDark = mix(mane, C.wood3, 0.35);
  const ring = [];
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    ring.push([Math.cos(a) * 26, -34 + Math.sin(a) * 26]);
  }
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${tilt}) scale(${s})` },
    g({ fill: maneDark }, ring.map(([a, b]) => circle(a, b, 12)), circle(0, -34, 28)),
    g({ fill: mane }, ring.map(([a, b]) => circle(a * 0.9, b * 0.9 - 3.4, 11)), circle(0, -36, 25)),
    circle(-13, -50, 6.5, { fill: face }), circle(13, -50, 6.5, { fill: face }),
    circle(-13, -50, 3.4, { fill: C.coral1 }), circle(13, -50, 3.4, { fill: C.coral1 }),
    ellipse(0, -33, 18, 18, { fill: face }),
    ellipse(0, -24, 11, 8, { fill: C.cream }),
    path('M-4,-29 L4,-29 L0,-24Z', { fill: C.rose3, 'stroke-linejoin': 'round', stroke: C.rose3, 'stroke-width': 2 }),
    path('M0,-24 L0,-21 M0,-21 q-4,4 -7,1 M0,-21 q4,4 7,1', { fill: 'none', stroke: C.wood3, 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
    eye(-7, -37, 3.4), eye(7, -37, 3.4),
    ellipse(-12, -27, 4, 2.6, { fill: C.cheek, opacity: 0.6 }), ellipse(12, -27, 4, 2.6, { fill: C.cheek, opacity: 0.6 }),
  );
}

// Rabbit peeking over the rail, paws on top. (x, y) = paws on the rail.
function bunnyPeek(x, y, { s = 1, tilt = 0, fur = '#F1E6DA', shade = '#D9C7B4' } = {}) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${tilt}) scale(${s})` },
    ellipse(-8, -44, 6.5, 22, { fill: shade, transform: 'rotate(-10 -8 -44)' }),
    ellipse(-8, -44, 3.2, 15, { fill: C.rose1, transform: 'rotate(-10 -8 -44)' }),
    ellipse(9, -46, 6.5, 22, { fill: fur, transform: 'rotate(12 9 -46)' }),
    ellipse(9, -46, 3.2, 15, { fill: C.rose1, transform: 'rotate(12 9 -46)' }),
    ellipse(0, -16, 17, 15, { fill: fur }),
    eye(-6, -18, 3), eye(6, -18, 3),
    ellipse(0, -11, 2.6, 1.8, { fill: C.rose2 }),
    ellipse(-10, -10, 3.6, 2.2, { fill: C.cheek, opacity: 0.6 }), ellipse(10, -10, 3.6, 2.2, { fill: C.cheek, opacity: 0.6 }),
    ellipse(-8, -1, 6, 4.5, { fill: fur }), ellipse(8, -1, 6, 4.5, { fill: fur }),
  );
}

// ---------------------------------------------------------------- rolling swells
// A row of big rolling waves: broad troughs, rounded crests. Returns the band
// path plus the crest positions so foam caps can sit on them.
function swells(y, { w = 300, h = 40, phase = 0, bottom = 1010 } = {}) {
  const pts = [];
  for (let x = -60; x <= 1060; x += w / 24) {
    const c = (1 + Math.cos((2 * Math.PI * (x - phase)) / w)) / 2;
    pts.push([x, y - h * c ** 1.7]);
  }
  const crests = [];
  for (let k = -2; k < 1100 / w + 2; k++) {
    const cx = phase + k * w;
    if (cx > -80 && cx < 1080) crests.push(cx);
  }
  return { d: ridge(pts, bottom), crests, top: (x) => y - h * ((1 + Math.cos((2 * Math.PI * (x - phase)) / w)) / 2) ** 1.7 };
}
function foamCap(cx, top, w, { op = 0.85 } = {}) {
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const x = cx - w * 0.22 + (w * 0.34 * i) / 10;
    pts.push([x, top(x)]);
  }
  const under = pts.map(([x, y], i) => [x, y + 3 + 9 * Math.sin((Math.PI * i) / 10)]).reverse();
  return path(`${smooth(pts)} L${smooth(under).slice(1)} Z`, { fill: C.white, opacity: op }) +
    circle(cx + w * 0.16, top(cx + w * 0.16) + 2, 4, { fill: C.white, opacity: op * 0.8 }) +
    circle(cx + w * 0.2, top(cx + w * 0.2) + 6, 2.6, { fill: C.white, opacity: op * 0.7 });
}

// ---------------------------------------------------------------- the ark
function ark(id, R) {
  const x0 = 500;
  const half = 318;
  const top = (u) => 604 - 120 * Math.abs(u) ** 7;
  const bottom = (u) => top(u) + 118 * Math.max(0, 1 - u * u) ** 0.62;
  const X = (u) => x0 + u * half;
  const N = 36;
  const topPts = [];
  const botPts = [];
  for (let i = 0; i <= N; i++) {
    const u = -1 + (2 * i) / N;
    topPts.push([X(u), top(u)]);
    botPts.push([X(u), bottom(u)]);
  }
  const hullD = `${smooth(topPts)} L${smooth(botPts.slice().reverse()).slice(1)} Z`;
  let defs = `<clipPath id="${id('hullClip')}"><path d="${hullD}"/></clipPath>`;
  defs += linear(id('hullLight'), [[0, '#3B3A5C', 0.38], [0.45, '#3B3A5C', 0.08], [0.7, '#FFE2A8', 0.0], [1, '#FFE2A8', 0.35]], { x1: 182, y1: 0, x2: 818, y2: 0, units: 'userSpaceOnUse' });
  let out = '';
  // planks: curved bands between the gunwale and the keel
  const seams = [0, 0.19, 0.38, 0.57, 0.76, 1.0];
  const band = (t) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const u = -1.04 + (2.08 * i) / N;
      const uc = clamp(u, -1, 1);
      pts.push([X(u), top(uc) + (bottom(uc) - top(uc)) * t + (t === 1 ? 6 : 0)]);
    }
    return pts;
  };
  let planks = '';
  const cols = [C.wood1, mix(C.wood1, C.wood2, 0.45), C.wood1, mix(C.wood1, C.wood2, 0.45), C.wood1];
  for (let k = 0; k < seams.length - 1; k++) {
    const a = band(seams[k]);
    const b = band(seams[k + 1]);
    planks += path(`${smooth(a)} L${smooth(b.slice().reverse()).slice(1)} Z`, { fill: cols[k] });
  }
  // plank seams with rows of nails, and staggered butt joints
  for (let k = 1; k < seams.length - 1; k++) {
    const pts = band(seams[k]);
    planks += path(smooth(pts), { fill: 'none', stroke: C.wood3, 'stroke-width': 3, opacity: 0.7 });
    for (let i = 1; i < N; i += 2) {
      const [nx, ny] = pts[i];
      planks += circle(nx, ny + 6, 2.6, { fill: C.wood4 }) + circle(nx - 0.8, ny + 5.2, 0.9, { fill: C.wood0, opacity: 0.8 });
    }
    for (let i = 3 + (k % 2) * 3; i < N - 2; i += 6) {
      const [jx, jy] = pts[i];
      const [, jy2] = band(seams[k + 1])[i];
      planks += path(`M${r1(jx)},${r1(jy)} L${r1(jx)},${r1(jy2)}`, { stroke: C.wood3, 'stroke-width': 2.4, opacity: 0.55 });
      planks += circle(jx + 6, (jy + jy2) / 2, 2.4, { fill: C.wood4 }) + circle(jx - 6, (jy + jy2) / 2, 2.4, { fill: C.wood4 });
    }
  }
  // a little light on top of each plank
  for (let k = 0; k < seams.length - 1; k++) planks += path(smooth(band(seams[k] + 0.02)), { fill: 'none', stroke: C.wood0, 'stroke-width': 2.4, opacity: 0.55 });
  planks += rect(150, 500, 700, 260, { fill: `url(#${id('hullLight')})` });
  out += g({ 'clip-path': `url(#${id('hullClip')})` }, planks);
  // the gunwale rail and the curled stem and stern posts
  out += path(smooth(topPts), { fill: 'none', stroke: C.wood3, 'stroke-width': 13, 'stroke-linecap': 'round' });
  out += path(smooth(topPts), { fill: 'none', stroke: C.wood2, 'stroke-width': 6, 'stroke-linecap': 'round' });
  // stem and stern posts
  for (const sg of [-1, 1]) {
    // follow the hull's own end curve, then rise a little past the tip
    const along = [0.84, 0.9, 0.95, 0.985].map((u) => [X(sg * u), bottom(sg * u) - 3]);
    const post = smooth([...along, [X(sg), top(sg) - 2], [X(sg * 1.03), top(sg) - 26], [X(sg * 1.075), top(sg) - 36], [X(sg * 1.1), top(sg) - 30]]);
    out += path(post, { fill: 'none', stroke: C.wood3, 'stroke-width': 18, 'stroke-linecap': 'round' });
    out += path(post, { fill: 'none', stroke: C.wood2, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.8 });
  }
  return { defs, out, top, X };
}

// ---------------------------------------------------------------- the scene
export default function render() {
  const id = ids('s04');
  const R = rng(404);
  const hz = { x1: 0, y1: 0, x2: 1000, y2: 0, units: 'userSpaceOnUse' };
  const A = ark(id, R);
  const seaBand = (name, storm, sunny) => linear(id(name), [[0, storm], [0.35, storm], [0.72, sunny], [1, sunny]], hz);
  const defs = [
    linear(id('sky'), [[0, '#7F8FAD'], [0.32, '#A3AFC4'], [0.55, '#E9DCC4'], [0.78, '#FFE4AE'], [1, '#FFEFCB']], { x1: 0, y1: 0, x2: 1000, y2: 300, units: 'userSpaceOnUse' }),
    radial(id('break'), [[0, '#FFF6DA', 0.95], [0.4, '#FFE7AE', 0.5], [1, '#FFE7AE', 0]]),
    glowDef(id('sunGlow'), '#FFF1C4', 0.9),
    glowDef(id('arkGlow'), '#FFE9B4', 0.5),
    seaBand('sea0', '#93A9BF', '#A8DCDC'),
    seaBand('sea1', '#6E8FAD', '#6FC7CF'),
    seaBand('sea2', '#5B80A2', '#4DB3C5'),
    seaBand('sea3', '#4D7499', '#3AA2BC'),
    seaBand('sea4', '#416890', '#2F90AE'),
    seaBand('sea5', '#375D86', '#2A7FA0'),
    linear(id('roof'), [[0, C.wood3], [1, C.wood2]], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    radial(id('windowIn'), [[0, '#7A5440'], [1, '#3E2A2E']], { cx: 0.5, cy: 0.7, r: 0.7 }),
    vignetteDef(id('vig'), C.ink, 0.22),
    A.defs,
  ].join('');

  let body = '';
  // ------------------------------------------------------------ sky: storm left, sunshine right
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += ellipse(820, 230, 360, 300, { fill: `url(#${id('break')})` });
  body += rays(812, 170, { n: 8, len: 900, spread: 58, dir: 128, width: 5, color: '#FFF3D0', op: 0.2 });
  body += sun(812, 170, 54, { fill: '#FFE6A2', core: '#FFF7DE', glowId: id('sunGlow') });
  // parting clouds with golden edges
  body += cloud(700, 120, 220, { fill: '#F6EEDF', shade: '#D9CDBE', seed: 4, opacity: 0.95 });
  body += cloud(960, 250, 200, { fill: '#F9F1E4', shade: '#DED1C0', seed: 7, opacity: 0.95 });
  body += cloud(900, 70, 180, { fill: '#F3E9D9', shade: '#D2C5B6', seed: 2, opacity: 0.9 });
  // rain, kept off the ark
  for (let i = 0; i < 120; i++) {
    const x = -20 + R() * 560;
    const y = 190 + R() * 430;
    if (((x - 500) / 340) ** 2 + ((y - 500) / 250) ** 2 < 1) continue;
    if (x > 330 + (y - 200) * 0.2) continue;
    const L = R.range(22, 40);
    body += path(`M${r1(x)},${r1(y)} l${r1(-L * 0.22)},${r1(L)}`, { stroke: '#E1E9F4', 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: r1(R.range(0.35, 0.65) * 100) / 100 });
  }
  // heavy rain clouds on the left
  body += cloud(150, 150, 360, { fill: '#6F7F9C', shade: '#56657F', seed: 3 });
  body += cloud(420, 110, 300, { fill: '#7D8CA6', shade: '#63728C', seed: 5 });
  body += cloud(40, 250, 260, { fill: '#62718F', shade: '#4C5A76', seed: 8 });
  body += cloud(330, 230, 240, { fill: '#8695AE', shade: '#6D7B95', seed: 9, opacity: 0.95 });
  body += cloud(570, 200, 170, { fill: '#B3B9C8', shade: '#9AA1B3', seed: 6, opacity: 0.9 });
  body += farBird(720, 330, 1, '#8A7A6A', 0.45) + farBird(752, 314, 0.8, '#8A7A6A', 0.4);

  // ------------------------------------------------------------ the far sea and al-Judi
  body += path('M820,548 C850,520 880,488 906,476 C922,470 934,474 948,490 C966,508 990,530 1010,548Z', { fill: '#9DB5B4' });
  body += path('M906,476 C922,470 934,474 948,490 C960,502 972,514 984,526 C960,516 940,500 926,494 C916,490 908,484 906,476Z', { fill: '#FFE6B0', opacity: 0.8 });
  body += path('M906,476 C900,500 902,524 896,548 L1010,548 C990,530 966,508 948,490 C934,474 922,470 906,476Z', { fill: '#86A1A6', opacity: 0.5 });
  body += path(waveBand(548, { amp: 3, len: 120, phase: 10 }), { fill: `url(#${id('sea0')})` });
  body += shimmer(800, 560, { n: 5, w: 160, gap: 10, color: '#FFF4D6', op: 0.8, seed: 2 });
  const rowA = swells(592, { w: 170, h: 14, phase: 40 });
  body += path(rowA.d, { fill: `url(#${id('sea1')})` });
  for (const cx of rowA.crests) body += foamCap(cx, rowA.top, 170, { op: 0.35 });

  // ------------------------------------------------------------ waves behind the ark
  const rowB = swells(648, { w: 250, h: 30, phase: 90 });
  body += path(rowB.d, { fill: `url(#${id('sea2')})` });
  for (const cx of rowB.crests) body += foamCap(cx, rowB.top, 250, { op: 0.55 });

  // ------------------------------------------------------------ the ark
  body += glow(600, 500, 420, id('arkGlow'));
  let arkBody = '';
  // giraffes behind the roof
  arkBody += giraffe(352, 470, { s: 1.0, neckH: 170 });
  arkBody += giraffe(402, 470, { s: 0.92, neckH: 150 });
  // cabin walls
  arkBody += rect(298, 470, 404, 140, { fill: C.wood0 });
  for (let x = 318; x < 700; x += 26) arkBody += path(`M${x},472 L${x},608`, { stroke: C.wood1, 'stroke-width': 2.4, opacity: 0.7 });
  arkBody += rect(560, 470, 142, 140, { fill: '#FFF0C8', opacity: 0.18 });
  arkBody += rect(298, 470, 70, 140, { fill: '#3B3A5C', opacity: 0.12 });
  // two wide windows: lions on the left, elephants on the right
  const win = (wx, ww) => path(`M${wx},590 L${wx},530 Q${wx + ww / 2},486 ${wx + ww},530 L${wx + ww},590Z`, { fill: `url(#${id('windowIn')})` });
  arkBody += win(330, 150) + win(520, 160);
  arkBody += rect(322, 584, 166, 12, { rx: 4, fill: C.wood2 }) + rect(512, 584, 176, 12, { rx: 4, fill: C.wood2 });
  arkBody += lion(372, 590, { s: 0.98, tilt: -6 }) + lion(438, 590, { s: 0.9, tilt: 6, mane: C.coral1 });
  arkBody += elephant(566, 586, { s: 0.92, tilt: -5 }) + elephant(640, 586, { s: 0.86, tilt: 6 });
  // roof
  arkBody += path('M276,486 Q300,456 500,410 Q700,456 724,486 L724,494 L276,494Z', { fill: `url(#${id('roof')})` });
  arkBody += path('M276,486 Q300,456 500,410 Q700,456 724,486', { fill: 'none', stroke: C.wood4, 'stroke-width': 6, 'stroke-linecap': 'round' });
  arkBody += path('M300,470 Q400,440 500,420 M330,480 Q420,456 500,440 M500,420 Q600,440 700,470 M500,440 Q580,456 670,480', { fill: 'none', stroke: C.wood3, 'stroke-width': 3, opacity: 0.6 });
  arkBody += path('M500,412 Q620,436 716,480', { fill: 'none', stroke: C.wood1, 'stroke-width': 4, opacity: 0.6, 'stroke-linecap': 'round' });
  for (const nx of [330, 390, 450, 550, 610, 670]) arkBody += circle(nx, 486 - Math.abs(nx - 500) * 0.0 - (nx < 500 ? (nx - 276) * 0.2 : (724 - nx) * 0.2) + 2, 2.6, { fill: C.wood4 });
  // the pair of little birds on the ridge
  arkBody += bird(552, 424, { s: 0.42, flip: true, body: C.sky0, wing: C.water3, belly: C.sky2, beak: C.gold2 });
  arkBody += bird(600, 434, { s: 0.42, flip: true, body: C.coral2, wing: C.coral3, belly: C.coral0, beak: C.gold2 });
  // hull
  arkBody += A.out;
  // the rabbits peeking over the bow rail
  arkBody += bunnyPeek(706, 598, { s: 1.0, tilt: -4 }) + bunnyPeek(744, 594, { s: 0.92, tilt: 8, fur: '#E8D5C0', shade: '#CDB49B' });
  // a soft light on the side facing the sun
  arkBody += sparkle(760, 470, 12, '#FFF6DC') + sparkle(680, 400, 9, '#FFF6DC') + sparkle(840, 520, 8, '#FFF6DC');
  body += g({ transform: 'translate(500 604) scale(1.08) translate(-500 -580)' }, arkBody);

  // ------------------------------------------------------------ waves in front
  const rows = [
    [swells(722, { w: 300, h: 44, phase: 150 }), 'sea3', 300, 0.85],
    [swells(812, { w: 340, h: 58, phase: 20 }), 'sea4', 340, 0.85],
    [swells(912, { w: 380, h: 64, phase: 250 }), 'sea5', 380, 0.8],
  ];
  for (const [row, fill, w, op] of rows) {
    body += path(row.d, { fill: `url(#${id(fill)})` });
    body += path(smooth(Array.from({ length: 60 }, (_, i) => -40 + i * 19).map((x) => [x, row.top(x) + 14])), { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.18 });
    for (const cx of row.crests) body += foamCap(cx, row.top, w, { op });
  }
  body += shimmer(840, 744, { n: 4, w: 130, gap: 14, color: '#FFF0C4', op: 0.6, seed: 5 });
  // spray at the bow
  for (const [dx, dy, dr] of [[828, 668, 5], [846, 650, 3.5], [812, 652, 3], [858, 676, 4], [190, 676, 4], [170, 662, 3]]) body += circle(dx, dy, dr, { fill: C.white, opacity: 0.8 });
  for (let i = 0; i < 14; i++) body += circle(R() * 1000, 900 + R() * 90, R.range(2, 4.5), { fill: C.white, opacity: r1(R.range(0.3, 0.6) * 100) / 100 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
