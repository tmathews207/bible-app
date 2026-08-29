import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user, isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user && isAdmin) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Login failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="page login-page">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </main>
    </>
  );
}
