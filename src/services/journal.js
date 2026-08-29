import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'journalEntries';

// Doc id is the date string, e.g. "2026-08-29", so there can only ever be
// one entry per day and lookups by date are direct gets.
export function entryRef(date) {
  return doc(db, COLLECTION, date);
}

export async function getJournalEntry(date) {
  const snap = await getDoc(entryRef(date));
  return snap.exists() ? { date, ...snap.data() } : null;
}

export function subscribeJournalEntry(date, callback) {
  return onSnapshot(entryRef(date), (snap) => {
    callback(snap.exists() ? { date, ...snap.data() } : null);
  });
}

export function subscribeAllJournalEntries(callback) {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ date: d.id, ...d.data() })));
  });
}

// entry shape:
// {
//   chaptersRead: [{ book, chapter }],
//   proverbsRead: [{ chapter, verses: [n, ...] }],
//   psalmsRead: [{ chapter, verses: [n, ...] }],
//   focusLevel: 1-5,
//   notes: '<html>',
//   chapterNotes: [{ book, chapter, note: '<html>' }],
// }
export async function saveJournalEntry(date, entry) {
  const existing = await getDoc(entryRef(date));
  const payload = {
    ...entry,
    createdAt: existing.exists() ? existing.data().createdAt : Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(entryRef(date), payload);
  return { date, ...payload };
}
