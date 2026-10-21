// Front matter, back matter and the other one-off pages.
import { framedPage, partColors, markup, duaBlock, frameVars, corners, folio } from './pages.js';
import { star8Svg, divider, lessonIcon, duaIcon } from './ornaments.js';
import { book, parentsNote as note, aboutBook as about, belongsTo as owner, prophets, moreProphets as more, closingDua as cdua, goodnight as gn, littleEyes, backCover as bc, thankYou as thanks } from '../content/book.js';
import { publishing as pub } from '../content/publishing.js';
import { duaArabic } from '../content/quran.js';

const [ACC, TINT] = partColors.front;
const img = (src, cls = 'bg') => (src ? `<img class="${cls}" src="${src}" alt="">` : '');

export function cover(art) {
  return `<section class="page cover">${img(art['cover'])}
  <div class="cover-title">
    <div class="cover-ar" lang="ar" dir="rtl">${duaArabic([[12, 3, 'أَحۡسَنَ', 'ٱلۡقَصَصِ']])}</div>
    <h1>The Best<br>of Stories</h1>
    <div class="cover-sub">${book.subtitle}</div>
  </div>
  <div class="cover-badge"><span>42</span>stories</div>
  <div class="cover-author">${pub.author}</div>
</section>`;
}

export function endpaper(art) {
  return `<section class="page endpaper">${img(art['endpaper'])}</section>`;
}

export function titlePage(art) {
  return `<section class="page titlepage">${img(art['title'])}
  <div class="tp-wrap">
    <div class="tp-verse" lang="ar" dir="rtl">${duaArabic(book.titleVerse.seg)}</div>
    <div class="tp-verse-en">${book.titleVerse.en} <span>Surah Yusuf 12:3</span></div>
    <h1>The Best<br>of Stories</h1>
    ${divider('#C9922E', 240)}
    <div class="tp-sub">${book.subtitle}</div>
    <div class="tp-small">Retold from the Holy Quran<br>with pictures to love</div>
    <div class="tp-author"><span>by</span> ${pub.author}</div>
  </div>
</section>`;
}

export function copyrightPage(n, edition = 'print') {
  const isbns = Object.entries(pub.isbn).filter(([, v]) => v);
  const body = `<div class="cr">
    <div class="cr-title">${book.title}</div>
    <div class="cr-sub">${book.subtitle}</div>
    <p>Text and illustrations © ${pub.year} ${pub.author}. All rights reserved.</p>
    <p>No part of this book may be reproduced, stored or shared in any form or by any means — print, electronic, photocopying, recording or otherwise — without written permission from the author, except for brief quotations in reviews.</p>
    ${edition === 'ebook' ? '<p>This digital edition is for the personal use of the buyer’s family. Please do not share, upload or resell the file. JazakAllahu khayran for respecting the work that went into it.</p>' : ''}
    <p>${pub.edition}, ${pub.year}. ${pub.publisher}.</p>
    ${isbns.length ? `<p>${isbns.map(([k, v]) => `ISBN ${v} (${k})`).join('<br>')}</p>` : ''}
    ${pub.website || pub.email ? `<p>${[pub.website, pub.email].filter(Boolean).join(' · ')}</p>` : ''}
    ${divider('#C9922E', 150)}
    <p><b>The Quran.</b> The Arabic text of the duas and verses is reproduced word for word from the Uthmani script of the King Fahd Complex for the Printing of the Holy Quran, as published in the open <i>quran-json</i> dataset by Risan Bagja Pradana (CC BY-SA 4.0). Verse numbers follow the Madinah Mushaf (Hafs ‘an ‘Asim). The transliterations and simple English meanings are the author’s own renderings for children.</p>
    <p><b>The stories</b> are simplified retellings for young children. For full meanings, please turn to the Quran and its trusted commentaries (tafsir).</p>
    <p><b>Typefaces:</b> Fraunces, Nunito, Amiri, Amiri Quran, Aref Ruqaa and Baloo 2, used under the SIL Open Font License 1.1.</p>
    <p class="cr-respect">This book contains verses of the Holy Quran. Please handle it with care and keep it in a clean place.</p>
  </div>`;
  return framedPage({ accent: ACC, tint: TINT, page: n, body, cls: 'copyright-page' });
}

export function belongsTo(n) {
  const body = `
  <div class="bismillah" lang="ar" dir="rtl">${duaArabic(book.bismillah.seg)}</div>
  <div class="bismillah-en">${book.bismillah.en}</div>
  <div class="owner"><div class="apex">${star8Svg(ACC, { size: 30, extra: '<circle cx="12" cy="12" r="3.6" fill="#FBF5EA"/>' })}</div>
    <div class="owner-lbl">${owner.title}</div>
    <div class="owner-line big"></div>
    ${owner.lines.map((l) => `<div class="owner-lbl small">${l}</div><div class="owner-line"></div>`).join('')}
  </div>
  <div class="owner-foot">${star8Svg(ACC, { size: 14 })}<span>A gift from Allah, and a gift of stories</span>${star8Svg(ACC, { size: 14 })}</div>`;
  return framedPage({ accent: ACC, tint: TINT, page: 0, body, cls: 'belongs-page' });
}

export function parentsNote(n) {
  const body = `<h1>${note.title}</h1>${divider(ACC, 200)}
  <div class="prose note">
    ${note.paras.map((p) => `<p>${markup(p)}</p>`).join('')}
    <div class="ages-title">${note.agesTitle}</div>
    <div class="ages">${note.ages.map(([age, tip]) => `<div class="age"><div class="age-k">${age}</div><div class="age-v">${markup(tip)}</div></div>`).join('')}</div>
    <p class="note-close">${markup(note.closing)}</p>
  </div>`;
  return framedPage({ accent: ACC, tint: TINT, page: n, body, cls: 'note-page' });
}

export function aboutPage(n) {
  const tick = star8Svg(ACC, { size: 13 });
  const body = `<h1>${about.title}</h1>${divider(ACC, 200)}
  <div class="prose about">
    <ul>${about.points.map((p) => `<li>${tick}${markup(p)}</li>`).join('')}</ul>
    <div class="map">${about.map.map(([k, v]) => `<div class="map-i"><div class="map-k">${k}</div><div class="map-v">${markup(v)}</div></div>`).join('')}</div>
  </div>`;
  return framedPage({ accent: ACC, tint: TINT, page: n, body, cls: 'about-page' });
}

export function prophetsArt(art) {
  const cells = prophets
    .map(([en, ar], i) => `<div class="pcell"><div class="plamp">${lampSvg(i)}</div><div class="par" lang="ar" dir="rtl">${ar}</div><div class="pen">${en}${i === 24 ? ' <span class="saw">ﷺ</span>' : ''}</div></div>`)
    .join('');
  return `<section class="page prophets-page">${img(art['prophets'])}
  <div class="pp-head"><div class="pp-kicker">Peace be upon them all</div><h1>The 25 Prophets<br>Named in the Quran</h1></div>
  <div class="pgrid">${cells}</div>
</section>`;
}

function lampSvg(i) {
  const hues = ['#F7C24F', '#F49A8A', '#97DCDD', '#C9B3E3', '#A8D58E'];
  const glass = hues[i % 5];
  return `<svg viewBox="0 0 60 92" width="40" height="61" aria-hidden="true">
    <defs><radialGradient id="lg${i}"><stop offset="0" stop-color="${glass}" stop-opacity="0.75"/><stop offset="1" stop-color="${glass}" stop-opacity="0"/></radialGradient></defs>
    <circle cx="30" cy="54" r="30" fill="url(#lg${i})"/>
    <path d="M30 0 V12" stroke="#E5A232" stroke-width="2"/>
    <circle cx="30" cy="14" r="3.5" fill="none" stroke="#E5A232" stroke-width="2"/>
    <path d="M21 19 H39 L44 29 H16Z" fill="#E5A232"/>
    <path d="M14 29 H46 L48 66 L30 78 L12 66Z" fill="${glass}"/>
    <path d="M24 29 L23 70 M36 29 L37 70" stroke="#C27F22" stroke-width="1.6" opacity="0.8"/>
    <path d="M12 66 H48 L30 78Z" fill="#C27F22"/>
    <path d="M30 78 V86" stroke="#E5A232" stroke-width="2"/><circle cx="30" cy="88" r="3" fill="#E5A232"/>
    <ellipse cx="21" cy="44" rx="2.6" ry="7" fill="#fff" opacity="0.55"/>
  </svg>`;
}

export function moreProphets(n) {
  const [acc, tint] = partColors.p10;
  const body = `<h1>${more.title}</h1>${divider(acc, 200)}
  <div class="prose more">
    <p class="intro">${markup(more.intro)}</p>
    ${more.list.map(([name, txt, ref]) => `<div class="mp"><div class="mp-name">${markup(name)}</div><div class="mp-txt">${markup(txt)} <span class="mp-ref">${ref}</span></div></div>`).join('')}
    <p class="outro">${markup(more.closing)}</p>
  </div>`;
  return framedPage({ accent: acc, tint, page: n, body, cls: 'more-page' });
}

export function closingDua(n, art) {
  const ar = duaArabic(cdua.seg);
  return `<section class="page closing-page">${img(art['closing'])}
  <div class="cd-wrap">
    <h1>${cdua.title}</h1>
    ${divider('#E9C77E', 220)}
    <div class="cd-intro">${cdua.intro}</div>
    <div class="cd-ar" lang="ar" dir="rtl">${ar}</div>
    <div class="cd-tr">${cdua.tr}</div>
    <div class="cd-en">“${cdua.en}”</div>
    <div class="cd-ref">Surah al-Furqan 25:74</div>
  </div>
</section>`;
}

export function goodnight(art) {
  return `<section class="page goodnight-page">${img(art['goodnight'])}
  <div class="gn-wrap">
    <h1>${gn.title}</h1>
    <p>${gn.text}</p>
    <div class="gn-dua">
      <div class="gn-ar" lang="ar" dir="rtl">${gn.duaAr}</div>
      <div class="gn-tr">${gn.duaTr}</div>
      <div class="gn-en">“${gn.duaEn}” <span>${gn.duaRef}</span></div>
    </div>
  </div>
</section>`;
}

export function littleEyesIntro(art) {
  return `<section class="page eyes-intro">${img(art['eyes'])}
  <div class="ei-wrap">
    <div class="ei-kicker">For our newest readers</div>
    <h1>${littleEyes.title}</h1>
    ${littleEyes.text.map((t) => `<p>${t}</p>`).join('')}
  </div>
</section>`;
}

export const littleEyesPages = () => littleEyes.pages;

export function highContrast(word, key, n, art) {
  const dark = littleEyes.pages.find(([, k]) => k === key)[2];
  return `<section class="page hc-page ${dark ? 'hc-dark' : 'hc-light'}">${img(art['hc-' + key])}
  <div class="hc-word"><span>${word}</span></div>
</section>`;
}

export function backCover(art) {
  return `<section class="page back-cover">${img(art['back'])}
  <div class="bc-wrap">
    <h2>The Best of Stories</h2>
    <p class="bc-blurb">${markup(bc.blurb)}</p>
    <ul>${bc.points.map((p) => `<li>${star8Svg('#E9C77E', { size: 12 })}<span>${p}</span></li>`).join('')}</ul>
    <div class="bc-tag">${bc.tagline} · ${pub.ageRange}</div>
  </div>
  <div class="bc-author">${pub.author}</div>
</section>`;
}

export function thankYouPage(art) {
  return `<section class="page endpaper thanks">${img(art['endpaper'])}
  <div class="ty-card">
    <div class="ty-title">${thanks.title}</div>
    ${divider('#C9922E', 150)}
    ${thanks.paras.map((p) => `<p>${markup(p)}</p>`).join('')}
    <div class="ty-sign">— ${pub.author}</div>
  </div>
</section>`;
}

// Inside back cover: the endpaper pattern with a small "about this book" card.
export function colophon(art) {
  return `<section class="page endpaper colophon">${img(art['endpaper'])}
  <div class="col-card">
    <div class="col-title">About this book</div>
    ${divider('#C9922E', 150)}
    <p>The stories are retold for little ones from the Holy Quran; each page lists the surahs and verses to read in full. A few details come from Sahih al-Bukhari, Sahih Muslim and the books of seerah, and are marked where they appear.</p>
    <p>The Arabic duas are taken word for word from the Uthmani text of the King Fahd Complex for the Printing of the Holy Quran, via the open <i>quran-json</i> dataset (CC BY-SA 4.0).</p>
    <p>No prophet, angel or person is pictured. Illustrations were drawn especially for this book.</p>
    <p class="col-small">Typeset in Fraunces, Nunito, Amiri, Amiri Quran, Aref Ruqaa and Baloo 2 (SIL Open Font License).</p>
  </div>
</section>`;
}
