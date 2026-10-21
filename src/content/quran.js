// Exact Quran text lookup. Segments are cut on whole words from the Uthmani
// text in assets/data/quran_en.json so nothing is ever retyped by hand.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const quran = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/quran_en.json'), 'utf8'));

// Letters only: drop harakat, Quranic annotation marks and tatweel; unify alef forms.
const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
const skeleton = (s) => s.replace(MARKS, '').replace(/[ٱأإآ]/g, 'ا').replace(/ى/g, 'ي').trim();
// Pause (waqf) signs that would dangle if a segment ends on that word.
const TRAILING_PAUSE = /[ۖ-ۜ]+$/;

export function verse(surah, ayah) {
  const ch = quran[surah - 1];
  const v = ch && ch.verses[ayah - 1];
  if (!v) throw new Error(`No verse ${surah}:${ayah}`);
  return { text: v.text, translation: v.translation, surahName: ch.transliteration };
}

// Return the words of surah:ayah from the word matching `from` to the word
// matching `to` (inclusive). null means the verse start / end.
export function segment(surah, ayah, from = null, to = null) {
  const words = verse(surah, ayah).text.replace(/^۞/, '').split(/\s+/).filter(Boolean);
  const sk = words.map(skeleton);
  let i = 0;
  if (from) {
    const f = from.split(/\s+/).map(skeleton);
    i = sk.findIndex((_, k) => f.every((w, n) => sk[k + n] === w));
    if (i < 0) throw new Error(`${surah}:${ayah}: start "${from}" not found`);
  }
  let j = words.length - 1;
  if (to) {
    const t = to.split(/\s+/).map(skeleton);
    j = sk.findIndex((_, k) => k >= i && t.every((w, n) => sk[k + n] === w));
    if (j < 0) throw new Error(`${surah}:${ayah}: end "${to}" not found`);
    j += t.length - 1;
  }
  const out = words.slice(i, j + 1);
  out[out.length - 1] = out[out.length - 1].replace(TRAILING_PAUSE, '');
  return out.join(' ');
}

// Arabic for a dua spec: segments joined with the end-of-verse sign.
export function duaArabic(seg) {
  return seg.map(([s, a, from, to]) => segment(s, a, from, to)).join(' ۝ ');
}

export function duaRef(seg) {
  const s = seg[0][0];
  const ayahs = seg.map((x) => x[1]);
  const name = verse(s, ayahs[0]).surahName;
  const range = ayahs.length > 1 ? `${ayahs[0]}–${ayahs[ayahs.length - 1]}` : `${ayahs[0]}`;
  return `${name} ${s}:${range}`;
}
