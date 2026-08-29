import DOMPurify from 'dompurify';

// Renders admin-authored HTML (journal notes, chapter notes) safely for
// public visitors. Content is only ever written by the logged-in admin,
// but we still sanitize before it hits the public DOM.
export default function RichTextView({ html, className }) {
  if (!html) return null;
  const clean = DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel'],
  });
  return (
    <div
      className={`rich-text-view ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
