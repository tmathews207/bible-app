import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { subscribeAllJournalEntries } from '../services/journal';
import { focusLabel } from '../utils/focusLevels';
import { EntryBody } from './JournalEntryView';

export default function JournalLog() {
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'blog'

  useEffect(() => subscribeAllJournalEntries(setEntries), []);

  return (
    <>
      <NavBar />
      <main className="page">
        <div className="page-header-row">
          <h1>Journal</h1>
          <div className="calendar-toggle">
            <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
              Individual entries
            </button>
            <button type="button" className={view === 'blog' ? 'active' : ''} onClick={() => setView('blog')}>
              Running log
            </button>
          </div>
        </div>

        {entries.length === 0 && <p className="empty-note">No journal entries yet.</p>}

        {view === 'list' ? (
          <div className="journal-list">
            {entries.map((entry) => (
              <Link to={`/journal/${entry.date}`} key={entry.date} className="journal-list-item">
                <span className="journal-list-date">{entry.date}</span>
                {entry.focusLevel ? (
                  <span className="journal-list-focus">{focusLabel(entry.focusLevel)}</span>
                ) : null}
                <span className="journal-list-counts">
                  {entry.chaptersRead?.length ?? 0} chapter{(entry.chaptersRead?.length ?? 0) === 1 ? '' : 's'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="journal-blog">
            {entries.map((entry) => (
              <article className="journal-blog-entry" key={entry.date}>
                <h2>
                  <Link to={`/journal/${entry.date}`}>{entry.date}</Link>
                </h2>
                <EntryBody entry={entry} />
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
