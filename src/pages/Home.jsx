import NavBar from '../components/NavBar';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

// import.meta.env.BASE_URL is the configured Vite `base` (see vite.config.js) --
// on GitHub Pages this app is served from a subpath (/bible-app/), so image
// paths must be built from it rather than hardcoded with a leading "/".
const cardImage = (file) => `${import.meta.env.BASE_URL}cards/${file}`;

export default function Home() {
  const { isAdmin } = useAuth();

  return (
    <>
      <NavBar variant="home" />
      <main className="page home-page">
        <h1>Bible Reading &amp; Journal</h1>
        <div className="home-card-grid">
          <Card to="/reading-plan" label="Reading Plan" imageSrc={cardImage('reading-plan.jpg')} />
          <Card to="/calendar" label="Calendar" imageSrc={cardImage('calendar.jpg')} />
          <Card to="/journal" label="Journal" imageSrc={cardImage('journal.jpg')} />

          {isAdmin && (
            <>
              <Card to="/admin/reading-plan" label="Edit Reading Plan" imageSrc={cardImage('edit-plan.jpg')} />
              <Card to="/admin/journal" label="New / Edit Journal Entry" imageSrc={cardImage('edit-journal.jpg')} />
              <Card to="/admin/users" label="Manage Users" imageSrc={cardImage('users.jpg')} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
