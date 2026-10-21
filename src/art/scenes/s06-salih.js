// Salih and the Special She-Camel (Quran 7:73-79, 11:61-68, 26:141-158, 54:27-31, 91:13).
// The land of Thamud: rose sandstone mountains with elegant homes carved
// into them. In front, the she-camel of Allah - gentle and lovelier than any
// other - drinks at the stone trough on her drinking day, her baby beside
// her, by a well with a bucket. A few palms, warm rose and sand, clear sky.
// No people.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g,
  ridge, smooth, blob, sparkle, cloud, palm, grass, flower, bird, farBird, eye, T, r1,
} from '../lib.js';

// ---------------------------------------------------------------- camels
// Standing camel in the kit's style, facing right (flip to face left).
// headTilt turns the head (positive = nose down); drip adds a water drop at the lip.
function camel(x, y, { s = 1, flip = false, body = C.sand3, dark = C.sand4, light = C.sand2, belly, headTilt = 6, lashes = false, headScale = 1, fluffy = false, drip = false, shortNeck = 0, blanket = false, necklace = false } = {}) {
  const parts = [];
  parts.push(ellipse(10, 2, 96, 9, { fill: C.ink, opacity: 0.13 }));
  // far legs
  parts.push(rect(-52, -96, 15, 98, { rx: 7, fill: dark }), rect(38, -96, 15, 98, { rx: 7, fill: dark }));
  parts.push(ellipse(-44, 0, 12, 5.5, { fill: mix(dark, '#000000', 0.15) }), ellipse(46, 0, 12, 5.5, { fill: mix(dark, '#000000', 0.15) }));
  // tail with a little tuft
  parts.push(path('M-78,-118 Q-92,-96 -86,-74', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  parts.push(ellipse(-86, -70, 5, 8, { fill: dark }));
  // body + hump
  parts.push(path('M-82,-112 C-84,-150 -60,-168 -30,-170 C-18,-214 30,-214 40,-168 C62,-166 80,-150 80,-120 C80,-96 60,-86 0,-86 C-50,-86 -80,-92 -82,-112Z', { fill: body }));
  parts.push(path('M-30,-170 C-18,-214 30,-214 40,-168 C20,-180 -10,-182 -30,-170Z', { fill: light, opacity: 0.75 }));
  parts.push(path('M-74,-132 C-70,-152 -52,-164 -30,-168 C-50,-158 -64,-146 -74,-132Z', { fill: light, opacity: 0.6 }));
  if (belly) parts.push(path('M-78,-108 C-50,-96 30,-96 78,-114 C78,-96 60,-86 0,-86 C-50,-86 -74,-92 -78,-108Z', { fill: belly }));
  else parts.push(path('M-70,-100 C-40,-88 30,-88 70,-102 C66,-90 50,-86 0,-86 C-40,-86 -64,-90 -70,-100Z', { fill: dark, opacity: 0.5 }));
  parts.push(path('M-76,-128 C-70,-152 -52,-164 -30,-169 C-18,-208 24,-210 37,-172', { fill: 'none', stroke: light, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.85 }));
  if (blanket) {
    // a festive saddle blanket draped over the hump: teal cloth, gold trim, tassels
    const cloth = C.water3;
    const clothDark = C.water4;
    const top = 'M-58,-160 C-48,-168 -40,-170 -32,-172 C-20,-218 32,-218 42,-169 C48,-167 56,-164 62,-158';
    parts.push(path(`${top} L64,-124 Q4,-108 -60,-121Z`, { fill: cloth }));
    // shade on the side away from the light, following the top edge
    parts.push(path('M16,-205 C32,-202 40,-186 42,-169 C48,-167 56,-164 62,-158 L64,-124 Q40,-116 22,-113 C30,-148 28,-184 16,-205Z', { fill: clothDark, opacity: 0.5 }));
    parts.push(path('M-50,-160 C-42,-166 -36,-168 -28,-171 C-16,-208 26,-210 36,-176', { fill: 'none', stroke: C.water1, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 }));
    parts.push(path('M-60,-121 Q4,-108 64,-124', { fill: 'none', stroke: C.gold2, 'stroke-width': 7, 'stroke-linecap': 'round' }));
    parts.push(path('M-56,-141 Q4,-128 62,-144', { fill: 'none', stroke: C.gold2, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.9 }));
    for (let k = 0; k < 6; k++) {
      const dx = -42 + k * 18;
      const dy = -132 + ((dx - 2) / 60) ** 2 * 3;
      parts.push(path(`M${dx},${r1(dy - 6.5)} l6,6.5 l-6,6.5 l-6,-6.5Z`, { fill: C.cream }));
    }
    parts.push(path('M4,-190 l11,13 l-11,13 l-11,-13Z', { fill: C.gold2 }), circle(4, -177, 3.8, { fill: C.coral2 }));
    for (let k = 0; k < 7; k++) {
      const tx = -52 + k * 18.5;
      const ty = -116 + ((tx - 2) / 62) ** 2 * 6 + 3;
      parts.push(path(`M${r1(tx)},${r1(ty - 4)} L${r1(tx)},${r1(ty + 6)}`, { stroke: C.gold3, 'stroke-width': 2 }));
      parts.push(ellipse(tx, ty + 11, 3.6, 6, { fill: k % 2 ? C.coral2 : C.gold2 }));
    }
  }
  if (fluffy) parts.push(g({ fill: light }, circle(-6, -204, 7), circle(6, -207, 7), circle(17, -203, 6)));
  // near legs with knobby knees and soft feet
  parts.push(rect(-40, -100, 16, 102, { rx: 8, fill: body }), rect(50, -100, 16, 102, { rx: 8, fill: body }));
  parts.push(ellipse(-32, -48, 10, 8, { fill: light }), ellipse(58, -48, 10, 8, { fill: light }));
  parts.push(ellipse(-32, 0, 13, 6, { fill: dark }), ellipse(58, 0, 13, 6, { fill: dark }));
  // neck rising from the chest
  const nt = -222 + shortNeck;
  parts.push(path(`M62,-150 C88,-160 96,${-190 + shortNeck * 0.6} 98,${nt} L124,${nt} C124,${-180 + shortNeck * 0.5} 112,-134 76,-118Z`, { fill: body }));
  parts.push(path(`M98,${nt} L124,${nt} C124,${-196 + shortNeck * 0.6} 120,-170 110,-150 C114,-176 110,${-200 + shortNeck * 0.6} 98,${nt}Z`, { fill: light, opacity: 0.45 }));
  if (necklace) {
    const P = (t) => [(1 - t) ** 2 * 86 + 2 * (1 - t) * t * 99 + t * t * 117, (1 - t) ** 2 * -175 + 2 * (1 - t) * t * -142 + t * t * -167];
    parts.push(path('M86,-175 Q99,-142 117,-167', { fill: 'none', stroke: C.gold3, 'stroke-width': 2 }));
    for (let k = 0; k <= 8; k++) {
      const [bx, by] = P(k / 8);
      parts.push(circle(bx, by, 4.2, { fill: k % 2 ? C.gold2 : C.water2 }));
    }
    const [mx, my] = P(0.5);
    parts.push(path(`M${r1(mx)},${r1(my + 3)} L${r1(mx)},${r1(my + 10)}`, { stroke: C.gold3, 'stroke-width': 2 }));
    parts.push(path(`M${r1(mx - 5)},${r1(my + 10)} L${r1(mx + 5)},${r1(my + 10)} L${r1(mx + 3)},${r1(my + 24)} L${r1(mx - 3)},${r1(my + 24)}Z`, { fill: C.coral2 }));
  }
  // a gentle head in profile, pointing along +x from the top of the neck
  const hs = headScale;
  const headT = `translate(98 ${nt + 6}) rotate(${r1(headTilt)}) scale(${hs})`;
  parts.push(g({ transform: headT },
    ellipse(-12, -32, 6.5, 12, { fill: dark, transform: 'rotate(-35 -12 -32)' }),
    ellipse(8, -16, 27, 21, { fill: body }),
    path('M14,-34 C30,-36 52,-30 62,-20 C70,-12 70,0 62,6 C52,12 34,12 18,8 C6,4 0,-6 2,-16Z', { fill: body }),
    path('M8,-34 C22,-38 44,-34 58,-24', { fill: 'none', stroke: light, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.7 }),
    ellipse(56, 9, 11, 6, { fill: dark, opacity: 0.55 }),
    path('M58,-16 q4,-3 8,1', { fill: 'none', stroke: dark, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    path('M46,6 Q54,10 62,6', { fill: 'none', stroke: mix(dark, '#000000', 0.2), 'stroke-width': 2.4, 'stroke-linecap': 'round' }),
    lashes ? path('M15,-27 l-5,-6 M20,-28.5 l-2,-8 M25,-27.5 l2,-7', { fill: 'none', stroke: C.ink, 'stroke-width': 2.2, 'stroke-linecap': 'round' }) : '',
    eye(21, -21, 5.6),
    path('M14,-25 Q21,-30 28,-25', { fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.8 }),
    ellipse(30, -6, 8, 4.6, { fill: C.cheek, opacity: 0.65 }),
    drip ? path('M58,14 C56,20 54,24 54,27 C54,31 60,31 60,27 C60,24 58,20 58,14Z', { fill: C.water1 }) + circle(56, 26, 1.2, { fill: C.white }) : '',
  ));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// ---------------------------------------------------------------- well and trough
function well(x, y, { s = 1 } = {}) {
  const st = '#E9C2A6';
  const stDark = '#C99479';
  const parts = [ellipse(0, 4, 92, 12, { fill: C.ink, opacity: 0.14 })];
  // wooden frame (back half)
  parts.push(rect(-74, -190, 13, 176, { rx: 4, fill: C.wood2 }));
  // drum of stones
  parts.push(path('M-70,-74 L-70,-6 Q0,14 70,-6 L70,-74Z', { fill: st }));
  parts.push(path('M20,-74 L20,4 Q48,0 70,-6 L70,-74Z', { fill: stDark, opacity: 0.55 }));
  for (let row = 0; row < 3; row++) {
    const yy = -66 + row * 22;
    for (let k = 0; k < 5; k++) {
      const xx = -70 + k * 30 + (row % 2) * 15;
      if (xx > 60) continue;
      parts.push(rect(xx + 2, yy, Math.min(26, 68 - xx), 18, { rx: 6, fill: k % 2 ? '#F2D2B8' : '#E3B597', opacity: 0.9 }));
    }
  }
  parts.push(path('M20,-74 L20,4 Q48,0 70,-6 L70,-74Z', { fill: stDark, opacity: 0.3 }));
  // rim and dark water inside
  parts.push(ellipse(0, -74, 74, 18, { fill: '#F6DCC6' }));
  parts.push(ellipse(0, -73, 58, 12, { fill: '#2F5E77' }));
  parts.push(ellipse(-14, -75, 22, 4, { fill: C.water2, opacity: 0.7 }));
  // front post, beam, rope and bucket
  parts.push(rect(61, -190, 13, 176, { rx: 4, fill: C.wood2 }), rect(66, -190, 8, 176, { fill: C.wood3, opacity: 0.5 }));
  parts.push(rect(-84, -200, 168, 14, { rx: 6, fill: C.wood1 }), rect(-84, -192, 168, 6, { fill: C.wood3, opacity: 0.5 }));
  parts.push(ellipse(0, -193, 16, 13, { fill: C.wood3 }), circle(0, -193, 5, { fill: C.wood1 }));
  parts.push(path('M10,-190 L10,-128', { stroke: C.sand4, 'stroke-width': 3 }));
  parts.push(path('M-6,-128 L26,-128 L22,-98 L-2,-98Z', { fill: C.wood1 }));
  parts.push(path('M-6,-128 L26,-128', { stroke: C.wood3, 'stroke-width': 4, 'stroke-linecap': 'round' }));
  parts.push(path('M-4,-114 L24,-114', { stroke: C.wood3, 'stroke-width': 2.4, opacity: 0.7 }));
  parts.push(path('M-6,-128 Q10,-146 26,-128', { fill: 'none', stroke: C.wood3, 'stroke-width': 2.4 }));
  return g({ transform: T(x, y, s) }, parts);
}

function trough(x, y, w, { h = 54 } = {}) {
  const st = '#E7BFA2';
  const stDark = '#C68F74';
  let out = ellipse(x, y + 4, w * 0.56, 12, { fill: C.ink, opacity: 0.14 });
  out += rect(x - w / 2, y - h, w, h, { rx: 10, fill: st });
  out += rect(x + w * 0.2, y - h, w * 0.3, h, { rx: 10, fill: stDark, opacity: 0.45 });
  for (const k of [-0.25, 0.1]) out += path(`M${r1(x + k * w)},${r1(y - h + 16)} l0,${h - 22}`, { stroke: stDark, 'stroke-width': 2.4, opacity: 0.5 });
  out += rect(x - w / 2 - 6, y - h - 10, w + 12, 18, { rx: 8, fill: '#F4D6BE' });
  out += rect(x - w / 2 + 6, y - h - 7, w - 12, 10, { rx: 5, fill: C.water1 });
  out += rect(x - w / 2 + 6, y - h - 7, w - 12, 4, { rx: 2, fill: C.water0, opacity: 0.9 });
  out += path(`M${r1(x - w * 0.3)},${r1(y - h - 2)} q14,-3 28,0 M${r1(x + w * 0.05)},${r1(y - h - 2)} q12,-3 24,0`, { fill: 'none', stroke: C.white, 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.8 });
  return out;
}

// ---------------------------------------------------------------- carved homes
// A tall facade carved into the rock (Hegra style). (x, y) = bottom centre.
function facade(x, y, w, h, { face = '#F3CDB4', frame = '#E5AE92', shade = '#C98670', door = '#7C463D', windows = 0 } = {}) {
  let out = '';
  const top = y - h;
  const body = top + h * 0.26;
  // recess and smooth carved face
  out += rect(x - w / 2 - 8, top + h * 0.2, w + 16, h * 0.8 + 2, { fill: shade, opacity: 0.45 });
  out += rect(x - w / 2, body, w, y - body, { fill: face });
  out += rect(x + w * 0.3, body, w * 0.2, y - body, { fill: shade, opacity: 0.35 });
  // pilasters
  for (const sx of [-1, 1]) {
    const px = x + sx * w * 0.42;
    out += rect(px - w * 0.06, body + h * 0.08, w * 0.12, y - body - h * 0.08, { fill: frame });
    out += rect(px - w * 0.08, body + h * 0.06, w * 0.16, h * 0.04, { fill: frame });
  }
  // cornice bands
  out += rect(x - w / 2 - 4, body, w + 8, h * 0.05, { fill: frame });
  out += rect(x - w / 2 - 2, body + h * 0.05, w + 4, h * 0.02, { fill: shade, opacity: 0.6 });
  // crow-steps on top (two stepped merlons)
  const sw = w * 0.22;
  const sh = h * 0.07;
  for (const sx of [-1, 1]) {
    const cx = x + sx * w * 0.26;
    out += path(`M${r1(cx - sw)},${r1(body)} L${r1(cx - sw)},${r1(body - sh)} L${r1(cx - sw / 2)},${r1(body - sh)} L${r1(cx - sw / 2)},${r1(body - sh * 2)} L${r1(cx + sw / 2)},${r1(body - sh * 2)} L${r1(cx + sw / 2)},${r1(body - sh)} L${r1(cx + sw)},${r1(body - sh)} L${r1(cx + sw)},${r1(body)}Z`, { fill: face });
    out += path(`M${r1(cx + sw * 0.1)},${r1(body - sh * 2)} L${r1(cx + sw / 2)},${r1(body - sh * 2)} L${r1(cx + sw / 2)},${r1(body - sh)} L${r1(cx + sw)},${r1(body - sh)} L${r1(cx + sw)},${r1(body)} L${r1(cx + sw * 0.1)},${r1(body)}Z`, { fill: shade, opacity: 0.3 });
  }
  // doorway with a lintel and a small pediment
  const dw = w * 0.3;
  const dh = h * 0.36;
  out += rect(x - dw / 2 - w * 0.05, y - dh - h * 0.06, dw + w * 0.1, dh + h * 0.06, { fill: frame });
  out += path(`M${r1(x - dw / 2 - w * 0.06)},${r1(y - dh - h * 0.06)} L${r1(x)},${r1(y - dh - h * 0.15)} L${r1(x + dw / 2 + w * 0.06)},${r1(y - dh - h * 0.06)}Z`, { fill: frame });
  out += rect(x - dw / 2, y - dh, dw, dh, { fill: door });
  out += rect(x - dw / 2, y - dh, dw * 0.3, dh, { fill: mix(door, '#000000', 0.2), opacity: 0.5 });
  for (let i = 0; i < windows; i++) {
    const wx = x + (i % 2 ? 1 : -1) * w * 0.26;
    const wy = body + h * 0.22;
    out += rect(wx - w * 0.06, wy, w * 0.12, h * 0.12, { fill: door, rx: 2 });
  }
  return out;
}

// ---------------------------------------------------------------- the scene
export default function render() {
  const id = ids('s06');
  const R = rng(606);
  const skyTint = '#F6DCCB';
  const far = (c, k = 0.55) => mix(c, skyTint, k);
  const defs = [
    linear(id('sky'), [[0, '#86C6E2'], [0.45, '#B8E0EA'], [0.75, '#EEE8DC'], [1, '#F8DCCB']]),
    glowDef(id('sunGlow'), '#FFF4D6', 0.8),
    glowDef(id('sign'), '#FFF4DA', 0.9),
    glowDef(id('signSoft'), '#FFF0C8', 0.7),
    linear(id('cliff'), [[0, '#F0C3AA'], [0.6, '#E2A48A'], [1, '#CD8A72']]),
    linear(id('ground'), [[0, '#FAE6C9'], [1, '#F1D2A6']]),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');

  let body = '';
  // ------------------------------------------------------------ clear sky
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += glow(90, 60, 300, id('sunGlow'));
  body += cloud(330, 140, 150, { fill: '#FFFFFF', shade: '#E1F0F4', seed: 3, opacity: 0.85 });
  body += cloud(780, 96, 120, { fill: '#FFFFFF', shade: '#E1F0F4', seed: 7, opacity: 0.75 });
  body += farBird(560, 150, 1.1, '#7A8CA8', 0.5) + farBird(596, 136, 0.85, '#7A8CA8', 0.45);

  // ------------------------------------------------------------ far rose mountains
  body += path(blob([[-40, 640], [-30, 380], [60, 320], [160, 350], [230, 300], [330, 330], [400, 290], [520, 320], [600, 280], [700, 310], [790, 270], [900, 300], [1040, 330], [1050, 640]], 0.8), { fill: far('#E2A48A', 0.5) });

  // ------------------------------------------------------------ near cliffs with carved homes
  const cliffL = [[-40, 660], [-30, 300], [30, 236], [120, 214], [210, 236], [270, 280], [300, 360], [340, 400], [380, 660]];
  const cliffC = [[300, 660], [320, 380], [370, 300], [450, 250], [540, 236], [620, 262], [680, 320], [700, 400], [720, 660]];
  const cliffR = [[660, 660], [680, 340], [740, 270], [830, 236], [930, 250], [1000, 290], [1050, 330], [1050, 660]];
  for (const pts of [cliffC, cliffL, cliffR]) body += path(blob(pts, 0.9), { fill: `url(#${id('cliff')})` });
  // soft vertical weathering lines and rounded shading on the right of each outcrop
  body += path('M300,360 C320,420 330,520 340,660 L380,660 C370,520 350,420 300,360Z', { fill: '#C98670', opacity: 0.35 });
  body += path('M680,320 C700,400 704,520 712,660 L724,660 C720,520 716,420 700,360Z', { fill: '#C98670', opacity: 0.4 });
  body += path('M1000,290 C1030,360 1040,500 1050,660 L1050,320Z', { fill: '#C98670', opacity: 0.4 });
  for (const [lx, ly, ll] of [[60, 300, 120], [250, 300, 90], [420, 290, 110], [600, 280, 80], [760, 300, 100], [960, 300, 110]]) {
    body += path(`M${lx},${ly} C${lx + 6},${ly + ll * 0.4} ${lx - 4},${ly + ll * 0.7} ${lx + 2},${ly + ll}`, { fill: 'none', stroke: '#C98670', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.35 });
  }
  body += path('M30,236 C80,214 160,208 210,236 C160,226 80,228 30,250Z', { fill: '#F8D8C4', opacity: 0.7 });
  body += path('M370,300 C430,256 500,236 560,238 C500,250 430,272 380,316Z', { fill: '#F8D8C4', opacity: 0.7 });
  body += path('M740,270 C780,246 830,234 880,238 C830,246 790,262 750,286Z', { fill: '#F8D8C4', opacity: 0.7 });
  // the carved homes
  body += facade(150, 640, 150, 250, { windows: 0 });
  body += facade(450, 640, 120, 200, { windows: 2 });
  body += facade(580, 470, 84, 126, {});
  body += facade(850, 640, 160, 270, { windows: 0 });
  body += facade(330, 470, 70, 104, {});
  // little stepped paths and ledges
  body += path('M240,640 l0,-10 l16,0 l0,-10 l16,0 l0,-10 l16,0 l0,30Z', { fill: '#E5AE92' });

  // ------------------------------------------------------------ ground and palms
  body += path(ridge([[-20, 650], [200, 640], [420, 652], [640, 638], [860, 650], [1020, 642]], 1000), { fill: `url(#${id('ground')})` });
  body += path(ridge([[-20, 760], [240, 744], [520, 760], [760, 740], [1020, 756]], 1000), { fill: '#EFC795', opacity: 0.6 });
  body += path(ridge([[-20, 930], [260, 910], [560, 936], [820, 912], [1020, 926]], 1000), { fill: '#E7B987', opacity: 0.45 });
  for (let i = 0; i < 12; i++) {
    const x = R() * 1000;
    const y = 900 + R() * 90;
    const w = 40 + R() * 60;
    body += path(`M${r1(x)},${r1(y)} q${r1(w / 2)},-6 ${r1(w)},0`, { fill: 'none', stroke: '#FBE3C2', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 });
  }
  body += palm(700, 668, { h: 150, seed: 5, lean: 0.06, dateColor: C.coral3, trunk: far(C.wood2, 0.2), trunkDark: far(C.wood3, 0.2), leaf: far(C.leaf3, 0.2), leafMid: far(C.leaf4, 0.2), leafDark: far(C.leaf5, 0.2) });
  body += palm(296, 668, { h: 150, seed: 8, lean: -0.08, dateColor: C.gold3, trunk: far(C.wood2, 0.2), trunkDark: far(C.wood3, 0.2), leaf: far(C.leaf3, 0.2), leafMid: far(C.leaf4, 0.2), leafDark: far(C.leaf5, 0.2) });

  // ------------------------------------------------------------ the well, the trough and the she-camel
  body += glow(560, 600, 400, id('sign')) + glow(570, 640, 250, id('signSoft'));
  body += well(118, 830, { s: 0.98 });
  // the she-camel of Allah, drinking on her day
  body += camel(592, 868, { s: 1.44, flip: true, headTilt: 14, lashes: true, drip: true, blanket: true, necklace: true, body: '#D59D58', dark: '#B67E40', light: '#F0CC90', belly: '#E8C38A' });
  body += trough(352, 884, 250, { h: 52 });
  // her baby, standing close
  body += camel(888, 914, { s: 0.76, flip: true, headScale: 1.32, headTilt: -6, shortNeck: 26, fluffy: true, lashes: true, body: '#DDAC69', dark: '#BF8E4E', light: '#F4D6A2', belly: '#EECD9A' });
  // two little birds on the trough rim
  body += bird(258, 826, { s: 0.36, body: C.coral2, wing: C.coral3, belly: C.coral0 });
  body += bird(300, 826, { s: 0.34, flip: true, body: C.sky0, wing: C.water3, belly: C.sky2 });
  // gentle sparkles: she is a sign from Allah
  for (const [sx, sy, sz] of [[520, 452, 13], [760, 520, 10], [640, 410, 9], [318, 478, 9], [880, 600, 8], [600, 520, 7]]) body += sparkle(sx, sy, sz, '#FFF8E4', { opacity: 0.95 });

  // ------------------------------------------------------------ foreground framing
  body += palm(986, 700, { h: 250, seed: 9, lean: -0.1, dateColor: C.gold3 });
  // desert shrubs in the lower corners
  for (const [bx, by, bw] of [[20, 1010, 150], [118, 1012, 90], [980, 1010, 140], [890, 1014, 80]]) {
    body += g({ fill: '#93A065' }, circle(bx - bw * 0.25, by - bw * 0.2, bw * 0.24), circle(bx, by - bw * 0.32, bw * 0.3), circle(bx + bw * 0.27, by - bw * 0.18, bw * 0.22));
    body += g({ fill: '#ADB97A' }, circle(bx - bw * 0.3, by - bw * 0.28, bw * 0.15), circle(bx - bw * 0.05, by - bw * 0.44, bw * 0.16));
    body += g({ fill: C.rose1 }, circle(bx - bw * 0.12, by - bw * 0.36, 4), circle(bx + bw * 0.18, by - bw * 0.26, 3.5), circle(bx - bw * 0.36, by - bw * 0.16, 3.5));
  }
  for (const [gx, gy, gh, sd] of [[60, 1006, 60, 1], [120, 1006, 44, 2], [880, 1006, 50, 3], [940, 1006, 64, 4], [560, 1006, 34, 5]]) body += grass(gx, gy, { h: gh, n: 6, seed: sd, fill: '#9AA36C' });
  for (const [fx, fy, c] of [[200, 960, C.rose1], [240, 980, C.coral1], [700, 970, C.rose1], [740, 950, C.white], [470, 975, C.coral1]]) body += flower(fx, fy, { r: 8, fill: c, center: C.gold2, stem: '#8E9A62', stemH: 12, rot: fx });
  for (const [px, py, pw] of [[330, 960, 26], [620, 950, 20], [520, 990, 30]]) body += ellipse(px, py, pw / 2, pw * 0.3, { fill: '#D9A483' }) + ellipse(px - pw * 0.1, py - pw * 0.08, pw * 0.24, pw * 0.1, { fill: '#F4D4B8', opacity: 0.8 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
