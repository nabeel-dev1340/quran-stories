// Build the full paperback cover (back + spine + front, with 0.125in bleed)
// as a single-page PDF for the printer.
//
//   node tools/cover.mjs                          -> KDP premium colour and standard colour covers
//   node tools/cover.mjs --spine 0.262 --name ingramspark
//                                                 -> a cover with an exact spine width (inches),
//                                                    e.g. from IngramSpark's or Lulu's cover template
//
// Spine width = interior pages x paper thickness. KDP: premium colour
// 0.002347in/page, standard colour 0.002252in/page.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import * as special from '../src/layout/special.js';
import { publishing } from '../src/content/publishing.js';
import { star8Svg } from '../src/layout/ornaments.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'build');
const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);

const INTERIOR_PAGES = 106;
const covers = opt('--spine')
  ? [{ name: opt('--name') || 'custom', spine: Number(opt('--spine')) }]
  : [
      { name: 'kdp-premium-color', spine: INTERIOR_PAGES * 0.002347 },
      { name: 'kdp-standard-color', spine: INTERIOR_PAGES * 0.002252 },
    ];

// Render the cover art (build.mjs must have run once, or render here).
const artDir = path.join(out, 'art');
fs.mkdirSync(artDir, { recursive: true });
const art = {};
for (const key of ['cover', 'back']) {
  const mod = await import(pathToFileURL(path.join(root, 'src/art/book', `${key}.js`)).href);
  fs.writeFileSync(path.join(artDir, `book-${key}.svg`), mod.default());
  art[key] = `art/book-${key}.svg`;
}

const B = 0.125; // bleed
const T = 8.5; // trim
const css = path.relative(out, path.join(root, 'src/layout/style.css'));
const browser = await chromium.launch();
const outDir = path.join(root, 'dist/print');
fs.mkdirSync(outDir, { recursive: true });

for (const { name, spine } of covers) {
  const W = B + T + spine + T + B;
  const H = B + T + B;
  const spineX = B + T;
  // Back and front are ordinary book pages placed side by side; each keeps
  // its 8.5in trim box, with bleed on the outer edges only.
  const backPage = special.backCover(art).replace('<section class="page', `<section style="--pw:${B + T}in;--ph:${H}in;--tx:${B}in;--ty:${B}in;--b:${B}in;position:absolute;left:0;top:0" class="page`);
  const frontPage = special.cover(art).replace('<section class="page', `<section style="--pw:${T + B}in;--ph:${H}in;--tx:0in;--ty:${B}in;--b:${B}in;position:absolute;left:${spineX + spine}in;top:0" class="page`);
  const spineText = spine >= 0.2
    ? `<div class="spine-text"><span class="sp-title">The Best of Stories</span><span class="sp-star">${star8Svg('#F2C46A', { size: 8 })}</span><span class="sp-author">${publishing.author}</span></div>`
    : '';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="${css}">
<style>
  @page { size: ${W}in ${H}in; margin: 0; }
  html, body { background: #fff; }
  .wrap { position: relative; width: ${W}in; height: ${H}in; overflow: hidden; }
  .wrap .page { break-after: auto; margin: 0; box-shadow: none; }
  .spine { position: absolute; left: ${spineX}in; top: 0; width: ${spine}in; height: ${H}in; background: linear-gradient(90deg, #142140, #1D2F5E 50%, #142140); }
  .spine-text { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(90deg); white-space: nowrap; display: flex; align-items: center; gap: 0.12in; color: #FFF3DC; }
  .sp-title { font: 800 ${Math.min(9, spine * 34).toFixed(1)}pt 'Fraunces Soft', serif; letter-spacing: 0.02em; }
  .sp-star { display: inline-flex; }
  .sp-author { font: 800 ${Math.min(6.5, spine * 26).toFixed(1)}pt 'Nunito', sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: #F2C46A; }
</style></head><body><div class="wrap">${backPage}${frontPage}<div class="spine">${spineText}</div></div>
<script>
for (const pg of document.querySelectorAll('.page')) {
  const trim = document.createElement('div');
  trim.className = 'trim';
  for (const el of [...pg.children]) if (!(el.tagName === 'IMG' && el.classList.contains('bg'))) trim.appendChild(el);
  pg.appendChild(trim);
}
</script></body></html>`;
  const htmlFile = path.join(out, `cover-${name}.html`);
  fs.writeFileSync(htmlFile, html);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const pdf = path.join(outDir, `cover-${name}.pdf`);
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  await page.close();
  // Exact page size, and the trim box of the whole wrap.
  execFileSync('python3', ['-c', `
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, FloatObject, NameObject
w = PdfWriter(clone_from=PdfReader(sys.argv[1]))
W, H, B = ${W} * 72, ${H} * 72, ${B} * 72
for p in w.pages:
    p[NameObject("/MediaBox")] = ArrayObject([FloatObject(v) for v in (0, 0, W, H)])
    p[NameObject("/CropBox")] = ArrayObject([FloatObject(v) for v in (0, 0, W, H)])
    p[NameObject("/BleedBox")] = ArrayObject([FloatObject(v) for v in (0, 0, W, H)])
    p[NameObject("/TrimBox")] = ArrayObject([FloatObject(v) for v in (B, B, W - B, H - B)])
w.add_metadata({"/Title": "The Best of Stories — cover (${name})", "/Author": "${publishing.author}"})
w.write(sys.argv[1])
`, pdf]);
  console.log(`cover: ${path.relative(root, pdf)}  ${W.toFixed(3)} x ${H.toFixed(3)} in, spine ${spine.toFixed(3)} in`);
}
await browser.close();
