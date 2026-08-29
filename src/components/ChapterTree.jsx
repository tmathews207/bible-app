// Expandable/collapsible list of books, each expanding into a tile grid of
// chapters. Expansion is controlled by the parent (via expandedBooks +
// onToggleBook) so a "collapse all" button elsewhere can drive it.
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
              <span className="chapter-tree-book-count">{book.chapters} ch.</span>
            </button>

            {isOpen && (
              <div className="chapter-tile-grid">
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) =>
                  renderChapter(book.name, chapter)
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
