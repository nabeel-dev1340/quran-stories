// Sulayman and the little ant (Quran 27:17-19).
// An ant's-eye view of the valley of the ants on a bright morning. One ant
// stands on a pebble with her front legs raised, calling the others home,
// while the ants march into their anthill. Far away, only the banners of
// Sulayman's army and a little dust cloud rise behind the hills, with the
// birds of his army above them. No soldiers are drawn.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, farBird, eye, T, r1,
} from '../lib.js';

const ANT = { body: '#B9624E', dark: '#8F4437', light: '#DE9277', leg: '#7E3A30' };
const line = (c, w, a = {}) => ({ fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a });
const pl = (pts) => 'M' + pts.map((p) => p.map(r1).join(',')).join(' L');

// ---------------------------------------------------------------- ants
// A marching ant seen from the side, facing right. (x, y) = feet.
// s = 1 is about 110 px long.
function ant(x, y, { s = 1, flip = false, step = 0, carry = '' } = {}) {
  const k = step ? 1 : -1;
  const legs = (dx, c, kk) =>
    [
      [[14 + dx, -27], [27 + dx, -20], [33 + dx + kk * 5, 0]],
      [[6 + dx, -25], [9 + dx, -14], [5 + dx - kk * 5, 0]],
      [[-2 + dx, -27], [-15 + dx, -19], [-24 + dx + kk * 5, 0]],
    ].map((pts) => path(pl(pts), line(c, 4.4))).join('');
  const P = [];
  P.push(legs(6, ANT.dark, -k));
  P.push(path(pl([[26, -58], [24, -77], [38, -90]]), line(ANT.dark, 3.4)), circle(39, -91, 3.4, { fill: ANT.dark }));
  // gaster with shade and shine
  P.push(ellipse(-37, -31, 27, 20, { fill: ANT.body, transform: 'rotate(-14 -37 -31)' }));
  P.push(path('M-62,-26 C-52,-10 -26,-8 -12,-22 C-18,-12 -46,-4 -62,-26Z', { fill: ANT.dark, opacity: 0.55 }));
  P.push(ellipse(-45, -42, 11, 5.5, { fill: ANT.light, opacity: 0.85, transform: 'rotate(-14 -45 -42)' }));
  // waist and thorax
  P.push(circle(-9, -29, 6.5, { fill: ANT.dark }));
  P.push(ellipse(6, -31, 15, 10.5, { fill: ANT.body, transform: 'rotate(-18 6 -31)' }));
  P.push(ellipse(2, -37, 6, 3.2, { fill: ANT.light, opacity: 0.75 }));
  P.push(legs(0, ANT.leg, k));
  // head
  P.push(circle(31, -43, 19, { fill: ANT.body }));
  P.push(path('M13,-38 C18,-26 38,-21 49,-33 C46,-24 26,-20 13,-38Z', { fill: ANT.dark, opacity: 0.45 }));
  P.push(ellipse(23, -54, 7, 3.6, { fill: ANT.light, opacity: 0.8, transform: 'rotate(-20 23 -54)' }));
  P.push(path(pl([[33, -60], [38, -79], [55, -86]]), line(ANT.leg, 3.6)), circle(56, -86, 3.8, { fill: ANT.leg }));
  P.push(eye(38, -47, 5));
  P.push(ellipse(41, -35, 5, 3, { fill: C.cheek, opacity: 0.75 }));
  P.push(path('M45,-32 Q49,-29 52,-33', line(ANT.dark, 2)));
  P.push(carry);
  return g({ transform: T(x, y, s, 0, flip) }, P);
}

// Things the ants carry home, drawn in the ant's own coordinates.
const grain = () =>
  ellipse(56, -60, 10, 6.5, { fill: C.gold2, transform: 'rotate(-30 56 -60)' }) +
  path('M48,-56 Q56,-62 64,-66', line(C.gold4, 1.6, { opacity: 0.6 })) +
  ellipse(53, -63, 3.5, 2, { fill: C.gold0, opacity: 0.9, transform: 'rotate(-30 53 -63)' });
const crumb = () => path(blob([[46, -62], [58, -72], [70, -66], [68, -54], [54, -52]]), { fill: C.wool1 }) + circle(56, -63, 2, { fill: C.sand2 }) + circle(63, -59, 1.6, { fill: C.sand2 });
const leafCarry = () =>
  path('M50,-46 Q52,-70 40,-92', line(C.leaf4, 3)) +
  path('M40,-92 C6,-96 -40,-118 -52,-150 C-14,-170 34,-150 40,-92Z', { fill: C.leaf2 }) +
  path('M40,-92 C30,-128 -4,-152 -52,-150 C-14,-170 34,-150 40,-92Z', { fill: C.leaf3 }) +
  path('M40,-92 Q0,-122 -50,-149', line(C.leaf1, 2.2, { opacity: 0.9 })) +
  path('M20,-104 L4,-122 M2,-114 L-14,-134 M-18,-124 L-30,-142', line(C.leaf1, 1.4, { opacity: 0.7 }));

// The little ant who calls everyone home: standing up on her back legs on
// the pebble, front legs raised, mouth open. Three-quarter view, turned to
// the right toward the ants still coming. (x, y) = feet on the pebble.
function callingAnt(x, y, s = 1) {
  const P = [];
  // far legs (standing) and the far raised leg
  P.push(path(pl([[-8, -100], [-40, -66], [-46, 0]]), line(ANT.dark, 8)));
  P.push(path(pl([[-4, -92], [-10, -50], [-22, 0]]), line(ANT.dark, 8)));
  P.push(path(pl([[-8, -140], [-62, -158], [-74, -226]]), line(ANT.dark, 8)), circle(-74, -228, 6.5, { fill: ANT.dark }));
  // gaster resting on the pebble behind her
  P.push(ellipse(-70, -36, 54, 36, { fill: ANT.body, transform: 'rotate(-16 -70 -36)' }));
  P.push(path('M-122,-22 C-110,4 -56,8 -22,-12 C-36,6 -94,12 -122,-22Z', { fill: ANT.dark, opacity: 0.5 }));
  P.push(ellipse(-86, -56, 20, 9, { fill: ANT.light, opacity: 0.85, transform: 'rotate(-16 -86 -56)' }));
  // waist, thorax
  P.push(circle(-22, -62, 11, { fill: ANT.dark }));
  P.push(ellipse(-2, -108, 23, 40, { fill: ANT.body, transform: 'rotate(16 -2 -108)' }));
  P.push(ellipse(-10, -122, 7, 15, { fill: ANT.light, opacity: 0.7, transform: 'rotate(16 -10 -122)' }));
  // near standing legs
  P.push(path(pl([[8, -94], [42, -60], [50, 0]]), line(ANT.leg, 8)));
  P.push(path(pl([[2, -84], [16, -44], [14, 0]]), line(ANT.leg, 8)));
  // head
  P.push(circle(14, -192, 54, { fill: ANT.body }));
  P.push(path('M-38,-178 C-32,-142 48,-124 68,-172 C64,-132 -8,-120 -38,-178Z', { fill: ANT.dark, opacity: 0.4 }));
  P.push(ellipse(-8, -224, 18, 10, { fill: ANT.light, opacity: 0.8, transform: 'rotate(-28 -8 -224)' }));
  // antennae, up and alert
  P.push(path(pl([[0, -240], [-16, -272], [-46, -288]]), line(ANT.dark, 6)), circle(-48, -289, 7, { fill: ANT.dark }));
  P.push(path(pl([[30, -240], [40, -276], [70, -292]]), line(ANT.leg, 6)), circle(72, -293, 7, { fill: ANT.leg }));
  // face
  P.push(eye(-2, -196, 10.5), eye(40, -194, 10.5));
  P.push(ellipse(-18, -172, 9, 5.5, { fill: C.cheek, opacity: 0.8 }), ellipse(56, -170, 9, 5.5, { fill: C.cheek, opacity: 0.8 }));
  P.push(ellipse(20, -166, 11, 10, { fill: '#5A2A2E' }), ellipse(20, -161, 6.5, 4, { fill: C.rose2 }));
  // near raised front leg, waving the others in
  P.push(path(pl([[18, -140], [70, -158], [84, -230]]), line(ANT.leg, 8)), circle(84, -232, 6.5, { fill: ANT.leg }));
  // "come home!" call lines
  for (const [r, op] of [[84, 0.85], [106, 0.65], [128, 0.45]]) {
    const a0 = -0.62;
    const a1 = -0.02;
    P.push(path(`M${r1(20 + Math.cos(a0) * r)},${r1(-166 + Math.sin(a0) * r)} A${r},${r} 0 0 1 ${r1(20 + Math.cos(a1) * r)},${r1(-166 + Math.sin(a1) * r)}`, line(C.coral3, 6, { opacity: op })));
  }
  return g({ transform: T(x, y, s) }, P);
}

// ---------------------------------------------------------------- plants
// A tapering grass blade from (x, y) rising h, bending by `lean`.
function blade(x, y, h, lean, w, fill, a = {}) {
  const tx = x + lean;
  const ty = y - h;
  return path(`M${r1(x - w)},${r1(y)} Q${r1(x - w * 0.6 + lean * 0.15)},${r1(y - h * 0.62)} ${r1(tx)},${r1(ty)} Q${r1(x + w * 0.5 + lean * 0.3)},${r1(y - h * 0.55)} ${r1(x + w)},${r1(y)}Z`, { fill, ...a });
}
// A blade with a lit edge and a fine middle vein.
function bigBlade(x, y, h, lean, w, fill, light) {
  const tx = x + lean;
  const ty = y - h;
  return (
    blade(x, y, h, lean, w, fill) +
    path(`M${r1(x - w)},${r1(y)} Q${r1(x - w * 0.6 + lean * 0.15)},${r1(y - h * 0.62)} ${r1(tx)},${r1(ty)} Q${r1(x - w * 0.1 + lean * 0.18)},${r1(y - h * 0.58)} ${r1(x - w * 0.15)},${r1(y)}Z`, { fill: light, opacity: 0.55 })
  );
}
// A poppy turned toward us. (x, y) = centre of the flower.
function poppy(x, y, r, { stemTo, rot = 0, petal = C.coral2, dark = C.coral3, light = C.coral1 } = {}) {
  let s = '';
  if (stemTo) s += path(`M${r1(stemTo[0])},${r1(stemTo[1])} Q${r1(stemTo[0] + (x - stemTo[0]) * 0.1)},${r1(y + (stemTo[1] - y) * 0.4)} ${r1(x)},${r1(y + r * 0.3)}`, line(C.leaf4, r * 0.15));
  let f = '';
  const pet = (a, rr, fill) => {
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const px = c * rr * 0.55;
    const py = sn * rr * 0.55;
    return ellipse(px, py, rr * 0.62, rr * 0.5, { fill, transform: `rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})` });
  };
  for (let i = 0; i < 5; i++) f += pet((Math.PI * 2 * i) / 5 + 0.3, r, dark);
  for (let i = 0; i < 5; i++) f += pet((Math.PI * 2 * i) / 5 + 0.3 + Math.PI / 5, r * 0.92, petal);
  f += path(`M${r1(-r * 0.75)},${r1(-r * 0.35)} Q${r1(-r * 0.55)},${r1(-r * 0.8)} ${r1(-r * 0.1)},${r1(-r * 0.86)}`, line(light, r * 0.08, { opacity: 0.8 }));
  f += circle(0, 0, r * 0.3, { fill: '#3B2A3E' });
  for (let i = 0; i < 14; i++) {
    const a = (Math.PI * 2 * i) / 14;
    f += circle(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3, r * 0.05, { fill: '#2B2140' });
  }
  f += circle(0, 0, r * 0.15, { fill: C.leaf3 }) + circle(-r * 0.04, -r * 0.05, r * 0.06, { fill: C.leaf1 });
  s += g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(1 0.86)` }, f);
  return s;
}
// A daisy tilted toward us. (x, y) = centre.
function daisy(x, y, r, { tilt = 0.55, rot = 0, n = 13, petal = C.white, shade = C.wool2, center = C.gold2 } = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    const px = Math.cos(a) * r * 0.62;
    const py = Math.sin(a) * r * 0.62 * tilt;
    const deg = (Math.atan2(Math.sin(a) * tilt, Math.cos(a)) * 180) / Math.PI;
    s += ellipse(px, py, r * 0.5, r * 0.17, { fill: Math.sin(a) > 0.2 ? petal : shade, transform: `rotate(${r1(deg)} ${r1(px)} ${r1(py)})` });
  }
  s += ellipse(0, 0, r * 0.3, r * 0.3 * tilt + r * 0.06, { fill: center });
  s += ellipse(-r * 0.08, -r * 0.06, r * 0.14, r * 0.08, { fill: C.gold0, opacity: 0.8 });
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot})` }, s);
}
// Three-leaf clover. (x, y) = where the leaflets meet.
function clover(x, y, r, fill = C.leaf3, dark = C.leaf4, rot = 0) {
  let s = path(`M0,0 Q${r1(r * 0.2)},${r1(r * 1.2)} ${r1(-r * 0.1)},${r1(r * 2.2)}`, line(dark, r * 0.14));
  for (const a of [-90, 30, 150]) {
    s += g({ transform: `rotate(${a})` },
      path(`M0,0 C${r1(r * 0.2)},${r1(-r * 0.2)} ${r1(r * 0.9)},${r1(-r * 0.75)} ${r1(r * 0.95)},${r1(-r * 0.15)} C${r1(r * 1.25)},${r1(r * 0.2)} ${r1(r * 0.6)},${r1(r * 0.6)} 0,0Z`, { fill }),
      path(`M0,0 L${r1(r * 0.85)},${r1(-r * 0.1)}`, line(dark, r * 0.06, { opacity: 0.5 })));
  }
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot})` }, s);
}
// A tiny ladybird, facing left. (x, y) = centre.
function ladybird(x, y, s = 1) {
  return g({ transform: T(x, y, s) },
    ellipse(2, 6, 24, 6, { fill: C.ink, opacity: 0.14 }),
    path('M-14,4 L-10,10 M0,6 L2,12 M14,5 L18,11', line(C.ink2, 2)),
    circle(-20, -6, 11, { fill: C.ink2 }),
    path('M-14,5 A20,18 0 1 1 24,5Z', { fill: C.coral3 }),
    path('M5,-14 L5,5', line(C.coral4, 1.6)),
    circle(-3, -6, 3.8, { fill: C.ink2 }), circle(14, -4, 3.8, { fill: C.ink2 }), circle(5, -1, 2.4, { fill: C.coral4 }),
    ellipse(-1, -11, 7, 3, { fill: C.white, opacity: 0.55, transform: 'rotate(-20 -1 -11)' }),
    circle(-24, -8, 3.4, { fill: C.white }), circle(-25, -8, 1.9, { fill: C.ink }), circle(-24.4, -8.7, 0.7, { fill: C.white }),
    ellipse(-23, -1, 3, 1.8, { fill: C.cheek, opacity: 0.8 }),
  );
}
// A far-away banner on a pole, fluttering to the right. (x, y) = pole foot.
function banner(x, y, h, color, pole) {
  const t = y - h;
  return (
    path(`M${r1(x)},${r1(y)} L${r1(x)},${r1(t)}`, line(pole, 2.6)) +
    path(`M${r1(x)},${r1(t + 1)} Q${r1(x + 12)},${r1(t - 2)} ${r1(x + 26)},${r1(t + 5)} L${r1(x + 18)},${r1(t + 10)} L${r1(x + 26)},${r1(t + 16)} Q${r1(x + 12)},${r1(t + 13)} ${r1(x)},${r1(t + 17)}Z`, { fill: color }) +
    circle(x, t - 2, 2.6, { fill: C.gold2 })
  );
}

export default function render() {
  const id = ids('s26');
  const R = rng(26);
  const defs = [
    linear(id('sky'), [[0, '#8CCBE4'], [0.42, '#BCE3EE'], [0.78, '#E6F5EF'], [1, '#FFF1D4']]),
    linear(id('ground'), [[0, '#DCC79A'], [0.3, '#EBCB90'], [1, '#D8A96A']]),
    linear(id('meadow'), [[0, '#BFDDA6'], [1, '#9FCB86']]),
    radial(id('mound'), [[0, '#F6DDAA'], [0.55, '#E8BF7E'], [1, '#C9955A']], { cx: 0.36, cy: 0.3, r: 0.75 }),
    radial(id('hole'), [[0, '#3E2420'], [0.7, '#5A3519'], [1, '#7D4D26']], { cx: 0.5, cy: 0.6, r: 0.6 }),
    radial(id('pebble'), [[0, '#F3EDE4'], [0.5, '#D9D0C3'], [1, '#B3A898']], { cx: 0.35, cy: 0.28, r: 0.8 }),
    glowDef(id('sunGlow'), '#FFF6D2', 0.9),
    glowDef(id('warm'), '#FFF4D6', 0.6),
    radial(id('dust'), [[0, '#F5E2BD', 0.95], [1, '#F5E2BD', 0]], { cx: 0.5, cy: 0.5, r: 0.5 }),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');
  const hazy = (c, t = 0.55) => mix(c, '#D3EAEC', t);
  let body = '';

  // ------------------------------------------------ sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(285, 140, 54, { fill: '#FFE9A6', core: '#FFF9E2', glowId: id('sunGlow') });
  body += cloud(560, 200, 210, { fill: C.white, shade: '#D8EEF3', seed: 4, opacity: 0.95 });
  body += cloud(800, 96, 140, { fill: C.white, shade: '#D8EEF3', seed: 8, opacity: 0.9 });
  body += cloud(380, 340, 110, { fill: C.white, shade: '#D8EEF3', seed: 12, opacity: 0.75 });
  body += sparkle(680, 70, 9, C.white, { opacity: 0.9 }) + sparkle(430, 80, 7, C.white, { opacity: 0.8 });

  // ------------------------------------------------ far hills, banners and dust
  body += path(ridge([[-20, 600], [160, 580], [360, 596], [560, 574], [760, 586], [1020, 570]]), { fill: hazy(C.leaf2, 0.62) });
  // the birds of Sulayman's army, high over the banners
  for (const [bx, by, bs] of [[772, 440, 1.1], [812, 424, 0.9], [856, 446, 1], [892, 428, 0.8], [826, 470, 0.75], [742, 470, 0.7]]) body += farBird(bx, by, bs, hazy(C.ink2, 0.3), 0.8);
  // a little dust cloud rising behind the nearer hill
  body += ellipse(840, 580, 190, 70, { fill: `url(#${id('dust')})` });
  for (const [dx, dy, dr] of [[724, 604, 26], [760, 590, 34], [804, 576, 42], [856, 566, 46], [904, 578, 38], [940, 596, 28], [788, 606, 30], [884, 604, 30]]) {
    body += circle(dx + 3, dy + 4, dr, { fill: '#E9CFA4', opacity: 0.7 }) + circle(dx, dy, dr, { fill: '#F7E7C8', opacity: 0.9 });
  }
  const flagCols = [C.coral2, C.gold2, C.plum2, C.rose2, C.sky0, C.coral2, C.gold3, C.leaf2];
  for (let i = 0; i < 8; i++) {
    const bx = 742 + i * 25 + R.range(-3, 3);
    body += banner(bx, 620, 70 + Math.sin(i * 1.3) * 10 + R.range(-4, 4), mix(flagCols[i], '#F3E7DA', 0.12), mix(C.wood3, '#E8DCCB', 0.25));
  }
  body += path(ridge([[-20, 626], [140, 612], [330, 622], [520, 606], [700, 618], [860, 612], [1020, 622]]), { fill: hazy(C.leaf3, 0.5) });

  // ------------------------------------------------ meadow and mid-ground grass
  body += path(ridge([[-20, 650], [250, 642], [520, 648], [780, 640], [1020, 646]]), { fill: `url(#${id('meadow')})` });
  for (let i = 0; i < 26; i++) {
    const bx = -10 + i * 41 + R.range(-12, 12);
    if (bx > 700 && bx < 960) continue; // keep the army's banners clear
    body += blade(bx, 700, R.range(110, 230), R.range(-40, 40), R.range(7, 11), R() < 0.5 ? hazy(C.leaf3, 0.42) : hazy(C.leaf2, 0.4));
  }
  for (const [bx, bh, bl] of [[720, 90, -16], [760, 70, 10], [940, 96, 14], [980, 120, -10], [860, 60, 8]]) body += blade(bx, 700, bh, bl, 7, hazy(C.leaf3, 0.42));
  for (const [fx, fy, fr, fc] of [[520, 520, 16, C.rose1], [210, 546, 14, C.white], [460, 566, 11, C.gold1], [990, 520, 15, C.rose1]]) {
    body += path(`M${fx},${fy + 6} Q${fx - 6},${fy + 80} ${fx + 2},700`, line(hazy(C.leaf3, 0.42), 4));
    body += daisy(fx, fy, fr, { petal: hazy(fc, 0.3), shade: hazy(fc, 0.4), center: hazy(C.gold2, 0.3), tilt: 0.6 });
  }

  // ------------------------------------------------ the ground (ant scale)
  body += path(ridge([[-20, 690], [200, 682], [480, 692], [760, 680], [1020, 690]]), { fill: `url(#${id('ground')})` });
  for (let i = 0; i < 80; i++) {
    const px = R() * 1000;
    const py = 700 + R() ** 0.8 * 300;
    const pr = 1.5 + ((py - 690) / 300) * R.range(2, 5);
    body += ellipse(px, py, pr * 1.3, pr, { fill: R() < 0.5 ? '#C99B62' : '#F4E1B6', opacity: 0.7 });
  }

  // the ants' trail: a lighter, well-trodden path from the front right to the anthill
  const trail = [[1030, 936], [900, 936], [760, 922], [620, 896], [510, 860], [424, 818], [366, 772]];
  const tw = [70, 66, 58, 48, 38, 28, 18];
  const norm = (i) => {
    const p0 = trail[Math.max(0, i - 1)];
    const p1 = trail[Math.min(trail.length - 1, i + 1)];
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    return [-(p1[1] - p0[1]) / L, (p1[0] - p0[0]) / L];
  };
  const edgeA = trail.map((p, i) => [p[0] + norm(i)[0] * tw[i] * 0.5, p[1] + norm(i)[1] * tw[i] * 0.5]);
  const edgeB = trail.map((p, i) => [p[0] - norm(i)[0] * tw[i] * 0.5, p[1] - norm(i)[1] * tw[i] * 0.5]).reverse();
  body += path(`${smooth(edgeA)} L${edgeB[0].map(r1).join(',')} ${smooth(edgeB).replace(/^M[^C]*/, '')}Z`, { fill: '#F8E8C2', opacity: 0.8 });
  for (let i = 0; i < 26; i++) {
    const t = R();
    const k = Math.min(trail.length - 2, Math.floor(t * (trail.length - 1)));
    const f = t * (trail.length - 1) - k;
    const side = R() < 0.5 ? 1 : -1;
    const w = tw[k] * (1 - f) + tw[k + 1] * f;
    const n = norm(k);
    const px = trail[k][0] * (1 - f) + trail[k + 1][0] * f + n[0] * side * w * 0.55;
    const py = trail[k][1] * (1 - f) + trail[k + 1][1] * f + n[1] * side * w * 0.55;
    const pr = (2 + w * 0.06) * R.range(0.7, 1.3);
    body += ellipse(px, py, pr * 1.4, pr, { fill: R() < 0.5 ? '#CBB79E' : '#E4D6C2' });
  }

  // little tufts and flowers on the open ground, and two far ants coming home
  for (const [gx, gy, gh, sd] of [[800, 742, 40, 1], [918, 772, 52, 2], [870, 700, 26, 3], [560, 706, 24, 4], [700, 700, 22, 5]]) {
    const R2 = rng(sd);
    for (let k = 0; k < 5; k++) body += blade(gx + (k - 2) * 6, gy, gh * R2.range(0.6, 1), (k - 2) * 7 + R2.range(-4, 4), 3.2, k % 2 ? C.leaf3 : C.leaf4);
  }
  body += daisy(812, 712, 9, { tilt: 0.6 }) + daisy(930, 738, 10, { tilt: 0.6, petal: C.rose0, shade: C.rose1 });
  body += ant(860, 724, { s: 0.26, flip: true, step: 1, carry: grain() }) + ant(930, 716, { s: 0.24, flip: true });
  // ------------------------------------------------ the anthill
  const mound = [[60, 812], [130, 750], [205, 652], [282, 590], [338, 584], [404, 626], [478, 716], [552, 812]];
  body += ellipse(310, 812, 270, 22, { fill: C.ink, opacity: 0.1 });
  body += path(blob([...mound, [310, 826]], 1), { fill: `url(#${id('mound')})` });
  body += path('M392,618 C432,650 470,700 504,760 C526,790 544,806 552,812 L470,820 C462,760 440,690 392,618Z', { fill: '#B98249', opacity: 0.35 });
  for (let i = 0; i < 110; i++) {
    const a = R() * Math.PI;
    const d = Math.sqrt(R());
    const gx = 308 + Math.cos(a) * 232 * d;
    const gy = 812 - Math.sin(a) * 215 * d;
    if (gy > 806) continue;
    if (((gx - 318) / 64) ** 2 + ((gy - 726) / 50) ** 2 < 1) continue;
    body += circle(gx, gy, R.range(2, 4.6), { fill: R() < 0.55 ? '#C48E55' : '#FBE7BE', opacity: R.range(0.5, 0.9) });
  }
  body += ellipse(318, 730, 58, 44, { fill: '#F6DFAE' });
  body += ellipse(318, 734, 46, 34, { fill: `url(#${id('hole')})` });
  body += path('M274,728 C284,704 352,700 364,730 C350,716 290,716 274,728Z', { fill: '#4A2B1E', opacity: 0.5 });
  // two little ants coming down the left slope
  body += ant(150, 774, { s: 0.38, step: 0 });
  body += ant(214, 744, { s: 0.36, step: 1, carry: crumb() });

  // ------------------------------------------------ the pebble and the calling ant
  body += circle(612, 540, 260, { fill: `url(#${id('warm')})` });
  body += ellipse(612, 834, 150, 18, { fill: C.ink, opacity: 0.14 });
  body += path(blob([[478, 828], [484, 774], [534, 726], [616, 710], [700, 724], [746, 772], [750, 828], [614, 840]]), { fill: `url(#${id('pebble')})` });
  body += path('M664,724 C712,738 750,778 750,828 L684,836 C716,802 708,758 664,724Z', { fill: '#A99C8B', opacity: 0.35 });
  body += ellipse(546, 752, 26, 11, { fill: C.white, opacity: 0.6, transform: 'rotate(-24 546 752)' });
  body += callingAnt(624, 720, 1.1);

  // ------------------------------------------------ the marching line, hurrying home
  const along = (t) => {
    const k = Math.min(trail.length - 2, Math.floor(t * (trail.length - 1)));
    const f = t * (trail.length - 1) - k;
    return [trail[k][0] * (1 - f) + trail[k + 1][0] * f, trail[k][1] * (1 - f) + trail[k + 1][1] * f];
  };
  const marchers = [
    [0.17, 0.86, 1, leafCarry()],
    [0.33, 0.78, 0, grain()],
    [0.48, 0.7, 1, ''],
    [0.62, 0.6, 0, crumb()],
    [0.75, 0.52, 1, grain()],
    [0.87, 0.45, 0, ''],
    [0.96, 0.38, 1, grain()],
  ];
  for (const [t, ms, st, carry] of marchers) {
    const [mx, my] = along(t);
    body += ellipse(mx - 6 * ms, my + 2, 58 * ms, 7 * ms, { fill: C.ink, opacity: 0.1 }) + ant(mx, my + 4 * ms, { s: ms, flip: true, step: st, carry });
  }

  // ------------------------------------------------ giant foreground plants
  // left: tall blades and a poppy towering overhead
  body += bigBlade(20, 1010, 800, 110, 26, C.leaf4, C.leaf3);
  body += poppy(118, 318, 62, { stemTo: [60, 1010], rot: -12 });
  body += bigBlade(-20, 1010, 560, 70, 30, C.leaf5, C.leaf4);
  body += bigBlade(70, 1010, 400, 130, 24, C.leaf3, C.leaf2);
  body += bigBlade(130, 1010, 240, 100, 18, C.leaf4, C.leaf3);
  // right: daisies on tall stems leaning in, and blades along the edge
  body += path('M1000,1010 Q985,620 902,200', line(C.leaf4, 9));
  body += path('M1020,1010 Q1012,760 962,452', line(C.leaf3, 7));
  body += bigBlade(1020, 1010, 700, -70, 24, C.leaf5, C.leaf4);
  body += daisy(900, 182, 74, { rot: -14, tilt: 0.5 });
  body += daisy(962, 436, 44, { rot: 10, tilt: 0.55 });
  body += bigBlade(990, 1010, 330, -40, 20, C.leaf4, C.leaf3);
  // dew drops on the blades
  for (const [dx, dy, dr] of [[58, 620, 7], [112, 770, 5], [985, 660, 6]]) body += circle(dx, dy, dr, { fill: C.white, opacity: 0.75 }) + circle(dx - dr * 0.3, dy - dr * 0.3, dr * 0.35, { fill: C.white });
  // bottom edge: clover, pebbles and a ladybird
  body += clover(220, 968, 34, C.leaf3, C.leaf4, -10) + clover(300, 992, 26, C.leaf2, C.leaf4, 20);
  body += clover(800, 996, 28, C.leaf3, C.leaf4, 15);
  body += ladybird(262, 944, 1.15);
  body += ellipse(440, 978, 26, 13, { fill: '#CDBFAD' }) + ellipse(434, 973, 10, 4, { fill: C.white, opacity: 0.5 });
  body += ellipse(640, 992, 34, 15, { fill: '#C9BBA8' }) + ellipse(632, 986, 12, 4.5, { fill: C.white, opacity: 0.5 });

  // gentle morning sparkles
  for (const [sx, sy, ss] of [[520, 420, 10], [470, 520, 7], [780, 380, 8], [600, 330, 6]]) body += sparkle(sx, sy, ss, '#FFF8E2', { opacity: 0.9 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
