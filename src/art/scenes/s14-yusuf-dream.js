// Yusuf's Dream (Quran 12:4-6, 12:15-20).
// A magical night: exactly eleven stars, the sun and the moon in a graceful
// arc, gently bowing toward Yaqub's peaceful family tent beside an olive
// tree. An old stone well with a bucket on a rope in the foreground (12:10)
// and a small caravan of camels with lanterns in the distance (12:19).
// The sky holds no other stars, so the eleven can be counted.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  star5, crescent, cloud, camel, grass, flower, eye, T, r1,
} from '../lib.js';

const NIGHT = '#22386A';
const nt = (c, t = 0.45) => mix(c, NIGHT, t);

// ---------------------------------------------------------------- helpers
// Yaqub's tent: a wide, two-peaked family tent with warm light inside.
// (x, y) = bottom centre.
function familyTent(id, x, y, w, h, { fill, dark, stripe, glowId }) {
  const L = x - w / 2;
  const Rt = x + w / 2;
  const outline = `M${r1(L)},${r1(y)} L${r1(x - w * 0.44)},${r1(y - h * 0.5)} Q${r1(x - w * 0.34)},${r1(y - h * 1.02)} ${r1(x - w * 0.2)},${r1(y - h)} Q${r1(x)},${r1(y - h * 0.74)} ${r1(x + w * 0.2)},${r1(y - h)} Q${r1(x + w * 0.34)},${r1(y - h * 1.02)} ${r1(x + w * 0.44)},${r1(y - h * 0.5)} L${r1(Rt)},${r1(y)}Z`;
  let s = '';
  // guy ropes and pegs
  for (const [px, py, gx] of [[x - w * 0.2, y - h, L - w * 0.12], [x + w * 0.2, y - h, Rt + w * 0.12], [x - w * 0.44, y - h * 0.5, L - w * 0.2], [x + w * 0.44, y - h * 0.5, Rt + w * 0.2]]) {
    s += path(`M${r1(px)},${r1(py)} L${r1(gx)},${r1(y + 4)}`, { stroke: nt(C.wood0, 0.3), 'stroke-width': 2, opacity: 0.7 });
    s += rect(gx - 3, y - 4, 6, 10, { rx: 2, fill: nt(C.wood2, 0.3) });
  }
  s += `<clipPath id="${id}"><path d="${outline}"/></clipPath>`;
  s += path(outline, { fill });
  s += g({ 'clip-path': `url(#${id})` },
    // woven stripes
    ...[0.32, 0.5, 0.68, 0.86].map((t) => rect(L, y - h * t, w, h * 0.05, { fill: stripe, opacity: 0.5 })),
    ...[0.32, 0.5, 0.68, 0.86].map((t) => rect(L, y - h * t + h * 0.065, w, h * 0.018, { fill: stripe, opacity: 0.35 })),
    // shaded right part and the fold under each peak
    path(`M${r1(x + w * 0.2)},${r1(y - h * 1.1)} L${r1(Rt + 10)},${r1(y - h * 1.1)} L${r1(Rt + 10)},${r1(y + 5)} L${r1(x + w * 0.3)},${r1(y + 5)}Z`, { fill: dark, opacity: 0.45 }),
    path(`M${r1(x - w * 0.2)},${r1(y - h)} L${r1(x - w * 0.27)},${r1(y)} M${r1(x + w * 0.2)},${r1(y - h)} L${r1(x + w * 0.25)},${r1(y)}`, { stroke: dark, 'stroke-width': 3, opacity: 0.4 }),
  );
  // open doorway with warm lamplight inside
  const dl = x - w * 0.12;
  const dr = x + w * 0.1;
  const dt = y - h * 0.7;
  s += path(`M${r1(dl)},${r1(y)} L${r1(dl + w * 0.03)},${r1(dt + h * 0.08)} Q${r1(x - w * 0.01)},${r1(dt - h * 0.04)} ${r1(dr - w * 0.03)},${r1(dt + h * 0.08)} L${r1(dr)},${r1(y)}Z`, { fill: `url(#${glowId})` });
  // tied-back door flaps
  s += path(`M${r1(dl - w * 0.02)},${r1(y)} L${r1(dl + w * 0.03)},${r1(dt + h * 0.06)} Q${r1(dl - w * 0.005)},${r1(y - h * 0.3)} ${r1(dl - w * 0.07)},${r1(y)}Z`, { fill: dark });
  s += path(`M${r1(dr + w * 0.02)},${r1(y)} L${r1(dr - w * 0.03)},${r1(dt + h * 0.06)} Q${r1(dr + w * 0.005)},${r1(y - h * 0.3)} ${r1(dr + w * 0.07)},${r1(y)}Z`, { fill: dark });
  return s;
}

// Olive tree: gnarled, twisting trunk and silvery-green clumps of slim
// leaves with a few small olives. (x, y) = base of the trunk.
function oliveTree(x, y, { s = 1, seed = 4, leaf, leafDark, leafLight, trunk, trunkDark, olive }) {
  const R = rng(seed);
  const p = [];
  // trunk: a twisting main stem that splits into three branches
  p.push(path('M-30,0 C-22,-30 -36,-58 -18,-84 C-8,-100 -26,-118 -50,-138 L-38,-148 C-14,-128 4,-116 2,-96 C18,-118 30,-136 58,-150 L66,-140 C40,-124 22,-104 16,-80 C26,-52 18,-24 34,0Z', { fill: trunk }));
  p.push(path('M-6,-92 C-4,-120 -2,-140 4,-168 L16,-166 C10,-140 10,-118 8,-92Z', { fill: trunk }));
  p.push(path('M16,-80 C26,-52 18,-24 34,0 L14,0 C6,-26 10,-54 2,-80Z', { fill: trunkDark, opacity: 0.55 }));
  p.push(path('M-22,-24 q9,-8 18,0 M-14,-60 q8,-5 14,3 M6,-106 q6,-4 10,2', { fill: 'none', stroke: trunkDark, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.65 }));
  // irregular leaf clumps
  const clumps = [[-74, -160, 54, 40], [-8, -196, 64, 44], [62, -170, 58, 40], [-36, -132, 48, 30], [36, -132, 46, 28]];
  const clumpPath = (cx, cy, rx, ry, k) => {
    const Q = rng(seed * 10 + k);
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10;
      const rr = Q.range(0.82, 1.08);
      pts.push([cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr]);
    }
    return blob(pts);
  };
  clumps.forEach(([cx, cy, rx, ry], k) => p.push(path(clumpPath(cx + 4, cy + 7, rx, ry, k), { fill: leafDark })));
  // fringe of slim pointed leaves around every clump
  let fringe = '';
  clumps.forEach(([cx, cy, rx, ry]) => {
    for (let i = 0; i < 22; i++) {
      const a = (Math.PI * 2 * i) / 22 + R.range(-0.1, 0.1);
      if (Math.sin(a) > 0.55) continue;
      const lx = cx + Math.cos(a) * rx * 0.98;
      const ly = cy + Math.sin(a) * ry * 0.98;
      const rot = (a * 180) / Math.PI + R.range(-25, 25);
      fringe += ellipse(lx, ly, 10, 3.2, { fill: R() < 0.5 ? leaf : leafLight, transform: `rotate(${r1(rot)} ${r1(lx)} ${r1(ly)})` });
    }
  });
  p.push(fringe);
  clumps.forEach(([cx, cy, rx, ry], k) => p.push(path(clumpPath(cx, cy, rx * 0.94, ry * 0.9, k), { fill: leaf })));
  // moonlit tops of the clumps and leaf strokes for texture
  clumps.forEach(([cx, cy, rx, ry]) => p.push(ellipse(cx - rx * 0.2, cy - ry * 0.45, rx * 0.55, ry * 0.3, { fill: leafLight, opacity: 0.75 })));
  let strokes = '';
  for (let i = 0; i < 40; i++) {
    const [cx, cy, rx, ry] = clumps[i % clumps.length];
    const lx = cx + R.range(-0.7, 0.7) * rx;
    const ly = cy + R.range(-0.5, 0.6) * ry;
    const rot = R.range(-50, 50);
    strokes += ellipse(lx, ly, 8, 2.4, { fill: R() < 0.5 ? leafDark : leafLight, opacity: 0.7, transform: `rotate(${r1(rot)} ${r1(lx)} ${r1(ly)})` });
  }
  p.push(strokes);
  // small olives in twos and threes
  for (const [ox, oy] of [[-80, -146], [-4, -176], [58, -150], [-40, -118], [30, -118]]) {
    for (let k = 0; k < 3; k++) {
      const ex = ox + k * 8 - 8;
      const ey = oy + (k % 2) * 6;
      p.push(ellipse(ex, ey, 4, 5.2, { fill: olive }), circle(ex - 1.2, ey - 1.8, 1.3, { fill: C.white, opacity: 0.6 }));
    }
  }
  return g({ transform: T(x, y, s) }, p);
}

// An old round stone well with a wooden frame, rope and bucket.
// (x, y) = bottom centre of the well wall; w = width.
function stoneWell(id, x, y, w, { seed = 12 } = {}) {
  const R = rng(seed);
  const h = w * 0.52;
  const ry = w * 0.12;
  const top = y - h;
  const stoneCols = [nt(C.stone1, 0.4), nt(C.stone0, 0.45), nt(C.stone1, 0.5), nt(C.stone2, 0.38), nt(C.stone0, 0.52)];
  const mortar = '#2A3156';
  const yAt = (u, f) => top + f * (y - ry - top) + Math.sqrt(Math.max(0, 1 - u * u)) * ry;
  let s = '';
  // back post of the frame
  const postL = x - w * 0.5 - 10;
  const postR = x + w * 0.5 + 6;
  const barY = top - w * 0.5;
  s += rect(postR - 9, barY - 4, 18, top - barY + ry * 0.6, { rx: 6, fill: nt(C.wood3, 0.38) });
  // wall: a cylinder with a curved front
  const wall = `M${r1(x - w / 2)},${r1(top)} L${r1(x - w / 2)},${r1(y - ry)} A${r1(w / 2)},${r1(ry)} 0 0 0 ${r1(x + w / 2)},${r1(y - ry)} L${r1(x + w / 2)},${r1(top)}Z`;
  s += path(wall, { fill: mortar });
  const rows = 5;
  for (let r = 0; r < rows; r++) {
    const f0 = r / rows + 0.035;
    const f1 = (r + 1) / rows - 0.035;
    const n = 6;
    const off = (r % 2) * 0.5;
    for (let i = -1; i <= n; i++) {
      const a0 = Math.max(-0.995, -1 + ((i + off) / n) * 2 + 0.03);
      const a1 = Math.min(0.995, -1 + ((i + off + 1) / n) * 2 - 0.03);
      if (a1 - a0 < 0.08) continue;
      const pts = [];
      for (let k = 0; k <= 8; k++) {
        const u = a0 + ((a1 - a0) * k) / 8;
        pts.push([x + (u * w) / 2, yAt(u, f0)]);
      }
      for (let k = 8; k >= 0; k--) {
        const u = a0 + ((a1 - a0) * k) / 8;
        pts.push([x + (u * w) / 2, yAt(u, f1)]);
      }
      const fill = stoneCols[Math.floor(R() * stoneCols.length)];
      s += path('M' + pts.map((q) => q.map(r1).join(',')).join(' L') + 'Z', { fill, stroke: fill, 'stroke-width': 5, 'stroke-linejoin': 'round' });
    }
  }
  // shade on the right of the wall, a little moonlight on the left
  s += `<clipPath id="${id}"><path d="${wall}"/></clipPath>`;
  s += g({ 'clip-path': `url(#${id})` },
    rect(x + w * 0.16, top - 10, w * 0.5, h + 20, { fill: '#141D3D', opacity: 0.3 }),
    rect(x + w * 0.34, top - 10, w * 0.3, h + 20, { fill: '#141D3D', opacity: 0.25 }),
    rect(x - w * 0.5, top - 10, w * 0.12, h + 20, { fill: '#FFF3D6', opacity: 0.08 }),
  );
  // moss and a crack
  s += g({ fill: nt(C.leaf3, 0.4), opacity: 0.9 }, ellipse(x - w * 0.3, yAt(-0.6, 0.12), 18, 7), ellipse(x - w * 0.06, yAt(-0.1, 0.98), 24, 7), ellipse(x + w * 0.28, yAt(0.56, 0.5), 15, 6));
  s += path(`M${r1(x + w * 0.1)},${r1(yAt(0.2, 0.3))} l6,14 l-4,12`, { fill: 'none', stroke: mortar, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
  // rim of capstones around the dark opening
  s += ellipse(x, top, w / 2 + 9, ry + 7, { fill: nt(C.stone1, 0.4) });
  s += ellipse(x, top - 3, w / 2 + 7, ry + 4, { fill: nt(C.stone0, 0.42) });
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12 + 0.2;
    s += path(`M${r1(x + Math.cos(a) * (w / 2 - 12))},${r1(top - 3 + Math.sin(a) * (ry - 6))} L${r1(x + Math.cos(a) * (w / 2 + 7))},${r1(top - 3 + Math.sin(a) * (ry + 4))}`, { stroke: nt(C.stone2, 0.4), 'stroke-width': 2.5 });
  }
  s += ellipse(x, top - 2, w / 2 - 14, ry - 7, { fill: '#3A4269' });
  s += ellipse(x, top + 3, w / 2 - 20, ry - 11, { fill: '#0E1630' });
  s += path(`M${r1(x - w / 2 - 4)},${r1(top - 6)} A${r1(w / 2 + 7)},${r1(ry + 4)} 0 0 1 ${r1(x)},${r1(top - ry - 7)}`, { fill: 'none', stroke: '#F3E8D2', 'stroke-width': 3, opacity: 0.35, 'stroke-linecap': 'round' });
  // front post, crossbar and roller
  s += rect(postL - 10, barY - 4, 20, y - barY + 4 - ry * 0.6, { rx: 6, fill: nt(C.wood2, 0.32) });
  s += rect(postL - 10, barY - 4, 6, y - barY - ry, { rx: 3, fill: '#FFF3D6', opacity: 0.14 });
  s += rect(postL - 18, barY - 16, postR - postL + 36, 18, { rx: 8, fill: nt(C.wood2, 0.3) });
  s += rect(postL - 18, barY - 16, postR - postL + 36, 6, { rx: 3, fill: '#FFF3D6', opacity: 0.15 });
  const rx0 = x + w * 0.02;
  s += rect(rx0 - 26, barY - 2, 52, 22, { rx: 10, fill: nt(C.wood1, 0.32) });
  s += path(`M${r1(rx0 - 24)},${r1(barY + 4)} L${r1(rx0 + 24)},${r1(barY + 6)} M${r1(rx0 - 24)},${r1(barY + 12)} L${r1(rx0 + 24)},${r1(barY + 14)}`, { stroke: nt(C.sand2, 0.3), 'stroke-width': 3, opacity: 0.8 });
  // rope and the bucket hanging over the opening
  const by = top - w * 0.16;
  s += path(`M${r1(rx0 + 2)},${r1(barY + 20)} L${r1(rx0 + 2)},${r1(by - 24)}`, { stroke: nt(C.sand2, 0.3), 'stroke-width': 3 });
  s += path(`M${r1(rx0 - 20)},${r1(by - 6)} Q${r1(rx0 + 2)},${r1(by - 36)} ${r1(rx0 + 24)},${r1(by - 6)}`, { fill: 'none', stroke: nt(C.stone3, 0.3), 'stroke-width': 3.5 });
  s += path(`M${r1(rx0 - 24)},${r1(by - 6)} L${r1(rx0 + 28)},${r1(by - 6)} L${r1(rx0 + 21)},${r1(by + 30)} L${r1(rx0 - 17)},${r1(by + 30)}Z`, { fill: nt(C.wood1, 0.32) });
  s += path(`M${r1(rx0 + 4)},${r1(by - 6)} L${r1(rx0 + 28)},${r1(by - 6)} L${r1(rx0 + 21)},${r1(by + 30)} L${r1(rx0 + 2)},${r1(by + 30)}Z`, { fill: nt(C.wood3, 0.3), opacity: 0.5 });
  s += rect(rx0 - 25, by + 1, 54, 5, { rx: 2.5, fill: nt(C.wood3, 0.3) });
  s += rect(rx0 - 21, by + 20, 46, 5, { rx: 2.5, fill: nt(C.wood3, 0.3) });
  s += ellipse(rx0 + 2, by - 6, 26, 5, { fill: nt(C.wood3, 0.2) });
  return s;
}

// A sheep lying down asleep, facing RIGHT. (x, y) = ground under its middle.
function sleepingSheep(x, y, { s = 1, flip = false, wool = C.wool0, shade = C.wool2, face = '#5B4A4E', seed = 2 } = {}) {
  const R = rng(seed);
  const p = [];
  const puffs = [];
  for (let i = 0; i < 8; i++) {
    const a = Math.PI + (Math.PI * i) / 7;
    puffs.push([Math.cos(a) * 54, -34 + Math.sin(a) * 26, 22 + R.range(-3, 3)]);
  }
  p.push(ellipse(0, 2, 70, 9, { fill: '#0B1228', opacity: 0.25 }));
  p.push(g({ fill: shade }, puffs.map(([a, b, c]) => circle(a + 3, b + 5, c)), ellipse(3, -26, 62, 28)));
  p.push(g({ fill: wool }, puffs.map(([a, b, c]) => circle(a, b, c)), ellipse(0, -30, 60, 28)));
  // head resting on the ground
  p.push(ellipse(66, -24, 25, 21, { fill: face, transform: 'rotate(14 66 -24)' }));
  p.push(ellipse(46, -38, 15, 7, { fill: face, transform: 'rotate(28 46 -38)' }));
  p.push(g({ fill: wool }, circle(56, -44, 12), circle(70, -46, 10)));
  p.push(eye(74, -26, 5, true));
  p.push(ellipse(80, -15, 6, 3.5, { fill: C.cheek, opacity: 0.55 }));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// ---------------------------------------------------------------- scene
export default function render() {
  const id = ids('s14');
  const R = rng(1412);
  const defs = [
    linear(id('sky'), [[0, '#0F1A33'], [0.3, '#18284F'], [0.52, '#273C73'], [0.68, '#3E4A88'], [0.8, '#5F5598'], [1, '#6E5B9C']]),
    radial(id('magic'), [[0, '#C9B8F0', 0.38], [0.5, '#8F7FD0', 0.14], [1, '#8F7FD0', 0]]),
    glowDef(id('sunGlow'), '#FFE7B0', 0.7),
    glowDef(id('moonGlow'), '#FFF3D0', 0.55),
    glowDef(id('starGlow'), '#FFE59A', 0.55),
    glowDef(id('lamp'), '#FFD27A', 0.8),
    linear(id('door'), [[0, '#FFE3A0'], [1, '#F6B65A']]),
    glowDef(id('doorGlow'), '#FFC96B', 0.6),
    vignetteDef(id('vig'), '#0B1228', 0.3),
  ].join('');

  let body = '';
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  // a soft magical haze where the dream gathers
  body += ellipse(560, 470, 520, 380, { fill: `url(#${id('magic')})` });
  // soft night clouds (never star-like shapes, so the eleven stay countable)
  body += cloud(106, 116, 230, { fill: '#3E5390', seed: 11, opacity: 0.55 }) + cloud(110, 120, 230, { fill: '#2B3D72', shade: '#22335F', seed: 11, opacity: 0.85 });
  body += cloud(921, 82, 210, { fill: '#3E5390', seed: 12, opacity: 0.5 }) + cloud(925, 86, 210, { fill: '#2B3D72', shade: '#22335F', seed: 12, opacity: 0.8 });
  body += cloud(150, 640, 230, { fill: '#3C4C86', shade: '#33427A', seed: 3, opacity: 0.7 });
  body += cloud(880, 610, 200, { fill: '#45518D', shade: '#394680', seed: 5, opacity: 0.6 });

  // ----- the dream: sun, moon and eleven stars in an arc bowing to the tent
  const cx = 560;
  const cy = 650;
  const ax = 372;
  const ay = 470;
  const at = (deg) => [cx + Math.cos((deg * Math.PI) / 180) * ax, cy + Math.sin((deg * Math.PI) / 180) * ay];
  const [sx, sy] = at(208);
  const [mx, my] = at(332);
  // a faint ribbon of light joining them
  const arc = `M${r1(sx)},${r1(sy)} A${ax},${ay} 0 0 1 ${r1(mx)},${r1(my)}`;
  body += path(arc, { fill: 'none', stroke: '#FFE9B8', 'stroke-width': 34, opacity: 0.06, 'stroke-linecap': 'round' });
  body += path(arc, { fill: 'none', stroke: '#FFE9B8', 'stroke-width': 2.5, opacity: 0.18, 'stroke-linecap': 'round' });
  // the soft, dreamlike sun
  body += circle(sx, sy, 170, { fill: `url(#${id('sunGlow')})` });
  body += circle(sx, sy, 62, { fill: '#FFE3A6', opacity: 0.25 });
  body += circle(sx, sy, 50, { fill: '#FFDE9A' });
  body += circle(sx - 9, sy - 9, 36, { fill: '#FFF2CF', opacity: 0.7 });
  // the moon, horns turned toward the tent
  body += circle(mx, my, 150, { fill: `url(#${id('moonGlow')})` });
  body += crescent(mx, my, 48, { fill: '#FFF0C4', angle: 200, thickness: 0.46 });
  // exactly eleven stars, each tilted gently toward the tent
  for (let i = 0; i < 11; i++) {
    const deg = 221 + i * 9.8;
    const [x, y] = at(deg);
    const tilt = (deg - 270) * -0.4;
    body += circle(x, y, 46, { fill: `url(#${id('starGlow')})` });
    body += g({ transform: `rotate(${r1(tilt)} ${r1(x)} ${r1(y)})` },
      star5(x + 1.5, y + 2.5, 25, '#E9A93C', { stroke: '#E9A93C', 'stroke-width': 7, opacity: 0.6 }),
      star5(x, y, 25, '#FFD873', { stroke: '#FFD873', 'stroke-width': 7 }),
      star5(x - 2, y - 2.5, 12, '#FFF1C4', { stroke: '#FFF1C4', 'stroke-width': 3, opacity: 0.85 }),
    );
  }

  // ----- far hills with the little caravan and its lanterns
  body += path(ridge([[-20, 640], [120, 610], [260, 622], [400, 598], [560, 616], [720, 596], [860, 612], [1020, 600]]), { fill: '#3A4680' });
  const caravan = [[220, 612, 0.2], [282, 610, 0.19], [342, 606, 0.19], [400, 601, 0.2]];
  for (const [kx, ky, ks] of caravan) {
    body += camel(kx, ky, { s: ks, body: '#2B3466', dark: '#232B57', light: '#36407A' });
    body += path(`M${r1(kx + 14 * ks * 5)},${r1(ky - 34)} l0,10`, { stroke: '#F7C766', 'stroke-width': 1.4 });
    body += circle(kx + 14 * ks * 5, ky - 20, 16, { fill: `url(#${id('lamp')})` });
    body += circle(kx + 14 * ks * 5, ky - 21, 3.2, { fill: '#FFE08A' });
  }
  body += path('M228,566 Q252,572 276,566 M290,564 Q314,570 336,560 M350,560 Q372,566 394,556', { fill: 'none', stroke: '#232B57', 'stroke-width': 1.5, opacity: 0.8 });

  // mid hills
  body += path(ridge([[-20, 700], [140, 668], [330, 690], [520, 664], [700, 672], [880, 650], [1020, 662]]), { fill: '#2F3C72' });
  body += path(ridge([[-20, 700], [140, 668], [330, 690], [520, 664], [700, 672], [880, 650], [1020, 662]], 712), { fill: '#46559A', opacity: 0.5 });

  // ----- Yaqub's tent and the olive tree
  const tx = 610;
  const ty = 742;
  body += ellipse(tx, ty + 6, 260, 26, { fill: '#0B1228', opacity: 0.25 });
  body += oliveTree(828, 752, { s: 1.05, leaf: '#6F9488', leafDark: '#4B6B67', leafLight: '#9DBBAA', trunk: '#5D4C5E', trunkDark: '#43384C', olive: '#2E2D4D' });
  body += circle(tx, ty - 40, 190, { fill: `url(#${id('doorGlow')})` });
  body += familyTent(id('tent'), tx, ty, 330, 170, { fill: '#9A5D63', dark: '#6D3F4E', stripe: '#E8C9A8', glowId: id('door') });
  body += ellipse(tx - 4, ty + 16, 150, 30, { fill: `url(#${id('doorGlow')})` });
  // a small lamp hanging by the door and a water jar
  body += path(`M${tx - 52},${ty - 120} l0,22`, { stroke: '#C9A060', 'stroke-width': 2 });
  body += circle(tx - 52, ty - 86, 34, { fill: `url(#${id('lamp')})` });
  body += path(`M${tx - 60},${ty - 98} L${tx - 44},${ty - 98} L${tx - 42},${ty - 80} L${tx - 52},${ty - 74} L${tx - 62},${ty - 80}Z`, { fill: '#FFD67A' });
  body += g({},
    ellipse(tx + 186, ty - 22, 20, 24, { fill: '#B06E55' }),
    rect(tx + 176, ty - 52, 20, 12, { rx: 4, fill: '#9A5D49' }),
    ellipse(tx + 180, ty - 30, 6, 10, { fill: '#D99A78', opacity: 0.5 }),
  );
  // the family's sheep asleep beside the tent
  body += sleepingSheep(400, 772, { s: 0.72, wool: '#D3CFE6', shade: '#A7A3C8', face: '#4A3F5E', seed: 3 });

  // ----- foreground meadow
  body += path(ridge([[-20, 800], [160, 780], [360, 810], [560, 800], [760, 790], [1020, 770]]), { fill: '#27345F' });
  body += sleepingSheep(842, 806, { s: 0.6, flip: true, wool: '#D3CFE6', shade: '#A7A3C8', face: '#4A3F5E', seed: 6 });
  body += path(ridge([[-20, 880], [200, 860], [420, 900], [640, 890], [860, 860], [1020, 870]]), { fill: '#1E2A50' });
  for (let i = 0; i < 26; i++) {
    const gx = R() * 1000;
    const gy = 800 + R() * 180;
    body += grass(gx, gy, { h: 22 + R() * 24, fill: R() < 0.5 ? '#33507A' : '#2C456C', n: 5, seed: i + 30 });
  }
  for (const [fx, fy, fr, fc] of [[520, 920, 9, '#E9E0F5'], [560, 940, 7, '#D7C7F0'], [700, 900, 8, '#F5D9E6'], [880, 930, 9, '#E9E0F5'], [940, 900, 7, '#D7C7F0'], [380, 950, 8, '#F5D9E6']]) {
    body += flower(fx, fy, { r: fr, fill: fc, center: C.gold1, stemH: 14, stem: '#33507A' });
  }

  // bottom-right framing: rocks, a bush and tall grass
  body += g({},
    path(blob([[820, 1010], [840, 940], [900, 905], [980, 912], [1030, 960], [1030, 1010]]), { fill: '#2A3560' }),
    path(blob([[900, 905], [980, 912], [1010, 940], [940, 935]]), { fill: '#3B4878' }),
    path(blob([[760, 1010], [770, 975], [810, 955], [850, 975], [860, 1010]]), { fill: '#253058' }),
  );
  for (const [bx, by, bw] of [[962, 905, 120], [880, 950, 90]]) {
    body += g({ fill: '#22395E' }, circle(bx - bw * 0.25, by - bw * 0.2, bw * 0.26), circle(bx + bw * 0.05, by - bw * 0.32, bw * 0.3), circle(bx + bw * 0.3, by - bw * 0.16, bw * 0.24));
    body += g({ fill: '#2C4A70' }, circle(bx - bw * 0.27, by - bw * 0.24, bw * 0.2), circle(bx + bw * 0.02, by - bw * 0.37, bw * 0.22));
  }
  body += grass(990, 965, { h: 70, fill: '#2C456C', n: 7, seed: 41 }) + grass(800, 985, { h: 50, fill: '#33507A', n: 6, seed: 42 });
  body += flower(930, 880, { r: 8, fill: '#F5D9E6', center: C.gold1 }) + flower(968, 862, { r: 7, fill: '#E9E0F5', center: C.gold1 }) + flower(866, 912, { r: 7, fill: '#D7C7F0', center: C.gold1 });

  // the old well, framing the bottom-left
  body += ellipse(180, 962, 175, 24, { fill: '#0B1228', opacity: 0.3 });
  body += stoneWell(id('well'), 180, 958, 250, { seed: 12 });
  body += grass(70, 975, { h: 46, fill: '#2C456C', n: 7, seed: 3 }) + grass(330, 970, { h: 40, fill: '#33507A', n: 6, seed: 8 });
  body += flower(98, 950, { r: 9, fill: '#F5D9E6', center: C.gold1 }) + flower(318, 952, { r: 8, fill: '#E9E0F5', center: C.gold1 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
