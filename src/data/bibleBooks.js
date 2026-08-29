// Standard 66-book canon. Chapter divisions are the same across essentially
// all modern English translations (including ESV), so this data is
// translation-agnostic. No copyrighted verse text is stored anywhere here —
// only structural counts (how many chapters/verses exist).

export const OLD_TESTAMENT = [
  ['Genesis', 50], ['Exodus', 40], ['Leviticus', 27], ['Numbers', 36],
  ['Deuteronomy', 34], ['Joshua', 24], ['Judges', 21], ['Ruth', 4],
  ['1 Samuel', 31], ['2 Samuel', 24], ['1 Kings', 22], ['2 Kings', 25],
  ['1 Chronicles', 29], ['2 Chronicles', 36], ['Ezra', 10], ['Nehemiah', 13],
  ['Esther', 10], ['Job', 42], ['Psalms', 150], ['Proverbs', 31],
  ['Ecclesiastes', 12], ['Song of Solomon', 8], ['Isaiah', 66], ['Jeremiah', 52],
  ['Lamentations', 5], ['Ezekiel', 48], ['Daniel', 12], ['Hosea', 14],
  ['Joel', 3], ['Amos', 9], ['Obadiah', 1], ['Jonah', 4],
  ['Micah', 7], ['Nahum', 3], ['Habakkuk', 3], ['Zephaniah', 3],
  ['Haggai', 2], ['Zechariah', 14], ['Malachi', 4],
];

export const NEW_TESTAMENT = [
  ['Matthew', 28], ['Mark', 16], ['Luke', 24], ['John', 21],
  ['Acts', 28], ['Romans', 16], ['1 Corinthians', 16], ['2 Corinthians', 13],
  ['Galatians', 6], ['Ephesians', 6], ['Philippians', 4], ['Colossians', 4],
  ['1 Thessalonians', 5], ['2 Thessalonians', 3], ['1 Timothy', 6], ['2 Timothy', 4],
  ['Titus', 3], ['Philemon', 1], ['Hebrews', 13], ['James', 5],
  ['1 Peter', 5], ['2 Peter', 3], ['1 John', 5], ['2 John', 1],
  ['3 John', 1], ['Jude', 1], ['Revelation', 22],
];

// [book name, chapter count]
export const BIBLE_BOOKS = [...OLD_TESTAMENT, ...NEW_TESTAMENT].map(
  ([name, chapters]) => ({ name, chapters })
);

export function bookNames() {
  return BIBLE_BOOKS.map((b) => b.name);
}

export function chapterCount(book) {
  return BIBLE_BOOKS.find((b) => b.name === book)?.chapters ?? 0;
}

// Verse counts per chapter, standard modern English versification
// (matches ESV, NIV, NASB). Index 0 = chapter 1.
export const PSALMS_VERSE_COUNTS = [
  6, 12, 8, 8, 12, 10, 17, 9, 20, 18,
  7, 8, 6, 7, 5, 11, 15, 50, 14, 9,
  13, 31, 6, 10, 22, 12, 14, 9, 11, 12,
  24, 11, 22, 22, 28, 12, 40, 22, 13, 17,
  13, 11, 5, 26, 17, 11, 9, 14, 20, 23,
  19, 9, 6, 7, 23, 13, 11, 11, 17, 12,
  8, 12, 11, 10, 13, 20, 7, 35, 36, 5,
  24, 20, 28, 23, 10, 12, 20, 72, 13, 19,
  16, 8, 18, 12, 13, 17, 7, 18, 52, 17,
  16, 15, 5, 23, 11, 13, 12, 9, 9, 5,
  8, 28, 22, 35, 45, 48, 43, 13, 31, 7,
  10, 10, 9, 8, 18, 19, 2, 29, 176, 7,
  8, 9, 4, 8, 5, 6, 5, 6, 8, 8,
  3, 18, 3, 3, 21, 26, 9, 8, 24, 13,
  10, 7, 12, 15, 21, 10, 20, 14, 9, 6,
];

export const PROVERBS_VERSE_COUNTS = [
  33, 22, 35, 27, 23, 35, 27, 36, 18, 32,
  31, 28, 25, 35, 33, 33, 28, 24, 29, 30,
  31, 29, 35, 34, 28, 28, 27, 28, 27, 33,
  31,
];

export function versesInChapter(book, chapter) {
  if (book === 'Psalms') return PSALMS_VERSE_COUNTS[chapter - 1] ?? 0;
  if (book === 'Proverbs') return PROVERBS_VERSE_COUNTS[chapter - 1] ?? 0;
  return 0;
}

// Stable, sortable key for a single chapter, used as Firestore doc/array id.
export function chapterKey(book, chapter) {
  return `${book}__${chapter}`;
}
