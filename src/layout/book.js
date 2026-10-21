// Page order for the whole book.
import { artPage, storyPage, contentsPage, partColors, markup, plain } from './pages.js';
import * as special from './special.js';

export function assemble({ parts, stories, art }) {
  const partById = Object.fromEntries(parts.map((p) => [p.id, p]));
  const pages = [];
  const outline = []; // [title, page number, level] for PDF bookmarks
  const add = (fn) => pages.push(fn(pages.length + 1));

  // Front matter: 1 cover, 2 endpaper, 3 title, 4 belongs-to, 5 parents' note, 6–7 contents.
  outline.push(['Cover', 1, 0]);
  add(() => special.cover(art));
  add(() => special.endpaper(art));
  add(() => special.titlePage(art));
  add((n) => special.belongsTo(n));
  outline.push(['A Note for Parents', pages.length + 1, 0]);
  add((n) => special.parentsNote(n));
  outline.push(['Contents', pages.length + 1, 0]);
  const tocAt = pages.length;
  pages.push('', ''); // filled in once story page numbers are known

  // Stories: art on the left (even) page, text on the right (odd) page.
  const startPage = {};
  stories.forEach((st, i) => {
    const [accent, tint] = partColors[st.part];
    startPage[st.id] = pages.length + 1;
    if (!stories[i - 1] || stories[i - 1].part !== st.part) outline.push([plain(partById[st.part].title), pages.length + 1, 0]);
    outline.push([`${i + 1}. ${plain(st.title)}`, pages.length + 1, 1]);
    pages.push(artPage(art[st.id], { label: `${st.id} · ${plain(st.title)}` }));
    pages.push(storyPage(st, { n: i + 1, partTitle: partById[st.part].title, accent, tint, page: pages.length + 1 }).replace('<section class="page text-page', `<section data-id="${st.id}" class="page text-page`));
  });

  // Back matter.
  const back = {};
  back.prophets = pages.length + 1;
  outline.push(['The Prophets of Allah', back.prophets, 0]);
  add(() => special.prophetsArt(art));
  add((n) => special.moreProphets(n));
  back.dua = pages.length + 1;
  outline.push(['A Dua for You, Little One', back.dua, 0]);
  outline.push(['Goodnight, Little One', back.dua + 1, 0]);
  add((n) => special.closingDua(n, art));
  add(() => special.goodnight(art));
  back.eyes = pages.length + 1;
  outline.push(['For Little Eyes (high-contrast pages)', back.eyes, 0]);
  add(() => special.littleEyesIntro(art));
  for (const [word, key] of special.littleEyesPages()) add((n) => special.highContrast(word, key, n, art));
  if (pages.length % 2 === 0) add(() => special.endpaper(art)); // keep the back cover on an even page
  outline.push(['Back Cover', pages.length + 1, 0]);
  add(() => special.backCover(art));

  // Contents, split over two facing pages.
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
  pages[tocAt] = contentsPage({ title: 'Contents', groups: groups.slice(0, 6), page: tocAt + 1, accent, tint });
  pages[tocAt + 1] = contentsPage({ title: '', groups: [...groups.slice(6), extra], page: tocAt + 2, accent, tint, footer: true });
  return { pages, outline };
}
