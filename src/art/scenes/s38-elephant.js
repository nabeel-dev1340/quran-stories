// The Year of the Elephant (Quran 105, Surah al-Fil).
// A big, gentle elephant in its decorated cloth has sat down firmly in a
// rocky valley and will not go on; far away the Ka'bah stands safe in the
// valley of Makkah, glowing in the low sun. Flocks of little birds (ababil),
// each carrying tiny pebbles in its beak and claws, sweep across a dramatic
// orange-purple sky in waves. No soldiers, no people, no violence.
import {
  mountain, rock,
  C, svgDoc, ids, rng, mix, lerp, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  sparkle, farBird, kaaba, house, star8, grass, r1, T, eye,
} from '../lib.js';

// ---------------------------------------------------------------- helpers
// Points along a Catmull-Rom curve (same curve as lib smooth()).
function spline(pts, per = 10) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const m = 1 - t;
      out.push([
        m * m * m * p1[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * p2[0],
        m * m * m * p1[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t * t * t * p2[1],
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// A tapered tube along a curve (trunks, tails), with a round tip.
function tube(pts, w0, w1) {
  const c = spline(pts, 12);
  const n = c.length;
  const L = [];
  const Rt = [];
  for (let i = 0; i < n; i++) {
    const a = c[Math.max(0, i - 1)];
    const b = c[Math.min(n - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    const w = lerp(w0, w1, i / (n - 1)) / 2;
    L.push([c[i][0] + nx * w, c[i][1] + ny * w]);
    Rt.push([c[i][0] - nx * w, c[i][1] - ny * w]);
  }
  const P = (p) => `${r1(p[0])},${r1(p[1])}`;
  return `M${L.map(P).join(' L')} A${r1(w1 / 2)},${r1(w1 / 2)} 0 0 1 ${P(Rt[n - 1])} L${Rt.slice().reverse().map(P).join(' L')}Z`;
}

// A big, gentle elephant sitting down, facing right. Light comes from the
// low sun on the right. (x, y) = ground under its middle.
function elephant(x, y, s, id, defsOut) {
  const skin = '#ABA3C8';
  const shade = '#8C83B0';
  const deep = '#73699A';
  const lit = '#CDC6E3';
  const earIn = '#EFB8CB';
  const nail = '#F7EEE2';
  const cloth = C.rose3;
  const clothDark = '#A2476C';
  const trim = C.gold2;
  const trimDark = C.gold4;

  const bodyD = blob([[-150, 2], [-245, -40], [-276, -140], [-252, -245], [-182, -322], [-82, -388], [18, -432], [112, -420], [152, -330], [138, -222], [84, -122], [-20, -40]]);
  const thighD = blob([[-205, -4], [-238, -88], [-206, -176], [-124, -208], [-46, -176], [-14, -104], [-28, -32], [-92, 0]]);
  const footD = blob([[-74, -6], [-64, -78], [-4, -92], [42, -76], [58, -40], [44, -2], [-16, 4]]);
  const headD = blob([[62, -440], [96, -512], [168, -546], [246, -516], [280, -442], [272, -378], [236, -336], [172, -322], [104, -352]]);
  const earD = blob([[120, -506], [62, -518], [6, -484], [-16, -412], [4, -340], [56, -298], [102, -308], [128, -360], [134, -444]]);
  const trunkD = tube([[248, -390], [276, -324], [290, -262], [312, -214], [346, -203], [366, -228], [352, -252]], 74, 26);
  const legD = (x0, w) => `M${x0},-340 C${x0},-220 ${x0 - 4},-92 ${x0 - 2},-16 Q${x0 - 2},2 ${x0 + 16},2 L${x0 + w - 14},2 Q${x0 + w + 2},2 ${x0 + w + 2},-16 C${x0 + w + 4},-92 ${x0 + w + 4},-220 ${x0 + w + 8},-340Z`;

  defsOut.push(`<clipPath id="${id('eBody')}"><path d="${bodyD}"/><path d="${thighD}"/></clipPath>`);
  defsOut.push(`<clipPath id="${id('eHead')}"><path d="${headD}"/></clipPath>`);
  defsOut.push(`<clipPath id="${id('eTrunk')}"><path d="${trunkD}"/></clipPath>`);
  defsOut.push(`<clipPath id="${id('eThigh')}"><path d="${thighD}"/><path d="${footD}"/></clipPath>`);

  const p = [];
  // tail with a little tuft
  p.push(path('M-262,-168 C-292,-136 -296,-96 -284,-62', { fill: 'none', stroke: shade, 'stroke-width': 10, 'stroke-linecap': 'round' }));
  p.push(ellipse(-283, -52, 10, 16, { fill: deep, transform: 'rotate(-12 -283 -52)' }));
  // far front leg
  p.push(path(legD(26, 64), { fill: shade }));
  for (const nx of [38, 58, 78]) p.push(ellipse(nx, -4, 8, 6, { fill: mix(nail, shade, 0.35) }));
  // body
  p.push(path(bodyD, { fill: skin }));
  p.push(g({ 'clip-path': `url(#${id('eBody')})` },
    ellipse(-250, -150, 150, 210, { fill: shade, opacity: 0.55 }),
    ellipse(60, -420, 120, 60, { fill: lit, opacity: 0.5, transform: 'rotate(-30 60 -420)' }),
  ));
  // near hind leg: round thigh and a foot stuck out in front
  p.push(path(thighD, { fill: skin }));
  p.push(path(footD, { fill: skin }));
  p.push(g({ 'clip-path': `url(#${id('eThigh')})` },
    ellipse(-205, -60, 90, 140, { fill: shade, opacity: 0.6 }),
  ));
  p.push(path('M-60,-88 C-40,-60 -40,-30 -56,-8', { fill: 'none', stroke: shade, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.6 }));
  // the sole of the foot, toward us, with three toenails
  p.push(ellipse(40, -40, 20, 36, { fill: mix(lit, earIn, 0.3) }));
  p.push(ellipse(42, -40, 13, 27, { fill: mix(lit, '#FFFFFF', 0.25), opacity: 0.6 }));
  for (const [nx, ny] of [[52, -66], [58, -40], [52, -14]]) p.push(ellipse(nx, ny, 6, 8, { fill: nail }));

  // decorated cloth over the back
  const clothShape = 'M-300,-210 L-6,-470 L150,-330 L120,-300 L-160,-112 Z';
  p.push(g({ 'clip-path': `url(#${id('eBody')})` },
    path(clothShape, { fill: cloth }),
    path('M-300,-210 L-6,-470 L20,-445 L-276,-186Z', { fill: mix(cloth, '#FFFFFF', 0.18) }),
    path('M-182,-128 L106,-322 L120,-300 L-160,-112Z', { fill: trim }),
    path('M-196,-146 L94,-342 L100,-334 L-190,-138Z', { fill: clothDark }),
    path('M-246,-240 L-170,-118 L-150,-128 L-226,-252Z', { fill: trim }),
  ));
  // pattern: a row of little stars
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const sx = lerp(-180, 40, t);
    const sy = lerp(-250, -392, t);
    p.push(star8(sx, sy, 12, C.gold1));
    p.push(circle(sx, sy, 4, { fill: cloth }));
    if (i < 4) p.push(circle(lerp(sx, lerp(-180, 40, (i + 1) / 4), 0.5), lerp(sy, lerp(-250, -392, (i + 1) / 4), 0.5), 4, { fill: C.gold1 }));
  }
  // tassels hanging from the lower edge
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const tx = lerp(-165, 112, t);
    const ty = lerp(-114, -302, t);
    p.push(path(`M${r1(tx)},${r1(ty)} L${r1(tx)},${r1(ty + 14)}`, { stroke: trimDark, 'stroke-width': 2.5 }));
    p.push(path(`M${r1(tx)},${r1(ty + 10)} q-7,10 -5,20 q5,4 10,0 q2,-10 -5,-20Z`, { fill: i % 2 ? C.gold2 : C.coral2 }));
  }
  // near front leg with a gold anklet
  p.push(path(legD(74, 70), { fill: skin }));
  p.push(path('M144,-250 C147,-170 147,-90 145,-24', { fill: 'none', stroke: lit, 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.55 }));
  p.push(path('M72,-62 Q109,-50 148,-62 L148,-48 Q109,-36 72,-48Z', { fill: trim }));
  for (const nx of [88, 110, 132]) p.push(ellipse(nx, -4, 9, 7, { fill: nail }));

  // head
  p.push(path(headD, { fill: skin }));
  p.push(g({ 'clip-path': `url(#${id('eHead')})` },
    ellipse(96, -380, 80, 110, { fill: shade, opacity: 0.5 }),
    ellipse(236, -486, 50, 40, { fill: lit, opacity: 0.6 }),
    ellipse(300, -430, 40, 120, { fill: '#F8DCD6', opacity: 0.35 }),
  ));
  // trunk, curled up happily
  p.push(path(trunkD, { fill: skin }));
  p.push(g({ 'clip-path': `url(#${id('eTrunk')})` },
    path(tube([[230, -390], [256, -324], [268, -262], [292, -216], [330, -196], [356, -214]], 40, 14), { fill: shade, opacity: 0.35 }),
  ));
  for (const [a, b, c2] of [[[262, -330], [292, -338], [276, -322]], [[270, -296], [300, -300], [286, -286]], [[280, -262], [310, -262], [296, -250]]]) {
    p.push(path(`M${a[0]},${a[1]} Q${c2[0]},${c2[1] + 10} ${b[0]},${b[1]}`, { fill: 'none', stroke: deep, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.45 }));
  }
  p.push(ellipse(354, -246, 8, 6, { fill: deep, opacity: 0.5, transform: 'rotate(40 354 -246)' }));
  // ear
  p.push(path(earD, { fill: mix(skin, shade, 0.7) }));
  p.push(path(blob([[120, -492], [68, -500], [20, -470], [2, -410], [18, -348], [60, -314], [100, -322], [120, -366], [124, -440]]), { fill: earIn }));
  p.push(path(blob([[120, -470], [84, -476], [52, -452], [42, -404], [56, -356], [90, -336], [112, -350], [122, -400]]), { fill: '#F6CCD9', opacity: 0.7 }));
  p.push(path('M100,-470 C70,-470 40,-440 36,-400', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.35 }));
  // face
  p.push(eye(210, -446, 12.5));
  p.push(ellipse(234, -404, 15, 9, { fill: C.cheek, opacity: 0.6 }));
  p.push(path('M200,-350 Q216,-336 236,-344', { fill: 'none', stroke: deep, 'stroke-width': 4, 'stroke-linecap': 'round' }));
  // little decorated head cloth
  p.push(path('M150,-540 C180,-552 222,-548 250,-528 L236,-494 C210,-506 180,-510 158,-504Z', { fill: cloth }));
  p.push(path('M150,-540 C180,-552 222,-548 250,-528 L246,-518 C220,-536 182,-540 152,-530Z', { fill: trim }));
  p.push(path('M158,-504 C180,-510 210,-506 236,-494 L234,-488 C210,-500 180,-504 160,-498Z', { fill: trim }));
  p.push(circle(200, -520, 7, { fill: C.gold1 }), circle(200, -520, 3.5, { fill: C.water2 }));
  p.push(path('M236,-494 L242,-478', { stroke: trimDark, 'stroke-width': 2.5 }));
  p.push(path('M242,-480 q-7,10 -5,20 q5,4 10,0 q2,-10 -5,-20Z', { fill: C.coral2 }));

  return g({ transform: T(x, y, s) }, p);
}

// A little swallow-like bird (ababil) flying with a pebble in its beak and
// two in its claws. Faces right; flip for left. (x, y) = body centre.
function ababil(x, y, { s = 1, flip = false, up = true, body = C.cream, wing = C.plum0, wingDark = C.plum1, pebble = '#8E5242' } = {}) {
  const parts = [
    path('M-24,-2 L-58,-18 Q-46,-4 -46,0 Q-46,6 -56,16 Z', { fill: wingDark }),
    up ? path('M6,-10 C10,-34 26,-46 40,-50 C34,-32 26,-18 16,-8Z', { fill: wingDark }) : path('M4,8 C6,26 18,38 30,40 C27,26 22,16 14,6Z', { fill: wingDark }),
    ellipse(0, 0, 30, 17, { fill: body }),
    path('M-18,7 Q4,19 26,5 Q12,17 -2,17 Q-14,15 -18,7Z', { fill: C.white, opacity: 0.8 }),
    circle(24, -7, 14, { fill: body }),
    path('M35,-10 L46,-6 L35,-2Z', { fill: C.gold2 }),
    circle(48, -5, 5, { fill: pebble }),
    circle(46.4, -6.6, 1.6, { fill: C.white, opacity: 0.55 }),
    path('M-6,14 L-8,21 M5,14 L6,21', { stroke: C.gold3, 'stroke-width': 2.6, 'stroke-linecap': 'round' }),
    circle(-8.5, 25.5, 5, { fill: pebble }),
    circle(6.5, 25.5, 5, { fill: pebble }),
    up ? path('M-6,-8 C-10,-38 12,-56 28,-60 C21,-38 16,-20 8,-6Z', { fill: wing }) : path('M-6,4 C-12,28 8,44 24,48 C19,30 14,14 8,4Z', { fill: wing }),
    eye(28, -9, 3.2),
    ellipse(30, -1, 3.8, 2.4, { fill: C.cheek, opacity: 0.7 }),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// Long sunset cloud, lit from below by the low sun: a vertical gradient from
// a dusky top to a glowing underside. (x, y) = middle of the flat bottom.
function sunsetCloud(x, y, w, gid, defsOut, { top, bottom, seed = 1, op = 1 } = {}) {
  const R = rng(seed);
  const h = w * 0.13;
  const parts = [];
  const n = 5;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const hump = Math.sin(t * Math.PI);
    const rr = h * (0.55 + hump * 0.75) * R.range(0.9, 1.1);
    parts.push(circle(x - w * 0.42 + t * w * 0.84 + R.range(-6, 6), y - h * 0.55 - hump * h * 0.55, rr));
  }
  parts.push(rect(x - w / 2, y - h, w, h, { rx: h / 2 }));
  defsOut.push(linear(gid, [[0, top], [0.55, top], [1, bottom]], { x1: 0, y1: r1(y - h * 2.4), x2: 0, y2: r1(y), units: 'userSpaceOnUse' }));
  return g({ fill: `url(#${gid})`, opacity: op }, parts);
}

// Kit mountain / rock mirrored so the sunny face is on the right (the low
// sun is on the right in this scene).
const mirror = (cx, svg) => g({ transform: `translate(${r1(cx * 2)} 0) scale(-1 1)` }, svg);
const mtn = (x, baseY, w, h, o) => mirror(x, mountain(x, baseY, w, h, o));
const stone = (x, y, o) => mirror(x, rock(x, y, o));

// A rounded boulder lit from the right (the low sun), shaded inside its own
// clip so the shading never spills. (x, y) = bottom centre.
function boulder(x, y, w, h, { fill, dark, lit, seed = 1 }, clipId, defsOut) {
  const R = rng(seed);
  const pts = [
    [x - w * 0.5, y],
    [x - w * R.range(0.46, 0.52), y - h * R.range(0.45, 0.6)],
    [x - w * R.range(0.22, 0.3), y - h * R.range(0.88, 0.98)],
    [x + w * R.range(0.05, 0.15), y - h],
    [x + w * R.range(0.36, 0.44), y - h * R.range(0.62, 0.75)],
    [x + w * 0.5, y - h * 0.2],
    [x + w * 0.46, y + 4],
  ];
  const d = blob(pts);
  defsOut.push(`<clipPath id="${clipId}"><path d="${d}"/></clipPath>`);
  return path(d, { fill }) + g({ 'clip-path': `url(#${clipId})` },
    ellipse(x - w * 0.42, y + h * 0.05, w * 0.55, h * 0.95, { fill: dark, opacity: 0.75 }),
    ellipse(x + w * 0.34, y - h * 0.97, w * 0.3, h * 0.2, { fill: lit, opacity: 0.4 }),
    path(`M${r1(x - w * 0.05)},${r1(y - h * 0.9)} q${r1(w * 0.06)},${r1(h * 0.25)} ${r1(-w * 0.02)},${r1(h * 0.5)}`, { fill: 'none', stroke: dark, 'stroke-width': r1(Math.max(2, w * 0.018)), 'stroke-linecap': 'round', opacity: 0.45 }),
  );
}

// Tiny flat-roofed house seen against the low sun: walls in soft shadow, a
// warm rim of light along the top. (x, y) = bottom centre.
function townHouse(x, y, w, h, { wall, side, rim, door }) {
  return (
    rect(x - w / 2, y - h, w, h, { fill: wall }) +
    rect(x + w * 0.2, y - h, w * 0.3, h, { fill: side, opacity: 0.6 }) +
    rect(x - w / 2 - 1.5, y - h - 3, w + 3, 4, { rx: 1.5, fill: rim }) +
    path(`M${r1(x - w * 0.12)},${r1(y)} L${r1(x - w * 0.12)},${r1(y - h * 0.42)} Q${r1(x)},${r1(y - h * 0.6)} ${r1(x + w * 0.12)},${r1(y - h * 0.42)} L${r1(x + w * 0.12)},${r1(y)}Z`, { fill: door })
  );
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

export default function render() {
  const id = ids('s38');
  const R = rng(38);
  const extra = [];
  const farTint = (c) => mix(c, '#B77AA8', 0.55);
  const midTint = (c) => mix(c, '#C9799A', 0.32);
  const sunX = 770;
  const sunY = 596;

  let body = '';
  // ------------------------------------------------ sky, low sun and clouds
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += circle(sunX, sunY, 460, { fill: `url(#${id('sunGlow')})` });
  for (let i = 0; i < 7; i++) {
    const a = ((-164 + i * 24) * Math.PI) / 180;
    const w = 0.03;
    body += path(`M${sunX},${sunY} L${r1(sunX + Math.cos(a - w) * 900)},${r1(sunY + Math.sin(a - w) * 900)} L${r1(sunX + Math.cos(a + w) * 900)},${r1(sunY + Math.sin(a + w) * 900)}Z`, { fill: `url(#${id('rayFade')})` });
  }
  body += circle(sunX, sunY, 74, { fill: '#FFE7B0', opacity: 0.4 });
  body += circle(sunX, sunY, 60, { fill: '#FFEFC4' });
  body += circle(sunX - 12, sunY - 11, 42, { fill: '#FFF8E2', opacity: 0.75 });
  body += sunsetCloud(90, 150, 300, id('c4'), extra, { top: '#5B4C98', bottom: '#A979AE', seed: 11, op: 0.9 });
  body += sunsetCloud(910, 250, 300, id('c3'), extra, { top: '#7A5AA2', bottom: '#DC8DA4', seed: 5 });
  body += sunsetCloud(260, 352, 390, id('c1'), extra, { top: '#9A5E9E', bottom: '#EE9C8E', seed: 3 });
  body += sunsetCloud(600, 440, 290, id('c2'), extra, { top: '#BE6F98', bottom: '#FFC08E', seed: 7, op: 0.95 });
  for (const [sx, sy, ss] of [[470, 62, 8], [610, 128, 5], [60, 260, 6], [945, 88, 7], [770, 60, 5]]) body += sparkle(sx, sy, ss, '#FFE9D2', { opacity: 0.85 });

  // ------------------------------------------------ the far wave of birds
  for (let i = 0; i < 16; i++) {
    const bx = 560 + i * 26 + R.range(-10, 10);
    const by = 500 - i * 7 + R.range(-16, 16);
    body += farBird(bx, by, 0.75, '#7A4E86', 0.6);
    body += circle(bx, by + 4.5, 1.8, { fill: '#7A4E86', opacity: 0.6 });
  }

  // ------------------------------------------------ far mountains around Makkah
  body += path(ridge([[-20, 540], [80, 500], [190, 524], [320, 488], [440, 530], [540, 566], [640, 600], [720, 622], [820, 618], [910, 590], [1020, 566]], 1000), { fill: farTint(C.plum2) });
  body += path(ridge([[460, 640], [560, 618], [660, 640], [740, 650], [850, 644], [940, 626], [1020, 630]], 1000), { fill: farTint(C.rock3) });

  // ------------------------------------------------ the valley of Makkah, far away
  const town = (c) => mix(c, '#E7A196', 0.45);
  body += path(ridge([[520, 690], [640, 680], [780, 684], [900, 680], [1020, 684]], 1000), { fill: town(C.sand2) });
  const backHouses = [[606, 686, 28, 22], [646, 682, 24, 28], [690, 684, 30, 20], [732, 682, 22, 24], [846, 684, 26, 26], [884, 682, 30, 20], [920, 686, 24, 18]];
  const frontHouses = [[628, 700, 32, 24], [668, 702, 28, 20], [706, 700, 24, 22], [834, 702, 30, 22], [872, 704, 28, 18], [908, 702, 24, 20]];
  const backCol = { wall: town(mix(C.rock1, C.sand3, 0.5)), side: town(C.rock2), rim: '#FFE2B0', door: town(C.rock3) };
  const frontCol = { wall: town(mix(C.rock1, C.sand3, 0.3)), side: town(C.rock2), rim: '#FFD9A0', door: town(C.rock4) };
  for (const [hx, hy, hw, hh] of backHouses) body += townHouse(hx, hy, hw, hh, backCol);
  body += kaabaFixed(770, 708, { s: 0.36, glowId: id('kGlow') });
  for (const [hx, hy, hw, hh] of frontHouses) body += townHouse(hx, hy, hw, hh, frontCol);
  for (const [sx, sy, ss] of [[712, 640, 8], [828, 652, 6], [690, 676, 5]]) body += sparkle(sx, sy, ss, '#FFF6DC', { opacity: 0.9 });

  // ------------------------------------------------ the rocky valley: mid-ground mountains
  const mid = { light: midTint(C.rock2), dark: midTint(C.rock3), peakRound: 0.1 };
  body += mtn(70, 780, 460, 360, { ...mid, seed: 4 });
  body += mtn(290, 780, 400, 270, { ...mid, light: midTint(mix(C.rock2, C.rock1, 0.4)), seed: 6 });
  body += mtn(500, 790, 300, 150, { ...mid, light: midTint(mix(C.rock2, C.rock1, 0.6)), seed: 9 });
  body += mtn(1010, 790, 340, 200, { ...mid, seed: 3 });
  const midRock = { fill: midTint(C.rock2), dark: midTint(C.rock3), lit: midTint(C.rock0) };
  for (const [rx, ry, rw, rh, sd] of [[20, 750, 150, 96, 3], [140, 752, 100, 60, 5], [240, 748, 70, 40, 2], [545, 746, 80, 44, 7], [940, 750, 130, 80, 8], [860, 748, 60, 34, 4]]) {
    body += boulder(rx, ry, rw, rh, { ...midRock, seed: sd }, id.next('mr'), extra);
  }

  // the middle wave of birds
  const midBirds = [[470, 322, 0.4], [526, 292, 0.38], [580, 314, 0.36], [632, 282, 0.35], [684, 302, 0.33], [732, 274, 0.32], [780, 296, 0.31], [826, 268, 0.3]];
  midBirds.forEach(([bx, by, bs], i) => { body += ababil(bx, by, { s: bs, flip: true, up: i % 2 === 0 }); });

  // ------------------------------------------------ valley floor
  body += path(ridge([[-20, 742], [160, 736], [400, 744], [620, 736], [820, 744], [1020, 738]], 1000), { fill: `url(#${id('floor')})` });
  for (let i = 0; i < 26; i++) {
    const px = R() * 1000;
    const py = 760 + R() ** 1.3 * 230;
    const pr = 1.6 + (py - 740) / 70 + R() * 2.5;
    body += ellipse(px, py, pr * 1.5, pr, { fill: mix(C.rock3, '#C9799A', 0.2), opacity: 0.28 });
    body += ellipse(px + pr * 0.3, py - pr * 0.35, pr * 0.6, pr * 0.35, { fill: C.rock0, opacity: 0.25 });
  }

  // the road to Makkah that the elephant will not take
  body += path('M330,958 C470,930 600,872 652,812 C680,782 694,760 700,744 L726,744 C732,768 742,800 770,842 C800,890 820,930 840,1010 L420,1010 C380,990 340,975 330,958Z', { fill: mix(C.sand1, '#F0B08F', 0.45), opacity: 0.45 });

  // ------------------------------------------------ the elephant
  body += ellipse(400, 893, 255, 22, { fill: C.ink, opacity: 0.18 });
  body += elephant(372, 888, 0.88, id, extra);

  // the near wave of birds
  const nearBirds = [[130, 214, 0.72], [256, 160, 0.68], [380, 206, 0.64], [496, 142, 0.6], [612, 184, 0.56]];
  nearBirds.forEach(([bx, by, bs], i) => { body += ababil(bx, by, { s: bs, flip: true, up: i % 2 === 1 }); });

  // ------------------------------------------------ foreground framing
  const fg = { fill: C.rock3, dark: C.rock4, lit: C.rock1 };
  body += boulder(30, 1012, 250, 180, { ...fg, seed: 2 }, id.next('fr'), extra);
  body += boulder(178, 1014, 130, 76, { ...fg, fill: mix(C.rock3, C.rock2, 0.5), seed: 4 }, id.next('fr'), extra);
  body += boulder(975, 1012, 260, 200, { ...fg, seed: 6 }, id.next('fr'), extra);
  body += boulder(830, 1014, 140, 80, { ...fg, fill: mix(C.rock3, C.rock2, 0.5), seed: 8 }, id.next('fr'), extra);
  body += boulder(650, 1010, 60, 26, { ...fg, fill: mix(C.rock3, C.rock2, 0.6), seed: 12 }, id.next('fr'), extra);
  for (const [gx, gy, gh, sd] of [[120, 930, 50, 1], [230, 958, 40, 2], [880, 940, 46, 3], [760, 960, 36, 4]]) body += grass(gx, gy, { h: gh, fill: mix(C.leaf4, C.rock3, 0.35), n: 5, seed: sd });
  // little desert flowers
  for (const [fx, fy] of [[226, 944], [600, 966], [676, 946], [770, 948], [140, 922], [890, 930]]) {
    body += path(`M${fx},${fy + 16} Q${fx - 2},${fy + 8} ${fx},${fy}`, { fill: 'none', stroke: C.leaf4, 'stroke-width': 2.5 });
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      body += circle(fx + Math.cos(a) * 4.5, fy + Math.sin(a) * 4.5, 3.6, { fill: C.gold1 });
    }
    body += circle(fx, fy, 2.6, { fill: C.coral2 });
  }

  body += vignette(id('vig'));

  const defs = [
    linear(id('sky'), [[0, '#3B3274'], [0.22, '#5C4998'], [0.4, '#985D9E'], [0.52, '#D06F8A'], [0.6, '#F0906F'], [0.67, '#FFB877'], [0.76, '#FFD79A']]),
    linear(id('floor'), [[0, '#EBA683'], [0.35, '#DC8F72'], [1, '#B96F5F']]),
    glowDef(id('sunGlow'), '#FFE2A8', 0.85),
    radial(id('rayFade'), [[0, '#FFF0D2', 0.3], [0.5, '#FFF0D2', 0.1], [1, '#FFF0D2', 0]], { cx: 770, cy: 596, r: 640, units: 'userSpaceOnUse' }),
    glowDef(id('kGlow'), '#FFF2C8', 0.8),
    vignetteDef(id('vig'), C.ink, 0.22),
    ...extra,
  ].join('');
  return svgDoc({ defs, body });
}
