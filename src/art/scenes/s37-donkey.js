// The Man, the Donkey and a Hundred Years (Quran 2:259).
// On a hill above an old town in ruins, a donkey stands alive and well in
// the shade of a fig tree, beside a basket of fresh figs and a jug of
// water - unspoiled after a hundred years. Below, new green shoots spring
// up among the fallen walls. Sparkles show that Allah gives life.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge,
  smooth, blob, sparkle, cloud, sun, rays, farBird, grass, flower, bush, eye, r1, T,
} from '../lib.js';

const SKY = '#DDEFF0';

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

// A fig leaf: three to five rounded lobes. (x, y) = stem, a = angle.
function figLeaf(x, y, size, a, fill = C.leaf3, vein = C.leaf2) {
  const k = size / 40;
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(a)}) scale(${r1(k * 100) / 100})` },
    path('M0,0 C-6,-6 -26,-8 -30,-20 C-34,-30 -20,-32 -16,-26 C-22,-38 -12,-50 0,-48 C12,-50 22,-38 16,-26 C20,-32 34,-30 30,-20 C26,-8 6,-6 0,0Z', { fill }),
    path('M0,0 L0,-40 M0,-12 L-20,-22 M0,-12 L20,-22', { fill: 'none', stroke: vein, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.8 }),
  );
}

// The shady fig tree: smooth grey trunk, broad canopy. (x, y) = trunk base.
function figTree(x, y, R, canopyFill = '#589B62') {
  let s = '';
  const bark = '#9C948C';
  const barkLight = '#BDB5AC';
  const barkDark = '#7C746D';
  s += path(`M${x - 70},${y + 6} C${x - 44},${y - 10} ${x - 40},${y - 60} ${x - 40},${y - 120} C${x - 40},${y - 200} ${x - 70},${y - 260} ${x - 120},${y - 320} L${x - 96},${y - 336} C${x - 50},${y - 290} ${x - 20},${y - 250} ${x - 4},${y - 200} C${x + 16},${y - 260} ${x + 50},${y - 300} ${x + 100},${y - 340} L${x + 116},${y - 322} C${x + 70},${y - 280} ${x + 34},${y - 230} ${x + 26},${y - 150} C${x + 22},${y - 90} ${x + 30},${y - 20} ${x + 70},${y + 6}Z`, { fill: bark });
  s += path(`M${x - 70},${y + 6} C${x - 44},${y - 10} ${x - 40},${y - 60} ${x - 40},${y - 120} C${x - 40},${y - 200} ${x - 70},${y - 260} ${x - 120},${y - 320} L${x - 108},${y - 328} C${x - 56},${y - 270} ${x - 24},${y - 200} ${x - 22},${y - 120} C${x - 22},${y - 60} ${x - 30},${y - 10} ${x - 46},${y + 6}Z`, { fill: barkLight, opacity: 0.7 });
  s += path(`M${x + 8},${y - 170} C${x + 6},${y - 120} ${x + 12},${y - 60} ${x + 30},${y} L${x + 70},${y + 6} C${x + 30},${y - 20} ${x + 22},${y - 90} ${x + 26},${y - 150}Z`, { fill: barkDark, opacity: 0.4 });
  s += path(`M${x - 30},${y - 60} q6,-8 14,-4 M${x - 24},${y - 140} q8,-8 14,-2 M${x + 10},${y - 100} q6,-6 12,0`, { fill: 'none', stroke: barkDark, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 });
  // canopy clusters, lit from the upper left
  const clusters = [[x - 200, y - 380, 92], [x - 90, y - 450, 112], [x + 40, y - 470, 116], [x + 160, y - 410, 100], [x + 240, y - 330, 74], [x - 260, y - 300, 70], [x - 150, y - 330, 96], [x - 20, y - 360, 104], [x + 110, y - 330, 96], [x - 40, y - 560, 70], [x + 90, y - 560, 66]];
  const blobFor = (cx, cy, r, k, dx, dy) => {
    const pts = [];
    for (let i = 0; i < 9; i++) {
      const a = (Math.PI * 2 * i) / 9;
      const rr = r * (0.9 + 0.12 * Math.sin(i * 2.3 + cx));
      pts.push([cx + dx + Math.cos(a) * rr * k, cy + dy + Math.sin(a) * rr * k * 0.84]);
    }
    return blob(pts);
  };
  s += `<g fill="#3F7A55">${clusters.map(([cx, cy, r]) => path(blobFor(cx, cy, r, 1, r * 0.1, r * 0.14))).join('')}</g>`;
  s += `<g fill="${canopyFill}">${clusters.map(([cx, cy, r]) => path(blobFor(cx, cy, r, 0.94, 0, 0))).join('')}</g>`;
  s += `<g fill="#6AAA66" opacity="0.75">${clusters.filter(([cx, cy]) => cy < y - 420 || cx < x - 180).map(([cx, cy, r]) => path(blobFor(cx, cy, r, 0.4, -r * 0.34, -r * 0.34))).join('')}</g>`;
  s += `<g fill="#8EC57A" opacity="0.65">${clusters.filter(([cx, cy]) => cy < y - 440).map(([cx, cy, r]) => path(blobFor(cx, cy, r, 0.2, -r * 0.46, -r * 0.46))).join('')}</g>`;
  // big fig leaves poking out round the edge give the tree its character
  const ccx = x - 10;
  const ccy = y - 420;
  const inside = (px, py) => clusters.some(([cx, cy, r]) => (px - cx) ** 2 + ((py - cy) / 0.84) ** 2 < (r * 0.8) ** 2);
  let n = 0;
  for (const [cx, cy, r] of clusters) {
    for (let k = 0; k < 7; k++) {
      const a = (Math.PI * 2 * k) / 7 + R.range(-0.2, 0.2);
      const lx = cx + Math.cos(a) * r * 0.9;
      const ly = cy + Math.sin(a) * r * 0.76;
      if (inside(lx + Math.cos(a) * 30, ly + Math.sin(a) * 26)) continue;
      const out = (Math.atan2(ly - ccy, lx - ccx) * 180) / Math.PI + 90;
      const below = ly > ccy + 40;
      s += figLeaf(lx, ly, R.range(32, 42), out + R.range(-18, 18), below ? (n % 2 ? '#3F7A55' : '#4C8A5C') : n % 3 ? '#589B62' : '#6DAD69', below ? '#7FB672' : '#9CCB7E');
      n++;
    }
  }
  return s;
}

// A woven basket heaped with fresh figs. (x, y) = bottom centre.
function figBasket(x, y, s = 1) {
  const p = [];
  p.push(ellipse(0, 2, 82, 11, { fill: C.ink, opacity: 0.16 }));
  // figs heaped up (behind the front rim)
  const fig = (fx, fy, rot, col = '#7C4E7E', dk = '#5E3862') =>
    g({ transform: `translate(${fx} ${fy}) rotate(${rot})` },
      path('M0,-22 C8,-20 18,-6 16,6 C14,16 6,20 0,20 C-6,20 -14,16 -16,6 C-18,-6 -8,-20 0,-22Z', { fill: col }),
      path('M4,-20 C12,-14 18,-4 16,6 C14,16 6,20 0,20 C8,12 10,-4 4,-20Z', { fill: dk, opacity: 0.6 }),
      ellipse(-6, -4, 3.5, 7, { fill: C.white, opacity: 0.35 }),
      path('M0,-22 L1,-28', { stroke: C.leaf4, 'stroke-width': 3.2, 'stroke-linecap': 'round' }),
    );
  p.push(figLeaf(-50, -46, 44, -50, C.leaf3, C.leaf2), figLeaf(52, -50, 40, 46, C.leaf4, C.leaf2));
  p.push(fig(-34, -58, -16), fig(-4, -66, 6, '#86578A', '#5E3862'), fig(28, -58, 18), fig(-18, -48, -6, '#6E4470', '#4F2E52'), fig(14, -48, 10, '#86578A', '#5E3862'));
  // one fig split open, pink inside with tiny seeds
  p.push(g({ transform: 'translate(50 -46) rotate(24)' },
    path('M0,-20 C10,-18 18,-4 16,6 C14,16 6,20 0,20 C-6,20 -14,16 -16,6 C-18,-4 -10,-18 0,-20Z', { fill: '#7C4E7E' }),
    path('M0,-14 C7,-12 12,-2 11,5 C10,12 5,15 0,15 C-5,15 -10,12 -11,5 C-12,-2 -7,-12 0,-14Z', { fill: '#F6B7B5' }),
    path('M0,-10 C5,-8 8,-1 7,4 C6,9 3,11 0,11 C-3,11 -6,9 -7,4 C-8,-1 -5,-8 0,-10Z', { fill: '#E7727E' }),
    circle(-2, -2, 1.2, { fill: C.cream }), circle(2, 2, 1.2, { fill: C.cream }), circle(-1, 5, 1.2, { fill: C.cream }), circle(3, -4, 1.2, { fill: C.cream }),
  ));
  // basket
  p.push(path('M-70,-40 L70,-40 C66,-14 54,0 40,0 L-40,0 C-54,0 -66,-14 -70,-40Z', { fill: C.sand3 }));
  p.push(path('M10,-40 L70,-40 C66,-14 54,0 40,0 L6,0 C14,-14 14,-28 10,-40Z', { fill: C.sand4, opacity: 0.45 }));
  p.push(path('M-66,-28 Q0,-20 66,-28 M-60,-14 Q0,-6 60,-14', { fill: 'none', stroke: C.sand4, 'stroke-width': 3, opacity: 0.6 }));
  let ribs = '';
  for (let i = -4; i <= 4; i++) ribs += `M${i * 15},-38 L${i * 10},-3 `;
  p.push(path(ribs, { fill: 'none', stroke: C.sand2, 'stroke-width': 2.4, opacity: 0.7 }));
  p.push(rect(-74, -46, 148, 12, { rx: 6, fill: C.sand2 }));
  p.push(rect(-74, -46, 148, 5, { rx: 2.5, fill: C.sand1, opacity: 0.8 }));
  return g({ transform: `translate(${r1(x)} ${r1(y)}) scale(${s})` }, p);
}

// A clay water jug. (x, y) = bottom centre.
function jug(x, y, s = 1) {
  const clay = '#D58A5C';
  const clayDark = '#B06A44';
  const clayLight = '#ECAE82';
  return g({ transform: `translate(${r1(x)} ${r1(y)}) scale(${s})` },
    ellipse(4, 2, 50, 8, { fill: C.ink, opacity: 0.16 }),
    path('M24,-96 C52,-96 54,-56 34,-48', { fill: 'none', stroke: clayDark, 'stroke-width': 9, 'stroke-linecap': 'round' }),
    path('M-18,-110 L18,-110 L16,-92 C40,-80 48,-50 42,-28 C36,-6 20,0 0,0 C-20,0 -36,-6 -42,-28 C-48,-50 -40,-80 -16,-92Z', { fill: clay }),
    path('M8,-92 C34,-80 44,-50 38,-28 C32,-8 18,-1 4,0 C24,-14 30,-40 22,-70 C18,-82 12,-88 8,-92Z', { fill: clayDark, opacity: 0.55 }),
    path('M-30,-66 C-34,-50 -32,-34 -24,-22', { fill: 'none', stroke: clayLight, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }),
    rect(-22, -118, 44, 12, { rx: 6, fill: clayLight }),
    ellipse(0, -116, 16, 4, { fill: '#7A4A33' }),
    ellipse(-2, -115, 9, 2.2, { fill: C.water2, opacity: 0.9 }),
    path('M-40,-46 Q0,-36 40,-46', { fill: 'none', stroke: '#F6D2A8', 'stroke-width': 3, opacity: 0.7 }),
    path('M-38,-38 Q0,-28 38,-38', { fill: 'none', stroke: clayDark, 'stroke-width': 2, opacity: 0.5 }),
  );
}

// A ruined house: broken walls without a roof. (x, y) = bottom centre.
function ruin(x, y, w, h, R, tint, { door = true, win = 1, stump = false } = {}) {
  const L = tint('#E9CFA2');
  const M = tint('#D2B184');
  const D = tint('#B08E66');
  const inside = tint('#9C7B58');
  let s = '';
  // jagged broken top edge
  const top = [];
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const dip = stump ? 0.55 : 0.25 + 0.55 * Math.sin(t * Math.PI * R.range(0.7, 1.3)) ** 2;
    top.push([x - w / 2 + w * t, y - h * (1 - dip * R.range(0.3, 0.8))]);
  }
  const wallD = `M${r1(x - w / 2)},${r1(y)} ` + top.map(([px, py], i) => `L${r1(px)},${r1(py + (i % 2 ? 6 : 0))}`).join(' ') + ` L${r1(x + w / 2)},${r1(y)}Z`;
  // the back wall seen through the broken front
  s += path(`M${r1(x - w / 2 + 6)},${r1(y)} L${r1(x - w / 2 + 6)},${r1(y - h * 0.9)} L${r1(x + w / 2 - 6)},${r1(y - h * 0.75)} L${r1(x + w / 2 - 6)},${r1(y)}Z`, { fill: inside });
  s += path(wallD, { fill: M });
  s += path(`M${r1(x + w * 0.15)},${r1(y)} L${r1(x + w * 0.15)},${r1(y - h * 0.6)} L${r1(x + w / 2)},${r1(y - h * 0.5)} L${r1(x + w / 2)},${r1(y)}Z`, { fill: D, opacity: 0.5 });
  s += path(`M${r1(x - w / 2)},${r1(y - h * 0.62)} L${r1(x - w * 0.1)},${r1(y - h * 0.66)}`, { stroke: L, 'stroke-width': 3, opacity: 0.7 });
  if (door) s += path(`M${r1(x - w * 0.12)},${r1(y)} L${r1(x - w * 0.12)},${r1(y - h * 0.4)} Q${r1(x)},${r1(y - h * 0.56)} ${r1(x + w * 0.12)},${r1(y - h * 0.4)} L${r1(x + w * 0.12)},${r1(y)}Z`, { fill: inside });
  for (let i = 0; i < win; i++) {
    const wx = x - w * 0.32 + i * w * 0.62;
    s += path(`M${r1(wx - 6)},${r1(y - h * 0.5)} L${r1(wx - 6)},${r1(y - h * 0.62)} Q${r1(wx)},${r1(y - h * 0.72)} ${r1(wx + 6)},${r1(y - h * 0.62)} L${r1(wx + 6)},${r1(y - h * 0.5)}Z`, { fill: inside });
  }
  // a few fallen stones at the foot
  for (let i = 0; i < 4; i++) {
    const sx = x + R.range(-0.7, 0.7) * w;
    s += ellipse(sx, y + R.range(-2, 3), R.range(4, 8), R.range(3, 5), { fill: R() < 0.5 ? M : D });
  }
  return s;
}

// A tiny new shoot: a stem with two round leaves.
const sprout = (x, y, k = 1, col = '#7CC56A') =>
  path(`M${r1(x)},${r1(y)} Q${r1(x + 1 * k)},${r1(y - 8 * k)} ${r1(x)},${r1(y - 14 * k)}`, { fill: 'none', stroke: col, 'stroke-width': r1(2.2 * k), 'stroke-linecap': 'round' }) +
  ellipse(x - 5 * k, y - 15 * k, 5.5 * k, 3 * k, { fill: col, transform: `rotate(-30 ${r1(x - 5 * k)} ${r1(y - 15 * k)})` }) +
  ellipse(x + 5 * k, y - 17 * k, 5.5 * k, 3 * k, { fill: '#9AD67E', transform: `rotate(30 ${r1(x + 5 * k)} ${r1(y - 17 * k)})` });

export default function render() {
  const id = ids('s37');
  const R = rng(37);
  const defs = [
    linear(id('sky'), [[0, '#86C4DF'], [0.45, '#B9E0EA'], [0.75, '#E4F2EC'], [1, '#FFEED2']]),
    linear(id('hill'), [[0, '#A9CF7E'], [1, '#86B868']]),
    glowDef(id('sunGlow'), '#FFF4D2', 0.9),
    glowDef(id('life'), '#FFF6D6', 0.7),
    glowDef(id('shade'), '#2F5B3E', 0.35),
    radial(id('canopy'), [[0, '#88C273'], [0.45, '#62A464'], [1, '#4B8C5A']], { cx: 330, cy: 300, r: 520, units: 'userSpaceOnUse' }),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');
  const haze = (k) => (c) => mix(c, SKY, k);

  let body = '';
  // ---- morning sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(560, 220, 50, { fill: '#FFE9AE', core: '#FFF9E4', glowId: id('sunGlow') });
  body += rays(560, 220, { n: 10, len: 520, spread: 324, dir: 18, width: 4, color: '#FFF6DA', op: 0.045 });
  body += cloud(830, 170, 210, { fill: C.white, shade: '#D6ECF2', seed: 3, opacity: 0.95 });
  body += cloud(440, 120, 150, { fill: C.white, shade: '#D6ECF2', seed: 7, opacity: 0.85 });
  body += farBird(700, 320, 1.1, '#5E8AA0', 0.55) + farBird(734, 306, 0.85, '#5E8AA0', 0.5) + farBird(770, 330, 0.7, '#5E8AA0', 0.45);

  // ---- distant hills and the valley with the old town
  body += path(ridge([[-20, 470], [140, 440], [300, 462], [460, 430], [640, 456], [820, 428], [1020, 450]]), { fill: haze(0.62)(C.leaf3) });
  body += path(ridge([[-20, 520], [200, 494], [420, 512], [620, 490], [820, 506], [1020, 492]]), { fill: haze(0.45)(C.leaf2) });
  body += path(ridge([[-20, 600], [220, 576], [460, 590], [700, 568], [1020, 580]]), { fill: haze(0.25)('#B8C98A') });

  // the ruined town, quiet and empty, with green life returning
  const tFar = haze(0.32);
  const tNear = haze(0.12);
  // far row
  for (const [hx, hy, hw, hh, opt] of [[640, 598, 52, 56, { win: 2 }], [712, 600, 60, 44, { stump: true }], [790, 594, 58, 64, {}], [870, 598, 64, 48, { win: 2, stump: true }], [950, 596, 56, 58, {}]]) {
    body += ruin(hx, hy, hw, hh, R, tFar, opt);
  }
  // a broken arch on two columns, and a dome with a great bite out of it
  body += g({ fill: tFar('#D2B184') }, rect(700, 528, 16, 70), rect(768, 548, 16, 50));
  body += path('M700,534 C700,496 740,484 766,502 L758,516 C740,502 718,508 716,536Z', { fill: tFar('#D2B184') });
  body += path('M766,502 L776,508 L770,518 L758,516Z', { fill: tFar('#B08E66') });
  body += rect(828, 556, 74, 44, { fill: tFar('#D2B184') });
  body += path('M832,556 C832,524 856,508 878,510 L870,524 L884,532 L872,544 L890,556Z', { fill: tFar('#E9CFA2') });
  // near row
  for (const [hx, hy, hw, hh, opt] of [[690, 668, 84, 70, { win: 2 }], [800, 672, 72, 50, { stump: true, door: false }], [900, 662, 92, 78, {}], [990, 668, 70, 60, { stump: true }]]) {
    body += ruin(hx, hy, hw, hh, R, tNear, opt);
  }
  // fallen wall pieces and rubble
  body += path('M600,690 L640,684 L648,672 L690,686 L700,698 L596,700Z', { fill: tNear('#C9A97C') });
  body += path('M760,702 L800,690 L808,700 L846,694 L850,708 L756,710Z', { fill: tNear('#C9A97C') });
  for (let i = 0; i < 16; i++) body += ellipse(560 + R() * 440, 600 + R() * 110, R.range(3, 7), R.range(2, 4), { fill: tNear(R() < 0.5 ? '#C9A97C' : '#B08E66') });
  // new green shoots, grass and flowers among the ruins
  for (let i = 0; i < 26; i++) {
    const sx = 560 + R() * 440;
    const sy = 600 + R() * 110;
    body += sprout(sx, sy, R.range(0.6, 1.1));
  }
  for (const [gx, gy, sd] of [[620, 690, 2], [740, 676, 3], [850, 686, 4], [950, 690, 5], [600, 610, 6], [760, 606, 7]]) body += grass(gx, gy, { h: 16, n: 5, fill: '#6DB55F', seed: sd });
  for (const [fx, fy, fc] of [[640, 694, C.rose1], [730, 690, C.gold1], [880, 694, C.coral1], [770, 612, C.rose1], [600, 616, C.gold1]]) body += flower(fx, fy, { r: 4.5, fill: fc, center: C.gold2 });
  body += bush(712, 612, { w: 40, fill: '#7DBE6A', dark: '#5E9E58', light: '#A7D68A', seed: 3 });
  // a young tree growing up inside a ruined house
  body += path('M908,626 Q904,600 912,580', { fill: 'none', stroke: C.wood2, 'stroke-width': 4, 'stroke-linecap': 'round' }) + circle(912, 574, 16, { fill: '#6DB55F' }) + circle(906, 568, 8, { fill: '#9AD67E' });

  // ---- the hill in the foreground
  body += path(ridge([[-20, 690], [160, 676], [340, 700], [480, 740], [640, 786], [820, 800], [1020, 790]], 1010), { fill: `url(#${id('hill')})` });
  body += path(smooth([[-20, 690], [160, 676], [340, 700], [480, 740], [640, 786], [820, 800], [1020, 790]]), { fill: 'none', stroke: '#C9E39A', 'stroke-width': 5, opacity: 0.7 });

  // the shady fig tree and its pool of shade
  body += ellipse(330, 900, 330, 60, { fill: '#2F5B3E', opacity: 0.16 });
  body += figTree(250, 880, R, `url(#${id('canopy')})`);

  // ---- Allah gives life: glow and sparkles round the donkey
  body += circle(470, 790, 250, { fill: `url(#${id('life')})` });
  body += donkey(440, 912, { s: 1.32 });
  body += figBasket(690, 936, 1.05);
  body += jug(820, 930, 1);
  for (const [sx, sy, ss] of [[300, 640, 12], [636, 590, 15], [672, 744, 10], [326, 764, 9], [548, 548, 9], [262, 700, 7], [706, 660, 8], [880, 820, 9], [430, 640, 7], [600, 830, 7], [360, 860, 6], [520, 700, 6]]) body += sparkle(sx, sy, ss, '#FFF8DE', { opacity: 0.95 });
  for (const [dx, dy, dr] of [[380, 620, 3], [690, 700, 2.6], [300, 820, 2.4], [580, 600, 2.4], [460, 580, 2]]) body += circle(dx, dy, dr, { fill: '#FFF8DE', opacity: 0.9 });

  // ---- foreground grass and flowers
  for (const [gx, sd, h] of [[40, 1, 60], [130, 2, 44], [560, 3, 40], [920, 4, 56], [980, 5, 44], [640, 6, 30]]) body += grass(gx, 1006, { h, n: 6, fill: C.leaf4, seed: sd });
  for (const [fx, fy, fc, fr] of [[90, 960, C.rose1, 10], [190, 980, C.gold1, 8], [600, 990, C.coral1, 8], [950, 960, C.rose1, 10], [880, 990, C.gold1, 8]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });
  body += sprout(520, 990, 1.6) + sprout(760, 996, 1.4) + sprout(250, 968, 1.3) + sprout(980, 930, 1.2) + sprout(40, 920, 1.3);
  for (const [fx, fy, fc, fr] of [[300, 996, C.coral1, 7], [700, 1000, C.rose1, 7], [990, 880, C.gold1, 7], [24, 870, C.rose1, 8]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
