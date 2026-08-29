import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return children;
}
