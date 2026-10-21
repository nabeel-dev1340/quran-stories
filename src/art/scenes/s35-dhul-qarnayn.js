// Dhul-Qarnayn and the Great Wall (Quran 18:83-98).
// Between two tall mountains stands a huge wall of iron blocks, with
// molten copper poured over its top (18:96), glowing and sending up
// sparks. In front, a little valley village rests safe in the evening
// light - "This is a mercy from my Lord" (18:98). Nothing behind the wall
// is shown.
import {
  C, svgDoc, ids, rng, linear, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, sparkle,
  cloud, sun, farBird, grass, flower, tree, bush, sheep, shadow, cypress, r1, lerp,
} from '../lib.js';

const STEEL = { hi: '#9DB4D3', light: '#7590B6', mid: '#5A7399', dark: '#435A7D', deep: '#30425F' };
const COPPER = { white: '#FFF4CF', hot: '#FFD372', mid: '#F7A243', deep: '#D9712E', cool: '#B4572A' };

// Inner edges of the two mountains, which hold the wall between them.
const WALL_TOP = 270;
const WALL_BASE = 700;
const innerL = (y) => lerp(326, 372, (y - WALL_TOP) / (WALL_BASE - WALL_TOP));
const innerR = (y) => lerp(674, 628, (y - WALL_TOP) / (WALL_BASE - WALL_TOP));

// A small flat-roofed house with warm lit windows. (x, y) = bottom centre.
function cottage(x, y, { w = 60, h = 46, fill = '#E7C79A', dark = '#C9A274', roof = '#B98B5E', dome = false, win = 2 } = {}) {
  let s = shadow(x + w * 0.12, y + 2, w * 1.3, 0.16);
  s += rect(x - w / 2, y - h, w, h, { fill });
  s += rect(x + w * 0.16, y - h, w * 0.34, h, { fill: dark, opacity: 0.55 });
  s += rect(x - w / 2 - 3, y - h - 6, w + 6, 8, { rx: 3, fill: roof });
  if (dome) s += path(`M${r1(x - w * 0.26)},${r1(y - h - 5)} A${r1(w * 0.26)},${r1(w * 0.26)} 0 0 1 ${r1(x + w * 0.26)},${r1(y - h - 5)}Z`, { fill: '#F3E3C8' });
  s += path(`M${r1(x - w * 0.1)},${r1(y)} L${r1(x - w * 0.1)},${r1(y - h * 0.42)} Q${r1(x)},${r1(y - h * 0.58)} ${r1(x + w * 0.1)},${r1(y - h * 0.42)} L${r1(x + w * 0.1)},${r1(y)}Z`, { fill: C.wood3 });
  for (let i = 0; i < win; i++) {
    const wx = x + (i === 0 ? -w * 0.3 : w * 0.3);
    s += circle(wx, y - h * 0.62, w * 0.16, { fill: '#FFE3A0', opacity: 0.35 });
    s += path(`M${r1(wx - w * 0.07)},${r1(y - h * 0.5)} L${r1(wx - w * 0.07)},${r1(y - h * 0.68)} Q${r1(wx)},${r1(y - h * 0.8)} ${r1(wx + w * 0.07)},${r1(y - h * 0.68)} L${r1(wx + w * 0.07)},${r1(y - h * 0.5)}Z`, { fill: '#FFD878' });
  }
  return s;
}

export default function render() {
  const id = ids('s35');
  const R = rng(35);
  const defs = [
    linear(id('sky'), [[0, '#2B3F63'], [0.2, '#475F8C'], [0.4, '#9488AE'], [0.6, '#DC9F95'], [0.82, '#F4BD8E'], [1, '#F9D49C']]),
    linear(id('wall'), [[0, '#8C7E8E'], [0.18, STEEL.light], [0.55, STEEL.mid], [1, STEEL.dark]], { x1: 0, y1: WALL_TOP, x2: 0, y2: WALL_BASE, units: 'userSpaceOnUse' }),
    linear(id('copper'), [[0, COPPER.white], [0.35, COPPER.hot], [0.75, COPPER.mid], [1, COPPER.deep]]),
    linear(id('drip'), [[0, COPPER.hot], [0.5, COPPER.mid], [1, COPPER.cool]]),
    linear(id('heat'), [[0, '#FFB45C', 0.55], [0.45, '#FFB45C', 0.15], [1, '#FFB45C', 0]], { x1: 0, y1: WALL_TOP, x2: 0, y2: WALL_BASE, units: 'userSpaceOnUse' }),
    linear(id('valley'), [[0, '#9DB57E'], [1, '#6E9A62']]),
    glowDef(id('fire'), '#FFC873', 0.7),
    glowDef(id('fire2'), '#FFE2A0', 0.8),
    glowDef(id('sunGlow'), '#FFE1A8', 0.8),
    glowDef(id('win'), '#FFD98A', 0.6),
    `<clipPath id="${id('wallClip')}"><path d="M${innerL(WALL_TOP)},${WALL_TOP} L${innerR(WALL_TOP)},${WALL_TOP} L${innerR(WALL_BASE)},${WALL_BASE} L${innerL(WALL_BASE)},${WALL_BASE}Z"/></clipPath>`,
    vignetteDef(id('vig'), C.ink, 0.24),
  ].join('');

  let body = '';
  // ---- evening sky with the sun low on the horizon
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += sun(70, 500, 44, { fill: '#FFD98E', core: '#FFF2CF', glowId: id('sunGlow') });
  body += cloud(160, 300, 200, { fill: '#C7A4B4', shade: '#A98BA4', seed: 3, opacity: 0.6 });
  body += cloud(880, 250, 220, { fill: '#B79DB6', shade: '#9A85A6', seed: 5, opacity: 0.55 });
  for (const [sx, sy, ss] of [[300, 60, 6], [700, 40, 5], [900, 110, 6], [120, 140, 4]]) body += sparkle(sx, sy, ss, C.cream, { opacity: 0.7 });
  // distant hills on either side
  body += path(ridge([[-20, 548], [50, 532], [120, 540], [200, 522], [300, 548]]), { fill: '#C49EA2' });
  body += path(ridge([[-20, 584], [70, 570], [170, 580], [260, 566]]), { fill: '#A88C9E' });
  body += path(ridge([[700, 520], [800, 500], [900, 516], [1020, 498]]), { fill: '#A891A7' });

  // ---- the glow of the molten copper (behind everything near the wall)
  body += circle(500, 250, 380, { fill: `url(#${id('fire')})` });

  // ---- the wall of iron blocks
  body += path(`M${innerL(WALL_TOP)},${WALL_TOP} L${innerR(WALL_TOP)},${WALL_TOP} L${innerR(WALL_BASE)},${WALL_BASE} L${innerL(WALL_BASE)},${WALL_BASE}Z`, { fill: `url(#${id('wall')})` });
  let blocks = '';
  let tops = '';
  let bots = '';
  let rivets = '';
  const course = 48;
  for (let row = 0; row * course < WALL_BASE - WALL_TOP; row++) {
    const y0 = WALL_TOP + 12 + row * course;
    const bw = 76;
    const off = row % 2 ? bw / 2 : 0;
    for (let x = 300 - off; x < 700; x += bw) {
      blocks += rect(x + 3, y0 + 3, bw - 6, course - 6, { rx: 7 });
      tops += rect(x + 7, y0 + 5, bw - 14, 6, { rx: 3 });
      bots += rect(x + 5, y0 + course - 12, bw - 10, 7, { rx: 3 });
      rivets += circle(x + 12, y0 + 14, 2.6) + circle(x + bw - 12, y0 + 14, 2.6) + circle(x + 12, y0 + course - 16, 2.6) + circle(x + bw - 12, y0 + course - 16, 2.6);
    }
  }
  body += g({ 'clip-path': `url(#${id('wallClip')})` },
    `<g fill="${STEEL.deep}" opacity="0.55">${blocks.replace(/rect /g, 'rect transform="translate(2 3)" ')}</g>`,
    `<g fill="#6E88AE" opacity="0.55">${blocks}</g>`,
    `<g fill="${STEEL.hi}" opacity="0.5">${tops}</g>`,
    `<g fill="${STEEL.deep}" opacity="0.35">${bots}</g>`,
    `<g fill="${STEEL.deep}" opacity="0.6">${rivets}</g>`,
    rect(0, WALL_TOP, 1000, WALL_BASE - WALL_TOP, { fill: `url(#${id('heat')})` }),
  );

  // ---- molten copper poured over the top, running down the face
  const xl = innerL(WALL_TOP) - 6;
  const xr = innerR(WALL_TOP) + 6;
  let drips = '';
  let drops = '';
  for (const [t, len, w] of [[0.05, 30, 14], [0.12, 84, 18], [0.2, 46, 13], [0.29, 128, 21], [0.37, 64, 15], [0.46, 104, 19], [0.53, 168, 23], [0.6, 52, 14], [0.68, 118, 20], [0.76, 72, 16], [0.84, 140, 19], [0.92, 40, 14]]) {
    const x = lerp(xl + 10, xr - 10, t) + R.range(-4, 4);
    const y0 = WALL_TOP + 4;
    const bulb = w * 0.4;
    drips += `M${r1(x - w / 2 - 6)},${y0} C${r1(x - w / 2)},${r1(y0 + 6)} ${r1(x - w * 0.3)},${r1(y0 + len * 0.6)} ${r1(x - bulb)},${r1(y0 + len)} A${r1(bulb)},${r1(bulb)} 0 1 0 ${r1(x + bulb)},${r1(y0 + len)} C${r1(x + w * 0.3)},${r1(y0 + len * 0.6)} ${r1(x + w / 2)},${r1(y0 + 6)} ${r1(x + w / 2 + 6)},${y0}Z `;
    if (len > 150) drops += ellipse(x + R.range(-2, 2), y0 + len + bulb * 3.2, bulb * 0.55, bulb * 0.75);
  }
  body += path(drips, { fill: `url(#${id('drip')})` });
  body += `<g fill="${COPPER.mid}">${drops}</g>`;
  body += path(`M${r1(xl - 4)},${WALL_TOP + 10} C${r1(xl + 10)},${WALL_TOP - 8} ${r1(lerp(xl, xr, 0.25))},${WALL_TOP - 14} ${r1(lerp(xl, xr, 0.42))},${WALL_TOP - 12} C${r1(lerp(xl, xr, 0.5))},${WALL_TOP - 20} ${r1(lerp(xl, xr, 0.62))},${WALL_TOP - 18} ${r1(lerp(xl, xr, 0.75))},${WALL_TOP - 12} C${r1(xr - 20)},${WALL_TOP - 10} ${r1(xr - 4)},${WALL_TOP - 4} ${r1(xr + 4)},${WALL_TOP + 10} C${r1(lerp(xl, xr, 0.8))},${WALL_TOP + 16} ${r1(lerp(xl, xr, 0.2))},${WALL_TOP + 16} ${r1(xl - 4)},${WALL_TOP + 10}Z`, { fill: `url(#${id('copper')})` });
  body += path(`M${r1(lerp(xl, xr, 0.12))},${WALL_TOP - 3} C${r1(lerp(xl, xr, 0.25))},${WALL_TOP - 10} ${r1(lerp(xl, xr, 0.4))},${WALL_TOP - 10} ${r1(lerp(xl, xr, 0.5))},${WALL_TOP - 14} M${r1(lerp(xl, xr, 0.6))},${WALL_TOP - 12} C${r1(lerp(xl, xr, 0.7))},${WALL_TOP - 10} ${r1(lerp(xl, xr, 0.8))},${WALL_TOP - 8} ${r1(lerp(xl, xr, 0.86))},${WALL_TOP - 5}`, { fill: 'none', stroke: COPPER.white, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.85 });
  // ---- the two tall mountains holding the wall
  // left mountain: lit outer face, shaded inner face
  body += path(smooth([[30, 760], [70, 560], [110, 420], [138, 352], [160, 330], [186, 352], [206, 420], [230, 560], [240, 760]]) + 'Z', { fill: '#8C82A3' });
  body += path(smooth([[138, 352], [160, 330], [186, 352], [200, 400]]) + ' L150,420Z', { fill: '#E2CBCF', opacity: 0.45 });
  const leftM = `M150,760 C170,560 180,330 214,160 Q236,96 264,148 C300,214 312,240 ${innerL(WALL_TOP)},${WALL_TOP - 20} L${innerL(WALL_BASE) + 6},${WALL_BASE} L${innerL(WALL_BASE) + 30},760Z`;
  body += path(leftM, { fill: '#9A8FAE' });
  body += path(`M234,110 Q250,120 262,148 C300,214 312,240 ${innerL(WALL_TOP)},${WALL_TOP - 20} L${innerL(WALL_BASE) + 6},${WALL_BASE} L${innerL(WALL_BASE) + 30},760 L224,760 C246,600 270,430 252,300 C246,230 244,160 234,110Z`, { fill: '#5F6889' });
  body += path('M214,160 Q236,96 264,148 C252,130 240,124 230,130 C222,136 216,148 214,160Z', { fill: '#F0DCD8', opacity: 0.75 });
  body += path('M150,760 C170,560 180,330 214,160 C196,330 190,520 186,760Z', { fill: '#C2ADBE', opacity: 0.55 });
  body += path('M206,330 C216,300 226,280 238,262 C230,300 222,340 214,380Z', { fill: '#B7A3B9', opacity: 0.55 });
  body += path('M286,250 C278,300 282,360 270,420 C278,360 276,300 292,256Z M302,430 C294,490 298,540 288,600 C298,540 298,490 308,436Z', { fill: '#4E5778', opacity: 0.5 });
  // right mountain: its left face catches the sun
  body += path(smooth([[760, 760], [790, 560], [820, 420], [846, 330], [872, 300], [900, 320], [940, 420], [990, 560], [1040, 700]]) + ' L1040,760Z', { fill: '#5E6689' });
  body += path(smooth([[846, 330], [872, 300], [900, 320], [880, 380]]) + 'Z', { fill: '#B9A6BE', opacity: 0.5 });
  const rightM = `M900,760 C880,600 860,360 820,130 Q790,74 760,126 C720,200 700,230 ${innerR(WALL_TOP)},${WALL_TOP - 20} L${innerR(WALL_BASE) - 6},${WALL_BASE} L${innerR(WALL_BASE) - 30},760Z`;
  body += path(rightM, { fill: '#6B7395' });
  body += path(`M760,126 C720,200 700,230 ${innerR(WALL_TOP)},${WALL_TOP - 20} L${innerR(WALL_BASE) - 6},${WALL_BASE} L${innerR(WALL_BASE) - 30},760 L760,760 C740,600 730,420 744,300 C750,220 756,160 760,126Z`, { fill: '#A592AE' });
  body += path('M760,126 Q790,74 820,130 C806,116 794,110 782,114 C772,118 766,122 760,126Z', { fill: '#E8D3D3', opacity: 0.7 });
  body += path('M820,130 C860,360 880,600 900,760 L870,760 C856,560 846,360 820,130Z', { fill: '#535C80', opacity: 0.6 });
  body += path('M748,260 C736,300 730,340 728,380 C740,340 752,300 770,270Z M760,440 C748,480 744,520 742,560 C754,520 766,480 782,450Z', { fill: '#C3B0C4', opacity: 0.5 });
  body += path('M818,220 C832,280 828,330 846,380 C832,334 826,284 822,226Z', { fill: '#4A5276', opacity: 0.5 });
  // warm firelight on the inner faces beside the copper
  body += circle(innerL(WALL_TOP) - 4, WALL_TOP + 10, 90, { fill: `url(#${id('fire')})` }) + circle(innerR(WALL_TOP) + 4, WALL_TOP + 10, 90, { fill: `url(#${id('fire')})` });

  body += circle(500, WALL_TOP - 20, 150, { fill: `url(#${id('fire2')})` });
  // sparks rising
  for (let i = 0; i < 30; i++) {
    const x = 500 + R.range(-1, 1) * 190 * (0.5 + R() * 0.5);
    const y = WALL_TOP - 26 - R() ** 1.4 * 180;
    body += circle(x, y, R.range(1.6, 3.8), { fill: R() < 0.5 ? COPPER.hot : COPPER.white, opacity: R.range(0.6, 1) });
  }
  for (const [sx, sy, ss] of [[430, 160, 11], [570, 130, 13], [500, 90, 9], [380, 210, 8], [640, 200, 9], [520, 190, 7]]) body += sparkle(sx, sy, ss, COPPER.white);

  // ---- the valley and the safe little village
  body += path(ridge([[-20, 712], [200, 696], [380, 704], [500, 698], [640, 704], [820, 694], [1020, 706]]), { fill: '#88A675' });
  body += path(ridge([[-20, 760], [160, 740], [330, 754], [520, 742], [700, 752], [880, 736], [1020, 748]]), { fill: `url(#${id('valley')})` });
  // fields
  for (const [x0, y0, w, h, c] of [[60, 770, 160, 34, '#C9C278'], [250, 790, 140, 30, '#A9C77E'], [640, 780, 150, 32, '#C9C278'], [820, 800, 150, 30, '#A9C77E']]) {
    body += path(`M${x0},${y0} L${x0 + w},${y0 - 6} L${x0 + w + 16},${y0 + h} L${x0 + 12},${y0 + h + 6}Z`, { fill: c, opacity: 0.85 });
  }
  // stream from the foot of the wall winding out through the valley
  body += path('M520,704 C540,730 470,750 480,780 C492,816 600,830 580,880 C566,920 480,940 470,1010 L520,1010 C530,950 610,930 616,882 C624,830 516,812 506,782 C498,756 560,734 532,704Z', { fill: '#7FC4D2' });
  body += path('M506,782 C498,756 560,734 532,704 L526,704 C546,734 490,756 496,782Z', { fill: C.white, opacity: 0.35 });
  // houses with gardens
  const houses = [
    [150, 760, 54, 40, false], [230, 770, 60, 44, true], [104, 790, 50, 38, false],
    [330, 772, 56, 42, false], [690, 768, 58, 42, true], [770, 760, 52, 40, false],
    [860, 778, 60, 44, false], [920, 760, 50, 38, true], [400, 800, 52, 40, false], [640, 810, 54, 40, false],
  ];
  for (const [hx, hy, hw, hh, dm] of houses) body += cottage(hx, hy, { w: hw, h: hh, dome: dm });
  for (const [tx, ty, tr, sd] of [[190, 776, 22, 1], [280, 786, 20, 2], [60, 800, 24, 3], [372, 790, 18, 4], [730, 786, 22, 5], [818, 790, 20, 6], [960, 790, 24, 7], [600, 828, 18, 8], [450, 818, 20, 9]]) {
    body += tree(tx, ty, { r: tr, trunkH: tr * 0.7, seed: sd, leaf: '#5E9A64', leafDark: '#477F56', leafLight: '#82B676', trunk: C.wood3, fruit: sd % 3 === 0 ? C.coral2 : undefined, fruitN: 5 });
  }
  for (const [cx, cy, h] of [[124, 770, 60], [300, 784, 50], [710, 776, 56], [890, 770, 54]]) body += cypress(cx, cy, { h, w: h * 0.3, fill: '#40785A', light: '#5A9468' });
  for (const [fx, fy, fc] of [[170, 800, C.rose1], [250, 808, C.gold1], [700, 812, C.coral1], [880, 820, C.rose1], [350, 812, C.gold1]]) body += flower(fx, fy, { r: 5, fill: fc, center: C.gold2 });
  body += sheep(600, 744, { s: 0.22 }) + sheep(630, 750, { s: 0.2, flip: true }) + sheep(420, 748, { s: 0.2 });

  // ---- foreground hill framing the view
  body += path(ridge([[-20, 880], [120, 852], [300, 872], [420, 900], [480, 940]], 1010), { fill: '#5E8F57' });
  body += path(ridge([[560, 940], [640, 900], [760, 870], [900, 850], [1020, 866]], 1010), { fill: '#5E8F57' });
  body += path(ridge([[-20, 930], [150, 910], [320, 930], [440, 970]], 1010), { fill: '#4C7D4C' });
  body += path(ridge([[600, 980], [720, 930], [880, 910], [1020, 924]], 1010), { fill: '#4C7D4C' });
  body += tree(40, 900, { r: 110, trunkH: 120, seed: 31, leaf: '#4E8A5A', leafDark: '#3B6F4C', leafLight: '#6FA66C', trunk: C.wood3 });
  body += bush(250, 930, { w: 110, fill: '#5A9460', dark: '#437A50', light: '#79AE6E', seed: 4 });
  body += bush(930, 930, { w: 130, fill: '#5A9460', dark: '#437A50', light: '#79AE6E', seed: 6 });
  body += sheep(780, 960, { s: 0.55, flip: true }) + sheep(690, 976, { s: 0.38, flip: true, seed: 5 });
  for (const [fx, fy, fc] of [[160, 960, C.rose1], [330, 952, C.gold1], [860, 976, C.coral1], [960, 990, C.rose1]]) body += flower(fx, fy, { r: 9, fill: fc, center: C.gold2 });
  for (const [gx, gy, sd] of [[120, 990, 1], [380, 980, 2], [620, 1000, 3], [900, 1000, 4]]) body += grass(gx, gy, { h: 36, n: 6, fill: '#3F6E45', seed: sd });
  body += farBird(250, 380, 1.1, '#5A4A6A', 0.6) + farBird(284, 366, 0.85, '#5A4A6A', 0.55) + farBird(760, 400, 1, '#5A4A6A', 0.5);

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
