// Build the whole book: render every illustration, lay out the pages as
// HTML, fit the text, and print to PDF with Chromium.
//
//   node tools/build.mjs            -> build/The-Best-of-Stories.pdf
//   node tools/build.mjs --png      -> also build/pages/page-NNN.png (for review)
//   node tools/build.mjs --only 8-12 -> print only these pages (quick checks)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { parts, stories } from '../src/content/stories.js';
import { assemble } from '../src/layout/book.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'build');
const artDir = path.join(out, 'art');
fs.mkdirSync(artDir, { recursive: true });
const args = process.argv.slice(2);
const wantPng = args.includes('--png');
// --bleed: print-shop version, 8.75in pages with 0.125in bleed on every side.
const bleed = args.includes('--bleed');
const onlyArg = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

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
if (fs.existsSync(bookArtDir)) {
  for (const f of fs.readdirSync(bookArtDir).filter((x) => x.endsWith('.js'))) {
    art[f.replace(/\.js$/, '')] = await renderModule(path.join(bookArtDir, f), 'book-' + f.replace(/\.js$/, '.svg'));
  }
}

// ---------------------------------------------------------------- pages
const { pages, outline } = assemble({ parts, stories, art });
const css = path.relative(out, path.join(root, 'src/layout/style.css'));
let selected = pages;
if (onlyArg) {
  const [a, b] = onlyArg.split('-').map(Number);
  selected = pages.slice(a - 1, (b || a));
}
const pageCss = bleed ? '<style>@page { size: 8.75in 8.75in; margin: 0; } :root { --bleed: 0.125in; }</style>' : '';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Best of Stories</title><link rel="stylesheet" href="${css}">${pageCss}</head><body${bleed ? ' class="bleed"' : ''}>${selected.join('\n')}
<script>
// Everything except the full-bleed background goes into a trim box, so the
// bleed version can grow the page without moving the content.
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
      const ok = story.getBoundingClientRect().bottom <= body.getBoundingClientRect().bottom + 0.5;
      return ok;
    };
    while (!fits() && fs > 11) fs -= 0.25;
    body.style.justifyContent = 'center';
    report.push([pg.dataset.id || '', fs]);
  }
  return report;
};
</script></body></html>`;
const htmlFile = path.join(out, 'book.html');
fs.writeFileSync(htmlFile, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const fit = await page.evaluate(() => window.fitText());
const small = fit.filter(([, fs]) => fs < 13);
if (small.length) console.warn('! text shrunk below 13pt on:', small.map(([id, fs]) => `${id}@${fs}`).join(', '));
const tooSmall = fit.filter(([, fs]) => fs <= 11);
if (tooSmall.length) console.warn('!! text may overflow on:', tooSmall.map(([id]) => id).join(', '));
const pdfFile = path.join(out, onlyArg ? 'preview.pdf' : bleed ? 'The-Best-of-Stories-print-bleed.pdf' : 'The-Best-of-Stories.pdf');
await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true });
await browser.close();
if (!onlyArg) {
  // Bookmarks, metadata and spread layout are added with pypdf.
  const outlineFile = path.join(out, 'outline.json');
  fs.writeFileSync(outlineFile, JSON.stringify(outline));
  execFileSync('python3', [path.join(root, 'tools/finalize.py'), pdfFile, outlineFile], { stdio: 'inherit' });
}
console.log(`PDF: ${pdfFile} (${pages.length} pages in book, ${selected.length} printed, ${(fs.statSync(pdfFile).size / 1e6).toFixed(1)} MB)`);

if (wantPng) {
  const pngDir = path.join(out, 'pages');
  fs.rmSync(pngDir, { recursive: true, force: true });
  fs.mkdirSync(pngDir, { recursive: true });
  execFileSync('pdftoppm', ['-r', '72', '-png', pdfFile, path.join(pngDir, 'page')]);
  console.log('PNGs in', pngDir);
}
