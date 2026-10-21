// The light on the mountain (Quran 20:9-24, 28:29-32, 27:7-12).
// Night in the sacred valley of Tuwa beneath Mount Tur. A single tree on the
// slope glows with a gentle, brilliant light - like fire, yet the tree stays
// green. In front, a pair of sandals placed neatly on a rock ("remove your
// sandals", 20:12) and a wooden staff leaning against it (20:18). Sheep sleep
// nearby; the family tent waits far off in the valley. No people, no snake.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob, poly,
  sparkle, starField, r1, eye, T, grass,
} from '../lib.js';

// Soft beams that fade with distance (fill = a userSpace radial gradient).
function softRays(x, y, { n = 14, len = 600, width = 5, rot = 0, fill, seed = 1 } = {}) {
  const R = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = ((rot + (360 * i) / n + R.range(-5, 5)) * Math.PI) / 180;
    const w = ((width * R.range(0.6, 1.3)) * Math.PI) / 180;
    const L = len * R.range(0.75, 1);
    s += poly([[x, y], [x + Math.cos(a - w) * L, y + Math.sin(a - w) * L], [x + Math.cos(a + w) * L, y + Math.sin(a + w) * L]], { fill });
  }
  return s;
}

// A gentle tear-shaped tongue of light. (x, y) = bottom centre.
function tongue(x, y, h, w, fill, rot = 0, op = 1) {
  const d = `M0,${r1(-h)} C${r1(w * 0.22)},${r1(-h * 0.55)} ${r1(w * 0.5)},${r1(-h * 0.28)} ${r1(w * 0.5)},0 A${r1(w * 0.5)},${r1(w * 0.5)} 0 0 1 ${r1(-w * 0.5)},0 C${r1(-w * 0.5)},${r1(-h * 0.28)} ${r1(-w * 0.22)},${r1(-h * 0.55)} 0,${r1(-h)}Z`;
  return path(d, { fill, opacity: op, transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})` });
}

// The tree full of light. (x, y) = base of the trunk.
function lightTree(x, y, id) {
  const parts = [];
  const R = rng(205);
  // crown outline: lobes around an ellipse, centre (0,-180)
  const lobes = [];
  const N = 15;
  for (let i = 0; i < N; i++) {
    const a = (Math.PI * 2 * i) / N;
    const rx = 128 + R.range(-6, 6);
    const ry = 82 + R.range(-5, 5);
    lobes.push([Math.cos(a) * rx * 0.86, -180 + Math.sin(a) * ry * 0.82, R.range(30, 40)]);
  }
  // tongues of light around the crown, behind it - an aura that does not burn
  for (let i = 0; i < 13; i++) {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 13;
    const px = Math.cos(a) * 124;
    const py = -180 + Math.sin(a) * 92;
    const h = 64 + Math.sin(((i + 0.5) / 13) * Math.PI) * 46 + R.range(-8, 8);
    parts.push(tongue(px, py + 30, h, h * 0.55, `url(#${id('flame')})`, (a * 180) / Math.PI + 90, 0.95));
  }
  // trunk and branches, dark against the light
  const bark = '#4A3550';
  parts.push(path('M-36,4 C-22,-4 -16,-16 -14,-34 C-12,-54 -20,-74 -46,-108 L-32,-116 C-12,-92 -2,-80 2,-92 C6,-108 22,-122 44,-134 L52,-122 C30,-108 16,-84 16,-58 C16,-32 22,-8 38,4Z', { fill: bark }));
  parts.push(path('M2,-92 C6,-108 22,-122 44,-134 L52,-122 C30,-108 16,-84 16,-58 C16,-32 22,-8 38,4 L24,4 C10,-10 8,-36 8,-58 C8,-74 4,-84 2,-92Z', { fill: '#9C7468', opacity: 0.55 }));
  parts.push(path('M-4,-64 C-18,-86 -4,-106 -8,-140', { fill: 'none', stroke: bark, 'stroke-width': 11, 'stroke-linecap': 'round' }));
  // crown: shade, body, inner light
  parts.push(g({ fill: '#3E7A5A' }, lobes.map(([cx, cy, rr]) => circle(cx + 3, cy + 10, rr)), ellipse(3, -172, 118, 74)));
  parts.push(g({ fill: `url(#${id('canopy')})` }, lobes.map(([cx, cy, rr]) => circle(cx, cy, rr)), ellipse(0, -182, 116, 74)));
  parts.push(ellipse(0, -186, 92, 56, { fill: `url(#${id('inner')})` }));
  // leaf clusters for texture
  for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI * 2;
    const d = 0.45 + R() * 0.5;
    const lx = Math.cos(a) * 118 * d;
    const ly = -180 + Math.sin(a) * 76 * d;
    const lit = ly < -190;
    parts.push(ellipse(lx, ly, 9, 4.5, { fill: lit ? '#FFFBE0' : '#5E9E62', opacity: lit ? 0.5 : 0.32, transform: `rotate(${r1(R.range(-40, 40))} ${r1(lx)} ${r1(ly)})` }));
  }
  // points of light among the leaves
  for (let i = 0; i < 14; i++) {
    const a = R() * Math.PI * 2;
    const d = Math.sqrt(R());
    parts.push(circle(Math.cos(a) * d * 100, -184 + Math.sin(a) * d * 58, R.range(2.4, 4.6), { fill: '#FFFFFF', opacity: R.range(0.7, 1) }));
  }
  return g({ transform: T(x, y, 1) }, parts);
}

// A sheep lying down asleep. (x, y) = middle of the belly on the ground.
function restingSheep(x, y, { s = 1, flip = false, seed = 3, wool = '#F2E6D2', woolShade = '#8E8BB4', rim = '#FFE3A6', face = '#8A7086', faceDark = '#5E4A62' } = {}) {
  const R = rng(seed);
  const parts = [];
  parts.push(ellipse(6, 2, 76, 10, { fill: C.ink, opacity: 0.3 }));
  parts.push(rect(34, -14, 36, 13, { rx: 6.5, fill: faceDark }));
  const puffs = [];
  for (let i = 0; i < 8; i++) {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 8;
    puffs.push([Math.cos(a) * 54, -30 + Math.sin(a) * 30, 22 + R.range(-3, 3)]);
  }
  const woolShape = (dx, dy) => [...puffs.map(([a, b, c]) => circle(a + dx, b + dy, c)), ellipse(dx, -27 + dy, 64, 26)];
  parts.push(g({ fill: woolShade }, woolShape(4, 5)));
  parts.push(g({ fill: rim }, woolShape(-4, -4)));
  parts.push(g({ fill: wool }, woolShape(0, 0)));
  parts.push(path('M-62,-12 C-40,-2 30,0 60,-10 C52,0 30,3 0,3 C-30,3 -54,-2 -62,-12Z', { fill: woolShade, opacity: 0.75 }));
  // head resting forward, eyes closed
  parts.push(ellipse(64, -32, 20, 24, { fill: face, transform: 'rotate(-58 64 -32)' }));
  parts.push(path('M58,-14 C70,-10 82,-16 84,-26 C80,-18 70,-14 58,-14Z', { fill: faceDark, opacity: 0.6 }));
  parts.push(ellipse(46, -48, 12, 6, { fill: faceDark, transform: 'rotate(30 46 -48)' }));
  parts.push(g({ fill: wool }, circle(52, -56, 10), circle(64, -58, 9)));
  parts.push(eye(70, -38, 4.2, true));
  parts.push(ellipse(76, -27, 5, 3, { fill: C.cheek, opacity: 0.6 }));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// A simple leather sandal lying flat, drawn toe-up and then squashed so it
// sits on a level surface. (x, y) = centre of the sole.
function sandal(x, y, { rot = 0, s = 1, mirror = false } = {}) {
  const m = mirror ? -1 : 1;
  const sole = 'M2,-60 C18,-60 26,-48 26,-32 C26,-16 19,-4 18,10 C17,26 21,38 19,47 C16,58 8,62 0,62 C-10,62 -18,56 -18,45 C-18,32 -14,18 -15,4 C-16,-12 -22,-28 -20,-40 C-18,-54 -10,-60 2,-60Z';
  const flat = (dy, kids) => g({ transform: `translate(${r1(x)} ${r1(y + dy)}) scale(${r1(s)} ${r1(s * 0.6)}) rotate(${rot}) scale(${m} 1)` }, kids);
  return (
    flat(9, [path(sole, { fill: C.ink, opacity: 0.35, transform: 'translate(4 4)' })]) +
    flat(6, [path(sole, { fill: '#6B4434' })]) +
    flat(0, [
      path(sole, { fill: '#C68A58' }),
      path(sole, { fill: '#E7BC8A', transform: 'translate(1 1) scale(0.84 0.88)' }),
      // toe loop, a wide strap over the foot, and a heel strap
      path('M-20,-14 C-10,-24 14,-24 26,-16 L23,4 C12,-4 -6,-4 -17,4Z', { fill: '#7A4630' }),
      path('M-17,-12 C-8,-19 12,-19 23,-13', { fill: 'none', stroke: '#B97A4C', 'stroke-width': 4, 'stroke-linecap': 'round' }),
      circle(2, -38, 7, { fill: 'none', stroke: '#7A4630', 'stroke-width': 5 }),
      path('M-16,36 C-14,62 14,62 18,36', { fill: 'none', stroke: '#7A4630', 'stroke-width': 6, 'stroke-linecap': 'round' }),
    ])
  );
}

// A small far-off tent (the family waiting in the valley).
function farTent(x, y, { w = 110, h = 58, fill = '#7C5A80', dark = '#56426A', stripe = '#C7A8BA', open = '#1B1B3C' } = {}) {
  const top = y - h;
  const edge = (t) => w * (0.36 + 0.14 * t); // half-width at depth t (0 = eave, 1 = ground)
  let s = path(`M${r1(x - w / 2)},${r1(y)} L${r1(x - w * 0.36)},${r1(top + h * 0.2)} Q${r1(x - w * 0.18)},${r1(top - h * 0.04)} ${r1(x)},${r1(top + h * 0.1)} Q${r1(x + w * 0.18)},${r1(top - h * 0.04)} ${r1(x + w * 0.36)},${r1(top + h * 0.2)} L${r1(x + w / 2)},${r1(y)}Z`, { fill });
  s += path(`M${r1(x + w * 0.04)},${r1(top + h * 0.1)} Q${r1(x + w * 0.18)},${r1(top - h * 0.04)} ${r1(x + w * 0.36)},${r1(top + h * 0.2)} L${r1(x + w / 2)},${r1(y)} L${r1(x + w * 0.1)},${r1(y)}Z`, { fill: dark, opacity: 0.7 });
  for (const t of [0.42, 0.66]) {
    const yy = top + h * 0.2 + (h * 0.8) * t;
    s += path(`M${r1(x - edge(t) + 2)},${r1(yy)} L${r1(x + edge(t) - 2)},${r1(yy)}`, { stroke: stripe, 'stroke-width': r1(h * 0.05), opacity: 0.5 });
  }
  s += path(`M${r1(x - w * 0.11)},${r1(y)} L${r1(x - w * 0.03)},${r1(top + h * 0.42)} L${r1(x + w * 0.05)},${r1(top + h * 0.42)} L${r1(x + w * 0.13)},${r1(y)}Z`, { fill: open });
  return s;
}

// A plain wooden shepherd's staff from (x0, y0) on the ground to (x1, y1).
function staff(x0, y0, x1, y1, { w = 16 } = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0);
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 90;
  const h = w / 2;
  const parts = [
    // body with a slight natural bend and rounded top
    path(`M${-h},0 C${-h},${-L * 0.4} ${-h * 0.9},${-L * 0.8} ${-h * 0.9},${-L + 6} C${-h * 0.9},${-L - 6} ${h * 0.9},${-L - 6} ${h * 0.9},${-L + 4} C${h * 0.9},${-L * 0.8} ${h},${-L * 0.4} ${h},0Z`, { fill: '#7A5038' }),
    // lit side, facing the glowing tree
    path(`M${h * 0.1},0 C${h * 0.1},${-L * 0.4} ${h * 0.05},${-L * 0.8} ${h * 0.05},${-L + 2} C${h * 0.2},${-L - 4} ${h * 0.9},${-L - 2} ${h * 0.9},${-L + 4} C${h * 0.9},${-L * 0.8} ${h},${-L * 0.4} ${h},0Z`, { fill: '#C98F5E' }),
    path(`M${h * 0.5},${-L * 0.1} L${h * 0.45},${-L * 0.9}`, { stroke: '#F4CB92', 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.7 }),
    // knots
    ellipse(h * 0.3, -L * 0.34, 3.5, 5.5, { fill: '#6E452E' }),
    ellipse(-h * 0.3, -L * 0.6, 3, 5, { fill: '#6E452E' }),
  ];
  // leather grip
  for (const t of [0.76, 0.8, 0.84]) parts.push(rect(-h - 1.5, -L * t - 3.5, w + 3, 7, { rx: 3.5, fill: '#6A3E2C' }), rect(-h - 1.5 + w * 0.5, -L * t - 3.5, w * 0.5 + 1.5, 3, { rx: 1.5, fill: '#B57A50' }));
  return g({ transform: `translate(${r1(x0)} ${r1(y0)}) rotate(${r1(ang)})` }, parts);
}

export default function render() {
  const id = ids('s20');
  const LX = 560; // the tree
  const LY = 560; // base of its trunk
  const GX = LX; // centre of the light
  const GY = LY - 180;
  const defs = [
    linear(id('sky'), [[0, '#0C1530'], [0.3, '#142246'], [0.6, '#21376C'], [0.82, '#33447C'], [1, '#434B85']]),
    radial(id('warm'), [[0, '#FFD98A', 0.4], [0.3, '#F4BE80', 0.2], [0.65, '#D79F8A', 0.06], [1, '#D79F8A', 0]], { cx: GX, cy: GY + 60, r: 470, units: 'userSpaceOnUse' }),
    radial(id('turLit'), [[0, '#C48F98'], [0.3, '#8A6C92', 0.85], [0.62, '#4C4A82', 0.4], [1, '#3A3F75', 0]], { cx: GX + 40, cy: GY + 60, r: 440, units: 'userSpaceOnUse' }),
    radial(id('beam'), [[0, '#FFF3CF', 0.3], [0.5, '#FFF0C6', 0.1], [1, '#FFF0C6', 0]], { cx: GX, cy: GY, r: 620, units: 'userSpaceOnUse' }),
    glowDef(id('glowBig'), '#FFE6A6', 0.72),
    glowDef(id('glowMid'), '#FFE6A6', 0.45),
    radial(id('glowCore'), [[0, '#FFFFFF', 1], [0.3, '#FFF8E2', 0.88], [0.62, '#FFEAB4', 0.38], [1, '#FFE2A0', 0]]),
    radial(id('canopy'), [[0, '#FFF6D4'], [0.32, '#EFF0B2'], [0.66, '#A7D27F'], [1, '#5C9E63']], { cx: 0, cy: -190, r: 150, units: 'userSpaceOnUse' }),
    radial(id('inner'), [[0, '#FFFFFF', 0.95], [0.5, '#FFF6CF', 0.5], [1, '#FFF6CF', 0]]),
    radial(id('flame'), [[0, '#FFFFFF', 1], [0.45, '#FFF2C2', 0.8], [1, '#FFDF8A', 0]], { cx: 0.5, cy: 0.74, r: 0.64 }),
    linear(id('valley'), [[0, '#3F4279'], [0.45, '#2F315E'], [1, '#202048']]),
    linear(id('tur'), [[0, '#353B72'], [1, '#272C5A']]),
    radial(id('knoll'), [[0, '#C79C98'], [0.45, '#7C6690'], [1, '#3D3F75']], { cx: LX, cy: LY - 20, r: 230, units: 'userSpaceOnUse' }),
    radial(id('pool'), [[0, '#F7C987', 0.3], [1, '#F7C987', 0]]),
    vignetteDef(id('vig'), C.ink, 0.3),
  ].join('');

  let body = '';
  // ---- sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += starField({ seed: 20, n: 95, area: [0, 0, 1000, 600], twinkles: 13, color: '#F4F1FF', gold: C.gold1, avoid: [[GX, GY, 270], [790, 260, 150]] });

  // ---- beams and the wide glow live in the air, behind the mountains
  body += softRays(GX, GY, { n: 16, len: 640, width: 3.2, rot: 8, fill: `url(#${id('beam')})`, seed: 4 });
  body += circle(GX, GY, 420, { fill: `url(#${id('glowBig')})` });

  // ---- far mountains, hazy and tinted toward the sky
  body += path(ridge([[-20, 560], [70, 520], [150, 540], [240, 488], [330, 520], [420, 500], [520, 540], [1020, 540]], 800), { fill: '#3B4883' });
  body += path(ridge([[-20, 610], [110, 586], [250, 600], [380, 578], [520, 600], [1020, 600]], 800), { fill: '#343F76' });

  // ---- Mount Tur: a great dark granite massif, lit only near the tree
  const tur = [[90, 790], [210, 724], [320, 664], [410, 616], [490, 580], [556, 562], [616, 552], [656, 526], [684, 462], [706, 380], [728, 296], [752, 214], [776, 160], [802, 140], [828, 150], [852, 186], [876, 222], [904, 232], [934, 216], [962, 228], [994, 262], [1030, 290]];
  const turD = ridge(tur, 1000);
  body += path(turD, { fill: `url(#${id('tur')})` });
  body += path(turD, { fill: `url(#${id('turLit')})` });
  // shaded east faces beyond the ridges
  body += path('M802,142 C806,210 798,286 826,350 C858,420 930,466 1030,494 L1030,290 C1000,268 980,244 962,228 C948,222 940,218 934,216 C920,226 910,232 904,232 C890,232 880,226 876,222 C862,204 844,166 828,150 C820,144 810,140 802,142Z', { fill: '#1B2048', opacity: 0.7 });
  body += path('M934,218 C930,260 944,300 976,330 C998,350 1014,360 1030,366 L1030,290 C1004,266 980,240 962,228 C952,222 944,218 934,218Z', { fill: '#161A3E', opacity: 0.6 });
  // starlight catching the summit skyline
  body += path('M758,190 C772,160 790,142 806,140 C820,140 834,150 846,170', { fill: 'none', stroke: '#8F8CC4', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.45 });

  // ---- valley floor of Tuwa
  body += path(ridge([[-20, 690], [120, 676], [260, 688], [400, 670], [560, 660], [720, 668], [880, 654], [1020, 664]], 1000), { fill: `url(#${id('valley')})` });
  // the family tent, far off in the valley
  body += ellipse(140, 700, 66, 7, { fill: C.ink, opacity: 0.3 });
  body += farTent(140, 698, { w: 112, h: 58 });
  // little dark shrubs dotted along the valley
  for (const [bx, by, bw] of [[268, 694, 26], [304, 698, 17], [452, 676, 22], [890, 664, 26], [936, 670, 16], [40, 690, 24]]) {
    body += g({ fill: '#24265A' }, circle(bx - bw * 0.3, by - bw * 0.25, bw * 0.32), circle(bx + bw * 0.05, by - bw * 0.42, bw * 0.4), circle(bx + bw * 0.35, by - bw * 0.22, bw * 0.3), rect(bx - bw * 0.6, by - bw * 0.2, bw * 1.2, bw * 0.2, { rx: bw * 0.1 }));
  }

  // ---- warm light spilling over the slopes and the valley
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('warm')})` });
  // the knoll where the tree stands, lit from above
  body += path(blob([[360, 640], [420, 594], [490, 566], [560, 556], [636, 560], [704, 584], [756, 628], [700, 660], [560, 668], [420, 664]]), { fill: `url(#${id('knoll')})` });
  body += path('M430,592 C480,568 530,558 572,556 C620,556 660,564 690,578 C650,572 610,568 572,568 C530,568 480,576 430,592Z', { fill: '#F6D3A6', opacity: 0.55 });
  for (const [bx, by, bw, bh, sd] of [[690, 600, 46, 26, 1], [432, 610, 38, 20, 2], [736, 640, 30, 16, 3]]) {
    body += path(blob([[bx - bw / 2, by], [bx - bw * 0.4, by - bh * 0.7], [bx - bw * 0.05, by - bh], [bx + bw * 0.35, by - bh * 0.8], [bx + bw / 2, by]]), { fill: '#6A5884' }) +
      path(blob([[bx - bw * 0.42, by - bh * 0.55], [bx - bw * 0.1, by - bh * 0.95], [bx + bw * 0.2, by - bh * 0.9], [bx, by - bh * 0.6]]), { fill: '#E3B9A2', opacity: 0.6 });
  }
  for (const [gx, gy, gh, sd] of [[520, 562, 22, 31], [612, 562, 20, 32], [470, 578, 18, 33], [660, 572, 16, 34]]) body += grass(gx, gy, { h: gh, fill: '#5D7A6A', n: 5, seed: sd });

  // ---- the close glow and the tree
  body += circle(GX, GY, 330, { fill: `url(#${id('glowMid')})` });
  body += circle(GX, GY - 10, 230, { fill: `url(#${id('glowCore')})` });
  body += lightTree(LX, LY, id);
  for (const [sx, sy, ss, c] of [[372, 250, 13, '#FFF6DC'], [762, 300, 11, '#FFF6DC'], [410, 470, 8, '#FFFFFF'], [716, 470, 9, '#FFFFFF'], [490, 150, 9, '#FFF6DC'], [648, 140, 11, '#FFFFFF'], [330, 380, 7, '#FFF6DC'], [800, 400, 7, '#FFF6DC'], [560, 105, 6, '#FFFFFF']]) {
    body += sparkle(sx, sy, ss, c, { opacity: 0.92 });
  }

  // ---- mid-ground: sleeping sheep, warmly lit from the tree
  body += path(ridge([[-20, 900], [300, 884], [470, 820], [600, 790], [700, 778], [820, 770], [920, 760], [1020, 766]], 1000), { fill: '#2B2C5A' });
  body += ellipse(800, 800, 230, 46, { fill: `url(#${id('pool')})` });
  body += restingSheep(870, 840, { s: 0.98, flip: true, seed: 4 });
  body += restingSheep(722, 820, { s: 0.8, flip: true, seed: 7 });
  body += restingSheep(922, 784, { s: 0.6, flip: true, seed: 9 });
  for (const [gx, gy, gh, sd] of [[640, 826, 34, 11], [790, 850, 30, 12], [948, 852, 36, 13], [990, 800, 26, 14]]) body += grass(gx, gy, { h: gh, fill: '#3A3F74', n: 5, seed: sd });

  // ---- foreground ground
  body += path(ridge([[-20, 880], [140, 866], [320, 876], [520, 862], [700, 880], [880, 870], [1020, 876]], 1000), { fill: '#1D1D43' });

  // ---- the rock with the sandals, and the staff leaning on it
  body += ellipse(270, 946, 250, 22, { fill: C.ink, opacity: 0.4 });
  body += path(blob([[60, 930], [62, 856], [92, 806], [170, 778], [290, 770], [400, 780], [462, 812], [480, 880], [470, 936], [300, 956], [130, 954]]), { fill: '#383767' });
  body += path(blob([[250, 950], [300, 880], [390, 838], [476, 850], [476, 936]]), { fill: '#2A2955', opacity: 0.85 });
  // top surface catching the light
  body += path(blob([[82, 846], [120, 806], [200, 784], [300, 778], [400, 788], [452, 818], [440, 850], [330, 866], [180, 866]]), { fill: '#8E7C9F' });
  body += path(blob([[260, 790], [360, 784], [430, 800], [446, 826], [380, 834], [300, 820]]), { fill: '#DDB79E', opacity: 0.6 });
  body += path('M96,858 C170,872 330,876 444,848', { fill: 'none', stroke: '#C9A493', 'stroke-width': 3, opacity: 0.5, 'stroke-linecap': 'round' });
  // the sandals, placed neatly side by side, toes toward the light
  body += sandal(208, 826, { rot: 18, s: 1.1, mirror: true });
  body += sandal(290, 818, { rot: 18, s: 1.1 });
  // the staff, resting against the rock's edge
  body += staff(494, 992, 404, 640, { w: 17 });
  body += ellipse(494, 994, 24, 5, { fill: C.ink, opacity: 0.4 });

  // ---- framing: dark shrubs, grasses and pebbles
  body += path(blob([[850, 1012], [862, 950], [910, 912], [980, 900], [1030, 920], [1030, 1012]]), { fill: '#24234C' });
  body += path('M864,952 C872,928 900,910 940,902 C960,898 980,898 996,902 C970,904 940,910 916,922 C892,934 876,948 864,952Z', { fill: '#9E84A8', opacity: 0.6 });
  body += path(blob([[930, 1012], [960, 960], [1030, 950], [1030, 1012]]), { fill: '#1A1A3C' });
  for (const [gx, gy, gh, sd, col] of [[22, 1004, 130, 1, '#2A3064'], [64, 1006, 96, 2, '#252A5C'], [112, 1006, 70, 3, '#2A3064'], [620, 1004, 58, 4, '#262B5E'], [850, 1004, 74, 5, '#2A3064'], [990, 908, 70, 6, '#2A3064']]) {
    body += grass(gx, gy, { h: gh, fill: col, n: 7, seed: sd, spread: 1.4 });
  }
  for (const [px, py, pw] of [[650, 948, 22], [700, 964, 14], [596, 924, 12], [790, 950, 18]]) {
    body += ellipse(px, py, pw, pw * 0.55, { fill: '#38386A' }) + ellipse(px - pw * 0.25, py - pw * 0.22, pw * 0.42, pw * 0.2, { fill: '#C4A2A4', opacity: 0.5 });
  }

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
