// The Cave and the Spider's Web (Quran 9:40; the spider and the dove are
// from the books of seerah).
// Night at the mouth of the Cave of Thawr: a big, beautiful spider web across
// the dark entrance, sparkling with dew in the moonlight, with a small cute
// spider at its heart; a dove sits on her nest of eggs on a ledge by the
// entrance; a little acacia tree, the moon, stars and desert mountains.
// Safe and calm, silver-blue. Inside is dark; no people.
import {
  C, svgDoc, ids, rng, mix, lerp, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  sparkle, starField, crescent, grass, r1, T, eye,
} from '../lib.js';

// ---------------------------------------------------------------- helpers
// A rounded boulder lit by the moon from the upper left, shaded inside its own
// clip. (x, y) = bottom centre.
function boulder(x, y, w, h, { fill, dark, lit, seed = 1 }, clipId, defsOut) {
  const R = rng(seed);
  const pts = [
    [x - w * 0.5, y + 4],
    [x - w * 0.47, y - h * R.range(0.38, 0.52)],
    [x - w * R.range(0.3, 0.38), y - h * R.range(0.74, 0.88)],
    [x - w * R.range(0.05, 0.12), y - h],
    [x + w * R.range(0.22, 0.3), y - h * R.range(0.86, 0.96)],
    [x + w * 0.47, y - h * R.range(0.45, 0.6)],
    [x + w * 0.5, y + 4],
  ];
  const d = blob(pts);
  defsOut.push(`<clipPath id="${clipId}"><path d="${d}"/></clipPath>`);
  return path(d, { fill }) + g({ 'clip-path': `url(#${clipId})` },
    ellipse(x + w * 0.42, y + h * 0.12, w * 0.55, h * 0.95, { fill: dark, opacity: 0.75 }),
    ellipse(x - w * 0.24, y - h * 1.0, w * 0.3, h * 0.2, { fill: lit, opacity: 0.5 }),
  );
}

// An orb web: spokes from the hub to anchor points, rings that sag a little
// between the spokes, and dew drops shining in the moonlight.
function web(hub, anchors, { rings = 10, seed = 4, color = '#E8EEFF' } = {}) {
  const R = rng(seed);
  let s = '';
  // spokes
  for (const [ax, ay] of anchors) s += path(`M${r1(hub[0])},${r1(hub[1])} L${r1(ax)},${r1(ay)}`, { stroke: color, 'stroke-width': 2, opacity: 0.75, 'stroke-linecap': 'round' });
  // rings
  const ringPts = [];
  for (let k = 1; k <= rings; k++) {
    const f = Math.pow(k / (rings + 0.6), 1.08);
    const pts = anchors.map(([ax, ay]) => [lerp(hub[0], ax, f), lerp(hub[1], ay, f)]);
    ringPts.push(pts);
    let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      const cx = lerp(mx, hub[0], 0.08);
      const cy = lerp(my, hub[1], 0.08);
      d += ` Q${r1(cx)},${r1(cy)} ${r1(b[0])},${r1(b[1])}`;
    }
    s += path(d, { fill: 'none', stroke: color, 'stroke-width': k < 3 ? 1.4 : 1.7, opacity: 0.62 });
  }
  // a soft little hub
  s += circle(hub[0], hub[1], 9, { fill: 'none', stroke: color, 'stroke-width': 1.6, opacity: 0.7 });
  // dew drops along the threads
  const drops = [];
  for (let k = 2; k < ringPts.length; k++) {
    const pts = ringPts[k];
    for (let i = 0; i < pts.length; i++) {
      if (R() < 0.42) continue;
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const t = R.range(0.2, 0.8);
      drops.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), R.range(2.2, 4.2)]);
    }
  }
  for (const [dx, dy, dr] of drops) {
    s += circle(dx, dy, dr, { fill: '#F4F8FF', opacity: 0.9 });
    s += circle(dx - dr * 0.3, dy - dr * 0.35, dr * 0.35, { fill: '#FFFFFF' });
  }
  // a few drops catch the moonlight and twinkle
  for (let i = 0; i < 9; i++) {
    const [dx, dy] = drops[Math.floor(R() * drops.length)];
    s += sparkle(dx, dy, R.range(7, 12), '#FFFFFF', { opacity: 0.95 });
  }
  return s;
}

// A small, round, friendly spider. (x, y) = body centre.
function spider(x, y, s = 1) {
  const leg = (sx, sy, kx, ky, ex, ey) => path(`M${sx},${sy} Q${kx},${ky} ${ex},${ey}`, { fill: 'none', stroke: '#5E4C8C', 'stroke-width': 5, 'stroke-linecap': 'round' });
  const p = [
    // a silk thread up to the hub
    path('M0,-30 L0,-64', { stroke: '#E8EEFF', 'stroke-width': 1.6, opacity: 0.8 }),
    // four little legs on each side
    leg(-14, -8, -40, -30, -46, -6), leg(-16, 0, -46, -6, -50, 14), leg(-15, 8, -42, 18, -44, 34), leg(-10, 14, -30, 34, -28, 46),
    leg(14, -8, 40, -30, 46, -6), leg(16, 0, 46, -6, 50, 14), leg(15, 8, 42, 18, 44, 34), leg(10, 14, 30, 34, 28, 46),
    // round body
    circle(0, 0, 26, { fill: '#7E68B4' }),
    ellipse(-7, -9, 13, 10, { fill: '#9C88CC', opacity: 0.8 }),
    ellipse(0, 14, 15, 8, { fill: '#6A559E', opacity: 0.7 }),
    // face
    eye(-9, -2, 5.2), eye(9, -2, 5.2),
    ellipse(-15, 8, 5, 3.2, { fill: C.cheek, opacity: 0.75 }),
    ellipse(15, 8, 5, 3.2, { fill: C.cheek, opacity: 0.75 }),
    path('M-5,9 Q0,13 5,9', { fill: 'none', stroke: '#2B2140', 'stroke-width': 2.2, 'stroke-linecap': 'round' }),
    // a tiny shine on top
    ellipse(-10, -16, 5, 3, { fill: '#FFFFFF', opacity: 0.5, transform: 'rotate(-25 -10 -16)' }),
  ];
  return g({ transform: T(x, y, s) }, p);
}

// A dove sitting on her nest, two eggs peeking out in front. Faces left.
// (x, y) = bottom centre of the nest.
function doveOnNest(x, y, s = 1) {
  const twig = '#8C6A4E';
  const twigDark = '#6B4E3A';
  const p = [];
  // the back of the nest
  p.push(ellipse(0, -18, 62, 20, { fill: twigDark }));
  // the dove, facing left
  p.push(path('M44,-40 L74,-56 L70,-34Z', { fill: '#B9B4D6' }));
  p.push(path('M-34,-36 C-34,-66 -6,-82 22,-78 C46,-74 58,-56 52,-34 C46,-24 20,-22 -6,-22 C-22,-22 -34,-26 -34,-36Z', { fill: '#E9E7F6' }));
  p.push(path('M-6,-48 C10,-66 40,-64 50,-46 C38,-36 10,-34 -6,-48Z', { fill: '#C9C3E3' }));
  p.push(path('M4,-44 C16,-54 34,-54 42,-46', { fill: 'none', stroke: '#A9A2CC', 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
  p.push(circle(-30, -70, 16, { fill: '#E9E7F6' }));
  p.push(path('M-44,-72 L-56,-68 L-44,-64Z', { fill: C.gold3 }));
  p.push(eye(-34, -72, 3.6));
  p.push(ellipse(-36, -62, 4.2, 2.6, { fill: C.cheek, opacity: 0.7 }));
  p.push(ellipse(-36, -78, 7, 4.5, { fill: '#FFFFFF', opacity: 0.7, transform: 'rotate(-25 -36 -78)' }));
  // two eggs in front
  p.push(ellipse(-20, -24, 11, 14, { fill: '#F6F1E6' }));
  p.push(ellipse(0, -22, 11, 14, { fill: '#EFE8DA' }));
  p.push(ellipse(-23, -28, 3.5, 5, { fill: '#FFFFFF', opacity: 0.8 }));
  p.push(ellipse(-3, -26, 3.5, 5, { fill: '#FFFFFF', opacity: 0.8 }));
  // the front rim of the nest, woven twigs
  p.push(path('M-64,-18 C-60,0 -30,8 0,8 C30,8 60,0 64,-18 C50,-10 26,-6 0,-6 C-26,-6 -50,-10 -64,-18Z', { fill: twig }));
  for (let i = 0; i < 7; i++) {
    const tx = -54 + i * 18;
    p.push(path(`M${tx - 10},${-10 + (i % 2) * 4} q12,${-6 + (i % 3) * 4} 24,${2 - (i % 2) * 4}`, { fill: 'none', stroke: i % 2 ? '#A88464' : twigDark, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  }
  p.push(path('M-60,-14 l-12,-6 M58,-12 l14,-8 M30,4 l10,8', { stroke: twigDark, 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
  return g({ transform: T(x, y, s) }, p);
}

// A small umbrella acacia: a crooked trunk that forks low and a wide, flat
// crown in two tiers. (x, y) = base of the trunk.
function acacia(x, y, s = 1, { trunk = '#4A4668', trunkLit = '#625D86', leaf = '#4F7774', leafDark = '#395B5C', leafLight = '#6F9790' } = {}) {
  const p = [
    // trunk and branches
    path('M-8,0 C-6,-30 -12,-56 -30,-84 L-22,-90 C-8,-70 -2,-52 0,-40 C6,-62 20,-84 44,-102 L50,-94 C30,-78 14,-52 10,-26 C8,-14 8,-6 8,0Z', { fill: trunk }),
    path('M-8,0 C-6,-30 -12,-56 -30,-84 L-26,-87 C-12,-64 -6,-40 -2,0Z', { fill: trunkLit, opacity: 0.7 }),
    path('M-28,-86 C-44,-98 -62,-104 -80,-106 M46,-98 C60,-108 76,-112 92,-112 M2,-52 C0,-80 4,-98 8,-112', { fill: 'none', stroke: trunk, 'stroke-width': 6, 'stroke-linecap': 'round' }),
    // lower tier of the crown
    path('M-112,-106 C-100,-124 -60,-132 -10,-132 C40,-132 90,-128 112,-112 C96,-100 50,-96 0,-96 C-50,-96 -96,-98 -112,-106Z', { fill: leafDark }),
    path('M-104,-112 C-90,-128 -50,-136 -6,-136 C40,-136 84,-130 104,-116 C80,-110 40,-108 0,-108 C-44,-108 -84,-108 -104,-112Z', { fill: leaf }),
    // upper tier
    path('M-70,-136 C-56,-152 -26,-158 6,-158 C40,-158 66,-152 78,-138 C60,-130 30,-128 4,-128 C-24,-128 -54,-130 -70,-136Z', { fill: leafDark }),
    path('M-64,-140 C-50,-156 -22,-162 6,-162 C38,-162 62,-156 72,-142 C54,-138 30,-136 4,-136 C-22,-136 -48,-136 -64,-140Z', { fill: leaf }),
    // moonlight on the tops
    path('M-56,-148 C-40,-158 -16,-160 4,-160 C-14,-156 -36,-152 -56,-148Z', { fill: leafLight }),
    path('M-96,-118 C-80,-128 -50,-133 -20,-134 C-46,-130 -72,-126 -96,-118Z', { fill: leafLight, opacity: 0.8 }),
  ];
  return g({ transform: T(x, y, s) }, p);
}

export default function render() {
  const id = ids('s41');
  const extra = [];
  const hub = [500, 548];

  let body = '';
  // ------------------------------------------------ silver-blue night sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += starField({ seed: 41, n: 80, area: [0, 0, 1000, 420], twinkles: 10, color: '#EEF2FF', gold: C.gold0, avoid: [[170, 140, 100]] });
  body += circle(170, 140, 170, { fill: `url(#${id('moonGlow')})` });
  body += crescent(170, 140, 52, { fill: '#F4F1E2', angle: -30, thickness: 0.46 });

  // ------------------------------------------------ desert mountains far away
  body += path(ridge([[-20, 470], [80, 430], [170, 452], [260, 410], [340, 440], [420, 420], [520, 450], [620, 416], [720, 446], [820, 404], [920, 436], [1020, 420]], 1000), { fill: '#5B6E9E' });
  body += path(ridge([[-20, 520], [110, 488], [230, 508], [350, 480], [470, 500], [600, 476], [730, 504], [860, 474], [1020, 500]], 1000), { fill: '#4B5D8E' });

  // ------------------------------------------------ Mount Thawr and the cave
  const hillD = ridge([[-20, 640], [70, 560], [160, 470], [250, 380], [360, 300], [480, 262], [600, 270], [700, 318], [790, 390], [880, 470], [960, 540], [1020, 580]], 1000);
  body += path(hillD, { fill: '#46567F' });
  extra.push(`<clipPath id="${id('hill')}"><path d="${hillD}"/></clipPath>`);
  body += g({ 'clip-path': `url(#${id('hill')})` },
    ellipse(820, 760, 330, 420, { fill: '#38466E', opacity: 0.85 }),
    ellipse(240, 360, 260, 120, { fill: '#5A6B98', opacity: 0.7, transform: 'rotate(-30 240 360)' }),
    ellipse(470, 290, 150, 40, { fill: '#6577A3', opacity: 0.6 }),
  );
  // big boulders framing the mouth
  const rk = { fill: '#55658F', dark: '#3A4870', lit: '#8496C2' };
  body += boulder(232, 760, 210, 260, { ...rk, seed: 3 }, id.next('b'), extra);
  body += boulder(770, 770, 230, 300, { ...rk, fill: '#4F5F89', seed: 5 }, id.next('b'), extra);
  body += boulder(500, 412, 420, 150, { ...rk, fill: '#5A6A95', seed: 7 }, id.next('b'), extra);
  // the dark mouth of the cave
  const mouth = [[312, 772], [300, 650], [318, 540], [370, 452], [450, 402], [540, 396], [620, 430], [680, 506], [700, 620], [692, 772]];
  const mouthD = blob(mouth);
  body += path(blob(mouth.map(([mx, my]) => [500 + (mx - 500) * 1.06, 590 + (my - 590) * 1.05])), { fill: '#33406A' });
  body += path(mouthD, { fill: `url(#${id('inside')})` });
  // the sandy floor just inside, catching a little moonlight
  body += path('M330,772 C380,746 450,736 500,736 C560,736 630,746 680,772Z', { fill: '#2B355C' });

  // ------------------------------------------------ the web across the entrance
  const anchors = [[318, 640], [322, 560], [352, 488], [400, 436], [462, 408], [530, 402], [596, 424], [646, 470], [680, 540], [690, 620], [690, 700], [660, 760], [560, 768], [440, 768], [350, 758], [318, 710]];
  body += circle(hub[0], hub[1] + 20, 230, { fill: `url(#${id('webGlow')})` });
  body += web(hub, anchors, { rings: 11, seed: 6 });
  body += spider(hub[0], hub[1] + 62, 0.95);

  // ------------------------------------------------ the ledge with the dove's nest
  body += path('M700,560 C740,548 820,546 872,556 C890,560 892,574 878,580 C830,592 740,590 702,584Z', { fill: '#6C7DA8' });
  body += path('M702,584 C740,590 830,592 878,580 C876,598 850,610 790,612 C740,612 712,604 702,584Z', { fill: '#3E4B74' });
  body += doveOnNest(794, 566, 0.92);

  // ------------------------------------------------ the little acacia tree
  body += ellipse(150, 800, 70, 8, { fill: C.ink, opacity: 0.2 });
  body += acacia(146, 800, 1.0);

  // ------------------------------------------------ ground and foreground
  body += path(ridge([[-20, 790], [140, 776], [320, 784], [500, 778], [700, 786], [880, 776], [1020, 784]], 1000), { fill: `url(#${id('ground')})` });
  for (const [rx, ry, rw] of [[420, 820, 120], [600, 836, 100], [480, 862, 150], [300, 846, 90], [720, 868, 110]]) body += path(`M${rx - rw / 2},${ry} q${rw / 2},-8 ${rw},0`, { fill: 'none', stroke: '#8D9DC8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.35 });
  const fr = { fill: '#2C3760', dark: '#202848', lit: '#6678A8' };
  body += boulder(60, 1012, 240, 150, { ...fr, seed: 11 }, id.next('f'), extra);
  body += boulder(215, 1012, 130, 70, { ...fr, seed: 12 }, id.next('f'), extra);
  body += boulder(940, 1012, 250, 170, { ...fr, seed: 13 }, id.next('f'), extra);
  body += boulder(790, 1012, 140, 74, { ...fr, seed: 14 }, id.next('f'), extra);
  for (const [gx, gy, gh, sd] of [[300, 900, 40, 1], [360, 930, 30, 2], [640, 912, 36, 3], [700, 940, 30, 4], [150, 896, 34, 5], [860, 900, 36, 6]]) body += grass(gx, gy, { h: gh, fill: '#41626A', n: 5, seed: sd });
  // little white desert flowers, glowing softly in the moonlight
  for (const [fx, fy, fr2] of [[322, 888, 7], [342, 900, 5.5], [660, 898, 7], [684, 912, 5.5], [176, 884, 6], [880, 888, 6.5]]) {
    body += path(`M${fx},${fy + 14} Q${fx - 2},${fy + 7} ${fx},${fy}`, { fill: 'none', stroke: '#41626A', 'stroke-width': 2.2 });
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      body += ellipse(fx + Math.cos(a) * fr2 * 0.7, fy + Math.sin(a) * fr2 * 0.7, fr2 * 0.55, fr2 * 0.38, { fill: '#F2F4FF', transform: `rotate(${r1((a * 180) / Math.PI)} ${r1(fx + Math.cos(a) * fr2 * 0.7)} ${r1(fy + Math.sin(a) * fr2 * 0.7)})` });
    }
    body += circle(fx, fy, fr2 * 0.3, { fill: C.gold1 });
  }
  // pebbles
  const RP = rng(9);
  for (let i = 0; i < 7; i++) {
    const px = 380 + RP() * 260;
    const py = 830 + RP() * 110;
    const pr = 4 + RP() * 4;
    body += ellipse(px, py, pr * 1.5, pr, { fill: '#4A5884' });
    body += ellipse(px - pr * 0.35, py - pr * 0.35, pr * 0.8, pr * 0.4, { fill: '#8D9DC8', opacity: 0.6 });
  }

  body += vignette(id('vig'));

  const defs = [
    linear(id('sky'), [[0, '#16244A'], [0.45, '#2B4170'], [1, '#6A85B6']]),
    linear(id('ground'), [[0, '#5D6C97'], [1, '#3C4870']]),
    radial(id('inside'), [[0, '#0D1430'], [0.7, '#141D3D'], [1, '#222D52']], { cx: 0.5, cy: 0.62, r: 0.6 }),
    glowDef(id('moonGlow'), '#F4F1E2', 0.4),
    glowDef(id('webGlow'), '#AFC2F0', 0.22),
    vignetteDef(id('vig'), C.ink, 0.22),
    ...extra,
  ].join('');
  return svgDoc({ defs, body });
}
