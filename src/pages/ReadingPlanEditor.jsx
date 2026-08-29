import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import ChapterTree from '../components/ChapterTree';
import { BIBLE_BOOKS, chapterKey } from '../data/bibleBooks';
import { getReadingPlan, saveReadingPlan } from '../services/readingPlan';

export default function ReadingPlanEditor() {
  const [items, setItems] = useState([]);
  const [expandedBooks, setExpandedBooks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getReadingPlan().then((plan) => {
      setItems(plan);
      setLoading(false);
    });
  }, []);

  const keyOf = (item) => chapterKey(item.book, item.chapter);
  const assignedKeys = new Map(items.map((item) => [keyOf(item), item.order]));

  const toggleBook = (name) => {
    setExpandedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const renumber = (list) => list.map((item, i) => ({ ...item, order: i + 1 }));

  const handleChapterClick = (book, chapter) => {
    const key = chapterKey(book, chapter);
    setDirty(true);
    if (assignedKeys.has(key)) {
      setItems((prev) => renumber(prev.filter((i) => keyOf(i) !== key)));
    } else {
      setItems((prev) => renumber([...prev, { book, chapter, order: prev.length + 1 }]));
    }
  };

  const move = (index, direction) => {
    setDirty(true);
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return renumber(next);
    });
  };

  const remove = (index) => {
    setDirty(true);
    setItems((prev) => renumber(prev.filter((_, i) => i !== index)));
  };

  const handleSave = async () => {
    setSaving(true);
    const saved = await saveReadingPlan(items);
    setItems(saved);
    setDirty(false);
    setSaving(false);
  };

  const renderChapter = (book, chapter) => {
    const key = chapterKey(book, chapter);
    const order = assignedKeys.get(key);
    return (
      <button
        type="button"
        key={chapter}
        className={`chapter-tile ${order ? 'selected' : ''}`}
        onClick={() => handleChapterClick(book, chapter)}
      >
        <span className="chapter-tile-chapter">{chapter}</span>
        {order ? <span className="chapter-tile-order">#{order}</span> : null}
      </button>
    );
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <>
      <NavBar />
      <main className="page reading-plan-editor">
        <div className="page-header-row">
          <h1>Edit Reading Plan</h1>
          <button type="button" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? 'Saving...' : dirty ? 'Save changes' : 'Saved'}
          </button>
        </div>
        <p className="hint-text">
          Click a chapter to add it to the end of your reading order. Click an already-added
          chapter to remove it. Use the order list below to reorder.
        </p>

        <div className="reading-plan-editor-layout">
          <ChapterTree
            books={BIBLE_BOOKS}
            expandedBooks={expandedBooks}
            onToggleBook={toggleBook}
            renderChapter={renderChapter}
          />

          <div className="reading-plan-order-list">
            <h2>Reading order ({items.length})</h2>
            {items.length === 0 && <p className="empty-note">No chapters assigned yet.</p>}
            <ol>
              {items.map((item, index) => (
                <li key={keyOf(item)} className="reading-plan-order-item">
                  <span className="reading-plan-order-number">{item.order}</span>
                  <span className="reading-plan-order-name">{item.book} {item.chapter}</span>
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>&uarr;</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}>&darr;</button>
                  <button type="button" className="danger" onClick={() => remove(index)}>Remove</button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}
