// Allah Made Everything (Quran 21:30-33, 16:10-18, 2:164).
// The whole created world in one picture: bright day on the left (sun,
// clouds, green hills, fruit trees, flowers) flowing through a soft lavender
// evening in the middle into a deep-blue night on the right (crescent moon,
// stars, fireflies). A river winds between them with a fish leaping; a
// rabbit, a deer and a sleepy camel share the land with birds and butterflies.
import {
  C, svgDoc, ids, rng, mix, clamp, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g,
  ridge, smooth, sparkle, crescent, sun, cloud, mountain, tree, cypress, bush, grass, flower, rock, fish, flyingBird,
  farBird, eye, T, r1,
} from '../lib.js';

// ---------------------------------------------------------------- day -> night
const DAY_END = 380;
const NIGHT_START = 650;
const NIGHT = '#1B2A5E';
const ss = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const night = (c, k = 0.6) => mix(c, NIGHT, k);
// colour of an object standing at x: day colour on the left, night on the right
const at = (c, x, k = 0.6) => mix(c, night(c, k), ss(DAY_END, NIGHT_START, x));

// ---------------------------------------------------------------- creatures
function rabbit(x, y, { s = 1, flip = false, fur = '#EFE2D2', shade = '#D9C5AF', light = '#FFF9F0' } = {}) {
  return g({ transform: T(x, y, s, 0, flip) },
    ellipse(-4, 2, 62, 8, { fill: C.ink, opacity: 0.13 }),
    circle(-52, -28, 13, { fill: light }),
    // round back and upright chest
    path('M-56,-12 C-64,-48 -40,-78 -6,-78 C22,-78 42,-60 42,-34 C42,-12 30,-2 8,-2 L-42,-2 C-52,-2 -56,-6 -56,-12Z', { fill: fur }),
    path('M-50,-10 C-56,-38 -32,-56 -8,-46 C-32,-42 -42,-26 -38,-4 L-42,-2 C-48,-3 -50,-6 -50,-10Z', { fill: shade, opacity: 0.7 }),
    path('M-46,-52 C-38,-70 -16,-79 6,-75 C-12,-68 -30,-62 -46,-52Z', { fill: light, opacity: 0.8 }),
    ellipse(-12, -5, 27, 7.5, { fill: shade }),
    ellipse(24, -36, 17, 23, { fill: light }),
    ellipse(26, -5, 9, 6.5, { fill: light }),
    ellipse(40, -5, 9, 6.5, { fill: light }),
    // ears
    ellipse(14, -124, 10, 31, { fill: shade, transform: 'rotate(-20 14 -124)' }),
    ellipse(32, -128, 11, 33, { fill: fur, transform: 'rotate(8 32 -128)' }),
    ellipse(32, -126, 5.5, 24, { fill: C.rose1, transform: 'rotate(8 32 -126)' }),
    // head
    circle(34, -80, 28, { fill: fur }),
    path('M10,-92 C14,-104 30,-110 42,-106 C30,-102 18,-98 10,-92Z', { fill: light, opacity: 0.8 }),
    ellipse(48, -70, 17, 13, { fill: light }),
    eye(44, -86, 4.8),
    ellipse(62, -76, 4.2, 3.2, { fill: C.rose2 }),
    ellipse(46, -66, 6.5, 4, { fill: C.cheek, opacity: 0.6 }),
  );
}

function deer(x, y, { s = 1, flip = false, coat = C.wood1, dark = C.wood2, light = '#F7E4C8', hoof = C.wood4, antler = C.wood3 } = {}) {
  const spots = [[-36, -118, 5.5], [-14, -126, 5.5], [8, -122, 5], [-26, -104, 4.5], [-2, -110, 4.5], [20, -108, 4], [-48, -104, 4]];
  return g({ transform: T(x, y, s, 0, flip) },
    ellipse(0, 2, 82, 9, { fill: C.ink, opacity: 0.12 }),
    // far legs
    rect(-50, -84, 12, 86, { rx: 6, fill: dark }), rect(30, -84, 12, 86, { rx: 6, fill: dark }),
    rect(-50, -8, 12, 10, { rx: 5, fill: hoof }), rect(30, -8, 12, 10, { rx: 5, fill: hoof }),
    // tail
    ellipse(-70, -112, 11, 15, { fill: coat, transform: 'rotate(-30 -70 -112)' }),
    ellipse(-72, -106, 7, 10, { fill: light, transform: 'rotate(-30 -72 -106)' }),
    // body
    path('M-74,-108 C-76,-134 -44,-146 -6,-144 C30,-142 58,-134 64,-110 C68,-86 44,-74 -6,-74 C-50,-74 -72,-84 -74,-108Z', { fill: coat }),
    path('M-60,-88 C-30,-76 30,-76 56,-90 C48,-78 30,-74 -6,-74 C-40,-74 -54,-80 -60,-88Z', { fill: light, opacity: 0.9 }),
    ...spots.map(([a, b, r]) => circle(a, b, r, { fill: light, opacity: 0.9 })),
    // near legs
    rect(-40, -86, 13, 88, { rx: 6.5, fill: coat }), rect(42, -86, 13, 88, { rx: 6.5, fill: coat }),
    rect(-40, -8, 13, 10, { rx: 5, fill: hoof }), rect(42, -8, 13, 10, { rx: 5, fill: hoof }),
    // neck
    path('M34,-128 C44,-150 52,-166 60,-182 L86,-176 C80,-156 72,-132 62,-110Z', { fill: coat }),
    path('M58,-120 C66,-140 74,-158 80,-176 L86,-176 C80,-156 72,-132 62,-110Z', { fill: light, opacity: 0.55 }),
    // antlers (little rounded branches)
    path('M66,-204 C62,-222 54,-232 46,-238 M58,-224 C52,-224 46,-220 42,-214', { fill: 'none', stroke: mix(antler, '#000000', 0.15), 'stroke-width': 5, 'stroke-linecap': 'round' }),
    path('M80,-206 C80,-226 86,-238 94,-246 M84,-228 C90,-228 96,-224 100,-218', { fill: 'none', stroke: antler, 'stroke-width': 5.5, 'stroke-linecap': 'round' }),
    // ears
    ellipse(54, -202, 9, 19, { fill: dark, transform: 'rotate(-62 54 -202)' }),
    ellipse(92, -206, 9, 19, { fill: coat, transform: 'rotate(52 92 -206)' }),
    ellipse(92, -206, 4.5, 12, { fill: C.rose1, transform: 'rotate(52 92 -206)' }),
    // head
    ellipse(76, -188, 25, 21, { fill: coat }),
    ellipse(96, -178, 16, 12, { fill: light }),
    circle(110, -180, 4.5, { fill: C.ink }),
    eye(82, -192, 4.6),
    ellipse(88, -178, 6.5, 4, { fill: C.cheek, opacity: 0.6 }),
  );
}

// A camel resting with its legs folded under. Faces right unless flipped.
function restingCamel(x, y, { s = 1, flip = false, body = C.sand3, dark = C.sand4, light = C.sand2, rim, sleepy = true } = {}) {
  const parts = [
    ellipse(0, 2, 120, 12, { fill: C.ink, opacity: 0.16 }),
    path('M-100,-50 Q-118,-34 -108,-14', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }),
    // body: rump, one big hump, shoulder and chest
    path('M-104,-24 C-112,-52 -96,-76 -66,-82 C-52,-124 -2,-136 20,-98 C30,-84 50,-80 70,-76 C92,-70 100,-50 98,-28 C96,-8 84,-2 64,-2 L-84,-2 C-98,-2 -104,-12 -104,-24Z', { fill: body }),
    path('M-66,-82 C-52,-124 -2,-136 20,-98 C-4,-118 -44,-114 -66,-82Z', { fill: light, opacity: 0.75 }),
    // folded hind leg
    path('M-98,-12 C-100,-44 -62,-56 -42,-32 C-34,-18 -40,-4 -54,-2 L-84,-2 C-94,-2 -98,-6 -98,-12Z', { fill: dark, opacity: 0.3 }),
    path('M-90,-14 C-60,-4 40,-4 92,-16 C86,-6 76,-2 64,-2 L-84,-2 C-88,-2 -90,-8 -90,-14Z', { fill: dark, opacity: 0.45 }),
    // folded front legs and knee pad
    ellipse(50, -9, 40, 11, { fill: body }),
    ellipse(50, -5, 36, 6, { fill: dark, opacity: 0.35 }),
    ellipse(80, -11, 13, 8, { fill: light }),
    // neck rising from the chest
    path('M60,-72 C90,-86 108,-112 112,-146 L138,-146 C140,-104 116,-58 80,-40Z', { fill: body }),
    path('M112,-146 L138,-146 C139,-118 130,-92 114,-74 C124,-98 124,-124 112,-146Z', { fill: light, opacity: 0.45 }),
    // head (same shape family as the kit camel)
    g({ transform: 'translate(12 16)' },
      path('M92,-174 C96,-190 120,-196 138,-188 C156,-182 170,-174 170,-160 C170,-148 160,-144 148,-146 C134,-148 124,-144 116,-142 C100,-142 88,-156 92,-174Z', { fill: body }),
      ellipse(106, -190, 7, 11, { fill: dark, transform: 'rotate(-30 106 -190)' }),
      ellipse(160, -154, 4, 3, { fill: dark }),
      path('M150,-146 Q158,-142 166,-146', { fill: 'none', stroke: dark, 'stroke-width': 3, 'stroke-linecap': 'round' }),
      eye(128, -172, 5, sleepy),
      ellipse(138, -158, 7, 4, { fill: C.cheek, opacity: 0.6 }),
    ),
  ];
  if (rim) parts.push(path('M-60,-86 C-46,-124 -4,-132 16,-100', { fill: 'none', stroke: rim, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 }), path('M112,-160 C120,-174 138,-178 152,-172', { fill: 'none', stroke: rim, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.5 }));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// Long pointed leaf from its base (x, y); ang in degrees (-90 points up).
function leaf(x, y, len, ang, w, fill, vein) {
  const d = `M0,0 C${r1(len * 0.3)},${r1(-w)} ${r1(len * 0.72)},${r1(-w * 0.8)} ${r1(len)},0 C${r1(len * 0.72)},${r1(w * 0.8)} ${r1(len * 0.3)},${r1(w)} 0,0Z`;
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})` },
    path(d, { fill }),
    path(`M0,0 C${r1(len * 0.35)},${r1(-w * 0.12)} ${r1(len * 0.7)},${r1(-w * 0.1)} ${r1(len * 0.96)},0`, { fill: 'none', stroke: vein, 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.6 }),
  );
}

// Tulip on a curved stem. (x, y) = bottom of the stem.
function tulip(x, y, h, lean, fill, dark, stem = C.leaf4) {
  const tx = x + lean;
  const ty = y - h;
  return path(`M${r1(x)},${r1(y)} Q${r1(x + lean * 0.2)},${r1(y - h * 0.6)} ${r1(tx)},${r1(ty)}`, { fill: 'none', stroke: stem, 'stroke-width': 4, 'stroke-linecap': 'round' }) +
    path(`M${r1(tx - 13)},${r1(ty - 26)} L${r1(tx - 6)},${r1(ty - 17)} L${r1(tx)},${r1(ty - 30)} L${r1(tx + 6)},${r1(ty - 17)} L${r1(tx + 13)},${r1(ty - 26)} C${r1(tx + 16)},${r1(ty - 8)} ${r1(tx + 9)},${r1(ty + 2)} ${r1(tx)},${r1(ty + 2)} C${r1(tx - 9)},${r1(ty + 2)} ${r1(tx - 16)},${r1(ty - 8)} ${r1(tx - 13)},${r1(ty - 26)}Z`, { fill, 'stroke-linejoin': 'round' }) +
    path(`M${r1(tx)},${r1(ty - 30)} L${r1(tx + 6)},${r1(ty - 17)} L${r1(tx + 13)},${r1(ty - 26)} C${r1(tx + 16)},${r1(ty - 8)} ${r1(tx + 9)},${r1(ty + 2)} ${r1(tx)},${r1(ty + 2)}Z`, { fill: dark, opacity: 0.55 });
}

// Butterfly seen from above, wings open.
function butterfly(x, y, { s = 1, rot = 0, wing = C.gold2, wing2 = C.coral2, spot = C.cream, bodyC = C.ink2 } = {}) {
  const up = 'M0,-2 C6,-30 38,-40 46,-22 C52,-8 34,4 0,0Z';
  const lo = 'M0,2 C20,2 36,14 30,30 C24,42 6,30 0,6Z';
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})` },
    path(up, { fill: wing }), path(up, { fill: wing, transform: 'scale(-1 1)' }),
    path(lo, { fill: wing2 }), path(lo, { fill: wing2, transform: 'scale(-1 1)' }),
    circle(28, -18, 6, { fill: spot, opacity: 0.85 }), circle(-28, -18, 6, { fill: spot, opacity: 0.85 }),
    circle(16, 18, 4, { fill: spot, opacity: 0.7 }), circle(-16, 18, 4, { fill: spot, opacity: 0.7 }),
    ellipse(0, 4, 3.6, 15, { fill: bodyC }),
    path('M-1,-9 Q-5,-20 -11,-25 M1,-9 Q5,-20 11,-25', { fill: 'none', stroke: bodyC, 'stroke-width': 2, 'stroke-linecap': 'round' }),
    circle(-11, -25, 2.4, { fill: bodyC }), circle(11, -25, 2.4, { fill: bodyC }),
  );
}

// ---------------------------------------------------------------- the scene
export default function render() {
  const id = ids('s01');
  const R = rng(101);
  const hz = { x1: 0, y1: 0, x2: 1000, y2: 0, units: 'userSpaceOnUse' };
  // a band of land / water whose colour turns from day to night across the page
  const bandDefs = [];
  const band = (name, day, k = 0.6, warm = 0.14) => {
    bandDefs.push(linear(id(name), [[0, day], [DAY_END / 1000, day], [0.515, mix(mix(day, night(day, k), 0.5), C.dawn0, warm)], [NIGHT_START / 1000, night(day, k)], [1, night(day, k)]], hz));
    return `url(#${id(name)})`;
  };

  const fills = {
    mtnLight: band('mtnL', '#BCD0EA', 0.5, 0.2),
    mtnDark: band('mtnD', '#9AB2DA', 0.55, 0.15),
    mtnBackL: band('mtnBL', '#D2E0F1', 0.45, 0.25),
    mtnBackD: band('mtnBD', '#BACBE7', 0.5, 0.2),
    snow: band('snow', '#FFFFFF', 0.35, 0.1),
    hillA: band('hillA', '#B7DDA0', 0.58, 0.18),
    hillB: band('hillB', C.leaf1, 0.6, 0.12),
    hillBdark: band('hillBd', C.leaf2, 0.62, 0.1),
    meadow: band('meadow', '#8DCB78', 0.62, 0.1),
    meadowDark: band('meadowD', C.leaf3, 0.64, 0.08),
    water: band('water', '#8ED8E0', 0.55, 0.2),
    waterDeep: band('waterD', C.water2, 0.58, 0.12),
    bankEdge: band('bank', '#DCEFC8', 0.6, 0.1),
  };

  const defs = [
    // tilted so the night reaches further left high up, as at real twilight
    linear(id('sky'), [[0, '#70BEE2'], [0.24, '#86C9E8'], [0.35, '#9ECDEA'], [0.43, '#B0BFE4'], [0.5, '#A99CD5'], [0.58, '#8679C2'], [0.67, '#5A64A8'], [0.78, '#33468A'], [1, '#1A2756']], { x1: 0, y1: 300, x2: 1000, y2: 0, units: 'userSpaceOnUse' }),
    radial(id('dayHaze'), [[0, '#F2FBF6', 0.95], [0.6, '#E2F4F2', 0.4], [1, '#E2F4F2', 0]]),
    radial(id('dusk'), [[0, '#FFE0B8', 0.95], [0.35, '#F7B9B4', 0.6], [0.7, '#E99AB8', 0.2], [1, '#E99AB8', 0]]),
    radial(id('nightHaze'), [[0, '#5D78B4', 0.7], [1, '#5D78B4', 0]]),
    glowDef(id('sunGlow'), '#FFF4C8', 0.9),
    glowDef(id('moonGlow'), '#FFF4D2', 0.45),
    glowDef(id('firefly'), '#FFE58A', 0.9),
    glowDef(id('splash'), '#FFFFFF', 0.6),
    ...bandDefs,
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');

  let body = '';
  // ------------------------------------------------------------ sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += ellipse(170, 620, 560, 300, { fill: `url(#${id('dayHaze')})` });
  body += ellipse(870, 640, 460, 260, { fill: `url(#${id('nightHaze')})` });
  body += ellipse(520, 590, 380, 280, { fill: `url(#${id('dusk')})` });

  // stars fade in toward the right
  for (let i = 0; i < 95; i++) {
    const x = 520 + R() * 480;
    const y = 20 + R() * 520 * R() ** 0.5;
    const op = ss(540, 780, x) * R.range(0.45, 1);
    if (op < 0.06 || Math.hypot(x - 835, y - 170) < 95) continue;
    body += circle(x, y, R.range(1.3, 3.3), { fill: R() < 0.25 ? C.gold1 : C.cream, opacity: r1(op * 100) / 100 });
  }
  for (const [sx, sy, sz, c] of [[700, 90, 12, C.cream], [960, 70, 10, C.gold1], [745, 300, 9, C.cream], [930, 260, 13, C.cream], [640, 180, 8, C.gold0], [980, 420, 8, C.cream], [880, 390, 7, C.gold1], [690, 420, 7, C.cream]]) {
    body += sparkle(sx, sy, sz, c, { opacity: r1(0.5 + 0.5 * ss(560, 760, sx)) });
  }
  // moon
  body += glow(835, 170, 210, id('moonGlow'));
  body += crescent(835, 170, 66, { fill: '#FFF0C4', angle: -22 });
  // sun
  body += sun(180, 175, 60, { fill: C.gold1, core: '#FFF6D6', rays: 12, rayColor: '#FFE7A0', glowId: id('sunGlow') });
  // clouds
  body += cloud(410, 150, 190, { fill: C.white, shade: '#CFE7F2', seed: 4 });
  body += cloud(100, 362, 140, { fill: C.white, shade: C.sky2, seed: 7, opacity: 0.95 });
  body += cloud(575, 318, 150, { fill: '#F8D3DA', shade: '#DDA9C8', seed: 11, opacity: 0.85 });
  body += cloud(945, 350, 150, { fill: '#3E5594', shade: '#30447D', seed: 5, opacity: 0.6 });
  // birds
  body += flyingBird(300, 285, { s: 0.6, body: C.white, wing: '#D7E7F0' });
  body += flyingBird(372, 328, { s: 0.48, up: false, body: C.white, wing: '#D7E7F0' });
  body += farBird(250, 250, 1.1, '#5A7FA3', 0.55) + farBird(285, 228, 0.8, '#5A7FA3', 0.5);

  // ------------------------------------------------------------ mountains
  const mtn = (mx, mw, mh, seed, back) => mountain(mx, 612, mw, mh, { light: back ? fills.mtnBackL : fills.mtnLight, dark: back ? fills.mtnBackD : fills.mtnDark, snow: mh > 200 ? fills.snow : undefined, seed, peakRound: 0.09 });
  body += mtn(240, 360, 250, 3, true) + mtn(760, 380, 268, 8, true) + mtn(520, 300, 170, 5, true);
  body += mtn(60, 340, 206, 2, false) + mtn(390, 300, 185, 6, false) + mtn(660, 290, 176, 9, false) + mtn(950, 360, 230, 4, false);

  // ------------------------------------------------------------ land
  body += path(ridge([[-20, 618], [140, 604], [300, 612], [470, 600], [560, 608], [700, 598], [860, 612], [1020, 602]], 1000), { fill: fills.hillA });
  // mid hills, left and right of the river valley
  body += path(ridge([[-20, 660], [110, 628], [250, 636], [380, 662], [470, 700], [530, 742], [580, 770]], 1000), { fill: fills.hillB });
  body += path(ridge([[560, 742], [612, 690], [720, 650], [860, 640], [1020, 652]], 1000), { fill: fills.hillB });
  body += path(ridge([[-20, 700], [160, 690], [300, 700], [440, 740], [520, 790], [570, 812]], 1000), { fill: fills.hillBdark, opacity: 0.55 });
  body += path(ridge([[560, 790], [680, 728], [820, 712], [1020, 720]], 1000), { fill: fills.hillBdark, opacity: 0.55 });
  // near meadows
  body += path(ridge([[-20, 790], [120, 772], [280, 780], [420, 812], [520, 880], [600, 1000]], 1000), { fill: fills.meadow });
  body += path(ridge([[470, 1000], [560, 860], [680, 806], [840, 788], [1020, 796]], 1000), { fill: fills.meadow });

  // ------------------------------------------------------------ river
  const centre = [[566, 607, 0], [550, 628, 7], [522, 656, 15], [532, 690, 24], [590, 730, 36], [612, 782, 56], [570, 852, 92], [548, 930, 140], [546, 1020, 196]];
  const lb = centre.map(([x, y, w]) => [x - w, y]);
  const rb = centre.map(([x, y, w]) => [x + w, y]);
  const riverD = (L, Rr) => `${smooth(L)} L${smooth(Rr.slice().reverse()).slice(1)} Z`;
  const grow = (k, add) => [centre.map(([x, y, w]) => [x - w * k - add * Math.min(1, w / 20), y]), centre.map(([x, y, w]) => [x + w * k + add * Math.min(1, w / 20), y])];
  const [lb2, rb2] = grow(1.06, 5);
  body += path(riverD(lb2, rb2), { fill: fills.bankEdge });
  body += path(riverD(lb, rb), { fill: fills.water });
  const [lb3, rb3] = grow(0.55, 0);
  body += path(riverD(lb3.map(([x, y]) => [x + 10, y]), rb3.map(([x, y]) => [x + 10, y])), { fill: fills.waterDeep, opacity: 0.45 });
  // shore foam lines and ripples
  body += path(smooth(lb.slice(3)), { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.5, 'stroke-linecap': 'round' });
  body += path(smooth(rb.slice(3)), { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.35, 'stroke-linecap': 'round' });
  for (const [rx, ry, rw, op] of [[540, 700, 30, 0.5], [600, 760, 44, 0.45], [520, 820, 50, 0.5], [600, 960, 70, 0.4], [470, 940, 60, 0.45], [640, 880, 40, 0.35]]) {
    body += path(`M${rx - rw / 2},${ry} q${rw / 2},-6 ${rw},0`, { fill: 'none', stroke: rx > 560 ? '#FFF1C8' : C.white, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: op });
  }

  // the leaping fish with its splash
  body += ellipse(600, 922, 64, 13, { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.55 });
  body += ellipse(600, 926, 96, 20, { fill: 'none', stroke: C.white, 'stroke-width': 2.5, opacity: 0.3 });
  body += glow(588, 860, 120, id('splash'));
  body += g({ transform: `translate(588 856) rotate(-32)` }, fish(0, 0, { s: 1.05, body: C.gold2, fin: C.coral2, belly: C.gold0 }));
  for (const [dx, dy, dr] of [[530, 900, 6], [516, 880, 4.5], [548, 876, 4], [656, 908, 5], [672, 890, 3.5], [500, 912, 3.5]]) body += circle(dx, dy, dr, { fill: C.white, opacity: 0.85 });
  body += sparkle(650, 800, 10, C.white, { opacity: 0.9 }) + sparkle(520, 840, 7, C.white, { opacity: 0.8 });

  // ------------------------------------------------------------ trees and plants, back to front
  // day side trees
  body += tree(75, 714, { r: 78, trunkH: 72, seed: 3, fruit: C.coral2, fruitN: 8, leaf: C.leaf3, leafDark: C.leaf4, leafLight: C.leaf2 });
  body += tree(230, 660, { r: 46, trunkH: 40, seed: 12, fruit: C.gold2, fruitN: 6, leaf: C.leaf2, leafDark: C.leaf3, leafLight: C.leaf1 });
  body += tree(420, 690, { r: 40, trunkH: 36, seed: 21, leaf: at(C.leaf3, 420), leafDark: at(C.leaf4, 420), leafLight: at(C.leaf2, 420), trunk: at(C.wood2, 420), fruit: at(C.rose2, 420), fruitN: 5 });
  // night side trees
  body += cypress(690, 694, { h: 120, w: 40, fill: at(C.leaf5, 690), light: at(C.leaf4, 690) });
  body += cypress(722, 690, { h: 86, w: 32, fill: at(C.leaf5, 722), light: at(C.leaf4, 722) });
  body += tree(870, 668, { r: 52, trunkH: 42, seed: 31, leaf: at(C.leaf3, 870), leafDark: at(C.leaf4, 870), leafLight: at(C.leaf2, 870), trunk: at(C.wood2, 870) });
  body += cypress(965, 690, { h: 200, w: 62, fill: at(C.leaf5, 965), light: at(C.leaf4, 965) });

  // the deer on the left hill, looking toward the river
  body += deer(300, 742, { s: 0.62 });
  // bushes along the meadow edges
  body += bush(30, 800, { w: 110, seed: 2 }) + bush(380, 822, { w: 80, seed: 6 });
  body += bush(990, 806, { w: 120, seed: 9, fill: at(C.leaf3, 990), dark: at(C.leaf4, 990), light: at(C.leaf2, 990) });

  // day meadow flowers
  const dayFlowers = [C.coral1, C.rose1, C.gold1, C.plum1, C.white, C.coral2, C.rose2];
  for (let i = 0; i < 30; i++) {
    const fx = 20 + R() * 430;
    const fy = 820 + R() * 170;
    if (fx > 140 && fx < 300 && fy > 850) continue; // keep the rabbit clear
    body += flower(fx, fy, { r: R.range(7, 12), fill: R.pick(dayFlowers), center: C.gold2, stem: C.leaf4, stemH: R.range(10, 20), rot: R() * 70 });
  }
  // night meadow: pale moon-flowers and fireflies
  for (let i = 0; i < 12; i++) {
    const fx = 680 + R() * 300;
    const fy = 830 + R() * 150;
    if (fx > 680 && fx < 930 && fy < 900) continue;
    body += flower(fx, fy, { r: R.range(6, 9), fill: '#C9D2F2', center: C.gold1, stem: at(C.leaf4, fx), stemH: 12, rot: R() * 70 });
  }

  // the camel resting under the moon
  body += restingCamel(828, 905, { s: 0.88, flip: true, body: mix(C.sand3, '#9C8FC4', 0.38), dark: mix(C.sand4, '#6F64A0', 0.42), light: mix(C.sand2, '#E4DCF4', 0.3), rim: '#FFF3CF' });

  // the rabbit in the sunshine
  body += rabbit(210, 930, { s: 0.95 });

  // butterflies on the day side
  body += butterfly(388, 528, { s: 0.75, rot: -14, wing: C.gold2, wing2: C.coral2 });
  body += butterfly(160, 795, { s: 0.62, rot: 12, wing: C.rose1, wing2: C.plum2 });
  body += butterfly(452, 752, { s: 0.52, rot: -8, wing: C.sky0, wing2: C.plum1, spot: C.white });

  // fireflies on the night side
  for (const [fx, fy] of [[730, 760], [900, 740], [960, 860], [760, 960], [880, 610], [700, 600], [990, 560], [640, 700]]) {
    body += glow(fx, fy, 22, id('firefly')) + circle(fx, fy, 3, { fill: '#FFF2B0' });
  }

  // ------------------------------------------------------------ foreground frame
  // day corner: broad leaves and tulips
  for (const [lx, ly, len, ang, w, c] of [[-20, 1010, 250, -62, 34, C.leaf4], [10, 1016, 200, -80, 28, C.leaf3], [60, 1016, 170, -48, 26, C.leaf4], [-30, 960, 190, -30, 28, C.leaf5], [110, 1016, 120, -70, 20, C.leaf3]]) body += leaf(lx, ly, len, ang, w, c, C.leaf1);
  body += tulip(70, 1010, 150, 14, C.coral2, C.coral3) + tulip(118, 1010, 112, 22, C.rose1, C.rose2) + tulip(28, 1010, 190, 4, C.gold2, C.gold3);
  for (const [gx, gy, gh, sd] of [[180, 1006, 50, 3], [330, 1006, 62, 4], [415, 1006, 48, 5]]) body += grass(gx, gy, { h: gh, n: 6, seed: sd, fill: C.leaf4 });
  // night corner: tall dark blades with pale moon-flowers
  const nb = night(C.leaf4, 0.6);
  for (const [lx, ly, len, ang, w, c] of [[1020, 1010, 260, -112, 22, night(C.leaf5, 0.55)], [990, 1016, 210, -98, 18, nb], [1030, 950, 200, -140, 22, night(C.leaf4, 0.5)], [950, 1016, 150, -104, 16, night(C.leaf5, 0.55)], [905, 1016, 110, -84, 14, nb]]) body += leaf(lx, ly, len, ang, w, c, night(C.leaf2, 0.5));
  for (const [fx, fy, sh] of [[958, 840, 120], [918, 880, 90], [985, 900, 70]]) {
    body += path(`M${fx},${fy} Q${fx + 6},${fy + sh * 0.5} ${fx + 2},${fy + sh}`, { fill: 'none', stroke: nb, 'stroke-width': 3.5, 'stroke-linecap': 'round' });
    body += flower(fx, fy, { r: 12, fill: '#DCE2FA', center: C.gold1, rot: fx });
  }
  for (const [gx, gy, gh, sd] of [[690, 1006, 60, 6], [760, 1006, 48, 7], [850, 1006, 66, 8]]) body += grass(gx, gy, { h: gh, n: 6, seed: sd, fill: at(C.leaf5, gx) });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
