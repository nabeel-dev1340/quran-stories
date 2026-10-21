// The Night Journey (Quran 17:1).
// A majestic starry night: the Ka'bah at the bottom left, al-Masjid al-Aqsa
// (the golden Dome of the Rock and the silver dome of al-Aqsa among cypress
// trees) at the bottom right. A glowing path of sparkles arcs across the sky
// from one to the other, then rises from al-Aqsa up through layer after
// layer of glowing sky. No people and no Buraq - only light.
import {
  C, svgDoc, ids, rng, mix, lerp, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge,
  sparkle, starField, crescent, kaaba, cypress, grass, flower, r1, T, eye,
} from '../lib.js';

// ---------------------------------------------------------------- helpers
// Point on a cubic Bezier.
function bez(p0, p1, p2, p3, t) {
  const m = 1 - t;
  return [
    m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0],
    m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1],
  ];
}
const cubicD = ([p0, p1, p2, p3]) => `M${p0.map(r1).join(',')} C${p1.map(r1).join(',')} ${p2.map(r1).join(',')} ${p3.map(r1).join(',')}`;

// A glowing ribbon with gold dots and twinkles along a cubic curve.
function sparklePath(curve, { seed = 1, n = 40, width = 34, fade = [1, 1] } = {}) {
  const R = rng(seed);
  const d = cubicD(curve);
  let s = '';
  s += path(d, { fill: 'none', stroke: '#FFE9B0', 'stroke-width': width, 'stroke-linecap': 'round', opacity: 0.08 });
  s += path(d, { fill: 'none', stroke: '#FFE9B0', 'stroke-width': width * 0.45, 'stroke-linecap': 'round', opacity: 0.14 });
  s += path(d, { fill: 'none', stroke: '#FFF6DA', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.5, 'stroke-dasharray': '1 11' });
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const [px, py] = bez(...curve, t);
    const op = lerp(fade[0], fade[1], t);
    const ox = R.range(-1, 1) * width * 0.35;
    const oy = R.range(-1, 1) * width * 0.35;
    if (i % 4 === 0) s += sparkle(px + ox, py + oy, R.range(7, 13), R() < 0.5 ? '#FFF3CF' : C.gold1, { opacity: op });
    else s += circle(px + ox, py + oy, R.range(1.6, 3.6), { fill: R() < 0.5 ? C.gold0 : C.gold1, opacity: op * R.range(0.6, 1) });
  }
  return s;
}

// The kit Ka'bah, with its gold band redrawn so the little calligraphy
// marks sit inside the band (in lib.js they drift below it on the left face).
function kaabaFixed(x, y, o = {}) {
  const s = o.s || 1;
  const band = o.band || C.gold2;
  const clothSide = o.clothSide || '#2C2934';
  const mark = mix(band, '#000000', 0.35);
  const fix = [
    path('M-120,-124 L0,-139 L0,-118 L-120,-104Z', { fill: clothSide }),
    path('M-120,-142 L0,-158 L0,-138 L-120,-123Z', { fill: band }),
  ];
  const yl = (px) => -132.5 + ((px + 120) * -15.5) / 120;
  const yr = (px) => -148 + (px * 18.5) / 132;
  for (let i = 0; i < 6; i++) {
    const a = -112 + i * 18;
    fix.push(path(`M${r1(a)},${r1(yl(a) - 1.6)} L${r1(a + 10)},${r1(yl(a + 10) - 1.6)} L${r1(a + 10)},${r1(yl(a + 10) + 1.6)} L${r1(a)},${r1(yl(a) + 1.6)}Z`, { fill: mark, opacity: 0.75 }));
  }
  for (let i = 0; i < 6; i++) {
    const a = 8 + i * 20;
    fix.push(path(`M${r1(a)},${r1(yr(a) - 1.6)} L${r1(a + 11)},${r1(yr(a + 11) - 1.6)} L${r1(a + 11)},${r1(yr(a + 11) + 1.6)} L${r1(a)},${r1(yr(a) + 1.6)}Z`, { fill: mix(mark, '#000000', 0.1), opacity: 0.7 }));
  }
  return kaaba(x, y, o) + g({ transform: T(x, y, s) }, fix);
}

// The Dome of the Rock: an octagon in blue tiles and white marble under a
// golden dome. (x, y) = bottom centre of its platform.
function domeOfTheRock(x, y, s, id, defsOut) {
  const tile = '#3F7FB8';
  const tileDark = '#2F6297';
  const tileSide = '#346CA3';
  const marble = '#CFC8E0';
  const marbleSide = '#A9A1C2';
  const p = [];
  // platform
  p.push(rect(-150, -16, 300, 16, { rx: 3, fill: '#B9B0C8' }));
  p.push(rect(-150, -16, 300, 5, { rx: 2, fill: '#D6CFE0' }));
  // the octagon: a front face and two foreshortened side faces
  const face = (x0, x1, top, mfill, tfill) => [
    rect(x0, -100, x1 - x0, 84, { fill: mfill }),
    rect(x0, -top, x1 - x0, top - 56, { fill: tfill }),
  ];
  p.push(...face(-118, -64, 104, marble, tileSide));
  p.push(...face(64, 118, 104, marbleSide, tileDark));
  p.push(...face(-64, 64, 108, mix(marble, '#FFFFFF', 0.15), tile));
  // edges between faces
  p.push(path('M-64,-108 L-64,-16 M64,-108 L64,-16', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.35 }));
  // tile pattern: small diamonds
  for (let i = 0; i < 8; i++) for (const yy of [-98, -66]) p.push(path(`M${-58 + i * 16.5},${yy} l4,-5 l4,5 l-4,5Z`, { fill: '#9CC8EA', opacity: 0.55 }));
  // arched windows in the tiled part
  const arch = (cx, w, h, yb, fill) => path(`M${r1(cx - w / 2)},${yb} L${r1(cx - w / 2)},${r1(yb - h + w / 2)} A${r1(w / 2)},${r1(w / 2)} 0 0 1 ${r1(cx + w / 2)},${r1(yb - h + w / 2)} L${r1(cx + w / 2)},${yb}Z`, { fill });
  for (const wx of [-36, 0, 36]) p.push(arch(wx, 14, 26, -62, '#1E3F6A'), arch(wx, 6, 12, -66, '#F7C24F'));
  for (const wx of [-102, -80]) p.push(arch(wx, 10, 22, -62, '#1E3F6A'));
  for (const wx of [80, 102]) p.push(arch(wx, 10, 22, -62, '#18345A'));
  // marble panels below
  for (const wx of [-44, 0, 44]) p.push(rect(wx - 14, -50, 28, 26, { rx: 3, fill: '#FFFFFF', opacity: 0.22 }));
  // parapet
  p.push(rect(-120, -112, 240, 7, { rx: 2, fill: '#7FB1DC' }));
  // drum
  p.push(rect(-66, -152, 132, 42, { fill: tile }));
  p.push(rect(22, -152, 44, 42, { fill: tileDark, opacity: 0.7 }));
  for (const wx of [-46, -23, 0, 23, 46]) p.push(arch(wx, 9, 20, -120, '#1E3F6A'));
  p.push(rect(-70, -158, 140, 8, { rx: 3, fill: '#7FB1DC' }));
  // golden dome
  const domeD = 'M-74,-156 C-76,-214 -42,-246 0,-250 C42,-246 76,-214 74,-156Z';
  defsOut.push(`<clipPath id="${id('dome')}"><path d="${domeD}"/></clipPath>`);
  p.push(path(domeD, { fill: `url(#${id('gold')})` }));
  p.push(g({ 'clip-path': `url(#${id('dome')})` },
    ellipse(44, -170, 50, 90, { fill: C.gold4, opacity: 0.45 }),
    ellipse(-34, -214, 18, 30, { fill: '#FFF6D6', opacity: 0.7, transform: 'rotate(25 -34 -214)' }),
    ...[-44, -16, 16, 44].map((rx) => path(`M${rx * 1.5},-156 Q${rx},-230 0,-250`, { fill: 'none', stroke: C.gold4, 'stroke-width': 1.6, opacity: 0.35 })),
  ));
  // finial with a crescent
  p.push(path('M0,-250 L0,-272', { stroke: C.gold3, 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
  p.push(circle(0, -262, 4.5, { fill: C.gold2 }));
  p.push(crescent(0, -282, 9, { fill: C.gold2, angle: -90, thickness: 0.5 }));
  return g({ transform: T(x, y, s) }, p);
}

// Al-Aqsa mosque: an arched stone porch with a silver-grey dome behind it.
// (x, y) = bottom centre.
function aqsaMosque(x, y, s, id) {
  const stone = '#D9D0DE';
  const stoneSide = '#B9B0C8';
  const p = [];
  // nave roof behind
  p.push(path('M-96,-80 L-70,-104 L70,-104 L96,-80Z', { fill: '#8E8AA6' }));
  // drum and silver dome
  p.push(rect(-36, -132, 72, 32, { fill: stone }));
  p.push(rect(10, -132, 26, 32, { fill: stoneSide }));
  for (const wx of [-22, -6, 10, 24]) p.push(rect(wx - 3, -124, 6, 14, { rx: 3, fill: '#5A5577' }));
  p.push(path('M-46,-130 C-46,-170 -22,-186 0,-188 C22,-186 46,-170 46,-130Z', { fill: `url(#${id('silver')})` }));
  p.push(path('M10,-186 C30,-180 46,-162 46,-130 L18,-130 C22,-150 20,-170 10,-186Z', { fill: '#7E7A99', opacity: 0.45 }));
  p.push(ellipse(-20, -164, 8, 14, { fill: '#FFFFFF', opacity: 0.6, transform: 'rotate(25 -20 -164)' }));
  p.push(path('M0,-188 L0,-204', { stroke: C.gold3, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  p.push(crescent(0, -211, 6.5, { fill: C.gold2, angle: -90, thickness: 0.5 }));
  // porch with seven arches
  p.push(rect(-100, -84, 200, 84, { fill: stone }));
  p.push(rect(40, -84, 60, 84, { fill: stoneSide, opacity: 0.6 }));
  p.push(rect(-104, -90, 208, 9, { rx: 2, fill: '#ECE6F2' }));
  for (let i = 0; i < 7; i++) {
    const ax = -84 + i * 28;
    p.push(path(`M${ax - 10},0 L${ax - 10},-38 A10,10 0 0 1 ${ax + 10},-38 L${ax + 10},0Z`, { fill: i === 3 ? '#E8B860' : '#4C4767' }));
  }
  p.push(rect(-104, -2, 208, 4, { fill: '#B9B0C8' }));
  return g({ transform: T(x, y, s) }, p);
}

// A little dove asleep on the ground, eyes closed. Faces right.
// (x, y) = under its middle.
function sleepyDove(x, y, { s = 1, flip = false, body = '#E4E0F4', wing = '#C3BCE0', rim = '#FFE9B8' } = {}) {
  const p = [
    path('M-30,-14 L-52,-22 L-48,-8Z', { fill: wing }),
    path('M-36,-12 C-36,-34 -12,-44 10,-40 C28,-38 38,-26 34,-10 C30,0 14,2 -6,2 C-24,2 -36,-2 -36,-12Z', { fill: body }),
    path('M-24,-22 C-10,-34 12,-32 18,-18 C8,-10 -12,-10 -24,-22Z', { fill: wing }),
    circle(24, -38, 13, { fill: body }),
    path('M35,-40 L44,-36 L35,-33Z', { fill: C.gold3 }),
    eye(26, -39, 3.4, true),
    ellipse(30, -31, 3.6, 2.2, { fill: C.cheek, opacity: 0.6 }),
    path('M-30,-30 C-18,-44 4,-48 20,-48', { fill: 'none', stroke: rim, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

export default function render() {
  const id = ids('s40');
  const extra = [];

  // the two journeys
  const kaabaTop = [212, 778];
  const domeTop = [712, 668];
  const isra = [kaabaTop, [250, 470], [560, 330], domeTop];
  const miraj = [domeTop, [790, 520], [610, 330], [640, 70]];

  let body = '';
  // ------------------------------------------------ sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  // layer upon layer of glowing sky, softer and wider further down
  body += circle(640, -30, 380, { fill: `url(#${id('heaven')})` });
  for (let i = 0; i < 7; i++) {
    const ry = 390 - i * 50;
    body += ellipse(640, -40, ry * 1.4, ry, { fill: `url(#${id(i % 2 ? 'shellA' : 'shellB')})` });
  }
  // twinkles resting on the glowing layers
  const RH = rng(17);
  for (let i = 0; i < 7; i++) {
    const ry = 390 - i * 50;
    for (let k = 0; k < 3; k++) {
      const a = Math.PI * (0.12 + 0.76 * RH());
      const tx = 640 + Math.cos(a) * ry * 1.4 * 0.985;
      const ty = -40 + Math.sin(a) * ry * 0.985;
      if (ty < 30 || tx < 40 || tx > 960) continue;
      body += sparkle(tx, ty, RH.range(5, 9), i % 2 ? '#F1E4FF' : '#FFF1CC', { opacity: 0.9 });
    }
  }
  body += starField({ seed: 40, n: 110, area: [0, 0, 1000, 760], twinkles: 14, color: '#E9E6FF', gold: C.gold1, avoid: [[640, 20, 170], [150, 150, 80]] });
  body += circle(150, 150, 120, { fill: `url(#${id('moonGlow')})` });
  body += crescent(150, 150, 40, { fill: C.gold0, angle: -35, thickness: 0.44 });

  // ------------------------------------------------ distant land
  body += path(ridge([[-20, 800], [90, 760], [200, 782], [320, 770], [440, 806], [560, 812], [680, 790], [800, 772], [920, 786], [1020, 770]], 1000), { fill: '#2A2D66' });
  // the long desert between the two mosques, far away
  body += path(ridge([[300, 842], [380, 826], [460, 836], [540, 822], [620, 840]], 1000), { fill: '#302F68' });
  for (const [px, py, ph] of [[392, 830, 34], [410, 834, 26], [520, 826, 30]]) {
    body += path(`M${px},${py} L${px + 1.5},${py - ph}`, { stroke: '#2A2960', 'stroke-width': 3, 'stroke-linecap': 'round' });
    for (const a of [-150, -110, -70, -30]) body += path(`M${px + 1.5},${py - ph} q${r1(Math.cos((a * Math.PI) / 180) * 8)},${r1(Math.sin((a * Math.PI) / 180) * 8 - 2)} ${r1(Math.cos((a * Math.PI) / 180) * 14)},${r1(Math.sin((a * Math.PI) / 180) * 10 + 6)}`, { fill: 'none', stroke: '#2A2960', 'stroke-width': 3, 'stroke-linecap': 'round' });
  }
  // Makkah's dark hills behind the Ka'bah
  body += path(ridge([[-20, 832], [60, 772], [130, 790], [200, 800], [290, 784], [380, 820], [450, 856], [520, 900], [580, 950]], 1000), { fill: '#24275A' });
  // the hills of Jerusalem with olive trees
  body += path(ridge([[380, 950], [460, 900], [530, 856], [600, 832], [700, 820], [820, 806], [920, 812], [1020, 800]], 1000), { fill: '#262A5E' });
  for (const [ox, oy, orr] of [[620, 834, 16], [652, 828, 13], [858, 812, 14], [890, 814, 16], [930, 816, 12], [968, 808, 15]]) body += circle(ox, oy - orr * 0.6, orr, { fill: '#2F3A6E' });

  // ------------------------------------------------ the path of light
  body += sparklePath(isra, { seed: 3, n: 56 });
  body += sparklePath(miraj, { seed: 5, n: 48, fade: [1, 0.85] });

  // ------------------------------------------------ the Ka'bah, bottom left
  body += path(ridge([[-20, 880], [120, 872], [300, 878], [440, 902], [530, 924], [610, 908], [760, 900], [900, 902], [1020, 896]], 1000), { fill: '#3B3A72' });
  body += ellipse(210, 912, 190, 34, { fill: '#4A4884' });
  body += ellipse(210, 910, 150, 24, { fill: '#56548F' });
  body += kaabaFixed(210, 912, { s: 0.74, glowId: id('kGlow') });

  // ------------------------------------------------ al-Aqsa, bottom right
  body += path('M520,944 C548,922 566,906 600,902 L1020,898 L1020,934 L520,950Z', { fill: '#4A4884' });
  body += path('M566,906 C578,903 588,902 600,902 L1020,898 L1020,904 L600,908 C588,908 576,909 566,910Z', { fill: '#5C5A96' });
  body += cypress(600, 908, { h: 150, w: 34, fill: '#1D4A4A', light: '#2C6660' });
  body += aqsaMosque(880, 910, 0.62, id);
  body += cypress(940, 912, { h: 120, w: 30, fill: '#1D4A4A', light: '#2C6660' });
  body += domeOfTheRock(712, 918, 0.92, id, extra);
  body += cypress(816, 914, { h: 170, w: 38, fill: '#1A4444', light: '#2A615B' });
  body += cypress(560, 916, { h: 110, w: 28, fill: '#1A4444', light: '#2A615B' });

  // two little doves asleep by the Ka'bah
  body += ellipse(372, 918, 60, 6, { fill: C.ink, opacity: 0.25 });
  body += sleepyDove(350, 916, { s: 0.62 });
  body += sleepyDove(398, 920, { s: 0.55, flip: true });

  // ------------------------------------------------ foreground framing
  body += path(ridge([[-20, 966], [200, 956], [420, 968], [620, 962], [820, 968], [1020, 958]], 1000), { fill: '#262553' });
  for (const [gx, gy, gh, sd] of [[60, 968, 46, 1], [130, 972, 34, 2], [470, 970, 30, 3], [860, 970, 40, 4], [940, 966, 50, 5], [700, 972, 28, 6]]) body += grass(gx, gy, { h: gh, fill: '#1E4A4A', n: 6, seed: sd });
  for (const [fx, fy, fc] of [[96, 958, C.rose1], [500, 962, C.gold1], [900, 956, C.rose1], [960, 952, C.gold1], [740, 962, C.plum1]]) body += flower(fx, fy, { r: 8, fill: fc, center: C.gold2, stem: '#1E4A4A', stemH: 12 });

  body += vignette(id('vig'));

  const defs = [
    linear(id('sky'), [[0, '#0D1230'], [0.3, '#1A1F4F'], [0.62, '#2A2F6E'], [0.85, '#3A3F84']]),
    radial(id('heaven'), [[0, '#FFF6DC', 0.6], [0.45, '#F6E2FF', 0.2], [1, '#C9B3E3', 0]]),
    radial(id('shellA'), [[0, '#E9D9FF', 0], [0.82, '#E9D9FF', 0.03], [0.97, '#EBDCFF', 0.2], [1, '#E9D9FF', 0]]),
    radial(id('shellB'), [[0, '#FFE6B0', 0], [0.82, '#FFE6B0', 0.03], [0.97, '#FFE3A6', 0.22], [1, '#FFE6B0', 0]]),
    glowDef(id('moonGlow'), C.gold0, 0.3),
    glowDef(id('kGlow'), '#FFF0C0', 0.6),
    linear(id('gold'), [[0, C.gold1], [0.5, C.gold2], [1, C.gold3]], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    linear(id('silver'), [[0, '#E9E8F2'], [0.5, '#BDBBD0'], [1, '#8F8BA8']], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    vignetteDef(id('vig'), C.ink, 0.25),
    ...extra,
  ].join('');
  return svgDoc({ defs, body });
}
