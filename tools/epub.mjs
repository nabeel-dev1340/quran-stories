// Package the laid-out ebook pages as a fixed-layout EPUB 3 (live text,
// embedded fonts, vector pictures) for Apple Books, Kobo, Google Play Books
// and Barnes & Noble, and render the store cover images.
//
//   node tools/build.mjs        (lays out the ebook and saves build/epub-pages.json)
//   node tools/epub.mjs         -> dist/ebook/The-Best-of-Stories.epub
//                                  dist/ebook/cover-2560x2560.jpg
//   epubcheck dist/ebook/The-Best-of-Stories.epub
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { parts, stories } from '../src/content/stories.js';
import { publishing as pub } from '../src/content/publishing.js';
import { book, backCover } from '../src/content/book.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = path.join(root, 'build');
const epubDir = path.join(build, 'epub');
const OEBPS = path.join(epubDir, 'OEBPS');
const VIEW = 816; // 8.5in at 96 CSS px per inch

const pages = JSON.parse(fs.readFileSync(path.join(build, 'epub-pages.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(build, 'finalize-ebook.json'), 'utf8'));
fs.rmSync(epubDir, { recursive: true, force: true });
for (const d of ['META-INF', 'OEBPS/xhtml', 'OEBPS/css', 'OEBPS/fonts', 'OEBPS/images']) fs.mkdirSync(path.join(epubDir, d), { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s) => s.replace(/\{as\}|\{aha\}/g, '').replace(/\{saw\}/g, 'ﷺ').replace(/~/g, '').replace(/\s+/g, ' ').trim();
const fileOf = (i) => `p${String(i + 1).padStart(3, '0')}.xhtml`;
const idToFile = Object.fromEntries(pages.map((p, i) => [p.id, fileOf(i)]));

// ---------------------------------------------------------------- stylesheet + fonts
let css = fs.readFileSync(path.join(root, 'src/layout/style.css'), 'utf8');
const fonts = new Set();
css = css.replace(/@font-face \{[^}]*\}\n?/g, (rule) => {
  const fam = /font-family: '([^']+)'/.exec(rule)[1];
  if (fam === 'Reem Kufi' || fam === 'Caveat') return ''; // not used in the book
  const file = /url\('\.\.\/\.\.\/assets\/fonts\/([^']+)'\)/.exec(rule)[1];
  fonts.add(file);
  return rule.replace(/url\('\.\.\/\.\.\/assets\/fonts\//, "url('../fonts/");
});
css += `
/* ---------------------------------------------------------------- ebook reader overrides */
html, body { margin: 0; padding: 0; width: ${VIEW}px; height: ${VIEW}px; overflow: hidden; background: #FBF5EA; }
.page { margin: 0 !important; box-shadow: none !important; }
`;
fs.writeFileSync(path.join(OEBPS, 'css/book.css'), css);
for (const f of fonts) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OEBPS, 'fonts', f));

// ---------------------------------------------------------------- pages
const images = new Set();
const patterns = new Map();
const hasSvg = new Set();
pages.forEach((p, i) => {
  let x = p.xhtml;
  // pictures
  x = x.replace(/src="art\/([^"]+)"/g, (_, f) => {
    images.add(f);
    return `src="../images/${f}"`;
  });
  // background pattern tiles: data URLs -> small SVG files
  x = x.replace(/url\('data:image\/svg\+xml,([^']+)'\)/g, (_, data) => {
    const svg = decodeURIComponent(data);
    const name = `pattern-${crypto.createHash('sha1').update(svg).digest('hex').slice(0, 10)}.svg`;
    patterns.set(name, svg);
    return `url('../images/${name}')`;
  });
  // links to other pages
  x = x.replace(/href="#(pg-[\w-]+)"/g, (_, id) => `href="${idToFile[id]}#${id}"`);
  if (/<svg[\s>]/.test(x)) hasSvg.add(i);
  const type = { 'pg-cover': ' epub:type="cover"' }[p.id] || '';
  const doc = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=${VIEW}, height=${VIEW}"/>
<title>${esc(book.title)} — ${esc(p.label)}</title>
<link rel="stylesheet" type="text/css" href="../css/book.css"/>
</head>
<body class="edition-ebook"${type}>
${x}
</body>
</html>
`;
  fs.writeFileSync(path.join(OEBPS, 'xhtml', fileOf(i)), doc);
});
for (const f of images) fs.copyFileSync(path.join(build, 'art', f), path.join(OEBPS, 'images', f));
for (const [name, svg] of patterns) fs.writeFileSync(path.join(OEBPS, 'images', name), svg);

// ---------------------------------------------------------------- cover images
const browser = await chromium.launch();
async function snapCover(size, file) {
  const page = await browser.newPage({ viewport: { width: VIEW, height: VIEW }, deviceScaleFactor: size / VIEW });
  await page.goto(pathToFileURL(path.join(OEBPS, 'xhtml', idToFile['pg-cover'])).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: VIEW, height: VIEW } });
  await page.close();
}
await snapCover(1600, path.join(OEBPS, 'images', 'cover.jpg'));
fs.mkdirSync(path.join(root, 'dist/ebook'), { recursive: true });
await snapCover(2560, path.join(root, 'dist/ebook', 'cover-2560x2560.jpg'));
await browser.close();

// ---------------------------------------------------------------- navigation
const pageNo = (pdfPage) => fileOf(pdfPage - 1);
const toc = [];
let open = false;
for (const [title, pdfPage, level] of meta.outline) {
  const link = `<a href="xhtml/${pageNo(pdfPage)}">${esc(title)}</a>`;
  if (level === 1) {
    if (!open) {
      toc[toc.length - 1] = toc[toc.length - 1].replace(/<\/li>$/, '<ol>');
      open = true;
    }
    toc.push(`<li>${link}</li>`);
  } else {
    if (open) {
      toc.push('</ol></li>');
      open = false;
    }
    toc.push(`<li>${link}</li>`);
  }
}
if (open) toc.push('</ol></li>');
const firstStory = pages.findIndex((p) => p.id === 'pg-8');
const contents = pages.findIndex((p) => p.id === 'pg-6');
const nav = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head><meta charset="UTF-8"/><title>Contents</title></head>
<body>
<nav epub:type="toc" id="toc"><h1>Contents</h1>
<ol>
${toc.join('\n')}
</ol>
</nav>
<nav epub:type="page-list" id="page-list" hidden="hidden"><h2>Pages</h2>
<ol>
${pages.map((p, i) => `<li><a href="xhtml/${fileOf(i)}">${esc(p.label)}</a></li>`).join('\n')}
</ol>
</nav>
<nav epub:type="landmarks" id="landmarks" hidden="hidden"><h2>Guide</h2>
<ol>
<li><a epub:type="cover" href="xhtml/${fileOf(0)}">Cover</a></li>
<li><a epub:type="toc" href="xhtml/${fileOf(contents)}">Contents</a></li>
<li><a epub:type="bodymatter" href="xhtml/${fileOf(firstStory)}">The Stories</a></li>
</ol>
</nav>
</body>
</html>
`;
fs.writeFileSync(path.join(OEBPS, 'nav.xhtml'), nav);

// ---------------------------------------------------------------- package document
const description = `${plain(backCover.blurb)} ${backCover.points.join('. ')}. ${pub.ageRange}.`;
const manifest = [
  '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
  '<item id="css" href="css/book.css" media-type="text/css"/>',
  '<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>',
  ...[...fonts].map((f, i) => `<item id="font${i + 1}" href="fonts/${f}" media-type="font/ttf"/>`),
  ...[...images, ...patterns.keys()].map((f, i) => `<item id="img${i + 1}" href="images/${f}" media-type="image/svg+xml"/>`),
  ...pages.map((p, i) => `<item id="p${i + 1}" href="xhtml/${fileOf(i)}" media-type="application/xhtml+xml"${hasSvg.has(i) ? ' properties="svg"' : ''}/>`),
];
const side = (p) => (/data-side="L"/.test(p.xhtml) ? 'page-spread-left' : 'page-spread-right');
const modified = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="bookid">urn:uuid:${pub.uuid}</dc:identifier>
  <dc:title id="title">${esc(book.title)}</dc:title>
  <meta refines="#title" property="title-type">main</meta>
  <dc:title id="subtitle">${esc(book.subtitle)}</dc:title>
  <meta refines="#subtitle" property="title-type">subtitle</meta>
  <dc:creator id="author">${esc(pub.author)}</dc:creator>
  <meta refines="#author" property="role" scheme="marc:relators">aut</meta>
  <meta refines="#author" property="file-as">${esc(pub.author.split(' ').reverse().join(', '))}</meta>
  <dc:publisher>${esc(pub.publisher)}</dc:publisher>
  <dc:language>${pub.language}</dc:language>
  <dc:date>${pub.year}</dc:date>
  <dc:rights>© ${pub.year} ${esc(pub.author)}. All rights reserved.</dc:rights>
  <dc:description>${esc(description)}</dc:description>
  <dc:subject>JUVENILE NONFICTION / Religious / Islamic</dc:subject>
  <dc:subject>Quran stories for children</dc:subject>
  ${pub.isbn.ebook ? `<dc:source>urn:isbn:${pub.isbn.ebook}</dc:source>` : ''}
  <meta property="dcterms:modified">${modified}</meta>
  <meta property="rendition:layout">pre-paginated</meta>
  <meta property="rendition:orientation">auto</meta>
  <meta property="rendition:spread">landscape</meta>
  <meta name="cover" content="cover-image"/>
  <!-- Kindle (KDP) fixed-layout hints -->
  <meta name="fixed-layout" content="true"/>
  <meta name="original-resolution" content="${VIEW}x${VIEW}"/>
  <meta name="book-type" content="children"/>
  <meta name="orientation-lock" content="none"/>
  <meta name="primary-writing-mode" content="horizontal-lr"/>
  <meta property="schema:accessMode">textual</meta>
  <meta property="schema:accessMode">visual</meta>
  <meta property="schema:accessModeSufficient">textual,visual</meta>
  <meta property="schema:accessibilityFeature">alternativeText</meta>
  <meta property="schema:accessibilityFeature">tableOfContents</meta>
  <meta property="schema:accessibilityFeature">pageNavigation</meta>
  <meta property="schema:accessibilityFeature">readingOrder</meta>
  <meta property="schema:accessibilityHazard">none</meta>
  <meta property="schema:accessibilitySummary">A fixed-layout picture book. Every page has live, selectable text, every picture has a text description, and the contents and page list link to each story.</meta>
</metadata>
<manifest>
  ${manifest.join('\n  ')}
</manifest>
<spine page-progression-direction="ltr">
  ${pages.map((p, i) => `<itemref idref="p${i + 1}" properties="${side(p)}"/>`).join('\n  ')}
</spine>
</package>
`;
fs.writeFileSync(path.join(OEBPS, 'content.opf'), opf);
fs.writeFileSync(path.join(epubDir, 'mimetype'), 'application/epub+zip');
// Apple Books: use the embedded fonts.
fs.writeFileSync(path.join(epubDir, 'META-INF/com.apple.ibooks.display-options.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<display_options><platform name="*"><option name="specified-fonts">true</option></platform></display_options>
`);
fs.writeFileSync(path.join(epubDir, 'META-INF/container.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>
`);

// ---------------------------------------------------------------- zip (mimetype first, uncompressed)
const epub = path.join(root, 'dist/ebook/The-Best-of-Stories.epub');
fs.rmSync(epub, { force: true });
execFileSync('zip', ['-X0q', epub, 'mimetype'], { cwd: epubDir });
execFileSync('zip', ['-X9rq', epub, 'META-INF', 'OEBPS'], { cwd: epubDir });
console.log(`EPUB: ${path.relative(root, epub)} (${pages.length} pages, ${fonts.size} fonts, ${images.size + patterns.size} images, ${(fs.statSync(epub).size / 1e6).toFixed(1)} MB)`);
