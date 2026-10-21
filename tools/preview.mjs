// Render one or more scenes to SVG + PNG so they can be looked at.
//
//   node tools/preview.mjs s05            -> build/preview/s05-*.png
//   node tools/preview.mjs s05 s06 --size 600
//   node tools/preview.mjs --all --sheet  -> also build/preview/_sheet.png
//
// A scene is any module in src/art/scenes whose file name starts with the
// given prefix; its default export returns an SVG string.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sceneDir = path.join(root, 'src/art/scenes');
const artOut = path.join(root, process.argv.includes('--out') ? 'build/review-art' : 'build/art');
const outArg = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
const pngOut = outArg ? path.resolve(root, outArg) : path.join(root, 'build/preview');
fs.mkdirSync(artOut, { recursive: true });
fs.mkdirSync(pngOut, { recursive: true });

const args = process.argv.slice(2);
const size = Number(args[args.indexOf('--size') + 1]) || 1000;
const wantAll = args.includes('--all');
const wantSheet = args.includes('--sheet');
const prefixes = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--size' && args[i - 1] !== '--out');

// Book art (cover etc.) lives in src/art/book: preview it with "book/cover".
const bookDir = path.join(root, 'src/art/book');
const files = [
  ...fs.readdirSync(sceneDir).filter((f) => f.endsWith('.js')).filter((f) => wantAll || prefixes.some((p) => f.startsWith(p))).sort(),
  ...(fs.existsSync(bookDir) ? fs.readdirSync(bookDir) : []).filter((f) => f.endsWith('.js')).filter((f) => prefixes.some((p) => p.startsWith('book/') && f.startsWith(p.slice(5)))).sort().map((f) => '../book/' + f),
];
if (!files.length) {
  console.error('No matching scenes in src/art/scenes for', prefixes.join(' ') || '(none given)');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: size, height: size } });
const done = [];
for (const f of files) {
  const name = f.replace(/\.js$/, '').replace('../book/', 'book-');
  const mod = await import(pathToFileURL(path.join(sceneDir, f)).href + `?v=${Date.now()}`);
  const svg = mod.default();
  if (!svg.startsWith('<svg')) throw new Error(`${f}: default export must return an <svg> string`);
  const svgFile = path.join(artOut, `${name}.svg`);
  fs.writeFileSync(svgFile, svg);
  // Load the SVG on its own first so XML errors are reported clearly.
  await page.goto(pathToFileURL(svgFile).href);
  const xmlError = await page.evaluate(() => document.querySelector('parsererror')?.textContent || '');
  if (xmlError) throw new Error(`${f}: invalid SVG/XML -> ${xmlError.slice(0, 300)}`);
  const wrapper = path.join(pngOut, `_${name}.html`);
  fs.writeFileSync(wrapper, `<html><body style="margin:0;background:#fff"><img src="${pathToFileURL(svgFile).href}" style="width:${size}px;height:${size}px;display:block"></body></html>`);
  await page.goto(pathToFileURL(wrapper).href);
  await page.waitForLoadState('load');
  fs.unlinkSync(wrapper);
  const png = path.join(pngOut, `${name}.png`);
  await page.screenshot({ path: png });
  done.push({ name, png, kb: Math.round(Buffer.byteLength(svg) / 1024) });
  console.log(`${name}: ${png} (svg ${Math.round(Buffer.byteLength(svg) / 1024)} KB)`);
}

if (wantSheet) {
  const cols = Math.ceil(Math.sqrt(done.length));
  const cell = 240;
  const html = `<html><body style="margin:0;background:#eee;display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:8px;padding:8px;font:12px sans-serif">${done
    .map((d) => `<div><img src="${pathToFileURL(path.join(artOut, d.name + '.svg')).href}" style="width:${cell}px;height:${cell}px;display:block"><div>${d.name}</div></div>`)
    .join('')}</body></html>`;
  const rows = Math.ceil(done.length / cols);
  await page.setViewportSize({ width: cols * (cell + 8) + 8, height: rows * (cell + 26) + 16 });
  const sheetHtml = path.join(pngOut, '_sheet.html');
  fs.writeFileSync(sheetHtml, html);
  await page.goto(pathToFileURL(sheetHtml).href);
  await page.waitForLoadState('load');
  await page.screenshot({ path: path.join(pngOut, '_sheet.png'), fullPage: true });
  fs.unlinkSync(sheetHtml);
  console.log('sheet:', path.join(pngOut, '_sheet.png'));
}
await browser.close();
