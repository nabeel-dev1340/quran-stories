// The Two Sons of Adam (Quran 5:27-31).
// A quiet hilltop at dusk. Two offerings rest on two flat stones: a fine,
// fluffy lamb (accepted - a soft beam of light falls on it) and a sheaf of
// grain stalks. A black crow perches on a bare branch nearby, looking down.
// Gentle and thoughtful; no people, nothing sad.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g,
  ridge, smooth, blob, sparkle, crescent, cloud, grass, flower, rock, farBird, eye, T, r1,
} from '../lib.js';

// ---------------------------------------------------------------- the offerings
// A lamb lying down with its legs folded, facing right. (x, y) = ground under its belly.
function lamb(x, y, { s = 1, flip = false, wool = C.wool0, shade = '#E4D3C2', face = '#F2D8CA', faceShade = '#E0BBAB', seed = 3 } = {}) {
  const R = rng(seed);
  const parts = [ellipse(0, 0, 96, 10, { fill: C.ink, opacity: 0.12 })];
  // folded legs peeking out
  parts.push(rect(-82, -16, 34, 15, { rx: 7.5, fill: faceShade }), rect(36, -14, 40, 14, { rx: 7, fill: faceShade }), rect(58, -14, 22, 14, { rx: 7, fill: mix(faceShade, C.ink, 0.25) }));
  // wool: a cloud of puffs
  const puffs = [];
  for (let i = 0; i < 13; i++) {
    const a = (Math.PI * 2 * i) / 13;
    puffs.push([Math.cos(a) * 74, -50 + Math.sin(a) * 36, 25 + R.range(-3, 4)]);
  }
  parts.push(g({ fill: shade }, puffs.map(([a, b, c]) => circle(a + 4, b + 6, c)), ellipse(4, -44, 80, 40)));
  parts.push(g({ fill: wool }, puffs.filter(([, b]) => b < -40).map(([a, b, c]) => circle(a, b, c)), ellipse(0, -52, 78, 38)));
  parts.push(g({ fill: C.white, opacity: 0.85 }, circle(-40, -78, 14), circle(-12, -86, 12), circle(-60, -62, 10)));
  // tail puff
  parts.push(circle(-90, -56, 13, { fill: wool }));
  // head, raised, looking out at us
  parts.push(
    ellipse(58, -106, 21, 9, { fill: faceShade, transform: 'rotate(-14 58 -106)' }),
    ellipse(60, -105, 12, 4.6, { fill: C.rose1, transform: 'rotate(-14 60 -105)' }),
    ellipse(118, -106, 21, 9, { fill: faceShade, transform: 'rotate(14 118 -106)' }),
    ellipse(116, -105, 12, 4.6, { fill: C.rose1, transform: 'rotate(14 116 -105)' }),
    ellipse(88, -96, 26, 30, { fill: face }),
    ellipse(96, -92, 18, 26, { fill: faceShade, opacity: 0.35 }),
    ellipse(88, -80, 16, 12, { fill: mix(face, '#FFFFFF', 0.35) }),
    g({ fill: wool }, circle(74, -122, 12), circle(88, -128, 13), circle(102, -121, 11)),
    eye(78, -100, 4.6), eye(98, -100, 4.6),
    ellipse(70, -88, 6, 3.6, { fill: C.cheek, opacity: 0.65 }), ellipse(106, -88, 6, 3.6, { fill: C.cheek, opacity: 0.65 }),
    ellipse(88, -85, 3.4, 2.4, { fill: C.rose2 }),
    path('M83,-79 q5,4 10,0', { fill: 'none', stroke: C.inkSoft, 'stroke-width': 2, 'stroke-linecap': 'round' }),
  );
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// An upright sheaf of wheat tied at the waist. (x, y) = bottom centre.
function sheaf(x, y, { s = 1, stalk = C.sand3, stalkDark = C.sand4, head = C.gold2, headDark = C.gold3, tie = C.coral3, seed = 9 } = {}) {
  const R = rng(seed);
  const parts = [ellipse(0, 0, 50, 7, { fill: C.ink, opacity: 0.12 })];
  const n = 15;
  const waist = -74;
  const heads = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) - 0.5;
    const bx = t * 64 + R.range(-3, 3);
    const tx = t * 120 + R.range(-6, 6);
    const ty = -150 - Math.cos(t * Math.PI) * 26 + R.range(-6, 6);
    const col = i % 3 === 0 ? stalkDark : stalk;
    parts.push(path(`M${r1(bx)},0 Q${r1(t * 6)},${waist} ${r1(tx)},${r1(ty)}`, { fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }));
    heads.push([tx, ty, Math.atan2(ty - waist, tx - t * 6) * (180 / Math.PI) + 90]);
  }
  for (const [hx, hy, ang] of heads) {
    const grains = [];
    for (let k = 0; k < 4; k++) {
      grains.push(ellipse(-4.5, -k * 7, 4.4, 6.5, { fill: k % 2 ? headDark : head, transform: `rotate(-22 -4.5 ${-k * 7})` }));
      grains.push(ellipse(4.5, -k * 7 - 3, 4.4, 6.5, { fill: k % 2 ? head : headDark, transform: `rotate(22 4.5 ${-k * 7 - 3})` }));
    }
    grains.push(ellipse(0, -30, 3.6, 6, { fill: head }));
    grains.push(path('M0,-34 L0,-50 M-4,-28 L-10,-44 M4,-30 L10,-46', { fill: 'none', stroke: headDark, 'stroke-width': 1.4, 'stroke-linecap': 'round', opacity: 0.8 }));
    parts.push(g({ transform: `translate(${r1(hx)} ${r1(hy)}) rotate(${r1(ang)})` }, grains));
  }
  // the tie
  parts.push(path(`M-17,${waist - 6} Q0,${waist + 2} 17,${waist - 6} L17,${waist + 6} Q0,${waist + 14} -17,${waist + 6}Z`, { fill: tie }));
  parts.push(path(`M10,${waist + 4} q10,10 4,22 M10,${waist + 4} q16,4 18,16`, { fill: 'none', stroke: tie, 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
  return g({ transform: T(x, y, s) }, parts);
}

// A broad flat stone. (x, y) = bottom centre.
function slab(x, y, w, h, { top = C.stone0, side = C.stone1, dark = C.stone2 } = {}) {
  const ry = h * 0.42;
  const ty = y - h;
  let out = ellipse(x, y + 2, w * 0.56, h * 0.3, { fill: C.ink, opacity: 0.14 });
  out += path(`M${r1(x - w / 2)},${r1(ty)} C${r1(x - w / 2)},${r1(y - h * 0.2)} ${r1(x - w * 0.44)},${r1(y)} ${r1(x - w * 0.3)},${r1(y)} L${r1(x + w * 0.3)},${r1(y)} C${r1(x + w * 0.44)},${r1(y)} ${r1(x + w / 2)},${r1(y - h * 0.2)} ${r1(x + w / 2)},${r1(ty)}Z`, { fill: side });
  out += path(`M${r1(x + w * 0.1)},${r1(ty + ry)} C${r1(x + w * 0.3)},${r1(ty + ry * 0.9)} ${r1(x + w * 0.48)},${r1(ty + ry * 0.4)} ${r1(x + w / 2)},${r1(ty)} C${r1(x + w / 2)},${r1(y - h * 0.2)} ${r1(x + w * 0.44)},${r1(y)} ${r1(x + w * 0.3)},${r1(y)} L${r1(x + w * 0.05)},${r1(y)}Z`, { fill: dark, opacity: 0.55 });
  out += ellipse(x, ty, w / 2, ry, { fill: top });
  out += ellipse(x - w * 0.16, ty - ry * 0.18, w * 0.22, ry * 0.4, { fill: C.white, opacity: 0.25 });
  return out;
}

// ---------------------------------------------------------------- the crow
// Glossy black crow perched, facing right. (x, y) = feet on the branch.
function crow(x, y, { s = 1, flip = false, look = 0 } = {}) {
  const body = '#2C2840';
  const sheen = '#4E4B78';
  const parts = [
    // tail
    path('M-26,-34 L-66,-6 L-60,2 L-52,-2 L-48,6 L-20,-22Z', { fill: mix(body, '#000000', 0.15) }),
    // body
    ellipse(-2, -40, 34, 25, { fill: body, transform: 'rotate(-18 -2 -40)' }),
    // wing with a soft blue-violet sheen
    path('M-30,-40 C-24,-62 6,-64 18,-46 C10,-30 -10,-20 -34,-24Z', { fill: mix(body, sheen, 0.45) }),
    path('M-22,-52 C-10,-60 6,-58 12,-50', { fill: 'none', stroke: sheen, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }),
    // legs
    path('M-4,-18 L-6,0 M8,-18 L8,0', { stroke: C.stone3, 'stroke-width': 3.4, 'stroke-linecap': 'round' }),
    path('M-12,0 L2,0 M2,0 L16,0', { stroke: C.stone3, 'stroke-width': 3, 'stroke-linecap': 'round' }),
  ];
  parts.push(g({ transform: `rotate(${look} 22 -60)` },
    circle(24, -66, 20, { fill: body }),
    path('M12,-80 C20,-88 34,-86 40,-76', { fill: 'none', stroke: sheen, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 }),
    path('M40,-72 C52,-70 62,-64 66,-60 C58,-56 48,-56 40,-58Z', { fill: C.stone3 }),
    path('M40,-62 C50,-60 58,-60 66,-60', { fill: 'none', stroke: C.stone4, 'stroke-width': 1.6, opacity: 0.8 }),
    circle(30, -70, 7.2, { fill: '#5C5878' }),
    eye(30, -70, 4.6),
    ellipse(32, -58, 5, 3, { fill: C.cheek, opacity: 0.35 }),
  ));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// ---------------------------------------------------------------- the scene
export default function render() {
  const id = ids('s03');
  const R = rng(303);
  const dusk = '#E9B8C8';
  const far = (c, k = 0.55) => mix(c, dusk, k);
  const defs = [
    linear(id('sky'), [[0, '#7A68B4'], [0.3, '#A895D3'], [0.55, '#DDB0CF'], [0.74, '#F6BFB8'], [0.88, '#FCD3AE'], [1, '#FFE2B8']]),
    glowDef(id('sunset'), '#FFE6BA', 0.9),
    linear(id('beam'), [[0, '#FFF6DE', 0], [0.35, '#FFF3D4', 0.28], [1, '#FFEFC8', 0.6]]),
    glowDef(id('accept'), '#FFF4D6', 0.85),
    glowDef(id('fly'), '#FFE59A', 0.85),
    linear(id('hill'), [[0, '#A6B293'], [0.4, '#8D9E85'], [1, '#6E8174']]),
    vignetteDef(id('vig'), C.ink, 0.22),
  ].join('');

  let body = '';
  // ------------------------------------------------------------ dusk sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += glow(250, 600, 470, id('sunset'));
  for (let i = 0; i < 26; i++) {
    const x = R() * 1000;
    const y = R() * 230;
    if (x < 380 && y < 120) continue; // keep the beam's sky clean
    body += circle(x, y, R.range(1.2, 2.6), { fill: C.cream, opacity: r1(R.range(0.35, 0.8) * 100) / 100 });
  }
  for (const [sx, sy, sz] of [[560, 70, 9], [700, 150, 7], [930, 60, 10], [470, 180, 6]]) body += sparkle(sx, sy, sz, C.cream, { opacity: 0.85 });
  body += crescent(840, 150, 34, { fill: '#FFF0CF', angle: -40, thickness: 0.36 });
  body += cloud(640, 330, 230, { fill: '#F6C9CF', shade: '#DCA9C6', seed: 4, opacity: 0.75 });
  body += cloud(110, 300, 170, { fill: '#FAD3CF', shade: '#E8B3C3', seed: 8, opacity: 0.7 });
  body += cloud(930, 420, 150, { fill: '#F9D2C6', shade: '#E7B2BF', seed: 2, opacity: 0.65 });
  body += farBird(560, 150, 1.2, '#6E5A8E', 0.55) + farBird(598, 132, 0.9, '#6E5A8E', 0.5) + farBird(632, 154, 0.8, '#6E5A8E', 0.45);

  // ------------------------------------------------------------ far hills
  body += path(ridge([[-20, 600], [140, 560], [300, 586], [480, 548], [660, 578], [840, 540], [1020, 566]], 1000), { fill: far('#B79BC9', 0.5) });
  body += path(ridge([[-20, 640], [180, 612], [380, 632], [560, 604], [760, 628], [1020, 600]], 1000), { fill: far('#9C86BC', 0.38) });
  body += path(ridge([[-20, 690], [160, 668], [360, 680], [600, 656], [820, 676], [1020, 660]], 1000), { fill: far('#7E7FA6', 0.2) });
  // a few far trees on the last ridge
  for (const [tx, ty, tr] of [[80, 672, 15], [108, 670, 11], [560, 658, 12], [586, 660, 9]]) {
    body += rect(tx - 2, ty - tr, 4, tr, { fill: far('#5E6378', 0.2) });
    body += circle(tx, ty - tr * 1.5, tr, { fill: far('#6F7C92', 0.2) });
  }

  // ------------------------------------------------------------ the hilltop
  body += path(ridge([[-20, 760], [150, 726], [360, 712], [560, 718], [760, 734], [1020, 760]], 1000), { fill: `url(#${id('hill')})` });
  body += path(ridge([[-20, 770], [180, 738], [360, 730], [520, 736]], 1000).replace(/L520,1000 L-20,1000 Z$/, 'C470,760 300,800 -20,840 Z'), { fill: '#B7BE9C', opacity: 0.55 });
  body += path(ridge([[-20, 880], [200, 850], [420, 868], [640, 852], [860, 870], [1020, 860]], 1000), { fill: '#6B7E72', opacity: 0.45 });

  // ------------------------------------------------------------ light on the accepted offering
  // the beam: many thin nested layers give it soft edges
  for (let i = 0; i < 7; i++) {
    const k = i / 6; // 0 = widest, 1 = core
    const tl = 140 + 100 * k;
    const tr = 402 - 100 * k;
    const bl = 196 + 128 * k;
    const br = 584 - 124 * k;
    const by = 728 + 10 * k;
    body += path(`M${tl},-20 L${tr},-20 L${br},${by} Q${(bl + br) / 2},${by + 40 - 22 * k} ${bl},${by}Z`, { fill: `url(#${id('beam')})`, opacity: 0.26 });
  }
  body += glow(385, 690, 250, id('accept'));
  body += ellipse(385, 752, 170, 26, { fill: '#FFF2D2', opacity: 0.45 });

  // the two stones and the two offerings
  body += slab(385, 774, 300, 54, { top: '#EFE2D2', side: '#D8C7BA', dark: '#B9A7A6' });
  body += lamb(378, 728, { s: 1.14 });
  body += slab(668, 778, 196, 46, { top: '#C9BFCB', side: '#AFA3B5', dark: '#8E819C' });
  body += sheaf(668, 736, { s: 0.92, stalk: '#D2A465', stalkDark: '#B88A4E', head: '#E8B75A', headDark: '#C9963E', tie: '#B4654F' });
  for (const [sx, sy, sz] of [[270, 610, 12], [560, 588, 14], [300, 700, 8], [470, 520, 9], [330, 460, 7], [520, 690, 7], [400, 560, 6]]) body += sparkle(sx, sy, sz, '#FFF8E4', { opacity: 0.95 });

  // ------------------------------------------------------------ the bare tree and the crow
  const bark = '#5D4A63';
  const barkLight = '#7E6880';
  body += path('M1030,1010 C990,900 948,820 930,720 C920,660 924,610 940,560 L962,566 C950,612 950,660 958,720 C972,800 1010,880 1040,960Z', { fill: bark });
  body += path('M938,620 C900,600 860,596 790,606 L788,618 C850,612 892,616 934,640Z', { fill: bark });
  body += path('M944,580 C930,540 936,500 960,470 M950,700 C980,680 1000,650 1010,610 M880,603 C870,580 872,560 884,540 M830,606 C816,590 806,592 792,580', { fill: 'none', stroke: bark, 'stroke-width': 8, 'stroke-linecap': 'round' });
  body += path('M960,470 C966,452 978,440 990,436 M884,540 C890,530 900,524 910,522 M960,505 C944,500 932,490 926,478', { fill: 'none', stroke: bark, 'stroke-width': 4, 'stroke-linecap': 'round' });
  body += path('M934,700 C928,650 930,610 944,566', { fill: 'none', stroke: barkLight, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 });
  body += crow(846, 607, { s: 1.06, flip: true, look: 26 });

  // ------------------------------------------------------------ foreground details
  // a closer grassy ridge for depth
  body += path(ridge([[-20, 930], [160, 912], [380, 926], [600, 908], [820, 924], [1020, 912]], 1000), { fill: '#617468' });
  for (const [gx, gy, gh, sd] of [[250, 918, 40, 21], [420, 926, 34, 22], [540, 912, 44, 23], [700, 914, 38, 24], [780, 922, 30, 25], [340, 860, 30, 26], [620, 850, 28, 27], [150, 846, 30, 28], [520, 800, 24, 29], [760, 800, 26, 30]]) body += grass(gx, gy, { h: gh, n: 5, seed: sd, fill: '#5A6E62' });
  // little clusters of evening flowers
  const fl = ['#E7D3EF', '#F4C9D6', '#FFF1DA'];
  for (const [cx, cy] of [[150, 820], [250, 880], [480, 860], [600, 830], [760, 870], [860, 820], [440, 960], [660, 970], [300, 960]]) {
    for (let k = 0; k < 3; k++) body += flower(cx + k * 16 - 16 + R.range(-4, 4), cy + (k % 2) * 10 + R.range(-3, 3), { r: R.range(6.5, 8.5), fill: fl[(k + cx) % 3], center: '#F2C470', stem: '#5E7466', stemH: 12, rot: cx + k * 20 });
  }
  // pebbles by the stones
  for (const [px, py, pw] of [[230, 786, 22], [540, 790, 18], [565, 796, 12], [790, 796, 20], [812, 800, 12]]) {
    body += ellipse(px, py, pw / 2, pw * 0.3, { fill: '#9A93A8' }) + ellipse(px - pw * 0.12, py - pw * 0.08, pw * 0.25, pw * 0.12, { fill: '#C8C1D2', opacity: 0.8 });
  }
  // a few fireflies starting their evening
  body += [[180, 720], [130, 640], [860, 760], [920, 840], [600, 640]].map(([fx, fy]) => glow(fx, fy, 18, id('fly')) + circle(fx, fy, 2.6, { fill: '#FFF0B8' })).join('');
  for (const [gx, gy, gh, sd] of [[20, 1006, 120, 1], [70, 1006, 90, 2], [130, 1006, 64, 3], [880, 1006, 90, 4], [940, 1006, 70, 5], [300, 1006, 50, 6], [620, 1006, 54, 7]]) body += grass(gx, gy, { h: gh, n: 6, seed: sd, fill: '#55695F' });
  // lavender sprigs framing the lower left
  for (const [lx, lh, ll] of [[34, 210, 12], [64, 170, 26], [96, 230, 20], [128, 150, 34], [16, 140, -6], [160, 110, 30]]) {
    const tx = lx + ll;
    const ty = 1010 - lh;
    body += path(`M${lx},1010 Q${lx + ll * 0.2},${1010 - lh * 0.5} ${tx},${ty}`, { fill: 'none', stroke: '#5E7466', 'stroke-width': 3.5, 'stroke-linecap': 'round' });
    for (let k = 0; k < 7; k++) {
      const t = 1 - k * 0.07;
      const bx = lx + (tx - lx) * t + ll * 0.02 * k;
      const by = 1010 - lh * t;
      body += ellipse(bx - 4, by + 2, 5, 8, { fill: k % 2 ? '#9C7FC6' : '#B497D8', transform: `rotate(-25 ${r1(bx - 4)} ${r1(by + 2)})` });
      body += ellipse(bx + 4, by + 5, 5, 8, { fill: k % 2 ? '#B497D8' : '#8A6CB8', transform: `rotate(25 ${r1(bx + 4)} ${r1(by + 5)})` });
    }
  }
  body += grass(200, 1006, { h: 70, n: 6, seed: 11, fill: '#55695F' });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
