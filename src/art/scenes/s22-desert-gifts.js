// Gifts in the desert (Quran 2:57, 2:60, 7:160).
// The Sinai desert: a big rock with exactly twelve springs gushing from it into
// twelve rivulets; soft white clouds giving shade, their shadows on the sand;
// round brown quails; manna like sweet white-gold drops on low bushes; twelve
// small tents in the distance. Mercy and refreshment.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, farBird, grass, flower, r1, eye, T,
} from '../lib.js';

const SPRINGS = 12;
const TENTS = 12;

// Plump little quail, facing right. (x, y) = feet.
function quail(x, y, { s = 1, flip = false, peck = false } = {}) {
  const brown = '#B07D52';
  const dark = '#7E5638';
  const cream = '#F6E3C2';
  const head = peck ? [44, -38] : [36, -66];
  const parts = [
    ellipse(2, 2, 42, 7, { fill: C.ink, opacity: 0.14 }),
    path('M-6,-6 L-8,2 M8,-6 L10,2', { stroke: '#E0896A', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }),
    path('M-40,-40 L-56,-46 L-50,-30Z', { fill: dark }),
    ellipse(0, -34, 44, 31, { fill: brown }),
    ellipse(8, -24, 30, 18, { fill: '#DDB78C' }),
    path('M-36,-44 C-26,-62 4,-64 16,-46 C8,-30 -20,-26 -38,-34Z', { fill: dark }),
  ];
  // scalloped feather marks on the wing and speckles on the body
  for (const [a, b] of [[-24, -46], [-12, -50], [0, -48], [-18, -38], [-6, -40], [6, -38]]) parts.push(path(`M${a - 5},${b} Q${a},${b + 5} ${a + 5},${b}`, { fill: 'none', stroke: cream, 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0.85 }));
  for (const [a, b] of [[20, -38], [26, -28], [14, -18], [30, -44], [-30, -22], [-20, -16]]) parts.push(circle(a, b, 2, { fill: cream, opacity: 0.8 }));
  // head with a cream stripe over the eye
  const [hx, hy] = head;
  parts.push(path(`M${hx - 18},${hy + 14} C${hx - 14},${hy + 20} ${hx - 6},${hy + 24} ${hx},${hy + 18}`, { fill: 'none', stroke: brown, 'stroke-width': 18, 'stroke-linecap': 'round' }));
  parts.push(circle(hx, hy, 19, { fill: brown }));
  parts.push(path(`M${hx - 16},${hy - 6} C${hx - 8},${hy - 22} ${hx + 8},${hy - 22} ${hx + 16},${hy - 8}`, { fill: dark }));
  parts.push(path(`M${hx - 15},${hy - 2} Q${hx},${hy - 12} ${hx + 16},${hy - 4}`, { fill: 'none', stroke: cream, 'stroke-width': 3.4, 'stroke-linecap': 'round' }));
  parts.push(path(`M${hx + 17},${hy - 2} L${hx + 28},${hy + 3} L${hx + 17},${hy + 7}Z`, { fill: '#6E5444' }));
  parts.push(eye(hx + 7, hy + 1, 3.8));
  parts.push(ellipse(hx + 9, hy + 11, 5, 3, { fill: C.cheek, opacity: 0.75 }));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// A plump quail gliding down, wings spread, facing right. (x, y) = body centre.
function flyingQuail(x, y, { s = 1, flip = false, rot = 12, up = true } = {}) {
  const brown = '#B07D52';
  const dark = '#7E5638';
  const cream = '#F6E3C2';
  const wing = up ? 'M-8,-8 C-20,-40 -2,-62 18,-66 C16,-52 14,-30 12,-8Z' : 'M-8,4 C-22,30 -6,50 14,52 C12,38 12,20 10,4Z';
  const farWing = up ? 'M-2,-10 C-6,-34 10,-52 28,-56 C24,-40 20,-24 14,-8Z' : 'M0,4 C-6,26 8,42 24,44 C20,30 18,16 14,4Z';
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${flip ? -s : s} ${s})` },
    path(farWing, { fill: dark }),
    path('M-34,-4 L-50,-12 L-48,6Z', { fill: dark }),
    ellipse(0, 0, 36, 22, { fill: brown }),
    ellipse(6, 8, 24, 12, { fill: '#DDB78C' }),
    circle(30, -12, 15, { fill: brown }),
    path('M17,-18 C24,-30 38,-30 44,-18', { fill: dark }),
    path('M18,-14 Q30,-22 44,-15', { fill: 'none', stroke: cream, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    path('M44,-12 L53,-8 L44,-5Z', { fill: '#6E5444' }),
    eye(37, -10, 3.2),
    ellipse(38, -2, 4, 2.4, { fill: C.cheek, opacity: 0.75 }),
    path(wing, { fill: brown }),
    path(up ? 'M-2,-20 Q6,-24 12,-20 M0,-34 Q8,-40 16,-36' : 'M-2,16 Q6,20 12,16 M0,30 Q8,34 14,32', { fill: 'none', stroke: cream, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.85 }),
  );
}

// Low desert bush beaded with manna: sweet white-gold drops. (x, y) = base.
function mannaBush(x, y, { w = 170, seed = 3, leaf = '#93B67E', dark = '#6F9A6A', light = '#B9D39A' } = {}) {
  const R = rng(seed);
  const lobes = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    lobes.push([x - w * 0.46 + w * 0.92 * t + R.range(-6, 6), y - w * (0.12 + 0.2 * Math.sin(Math.PI * t)) + R.range(-5, 5), w * R.range(0.12, 0.17)]);
  }
  let s = ellipse(x, y + 2, w * 0.55, w * 0.07, { fill: C.ink, opacity: 0.12 });
  s += g({ fill: dark }, lobes.map(([a, b, c]) => circle(a + 3, b + 6, c)), rect(x - w * 0.5, y - w * 0.12, w, w * 0.12, { rx: w * 0.06 }));
  s += g({ fill: leaf }, lobes.map(([a, b, c]) => circle(a, b, c)));
  s += g({ fill: light, opacity: 0.8 }, lobes.slice(1, 6).map(([a, b, c]) => circle(a - c * 0.25, b - c * 0.35, c * 0.45)));
  // the manna drops
  for (let i = 0; i < 26; i++) {
    const [a, b, c] = lobes[Math.floor(R() * lobes.length)];
    const ang = R() * Math.PI * 2;
    const d = Math.sqrt(R()) * c * 0.95;
    const dx = a + Math.cos(ang) * d;
    const dy = b + Math.sin(ang) * d * 0.8;
    const rr = R.range(3.4, 6);
    const drop = `M${r1(dx)},${r1(dy - rr * 1.5)} C${r1(dx + rr * 0.5)},${r1(dy - rr * 0.8)} ${r1(dx + rr)},${r1(dy - rr * 0.2)} ${r1(dx + rr)},${r1(dy + rr * 0.2)} A${r1(rr)},${r1(rr)} 0 0 1 ${r1(dx - rr)},${r1(dy + rr * 0.2)} C${r1(dx - rr)},${r1(dy - rr * 0.2)} ${r1(dx - rr * 0.5)},${r1(dy - rr * 0.8)} ${r1(dx)},${r1(dy - rr * 1.5)}Z`;
    s += path(drop, { fill: C.gold3, opacity: 0.6, transform: 'translate(0.8 1.2)' }) + path(drop, { fill: '#FFEFC2' }) + circle(dx + rr * 0.15, dy + rr * 0.35, rr * 0.55, { fill: C.gold1, opacity: 0.55 }) + circle(dx - rr * 0.32, dy - rr * 0.2, rr * 0.3, { fill: C.white });
  }
  // a few drops fallen on the sand
  for (let i = 0; i < 6; i++) {
    const dx = x + R.range(-w * 0.55, w * 0.55);
    const dy = y + R.range(2, 16);
    s += ellipse(dx, dy, 4.6, 3.2, { fill: '#FFE9B0' }) + circle(dx - 1.4, dy - 1.2, 1.4, { fill: C.white });
  }
  return s;
}

// A small far-off tent. (x, y) = bottom centre.
function smallTent(x, y, w, fill, dark) {
  const h = w * 0.5;
  return (
    path(`M${r1(x - w / 2)},${r1(y)} L${r1(x - w * 0.34)},${r1(y - h * 0.82)} Q${r1(x)},${r1(y - h * 1.08)} ${r1(x + w * 0.34)},${r1(y - h * 0.82)} L${r1(x + w / 2)},${r1(y)}Z`, { fill }) +
    path(`M${r1(x + w * 0.06)},${r1(y - h * 0.94)} Q${r1(x + w * 0.22)},${r1(y - h * 0.92)} ${r1(x + w * 0.34)},${r1(y - h * 0.82)} L${r1(x + w / 2)},${r1(y)} L${r1(x + w * 0.12)},${r1(y)}Z`, { fill: dark, opacity: 0.6 }) +
    path(`M${r1(x - w * 0.08)},${r1(y)} L${r1(x)},${r1(y - h * 0.5)} L${r1(x + w * 0.08)},${r1(y)}Z`, { fill: '#6E4E5E', opacity: 0.85 })
  );
}

export default function render() {
  const id = ids('s22');
  const R = rng(22);
  const defs = [
    linear(id('sky'), [[0, '#62B3D8'], [0.45, '#9ED6EA'], [0.8, '#D9F0F0'], [1, '#F4F2E2']], { x2: 0, y2: 480, units: 'userSpaceOnUse' }),
    glowDef(id('sunGlow'), '#FFF2C6', 0.75),
    linear(id('sand'), [[0, '#F7E2B4'], [0.35, '#F2D398'], [1, '#E9BF79']], { y1: 460, x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    linear(id('rock'), [[0, '#EFC0A4'], [0.5, '#DDA083'], [1, '#C98468']], { x1: 0.2, y1: 0, x2: 0.8, y2: 1 }),
    linear(id('duneShade'), [[0, '#E0B574', 0.8], [1, '#E0B574', 0]]),
    radial(id('wet'), [[0, '#BDE7E2', 0.9], [1, '#BDE7E2', 0]]),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');

  const farTint = (c) => mix(c, '#CFE6EC', 0.5);
  let body = '';
  // ---- sky: a gentle sun behind the clouds of shade
  body += rect(0, 0, 1000, 520, { fill: `url(#${id('sky')})` });
  body += sun(866, 118, 52, { fill: '#FFE6A6', core: '#FFF6DA', glowId: id('sunGlow') });
  body += cloud(250, 190, 330, { fill: C.white, shade: '#DCEBF1', seed: 6 });
  body += cloud(760, 196, 300, { fill: C.white, shade: '#DCEBF1', seed: 13 });
  body += cloud(520, 92, 170, { fill: '#FBFEFE', shade: '#E2EFF3', seed: 2, opacity: 0.9 });
  body += sparkle(600, 250, 9, C.white, { opacity: 0.8 }) + sparkle(120, 300, 7, C.white, { opacity: 0.7 });
  for (const [bx, by, bs] of [[960, 300, 0.8], [930, 316, 0.6]]) body += farBird(bx, by, bs, '#6A86A0', 0.5);
  // quails sent down, gliding toward the bushes (2:57)
  body += flyingQuail(472, 286, { s: 0.78, rot: 14, up: true });
  body += flyingQuail(586, 246, { s: 0.62, rot: 18, up: false });
  body += flyingQuail(370, 236, { s: 0.56, rot: 10, up: false });

  // ---- distant Sinai mountains, hazy rose
  body += path(ridge([[-20, 452], [60, 410], [130, 432], [210, 380], [290, 420], [360, 400], [440, 436], [560, 420], [640, 390], [720, 428], [800, 396], [880, 420], [960, 384], [1020, 404]], 520), { fill: farTint(C.rock1) });
  body += path(ridge([[-20, 470], [120, 450], [260, 462], [420, 446], [600, 458], [760, 444], [900, 456], [1020, 448]], 520), { fill: farTint(C.rock2) });

  // ---- the desert floor
  body += path(ridge([[-20, 482], [160, 470], [340, 478], [520, 468], [700, 476], [880, 466], [1020, 474]], 1000), { fill: `url(#${id('sand')})` });
  body += path(ridge([[-20, 486], [200, 478], [360, 486], [520, 476]], 500), { fill: '#FBEBC9', opacity: 0.7 });

  // ---- soft dunes in the middle distance
  for (const crest of [[[-20, 604], [60, 562], [150, 542], [240, 558], [330, 606]], [[670, 614], [760, 568], [850, 550], [940, 562], [1030, 594]]]) {
    const top = crest[2];
    body += path(smooth(crest) + ` L${crest[4][0]},760 L${crest[0][0]},760Z`, { fill: `url(#${id('sand')})` });
    body += path(`M${top[0]},${top[1]} C${top[0] + 40},${top[1] + 18} ${top[0] + 80},${top[1] + 40} ${top[0] + 120},${top[1] + 80} L${top[0] + 150},${top[1] + 150} L${top[0] + 40},${top[1] + 150} C${top[0] + 40},${top[1] + 80} ${top[0] + 24},${top[1] + 30} ${top[0]},${top[1]}Z`, { fill: `url(#${id('duneShade')})` });
    body += path(smooth(crest.slice(0, 3)), { fill: 'none', stroke: '#FDF0D2', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.85 });
  }

  // ---- twelve small tents in the distance, six on each side of the rock
  const tentCols = [[C.coral1, C.coral2], [C.cream, C.sand2], [C.rose1, C.rose2], [C.sand2, C.sand3], [C.coral0, C.coral1], [C.plum1, C.plum2]];
  for (let i = 0; i < TENTS; i++) {
    const left = i < TENTS / 2;
    const k = left ? i : i - TENTS / 2;
    const x = left ? 64 + k * 38 + (k % 2) * 3 : 744 + k * 38 + (k % 2) * 3;
    const y = 484 + (k % 2) * 7 + (left ? 0 : -2);
    const [f, d] = tentCols[(i * 5) % tentCols.length];
    body += ellipse(x, y + 1, 22, 3, { fill: C.ink, opacity: 0.1 });
    body += smallTent(x, y, 34, mix(f, '#F4E9DA', 0.25), mix(d, '#F4E9DA', 0.25));
  }

  // ---- cloud shadows on the sand (soft, cool patches of shade)
  const cloudShadow = (cx, cy, w, op) => g({ fill: '#8FA3C4', opacity: op },
    ellipse(cx, cy, w * 0.5, w * 0.075), ellipse(cx - w * 0.2, cy - w * 0.04, w * 0.2, w * 0.06), ellipse(cx + w * 0.12, cy - w * 0.055, w * 0.24, w * 0.065), ellipse(cx + w * 0.34, cy - w * 0.02, w * 0.14, w * 0.05));
  body += cloudShadow(170, 586, 360, 0.24);
  body += cloudShadow(830, 600, 340, 0.24);
  body += cloudShadow(170, 880, 520, 0.2);
  body += cloudShadow(850, 900, 480, 0.2);

  // ---- the rock and its twelve springs
  const RX = 500;
  const BASE = 704;
  body += ellipse(RX + 24, BASE + 6, 300, 34, { fill: C.ink, opacity: 0.13 });
  body += ellipse(RX, BASE + 30, 340, 64, { fill: `url(#${id('wet')})` });
  // a great granite boulder: lit facets on the left, shade on the right
  const rockOutline = [[254, 708], [258, 616], [280, 536], [318, 474], [372, 432], [436, 410], [498, 416], [544, 394], [612, 390], [674, 416], [716, 468], [740, 540], [748, 626], [746, 708]];
  body += path(blob(rockOutline), { fill: `url(#${id('rock')})` });
  body += path('M612,392 C664,410 706,456 728,520 C744,580 748,650 746,708 L650,708 C676,640 682,566 670,506 C660,456 640,416 612,392Z', { fill: C.rock3, opacity: 0.42 });
  body += path('M292,560 C306,506 336,462 382,436 C420,416 460,410 498,416 C470,432 436,452 404,478 C368,508 340,546 322,592 C316,610 300,616 292,560Z', { fill: C.rock0, opacity: 0.9 });
  body += path('M500,416 C520,400 546,392 576,390 C600,390 620,394 636,402 C608,404 578,410 552,422 C534,430 516,428 500,416Z', { fill: C.rock0, opacity: 0.75 });
  body += path('M356,470 C384,446 418,428 454,418', { fill: 'none', stroke: C.white, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.5 });
  // facet edges and strata
  body += path('M498,416 C494,446 504,476 494,510 C486,540 496,566 488,590 M612,392 C600,430 616,470 602,512 C592,546 606,574 600,600', { fill: 'none', stroke: C.rock3, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.35 });
  body += path('M270,650 C340,632 420,624 500,624 C580,624 660,632 740,650 M300,520 C330,512 360,512 390,504 M610,500 C640,494 670,500 710,494', { fill: 'none', stroke: C.rock2, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.35 });
  const TR = rng(220);
  for (let i = 0; i < 40; i++) {
    const a = TR() * Math.PI * 2;
    const d = Math.sqrt(TR());
    const px = RX + Math.cos(a) * d * 210;
    const py = 560 + Math.sin(a) * d * 120;
    body += circle(px, py, TR.range(1.4, 3), { fill: TR() < 0.5 ? C.rock3 : C.rock0, opacity: 0.45 });
  }
  // twelve cracks in a wide arc; from each a spring gushes out and down
  const spouts = [];
  for (let i = 0; i < SPRINGS; i++) {
    const c = -1 + (2 * i) / (SPRINGS - 1);
    spouts.push([RX + c * 206, 650 - 76 * Math.sqrt(Math.max(0, 1 - c * c * 0.92)) + (i % 2) * 6, c]);
  }
  // outer springs leap sideways, the middle ones leap toward us and land lower
  const landings = spouts.map(([x, y, c]) => [x + c * 34, BASE + 8 + (1 - Math.abs(c)) * 30]);
  // rivulets fanning out over the sand (drawn first, under the springs)
  for (let i = 0; i < SPRINGS; i++) {
    const t = i / (SPRINGS - 1);
    const a = ((158 - 136 * t) * Math.PI) / 180;
    const [lx, ly] = landings[i];
    const reach = 1040 - ly;
    const L = Math.min(reach / Math.sin(a), 660);
    const ex = lx + Math.cos(a) * L;
    const ey = ly + Math.sin(a) * L;
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    const pts = [];
    for (let k = 0; k <= 10; k++) {
      const u = k / 10;
      const wob = Math.sin(u * Math.PI * 2.4 + i * 1.3) * 16 * u;
      pts.push([lx + (ex - lx) * u + nx * wob, ly + (ey - ly) * u + ny * wob]);
    }
    const band = (w0, w1) => {
      const lft = [];
      const rgt = [];
      pts.forEach(([px, py], k) => {
        const w = w0 + (w1 - w0) * (k / 10);
        lft.push([px + nx * w, py + ny * w]);
        rgt.push([px - nx * w, py - ny * w]);
      });
      return smooth(lft) + ' L' + smooth(rgt.reverse()).slice(1) + 'Z';
    };
    body += path(band(6, 15), { fill: '#D8AB6B', opacity: 0.5 });
    body += path(band(3.6, 10), { fill: '#79CDD6' });
    body += path(band(1.5, 4.2), { fill: '#CFF4F1' });
  }
  for (const [lx, ly] of landings) body += ellipse(lx, ly, 16, 5.5, { fill: '#86D4DA' }) + ellipse(lx - 3, ly - 1.5, 8, 2.2, { fill: C.white, opacity: 0.75 });
  // a tapered stream along a cubic curve: narrow at the mouth, wider as it falls
  const stream = (p0, p1, p2, p3, w0, w1) => {
    const lft = [];
    const rgt = [];
    const N = 14;
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const mt = 1 - t;
      const x = mt ** 3 * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t ** 3 * p3[0];
      const y = mt ** 3 * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t ** 3 * p3[1];
      const dx = 3 * mt * mt * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
      const dy = 3 * mt * mt * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
      const len = Math.hypot(dx, dy) || 1;
      const w = w0 + (w1 - w0) * Math.pow(t, 0.8);
      lft.push([x - (dy / len) * w, y + (dx / len) * w]);
      rgt.push([x + (dy / len) * w, y - (dx / len) * w]);
    }
    return smooth(lft) + ' L' + smooth(rgt.reverse()).slice(1) + 'Z';
  };
  for (let i = 0; i < SPRINGS; i++) {
    const [sx, sy, c] = spouts[i];
    const [lx, ly] = landings[i];
    const D = lx - sx;
    const near = 1 - Math.abs(c);
    // crack in the rock
    body += ellipse(sx, sy, 10, 7, { fill: C.rock4 });
    body += ellipse(sx + c * 2, sy - 1.5, 6.5, 3.8, { fill: '#5E3530' });
    // the gushing water: out of the crack, then down to the sand
    const p0 = [sx, sy];
    const p1 = [sx + D * 0.75, sy - 2];
    const p2 = [lx, sy + (ly - sy) * 0.4];
    const p3 = [lx, ly - 2];
    body += path(stream(p0, p1, p2, p3, 4.2, 7.5 + near * 4), { fill: '#62C1CF' });
    body += path(stream(p0, p1, p2, p3, 2.2, 4 + near * 2.4), { fill: '#C8F1EF' });
    body += path(stream(p0, [sx + D * 0.6, sy - 3], [sx + D * 0.9, sy + (ly - sy) * 0.15], [lx - c * 3, sy + (ly - sy) * 0.45], 1.1, 0.4), { fill: C.white, opacity: 0.95 });
    // foam bursting from the mouth
    body += circle(sx + c * 9, sy - 6, 3.4, { fill: C.white }) + circle(sx + c * 3, sy - 9, 2.4, { fill: C.white, opacity: 0.95 }) + circle(sx + c * 14, sy - 1, 2.2, { fill: C.white, opacity: 0.9 });
    // splash where it lands
    body += ellipse(lx, ly, 14 + near * 4, 4.5, { fill: C.white, opacity: 0.85 });
    body += circle(lx - 11, ly - 8, 3, { fill: C.white, opacity: 0.9 }) + circle(lx + 11, ly - 9, 2.6, { fill: C.white, opacity: 0.9 }) + circle(lx + 1, ly - 14, 2, { fill: C.white, opacity: 0.85 });
  }
  // small rocks resting at its foot
  for (const [bx, by, bw, bh] of [[244, 712, 44, 26], [756, 712, 50, 30], [790, 716, 24, 14], [212, 716, 22, 12]]) {
    body += path(blob([[bx - bw / 2, by], [bx - bw * 0.42, by - bh * 0.7], [bx - bw * 0.05, by - bh], [bx + bw * 0.38, by - bh * 0.75], [bx + bw / 2, by]]), { fill: C.rock2 }) +
      path(blob([[bx - bw * 0.38, by - bh * 0.6], [bx - bw * 0.08, by - bh * 0.92], [bx + bw * 0.18, by - bh * 0.84], [bx, by - bh * 0.5]]), { fill: C.rock0, opacity: 0.8 });
  }
  // fresh grass and flowers along the foot of the rock
  for (const [gx, gy, gh, sd] of [[300, 716, 30, 1], [352, 722, 24, 2], [646, 722, 26, 3], [704, 716, 32, 4], [430, 730, 18, 5], [574, 730, 18, 6]]) body += grass(gx, gy, { h: gh, fill: C.leaf3, n: 5, seed: sd });
  for (const [fx, fy, fc] of [[322, 712, C.rose1], [690, 712, C.coral1], [398, 728, C.gold1], [612, 728, C.rose1]]) body += flower(fx, fy, { r: 7, fill: fc, center: C.gold2 });
  for (const [sx, sy, ss] of [[400, 560, 10], [610, 540, 12], [500, 520, 8], [340, 650, 7], [668, 640, 8], [500, 790, 9]]) body += sparkle(sx, sy, ss, C.white, { opacity: 0.95 });

  // ---- foreground: manna bushes framing the corners, quails in the shade
  body += mannaBush(110, 900, { w: 230, seed: 4 });
  body += mannaBush(900, 880, { w: 210, seed: 9 });
  body += mannaBush(820, 960, { w: 120, seed: 12 });
  body += quail(240, 948, { s: 0.92 });
  body += quail(140, 954, { s: 0.7, peck: true });
  body += quail(760, 796, { s: 0.62, flip: true });
  body += quail(686, 958, { s: 0.78, flip: true, peck: true });
  for (const [sx, sy, ss] of [[70, 800, 9], [170, 820, 7], [930, 790, 9], [850, 810, 6]]) body += sparkle(sx, sy, ss, '#FFF8E0', { opacity: 0.95 });
  // pebbles
  for (const [px, py, pw] of [[420, 960, 14], [470, 990, 9], [570, 880, 10], [300, 840, 9]]) body += ellipse(px, py, pw, pw * 0.55, { fill: C.sand4, opacity: 0.6 }) + ellipse(px - pw * 0.3, py - pw * 0.2, pw * 0.4, pw * 0.2, { fill: C.sand0, opacity: 0.8 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
