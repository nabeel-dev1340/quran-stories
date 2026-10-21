// Yunus and the big fish (Quran 21:87-88, 37:139-146, 68:48-50).
// Deep in the night sea, in "the darknesses", a huge gentle whale swims
// calmly with its eyes softly closed, wrapped in a soft golden glow of
// Allah's mercy. Far above, the moon shines on the surface and a tiny ship
// sails on. Yunus is never shown.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, starField, fish, star5, eye, T, r1,
} from '../lib.js';

const line = (c, w, a = {}) => ({ fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a });

// ---------------------------------------------------------------- the whale
const WH = { body: '#6F86C6', dark: '#56699F', light: '#A3B7E6', belly: '#DDE5F3', groove: '#B9C6E2', fin: '#5C71AC' };
const WHALE_BODY = 'M300,-14 C300,-132 200,-182 90,-182 C-30,-182 -150,-124 -226,-54 C-252,-30 -262,-6 -256,12 C-236,44 -180,78 -110,108 C-20,146 110,162 200,138 C270,120 300,62 300,-14Z';
const WHALE_TAIL = 'M-206,-40 C-258,-66 -292,-108 -300,-150 L-270,-156 C-262,-118 -236,-90 -186,-70Z';
const WHALE_FLUKE = 'M-286,-150 C-304,-184 -352,-206 -392,-196 C-374,-174 -336,-156 -290,-140Z M-284,-150 C-268,-186 -224,-210 -184,-202 C-200,-180 -236,-158 -280,-140Z';

// A big friendly whale facing right, eyes softly closed. (x, y) = body
// centre. `bodyFill` is a vertical gradient for the body.
function whale(x, y, s, bodyFill, auraFill) {
  const P = [];
  // a soft golden aura that hugs the whale's outline
  for (let w = 104; w >= 8; w -= 8) {
    const st = { fill: auraFill, stroke: auraFill, 'stroke-width': w, 'stroke-linejoin': 'round', opacity: '0.036' };
    P.push(path(WHALE_BODY, st), path(WHALE_TAIL, st), path(WHALE_FLUKE, st));
  }
  // far flipper peeking out below
  P.push(path('M40,126 C24,170 -10,200 -46,208 C-30,176 -12,146 6,126Z', { fill: WH.dark }));
  // tail, curled up, and its flukes
  P.push(path(WHALE_TAIL, { fill: WH.body }));
  P.push(path(WHALE_FLUKE, { fill: WH.body }));
  P.push(path('M-286,-150 C-304,-184 -352,-206 -392,-196 C-360,-190 -320,-176 -290,-150Z', { fill: WH.light, opacity: 0.6 }));
  P.push(path('M-284,-150 C-268,-186 -224,-210 -184,-202 C-216,-196 -252,-180 -280,-150Z', { fill: WH.light, opacity: 0.6 }));
  // body: big round head on the right
  P.push(path(WHALE_BODY, { fill: bodyFill }));
  // belly with soft grooves
  P.push(path('M288,48 C266,108 196,146 104,154 C0,160 -90,134 -164,98 C-80,116 40,120 140,106 C214,96 262,76 288,48Z', { fill: WH.belly }));
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    P.push(path(`M${r1(266 - t * 26)},${r1(74 + t * 18)} C${r1(196 - t * 30)},${r1(112 + t * 12)} ${r1(70 - t * 40)},${r1(126 + t * 9)} ${r1(-50 - t * 36)},${r1(120 + t * 3)}`, line(WH.groove, 3, { opacity: 0.75 })));
  }
  // moonlit back
  P.push(path('M270,-110 C220,-166 120,-180 30,-172 C-70,-162 -160,-114 -220,-58 C-130,-108 -40,-144 50,-150 C140,-156 220,-142 270,-110Z', { fill: WH.light, opacity: 0.8 }));
  // freckles
  for (const [fx, fy, fr] of [[20, -132, 7], [52, -146, 5], [-12, -114, 5], [84, -152, 4]]) P.push(circle(fx, fy, fr, { fill: WH.light, opacity: 0.9 }));
  // blowhole
  P.push(ellipse(140, -178, 13, 4.5, { fill: WH.dark }));
  // near flipper
  P.push(path('M126,100 C116,150 80,196 34,218 C24,222 16,214 22,204 C52,170 74,132 80,98Z', { fill: WH.fin }));
  P.push(path('M124,104 C118,128 106,152 92,172', line(WH.light, 4, { opacity: 0.5 })));
  // face: closed eye, rosy cheek, gentle smile
  P.push(eye(190, -30, 15, true));
  P.push(path('M172,-54 Q182,-62 194,-60', line(WH.dark, 3.5, { opacity: 0.7 })));
  P.push(ellipse(212, 10, 24, 13, { fill: C.cheek, opacity: 0.55 }));
  P.push(path('M298,22 C282,46 256,58 230,56', line('#3E4E80', 5)));
  P.push(path('M234,48 Q226,56 230,64', line('#3E4E80', 4)));
  return g({ transform: T(x, y, s) }, P);
}

// ---------------------------------------------------------------- sea friends
// A cute jellyfish. (x, y) = centre of the bell's rim.
function jellyfish(x, y, s, glowId) {
  const P = [];
  P.push(circle(0, -20, 120, { fill: `url(#${glowId})` }));
  // tentacles
  for (let i = 0; i < 5; i++) {
    const tx = -32 + i * 16;
    P.push(path(`M${tx},4 q${-8 + (i % 2) * 16},24 0,46 q${8 - (i % 2) * 16},24 0,46 q${-6 + (i % 2) * 12},18 0,34`, line(C.rose1, 3.5, { opacity: 0.75 })));
  }
  P.push(path('M-12,6 C-22,36 -2,60 -14,94 C-4,70 10,44 0,6Z', { fill: C.rose2, opacity: 0.7 }));
  P.push(path('M12,6 C24,40 6,62 18,90 C6,70 -6,44 4,6Z', { fill: C.rose2, opacity: 0.6 }));
  // bell with a frilly rim
  P.push(path('M-56,2 C-58,-62 58,-62 56,2 Q46,12 36,4 Q26,13 16,4 Q6,13 -4,4 Q-14,13 -24,4 Q-34,13 -44,4 Q-50,10 -56,2Z', { fill: '#F2B6CC', opacity: 0.95 }));
  P.push(path('M-56,2 C-58,-62 58,-62 56,2 C40,-30 -40,-30 -56,2Z', { fill: '#F8CEDC', opacity: 0.6 }));
  P.push(ellipse(-22, -34, 14, 7, { fill: C.white, opacity: 0.55, transform: 'rotate(-25 -22 -34)' }));
  P.push(eye(-14, -16, 4.6), eye(14, -16, 4.6));
  P.push(ellipse(-26, -6, 6, 3.5, { fill: C.rose2, opacity: 0.7 }), ellipse(26, -6, 6, 3.5, { fill: C.rose2, opacity: 0.7 }));
  P.push(path('M-5,-6 Q0,-1 5,-6', line(C.ink2, 2)));
  return g({ transform: T(x, y, s) }, P);
}

// A tall kelp stem with alternating leaves. (x, y) = foot.
function kelp(x, y, h, { sway = 30, fill = C.leaf5, leaf = C.leaf4, seed = 1, w = 7 } = {}) {
  const R = rng(seed);
  const pts = [];
  const n = 8;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x + Math.sin(t * Math.PI * 1.6 + seed) * sway * t, y - h * t]);
  }
  let s = path(smooth(pts), line(fill, w));
  for (let i = 1; i < n; i++) {
    const [px, py] = pts[i];
    const side = i % 2 ? 1 : -1;
    const L = (h / n) * R.range(0.9, 1.3);
    const ang = side > 0 ? -35 : -145;
    s += ellipse(px + side * L * 0.42, py - L * 0.18, L * 0.5, L * 0.16, { fill: leaf, transform: `rotate(${r1(ang + R.range(-10, 10))} ${r1(px + side * L * 0.42)} ${r1(py - L * 0.18)})` });
  }
  return s;
}

// A soft bubble. (x, y) = centre.
const bubble = (x, y, r, op = 0.8) =>
  circle(x, y, r, { fill: '#BFE6F2', opacity: op * 0.18 }) +
  circle(x, y, r, { fill: 'none', stroke: '#D6F1F7', 'stroke-width': r1(Math.max(1.2, r * 0.14)), opacity: op * 0.8 }) +
  ellipse(x - r * 0.35, y - r * 0.35, r * 0.28, r * 0.16, { fill: C.white, opacity: op, transform: `rotate(-40 ${r1(x - r * 0.35)} ${r1(y - r * 0.35)})` });

// A tiny sailing ship on the surface (no one on deck). (x, y) = waterline centre.
function ship(x, y, s = 1) {
  return g({ transform: T(x, y, s) },
    path('M-44,-4 L44,-4 C38,10 26,16 0,16 C-26,16 -38,10 -44,-4Z', { fill: '#8A6A72' }),
    path('M-44,-4 L44,-4 L42,0 L-42,0Z', { fill: '#B08E86' }),
    path('M0,-4 L0,-70', line('#5B4462', 3)),
    path('M3,-66 C24,-56 30,-30 26,-10 L3,-10Z', { fill: '#F2E6CF' }),
    path('M-3,-60 C-20,-50 -24,-30 -22,-12 L-3,-12Z', { fill: '#E3D3B6' }),
    path('M0,-70 L14,-66 L0,-62Z', { fill: C.coral2 }),
  );
}

export default function render() {
  const id = ids('s28');
  const R = rng(28);
  const defs = [
    linear(id('sky'), [[0, '#0E1631'], [1, '#22386A']]),
    linear(id('sea'), [[0, '#2A5E8E'], [0.18, '#1E4677'], [0.5, '#172F5C'], [1, '#0D1A38']]),
    linear(id('shaft'), [[0, '#CFE7F6', 0.34], [1, '#CFE7F6', 0]]),
    glowDef(id('moonGlow'), '#FFF2C6', 0.55),
    radial(id('mercy'), [[0, '#FFE3A0', 0.5], [0.5, '#FFD98A', 0.2], [1, '#FFD98A', 0]], { r: 0.5 }),
    linear(id('whale'), [[0, '#8099D4'], [0.6, '#6E85C4'], [1, '#5E72AE']]),
    glowDef(id('jelly'), '#F7B6D2', 0.45),
    glowDef(id('fishGlow'), '#FFE59A', 0.7),
    glowDef(id('fishGlow2'), '#9FF0E6', 0.6),
    linear(id('floor'), [[0, '#1E345F'], [1, '#121F3E']]),
    vignetteDef(id('vig'), '#070D1E', 0.32),
  ].join('');
  const deep = (c, t = 0.55) => mix(c, '#16294F', t);
  let body = '';

  // ------------------------------------------------ night sky and the moon above the surface
  body += rect(0, 0, 1000, 150, { fill: `url(#${id('sky')})` });
  body += starField({ seed: 4, n: 26, area: [0, 0, 1000, 110], twinkles: 4, avoid: [[770, 62, 70]] });
  body += glow(770, 62, 150, id('moonGlow'));
  body += circle(770, 62, 36, { fill: '#FFF1C8' }) + circle(762, 54, 26, { fill: '#FFF8E2', opacity: 0.6 }) + circle(782, 70, 6, { fill: '#F3DFA8', opacity: 0.6 }) + circle(758, 74, 4, { fill: '#F3DFA8', opacity: 0.5 });

  // ------------------------------------------------ the sea
  const surf = [];
  for (let xx = -20; xx <= 1040; xx += 40) surf.push([xx, 128 + Math.sin(xx / 46) * 5]);
  body += path(`${smooth(surf)} L1040,1000 L-20,1000Z`, { fill: `url(#${id('sea')})` });
  body += path(smooth(surf), line('#9FD3E6', 4, { opacity: 0.7 }));
  body += ship(230, 132, 0.95);
  // moonlight dancing on the underside of the surface
  for (let i = 0; i < 14; i++) {
    const sx = 520 + R() * 440;
    const sy = 146 + R() * 30;
    body += path(`M${r1(sx)},${r1(sy)} q${r1(14 + R() * 16)},-5 ${r1(30 + R() * 30)},0`, line('#D9F1F7', 3, { opacity: 0.35 + R() * 0.3 }));
  }
  // shafts of moonlight filtering down
  for (const [sx, w0, w1, len, ang] of [[600, 30, 110, 760, 108], [690, 40, 150, 820, 104], [790, 26, 100, 700, 100], [870, 34, 120, 640, 97], [520, 20, 80, 600, 112]]) {
    const a = (ang * Math.PI) / 180;
    const ex = sx + Math.cos(a) * len;
    const ey = 140 + Math.sin(a) * len;
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    body += path(`M${r1(sx - w0 / 2)},140 L${r1(sx + w0 / 2)},140 L${r1(ex + (nx * w1) / 2)},${r1(ey + (ny * w1) / 2)} L${r1(ex - (nx * w1) / 2)},${r1(ey - (ny * w1) / 2)}Z`, { fill: `url(#${id('shaft')})` });
  }

  // ------------------------------------------------ far sea floor and kelp silhouettes
  body += path(ridge([[-20, 900], [160, 870], [360, 892], [560, 866], [760, 888], [1020, 860]]), { fill: deep('#2C4A7A', 0.3) });
  for (const [kx, kh, sd] of [[300, 210, 3], [340, 160, 4], [610, 190, 5], [680, 240, 6], [760, 170, 7]]) body += kelp(kx, 900, kh, { sway: 20, fill: '#2B5079', leaf: '#2B5079', seed: sd, w: 5 });
  // a far school of little fish
  for (let i = 0; i < 9; i++) body += ellipse(560 + (i % 3) * 30 + Math.floor(i / 3) * 14, 268 + Math.floor(i / 3) * 18 + (i % 3) * 4, 9, 4, { fill: '#5E86B4', opacity: 0.7 }) + path(`M${552 + (i % 3) * 30 + Math.floor(i / 3) * 14},${268 + Math.floor(i / 3) * 18 + (i % 3) * 4} l-7,-4 l0,8Z`, { fill: '#5E86B4', opacity: 0.7 });

  // ------------------------------------------------ the jellyfish
  body += jellyfish(140, 266, 1, id('jelly'));

  // ------------------------------------------------ the whale in a glow of mercy
  body += circle(520, 600, 430, { fill: `url(#${id('mercy')})` });
  body += whale(548, 612, 0.98, `url(#${id('whale')})`, '#FFDB8E');
  // bubbles rising from the blowhole to the surface
  for (const [bx, by, br] of [[688, 412, 7], [700, 374, 9], [688, 330, 11], [704, 282, 13], [692, 230, 15], [710, 182, 11], [724, 396, 5], [674, 304, 6]]) body += bubble(bx, by, br);
  // sparkles of mercy around the whale
  for (const [sx, sy, ss] of [[200, 470, 13], [820, 480, 10], [380, 380, 9], [760, 760, 12], [260, 760, 9], [560, 350, 8], [880, 640, 8], [130, 610, 8]]) body += sparkle(sx, sy, ss, '#FFE9A8', { opacity: 0.9 });

  // tiny glowing plankton drifting in the dark water
  for (let i = 0; i < 46; i++) {
    const px = 40 + R() * 920;
    const py = 200 + R() * 680;
    if (((px - 548) / 360) ** 2 + ((py - 600) / 190) ** 2 < 1) continue;
    body += circle(px, py, R.range(1.4, 3.2), { fill: R() < 0.6 ? '#FFE7A6' : '#BDF2EA', opacity: R.range(0.35, 0.8) });
  }

  // ------------------------------------------------ glowing fish
  const fishes = [
    [870, 370, 0.55, true, C.gold2, C.gold3, C.gold0, 'fishGlow'],
    [920, 420, 0.4, true, C.gold1, C.gold3, C.gold0, 'fishGlow'],
    [140, 600, 0.5, false, C.coral1, C.coral2, C.coral0, 'fishGlow'],
    [840, 820, 0.5, true, '#7FE0D2', '#4FBFB4', '#D4F7F0', 'fishGlow2'],
    [380, 860, 0.42, false, C.gold2, C.gold3, C.gold0, 'fishGlow'],
  ];
  for (const [fx, fy, fs, fl, b, f, be, gid] of fishes) body += glow(fx, fy, 80 * fs * 1.6, id(gid)) + fish(fx, fy, { s: fs, flip: fl, body: b, fin: f, belly: be });

  // ------------------------------------------------ near sea floor, coral and kelp framing the edges
  body += path(ridge([[-20, 950], [140, 924], [300, 944], [520, 930], [720, 950], [880, 926], [1020, 944]]), { fill: `url(#${id('floor')})` });
  // coral and rocks
  for (const [cx, cy, cr, col] of [[120, 940, 34, deep(C.coral2, 0.45)], [168, 948, 24, deep(C.rose2, 0.45)], [860, 938, 30, deep(C.plum2, 0.4)], [905, 946, 22, deep(C.coral2, 0.45)]]) {
    body += circle(cx, cy, cr, { fill: col }) + circle(cx - cr * 0.3, cy - cr * 0.35, cr * 0.35, { fill: mix(col, '#FFFFFF', 0.25), opacity: 0.6 });
    for (let k = 0; k < 7; k++) {
      const a = (Math.PI * 2 * k) / 7;
      body += circle(cx + Math.cos(a) * cr * 0.6, cy + Math.sin(a) * cr * 0.6, cr * 0.12, { fill: mix(col, '#000000', 0.2), opacity: 0.5 });
    }
  }
  body += path('M560,952 C556,920 540,900 520,884 M560,952 C566,914 586,896 604,880 M560,930 C548,912 556,896 566,886', line(deep(C.coral3, 0.4), 9));
  for (const [ex, ey] of [[520, 884], [604, 880], [566, 886]]) body += circle(ex, ey, 6, { fill: deep(C.coral2, 0.35) });
  body += ellipse(700, 958, 56, 22, { fill: '#253C69' }) + ellipse(686, 948, 18, 6, { fill: '#3B5689', opacity: 0.7 });
  // a sleepy starfish
  body += g({ transform: 'translate(330 958) rotate(-12)' }, star5(0, 0, 26, deep(C.coral2, 0.3), { stroke: deep(C.coral2, 0.3), 'stroke-width': 8 }), eye(-6, -2, 2.8, true), eye(6, -2, 2.8, true), ellipse(0, 6, 3, 1.6, { fill: C.cheek, opacity: 0.6 }));
  // kelp framing left and right
  body += kelp(30, 1010, 640, { sway: 40, fill: '#1F5C5A', leaf: '#2A746C', seed: 11, w: 9 });
  body += kelp(80, 1010, 460, { sway: 30, fill: '#1A4F52', leaf: '#256660', seed: 12, w: 8 });
  body += kelp(-10, 1010, 380, { sway: 26, fill: '#174749', leaf: '#205A58', seed: 13, w: 8 });
  body += kelp(960, 1010, 560, { sway: -36, fill: '#1F5C5A', leaf: '#2A746C', seed: 14, w: 9 });
  body += kelp(1000, 1010, 420, { sway: -28, fill: '#1A4F52', leaf: '#256660', seed: 15, w: 8 });
  // a few big bubbles near us
  body += bubble(120, 420, 14, 0.7) + bubble(140, 380, 9, 0.6) + bubble(900, 300, 12, 0.6);

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
