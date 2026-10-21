# The Best of Stories — Quran Stories for Little Ones

An illustrated storybook of 42 stories from the Quran, retold gently for reading
aloud to babies and young children, with high-contrast pages for newborn eyes.

**Read it:** [`The-Best-of-Stories.pdf`](The-Best-of-Stories.pdf) — 106 square pages
(8.5 × 8.5 in), with bookmarks for every story. A print-shop version with 0.125 in
bleed is in [`print/`](print/).

## What is inside

- Cover, Bismillah and a "This book belongs to" nameplate, a note for parents, contents
- 42 stories, each a two-page spread: a full-page picture on the left and the story on
  the right, with a little lesson, the Quran references and, for 16 stories, a dua from
  the Quran in Arabic with transliteration and meaning
- The 25 prophets named in the Quran, a dua for your little one and a goodnight page
- *For Little Eyes*: eight black, white and red pictures for the first months

## How it was made with care

- No prophet, angel or person is drawn anywhere; stories are shown through places,
  light, animals and nature.
- Every Arabic dua is cut word-for-word from the Uthmani text in
  `assets/data/quran_en.json` (King Fahd Complex text via the
  [quran-json](https://github.com/risan/quran-json) package) — nothing is retyped by hand.
- Details that come from hadith or the books of seerah are labelled as such.

## Building

Needs Node 18+, Python 3 with `pypdf`, Chromium for Playwright, and `pdftoppm` for
page previews.

```sh
npm install
npm run build                          # build/The-Best-of-Stories.pdf
node tools/build.mjs --bleed           # build/The-Best-of-Stories-print-bleed.pdf
node tools/build.mjs --png             # also renders every page to build/pages/
node tools/preview.mjs s04             # render one illustration to build/preview/
```

## Layout of the repository

| Path | What it holds |
| --- | --- |
| `src/content/stories.js` | the 42 story texts, lessons, references and dua selections |
| `src/content/book.js` | front and back matter text |
| `src/art/lib.js` | the shared illustration kit (palette, sky, plants, animals…) |
| `src/art/scenes/` | one hand-coded SVG illustration per story |
| `src/art/book/` | cover, endpapers, special pages and high-contrast art |
| `src/layout/` | page templates, ornaments and print CSS |
| `tools/` | preview, build and PDF finishing scripts |
| `docs/` | illustration style guide and per-story picture briefs |

Fonts (Fraunces, Nunito, Amiri, Amiri Quran, Aref Ruqaa, Baloo 2…) are open-source
under the SIL Open Font License; their licences are in `assets/fonts/licenses/`.
The Quran text data is licensed CC BY-SA 4.0 (`assets/data/QURAN-JSON-LICENSE.txt`).
