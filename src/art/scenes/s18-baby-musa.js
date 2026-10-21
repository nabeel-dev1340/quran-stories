// Baby Musa on the river (Quran 20:38-40, 28:7-13).
// The little chest (tabut) floats safely on the Nile at sunrise, carried
// by Allah's care. No people are shown - the baby is tucked out of sight
// under his blanket.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth,
  sparkle, cloud, palm, farBird, shimmer, sun, star8, r1,
} from '../lib.js';

function papyrus(x, y, { h = 260, lean = 0, stem = C.leaf4, head = C.leaf3, headDark = C.leaf4, s = 1 } = {}) {
  const tx = x + lean;
  const ty = y - h;
  const w = 46 * s;
  let out = path(`M${r1(x - 3)},${r1(y)} Q${r1(x + lean * 0.2)},${r1(y - h * 0.5)} ${r1(tx)},${r1(ty)} Q${r1(x + lean * 0.2 + 5)},${r1(y - h * 0.5)} ${r1(x + 4)},${r1(y)}Z`, { fill: stem });
  // umbrella head: a fan of fine rays
  out += path(`M${r1(tx)},${r1(ty)} L${r1(tx - w)},${r1(ty - w * 0.55)} Q${r1(tx)},${r1(ty - w * 1.25)} ${r1(tx + w)},${r1(ty - w * 0.55)}Z`, { fill: headDark });
  out += path(`M${r1(tx)},${r1(ty)} L${r1(tx - w * 0.82)},${r1(ty - w * 0.66)} Q${r1(tx)},${r1(ty - w * 1.22)} ${r1(tx + w * 0.82)},${r1(ty - w * 0.66)}Z`, { fill: head });
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI + (Math.PI * i) / 8;
    out += path(`M${r1(tx)},${r1(ty)} L${r1(tx + Math.cos(a) * w * 0.95)},${r1(ty + Math.sin(a) * w * 0.9 - w * 0.15)}`, { stroke: mix(head, '#FFFFFF', 0.3), 'stroke-width': 1.6, opacity: 0.7 });
  }
  return out;
}

function lotusPad(x, y, w, fill = C.leaf3, dark = C.leaf4) {
  // a round pad seen in perspective, with the classic notch cut out
  const ry = w * 0.34;
  const pt = (t) => [x + Math.cos(t) * w, y + Math.sin(t) * ry].map(r1).join(',');
  const shape = (dy) => `M${r1(x)},${r1(y + dy)} L${pt(0.32).split(',').map((v, i) => (i ? r1(+v + dy) : v)).join(',')} A${r1(w)},${r1(ry)} 0 1 1 ${pt(-0.32).split(',').map((v, i) => (i ? r1(+v + dy) : v)).join(',')}Z`;
  let out = path(shape(5), { fill: dark });
  out += path(shape(0), { fill });
  for (const t of [1.2, 2.2, 3.1, 4.1, 5.1]) out += path(`M${r1(x)},${r1(y)} L${r1(x + Math.cos(t) * w * 0.8)},${r1(y + Math.sin(t) * ry * 0.8)}`, { stroke: dark, 'stroke-width': 2, opacity: 0.35 });
  return out;
}

function lotus(x, y, s = 1) {
  const p = (dx, dy, rot, fill) => ellipse(x + dx * s, y + dy * s, 9 * s, 22 * s, { fill, transform: `rotate(${rot} ${r1(x + dx * s)} ${r1(y + dy * s)})` });
  return (
    p(-16, -8, -55, C.rose2) + p(16, -8, 55, C.rose2) +
    p(-9, -14, -25, C.rose1) + p(9, -14, 25, C.rose1) +
    p(0, -18, 0, C.rose0) +
    ellipse(x, y - 2 * s, 18 * s, 5 * s, { fill: C.leaf4 })
  );
}

function duck(x, y, s = 1, flip = false, body = C.cream, wing = C.wool2) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) scale(${flip ? -s : s} ${s})` },
    path('M-38,-6 C-40,-30 -10,-34 8,-26 C14,-44 34,-50 44,-36 C50,-28 46,-18 40,-14 C46,-8 40,8 20,10 L-26,10 C-34,8 -38,2 -38,-6Z', { fill: body }),
    path('M-30,-16 C-18,-26 4,-24 10,-12 C0,-4 -20,-4 -30,-16Z', { fill: wing }),
    path('M46,-34 L60,-30 L46,-25Z', { fill: C.gold2 }),
    circle(38, -36, 3.2, { fill: C.ink }),
    circle(39, -37, 1, { fill: C.white }),
    ellipse(41, -27, 4, 2.4, { fill: C.cheek, opacity: 0.6 }),
  );
}

function chest(x, y) {
  // A small wooden chest-cradle, slightly rocking on the water.
  return g({ transform: `translate(${x} ${y}) rotate(-3)` },
    // reflection
    ellipse(0, 52, 150, 22, { fill: C.water4, opacity: 0.35 }),
    // hull
    path('M-130,-30 L130,-30 C126,10 104,40 70,46 L-70,46 C-104,40 -126,10 -130,-30Z', { fill: C.wood1 }),
    path('M-130,-30 L130,-30 C128,-14 122,0 112,12 L-112,12 C-122,0 -128,-14 -130,-30Z', { fill: C.wood0 }),
    path('M-112,12 L112,12 C100,32 88,42 70,46 L-70,46 C-88,42 -100,32 -112,12Z', { fill: C.wood2 }),
    // plank lines and gold bands
    path('M-120,-6 L120,-6 M-100,28 L100,28', { stroke: C.wood3, 'stroke-width': 3, opacity: 0.45 }),
    rect(-92, -30, 14, 74, { fill: C.gold3, rx: 3 }),
    rect(78, -30, 14, 74, { fill: C.gold3, rx: 3 }),
    circle(-85, 4, 3.5, { fill: C.gold1 }),
    circle(85, 4, 3.5, { fill: C.gold1 }),
    // arched hood at one end, like a cradle canopy
    path('M44,-30 C44,-104 128,-104 128,-30Z', { fill: C.wood1 }),
    path('M56,-30 C56,-90 116,-90 116,-30Z', { fill: C.wood3 }),
    path('M44,-30 C44,-104 128,-104 128,-30 L118,-30 C118,-92 54,-92 54,-30Z', { fill: C.wood0, opacity: 0.6 }),
    // soft blanket with little stars
    path('M-122,-30 C-110,-58 -70,-62 -40,-50 C-10,-66 30,-62 60,-44 L74,-30Z', { fill: C.sky1 }),
    path('M-122,-30 C-110,-58 -70,-62 -40,-50 C-30,-44 -24,-36 -20,-30Z', { fill: C.sky0, opacity: 0.6 }),
    path('M-60,-30 C-58,-40 -40,-44 -26,-38 C-10,-48 30,-44 46,-32 L48,-30Z', { fill: C.white, opacity: 0.35 }),
    star8(-78, -40, 7, C.white, { opacity: 0.9 }),
    star8(-10, -46, 6, C.white, { opacity: 0.9 }),
    star8(36, -38, 5, C.white, { opacity: 0.9 }),
    // blanket edge folded over the side
    path('M-60,-30 C-58,-14 -40,-8 -26,-14 L-24,-30Z', { fill: C.sky1 }),
    path('M-60,-30 C-58,-14 -40,-8 -26,-14', { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round', opacity: 0.8 }),
  );
}

export default function render() {
  const id = ids('s18');
  const R = rng(18);
  const defs = [
    linear(id('sky'), [[0, '#B9A3D9'], [0.38, '#F2B8B5'], [0.72, '#FFD6A5'], [1, '#FFEBC8']]),
    linear(id('river'), [[0, '#F6D2B4'], [0.12, '#B9DCD5'], [0.45, '#6FC2CB'], [1, '#2C8AA2']]),
    glowDef(id('sunGlow'), '#FFF1C9', 0.85),
    glowDef(id('care'), '#FFF6D8', 0.75),
    radial(id('mist'), [[0, '#FFF1DE', 0.9], [1, '#FFF1DE', 0]], { cx: 0.5, cy: 0.5, r: 0.5 }),
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');

  const farTint = (c) => mix(c, '#E9B7A8', 0.55);
  const midTint = (c) => mix(c, '#E9B7A8', 0.25);
  let body = '';
  // sky, sun and clouds
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(720, 505, 62, { fill: '#FFE3A8', core: '#FFF4D6', glowId: id('sunGlow') });
  body += cloud(210, 210, 230, { fill: '#FCE3DA', shade: '#F1C3C2', seed: 2, opacity: 0.95 });
  body += cloud(560, 130, 170, { fill: '#FCE3DA', shade: '#F1C3C2', seed: 5, opacity: 0.85 });
  body += cloud(890, 290, 200, { fill: '#FFE9D6', shade: '#F6CDBE', seed: 9, opacity: 0.9 });
  body += sparkle(400, 90, 9, C.white, { opacity: 0.8 });
  body += sparkle(760, 80, 7, C.white, { opacity: 0.7 });
  body += farBird(330, 300, 1.3, '#7C5C8A', 0.55) + farBird(372, 284, 1, '#7C5C8A', 0.5) + farBird(420, 318, 0.9, '#7C5C8A', 0.45);

  // far bank: palace columns and palms in hazy pink
  body += path(ridge([[-20, 560], [180, 548], [420, 556], [640, 544], [820, 552], [1020, 546]], 600), { fill: farTint(C.leaf4) });
  body += g({ fill: farTint(C.sand4) },
    rect(70, 470, 230, 82), rect(60, 458, 250, 16, { rx: 4 }),
    ...[90, 130, 170, 210, 250].map((cx) => rect(cx, 474, 16, 78, { fill: farTint(C.sand3) })),
    rect(150, 420, 70, 40), rect(140, 410, 90, 14, { rx: 4 }),
  );
  for (const [px, ph, sd] of [[350, 120, 3], [395, 95, 4], [880, 130, 6], [940, 100, 7], [560, 90, 8]]) {
    body += palm(px, 560, { h: ph, seed: sd, dates: false, trunk: farTint(C.wood2), trunkDark: farTint(C.wood3), leaf: farTint(C.leaf3), leafMid: farTint(C.leaf4), leafDark: farTint(C.leaf5) });
  }

  // the river
  body += path('M0,566 H1000 V1000 H0Z', { fill: `url(#${id('river')})` });
  body += ellipse(720, 590, 260, 40, { fill: `url(#${id('mist')})`, opacity: 0.8 });
  body += shimmer(720, 592, { n: 9, w: 190, gap: 15, color: '#FFF4DA', op: 0.85, seed: 3 });
  for (let i = 0; i < 16; i++) {
    const y = 640 + R() * 330;
    const x = R() * 1000;
    const w = 40 + R() * 70;
    body += path(`M${r1(x)},${r1(y)} q${r1(w / 2)},-6 ${r1(w)},0`, { fill: 'none', stroke: C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.25 + R() * 0.2 });
  }

  // mid-ground reeds on the far right and left banks
  body += g({}, papyrus(940, 640, { h: 210, lean: -14, stem: midTint(C.leaf4), head: midTint(C.leaf3), headDark: midTint(C.leaf4), s: 0.8 }), papyrus(985, 650, { h: 250, lean: 8, stem: midTint(C.leaf4), head: midTint(C.leaf3), headDark: midTint(C.leaf4), s: 0.85 }));

  // lotus pads
  body += lotusPad(150, 880, 70) + lotusPad(260, 940, 55, C.leaf2, C.leaf4) + lotusPad(770, 905, 64) + lotusPad(860, 820, 48, C.leaf2, C.leaf4) + lotusPad(640, 965, 58);
  body += lotus(200, 878, 1.1) + lotus(800, 898, 1) + lotus(880, 818, 0.8);

  // Allah's care: a soft glow and sparkles around the chest
  body += circle(500, 740, 230, { fill: `url(#${id('care')})` });
  for (const [sx, sy, ss] of [[330, 640, 12], [660, 610, 15], [700, 700, 9], [300, 740, 8], [600, 560, 8], [420, 590, 10]]) body += sparkle(sx, sy, ss, '#FFF6DC');

  // ripples around the chest, then the chest itself
  body += ellipse(500, 800, 210, 30, { fill: 'none', stroke: C.white, 'stroke-width': 4, opacity: 0.45 });
  body += ellipse(500, 806, 270, 42, { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.25 });
  body += chest(500, 760);

  // a mother duck and ducklings keeping it company
  body += duck(765, 738, 1.05, true) + duck(845, 758, 0.58, true, C.gold1, C.gold2) + duck(905, 772, 0.52, true, C.gold1, C.gold2);
  body += path('M700,742 q40,-6 90,0 M800,760 q20,-4 50,0', { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.45, 'stroke-linecap': 'round' });

  // foreground papyrus framing the left side
  body += papyrus(40, 1010, { h: 520, lean: 30, s: 1.25, stem: C.leaf5, head: C.leaf4, headDark: C.leaf5 });
  body += papyrus(95, 1010, { h: 430, lean: 60, s: 1.05 });
  body += papyrus(-10, 1010, { h: 380, lean: -10, s: 1.1, stem: C.leaf5, head: C.leaf4, headDark: C.leaf5 });
  body += papyrus(150, 1010, { h: 300, lean: 40, s: 0.9 });
  // reeds along the near edges
  for (const [rx, rh, rl, rc] of [[18, 260, 18, C.leaf5], [62, 200, 30, C.leaf4], [120, 170, 26, C.leaf5], [178, 120, 22, C.leaf4], [930, 210, -22, C.leaf5], [968, 280, -10, C.leaf4], [1000, 230, -30, C.leaf5], [890, 140, -26, C.leaf4]]) {
    body += path(`M${rx - 5},1005 Q${rx + rl * 0.3},${1005 - rh * 0.6} ${rx + rl},${1005 - rh} Q${rx + rl * 0.3 + 4},${1005 - rh * 0.55} ${rx + 6},1005Z`, { fill: rc });
  }

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
