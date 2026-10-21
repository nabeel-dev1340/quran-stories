// Small vector ornaments used by the page layouts.
const r1 = (n) => Math.round(n * 100) / 100;

function starPoints(cx, cy, r, inner = 0.76, n = 8) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI / n) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * inner;
    pts.push(`${r1(cx + Math.cos(a) * rr)},${r1(cy + Math.sin(a) * rr)}`);
  }
  return pts.join(' ');
}

// Repeating geometric tile (two interlaced squares = the khatam star),
// returned as a CSS url() for background-image.
export function patternTile(stroke, bg, { size = 44, op = 1, width = 1.1 } = {}) {
  const s = size;
  const c = s / 2;
  const h = s * 0.3;
  const sq = `M${c - h},${c - h} H${c + h} V${c + h} H${c - h}Z`;
  const d = Math.SQRT2 * h;
  const dia = `M${c},${c - d} L${c + d},${c} L${c},${c + d} L${c - d},${c}Z`;
  const k = s * 0.09;
  const corner = (x, y) => `M${x - k},${y} L${x},${y - k} L${x + k},${y} L${x},${y + k}Z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${bg}"/><g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" opacity="${op}"><path d="${sq}"/><path d="${dia}"/><circle cx="${c}" cy="${c}" r="${r1(h * 0.42)}"/><path d="${corner(0, 0)} ${corner(s, 0)} ${corner(0, s)} ${corner(s, s)}"/><path d="M${c},0 V${r1(c - d)} M${c},${r1(c + d)} V${s} M0,${c} H${r1(c - d)} M${r1(c + d)},${c} H${s}"/></g></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}

export function star8Svg(fill, { size = 24, extra = '' } = {}) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><polygon points="${starPoints(12, 12, 11.5)}" fill="${fill}"/>${extra}</svg>`;
}

// line — star — line divider
export function divider(color, width = 220) {
  const w = width;
  return `<svg class="divider" viewBox="0 0 ${w} 16" width="${w}" height="16" aria-hidden="true"><path d="M4,8 H${w / 2 - 16} M${w / 2 + 16},8 H${w - 4}" stroke="${color}" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/><circle cx="${w / 2 - 22}" cy="8" r="1.8" fill="${color}" opacity="0.7"/><circle cx="${w / 2 + 22}" cy="8" r="1.8" fill="${color}" opacity="0.7"/><polygon points="${starPoints(w / 2, 8, 7.5)}" fill="${color}"/></svg>`;
}

// A small sprig used beside the lesson.
export function lessonIcon(color) {
  return `<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="${color}" opacity="0.14"/><path d="M20 30 C20 22 21 16 26 11" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M21.5 19 C14 19 11 14 11.5 10 C17 10 21 13 21.5 19Z" fill="${color}"/><path d="M23 15.5 C27 16 30.5 14 31 10 C27 9 23.6 11.4 23 15.5Z" fill="${color}" opacity="0.75"/></svg>`;
}

// Hands-free dua icon: a crescent and star.
export function duaIcon(color) {
  return `<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true"><path d="M24 6 A14 14 0 1 0 34 26 A11 11 0 1 1 24 6Z" fill="${color}"/><polygon points="${starPoints(29, 13, 4.4, 0.45, 5)}" fill="${color}"/></svg>`;
}

// Corner rosettes for the inner panel.
export function cornerStars(color) {
  const s = (x, y) => `<polygon points="${starPoints(x, y, 9)}" fill="${color}"/><circle cx="${x}" cy="${y}" r="3" fill="#FBF5EA"/>`;
  return s;
}
