import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ChapterPicker from '../components/ChapterPicker';
import VersePicker from '../components/VersePicker';
import FocusLevelPicker from '../components/FocusLevelPicker';
import RichTextEditor from '../components/RichTextEditor';
import { BIBLE_BOOKS, chapterCount } from '../data/bibleBooks';
import { subscribeReadingPlan } from '../services/readingPlan';
import { getJournalEntry, saveJournalEntry, subscribeAllJournalEntries } from '../services/journal';
import { getUnreadPlanChapters } from '../utils/progress';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const BLANK_ENTRY = {
  chaptersRead: [],
  proverbsRead: [],
  psalmsRead: [],
  focusLevel: null,
  notes: '',
  chapterNotes: [],
};

export default function JournalEntryEditor() {
  const { date: dateParam } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(dateParam || todayIso());
  const [planItems, setPlanItems] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [entry, setEntry] = useState(BLANK_ENTRY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => subscribeReadingPlan(setPlanItems), []);
  useEffect(() => subscribeAllJournalEntries(setAllEntries), []);

  useEffect(() => {
    setLoading(true);
    getJournalEntry(date).then((existing) => {
      setEntry(existing ? { ...BLANK_ENTRY, ...existing } : BLANK_ENTRY);
      setLoading(false);
    });
  }, [date]);

  const unreadChapters = useMemo(
    () => getUnreadPlanChapters(planItems, allEntries, date),
    [planItems, allEntries, date]
  );

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage('');
    await saveJournalEntry(date, entry);
    setSaving(false);
    setSavedMessage('Saved.');
    navigate(`/admin/journal/${date}`, { replace: true });
  };

  return (
    <>
      <NavBar />
      <main className="page journal-editor">
        <div className="page-header-row">
          <h1>Journal Entry</h1>
          <label className="date-picker">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="journal-editor-form">
            <section className="form-section">
              <h2>Reading plan chapters</h2>
              <ChapterPicker
                chapters={unreadChapters}
                selected={entry.chaptersRead}
                onChange={(chaptersRead) => setEntry((e) => ({ ...e, chaptersRead }))}
              />
            </section>

            <section className="form-section">
              <h2>Proverbs</h2>
              <VersePicker
                book="Proverbs"
                value={entry.proverbsRead}
                onChange={(proverbsRead) => setEntry((e) => ({ ...e, proverbsRead }))}
              />
            </section>

            <section className="form-section">
              <h2>Psalms</h2>
              <VersePicker
                book="Psalms"
                value={entry.psalmsRead}
                onChange={(psalmsRead) => setEntry((e) => ({ ...e, psalmsRead }))}
              />
            </section>

            <section className="form-section">
              <h2>Focus level</h2>
              <FocusLevelPicker
                value={entry.focusLevel}
                onChange={(focusLevel) => setEntry((e) => ({ ...e, focusLevel }))}
              />
            </section>

            <section className="form-section">
              <h2>Notes</h2>
              <RichTextEditor
                value={entry.notes}
                onChange={(notes) => setEntry((e) => ({ ...e, notes }))}
                placeholder="Write about today's reading..."
              />
            </section>

            <section className="form-section">
              <h2>Chapter notes</h2>
              <ChapterNotesEditor
                chapterNotes={entry.chapterNotes}
                onChange={(chapterNotes) => setEntry((e) => ({ ...e, chapterNotes }))}
              />
            </section>

            <div className="journal-editor-save-row">
              <button type="button" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save entry'}
              </button>
              {savedMessage && <span className="saved-message">{savedMessage}</span>}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function ChapterNotesEditor({ chapterNotes, onChange }) {
  const [book, setBook] = useState(BIBLE_BOOKS[0].name);
  const [chapter, setChapter] = useState(1);

  const addNote = () => {
    onChange([...chapterNotes, { book, chapter: Number(chapter), note: '' }]);
  };

  const updateNote = (index, note) => {
    onChange(chapterNotes.map((cn, i) => (i === index ? { ...cn, note } : cn)));
  };

  const removeNote = (index) => {
    onChange(chapterNotes.filter((_, i) => i !== index));
  };

  return (
    <div className="chapter-notes-editor">
      {chapterNotes.map((cn, index) => (
        <div className="chapter-note-block" key={index}>
          <div className="chapter-note-block-header">
            <strong>{cn.book} {cn.chapter}</strong>
            <button type="button" className="link-button danger" onClick={() => removeNote(index)}>
              Remove
            </button>
          </div>
          <RichTextEditor value={cn.note} onChange={(note) => updateNote(index, note)} />
        </div>
      ))}

      <div className="chapter-notes-add-row">
        <select value={book} onChange={(e) => { setBook(e.target.value); setChapter(1); }}>
          {BIBLE_BOOKS.map((b) => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
        <select value={chapter} onChange={(e) => setChapter(Number(e.target.value))}>
          {Array.from({ length: chapterCount(book) }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="button" onClick={addNote}>Add chapter note</button>
      </div>
    </div>
  );
}
