// Shared illustration kit for "The Best of Stories".
// Every scene is a 1000 x 1000 SVG drawn with these helpers so the whole
// book shares one palette, one light direction (top-left) and one
// "cute, rounded, flat-with-soft-gradients" look.

// ---------------------------------------------------------------- palette
export const C = {
  ink: '#2B2140', ink2: '#4A3F63', inkSoft: '#6B5F86',
  night0: '#0F1A33', night1: '#17264A', night2: '#22386A', night3: '#33508A', night4: '#4F6AA6',
  dusk0: '#5E4D96', dusk1: '#8E79C0', dusk2: '#C3A9DD', dusk3: '#F0B7C0',
  sky0: '#6FBAD8', sky1: '#9FD3E6', sky2: '#CDEBF0', sky3: '#EEF8F5',
  dawn0: '#F49A8A', dawn1: '#F7B7A3', dawn2: '#FFD6A5', dawn3: '#FFEBC8',
  sand0: '#FBEBC9', sand1: '#F3D9A4', sand2: '#EBC27E', sand3: '#D9A45E', sand4: '#BF8746', sand5: '#9A6935',
  rock0: '#F0C6AE', rock1: '#DFA287', rock2: '#C77F65', rock3: '#A4614F', rock4: '#7C463D',
  stone0: '#DCD5CA', stone1: '#BDB4A7', stone2: '#988F84', stone3: '#716A62', stone4: '#4F4A46',
  leaf0: '#D4EBB0', leaf1: '#A8D58E', leaf2: '#7CBF73', leaf3: '#4FA266', leaf4: '#33845A', leaf5: '#22654A', leaf6: '#174A39',
  water0: '#D3F1F0', water1: '#97DCDD', water2: '#5BBFCB', water3: '#3398B0', water4: '#22738F', water5: '#17516E', water6: '#0E3550',
  gold0: '#FFF0C2', gold1: '#FFDD85', gold2: '#F7C24F', gold3: '#E5A232', gold4: '#C27F22', gold5: '#985F17',
  coral0: '#FCD3C9', coral1: '#F7A796', coral2: '#EE7E68', coral3: '#D45E4A', coral4: '#A9443A',
  rose0: '#FBD5DF', rose1: '#F4A9BE', rose2: '#E57C9C', rose3: '#C25A7E',
  plum0: '#E6DAF2', plum1: '#C9B3E3', plum2: '#A089CC', plum3: '#7560AE', plum4: '#4E3D82',
  wood0: '#E2AF78', wood1: '#C98D53', wood2: '#A56B38', wood3: '#7D4D26', wood4: '#5A3519',
  wool0: '#FFFBF2', wool1: '#F4EADB', wool2: '#E2D3BE',
  cream: '#FFF8EC', paper: '#FBF5EA', white: '#FFFFFF',
  cheek: '#F49FAF',
};

// ---------------------------------------------------------------- numbers
export const r1 = (n) => Math.round(n * 10) / 10;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;

// Deterministic random numbers so every build draws the same picture.
export function rng(seed = 1) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (lo, hi) => lo + (hi - lo) * next();
  next.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * next());
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  return next;
}

// Unique id factory: const id = ids('s07'); id('sky') -> 's07-sky'
export function ids(prefix) {
  let n = 0;
  const f = (name) => `${prefix}-${name}`;
  f.next = (name = 'u') => `${prefix}-${name}${++n}`;
  return f;
}

// Mix two hex colours (t = 0 -> a, t = 1 -> b).
export function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p, s) => (p >> s) & 255;
  const c = (s) => Math.round(lerp(ch(pa, s), ch(pb, s), t));
  return '#' + [16, 8, 0].map((s) => c(s).toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------- svg basics
export function attrs(o = {}) {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${typeof v === 'number' ? r1(v) : v}"`)
    .join(' ');
}
export const g = (a, ...kids) => `<g ${attrs(a)}>${kids.flat().join('')}</g>`;
export const path = (d, a = {}) => `<path d="${d}" ${attrs(a)}/>`;
export const circle = (cx, cy, r, a = {}) => `<circle ${attrs({ cx, cy, r, ...a })}/>`;
export const ellipse = (cx, cy, rx, ry, a = {}) => `<ellipse ${attrs({ cx, cy, rx, ry, ...a })}/>`;
export const rect = (x, y, width, height, a = {}) => `<rect ${attrs({ x, y, width, height, ...a })}/>`;
export const poly = (pts, a = {}) => `<polygon points="${pts.map((p) => p.map(r1).join(',')).join(' ')}" ${attrs(a)}/>`;
export const T = (x, y, s = 1, rot = 0, flip = false) =>
  `translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${r1(rot)})` : ''} scale(${flip ? -s : s} ${s})`;

export function linear(id, stops, { x1 = 0, y1 = 0, x2 = 0, y2 = 1, units } = {}) {
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${units ? ` gradientUnits="${units}"` : ''}>${stopList(stops)}</linearGradient>`;
}
export function radial(id, stops, { cx = 0.5, cy = 0.5, r = 0.5, fx, fy, units } = {}) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${fx !== undefined ? ` fx="${fx}" fy="${fy}"` : ''}${units ? ` gradientUnits="${units}"` : ''}>${stopList(stops)}</radialGradient>`;
}
function stopList(stops) {
  // stops: [[offset, colour, opacity?], ...]
  return stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}"${op !== 1 ? ` stop-opacity="${op}"` : ''}/>`).join('');
}

// The document wrapper every scene returns.
export function svgDoc({ defs = '', body = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000"><defs>${defs}<clipPath id="frame"><rect width="1000" height="1000"/></clipPath></defs><g clip-path="url(#frame)">${body}</g></svg>`;
}

// ---------------------------------------------------------------- curves
// Smooth curve through points (Catmull-Rom -> cubic Bezier).
export function smooth(points, tension = 1) {
  if (points.length < 2) return '';
  const p = points;
  let d = `M${r1(p[0][0])},${r1(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C${r1(c1x)},${r1(c1y)} ${r1(c2x)},${r1(c2y)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d;
}
// Closed smooth blob through points.
export function blob(points, tension = 1) {
  const n = points.length;
  let d = `M${r1(points[0][0])},${r1(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C${r1(c1x)},${r1(c1y)} ${r1(c2x)},${r1(c2y)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d + 'Z';
}
// A land / hill band: smooth top edge through points, closed down to `bottom`.
export function ridge(points, bottom = 1000) {
  const first = points[0];
  const last = points[points.length - 1];
  return `${smooth(points)} L${r1(last[0])},${bottom} L${r1(first[0])},${bottom} Z`;
}
// Sine-wave band from x0..x1 at baseline y, closed down to `bottom`.
export function waveBand(y, { amp = 12, len = 160, phase = 0, x0 = -20, x1 = 1020, bottom = 1000 } = {}) {
  const pts = [];
  for (let x = x0; x <= x1 + len / 8; x += len / 8) {
    pts.push([x, y + Math.sin(((x + phase) / len) * Math.PI * 2) * amp]);
  }
  return ridge(pts, bottom);
}

// ---------------------------------------------------------------- sky things
// Four-point twinkle star.
export function sparkle(x, y, s, fill = C.cream, a = {}) {
  const k = 0.16 * s;
  const d = `M${r1(x)},${r1(y - s)} C${r1(x + k)},${r1(y - k)} ${r1(x + k)},${r1(y - k)} ${r1(x + s)},${r1(y)} C${r1(x + k)},${r1(y + k)} ${r1(x + k)},${r1(y + k)} ${r1(x)},${r1(y + s)} C${r1(x - k)},${r1(y + k)} ${r1(x - k)},${r1(y + k)} ${r1(x - s)},${r1(y)} C${r1(x - k)},${r1(y - k)} ${r1(x - k)},${r1(y - k)} ${r1(x)},${r1(y - s)}Z`;
  return path(d, { fill, ...a });
}
// Eight-point star (two overlapping squares) - the classic Islamic star.
export function star8(x, y, r, fill = C.gold1, a = {}) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const ang = (Math.PI / 8) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.76;
    pts.push([x + Math.cos(ang) * rr, y + Math.sin(ang) * rr]);
  }
  return poly(pts, { fill, ...a });
}
// Five-point star.
export function star5(x, y, r, fill = C.gold1, a = {}) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    pts.push([x + Math.cos(ang) * rr, y + Math.sin(ang) * rr]);
  }
  return poly(pts, { fill, 'stroke-linejoin': 'round', ...a });
}
// A field of stars: dots plus a few twinkles. area = [x, y, w, h].
export function starField({ seed = 7, n = 60, area = [0, 0, 1000, 520], twinkles = 10, color = C.cream, gold = C.gold1, avoid = [] } = {}) {
  const R = rng(seed);
  const out = [];
  const ok = (x, y) => avoid.every(([cx, cy, rr]) => (x - cx) ** 2 + (y - cy) ** 2 > rr * rr);
  let tries = 0;
  while (out.length < n && tries < n * 20) {
    tries++;
    const x = area[0] + R() * area[2];
    const y = area[1] + R() * area[3] * R() ** 0.35; // denser near the top
    if (!ok(x, y)) continue;
    out.push(circle(x, y, R.range(1.2, 3.4), { fill: R() < 0.2 ? gold : color, opacity: R.range(0.45, 1) }));
  }
  let t = 0;
  tries = 0;
  while (t < twinkles && tries < twinkles * 30) {
    tries++;
    const x = area[0] + R() * area[2];
    const y = area[1] + R() * area[3] * 0.85;
    if (!ok(x, y)) continue;
    out.push(sparkle(x, y, R.range(7, 15), R() < 0.4 ? gold : color, { opacity: R.range(0.75, 1) }));
    t++;
  }
  return out.join('');
}
// Crescent moon. angle rotates the crescent (0 = opening to the right).
export function crescent(x, y, r, { fill = C.gold0, angle = -25, thickness = 0.42, a = {} } = {}) {
  const r2 = r * 0.86;
  const d = r * thickness + (r - r2);
  const ix = (r * r - r2 * r2 + d * d) / (2 * d);
  const iy = Math.sqrt(Math.max(0, r * r - ix * ix));
  const large2 = d - ix > 0 ? 0 : 1;
  const pd = `M${r1(ix)},${r1(-iy)} A${r1(r)},${r1(r)} 0 1 0 ${r1(ix)},${r1(iy)} A${r1(r2)},${r1(r2)} 0 ${large2} 1 ${r1(ix)},${r1(-iy)}Z`;
  return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${angle})">${path(pd, { fill, ...a })}</g>`;
}
// Soft round glow (needs a radial gradient id made with glowDef).
export const glowDef = (id, color, op = 0.55) => radial(id, [[0, color, op], [0.45, color, op * 0.35], [1, color, 0]]);
export const glow = (x, y, r, id) => circle(x, y, r, { fill: `url(#${id})` });

export function sun(x, y, r, { fill = C.gold1, core = C.gold0, rays = 0, rayColor = C.gold1, glowId } = {}) {
  let out = '';
  if (glowId) out += circle(x, y, r * 3, { fill: `url(#${glowId})` });
  if (rays) {
    for (let i = 0; i < rays; i++) {
      const ang = (Math.PI * 2 * i) / rays;
      const a1 = ang - 0.07;
      const a2 = ang + 0.07;
      const p = [
        [x + Math.cos(a1) * r * 1.25, y + Math.sin(a1) * r * 1.25],
        [x + Math.cos(ang) * r * 1.7, y + Math.sin(ang) * r * 1.7],
        [x + Math.cos(a2) * r * 1.25, y + Math.sin(a2) * r * 1.25],
      ];
      out += poly(p, { fill: rayColor, opacity: 0.8, 'stroke-linejoin': 'round', stroke: rayColor, 'stroke-width': r * 0.08 });
    }
  }
  out += circle(x, y, r * 1.12, { fill, opacity: 0.35 });
  out += circle(x, y, r, { fill });
  out += circle(x - r * 0.18, y - r * 0.18, r * 0.72, { fill: core, opacity: 0.55 });
  return out;
}
// Puffy cloud. (x, y) = middle of the flat bottom edge, w = width.
export function cloud(x, y, w, { fill = C.white, shade, opacity = 1, seed = 3, flat = true } = {}) {
  const R = rng(seed);
  const h = w * 0.36;
  const bumps = [
    [x - w * 0.32, y - h * 0.35, w * 0.17],
    [x - w * 0.12, y - h * 0.62, w * 0.22],
    [x + w * 0.12, y - h * 0.72, w * 0.25],
    [x + w * 0.33, y - h * 0.4, w * 0.17],
  ].map(([cx, cy, rr]) => [cx + R.range(-0.03, 0.03) * w, cy + R.range(-0.05, 0.05) * h, rr * R.range(0.92, 1.08)]);
  let s = '';
  if (shade) {
    s += g({ fill: shade }, bumps.map(([cx, cy, rr]) => circle(cx + w * 0.02, cy + w * 0.03, rr)), rect(x - w * 0.45, y - h * 0.32 + w * 0.03, w * 0.9, h * 0.32, { rx: h * 0.16 }));
  }
  s += g({ fill }, bumps.map(([cx, cy, rr]) => circle(cx, cy, rr)), rect(x - w * 0.47, y - h * 0.36, w * 0.94, h * 0.36, { rx: flat ? h * 0.18 : h * 0.3 }));
  return g({ opacity }, s);
}

// ---------------------------------------------------------------- land
// Mountain with a lit left face and a shaded right face.
export function mountain(x, baseY, w, h, { light = C.rock1, dark = C.rock2, snow, peakRound = 0.08, seed = 2 } = {}) {
  const R = rng(seed);
  const px = x + R.range(-0.06, 0.06) * w;
  const top = baseY - h;
  const rr = w * peakRound;
  const left = [x - w / 2, baseY];
  const right = [x + w / 2, baseY];
  const body = `M${r1(left[0])},${r1(left[1])} L${r1(px - rr)},${r1(top + rr * 0.7)} Q${r1(px)},${r1(top - rr * 0.2)} ${r1(px + rr)},${r1(top + rr * 0.7)} L${r1(right[0])},${r1(right[1])}Z`;
  const midx = px + w * 0.06;
  const shadow = `M${r1(px)},${r1(top + rr * 0.15)} Q${r1(px + rr)},${r1(top + rr * 0.3)} ${r1(px + rr)},${r1(top + rr * 0.7)} L${r1(right[0])},${r1(right[1])} L${r1(midx)},${r1(baseY)} L${r1(px + w * 0.1)},${r1(top + h * 0.55)} L${r1(px - w * 0.02)},${r1(top + h * 0.3)}Z`;
  let s = path(body, { fill: light }) + path(shadow, { fill: dark });
  if (snow) {
    const sh = h * 0.2;
    const cap = `M${r1(px - rr)},${r1(top + rr * 0.7)} Q${r1(px)},${r1(top - rr * 0.2)} ${r1(px + rr)},${r1(top + rr * 0.7)} L${r1(px + sh * 0.55)},${r1(top + sh)} L${r1(px + sh * 0.2)},${r1(top + sh * 0.8)} L${r1(px - sh * 0.1)},${r1(top + sh * 1.05)} L${r1(px - sh * 0.4)},${r1(top + sh * 0.8)} L${r1(px - sh * 0.6)},${r1(top + sh)}Z`;
    s += path(cap, { fill: snow });
  }
  return s;
}
// Sand dune band with a sunny face and a shadow face split along a ridge.
export function dune(points, { light = C.sand1, dark = C.sand2, bottom = 1000, shadeShift = 26 } = {}) {
  const top = ridge(points, bottom);
  const shade = ridge(points.map(([x, y], i) => [x + shadeShift, y + (i % 2 ? 26 : 10)]), bottom);
  return path(top, { fill: light }) + path(shade, { fill: dark, opacity: 0.55 });
}

// ---------------------------------------------------------------- plants
// Date palm. (x, y) = base of trunk. h = height to crown.
export function palm(x, y, { h = 300, lean = 0.12, seed = 5, trunk = C.wood2, trunkDark = C.wood3, leaf = C.leaf3, leafDark = C.leaf5, leafMid = C.leaf4, dates = true, dateColor = C.gold4, scale = 1 } = {}) {
  const R = rng(seed);
  h *= scale;
  const topX = x + lean * h;
  const topY = y - h;
  const ctrlX = x + lean * h * 0.15;
  const ctrlY = y - h * 0.55;
  const bw = h * 0.05;
  const tw = h * 0.03;
  const trunkPath = `M${r1(x - bw)},${r1(y)} Q${r1(ctrlX - bw * 0.8)},${r1(ctrlY)} ${r1(topX - tw)},${r1(topY)} L${r1(topX + tw)},${r1(topY)} Q${r1(ctrlX + bw * 0.8)},${r1(ctrlY)} ${r1(x + bw)},${r1(y)}Z`;
  let back = '';
  let s = path(trunkPath, { fill: trunk });
  s += path(`M${r1(x + bw * 0.1)},${r1(y)} Q${r1(ctrlX + bw * 0.1)},${r1(ctrlY)} ${r1(topX + tw * 0.1)},${r1(topY)} L${r1(topX + tw)},${r1(topY)} Q${r1(ctrlX + bw * 0.8)},${r1(ctrlY)} ${r1(x + bw)},${r1(y)}Z`, { fill: trunkDark, opacity: 0.5 });
  const rings = Math.round(h / 24);
  for (let i = 1; i < rings; i++) {
    const t = i / rings;
    const px = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * ctrlX + t * t * topX;
    const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * ctrlY + t * t * topY;
    const w = lerp(bw, tw, t) * 1.02;
    s += path(`M${r1(px - w)},${r1(py - w * 0.15)} Q${r1(px)},${r1(py + w * 0.5)} ${r1(px + w)},${r1(py - w * 0.15)}`, { fill: 'none', stroke: trunkDark, 'stroke-width': r1(Math.max(1.4, h * 0.008)), 'stroke-linecap': 'round', opacity: 0.55 });
  }
  // back fronds (darker) sit behind the trunk top, front fronds in front
  const backAngles = [-150, -112, -68, -30];
  const frontAngles = [-178, -132, -92, -50, -4, 28, 152];
  for (const a0 of backAngles) {
    const a = a0 + R.range(-8, 8);
    back += frond(topX, topY, a, h * R.range(0.5, 0.6), { leaf: leafMid, leafDark: leafDark, droop: h * 0.24 * Math.abs(Math.cos((a * Math.PI) / 180)) + h * 0.05 });
  }
  let front = '';
  if (dates) {
    for (const side of [-1, 1]) {
      const cx = topX + side * h * 0.055;
      const cy = topY + h * 0.05;
      front += path(`M${r1(topX)},${r1(topY)} Q${r1(cx)},${r1(cy - h * 0.02)} ${r1(cx + side * h * 0.01)},${r1(cy + h * 0.03)}`, { fill: 'none', stroke: C.gold3, 'stroke-width': r1(h * 0.008) });
      for (let k = 0; k < 14; k++) {
        const row = Math.floor(k / 4);
        const dx = cx + side * h * 0.012 + (k % 4 - 1.5) * h * 0.016 * (1 - row * 0.18) + R.range(-1, 1);
        const dy = cy + h * 0.02 + row * h * 0.022 + R.range(-1, 1);
        front += ellipse(dx, dy, h * 0.012, h * 0.016, { fill: k % 3 === 0 ? mix(dateColor, '#000000', 0.22) : dateColor });
      }
    }
  }
  for (const a0 of frontAngles) {
    const a = a0 + R.range(-7, 7);
    const horiz = Math.abs(Math.cos((a * Math.PI) / 180));
    const down = a > 0 && a < 180;
    front += frond(topX, topY, a, h * R.range(0.5, 0.62) * (down ? 0.75 : 1), { leaf, leafDark: leafMid, droop: down ? h * 0.12 : h * (0.06 + 0.26 * horiz) });
  }
  front += ellipse(topX, topY + 2, h * 0.035, h * 0.028, { fill: leafDark });
  return back + s + front;
}
// A single feathery palm frond rising from (x, y) at angle angDeg, length L,
// its tip pulled down by `droop`.
export function frond(x, y, angDeg, L, { leaf = C.leaf3, leafDark = C.leaf4, droop = 40, width = 0.13, teeth = 13 } = {}) {
  const a = (angDeg * Math.PI) / 180;
  const ctl = [x + Math.cos(a) * L * 0.6, y + Math.sin(a) * L * 0.6 - L * 0.06];
  const tip = [x + Math.cos(a) * L, y + Math.sin(a) * L + droop];
  const at = (t) => {
    const px = (1 - t) ** 2 * x + 2 * (1 - t) * t * ctl[0] + t * t * tip[0];
    const py = (1 - t) ** 2 * y + 2 * (1 - t) * t * ctl[1] + t * t * tip[1];
    const dx = 2 * (1 - t) * (ctl[0] - x) + 2 * t * (tip[0] - ctl[0]);
    const dy = 2 * (1 - t) * (ctl[1] - y) + 2 * t * (tip[1] - ctl[1]);
    const len = Math.hypot(dx, dy) || 1;
    return { px, py, nx: -dy / len, ny: dx / len, tx: dx / len, ty: dy / len };
  };
  const W = L * width;
  const prof = (t) => W * Math.sin(Math.PI * Math.min(1, 0.08 + t * 0.95)) ** 0.55;
  const side = (sgn) => {
    const pts = [[x, y]];
    for (let i = 0; i < teeth; i++) {
      const t0 = i / teeth;
      const t1 = (i + 0.85) / teeth;
      const A = at(t0);
      const B = at(Math.min(1, t1));
      const w0 = prof(t0) * 0.42;
      const w1 = prof(Math.min(1, t1));
      pts.push([A.px + sgn * A.nx * w0, A.py + sgn * A.ny * w0]);
      // tooth tip swept toward the frond tip
      pts.push([B.px + sgn * B.nx * w1 + B.tx * W * 0.25, B.py + sgn * B.ny * w1 + B.ty * W * 0.25]);
    }
    pts.push(tip);
    return pts;
  };
  const up = side(-1);
  const dn = side(1);
  const mid = [];
  for (let i = 0; i <= 12; i++) {
    const p = at(i / 12);
    mid.push([p.px, p.py]);
  }
  const close = (pts) => 'M' + pts.map((p) => p.map(r1).join(',')).join(' L') + ' L' + mid.slice().reverse().map((p) => p.map(r1).join(',')).join(' L') + 'Z';
  // the half facing the sky is lit, the other half is in shade
  const upperIsNeg = Math.cos(a) >= 0;
  return (
    path(close(upperIsNeg ? dn : up), { fill: leafDark, stroke: leafDark, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }) +
    path(close(upperIsNeg ? up : dn), { fill: leaf, stroke: leaf, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }) +
    path(smooth(mid), { fill: 'none', stroke: mix(leaf, '#FFFFFF', 0.25), 'stroke-width': r1(Math.max(1.2, L * 0.012)), 'stroke-linecap': 'round', opacity: 0.85 })
  );
}
// Round-canopy tree. (x, y) = base of trunk.
export function tree(x, y, { r = 90, trunkH = 90, seed = 11, leaf = C.leaf3, leafDark = C.leaf4, leafLight = C.leaf2, trunk = C.wood2, fruit, fruitN = 9, clipId } = {}) {
  const R = rng(seed);
  const cy = y - trunkH - r * 0.75;
  let s = path(`M${r1(x - r * 0.1)},${r1(y)} Q${r1(x - r * 0.06)},${r1(y - trunkH * 0.6)} ${r1(x - r * 0.22)},${r1(cy + r * 0.2)} L${r1(x + r * 0.22)},${r1(cy + r * 0.2)} Q${r1(x + r * 0.06)},${r1(y - trunkH * 0.6)} ${r1(x + r * 0.1)},${r1(y)}Z`, { fill: trunk });
  const lobes = [];
  for (let i = 0; i < 7; i++) {
    const a = (Math.PI * 2 * i) / 7 + R.range(-0.2, 0.2);
    lobes.push([x + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.45, r * R.range(0.48, 0.6)]);
  }
  lobes.push([x, cy, r * 0.7]);
  s += g({ fill: leafDark }, lobes.map(([cx, cyy, rr]) => circle(cx + r * 0.05, cyy + r * 0.07, rr)));
  s += g({ fill: leaf }, lobes.map(([cx, cyy, rr]) => circle(cx, cyy, rr)));
  s += g({ fill: leafLight, opacity: 0.85 }, [
    circle(x - r * 0.3, cy - r * 0.32, r * 0.3),
    circle(x - r * 0.05, cy - r * 0.45, r * 0.24),
    circle(x - r * 0.5, cy - r * 0.05, r * 0.2),
  ]);
  if (fruit) {
    for (let i = 0; i < fruitN; i++) {
      const a = R() * Math.PI * 2;
      const d = Math.sqrt(R()) * r * 0.75;
      const fx = x + Math.cos(a) * d;
      const fy = cy + Math.sin(a) * d * 0.8;
      s += circle(fx, fy, r * 0.075, { fill: fruit });
      s += circle(fx - r * 0.022, fy - r * 0.022, r * 0.025, { fill: C.white, opacity: 0.6 });
    }
  }
  return s;
}
// Tall slim cypress / juniper.
export function cypress(x, y, { h = 220, w = 54, fill = C.leaf5, light = C.leaf4 } = {}) {
  const d = `M${r1(x)},${r1(y - h)} C${r1(x + w * 0.6)},${r1(y - h * 0.7)} ${r1(x + w * 0.62)},${r1(y - h * 0.15)} ${r1(x + w * 0.1)},${r1(y)} L${r1(x - w * 0.1)},${r1(y)} C${r1(x - w * 0.62)},${r1(y - h * 0.15)} ${r1(x - w * 0.6)},${r1(y - h * 0.7)} ${r1(x)},${r1(y - h)}Z`;
  const hl = `M${r1(x)},${r1(y - h)} C${r1(x - w * 0.6)},${r1(y - h * 0.7)} ${r1(x - w * 0.62)},${r1(y - h * 0.15)} ${r1(x - w * 0.1)},${r1(y)} L${r1(x)},${r1(y)}Z`;
  return path(d, { fill }) + path(hl, { fill: light, opacity: 0.7 });
}
// Small bush made of overlapping circles. (x, y) = bottom centre.
export function bush(x, y, { w = 90, fill = C.leaf3, dark = C.leaf4, light = C.leaf2, seed = 4 } = {}) {
  const R = rng(seed);
  const parts = [
    [x - w * 0.28, y - w * 0.18, w * 0.24],
    [x, y - w * 0.3, w * 0.3],
    [x + w * 0.28, y - w * 0.17, w * 0.23],
  ].map(([a, b, c]) => [a + R.range(-3, 3), b + R.range(-3, 3), c]);
  return (
    g({ fill: dark }, parts.map(([a, b, c]) => circle(a + 3, b + 4, c)), rect(x - w * 0.5, y - w * 0.18, w, w * 0.18, { rx: w * 0.09 })) +
    g({ fill }, parts.map(([a, b, c]) => circle(a, b, c))) +
    circle(x - w * 0.08, y - w * 0.42, w * 0.11, { fill: light, opacity: 0.8 })
  );
}
// Tuft of grass blades. (x, y) = base.
export function grass(x, y, { h = 34, fill = C.leaf4, n = 5, seed = 9, spread = 1 } = {}) {
  const R = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * 6 * spread;
    const hh = h * R.range(0.6, 1);
    const lean = off * 1.4 + R.range(-6, 6);
    d += `M${r1(x + off - 3)},${r1(y)} Q${r1(x + off + lean * 0.3)},${r1(y - hh * 0.6)} ${r1(x + off + lean)},${r1(y - hh)} Q${r1(x + off + lean * 0.2 + 2)},${r1(y - hh * 0.45)} ${r1(x + off + 3)},${r1(y)}Z `;
  }
  return path(d, { fill });
}
// Simple five-petal flower. (x, y) = flower centre.
export function flower(x, y, { r = 10, fill = C.coral1, center = C.gold2, stem = C.leaf4, stemH = 0, petals = 5, rot = 0 } = {}) {
  let s = '';
  if (stemH) s += path(`M${r1(x)},${r1(y)} Q${r1(x - 4)},${r1(y + stemH * 0.5)} ${r1(x)},${r1(y + stemH)}`, { fill: 'none', stroke: stem, 'stroke-width': 3, 'stroke-linecap': 'round' });
  for (let i = 0; i < petals; i++) {
    const a = (Math.PI * 2 * i) / petals + (rot * Math.PI) / 180;
    s += circle(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.52, { fill });
  }
  s += circle(x, y, r * 0.38, { fill: center });
  return s;
}
// Rounded rock. (x, y) = bottom centre.
export function rock(x, y, { w = 80, h = 50, fill = C.stone1, dark = C.stone2, light = C.stone0, seed = 13 } = {}) {
  const R = rng(seed);
  const pts = [
    [x - w * 0.5, y],
    [x - w * R.range(0.45, 0.52), y - h * 0.55],
    [x - w * 0.2, y - h * R.range(0.92, 1)],
    [x + w * 0.18, y - h * R.range(0.85, 1)],
    [x + w * 0.48, y - h * 0.5],
    [x + w * 0.5, y],
  ];
  return (
    path(blob(pts), { fill }) +
    path(blob([[x + w * 0.05, y], [x + w * 0.2, y - h * 0.6], [x + w * 0.45, y - h * 0.45], [x + w * 0.5, y]]), { fill: dark, opacity: 0.6 }) +
    ellipse(x - w * 0.18, y - h * 0.7, w * 0.14, h * 0.1, { fill: light, opacity: 0.7 })
  );
}
// Reeds / bulrushes for river banks. (x, y) = base.
export function reeds(x, y, { h = 150, n = 6, seed = 21, fill = C.leaf4, head = C.wood2 } = {}) {
  const R = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const ox = x + (i - n / 2) * 9 + R.range(-4, 4);
    const hh = h * R.range(0.65, 1);
    const lean = R.range(-18, 18);
    s += path(`M${r1(ox - 2.5)},${r1(y)} Q${r1(ox + lean * 0.3)},${r1(y - hh * 0.6)} ${r1(ox + lean)},${r1(y - hh)} Q${r1(ox + lean * 0.3 + 3)},${r1(y - hh * 0.6)} ${r1(ox + 2.5)},${r1(y)}Z`, { fill });
    if (i % 2 === 0) s += ellipse(ox + lean * 0.86, y - hh * 0.86, 5, 15, { fill: head, transform: `rotate(${r1(lean * 0.6)} ${r1(ox + lean * 0.86)} ${r1(y - hh * 0.86)})` });
  }
  return s;
}

// ---------------------------------------------------------------- water
// Layered sea: pass bands from back to front.
export function sea(y, { colors = [C.water2, C.water3, C.water4], amp = 10, len = 180, gap = 34, seed = 1 } = {}) {
  const R = rng(seed);
  return colors.map((c, i) => path(waveBand(y + i * gap, { amp: amp * (1 + i * 0.25), len: len * (1 + i * 0.15), phase: R() * 400 }), { fill: c })).join('');
}
// White foam crest line along a wave.
export function foam(y, { amp = 10, len = 180, phase = 0, x0 = 0, x1 = 1000, color = C.white, width = 4, opacity = 0.7, dash } = {}) {
  const pts = [];
  for (let x = x0; x <= x1; x += len / 10) pts.push([x, y + Math.sin(((x + phase) / len) * Math.PI * 2) * amp]);
  return path(smooth(pts), { fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', opacity, 'stroke-dasharray': dash });
}

// ---------------------------------------------------------------- creatures
// All creatures face RIGHT by default; pass flip:true to face left.
// (x, y) is the point between the feet on the ground (or body centre for
// fliers / swimmers); s scales the creature (s = 1 is roughly 200 px wide).
const eye = (x, y, r, closed = false) =>
  closed
    ? path(`M${r1(x - r)},${r1(y)} Q${r1(x)},${r1(y + r * 0.9)} ${r1(x + r)},${r1(y)}`, { fill: 'none', stroke: C.ink, 'stroke-width': r1(r * 0.45), 'stroke-linecap': 'round' })
    : circle(x, y, r, { fill: C.ink }) + circle(x + r * 0.3, y - r * 0.32, r * 0.34, { fill: C.white });
export { eye };

export function camel(x, y, { s = 1, flip = false, body = C.sand3, dark = C.sand4, light = C.sand2, sleepy = false, saddle } = {}) {
  const parts = [];
  // far legs
  parts.push(rect(-52, -96, 15, 98, { rx: 7, fill: dark }), rect(38, -96, 15, 98, { rx: 7, fill: dark }));
  // tail
  parts.push(path('M-78,-118 Q-92,-96 -86,-74', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  // body + hump
  parts.push(path('M-82,-112 C-84,-150 -60,-168 -30,-170 C-18,-214 30,-214 40,-168 C62,-166 80,-150 80,-120 C80,-96 60,-86 0,-86 C-50,-86 -80,-92 -82,-112Z', { fill: body }));
  parts.push(path('M-30,-170 C-18,-214 30,-214 40,-168 C20,-180 -10,-182 -30,-170Z', { fill: light, opacity: 0.7 }));
  // belly shade
  parts.push(path('M-70,-100 C-40,-88 30,-88 70,-102 C66,-90 50,-86 0,-86 C-40,-86 -64,-90 -70,-100Z', { fill: dark, opacity: 0.5 }));
  if (saddle) parts.push(path('M-24,-176 C-8,-188 22,-188 34,-172 L30,-150 L-22,-150Z', { fill: saddle }), rect(-26, -156, 60, 8, { rx: 4, fill: mix(saddle, '#000000', 0.25) }));
  // near legs with knobby knees
  parts.push(rect(-40, -100, 16, 102, { rx: 8, fill: body }), rect(50, -100, 16, 102, { rx: 8, fill: body }));
  parts.push(ellipse(-32, -48, 10, 8, { fill: light }), ellipse(58, -48, 10, 8, { fill: light }));
  parts.push(ellipse(-32, 0, 13, 6, { fill: dark }), ellipse(58, 0, 13, 6, { fill: dark }));
  // neck
  parts.push(path('M62,-150 C88,-160 96,-190 98,-222 L124,-222 C124,-180 112,-134 76,-118Z', { fill: body }));
  // head
  parts.push(path('M92,-236 C96,-252 120,-258 138,-250 C156,-244 170,-236 170,-222 C170,-210 160,-206 148,-208 C134,-210 124,-206 116,-204 C100,-204 88,-218 92,-236Z', { fill: body }));
  parts.push(ellipse(106, -252, 7, 11, { fill: dark, transform: 'rotate(-30 106 -252)' }));
  parts.push(ellipse(160, -216, 4, 3, { fill: dark }));
  parts.push(path('M150,-208 Q158,-204 166,-208', { fill: 'none', stroke: dark, 'stroke-width': 3, 'stroke-linecap': 'round' }));
  parts.push(eye(128, -234, 5, sleepy));
  parts.push(ellipse(138, -220, 7, 4, { fill: C.cheek, opacity: 0.6 }));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

export function sheep(x, y, { s = 1, flip = false, wool = C.wool0, woolShade = C.wool2, face = '#5B4A4E', seed = 3, ram = false } = {}) {
  const R = rng(seed);
  const parts = [];
  parts.push(rect(-40, -44, 13, 46, { rx: 6, fill: mix(face, '#000000', 0.2) }), rect(26, -44, 13, 46, { rx: 6, fill: mix(face, '#000000', 0.2) }));
  const puffs = [];
  for (let i = 0; i < 9; i++) {
    const a = (Math.PI * 2 * i) / 9;
    puffs.push([Math.cos(a) * 52, -78 + Math.sin(a) * 30, 24 + R.range(-3, 4)]);
  }
  parts.push(g({ fill: woolShade }, puffs.map(([a, b, c]) => circle(a + 3, b + 5, c)), ellipse(3, -73, 58, 34)));
  parts.push(g({ fill: wool }, puffs.map(([a, b, c]) => circle(a, b, c)), ellipse(0, -78, 56, 34)));
  parts.push(rect(-30, -44, 13, 46, { rx: 6, fill: face }), rect(36, -44, 13, 46, { rx: 6, fill: face }));
  // head
  parts.push(ellipse(70, -96, 22, 27, { fill: face, transform: 'rotate(-18 70 -96)' }));
  parts.push(ellipse(52, -112, 14, 7, { fill: face, transform: 'rotate(25 52 -112)' }));
  parts.push(g({ fill: wool }, circle(58, -122, 12), circle(72, -126, 11), circle(84, -118, 9)));
  if (ram) {
    parts.push(path('M58,-114 C40,-138 70,-152 84,-136 C94,-124 84,-108 72,-112 C64,-114 66,-126 74,-126', { fill: 'none', stroke: C.sand4, 'stroke-width': 11, 'stroke-linecap': 'round' }));
    parts.push(path('M58,-114 C40,-138 70,-152 84,-136 C94,-124 84,-108 72,-112', { fill: 'none', stroke: C.sand3, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }));
  }
  parts.push(eye(78, -100, 4.2));
  parts.push(ellipse(84, -86, 5, 3, { fill: C.cheek, opacity: 0.55 }));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// Perched songbird. (x, y) = feet.
export function bird(x, y, { s = 1, flip = false, body = C.coral2, wing = C.coral3, belly = C.coral0, beak = C.gold2, closed = false } = {}) {
  const parts = [
    path('M-30,-30 L-58,-40 L-52,-24 Z', { fill: wing }),
    ellipse(0, -34, 32, 24, { fill: body }),
    ellipse(6, -26, 20, 14, { fill: belly }),
    circle(24, -52, 17, { fill: body }),
    path('M38,-55 L54,-50 L38,-45Z', { fill: beak }),
    path('M-18,-44 C-6,-52 14,-46 12,-32 C6,-24 -14,-24 -22,-30Z', { fill: wing }),
    eye(28, -55, 3.6, closed),
    ellipse(32, -46, 4, 2.6, { fill: C.cheek, opacity: 0.6 }),
    path('M-4,-10 L-6,0 M8,-10 L10,0', { stroke: C.gold4, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}
// Flying bird seen from the side, wings up or down. (x, y) = body centre.
export function flyingBird(x, y, { s = 1, flip = false, body = C.cream, wing = C.wool2, beak = C.gold2, up = true } = {}) {
  const wingPath = up ? 'M-6,-6 C-10,-40 18,-62 30,-64 C24,-40 18,-18 10,-4Z' : 'M-6,2 C-12,30 12,50 26,52 C22,30 16,14 10,2Z';
  const parts = [
    path('M-34,-2 L-54,-12 L-50,6Z', { fill: wing }),
    ellipse(0, 0, 34, 15, { fill: body }),
    circle(28, -6, 12, { fill: body }),
    path('M38,-8 L50,-4 L38,0Z', { fill: beak }),
    path(wingPath, { fill: wing }),
    eye(31, -8, 2.6),
  ];
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}
// Distant bird silhouette (a soft "m").
export function farBird(x, y, s = 1, color = C.ink, opacity = 0.7) {
  return path(`M${r1(x - 14 * s)},${r1(y)} Q${r1(x - 7 * s)},${r1(y - 8 * s)} ${r1(x)},${r1(y)} Q${r1(x + 7 * s)},${r1(y - 8 * s)} ${r1(x + 14 * s)},${r1(y)}`, { fill: 'none', stroke: color, 'stroke-width': r1(2.6 * s), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity });
}
// Fish. (x, y) = body centre.
export function fish(x, y, { s = 1, flip = false, body = C.coral2, fin = C.coral3, belly = C.coral0, stripes = true } = {}) {
  const parts = [
    path('M-34,0 L-60,-20 Q-52,0 -60,20Z', { fill: fin }),
    ellipse(0, 0, 40, 24, { fill: body }),
    path('M-30,6 Q0,24 34,6 Q20,22 0,23 Q-20,22 -30,6Z', { fill: belly, opacity: 0.8 }),
    path('M-8,-22 Q6,-36 18,-20Z', { fill: fin }),
  ];
  if (stripes) parts.push(path('M-10,-21 Q-16,0 -10,21 M4,-23 Q-2,0 4,23', { fill: 'none', stroke: fin, 'stroke-width': 4, opacity: 0.55 }));
  parts.push(eye(22, -5, 4.2));
  return g({ transform: T(x, y, s, 0, flip) }, parts);
}

// ---------------------------------------------------------------- buildings
// Simple flat-roofed mud-brick house. (x, y) = bottom centre.
export function house(x, y, { w = 120, h = 100, fill = C.sand2, dark = C.sand3, door = C.wood3, windows = 1, dome, domeColor = C.cream } = {}) {
  let s = rect(x - w / 2, y - h, w, h, { fill });
  s += rect(x + w * 0.18, y - h, w * 0.32, h, { fill: dark, opacity: 0.45 });
  s += rect(x - w / 2 - 4, y - h - 8, w + 8, 10, { rx: 4, fill: dark });
  s += path(`M${r1(x - w * 0.12)},${r1(y)} L${r1(x - w * 0.12)},${r1(y - h * 0.38)} Q${r1(x)},${r1(y - h * 0.56)} ${r1(x + w * 0.12)},${r1(y - h * 0.38)} L${r1(x + w * 0.12)},${r1(y)}Z`, { fill: door });
  for (let i = 0; i < windows; i++) {
    const wx = x - w * 0.34 + i * w * 0.5;
    s += path(`M${r1(wx - 8)},${r1(y - h * 0.62)} L${r1(wx - 8)},${r1(y - h * 0.76)} Q${r1(wx)},${r1(y - h * 0.86)} ${r1(wx + 8)},${r1(y - h * 0.76)} L${r1(wx + 8)},${r1(y - h * 0.62)}Z`, { fill: door, opacity: 0.85 });
  }
  if (dome) s += path(`M${r1(x - dome)},${r1(y - h - 8)} A${r1(dome)},${r1(dome)} 0 0 1 ${r1(x + dome)},${r1(y - h - 8)}Z`, { fill: domeColor });
  return s;
}
// Bedouin tent. (x, y) = bottom centre.
export function tent(x, y, { w = 220, h = 110, fill = C.coral2, dark = C.coral3, stripe = C.cream, open = C.ink2 } = {}) {
  const top = y - h;
  let s = path(`M${r1(x - w / 2)},${r1(y)} L${r1(x - w * 0.38)},${r1(top + h * 0.18)} Q${r1(x - w * 0.2)},${r1(top - h * 0.05)} ${r1(x)},${r1(top + h * 0.08)} Q${r1(x + w * 0.2)},${r1(top - h * 0.05)} ${r1(x + w * 0.38)},${r1(top + h * 0.18)} L${r1(x + w / 2)},${r1(y)}Z`, { fill });
  s += path(`M${r1(x + w * 0.05)},${r1(top + h * 0.09)} Q${r1(x + w * 0.2)},${r1(top - h * 0.04)} ${r1(x + w * 0.38)},${r1(top + h * 0.18)} L${r1(x + w / 2)},${r1(y)} L${r1(x + w * 0.12)},${r1(y)}Z`, { fill: dark, opacity: 0.6 });
  for (const t of [0.35, 0.55]) s += path(`M${r1(x - w * 0.47)},${r1(top + h * t + h * 0.12)} L${r1(x + w * 0.47)},${r1(top + h * t + h * 0.12)}`, { stroke: stripe, 'stroke-width': r1(h * 0.05), opacity: 0.55 });
  s += path(`M${r1(x - w * 0.12)},${r1(y)} L${r1(x - w * 0.04)},${r1(top + h * 0.42)} L${r1(x + w * 0.06)},${r1(top + h * 0.42)} L${r1(x + w * 0.14)},${r1(y)}Z`, { fill: open });
  return s;
}
// The Ka'bah in gentle two-point perspective. (x, y) = bottom of front corner.
export function kaaba(x, y, { s = 1, band = C.gold2, cloth = '#1C1A22', clothSide = '#2C2934', door = C.gold3, glowId } = {}) {
  const parts = [];
  if (glowId) parts.push(circle(0, -90, 230, { fill: `url(#${glowId})` }));
  // left face (lit) and right face
  parts.push(path('M-120,-28 L-120,-178 L0,-196 L0,0Z', { fill: clothSide }));
  parts.push(path('M0,0 L0,-196 L132,-176 L132,-30Z', { fill: cloth }));
  parts.push(path('M-120,-178 L0,-196 L132,-176 L10,-160Z', { fill: '#3A3644' }));
  // gold band
  parts.push(path('M-120,-142 L0,-158 L0,-138 L-120,-123Z', { fill: band }));
  parts.push(path('M0,-158 L132,-140 L132,-121 L0,-138Z', { fill: mix(band, '#000000', 0.12) }));
  // calligraphy hints in the band
  for (let i = 0; i < 6; i++) parts.push(rect(-110 + i * 18, -141 + i * 2.2, 10, 3, { fill: mix(band, '#000000', 0.35), opacity: 0.7, transform: `skewY(-7.5)` }));
  // door on the right-hand face
  parts.push(path('M44,-24 L44,-112 L86,-106 L86,-20Z', { fill: door }));
  parts.push(path('M48,-28 L48,-106 L82,-101 L82,-24Z', { fill: mix(door, '#000000', 0.2), opacity: 0.6 }));
  parts.push(path('M58,-30 L58,-98 M70,-28 L70,-96', { stroke: band, 'stroke-width': 2, opacity: 0.7 }));
  // marble base
  parts.push(path('M-126,-24 L0,4 L138,-26 L138,-18 L0,12 L-126,-16Z', { fill: C.stone0 }));
  return g({ transform: T(x, y, s) }, parts);
}

// ---------------------------------------------------------------- lights
// Hanging lantern (fanous). (x, y) = top hook.
export function lantern(x, y, { s = 1, metal = C.gold3, glass = C.gold1, glowId, chain = 60 } = {}) {
  const parts = [];
  if (chain) parts.push(path(`M0,${-chain} L0,0`, { stroke: metal, 'stroke-width': 3 }));
  if (glowId) parts.push(circle(0, 60, 110, { fill: `url(#${glowId})` }));
  parts.push(circle(0, 2, 7, { fill: 'none', stroke: metal, 'stroke-width': 3 }));
  parts.push(path('M-14,8 L14,8 L22,24 L-22,24Z', { fill: metal }));
  parts.push(path('M-26,24 L26,24 L30,90 L0,108 L-30,90Z', { fill: glass }));
  parts.push(path('M-10,24 L-12,94 M10,24 L12,94', { stroke: metal, 'stroke-width': 3 }));
  parts.push(path('M-30,90 L30,90 L0,108Z', { fill: metal, opacity: 0.85 }));
  parts.push(path('M-30,56 L30,56', { stroke: metal, 'stroke-width': 3 }));
  parts.push(path('M0,108 L0,124', { stroke: metal, 'stroke-width': 3 }));
  parts.push(circle(0, 126, 5, { fill: metal }));
  parts.push(ellipse(-12, 40, 4, 10, { fill: C.white, opacity: 0.6 }));
  return g({ transform: T(x, y, s) }, parts);
}

// ---------------------------------------------------------------- finishing
// Soft vignette that darkens the corners a touch (needs vignetteDef in defs).
export const vignetteDef = (id, color = C.ink, op = 0.22) => radial(id, [[0.55, color, 0], [1, color, op]], { r: 0.75 });
export const vignette = (id) => rect(0, 0, 1000, 1000, { fill: `url(#${id})` });
// Soft contact shadow under something standing on the ground.
export const shadow = (x, y, w, op = 0.14, color = C.ink) => ellipse(x, y, w / 2, w * 0.09, { fill: color, opacity: op });
// Fan of soft light beams from (x, y) pointing toward angle `dir` (degrees).
export function rays(x, y, { n = 7, len = 700, spread = 70, dir = 90, width = 6, color = C.gold0, op = 0.16 } = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = ((dir - spread / 2 + (spread * i) / Math.max(1, n - 1)) * Math.PI) / 180;
    const w = (width * Math.PI) / 180;
    s += poly([[x, y], [x + Math.cos(a - w / 2) * len, y + Math.sin(a - w / 2) * len], [x + Math.cos(a + w / 2) * len, y + Math.sin(a + w / 2) * len]], { fill: color, opacity: op });
  }
  return s;
}
// Horizontal shimmer dashes on water.
export function shimmer(x, y, { n = 6, w = 120, gap = 16, color = C.white, op = 0.55, seed = 8 } = {}) {
  const R = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const ww = w * (1 - i / n) * R.range(0.6, 1);
    const yy = y + i * gap;
    const xx = x + R.range(-0.15, 0.15) * w;
    s += path(`M${r1(xx - ww / 2)},${r1(yy)} L${r1(xx + ww / 2)},${r1(yy)}`, { stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: op * (1 - i / (n + 2)) });
  }
  return s;
}
