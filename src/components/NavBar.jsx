import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// On the home page there's only a link to the domain root (no page links).
// Every other page gets the full nav, plus admin links when logged in.
export default function NavBar({ variant = 'inner', domainLabel = 'Bible Journal' }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <Link to="/" className="navbar-brand">{domainLabel}</Link>

        {variant === 'inner' && (
          <div className="navbar-links">
            <Link to="/reading-plan">Reading Plan</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/journal">Journal</Link>
            {isAdmin && (
              <>
                <span className="navbar-divider" aria-hidden="true" />
                <Link to="/admin/journal">New / Edit Entry</Link>
                <Link to="/admin/reading-plan">Edit Plan</Link>
                <Link to="/admin/users">Manage Users</Link>
              </>
            )}
            <span className="navbar-divider" aria-hidden="true" />
            {user ? (
              <button type="button" className="navbar-linklike" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <Link to="/login">Log in</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
