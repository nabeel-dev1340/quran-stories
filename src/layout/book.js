// Page order for every edition.
//
// The interior (what a printer binds) is 106 pages and starts on a right-hand
// page; every story is an art page on the left (even) and its text on the
// right (odd). Page numbers printed in the book and in the contents are
// interior page numbers, so they match across editions.
//
// The ebook adds the front cover and inside cover before the interior and
// the back cover after it. Print editions are the interior only: their cover
// is a separate wrap made by tools/cover.mjs.
import { artPage, storyPage, contentsPage, partColors, markup, plain } from './pages.js';
import * as special from './special.js';
import { alt } from '../content/alt.js';

export function assemble({ parts, stories, art, edition = 'ebook' }) {
  const partById = Object.fromEntries(parts.map((p) => [p.id, p]));
  const interior = [];
  const outline = []; // [title, interior page, level]
  const add = (fn) => interior.push(fn(interior.length + 1));
  const next = () => interior.length + 1;

  // Front matter.
  add(() => special.titlePage(art));
  add(() => special.copyrightPage(0, edition));
  add((n) => special.belongsTo(n));
  outline.push(['A Note for Parents', next(), 0]);
  add((n) => special.parentsNote(n));
  add((n) => special.aboutPage(n));
  outline.push(['Contents', next(), 0]);
  const tocAt = interior.length;
  interior.push('', ''); // filled in once story page numbers are known

  // Stories: art on the left (even) page, text on the right (odd) page.
  const startPage = {};
  stories.forEach((st, i) => {
    const [accent, tint] = partColors[st.part];
    startPage[st.id] = next();
    if (!stories[i - 1] || stories[i - 1].part !== st.part) outline.push([plain(partById[st.part].title), next(), 0]);
    outline.push([`${i + 1}. ${plain(st.title)}`, next(), 1]);
    interior.push(artPage(art[st.id], { label: alt[st.id] || plain(st.title) }));
    interior.push(storyPage(st, { n: i + 1, partTitle: partById[st.part].title, accent, tint, page: next() }).replace('<section class="page text-page', `<section data-id="${st.id}" class="page text-page`));
  });

  // Back matter.
  const back = {};
  back.prophets = next();
  outline.push(['The Prophets of Allah', back.prophets, 0]);
  add(() => special.prophetsArt(art));
  add((n) => special.moreProphets(n));
  back.dua = next();
  outline.push(['A Dua for You, Little One', back.dua, 0]);
  outline.push(['Goodnight, Little One', back.dua + 1, 0]);
  add((n) => special.closingDua(n, art));
  add(() => special.goodnight(art));
  back.eyes = next();
  outline.push(['For Little Eyes (high-contrast pages)', back.eyes, 0]);
  add(() => special.littleEyesIntro(art));
  for (const [word, key] of special.littleEyesPages()) add((n) => special.highContrast(word, key, n, art));
  outline.push(['Thank You', next(), 0]);
  add(() => special.thankYouPage(art));
  if (interior.length % 2) add(() => special.endpaper(art)); // printers need an even page count

  // Contents, on two facing pages, linking to each story.
  const groups = parts.map((p) => ({
    title: markup(p.title),
    color: partColors[p.id][0],
    rows: stories.filter((s) => s.part === p.id).map((s) => ({ n: stories.indexOf(s) + 1, title: markup(s.title), page: startPage[s.id] })),
  }));
  const extra = {
    title: 'And at the end',
    color: partColors.front[0],
    rows: [
      { title: 'The Prophets of Allah', page: back.prophets },
      { title: 'A Dua for You, Little One', page: back.dua },
      { title: 'For Little Eyes: high-contrast pictures', page: back.eyes },
    ],
  };
  const [accent, tint] = partColors.front;
  interior[tocAt] = contentsPage({ title: 'Contents', groups: groups.slice(0, 6), page: tocAt + 1, accent, tint });
  interior[tocAt + 1] = contentsPage({ title: '', groups: [...groups.slice(6), extra], page: tocAt + 2, accent, tint, footer: true });

  // Interior pages carry their number (for links and labels) and side.
  const tag = (html, attrs) => html.replace('<section ', `<section ${attrs} `);
  const pages = interior.map((html, i) => ({
    html: tag(html, `id="pg-${i + 1}" data-side="${(i + 1) % 2 ? 'R' : 'L'}"`),
    label: String(i + 1),
  }));

  if (edition !== 'ebook') return { pages, outline: outline.map(([t, p, l]) => [t, p, l]), interiorCount: interior.length };

  // Ebook: covers around the interior.
  const front = [
    { html: tag(special.cover(art), 'id="pg-cover" data-side="R"'), label: 'Cover' },
    { html: tag(special.endpaper(art), 'id="pg-inside-cover" data-side="L"'), label: 'Inside cover' },
  ];
  const backCover = { html: tag(special.backCover(art), 'id="pg-back-cover" data-side="R"'), label: 'Back cover' };
  const offset = front.length;
  return {
    pages: [...front, ...pages, backCover],
    outline: [['Cover', 1, 0], ...outline.map(([t, p, l]) => [t, p + offset, l]), ['Back Cover', pages.length + offset + 1, 0]],
    interiorCount: interior.length,
  };
}
