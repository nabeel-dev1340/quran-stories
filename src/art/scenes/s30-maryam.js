// Maryam and the date palm (Quran 19:22-26).
// A quiet, remote place at dawn: a tall date palm heavy with ripe
// golden-red dates, a few dates gently falling (19:25), and a little stream
// of fresh water flowing beneath it (19:24). Soft grass, flowers, birds and
// a folded blanket on the grass. No one is shown.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, palm, grass, flower, rock, bush, bird, flyingBird, farBird, eye, T, r1,
} from '../lib.js';

const line = (c, w, a = {}) => ({ fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a });
const DATE_COLS = ['#E8A23A', '#E0823C', '#D4683E', '#C9573F', '#B8483A', '#EFB54A'];

// One date (an oval fruit) with a little shine. (x, y) = centre.
function date(x, y, rx, ry, fill, rot = 0) {
  return g({ transform: `translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})` },
    ellipse(0, 0, rx, ry, { fill }),
    ellipse(rx * 0.3, ry * 0.2, rx * 0.55, ry * 0.75, { fill: mix(fill, '#5A2A1E', 0.25), opacity: 0.45 }),
    ellipse(-rx * 0.35, -ry * 0.35, rx * 0.28, ry * 0.3, { fill: C.white, opacity: 0.55 }),
  );
}

// A heavy hanging bunch of dates: an arched golden stalk and a dense,
// drooping cluster of oval fruit. (x, y) = where the stalk leaves the crown.
function dateBunch(x, y, { len = 130, w = 84, lean = 0, seed = 1, cols = DATE_COLS } = {}) {
  const R = rng(seed);
  const top = [x + lean * 0.55, y + len * 0.22];
  const tip = [x + lean, y + len];
  let s = path(`M${r1(x)},${r1(y)} Q${r1(x + lean * 0.5)},${r1(y - 18)} ${r1(top[0])},${r1(top[1])}`, line(C.gold3, 8));
  const items = [];
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    const v = r / (rows - 1);
    const cy = top[1] + (tip[1] - top[1]) * v;
    const cx = top[0] + (tip[0] - top[0]) * v;
    const half = w * 0.5 * Math.sin(Math.PI * (0.25 + v * 0.75)) + 6;
    const n = Math.max(2, Math.round(half / 9));
    for (let k = 0; k < n; k++) {
      const u = n === 1 ? 0 : k / (n - 1) - 0.5;
      items.push([cx + u * 2 * half * 0.86 + R.range(-3, 3), cy + R.range(-4, 4) + Math.abs(u) * 6, r]);
    }
  }
  // strands peeking between the fruit
  for (let k = -2; k <= 2; k++) s += path(`M${r1(top[0])},${r1(top[1])} Q${r1(top[0] + k * w * 0.18)},${r1(top[1] + len * 0.3)} ${r1(tip[0] + k * w * 0.12)},${r1(tip[1] - 6)}`, line(C.gold4, 2.2, { opacity: 0.7 }));
  items.sort((p1, p2) => p1[1] - p2[1]);
  for (const [px, py, r] of items) s += date(px, py, 9.5, 13.5, cols[(r + Math.floor(R() * 2)) % cols.length], R.range(-14, 14));
  return s;
}

// A soft blanket folded into a neat stack, seen at three-quarters: cream
// wool with rose stripes running across the folds. (x, y) = front-left foot.
function blanket(x, y, s = 1, clipId) {
  const P = [];
  const wool = '#FBEFE3';
  const woolD = '#EBD6C6';
  const rose = '#EE9DB2';
  P.push(ellipse(80, 6, 116, 14, { fill: C.ink, opacity: 0.16 }));
  // right side: the folded edges, rounded and in shade
  P.push(path('M150,-34 C160,-40 176,-50 184,-54 C190,-40 190,-14 184,-4 C176,0 162,6 152,8 C158,-6 158,-24 150,-34Z', { fill: woolD }));
  for (const t of [0.33, 0.66]) P.push(path(`M${r1(152 + 4 * t)},${r1(-34 + 42 * t)} C166,${r1(-40 + 42 * t)} 178,${r1(-48 + 40 * t)} 186,${r1(-52 + 46 * t)}`, line(C.white, 3, { opacity: 0.8 })));
  // front: three soft folds, with stripes running across them
  const front = 'M0,-36 L150,-34 C158,-24 158,-6 152,8 L4,6 C-4,-6 -6,-24 0,-36Z';
  P.push(`<clipPath id="${clipId}"><path d="${front}"/></clipPath>`);
  P.push(path(front, { fill: wool }));
  let stripes = '';
  for (const sx of [22, 70, 118]) stripes += rect(sx, -40, 14, 50, { fill: rose }) + rect(sx + 18, -40, 4, 50, { fill: rose, opacity: 0.7 });
  P.push(g({ 'clip-path': `url(#${clipId})` }, stripes));
  P.push(path('M-2,-24 C50,-20 100,-20 156,-22 M-3,-10 C50,-6 100,-6 157,-8', line(woolD, 3.4)));
  P.push(path('M-1,-21 C50,-17 100,-17 156,-19 M-2,-7 C50,-3 100,-3 157,-5', line(C.white, 2, { opacity: 0.8 })));
  // top face with the same stripes in perspective
  P.push(path('M0,-36 C20,-46 30,-54 44,-58 L182,-56 C186,-56 186,-54 184,-54 C176,-50 160,-40 150,-34Z', { fill: wool }));
  for (const sx of [22, 70, 118]) P.push(path(`M${sx},-35.7 L${r1(sx + 44)},-57.5 L${r1(sx + 58)},-57.3 L${sx + 14},-35.5Z`, { fill: rose }));
  P.push(path('M2,-37 L150,-35', line(C.white, 2.6, { opacity: 0.8 })));
  return g({ transform: T(x, y, s) }, P);
}

export default function render() {
  const id = ids('s30');
  const R = rng(30);
  const defs = [
    linear(id('sky'), [[0, '#C8B2E2'], [0.35, '#EDB8C8'], [0.7, '#FFD2B4'], [1, '#FFEACB']]),
    linear(id('stream'), [[0, '#BFE6E4'], [0.5, '#8ED3D6'], [1, '#5FBFCB']], { x1: 1, y1: 0, x2: 0, y2: 1 }),
    linear(id('meadow'), [[0, '#BFD9A0'], [1, '#93C47F']]),
    linear(id('bank'), [[0, '#A9D38C'], [1, '#7CBF73']]),
    glowDef(id('sunGlow'), '#FFF0D0', 0.85),
    glowDef(id('mercy'), '#FFF4D8', 0.6),
    radial(id('mist'), [[0, '#FFF1E4', 0.85], [1, '#FFF1E4', 0]]),
    linear(id('mound'), [[0, '#CFE5B4', 0.8], [1, '#CFE5B4', 0]]),
    linear(id('near'), [[0, '#3F8F5C', 0], [1, '#3F8F5C', 0.32]]),
    vignetteDef(id('vig'), C.ink, 0.2),
  ].join('');
  const far = (c, t = 0.55) => mix(c, '#EBB7BE', t);
  const mid = (c, t = 0.28) => mix(c, '#EBB7BE', t);
  let body = '';

  // ------------------------------------------------ dawn sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(800, 560, 64, { fill: '#FFE4AE', core: '#FFF6DE', glowId: id('sunGlow') });
  body += cloud(640, 200, 200, { fill: '#FCE3DE', shade: '#F1C3C8', seed: 3, opacity: 0.95 });
  body += cloud(900, 310, 150, { fill: '#FFE7DC', shade: '#F6CDC6', seed: 7, opacity: 0.9 });
  body += cloud(820, 110, 110, { fill: '#FCE3DE', shade: '#F1C3C8', seed: 10, opacity: 0.8 });
  body += sparkle(560, 70, 8, C.white, { opacity: 0.8 }) + sparkle(960, 170, 7, C.white, { opacity: 0.7 });
  body += farBird(700, 380, 1.2, '#8C6A92', 0.55) + farBird(738, 362, 0.9, '#8C6A92', 0.5) + farBird(770, 392, 0.8, '#8C6A92', 0.45);

  // ------------------------------------------------ far hills of the remote place
  body += path(ridge([[-20, 560], [140, 520], [300, 548], [470, 514], [640, 548], [820, 530], [1020, 552]]), { fill: far(C.plum2, 0.5) });
  body += path(ridge([[-20, 592], [180, 572], [380, 590], [560, 568], [760, 590], [1020, 574]]), { fill: far(C.leaf3, 0.55) });
  body += ellipse(780, 590, 300, 40, { fill: `url(#${id('mist')})` });
  for (const [px, ph, sd] of [[620, 70, 2], [650, 54, 3], [930, 80, 4]]) body += palm(px, 600, { h: ph, seed: sd, dates: false, trunk: far(C.wood2, 0.45), trunkDark: far(C.wood3, 0.45), leaf: far(C.leaf3, 0.45), leafMid: far(C.leaf4, 0.45), leafDark: far(C.leaf5, 0.45) });

  // ------------------------------------------------ meadow
  body += path(ridge([[-20, 610], [200, 600], [460, 612], [720, 598], [1020, 608]]), { fill: `url(#${id('meadow')})` });

  // ------------------------------------------------ the little stream, from far away to right beneath the palm
  const leftBank = [[742, 606], [716, 632], [640, 664], [600, 700], [560, 752], [470, 800], [330, 850], [200, 920], [120, 1010]];
  const rightBank = [[758, 606], [748, 640], [690, 676], [664, 716], [640, 780], [560, 840], [430, 900], [340, 960], [330, 1010]];
  body += path(`${smooth(leftBank)} L${rightBank[rightBank.length - 1].join(',')} ${smooth(rightBank.slice().reverse()).replace(/^M[^C]*/, '')}Z`, { fill: `url(#${id('stream')})` });
  // ripples and dawn light on the water
  for (const [rx, ry, rw] of [[700, 650, 26], [640, 690, 30], [612, 740, 40], [540, 806, 56], [420, 864, 64], [300, 926, 70], [250, 978, 76], [590, 776, 26], [380, 892, 40]]) body += path(`M${rx - rw / 2},${ry} q${rw / 2},-6 ${rw},0`, line(C.white, 3, { opacity: 0.6 }));
  for (const [rx, ry] of [[560, 790], [330, 916]]) body += path(`M${rx - 26},${ry + 8} q26,-5 52,0`, line('#F7C9C7', 3, { opacity: 0.8 }));

  // ------------------------------------------------ banks: grass, pebbles, flowers
  // far bank (where the palm stands)
  body += path(`${smooth(leftBank)} L-20,1010 L-20,610Z`, { fill: `url(#${id('bank')})` });
  // near bank
  body += path(`${smooth(rightBank)} L1020,1010 L1020,606Z`, { fill: `url(#${id('bank')})` });
  // soft rolling mounds and bushes in the middle distance
  body += path(ridge([[-20, 646], [120, 626], [260, 640], [400, 680], [520, 740]], 740), { fill: `url(#${id('mound')})` });
  body += path(ridge([[690, 740], [790, 664], [880, 634], [1020, 640]], 740), { fill: `url(#${id('mound')})` });
  for (const [bx, by, bw, sd] of [[860, 640, 70, 2], [930, 646, 54, 3], [70, 652, 64, 4], [560, 628, 44, 5]]) {
    body += bush(bx, by, { w: bw, fill: mid(C.leaf3, 0.3), dark: mid(C.leaf4, 0.3), light: mid(C.leaf2, 0.3), seed: sd });
  }
  for (const [fx, fy] of [[846, 616], [872, 624], [940, 626], [56, 628], [86, 634]]) body += circle(fx, fy, 4, { fill: R() < 0.5 ? C.rose1 : C.white, opacity: 0.9 });
  body += rect(0, 700, 1000, 300, { fill: `url(#${id('near')})` });
  // pebbles along the water's edge
  for (let i = 0; i < 40; i++) {
    const t = R();
    const bank = R() < 0.5 ? leftBank : rightBank;
    const k = Math.min(bank.length - 2, Math.floor(t * (bank.length - 1)));
    const f = t * (bank.length - 1) - k;
    const px = bank[k][0] * (1 - f) + bank[k + 1][0] * f + R.range(-6, 6);
    const py = bank[k][1] * (1 - f) + bank[k + 1][1] * f + R.range(-3, 3);
    const pr = 2 + ((py - 600) / 400) * 6 * R.range(0.6, 1.2);
    body += ellipse(px, py, pr * 1.4, pr, { fill: R.pick(['#E6D7C4', '#D3C0AC', '#F2E6D6', '#C9B4A2']) });
  }

  // ------------------------------------------------ the date palm, heavy with dates
  body += glow(390, 330, 330, id('mercy'));
  body += ellipse(372, 806, 90, 14, { fill: C.ink, opacity: 0.15 });
  body += g({ transform: 'translate(720 0) scale(-1 1)' }, palm(360, 806, { h: 520, lean: -0.06, seed: 12, dates: false, trunk: '#B98250', trunkDark: '#8F5E38', leaf: mix(C.leaf3, '#F2B9B0', 0.12), leafMid: mix(C.leaf4, '#F2B9B0', 0.12), leafDark: mix(C.leaf5, '#F2B9B0', 0.1) }));
  // heavy bunches hanging just under the crown (crown top at about (396, 206))
  body += dateBunch(372, 300, { len: 150, w: 92, lean: -64, seed: 4, cols: ['#E9A43C', '#E58A3A', '#D86E3C', '#EFB54A'] });
  body += dateBunch(412, 302, { len: 156, w: 94, lean: 66, seed: 5, cols: ['#D86E3C', '#C9573F', '#E0823C', '#B8483A'] });
  body += dateBunch(392, 312, { len: 128, w: 80, lean: 4, seed: 6, cols: ['#E58A3A', '#EFB54A', '#D4683E'] });
  // a few dates gently falling, with soft sparkles
  for (const [dx, dy, rot] of [[286, 540, -20], [500, 560, 25], [450, 660, 10], [262, 690, -35]]) {
    body += path(`M${dx},${dy - 34} L${dx},${dy - 20}`, line(C.white, 3, { opacity: 0.7 })) + path(`M${dx - 9},${dy - 28} L${dx - 9},${dy - 18} M${dx + 9},${dy - 28} L${dx + 9},${dy - 18}`, line(C.white, 2.4, { opacity: 0.5 }));
    body += date(dx, dy, 12, 17, DATE_COLS[(dx + dy) % 6], rot);
  }
  for (const [sx, sy, ss] of [[314, 500, 10], [540, 520, 8], [480, 610, 7], [230, 620, 8], [404, 700, 6]]) body += sparkle(sx, sy, ss, '#FFF6DE', { opacity: 0.95 });
  // ripe dates already resting on the soft grass
  for (const [dx, dy, rot] of [[300, 806, 70], [322, 812, -60], [440, 812, 80], [462, 806, 30], [410, 820, -80]]) body += date(dx, dy, 9, 12, DATE_COLS[(dx * 7) % 6], rot);

  // ------------------------------------------------ the folded blanket on the grass
  body += blanket(110, 800, 0.95, id('blanket'));

  // ------------------------------------------------ grass and flowers along the stream
  for (const [gx, gy, gh, sd] of [[120, 700, 34, 1], [240, 650, 28, 2], [480, 700, 30, 3], [560, 650, 24, 4], [770, 700, 34, 5], [870, 760, 40, 6], [700, 820, 44, 7], [820, 880, 50, 8], [60, 860, 44, 9], [540, 920, 46, 10]]) {
    body += grass(gx, gy, { h: gh, n: 6, seed: sd, fill: R() < 0.5 ? C.leaf4 : C.leaf3 });
  }
  for (const [fx, fy, fr, fc] of [[140, 690, 9, C.rose1], [180, 708, 8, C.white], [500, 690, 8, C.gold1], [800, 690, 9, C.rose1], [840, 720, 8, C.white], [720, 810, 11, C.rose2], [760, 836, 9, C.white], [880, 860, 11, C.gold1], [600, 900, 10, C.rose1], [90, 850, 10, C.white]]) {
    body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2, stemH: fr * 2.2, stem: C.leaf4 });
  }

  // ------------------------------------------------ birds
  // a little bird drinking at the stream's edge, on a stone
  body += rock(664, 852, { w: 84, h: 40, fill: '#E2D3C2', dark: '#C7B3A0', light: C.white, seed: 4 });
  body += bird(656, 818, { s: 0.9, flip: true, body: C.sky0, wing: '#4F98BE', belly: C.sky3, beak: C.gold2 });
  // another flying in toward the palm
  body += flyingBird(612, 380, { s: 0.85, flip: true, body: C.cream, wing: C.rose1, beak: C.gold2, up: true });

  // ------------------------------------------------ foreground framing: reeds and blossoms at the corners
  for (const [rx, rh, rl, rc] of [[18, 300, 20, C.leaf5], [52, 240, 34, C.leaf4], [94, 180, 26, C.leaf5], [-6, 220, -8, C.leaf4], [930, 260, -20, C.leaf5], [968, 320, -12, C.leaf4], [1004, 240, -30, C.leaf5], [900, 170, -30, C.leaf4]]) {
    body += path(`M${rx - 6},1010 Q${rx + rl * 0.3},${1010 - rh * 0.6} ${rx + rl},${1010 - rh} Q${rx + rl * 0.3 + 5},${1010 - rh * 0.55} ${rx + 7},1010Z`, { fill: rc });
  }
  body += bush(930, 1010, { w: 190, fill: C.leaf4, dark: C.leaf5, light: C.leaf3, seed: 8 });
  for (const [fx, fy, fr, fc] of [[60, 960, 16, C.rose2], [110, 930, 13, C.white], [890, 930, 14, C.rose1], [940, 900, 13, C.white], [980, 940, 12, C.rose2], [860, 975, 13, C.white]]) body += flower(fx, fy, { r: fr, fill: fc, center: C.gold2 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
