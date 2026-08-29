import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import RichTextView from '../components/RichTextView';
import { subscribeJournalEntry } from '../services/journal';
import { focusLabel } from '../utils/focusLevels';
import { useAuth } from '../contexts/AuthContext';

export default function JournalEntryView() {
  const { date } = useParams();
  const [entry, setEntry] = useState(undefined); // undefined = loading, null = not found
  const { isAdmin } = useAuth();

  useEffect(() => subscribeJournalEntry(date, setEntry), [date]);

  return (
    <>
      <NavBar />
      <main className="page journal-entry-page">
        <div className="page-header-row">
          <h1>{date}</h1>
          {isAdmin && <Link to={`/admin/journal/${date}`}>Edit this entry</Link>}
        </div>

        {entry === undefined && <p>Loading...</p>}

        {entry === null && (
          <p className="empty-note">No journal entry for this day.</p>
        )}

        {entry && (
          <EntryBody entry={entry} />
        )}
      </main>
    </>
  );
}

export function EntryBody({ entry }) {
  return (
    <div className="journal-entry-body">
      {entry.focusLevel ? (
        <p className="journal-entry-focus">
          Focus: <strong>{focusLabel(entry.focusLevel)}</strong>
        </p>
      ) : null}

      {entry.chaptersRead?.length > 0 && (
        <div className="journal-entry-section">
          <h3>Reading plan</h3>
          <ul className="inline-list">
            {entry.chaptersRead.map((c) => (
              <li key={`${c.book}-${c.chapter}`}>{c.book} {c.chapter}</li>
            ))}
          </ul>
        </div>
      )}

      {entry.proverbsRead?.length > 0 && (
        <div className="journal-entry-section">
          <h3>Proverbs</h3>
          <ul className="inline-list">
            {entry.proverbsRead.map((p) => (
              <li key={p.chapter}>Proverbs {p.chapter}: {formatVerses(p.verses)}</li>
            ))}
          </ul>
        </div>
      )}

      {entry.psalmsRead?.length > 0 && (
        <div className="journal-entry-section">
          <h3>Psalms</h3>
          <ul className="inline-list">
            {entry.psalmsRead.map((p) => (
              <li key={p.chapter}>Psalm {p.chapter}: {formatVerses(p.verses)}</li>
            ))}
          </ul>
        </div>
      )}

      {entry.notes && (
        <div className="journal-entry-section">
          <h3>Notes</h3>
          <RichTextView html={entry.notes} />
        </div>
      )}

      {entry.chapterNotes?.length > 0 && (
        <div className="journal-entry-section">
          <h3>Chapter notes</h3>
          {entry.chapterNotes.map((cn, i) => (
            <div className="chapter-note" key={i}>
              <div className="chapter-note-date">{cn.book} {cn.chapter}</div>
              <RichTextView html={cn.note} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatVerses(verses) {
  if (!verses || verses.length === 0) return '';
  const sorted = [...verses].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const v = sorted[i];
    if (v === prev + 1) {
      prev = v;
      continue;
    }
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = v;
    prev = v;
  }
  return ranges.join(', ');
}
