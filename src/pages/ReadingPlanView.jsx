import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ChapterTree from '../components/ChapterTree';
import RichTextView from '../components/RichTextView';
import { chapterKey } from '../data/bibleBooks';
import { subscribeReadingPlan } from '../services/readingPlan';
import { subscribeAllJournalEntries } from '../services/journal';
import { aggregateChapterNotes, entryDatesForChapter, getReadPlanKeySet } from '../utils/progress';

// Group the (already order-sorted) plan items into books, in the order each
// book first appears in the reading sequence -- not canonical Bible order --
// and keep each book's chapters in plan order too. Books/chapters with no
// entry in the plan are omitted entirely.
function groupPlanByBook(planItems) {
  const books = [];
  const byName = new Map();
  for (const item of planItems) {
    let book = byName.get(item.book);
    if (!book) {
      book = { name: item.book, chapterNumbers: [] };
      byName.set(item.book, book);
      books.push(book);
    }
    book.chapterNumbers.push(item.chapter);
  }
  return books;
}

export default function ReadingPlanView() {
  const [planItems, setPlanItems] = useState([]);
  const [entries, setEntries] = useState([]);
  const [expandedBooks, setExpandedBooks] = useState(new Set());
  const [expandedChapter, setExpandedChapter] = useState(null); // { book, chapter }

  useEffect(() => subscribeReadingPlan(setPlanItems), []);
  useEffect(() => subscribeAllJournalEntries(setEntries), []);

  const planBooks = useMemo(() => groupPlanByBook(planItems), [planItems]);
  const planOrder = new Map(planItems.map((i) => [chapterKey(i.book, i.chapter), i.order]));
  const readKeys = getReadPlanKeySet(planItems, entries);
  const chapterNotes = aggregateChapterNotes(entries);

  const toggleBook = (name) => {
    setExpandedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const collapseAll = () => {
    setExpandedBooks(new Set());
    setExpandedChapter(null);
  };

  const expandAll = () => {
    setExpandedBooks(new Set(planBooks.map((b) => b.name)));
  };

  const renderChapter = (book, chapter) => {
    const key = chapterKey(book, chapter);
    const notes = chapterNotes.get(key) ?? [];
    const isOpen = expandedChapter?.book === book && expandedChapter?.chapter === chapter;
    const order = planOrder.get(key);
    const wasRead = readKeys.has(key);

    return (
      <button
        type="button"
        key={chapter}
        className={`chapter-tile ${isOpen ? 'selected' : ''} ${wasRead ? 'read' : ''}`}
        onClick={() => setExpandedChapter(isOpen ? null : { book, chapter })}
        title={wasRead ? 'Read' : 'Not read yet'}
      >
        {wasRead && <span className="chapter-tile-read-check" aria-hidden="true">&#10003;</span>}
        <span className="chapter-tile-chapter">{chapter}</span>
        {order ? <span className="chapter-tile-order">#{order}</span> : null}
        {notes.length > 0 && (
          <span className="chapter-tile-note-count">{notes.length} note{notes.length === 1 ? '' : 's'}</span>
        )}
      </button>
    );
  };

  const expandedNotes = expandedChapter
    ? chapterNotes.get(chapterKey(expandedChapter.book, expandedChapter.chapter)) ?? []
    : [];
  const expandedEntryDates = expandedChapter
    ? entryDatesForChapter(entries, expandedChapter.book, expandedChapter.chapter)
    : [];

  return (
    <>
      <NavBar />
      <main className="page">
        <div className="page-header-row">
          <h1>Reading Plan</h1>
          {planBooks.length > 0 && (
            <div className="page-header-actions">
              <button type="button" onClick={expandAll}>Expand all</button>
              <button type="button" onClick={collapseAll}>Collapse all</button>
            </div>
          )}
        </div>

        {planBooks.length === 0 ? (
          <p className="empty-note">No reading plan chapters have been added yet.</p>
        ) : (
          <ChapterTree
            books={planBooks}
            expandedBooks={expandedBooks}
            onToggleBook={toggleBook}
            renderChapter={renderChapter}
          />
        )}

        {expandedChapter && (
          <div className="chapter-detail-panel">
            <h2>{expandedChapter.book} {expandedChapter.chapter}</h2>
            {expandedNotes.length === 0 ? (
              <p className="empty-note">No notes for this chapter yet.</p>
            ) : (
              expandedNotes.map((n, i) => (
                <div className="chapter-note" key={`${n.date}-${i}`}>
                  <div className="chapter-note-date">{n.date}</div>
                  <RichTextView html={n.note} />
                </div>
              ))
            )}
            {expandedEntryDates.length > 0 && (
              <div className="chapter-entry-links">
                <strong>Journal entries that read this chapter:</strong>
                <ul>
                  {expandedEntryDates.map((date) => (
                    <li key={date}>
                      <Link to={`/journal/${date}`}>{date}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
