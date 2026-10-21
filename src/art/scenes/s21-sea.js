// The sea opens a path (Quran 26:61-66, 20:77-78, 2:50).
// The sea split in two: two towering walls of water, "each part like a great
// mountain", with fish, seaweed and coral inside them. Between them a dry
// sandy path with shells, starfish and a line of footprints leads to the far
// shore, where the sun is rising. No people, no army.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, smooth, blob,
  sparkle, cloud, farBird, fish, palm, r1, eye, T, poly,
} from '../lib.js';

// ---- perspective of the sea floor: vanishing point (VX, HZ); the bottom
// edge of the picture is depth 1, the far shore is about depth 4.8.
const VX = 500;
const HZ = 442;
const FOOT = 558; // screen distance from the horizon to the bottom edge at depth 1
const ground = (X, s) => [VX + X * s, HZ + FOOT * s]; // X in px at depth 1; s = 1/depth

// A broad, wavy ribbon of seaweed from (x, y) rising h px, with a light midrib.
function kelp(x, y, h, { w = 16, sway = 18, fill = C.leaf3, dark = C.leaf4, seed = 1 } = {}) {
  const R = rng(seed);
  const n = 9;
  const ph = R() * Math.PI * 2;
  const mid = [];
  const left = [];
  const right = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = x + Math.sin(t * Math.PI * 2.4 + ph) * sway * (0.3 + t);
    const cy = y - h * t;
    const ww = w * (1 - t * 0.55) * (0.8 + 0.35 * Math.sin(t * 11 + seed * 1.7));
    mid.push([cx, cy]);
    left.push([cx - ww / 2, cy]);
    right.push([cx + ww / 2, cy]);
  }
  const tip = mid[n];
  const d = smooth(left) + ` Q${r1(tip[0])},${r1(tip[1] - w * 0.5)} ` + smooth(right.reverse()).slice(1).replace(/^([\d.-]+),([\d.-]+)/, '$1,$2') + 'Z';
  return (
    path(d, { fill }) +
    path(smooth(mid.slice(0, n)), { fill: 'none', stroke: dark, 'stroke-width': r1(Math.max(1.2, w * 0.12)), opacity: 0.45, 'stroke-linecap': 'round' }) +
    path(smooth(left.slice(1, n - 1).map(([a, b]) => [a + w * 0.18, b])), { fill: 'none', stroke: mix(fill, '#FFFFFF', 0.35), 'stroke-width': r1(Math.max(1, w * 0.1)), opacity: 0.55, 'stroke-linecap': 'round' })
  );
}
// Little tuft of sea grass.
function seagrass(x, y, h, s = 1, fill = '#5BB08A') {
  let d = '';
  for (const [dx, hh, lean] of [[-8, 0.7, -10], [-2, 1, -3], [5, 0.85, 8], [11, 0.6, 14]]) {
    d += `M${r1(x + dx * s - 3 * s)},${r1(y)} Q${r1(x + dx * s + lean * s * 0.2)},${r1(y - h * hh * 0.6)} ${r1(x + dx * s + lean * s)},${r1(y - h * hh)} Q${r1(x + dx * s + lean * s * 0.3 + 3 * s)},${r1(y - h * hh * 0.5)} ${r1(x + dx * s + 3 * s)},${r1(y)}Z `;
  }
  return path(d, { fill });
}

// Branching coral. (x, y) = base.
function coral(x, y, s = 1, fill = C.coral2, tip = C.coral1) {
  const st = { fill: 'none', stroke: fill, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  return g({ transform: T(x, y, s) },
    path('M0,0 C0,-30 -4,-50 -22,-70 M0,-34 C10,-50 26,-56 30,-84 M-12,-56 C-24,-64 -34,-66 -40,-86 M18,-60 C12,-72 10,-84 14,-100 M-4,-40 C-2,-70 2,-90 -4,-112', { ...st, 'stroke-width': 11 }),
    g({ fill: tip }, circle(-22, -70, 7), circle(30, -84, 7), circle(-40, -86, 6.5), circle(14, -100, 6.5), circle(-4, -112, 7)),
  );
}
// Round brain coral / sponge. (x, y) = base centre.
function domeCoral(x, y, r, fill = C.rose2, line = C.rose1) {
  return path(`M${r1(x - r)},${r1(y)} A${r1(r)},${r1(r * 0.85)} 0 0 1 ${r1(x + r)},${r1(y)}Z`, { fill }) +
    path(`M${r1(x - r * 0.7)},${r1(y - r * 0.2)} q${r1(r * 0.2)},${r1(-r * 0.35)} ${r1(r * 0.4)},0 t${r1(r * 0.4)},0 t${r1(r * 0.4)},0 M${r1(x - r * 0.45)},${r1(y - r * 0.55)} q${r1(r * 0.15)},${r1(-r * 0.25)} ${r1(r * 0.3)},0 t${r1(r * 0.3)},0 t${r1(r * 0.3)},0`, { fill: 'none', stroke: line, 'stroke-width': r1(Math.max(1.5, r * 0.08)), 'stroke-linecap': 'round', opacity: 0.8 });
}

// Friendly sea turtle swimming right. (x, y) = shell centre.
function turtle(x, y, { s = 1, flip = false, shell = C.leaf3, shellDark = C.leaf4, skin = '#9FD3B5', rot = 0 } = {}) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${flip ? -s : s} ${s})` },
    path('M-30,10 C-56,20 -70,36 -66,44 C-52,44 -36,30 -22,18Z', { fill: skin }),
    path('M24,8 C40,22 56,40 74,40 C74,30 56,14 36,2Z', { fill: skin }),
    path('M-20,-16 C-40,-36 -50,-56 -44,-62 C-30,-58 -16,-40 -8,-22Z', { fill: skin }),
    path('M26,-14 C44,-38 60,-50 74,-48 C70,-36 50,-22 34,-8Z', { fill: skin }),
    ellipse(64, -6, 22, 17, { fill: skin }),
    ellipse(0, 0, 52, 34, { fill: shellDark }),
    ellipse(-3, -3, 48, 30, { fill: shell }),
    path('M-24,-16 L-8,-24 L10,-24 L26,-14 L22,4 L4,10 L-16,8 L-28,-4Z', { fill: mix(shell, '#FFFFFF', 0.25) }),
    path('M-8,-24 L-16,8 M10,-24 L4,10 M-28,-4 L22,4', { fill: 'none', stroke: shellDark, 'stroke-width': 2.5, opacity: 0.6 }),
    eye(70, -10, 4.2),
    ellipse(74, 0, 5, 3, { fill: C.cheek, opacity: 0.6 }),
    path('M76,2 Q80,4 84,2', { fill: 'none', stroke: C.ink, 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: 0.6 }),
  );
}

// Starfish with a sweet face, lying on the sand. (x, y) centre; q = squash.
function starfish(x, y, r, { rot = 0, q = 1, fill = C.coral2, dot = C.coral0, face = true } = {}) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.48;
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
  }
  const d = 'M' + pts.map((p) => p.map(r1).join(',')).join(' L') + 'Z';
  const kids = [
    path(d, { fill: mix(fill, '#000000', 0.15), stroke: mix(fill, '#000000', 0.15), 'stroke-width': r * 0.28, 'stroke-linejoin': 'round', transform: 'translate(0 3)' }),
    path(d, { fill, stroke: fill, 'stroke-width': r * 0.28, 'stroke-linejoin': 'round' }),
  ];
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    kids.push(circle(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.07, { fill: dot }));
  }
  if (face) kids.push(eye(-r * 0.16, -r * 0.06, r * 0.1), eye(r * 0.16, -r * 0.06, r * 0.1), path(`M${r1(-r * 0.1)},${r1(r * 0.12)} Q0,${r1(r * 0.22)} ${r1(r * 0.1)},${r1(r * 0.12)}`, { fill: 'none', stroke: C.ink, 'stroke-width': r1(r * 0.05), 'stroke-linecap': 'round' }), ellipse(-r * 0.3, r * 0.1, r * 0.08, r * 0.05, { fill: C.cheek }), ellipse(r * 0.3, r * 0.1, r * 0.08, r * 0.05, { fill: C.cheek }));
  return g({ transform: `translate(${r1(x)} ${r1(y)}) scale(1 ${r1(q)}) rotate(${r1(rot)})` }, kids);
}

// Scallop shell. (x, y) = hinge; q = squash.
function scallop(x, y, s, { rot = 0, q = 1, fill = C.rose0, line = C.rose1 } = {}) {
  const kids = [path('M0,0 L-30,-30 C-24,-48 24,-48 30,-30Z', { fill }), rect(-9, -4, 18, 8, { rx: 3, fill: line })];
  for (const a of [-24, -12, 0, 12, 24]) kids.push(path(`M0,-2 L${a},-40`, { stroke: line, 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0.8 }));
  return g({ transform: `translate(${r1(x)} ${r1(y)}) scale(${r1(s)} ${r1(s * q)}) rotate(${r1(rot)})` }, kids);
}
// Little spiral shell. (x, y) = centre.
function spiralShell(x, y, s, { rot = 0, fill = C.sand1, line = C.sand4 } = {}) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${r1(s)})` },
    path('M-26,6 C-28,-12 -10,-24 8,-20 C26,-16 34,0 26,10 C16,20 -16,20 -26,6Z', { fill }),
    path('M-8,-4 C-6,-12 6,-12 8,-4 C10,4 0,8 -4,4', { fill: 'none', stroke: line, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    path('M8,-20 C18,-14 28,-6 26,10', { fill: 'none', stroke: line, 'stroke-width': 2.4, opacity: 0.6 }),
    path('M-26,6 L-38,10 L-26,12Z', { fill: line }),
  );
}

// Cute crab, claws raised in a wave. (x, y) = feet.
function crab(x, y, s = 1) {
  const leg = { fill: 'none', stroke: C.coral3, 'stroke-width': 5, 'stroke-linecap': 'round' };
  return g({ transform: T(x, y, s) },
    ellipse(0, 2, 46, 7, { fill: C.ink, opacity: 0.12 }),
    path('M-24,-10 L-40,-2 L-46,4 M-22,-4 L-36,4 L-40,10 M24,-10 L40,-2 L46,4 M22,-4 L36,4 L40,10', leg),
    path('M-28,-22 C-40,-34 -46,-46 -42,-58 M28,-22 C40,-34 46,-46 42,-58', { ...leg, 'stroke-width': 6 }),
    path('M-42,-58 C-58,-62 -60,-82 -46,-86 L-40,-72 L-34,-80 C-28,-70 -32,-58 -42,-58Z', { fill: C.coral2 }),
    path('M42,-58 C58,-62 60,-82 46,-86 L40,-72 L34,-80 C28,-70 32,-58 42,-58Z', { fill: C.coral2 }),
    ellipse(0, -18, 34, 22, { fill: C.coral2 }),
    ellipse(-6, -24, 20, 10, { fill: C.coral1, opacity: 0.8 }),
    path('M-10,-36 L-12,-48 M10,-36 L12,-48', { fill: 'none', stroke: C.coral3, 'stroke-width': 4, 'stroke-linecap': 'round' }),
    circle(-12, -51, 6.5, { fill: C.white }), circle(12, -51, 6.5, { fill: C.white }),
    eye(-12, -51, 3.6), eye(12, -51, 3.6),
    path('M-8,-12 Q0,-6 8,-12', { fill: 'none', stroke: C.coral4, 'stroke-width': 2.4, 'stroke-linecap': 'round' }),
    ellipse(-20, -14, 5, 3, { fill: C.cheek, opacity: 0.8 }), ellipse(20, -14, 5, 3, { fill: C.cheek, opacity: 0.8 }),
  );
}

// A footprint pressed into the sand, toes pointing to the far shore.
// (x, y) = centre; sx, sy = scale across / along the path; mirror = left foot.
function footprint(x, y, sx, sy, mirror) {
  const sole = 'M0,-38 C12,-38 18,-28 17,-16 C16,-6 12,2 12,12 C12,24 15,32 10,40 C6,46 -6,46 -10,40 C-14,32 -12,22 -12,12 C-12,2 -16,-8 -16,-18 C-16,-30 -10,-38 0,-38Z';
  const toes = [[-9, -50, 6], [1, -54, 4.8], [8.5, -52, 4.2], [14, -47, 3.6], [18, -40, 3]];
  const tf = (dy) => `translate(${r1(x)} ${r1(y + dy)}) scale(${r1(sx * (mirror ? -1 : 1))} ${r1(sy)})`;
  const shape = (fill, op, dy) => g({ fill, opacity: op, transform: tf(dy) }, path(sole), toes.map(([a, b, r]) => ellipse(a, b, r, r * 1.1)));
  return shape('#FFF3D6', 0.85, -Math.max(0.8, sy * 4)) + shape('#CF9150', 0.8, 0);
}

// Soft beams that fade with distance (fill = a userSpace radial gradient).
function softRays(x, y, { n = 9, len = 500, width = 4, from = -170, to = -10, fill, seed = 1 } = {}) {
  const R = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = ((from + ((to - from) * i) / (n - 1) + R.range(-4, 4)) * Math.PI) / 180;
    const w = (width * R.range(0.6, 1.3) * Math.PI) / 180;
    const L = len * R.range(0.7, 1);
    s += poly([[x, y], [x + Math.cos(a - w) * L, y + Math.sin(a - w) * L], [x + Math.cos(a + w) * L, y + Math.sin(a + w) * L]], { fill });
  }
  return s;
}

export default function render() {
  const id = ids('s21');
  const R = rng(21);
  const FAR = 558; // where the walls end at the far shore
  const defs = [
    linear(id('sky'), [[0, '#6FC0D9'], [0.3, '#A8DDE3'], [0.55, '#F7E4BE'], [0.75, '#FFD9A0'], [1, '#FFE6B4']], { x2: 0, y2: 560, units: 'userSpaceOnUse' }),
    glowDef(id('sunGlow'), '#FFF0C4', 0.95),
    radial(id('beam'), [[0, '#FFF6D6', 0.55], [0.6, '#FFF3CC', 0.15], [1, '#FFF3CC', 0]], { cx: VX, cy: 528, r: 520, units: 'userSpaceOnUse' }),
    linear(id('wallL'), [[0, '#B8EEE8'], [0.18, '#86DCDC'], [0.45, '#4CB9CA'], [0.75, '#2E93AE'], [1, '#22769A']], { x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    linear(id('wallR'), [[0, '#B0ECE8'], [0.18, '#7ED8DA'], [0.45, '#46B4C8'], [0.75, '#2B8EAA'], [1, '#207296']], { x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    radial(id('farGlow'), [[0, '#FFF4D2', 0.95], [0.35, '#F9E7B8', 0.55], [1, '#BDEBE0', 0]], { cx: VX, cy: 520, r: 250, units: 'userSpaceOnUse' }),
    linear(id('path'), [[0, '#FFF1CC'], [0.25, '#FBE1A6'], [0.6, '#F2CD88'], [1, '#E9BC76']], { y1: FAR, x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    radial(id('pathGlow'), [[0, '#FFF8E2', 0.8], [0.5, '#FFF1CF', 0.3], [1, '#FFF1CF', 0]]),
    vignetteDef(id('vig'), C.ink, 0.2),
  ];

  // ---- the two walls of water (inner faces seen in perspective)
  const crestL = [[-30, 50], [34, 22], [100, 62], [156, 44], [214, 100], [252, 118], [296, 178], [334, 222], [358, 286], [384, 330], [404, 404], [420, 444], [430, 504], [436, FAR]];
  const crestR = [[1030, 76], [966, 38], [904, 84], [846, 64], [792, 124], [752, 144], [706, 208], [668, 246], [644, 312], [616, 356], [598, 424], [582, 460], [572, 512], [564, FAR]];
  const faceL = `${smooth(crestL)} L190,1000 L-30,1000 Z`;
  const faceR = `${smooth(crestR)} L810,1000 L1030,1000 Z`;
  defs.push(`<clipPath id="${id('clipL')}"><path d="${faceL}"/></clipPath>`, `<clipPath id="${id('clipR')}"><path d="${faceR}"/></clipPath>`);
  const baseAt = (side, t) => [VX + side * (64 + 246 * t), FAR + 442 * t]; // foot of a wall, t: 0 far .. 1 near

  let body = '';
  // ---- sky, rising sun and the far shore
  body += rect(0, 0, 1000, 600, { fill: `url(#${id('sky')})` });
  body += softRays(VX, 528, { n: 9, len: 560, width: 3.6, from: -160, to: -20, fill: `url(#${id('beam')})`, seed: 5 });
  body += cloud(512, 150, 120, { fill: '#F6FCF9', shade: '#D6EEEC', seed: 11, opacity: 0.85 });
  body += cloud(424, 336, 84, { fill: '#FFF0DE', shade: '#F8D6BE', seed: 4, opacity: 0.9 });
  body += cloud(606, 300, 104, { fill: '#FFF0DE', shade: '#F8D6BE', seed: 8, opacity: 0.9 });
  for (const [bx, by, bs] of [[440, 236, 1.1], [470, 220, 0.85], [574, 206, 0.9]]) body += farBird(bx, by, bs, '#5F7F99', 0.55);
  body += circle(VX, 528, 240, { fill: `url(#${id('sunGlow')})` });
  body += circle(VX, 530, 70, { fill: '#FFE7A8', opacity: 0.5 });
  body += circle(VX, 530, 60, { fill: '#FFDF8E' });
  body += circle(VX - 6, 524, 50, { fill: '#FFF0C0' });
  body += circle(VX - 14, 516, 30, { fill: '#FFFBEA', opacity: 0.85 });
  // far shore: soft golden hills with two tiny palms
  body += path(`M380,${FAR + 2} C404,540 432,530 460,534 C480,522 504,520 524,528 C552,522 584,532 620,${FAR + 2}Z`, { fill: '#E6B97C' });
  body += path(`M380,${FAR + 2} C420,548 458,544 500,546 C544,544 584,548 620,${FAR + 2}Z`, { fill: '#F3D39C' });
  body += palm(456, 538, { h: 36, seed: 3, dates: false, trunk: '#B98A62', trunkDark: '#9A7050', leaf: '#86AE7E', leafMid: '#76A072', leafDark: '#6B9468' });
  body += palm(548, 534, { h: 30, seed: 6, lean: -0.1, dates: false, trunk: '#B98A62', trunkDark: '#9A7050', leaf: '#86AE7E', leafMid: '#76A072', leafDark: '#6B9468' });

  // ---- the dry path through the sea
  const pathD = `M${VX - 64},${FAR} L${VX + 64},${FAR} L810,1000 L190,1000Z`;
  body += path(pathD, { fill: `url(#${id('path')})` });
  body += ellipse(VX, 660, 150, 200, { fill: `url(#${id('pathGlow')})` });
  // damp sand at the foot of each wall
  body += path(`M${VX - 64},${FAR} L${VX - 50},${FAR} L250,1000 L190,1000Z`, { fill: '#D7A564', opacity: 0.5 });
  body += path(`M${VX + 64},${FAR} L${VX + 50},${FAR} L750,1000 L810,1000Z`, { fill: '#D7A564', opacity: 0.5 });
  // ripples in the sand (in perspective)
  for (let i = 0; i < 18; i++) {
    const s = 1 / (1.06 + i * 0.22);
    const [cx, cy] = ground(R.range(-200, 200), s);
    const w = 80 * s * R.range(0.7, 1.2);
    body += path(`M${r1(cx - w)},${r1(cy)} q${r1(w * 0.5)},${r1(-7 * s)} ${r1(w)},0 t${r1(w)},0`, { fill: 'none', stroke: '#D8A867', 'stroke-width': r1(Math.max(1.2, 3.4 * s)), 'stroke-linecap': 'round', opacity: 0.4 });
  }
  // the line of footprints leading to the far shore
  for (let i = 0; i < 16; i++) {
    const s = 1 / (1.04 + i * 0.25);
    const side = i % 2 === 0 ? 1 : -1;
    const [fx, fy] = ground(side * 38 + Math.sin(i * 0.6) * 8, s);
    body += footprint(fx, fy, 0.74 * s, 0.7 * s * 0.8 * Math.pow(s, 0.55), side < 0);
  }
  // shells, starfish and pebbles strewn along the path
  for (const [X, dep, kind, rot] of [[-230, 1.2, 'scallop', -20], [236, 1.55, 'spiral', 30], [-170, 2.2, 'pebble', 0], [170, 2.6, 'scallop', 15], [-130, 3.3, 'spiral', -30], [120, 3.8, 'pebble', 0], [250, 1.06, 'pebble', 0], [-150, 1.5, 'pebble', 0]]) {
    const s = 1 / dep;
    const [x, y] = ground(X, s);
    if (kind === 'scallop') body += scallop(x, y, 1.0 * s, { rot, q: 0.7 });
    else if (kind === 'spiral') body += spiralShell(x, y, 0.95 * s, { rot });
    else body += ellipse(x, y, 13 * s, 7.5 * s, { fill: '#C9A27A' }) + ellipse(x - 3 * s, y - 2 * s, 5.5 * s, 2.6 * s, { fill: '#FFF3DA', opacity: 0.7 });
  }
  body += starfish(330, 926, 40, { rot: -12, q: 0.62 });
  body += starfish(596, 746, 20, { rot: 20, q: 0.5, fill: C.gold3, dot: C.gold1, face: false });
  body += crab(676, 900, 0.74);

  // ---- a wall of water (shared by both sides)
  const wall = (side, face, crest, grad) => {
    let W = '';
    W += path(face, { fill: `url(#${id(grad)})` });
    W += path(face, { fill: `url(#${id('farGlow')})` });
    // the bright upper layer just under the surface, following the crest
    W += path(smooth(crest.map(([x, y]) => [x - side * 10, y + 46])), { fill: 'none', stroke: '#D6FBF5', 'stroke-width': 70, opacity: 0.28, 'stroke-linecap': 'round' });
    // light shafts slanting down through the water
    for (const [x0, w0, op] of [[60, 60, 0.5], [170, 40, 0.4], [270, 34, 0.35], [350, 22, 0.3]]) {
      const xa = side < 0 ? x0 : 1000 - x0;
      W += path(`M${xa},0 L${xa - side * w0},0 L${xa - side * (w0 + 120)},1000 L${xa - side * 60},1000Z`, { fill: '#E9FFFB', opacity: op * 0.33 });
    }
    // seaweed and sea grass along the foot of the wall (bigger nearer to us)
    for (const [t, hh, ww, sd] of [[0.08, 22, 0.25, 3], [0.2, 34, 0.38, 4], [0.34, 50, 0.55, 5]]) {
      const [x, y] = baseAt(side, t);
      W += seagrass(x + side * 10, y + 2, hh, ww * 2, '#5BB08A');
    }
    for (const [t, hh, ww, sd] of [[0.48, 120, 14, 6], [0.62, 160, 18, 7], [0.78, 210, 22, 8], [0.93, 260, 26, 9]]) {
      const [x, y] = baseAt(side, t);
      W += kelp(x + side * 18, y + 4, hh, { w: ww, sway: hh * 0.1, fill: '#56AE7E', dark: '#2F7E64', seed: sd + (side > 0 ? 20 : 0) });
    }
    return W;
  };

  // ---- left wall
  let L = wall(-1, faceL, crestL, 'wallL');
  L += fish(118, 440, { s: 0.92, body: C.coral2, fin: C.coral3, belly: C.coral0 });
  L += fish(286, 650, { s: 0.6, body: C.gold2, fin: C.gold3, belly: C.gold0 });
  L += fish(330, 402, { s: 0.44, body: C.rose1, fin: C.rose2, belly: C.rose0 });
  L += fish(394, 520, { s: 0.28, body: '#FFF4E2', fin: C.sky0, belly: C.white, stripes: false });
  L += fish(156, 260, { s: 0.55, flip: true, body: C.gold1, fin: C.gold3, belly: C.gold0, stripes: false });
  for (const [fx, fy] of [[352, 312], [366, 300], [362, 324], [378, 314]]) L += fish(fx, fy, { s: 0.13, body: C.sky3, fin: C.sky1, belly: C.white, stripes: false });
  for (const [bx, by, br] of [[214, 380, 7], [224, 352, 4.5], [230, 330, 3], [96, 600, 6], [104, 574, 4], [362, 610, 4], [368, 594, 2.6]]) {
    L += circle(bx, by, br, { fill: 'none', stroke: '#F2FFFC', 'stroke-width': 1.8, opacity: 0.8 }) + circle(bx - br * 0.3, by - br * 0.3, br * 0.3, { fill: C.white, opacity: 0.8 });
  }
  L += kelp(36, 1010, 500, { w: 46, sway: 40, fill: '#3E9A74', dark: '#277158', seed: 11 });
  L += kelp(116, 1010, 380, { w: 38, sway: 32, fill: '#5AB27E', dark: '#2F7E64', seed: 12 });
  L += kelp(-14, 1010, 330, { w: 36, sway: 26, fill: '#2F8A6C', dark: '#226650', seed: 13 });
  L += coral(184, 1006, 1.25, C.coral2, C.coral1);
  L += domeCoral(250, 1006, 38, C.rose2, C.rose1);
  L += coral(318, 850, 0.6, C.gold3, C.gold1);
  L += domeCoral(354, 790, 17, '#E98B7A', C.coral1);
  body += g({ 'clip-path': `url(#${id('clipL')})` }, L);

  // ---- right wall
  let Rw = wall(1, faceR, crestR, 'wallR');
  Rw += turtle(842, 330, { s: 0.78, flip: true, rot: 8 });
  Rw += fish(880, 570, { s: 0.85, flip: true, body: C.gold2, fin: C.gold3, belly: C.gold0 });
  Rw += fish(722, 700, { s: 0.55, flip: true, body: C.coral1, fin: C.coral2, belly: C.coral0 });
  Rw += fish(676, 430, { s: 0.42, body: '#FFF4E2', fin: C.sky0, belly: C.white, stripes: false });
  Rw += fish(608, 540, { s: 0.26, flip: true, body: C.rose1, fin: C.rose2, belly: C.rose0 });
  for (const [fx, fy] of [[724, 250], [738, 238], [736, 262], [752, 250], [750, 274]]) Rw += fish(fx, fy, { s: 0.14, flip: true, body: C.gold0, fin: C.gold2, belly: C.white, stripes: false });
  for (const [bx, by, br] of [[782, 470, 7], [772, 444, 4.5], [766, 424, 3], [904, 770, 6], [896, 746, 4], [642, 640, 4], [638, 624, 2.6]]) {
    Rw += circle(bx, by, br, { fill: 'none', stroke: '#F2FFFC', 'stroke-width': 1.8, opacity: 0.8 }) + circle(bx - br * 0.3, by - br * 0.3, br * 0.3, { fill: C.white, opacity: 0.8 });
  }
  Rw += kelp(964, 1010, 480, { w: 46, sway: 40, fill: '#3E9A74', dark: '#277158', seed: 31 });
  Rw += kelp(890, 1010, 350, { w: 38, sway: 30, fill: '#5AB27E', dark: '#2F7E64', seed: 32 });
  Rw += kelp(1016, 1010, 300, { w: 34, sway: 26, fill: '#2F8A6C', dark: '#226650', seed: 33 });
  Rw += coral(816, 1006, 1.15, C.rose2, C.rose1);
  Rw += domeCoral(752, 1006, 36, C.coral2, C.coral1);
  Rw += coral(684, 856, 0.62, C.coral2, C.coral1);
  Rw += domeCoral(646, 796, 17, C.gold3, C.gold1);
  body += g({ 'clip-path': `url(#${id('clipR')})` }, Rw);

  // ---- soft foam where the walls stand on the dry sand
  for (const side of [-1, 1]) {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const [x, y] = baseAt(side, t);
      pts.push([x + Math.sin(i * 1.7) * 3 * t, y]);
    }
    body += path(smooth(pts), { fill: 'none', stroke: C.white, 'stroke-width': 4, opacity: 0.5, 'stroke-linecap': 'round' });
    for (const t of [0.3, 0.55, 0.7, 0.86, 0.95]) {
      const [x, y] = baseAt(side, t);
      body += circle(x - side * 8 * t, y - 6 * t, 1.5 + 3 * t, { fill: C.white, opacity: 0.45 });
    }
  }

  // ---- foam, spray and sparkles along the crests
  const FR = rng(212);
  for (const [crest, dir] of [[crestL, 1], [crestR, -1]]) {
    // a soft veil of spray hanging over the crest
    body += path(smooth(crest.slice(0, 9).map(([x, y]) => [x, y - 14])), { fill: 'none', stroke: C.white, 'stroke-width': 34, 'stroke-linecap': 'round', opacity: 0.16 });
    for (let k = 0; k < 16; k++) {
      const i = Math.floor(FR() * 8);
      const [x0, y0] = crest[i];
      const [x1, y1] = crest[i + 1];
      const t = FR();
      const sc = Math.max(0.35, Math.min(1, 1.12 - y0 / 520));
      body += circle(lerpN(x0, x1, t) + FR.range(-14, 14), lerpN(y0, y1, t) - FR.range(18, 56) * sc, FR.range(1.6, 4) * sc, { fill: C.white, opacity: FR.range(0.55, 0.9) });
    }
    body += path(smooth(crest), { fill: 'none', stroke: '#F4FFFD', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.95 });
    body += path(smooth(crest.slice(0, 7)), { fill: 'none', stroke: '#F4FFFD', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.95 });
    for (let i = 0; i < crest.length - 1; i++) {
      const [x0, y0] = crest[i];
      const [x1, y1] = crest[i + 1];
      const sc = Math.max(0.22, Math.min(1, 1.12 - y0 / 520));
      // foam: a cluster of soft bubbles riding the crest
      for (const t of [0.15, 0.5, 0.8]) {
        const x = lerpN(x0, x1, t) + FR.range(-3, 3);
        const y = lerpN(y0, y1, t);
        body += circle(x, y - 3 * sc, FR.range(4, 11) * sc, { fill: C.white, opacity: 0.92 });
      }
      // spray flying up
      if (sc > 0.3) {
        body += circle(x0 + 12 * dir, y0 - 20 * sc, 4.5 * sc, { fill: C.white, opacity: 0.85 });
        body += circle(x0 - 6 * dir, y0 - 34 * sc, 3.2 * sc, { fill: C.white, opacity: 0.75 });
        body += circle(x0 + 26 * dir, y0 - 40 * sc, 2.2 * sc, { fill: C.white, opacity: 0.65 });
      }
    }
  }
  for (const [sx, sy, ss] of [[220, 70, 15], [352, 222, 11], [420, 390, 8], [790, 96, 14], [650, 248, 11], [586, 400, 8], [96, 18, 10], [910, 34, 11]]) body += sparkle(sx, sy, ss, '#FFFBEA', { opacity: 0.95 });
  for (const [sx, sy, ss] of [[500, 410, 9], [470, 620, 7], [534, 690, 6], [448, 470, 6], [556, 458, 7]]) body += sparkle(sx, sy, ss, C.white, { opacity: 0.9 });

  body += vignette(id('vig'));
  return svgDoc({ defs: defs.join(''), body });
}
const lerpN = (a, b, t) => a + (b - a) * t;
