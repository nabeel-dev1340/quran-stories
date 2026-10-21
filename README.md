# The Best of Stories: Quran Stories for Little Ones

By **Nabeel Sharafat**. 42 stories from the Quran, retold gently for reading aloud to babies and young children, with full-page pictures, 16 Quran duas and high-contrast pages for newborns.

## Ready-to-sell files (`dist/`)

| File | What it is | Where it goes |
| --- | --- | --- |
| `dist/ebook/The-Best-of-Stories.pdf` | Ebook PDF, 109 pages with front and back covers, clickable contents and bookmarks | Etsy, Payhip, Gumroad, your own shop; Kindle Create (to make the Kindle edition) |
| `dist/ebook/The-Best-of-Stories.epub` | Fixed-layout EPUB 3: live text, embedded fonts, picture descriptions; passes EPUBCheck with no errors or warnings | Apple Books, Kobo, Google Play Books, Barnes & Noble; KDP (try it in Kindle Previewer) |
| `dist/ebook/cover-2560x2560.jpg` | Ebook cover image | Every ebook store |
| `dist/print/interior-kdp-ingramspark.pdf` | Print interior, 106 pages at 8.625 × 8.75 in (0.125 in bleed on top, bottom and outside edges) | KDP paperback (premium or standard colour), IngramSpark |
| `dist/print/cover-kdp-premium-color.pdf` | Paperback cover wrap, 17.499 × 8.75 in, 0.249 in spine | KDP paperback, premium colour |
| `dist/print/cover-kdp-standard-color.pdf` | Paperback cover wrap, 17.489 × 8.75 in, 0.239 in spine | KDP paperback, standard colour |
| `dist/print/interior-lulu.pdf` | Print interior, 8.75 × 8.75 in (bleed on all four sides) | Lulu |
| `dist/marketing/*.jpg` | Paperback mockup, four look-inside spreads, picture grid, newborn pages and an Amazon A+ banner | Store listings and social media |

The print interior keeps all text at least 0.375 in inside the trim, as KDP requires for books with bleed; the build checks this on every page. Covers leave the bottom-right corner of the back cover clear for the barcode, which KDP adds automatically.

The publishing guide is in [`publishing/`](publishing/):

- [`kdp-step-by-step.md`](publishing/kdp-step-by-step.md) — publishing the paperback and Kindle ebook on Amazon KDP, field by field.
- [`listing.md`](publishing/listing.md) — title, description, keywords, categories, prices, Etsy text and the answers for store forms.
- [`where-to-sell.md`](publishing/where-to-sell.md) — online shops and marketplaces for the US, UK and Europe, Pakistan and India, the Gulf, and Malaysia and Indonesia, with fees and payouts.

## Inside the book

- A title page, copyright page, "This book belongs to" page, a note for parents with a reading guide by age, an About This Book page, and contents
- 42 stories, each a two-page spread: a full-page picture on the left, and on the right the story, a little lesson, Quran references and, for 16 stories, a dua in Arabic with transliteration and meaning
- The 25 prophets named in the Quran, a dua for your little one, a goodnight page, eight high-contrast pages for newborns and a thank-you page

No prophet, angel or person is pictured anywhere. Every Arabic dua is cut word for word from the Uthmani text in `assets/data/quran_en.json` (King Fahd Complex text via the [quran-json](https://github.com/risan/quran-json) dataset); nothing was retyped by hand.

## Changing the book

Most changes are one edit followed by a rebuild:

- **ISBN, website or email on the copyright page:** edit `src/content/publishing.js`.
- **Story text:** `src/content/stories.js`.
- **Front and back matter:** `src/content/book.js`.
- **Pictures:** `src/art/scenes/` and `src/art/book/`.

Then rebuild everything:

```sh
npm install
npm run build            # every file in dist/ (about 30 seconds)
npm run build:ebook      # just the ebook PDF and EPUB
npm run build:print      # just the print interiors and covers
node tools/cover.mjs --spine 0.262 --name ingramspark   # a cover with a printer's exact spine width
```

To build, you need Node 18 or later, Python 3 with `pypdf`, the Chromium browser used by Playwright, and `pdftoppm` (for page previews). To check the EPUB yourself, install EPUBCheck with `pip install epubcheck` and run `epubcheck dist/ebook/The-Best-of-Stories.epub`.

## Repository layout

| Path | What it holds |
| --- | --- |
| `src/content/` | story texts, front and back matter, publishing details, picture descriptions, Quran lookup |
| `src/art/lib.js` | the shared illustration kit (palette, sky, plants, animals…) |
| `src/art/scenes/` | one hand-coded SVG illustration per story |
| `src/art/book/` | cover, endpapers, special pages and high-contrast art |
| `src/layout/` | page templates, ornaments and print CSS |
| `tools/` | build, EPUB, cover, marketing, preview and check scripts |
| `docs/` | illustration style guide and per-story picture briefs |

Fonts (Fraunces, Nunito, Amiri, Amiri Quran, Aref Ruqaa, Baloo 2) are under the SIL Open Font License, which allows embedding them in commercial books and ebooks; their licences are in `assets/fonts/licenses/`. The Quran text data is licensed CC BY-SA 4.0 (`assets/data/QURAN-JSON-LICENSE.txt`) and is credited on the copyright page.
