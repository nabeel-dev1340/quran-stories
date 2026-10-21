// The yellow cow (Quran 2:67-71).
// A beautiful, bright golden-yellow cow, "pleasing to all who see her",
// healthy and unblemished - one even colour with no patch or spot (2:71),
// never yoked to plough or water-wheel - standing proudly in a green meadow
// with flowers and butterflies; a village on the hill behind. Sunny and bold.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, farBird, tree, palm, house, grass, flower, bush, r1, eye, T,
} from '../lib.js';

// The golden cow, body in profile facing right, head turned to us.
// (x, y) = ground between the feet; s = 1 is about 480 px wide.
function goldenCow(x, y, id, s = 1) {
  const coat = `url(#${id('coat')})`;
  const shade = '#E5A63E';
  const deep = '#CF8F30';
  const light = '#FFEAA6';
  const hoof = '#8E5E2A';
  const p = [];
  p.push(ellipse(4, 4, 220, 22, { fill: C.leaf6, opacity: 0.22 }));
  // far legs (a step behind, in shade)
  const hindLeg = (dx) => `M${-176 + dx},-150 C${-172 + dx},-112 ${-156 + dx},-84 ${-146 + dx},-58 L${-144 + dx},-20 L${-108 + dx},-20 L${-108 + dx},-60 C${-104 + dx},-92 ${-98 + dx},-124 ${-96 + dx},-152Z`;
  const foreLeg = (dx) => `M${96 + dx},-140 C${98 + dx},-104 ${104 + dx},-80 ${106 + dx},-56 L${106 + dx},-20 L${142 + dx},-20 L${142 + dx},-58 C${144 + dx},-92 ${150 + dx},-116 ${160 + dx},-140Z`;
  p.push(path(hindLeg(74), { fill: shade }), path(foreLeg(-66), { fill: shade }));
  p.push(rect(-72, -24, 38, 26, { rx: 9, fill: mix(hoof, '#000000', 0.18) }), rect(38, -24, 38, 26, { rx: 9, fill: mix(hoof, '#000000', 0.18) }));
  // tail with a soft tuft
  p.push(path('M-176,-246 C-200,-214 -204,-160 -196,-108', { fill: 'none', stroke: shade, 'stroke-width': 10, 'stroke-linecap': 'round' }));
  p.push(path('M-196,-120 C-212,-104 -210,-76 -196,-66 C-182,-76 -180,-104 -196,-120Z', { fill: deep }));
  // body: hip bump, gentle back, round barrel, deep chest
  p.push(path('M-140,-270 C-92,-262 -30,-256 30,-260 C72,-262 104,-270 126,-276 C166,-272 196,-242 200,-200 C204,-160 188,-120 152,-106 C112,-90 40,-84 -20,-84 C-80,-84 -122,-92 -152,-106 C-180,-120 -192,-162 -190,-206 C-188,-242 -172,-266 -140,-270Z', { fill: coat }));
  // soft modelling: belly shade, back light, a little dip behind the shoulder
  p.push(path('M-170,-130 C-150,-104 -110,-94 -40,-92 C40,-92 120,-96 176,-124 C164,-104 120,-88 40,-86 L-20,-86 C-90,-86 -150,-100 -170,-130Z', { fill: deep, opacity: 0.4 }));
  p.push(path('M-150,-262 C-110,-258 -40,-252 30,-254 C80,-256 110,-264 130,-270 C110,-262 76,-252 30,-248 C-40,-244 -110,-250 -150,-262Z', { fill: light, opacity: 0.85 }));
  p.push(path('M-160,-246 C-150,-262 -132,-268 -112,-266 C-128,-260 -144,-252 -160,-246Z', { fill: C.white, opacity: 0.5 }));
  // near legs: hind thigh flowing into the leg, straight foreleg
  p.push(path(hindLeg(0), { fill: coat }));
  p.push(path('M-176,-150 C-172,-112 -156,-84 -146,-58 L-140,-58 C-150,-90 -160,-118 -164,-150Z', { fill: light, opacity: 0.6 }));
  p.push(path(foreLeg(0), { fill: coat }));
  p.push(path('M100,-130 C102,-100 106,-80 110,-58 L116,-58 C114,-84 110,-104 110,-130Z', { fill: light, opacity: 0.6 }));
  p.push(ellipse(-126, -66, 14, 9, { fill: shade, opacity: 0.45 }), ellipse(124, -62, 14, 9, { fill: shade, opacity: 0.45 }));
  p.push(rect(-146, -24, 40, 26, { rx: 9, fill: hoof }), rect(104, -24, 40, 26, { rx: 9, fill: hoof }));
  p.push(path('M-126,-20 L-126,2 M124,-20 L124,2', { stroke: mix(hoof, '#000000', 0.3), 'stroke-width': 2.5 }));
  p.push(rect(-140, -22, 14, 5, { rx: 2.5, fill: '#B98552' }), rect(110, -22, 14, 5, { rx: 2.5, fill: '#B98552' }));
  // neck rising proudly, with a soft dewlap
  p.push(path('M108,-268 C140,-296 168,-326 188,-352 L272,-312 C262,-262 236,-214 200,-186 C178,-170 150,-170 138,-190 C124,-214 112,-240 108,-268Z', { fill: coat }));
  p.push(path('M200,-186 C230,-210 254,-250 266,-296 C268,-250 246,-206 212,-180Z', { fill: shade, opacity: 0.5 }));
  p.push(path('M188,-200 C196,-180 194,-160 182,-140', { fill: 'none', stroke: deep, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.35 }));
  // ---- head, turned toward us
  const hx = 238;
  const hy = -342;
  const k = 1.14;
  const H = (dx, dy) => `${r1(hx + dx * k)},${r1(hy + dy * k)}`;
  p.push(ellipse(hx - 82 * k, hy - 18 * k, 40 * k, 16 * k, { fill: coat, transform: `rotate(-16 ${r1(hx - 82 * k)} ${r1(hy - 18 * k)})` }));
  p.push(ellipse(hx - 86 * k, hy - 17 * k, 25 * k, 8 * k, { fill: '#F7B9A6', transform: `rotate(-16 ${r1(hx - 86 * k)} ${r1(hy - 17 * k)})` }));
  p.push(ellipse(hx + 82 * k, hy - 18 * k, 40 * k, 16 * k, { fill: shade, transform: `rotate(16 ${r1(hx + 82 * k)} ${r1(hy - 18 * k)})` }));
  p.push(ellipse(hx + 86 * k, hy - 17 * k, 25 * k, 8 * k, { fill: '#F2AE9C', transform: `rotate(16 ${r1(hx + 86 * k)} ${r1(hy - 17 * k)})` }));
  // small ivory horns
  p.push(path(`M${H(-34, -52)} C${H(-44, -70)} ${H(-52, -82)} ${H(-64, -90)} C${H(-54, -72)} ${H(-46, -58)} ${H(-22, -46)}Z`, { fill: '#FFF3D6' }));
  p.push(path(`M${H(34, -52)} C${H(44, -70)} ${H(52, -82)} ${H(64, -90)} C${H(54, -72)} ${H(46, -58)} ${H(22, -46)}Z`, { fill: '#F0DDB6' }));
  p.push(path(`M${H(-52, -76)} C${H(-56, -82)} ${H(-60, -86)} ${H(-64, -90)} C${H(-58, -82)} ${H(-54, -78)} ${H(-48, -72)}Z`, { fill: '#D9B47E' }));
  p.push(path(`M${H(52, -76)} C${H(56, -82)} ${H(60, -86)} ${H(64, -90)} C${H(58, -82)} ${H(54, -78)} ${H(48, -72)}Z`, { fill: '#C9A26C' }));
  // head shape
  p.push(path(`M${H(-60, -30)} C${H(-62, -66)} ${H(62, -66)} ${H(60, -30)} C${H(58, 4)} ${H(50, 30)} ${H(46, 50)} L${H(-46, 50)} C${H(-50, 30)} ${H(-58, 4)} ${H(-60, -30)}Z`, { fill: coat }));
  p.push(path(`M${H(30, -60)} C${H(58, -52)} ${H(62, -20)} ${H(56, 10)} C${H(52, 30)} ${H(48, 44)} ${H(46, 50)} L${H(34, 50)} C${H(44, 20)} ${H(50, -20)} ${H(30, -60)}Z`, { fill: shade, opacity: 0.4 }));
  p.push(g({ fill: '#FFD86E' }, circle(hx - 16 * k, hy - 54 * k, 13 * k), circle(hx + 2 * k, hy - 60 * k, 14 * k), circle(hx + 18 * k, hy - 53 * k, 12 * k)));
  p.push(circle(hx - 6 * k, hy - 62 * k, 6 * k, { fill: light, opacity: 0.85 }));
  // muzzle (a paler tint of the same gold) with nostrils and a smile
  p.push(ellipse(hx, hy + 44 * k, 58 * k, 36 * k, { fill: '#FFE39A' }));
  p.push(ellipse(hx - 8 * k, hy + 34 * k, 34 * k, 14 * k, { fill: '#FFF1C8', opacity: 0.8 }));
  p.push(ellipse(hx - 22 * k, hy + 42 * k, 8 * k, 6 * k, { fill: '#B07433', transform: `rotate(-14 ${r1(hx - 22 * k)} ${r1(hy + 42 * k)})` }));
  p.push(ellipse(hx + 22 * k, hy + 42 * k, 8 * k, 6 * k, { fill: '#B07433', transform: `rotate(14 ${r1(hx + 22 * k)} ${r1(hy + 42 * k)})` }));
  p.push(path(`M${H(-18, 60)} Q${H(0, 70)} ${H(18, 60)}`, { fill: 'none', stroke: '#B07433', 'stroke-width': 3.8, 'stroke-linecap': 'round' }));
  for (const ex of [-26, 26]) {
    const cx = hx + ex * k;
    const cy = hy - 10 * k;
    p.push(eye(cx, cy, 9.4));
    const out = ex < 0 ? -1 : 1;
    p.push(path(`M${r1(cx + out * 7)},${r1(cy - 8)} l${out * 8},-6 M${r1(cx + out * 10)},${r1(cy - 2)} l${out * 9},-3`, { stroke: C.ink, 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
  }
  p.push(ellipse(hx - 42 * k, hy + 14 * k, 13, 7.5, { fill: C.cheek, opacity: 0.7 }), ellipse(hx + 42 * k, hy + 14 * k, 13, 7.5, { fill: C.cheek, opacity: 0.7 }));
  return g({ transform: T(x, y, s) }, p);
}

// A sweet butterfly. (x, y) = body centre.
function butterfly(x, y, { s = 1, rot = 0, wing = C.rose1, wing2 = C.rose0, spot = C.white } = {}) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${r1(s)})` },
    ellipse(-15, -12, 16, 13, { fill: wing, transform: 'rotate(-28 -15 -12)' }),
    ellipse(15, -12, 16, 13, { fill: wing, transform: 'rotate(28 15 -12)' }),
    ellipse(-11, 9, 10, 9, { fill: wing2, transform: 'rotate(20 -11 9)' }),
    ellipse(11, 9, 10, 9, { fill: wing2, transform: 'rotate(-20 11 9)' }),
    circle(-17, -14, 4, { fill: spot, opacity: 0.85 }), circle(17, -14, 4, { fill: spot, opacity: 0.85 }),
    ellipse(0, 0, 3.4, 14, { fill: C.ink2 }),
    path('M-1,-12 Q-6,-24 -10,-26 M1,-12 Q6,-24 10,-26', { fill: 'none', stroke: C.ink2, 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
    circle(-10, -26, 2, { fill: C.ink2 }), circle(10, -26, 2, { fill: C.ink2 }),
  );
}

export default function render() {
  const id = ids('s23');
  const R = rng(23);
  const defs = [
    linear(id('sky'), [[0, '#5FB4DC'], [0.45, '#9AD5EA'], [1, '#DDF2EE']], { x2: 0, y2: 600, units: 'userSpaceOnUse' }),
    glowDef(id('sunGlow'), '#FFF3C8', 0.8),
    linear(id('meadow'), [[0, '#A8D98A'], [0.4, '#86C873'], [1, '#5FAE62']], { y1: 560, x2: 0, y2: 1000, units: 'userSpaceOnUse' }),
    linear(id('coat'), [[0, '#FFD866'], [0.45, '#F9C64A'], [1, '#EDAF3A']], { x1: -160, y1: -300, x2: 200, y2: 0, units: 'userSpaceOnUse' }),
    radial(id('halo'), [[0, '#FFF6CC', 0.55], [1, '#FFF6CC', 0]]),
    vignetteDef(id('vig'), C.ink, 0.16),
  ].join('');

  const far = (c) => mix(c, '#CBE9EE', 0.42);
  const mid = (c) => mix(c, '#CBE9EE', 0.22);
  let body = '';
  // ---- sky
  body += rect(0, 0, 1000, 640, { fill: `url(#${id('sky')})` });
  body += sun(150, 130, 58, { glowId: id('sunGlow'), rays: 12, fill: '#FFE07E', core: '#FFF4CF', rayColor: '#FFE7A0' });
  body += cloud(470, 150, 220, { fill: C.white, shade: '#DDEFF4', seed: 3 });
  body += cloud(830, 230, 190, { fill: C.white, shade: '#DDEFF4', seed: 7, opacity: 0.95 });
  body += cloud(640, 80, 120, { fill: '#F8FCFC', shade: '#E2F1F4', seed: 12, opacity: 0.85 });
  for (const [bx, by, bs] of [[330, 250, 1], [360, 236, 0.8], [700, 300, 0.9]]) body += farBird(bx, by, bs, '#557A96', 0.5);

  // ---- far hills with the village on top
  body += path(ridge([[-20, 520], [80, 470], [200, 430], [310, 440], [420, 490], [540, 530], [700, 520], [820, 490], [940, 500], [1020, 486]], 700), { fill: far(C.leaf3) });
  // village: flat-roofed mud-brick houses, olive trees and palms on the hill
  const vil = [[90, 476, 70, 56], [150, 456, 60, 50], [214, 446, 76, 62], [282, 452, 58, 48], [340, 470, 64, 50], [184, 494, 64, 46], [252, 498, 56, 42]];
  for (const [hx, hy, hw, hh] of vil) body += house(hx, hy, { w: hw, h: hh, fill: far(C.sand1), dark: far(C.sand3), door: far(C.wood3), windows: hw > 62 ? 2 : 1 });
  body += palm(56, 492, { h: 110, seed: 8, dates: false, trunk: far(C.wood2), trunkDark: far(C.wood3), leaf: far(C.leaf3), leafMid: far(C.leaf4), leafDark: far(C.leaf5) });
  body += palm(390, 486, { h: 96, seed: 9, lean: -0.1, dates: false, trunk: far(C.wood2), trunkDark: far(C.wood3), leaf: far(C.leaf3), leafMid: far(C.leaf4), leafDark: far(C.leaf5) });
  for (const [tx, ty, tr] of [[120, 520, 30], [320, 522, 28], [430, 528, 24]]) body += tree(tx, ty, { r: tr, trunkH: 22, seed: tx, leaf: far('#8FB38A'), leafDark: far('#6F9A72'), leafLight: far('#B5CFA6'), trunk: far(C.wood2) });
  // nearer rolling hill on the right with olive trees
  body += path(ridge([[460, 600], [600, 556], [740, 540], [880, 548], [1020, 530]], 760), { fill: mid(C.leaf2) });
  for (const [tx, ty, tr] of [[720, 552, 34], [800, 550, 28], [900, 548, 36], [970, 540, 26]]) body += tree(tx, ty, { r: tr, trunkH: 26, seed: tx, leaf: mid('#88B47E'), leafDark: mid('#6A9A6E'), leafLight: mid('#AFD09A'), trunk: mid(C.wood2) });

  // ---- the meadow
  body += path(ridge([[-20, 618], [160, 600], [360, 612], [560, 596], [760, 608], [1020, 594]], 1000), { fill: `url(#${id('meadow')})` });
  // little flowers scattered across the meadow (smaller far away)
  const flowerCols = [C.white, C.rose1, C.coral1, C.gold1, C.plum1, C.white];
  for (let i = 0; i < 70; i++) {
    const fy = 624 + Math.pow(R(), 1.4) * 330;
    const fx = R() * 1000;
    const k = (fy - 600) / 400;
    body += flower(fx, fy, { r: 3 + k * 7, fill: flowerCols[i % flowerCols.length], center: C.gold2, rot: R() * 60 });
  }
  for (let i = 0; i < 26; i++) {
    const gy = 640 + R() * 320;
    body += grass(R() * 1000, gy, { h: 10 + ((gy - 600) / 400) * 26, fill: C.leaf4, n: 4, seed: i + 40 });
  }

  // ---- the golden cow, glowing softly with health
  body += ellipse(500, 640, 360, 300, { fill: `url(#${id('halo')})` });
  body += goldenCow(440, 850, id, 1.02);

  // ---- butterflies dancing around her
  body += butterfly(214, 600, { s: 1.15, rot: -14, wing: C.rose1, wing2: C.rose0 });
  body += butterfly(780, 380, { s: 1, rot: 16, wing: C.sky0, wing2: C.sky1 });
  body += butterfly(860, 720, { s: 1.2, rot: -8, wing: C.plum1, wing2: C.plum0 });
  body += butterfly(330, 404, { s: 0.8, rot: 20, wing: C.coral1, wing2: C.coral0 });
  for (const [sx, sy, ss] of [[600, 380, 10], [250, 470, 8], [740, 560, 9], [420, 360, 7]]) body += sparkle(sx, sy, ss, C.white, { opacity: 0.9 });

  // ---- foreground: tall grass and flowers framing the corners
  body += bush(60, 1004, { w: 180, fill: '#69B867', dark: '#4C9A5C', light: '#9DD27F', seed: 2 });
  body += bush(950, 1006, { w: 200, fill: '#69B867', dark: '#4C9A5C', light: '#9DD27F', seed: 6 });
  for (const [gx, gh, sd] of [[20, 120, 1], [110, 90, 2], [160, 70, 3], [880, 100, 4], [930, 130, 5], [990, 90, 6]]) body += grass(gx, 1006, { h: gh, fill: C.leaf4, n: 6, seed: sd, spread: 1.3 });
  for (const [fx, fy, fc, fr] of [[70, 924, C.rose1, 16], [140, 952, C.white, 14], [34, 970, C.gold1, 14], [196, 980, C.coral1, 12], [904, 930, C.coral1, 16], [964, 896, C.white, 14], [846, 968, C.rose1, 14], [790, 990, C.gold1, 11]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2, stemH: 34, petals: fc === C.white ? 8 : 5 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
