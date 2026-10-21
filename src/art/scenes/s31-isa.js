// The miracles of Isa (Quran 3:49, 5:110-115).
// On a spring day, a row of little birds shaped from clay sits on a flat
// stone; by Allah's permission some of them become real, colourful birds
// and fly up into the sky along a trail of sparkles. Behind lies a hilly
// town among olive trees, and far away in the sky a cloth-covered table
// comes down in soft light (5:114). No one is shown - no hands.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, tree, cypress, bush, grass, flower, house, rays, eye, T, r1,
} from '../lib.js';

const line = (c, w, a = {}) => ({ fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a });
const CLAY = { body: '#C9785A', dark: '#A65E46', light: '#E09A7B', line: '#94523D' };

// A little bird shaped from clay, sitting on its round base, facing right.
// (x, y) = bottom centre. `glowing` adds the first touches of colour.
function clayBird(x, y, s = 1, { tint, open = 0 } = {}) {
  const P = [];
  const col = (c, t) => (tint ? mix(c, tint, t) : c);
  P.push(ellipse(2, 0, 34, 7, { fill: C.ink, opacity: 0.15 }));
  // tail
  P.push(path('M-26,-22 L-50,-34 L-46,-16Z', { fill: col(CLAY.dark, 0.35) }));
  // body and head
  P.push(ellipse(0, -22, 30, 21, { fill: col(CLAY.body, 0.5) }));
  P.push(circle(22, -40, 15, { fill: col(CLAY.body, 0.5) }));
  P.push(path('M-26,-14 C-14,0 16,0 28,-14 C24,-2 12,2 0,2 C-14,2 -24,-4 -26,-14Z', { fill: col(CLAY.dark, 0.3), opacity: 0.7 }));
  // beak
  P.push(path('M34,-43 L46,-39 L34,-35Z', { fill: col(CLAY.dark, 0.6) }));
  // wing, scratched into the clay (or lifting when coming to life)
  if (open) {
    P.push(path(`M-8,-30 C-4,${-30 - 34 * open} 18,${-34 - 40 * open} 30,${-36 - 40 * open} C22,${-24 - 20 * open} 14,-22 4,-18Z`, { fill: col(CLAY.dark, 0.6) }));
  } else {
    P.push(path('M-16,-30 C-4,-38 14,-32 12,-20 C4,-14 -12,-16 -18,-22Z', { fill: CLAY.dark, opacity: 0.55 }));
    P.push(path('M-10,-26 Q0,-28 6,-22 M-12,-21 Q-2,-22 4,-17', line(CLAY.line, 1.6, { opacity: 0.6 })));
  }
  if (!tint) for (const [dx, dy] of [[-14, -16], [6, -12], [-4, -28], [18, -26], [24, -50]]) P.push(circle(dx, dy, 1.3, { fill: CLAY.line, opacity: 0.45 }));
  // highlight and a little pressed-in eye
  P.push(ellipse(-8, -34, 10, 5, { fill: col(CLAY.light, 0.4), opacity: 0.8, transform: 'rotate(-15 -8 -34)' }));
  P.push(ellipse(16, -48, 5, 3, { fill: col(CLAY.light, 0.4), opacity: 0.8 }));
  if (tint) P.push(eye(26, -42, 3.4));
  else P.push(circle(26, -42, 3, { fill: CLAY.line }), circle(26.6, -42.6, 1, { fill: CLAY.light, opacity: 0.8 }));
  return g({ transform: T(x, y, s) }, P);
}

// A real, living bird flying up with both wings raised, facing right.
// (x, y) = body centre.
function liveBird(x, y, s, { body, wing, belly, rot = -20, beak = C.gold2 } = {}) {
  const P = [];
  // far wing
  P.push(path('M-4,-8 C-6,-46 10,-74 26,-84 C30,-60 26,-30 12,-6Z', { fill: mix(wing, '#000000', 0.12) }));
  // tail feathers
  P.push(path('M-30,2 L-62,-6 L-58,8 L-64,18 L-28,12Z', { fill: wing }));
  // body and head
  P.push(ellipse(0, 0, 34, 20, { fill: body }));
  P.push(path('M-26,8 C-10,22 18,22 30,8 C22,20 6,24 -6,22 C-18,20 -24,14 -26,8Z', { fill: belly }));
  P.push(circle(28, -10, 15, { fill: body }));
  P.push(path('M40,-14 L54,-10 L40,-5Z', { fill: beak }));
  // near wing, raised
  P.push(path('M-14,-6 C-26,-44 -12,-78 6,-92 C16,-66 18,-34 10,-4Z', { fill: wing }));
  P.push(path('M-8,-30 C-6,-50 0,-68 6,-80', line(mix(wing, '#FFFFFF', 0.35), 3, { opacity: 0.8 })));
  P.push(eye(32, -13, 3.6));
  P.push(ellipse(35, -4, 4.5, 2.8, { fill: C.cheek, opacity: 0.7 }));
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})` }, P);
}

// A small table spread with a white cloth, coming down in soft light.
// (x, y) = centre of the table top.
function heavenTable(x, y, s, glowId) {
  const P = [];
  P.push(circle(0, 10, 150, { fill: `url(#${glowId})` }));
  P.push(rays(0, 0, { n: 9, len: 130, spread: 150, dir: 90, width: 6, color: '#FFF6DC', op: 0.22 }));
  // legs
  P.push(path('M-34,10 L-38,52 M34,10 L38,52 M-12,14 L-12,56 M12,14 L12,56', line(C.wood2, 5)));
  // cloth top and drape with a scalloped hem
  P.push(ellipse(0, 0, 52, 13, { fill: C.white }));
  P.push(path('M-52,0 L-56,24 Q-49,30 -42,24 Q-35,32 -28,25 Q-21,32 -14,26 Q-7,33 0,26 Q7,33 14,26 Q21,32 28,25 Q35,32 42,24 Q49,30 56,24 L52,0 C40,12 -40,12 -52,0Z', { fill: C.wool0 }));
  P.push(path('M-52,0 L-56,24 Q-49,30 -42,24 Q-35,32 -28,25 L-28,8 C-38,7 -46,4 -52,0Z', { fill: C.wool2, opacity: 0.7 }));
  // a little food on it: round loaves and fruit
  P.push(ellipse(-20, -6, 14, 8, { fill: C.sand3 }), ellipse(-22, -9, 7, 3, { fill: C.sand1 }));
  P.push(ellipse(12, -8, 12, 7, { fill: C.sand3 }), ellipse(10, -11, 6, 2.6, { fill: C.sand1 }));
  P.push(circle(34, -8, 6, { fill: C.coral3 }), circle(30, -4, 5, { fill: C.gold2 }));
  return g({ transform: T(x, y, s) }, P);
}

// A sprig of almond blossom. (x, y) = branch start, growing toward `to`.
function blossomBranch(pts, R) {
  let s = path(smooth(pts), line(C.wood3, 14));
  s += path(smooth(pts), line(C.wood2, 6, { opacity: 0.6 }));
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i];
    for (let k = 0; k < 3; k++) {
      const bx = px + R.range(-34, 34);
      const by = py + R.range(-30, 26);
      s += path(`M${r1(px)},${r1(py)} Q${r1((px + bx) / 2)},${r1((py + by) / 2 - 8)} ${r1(bx)},${r1(by)}`, line(C.wood3, 4));
      s += flower(bx, by, { r: R.range(13, 18), fill: R() < 0.5 ? C.white : C.rose0, center: C.rose2, rot: R() * 70 });
    }
  }
  return s;
}

export default function render() {
  const id = ids('s31');
  const R = rng(31);
  const defs = [
    linear(id('sky'), [[0, '#86C6E2'], [0.45, '#B8E1EE'], [0.8, '#E3F4F0'], [1, '#F6FBEA']]),
    linear(id('field'), [[0, '#B6DB92'], [1, '#86C774']]),
    radial(id('stoneTop'), [[0, '#F1ECE3'], [1, '#CFC6B8']], { cx: 0.35, cy: 0.3, r: 0.8 }),
    glowDef(id('tableGlow'), '#FFF7DC', 0.85),
    glowDef(id('wonder'), '#FFF3C8', 0.75),
    radial(id('haze'), [[0, '#F3FAF2', 0.8], [1, '#F3FAF2', 0]]),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');
  const far = (c, t = 0.55) => mix(c, '#D2EAEE', t);
  const mid = (c, t = 0.28) => mix(c, '#D2EAEE', t);
  let body = '';

  // ------------------------------------------------ spring sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += cloud(560, 140, 190, { fill: C.white, shade: '#D5ECF2', seed: 2, opacity: 0.95 });
  body += cloud(160, 380, 150, { fill: C.white, shade: '#D5ECF2', seed: 5, opacity: 0.85 });
  body += cloud(840, 420, 130, { fill: C.white, shade: '#D5ECF2', seed: 8, opacity: 0.8 });
  // the table coming down from the sky, small and far away
  body += heavenTable(250, 150, 0.8, id('tableGlow'));

  // ------------------------------------------------ hills and the town among olive trees
  body += path(ridge([[-20, 520], [140, 486], [320, 506], [520, 470], [720, 498], [880, 474], [1020, 492]]), { fill: far(C.leaf3, 0.6) });
  body += ellipse(500, 520, 620, 50, { fill: `url(#${id('haze')})` });
  body += path(ridge([[-20, 566], [160, 540], [380, 556], [560, 528], [760, 546], [1020, 530]]), { fill: mid(C.leaf2, 0.4) });
  // the town on the hill, right of centre
  const townHouses = [[560, 540, 64, 46, 0], [620, 532, 56, 58, 30], [684, 538, 70, 44, 0], [744, 530, 52, 54, 0], [804, 540, 66, 42, 26], [870, 534, 58, 52, 0], [930, 544, 64, 40, 0], [600, 568, 70, 40, 0], [668, 574, 62, 46, 0], [736, 570, 76, 40, 0], [812, 572, 60, 44, 0], [882, 576, 70, 38, 0]];
  for (const [hx, hy, hw, hh, dome] of townHouses) {
    body += house(hx, hy, { w: hw, h: hh, fill: mid(C.sand0, 0.25), dark: mid(C.stone1, 0.3), door: mid(C.wood3, 0.35), windows: 1, dome: dome || undefined, domeColor: mid(C.cream, 0.15) });
  }
  // olive trees and cypresses around the town
  for (const [tx, ty, tr, sd] of [[520, 590, 30, 1], [960, 596, 32, 2], [452, 584, 26, 3], [700, 608, 28, 4], [846, 612, 30, 5], [560, 612, 24, 6]]) {
    body += tree(tx, ty, { r: tr, trunkH: tr * 0.7, seed: sd, leaf: mid('#9DB98A', 0.2), leafDark: mid('#7E9C72', 0.2), leafLight: mid('#BFD3AC', 0.2), trunk: mid(C.wood3, 0.2) });
  }
  for (const [cx, cy, ch] of [[480, 566, 80], [910, 560, 90], [640, 590, 70]]) body += cypress(cx, cy, { h: ch, w: 22, fill: mid(C.leaf5, 0.25), light: mid(C.leaf4, 0.25) });

  // ------------------------------------------------ olive groves on the near hills
  body += path(ridge([[-20, 640], [180, 610], [400, 630], [620, 616], [820, 636], [1020, 620]]), { fill: mid(C.leaf2, 0.15) });
  for (const [tx, ty, tr, sd] of [[60, 660, 46, 11], [170, 650, 40, 12], [290, 662, 44, 13], [880, 668, 46, 14], [980, 660, 40, 15]]) {
    body += tree(tx, ty, { r: tr, trunkH: tr * 0.8, seed: sd, leaf: '#9DBA8C', leafDark: '#7C9C70', leafLight: '#C9DCB8', trunk: C.wood3 });
  }
  body += path(ridge([[-20, 690], [240, 676], [520, 690], [780, 674], [1020, 688]]), { fill: `url(#${id('field')})` });
  // an almond tree in spring blossom framing the left side
  body += path('M70,760 C76,700 64,640 40,600 M62,690 C90,650 120,630 150,622 M52,640 C30,610 10,600 -10,596', line(C.wood3, 16));
  body += path('M70,760 C76,700 64,640 40,600', line(C.wood2, 6, { opacity: 0.6 }));
  {
    const RB = rng(55);
    for (const [cx, cy, rr] of [[40, 560, 90], [140, 590, 70], [-20, 600, 70], [90, 500, 70]]) body += circle(cx, cy, rr, { fill: '#F7D9E0' });
    for (const [cx, cy, rr] of [[60, 540, 60], [150, 570, 46], [100, 480, 44]]) body += circle(cx, cy, rr, { fill: '#FCEAEE' });
    for (let k = 0; k < 38; k++) {
      const a = RB() * Math.PI * 2;
      const d = Math.sqrt(RB()) * 120;
      body += flower(50 + Math.cos(a) * d * 1.1, 560 + Math.sin(a) * d * 0.7, { r: RB.range(8, 12), fill: RB() < 0.55 ? C.white : C.rose0, center: C.rose2, rot: RB() * 70 });
    }
  }

  // ------------------------------------------------ the flat stone with the clay birds
  body += glow(600, 640, 300, id('wonder'));
  body += ellipse(490, 856, 290, 26, { fill: C.ink, opacity: 0.14 });
  body += path('M214,790 C210,822 234,848 274,852 L712,854 C752,850 776,824 770,790Z', { fill: C.stone2 });
  body += path('M214,790 C210,822 234,848 274,852 L470,853 C420,840 300,834 214,790Z', { fill: C.stone1, opacity: 0.7 });
  body += path(blob([[214, 790], [252, 752], [490, 740], [734, 750], [770, 790], [490, 810]]), { fill: `url(#${id('stoneTop')})` });
  body += ellipse(330, 762, 50, 8, { fill: C.white, opacity: 0.5 });
  // a little pot of wet clay beside them
  body += path('M212,792 C204,768 212,754 226,752 L258,752 C272,754 280,768 272,792Z', { fill: C.rock3 }) + ellipse(242, 752, 17, 5, { fill: CLAY.line }) + ellipse(242, 751, 11, 3, { fill: CLAY.body });
  // the row: clay birds still sitting, then one coming to life
  body += clayBird(344, 784, 1.22);
  body += clayBird(454, 780, 1.22);
  body += clayBird(564, 780, 1.22);
  body += circle(676, 736, 92, { fill: `url(#${id('wonder')})` });
  body += clayBird(674, 782, 1.22, { tint: C.gold2, open: 0.8 });
  for (const [sx, sy, ss] of [[622, 690, 10], [708, 684, 14], [668, 656, 8], [730, 744, 7], [606, 742, 6]]) body += sparkle(sx, sy, ss, C.white, { opacity: 0.95 });

  // ------------------------------------------------ living birds flying up along a trail of sparkles
  const trail = [[700, 700], [720, 616], [762, 510], [814, 400], [852, 290], [880, 190]];
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const k = Math.min(trail.length - 2, Math.floor(t * (trail.length - 1)));
    const f = t * (trail.length - 1) - k;
    const px = trail[k][0] * (1 - f) + trail[k + 1][0] * f + Math.sin(i * 1.7) * 14;
    const py = trail[k][1] * (1 - f) + trail[k + 1][1] * f;
    body += i % 3 === 0 ? sparkle(px, py, 6 + (i % 2) * 3, '#FFF2C4', { opacity: 0.95 }) : circle(px, py, 2.6, { fill: '#FFF2C4', opacity: 0.9 });
  }
  body += liveBird(722, 600, 1, { body: C.coral1, wing: C.coral2, belly: C.coral0, rot: -30 });
  body += liveBird(790, 462, 1.05, { body: C.sky1, wing: C.sky0, belly: C.sky3, rot: -22 });
  body += liveBird(850, 318, 0.9, { body: C.gold1, wing: C.gold2, belly: C.gold0, rot: -26 });
  body += liveBird(884, 196, 0.72, { body: C.rose1, wing: C.rose2, belly: C.rose0, rot: -20 });

  // ------------------------------------------------ spring flowers and grass in front
  for (const [gx, gy, gh, sd] of [[60, 900, 50, 1], [150, 960, 44, 2], [350, 900, 30, 3], [640, 910, 34, 4], [860, 940, 48, 5], [950, 880, 44, 6], [500, 970, 36, 7], [20, 1000, 90, 8], [90, 1004, 70, 9], [980, 1000, 96, 10], [910, 1004, 70, 11]]) body += grass(gx, gy, { h: gh, n: 7, seed: sd, fill: R() < 0.5 ? C.leaf4 : C.leaf3 });
  const anemone = (fx, fy, fr) => flower(fx, fy, { r: fr, fill: C.coral3, center: C.ink2, petals: 6 }) + circle(fx, fy, fr * 0.2, { fill: C.ink });
  for (const [fx, fy, fr] of [[100, 880, 16], [190, 930, 14], [880, 900, 16], [930, 960, 13], [420, 920, 10], [740, 930, 11]]) body += anemone(fx, fy, fr);
  // a clump of tall anemones and a small bush framing the bottom right
  body += bush(935, 1012, { w: 170, fill: C.leaf3, dark: C.leaf4, light: C.leaf2, seed: 6 });
  for (const [sx, sy, ex, ey, fr] of [[930, 1004, 900, 846, 20], [960, 1004, 958, 820, 17], [890, 1004, 850, 888, 15], [990, 1004, 1004, 870, 15]]) {
    body += path(`M${sx},${sy} Q${(sx + ex) / 2 + 10},${(sy + ey) / 2} ${ex},${ey}`, line(C.leaf4, 4));
    body += anemone(ex, ey, fr);
  }
  for (const [fx, fy, fr] of [[60, 950, 13], [250, 900, 11], [820, 960, 12], [970, 920, 11], [560, 950, 9]]) body += flower(fx, fy, { r: fr, fill: C.white, center: C.gold2 });
  for (const [fx, fy, fr] of [[290, 960, 10], [690, 970, 10], [130, 990, 11]]) body += flower(fx, fy, { r: fr, fill: C.gold1, center: C.gold3 });


  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
