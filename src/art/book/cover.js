// Front cover: a storybook lies open under a crescent moon, and the stories
// rise out of its pages — Nuh's ark on the sea, a palm oasis, a camel and
// her baby on the dunes, birds flying up into the night.
import {
  C, svgDoc, ids, rng, mix, linear, radial, glowDef, glow, vignetteDef, vignette, rect, path, circle, ellipse, g, ridge, smooth,
  sparkle, starField, crescent, palm, camel, flyingBird, foam, shimmer, star8, r1,
} from '../lib.js';

function ark(x, y, s = 1) {
  const parts = [
    // hull
    path('M-170,-40 L170,-40 C160,10 120,44 60,50 L-60,50 C-120,44 -160,10 -170,-40Z', { fill: C.wood2 }),
    path('M-170,-40 L170,-40 C166,-22 158,-6 146,8 L-146,8 C-158,-6 -166,-22 -170,-40Z', { fill: C.wood1 }),
    path('M-140,22 L140,22 M-110,38 L110,38', { stroke: C.wood3, 'stroke-width': 3, opacity: 0.5 }),
    ...[-120, -60, 0, 60, 120].map((px) => circle(px, -16, 3.2, { fill: C.wood3, opacity: 0.7 })),
    // cabin
    path('M-110,-40 L-110,-112 L110,-112 L110,-40Z', { fill: C.wood0 }),
    path('M40,-40 L40,-112 L110,-112 L110,-40Z', { fill: C.wood1, opacity: 0.55 }),
    path('M-128,-108 L0,-160 L128,-108Z', { fill: C.coral3 }),
    path('M0,-160 L128,-108 L40,-108Z', { fill: mix(C.coral3, '#000000', 0.18) }),
    // windows with friendly animals peeking out
    ...[-72, -8, 56].map((wx) => rect(wx - 22, -96, 44, 38, { rx: 18, fill: C.wood4 })),
    // giraffe pair on deck
    path('M-150,-40 L-148,-150 L-132,-150 L-134,-40Z', { fill: C.gold2 }),
    path('M-160,-40 L-156,-128 L-142,-128 L-146,-40Z', { fill: C.gold3 }),
    ellipse(-136, -158, 16, 11, { fill: C.gold2 }), ellipse(-148, -136, 14, 10, { fill: C.gold3 }),
    circle(-130, -160, 2.6, { fill: C.ink }), circle(-143, -138, 2.4, { fill: C.ink }),
    path('M-140,-168 L-142,-178 M-132,-168 L-130,-178', { stroke: C.gold4, 'stroke-width': 3, 'stroke-linecap': 'round' }),
    ...[[-146, -120], [-144, -96], [-140, -70]].map(([a, b]) => circle(a, b, 4, { fill: C.gold4, opacity: 0.6 })),
    // little lion in the middle window
    circle(-8, -76, 15, { fill: C.gold3 }), circle(-8, -74, 10, { fill: C.gold1 }), circle(-12, -76, 1.8, { fill: C.ink }), circle(-4, -76, 1.8, { fill: C.ink }),
    // elephant in the right window (trunk curling out)
    circle(56, -74, 14, { fill: C.stone1 }), path('M64,-70 C80,-66 82,-52 74,-48', { fill: 'none', stroke: C.stone1, 'stroke-width': 7, 'stroke-linecap': 'round' }),
    circle(52, -78, 1.8, { fill: C.ink }),
    // bunny ears in the left window
    ellipse(-78, -84, 4, 12, { fill: C.wool0 }), ellipse(-68, -84, 4, 12, { fill: C.wool0 }), circle(-72, -68, 10, { fill: C.wool0 }),
    circle(-75, -69, 1.6, { fill: C.ink }), circle(-69, -69, 1.6, { fill: C.ink }),
    // pair of birds on the roof
    circle(16, -162, 9, { fill: C.water1 }), path('M24,-164 L32,-162 L24,-159Z', { fill: C.gold2 }), circle(19, -165, 1.7, { fill: C.ink }),
    circle(40, -152, 8, { fill: C.coral1 }), path('M47,-154 L54,-152 L47,-149Z', { fill: C.gold2 }), circle(42, -155, 1.6, { fill: C.ink }),
  ];
  return g({ transform: `translate(${x} ${y}) scale(${s})` }, parts);
}

function openBook() {
  const pageL = 'M30,925 C150,866 330,860 500,900 L500,1010 L30,1010Z';
  const pageR = 'M970,925 C850,866 670,860 500,900 L500,1010 L970,1010Z';
  let s = '';
  // page stack edges
  s += path('M24,940 C150,882 330,876 500,914 C670,876 850,882 976,940 L976,1010 L24,1010Z', { fill: C.wool2 });
  s += path('M18,952 C150,894 330,888 500,926 C670,888 850,894 982,952 L982,1010 L18,1010Z', { fill: C.coral3 });
  s += path(pageL, { fill: '#FFF6E6' }) + path(pageR, { fill: '#FFF6E6' });
  // soft gutter shadow and page lines
  s += path('M470,900 C485,902 495,904 500,906 L500,1010 L470,1010Z', { fill: C.sand2, opacity: 0.45 });
  s += path('M530,900 C515,902 505,904 500,906 L500,1010 L530,1010Z', { fill: C.sand2, opacity: 0.45 });
  for (let i = 0; i < 4; i++) {
    const y = 940 + i * 16;
    s += path(`M${110 + i * 6},${y + 4} C230,${y - 24} 340,${y - 26} 440,${y - 4}`, { fill: 'none', stroke: C.sand2, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55 });
    s += path(`M${890 - i * 6},${y + 4} C770,${y - 24} 660,${y - 26} 560,${y - 4}`, { fill: 'none', stroke: C.sand2, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55 });
  }
  return s;
}

export default function render() {
  const id = ids('cover');
  const R = rng(42);
  const defs = [
    linear(id('sky'), [[0, '#101B38'], [0.34, '#1D3266'], [0.58, '#4B4A8E'], [0.74, '#B88AB8'], [0.86, '#F2B9A6'], [1, '#FFD9A8']]),
    linear(id('sea'), [[0, '#4FA6B8'], [0.5, '#2D7F9B'], [1, '#1D5878']]),
    linear(id('dune'), [[0, '#F6D69C'], [1, '#E2A866']]),
    glowDef(id('moonGlow'), '#FFF2C6', 0.55),
    glowDef(id('bookGlow'), '#FFE9B0', 0.9),
    radial(id('horizon'), [[0, '#FFE2B8', 0.85], [1, '#FFE2B8', 0]], { cx: 0.5, cy: 0.5, r: 0.5 }),
    vignetteDef(id('vig'), '#0B1228', 0.3),
  ].join('');

  let b = '';
  b += rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  b += starField({ seed: 11, n: 110, area: [20, 10, 960, 620], twinkles: 16, avoid: [[845, 120, 120]] });
  for (const [x, y, r] of [[120, 120, 10], [930, 330, 8], [70, 420, 7], [300, 70, 6], [640, 60, 7]]) b += star8(x, y, r, C.gold1, { opacity: 0.9 });
  b += glow(845, 120, 230, id('moonGlow'));
  b += crescent(845, 120, 62, { fill: '#FFF0C8', angle: -30, thickness: 0.5 });

  // warm glow along the horizon behind the scene
  b += ellipse(500, 700, 620, 170, { fill: `url(#${id('horizon')})` });
  // far dunes and palms in hazy mauve
  const haze = (c, t = 0.55) => mix(c, '#C99AB4', t);
  b += path(ridge([[-20, 690], [140, 640], [300, 668], [470, 630], [640, 660], [820, 626], [1020, 650]], 1000), { fill: haze(C.sand3, 0.5) });
  for (const [px, ph, sd] of [[120, 120, 2], [175, 95, 3], [880, 130, 4], [935, 100, 5]]) {
    b += palm(px, 660, { h: ph, seed: sd, dates: false, trunk: haze(C.wood2), trunkDark: haze(C.wood3), leaf: haze(C.leaf3), leafMid: haze(C.leaf4), leafDark: haze(C.leaf5) });
  }

  // right: golden dunes with a camel and her baby
  b += path(ridge([[430, 760], [560, 700], [700, 690], [860, 712], [1020, 690]], 1000), { fill: `url(#${id('dune')})` });
  b += path(ridge([[560, 700], [640, 730], [760, 744], [900, 740], [1020, 724]], 1000), { fill: C.sand3, opacity: 0.45 });

  // left: the sea with the ark, meeting a sandy shore under the oasis
  b += path('M-20,770 C120,758 260,774 400,756 C470,748 520,752 560,760 L560,1000 L-20,1000Z', { fill: `url(#${id('sea')})` });
  b += shimmer(250, 790, { n: 6, w: 160, gap: 14, color: '#FFF0C8', op: 0.6, seed: 4 });
  b += path('M372,1000 C380,900 420,812 500,786 C560,768 640,764 720,776 C820,792 920,784 1020,772 L1020,1000Z', { fill: '#F3D7A0' });
  b += path('M372,1000 C380,900 420,812 500,786 C470,812 440,880 436,1000Z', { fill: C.sand2, opacity: 0.6 });
  b += path('M384,960 C392,880 430,818 498,792', { fill: 'none', stroke: C.white, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 });
  b += ellipse(520, 792, 132, 26, { fill: C.leaf4 });
  b += ellipse(510, 786, 110, 18, { fill: C.leaf3 });
  b += palm(470, 800, { h: 250, lean: -0.1, seed: 8 });
  b += palm(552, 804, { h: 200, lean: 0.14, seed: 9 });
  b += ellipse(790, 840, 130, 12, { fill: '#9A6935', opacity: 0.22 });
  b += camel(760, 836, { s: 0.78, body: C.sand4, dark: C.sand5, light: C.sand3 });
  b += camel(872, 842, { s: 0.42, body: C.sand3, dark: C.sand4, light: C.sand2 });
  b += ark(225, 800, 0.95);
  b += path('M-20,836 C80,822 180,838 300,820 C340,815 375,822 400,830 C392,880 386,940 384,1000 L-20,1000Z', { fill: '#2A7A96' });
  b += foam(830, { x0: -10, x1: 370, amp: 7, len: 120, phase: 30, color: C.white, width: 4, opacity: 0.55 });

  // the open book everything rises from
  b += glow(500, 900, 420, id('bookGlow'));
  b += openBook();

  // birds and sparkles rising out of the pages
  b += flyingBird(600, 560, { s: 0.9, body: C.cream, wing: C.wool1 });
  b += flyingBird(680, 610, { s: 0.65, body: C.coral0, wing: C.coral1, up: false });
  b += flyingBird(380, 590, { s: 0.7, flip: true, body: C.water0, wing: C.water1 });
  for (let i = 0; i < 26; i++) {
    const x = 330 + R() * 340;
    const y = 560 + R() * 320;
    b += R() < 0.5 ? sparkle(x, y, R.range(5, 11), '#FFF4D6', { opacity: R.range(0.6, 1) }) : circle(x, y, R.range(1.6, 3.2), { fill: '#FFF4D6', opacity: R.range(0.5, 0.9) });
  }
  b += vignette(id('vig'));
  return svgDoc({ defs, body: b });
}
