import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { chapterKey } from '../data/bibleBooks';

// The whole plan lives in one document: an ordered array of chapter refs.
// { items: [{ book, chapter, order }, ...] }
// This comfortably fits Firestore's 1MB doc limit (the entire Bible is
// ~1,189 chapters) and keeps "what's next" a single read.
const PLAN_DOC = doc(db, 'readingPlan', 'plan');

export function subscribeReadingPlan(callback) {
  return onSnapshot(PLAN_DOC, (snap) => {
    const items = snap.exists() ? snap.data().items ?? [] : [];
    callback(sortByOrder(items));
  });
}

export async function getReadingPlan() {
  const snap = await getDoc(PLAN_DOC);
  const items = snap.exists() ? snap.data().items ?? [] : [];
  return sortByOrder(items);
}

export async function saveReadingPlan(items) {
  // Re-number sequentially on save so order is always dense/consistent.
  const normalized = sortByOrder(items).map((item, index) => ({
    ...item,
    order: index + 1,
    key: chapterKey(item.book, item.chapter),
  }));
  await setDoc(PLAN_DOC, { items: normalized, updatedAt: Date.now() });
  return normalized;
}

function sortByOrder(items) {
  return [...items].sort((a, b) => a.order - b.order);
}
