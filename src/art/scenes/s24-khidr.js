// Musa and al-Khidr (Quran 18:60-82).
// "The meeting place of the two seas": two waters of different colours meet
// along a soft line. By the big rock on the shore (18:63) the fish leaps into
// the sea, and the water stays over its path like an arch - a tunnel (18:61).
// A small boat sails far off; on a distant hill a village with a leaning wall
// about to fall (18:77). Late afternoon; wonder. No people.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, farBird, fish, house, grass, shimmer, r1, eye, T,
} from '../lib.js';

// A woven basket, empty, lid tipped open. (x, y) = bottom centre.
function basket(x, y, s = 1) {
  const kids = [
    ellipse(0, 2, 46, 8, { fill: C.ink, opacity: 0.2 }),
    path('M-40,-44 L40,-44 L32,0 L-32,0Z', { fill: C.wood1 }),
    path('M8,-44 L40,-44 L32,0 L14,0Z', { fill: C.wood2, opacity: 0.6 }),
  ];
  for (const yy of [-34, -22, -10]) kids.push(path(`M${-38 + (yy + 44) * 0.18},${yy} L${38 - (yy + 44) * 0.18},${yy}`, { stroke: C.wood3, 'stroke-width': 2.4, opacity: 0.55 }));
  for (const xx of [-24, -8, 8, 24]) kids.push(path(`M${xx},-44 L${xx * 0.8},0`, { stroke: C.wood3, 'stroke-width': 2, opacity: 0.4 }));
  kids.push(ellipse(0, -44, 40, 9, { fill: C.wood3 }), ellipse(0, -45, 34, 6, { fill: '#5A3A22' }));
  // the lid, tipped back against the basket
  kids.push(ellipse(46, -24, 12, 38, { fill: C.wood0, transform: 'rotate(-24 46 -24)' }), ellipse(46, -24, 8, 32, { fill: 'none', stroke: C.wood2, 'stroke-width': 2, opacity: 0.6, transform: 'rotate(-24 46 -24)' }));
  return g({ transform: T(x, y, s) }, kids);
}

// A small sailing boat far away. (x, y) = waterline centre.
function boat(x, y, s = 1) {
  return g({ transform: T(x, y, s) },
    path('M-40,-6 L40,-6 C34,6 24,10 0,10 C-24,10 -34,6 -40,-6Z', { fill: '#8C5E48' }),
    path('M-2,-6 L-2,-62', { stroke: '#6E4A3A', 'stroke-width': 3 }),
    path('M0,-60 C18,-44 26,-24 28,-10 L0,-10Z', { fill: '#FFF4E4' }),
    path('M-4,-52 C-16,-40 -22,-24 -24,-10 L-4,-10Z', { fill: '#F7E2CF' }),
    path('M-30,12 L30,12', { stroke: C.white, 'stroke-width': 2, opacity: 0.5, 'stroke-linecap': 'round' }),
  );
}

// Seagull perched, facing left, a soft white sea bird. (x, y) = feet.
function gull(x, y, s = 1) {
  return g({ transform: T(x, y, s, 0, true) },
    path('M-30,-28 L-58,-34 L-50,-20 Z', { fill: '#A9B4C2' }),
    ellipse(0, -30, 30, 20, { fill: C.white }),
    ellipse(6, -22, 18, 11, { fill: '#F4F6FA' }),
    path('M-24,-38 C-10,-48 14,-44 14,-30 C6,-24 -14,-24 -26,-30Z', { fill: '#B8C3D0' }),
    circle(22, -48, 15, { fill: C.white }),
    path('M35,-50 L52,-45 L35,-41Z', { fill: C.gold2 }),
    eye(27, -51, 3.4),
    ellipse(30, -42, 4, 2.4, { fill: C.cheek, opacity: 0.6 }),
    path('M-4,-10 L-6,0 M8,-10 L10,0', { stroke: C.coral2, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }),
  );
}

export default function render() {
  const id = ids('s24');
  const R = rng(24);
  const HZ = 468; // horizon
  const SX = 790; // the sun
  const SY = 318;
  const defs = [
    linear(id('sky'), [[0, '#7FBFDD'], [0.35, '#B7D9E2'], [0.62, '#F8D9B8'], [0.85, '#FFD49E'], [1, '#FFE4B4']], { x2: 0, y2: HZ, units: 'userSpaceOnUse' }),
    glowDef(id('sunGlow'), '#FFEFC0', 0.9),
    linear(id('seaA'), [[0, '#9ADCCB'], [0.3, '#5CC2B4'], [1, '#2F9C98']], { y1: HZ, x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    linear(id('seaB'), [[0, '#8FB8D8'], [0.3, '#4F86BE'], [1, '#22508C']], { y1: HZ, x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    radial(id('sunPath'), [[0, '#FFF1C8', 0.85], [0.5, '#FFE7B0', 0.35], [1, '#FFE7B0', 0]]),
    radial(id('tunnelGlow'), [[0, '#FFF6D8', 0.9], [0.5, '#E8FFF6', 0.4], [1, '#E8FFF6', 0]]),
    linear(id('rock'), [[0, '#B98468'], [0.55, '#D9A487'], [1, '#F2C7A8']], { x1: 0, y1: 0.4, x2: 1, y2: 0.2 }),
    linear(id('sand'), [[0, '#F6DDAF'], [1, '#E8C186']], { x2: 0, y2: 1 }),
    vignetteDef(id('vig'), C.ink, 0.2),
    `<clipPath id="${id('seaClip')}"><rect x="0" y="${HZ}" width="1000" height="${1000 - HZ}"/></clipPath>`,
  ].join('');

  const far = (c) => mix(c, '#F3D2B4', 0.5);
  let body = '';
  // ---- late-afternoon sky
  body += rect(0, 0, 1000, HZ + 4, { fill: `url(#${id('sky')})` });
  body += circle(SX, SY, 230, { fill: `url(#${id('sunGlow')})` });
  body += circle(SX, SY, 54, { fill: '#FFE6A6', opacity: 0.5 }) + circle(SX, SY, 46, { fill: '#FFEFC4' }) + circle(SX - 8, SY - 8, 30, { fill: '#FFFAE6', opacity: 0.8 });
  body += cloud(470, 170, 210, { fill: '#FFF2E4', shade: '#F6D0BE', seed: 5, opacity: 0.95 });
  body += cloud(150, 110, 160, { fill: '#FFF2E4', shade: '#F6D0BE', seed: 9, opacity: 0.9 });
  body += cloud(930, 190, 150, { fill: '#FFF2E4', shade: '#F6D0BE', seed: 14, opacity: 0.85 });
  for (const [bx, by, bs] of [[620, 250, 1.1], [650, 236, 0.85], [590, 270, 0.8]]) body += farBird(bx, by, bs, '#8A6F86', 0.55);

  // ---- the far hill with the village and its leaning wall
  body += path(ridge([[-20, 430], [60, 384], [150, 352], [250, 350], [340, 384], [420, 440], [470, HZ]], HZ + 4), { fill: far(C.leaf3) });
  body += path(ridge([[300, 452], [380, 430], [460, 446], [520, HZ]], HZ + 4), { fill: far(C.leaf2) });
  for (const [hx, hy, hw, hh] of [[64, 396, 52, 40], [122, 374, 56, 46], [330, 392, 54, 42]]) body += house(hx, hy, { w: hw, h: hh, fill: far(C.sand1), dark: far(C.sand3), door: far(C.wood3), windows: 1 });
  // the leaning wall: old stones, tilting, about to fall
  // the leaning wall: a long old garden wall on the hilltop, its base on the
  // ground and its body sagging over, about to fall (18:77)
  const stones = [];
  for (let row = 0; row < 4; row++) {
    for (let k = 0; k < 7; k++) {
      const xx = -50 + k * 17 + (row % 2) * 8.5;
      if (xx + 15.5 > 51) continue;
      stones.push(rect(xx, -44 + row * 10.5, 15.5, 9, { rx: 2.5, fill: far(row % 2 ? C.stone1 : C.stone0) }));
    }
  }
  body += ellipse(206, 356, 62, 6, { fill: far(C.leaf5), opacity: 0.45 });
  body += g({ transform: 'translate(206 356) rotate(-3) skewX(-24)' },
    rect(-52, -46, 104, 46, { rx: 3, fill: far(C.stone2) }),
    ...stones,
    rect(18, -46, 34, 46, { fill: far(C.stone3), opacity: 0.25 }),
    rect(-54, -50, 108, 6, { rx: 3, fill: far(C.stone0) }),
  );
  // two stones already fallen at its foot
  body += ellipse(272, 358, 8, 5, { fill: far(C.stone1) }) + ellipse(286, 362, 6, 4, { fill: far(C.stone0) });
  // olive trees on the hill
  for (const [tx, ty, tr] of [[40, 400, 20], [356, 404, 18], [400, 430, 15]]) {
    body += path(`M${tx - 2},${ty} L${tx - 2},${ty - tr} L${tx + 2},${ty - tr} L${tx + 2},${ty}Z`, { fill: far(C.wood2) });
    body += g({ fill: far('#8FAE88') }, circle(tx - tr * 0.5, ty - tr * 1.1, tr * 0.6), circle(tx + tr * 0.4, ty - tr * 1.2, tr * 0.65), circle(tx, ty - tr * 1.6, tr * 0.6));
  }
  // a distant headland on the right
  body += path(ridge([[820, HZ], [880, 452], [960, 444], [1020, 450]], HZ + 4), { fill: far(C.rock2) });

  // ---- the two seas meeting along a soft line
  const line = [[600, HZ], [616, 540], [660, 640], [740, 780], [880, 1010]];
  const lineD = smooth(line);
  body += path(`M-20,${HZ} L${line[0][0]},${HZ} ${lineD.replace(/^M[^C]+/, '')} L-20,1010Z`, { fill: `url(#${id('seaA')})` });
  body += path(`M${lineD.slice(1)} L1020,1010 L1020,${HZ}Z`, { fill: `url(#${id('seaB')})` });
  // the sun's path of light on the water
  body += ellipse(SX, HZ + 20, 120, 30, { fill: `url(#${id('sunPath')})` });
  body += shimmer(SX, HZ + 12, { n: 10, w: 170, gap: 13, color: '#FFF0C8', op: 0.85, seed: 4 });
  // soft frothy seam where the two waters meet but do not mix
  const seamD = smooth([[602, HZ + 1], ...line.slice(1)]);
  body += g({ 'clip-path': `url(#${id('seaClip')})` },
    path(seamD, { fill: 'none', stroke: '#7FB9C8', 'stroke-width': 34, opacity: 0.35 }),
    path(seamD, { fill: 'none', stroke: '#A8DCD8', 'stroke-width': 14, opacity: 0.45 }),
    path(seamD, { fill: 'none', stroke: C.white, 'stroke-width': 3, opacity: 0.55 }),
  );
  {
    const FR = rng(240);
    for (let i = 0; i < 46; i++) {
      const t = Math.pow(FR(), 0.8);
      const k = Math.min(line.length - 2, Math.floor(t * (line.length - 1)));
      const u = t * (line.length - 1) - k;
      const x = line[k][0] + (line[k + 1][0] - line[k][0]) * u;
      const y = line[k][1] + (line[k + 1][1] - line[k][1]) * u;
      const sc = 0.4 + ((y - HZ) / 540) * 1.2;
      body += circle(x + FR.range(-8, 8) * sc, y + FR.range(-3, 3), FR.range(1.4, 3.4) * sc, { fill: C.white, opacity: FR.range(0.5, 0.9) });
    }
  }
  // gentle waves on both seas
  for (let i = 0; i < 26; i++) {
    const y = HZ + 20 + Math.pow(R(), 1.3) * 500;
    const k = (y - HZ) / 532;
    const x = R() * 1000;
    const w = 20 + k * 60;
    body += path(`M${r1(x)},${r1(y)} q${r1(w / 2)},${r1(-4 - k * 6)} ${r1(w)},0`, { fill: 'none', stroke: C.white, 'stroke-width': r1(1.6 + k * 2.4), 'stroke-linecap': 'round', opacity: 0.35 });
  }
  // golden glints of the low sun dancing on the deep water
  for (const [gx, gy, gw] of [[860, 640, 40], [770, 700, 30], [930, 760, 46], [820, 850, 36], [950, 600, 28], [700, 600, 24]]) {
    body += path(`M${gx - gw / 2},${gy} q${gw / 4},-5 ${gw / 2},0 t${gw / 2},0`, { fill: 'none', stroke: '#FFE7B8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55 });
  }
  for (const [sx, sy, ss] of [[880, 620, 7], [800, 760, 6], [940, 700, 5]]) body += sparkle(sx, sy, ss, '#FFF3D6', { opacity: 0.85 });
  // a small boat sailing far off
  body += boat(708, HZ + 22, 0.62);

  // ---- the arch-like tunnel the fish leaves in the water (18:61)
  const tun = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12; // 0 near .. 1 far
    const x = 486 - Math.sin(t * Math.PI * 0.9) * 76 + t * 34;
    const y = 784 - (784 - (HZ + 26)) * Math.pow(t, 0.72);
    const w = 196 * Math.pow(1 - t, 1.35) + 14;
    tun.push([x, y, w]);
  }
  body += path(smooth(tun.map(([x, y]) => [x, y])), { fill: 'none', stroke: `url(#${id('tunnelGlow')})`, 'stroke-width': 40, 'stroke-linecap': 'round', opacity: 0.8 });
  const archD = ([x, y, w], k = 1.3) => {
    const h = w * 0.62;
    return `M${r1(x - w / 2)},${r1(y)} C${r1(x - w / 2)},${r1(y - h * k)} ${r1(x + w / 2)},${r1(y - h * k)} ${r1(x + w / 2)},${r1(y)}`;
  };
  // translucent body of the tube (arches build up into a glassy vault)
  for (let i = tun.length - 1; i >= 0; i--) body += path(archD(tun[i]) + 'Z', { fill: '#E4FFF8', opacity: 0.13 });
  // a bright ridge of light along the top of the vault
  body += path(smooth(tun.map(([x, y, w]) => [x - w * 0.12, y - w * 0.62 * 0.98])), { fill: 'none', stroke: C.white, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 });
  // a few soft rings, and the clear arched mouth nearest to us
  for (const i of [9, 6, 3]) body += path(archD(tun[i]), { fill: 'none', stroke: '#F4FFFC', 'stroke-width': r1(Math.max(1.4, tun[i][2] * 0.035)), 'stroke-linecap': 'round', opacity: 0.6 });
  body += path(archD(tun[0]), { fill: 'none', stroke: '#BFF1E7', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0.55 });
  body += path(archD(tun[0]), { fill: 'none', stroke: C.white, 'stroke-width': 4.5, 'stroke-linecap': 'round', opacity: 0.95 });
  // the tunnel mouth glowing on the water
  body += ellipse(tun[0][0], tun[0][1] + 2, 80, 14, { fill: '#FFF7DC', opacity: 0.55 });
  for (const [sx, sy, ss] of [[430, 610, 10], [520, 560, 8], [470, 520, 7], [560, 640, 7], [410, 700, 9], [500, 495, 6]]) body += sparkle(sx, sy, ss, '#FFFBEA', { opacity: 0.95 });

  // ---- the shore and the big rock
  body += path(smooth([[-20, 800], [80, 790], [190, 806], [300, 836], [400, 870], [470, 910], [520, 960], [540, 1010]]) + ' L-20,1010Z', { fill: `url(#${id('sand')})` });
  body += path(smooth([[-20, 806], [80, 796], [190, 812], [300, 842], [400, 876], [470, 916], [520, 966], [540, 1010]]), { fill: 'none', stroke: C.white, 'stroke-width': 5, opacity: 0.6, 'stroke-linecap': 'round' });
  body += ellipse(170, 862, 220, 26, { fill: C.ink, opacity: 0.14 });
  const rockD = blob([[-30, 870], [-24, 760], [10, 660], [70, 600], [150, 572], [236, 580], [300, 620], [340, 690], [356, 780], [350, 866]]);
  body += path(rockD, { fill: `url(#${id('rock')})` });
  body += path('M236,582 C290,604 330,650 346,720 C356,770 356,820 350,866 L300,866 C318,800 316,720 290,660 C276,626 258,600 236,582Z', { fill: '#FFDCC0', opacity: 0.55 });
  body += path('M-24,760 C-10,700 20,650 70,612 C40,660 22,720 20,800 L-26,860Z', { fill: C.rock3, opacity: 0.35 });
  body += path('M60,700 C110,690 170,692 230,704 M30,780 C100,770 190,772 300,790', { fill: 'none', stroke: C.rock3, 'stroke-width': 3.5, opacity: 0.3, 'stroke-linecap': 'round' });
  body += path('M120,584 C160,574 200,574 236,582 C196,584 160,590 120,598Z', { fill: '#FFF0DE', opacity: 0.7 });
  body += path('M200,690 C240,684 280,690 318,704 C284,700 244,698 210,700Z', { fill: '#FFE6CF', opacity: 0.7 });
  body += path('M150,770 C200,762 260,766 330,780 C270,778 210,778 160,782Z', { fill: '#FFE6CF', opacity: 0.6 });
  for (const [cx, cy, rr] of [[110, 650, 5], [250, 640, 4], [90, 720, 3.5], [300, 760, 4], [60, 820, 4]]) body += circle(cx, cy, rr, { fill: C.rock3, opacity: 0.4 });
  // the empty basket on the rock, and a gull keeping watch
  body += basket(150, 586, 0.95);
  body += gull(262, 600, 0.8);

  // ---- the fish, leaping from the shore into the sea
  const FX = 418;
  const FY = 622;
  // its leap: a trail of sparkles arcing from the basket on the rock
  body += path(`M196,552 C250,452 340,470 ${FX - 40},${FY - 26}`, { fill: 'none', stroke: '#FFF8E4', 'stroke-width': 5, opacity: 0.75, 'stroke-dasharray': '1 14', 'stroke-linecap': 'round' });
  for (const [sx, sy, ss] of [[232, 500, 8], [290, 470, 9], [346, 492, 7]]) body += sparkle(sx, sy, ss, '#FFFBEA', { opacity: 0.95 });
  for (const [dx, dy, rr] of [[-58, -34, 4], [-74, -46, 3.2], [-44, -18, 3]]) body += circle(FX + dx, FY + dy, rr, { fill: '#E9FFFB', opacity: 0.9 });
  body += circle(FX, FY, 90, { fill: `url(#${id('tunnelGlow')})` });
  body += g({ transform: `translate(${FX} ${FY}) rotate(34)` }, fish(0, 0, { s: 1.22, body: '#C3DCEA', fin: '#7FA9C9', belly: '#F6FCFF', stripes: false }));
  body += sparkle(FX + 56, FY - 40, 11, C.white) + sparkle(FX - 20, FY - 56, 8, C.white);

  // ---- foreground shore details
  for (const [px, py, pw] of [[400, 950, 16], [300, 930, 12], [110, 950, 18], [200, 980, 11], [470, 990, 10]]) body += ellipse(px, py, pw, pw * 0.55, { fill: C.stone1 }) + ellipse(px - pw * 0.3, py - pw * 0.2, pw * 0.4, pw * 0.2, { fill: C.white, opacity: 0.6 });
  for (const [gx, gh, sd] of [[20, 110, 1], [60, 80, 2], [380, 60, 3], [430, 44, 4]]) body += grass(gx, gx < 100 ? 900 : 930, { h: gh, fill: '#7FAE6E', n: 6, seed: sd, spread: 1.2 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
