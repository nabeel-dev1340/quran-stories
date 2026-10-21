// The Sleepers of the Cave (Quran 18:9-26).
// Night over a rocky mountainside. The cave mouth is soft darkness - the
// sleepers are never shown. Their dog sleeps at the entrance with his
// forelegs stretched out (18:18). Vines and flowers have grown over the
// mouth of the cave to show the long years passing (18:25).
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, starField, crescent, cloud, grass, flower, cypress, frond, tree, bush, shadow, eye, r1, T,
} from '../lib.js';

// night rock colours (moonlight from the upper left)
const RK = { hi: '#8796C8', light: '#6676AC', mid: '#4B5A8F', dark: '#374373', deep: '#28315B' };
const LEAF = { a: '#3D7A74', b: '#57977F', hi: '#86C2A6', stem: '#356A62' };

// A sleeping dog lying down, forelegs stretched far out in front and chin
// resting on them (18:18). Faces right; (x, y) = ground under the belly.
function dog(x, y, { s = 1, flip = false } = {}) {
  const fur = '#EACDA4';
  const light = '#F8EBD5';
  const dark = '#CFA87E';
  const deep = '#A47D59';
  const ear = '#B58A63';
  const muzzle = '#FFF6E8';
  const p = [];
  p.push(ellipse(20, 3, 178, 12, { fill: C.night0, opacity: 0.4 }));
  // fluffy tail lying on the ground behind, tip curled up
  p.push(path('M-96,-36 C-120,-40 -142,-34 -152,-46 C-160,-56 -176,-50 -174,-36 C-172,-16 -150,-4 -120,-2 C-108,-1 -98,-4 -94,-8Z', { fill: fur }));
  p.push(path('M-174,-36 C-172,-18 -150,-6 -120,-4 C-108,-3 -98,-6 -94,-8 L-94,-4 C-100,-1 -110,0 -122,0 C-152,-2 -172,-16 -174,-36Z', { fill: dark, opacity: 0.8 }));
  p.push(path('M-156,-50 C-166,-56 -176,-48 -172,-38 C-168,-46 -162,-48 -150,-44Z', { fill: light, opacity: 0.9 }));
  // far foreleg, stretched out
  p.push(rect(24, -34, 170, 18, { rx: 9, fill: dark }));
  p.push(ellipse(194, -25, 15, 10, { fill: dark }));
  // body
  p.push(path('M-108,-8 C-116,-44 -92,-72 -54,-70 C-30,-69 -14,-64 6,-68 C34,-72 56,-56 58,-34 C60,-14 50,0 32,0 L-96,0 C-104,0 -107,-4 -108,-8Z', { fill: fur }));
  p.push(ellipse(-40, -58, 52, 9, { fill: light, opacity: 0.55, transform: 'rotate(-3 -40 -58)' }));
  p.push(path('M-104,-14 C-60,-4 0,-4 58,-20 C56,-8 46,0 32,0 L-96,0 C-102,0 -106,-6 -104,-14Z', { fill: dark, opacity: 0.55 }));
  // haunch and hind paw tucked forward
  p.push(ellipse(-64, -30, 38, 30, { fill: fur }));
  p.push(path('M-96,-40 C-90,-56 -66,-62 -48,-54 C-62,-54 -82,-50 -96,-40Z', { fill: light, opacity: 0.9 }));
  p.push(path('M-34,-48 C-22,-34 -22,-14 -34,-4', { fill: 'none', stroke: dark, 'stroke-width': 3.4, 'stroke-linecap': 'round', opacity: 0.75 }));
  p.push(ellipse(-20, -7, 24, 8, { fill: light }));
  // near foreleg, stretched out with the paw well in front
  p.push(rect(16, -24, 172, 22, { rx: 11, fill: fur }));
  p.push(path('M34,-21 C80,-25 130,-25 172,-21 C130,-19 80,-19 34,-21Z', { fill: light, opacity: 0.6 }));
  p.push(ellipse(188, -13, 19, 12, { fill: light }));
  p.push(path('M196,-21 L197,-10 M186,-23 L187,-12', { stroke: dark, 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0.8 }));
  // chest fluff
  p.push(path('M40,-50 C50,-44 54,-34 50,-24 C46,-30 42,-38 36,-42Z', { fill: light, opacity: 0.6 }));
  // head resting on the forelegs
  p.push(ellipse(108, -94, 10, 15, { fill: deep, transform: 'rotate(26 108 -94)' }));
  p.push(circle(92, -62, 40, { fill: fur }));
  p.push(ellipse(80, -86, 18, 9, { fill: light, opacity: 0.8, transform: 'rotate(-12 80 -86)' }));
  p.push(ellipse(126, -44, 27, 19, { fill: muzzle }));
  p.push(path('M142,-58 C142,-64 158,-64 158,-57 C158,-51 152,-47 150,-47 C148,-47 142,-51 142,-58Z', { fill: C.ink }));
  p.push(ellipse(147, -59, 3, 1.6, { fill: C.white, opacity: 0.45 }));
  p.push(path('M150,-46 L150,-38 M150,-38 Q144,-32 137,-36', { fill: 'none', stroke: deep, 'stroke-width': 2.4, 'stroke-linecap': 'round' }));
  // floppy ear
  p.push(path('M80,-98 C60,-106 46,-84 50,-60 C52,-42 64,-36 72,-44 C82,-56 90,-80 80,-98Z', { fill: ear }));
  p.push(path('M76,-94 C64,-96 56,-82 58,-66 C62,-76 68,-86 76,-94Z', { fill: light, opacity: 0.35 }));
  // sleeping eye and rosy cheek
  p.push(eye(106, -66, 7, true));
  p.push(ellipse(116, -46, 9, 5.5, { fill: C.cheek, opacity: 0.6 }));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// One leaf, base at (x, y), pointing along angle a (degrees).
function leaf(x, y, size, a, { fill = LEAF.a, light = LEAF.b } = {}) {
  const k = size / 16;
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)}) scale(${r1(k * 100) / 100})` },
    path('M0,0 C3,-6 10,-8 17,0 C10,8 3,6 0,0Z', { fill }),
    path('M0,0 C3,-6 10,-8 17,0 C10,-1 4,-1 0,0Z', { fill: light, opacity: 0.9 }),
  );
}

// A trailing vine hanging from (x, y), with leaves and a few pale flowers.
function vine(x, y, len, { seed = 1, sway = 12, flowers = 2, cols = [C.white] } = {}) {
  const R = rng(seed);
  const ph = R() * Math.PI * 2;
  const at = (t) => [x + Math.sin(t * 3.2 + ph) * sway * t, y + len * t];
  const pts = [];
  for (let i = 0; i <= 10; i++) pts.push(at(i / 10));
  let s = path(smooth(pts), { fill: 'none', stroke: LEAF.stem, 'stroke-width': 2.4, 'stroke-linecap': 'round' });
  const nl = Math.max(3, Math.round(len / 15));
  for (let i = 0; i < nl; i++) {
    const t = (i + 0.6) / nl;
    const [px, py] = at(t);
    const side = i % 2 ? 1 : -1;
    const ang = side > 0 ? R.range(15, 55) : R.range(125, 165);
    s += leaf(px, py, R.range(12, 17) * (1 - t * 0.25), ang, R() < 0.5 ? {} : { fill: LEAF.b, light: LEAF.hi });
  }
  const [tx, ty] = at(1);
  s += leaf(tx, ty, 12, 90 + R.range(-20, 20), { fill: LEAF.b, light: LEAF.hi });
  for (let i = 0; i < flowers; i++) {
    const t = 0.35 + (0.6 * (i + R.range(0.2, 0.8))) / flowers;
    const [px, py] = at(Math.min(0.98, t));
    s += flower(px + R.range(-5, 5), py, { r: R.range(7, 10), fill: cols[i % cols.length], center: C.gold1, rot: R.range(0, 70) });
  }
  return s;
}

// A small glowing firefly.
const firefly = (x, y, glowId, r = 3) => circle(x, y, r * 6, { fill: `url(#${glowId})` }) + circle(x, y, r, { fill: '#FFF4B8' });

// Points round an uneven arch: bottom-left, up and over, down to bottom-right.
function archPts(cx, base, w, h, seed, jit = 6) {
  const R = rng(seed);
  const pts = [[cx - w / 2 + R.range(-2, 2), base]];
  for (let i = 0; i <= 12; i++) {
    const th = Math.PI - (Math.PI * i) / 12;
    const sx = Math.cos(th);
    const sy = Math.sin(th);
    const j = i === 0 || i === 12 ? 0 : R.range(-jit, jit);
    pts.push([cx + sx * (w / 2) + j * 0.6, base - h * 0.28 - sy * h * 0.72 + j]);
  }
  pts.push([cx + w / 2 + R.range(-2, 2), base]);
  return pts;
}
const archPath = (pts) => smooth(pts) + 'Z';

// Point at fraction t along a polyline.
function along(pts, t) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    segs.push(l);
    total += l;
  }
  let d = t * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const k = Math.min(1, d / segs[i]);
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
}

// Rounded boulder lit from the upper left. (x, y) = bottom centre.
function boulder(bx, by, w, h, sd, { mid = RK.mid, light = RK.light, dark = RK.dark, hi = RK.hi } = {}) {
  const Rb = rng(sd);
  const pts = [[bx - w / 2, by], [bx - w * 0.5, by - h * 0.5], [bx - w * 0.22, by - h * Rb.range(0.92, 1)], [bx + w * 0.2, by - h * Rb.range(0.86, 1)], [bx + w * 0.5, by - h * 0.46], [bx + w / 2, by]];
  return path(blob(pts), { fill: mid }) +
    path(blob([[bx - w * 0.47, by - h * 0.3], [bx - w * 0.32, by - h * 0.84], [bx + w * 0.05, by - h * 0.93], [bx - w * 0.12, by - h * 0.62]]), { fill: light, opacity: 0.9 }) +
    path(blob([[bx + w * 0.05, by], [bx + w * 0.26, by - h * 0.62], [bx + w * 0.48, by - h * 0.42], [bx + w / 2, by]]), { fill: dark, opacity: 0.8 }) +
    ellipse(bx - w * 0.2, by - h * 0.78, w * 0.12, h * 0.06, { fill: hi, opacity: 0.6 });
}

// A rock shelf on the cliff face: a moonlit top lip over a shadowed band.
function shelf(x0, x1, y, th) {
  const top = `M${x0},${y} C${x0 + 24},${y - th} ${x1 - 24},${y - th - 4} ${x1},${y - 2} C${x1 - 30},${y + 3} ${x0 + 30},${y + 4} ${x0},${y}Z`;
  const shade = `M${x0 + 6},${y + 2} C${x0 + 40},${y + 5} ${x1 - 40},${y + 4} ${x1 - 4},${y + 1} C${x1 - 30},${y + th * 1.4} ${x0 + 40},${y + th * 1.5} ${x0 + 6},${y + 2}Z`;
  return path(shade, { fill: RK.deep, opacity: 0.5 }) + path(top, { fill: RK.light });
}

// Night cloud with a moonlit silver edge.
const nightCloud = (x, y, w, seed, op = 0.7) =>
  cloud(x - w * 0.025, y - w * 0.03, w, { fill: '#8D9DD2', seed, opacity: op * 0.55 }) + cloud(x, y, w, { fill: '#4A5C97', shade: '#3B4B83', seed, opacity: op });

export default function render() {
  const id = ids('s32');
  const R = rng(32);
  const defs = [
    linear(id('sky'), [[0, '#0F1836'], [0.38, '#1C2A5A'], [0.68, '#33467F'], [0.86, '#53669F'], [1, '#6A7BB0']]),
    linear(id('rock'), [[0, '#6474AA'], [0.4, '#4E5E94'], [1, '#3C487A']], { x1: 150, y1: 300, x2: 1000, y2: 700, units: 'userSpaceOnUse' }),
    radial(id('cave'), [[0, '#080C1E'], [0.6, '#0F1636'], [1, '#1E2A54']], { cx: 0.5, cy: 0.9, r: 0.8 }),
    glowDef(id('moonGlow'), '#DCE4FF', 0.55),
    glowDef(id('pool'), '#C9D4FF', 0.5),
    glowDef(id('mercy'), '#F3EFFF', 0.45),
    glowDef(id('fly'), '#FFE98A', 0.75),
    linear(id('ledge'), [[0, '#55649B'], [0.15, '#45548A'], [1, '#2A3461']]),
    vignetteDef(id('vig'), C.night0, 0.3),
  ].join('');

  let body = '';
  // ---- sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += circle(215, 185, 280, { fill: `url(#${id('moonGlow')})` });
  body += starField({ seed: 32, n: 75, area: [0, 0, 1000, 620], twinkles: 9, color: '#E8EDFF', gold: '#FFE9B0', avoid: [[215, 185, 120]] });
  body += nightCloud(470, 318, 220, 4, 0.75);
  body += nightCloud(700, 112, 150, 7, 0.5);
  body += nightCloud(70, 420, 150, 9, 0.5);
  body += crescent(215, 185, 72, { fill: '#F5F2E8', angle: -28, thickness: 0.46 });

  // ---- far hills (hazy, toward the sky colour)
  body += path(ridge([[-20, 600], [70, 572], [170, 588], [270, 556], [380, 590], [460, 610]]), { fill: '#56689F' });
  body += path(ridge([[-20, 668], [90, 636], [200, 652], [300, 628], [420, 660]]), { fill: '#43558B' });
  for (const [hx, hy, h] of [[60, 652, 70], [92, 646, 54], [250, 640, 66], [282, 634, 48], [330, 636, 58]]) body += cypress(hx, hy + 10, { h, w: h * 0.26, fill: '#34457B', light: '#3F5189' });
  body += ellipse(170, 692, 240, 20, { fill: '#9AA9D8', opacity: 0.16 });
  body += path(ridge([[-20, 742], [110, 714], [230, 730], [330, 708]]), { fill: '#35447B' });

  // ---- the mountainside
  const ridgePts = [[150, 1010], [184, 880], [218, 770], [264, 660], [318, 560], [376, 474], [440, 404], [512, 348], [598, 306], [690, 274], [780, 234], [866, 196], [950, 172], [1030, 160]];
  body += path(ridge(ridgePts, 1010), { fill: `url(#${id('rock')})` });
  body += path(smooth(ridgePts.slice(1, 12)), { fill: 'none', stroke: RK.hi, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 });
  // a little tree and rocks up on the ridge, standing out against the sky
  body += tree(712, 286, { r: 46, trunkH: 34, seed: 5, leaf: '#2E5A63', leafDark: '#24485A', leafLight: '#3F6E72', trunk: '#2C3560' });
  body += shadow(870, 212, 120, 0.3, RK.deep) + boulder(870, 212, 110, 64, 3, { mid: '#46558A', light: '#5A6AA0', hi: '#7787BC' });
  body += shadow(966, 190, 90, 0.3, RK.deep) + boulder(966, 190, 84, 50, 4, { mid: '#425085', light: '#56659B', hi: '#7383B8' });
  body += shadow(946, 640, 220, 0.35, RK.deep) + boulder(946, 640, 210, 150, 5, { mid: '#4A5A8F' });
  body += shadow(290, 690, 110, 0.3, RK.deep) + boulder(292, 690, 100, 64, 6);
  for (const d of ['M780,300 C790,350 776,400 792,450', 'M900,300 C890,350 906,400 896,470']) body += path(d, { fill: 'none', stroke: RK.deep, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.35 });
  for (const [gx, gy, sd] of [[656, 300, 1], [790, 236, 2], [930, 210, 3], [1000, 196, 4], [870, 640, 5], [340, 688, 6], [560, 330, 7]]) body += grass(gx, gy, { h: 22, n: 5, fill: '#2F5E62', seed: sd });
  for (const [bx, by, bw] of [[612, 318, 60], [770, 250, 54], [988, 470, 60]]) body += bush(bx, by, { w: bw, fill: '#356468', dark: '#2A5059', light: '#4A7C78', seed: bx });

  // ---- the cave mouth
  const cx = 596;
  const base = 816;
  const rimPts = archPts(cx, base + 6, 540, 456, 11, 9);
  const innerPts = archPts(cx, base, 486, 414, 12, 5);
  body += path(archPath(rimPts), { fill: RK.deep });
  body += path(archPath(innerPts.map(([px, py]) => [px + 18, py])), { fill: RK.dark });
  body += path(archPath(innerPts), { fill: `url(#${id('cave')})` });
  // the cave goes deeper: a darker inner opening and a faint floor
  body += path(archPath(archPts(cx + 34, base - 14, 250, 240, 13, 3)), { fill: '#070A1A', opacity: 0.55 });
  body += ellipse(cx, base - 8, 220, 18, { fill: '#1C2550', opacity: 0.8 });
  // moonlit lip round the upper-left of the arch
  body += path(smooth(rimPts.slice(1, 9)), { fill: 'none', stroke: RK.hi, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.5 });

  // boulders flanking the entrance
  body += boulder(318, 836, 170, 200, 21);
  body += boulder(884, 842, 220, 230, 22);

  // ---- vines and flowers grown over the mouth (long years have passed)
  const flowerCols = ['#F7F4FF', '#DCCDF7', '#F8D3E3', '#F7F4FF'];
  const rimTop = rimPts.slice(1, 14);
  // climbing vines up both sides of the arch, hugging the rim
  for (const [t0, t1, sd, dx] of [[0, 0.36, 61, -12], [1, 0.64, 62, 12]]) {
    const Rv = rng(sd);
    const climb = [];
    for (let i = 0; i <= 10; i++) {
      const [px, py] = along(rimTop, lerpT(t0, t1, i / 10));
      climb.push([px + dx + Math.sin(i * 1.3) * 6, py]);
    }
    climb.unshift([climb[0][0], 830]);
    body += path(smooth(climb), { fill: 'none', stroke: LEAF.stem, 'stroke-width': 3, 'stroke-linecap': 'round' });
    climb.forEach(([vx, vy], i) => {
      body += leaf(vx, vy, Rv.range(14, 19), Rv.range(150, 210) + (dx > 0 ? 180 : 0), { fill: LEAF.a, light: LEAF.b });
      body += leaf(vx, vy - 10, Rv.range(12, 17), Rv.range(-40, 40) + (dx > 0 ? 180 : 0) + 180, { fill: LEAF.b, light: LEAF.hi });
      if (i % 3 === 2) body += flower(vx + dx * 0.6, vy - 4, { r: 9, fill: flowerCols[i % 4], center: C.gold1 });
    });
  }
  // a mat of leaves along the top of the arch, thickest at the crown
  for (let i = 0; i < 70; i++) {
    const t = 0.2 + 0.6 * R();
    const [tx, ty] = along(rimTop, t);
    const thick = 1 - Math.abs(t - 0.5) * 1.6;
    body += leaf(tx + R.range(-14, 14), ty + R.range(-22, 10) * thick, R.range(14, 20), R.range(0, 360), R() < 0.5 ? {} : { fill: LEAF.b, light: LEAF.hi });
  }
  // hanging strands of different lengths
  const hang = [[0.22, 90], [0.27, 170], [0.33, 120], [0.38, 230], [0.45, 105], [0.5, 190], [0.55, 260], [0.6, 130], [0.66, 210], [0.71, 100], [0.77, 160]];
  hang.forEach(([t, len], i) => {
    const [hx, hy] = along(rimTop, t);
    body += vine(hx, hy + 4, len, { seed: 40 + i, sway: R.range(8, 16), flowers: len > 180 ? 3 : len > 100 ? 2 : 1, cols: flowerCols.slice(i % 3) });
  });
  // flowers sitting in the leaf mat
  for (let i = 0; i < 12; i++) {
    const [tx, ty] = along(rimTop, 0.24 + (0.52 * i) / 11);
    body += flower(tx + R.range(-8, 8), ty + R.range(-12, 4), { r: R.range(9, 13), fill: flowerCols[i % flowerCols.length], center: C.gold1, rot: R.range(0, 60) });
  }

  // ---- the ledge in front of the cave
  body += path('M150,1010 C190,900 230,840 300,822 C420,806 760,804 900,822 C960,830 1000,836 1010,840 L1010,1010Z', { fill: `url(#${id('ledge')})` });
  body += path('M300,822 C420,806 760,804 900,822 C960,830 1000,836 1010,840 L1010,848 C960,842 900,834 780,828 C640,820 440,822 300,830 C270,834 250,842 236,852 C250,836 270,826 300,822Z', { fill: '#7383B8', opacity: 0.6 });
  body += circle(600, 820, 280, { fill: `url(#${id('pool')})` });
  body += path('M200,940 C320,912 520,904 700,910 C840,914 940,926 1010,936 L1010,1010 L170,1010Z', { fill: '#28315D', opacity: 0.75 });
  body += path('M200,940 C320,912 520,904 700,910 C840,914 940,926 1010,936 L1010,944 C940,934 840,922 700,918 C520,912 320,920 200,946Z', { fill: '#7383B8', opacity: 0.35 });
  for (const [fx, fy, sd] of [[330, 930, 11], [520, 918, 12], [690, 920, 13], [600, 916, 14]]) body += grass(fx, fy, { h: 24, n: 5, fill: '#2E5C60', seed: sd });
  for (const [fx, fy, fc, fr] of [[344, 920, '#F7F4FF', 7], [508, 908, '#F8D3E3', 6], [706, 910, '#DCCDF7', 7], [586, 906, '#F7F4FF', 5]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold1 });
  for (const [px, py, pr] of [[330, 852, 7], [356, 860, 4], [770, 846, 6], [800, 856, 4], [720, 874, 5], [450, 868, 5]]) {
    body += ellipse(px, py, pr * 1.4, pr, { fill: RK.light }) + ellipse(px - pr * 0.3, py - pr * 0.3, pr * 0.5, pr * 0.3, { fill: RK.hi, opacity: 0.7 });
  }

  // ---- Allah's care: a soft glow and sparkles round the sleeping dog
  body += circle(600, 760, 240, { fill: `url(#${id('mercy')})` });
  body += dog(574, 830, { s: 1.24 });
  for (const [sx, sy, ss] of [[404, 668, 11], [790, 630, 13], [836, 736, 8], [462, 590, 7], [712, 584, 9], [356, 776, 7]]) body += sparkle(sx, sy, ss, '#F2F0FF', { opacity: 0.9 });

  // ---- flowers and grass along the ledge
  for (const [fx, fy, sd] of [[250, 868, 1], [300, 846, 2], [880, 850, 3], [940, 860, 4], [410, 856, 5], [800, 842, 6]]) body += grass(fx, fy, { h: 30, n: 6, fill: '#2E5C60', seed: sd });
  for (const [fx, fy, fc, fr] of [[262, 852, '#F7F4FF', 9], [292, 836, '#DCCDF7', 8], [902, 838, '#F8D3E3', 9], [930, 848, '#F7F4FF', 8], [400, 846, '#DCCDF7', 7], [818, 832, '#F7F4FF', 7]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold1 });

  // ---- foreground framing rocks, ferns and flowers
  body += path(blob([[-40, 1010], [-30, 900], [40, 860], [140, 870], [220, 930], [250, 1010]]), { fill: '#222A4E' });
  body += path(blob([[-20, 900], [40, 866], [130, 874], [90, 890], [20, 906]]), { fill: '#39467A', opacity: 0.8 });
  body += path(blob([[780, 1010], [810, 940], [900, 900], [990, 910], [1040, 960], [1040, 1010]]), { fill: '#222A4E' });
  body += path(blob([[820, 940], [900, 904], [980, 912], [920, 924], [850, 944]]), { fill: '#39467A', opacity: 0.8 });
  for (const [fx, fy, fa, fl] of [[30, 1010, -70, 230], [70, 1010, -50, 200], [10, 1010, -95, 180], [120, 1010, -38, 150]]) body += frond(fx, fy, fa, fl, { leaf: '#2B5A5C', leafDark: '#204448', droop: 50, width: 0.16, teeth: 11 });
  for (const [fx, fy, fa, fl] of [[970, 1010, -115, 210], [930, 1010, -135, 170], [1000, 1010, -92, 170]]) body += frond(fx, fy, fa, fl, { leaf: '#2B5A5C', leafDark: '#204448', droop: 50, width: 0.16, teeth: 11 });
  body += flower(150, 912, { r: 10, fill: '#DCCDF7', center: C.gold1 }) + flower(178, 930, { r: 8, fill: '#F7F4FF', center: C.gold1 });
  body += flower(842, 936, { r: 9, fill: '#F8D3E3', center: C.gold1 });

  // ---- fireflies
  for (const [fx, fy, fr] of [[300, 690, 3], [236, 790, 2.5], [905, 660, 3], [962, 780, 2.4], [512, 560, 2.2], [130, 830, 2.6], [742, 528, 2.2]]) body += firefly(fx, fy, id('fly'), fr);

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}

const lerpT = (a, b, t) => a + (b - a) * t;
