// HTML generators for every kind of page in the book.
import { patternTile, star8Svg, divider, lessonIcon, duaIcon } from './ornaments.js';
import { duaArabic, duaRef } from '../content/quran.js';
import { surahName } from '../content/surahs.js';

// Accent colours per part: [accent, tint].
export const partColors = {
  p1: ['#2F7D58', '#E3EFE4'],
  p2: ['#1F6F8B', '#DFEDF1'],
  p3: ['#B0601F', '#F6E8D6'],
  p4: ['#7D55A3', '#ECE4F3'],
  p5: ['#BF4E3B', '#F7E3DD'],
  p6: ['#2D6CA3', '#E0EAF4'],
  p7: ['#5E8A2E', '#E8F0DC'],
  p8: ['#B04A77', '#F5E1EA'],
  p9: ['#5B4FA3', '#E6E3F3'],
  p10: ['#17806D', '#DDF0EA'],
  front: ['#B0601F', '#F6E8D6'],
};

export function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const c = (s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return '#' + [16, 8, 0].map((s) => c(s).toString(16).padStart(2, '0')).join('');
}

const esc = (s) => s.replace(/&(?!\w+;)/g, '&amp;');
export function markup(s) {
  return esc(s)
    .replace(/\{as\}/g, '<span class="hon" dir="rtl" lang="ar">عليه السلام</span>')
    .replace(/\{aha\}/g, '<span class="hon" dir="rtl" lang="ar">عليها السلام</span>')
    .replace(/\{saw\}/g, '<span class="saw">ﷺ</span>')
    .replace(/~([^~]+)~/g, '<em class="sfx">$1</em>');
}
// Plain-text version (for the contents and kickers).
export const plain = (s) => s.replace(/\{as\}|\{aha\}/g, '').replace(/\{saw\}/g, 'ﷺ').replace(/~/g, '').replace(/\s+/g, ' ').trim();

function frameVars(accent, tint) {
  const patternInk = mix(tint, accent, 0.28);
  return `--accent:${accent};--tint:${tint};--pattern:${patternTile(patternInk, tint, { size: 44, width: 1.15 })};--pc:${accent}`;
}
const corners = (color) =>
  ['tl', 'tr', 'bl', 'br'].map((k) => `<div class="corner ${k}">${star8Svg(color, { size: 29, extra: '<circle cx="12" cy="12" r="3.6" fill="#FBF5EA"/>' })}</div>`).join('');
const folio = (n, color) => (n ? `<div class="folio">${star8Svg(color, { size: 40 })}<span>${n}</span></div>` : '');

// ---------------------------------------------------------------- stories
export function artPage(src, { label = '' } = {}) {
  const inner = src ? `<img src="${src}" alt="${label}">` : `<div class="placeholder">${label}</div>`;
  return `<section class="page art-page">${inner}</section>`;
}

function duaBlock(dua, { fallbackLabel = 'A dua from the Quran' } = {}) {
  const ar = duaArabic(dua.seg);
  const [s, a] = dua.seg[0];
  const ayahs = dua.seg.map((x) => x[1]);
  const ref = `Surah ${surahName(s)} ${s}:${ayahs.length > 1 ? `${ayahs[0]}–${ayahs[ayahs.length - 1]}` : a}`;
  return `<aside class="dua"><div class="lbl">${duaIcon('#C9922E')}<span>${dua.label || fallbackLabel}</span></div>
    <div class="ar" lang="ar">${ar}</div>
    <div class="tr">${dua.tr}</div>
    <div class="en">“${markup(dua.en)}”</div>
    <div class="ref">${ref}</div></aside>`;
}

export function storyPage(story, { n, partTitle, accent, tint, page }) {
  const paras = story.text.map(markup);
  // drop cap on the first letter of the first paragraph
  paras[0] = paras[0].replace(/^(\W*)(\w)/, (_, pre, ch) => `${pre}<span class="dropcap">${ch}</span>`);
  return `<section class="page text-page framed" style="${frameVars(accent, tint)}">
  <div class="panel"></div>${corners(accent)}
  <div class="tp-inner">
    <header class="tp-head">
      <div class="kicker">Story ${n}<span class="dot">◆</span>${plain(partTitle)}</div>
      <div class="ar-label" lang="ar">${story.ar}</div>
      <h2 class="title">${markup(story.title)}</h2>
      ${divider(accent, 200)}
    </header>
    <div class="tp-body"><div class="story">${paras.map((p) => `<p>${p}</p>`).join('')}</div></div>
    <div class="extras${story.dua && duaArabic(story.dua.seg).length < 48 ? ' side' : ''}">
      <aside class="lesson">${lessonIcon(accent)}<div><span class="lbl">A little lesson</span><div class="txt">${markup(story.lesson)}</div></div></aside>
      ${story.dua ? duaBlock(story.dua) : ''}
    </div>
    <footer class="refs"><b>From the Quran</b>${markup(story.refs)}</footer>
  </div>
  ${folio(page, accent)}
</section>`;
}

// ---------------------------------------------------------------- generic framed page
export function framedPage({ accent, tint, page, body, cls = '' }) {
  return `<section class="page framed ${cls}" style="${frameVars(accent, tint)}">
  <div class="panel"></div>${corners(accent)}
  <div class="gp-inner">${body}</div>
  ${folio(page, accent)}
</section>`;
}

export function contentsPage({ title, groups, page, accent, tint, footer = false }) {
  const body = `${title ? `<h1>${title}</h1>${divider(accent, 200)}` : '<div style="height:0.12in"></div>'}
  <div class="toc">${groups
    .map(
      (g) => `<div class="part" style="--pc:${g.color}">${star8Svg(g.color, { size: 13 })}<span>${g.title}</span></div>${g.rows
        .map((r) => `<div class="row" style="--pc:${g.color}"><span class="n">${r.n ?? ''}</span><span class="t">${r.title}</span><span class="dots"></span><span class="p">${r.page}</span></div>`)
        .join('')}`,
    )
    .join('')}</div>${footer ? tocFooter(accent) : ''}`;
  return framedPage({ accent, tint, page, body, cls: 'contents-page' });
}

// Surah Yusuf 12:111 at the foot of the contents.
function tocFooter(accent) {
  return `<div class="toc-foot"><div class="ar" lang="ar">${duaArabic([[12, 111, null, 'ٱلۡأَلۡبَٰبِ']])}</div>
  <div class="en">“In their stories there is truly a lesson for those who understand.”</div><div class="ref">Surah Yusuf 12:111</div></div>`;
}

export { duaBlock, frameVars, corners, folio };
