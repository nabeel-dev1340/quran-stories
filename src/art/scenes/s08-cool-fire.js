// The fire that became cool (Quran 21:68-70, 37:97-98).
// "O fire, be coolness and safety." A huge ring of flames drawn in cool
// blues, teals and mint, glowing gently in the night; inside it a calm
// little garden of grass, flowers and butterflies around soft empty light.
// No people and no idols.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge,
  sparkle, starField, crescent, grass, flower, r1,
} from '../lib.js';

// One flame tongue with three nested layers. (x, y) = base centre.
// Variant 'a' has a little side tongue, 'b' is a plump teardrop whose tip
// curls over; flip mirrors it, lean tilts it.
function flame(x, y, h, w, { outer, mid, inner, lean = 0, flip = 1, variant = 'a', op = 1 } = {}) {
  const shape = (hh, ww, dy = 0) => {
    const P = (px, py) => `${r1(x + flip * px * ww + lean * -py * hh)},${r1(y + dy + py * hh)}`;
    if (variant === 'a') {
      return `M${P(0, 0)} C${P(-0.56, 0)} ${P(-0.62, -0.3)} ${P(-0.44, -0.5)} C${P(-0.36, -0.58)} ${P(-0.4, -0.7)} ${P(-0.5, -0.8)} C${P(-0.24, -0.76)} ${P(-0.12, -0.66)} ${P(-0.1, -0.58)} C${P(-0.12, -0.74)} ${P(0.02, -0.86)} ${P(-0.08, -1)} C${P(0.3, -0.86)} ${P(0.52, -0.62)} ${P(0.5, -0.36)} C${P(0.48, -0.1)} ${P(0.3, 0)} ${P(0, 0)}Z`;
    }
    return `M${P(0, 0)} C${P(-0.6, 0)} ${P(-0.64, -0.42)} ${P(-0.3, -0.62)} C${P(-0.1, -0.74)} ${P(-0.12, -0.9)} ${P(-0.26, -1)} C${P(0.2, -0.95)} ${P(0.5, -0.7)} ${P(0.52, -0.4)} C${P(0.54, -0.12)} ${P(0.32, 0)} ${P(0, 0)}Z`;
  };
  return g({ opacity: op },
    path(shape(h, w), { fill: outer }),
    path(shape(h * 0.68, w * 0.66, -h * 0.02), { fill: mid }),
    path(shape(h * 0.4, w * 0.4, -h * 0.04), { fill: inner }),
  );
}

// A short log lying along the ring, end-grain toward the viewer.
function log(x, y, len, r, ang, sprout = false) {
  const parts = [
    rect(-len / 2, -r, len, r * 2, { rx: r, fill: C.wood2 }),
    rect(-len / 2, -r, len, r * 0.8, { rx: r * 0.4, fill: C.wood1, opacity: 0.8 }),
    path(`M${r1(-len * 0.3)},${r1(r * 0.25)} L${r1(len * 0.1)},${r1(r * 0.25)} M${r1(-len * 0.05)},${r1(-r * 0.25)} L${r1(len * 0.3)},${r1(-r * 0.25)}`, { stroke: C.wood3, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.5 }),
    ellipse(len / 2 - r * 0.3, 0, r * 0.7, r, { fill: C.wood0 }),
    ellipse(len / 2 - r * 0.3, 0, r * 0.42, r * 0.6, { fill: 'none', stroke: C.wood1, 'stroke-width': 2 }),
    circle(len / 2 - r * 0.3, 0, r * 0.12, { fill: C.wood1 }),
    rect(-len / 2 + r * 0.5, -r, len - r * 1.6, r * 0.45, { rx: r * 0.22, fill: '#9BE6E0', opacity: 0.35 }),
  ];
  if (sprout) {
    parts.push(path(`M${r1(-len * 0.1)},${r1(-r)} q2,-10 -3,-18`, { fill: 'none', stroke: C.leaf3, 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
    parts.push(ellipse(-len * 0.1 - 9, -r - 16, 7, 4, { fill: C.leaf2, transform: `rotate(-30 ${r1(-len * 0.1 - 9)} ${r1(-r - 16)})` }));
    parts.push(ellipse(-len * 0.1 + 4, -r - 12, 6, 3.5, { fill: C.leaf1, transform: `rotate(30 ${r1(-len * 0.1 + 4)} ${r1(-r - 12)})` }));
  }
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)})` }, parts);
}

// Cute butterfly, wings open. (x, y) = body centre.
function butterfly(x, y, { s = 1, wing = C.rose1, wing2 = C.rose2, dot = C.cream, rot = 0 } = {}) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${s})` },
    ellipse(-13, -9, 13, 11, { fill: wing, transform: 'rotate(-25 -13 -9)' }),
    ellipse(13, -9, 13, 11, { fill: wing, transform: 'rotate(25 13 -9)' }),
    ellipse(-10, 8, 9, 8, { fill: wing2, transform: 'rotate(20 -10 8)' }),
    ellipse(10, 8, 9, 8, { fill: wing2, transform: 'rotate(-20 10 8)' }),
    circle(-14, -10, 3.4, { fill: dot, opacity: 0.9 }),
    circle(14, -10, 3.4, { fill: dot, opacity: 0.9 }),
    ellipse(0, 0, 3.2, 12, { fill: C.ink2 }),
    path('M-1,-11 Q-5,-20 -9,-22 M1,-11 Q5,-20 9,-22', { fill: 'none', stroke: C.ink2, 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
    circle(-9, -22, 1.8, { fill: C.ink2 }),
    circle(9, -22, 1.8, { fill: C.ink2 }),
  );
}

// A rounded night boulder with a cool rim of firelight on the side that
// faces the ring (side = +1 when the fire is to its right).
function boulder(x, y, w, h, side = 1) {
  const P = (px, py) => `${r1(x + side * px * w)},${r1(y - py * h)}`;
  const body = `M${P(-0.5, 0)} C${P(-0.52, 0.5)} ${P(-0.36, 0.86)} ${P(-0.12, 0.92)} C${P(0.0, 0.96)} ${P(0.08, 1.02)} ${P(0.18, 0.98)} C${P(0.4, 0.9)} ${P(0.52, 0.6)} ${P(0.5, 0)}Z`;
  const shadeSide = `M${P(-0.5, 0)} C${P(-0.52, 0.6)} ${P(-0.28, 1)} ${P(0.02, 1)} C${P(-0.16, 0.86)} ${P(-0.22, 0.4)} ${P(-0.08, 0)}Z`;
  const rim = `M${P(0.06, 0.99)} C${P(0.3, 0.98)} ${P(0.5, 0.66)} ${P(0.5, 0.25)} C${P(0.44, 0.6)} ${P(0.28, 0.9)} ${P(0.06, 0.99)}Z`;
  return path(body, { fill: '#364480' }) + path(shadeSide, { fill: '#232D5C', opacity: 0.8 }) + path(rim, { fill: '#8FE3E0', opacity: 0.5 });
}

// Small tulip-like bud flower on a stem. (x, y) = base of stem.
function tulip(x, y, h, fill, dark) {
  return (
    path(`M${r1(x)},${r1(y)} Q${r1(x - 3)},${r1(y - h * 0.5)} ${r1(x)},${r1(y - h)}`, { fill: 'none', stroke: C.leaf4, 'stroke-width': 3, 'stroke-linecap': 'round' }) +
    ellipse(x - 5, y - h * 0.4, 6, 3, { fill: C.leaf3, transform: `rotate(-35 ${r1(x - 5)} ${r1(y - h * 0.4)})` }) +
    path(`M${r1(x - 9)},${r1(y - h - 2)} C${r1(x - 10)},${r1(y - h - 18)} ${r1(x - 4)},${r1(y - h - 20)} ${r1(x)},${r1(y - h - 12)} C${r1(x + 4)},${r1(y - h - 20)} ${r1(x + 10)},${r1(y - h - 18)} ${r1(x + 9)},${r1(y - h - 2)} C${r1(x + 6)},${r1(y - h + 6)} ${r1(x - 6)},${r1(y - h + 6)} ${r1(x - 9)},${r1(y - h - 2)}Z`, { fill }) +
    path(`M${r1(x)},${r1(y - h - 12)} C${r1(x + 4)},${r1(y - h - 20)} ${r1(x + 10)},${r1(y - h - 18)} ${r1(x + 9)},${r1(y - h - 2)} C${r1(x + 6)},${r1(y - h + 6)} ${r1(x + 1)},${r1(y - h + 4)} ${r1(x)},${r1(y - h + 3)}Z`, { fill: dark, opacity: 0.6 })
  );
}

export default function render() {
  const id = ids('s08');
  const R = rng(808);
  const CX = 500;
  const CY = 728;
  const RX = 388;
  const RY = 136;
  const defs = [
    linear(id('sky'), [[0, '#0F1A38'], [0.45, '#1B2D5C'], [0.75, '#2C4A80'], [1, '#3E6194']]),
    radial(id('coolSky'), [[0, '#8FE3E0', 0.5], [0.4, '#5BBFCB', 0.2], [1, '#5BBFCB', 0]]),
    linear(id('ground'), [[0, '#2A3A6E'], [1, '#1D2550']]),
    radial(id('coolGround'), [[0, '#7FD6D3', 0.55], [0.5, '#5BBFCB', 0.22], [1, '#5BBFCB', 0]]),
    radial(id('lawn'), [[0, '#B5E08F'], [0.55, '#8CCB7A'], [1, '#5FA96E']], { cx: 0.5, cy: 0.4, r: 0.6 }),
    glowDef(id('heart'), '#FFF6D8', 0.9),
    glowDef(id('flameGlow'), '#A8F0E8', 0.5),
    glowDef(id('moonGlow'), C.gold0, 0.35),
    vignetteDef(id('vig'), C.ink, 0.24),
  ].join('');

  let body = '';
  // ---- night sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += starField({ seed: 88, n: 80, area: [20, 20, 960, 520], twinkles: 12, avoid: [[CX, 560, 300], [140, 130, 80]] });
  body += circle(140, 130, 150, { fill: `url(#${id('moonGlow')})` });
  body += crescent(140, 130, 46, { fill: C.gold0, angle: -30 });
  body += ellipse(CX, 560, 560, 420, { fill: `url(#${id('coolSky')})` });

  // ---- far hills and the ground
  const far = (c) => mix(c, '#3E6194', 0.5);
  body += path(ridge([[-20, 600], [120, 560], [260, 585], [400, 570], [560, 590], [720, 556], [860, 580], [1020, 565]], 700), { fill: far('#24396E') });
  body += path(ridge([[-20, 625], [160, 605], [330, 618], [520, 600], [700, 615], [880, 598], [1020, 610]], 1000), { fill: `url(#${id('ground')})` });
  body += ellipse(CX, CY + 30, 640, 280, { fill: `url(#${id('coolGround')})` });

  // ---- logs around the far half of the ring
  const ringPt = (t, k = 1) => [CX + Math.cos(t) * RX * k, CY + Math.sin(t) * RY * k];
  for (let i = 0; i <= 12; i++) {
    const t = Math.PI + (Math.PI * i) / 12;
    const [lx, ly] = ringPt(t);
    body += log(lx, ly + 6, 70, 13, (Math.atan2(Math.cos(t) * RY, -Math.sin(t) * RX) * 180) / Math.PI + 90 * 0, false);
  }

  // ---- back flames (behind the garden): tall at the back, lower at the sides
  const flameSets = [];
  const palette = [
    { outer: '#5BBFCB', mid: '#97DCDD', inner: '#D3F1F0' },
    { outer: '#6FBAD8', mid: '#A9DCEE', inner: '#E2F5FA' },
    { outer: '#66C9B4', mid: '#A7E5CF', inner: '#E1F7EA' },
    { outer: '#4FA7C4', mid: '#8FD3E0', inner: '#D3F1F0' },
  ];
  const N = 28;
  for (let i = 0; i < N; i++) {
    const t = (Math.PI * 2 * (i + R.range(-0.2, 0.2))) / N;
    const back = Math.sin(t) < 0.15;
    const [fx, fy] = ringPt(t);
    const h = back ? 140 + 110 * Math.max(0, -Math.sin(t)) + R.range(-18, 22) : 74 + 26 * Math.abs(Math.cos(t)) + R.range(-8, 10);
    const w = back ? h * 0.5 + R.range(-6, 8) : h * 0.62;
    flameSets.push({ fx, fy, h, w, back, lean: Math.cos(t) * 0.1 + R.range(-0.04, 0.04), flip: i % 2 ? 1 : -1, variant: i % 3 === 1 ? 'b' : 'a', pal: palette[i % palette.length] });
  }
  // smaller flames tucked in between on the back arc
  for (let i = 0; i < 14; i++) {
    const t = Math.PI + (Math.PI * (i + 0.5)) / 14;
    const [fx, fy] = ringPt(t);
    const h = 96 + R.range(-12, 18);
    flameSets.push({ fx, fy: fy + 6, h, w: h * 0.6, back: true, lean: Math.cos(t) * 0.12, flip: i % 2 ? -1 : 1, variant: 'b', pal: palette[(i + 2) % palette.length], small: true });
  }
  const backFlames = flameSets.filter((f) => f.back).sort((a, b) => a.fy - b.fy || (a.small ? 1 : -1));
  body += circle(CX, CY - 120, 420, { fill: `url(#${id('flameGlow')})` });
  for (const f of backFlames) body += flame(f.fx, f.fy + 8, f.h, f.w, { ...f.pal, lean: f.lean, flip: f.flip, variant: f.variant, op: 0.97 });

  // ---- the garden inside the ring
  body += ellipse(CX, CY + 8, RX * 0.93, RY * 0.86, { fill: C.leaf4 });
  body += ellipse(CX, CY + 2, RX * 0.9, RY * 0.8, { fill: `url(#${id('lawn')})` });
  body += circle(CX, CY - 30, 230, { fill: `url(#${id('heart')})` });
  // soft bushes at the back of the garden
  for (const [bx, by, bw, sd] of [[300, 668, 90, 2], [700, 666, 96, 5], [395, 640, 70, 7], [615, 638, 74, 9]]) {
    const R2 = rng(sd);
    body += g({},
      circle(bx - bw * 0.25, by - bw * 0.12, bw * 0.26, { fill: C.leaf4 }),
      circle(bx + bw * 0.22, by - bw * 0.1, bw * 0.24, { fill: C.leaf4 }),
      circle(bx, by - bw * 0.28, bw * 0.3, { fill: C.leaf3 }),
      circle(bx - bw * 0.1, by - bw * 0.36, bw * 0.13, { fill: C.leaf2, opacity: 0.8 }),
    );
    for (let k = 0; k < 4; k++) body += circle(bx + R2.range(-bw * 0.35, bw * 0.35), by - bw * R2.range(0.1, 0.45), 4.5, { fill: k % 2 ? C.rose1 : C.cream });
  }
  // flowers scattered over the lawn
  const fcols = [[C.rose1, C.gold1], [C.gold1, C.coral2], [C.plum1, C.gold1], [C.cream, C.gold2], [C.coral1, C.gold1], [C.sky1, C.cream]];
  const spots = [];
  for (let i = 0; i < 34; i++) {
    const a = R() * Math.PI * 2;
    const d = Math.sqrt(R()) * 0.86;
    const x = CX + Math.cos(a) * RX * 0.86 * d;
    const y = CY + 8 + Math.sin(a) * RY * 0.7 * d;
    spots.push([x, y]);
  }
  spots.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of spots) {
    const [pc, cc] = R.pick(fcols);
    const k = 0.65 + ((y - (CY - 90)) / 180) * 0.5;
    body += grass(x + R.range(-10, 10), y + 8, { h: 24 * k, fill: R() < 0.5 ? C.leaf3 : C.leaf4, n: 3, seed: Math.floor(R() * 99) });
    body += flower(x, y, { r: 12 * k, fill: pc, center: cc, stemH: 12 * k, stem: C.leaf4, rot: R() * 60 });
  }
  for (const [tx, ty, th, f1, f2] of [[440, 704, 34, C.rose2, C.rose3], [585, 712, 30, C.gold2, C.gold3], [350, 716, 28, C.plum2, C.plum3], [660, 706, 32, C.coral2, C.coral3]]) body += tulip(tx, ty, th, f1, f2);
  // sparkles of mercy in the empty middle
  for (const [sx, sy, ss] of [[500, 610, 16], [455, 650, 9], [548, 640, 11], [500, 680, 7], [420, 600, 7], [585, 595, 8]]) body += sparkle(sx, sy, ss, '#FFF8E0');

  // ---- logs along the near half, then the low front flames
  for (let i = 1; i < 12; i++) {
    const t = (Math.PI * i) / 12;
    const [lx, ly] = ringPt(t);
    body += log(lx, ly + 10, 78, 15, (Math.cos(t) * 28), i === 3 || i === 8);
  }
  const frontFlames = flameSets.filter((f) => !f.back).sort((a, b) => a.fy - b.fy);
  for (const f of frontFlames) body += flame(f.fx, f.fy + 2, f.h, f.w, { ...f.pal, lean: f.lean, flip: f.flip, variant: f.variant, op: 0.92 });

  // cool embers drifting up like little snowflakes
  for (let i = 0; i < 22; i++) {
    const t = Math.PI + R() * Math.PI;
    const [ex, ey] = ringPt(t, R.range(0.85, 1.1));
    const up = R.range(160, 360);
    body += sparkle(ex + R.range(-20, 20), ey - up, R.range(4, 9), R() < 0.5 ? '#D3F1F0' : '#E1F7EA', { opacity: R.range(0.55, 0.95) });
  }

  // butterflies: inside the garden and even dancing by the flames
  body += butterfly(430, 566, { s: 1.45, wing: C.rose1, wing2: C.rose2, rot: -12 });
  body += butterfly(596, 520, { s: 1.3, wing: C.gold1, wing2: C.gold2, rot: 14 });
  body += butterfly(246, 462, { s: 1.1, wing: C.plum1, wing2: C.plum2, rot: -20 });
  body += butterfly(772, 440, { s: 1.15, wing: C.coral1, wing2: C.coral2, rot: 18 });

  // ---- foreground framing: dark rocks, grass and a few brave flowers
  body += boulder(60, 1012, 220, 128, 1);
  body += boulder(948, 1012, 230, 146, -1);
  for (const [gx, gy, gh, sd] of [[170, 990, 70, 1], [30, 940, 60, 2], [860, 990, 76, 3], [985, 900, 60, 4], [250, 1000, 40, 5], [760, 1004, 46, 6]]) body += grass(gx, gy, { h: gh, fill: '#25306A', n: 6, seed: sd });
  body += flower(205, 948, { r: 9, fill: C.plum1, center: C.gold1, stemH: 18, stem: '#3E5A7A' });
  body += flower(800, 952, { r: 8, fill: C.sky1, center: C.cream, stemH: 16, stem: '#3E5A7A' });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
