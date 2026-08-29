import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ChapterTree from '../components/ChapterTree';
import RichTextView from '../components/RichTextView';
import { BIBLE_BOOKS, chapterKey } from '../data/bibleBooks';
import { subscribeReadingPlan } from '../services/readingPlan';
import { subscribeAllJournalEntries } from '../services/journal';
import { aggregateChapterNotes, entryDatesForChapter, getReadPlanKeySet } from '../utils/progress';

export default function ReadingPlanView() {
  const [planItems, setPlanItems] = useState([]);
  const [entries, setEntries] = useState([]);
  const [expandedBooks, setExpandedBooks] = useState(new Set());
  const [expandedChapter, setExpandedChapter] = useState(null); // { book, chapter }

  useEffect(() => subscribeReadingPlan(setPlanItems), []);
  useEffect(() => subscribeAllJournalEntries(setEntries), []);

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
    setExpandedBooks(new Set(BIBLE_BOOKS.map((b) => b.name)));
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
      >
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
          <div className="page-header-actions">
            <button type="button" onClick={expandAll}>Expand all</button>
            <button type="button" onClick={collapseAll}>Collapse all</button>
          </div>
        </div>

        <ChapterTree
          books={BIBLE_BOOKS}
          expandedBooks={expandedBooks}
          onToggleBook={toggleBook}
          renderChapter={renderChapter}
        />

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
