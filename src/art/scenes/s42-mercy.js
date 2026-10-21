// A Mercy to All the Worlds (Quran 21:107, 68:4).
// Madinah on a sunny, peaceful day: the Prophet's Mosque with its green dome
// and white minarets among palm groves and flowers. Friendly animals remind
// us of his kindness: a cat asleep in the shade, a camel resting, a little
// goat, doves and small birds. Bright, gentle and warm. No people.
import {
  C, svgDoc, ids, rng, mix, linear, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge,
  sparkle, cloud, sun, palm, bush, grass, flower, bird, farBird, crescent, r1, T, eye,
} from '../lib.js';

// A light, simple palm for the far groves (just a few smooth fronds).
// (x, y) = base of the trunk.
function farPalm(x, y, h, { trunk, leaf, leafDark, seed = 1 }) {
  const R = rng(seed);
  const tx = x + h * 0.06;
  const ty = y - h;
  let s = path(`M${r1(x - h * 0.03)},${y} Q${r1(x)},${r1(y - h * 0.5)} ${r1(tx - h * 0.015)},${r1(ty)} L${r1(tx + h * 0.015)},${r1(ty)} Q${r1(x + h * 0.03)},${r1(y - h * 0.5)} ${r1(x + h * 0.03)},${y}Z`, { fill: trunk });
  const fr = (a, L, fill) => {
    const ar = (a * Math.PI) / 180;
    const ex = tx + Math.cos(ar) * L;
    const ey = ty + Math.sin(ar) * L * 0.6 + L * 0.35 * Math.abs(Math.cos(ar));
    const cx = tx + Math.cos(ar) * L * 0.55;
    const cy = ty + Math.sin(ar) * L * 0.6 - L * 0.12;
    const w = L * 0.13;
    return path(`M${r1(tx)},${r1(ty)} Q${r1(cx - Math.sin(ar) * w)},${r1(cy - w)} ${r1(ex)},${r1(ey)} Q${r1(cx + Math.sin(ar) * w)},${r1(cy + w)} ${r1(tx)},${r1(ty)}Z`, { fill });
  };
  for (const a of [-160, -120, -60, -20]) s += fr(a + R.range(-6, 6), h * 0.5, leafDark);
  for (const a of [-180, -140, -90, -40, 0]) s += fr(a + R.range(-6, 6), h * 0.55, leaf);
  return s;
}

// ---------------------------------------------------------------- buildings
// The green dome on its green octagonal drum, with a gold crescent on top.
// (x, y) = bottom centre of the drum.
function greenDome(x, y, s, id, defsOut) {
  const g1 = '#3E9E66';
  const g2 = '#2F8456';
  const g0 = '#6CC08A';
  const p = [];
  // drum: front face and a shaded side face
  p.push(rect(-60, -52, 120, 52, { fill: g2 }));
  p.push(rect(-60, -52, 82, 52, { fill: g1 }));
  for (const wx of [-42, -18, 6]) p.push(path(`M${wx - 6},-12 L${wx - 6},-30 A6,6 0 0 1 ${wx + 6},-30 L${wx + 6},-12Z`, { fill: '#1F5E3E' }));
  p.push(path('M34,-12 L34,-30 A5,5 0 0 1 44,-30 L44,-12Z', { fill: '#1A4F35' }));
  p.push(rect(-64, -58, 128, 8, { rx: 3, fill: g0 }));
  p.push(rect(-64, -4, 128, 6, { rx: 2, fill: g2 }));
  // the dome: a gently pointed curve, lit from the upper left
  const domeD = 'M-58,-58 C-60,-104 -34,-138 0,-156 C34,-138 60,-104 58,-58Z';
  defsOut.push(`<clipPath id="${id('gdome')}"><path d="${domeD}"/></clipPath>`);
  p.push(path(domeD, { fill: g1 }));
  p.push(g({ 'clip-path': `url(#${id('gdome')})` },
    ellipse(46, -80, 46, 90, { fill: g2, opacity: 0.8 }),
    ...[-36, -14, 10, 32].map((rx) => path(`M${rx * 1.5},-58 Q${rx * 1.1},-120 0,-156`, { fill: 'none', stroke: '#2A7A4E', 'stroke-width': 2, opacity: 0.45 })),
    ellipse(-26, -112, 12, 26, { fill: g0, opacity: 0.85, transform: 'rotate(28 -26 -112)' }),
  ));
  // gold finial and crescent
  p.push(path('M0,-156 L0,-182', { stroke: C.gold3, 'stroke-width': 4, 'stroke-linecap': 'round' }));
  p.push(circle(0, -168, 5, { fill: C.gold2 }));
  p.push(crescent(0, -192, 10, { fill: C.gold2, angle: -90, thickness: 0.5 }));
  return g({ transform: T(x, y, s) }, p);
}

// A slender white minaret with two balconies and a pointed cap.
// (x, y) = bottom centre; h = height to the tip of the cap.
function minaret(x, y, h, { s = 1, w = 40, white = '#FBF7EE', shade = '#E4DBC9', trim = '#9DB7AE', cap = '#B9C9C4' } = {}) {
  const p = [];
  const top = -h;
  const shaftTop = top + h * 0.2;
  // square base
  p.push(rect(-w * 0.62, -h * 0.22, w * 1.24, h * 0.22, { fill: white }));
  p.push(rect(w * 0.22, -h * 0.22, w * 0.4, h * 0.22, { fill: shade }));
  // shaft
  p.push(rect(-w / 2, shaftTop, w, h * 0.8 - h * 0.22 + 2, { fill: white }));
  p.push(rect(w * 0.15, shaftTop, w * 0.35, h * 0.58 + 2, { fill: shade }));
  for (let i = 0; i < 3; i++) p.push(path(`M${-w * 0.2},${r1(-h * 0.3 - i * h * 0.12)} L${-w * 0.2},${r1(-h * 0.36 - i * h * 0.12)} A${w * 0.1},${w * 0.1} 0 0 1 0,${r1(-h * 0.36 - i * h * 0.12)} L0,${r1(-h * 0.3 - i * h * 0.12)}Z`, { fill: trim, opacity: 0.7 }));
  // balconies
  for (const by of [-h * 0.66, -h * 0.8]) {
    p.push(rect(-w * 0.78, r1(by - 6), w * 1.56, 12, { rx: 4, fill: white }));
    p.push(rect(w * 0.2, r1(by - 6), w * 0.58, 12, { rx: 4, fill: shade }));
    p.push(rect(-w * 0.78, r1(by + 4), w * 1.56, 4, { rx: 2, fill: trim }));
  }
  // slimmer top section and pointed cap
  p.push(rect(-w * 0.38, r1(-h * 0.92), w * 0.76, h * 0.12, { fill: white }));
  p.push(rect(w * 0.1, r1(-h * 0.92), w * 0.28, h * 0.12, { fill: shade }));
  p.push(path(`M${r1(-w * 0.46)},${r1(-h * 0.92)} Q${r1(-w * 0.4)},${r1(-h * 0.98)} 0,${r1(top)} Q${r1(w * 0.4)},${r1(-h * 0.98)} ${r1(w * 0.46)},${r1(-h * 0.92)}Z`, { fill: cap }));
  p.push(path(`M0,${r1(top)} Q${r1(w * 0.4)},${r1(-h * 0.98)} ${r1(w * 0.46)},${r1(-h * 0.92)} L${r1(w * 0.1)},${r1(-h * 0.92)}Z`, { fill: mix(cap, '#000000', 0.12) }));
  p.push(path(`M0,${r1(top)} L0,${r1(top - 16)}`, { stroke: C.gold3, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  p.push(crescent(0, top - 22, 6.5, { fill: C.gold2, angle: -90, thickness: 0.5 }));
  return g({ transform: T(x, y, s) }, p);
}

// The long arcaded wall of the mosque with small silver roof domes.
function mosqueWall(x0, x1, top, bottom) {
  const wall = '#FBF4E6';
  const shade = '#EADFCB';
  let s = '';
  // little silver domes on the roof, behind the parapet
  for (let x = x0 + 40; x < x1 - 20; x += 54) s += path(`M${x - 18},${top + 2} A18,15 0 0 1 ${x + 18},${top + 2}Z`, { fill: '#C9CED6' }) + path(`M${x + 2},${top - 13} A18,15 0 0 1 ${x + 18},${top + 2} L${x + 2},${top + 2}Z`, { fill: '#AEB4BF' });
  s += rect(x0, top, x1 - x0, bottom - top, { fill: wall });
  s += rect(x0, bottom - 16, x1 - x0, 16, { fill: shade });
  // parapet with small merlons
  s += rect(x0 - 4, top - 6, x1 - x0 + 8, 10, { rx: 3, fill: '#F2E7D3' });
  for (let x = x0 + 4; x < x1; x += 22) s += rect(x, top - 14, 12, 9, { rx: 3, fill: '#F2E7D3' });
  // arched windows and a big central gate
  const mid = (x0 + x1) / 2;
  for (let x = x0 + 30; x < x1 - 10; x += 44) {
    if (Math.abs(x - mid) < 60) continue;
    s += path(`M${x - 12},${bottom - 18} L${x - 12},${top + 44} A12,12 0 0 1 ${x + 12},${top + 44} L${x + 12},${bottom - 18}Z`, { fill: '#C9A97C' });
    s += path(`M${x - 7},${bottom - 18} L${x - 7},${top + 46} A7,7 0 0 1 ${x + 7},${top + 46} L${x + 7},${bottom - 18}Z`, { fill: '#8E7356' });
  }
  s += path(`M${mid - 38},${bottom} L${mid - 38},${top + 34} Q${mid},${top - 4} ${mid + 38},${top + 34} L${mid + 38},${bottom}Z`, { fill: '#E3D3B5' });
  s += path(`M${mid - 26},${bottom} L${mid - 26},${top + 42} Q${mid},${top + 14} ${mid + 26},${top + 42} L${mid + 26},${bottom}Z`, { fill: '#7E9C7F' });
  s += path(`M${mid - 18},${bottom} L${mid - 18},${top + 48} Q${mid},${top + 28} ${mid + 18},${top + 48} L${mid + 18},${bottom}Z`, { fill: '#5E7E64' });
  return s;
}

// ---------------------------------------------------------------- animals
// A camel resting with its legs folded under it, eyes closed. Faces right.
// (x, y) = ground under its middle.
function restingCamel(x, y, { s = 1, flip = false, body = C.sand3, dark = C.sand4, light = C.sand2 } = {}) {
  const p = [];
  p.push(path('M-80,-40 Q-96,-24 -90,-6', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  // folded far legs peeking out
  p.push(ellipse(-50, -6, 30, 9, { fill: dark }));
  // body and hump
  p.push(path('M-84,-30 C-86,-70 -60,-88 -30,-90 C-18,-134 30,-134 40,-88 C62,-86 82,-70 82,-38 C82,-14 60,-4 0,-4 C-50,-4 -82,-10 -84,-30Z', { fill: body }));
  p.push(path('M-30,-90 C-18,-134 30,-134 40,-88 C20,-100 -10,-102 -30,-90Z', { fill: light, opacity: 0.7 }));
  p.push(path('M-74,-18 C-40,-6 30,-6 76,-20 C70,-8 50,-4 0,-4 C-40,-4 -66,-8 -74,-18Z', { fill: dark, opacity: 0.45 }));
  // folded near legs: knees tucked under, feet showing
  p.push(path('M-70,-2 C-70,-22 -40,-26 -20,-18 C-10,-12 -12,0 -24,2Z', { fill: body }));
  p.push(ellipse(-26, -10, 9, 7, { fill: light }));
  p.push(path('M40,-2 C40,-20 70,-26 92,-16 C102,-10 100,2 88,3Z', { fill: body }));
  p.push(ellipse(90, -10, 9, 7, { fill: light }));
  p.push(ellipse(98, 0, 13, 5, { fill: dark }));
  // neck and head
  p.push(path('M60,-72 C86,-82 94,-110 96,-142 L122,-142 C122,-100 110,-54 74,-38Z', { fill: body }));
  p.push(path('M90,-156 C94,-172 118,-178 136,-170 C154,-164 168,-156 168,-142 C168,-130 158,-126 146,-128 C132,-130 122,-126 114,-124 C98,-124 86,-138 90,-156Z', { fill: body }));
  p.push(ellipse(104, -172, 7, 11, { fill: dark, transform: 'rotate(-30 104 -172)' }));
  p.push(ellipse(158, -136, 4, 3, { fill: dark }));
  p.push(path('M148,-128 Q156,-124 164,-128', { fill: 'none', stroke: dark, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  p.push(eye(126, -154, 5, true));
  p.push(ellipse(136, -140, 7, 4, { fill: C.cheek, opacity: 0.6 }));
  // a bright woven blanket on its back
  p.push(path('M-26,-96 C-12,-110 24,-110 38,-92 L34,-66 L-22,-66Z', { fill: C.coral2 }));
  p.push(path('M-22,-74 L34,-74 L34,-66 L-22,-66Z', { fill: C.gold2 }));
  for (const tx of [-16, -2, 12, 26]) p.push(circle(tx, -62, 3, { fill: C.gold2 }));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// A little goat kid standing. Faces right. (x, y) = ground between its feet.
function goat(x, y, { s = 1, flip = false } = {}) {
  const coat = '#FBF4E8';
  const shade = '#E7D9C3';
  const patch = '#C08A5A';
  const hoof = '#6B5040';
  const leg = (lx, fill) => [rect(lx - 5, -44, 10, 42, { rx: 5, fill }), rect(lx - 5.5, -8, 11, 8, { rx: 3, fill: hoof })];
  const p = [
    ...leg(-26, shade), ...leg(20, shade),
    path('M-44,-70 L-56,-84 L-46,-64Z', { fill: shade }),
    ellipse(0, -62, 46, 26, { fill: coat }),
    ellipse(-14, -70, 22, 14, { fill: patch, opacity: 0.85 }),
    ellipse(4, -46, 34, 10, { fill: shade, opacity: 0.6 }),
    ...leg(-16, coat), ...leg(30, coat),
    // neck and head
    path('M26,-74 C36,-88 44,-96 50,-100 L64,-84 C56,-74 46,-66 36,-60Z', { fill: coat }),
    ellipse(58, -96, 20, 16, { fill: coat, transform: 'rotate(18 58 -96)' }),
    ellipse(72, -88, 10, 8, { fill: '#F6E7D6' }),
    // little horns
    path('M48,-110 Q46,-124 54,-130 Q52,-120 56,-110Z', { fill: '#D9C2A0' }),
    path('M58,-110 Q60,-124 68,-128 Q64,-118 64,-108Z', { fill: '#CDB38E' }),
    // floppy ear
    ellipse(40, -96, 14, 6, { fill: shade, transform: 'rotate(30 40 -96)' }),
    ellipse(41, -95, 9, 3.5, { fill: '#F4B6C2', transform: 'rotate(30 41 -95)' }),
    eye(62, -100, 3.6),
    ellipse(66, -90, 4.4, 2.8, { fill: C.cheek, opacity: 0.7 }),
    ellipse(78, -90, 2.4, 1.8, { fill: '#8C6A58' }),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// A ginger cat curled up asleep. Head on the right. (x, y) = ground under it.
function sleepingCat(x, y, { s = 1, flip = false } = {}) {
  const fur = '#F4AE68';
  const stripe = '#DE8C45';
  const cream = '#FFF1DE';
  const p = [
    ellipse(-2, -26, 52, 28, { fill: fur }),
    ellipse(-6, -14, 44, 12, { fill: stripe, opacity: 0.35 }),
    path('M-30,-50 Q-26,-38 -32,-28 M-12,-54 Q-8,-40 -14,-30 M6,-54 Q10,-42 4,-32', { fill: 'none', stroke: stripe, 'stroke-width': 5, 'stroke-linecap': 'round' }),
    // tail wrapped round the front
    path('M-50,-18 C-58,0 -20,6 20,2 C34,0 44,-4 48,-8', { fill: 'none', stroke: fur, 'stroke-width': 13, 'stroke-linecap': 'round' }),
    path('M34,-2 C40,-4 44,-6 48,-8', { fill: 'none', stroke: stripe, 'stroke-width': 13, 'stroke-linecap': 'round' }),
    // paws and head
    ellipse(30, -10, 12, 7, { fill: cream }),
    // ears
    path('M24,-48 L26,-70 L40,-54Z', { fill: fur }),
    path('M44,-54 L56,-68 L58,-46Z', { fill: fur }),
    path('M28,-52 L29,-64 L37,-55Z', { fill: '#F7B9C4' }),
    path('M47,-54 L54,-62 L55,-49Z', { fill: '#F7B9C4' }),
    ellipse(42, -36, 23, 19, { fill: fur }),
    ellipse(44, -28, 14, 9, { fill: cream }),
    path('M36,-50 L38,-42 M44,-52 L44,-44', { stroke: stripe, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    eye(34, -36, 3.4, true), eye(51, -36, 3.4, true),
    path('M41,-30 L45,-30 L43,-27Z', { fill: C.rose2 }),
    ellipse(30, -28, 4.5, 2.8, { fill: C.cheek, opacity: 0.7 }),
    ellipse(56, -28, 4.5, 2.8, { fill: C.cheek, opacity: 0.7 }),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// A dove standing on the ground. Faces right. (x, y) = feet.
function dove(x, y, { s = 1, flip = false, body = '#F3F2F8', wing = '#CFD2E2', head = '#F3F2F8', peck = false } = {}) {
  const hx = peck ? 24 : 18;
  const hy = peck ? -16 : -36;
  const p = [
    path('M-16,-12 L4,-6 M-6,-12 L8,-4', { stroke: C.rose2, 'stroke-width': 0 }),
    path('M2,-10 L0,0 M10,-10 L12,0', { stroke: C.rose2, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    path('M-22,-24 L-42,-30 L-38,-16Z', { fill: wing }),
    ellipse(0, -22, 24, 15, { fill: body }),
    path('M-14,-26 C-4,-36 14,-32 16,-20 C6,-14 -8,-16 -14,-26Z', { fill: wing }),
    circle(hx, hy, 10, { fill: head }),
    path(`M${hx + 9},${hy - 2} L${hx + 17},${hy + 1} L${hx + 9},${hy + 3}Z`, { fill: '#D98C8C' }),
    eye(hx + 3, hy - 2, 2.6),
    ellipse(hx + 5, hy + 5, 3, 2, { fill: C.cheek, opacity: 0.7 }),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

export default function render() {
  const id = ids('s42');
  const extra = [];
  const skyTint = '#CFE9F1';
  const far = (c, t = 0.55) => mix(c, skyTint, t);

  let body = '';
  // ------------------------------------------------ bright day sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(150, 130, 52, { fill: '#FFE9A8', core: '#FFF7DC', glowId: id('sunGlow') });
  body += cloud(360, 190, 230, { fill: C.white, shade: '#DDEFF5', seed: 3 });
  body += cloud(760, 120, 180, { fill: C.white, shade: '#DDEFF5', seed: 6, opacity: 0.95 });
  body += cloud(920, 290, 150, { fill: C.white, shade: '#DDEFF5', seed: 8, opacity: 0.9 });
  body += farBird(560, 230, 1.1, '#5E7FA0', 0.5) + farBird(596, 214, 0.9, '#5E7FA0', 0.45) + farBird(250, 300, 0.9, '#5E7FA0', 0.4);

  // ------------------------------------------------ Mount Uhud far away, and the far palm groves
  body += path(ridge([[420, 540], [520, 500], [610, 470], [700, 452], [790, 470], [880, 446], [960, 470], [1020, 486]], 1000), { fill: far(C.rock2, 0.6) });
  body += path(ridge([[-20, 540], [100, 520], [220, 532], [340, 520], [460, 540]], 1000), { fill: far(C.rock1, 0.65) });
  body += path(ridge([[-20, 580], [200, 566], [420, 574], [640, 566], [860, 572], [1020, 564]], 1000), { fill: far(C.leaf3, 0.55) });
  for (const [px, ph, sd] of [[40, 120, 1], [96, 96, 2], [250, 110, 3], [300, 90, 8], [690, 104, 4], [736, 86, 9], [880, 126, 5], [940, 100, 6], [990, 118, 7]]) {
    body += farPalm(px, 600, ph, { trunk: far(C.wood2), leaf: far(C.leaf3), leafDark: far(C.leaf4), seed: sd });
  }

  // ------------------------------------------------ the Prophet's Mosque
  const wallTop = 560;
  const wallBot = 660;
  body += minaret(286, 600, 300, { w: 30, white: far('#FBF7EE', 0.15), shade: far('#E4DBC9', 0.15) });
  body += minaret(774, 600, 320, { w: 30, white: far('#FBF7EE', 0.15), shade: far('#E4DBC9', 0.15) });
  body += greenDome(452, 552, 1.18, id, extra);
  body += minaret(588, 640, 470, { w: 42 });
  body += mosqueWall(236, 824, wallTop, wallBot);
  // plaza in front of the mosque
  body += path(ridge([[-20, 668], [200, 660], [500, 664], [800, 660], [1020, 666]], 1000), { fill: '#F3E7CF' });

  // ------------------------------------------------ palm groves on either side
  body += palm(122, 704, { h: 200, seed: 11, lean: -0.08 });
  body += palm(872, 704, { h: 240, seed: 13, lean: -0.06 });
  body += palm(940, 708, { h: 190, seed: 14, lean: 0.1 });

  // ------------------------------------------------ the garden
  body += path(ridge([[-20, 712], [160, 700], [380, 708], [600, 702], [820, 710], [1020, 700]], 1000), { fill: `url(#${id('grass')})` });
  for (const [bx, by, bw, sd] of [[260, 724, 90, 1], [330, 720, 70, 2], [690, 722, 80, 3], [770, 726, 96, 4]]) body += bush(bx, by, { w: bw, seed: sd });
  const RF = rng(42);
  for (let i = 0; i < 26; i++) {
    const fx = 30 + RF() * 940;
    const fy = 760 + RF() * 220;
    if (fx > 600 && fx < 920 && fy < 900) continue; // leave room for the camel
    if (fx > 530 && fx < 680 && fy > 820 && fy < 940) continue; // and for the goat
    if (fx > 120 && fx < 290 && fy > 850 && fy < 940) continue; // and for the cat
    body += flower(fx, fy, { r: 6 + RF() * 5, fill: RF.pick([C.coral1, C.rose1, C.gold1, C.white, C.plum1]), center: C.gold2 });
  }
  for (const [gx, gy, gh, sd] of [[40, 960, 50, 1], [330, 980, 40, 2], [560, 990, 44, 3], [980, 960, 50, 4], [470, 790, 30, 5]]) body += grass(gx, gy, { h: gh, fill: C.leaf4, seed: sd });

  // ------------------------------------------------ friends in the garden
  // a camel resting on the right, a little goat beside it
  body += ellipse(800, 902, 140, 16, { fill: C.leaf5, opacity: 0.25 });
  body += restingCamel(790, 900, { s: 1.05, flip: true });
  body += ellipse(596, 930, 52, 8, { fill: C.leaf5, opacity: 0.25 });
  body += goat(596, 928, { s: 0.85 });
  // doves pecking in the middle
  body += dove(420, 906, { s: 1, peck: true });
  body += dove(480, 918, { s: 0.9, flip: true });
  body += dove(370, 930, { s: 0.85, body: '#E6E8F2', wing: '#BFC4D8', head: '#C9D0E2' });
  // the big palm framing the left, with a cat asleep in its shade
  body += ellipse(190, 934, 170, 30, { fill: C.leaf5, opacity: 0.28 });
  body += palm(22, 1004, { h: 420, seed: 21, lean: 0.1 });
  body += sleepingCat(196, 932, { s: 1.1 });
  // small birds perched on the fronds
  body += bird(232, 566, { s: 0.55 });
  body += bird(-2 + 60, 548, { s: 0.46, flip: true, body: C.gold2, wing: C.gold3, belly: C.gold0, beak: C.coral2 });

  for (const [sx, sy, ss] of [[500, 300, 9], [380, 380, 7], [640, 360, 8], [300, 460, 6]]) body += sparkle(sx, sy, ss, '#FFFFFF', { opacity: 0.8 });

  // a fringe of taller grass and flowers right at the front edge
  body += path(ridge([[-20, 984], [120, 972], [260, 982], [420, 976], [580, 984], [740, 974], [900, 982], [1020, 972]], 1010), { fill: C.leaf3 });
  for (const [gx, gh, sd] of [[90, 56, 31], [200, 40, 32], [300, 50, 33], [420, 38, 34], [520, 52, 35], [650, 42, 36], [760, 56, 37], [880, 44, 38]]) body += grass(gx, 992, { h: gh, fill: C.leaf4, n: 6, seed: sd });
  for (const [fx, fy, fc] of [[150, 968, C.coral1], [360, 972, C.gold1], [600, 966, C.rose1], [700, 970, C.white], [830, 966, C.coral1]]) body += flower(fx, fy, { r: 8, fill: fc, center: C.gold2, stemH: 14 });

  body += vignette(id('vig'));

  const defs = [
    linear(id('sky'), [[0, '#6FBAD8'], [0.35, '#9FD3E6'], [0.6, '#D4EEF2'], [0.7, '#F2F8EE']]),
    linear(id('grass'), [[0, C.leaf1], [0.4, C.leaf2], [1, '#6BB06A']]),
    glowDef(id('sunGlow'), '#FFF4C8', 0.75),
    vignetteDef(id('vig'), C.ink, 0.15),
    ...extra,
  ].join('');
  return svgDoc({ defs, body });
}
