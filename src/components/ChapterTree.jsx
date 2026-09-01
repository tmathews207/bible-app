// Expandable/collapsible list of books, each expanding into a tile grid of
// chapters. Expansion is controlled by the parent (via expandedBooks +
// onToggleBook) so a "collapse all" button elsewhere can drive it.
//
// Each book supplies its own explicit `chapterNumbers` array (rather than
// this component always deriving 1..N) so callers can show either the full
// canon in order (admin editors) or a filtered, reading-plan-ordered subset
// (the public reading plan view).
export default function ChapterTree({
  books,
  expandedBooks,
  onToggleBook,
  renderChapter,
}) {
  return (
    <div className="chapter-tree">
      {books.map((book) => {
        const isOpen = expandedBooks.has(book.name);
        return (
          <div className="chapter-tree-book" key={book.name}>
            <button
              type="button"
              className="chapter-tree-book-header"
              onClick={() => onToggleBook(book.name)}
              aria-expanded={isOpen}
            >
              <span className={`chapter-tree-caret ${isOpen ? 'open' : ''}`} aria-hidden="true">
                &#9656;
              </span>
              <span className="chapter-tree-book-name">{book.name}</span>
              <span className="chapter-tree-book-count">{book.chapterNumbers.length} ch.</span>
            </button>

            {isOpen && (
              <div className="chapter-tile-grid">
                {book.chapterNumbers.map((chapter) => renderChapter(book.name, chapter))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
