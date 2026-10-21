// Ayyub, the Patient One (Quran 21:83-84, 38:41-44).
// A cool, sparkling spring gushes up from rocky ground - "this is a cool
// bath and a drink" (38:42). Around it, dry cracked land on the left is
// turning green; on the right there is fresh grass, flowers and a young tree
// in new leaf. A goat and two sheep come happily back to the water.
// Soft morning light: renewal and hope.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob, smooth,
  sparkle, sun, cloud, sheep, bird, farBird, flyingBird, grass, flower, bush, shimmer, eye, T, r1,
} from '../lib.js';

const SKY = '#F6E3CC';
const haze = (c, t = 0.5) => mix(c, SKY, t);

// ---------------------------------------------------------------- helpers
// A rounded boulder with a lit top-left and a shaded lower-right (clipped).
function stone(clipId, pts, { base, light, dark, moss }) {
  const d = blob(pts);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const w = x1 - x0;
  const h = y1 - y0;
  return `<clipPath id="${clipId}"><path d="${d}"/></clipPath>` + path(d, { fill: base }) +
    g({ 'clip-path': `url(#${clipId})` },
      ellipse(x1, y1, w * 0.62, h * 0.7, { fill: dark }),
      ellipse(x0 + w * 0.3, y0 + h * 0.12, w * 0.32, h * 0.22, { fill: light, opacity: 0.85 }),
      moss ? ellipse(x0 + w * 0.6, y0 + h * 0.02, w * 0.3, h * 0.12, { fill: moss, opacity: 0.9 }) : '',
    );
}

// Dry-earth cracks: branching zigzag lines inside an area [x, y, w, h].
function cracks([ax, ay, aw, ah], { color, seed = 3, n = 9 }) {
  const R = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    let x = ax + R() * aw;
    let y = ay + R() * ah;
    const dir = R() * Math.PI * 2;
    const len = 4 + Math.floor(R() * 4);
    d += `M${r1(x)},${r1(y)} `;
    for (let k = 0; k < len; k++) {
      const a = dir + R.range(-0.7, 0.7);
      x += Math.cos(a) * R.range(14, 26);
      y += Math.sin(a) * R.range(5, 10);
      d += `L${r1(x)},${r1(y)} `;
      if (R() < 0.35) {
        const b = a + R.range(0.8, 1.6) * (R() < 0.5 ? -1 : 1);
        d += `l${r1(Math.cos(b) * 14)},${r1(Math.sin(b) * 6)} M${r1(x)},${r1(y)} `;
      }
    }
  }
  return path(d, { fill: 'none', stroke: color, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.7 });
}

// A dry little shrub of bare twigs, with one brave new leaf. (x, y) = base.
function dryShrub(x, y, { s = 1, twig = '#A9825A', leaf = C.leaf2 } = {}) {
  return g({ transform: T(x, y, s) },
    path('M0,0 Q-4,-30 -26,-58 M-8,-26 Q-28,-36 -40,-34 M0,0 Q6,-40 4,-76 M3,-46 Q20,-60 30,-64 M2,0 Q20,-24 40,-38 M24,-28 Q34,-24 44,-14', { fill: 'none', stroke: twig, 'stroke-width': 3.4, 'stroke-linecap': 'round' }),
    ellipse(34, -66, 7, 4, { fill: leaf, transform: 'rotate(-30 34 -66)' }),
  );
}

// A slender young tree in new leaf, with a few blossoms. (x, y) = base.
function youngTree(x, y, { s = 1, seed = 6 } = {}) {
  const R = rng(seed);
  const p = [];
  p.push(path('M-7,0 Q-4,-60 -2,-118 L4,-118 Q6,-60 8,0Z', { fill: C.wood2 }));
  p.push(path('M-2,-82 Q-22,-104 -40,-126 M2,-96 Q22,-118 40,-134 M0,-112 Q-4,-140 -2,-160', { fill: 'none', stroke: C.wood2, 'stroke-width': 5, 'stroke-linecap': 'round' }));
  p.push(path('M3,-118 Q6,-60 8,0 L2,0 Q1,-60 0,-118Z', { fill: C.wood3, opacity: 0.5 }));
  const clumps = [[-46, -138, 38], [0, -170, 44], [46, -146, 38], [-20, -116, 30], [26, -112, 30]];
  p.push(g({ fill: C.leaf3 }, clumps.map(([a, b, c]) => circle(a + 4, b + 6, c))));
  p.push(g({ fill: C.leaf2 }, clumps.map(([a, b, c]) => circle(a, b, c))));
  p.push(g({ fill: C.leaf1, opacity: 0.9 }, clumps.map(([a, b, c]) => circle(a - c * 0.3, b - c * 0.35, c * 0.45))));
  // fresh leaf shapes around the edges
  let lv = '';
  clumps.forEach(([a, b, c]) => {
    for (let i = 0; i < 7; i++) {
      const ang = -Math.PI + (Math.PI * i) / 6 + R.range(-0.2, 0.2);
      const lx = a + Math.cos(ang) * c * 1.02;
      const ly = b + Math.sin(ang) * c * 1.02;
      lv += ellipse(lx, ly, 9, 5, { fill: R() < 0.5 ? C.leaf1 : C.leaf2, transform: `rotate(${r1((ang * 180) / Math.PI)} ${r1(lx)} ${r1(ly)})` });
    }
  });
  p.push(lv);
  // pale pink blossoms
  for (let i = 0; i < 14; i++) {
    const [a, b, c] = clumps[i % clumps.length];
    p.push(flower(a + R.range(-0.7, 0.7) * c, b + R.range(-0.6, 0.6) * c, { r: 6.5, fill: i % 3 ? C.rose0 : C.white, center: C.gold2 }));
  }
  return g({ transform: T(x, y, s) }, p);
}

// A cute goat, facing RIGHT. (x, y) = ground between the feet.
// drink: head lowered to the water.
function goat(x, y, { s = 1, flip = false, coat = '#E9CBA2', shade = '#CDAA7E', dark = '#7E5E48', blaze = '#FFF8EE', horn = '#B8A089', drink = false } = {}) {
  const p = [];
  for (const lx of [-30, 44]) p.push(rect(lx - 7, -64, 14, 64, { rx: 7, fill: shade }), rect(lx - 7, -9, 14, 9, { rx: 4, fill: dark }));
  for (const lx of [-46, 58]) p.push(rect(lx - 8, -64, 16, 64, { rx: 8, fill: coat }), rect(lx - 5, -54, 4, 30, { rx: 2, fill: blaze, opacity: 0.4 }), rect(lx - 8, -10, 16, 10, { rx: 4, fill: dark }));
  // perky little tail
  p.push(path('M-64,-104 q-8,-12 -2,-22', { fill: 'none', stroke: coat, 'stroke-width': 9, 'stroke-linecap': 'round' }));
  // body with a pale belly
  p.push(path('M-70,-94 C-72,-120 -46,-130 0,-128 C46,-128 72,-122 76,-98 C78,-72 56,-60 0,-60 C-46,-60 -68,-68 -70,-94Z', { fill: coat }));
  p.push(path('M-66,-82 C-50,-64 44,-60 72,-84 C70,-68 50,-60 0,-60 C-44,-60 -62,-68 -66,-82Z', { fill: blaze, opacity: 0.85 }));
  p.push(ellipse(-20, -118, 36, 7, { fill: '#F6DDB9', opacity: 0.8 }));
  // neck and head (tilted down to drink)
  const hp = [];
  hp.push(path('M44,-122 C58,-132 72,-142 84,-150 L104,-132 C94,-114 82,-102 62,-96Z', { fill: coat }));
  // horns curving back
  hp.push(path('M86,-160 C80,-178 66,-188 54,-188 C64,-182 72,-170 76,-156Z', { fill: horn }));
  hp.push(path('M96,-162 C92,-180 80,-192 68,-194 C78,-186 84,-174 86,-158Z', { fill: mix(horn, '#000000', 0.12) }));
  // head
  hp.push(path('M80,-160 C88,-170 108,-170 118,-158 C126,-148 134,-134 132,-124 C130,-114 118,-112 108,-116 C96,-120 84,-128 78,-140 C74,-148 74,-154 80,-160Z', { fill: coat }));
  hp.push(ellipse(92, -124, 20, 16, { fill: coat }));
  // floppy ear
  hp.push(ellipse(76, -146, 18, 8, { fill: shade, transform: 'rotate(30 76 -146)' }));
  hp.push(ellipse(77, -145, 11, 4, { fill: C.cheek, opacity: 0.5, transform: 'rotate(30 77 -145)' }));
  // beard, nose and smile
  hp.push(path('M110,-116 q-2,14 -8,20 q8,-2 14,-14Z', { fill: shade }));
  hp.push(ellipse(128, -128, 4, 3, { fill: dark }));
  hp.push(path('M116,-120 q6,4 12,0', { fill: 'none', stroke: dark, 'stroke-width': 2.2, 'stroke-linecap': 'round' }));
  hp.push(eye(104, -148, 5.4, drink));
  hp.push(ellipse(112, -134, 6, 3.6, { fill: C.cheek, opacity: 0.6 }));
  p.push(g(drink ? { transform: 'rotate(42 60 -110)' } : {}, hp));
  return g({ transform: T(x, y, s, 0, flip) }, p);
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
  const id = ids('s16');
  const R = rng(1616);
  const defs = [
    linear(id('sky'), [[0, '#A9D8EA'], [0.3, '#CDEBF0'], [0.48, '#FBEBD5'], [0.56, SKY]]),
    glowDef(id('sunGlow'), '#FFF2CC', 0.9),
    linear(id('dry'), [[0, '#EFCF98'], [1, '#D9A866']]),
    linear(id('lush'), [[0, '#B5DC8F'], [1, '#6FB062']]),
    radial(id('pool'), [[0, '#D3F1F0'], [0.55, '#97DCDD'], [1, '#5BBFCB']], { cx: 0.45, cy: 0.4, r: 0.65 }),
    linear(id('stream'), [[0, '#97DCDD'], [1, '#4FB3C6']]),
    glowDef(id('mercy'), '#FFF8E0', 0.75),
    vignetteDef(id('vig'), C.ink, 0.17),
  ].join('');

  let body = '';
  // morning sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(170, 180, 54, { fill: '#FFE9AE', core: '#FFF8E2', glowId: id('sunGlow') });
  body += cloud(470, 150, 200, { fill: C.white, shade: '#E4EEF0', seed: 2, opacity: 0.95 });
  body += cloud(840, 230, 230, { fill: '#FFF8F0', shade: '#F2E2D6', seed: 5, opacity: 0.95 });
  body += farBird(330, 270, 1.1, '#6B6A86', 0.5) + farBird(372, 252, 0.8, '#6B6A86', 0.45) + farBird(640, 300, 0.9, '#6B6A86', 0.45);
  body += flyingBird(286, 356, { s: 0.42, body: '#FFF8EE', wing: '#E9D6C2' }) + flyingBird(232, 398, { s: 0.32, body: '#FFF8EE', wing: '#E9D6C2', up: false });

  // far hills: dusty on the left, greening on the right
  body += path(ridge([[-20, 520], [140, 470], [300, 500], [460, 462], [620, 490], [800, 456], [1020, 486]]), { fill: haze('#C9B79A', 0.45) });
  body += path(ridge([[520, 520], [660, 488], [820, 500], [1020, 476]]), { fill: haze(C.leaf2, 0.45) });
  // mid ground
  body += path(ridge([[-20, 560], [180, 536], [380, 556], [560, 548], [760, 536], [1020, 548]]), { fill: `url(#${id('dry')})` });
  body += path(`M470,556 C600,540 760,530 1020,540 L1020,1000 L560,1000 C600,860 560,760 470,556Z`, { fill: `url(#${id('lush')})` });
  // cracks in the dry earth (left)
  body += cracks([20, 600, 330, 140], { color: '#B98A52', seed: 3, n: 8 });
  body += cracks([10, 760, 300, 200], { color: '#B07F48', seed: 8, n: 9 });
  for (const [dx, dy] of [[90, 640], [240, 700], [60, 860], [300, 820], [150, 760]]) {
    body += path(`M${dx - 6},${dy} l-3,-12 M${dx},${dy} l0,-15 M${dx + 6},${dy} l4,-11`, { stroke: '#B89566', 'stroke-width': 2.4, 'stroke-linecap': 'round' });
  }
  body += dryShrub(110, 720, { s: 0.9 });

  // soft light of mercy over the spring
  body += circle(500, 560, 360, { fill: `url(#${id('mercy')})` });

  // ----- the pool and the stream flowing toward us
  const streamD = 'M420,688 C392,760 340,820 310,1010 L560,1010 C548,860 560,770 590,690Z';
  // fresh green creeping out along the banks, even into the dry side
  body += path(blob([[430, 680], [380, 740], [300, 800], [250, 880], [196, 1010], [360, 1010], [380, 880], [420, 780]]), { fill: '#9ED084' });
  body += path(blob([[400, 700], [330, 760], [270, 790], [300, 760], [350, 720]]), { fill: '#9ED084' });
  body += path(blob([[300, 860], [240, 900], [200, 960], [250, 930], [300, 900]]), { fill: '#9ED084' });
  body += path(blob([[420, 700], [370, 770], [330, 840], [360, 800], [400, 750]]), { fill: '#B5DC8F' });
  for (const [px, py] of [[270, 760], [222, 840], [300, 700], [170, 930], [250, 680]]) body += grass(px, py, { h: 14, fill: C.leaf2, n: 3, seed: px + py });
  for (const [gx, gy, gh] of [[300, 900, 28], [340, 820, 24], [380, 750, 22], [250, 980, 30], [280, 960, 20]]) body += grass(gx, gy, { h: gh, fill: C.leaf3, n: 5, seed: gx });
  for (const [fx, fy, fc] of [[322, 868, C.white], [362, 790, C.gold1], [262, 950, C.white]]) body += flower(fx, fy, { r: 6, fill: fc, center: C.gold2 });
  body += path(streamD, { fill: `url(#${id('stream')})` });
  for (const [y0, x0, w0] of [[760, 470, 60], [830, 430, 80], [910, 400, 90], [975, 380, 110]]) body += path(`M${x0},${y0} q${w0 / 2},-8 ${w0},0`, { fill: 'none', stroke: C.white, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.55 });
  // pebbles along the stream banks
  for (const [px, py, pw] of [[400, 742, 20], [592, 760, 22], [356, 840, 18], [570, 880, 24], [326, 950, 22], [566, 960, 20]]) body += ellipse(px, py, pw / 2, pw * 0.34, { fill: C.stone1 }) + ellipse(px - pw * 0.12, py - pw * 0.1, pw * 0.24, pw * 0.1, { fill: C.stone0 });
  // the pool, the rocks and the spring (drawn a little larger, as the focal point)
  let spring = '';
  spring += ellipse(505, 672, 190, 46, { fill: '#5BBFCB' });
  spring += ellipse(505, 668, 182, 40, { fill: `url(#${id('pool')})` });
  spring += ellipse(505, 672, 120, 24, { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.55 });
  spring += ellipse(505, 674, 160, 34, { fill: 'none', stroke: C.white, 'stroke-width': 2.5, opacity: 0.35 });
  spring += shimmer(560, 676, { n: 3, w: 90, gap: 9, color: C.white, op: 0.7, seed: 4 });

  // the rocks the water springs from
  const st = { base: '#C9C0B4', light: '#ECE6DC', dark: '#A69C90' };
  spring += stone(id('r1'), [[350, 650], [362, 596], [420, 574], [470, 590], [478, 640], [420, 664]], { ...st });
  spring += stone(id('r2'), [[540, 646], [552, 588], [610, 568], [668, 590], [672, 646], [600, 664]], { ...st, moss: C.leaf2 });
  spring += stone(id('r4'), [[310, 676], [318, 646], [350, 636], [380, 652], [378, 680], [340, 688]], { ...st });

  // the spring gushing up from between the rocks
  const jet = '#F2FCFB';
  const jetMid = '#BDEBEC';
  const jetEdge = '#7FD0D8';
  // a tapered stream along a quadratic curve, breaking into drops at the end
  const fall = (x0, y0, cx, cy, x1, y1, w0) => {
    const a = [];
    const b = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1;
      const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
      const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
      const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
      const l = Math.hypot(dx, dy) || 1;
      const w = (w0 * (1 - t * 0.75)) / 2;
      a.push([x - (dy / l) * w, y + (dx / l) * w]);
      b.push([x + (dy / l) * w, y - (dx / l) * w]);
    }
    b.reverse();
    return `${smooth(a)} L${b[0].map(r1).join(',')} ${smooth(b).replace(/^M[^C]*/, '')}Z`;
  };
  for (const [x0, y0, cx, cy, x1, y1, w0] of [[488, 478, 426, 446, 404, 590, 18], [492, 500, 452, 486, 444, 586, 13], [512, 476, 572, 452, 590, 584, 16], [508, 502, 540, 494, 552, 580, 12]]) {
    spring += path(fall(x0, y0, cx, cy, x1, y1, w0), { fill: jetEdge, opacity: 0.92 });
    spring += path(fall(x0, y0 + 3, cx, cy + 4, x1, y1 - 6, w0 * 0.38), { fill: jet, opacity: 0.9 });
    const dir = x1 < 500 ? -1 : 1;
    spring += circle(x1 + dir * 2, y1 + 10, w0 * 0.3, { fill: jetMid }) + circle(x1 + dir * 5, y1 + 24, w0 * 0.2, { fill: jetEdge, opacity: 0.85 });
  }
  // the rounded plume welling up in the middle
  const plume = blob([[470, 610], [466, 566], [478, 526], [482, 494], [490, 470], [504, 462], [516, 472], [520, 500], [526, 530], [536, 568], [532, 610]]);
  spring += path(plume, { fill: jetEdge });
  spring += path(blob([[480, 610], [478, 570], [488, 530], [492, 496], [500, 478], [510, 486], [512, 512], [520, 540], [524, 576], [522, 610]]), { fill: jetMid });
  spring += path('M494,600 C492,566 494,530 500,492 M510,598 C512,574 510,552 514,530', { fill: 'none', stroke: jet, 'stroke-width': 4, 'stroke-linecap': 'round' });
  spring += g({ fill: jetMid }, circle(492, 470, 10), circle(510, 466, 9));
  spring += g({ fill: jet }, circle(498, 468, 5.5));
  // spray around the top
  for (const [dx, dy, r] of [[470, 448, 5.5], [530, 442, 5], [500, 432, 4.5], [452, 470, 4], [552, 464, 4.5], [484, 418, 3.5], [520, 414, 3.5], [438, 500, 3.5], [566, 498, 3.5]]) spring += circle(dx, dy, r, { fill: R() < 0.5 ? jet : jetMid });
  // front rock hides where the water wells out of the ground
  spring += stone(id('r3'), [[446, 646], [458, 606], [500, 594], [546, 606], [558, 646], [500, 660]], { base: '#B9AFA2', light: '#DDD5CA', dark: '#988D80' });
  spring += g({ fill: C.white, opacity: 0.9 }, circle(478, 601, 6), circle(492, 597, 9), circle(508, 598, 7), circle(522, 602, 5), ellipse(500, 603, 24, 5));
  spring += g({ fill: jetMid }, circle(484, 600, 4), circle(515, 600, 4));
  // water spilling over the front rock into the pool
  spring += path('M482,604 C486,626 484,646 488,668 L512,668 C516,646 516,626 520,604Z', { fill: jetMid, opacity: 0.92 });
  spring += path('M496,608 C497,630 497,648 499,664', { fill: 'none', stroke: jet, 'stroke-width': 3, 'stroke-linecap': 'round' });
  spring += g({ fill: C.white, opacity: 0.75 }, ellipse(500, 670, 28, 6), ellipse(410, 664, 16, 4), ellipse(592, 664, 16, 4));
  // sparkles of blessing
  for (const [sx, sy, ss] of [[430, 470, 13], [580, 440, 15], [620, 530, 9], [380, 540, 9], [470, 400, 8], [660, 620, 10], [345, 610, 7]]) spring += sparkle(sx, sy, ss, '#FFFFFF', { opacity: 0.95 });

  // a little bird drinking at the pool's edge
  spring += bird(352, 640, { s: 0.42, body: C.sky0, wing: '#4C9CC0', belly: C.sky2 });

  body += g({ transform: 'translate(505 664) scale(1.2) translate(-505 -664)' }, spring);

  // ----- the lush side: young tree, flowers, the flock coming back
  body += youngTree(790, 600, { s: 1.15 });
  body += bush(930, 610, { w: 110, fill: C.leaf3, dark: C.leaf4, light: C.leaf1, seed: 7 });
  for (let i = 0; i < 16; i++) body += grass(600 + R() * 400, 620 + R() * 360, { h: 20 + R() * 18, fill: R() < 0.5 ? C.leaf3 : C.leaf4, n: 5, seed: 80 + i });
  const flowerCols = [C.coral1, C.rose1, C.gold1, C.white, C.plum1];
  for (let i = 0; i < 30; i++) {
    const fx = 610 + R() * 380;
    const fy = 640 + R() * 340;
    const r = R.range(6, 10);
    const inPool = ((fx - 505) / 245) ** 2 + ((fy - 674) / 70) ** 2 < 1;
    const atGoat = Math.hypot(fx - 705, fy - 668) < 55;
    if (inPool || atGoat) continue;
    body += flower(fx, fy, { r, fill: flowerCols[i % flowerCols.length], center: C.gold2 });
  }
  // the flock returning to the water
  body += ellipse(800, 722, 62, 8, { fill: '#2F6B3E', opacity: 0.2 });
  body += goat(806, 722, { s: 0.72, flip: true, drink: true });
  body += ellipse(862, 842, 70, 9, { fill: '#2F6B3E', opacity: 0.2 });
  body += sheep(862, 842, { s: 0.85, flip: true, seed: 4 });
  body += ellipse(668, 800, 44, 7, { fill: '#2F6B3E', opacity: 0.2 });
  body += sheep(668, 800, { s: 0.52, flip: true, seed: 9, face: '#7A6060' });
  body += butterfly(720, 560, { s: 0.9, wing: C.gold1, wing2: C.gold0, rot: -10 });
  body += butterfly(890, 480, { s: 0.7, wing: C.rose1, wing2: C.rose0, rot: 12 });

  // ----- foreground framing
  // dry corner: rocks and a dry tuft on the left
  body += stone(id('f1'), [[-30, 1010], [-20, 900], [50, 860], [140, 880], [170, 960], [120, 1010]], { base: '#C9A57A', light: '#E6C79C', dark: '#A9845A' });
  body += path('M180,1000 l-6,-30 M188,1000 l2,-34 M196,1000 l8,-26', { stroke: '#B08B5C', 'stroke-width': 3, 'stroke-linecap': 'round' });
  // lush corner: flowers and tall grass on the right
  body += bush(905, 1000, { w: 170, fill: C.leaf3, dark: C.leaf4, light: C.leaf1, seed: 12 });
  for (const [fx, fy, fr, fc] of [[860, 935, 12, C.coral1], [915, 905, 11, C.gold1], [965, 940, 12, C.rose1], [810, 975, 10, C.white]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });
  body += grass(990, 1000, { h: 70, fill: C.leaf4, n: 7, seed: 51 }) + grass(760, 1000, { h: 44, fill: C.leaf3, n: 6, seed: 52 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
