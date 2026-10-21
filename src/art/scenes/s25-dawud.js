// Dawud and the singing mountains (Quran 21:79-80, 34:10-11, 38:17-19).
// Majestic mountains at sunrise; flocks of birds circle in harmony,
// glorifying Allah together with Dawud. Ribbons of soft light and sparkles
// weave between the mountains and the birds. In front, on a rock, a softly
// glowing scroll (the Zabur) and a neatly folded coat of chain mail - iron
// made soft for him. No people, no musical instruments.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth, blob,
  sparkle, cloud, farBird, flyingBird, bird, grass, flower, cypress, r1, eye, T,
} from '../lib.js';

// A ribbon of light: a soft tapered band along a smooth curve.
function ribbon(pts, { w = 26, fill, op = 1 } = {}) {
  // sample the Catmull-Rom curve, offset both sides by a tapered width
  const samples = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    for (let k = 0; k < 10; k++) {
      const t = k / 10;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      samples.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  samples.push(pts[pts.length - 1]);
  const n = samples.length;
  const L = [];
  const Rr = [];
  for (let i = 0; i < n; i++) {
    const a = samples[Math.max(0, i - 1)];
    const b = samples[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const u = i / (n - 1);
    const ww = w * Math.sin(Math.PI * u) ** 0.7 * (0.75 + 0.25 * Math.sin(u * Math.PI * 5));
    L.push([samples[i][0] - (dy / len) * ww, samples[i][1] + (dx / len) * ww]);
    Rr.push([samples[i][0] + (dy / len) * ww * 0.35, samples[i][1] - (dx / len) * ww * 0.35]);
  }
  const d = 'M' + L.map((p) => p.map(r1).join(',')).join(' L') + ' L' + Rr.reverse().map((p) => p.map(r1).join(',')).join(' L') + 'Z';
  return path(d, { fill, opacity: op });
}

// The Zabur: a softly glowing scroll lying on the rock, partly unrolled
// toward us. (x, y) = centre of the roll.
function scroll(x, y, s = 1) {
  const paper = '#FFF6E0';
  const shade = '#EBD3A6';
  const wood = '#A8713F';
  const kids = [
    ellipse(0, 70, 140, 12, { fill: C.ink, opacity: 0.18 }),
    // the unrolled sheet, curling over the front edge of the rock
    path('M-92,10 L92,10 L104,62 C70,58 -70,58 -104,62Z', { fill: paper }),
    path('M-104,62 C-70,58 70,58 104,62 C108,70 104,78 96,80 C60,74 -60,74 -96,80 C-104,78 -108,70 -104,62Z', { fill: shade }),
    ...[[24, 0.92], [36, 0.96], [48, 1]].map(([yy, k]) => path(`M${-72 * k},${yy} L${72 * k},${yy}`, { stroke: '#D9B27A', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-dasharray': '18 7 26 7 12 7', opacity: 0.85 })),
    // the roll itself
    rect(-108, -24, 216, 46, { rx: 23, fill: paper }),
    rect(-104, 4, 208, 16, { rx: 8, fill: shade, opacity: 0.8 }),
    rect(-96, -18, 192, 9, { rx: 4.5, fill: C.white, opacity: 0.85 }),
  ];
  for (const side of [-1, 1]) {
    kids.push(ellipse(side * 108, -1, 12, 23, { fill: '#F4E2BC' }));
    kids.push(path(`M${side * 108},-14 a7,13 0 1 ${side > 0 ? 1 : 0} 0,26 a4,8 0 1 ${side > 0 ? 1 : 0} 0,-16`, { fill: 'none', stroke: '#D9B27A', 'stroke-width': 2, opacity: 0.9 }));
    kids.push(rect(side > 0 ? 116 : -132, -7, 16, 14, { rx: 6, fill: wood }));
    kids.push(circle(side * 134, 0, 9, { fill: C.gold3 }), circle(side * 134 - 2.5, -2.5, 3, { fill: C.gold0 }));
  }
  return g({ transform: T(x, y, s) }, kids);
}

// A neatly folded coat of chain mail: a folded shirt of tiny iron rings,
// sleeves tucked across the front, a round collar. (x, y) = bottom centre.
function chainMail(x, y, id, s = 1) {
  const W = 176;
  const top = -104;
  const outline = `M${-W / 2 + 10},0 L${-W / 2},${top + 26} C${-W / 2 + 2},${top + 8} ${-W / 2 + 12},${top} ${-W / 2 + 30},${top} L${W / 2 - 30},${top} C${W / 2 - 12},${top} ${W / 2 - 2},${top + 8} ${W / 2},${top + 26} L${W / 2 - 10},0Z`;
  const rings = (x0, y0, w, h, light) => {
    const out = [];
    for (let yy = y0; yy < y0 + h; yy += 7) {
      for (let xx = x0 + ((yy - y0) / 7 % 2 ? 3.5 : 0); xx < x0 + w; xx += 7) out.push(circle(xx, yy, 3.1, { fill: 'none', stroke: light, 'stroke-width': 1.6 }));
    }
    return out;
  };
  const clip = `<clipPath id="${id('mail')}"><path d="${outline}"/></clipPath>`;
  const sleeveL = `M${-W / 2},${top + 26} L${-W / 2 + 26},${top + 12} L${10},${top + 76} L${-14},${top + 90}Z`;
  const sleeveR = `M${W / 2},${top + 26} L${W / 2 - 26},${top + 12} L${-10},${top + 76} L${14},${top + 90}Z`;
  return {
    clip,
    svg: g({ transform: T(x, y, s) },
      ellipse(0, 4, W * 0.6, 10, { fill: C.ink, opacity: 0.22 }),
      // the folded layers seen at the front edge
      path(`M${-W / 2 + 10},0 L${W / 2 - 10},0 L${W / 2 - 12},12 L${-W / 2 + 12},12Z`, { fill: '#5E6A80' }),
      path(`M${-W / 2 + 12},6 L${W / 2 - 12},6`, { stroke: '#9AA6B8', 'stroke-width': 2, opacity: 0.8 }),
      path(outline, { fill: '#8C98AC' }),
      g({ 'clip-path': `url(#${id('mail')})` },
        ...rings(-W / 2, top + 2, W, 110, '#C3CCDA'),
        // sleeves folded across the front
        path(sleeveL, { fill: '#7D899E' }), path(sleeveR, { fill: '#7D899E' }),
        g({ 'clip-path': `url(#${id('mail')})` }, ...[sleeveL, sleeveR].map((d) => path(d, { fill: 'none', stroke: '#C3CCDA', 'stroke-width': 1.6, 'stroke-dasharray': '3 4', opacity: 0.9 }))),
        path(sleeveL, { fill: 'none', stroke: '#5E6A80', 'stroke-width': 2.4, opacity: 0.7 }),
        path(sleeveR, { fill: 'none', stroke: '#5E6A80', 'stroke-width': 2.4, opacity: 0.7 }),
        // round collar
        path(`M-30,${top} C-28,${top + 22} 28,${top + 22} 30,${top}Z`, { fill: '#56627A' }),
        path(`M-30,${top} C-28,${top + 22} 28,${top + 22} 30,${top}`, { fill: 'none', stroke: '#DDE4EE', 'stroke-width': 3 }),
        // polished sheen
        path(`M${-W / 2},${top + 30} C-30,${top + 18} 30,${top + 18} ${W / 2},${top + 30} L${W / 2},${top + 44} C30,${top + 32} -30,${top + 32} ${-W / 2},${top + 44}Z`, { fill: C.white, opacity: 0.22 }),
      ),
      path(`M${-W / 2 + 30},${top} L-30,${top} M30,${top} L${W / 2 - 30},${top}`, { stroke: '#EEF2F8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 }),
    ),
  };
}

// Little songbird singing (beak open). (x, y) = feet.
function singer(x, y, { s = 1, flip = false, body = C.coral2, wing = C.coral3, belly = C.coral0 } = {}) {
  return g({ transform: T(x, y, s, 0, flip) },
    bird(0, 0, { body, wing, belly }),
    path('M38,-55 L54,-56 L40,-50Z', { fill: C.gold2 }),
    path('M40,-48 L54,-42 L38,-44Z', { fill: C.gold3 }),
    path('M58,-62 q6,-4 10,0 M60,-70 q8,-6 14,0', { fill: 'none', stroke: C.gold1, 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0.9 }),
  );
}

export default function render() {
  const id = ids('s25');
  const R = rng(25);
  const SX = 520;
  const SY = 452;
  const defs = [
    linear(id('sky'), [[0, '#9A86C8'], [0.25, '#C9A9D8'], [0.48, '#F2BCC4'], [0.68, '#FFD4AE'], [1, '#FFE8C2']], { x2: 0, y2: 560, units: 'userSpaceOnUse' }),
    glowDef(id('sunGlow'), '#FFF1CE', 0.95),
    radial(id('beam'), [[0, '#FFF3D6', 0.42], [0.6, '#FFF0D0', 0.12], [1, '#FFF0D0', 0]], { cx: SX, cy: SY, r: 560, units: 'userSpaceOnUse' }),
    linear(id('ribbonA'), [[0, '#FFF3D0', 0], [0.2, '#FFF3D0', 0.85], [0.6, '#FFE3A6', 0.75], [1, '#FFE3A6', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    linear(id('ribbonB'), [[0, '#FFFFFF', 0], [0.3, '#FFF8EA', 0.8], [0.75, '#FBE3F0', 0.7], [1, '#FBE3F0', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    linear(id('mtn'), [[0, '#C095BC'], [0.45, '#9E80B4'], [1, '#8470A8']], { y1: 160, x2: 0, y2: 760, units: 'userSpaceOnUse' }),
    linear(id('mist'), [[0, '#FBE2E4', 0], [0.5, '#FBE2E4', 0.75], [1, '#FBE2E4', 0]], { x2: 0, y2: 1 }),
    radial(id('dawnLight'), [[0, '#FFD3BC', 0.9], [0.35, '#F2AFBC', 0.5], [0.7, '#C99AC4', 0.15], [1, '#C99AC4', 0]], { cx: 520, cy: 452, r: 470, units: 'userSpaceOnUse' }),
    radial(id('scrollGlow'), [[0, '#FFF6D8', 0.9], [0.45, '#FFEFC4', 0.45], [1, '#FFEFC4', 0]]),
    linear(id('rockTop'), [[0, '#C9A4B0'], [1, '#9E7F97']], { x2: 0, y2: 1 }),
    vignetteDef(id('vig'), C.ink, 0.2),
  ];

  const hazeA = (c) => mix(c, '#F4C6C4', 0.55);
  const hazeB = (c) => mix(c, '#E9B8C4', 0.28);
  let body = '';
  // ---- dawn sky and the rising sun
  body += rect(0, 0, 1000, 700, { fill: `url(#${id('sky')})` });
  for (let i = 0; i < 9; i++) {
    const a = ((-168 + i * 19.5) * Math.PI) / 180;
    const w = 0.055;
    body += path(`M${SX},${SY} L${r1(SX + Math.cos(a - w) * 640)},${r1(SY + Math.sin(a - w) * 640)} L${r1(SX + Math.cos(a + w) * 640)},${r1(SY + Math.sin(a + w) * 640)}Z`, { fill: `url(#${id('beam')})` });
  }
  body += circle(SX, SY, 250, { fill: `url(#${id('sunGlow')})` });
  body += circle(SX, SY, 66, { fill: '#FFE3A8', opacity: 0.5 }) + circle(SX, SY, 56, { fill: '#FFEDC0' }) + circle(SX - 10, SY - 10, 36, { fill: '#FFFAE8', opacity: 0.85 });
  body += cloud(160, 210, 170, { fill: '#FCE3E6', shade: '#EFC3D0', seed: 4, opacity: 0.85 });
  body += cloud(880, 150, 150, { fill: '#FCE3E6', shade: '#EFC3D0', seed: 10, opacity: 0.8 });
  for (const [sx, sy, ss] of [[80, 80, 8], [930, 60, 7], [700, 70, 6], [300, 60, 6]]) body += sparkle(sx, sy, ss, C.white, { opacity: 0.75 });

  // ---- far range, hazy rose
  body += path(ridge([[-20, 560], [80, 520], [170, 540], [260, 500], [360, 532], [440, 512], [520, 548], [610, 508], [700, 530], [800, 494], [900, 524], [1020, 500]], 760), { fill: hazeA(C.plum2) });

  // ---- the great mountain range, backlit by the sunrise rising in its saddle
  const range = [[-30, 640], [40, 480], [110, 370], [170, 282], [214, 224], [250, 184], [282, 172], [316, 196], [352, 246], [394, 316], [440, 388], [484, 440], [520, 462], [558, 446], [606, 394], [654, 334], [700, 272], [742, 226], [778, 204], [808, 210], [846, 250], [892, 298], [944, 354], [1030, 420]];
  body += path(ridge(range, 760), { fill: `url(#${id('mtn')})` });
  body += path(ridge(range, 760), { fill: `url(#${id('dawnLight')})` });
  // lesser peaks on the shoulders give the range its grandeur
  body += path(ridge([[-30, 600], [30, 520], [80, 420], [122, 352], [148, 334], [172, 352], [212, 420], [256, 510], [300, 600], [330, 660]], 700), { fill: '#957BB0' });
  body += path('M122,352 C136,334 150,330 164,346 C176,362 186,384 196,410 C180,392 160,380 140,378Z', { fill: '#F2C2C6', opacity: 0.45 });
  body += path(ridge([[700, 660], [740, 590], [790, 500], [846, 410], [890, 344], [912, 330], [934, 346], [970, 400], [1000, 450], [1030, 490]], 700), { fill: '#957BB0' });
  body += path('M890,342 C904,328 918,328 930,344 C916,348 904,360 894,376 C886,366 878,360 870,364Z', { fill: '#F2C2C6', opacity: 0.45 });
  // snow-light on the two summits, rosy with the dawn
  body += path('M246,190 C258,178 270,170 282,172 C298,174 310,186 318,198 C308,202 300,212 292,216 C286,206 278,214 270,224 C264,210 256,216 246,224 C240,210 242,198 246,190Z', { fill: '#FFF1EE' });
  body += path('M740,228 C752,214 764,206 778,204 C792,204 802,208 810,214 C800,222 794,228 788,238 C780,228 774,234 766,242 C760,232 752,234 744,242 C740,236 738,232 740,228Z', { fill: '#FFF1EE' });
  // bright rims where the first light grazes the ridges
  body += path(smooth(range.slice(7, 17)), { fill: 'none', stroke: '#FFE9CC', 'stroke-width': 4.5, 'stroke-linecap': 'round', opacity: 0.85 });
  body += path(smooth(range.slice(3, 7)), { fill: 'none', stroke: '#FFE9CC', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 });
  body += path(smooth(range.slice(17, 21)), { fill: 'none', stroke: '#FFE9CC', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 });
  // soft gullies and shoulders
  for (const d of ['M214,226 C196,300 182,380 166,470', 'M150,330 C134,400 118,470 98,540', 'M846,252 C860,330 872,400 884,480', 'M904,320 C918,390 934,450 954,520']) {
    body += path(d, { fill: 'none', stroke: '#7C6AA6', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.4 });
  }

  // ---- ribbons of light weaving through the mountains and the birds
  const rA = [[-40, 560], [110, 480], [260, 430], [420, 392], [560, 370], [700, 312], [860, 262], [1060, 214]];
  const rB = [[-40, 330], [120, 372], [300, 346], [470, 276], [640, 256], [820, 318], [1060, 352]];
  body += ribbon(rA, { w: 11, fill: `url(#${id('ribbonA')})`, op: 0.95 });
  body += ribbon(rB, { w: 8, fill: `url(#${id('ribbonB')})`, op: 0.9 });
  for (const [x, y] of [...rA.slice(1, -1), ...rB.slice(1, -1)].filter((_, i) => i % 2 === 0)) body += sparkle(x + 14, y - 14, 6, '#FFF9EC', { opacity: 0.9 });

  // ---- flocks of birds circling in harmony
  const flock = (cx, cy, rx, ry, n, s, phase) => {
    let back = '';
    let front = '';
    back += ellipse(cx, cy, rx, ry, { fill: 'none', stroke: '#FFF6E6', 'stroke-width': 3, opacity: 0.32, 'stroke-dasharray': '4 16', 'stroke-linecap': 'round' });
    for (let i = 0; i < n; i++) {
      const a = phase + (Math.PI * 2 * i) / n;
      const x = cx + Math.cos(a) * rx;
      const y = cy + Math.sin(a) * ry;
      // all fly the same way round: direction of travel is the tangent
      const tx = -Math.sin(a) * rx;
      const ty = Math.cos(a) * ry;
      const right = tx > 0;
      const tilt = (Math.atan2(ty, Math.abs(tx)) * 180) / Math.PI;
      const depth = 0.86 + 0.14 * Math.sin(a);
      const b = g({ transform: `rotate(${r1(right ? tilt : -tilt)} ${r1(x)} ${r1(y)})` }, flyingBird(x, y, { s: s * depth, flip: !right, up: i % 2 === 0, body: '#FFFBF4', wing: '#F1DCD2' }));
      if (Math.sin(a) > 0) front += b;
      else back += b;
    }
    return [back, front];
  };
  const big = flock(520, 330, 236, 74, 12, 0.42, 0.25);
  const ringL = flock(272, 150, 92, 30, 7, 0.27, 0.5);
  const ringR = flock(782, 176, 92, 30, 7, 0.27, 1.2);
  body += big[0] + ringL[0] + ringR[0];
  body += big[1] + ringL[1] + ringR[1];
  for (const [bx, by, bs] of [[620, 90, 0.8], [646, 80, 0.6], [400, 70, 0.7], [90, 260, 0.7], [950, 300, 0.7]]) body += farBird(bx, by, bs, '#8A6C98', 0.45);
  for (const [sx, sy, ss] of [[330, 400, 12], [640, 286, 11], [440, 240, 9], [740, 330, 10], [210, 470, 8], [900, 240, 9], [540, 170, 8], [120, 560, 9], [860, 470, 8]]) body += sparkle(sx, sy, ss, '#FFF8E6', { opacity: 0.95 });

  // ---- morning mist at the feet of the mountains, and wooded foothills
  body += rect(-20, 500, 1040, 150, { fill: `url(#${id('mist')})` });
  body += path(ridge([[-20, 640], [90, 600], [200, 616], [300, 590], [420, 622], [520, 604], [640, 626], [760, 596], [880, 614], [1020, 592]], 1000), { fill: '#B193B8' });
  {
    const TR = rng(251);
    for (let i = 0; i < 26; i++) {
      const tx = 20 + i * 38 + TR.range(-10, 10);
      const ty = 640 + TR.range(-14, 10);
      const tr = TR.range(12, 20);
      body += g({ fill: TR() < 0.5 ? '#8FA295' : '#9DAE9C' }, circle(tx, ty - tr * 0.6, tr * 0.75), circle(tx - tr * 0.5, ty - tr * 0.2, tr * 0.55), circle(tx + tr * 0.5, ty - tr * 0.25, tr * 0.55));
    }
  }

  // ---- near hills with slim cypress trees
  body += path(ridge([[-20, 700], [120, 668], [260, 684], [380, 660], [520, 694], [660, 670], [800, 686], [920, 658], [1020, 670]], 1000), { fill: '#A07FA2' });
  body += path(ridge([[-20, 760], [160, 740], [340, 756], [520, 736], [700, 758], [880, 740], [1020, 752]], 1000), { fill: '#86698F' });
  // first light catching the crests of the near hills
  body += path(smooth([[-20, 700], [120, 668], [260, 684], [380, 660], [520, 694], [660, 670], [800, 686], [920, 658], [1020, 670]]), { fill: 'none', stroke: '#FFD9C2', 'stroke-width': 4, opacity: 0.6, 'stroke-linecap': 'round' });
  body += path(smooth([[-20, 760], [160, 740], [340, 756], [520, 736], [700, 758], [880, 740], [1020, 752]]), { fill: 'none', stroke: '#F6C6BE', 'stroke-width': 3, opacity: 0.5, 'stroke-linecap': 'round' });
  for (const [cx, cy, ch] of [[70, 680, 116], [106, 688, 84], [906, 668, 124], [946, 676, 88], [614, 694, 64]]) body += cypress(cx, cy, { h: ch, w: ch * 0.26, fill: '#5E7A74', light: '#7C9A88' });
  {
    const FR = rng(252);
    const cols = ['#FFE3B0', '#F9C0C8', '#FFFFFF', '#F7B49A'];
    for (let i = 0; i < 44; i++) {
      const fx = FR() * 1000;
      const fy = 700 + FR() * 150;
      if (fx > 220 && fx < 820 && fy > 790) continue;
      body += flower(fx, fy, { r: 2.6 + ((fy - 700) / 150) * 3.4, fill: cols[i % cols.length], center: C.gold2, rot: FR() * 60 });
    }
    for (const [bx, by, bw] of [[180, 778, 70], [860, 772, 80], [520, 760, 50]]) body += g({ fill: '#7D8E8C' }, circle(bx - bw * 0.25, by - bw * 0.2, bw * 0.26), circle(bx + bw * 0.05, by - bw * 0.32, bw * 0.3), circle(bx + bw * 0.3, by - bw * 0.18, bw * 0.24)) + circle(bx - bw * 0.05, by - bw * 0.42, bw * 0.12, { fill: '#A7B8A8', opacity: 0.8 });
  }

  // ---- foreground: a rock bearing the glowing scroll and the folded mail
  body += path(ridge([[-20, 870], [200, 850], [420, 862], [640, 846], [860, 860], [1020, 852]], 1000), { fill: '#6E5A80' });
  body += ellipse(510, 952, 300, 26, { fill: C.ink, opacity: 0.25 });
  body += path(blob([[236, 950], [246, 882], [300, 838], [420, 818], [600, 816], [730, 828], [800, 866], [806, 930], [700, 962], [400, 966]]), { fill: '#8C7392' });
  body += path(blob([[262, 872], [312, 840], [420, 824], [600, 822], [726, 834], [784, 864], [700, 878], [500, 884], [330, 884]]), { fill: `url(#${id('rockTop')})` });
  body += path('M300,846 C360,830 440,824 520,824', { fill: 'none', stroke: '#F7DAD2', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 });
  body += path(blob([[420, 828], [560, 824], [700, 830], [760, 850], [640, 852], [480, 846]]), { fill: '#F2C6B8', opacity: 0.35 });
  body += path(blob([[540, 950], [600, 900], [700, 880], [796, 900], [800, 940], [700, 962]]), { fill: '#76607F', opacity: 0.6 });
  body += path('M250,900 C262,870 290,850 330,842 C300,862 280,884 270,914Z', { fill: '#C9A9BC', opacity: 0.4 });
  for (const [gx, gy, gh, sd] of [[248, 950, 30, 61], [300, 962, 22, 62], [790, 948, 28, 63], [740, 962, 20, 64]]) body += grass(gx, gy, { h: gh, fill: '#6E8F7E', n: 5, seed: sd });
  for (const [px, py, pw] of [[200, 970, 12], [850, 966, 10], [880, 980, 7]]) body += ellipse(px, py, pw, pw * 0.55, { fill: '#8C7392' }) + ellipse(px - pw * 0.3, py - pw * 0.2, pw * 0.4, pw * 0.2, { fill: '#E6C6D2', opacity: 0.6 });
  body += circle(400, 830, 190, { fill: `url(#${id('scrollGlow')})` });
  body += scroll(398, 838, 0.95);
  const mail = chainMail(650, 872, id, 0.92);
  defs.push(mail.clip);
  body += mail.svg;
  for (const [sx, sy, ss] of [[270, 770, 10], [500, 744, 12], [400, 720, 8], [560, 800, 7], [230, 820, 6]]) body += sparkle(sx, sy, ss, '#FFF6DC', { opacity: 0.95 });
  // two little birds perched on the rock, singing along
  body += singer(790, 872, { s: 0.6, flip: true });
  body += singer(244, 900, { s: 0.54, body: C.sky0, wing: '#4F98BC', belly: C.sky2 });

  // ---- framing flowers and grasses
  for (const [gx, gh, sd] of [[20, 120, 1], [70, 86, 2], [130, 60, 3], [880, 70, 4], [940, 110, 5], [990, 90, 6]]) body += grass(gx, 1006, { h: gh, fill: '#4E6F6A', n: 6, seed: sd, spread: 1.3 });
  for (const [fx, fy, fc] of [[60, 940, C.rose1], [130, 970, C.gold1], [30, 900, C.dusk3], [920, 930, C.rose1], [970, 900, C.gold1], [870, 975, C.dusk3]]) body += flower(fx, fy, { r: 12, fill: fc, center: C.gold2, stemH: 36, stem: '#4E6F6A' });

  body += vignette(id('vig'));
  return svgDoc({ defs: defs.join(''), body });
}
