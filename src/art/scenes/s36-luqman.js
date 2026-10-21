// Luqman's Advice to His Son (Quran 31:12-19).
// A big, wise old tree on a gentle hill at golden hour. On a branch, a
// parent bird feeds its chicks in their nest. On the ground, a rock with a
// crack shows a tiny glowing mustard seed inside (31:16). A path winds
// gently away - walk humbly (31:18-19) - and a small donkey grazes far off
// (31:19).
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, rays, farBird, grass, flower, bush, shadow, eye, r1, T, lerp,
} from '../lib.js';

// A cute donkey standing, facing right. (x, y) = ground between the feet.
// head = degrees to tip the head down (e.g. to graze).
function donkey(x, y, { s = 1, flip = false, coat = '#A99FAC', dark = '#8A7F90', light = '#C8BFC8', belly = '#E6DFE2', muzzle = '#F3EEEC', mane = '#5E5566', head = 0 } = {}) {
  const p = [];
  p.push(ellipse(6, 2, 96, 10, { fill: C.ink, opacity: 0.14 }));
  // far legs, set a little behind the near ones so all four show
  p.push(rect(-44, -66, 17, 66, { rx: 8, fill: dark }), rect(44, -66, 17, 66, { rx: 8, fill: dark }));
  p.push(rect(-44, -12, 17, 12, { rx: 4, fill: mane }), rect(44, -12, 17, 12, { rx: 4, fill: mane }));
  // tail with a dark tuft
  p.push(path('M-74,-108 C-88,-98 -92,-80 -90,-64', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  p.push(ellipse(-90, -56, 7.5, 13, { fill: mane }));
  // round body
  p.push(path('M-80,-92 C-84,-130 -46,-146 0,-144 C46,-146 82,-130 84,-98 C86,-70 62,-60 0,-60 C-56,-60 -78,-66 -80,-92Z', { fill: coat }));
  p.push(path('M-76,-112 C-62,-136 -26,-142 6,-141 C36,-141 62,-133 76,-118 C44,-128 8,-130 -24,-128 C-48,-126 -66,-120 -76,-112Z', { fill: light, opacity: 0.85 }));
  p.push(path('M-64,-70 C-30,-58 32,-58 68,-72 C62,-62 42,-60 0,-60 C-36,-60 -58,-62 -64,-70Z', { fill: belly }));
  // near legs
  p.push(rect(-64, -72, 19, 72, { rx: 9, fill: coat }), rect(24, -72, 19, 72, { rx: 9, fill: coat }));
  p.push(rect(-64, -14, 19, 14, { rx: 5, fill: mane }), rect(24, -14, 19, 14, { rx: 5, fill: mane }));
  p.push(rect(-60, -66, 5, 42, { rx: 2.5, fill: light, opacity: 0.6 }), rect(28, -66, 5, 42, { rx: 2.5, fill: light, opacity: 0.6 }));
  // neck, mane, head and ears (tilt the whole head group to graze)
  const hp = [];
  hp.push(path('M30,-124 C40,-150 56,-176 70,-194 L114,-180 C104,-156 92,-130 76,-104Z', { fill: coat }));
  hp.push(path('M28,-122 C26,-134 36,-136 38,-146 C36,-156 46,-160 48,-168 C48,-178 58,-182 62,-188 C64,-198 74,-200 78,-196 L70,-190 C56,-170 42,-148 34,-118Z', { fill: mane }));
  hp.push(ellipse(110, -248, 10, 31, { fill: dark, transform: 'rotate(16 110 -248)' }));
  hp.push(path('M72,-200 C70,-234 112,-242 126,-214 C134,-200 146,-184 152,-168 C160,-146 146,-126 124,-128 C102,-130 86,-144 80,-160 C76,-172 72,-186 72,-200Z', { fill: coat }));
  hp.push(ellipse(90, -246, 11.5, 33, { fill: coat, transform: 'rotate(-12 90 -246)' }));
  hp.push(ellipse(90, -244, 5.4, 23, { fill: C.rose1, transform: 'rotate(-12 90 -244)' }));
  hp.push(path('M86,-216 C90,-230 104,-230 108,-218 C102,-222 94,-220 86,-216Z', { fill: mane }));
  hp.push(ellipse(84, -204, 9, 5, { fill: light, opacity: 0.7, transform: 'rotate(-30 84 -204)' }));
  hp.push(ellipse(136, -146, 23, 18, { fill: muzzle, transform: 'rotate(30 136 -146)' }));
  hp.push(ellipse(148, -150, 3.6, 2.6, { fill: mane, transform: 'rotate(35 148 -150)' }));
  hp.push(path('M126,-132 Q134,-129 140,-134', { fill: 'none', stroke: mane, 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
  hp.push(eye(108, -186, 6.2));
  hp.push(ellipse(120, -164, 8, 5, { fill: C.cheek, opacity: 0.6 }));
  p.push(g({ transform: head ? `rotate(${head} 60 -116)` : undefined }, hp));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// A soft, lumpy cluster of leaves lit from the upper left.
function leafCluster(cx, cy, r, R, col) {
  const pts = [];
  for (let i = 0; i < 9; i++) {
    const a = (Math.PI * 2 * i) / 9;
    const rr = r * R.range(0.86, 1.08);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.82]);
  }
  const shift = (dx, dy, k) => pts.map(([px, py]) => [cx + (px - cx) * k + dx, cy + (py - cy) * k + dy]);
  return {
    back: path(blob(shift(r * 0.1, r * 0.14, 1)), { fill: col.dk }),
    mid: path(blob(shift(0, 0, 0.94)), { fill: col.md }),
    hi: path(blob(shift(-r * 0.24, -r * 0.24, 0.56)), { fill: col.lt, opacity: 0.9 }),
    glint: path(blob(shift(-r * 0.42, -r * 0.36, 0.24)), { fill: col.gl, opacity: 0.75 }),
  };
}

// The wise old tree: a broad, gnarled trunk with spreading roots, strong
// limbs and a wide canopy. (x, y) = base of the trunk.
function oldTree(x, y, R) {
  let s = '';
  const bark = '#8C603D';
  const barkDark = '#6A452B';
  const barkLight = '#C08C5A';
  // roots spreading over the hill
  s += path(`M${x - 150},${y + 10} C${x - 110},${y - 6} ${x - 84},${y - 26} ${x - 74},${y - 60} L${x + 66},${y - 60} C${x + 78},${y - 26} ${x + 110},${y - 6} ${x + 160},${y + 12}Z`, { fill: bark });
  s += path(`M${x - 150},${y + 10} C${x - 110},${y - 6} ${x - 84},${y - 26} ${x - 74},${y - 60} L${x - 50},${y - 60} C${x - 60},${y - 24} ${x - 90},${y - 2} ${x - 120},${y + 10}Z`, { fill: barkLight, opacity: 0.6 });
  // trunk, wide and slightly twisted
  s += path(`M${x - 78},${y - 40} C${x - 60},${y - 140} ${x - 92},${y - 210} ${x - 56},${y - 300} C${x - 40},${y - 360} ${x - 30},${y - 420} ${x - 24},${y - 470} L${x + 20},${y - 470} C${x + 22},${y - 420} ${x + 30},${y - 360} ${x + 34},${y - 300} C${x + 60},${y - 220} ${x + 40},${y - 130} ${x + 70},${y - 40}Z`, { fill: bark });
  s += path(`M${x - 78},${y - 40} C${x - 60},${y - 140} ${x - 92},${y - 210} ${x - 56},${y - 300} C${x - 44},${y - 340} ${x - 36},${y - 380} ${x - 30},${y - 420} C${x - 34},${y - 370} ${x - 40},${y - 330} ${x - 30},${y - 290} C${x - 58},${y - 210} ${x - 30},${y - 140} ${x - 44},${y - 40}Z`, { fill: barkLight, opacity: 0.6 });
  s += path(`M${x + 14},${y - 420} C${x + 20},${y - 380} ${x + 18},${y - 340} ${x + 6},${y - 300} C${x + 32},${y - 220} ${x + 14},${y - 130} ${x + 40},${y - 40} L${x + 70},${y - 40} C${x + 40},${y - 130} ${x + 60},${y - 220} ${x + 34},${y - 300} C${x + 30},${y - 340} ${x + 22},${y - 380} ${x + 14},${y - 420}Z`, { fill: barkDark, opacity: 0.45 });
  s += path(`M${x - 24},${y - 70} C${x - 12},${y - 120} ${x - 32},${y - 160} ${x - 16},${y - 210} M${x + 18},${y - 170} C${x + 26},${y - 210} ${x + 10},${y - 240} ${x + 20},${y - 280} M${x - 50},${y - 120} C${x - 44},${y - 150} ${x - 52},${y - 170} ${x - 46},${y - 196}`, { fill: 'none', stroke: barkDark, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.45 });
  s += ellipse(x + 2, y - 150, 12, 17, { fill: barkDark }) + ellipse(x, y - 153, 7, 10, { fill: '#4E331F' });
  // limbs: a long one reaching out left (it carries the nest), others up
  s += path(`M${x - 56},${y - 290} C${x - 150},${y - 330} ${x - 260},${y - 352} ${x - 400},${y - 356} C${x - 420},${y - 356} ${x - 424},${y - 340} ${x - 404},${y - 340} C${x - 260},${y - 334} ${x - 150},${y - 300} ${x - 40},${y - 248}Z`, { fill: bark });
  s += path(`M${x - 56},${y - 290} C${x - 150},${y - 330} ${x - 260},${y - 352} ${x - 400},${y - 356} C${x - 410},${y - 356} ${x - 416},${y - 352} ${x - 414},${y - 348} C${x - 260},${y - 346} ${x - 150},${y - 322} ${x - 52},${y - 280}Z`, { fill: barkLight, opacity: 0.6 });
  s += path(`M${x - 300},${y - 350} C${x - 320},${y - 380} ${x - 330},${y - 400} ${x - 350},${y - 412}`, { fill: 'none', stroke: bark, 'stroke-width': 7, 'stroke-linecap': 'round' });
  s += path(`M${x - 30},${y - 296} C${x - 46},${y - 360} ${x - 80},${y - 410} ${x - 116},${y - 446} L${x - 96},${y - 458} C${x - 54},${y - 420} ${x - 4},${y - 370} ${x + 6},${y - 300}Z`, { fill: bark });
  s += path(`M${x + 20},${y - 296} C${x + 54},${y - 356} ${x + 118},${y - 396} ${x + 180},${y - 416} L${x + 186},${y - 398} C${x + 126},${y - 376} ${x + 64},${y - 330} ${x + 36},${y - 280}Z`, { fill: bark });
  // a few leaves on the long limb near its tip
  for (const [lx, ly, a] of [[x - 330, y - 414, -60], [x - 362, y - 412, -120], [x - 346, y - 430, -90], [x - 420, y - 360, 170], [x - 410, y - 334, 150]]) {
    s += ellipse(lx, ly, 14, 7, { fill: '#7FA455', transform: `rotate(${a} ${lx} ${ly})` });
  }
  // canopy: an umbrella of leaf clusters
  const col = { dk: '#4F7B45', md: '#6E9C50', lt: '#A9C566', gl: '#DCE08A' };
  const clusters = [
    [x - 250, y - 420, 74], [x - 160, y - 500, 96], [x - 40, y - 570, 112], [x + 100, y - 580, 112], [x + 230, y - 520, 100], [x + 300, y - 430, 76],
    [x - 190, y - 410, 70], [x - 80, y - 450, 96], [x + 60, y - 470, 104], [x + 190, y - 440, 92], [x + 290, y - 360, 60], [x - 30, y - 660, 70], [x + 120, y - 680, 64],
  ];
  const parts = clusters.map(([cx, cy, r]) => leafCluster(cx, cy, r, R, col));
  s += parts.map((q) => q.back).join('') + parts.map((q) => q.mid).join('') + parts.map((q) => q.hi).join('') + parts.map((q) => q.glint).join('');
  return s;
}

// The nest with a parent bird feeding three chicks. (x, y) = nest centre.
function nest(x, y, s = 1) {
  const p = [];
  // back of the nest and its hollow
  p.push(path('M-54,-14 C-50,-24 -28,-28 0,-28 C28,-28 50,-24 54,-14 C40,-6 -40,-6 -54,-14Z', { fill: '#B98552' }));
  p.push(ellipse(0, -15, 44, 8, { fill: '#6E4A2C' }));
  // chicks looking up, beaks wide open
  const chick = (cx, cy, rot, c) => g({ transform: `translate(${cx} ${cy}) rotate(${rot}) scale(1.3)` },
    circle(0, 0, 15, { fill: c }),
    ellipse(-6, -6, 6, 4, { fill: C.white, opacity: 0.35 }),
    path('M0,-14 C-1,-20 4,-23 6,-18', { fill: 'none', stroke: c, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    path('M0,-7 L6.5,0 L0,6 L-6.5,0Z', { fill: '#F7AE5E', 'stroke-linejoin': 'round', stroke: '#F7AE5E', 'stroke-width': 1.6 }),
    path('M0,-3.5 L3.6,0 L0,3 L-3.6,0Z', { fill: '#E2524C' }),
    eye(-8, -6, 2.4, true), eye(8, -6, 2.4, true),
    ellipse(-10, 4, 3.2, 2, { fill: C.cheek, opacity: 0.7 }), ellipse(10, 4, 3.2, 2, { fill: C.cheek, opacity: 0.7 }),
  );
  p.push(chick(-10, -28, -10, '#FFE7A6'), chick(40, -26, 14, '#FFEBB8'), chick(14, -40, 2, '#FFE09A'));
  // front of the woven bowl, in front of the chicks
  p.push(path('M-54,-14 C-52,14 -26,28 0,28 C26,28 52,14 54,-14 C40,-6 -40,-6 -54,-14Z', { fill: '#9C6B40' }));
  p.push(path('M-46,-2 C-20,8 20,8 46,-2 M-40,10 C-16,18 16,18 40,10 M-28,20 C-10,24 10,24 28,20', { fill: 'none', stroke: '#7A5030', 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.7 }));
  p.push(path('M-54,-14 C-40,-6 40,-6 54,-14', { fill: 'none', stroke: '#C99A62', 'stroke-width': 6, 'stroke-linecap': 'round' }));
  p.push(path('M-58,-12 L-66,-20 M56,-14 L66,-22 M-30,-8 C-24,-2 -16,-4 -12,-8 M20,-8 C26,-3 34,-4 38,-9', { fill: 'none', stroke: '#C99A62', 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
  // parent bird on the rim, leaning in with a berry for the middle chick
  p.push(g({ transform: 'translate(-40 -16) scale(-0.82 0.82)' },
    path('M22,-30 L48,-44 L44,-24 Z', { fill: '#C9604E' }),
    ellipse(0, -30, 30, 22, { fill: '#E07A62' }),
    ellipse(-6, -22, 19, 13, { fill: '#FBD7C4' }),
    path('M18,-40 C6,-50 -14,-44 -12,-30 C-6,-22 14,-22 22,-28Z', { fill: '#C9604E' }),
    circle(-26, -44, 16, { fill: '#E07A62' }),
    path('M-40,-46 L-58,-40 L-40,-37Z', { fill: C.gold3 }),
    circle(-60, -39, 5.5, { fill: '#D2384A' }), circle(-62, -41, 1.8, { fill: C.white, opacity: 0.7 }),
    eye(-30, -49, 3.6),
    ellipse(-34, -39, 4, 2.6, { fill: C.cheek, opacity: 0.6 }),
    path('M-4,-8 L-6,2 M8,-8 L10,2', { stroke: C.gold4, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }),
  ));
  return g({ transform: `translate(${r1(x)} ${r1(y)}) scale(${s})` }, p);
}

// A rounded rock split by a crack, with a tiny glowing seed inside.
function seedRock(x, y, glowId, sparkId) {
  const p = [];
  p.push(ellipse(10, 4, 150, 16, { fill: C.ink, opacity: 0.16 }));
  p.push(path(blob([[-140, 0], [-138, -60], [-90, -120], [-10, -138], [80, -124], [134, -70], [140, 0]]), { fill: '#B7AC9E' }));
  p.push(path(blob([[10, 0], [60, -40], [110, -76], [138, -40], [140, 0]]), { fill: '#968A7E', opacity: 0.7 }));
  p.push(path(blob([[-126, -40], [-110, -96], [-56, -126], [-20, -128], [-70, -100]]), { fill: '#D6CDC0', opacity: 0.9 }));
  // the crack, opening into a small hollow
  p.push(path('M-4,-137 C-10,-120 -6,-104 -14,-88 C-22,-74 -24,-56 -16,-40 C-10,-26 -16,-12 -10,0 L6,0 C2,-14 8,-28 4,-42 C0,-56 8,-72 12,-86 C16,-100 6,-118 8,-136Z', { fill: '#5E5249' }));
  p.push(ellipse(-4, -64, 22, 18, { fill: '#4A3F38' }));
  // the seed and its glow
  p.push(circle(-4, -64, 70, { fill: `url(#${glowId})` }));
  p.push(circle(-4, -64, 24, { fill: `url(#${sparkId})` }));
  p.push(circle(-4, -64, 5.5, { fill: '#FFE07A' }) + circle(-5.5, -65.5, 2, { fill: C.white }));
  p.push(sparkle(-38, -104, 9, '#FFF3C4'), sparkle(30, -92, 7, '#FFF3C4'), sparkle(-30, -30, 6, '#FFF3C4'), sparkle(22, -40, 5, '#FFF3C4'));
  // a little moss and a flower at the foot
  p.push(path('M-140,0 C-120,-12 -96,-10 -80,-2 L-80,0Z', { fill: '#7DA75A' }));
  return g({ transform: `translate(${r1(x)} ${r1(y)})` }, p);
}

export default function render() {
  const id = ids('s36');
  const R = rng(36);
  const defs = [
    linear(id('sky'), [[0, '#EDB39D'], [0.38, '#F7C99A'], [0.7, '#FFDFA6'], [1, '#FFF0C8']]),
    linear(id('path'), [[0, '#F6DDA8'], [1, '#E9C285']], { x1: 0, y1: 600, x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    glowDef(id('sunGlow'), '#FFF2C8', 0.9),
    glowDef(id('seedGlow'), '#FFE08A', 0.75),
    glowDef(id('seedCore'), '#FFFBE6', 0.95),
    glowDef(id('warm'), '#FFE6B0', 0.5),
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');

  let body = '';
  // ---- golden-hour sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(200, 560, 58, { fill: '#FFE6A6', core: '#FFF8E2', glowId: id('sunGlow') });
  body += rays(200, 560, { n: 7, len: 760, spread: 70, dir: -38, width: 3, color: '#FFF4D6', op: 0.06 });
  body += cloud(180, 300, 200, { fill: '#FFE7D6', shade: '#F5C7B4', seed: 2, opacity: 0.9 });
  body += cloud(420, 190, 140, { fill: '#FFEADA', shade: '#F7CDBA', seed: 6, opacity: 0.8 });
  body += farBird(330, 380, 1.1, '#9A6B60', 0.5) + farBird(362, 366, 0.85, '#9A6B60', 0.45) + farBird(120, 420, 0.8, '#9A6B60', 0.4);

  // ---- distant hills and the gentle hill of the tree
  body += path(ridge([[-20, 610], [120, 580], [260, 600], [400, 572], [560, 598], [720, 576], [880, 596], [1020, 584]]), { fill: '#E9C69C' });
  body += path(ridge([[-20, 660], [160, 636], [340, 652], [520, 630], [700, 650], [1020, 636]]), { fill: '#D4C58E' });
  body += path(ridge([[-20, 720], [180, 700], [380, 712], [560, 690], [760, 668], [900, 660], [1020, 668]]), { fill: '#B5BF78' });
  // the winding path, away into the distance
  body += path('M160,1010 C210,930 330,880 360,820 C384,770 300,740 290,712 C282,690 330,676 336,664 L344,664 C346,676 312,692 322,712 C336,742 432,770 410,826 C388,884 330,940 360,1010Z', { fill: `url(#${id('path')})` });

  // donkey far along the path, grazing quietly
  body += donkey(258, 700, { s: 0.3, head: 24 });

  // ---- the old tree
  body += path(ridge([[400, 900], [560, 852], [700, 830], [860, 836], [1020, 852]], 1010), { fill: '#98B868' });
  body += oldTree(770, 870, R);
  body += nest(440, 500, 1.35);

  // ---- foreground hill, the rock with the seed, grass and flowers
  body += path(ridge([[-20, 900], [100, 884], [200, 896], [260, 930], [300, 1010]], 1010), { fill: '#8FB262' });
  body += path(ridge([[420, 1010], [460, 940], [560, 910], [700, 900], [860, 912], [1020, 904]], 1010), { fill: '#8FB262' });
  body += seedRock(560, 958, id('seedGlow'), id('seedCore'));
  for (const [gx, gy, sd, h] of [[30, 1004, 1, 60], [100, 1000, 2, 46], [440, 1002, 3, 40], [690, 990, 4, 50], [900, 1000, 5, 64], [970, 996, 6, 50], [800, 950, 7, 30]]) body += grass(gx, gy, { h, n: 6, fill: C.leaf4, seed: sd });
  for (const [fx, fy, fc, fr] of [[70, 950, C.rose1, 10], [150, 930, C.gold1, 8], [700, 950, C.coral1, 9], [860, 960, C.rose1, 10], [940, 930, C.gold1, 8], [230, 980, C.coral1, 8]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });
  body += sparkle(470, 380, 9, C.cream, { opacity: 0.8 }) + sparkle(560, 440, 6, C.cream, { opacity: 0.7 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
