// Shu'ayb and the Honest Scales (Quran 7:85, 11:84-85, 26:176-183).
// A market in Madyan under leafy trees (the people of the wood, al-Aykah):
// a stall with a big balance scale hanging perfectly level - fruit on one
// pan, weights on the other - baskets of dates, grain, pomegranates and
// figs, measuring jars, colourful awnings and a camel. Warm and bright;
// the balanced scale is the focus.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, blob,
  sparkle, bird, grass, flower, T, r1,
} from '../lib.js';

const HAZE = '#F4E7C6';
const haze = (c, t = 0.5) => mix(c, HAZE, t);

// ---------------------------------------------------------------- helpers
// A cluster of leaves: shaded balls with a fringe of small leaves.
function foliage(cx, cy, r, { fill, dark, light, seed = 1, fringe = true }) {
  const R = rng(seed);
  const balls = [];
  for (let i = 0; i < 7; i++) {
    const a = (Math.PI * 2 * i) / 7 + R.range(-0.25, 0.25);
    balls.push([cx + Math.cos(a) * r * 0.52, cy + Math.sin(a) * r * 0.36, r * R.range(0.42, 0.56)]);
  }
  balls.push([cx, cy, r * 0.66]);
  let s = g({ fill: dark }, balls.map(([a, b, c]) => circle(a + r * 0.05, b + r * 0.08, c)));
  if (fringe) {
    let lv = '';
    for (let i = 0; i < 40; i++) {
      const a = (Math.PI * 2 * i) / 40 + R.range(-0.06, 0.06);
      const lx = cx + Math.cos(a) * r * 0.9;
      const ly = cy + Math.sin(a) * r * 0.74;
      lv += ellipse(lx, ly, r * 0.085, r * 0.04, { fill: R() < 0.5 ? fill : dark, transform: `rotate(${r1((a * 180) / Math.PI + R.range(-20, 20))} ${r1(lx)} ${r1(ly)})` });
    }
    s += lv;
  }
  s += g({ fill }, balls.map(([a, b, c]) => circle(a, b, c)));
  s += g({ fill: light, opacity: 0.8 }, balls.slice(3, 6).map(([a, b, c]) => circle(a - c * 0.3, b - c * 0.35, c * 0.42)));
  return s;
}

// A striped market awning with a scalloped edge and two poles.
// (x0..x1) span, top y0, bottom of the stripes y1.
function awning(clipId, x0, x1, y0, y1, { a, b, pole = C.wood2, poleDark = C.wood3, poleBottom = 760, n = 9 }) {
  const w = x1 - x0;
  const sw = w / n;
  // poles
  let s = rect(x0 + 22, y0, 16, poleBottom - y0, { rx: 6, fill: pole }) + rect(x1 - 38, y0, 16, poleBottom - y0, { rx: 6, fill: pole });
  s += rect(x0 + 32, y0, 6, poleBottom - y0, { rx: 3, fill: poleDark, opacity: 0.5 }) + rect(x1 - 28, y0, 6, poleBottom - y0, { rx: 3, fill: poleDark, opacity: 0.5 });
  // canopy: slanted top face and a hanging front with scallops
  const top = `M${r1(x0 + 30)},${r1(y0 - 50)} L${r1(x1 - 30)},${r1(y0 - 50)} L${r1(x1 + 14)},${r1(y0 + 6)} L${r1(x0 - 14)},${r1(y0 + 6)}Z`;
  s += `<clipPath id="${clipId}"><path d="${top}"/></clipPath>`;
  s += path(top, { fill: a });
  const stripes = [];
  for (let i = 0; i < n + 2; i += 2) {
    const xa = x0 - 14 + ((w + 28) * i) / n;
    const xb = x0 - 14 + ((w + 28) * (i + 1)) / n;
    const ta = x0 + 30 + ((w - 60) * i) / n;
    const tb = x0 + 30 + ((w - 60) * (i + 1)) / n;
    stripes.push(path(`M${r1(ta)},${r1(y0 - 50)} L${r1(tb)},${r1(y0 - 50)} L${r1(xb)},${r1(y0 + 6)} L${r1(xa)},${r1(y0 + 6)}Z`, { fill: b }));
  }
  s += g({ 'clip-path': `url(#${clipId})` }, stripes, rect(x0 - 20, y0 - 50, w + 40, 18, { fill: '#FFFFFF', opacity: 0.18 }));
  // front valance with scallops, alternating colours
  for (let i = 0; i < n; i++) {
    const xa = x0 - 14 + ((w + 28) * i) / n;
    const xb = x0 - 14 + ((w + 28) * (i + 1)) / n;
    const fill = i % 2 ? b : a;
    s += path(`M${r1(xa)},${r1(y0 + 4)} L${r1(xb)},${r1(y0 + 4)} L${r1(xb)},${r1(y1)} Q${r1((xa + xb) / 2)},${r1(y1 + sw * 0.55)} ${r1(xa)},${r1(y1)}Z`, { fill });
  }
  s += rect(x0 - 16, y0, w + 32, 9, { rx: 4, fill: mix(a, '#000000', 0.18) });
  return s;
}

// The balance scale. (x, y) = bottom of its base on the counter.
function balance(x, y, { glowId }) {
  const brass = '#E8B04A';
  const brassDark = '#B97E26';
  const brassLight = '#FBE29A';
  const p = [];
  if (glowId) p.push(circle(x, y - 190, 260, { fill: `url(#${glowId})` }));
  const beamY = y - 230;
  const half = 150;
  // chains (three per side) and pans
  const pan = (px, contents) => {
    const py = y - 92;
    let s2 = '';
    for (const dx of [-52, 0, 52]) s2 += path(`M${px},${beamY + 10} L${px + dx},${py}`, { stroke: brassDark, 'stroke-width': 2.4, opacity: 0.9 });
    s2 += circle(px, beamY + 12, 6, { fill: brassDark });
    // inside of the bowl, then what it holds, then the front of the bowl
    s2 += ellipse(px, py, 64, 9, { fill: '#C98E3A' });
    s2 += contents;
    s2 += path(`M${px - 64},${py} Q${px},${py + 46} ${px + 64},${py} A64,9 0 0 1 ${px - 64},${py}Z`, { fill: brass });
    s2 += path(`M${px + 10},${py + 22} Q${px + 44},${py + 18} ${px + 64},${py} A64,9 0 0 1 ${px + 20},${py + 8}Z`, { fill: brassDark, opacity: 0.4 });
    s2 += path(`M${px - 64},${py} A64,9 0 0 0 ${px + 64},${py}`, { fill: 'none', stroke: brassLight, 'stroke-width': 3.5 });
    s2 += path(`M${px - 56},${py + 10} Q${px - 34},${py + 26} ${px - 10},${py + 30}`, { fill: 'none', stroke: '#FFF4D2', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 });
    return s2;
  };
  // fruit: a heap of pomegranates
  const pome = (fx, fy, r) => circle(fx, fy, r, { fill: '#D9534A' }) + circle(fx + r * 0.25, fy + r * 0.2, r * 0.75, { fill: '#B83F3C', opacity: 0.5 }) +
    path(`M${fx - r * 0.3},${fy - r * 0.86} l${r * 0.15},${-r * 0.35} l${r * 0.15},${r * 0.22} l${r * 0.15},${-r * 0.22} l${r * 0.15},${r * 0.35}Z`, { fill: '#B83F3C' }) +
    circle(fx - r * 0.35, fy - r * 0.35, r * 0.22, { fill: '#FFD2C4', opacity: 0.7 });
  const fruit = pome(x - half - 30, y - 104, 20) + pome(x - half + 26, y - 104, 20) + pome(x - half, y - 108, 22) + pome(x - half - 12, y - 136, 19) + pome(x - half + 16, y - 134, 18);
  // weights: rounded brass bell weights with knobs
  const wt = (wx, wy, ww, wh) => {
    const d = `M${wx - ww / 2},${wy} L${wx - ww * 0.4},${wy - wh * 0.62} Q${wx - ww * 0.34},${wy - wh} ${wx},${wy - wh} Q${wx + ww * 0.34},${wy - wh} ${wx + ww * 0.4},${wy - wh * 0.62} L${wx + ww / 2},${wy}Z`;
    return path(d, { fill: '#D99A3E' }) +
      path(`M${wx + ww * 0.08},${wy - wh} Q${wx + ww * 0.34},${wy - wh} ${wx + ww * 0.4},${wy - wh * 0.62} L${wx + ww / 2},${wy} L${wx + ww * 0.14},${wy}Z`, { fill: brassDark, opacity: 0.45 }) +
      path(`M${wx - ww * 0.3},${wy - 4} L${wx - ww * 0.24},${wy - wh * 0.66}`, { stroke: brassLight, 'stroke-width': r1(ww * 0.1), 'stroke-linecap': 'round', opacity: 0.8 }) +
      ellipse(wx, wy, ww / 2, ww * 0.08, { fill: brassDark }) +
      circle(wx, wy - wh - ww * 0.12, ww * 0.14, { fill: '#D99A3E' }) + circle(wx - ww * 0.04, wy - wh - ww * 0.16, ww * 0.05, { fill: brassLight });
  };
  const weights = wt(x + half - 22, y - 96, 50, 44) + wt(x + half + 30, y - 96, 36, 30);
  // base and post
  p.push(ellipse(x, y, 74, 13, { fill: brassDark }));
  p.push(path(`M${x - 62},${y} L${x - 40},${y - 30} L${x + 40},${y - 30} L${x + 62},${y}Z`, { fill: brass }));
  p.push(path(`M${x + 8},${y} L${x + 14},${y - 30} L${x + 40},${y - 30} L${x + 62},${y}Z`, { fill: brassDark, opacity: 0.4 }));
  p.push(rect(x - 11, beamY - 6, 22, y - 30 - beamY + 6, { rx: 6, fill: brass }));
  p.push(rect(x + 2, beamY - 6, 9, y - 30 - beamY + 6, { rx: 4, fill: brassDark, opacity: 0.4 }));
  p.push(rect(x - 8, beamY, 5, y - 40 - beamY, { rx: 2.5, fill: brassLight, opacity: 0.7 }));
  for (const ry of [y - 48, y - 120, y - 180]) p.push(rect(x - 16, ry, 32, 9, { rx: 4.5, fill: brassDark }));
  // pans (behind the beam)
  p.push(pan(x - half, fruit));
  p.push(pan(x + half, weights));
  // the level beam with rounded ends
  p.push(rect(x - half - 14, beamY - 7, half * 2 + 28, 15, { rx: 7.5, fill: brass }));
  p.push(rect(x - half - 14, beamY - 7, half * 2 + 28, 5, { rx: 2.5, fill: brassLight, opacity: 0.8 }));
  p.push(circle(x - half - 14, beamY, 10, { fill: brass }), circle(x + half + 14, beamY, 10, { fill: brass }));
  // pivot and pointer standing straight up: perfectly level
  p.push(path(`M${x - 30},${beamY - 52} A30,30 0 0 1 ${x + 30},${beamY - 52}`, { fill: 'none', stroke: brassDark, 'stroke-width': 4, 'stroke-linecap': 'round' }));
  p.push(path(`M${x - 5},${beamY} L${x},${beamY - 70} L${x + 5},${beamY}Z`, { fill: brassDark }));
  p.push(circle(x, beamY, 14, { fill: brass }), circle(x, beamY, 6, { fill: brassDark }), circle(x - 4, beamY - 4, 4, { fill: brassLight }));
  p.push(circle(x, beamY - 74, 7, { fill: brass }));
  return p.join('');
}

// A woven basket heaped with produce. (x, y) = bottom centre.
function basket(clipId, x, y, w, { heap }) {
  const h = w * 0.5;
  const body = `M${r1(x - w / 2)},${r1(y - h)} L${r1(x + w / 2)},${r1(y - h)} L${r1(x + w * 0.4)},${r1(y - 6)} Q${r1(x)},${r1(y + 6)} ${r1(x - w * 0.4)},${r1(y - 6)}Z`;
  let s = heap;
  s += `<clipPath id="${clipId}"><path d="${body}"/></clipPath>`;
  s += path(body, { fill: '#D69A52' });
  const weave = [];
  for (let i = 1; i < 4; i++) weave.push(path(`M${r1(x - w / 2)},${r1(y - h + (h * i) / 4)} L${r1(x + w / 2)},${r1(y - h + (h * i) / 4)}`, { stroke: '#B57A3A', 'stroke-width': 3, opacity: 0.7 }));
  for (let i = -5; i <= 5; i++) weave.push(path(`M${r1(x + (i * w) / 11)},${r1(y - h)} L${r1(x + (i * w) / 13)},${r1(y)}`, { stroke: '#E9B572', 'stroke-width': 3, opacity: 0.7 }));
  weave.push(rect(x + w * 0.12, y - h, w * 0.4, h + 10, { fill: '#9C6430', opacity: 0.3 }));
  s += g({ 'clip-path': `url(#${clipId})` }, weave);
  s += rect(x - w / 2 - 5, y - h - 6, w + 10, 12, { rx: 6, fill: '#C4843F' });
  s += rect(x - w / 2 - 5, y - h - 6, w + 10, 4, { rx: 2, fill: '#E9B572', opacity: 0.8 });
  return s;
}
// Heaps of produce for the baskets. (x, y) = basket rim centre, w = rim width.
function heapOf(kind, x, y, w, seed) {
  const R = rng(seed);
  let s = '';
  const dome = (fill) => path(`M${r1(x - w / 2 + 4)},${r1(y)} Q${r1(x)},${r1(y - w * 0.5)} ${r1(x + w / 2 - 4)},${r1(y)}Z`, { fill });
  if (kind === 'grain') {
    s += dome('#F2C766');
    s += path(`M${r1(x + 4)},${r1(y - w * 0.22)} Q${r1(x + w * 0.3)},${r1(y - w * 0.12)} ${r1(x + w / 2 - 4)},${r1(y)} L${r1(x)},${r1(y)}Z`, { fill: '#DCA544', opacity: 0.6 });
    for (let i = 0; i < 18; i++) s += ellipse(x + R.range(-0.4, 0.4) * w, y - R.range(0.02, 0.2) * w, 2.6, 1.6, { fill: '#C98D32', opacity: 0.7 });
  } else if (kind === 'dates') {
    s += dome('#8E4E2A');
    for (let i = 0; i < 16; i++) {
      const dx = x + R.range(-0.38, 0.38) * w;
      const dy = y - R.range(0.02, 0.22) * w - (1 - Math.abs(dx - x) / (w / 2)) * w * 0.08;
      s += ellipse(dx, dy, 7, 10, { fill: R() < 0.5 ? '#A35A2E' : '#7A3E22', transform: `rotate(${r1(R.range(-60, 60))} ${r1(dx)} ${r1(dy)})` });
      s += ellipse(dx - 2, dy - 3, 2, 3, { fill: '#E8A36C', opacity: 0.6 });
    }
  } else if (kind === 'pomegranates') {
    s += dome('#B83F3C');
    for (const [dx, dy, rr] of [[-0.3, 0.06, 0.15], [0, 0.04, 0.16], [0.3, 0.06, 0.15], [-0.15, 0.2, 0.15], [0.15, 0.2, 0.15], [0, 0.32, 0.13]]) {
      const fx = x + dx * w;
      const fy = y - dy * w;
      const r = rr * w;
      s += circle(fx, fy, r, { fill: '#D9534A' }) + circle(fx + r * 0.25, fy + r * 0.2, r * 0.72, { fill: '#B83F3C', opacity: 0.45 }) + path(`M${r1(fx - r * 0.25)},${r1(fy - r * 0.86)} l${r1(r * 0.12)},${r1(-r * 0.3)} l${r1(r * 0.13)},${r1(r * 0.2)} l${r1(r * 0.13)},${r1(-r * 0.2)} l${r1(r * 0.12)},${r1(r * 0.3)}Z`, { fill: '#A8363A' }) + circle(fx - r * 0.35, fy - r * 0.35, r * 0.2, { fill: '#FFD2C4', opacity: 0.7 });
    }
  } else if (kind === 'figs') {
    s += dome('#6B4A72');
    for (const [dx, dy, rr] of [[-0.3, 0.05, 0.13], [-0.05, 0.04, 0.14], [0.22, 0.05, 0.13], [-0.18, 0.18, 0.13], [0.08, 0.2, 0.13], [0.32, 0.16, 0.11], [-0.04, 0.32, 0.12]]) {
      const fx = x + dx * w;
      const fy = y - dy * w;
      const r = rr * w;
      s += path(`M${r1(fx)},${r1(fy - r * 1.25)} C${r1(fx + r * 0.5)},${r1(fy - r * 0.9)} ${r1(fx + r)},${r1(fy - r * 0.2)} ${r1(fx + r)},${r1(fy + r * 0.2)} C${r1(fx + r)},${r1(fy + r)} ${r1(fx - r)},${r1(fy + r)} ${r1(fx - r)},${r1(fy + r * 0.2)} C${r1(fx - r)},${r1(fy - r * 0.2)} ${r1(fx - r * 0.5)},${r1(fy - r * 0.9)} ${r1(fx)},${r1(fy - r * 1.25)}Z`, { fill: R() < 0.5 ? '#7E5A8C' : '#8E6A9A' });
      s += ellipse(fx - r * 0.35, fy - r * 0.1, r * 0.2, r * 0.32, { fill: '#C6A7D2', opacity: 0.6 });
      s += path(`M${r1(fx)},${r1(fy - r * 1.25)} l1,-5`, { stroke: '#5D7A3E', 'stroke-width': 2.4, 'stroke-linecap': 'round' });
    }
  }
  return s;
}

// A clay measuring jar. (x, y) = bottom centre.
function jar(x, y, w, h, { fill = '#D2875A', dark = '#A9603E', light = '#EDB08A', handles = true } = {}) {
  const neck = w * 0.28;
  const d = `M${r1(x - w * 0.22)},${r1(y)} C${r1(x - w * 0.62)},${r1(y - h * 0.2)} ${r1(x - w * 0.6)},${r1(y - h * 0.72)} ${r1(x - neck)},${r1(y - h * 0.86)} L${r1(x - neck)},${r1(y - h)} L${r1(x + neck)},${r1(y - h)} L${r1(x + neck)},${r1(y - h * 0.86)} C${r1(x + w * 0.6)},${r1(y - h * 0.72)} ${r1(x + w * 0.62)},${r1(y - h * 0.2)} ${r1(x + w * 0.22)},${r1(y)}Z`;
  let s = '';
  if (handles) s += path(`M${r1(x - neck)},${r1(y - h * 0.9)} C${r1(x - w * 0.62)},${r1(y - h * 0.94)} ${r1(x - w * 0.62)},${r1(y - h * 0.64)} ${r1(x - w * 0.4)},${r1(y - h * 0.6)} M${r1(x + neck)},${r1(y - h * 0.9)} C${r1(x + w * 0.62)},${r1(y - h * 0.94)} ${r1(x + w * 0.62)},${r1(y - h * 0.64)} ${r1(x + w * 0.4)},${r1(y - h * 0.6)}`, { fill: 'none', stroke: dark, 'stroke-width': r1(w * 0.07), 'stroke-linecap': 'round' });
  s += path(d, { fill });
  s += path(`M${r1(x + w * 0.1)},${r1(y)} C${r1(x + w * 0.5)},${r1(y - h * 0.2)} ${r1(x + w * 0.55)},${r1(y - h * 0.62)} ${r1(x + neck)},${r1(y - h * 0.86)} L${r1(x + neck)},${r1(y - h * 0.9)} C${r1(x + w * 0.6)},${r1(y - h * 0.72)} ${r1(x + w * 0.62)},${r1(y - h * 0.2)} ${r1(x + w * 0.22)},${r1(y)}Z`, { fill: dark, opacity: 0.5 });
  s += ellipse(x - w * 0.24, y - h * 0.5, w * 0.08, h * 0.18, { fill: light, opacity: 0.7 });
  s += ellipse(x, y - h, neck + 4, 5, { fill: dark });
  s += path(`M${r1(x - w * 0.42)},${r1(y - h * 0.62)} Q${r1(x)},${r1(y - h * 0.56)} ${r1(x + w * 0.42)},${r1(y - h * 0.62)}`, { fill: 'none', stroke: light, 'stroke-width': 3, opacity: 0.6 });
  return s;
}

// A camel resting on the ground with its legs folded, facing RIGHT.
// (x, y) = ground under its middle. Head and face follow the kit camel.
function restingCamel(x, y, { s = 1, flip = false, body = C.sand3, dark = C.sand4, light = C.sand2, saddle = C.water3, trim = C.gold2 } = {}) {
  const p = [];
  p.push(ellipse(0, 4, 120, 12, { fill: '#8E6338', opacity: 0.25 }));
  // tail
  p.push(path('M-92,-50 Q-108,-34 -102,-14', { fill: 'none', stroke: dark, 'stroke-width': 6, 'stroke-linecap': 'round' }));
  // folded back leg, body and hump
  p.push(ellipse(-58, -8, 40, 14, { fill: dark }));
  p.push(path('M-96,-6 C-104,-46 -78,-84 -36,-88 C-24,-136 30,-138 42,-86 C74,-82 98,-52 94,-6Z', { fill: body }));
  p.push(path('M-36,-88 C-24,-136 30,-138 42,-86 C20,-100 -12,-100 -36,-88Z', { fill: light, opacity: 0.7 }));
  p.push(path('M-90,-20 C-50,-4 50,-4 92,-22 L94,-6 L-96,-6Z', { fill: dark, opacity: 0.45 }));
  // colourful saddle blanket with tassels
  p.push(path('M-30,-96 C-14,-118 22,-118 38,-96 L46,-50 L-38,-50Z', { fill: saddle }));
  p.push(path('M-38,-50 L46,-50 L46,-42 L-38,-42Z', { fill: trim }));
  for (let i = 0; i < 6; i++) p.push(circle(-32 + i * 15, -36, 3.6, { fill: trim }));
  p.push(path('M-24,-96 C-10,-110 18,-110 32,-96', { fill: 'none', stroke: trim, 'stroke-width': 4, 'stroke-linecap': 'round' }));
  // folded front legs
  p.push(ellipse(54, -8, 44, 13, { fill: body }));
  p.push(ellipse(84, -6, 14, 9, { fill: light }));
  p.push(ellipse(30, -4, 12, 6, { fill: dark }));
  // neck and head (the kit camel's head, lowered)
  p.push(path('M60,-70 C86,-82 94,-112 96,-142 L122,-142 C122,-100 110,-58 74,-44Z', { fill: body }));
  p.push(g({ transform: 'translate(0 80)' },
    path('M92,-236 C96,-252 120,-258 138,-250 C156,-244 170,-236 170,-222 C170,-210 160,-206 148,-208 C134,-210 124,-206 116,-204 C100,-204 88,-218 92,-236Z', { fill: body }),
    ellipse(106, -252, 7, 11, { fill: dark, transform: 'rotate(-30 106 -252)' }),
    ellipse(160, -216, 4, 3, { fill: dark }),
    path('M150,-208 Q158,-204 166,-208', { fill: 'none', stroke: dark, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    circle(128, -234, 5, { fill: C.ink }), circle(129.5, -235.6, 1.7, { fill: C.white }),
    ellipse(138, -220, 7, 4, { fill: C.cheek, opacity: 0.6 }),
  ));
  return g({ transform: T(x, y, s, 0, flip) }, p);
}

// A woven rug laid on the ground. (x, y) = centre.
function rug(clipId, x, y, w, h) {
  const d = `M${r1(x - w / 2 + 30)},${r1(y - h / 2)} L${r1(x + w / 2 - 30)},${r1(y - h / 2)} L${r1(x + w / 2)},${r1(y + h / 2)} L${r1(x - w / 2)},${r1(y + h / 2)}Z`;
  const bands = [];
  const cols = [C.coral3, C.gold2, C.coral3, C.water3, C.coral3];
  for (let i = 0; i < 5; i++) bands.push(rect(x - w / 2, y - h / 2 + (h * i) / 5, w, h / 5, { fill: cols[i] }));
  for (let i = 0; i < 9; i++) bands.push(path(`M${r1(x - w * 0.42 + i * w * 0.105)},${r1(y - 4)} l10,-8 l10,8 l-10,8Z`, { fill: C.cream, opacity: 0.85 }));
  let s = `<clipPath id="${clipId}"><path d="${d}"/></clipPath>` + g({ 'clip-path': `url(#${clipId})` }, bands);
  for (let i = 0; i < 16; i++) s += path(`M${r1(x - w / 2 + 8 + (i * (w - 16)) / 15)},${r1(y + h / 2)} l0,10`, { stroke: C.cream, 'stroke-width': 3, 'stroke-linecap': 'round' });
  return s;
}

// ---------------------------------------------------------------- scene
export default function render() {
  const id = ids('s17');
  const R = rng(1717);
  const defs = [
    linear(id('sky'), [[0, '#BFE3EE'], [0.6, '#F4EBCB'], [1, HAZE]]),
    linear(id('ground'), [[0, '#F2D7A0'], [1, '#E2B877']]),
    linear(id('counter'), [[0, '#C98D53'], [1, '#A56B38']]),
    glowDef(id('scaleGlow'), '#FFF4CF', 0.85),
    radial(id('sunPatch'), [[0, '#FFF6D8', 0.55], [1, '#FFF6D8', 0]]),
    vignetteDef(id('vig'), C.ink, 0.18),
  ].join('');

  let body = '';
  body += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });

  // ----- the wood: distant trunks and foliage, hazy
  for (const [tx, tw] of [[180, 30], [330, 24], [620, 26], [800, 32]]) body += rect(tx - tw / 2, 260, tw, 420, { rx: tw / 2, fill: haze(C.wood2, 0.55) });
  body += foliage(170, 250, 150, { fill: haze(C.leaf3, 0.5), dark: haze(C.leaf4, 0.5), light: haze(C.leaf2, 0.5), seed: 3, fringe: false });
  body += foliage(480, 210, 170, { fill: haze(C.leaf3, 0.5), dark: haze(C.leaf4, 0.5), light: haze(C.leaf2, 0.5), seed: 4, fringe: false });
  body += foliage(820, 240, 160, { fill: haze(C.leaf3, 0.5), dark: haze(C.leaf4, 0.5), light: haze(C.leaf2, 0.5), seed: 5, fringe: false });
  // distant stalls with their own awnings
  for (const [sx, ca, cb] of [[120, C.water2, C.cream], [880, C.gold2, C.cream]]) {
    body += rect(sx - 70, 560, 140, 90, { fill: haze(C.wood1, 0.45) });
    body += rect(sx - 70, 560, 140, 14, { fill: haze(C.wood2, 0.45) });
    for (let i = 0; i < 5; i++) body += path(`M${sx - 84 + i * 34},520 L${sx - 50 + i * 34},520 L${sx - 50 + i * 34},552 Q${sx - 67 + i * 34},566 ${sx - 84 + i * 34},552Z`, { fill: haze(i % 2 ? cb : ca, 0.4) });
    body += g({ fill: haze(C.coral2, 0.45) }, circle(sx - 40, 552, 12), circle(sx - 18, 548, 12), circle(sx + 28, 550, 13));
  }

  // ground with dappled sunlight
  body += path(ridge([[-20, 650], [200, 640], [500, 646], [800, 638], [1020, 646]]), { fill: `url(#${id('ground')})` });
  for (const [px, py, pw] of [[150, 700, 90], [430, 880, 120], [860, 700, 100], [700, 960, 90], [80, 900, 70]]) body += ellipse(px, py, pw, pw * 0.22, { fill: `url(#${id('sunPatch')})` });
  for (const [px, py, pw] of [[300, 690, 60], [620, 700, 70], [920, 860, 80], [160, 980, 70]]) body += ellipse(px, py, pw, pw * 0.18, { fill: '#B98C52', opacity: 0.18 });

  // ----- the main stall
  body += ellipse(500, 780, 330, 26, { fill: '#8E6338', opacity: 0.25 });
  // counter
  body += rect(220, 610, 560, 26, { rx: 8, fill: '#D9A469' });
  body += rect(220, 610, 560, 8, { rx: 4, fill: '#F1C690', opacity: 0.8 });
  body += rect(236, 636, 528, 140, { fill: `url(#${id('counter')})` });
  for (let i = 1; i < 6; i++) body += path(`M${236 + i * 88},640 L${236 + i * 88},776`, { stroke: '#8E5A2E', 'stroke-width': 3, opacity: 0.5 });
  body += path('M236,700 L764,700', { stroke: '#8E5A2E', 'stroke-width': 3, opacity: 0.35 });
  // the awning above
  body += awning(id('aw'), 196, 804, 330, 384, { a: C.coral2, b: C.cream, poleBottom: 780, n: 9 });
  // the scale, in a soft light
  body += balance(500, 612, { glowId: id('scaleGlow') });
  for (const [sx, sy, ss] of [[310, 410, 11], [690, 404, 12], [500, 300, 9], [372, 300, 7], [640, 296, 8]]) body += sparkle(sx, sy, ss, '#FFFFFF', { opacity: 0.95 });
  // a few things on the counter, kept clear of the scale
  body += jar(268, 612, 40, 54, { handles: false, fill: '#E2A06E', dark: '#B97650', light: '#F6C9A0' });
  body += g({}, ellipse(730, 604, 32, 8, { fill: '#9C6430' }), path('M698,604 Q730,560 762,604Z', { fill: '#A35A2E' }), circle(716, 592, 6, { fill: '#7A3E22' }), circle(732, 584, 6, { fill: '#8E4A28' }), circle(746, 594, 6, { fill: '#7A3E22' }));

  // ----- a rug and baskets in front of the stall
  body += rug(id('rug'), 500, 868, 590, 70);
  body += basket(id('k1'), 276, 860, 140, { heap: heapOf('dates', 276, 790, 140, 1) });
  body += basket(id('k2'), 432, 880, 144, { heap: heapOf('grain', 432, 808, 144, 2) });
  body += basket(id('k3'), 588, 872, 144, { heap: heapOf('pomegranates', 588, 800, 144, 3) });
  body += basket(id('k4'), 730, 852, 124, { heap: heapOf('figs', 730, 790, 124, 4) });

  // measuring jars by the left pole
  body += ellipse(130, 820, 90, 12, { fill: '#8E6338', opacity: 0.22 });
  body += jar(100, 820, 80, 130);
  body += jar(166, 826, 60, 92, { fill: '#C97B52', dark: '#9E5C3C' });
  body += jar(132, 852, 44, 60, { handles: false, fill: '#E2A06E', dark: '#B97650', light: '#F6C9A0' });

  // a camel resting by the stall
  body += restingCamel(906, 950, { s: 0.74, flip: true, saddle: C.water3 });

  // ----- leafy canopy in front, framing the top
  const lf = { fill: '#62B06C', dark: '#3F8E5E', light: '#A6D68A' };
  body += foliage(40, 60, 200, { ...lf, seed: 11 });
  body += foliage(300, -10, 170, { ...lf, seed: 12 });
  body += foliage(700, -20, 180, { ...lf, seed: 13 });
  body += foliage(960, 70, 200, { ...lf, seed: 14 });
  // little sprigs of leaves hanging from the canopy
  const sprig = (sx, sy, len, lean) => {
    let out = path(`M${sx},${sy} q${lean * 0.4},${len * 0.5} ${lean},${len}`, { fill: 'none', stroke: '#4F8E55', 'stroke-width': 2.6, 'stroke-linecap': 'round' });
    for (let k = 1; k <= 4; k++) {
      const t = k / 4.5;
      const px = sx + lean * t * t + lean * 0.4 * t * (1 - t) * 2;
      const py = sy + len * t;
      out += ellipse(px - 8, py, 10, 4.5, { fill: '#7BC27A', transform: `rotate(-30 ${r1(px - 8)} ${r1(py)})` });
      out += ellipse(px + 8, py + 4, 10, 4.5, { fill: '#62B06C', transform: `rotate(30 ${r1(px + 8)} ${r1(py + 4)})` });
    }
    return out + ellipse(sx + lean, sy + len + 6, 5, 9, { fill: '#7BC27A' });
  };
  body += sprig(186, 186, 90, 10) + sprig(232, 120, 70, -8) + sprig(820, 180, 96, -10) + sprig(770, 110, 64, 8) + sprig(560, 116, 54, 6);
  body += foliage(-10, 290, 100, { ...lf, seed: 15 });
  body += foliage(1010, 300, 100, { ...lf, seed: 16 });
  // two little birds on the awning
  body += bird(268, 280, { s: 0.42, body: C.gold2, wing: C.gold3, belly: C.gold0 });
  body += bird(742, 280, { s: 0.42, flip: true, body: C.sky0, wing: '#4C9CC0', belly: C.sky2 });

  // foreground: grass and flowers at the bottom corners
  for (const [gx, gh] of [[30, 60], [70, 44], [940, 56], [980, 70], [370, 40], [700, 36]]) body += grass(gx, 1000, { h: gh, fill: C.leaf4, n: 6, seed: gx });
  for (const [fx, fy, fc] of [[50, 960, C.coral1], [92, 975, C.gold1], [950, 965, C.rose1], [910, 980, C.white]]) body += flower(fx, fy, { r: 10, fill: fc, center: C.gold2 });

  body += vignette(id('vig'));
  return svgDoc({ defs, body });
}
