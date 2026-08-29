import NavBar from '../components/NavBar';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAdmin } = useAuth();

  return (
    <>
      <NavBar variant="home" />
      <main className="page home-page">
        <h1>Bible Reading &amp; Journal</h1>
        <div className="home-card-grid">
          <Card to="/reading-plan" label="Reading Plan" imageSrc="/cards/reading-plan.jpg" />
          <Card to="/calendar" label="Calendar" imageSrc="/cards/calendar.jpg" />
          <Card to="/journal" label="Journal" imageSrc="/cards/journal.jpg" />

          {isAdmin && (
            <>
              <Card to="/admin/reading-plan" label="Edit Reading Plan" imageSrc="/cards/edit-plan.jpg" />
              <Card to="/admin/journal" label="New / Edit Journal Entry" imageSrc="/cards/edit-journal.jpg" />
              <Card to="/admin/users" label="Manage Users" imageSrc="/cards/users.jpg" />
            </>
          )}
        </div>
      </main>
    </>
  );
}
