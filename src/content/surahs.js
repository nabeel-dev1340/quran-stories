// Surah names, transliterated the same way as the story references.
const names = [
  'al-Fatihah', 'al-Baqarah', 'Al ‘Imran', 'an-Nisa’', 'al-Ma’idah', 'al-An‘am', 'al-A‘raf', 'al-Anfal', 'at-Tawbah', 'Yunus',
  'Hud', 'Yusuf', 'ar-Ra‘d', 'Ibrahim', 'al-Hijr', 'an-Nahl', 'al-Isra’', 'al-Kahf', 'Maryam', 'Ta-Ha',
  'al-Anbiya’', 'al-Hajj', 'al-Mu’minun', 'an-Nur', 'al-Furqan', 'ash-Shu‘ara’', 'an-Naml', 'al-Qasas', 'al-‘Ankabut', 'ar-Rum',
  'Luqman', 'as-Sajdah', 'al-Ahzab', 'Saba’', 'Fatir', 'Ya-Sin', 'as-Saffat', 'Sad', 'az-Zumar', 'Ghafir',
  'Fussilat', 'ash-Shura', 'az-Zukhruf', 'ad-Dukhan', 'al-Jathiyah', 'al-Ahqaf', 'Muhammad', 'al-Fath', 'al-Hujurat', 'Qaf',
  'adh-Dhariyat', 'at-Tur', 'an-Najm', 'al-Qamar', 'ar-Rahman', 'al-Waqi‘ah', 'al-Hadid', 'al-Mujadilah', 'al-Hashr', 'al-Mumtahanah',
  'as-Saff', 'al-Jumu‘ah', 'al-Munafiqun', 'at-Taghabun', 'at-Talaq', 'at-Tahrim', 'al-Mulk', 'al-Qalam', 'al-Haqqah', 'al-Ma‘arij',
  'Nuh', 'al-Jinn', 'al-Muzzammil', 'al-Muddaththir', 'al-Qiyamah', 'al-Insan', 'al-Mursalat', 'an-Naba’', 'an-Nazi‘at', '‘Abasa',
  'at-Takwir', 'al-Infitar', 'al-Mutaffifin', 'al-Inshiqaq', 'al-Buruj', 'at-Tariq', 'al-A‘la', 'al-Ghashiyah', 'al-Fajr', 'al-Balad',
  'ash-Shams', 'al-Layl', 'ad-Duha', 'ash-Sharh', 'at-Tin', 'al-‘Alaq', 'al-Qadr', 'al-Bayyinah', 'az-Zalzalah', 'al-‘Adiyat',
  'al-Qari‘ah', 'at-Takathur', 'al-‘Asr', 'al-Humazah', 'al-Fil', 'Quraysh', 'al-Ma‘un', 'al-Kawthar', 'al-Kafirun', 'an-Nasr',
  'al-Masad', 'al-Ikhlas', 'al-Falaq', 'an-Nas',
];

export const surahName = (n) => names[n - 1];
