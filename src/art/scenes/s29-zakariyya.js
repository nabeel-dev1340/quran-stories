// Zakariyya's prayer (Quran 3:37-41, 19:2-11).
// Inside the mihrab at night: a tiled, arched niche lit by a hanging oil
// lamp, a prayer rug, a bowl of fresh fruit on a low table (Maryam's
// provision from Allah, 3:37), an arched window with stars and a crescent,
// and an empty wooden cradle with a soft blanket - the good news of baby
// Yahya. No one is shown.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g, smooth, blob,
  sparkle, star8, crescent, eye, T, r1,
} from '../lib.js';

const line = (c, w, a = {}) => ({ fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a });

// Pointed (two-centred) arch path: from (x0, ySpring) to (x1, ySpring),
// apex at height h above the spring line, closed down to yBottom.
function archPath(x0, x1, ySpring, h, yBottom) {
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  return `M${r1(x0)},${r1(yBottom)} L${r1(x0)},${r1(ySpring)} C${r1(x0)},${r1(ySpring - h * 0.62)} ${r1(cx - w * 0.2)},${r1(ySpring - h * 0.9)} ${r1(cx)},${r1(ySpring - h)} C${r1(cx + w * 0.2)},${r1(ySpring - h * 0.9)} ${r1(x1)},${r1(ySpring - h * 0.62)} ${r1(x1)},${r1(ySpring)} L${r1(x1)},${r1(yBottom)}Z`;
}

// A hanging glass mosque lamp. (x, y) = top of the lamp body.
function oilLamp(x, y, glowId) {
  const P = [];
  P.push(circle(0, 70, 230, { fill: `url(#${glowId})` }));
  // chains from the hook to the three handles
  P.push(path(`M0,${-y} L0,-70 M0,-70 L-40,8 M0,-70 L40,8 M0,-70 L0,4`, line(C.gold4, 2.6)));
  P.push(circle(0, -70, 6, { fill: 'none', stroke: C.gold3, 'stroke-width': 3 }));
  // flared neck
  P.push(path('M-46,0 L46,0 L28,58 L-28,58Z', { fill: '#F4C36A' }));
  P.push(path('M-30,6 L30,6 L20,54 L-20,54Z', { fill: '#FFE7A8', opacity: 0.8 }));
  P.push(path('M-46,0 L46,0 L44,8 L-44,8Z', { fill: C.gold4 }));
  // glowing bulb
  P.push(path('M-30,56 C-74,64 -86,128 -50,150 C-30,162 30,162 50,150 C86,128 74,64 30,56Z', { fill: '#F2B65A' }));
  P.push(path('M-24,62 C-62,72 -70,126 -40,144 C-24,152 24,152 40,144 C70,126 62,72 24,62Z', { fill: '#FFE3A0' }));
  P.push(ellipse(0, 102, 26, 30, { fill: '#FFF8E0' }));
  // enamel band with little medallions
  P.push(path('M-72,94 C-40,104 40,104 72,94 L70,108 C40,118 -40,118 -70,108Z', { fill: C.water3 }));
  for (const mx of [-46, -16, 16, 46]) P.push(circle(mx, 106, 5, { fill: C.gold2 }));
  // handles and foot
  for (const hx of [-40, 40]) P.push(circle(hx, 12, 6, { fill: 'none', stroke: C.gold3, 'stroke-width': 3 }));
  P.push(path('M-18,156 L18,156 L24,172 L-24,172Z', { fill: C.gold4 }));
  P.push(ellipse(-26, 26, 6, 16, { fill: C.white, opacity: 0.5 }));
  return g({ transform: `translate(${x} ${y})` }, P);
}

// A bowl of fruit on a low round table. (x, y) = floor point under the table.
function fruitTable(x, y, R) {
  const P = [];
  P.push(ellipse(0, 4, 130, 16, { fill: C.ink, opacity: 0.25 }));
  // table legs and top
  for (const lx of [-82, 82]) P.push(path(`M${lx - 7},0 L${lx - 4},-62 L${lx + 4},-62 L${lx + 7},0Z`, { fill: C.wood3 }));
  P.push(path('M-5,0 L-4,-60 L4,-60 L5,0Z', { fill: C.wood4 }));
  P.push(ellipse(0, -66, 118, 22, { fill: C.wood2 }));
  P.push(ellipse(0, -72, 118, 22, { fill: C.wood1 }));
  P.push(ellipse(-30, -78, 50, 8, { fill: C.wood0, opacity: 0.6 }));
  // brass bowl: foot, inner rim behind the fruit, then the fruit, then the front
  P.push(path('M-22,-70 L22,-70 L28,-80 L-28,-80Z', { fill: C.gold4 }));
  P.push(ellipse(0, -120, 92, 18, { fill: C.gold5 }));
  const fig = (fx, fy, rot) => g({ transform: `translate(${fx} ${fy}) rotate(${rot})` },
    path('M0,-22 C8,-16 18,2 13,13 C8,22 -8,22 -13,13 C-18,2 -8,-16 0,-22Z', { fill: '#7B5C8E' }),
    path('M0,-22 C-7,-13 -12,0 -9,11', line('#A88BB8', 3, { opacity: 0.6 })),
    path('M0,-22 L1,-30', line(C.leaf4, 3)));
  const pom = (px, py, r) => circle(px, py, r, { fill: C.coral3 }) + circle(px - r * 0.3, py - r * 0.3, r * 0.32, { fill: C.coral1, opacity: 0.7 }) + path(`M${r1(px - r * 0.25)},${r1(py - r * 0.9)} L${r1(px - r * 0.18)},${r1(py - r * 1.2)} L${r1(px)},${r1(py - r * 1.02)} L${r1(px + r * 0.18)},${r1(py - r * 1.2)} L${r1(px + r * 0.25)},${r1(py - r * 0.9)}Z`, { fill: C.coral4 });
  const grapes = (gx, gy, sc) => {
    let out = path(`M${gx},${gy - 24 * sc} q6,-12 16,-14`, line(C.leaf4, 3)) + path(`M${gx + 4},${gy - 28 * sc} q18,-14 30,-4 q-14,10 -30,4Z`, { fill: C.leaf3 });
    const rows = [[-12, 0, 12], [-18, -6, 6, 18], [-12, 0, 12], [-6, 6], [0]];
    rows.forEach((row, ri) => row.forEach((dx) => {
      out += circle(gx + dx * sc, gy - 18 * sc + ri * 11 * sc, 8 * sc, { fill: C.plum2 });
      out += circle(gx + dx * sc - 2.5 * sc, gy - 21 * sc + ri * 11 * sc, 2.4 * sc, { fill: C.plum0, opacity: 0.8 });
    }));
    return out;
  };
  P.push(pom(-50, -132, 22), fig(-14, -140, -20), pom(32, -142, 26), fig(62, -128, 24), grapes(-26, -150, 0.95), pom(4, -118, 18));
  // the front of the bowl, over the fruit
  P.push(path('M-92,-120 C-88,-92 -48,-80 0,-80 C48,-80 88,-92 92,-120 C60,-110 -60,-110 -92,-120Z', { fill: C.gold3 }));
  P.push(path('M-92,-120 C-88,-100 -62,-88 -30,-83 C-56,-92 -74,-104 -78,-117Z', { fill: C.gold1, opacity: 0.7 }));
  P.push(path('M-92,-120 C-60,-110 60,-110 92,-120', line(C.gold2, 3)));
  // a halved fig and a bunch of grapes spilling onto the table
  P.push(ellipse(-70, -78, 17, 9, { fill: '#7B5C8E' }), ellipse(-70, -79, 13, 6.5, { fill: C.rose1 }), ellipse(-70, -79, 7, 3.5, { fill: C.rose2 }));
  for (const [sx, sy] of [[-74, -80], [-67, -78], [-71, -77], [-66, -81]]) P.push(circle(sx, sy, 1.1, { fill: C.cream }));
  P.push(grapes(84, -86, 0.7));
  return g({ transform: `translate(${x} ${y})` }, P);
}

// An empty wooden cradle on rockers with a soft blanket. (x, y) = floor.
function cradle(x, y) {
  const P = [];
  P.push(ellipse(0, 2, 150, 14, { fill: C.ink, opacity: 0.25 }));
  // rockers
  P.push(path('M-150,-6 C-100,10 100,10 150,-6', line(C.wood3, 12)));
  // end posts
  P.push(rect(-128, -170, 22, 168, { rx: 8, fill: C.wood2 }), rect(106, -150, 22, 148, { rx: 8, fill: C.wood2 }));
  P.push(circle(-117, -176, 15, { fill: C.wood1 }), circle(117, -156, 15, { fill: C.wood1 }));
  P.push(circle(-121, -180, 5, { fill: C.wood0, opacity: 0.7 }), circle(113, -160, 5, { fill: C.wood0, opacity: 0.7 }));
  // basket body
  P.push(path('M-110,-118 L110,-110 C108,-60 90,-30 60,-24 L-60,-24 C-90,-30 -108,-60 -110,-118Z', { fill: C.wood1 }));
  P.push(path('M-110,-118 L110,-110 L110,-98 L-110,-106Z', { fill: C.wood0 }));
  for (let i = 0; i < 9; i++) {
    const sx = -84 + i * 21;
    P.push(path(`M${sx},-100 L${sx},-36`, line(C.wood2, 5, { opacity: 0.9 })));
  }
  P.push(path('M-100,-58 C-60,-40 60,-40 100,-56', line(C.wood2, 4, { opacity: 0.7 })));
  // soft blanket folded over the side, with little stars
  P.push(path('M-96,-112 C-70,-136 -10,-140 30,-130 C60,-140 90,-132 104,-110 L104,-82 C80,-72 50,-70 30,-80 C0,-66 -40,-70 -60,-84 C-76,-72 -90,-80 -96,-92Z', { fill: C.sky1 }));
  P.push(path('M-96,-112 C-70,-136 -10,-140 30,-130 C60,-140 90,-132 104,-110 C70,-120 -20,-124 -96,-112Z', { fill: C.sky2, opacity: 0.9 }));
  P.push(path('M-60,-84 C-40,-70 0,-66 30,-80', line(C.white, 3, { opacity: 0.8, 'stroke-dasharray': '2 7' })));
  for (const [sx, sy, sr] of [[-56, -104, 7], [-6, -110, 6], [48, -104, 7], [80, -92, 5], [10, -88, 5]]) P.push(star8(sx, sy, sr, C.white, { opacity: 0.9 }));
  // little pillow
  P.push(path('M-100,-118 C-104,-140 -60,-150 -46,-132 C-44,-120 -60,-112 -80,-112 C-92,-112 -100,-112 -100,-118Z', { fill: C.cream }));
  return g({ transform: `translate(${x} ${y})` }, P);
}

export default function render() {
  const id = ids('s29');
  const R = rng(29);
  const defs = [
    linear(id('wall'), [[0, '#1B2C57'], [0.6, '#22386A'], [1, '#2B4377']]),
    linear(id('niche'), [[0, '#E9A866'], [0.35, '#F4C383'], [0.75, '#EDB676'], [1, '#C98552']]),
    linear(id('floor'), [[0, '#9A6A45'], [1, '#6E4730']]),
    linear(id('night'), [[0, '#101B3A'], [1, '#2A4A84']]),
    glowDef(id('lamp'), '#FFE3A0', 0.75),
    radial(id('warm'), [[0, '#FFD98E', 0.5], [0.55, '#FFC870', 0.18], [1, '#FFC870', 0]], { cy: 0.45 }),
    glowDef(id('fruitGlow'), '#FFF2C8', 0.65),
    vignetteDef(id('vig'), '#0B1230', 0.4),
  ].join('');
  let body = '';

  // ------------------------------------------------ the tiled wall
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('wall')})` });
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 14; col++) {
      const tx = col * 80 - 20 + (row % 2) * 40;
      const ty = row * 76 + 10;
      body += star8(tx, ty, 22, 'none', { stroke: '#D9A84A', 'stroke-width': 1.6, opacity: 0.35 });
      body += circle(tx, ty, 3, { fill: '#E7BC62', opacity: 0.45 });
    }
  }
  // warm light spilling from the niche onto the wall
  body += circle(500, 420, 520, { fill: `url(#${id('warm')})` });

  // ------------------------------------------------ the arched window with the night sky (left)
  const win = archPath(92, 248, 300, 110, 520);
  body += path(archPath(78, 262, 300, 124, 534), { fill: '#C9A06A' });
  body += path(archPath(84, 256, 300, 117, 528), { fill: '#E9C891' });
  body += path(win, { fill: `url(#${id('night')})` });
  body += crescent(196, 262, 30, { fill: C.gold0, angle: -30 });
  for (const [sx, sy, sr] of [[126, 256, 7], [150, 330, 5], [222, 350, 6], [120, 420, 4], [210, 452, 5], [168, 220, 4]]) body += sparkle(sx, sy, sr, C.gold0, { opacity: 0.9 });
  for (let i = 0; i < 14; i++) body += circle(100 + R() * 140, 220 + R() * 290, R.range(1, 2.2), { fill: C.cream, opacity: R.range(0.5, 1) });
  body += path('M170,198 L170,520 M92,380 L248,380', line('#C9A06A', 5));
  body += rect(70, 528, 200, 16, { rx: 4, fill: '#C9A06A' }) + rect(70, 528, 200, 6, { rx: 3, fill: '#E9C891' });

  // ------------------------------------------------ a small shelf niche on the right wall
  body += path(archPath(770, 910, 330, 60, 480), { fill: '#C9A06A' });
  body += path(archPath(780, 900, 330, 52, 470), { fill: '#16264C' });
  body += path(archPath(780, 900, 330, 52, 470), { fill: `url(#${id('warm')})`, opacity: 0.5 });
  body += rect(762, 470, 156, 14, { rx: 4, fill: '#C9A06A' }) + rect(762, 470, 156, 5, { rx: 2, fill: '#E9C891' });
  // clay jug
  body += path('M806,470 C792,452 794,420 812,410 L810,396 L834,396 L832,410 C850,420 852,452 838,470Z', { fill: C.rock2 });
  body += path('M806,470 C792,452 794,420 812,410 L816,410 C804,424 804,452 814,470Z', { fill: C.rock1, opacity: 0.7 });
  body += path('M834,414 C852,412 856,434 842,442', line(C.rock3, 4));
  body += path('M800,436 Q822,444 844,436', line(C.rock3, 3, { opacity: 0.7 }));
  // little clay oil lamp with a flame
  body += glow(874, 446, 60, id('lamp'));
  body += path('M852,470 C852,456 896,456 896,470Z', { fill: C.rock3 }) + path('M890,462 L904,456 L898,466Z', { fill: C.rock3 });
  body += path('M903,455 C898,444 902,436 906,430 C910,438 912,446 906,455Z', { fill: C.gold1 }) + path('M904,453 C902,447 904,442 906,439 C908,444 908,449 905,453Z', { fill: C.white, opacity: 0.8 });

  // ------------------------------------------------ the mihrab niche
  // outer frame (alfiz) with a tiled border
  body += rect(300, 96, 400, 620, { fill: '#C9A06A' });
  body += rect(310, 106, 380, 610, { fill: C.water4 });
  for (let i = 0; i < 26; i++) {
    const ty = 122 + i * 23;
    if (ty > 706) break;
    body += star8(326, ty, 8, C.water1, { opacity: 0.9 }) + star8(674, ty, 8, C.water1, { opacity: 0.9 });
  }
  for (let i = 0; i < 15; i++) body += star8(350 + i * 21.5, 122, 8, C.water1, { opacity: 0.9 });
  // spandrels above the arch
  body += rect(342, 138, 316, 578, { fill: '#2A4C86' });
  for (const sx of [380, 620]) body += star8(sx, 196, 26, C.gold2, { opacity: 0.9 }) + star8(sx, 196, 14, '#2A4C86') + circle(sx, 196, 6, { fill: C.gold1 });
  // the arch itself: gold rim, then the warm recess
  body += path(archPath(350, 650, 360, 210, 716), { fill: C.gold3 });
  body += path(archPath(362, 638, 360, 198, 716), { fill: C.gold1 });
  body += path(archPath(374, 626, 360, 186, 716), { fill: `url(#${id('niche')})` });
  // fluted shell hood at the top of the recess
  for (let i = 0; i < 9; i++) {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 9;
    body += path(`M500,352 L${r1(500 + Math.cos(a) * 122)},${r1(352 + Math.sin(a) * 150)}`, line('#E2A866', 5, { opacity: 0.6 }));
  }
  body += path('M378,356 Q500,330 622,356', line('#D99A64', 6, { opacity: 0.6 }));
  // soft side shading inside the recess
  body += path(`M374,716 L374,360 C374,300 390,250 412,222 L412,716Z`, { fill: '#C9824E', opacity: 0.3 });
  body += path(`M626,716 L626,360 C626,300 610,250 588,222 L588,716Z`, { fill: '#C9824E', opacity: 0.3 });

  // ------------------------------------------------ the floor
  body += path('M0,716 L1000,716 L1000,1000 L0,1000Z', { fill: `url(#${id('floor')})` });
  body += path('M0,716 L1000,716 L1000,728 L0,728Z', { fill: '#5A3824', opacity: 0.6 });
  for (let i = -6; i <= 6; i++) body += path(`M${500 + i * 70},716 L${500 + i * 230},1000`, line('#5A3824', 2, { opacity: 0.35 }));
  for (const fy of [770, 846, 940]) body += path(`M0,${fy} L1000,${fy}`, line('#5A3824', 2, { opacity: 0.3 }));
  body += ellipse(500, 820, 420, 120, { fill: `url(#${id('warm')})` });

  // ------------------------------------------------ the prayer rug in front of the niche
  const rug = 'M372,742 L628,742 L700,930 L300,930Z';
  body += path('M300,930 L700,930 L704,940 L296,940Z', { fill: C.ink, opacity: 0.2 });
  body += path(rug, { fill: '#B8465A' });
  body += path('M386,752 L614,752 L676,918 L324,918Z', { fill: C.gold2 });
  body += path('M396,760 L604,760 L660,908 L340,908Z', { fill: '#9E3550' });
  // the rug's own little arch, pointing toward the niche
  body += path('M430,900 L452,800 C460,782 476,772 500,764 C524,772 540,782 548,800 L570,900Z', { fill: '#C9586C' });
  body += path('M462,890 L476,812 C482,798 490,792 500,788 C510,792 518,798 524,812 L538,890Z', { fill: '#E38B8B', opacity: 0.6 });
  body += star8(500, 840, 16, C.gold1, { opacity: 0.9 });
  for (const [dx, dy] of [[380, 790], [620, 790], [360, 880], [640, 880]]) body += star8(dx, dy, 8, C.gold1, { opacity: 0.8 });
  for (let i = 0; i < 16; i++) body += path(`M${r1(304 + i * 26)},930 L${r1(302 + i * 26)},950`, line(C.cream, 4));
  for (let i = 0; i < 10; i++) body += path(`M${r1(380 + i * 26.6)},742 L${r1(380 + i * 26.6)},732`, line(C.cream, 3.5));

  // ------------------------------------------------ the lamp and the bowl of provision
  body += oilLamp(500, 236, id('lamp'));
  body += glow(500, 600, 170, id('fruitGlow'));
  body += g({ transform: 'translate(500 712) scale(1.16) translate(-500 -712)' }, fruitTable(500, 712, R));
  for (const [sx, sy, ss] of [[408, 548, 11], [596, 530, 13], [446, 478, 7], [566, 466, 8], [622, 604, 7], [390, 616, 6]]) body += sparkle(sx, sy, ss, '#FFF4D2', { opacity: 0.95 });

  // ------------------------------------------------ the empty cradle, waiting (right)
  body += glow(818, 790, 130, id('fruitGlow'));
  body += g({ transform: 'translate(818 868) scale(0.86) translate(-818 -868)' }, cradle(818, 868));
  for (const [sx, sy, ss] of [[760, 690, 9], [850, 668, 12], [900, 720, 7]]) body += sparkle(sx, sy, ss, '#FFF4D2', { opacity: 0.9 });

  // ------------------------------------------------ a little potted palm and cushions (left)
  body += path('M90,900 L170,900 L160,980 L100,980Z', { fill: C.rock2 }) + path('M86,890 L174,890 L174,904 L86,904Z', { fill: C.rock1 });
  for (const [a, L] of [[-150, 110], [-120, 130], [-90, 140], [-60, 128], [-30, 104]]) {
    const rad = (a * Math.PI) / 180;
    body += path(`M130,890 Q${r1(130 + Math.cos(rad) * L * 0.6)},${r1(890 + Math.sin(rad) * L * 0.8)} ${r1(130 + Math.cos(rad) * L)},${r1(890 + Math.sin(rad) * L * 0.7 + 20)}`, line(C.leaf3, 10));
  }
  body += ellipse(236, 978, 76, 12, { fill: C.ink, opacity: 0.25 });
  body += path(blob([[164, 966], [176, 930], [236, 918], [300, 930], [310, 964], [236, 980]]), { fill: '#6C5BA3' });
  body += path(blob([[180, 940], [236, 926], [292, 940], [236, 950]]), { fill: '#8F7FC4', opacity: 0.8 });
  body += path('M236,926 L236,978', line('#56478A', 3, { opacity: 0.6 }));
  for (const [tx, ty] of [[166, 968], [306, 966]]) body += circle(tx, ty, 6, { fill: C.gold2 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
