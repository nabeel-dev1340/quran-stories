// Store and social-media images, made from the finished ebook PDF.
//
//   node tools/build.mjs && node tools/marketing.mjs   -> dist/marketing/*.jpg
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { publishing as pub } from '../src/content/publishing.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist/marketing');
const tmp = path.join(root, 'build/marketing');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(tmp, { recursive: true });
const pdf = path.join(root, 'dist/ebook/The-Best-of-Stories.pdf');
const css = pathToFileURL(path.join(root, 'src/layout/style.css')).href;

// Ebook PDF page = interior page + 2 (cover and inside cover come first).
const pdfPage = (interior) => interior + 2;
function pagePng(n, dpi = 200) {
  const base = path.join(tmp, `p${n}-${dpi}`);
  const file = `${base}.png`;
  if (!fs.existsSync(file)) execFileSync('pdftoppm', ['-r', String(dpi), '-f', String(n), '-l', String(n), '-png', '-singlefile', pdf, base]);
  return pathToFileURL(file).href;
}
const art = (name) => pathToFileURL(path.join(root, 'build/art', name)).href;

const browser = await chromium.launch();
async function shot(name, w, h, body, extraCss = '') {
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${css}"><style>
    html, body { margin: 0; width: ${w}px; height: ${h}px; overflow: hidden; background: #FBF5EA; }
    .stage { position: relative; width: ${w}px; height: ${h}px; overflow: hidden; }
    .bg-night { background: radial-gradient(120% 90% at 50% 15%, #2B3F78 0%, #17264A 55%, #0F1A33 100%); }
    .bg-cream { background: radial-gradient(120% 100% at 50% 0%, #FFF8EC 0%, #F6E8D6 100%); }
    .shadow { box-shadow: 0 30px 60px rgba(15, 26, 51, .35), 0 8px 18px rgba(15, 26, 51, .25); }
    .headline { position: absolute; left: 0; right: 0; text-align: center; font: 900 ${Math.round(w / 22)}px/1.05 'Fraunces Soft', serif; }
    .sub { position: absolute; left: 0; right: 0; text-align: center; font: 800 ${Math.round(w / 60)}px 'Nunito', sans-serif; letter-spacing: .14em; text-transform: uppercase; }
    ${extraCss}
  </style></head><body><div class="stage">${body}</div></body></html>`;
  const file = path.join(tmp, `${name}.html`);
  fs.writeFileSync(file, html);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, `${name}.jpg`), type: 'jpeg', quality: 90 });
  await page.close();
  console.log('marketing:', `dist/marketing/${name}.jpg`, `${w}x${h}`);
}

// 1. Paperback mockup: the book standing at an angle, with a spread lying behind it.
const cover = pagePng(1, 220);
await shot('mockup-paperback', 2000, 2000, `
  <div class="bg-night" style="position:absolute;inset:0"></div>
  <img src="${pagePng(pdfPage(42), 150)}" style="position:absolute;width:680px;left:1130px;top:300px;transform:rotate(7deg);border-radius:6px" class="shadow">
  <img src="${pagePng(pdfPage(43), 150)}" style="position:absolute;width:660px;left:1200px;top:880px;transform:rotate(-3deg);border-radius:6px" class="shadow">
  <div style="position:absolute;left:230px;top:300px;width:1100px;height:1100px;perspective:3000px">
    <div style="position:absolute;inset:0;transform:rotateY(22deg) rotateX(2deg);transform-style:preserve-3d">
      <div style="position:absolute;left:-36px;top:0;width:36px;height:1100px;background:linear-gradient(90deg,#0F1A33,#22386A 60%,#17264A);transform:rotateY(-70deg);transform-origin:right center"></div>
      <img src="${cover}" style="position:absolute;inset:0;width:1100px;height:1100px;border-radius:3px 10px 10px 3px;box-shadow:0 60px 90px rgba(0,0,0,.45),0 14px 24px rgba(0,0,0,.3)">
      <div style="position:absolute;inset:0;border-radius:3px 10px 10px 3px;background:linear-gradient(90deg,rgba(0,0,0,.28) 0,rgba(255,255,255,.12) 2.2%,rgba(0,0,0,0) 5%,rgba(255,255,255,.06) 60%,rgba(0,0,0,.08))"></div>
    </div>
  </div>
  <div class="headline" style="bottom:190px;color:#FFF3DC">42 Quran stories for little ones</div>
  <div class="sub" style="bottom:125px;color:#F2C46A">Paperback · Ebook · ${pub.ageRange}</div>
`);

// 2–4. Look-inside spreads.
const spreads = [
  ['look-inside-baby-musa', 42],
  ['look-inside-yunus', 62],
  ['look-inside-little-ant', 58],
  ['look-inside-nuh', 14],
];
for (const [name, left] of spreads) {
  await shot(name, 2400, 1300, `
    <div class="bg-cream" style="position:absolute;inset:0"></div>
    <div style="position:absolute;left:100px;top:100px;width:2200px;height:1100px;display:flex" class="shadow">
      <img src="${pagePng(pdfPage(left), 150)}" style="width:1100px;height:1100px;display:block">
      <img src="${pagePng(pdfPage(left + 1), 150)}" style="width:1100px;height:1100px;display:block">
      <div style="position:absolute;left:1040px;top:0;width:120px;height:1100px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.16) 48%,rgba(255,255,255,.18) 52%,rgba(0,0,0,0))"></div>
    </div>
  `);
}

// 5. What's inside: a grid of story pictures.
const grid = ['s04-nuh', 's18-baby-musa', 's28-yunus', 's26-ant', 's06-salih', 's32-cave', 's30-maryam', 's38-elephant', 's42-mercy'];
await shot('whats-inside', 2000, 2000, `
  <div class="bg-night" style="position:absolute;inset:0"></div>
  <div class="headline" style="top:90px;color:#FFF3DC">42 stories, 42 pictures</div>
  <div class="sub" style="top:200px;color:#F2C46A">From Creation to our beloved Prophet ﷺ</div>
  <div style="position:absolute;left:160px;top:310px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px">
    ${grid.map((g) => `<img src="${art(g + '.svg')}" style="width:540px;height:540px;border-radius:24px;display:block" class="shadow">`).join('')}
  </div>
`);

// 6. High-contrast pages for newborns.
await shot('high-contrast-pages', 2000, 2000, `
  <div style="position:absolute;inset:0;background:#fff"></div>
  <div class="headline" style="top:90px;color:#111;font-family:'Baloo 2','Nunito',sans-serif">For little eyes</div>
  <div class="sub" style="top:205px;color:#D62F2F">High-contrast pages for newborns</div>
  <div style="position:absolute;left:220px;top:320px;width:1560px;display:grid;grid-template-columns:repeat(2,1fr);gap:40px">
    ${[99, 101, 103, 104].map((n) => `<img src="${pagePng(n, 120)}" style="width:760px;height:760px;display:block;border-radius:18px;box-shadow:0 0 0 6px #111">`).join('')}
  </div>
`);

// 7. Amazon A+ content banner (970 x 600).
await shot('aplus-970x600', 970, 600, `
  <div class="bg-night" style="position:absolute;inset:0"></div>
  <img src="${pagePng(pdfPage(42), 100)}" style="position:absolute;left:470px;top:60px;width:440px;height:440px;border-radius:8px;transform:rotate(3deg)" class="shadow">
  <div style="position:absolute;left:50px;top:80px;width:400px;color:#FFF3DC">
    <div style="font:900 40px/1.05 'Fraunces Soft',serif">Stories to love,<br>duas to learn</div>
    <div style="font:600 17px/1.5 'Nunito',sans-serif;margin-top:22px;color:#E9DFF5">Gentle read-aloud retellings of 42 Quran stories, each with a little lesson, its Quran references and bright pictures made for little ones.</div>
    <div style="font:800 14px 'Nunito',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#F2C46A;margin-top:26px">No people or prophets pictured</div>
  </div>
`);
await browser.close();
