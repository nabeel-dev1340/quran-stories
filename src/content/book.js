// Front and back matter for the book. Same inline markup as stories.js.

export const book = {
  title: 'The Best of Stories',
  subtitle: 'Quran Stories for Little Ones',
  // Surah Yusuf 12:3 — "We relate to you the best of stories"
  titleVerse: { seg: [[12, 3, null, 'ٱلۡقَصَصِ']], en: '“We tell you the best of stories.”' },
  bismillah: { seg: [[1, 1, null, null]], en: 'In the name of Allah, the Most Kind, the Most Merciful' },
};

export const parentsNote = {
  title: 'A Note for Parents',
  paras: [
    'Assalamu ‘alaykum — and congratulations on your little one!',
    'This book gathers the stories of the Quran, the stories Allah Himself calls “the best of stories,” and retells them gently, in words made for reading aloud to the very young.',
    'Long before your baby understands the words, they will love the sound of your voice, the rhythm of the stories and the bright pictures. Point to the animals, make the sounds — the ~splashes~ and ~whooshes~ are there for you — and let the lessons grow along with your child.',
  ],
  points: [
    'No prophet, angel or person is drawn anywhere in this book. Their stories are shown through places, light, animals and nature.',
    'Every story lists where it is found in the Quran, so you can read it in full as your child grows. A few details come from authentic hadith and the books of seerah, and these are noted too.',
    'The duas are printed exactly as they appear in the Quran, with an easy transliteration and a simple meaning. Please keep the book in a clean, respectful place.',
    'Stories with difficult moments are told softly, to suit little ears.',
    'After a prophet’s name you will see {as} — we say <i>‘alayhis-salam</i>, “peace be upon him.” After the name of Prophet Muhammad, {saw} means <i>sallallahu ‘alayhi wa sallam</i>.',
  ],
  closing: 'At the very back you will find high-contrast pictures made for newborn eyes — perfect for tummy time right now. May Allah make your child the coolness of your eyes, and make these stories a light in their heart. Ameen.',
};

export const belongsTo = {
  title: 'This book belongs to',
  lines: ['Born on', 'With love from'],
};

// The 25 prophets named in the Quran, in the traditional order.
export const prophets = [
  ['Adam', 'آدم'], ['Idris', 'إدريس'], ['Nuh', 'نوح'], ['Hud', 'هود'], ['Salih', 'صالح'],
  ['Ibrahim', 'إبراهيم'], ['Lut', 'لوط'], ['Isma‘il', 'إسماعيل'], ['Ishaq', 'إسحاق'], ['Ya‘qub', 'يعقوب'],
  ['Yusuf', 'يوسف'], ['Ayyub', 'أيوب'], ['Shu‘ayb', 'شعيب'], ['Musa', 'موسى'], ['Harun', 'هارون'],
  ['Dhul-Kifl', 'ذو الكفل'], ['Dawud', 'داود'], ['Sulayman', 'سليمان'], ['Ilyas', 'إلياس'], ['Al-Yasa‘', 'اليسع'],
  ['Yunus', 'يونس'], ['Zakariyya', 'زكريا'], ['Yahya', 'يحيى'], ['‘Isa', 'عيسى'], ['Muhammad', 'محمد'],
];

export const moreProphets = {
  title: 'More Prophets of Allah',
  intro: 'Allah sent prophets to people everywhere, to teach them to worship Him alone and to be good. Twenty-five of them are named in the Quran. Here are some we have not yet met in this book.',
  list: [
    ['Idris {as}', 'A truthful prophet, patient and good, whom Allah raised to a high place.', '19:56–57 · 21:85'],
    ['Lut {as}', 'Ibrahim’s nephew, who believed with him. He told his people to stop their wicked ways, and Allah saved him and his family.', '21:71–75 · 29:26'],
    ['Ishaq {as} and Ya‘qub {as}', 'Ibrahim’s son and grandson: good leaders who guided people by Allah’s command.', '21:72–73'],
    ['Harun {as}', 'Musa’s brother and helper, who stood by him before Pharaoh.', '20:29–36 · 28:34'],
    ['Dhul-Kifl {as}', 'One of the patient ones, among the very best.', '21:85–86 · 38:48'],
    ['Ilyas {as}', 'He called his people to leave the idol Ba‘l and worship Allah, the Best of Creators.', '37:123–132'],
    ['Al-Yasa‘ {as}', 'Chosen by Allah, and among the best.', '6:86 · 38:48'],
    ['Muhammad {saw}', 'The last of all the prophets, sent as a mercy to all the worlds.', '33:40 · 21:107'],
  ],
  closing: 'We love and honour every one of Allah’s prophets. Peace be upon them all.',
};

export const closingDua = {
  title: 'A Dua for You, Little One',
  intro: 'Every night, we ask Allah for you:',
  seg: [[25, 74, 'رَبَّنَا', null]],
  tr: 'Rabbanā hab lanā min azwājinā wa dhurriyyātinā qurrata a‘yunin waj‘alnā lil-muttaqīna imāmā.',
  en: 'Our Lord, give us joy in our families and our children, and make us leaders of those who are mindful of You.',
};

export const goodnight = {
  title: 'Goodnight, Little One',
  text: 'Alhamdulillah for the best of stories. Now close your eyes, little one. Allah, who never sleeps, is watching over you.',
  // Sahih al-Bukhari 6312 — said before sleeping
  duaAr: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
  duaTr: 'Bismika Allāhumma amūtu wa aḥyā.',
  duaEn: 'In Your name, O Allah, I sleep and I wake.',
  duaRef: 'Sahih al-Bukhari',
};

export const littleEyes = {
  title: 'For Little Eyes',
  text: [
    'In the first months, babies see bold black, white and red best of all.',
    'Hold these pages about 20–30 cm (8–12 inches) from your baby’s face during cuddles or tummy time. Move the page slowly from side to side and watch those eyes follow!',
    'Talk about each picture: “Look — a camel! Allah made the camel!”',
  ],
  // [word, art id, dark background?] for each high-contrast page
  pages: [
    ['Moon', 'moon', true],
    ['Ark', 'ark', false],
    ['Big Fish', 'whale', true],
    ['Camel', 'camel', false],
    ['Ant', 'ant', true],
    ['Ka‘bah', 'kabah', false],
    ['Palm Tree', 'palm', true],
    ['Bird', 'bird', false],
  ],
};

export const backCover = {
  blurb: 'From the very first day of creation to our beloved Prophet Muhammad {saw}, here are 42 stories from the Quran, retold gently for little ones and beautifully illustrated.',
  points: ['Made for reading aloud, from the newborn days onward', 'Quran references for every story', 'Duas in Arabic, transliteration and meaning', 'High-contrast pages for newborn eyes', 'No prophets, angels or people pictured'],
};
