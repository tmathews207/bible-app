import { useState } from 'react';
import { chapterCount, versesInChapter } from '../data/bibleBooks';

// Psalms/Proverbs reading, tracked to the verse level. value is an array of
// { chapter, verses: [numbers] }. You can add more than one chapter per day
// (e.g. finish Psalm 1 and start Psalm 2).
export default function VersePicker({ book, value, onChange }) {
  const [chapterToAdd, setChapterToAdd] = useState('');
  const usedChapters = new Set(value.map((v) => v.chapter));
  const totalChapters = chapterCount(book);

  const addChapter = () => {
    const chapter = Number(chapterToAdd);
    if (!chapter || usedChapters.has(chapter)) return;
    onChange([...value, { chapter, verses: [] }]);
    setChapterToAdd('');
  };

  const removeChapter = (chapter) => {
    onChange(value.filter((v) => v.chapter !== chapter));
  };

  const toggleVerse = (chapter, verse) => {
    onChange(
      value.map((v) => {
        if (v.chapter !== chapter) return v;
        const has = v.verses.includes(verse);
        return {
          ...v,
          verses: has ? v.verses.filter((n) => n !== verse) : [...v.verses, verse].sort((a, b) => a - b),
        };
      })
    );
  };

  const selectAllVerses = (chapter) => {
    const total = versesInChapter(book, chapter);
    onChange(
      value.map((v) =>
        v.chapter === chapter
          ? { ...v, verses: Array.from({ length: total }, (_, i) => i + 1) }
          : v
      )
    );
  };

  const clearVerses = (chapter) => {
    onChange(value.map((v) => (v.chapter === chapter ? { ...v, verses: [] } : v)));
  };

  return (
    <div className="verse-picker">
      {value.map(({ chapter, verses }) => (
        <div className="verse-picker-chapter" key={chapter}>
          <div className="verse-picker-chapter-header">
            <strong>{book} {chapter}</strong>
            <button type="button" className="link-button" onClick={() => selectAllVerses(chapter)}>
              Select all
            </button>
            <button type="button" className="link-button" onClick={() => clearVerses(chapter)}>
              Clear
            </button>
            <button type="button" className="link-button danger" onClick={() => removeChapter(chapter)}>
              Remove chapter
            </button>
          </div>
          <div className="verse-tile-grid">
            {Array.from({ length: versesInChapter(book, chapter) }, (_, i) => i + 1).map(
              (verse) => (
                <button
                  type="button"
                  key={verse}
                  className={`verse-tile ${verses.includes(verse) ? 'selected' : ''}`}
                  onClick={() => toggleVerse(chapter, verse)}
                >
                  {verse}
                </button>
              )
            )}
          </div>
        </div>
      ))}

      <div className="verse-picker-add">
        <select value={chapterToAdd} onChange={(e) => setChapterToAdd(e.target.value)}>
          <option value="">Add {book} chapter...</option>
          {Array.from({ length: totalChapters }, (_, i) => i + 1)
            .filter((c) => !usedChapters.has(c))
            .map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
        </select>
        <button type="button" onClick={addChapter} disabled={!chapterToAdd}>
          Add
        </button>
      </div>
    </div>
  );
}
