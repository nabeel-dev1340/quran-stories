// Build the book: render every illustration, lay out the pages as HTML, fit
// the text, and print to PDF with Chromium.
//
//   node tools/build.mjs                  -> dist/ebook/The-Best-of-Stories.pdf (ebook, with covers)
//   node tools/build.mjs --edition kdp    -> dist/print/interior-kdp-ingramspark.pdf
//                                            (8.625 x 8.75 in: 0.125 in bleed on top, bottom and outside edge)
//   node tools/build.mjs --edition lulu   -> dist/print/interior-lulu.pdf (8.75 x 8.75 in: bleed on all four sides)
//   node tools/build.mjs --png            -> also build/pages/page-NNN.png (for review)
//   node tools/build.mjs --only 8-12      -> print only these pages to build/preview.pdf (quick checks)
//   node tools/build.mjs --sizes          -> report the fitted body-text size of every story
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { parts, stories } from '../src/content/stories.js';
import { assemble } from '../src/layout/book.js';
import { publishing } from '../src/content/publishing.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'build');
const artDir = path.join(out, 'art');
fs.mkdirSync(artDir, { recursive: true });
const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const wantPng = args.includes('--png');
const onlyArg = opt('--only');
const edition = opt('--edition') || 'ebook';

// Page geometry per edition (see the --pw/--ph/--tx/--ty/--b variables in style.css).
const EDITIONS = {
  ebook: {
    css: '@page { size: 8.5in 8.5in; margin: 0; }',
    file: 'dist/ebook/The-Best-of-Stories.pdf',
  },
  kdp: {
    css: `@page { size: 8.625in 8.75in; margin: 0; }
      :root { --pw: 8.625in; --ph: 8.75in; --ty: 0.125in; --b: 0.125in; }
      .page[data-side="L"] { --tx: 0.125in; }`,
    file: 'dist/print/interior-kdp-ingramspark.pdf',
  },
  lulu: {
    css: `@page { size: 8.75in 8.75in; margin: 0; }
      :root { --pw: 8.75in; --ph: 8.75in; --tx: 0.125in; --ty: 0.125in; --b: 0.125in; }`,
    file: 'dist/print/interior-lulu.pdf',
  },
};
if (!EDITIONS[edition]) throw new Error(`unknown edition "${edition}" (use ebook, kdp or lulu)`);

// ---------------------------------------------------------------- illustrations
async function renderModule(file, outName) {
  const mod = await import(pathToFileURL(file).href + `?v=${Date.now()}`);
  const svg = mod.default();
  fs.writeFileSync(path.join(artDir, outName), svg);
  return `art/${outName}`;
}

const sceneDir = path.join(root, 'src/art/scenes');
const sceneFiles = fs.readdirSync(sceneDir);
const art = {};
for (const st of stories) {
  const f = sceneFiles.find((x) => x.startsWith(st.id + '-') && x.endsWith('.js'));
  art[st.id] = f ? await renderModule(path.join(sceneDir, f), f.replace(/\.js$/, '.svg')) : null;
  if (!f) console.warn(`! no illustration yet for ${st.id}`);
}
const bookArtDir = path.join(root, 'src/art/book');
for (const f of fs.readdirSync(bookArtDir).filter((x) => x.endsWith('.js'))) {
  art[f.replace(/\.js$/, '')] = await renderModule(path.join(bookArtDir, f), 'book-' + f.replace(/\.js$/, '.svg'));
}

// ---------------------------------------------------------------- pages
const { pages, outline, interiorCount } = assemble({ parts, stories, art, edition });
const css = path.relative(out, path.join(root, 'src/layout/style.css'));
let selected = pages;
if (onlyArg) {
  const [a, b] = onlyArg.split('-').map(Number);
  selected = pages.slice(a - 1, b || a);
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Best of Stories</title><link rel="stylesheet" href="${css}"><style>${EDITIONS[edition].css}</style></head><body class="edition-${edition}">${selected.map((p) => p.html).join('\n')}
<script>
// Everything except the full-page pictures goes into the 8.5in trim box, so
// print editions can add bleed around the page without moving the content.
for (const pg of document.querySelectorAll('.page')) {
  const trim = document.createElement('div');
  trim.className = 'trim';
  for (const el of [...pg.children]) if (!(el.tagName === 'IMG' && (el.classList.contains('bg') || pg.classList.contains('art-page')))) trim.appendChild(el);
  pg.appendChild(trim);
}
// Shrink story text a little where needed so every page fits, then centre it.
window.fitText = () => {
  const report = [];
  for (const pg of document.querySelectorAll('.text-page')) {
    const inner = pg.querySelector('.tp-inner');
    const body = pg.querySelector('.tp-body');
    const story = pg.querySelector('.story');
    let fs = 14;
    const fits = () => {
      inner.style.setProperty('--fs', fs + 'pt');
      body.style.justifyContent = 'flex-start';
      return story.getBoundingClientRect().bottom <= body.getBoundingClientRect().bottom + 0.5;
    };
    while (!fits() && fs > 11) fs -= 0.25;
    body.style.justifyContent = 'center';
    report.push([pg.dataset.id || '', fs]);
  }
  return report;
};
</script></body></html>`;
const htmlFile = path.join(out, `book-${edition}.html`);
fs.writeFileSync(htmlFile, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const fit = await page.evaluate(() => window.fitText());
const small = fit.filter(([, fs]) => fs < 12.5);
if (small.length) console.warn('! text shrunk below 12.5pt on:', small.map(([id, fs]) => `${id}@${fs}`).join(', '));
if (args.includes('--sizes')) console.log('sizes:', fit.map(([id, fs]) => `${id}:${fs}`).join(' '));
const tooSmall = fit.filter(([, fs]) => fs <= 11);
if (tooSmall.length) console.warn('!! text may overflow on:', tooSmall.map(([id]) => id).join(', '));

// Every word must sit at least 0.375in inside the trim (KDP's minimum margin
// for books with bleed). Check all text in the finished layout.
const margins = await page.evaluate(() => {
  const PX = 96; // CSS px per inch
  const bad = [];
  for (const pg of document.querySelectorAll('.page')) {
    const trim = pg.querySelector('.trim').getBoundingClientRect();
    const walker = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const t = walker.currentNode;
      if (!t.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(t);
      for (const r of range.getClientRects()) {
        const m = Math.min(r.left - trim.left, trim.right - r.right, r.top - trim.top, trim.bottom - r.bottom) / PX;
        if (m < 0.375) bad.push(`${pg.id}: "${t.textContent.trim().slice(0, 24)}" ${m.toFixed(3)}in`);
      }
    }
  }
  return bad;
});
if (margins.length) console.warn(`! text closer than 0.375in to the trim:\n  ${margins.slice(0, 12).join('\n  ')}`);

// The ebook's laid-out pages are also saved for tools/epub.mjs.
if (edition === 'ebook' && !onlyArg) {
  const xhtml = await page.evaluate(() => [...document.querySelectorAll('.page')].map((pg) => ({ id: pg.id, xhtml: new XMLSerializer().serializeToString(pg) })));
  fs.writeFileSync(path.join(out, 'epub-pages.json'), JSON.stringify(xhtml.map((p, i) => ({ ...p, label: pages[i].label }))));
}

const pdfFile = onlyArg ? path.join(out, 'preview.pdf') : path.join(root, EDITIONS[edition].file);
fs.mkdirSync(path.dirname(pdfFile), { recursive: true });
await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true, tagged: true });
await browser.close();
if (!onlyArg) {
  // Bookmarks, page labels, metadata and trim boxes are added with pypdf.
  const meta = path.join(out, `finalize-${edition}.json`);
  fs.writeFileSync(meta, JSON.stringify({ edition, outline, labels: pages.map((p) => p.label), interiorCount, publishing }));
  execFileSync('python3', [path.join(root, 'tools/finalize.py'), pdfFile, meta], { stdio: 'inherit' });
}
console.log(`PDF: ${path.relative(root, pdfFile)} (${edition}: ${pages.length} pages, ${selected.length} printed, ${(fs.statSync(pdfFile).size / 1e6).toFixed(1)} MB)`);

if (wantPng) {
  const pngDir = path.join(out, 'pages');
  fs.rmSync(pngDir, { recursive: true, force: true });
  fs.mkdirSync(pngDir, { recursive: true });
  execFileSync('pdftoppm', ['-r', '72', '-png', pdfFile, path.join(pngDir, 'page')]);
  console.log('PNGs in', path.relative(root, pngDir));
}
