// Musa Helps at the Well (Quran 28:22-28).
// The well of Madyan in warm afternoon light: a stone well with a wooden
// frame and bucket, a stone trough full of water, a flock of sheep drinking
// happily, and a big shady tree beside it - "then he turned to the shade"
// (28:24). Desert hills behind. Kind and calm.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  sparkle, sun, cloud, sheep, bird, farBird, grass, flower, eye, T, r1,
} from '../lib.js';

const SKY = '#F8DDB0';
const haze = (c, t = 0.5) => mix(c, SKY, t);

// ---------------------------------------------------------------- helpers
// A sheep drinking with its head lowered, facing RIGHT (kit sheep style).
// (x, y) = ground between the feet.
function drinkingSheep(x, y, { s = 1, flip = false, wool = C.wool0, woolShade = C.wool2, face = '#5B4A4E', seed = 3 } = {}) {
  const R = rng(seed);
  const p = [];
  const legC = mix(face, '#000000', 0.2);
  p.push(rect(-40, -44, 13, 46, { rx: 6, fill: legC }), rect(26, -44, 13, 46, { rx: 6, fill: legC }));
  const puffs = [];
  for (let i = 0; i < 9; i++) {
    const a = (Math.PI * 2 * i) / 9;
    puffs.push([Math.cos(a) * 52, -78 + Math.sin(a) * 30, 24 + R.range(-3, 4)]);
  }
  p.push(g({ fill: woolShade }, puffs.map(([a, b, c]) => circle(a + 3, b + 5, c)), ellipse(3, -73, 58, 34)));
  p.push(g({ fill: wool }, puffs.map(([a, b, c]) => circle(a, b, c)), ellipse(0, -78, 56, 34)));
  p.push(rect(-30, -44, 13, 46, { rx: 6, fill: face }), rect(36, -44, 13, 46, { rx: 6, fill: face }));
  // woolly neck bending down
  p.push(circle(56, -66, 20, { fill: woolShade }), circle(54, -70, 20, { fill: wool }));
  // lowered head, muzzle to the water
  p.push(ellipse(76, -40, 21, 26, { fill: face, transform: 'rotate(28 76 -40)' }));
  p.push(ellipse(58, -60, 14, 7, { fill: face, transform: 'rotate(60 58 -60)' }));
  p.push(g({ fill: wool }, circle(64, -66, 11), circle(76, -62, 10)));
  p.push(eye(82, -42, 4.2, true));
  p.push(ellipse(86, -30, 5, 3, { fill: C.cheek, opacity: 0.55 }));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// A sheep resting on the ground in the shade, facing RIGHT. (x, y) = ground.
function restingSheep(x, y, { s = 1, flip = false, wool = C.wool0, shade = C.wool2, face = '#5B4A4E', seed = 2, sleepy = true } = {}) {
  const R = rng(seed);
  const p = [];
  const puffs = [];
  for (let i = 0; i < 8; i++) {
    const a = Math.PI + (Math.PI * i) / 7;
    puffs.push([Math.cos(a) * 54, -34 + Math.sin(a) * 26, 22 + R.range(-3, 3)]);
  }
  p.push(g({ fill: shade }, puffs.map(([a, b, c]) => circle(a + 3, b + 5, c)), ellipse(3, -26, 62, 28)));
  p.push(g({ fill: wool }, puffs.map(([a, b, c]) => circle(a, b, c)), ellipse(0, -30, 60, 28)));
  p.push(ellipse(66, -40, 23, 20, { fill: face, transform: 'rotate(-8 66 -40)' }));
  p.push(ellipse(46, -54, 14, 7, { fill: face, transform: 'rotate(20 46 -54)' }));
  p.push(g({ fill: wool }, circle(56, -58, 11), circle(70, -60, 10)));
  p.push(eye(74, -42, 4.6, sleepy));
  p.push(ellipse(80, -30, 5.5, 3.2, { fill: C.cheek, opacity: 0.55 }));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// The well of Madyan: round sandstone well, wooden frame, pulley, rope and
// bucket. (x, y) = bottom centre of the wall; w = width.
function madyanWell(id, x, y, w, { seed = 19 } = {}) {
  const R = rng(seed);
  const h = w * 0.5;
  const ry = w * 0.13;
  const top = y - h;
  const stones = ['#E9C48E', '#DDB079', '#F0D2A2', '#D5A56E', '#E4BC85'];
  const mortar = '#B98A55';
  const yAt = (u, f) => top + f * (y - ry - top) + Math.sqrt(Math.max(0, 1 - u * u)) * ry;
  const postL = x - w * 0.5 - 6;
  const postR = x + w * 0.5 + 6;
  const barY = top - w * 0.62;
  let s = '';
  // back post
  s += rect(postR - 9, barY, 18, top - barY + ry * 0.4, { rx: 6, fill: C.wood3 });
  const wall = `M${r1(x - w / 2)},${r1(top)} L${r1(x - w / 2)},${r1(y - ry)} A${r1(w / 2)},${r1(ry)} 0 0 0 ${r1(x + w / 2)},${r1(y - ry)} L${r1(x + w / 2)},${r1(top)}Z`;
  s += path(wall, { fill: mortar });
  const rows = 5;
  for (let r = 0; r < rows; r++) {
    const f0 = r / rows + 0.03;
    const f1 = (r + 1) / rows - 0.03;
    const n = 6;
    const off = (r % 2) * 0.5;
    for (let i = -1; i <= n; i++) {
      const a0 = Math.max(-0.995, -1 + ((i + off) / n) * 2 + 0.03);
      const a1 = Math.min(0.995, -1 + ((i + off + 1) / n) * 2 - 0.03);
      if (a1 - a0 < 0.08) continue;
      const pts = [];
      for (let k = 0; k <= 8; k++) pts.push([x + ((a0 + ((a1 - a0) * k) / 8) * w) / 2, yAt(a0 + ((a1 - a0) * k) / 8, f0)]);
      for (let k = 8; k >= 0; k--) pts.push([x + ((a0 + ((a1 - a0) * k) / 8) * w) / 2, yAt(a0 + ((a1 - a0) * k) / 8, f1)]);
      const fill = stones[Math.floor(R() * stones.length)];
      s += path('M' + pts.map((q) => q.map(r1).join(',')).join(' L') + 'Z', { fill, stroke: fill, 'stroke-width': 5, 'stroke-linejoin': 'round' });
    }
  }
  s += `<clipPath id="${id}"><path d="${wall}"/></clipPath>`;
  s += g({ 'clip-path': `url(#${id})` },
    rect(x + w * 0.14, top - 10, w * 0.5, h + 20, { fill: '#9A6935', opacity: 0.22 }),
    rect(x + w * 0.34, top - 10, w * 0.3, h + 20, { fill: '#9A6935', opacity: 0.18 }),
    rect(x - w * 0.5, top - 10, w * 0.16, h + 20, { fill: '#FFF6E0', opacity: 0.25 }),
  );
  // rim of capstones and the dark opening
  s += ellipse(x, top, w / 2 + 9, ry + 7, { fill: '#D9A86A' });
  s += ellipse(x, top - 3, w / 2 + 7, ry + 4, { fill: '#F1D3A2' });
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12 + 0.2;
    s += path(`M${r1(x + Math.cos(a) * (w / 2 - 12))},${r1(top - 3 + Math.sin(a) * (ry - 6))} L${r1(x + Math.cos(a) * (w / 2 + 7))},${r1(top - 3 + Math.sin(a) * (ry + 4))}`, { stroke: '#C9955A', 'stroke-width': 2.5 });
  }
  s += ellipse(x, top - 2, w / 2 - 14, ry - 6, { fill: '#A87A4C' });
  s += ellipse(x, top + 3, w / 2 - 20, ry - 10, { fill: '#4A3A40' });
  // front post, crossbar and pulley wheel
  s += rect(postL - 10, barY, 20, y - barY - ry * 0.5, { rx: 6, fill: C.wood2 });
  s += rect(postL - 10, barY, 7, y - barY - ry, { rx: 3, fill: C.wood0, opacity: 0.6 });
  s += rect(postL - 18, barY - 14, postR - postL + 36, 18, { rx: 8, fill: C.wood2 });
  s += rect(postL - 18, barY - 14, postR - postL + 36, 6, { rx: 3, fill: C.wood0, opacity: 0.6 });
  const wx = x;
  const wy = barY + 22;
  s += path(`M${wx - 8},${barY + 4} L${wx},${wy} L${wx + 8},${barY + 4}Z`, { fill: C.wood3 });
  s += circle(wx, wy, 22, { fill: C.wood1 });
  s += circle(wx, wy, 16, { fill: 'none', stroke: C.wood3, 'stroke-width': 3 });
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * i) / 3;
    s += path(`M${wx},${wy} L${r1(wx + Math.cos(a) * 15)},${r1(wy + Math.sin(a) * 15)}`, { stroke: C.wood3, 'stroke-width': 2.5 });
  }
  s += circle(wx, wy, 5, { fill: C.wood3 });
  // rope over the wheel: one end down into the well, one to the bucket on the rim
  const bx = x + w * 0.3;
  const by = top - 4;
  s += path(`M${wx - 21},${wy} L${wx - 21},${top + 2}`, { stroke: C.sand1, 'stroke-width': 3.5 });
  s += path(`M${wx + 21},${wy} Q${wx + 30},${(wy + by) / 2} ${bx},${by - 36}`, { fill: 'none', stroke: C.sand1, 'stroke-width': 3.5 });
  // the bucket resting on the rim
  s += g({ transform: `rotate(-8 ${bx} ${by})` },
    path(`M${bx - 22},${by - 30} Q${bx},${by - 56} ${bx + 22},${by - 30}`, { fill: 'none', stroke: C.stone3, 'stroke-width': 3.5 }),
    path(`M${bx - 25},${by - 30} L${bx + 25},${by - 30} L${bx + 19},${by + 6} L${bx - 19},${by + 6}Z`, { fill: C.wood1 }),
    path(`M${bx + 4},${by - 30} L${bx + 25},${by - 30} L${bx + 19},${by + 6} L${bx + 3},${by + 6}Z`, { fill: C.wood3, opacity: 0.45 }),
    rect(bx - 26, by - 24, 52, 6, { rx: 3, fill: C.wood3 }),
    rect(bx - 22, by - 4, 44, 6, { rx: 3, fill: C.wood3 }),
    ellipse(bx, by - 30, 25, 6, { fill: C.water2 }),
    ellipse(bx - 6, by - 31, 10, 2.4, { fill: C.white, opacity: 0.7 }),
  );
  return s;
}

// A long stone trough brimming with water. (x0..x1) span, y = top rim.
function trough(id, x0, x1, y, { front = 64, depth = 26 } = {}) {
  const stone = '#D6AE7C';
  const stoneLight = '#F0D2A2';
  const stoneDark = '#B88A57';
  let s = '';
  // back rim, water, front wall and front rim
  s += rect(x0 + 10, y - depth, x1 - x0 - 20, depth + 6, { rx: 8, fill: stoneDark });
  s += rect(x0 + 18, y - depth + 6, x1 - x0 - 36, depth - 4, { rx: 6, fill: C.water2 });
  s += rect(x0 + 18, y - depth + 6, x1 - x0 - 36, 7, { rx: 3, fill: C.water1 });
  for (let k = 0; k < 4; k++) s += path(`M${r1(x0 + 50 + k * ((x1 - x0 - 100) / 3))},${r1(y - depth + 15)} q14,-3 28,0`, { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.75 });
  s += rect(x0, y, x1 - x0, front, { rx: 6, fill: stone });
  s += rect(x0 - 6, y - 6, x1 - x0 + 12, 14, { rx: 7, fill: stoneLight });
  s += rect(x0, y + front * 0.45, x1 - x0, 3, { fill: stoneDark, opacity: 0.45 });
  for (let k = 1; k < 5; k++) s += rect(x0 + ((x1 - x0) * k) / 5, y + 8, 3, front * 0.37, { fill: stoneDark, opacity: 0.4 });
  for (let k = 0; k < 5; k++) s += rect(x0 + ((x1 - x0) * (k + 0.5)) / 5, y + front * 0.45 + 3, 3, front * 0.55 - 3, { fill: stoneDark, opacity: 0.4 });
  s += rect(x1 - (x1 - x0) * 0.32, y, (x1 - x0) * 0.32, front, { rx: 6, fill: '#9A6935', opacity: 0.18 });
  // a few drips and a wet patch where water splashed over
  s += ellipse(x0 + 70, y + front + 6, 50, 7, { fill: C.water1, opacity: 0.5 });
  s += path(`M${x0 + 60},${y + 6} q-3,12 0,20 M${x0 + 84},${y + 6} q-2,8 0,14`, { stroke: C.water1, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 });
  return s;
}

// A big, broad, shady tree. (x, y) = base of the trunk.
function shadeTree(x, y, { s = 1, seed = 28 } = {}) {
  const R = rng(seed);
  const p = [];
  // trunk splitting into three big branches
  p.push(path('M-40,0 C-30,-40 -34,-90 -20,-130 C-40,-170 -90,-200 -150,-220 L-140,-236 C-80,-224 -30,-196 -6,-160 C-4,-200 -10,-240 -20,-270 L4,-272 C14,-236 18,-196 14,-156 C40,-196 90,-222 150,-234 L156,-218 C100,-200 50,-170 30,-128 C40,-90 34,-40 46,0Z', { fill: C.wood2 }));
  p.push(path('M30,-128 C40,-90 34,-40 46,0 L16,0 C20,-40 22,-90 10,-128Z', { fill: C.wood3, opacity: 0.55 }));
  p.push(path('M-20,-40 q10,-8 20,0 M-12,-90 q8,-6 16,1', { fill: 'none', stroke: C.wood3, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }));
  // broad canopy of overlapping clumps
  const clumps = [[-160, -250, 80, 56], [-70, -300, 100, 66], [40, -310, 104, 68], [150, -262, 84, 58], [-110, -220, 70, 44], [10, -236, 90, 52], [110, -214, 70, 42], [-10, -330, 70, 44]];
  p.push(g({ fill: C.leaf5 }, clumps.map(([a, b, rx, ry]) => ellipse(a + 8, b + 14, rx, ry))));
  p.push(g({ fill: C.leaf4 }, clumps.map(([a, b, rx, ry]) => ellipse(a, b, rx, ry))));
  p.push(g({ fill: C.leaf3 }, clumps.map(([a, b, rx, ry]) => ellipse(a - rx * 0.12, b - ry * 0.16, rx * 0.82, ry * 0.74))));
  p.push(g({ fill: C.leaf2, opacity: 0.85 }, clumps.map(([a, b, rx, ry]) => ellipse(a - rx * 0.3, b - ry * 0.38, rx * 0.42, ry * 0.32))));
  // leafy fringe
  let lv = '';
  clumps.forEach(([a, b, rx, ry]) => {
    for (let i = 0; i < 14; i++) {
      const ang = (Math.PI * 2 * i) / 14 + R.range(-0.1, 0.1);
      if (Math.sin(ang) > 0.5) continue;
      const lx = a + Math.cos(ang) * rx * 0.98;
      const ly = b + Math.sin(ang) * ry * 0.95;
      lv += ellipse(lx, ly, 11, 5, { fill: R() < 0.5 ? C.leaf3 : C.leaf4, transform: `rotate(${r1((ang * 180) / Math.PI + R.range(-20, 20))} ${r1(lx)} ${r1(ly)})` });
    }
  });
  p.push(lv);
  return g({ transform: T(x, y, s) }, p);
}

// ---------------------------------------------------------------- scene
export default function render() {
  const id = ids('s19');
  const R = rng(1919);
  const defs = [
    linear(id('sky'), [[0, '#8DCBE2'], [0.3, '#BFE2EA'], [0.5, SKY], [0.56, '#F6D3A0']]),
    glowDef(id('sunGlow'), '#FFEFC4', 0.9),
    linear(id('ground'), [[0, '#F3D9A4'], [1, '#E2B474']]),
    radial(id('shade'), [[0, '#8E7AA6', 0.42], [0.7, '#8E7AA6', 0.28], [1, '#8E7AA6', 0]]),
    glowDef(id('warm'), '#FFF1CC', 0.5),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');

  let body = '';
  // warm afternoon sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(190, 300, 56, { fill: '#FFE3A0', core: '#FFF4D6', glowId: id('sunGlow') });
  body += cloud(470, 170, 190, { fill: '#FFF8EE', shade: '#F1DDC8', seed: 4, opacity: 0.95 });
  body += cloud(150, 120, 140, { fill: '#FFF8EE', shade: '#F1DDC8', seed: 8, opacity: 0.85 });
  body += farBird(380, 300, 1.1, '#7A5E6E', 0.5) + farBird(420, 282, 0.85, '#7A5E6E', 0.45) + farBird(560, 330, 0.8, '#7A5E6E', 0.4);

  // desert hills, hazy to near
  body += path(ridge([[-20, 540], [120, 500], [260, 520], [420, 480], [560, 512], [700, 486], [860, 506], [1020, 490]]), { fill: haze('#D7A26B', 0.55) });
  body += path(ridge([[-20, 575], [160, 548], [340, 566], [520, 544], [720, 560], [900, 540], [1020, 552]]), { fill: haze(C.sand3, 0.32) });
  body += path(ridge([[-20, 575], [160, 548], [340, 566], [520, 544], [720, 560], [900, 540], [1020, 552]]).replace(/L/g, 'L'), { fill: 'none' });
  // the ground
  body += path(ridge([[-20, 610], [200, 596], [420, 606], [640, 598], [860, 604], [1020, 596]]), { fill: `url(#${id('ground')})` });
  body += circle(420, 690, 380, { fill: `url(#${id('warm')})` });

  // ----- the big shady tree and its cool shade
  body += ellipse(790, 742, 260, 58, { fill: `url(#${id('shade')})` });
  body += shadeTree(800, 730, { s: 1.12 });

  // ----- the well, the trough and the flock
  body += ellipse(270, 742, 150, 20, { fill: '#9A6935', opacity: 0.2 });
  body += madyanWell(id('well'), 250, 736, 210);
  // sheep behind the trough, heads down in the water
  const tY = 760;
  body += drinkingSheep(452, tY - 6, { s: 0.78, seed: 2 });
  body += drinkingSheep(600, tY - 10, { s: 0.82, seed: 5, face: '#6E5658' });
  body += drinkingSheep(752, tY - 6, { s: 0.74, flip: true, seed: 8 });
  body += trough(id('trough'), 370, 800, tY);
  // a little bird drinking on the trough's edge
  body += bird(520, tY - 4, { s: 0.36, body: C.coral1, wing: C.coral2, belly: C.coral0 });
  // a lamb resting in the shade, and one trotting up for a drink
  body += restingSheep(880, 800, { s: 0.7, flip: true, seed: 4 });
  body += ellipse(640, 912, 54, 8, { fill: '#9A6935', opacity: 0.2 });
  body += sheep(640, 912, { s: 0.62, flip: true, seed: 11 });

  // sparkles on the water
  for (const [sx, sy, ss] of [[430, 724, 8], [690, 726, 9], [560, 712, 7]]) body += sparkle(sx, sy, ss, '#FFFFFF', { opacity: 0.95 });

  // ----- foreground framing
  body += path(blob([[-30, 1010], [-20, 900], [60, 860], [150, 880], [190, 960], [130, 1010]]), { fill: '#D19A5E' });
  body += path(blob([[-20, 900], [60, 860], [150, 880], [100, 892], [30, 905]]), { fill: '#E8BC85' });
  body += path(blob([[150, 1010], [170, 960], [230, 940], [280, 970], [290, 1010]]), { fill: '#C68E54' });
  for (const [gx, gy, gh] of [[40, 870, 50], [200, 950, 40], [960, 900, 60], [900, 930, 44], [400, 990, 36], [760, 990, 40]]) body += grass(gx, gy, { h: gh, fill: C.leaf4, n: 6, seed: gx });
  for (const [fx, fy, fc] of [[80, 860, C.coral1], [228, 942, C.gold1], [930, 880, C.rose1], [980, 920, C.white], [430, 975, C.gold1]]) body += flower(fx, fy, { r: 9, fill: fc, center: C.gold2 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
