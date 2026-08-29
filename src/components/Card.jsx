import { Link } from 'react-router-dom';

// Home page tile: an image you supply plus a label, linking to a page.
// Drop image files in /public/cards/ and pass e.g. imageSrc="/cards/plan.jpg".
export default function Card({ to, label, imageSrc, imageAlt }) {
  return (
    <Link to={to} className="home-card">
      <div className="home-card-image">
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt ?? ''} />
        ) : (
          <div className="home-card-image-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="home-card-label">{label}</div>
    </Link>
  );
}
