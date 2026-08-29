import { chapterKey } from '../data/bibleBooks';

// Every chapter read across all journal entries, excluding one date if
// given (so editing a day doesn't count that day's own prior selections
// as "already read" and hide them from itself).
export function getReadChapterKeySet(entries, excludeDate) {
  const set = new Set();
  for (const entry of entries) {
    if (entry.date === excludeDate) continue;
    for (const ch of entry.chaptersRead ?? []) {
      set.add(chapterKey(ch.book, ch.chapter));
    }
  }
  return set;
}

// Plan items not yet read, in plan order -- this is the selectable list
// for the journal entry editor's chapter picker.
export function getUnreadPlanChapters(planItems, entries, excludeDate) {
  const readKeys = getReadChapterKeySet(entries, excludeDate);
  return planItems.filter(
    (item) => !readKeys.has(chapterKey(item.book, item.chapter))
  );
}

// Map of "book__chapter" -> true for chapters read anywhere, used by the
// public reading plan view to mark plan progress.
export function getReadPlanKeySet(planItems, entries) {
  const readKeys = getReadChapterKeySet(entries, undefined);
  const planKeys = new Set(planItems.map((i) => chapterKey(i.book, i.chapter)));
  const result = new Set();
  for (const key of readKeys) {
    if (planKeys.has(key)) result.add(key);
  }
  return result;
}

// Verse numbers already read in a given book (Psalms or Proverbs), keyed
// by chapter, excluding one date (the entry being edited).
export function getReadVersesByChapter(entries, book, excludeDate) {
  const field = book === 'Psalms' ? 'psalmsRead' : 'proverbsRead';
  const map = new Map(); // chapter -> Set(verse numbers)
  for (const entry of entries) {
    if (entry.date === excludeDate) continue;
    for (const item of entry[field] ?? []) {
      const set = map.get(item.chapter) ?? new Set();
      for (const v of item.verses ?? []) set.add(v);
      map.set(item.chapter, set);
    }
  }
  return map;
}

// Did this entry include any reading-plan chapters / Proverbs / Psalms?
// Used to render the three progress dots on the calendar.
export function dayDots(entry) {
  return {
    plan: Boolean(entry?.chaptersRead?.length),
    proverbs: Boolean(entry?.proverbsRead?.length),
    psalms: Boolean(entry?.psalmsRead?.length),
  };
}

// Aggregate chapter-specific notes across all entries, grouped by chapter,
// for the public reading plan view (note counts + expandable note list).
export function aggregateChapterNotes(entries) {
  const map = new Map(); // "book__chapter" -> [{ date, note }]
  for (const entry of entries) {
    for (const cn of entry.chapterNotes ?? []) {
      const key = chapterKey(cn.book, cn.chapter);
      const list = map.get(key) ?? [];
      list.push({ date: entry.date, note: cn.note });
      map.set(key, list);
    }
  }
  return map;
}

// Journal entry dates on which a given chapter was read (for the "jump to
// entry" links under a chapter in the reading plan view).
export function entryDatesForChapter(entries, book, chapter) {
  const key = chapterKey(book, chapter);
  return entries
    .filter((e) =>
      (e.chaptersRead ?? []).some((c) => chapterKey(c.book, c.chapter) === key)
    )
    .map((e) => e.date);
}
