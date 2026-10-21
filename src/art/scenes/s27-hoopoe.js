// Sulayman and the hoopoe (Quran 27:20-44).
// The hoopoe flies proudly across a golden sky carrying Sulayman's sealed
// letter (27:28). Far below lies the kingdom of Saba': tall mud-brick tower
// houses, green terraced fields, the great dam with its lake, and the
// queen's palace, all under a big sun (27:24).
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, sun, palm, rays, eye, T, r1,
} from '../lib.js';

const line = (c, w, a = {}) => ({ fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a });

// ---------------------------------------------------------------- the hoopoe
const HOO = { body: '#EFA27C', dark: '#D9825E', light: '#FAC6A6', belly: '#FBDCC6', black: '#2E2638', white: '#FFF8EE' };

// One narrow crest feather from (0,0) along +x, length L: cinnamon with a
// thin white band and a small black tip.
function crestFeather(L, w) {
  const f = (len) => `M0,${r1(-w * 0.2)} C${r1(len * 0.35)},${r1(-w * 0.5)} ${r1(len * 0.7)},${r1(-w * 0.52)} ${r1(len * 0.9)},${r1(-w * 0.34)} Q${r1(len * 1.04)},0 ${r1(len * 0.9)},${r1(w * 0.34)} C${r1(len * 0.7)},${r1(w * 0.52)} ${r1(len * 0.35)},${r1(w * 0.5)} 0,${r1(w * 0.2)}Z`;
  return path(f(L), { fill: HOO.black }) + path(f(L * 0.86), { fill: HOO.white }) + path(f(L * 0.78), { fill: HOO.body });
}

// A wing as a fan of long feathers spreading from the root (0,0), roughly
// pointing up. The feathers are black; white bars are concentric arcs
// clipped to the wing, so they run across all the feathers like a real
// hoopoe's. Cinnamon coverts with a scalloped edge sit over the root.
function wing(L, id, name, { far = false, n = 7, spread = 40 } = {}) {
  const black = far ? '#463E52' : HOO.black;
  const white = far ? '#E2D6CA' : HOO.white;
  const cinn = far ? HOO.dark : HOO.body;
  const fw = L * 0.27;
  const feather = (len) => `M0,${r1(-fw * 0.16)} C${r1(len * 0.4)},${r1(-fw * 0.52)} ${r1(len * 0.78)},${r1(-fw * 0.58)} ${r1(len * 0.92)},${r1(-fw * 0.42)} Q${r1(len * 1.03)},0 ${r1(len * 0.92)},${r1(fw * 0.42)} C${r1(len * 0.78)},${r1(fw * 0.58)} ${r1(len * 0.4)},${r1(fw * 0.52)} 0,${r1(fw * 0.16)}Z`;
  let union = '';
  let blacks = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1); // 0 = trailing edge (back), 1 = leading edge (front)
    const a = r1(-90 - spread / 2 + spread * t);
    const len = L * (0.74 + 0.26 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.62 + 0.25));
    const d = feather(len);
    union += `<path d="${d}" transform="rotate(${a})"/>`;
    blacks += path(d, { fill: black, transform: `rotate(${a})` });
  }
  const cid = id(name);
  let s = `<clipPath id="${cid}">${union}</clipPath>` + blacks;
  let bars = '';
  for (const k of [0.47, 0.62, 0.77, 0.91]) bars += circle(0, 0, L * k, { fill: 'none', stroke: white, 'stroke-width': r1(L * 0.068) });
  // cinnamon at the base of the wing, flowing into the body
  bars += circle(0, 0, L * 0.32, { fill: cinn });
  if (!far) bars += path(`M${r1(-L * 0.12)},${r1(-L * 0.2)} Q${r1(-L * 0.02)},${r1(-L * 0.29)} ${r1(L * 0.1)},${r1(-L * 0.24)}`, line(HOO.light, L * 0.04, { opacity: 0.85 }));
  s += g({ 'clip-path': `url(#${cid})` }, bars);
  return s;
}

function hoopoe(x, y, s, id) {
  const P = [];
  // far wing, raised up and a little forward, behind the body
  P.push(g({ transform: 'translate(8 -40) rotate(6)' }, wing(204, id, 'wingFar', { far: true })));
  // tail: black with one broad white band
  P.push(path('M-60,-4 C-104,-20 -160,-34 -196,-26 C-212,-6 -210,22 -196,38 C-158,34 -104,22 -60,20Z', { fill: HOO.black }));
  P.push(path('M-128,-28 C-120,-4 -120,18 -126,32 L-150,35 C-142,16 -142,-10 -152,-31Z', { fill: HOO.white }));
  // little tucked feet
  P.push(ellipse(-4, 46, 11, 5.5, { fill: '#A2919B', transform: 'rotate(-20 -4 46)' }), ellipse(12, 44, 11, 5.5, { fill: '#B8A8AF', transform: 'rotate(-20 12 44)' }));
  // body
  P.push(ellipse(0, 0, 82, 52, { fill: HOO.body, transform: 'rotate(-12)' }));
  P.push(path('M-70,22 C-36,54 40,56 80,10 C72,42 30,62 -8,58 C-40,54 -62,40 -70,22Z', { fill: HOO.belly, opacity: 0.95 }));
  // crest: a semicircular fan of narrow feathers
  const n = 11;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = -170 + t * 122;
    const L = 64 + Math.sin(t * Math.PI) * 34 - t * 6;
    P.push(g({ transform: `translate(76 -66) rotate(${r1(a)})` }, crestFeather(L, 19)));
  }
  // head
  P.push(circle(90, -42, 42, { fill: HOO.body }));
  P.push(ellipse(76, -60, 19, 11, { fill: HOO.light, opacity: 0.85, transform: 'rotate(-30 76 -60)' }));
  // near wing, raised up and back over the body
  P.push(g({ transform: 'translate(-26 -30) rotate(-44)' }, wing(224, id, 'wingNear')));
  // the long, gently curved beak holding the letter
  P.push(scroll(206, -14));
  P.push(path('M118,-52 Q170,-52 226,-24 Q172,-34 120,-28Z', { fill: '#3D3346' }));
  P.push(path('M120,-50 Q150,-51 178,-44', line('#6E6180', 3, { opacity: 0.7 })));
  // face
  P.push(eye(104, -50, 7));
  P.push(ellipse(110, -28, 10, 5.5, { fill: C.cheek, opacity: 0.75 }));
  return g({ transform: T(x, y, s) }, P);
}

// Sulayman's rolled letter with a red wax seal, centred on (x, y).
function scroll(x, y) {
  return g({ transform: `translate(${x} ${y}) rotate(-16)` },
    ellipse(4, 70, 22, 6, { fill: C.ink, opacity: 0.08 }),
    rect(-17, -64, 34, 128, { rx: 15, fill: C.cream }),
    rect(4, -64, 13, 128, { rx: 7, fill: C.wool2, opacity: 0.8 }),
    rect(-13, -58, 7, 116, { rx: 3.5, fill: C.white, opacity: 0.9 }),
    ellipse(0, -62, 17, 6, { fill: C.wool1 }),
    path('M-8,-62 A8,3.4 0 1 1 6,-61', line(C.wool2, 2.2)),
    // ribbon and seal
    rect(-18, 8, 36, 10, { fill: C.coral2 }),
    path('M2,18 L-6,44 L2,40 L8,46 Z', { fill: C.coral3 }),
    circle(4, 30, 15, { fill: '#C9483F' }),
    circle(4, 30, 10, { fill: 'none', stroke: '#A6372F', 'stroke-width': 2.4 }),
    circle(-1, 25, 4, { fill: C.coral1, opacity: 0.7 }),
  );
}

// ---------------------------------------------------------------- Saba'
// A Yemeni tower house: stone base, mud-brick floors with white bands,
// white-framed windows and coloured fanlights. (x, y) = bottom centre.
function towerHouse(x, y, w, h, { wall = C.rock2, side = C.rock3, base = C.stone1, trim = C.cream, seed = 1, glass = [C.gold2, C.coral2, C.sky0] } = {}) {
  const R = rng(seed);
  const sw = w * 0.28; // visible side face on the right
  let s = '';
  s += path(`M${r1(x - w / 2)},${r1(y)} L${r1(x - w / 2 + 2)},${r1(y - h)} L${r1(x + w / 2 - 2)},${r1(y - h)} L${r1(x + w / 2)},${r1(y)}Z`, { fill: wall });
  s += path(`M${r1(x + w / 2)},${r1(y)} L${r1(x + w / 2 - 2)},${r1(y - h)} L${r1(x + w / 2 + sw - 3)},${r1(y - h + 6)} L${r1(x + w / 2 + sw)},${r1(y)}Z`, { fill: side });
  const bh = Math.min(h * 0.22, 40);
  s += rect(x - w / 2, y - bh, w, bh, { fill: base });
  s += path(`M${r1(x + w / 2)},${r1(y)} L${r1(x + w / 2)},${r1(y - bh)} L${r1(x + w / 2 + sw)},${r1(y - bh + 4)} L${r1(x + w / 2 + sw)},${r1(y)}Z`, { fill: mix(base, '#000000', 0.18) });
  const floors = Math.max(2, Math.round((h - bh) / 34));
  const fh = (h - bh) / floors;
  const cols = w > 70 ? 3 : 2;
  for (let f = 0; f < floors; f++) {
    const fy = y - bh - f * fh;
    s += rect(x - w / 2, fy - 3.5, w, 4, { fill: trim, opacity: 0.85 });
    s += rect(x + w / 2, fy - 3, sw, 3.5, { fill: trim, opacity: 0.5 });
    for (let c = 0; c < cols; c++) {
      const wx = x - w / 2 + (w / cols) * (c + 0.5);
      const wy = fy - fh * 0.62;
      const ww = Math.min(13, w / cols * 0.42);
      const wh = fh * 0.42;
      s += rect(wx - ww / 2 - 2.5, wy - 2.5, ww + 5, wh + 5, { fill: trim, rx: 1.5 });
      s += rect(wx - ww / 2, wy, ww, wh, { fill: C.wood4 });
      if (f >= floors - 2 || R() < 0.4) s += path(`M${r1(wx - ww / 2 - 2)},${r1(wy - 3)} A${r1(ww / 2 + 2)},${r1(ww / 2 + 2)} 0 0 1 ${r1(wx + ww / 2 + 2)},${r1(wy - 3)}Z`, { fill: R.pick(glass) });
    }
  }
  // crenellated white roof edge
  const n = Math.max(3, Math.round(w / 14));
  for (let i = 0; i < n; i++) {
    const cx = x - w / 2 + (w / n) * (i + 0.5);
    s += path(`M${r1(cx - w / n * 0.38)},${r1(y - h)} L${r1(cx)},${r1(y - h - 9)} L${r1(cx + w / n * 0.38)},${r1(y - h)}Z`, { fill: trim });
  }
  s += rect(x - w / 2 - 1, y - h - 1.5, w + 2, 4, { fill: trim });
  return s;
}

// The queen's palace: a broad block between two towers, gold trim and a
// colonnade in front. (x, y) = bottom centre.
function palace(x, y, s = 1) {
  const P = [];
  const wall = '#E7B98C';
  const shade = '#C99368';
  P.push(towerHouse(-118, 0, 70, 210, { wall: '#DCA57A', side: shade, seed: 31 }));
  P.push(towerHouse(118, 0, 70, 210, { wall: '#DCA57A', side: shade, seed: 32 }));
  P.push(rect(-84, -150, 168, 150, { fill: wall }));
  P.push(rect(-84, -150, 168, 12, { fill: C.gold2 }));
  P.push(rect(-90, -158, 180, 10, { rx: 3, fill: C.gold3 }));
  for (let i = 0; i < 7; i++) P.push(path(`M${-78 + i * 26},-158 L${-66 + i * 26},-172 L${-54 + i * 26},-158Z`, { fill: C.cream }));
  // upper windows with coloured fanlights
  for (let i = 0; i < 4; i++) {
    const wx = -60 + i * 40;
    P.push(rect(wx - 9, -126, 18, 28, { fill: C.cream, rx: 2 }), rect(wx - 6, -120, 12, 22, { fill: C.wood4 }));
    P.push(path(`M${wx - 9},-128 A9,9 0 0 1 ${wx + 9},-128Z`, { fill: [C.gold2, C.coral2, C.sky0, C.gold2][i] }));
  }
  // colonnade
  P.push(rect(-96, -86, 192, 10, { fill: C.cream }));
  P.push(rect(-96, -6, 192, 8, { fill: C.stone0 }));
  for (let i = 0; i < 8; i++) {
    const cx = -84 + i * 24;
    P.push(rect(cx - 6, -76, 12, 70, { fill: C.cream }), rect(cx + 1, -76, 5, 70, { fill: C.wool2 }));
  }
  P.push(path('M-20,-6 L-20,-50 Q0,-74 20,-50 L20,-6Z', { fill: C.gold3 }));
  P.push(path('M-14,-6 L-14,-48 Q0,-64 14,-48 L14,-6Z', { fill: C.gold4 }));
  return g({ transform: T(x, y, s) }, P);
}

// A small, light-weight palm for the far valley. (x, y) = foot.
function farPalm(x, y, h, { trunk = C.wood2, leaf = C.leaf3, dark = C.leaf4 } = {}) {
  const tx = x + h * 0.08;
  const ty = y - h;
  let s = path(`M${r1(x - 2.2)},${r1(y)} Q${r1(x + h * 0.02)},${r1(y - h * 0.5)} ${r1(tx)},${r1(ty)} Q${r1(x + h * 0.04 + 2)},${r1(y - h * 0.5)} ${r1(x + 2.2)},${r1(y)}Z`, { fill: trunk });
  for (const [a, c] of [[-160, dark], [-20, dark], [-125, leaf], [-55, leaf], [-90, leaf], [175, leaf], [5, leaf]]) {
    const rad = (a * Math.PI) / 180;
    const L = h * 0.42;
    const ex = tx + Math.cos(rad) * L;
    const ey = ty + Math.sin(rad) * L * 0.7 + L * 0.35;
    const mx = tx + Math.cos(rad) * L * 0.55;
    const my = ty + Math.sin(rad) * L * 0.6 - L * 0.08;
    s += path(`M${r1(tx)},${r1(ty)} Q${r1(mx)},${r1(my - L * 0.14)} ${r1(ex)},${r1(ey)} Q${r1(mx)},${r1(my + L * 0.1)} ${r1(tx)},${r1(ty)}Z`, { fill: c });
  }
  return s;
}

export default function render() {
  const id = ids('s27');
  const R = rng(27);
  const defsList = [
    linear(id('sky'), [[0, '#BFE1DD'], [0.28, '#F2EAC8'], [0.6, '#FFE2A8'], [1, '#FCCB90']]),
    linear(id('lake'), [[0, '#A6DCD8'], [1, '#5DB7C4']]),
    glowDef(id('sunGlow'), '#FFF0BE', 0.9),
    radial(id('haze'), [[0, '#FFF2D2', 0.85], [1, '#FFF2D2', 0]]),
    glowDef(id('letter'), '#FFF6D8', 0.75),
    vignetteDef(id('vig'), C.ink, 0.2),
  ];
  const hazeCol = '#F7D9AE';
  const far = (c, t = 0.6) => mix(c, hazeCol, t);
  const mid = (c, t = 0.3) => mix(c, hazeCol, t);
  let body = '';

  // ------------------------------------------------ sky and the big sun
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  body += rays(140, 150, { n: 9, len: 900, spread: 120, dir: 32, width: 5, color: '#FFF4D2', op: 0.2 });
  body += sun(140, 150, 86, { fill: '#FFDB86', core: '#FFF3CC', glowId: id('sunGlow') });
  body += cloud(850, 130, 180, { fill: '#FFF3DC', shade: '#F9D9B4', seed: 3, opacity: 0.9 });
  body += cloud(560, 70, 110, { fill: '#FFF3DC', shade: '#F9D9B4', seed: 6, opacity: 0.7 });

  // ------------------------------------------------ far highlands
  body += path(ridge([[-20, 456], [90, 424], [210, 446], [330, 408], [470, 438], [600, 414], [740, 440], [880, 406], [1020, 432]]), { fill: far(C.rock1, 0.66) });
  body += path(ridge([[-20, 488], [130, 468], [280, 482], [420, 462], [560, 480], [700, 464], [860, 478], [1020, 462]]), { fill: far(C.rock2, 0.56) });
  body += ellipse(500, 488, 620, 44, { fill: `url(#${id('haze')})` });

  // valley floor beneath everything nearer than the highlands
  body += path(ridge([[-20, 520], [300, 512], [640, 520], [1020, 516]]), { fill: mid(C.leaf2, 0.32) });

  // ------------------------------------------------ the great dam and its lake (left, mid-distance)
  body += path(ridge([[-20, 512], [60, 496], [150, 506], [190, 540]], 640), { fill: mid(C.rock2, 0.45) });
  body += path(ridge([[330, 540], [380, 500], [460, 492], [540, 514]], 640), { fill: mid(C.rock2, 0.45) });
  body += path('M60,496 C100,492 140,498 170,520 C130,516 96,520 60,530Z', { fill: mid(C.rock1, 0.4) });
  body += path('M380,500 C410,494 450,492 480,496 C440,508 410,520 376,540Z', { fill: mid(C.rock1, 0.4) });
  body += path('M146,540 C150,522 176,512 206,514 C228,500 270,498 300,506 C330,500 362,510 368,526 C374,534 376,540 376,542 Z', { fill: `url(#${id('lake')})` });
  body += path('M176,520 C200,512 230,510 250,512', line('#4FA9BA', 3, { opacity: 0.5 }));
  body += path('M204,524 L262,524 M282,530 L334,530 M226,536 L300,536', line('#EAFBF7', 3, { opacity: 0.75 }));
  // the dam wall, with sluice towers at both ends
  body += path('M144,540 L380,536 L384,566 L140,570Z', { fill: mid(C.sand2, 0.15) });
  body += path('M144,540 L380,536 L380,543 L144,547Z', { fill: C.sand0 });
  for (let k = 0; k < 9; k++) body += path(`M${r1(166 + k * 25)},${r1(549)} L${r1(166 + k * 25)},${r1(567)}`, line(mid(C.sand4, 0.25), 1.6, { opacity: 0.55 }));
  body += path('M142,557 L382,553', line(mid(C.sand4, 0.25), 1.6, { opacity: 0.5 }));
  for (const tx of [128, 372]) body += rect(tx, 526, 24, 48, { fill: mid(C.sand3, 0.15) }) + rect(tx - 2, 522, 28, 7, { rx: 2, fill: C.sand1 }) + rect(tx + 14, 529, 10, 45, { fill: mid(C.sand4, 0.3), opacity: 0.55 });
  // water let out through channels to the gardens below
  body += path('M140,574 C130,600 104,620 80,650 M384,572 C394,600 420,624 450,650', line('#86D2D8', 5, { opacity: 0.95 }));

  // ------------------------------------------------ green gardens below the dam
  body += path(ridge([[-20, 590], [120, 580], [260, 592], [420, 582], [560, 596]], 760), { fill: mid(C.leaf2, 0.28) });
  const fieldCols = [C.leaf1, C.leaf2, '#B5D98C', C.leaf2, C.leaf1];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const fx = -16 + c * 94 + (r % 2) * 32;
      const fy = 600 + r * 28;
      body += path(`M${fx},${fy} L${fx + 86},${fy - 4} L${fx + 92},${fy + 22} L${fx + 4},${fy + 26}Z`, { fill: mid(fieldCols[(r + c) % 5], 0.25) });
    }
  }
  for (const [px, ph] of [[34, 58], [62, 46], [236, 52], [262, 40], [486, 56], [512, 46]]) body += farPalm(px, 616, ph, { trunk: mid(C.wood2), leaf: mid(C.leaf3), dark: mid(C.leaf4) });

  // ------------------------------------------------ the city of Saba' on its hill (right)
  const cityHill = ridge([[400, 640], [500, 586], [600, 540], [720, 520], [840, 522], [940, 536], [1020, 552]], 1000);
  body += path(cityHill, { fill: mid(C.rock1, 0.35) });
  // a little road winding up the hillside to the city gate
  body += path('M404,664 C440,650 470,652 498,636 C520,624 540,626 560,612', line(mid(C.sand0, 0.1), 7));
  const back = [[600, 580, 40, 96, C.rock2], [648, 574, 44, 120, '#D99A78'], [878, 574, 44, 124, '#D99A78'], [926, 582, 40, 100, C.rock2], [972, 592, 36, 84, '#E2A983']];
  for (const [hx, hy, hw, hh, col] of back) body += towerHouse(hx, hy, hw, hh, { wall: mid(col, 0.28), side: mid(C.rock3, 0.28), base: mid(C.stone1, 0.28), seed: hx });
  body += palace(764, 616, 0.85);
  const front = [[580, 646, 48, 108, '#E2A983'], [634, 656, 52, 128, C.rock2], [900, 656, 52, 128, '#D99A78'], [956, 650, 46, 104, C.rock2]];
  for (const [hx, hy, hw, hh, col] of front) body += towerHouse(hx, hy, hw, hh, { wall: mid(col, 0.15), side: mid(C.rock3, 0.15), base: mid(C.stone1, 0.15), seed: hx + 7 });

  // ------------------------------------------------ terraced fields (perspective: bands widen toward us)
  const terraces = (clip, outline, cx, top, n, step, curve, cols, lip) => {
    defsList.push(`<clipPath id="${clip}"><path d="${outline}"/></clipPath>`);
    let inner = '';
    let yb = top;
    for (let k = 0; k < n; k++) {
      yb += step * (1 + k * 0.09);
      const pts = [];
      for (let xx = -40; xx <= 1040; xx += 90) pts.push([xx, yb + curve * ((xx - cx) / 500) ** 2]);
      inner += path(`${smooth(pts)} L1040,1040 L-40,1040Z`, { fill: cols[(k + 1) % cols.length] });
      inner += path(smooth(pts), line(lip, 2.6 + k * 0.15, { opacity: 0.7 }));
    }
    return path(outline, { fill: cols[0] }) + g({ 'clip-path': `url(#${clip})` }, inner);
  };
  const tc = [mix(C.leaf2, C.gold1, 0.2), mix(C.leaf1, C.gold1, 0.2), mix('#9ACB78', C.gold1, 0.2), mix(C.leaf2, C.gold1, 0.08)];
  const lip = '#F0DDB2';
  // terraces stepping down below the city walls
  body += terraces(id('terrC'), ridge([[380, 700], [480, 668], [640, 660], [820, 662], [1020, 668]], 1000), 760, 646, 5, 20, 26, [tc[2], tc[1], tc[0], tc[3]], lip);
  for (const [px, ph] of [[700, 70], [724, 56], [820, 66], [842, 52], [548, 60], [990, 58]]) body += farPalm(px, 668, ph, { trunk: mid(C.wood2, 0.2), leaf: mid(C.leaf3, 0.2), dark: mid(C.leaf4, 0.2) });
  // the valley floor between the near hills, with a stream
  body += path(ridge([[300, 780], [520, 760], [760, 770], [960, 790]], 1000), { fill: mix(C.leaf2, C.gold1, 0.12) });
  for (let r = 0; r < 4; r++) body += path(smooth([[480 - r * 20, 800 + r * 46], [600, 792 + r * 46], [760, 798 + r * 46], [880 + r * 20, 812 + r * 46]]), line(lip, 3, { opacity: 0.6 }));
  body += path('M676,1020 C664,960 684,900 716,860 C740,828 756,800 760,762', line('#8CD3D8', 9));
  body += path('M676,1020 C664,960 684,900 716,860', line('#DDF5F3', 3, { opacity: 0.75 }));
  // near terraced hills, left and right
  body += terraces(id('terrA'), ridge([[-20, 676], [120, 660], [260, 672], [420, 712], [540, 776], [630, 870], [660, 1020]], 1020), 160, 662, 11, 22, 90, tc, lip);
  body += terraces(id('terrB'), ridge([[700, 1020], [730, 900], [800, 830], [900, 790], [1020, 772]], 1020), 900, 760, 9, 24, 70, [tc[1], tc[0], tc[3], tc[2]], lip);
  // a few tower houses and palms among the terraces
  body += towerHouse(300, 778, 52, 124, { wall: '#D9946F', side: C.rock3, seed: 41 }) + towerHouse(354, 794, 44, 96, { wall: '#E6AC84', side: C.rock3, seed: 42 });
  body += towerHouse(880, 856, 48, 104, { wall: '#E6AC84', side: C.rock3, seed: 43 });
  body += farPalm(250, 792, 96) + farPalm(408, 810, 80) + farPalm(946, 872, 90) + farPalm(826, 878, 70) + farPalm(560, 880, 84);

  // ------------------------------------------------ soft clouds drifting below us, framing the corners
  body += cloud(70, 1012, 300, { fill: '#FFFAF0', shade: '#FBE3C6', seed: 14, opacity: 0.92 });
  body += cloud(960, 1012, 260, { fill: '#FFFAF0', shade: '#FBE3C6', seed: 17, opacity: 0.92 });

  // ------------------------------------------------ the hoopoe with Sulayman's letter
  body += circle(730, 300, 230, { fill: `url(#${id('letter')})` });
  body += hoopoe(505, 342, 1.12, id);
  for (const [sx, sy, ss] of [[826, 214, 12], [846, 398, 9], [690, 452, 7], [884, 300, 6]]) body += sparkle(sx, sy, ss, C.white, { opacity: 0.95 });

  body += vignette(id('vig'));
  return svgDoc({ defs: defsList.join(''), body });
}
