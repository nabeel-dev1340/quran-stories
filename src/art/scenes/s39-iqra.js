// Read! The first words (Quran 96:1-5).
// Night at Jabal al-Nur: a tall rocky mountain with the little Cave Hira
// near its top, soft golden light pouring out of it into the deep-blue sky.
// Far below sleeps the valley of Makkah with its tiny houses and the Ka'bah;
// a crescent moon and stars above. No people, no angel - only light.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  sparkle, starField, crescent, kaaba, r1, T, eye,
} from '../lib.js';

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

// Tiny flat-roofed house at night with a warm lit window. (x, y) = bottom centre.
function nightHouse(x, y, w, h, { wall, side, roof, lamp, lit = true }) {
  let s = rect(x - w / 2, y - h, w, h, { fill: wall });
  s += rect(x + w * 0.18, y - h, w * 0.32, h, { fill: side, opacity: 0.7 });
  s += path(`M${r1(x - w / 2 - 1.5)},${r1(y - h)} L${r1(x - w / 2 + 3)},${r1(y - h - 5)} L${r1(x + w / 2 + 4.5)},${r1(y - h - 5)} L${r1(x + w / 2 + 1.5)},${r1(y - h)}Z`, { fill: roof });
  if (lit) {
    const wx = x - w * 0.22;
    s += path(`M${r1(wx - w * 0.1)},${r1(y - h * 0.3)} L${r1(wx - w * 0.1)},${r1(y - h * 0.58)} Q${r1(wx)},${r1(y - h * 0.72)} ${r1(wx + w * 0.1)},${r1(y - h * 0.58)} L${r1(wx + w * 0.1)},${r1(y - h * 0.3)}Z`, { fill: lamp });
  }
  return s;
}

// A rounded boulder lit by the moon from the upper left, shaded inside its
// own clip. (x, y) = bottom centre.
function boulder(x, y, w, h, { fill, dark, lit, seed = 1 }, clipId, defsOut) {
  const R = rng(seed);
  const pts = [
    [x - w * 0.5, y + 4],
    [x - w * 0.46, y - h * R.range(0.35, 0.5)],
    [x - w * R.range(0.3, 0.38), y - h * R.range(0.7, 0.85)],
    [x - w * R.range(0.05, 0.12), y - h],
    [x + w * R.range(0.22, 0.3), y - h * R.range(0.86, 0.96)],
    [x + w * 0.48, y - h * R.range(0.45, 0.6)],
    [x + w * 0.5, y + 4],
  ];
  const d = blob(pts);
  defsOut.push(`<clipPath id="${clipId}"><path d="${d}"/></clipPath>`);
  return path(d, { fill }) + g({ 'clip-path': `url(#${clipId})` },
    ellipse(x + w * 0.45, y + h * 0.1, w * 0.55, h * 0.95, { fill: dark, opacity: 0.8 }),
    ellipse(x - w * 0.26, y - h * 1.02, w * 0.26, h * 0.18, { fill: lit, opacity: 0.45 }),
  );
}

// A little desert hare sitting up, looking toward the light. Faces right.
// (x, y) = between its feet.
function hare(x, y, { s = 1, flip = false, fur = '#A9A6CB', shade = '#7F7CA8', light = '#CFCBE6', belly = '#E6E2F2', earIn = '#E5A9C0' } = {}) {
  const p = [
    // far ear, leaning back
    path('M6,-92 C-6,-130 -2,-160 8,-166 C18,-160 20,-128 16,-94Z', { fill: shade }),
    // fluffy tail
    circle(-44, -16, 11, { fill: belly }),
    // body and haunch
    path(blob([[-40, 0], [-50, -30], [-36, -60], [-6, -74], [20, -62], [30, -32], [24, 0]]), { fill: fur }),
    ellipse(-22, -20, 24, 20, { fill: shade, opacity: 0.45 }),
    path('M-36,-60 C-24,-72 -2,-78 14,-70', { fill: 'none', stroke: light, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }),
    // chest
    ellipse(18, -36, 12, 20, { fill: belly, opacity: 0.9 }),
    // head, tilted up toward the mountain
    ellipse(22, -80, 22, 18, { fill: fur, transform: 'rotate(-24 22 -80)' }),
    // near ear
    path('M14,-94 C10,-132 20,-162 32,-166 C42,-160 38,-126 26,-92Z', { fill: fur }),
    path('M19,-100 C17,-128 24,-150 31,-155 C36,-148 33,-124 25,-100Z', { fill: earIn, opacity: 0.85 }),
    // face
    eye(30, -86, 3.6),
    circle(43, -88, 2.8, { fill: C.rose2 }),
    ellipse(32, -74, 5, 3.2, { fill: C.cheek, opacity: 0.65 }),
    // paws
    ellipse(20, -3, 9, 5, { fill: light }),
    ellipse(-14, -3, 20, 6, { fill: fur }),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

export default function render() {
  const id = ids('s39');
  const R = rng(39);
  const extra = [];
  const cave = [670, 404];

  let body = '';
  // ------------------------------------------------ night sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += starField({ seed: 39, n: 90, area: [0, 0, 1000, 640], twinkles: 12, color: '#E8EEFF', gold: C.gold1, avoid: [[180, 160, 110], [cave[0], cave[1], 210]] });
  // the crescent moon
  body += circle(180, 160, 150, { fill: `url(#${id('moonGlow')})` });
  body += crescent(180, 160, 58, { fill: C.gold0, angle: -30, thickness: 0.46 });

  // gentle rays of light from the cave
  for (let i = 0; i < 7; i++) {
    const a = ((-162 + i * 24) * Math.PI) / 180;
    const w = 0.04 + (i % 2) * 0.025;
    body += path(`M${cave[0]},${cave[1]} L${r1(cave[0] + Math.cos(a - w) * 760)},${r1(cave[1] + Math.sin(a - w) * 760)} L${r1(cave[0] + Math.cos(a + w) * 760)},${r1(cave[1] + Math.sin(a + w) * 760)}Z`, { fill: `url(#${id('rayFade')})` });
  }
  body += circle(cave[0], cave[1], 330, { fill: `url(#${id('caveGlow')})` });

  // ------------------------------------------------ far hills around Makkah
  body += path(ridge([[-20, 640], [70, 612], [170, 630], [260, 600], [360, 626], [460, 650], [560, 660]], 1000), { fill: '#2C4176' });
  body += path(ridge([[-20, 690], [90, 668], [200, 682], [300, 664], [420, 690], [540, 700]], 1000), { fill: '#33497F' });

  // ------------------------------------------------ the valley of Makkah far below
  body += path(ridge([[-20, 722], [140, 716], [300, 724], [460, 732], [600, 740]], 1000), { fill: `url(#${id('valley')})` });
  body += ellipse(220, 800, 260, 70, { fill: `url(#${id('townGlow')})` });
  const house = { wall: '#40507E', side: '#33416C', roof: '#56679A', lamp: C.gold1 };
  const houses = [];
  let tries = 0;
  while (houses.length < 46 && tries < 2000) {
    tries++;
    const hx = 226 + R.range(-1, 1) * 210;
    const hy = 806 + R.range(-1, 1) * 58;
    const ex = (hx - 226) / 210;
    const ey = (hy - 806) / 58;
    if (ex * ex + ey * ey > 1) continue;
    if (((hx - 226) / 62) ** 2 + ((hy - 812) / 26) ** 2 < 1) continue; // open space around the Ka'bah
    if (hx > 400 && hy < 790) continue; // behind the mountain's foot
    if (hx < 52) continue; // keep clear of the trimmed edge
    if (houses.some(([ox, oy]) => Math.abs(ox - hx) < 22 && Math.abs(oy - hy) < 12)) continue;
    const k = 0.75 + ((hy - 748) / 116) * 0.5; // nearer rows are a little bigger
    houses.push([hx, hy, (20 + R.range(0, 10)) * k, (14 + R.range(0, 9) + (R() < 0.2 ? 8 : 0)) * k, R() < 0.55]);
  }
  houses.sort((a, b) => a[1] - b[1]);
  for (const [hx, hy, hw, hh, lit] of houses.filter((h) => h[1] < 812)) body += nightHouse(hx, hy, hw, hh, { ...house, lit });
  body += kaabaFixed(226, 818, { s: 0.2, glowId: id('kGlow') });
  for (const [hx, hy, hw, hh, lit] of houses.filter((h) => h[1] >= 812)) body += nightHouse(hx, hy, hw, hh, { ...house, lit });

  // ------------------------------------------------ Jabal al-Nur
  // A jagged rocky massif with a tall peak and a smaller second peak,
  // drawn as soft-cornered flat facets lit by the moon from the upper left.
  const P = (pts) => 'M' + pts.map((q) => q.map(r1).join(',')).join(' L') + 'Z';
  const facet = (pts, fill, op = 1) => path(P(pts), { fill, stroke: fill, 'stroke-width': 3, 'stroke-linejoin': 'round', opacity: op });
  const LIT = '#5065A0';
  const LIT2 = '#465A93';
  const MID = '#3A4D83';
  const SHD = '#2B3A69';
  const DEEP = '#222E58';
  // a neighbouring ridge on the right, in deeper shadow
  body += facet([[740, 1010], [790, 560], [850, 470], [920, 436], [990, 456], [1040, 476], [1040, 1010]], '#24325E');
  body += facet([[920, 436], [890, 520], [872, 640], [866, 1010], [1040, 1010], [1040, 476], [990, 456]], '#1F2A52', 0.7);
  const sil = [[240, 1010], [286, 900], [330, 840], [352, 790], [400, 730], [428, 660], [480, 600], [506, 548], [548, 500], [566, 440], [602, 392], [618, 336], [646, 266], [664, 214], [678, 194], [692, 204], [704, 236], [716, 262], [730, 246], [744, 230], [760, 250], [778, 290], [808, 336], [842, 380], [880, 420], [920, 466], [968, 510], [1040, 560], [1040, 1010]];
  body += facet(sil, MID);
  extra.push(`<clipPath id="${id('mtnClip')}"><path d="${P(sil)}"/></clipPath>`);
  body += g({ 'clip-path': `url(#${id('mtnClip')})` },
    // moonlit faces on the left
    facet([[678, 194], [664, 214], [646, 266], [618, 336], [640, 332], [662, 268]], mix(LIT, '#FFFFFF', 0.1)),
    facet([[618, 336], [602, 392], [566, 440], [598, 432], [622, 384], [640, 332]], LIT),
    facet([[566, 440], [548, 500], [506, 548], [480, 600], [536, 584], [574, 520], [598, 432]], LIT2),
    facet([[480, 600], [428, 660], [400, 730], [466, 706], [514, 646], [536, 584]], LIT),
    facet([[400, 730], [352, 790], [330, 840], [396, 824], [446, 772], [466, 706]], LIT2),
    facet([[330, 840], [286, 900], [240, 1010], [336, 1010], [374, 916], [396, 824]], LIT),
    // middle faces
    facet([[662, 268], [640, 332], [622, 384], [652, 380], [676, 330], [690, 290]], '#41558C'),
    facet([[536, 584], [514, 646], [560, 650], [592, 600], [574, 520]], '#41558C'),
    facet([[446, 772], [396, 824], [440, 850], [490, 800], [520, 760], [466, 706]], '#3E5188'),
    // shaded faces on the right
    facet([[678, 194], [692, 204], [704, 236], [716, 262], [706, 330], [690, 290], [676, 330], [662, 268]], SHD),
    facet([[716, 262], [730, 246], [744, 230], [760, 250], [778, 290], [764, 362], [732, 350], [706, 330]], SHD),
    facet([[778, 290], [808, 336], [842, 380], [880, 420], [920, 466], [968, 510], [1040, 560], [1040, 1010], [770, 1010], [748, 820], [740, 640], [750, 480], [764, 362]], SHD),
    facet([[842, 380], [880, 420], [920, 466], [968, 510], [1040, 560], [1040, 1010], [880, 1010], [862, 820], [852, 620], [848, 480]], DEEP, 0.8),
    facet([[706, 330], [732, 350], [764, 362], [750, 480], [726, 470], [712, 400]], '#33447A'),
    // rock ribs and crevices
    facet([[652, 380], [676, 330], [690, 380], [672, 470], [652, 560], [640, 540], [656, 460]], SHD, 0.8),
    facet([[620, 600], [640, 560], [652, 600], [630, 700], [612, 800], [600, 790], [612, 700]], SHD, 0.75),
    facet([[700, 600], [716, 560], [726, 620], [716, 760], [704, 900], [692, 890], [700, 760]], DEEP, 0.6),
    facet([[566, 700], [580, 680], [590, 720], [566, 820], [548, 900], [538, 890], [556, 800]], SHD, 0.7),
    facet([[800, 520], [812, 500], [822, 560], [818, 700], [806, 700], [808, 600]], '#33447A', 0.8),
    // ledges catching the moonlight
    ...[[492, 676, 60], [430, 790, 70], [540, 548, 50], [362, 902, 60], [590, 640, 46], [520, 820, 60], [640, 760, 50], [580, 900, 60]].map(([lx, ly, lw]) =>
      path(`M${lx - lw / 2},${ly + 3} L${lx + lw / 2},${ly - 4}`, { stroke: mix(LIT, '#FFFFFF', 0.2), 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 })),
    // warm light spilling down the slope below the cave
    ellipse(cave[0] - 40, cave[1] + 150, 190, 230, { fill: `url(#${id('spill')})` }),
  );
  // the cave: a small opening in the rock under an overhanging slab, full
  // of soft golden light that spills onto the ledge below
  const [cx, cy] = cave;
  const mouth = [[cx - 40, cy + 26], [cx - 46, cy + 2], [cx - 34, cy - 22], [cx - 8, cy - 34], [cx + 20, cy - 30], [cx + 38, cy - 10], [cx + 40, cy + 26]];
  body += path(blob(mouth.map(([x, y]) => [cx + (x - cx) * 1.18, cy + (y - cy) * 1.15 - 2])), { fill: DEEP });
  body += path(blob(mouth), { fill: `url(#${id('caveLight')})` });
  // overhanging slab, its top in moonlight and its underside warmed by the glow
  body += facet([[cx - 58, cy - 26], [cx - 34, cy - 50], [cx + 6, cy - 60], [cx + 44, cy - 50], [cx + 60, cy - 30], [cx + 30, cy - 32], [cx - 6, cy - 38], [cx - 36, cy - 30]], '#4C609A');
  body += facet([[cx - 34, cy - 50], [cx + 6, cy - 60], [cx + 44, cy - 50], [cx + 6, cy - 52]], mix('#4C609A', '#FFFFFF', 0.2));
  body += facet([[cx - 36, cy - 30], [cx - 6, cy - 38], [cx + 30, cy - 32], [cx + 10, cy - 30], [cx - 20, cy - 26]], '#C9B88C', 0.75);
  // a dark boulder on the right, lit gold on its inner edge
  body += facet([[cx + 36, cy + 34], [cx + 40, cy + 2], [cx + 56, cy - 18], [cx + 76, cy - 10], [cx + 84, cy + 20], [cx + 70, cy + 38]], SHD);
  body += facet([[cx + 41, cy + 4], [cx + 50, cy - 8], [cx + 47, cy + 14], [cx + 43, cy + 28]], '#C8B487', 0.45);
  // a smaller rock on the left, lit on its inner edge
  body += facet([[cx - 70, cy + 34], [cx - 66, cy + 12], [cx - 50, cy + 4], [cx - 40, cy + 18], [cx - 42, cy + 36]], '#465A93');
  // the ledge in front of the cave, washed with light
  body += path(blob([[cx - 50, cy + 32], [cx - 10, cy + 29], [cx + 30, cy + 30], [cx + 50, cy + 35], [cx + 20, cy + 42], [cx - 30, cy + 41]]), { fill: '#F0D28C', opacity: 0.5 });
  for (const [sx, sy, ss] of [[cx - 120, cy - 50, 10], [cx + 110, cy - 80, 8], [cx - 50, cy - 120, 7], [cx + 40, cy - 160, 11], [cx + 160, cy - 150, 6], [cx - 160, cy - 140, 7], [cx - 110, cy + 50, 6]]) body += sparkle(sx, sy, ss, '#FFF3CF', { opacity: 0.95 });

  // soft night mist in the valley
  body += ellipse(330, 870, 420, 60, { fill: `url(#${id('mist')})` });

  // ------------------------------------------------ foreground rocks (where we stand)
  const fg = { fill: '#222D54', dark: '#18203F', lit: '#4A5E95' };
  body += boulder(60, 1015, 260, 150, { ...fg, seed: 2 }, id.next('fr'), extra);
  body += boulder(230, 1015, 160, 80, { ...fg, seed: 4 }, id.next('fr'), extra);
  body += boulder(930, 1015, 280, 200, { ...fg, seed: 6 }, id.next('fr'), extra);
  body += boulder(780, 1015, 150, 90, { ...fg, seed: 8 }, id.next('fr'), extra);
  body += ellipse(872, 836, 40, 6, { fill: C.ink, opacity: 0.3 });
  body += hare(876, 836, { s: 0.66, flip: true });

  body += vignette(id('vig'));

  const defs = [
    linear(id('sky'), [[0, '#0C1530'], [0.35, '#142347'], [0.62, '#20366A'], [0.8, '#2C4780']]),
    linear(id('valley'), [[0, '#2E4178'], [1, '#263866']]),
    glowDef(id('moonGlow'), C.gold0, 0.35),
    glowDef(id('caveGlow'), '#FFE6A6', 0.7),
    glowDef(id('kGlow'), '#FFF0C0', 0.7),
    radial(id('townGlow'), [[0, '#F7C24F', 0.22], [1, '#F7C24F', 0]]),
    radial(id('spill'), [[0, '#FFD98A', 0.42], [1, '#FFD98A', 0]]),
    radial(id('caveLight'), [[0, '#FFFFFF'], [0.35, '#FFF4CF'], [1, '#FFD27A']], { cx: 0.42, cy: 0.62, r: 0.62 }),
    radial(id('rayFade'), [[0, '#FFEBB8', 0.24], [0.4, '#FFEBB8', 0.07], [1, '#FFEBB8', 0]], { cx: cave[0], cy: cave[1], r: 700, units: 'userSpaceOnUse' }),
    radial(id('mist'), [[0, '#8EA2D4', 0.22], [1, '#8EA2D4', 0]]),
    vignetteDef(id('vig'), C.ink, 0.25),
    ...extra,
  ].join('');
  return svgDoc({ defs, body });
}
