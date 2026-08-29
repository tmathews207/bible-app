import { chapterKey } from '../data/bibleBooks';

// A queue of next-unread chapters, in reading-plan order. Since chapters
// are always read in plan order, selecting "how far I read today" is a
// single click on the furthest chapter reached -- everything before it in
// the queue is selected automatically. Clicking the current last-selected
// tile again shrinks the selection by one.
export default function ChapterPicker({ chapters, selected, onChange }) {
  const selectedKeys = new Set(selected.map((c) => chapterKey(c.book, c.chapter)));

  // Store only { book, chapter } -- the plan items carry their own
  // `order`/`key`, which would otherwise get frozen into the journal entry
  // and go stale if the plan is ever reordered later.
  const toPlain = (list) => list.map(({ book, chapter }) => ({ book, chapter }));

  const handleClick = (index) => {
    if (index === selected.length - 1) {
      onChange(toPlain(chapters.slice(0, index)));
    } else {
      onChange(toPlain(chapters.slice(0, index + 1)));
    }
  };

  if (chapters.length === 0) {
    return <p className="empty-note">No unread chapters left in the reading plan.</p>;
  }

  return (
    <div className="chapter-picker">
      <div className="chapter-tile-grid">
        {chapters.map((ch, index) => {
          const key = chapterKey(ch.book, ch.chapter);
          const isSelected = selectedKeys.has(key);
          return (
            <button
              type="button"
              key={key}
              className={`chapter-tile ${isSelected ? 'selected' : ''}`}
              onClick={() => handleClick(index)}
            >
              <span className="chapter-tile-book">{ch.book}</span>
              <span className="chapter-tile-chapter">{ch.chapter}</span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="chapter-picker-summary">
          Selected: {selected.length} chapter{selected.length === 1 ? '' : 's'} (
          {selected[0].book} {selected[0].chapter} &ndash;{' '}
          {selected[selected.length - 1].book} {selected[selected.length - 1].chapter})
        </p>
      )}
    </div>
  );
}
