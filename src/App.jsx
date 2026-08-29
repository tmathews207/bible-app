import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ReadingPlanView from './pages/ReadingPlanView';
import Calendar from './pages/Calendar';
import JournalLog from './pages/JournalLog';
import JournalEntryView from './pages/JournalEntryView';
import Login from './pages/Login';
import ReadingPlanEditor from './pages/ReadingPlanEditor';
import JournalEntryEditor from './pages/JournalEntryEditor';
import AdminUsers from './pages/AdminUsers';

// HashRouter avoids any server-side rewrite requirements on GitHub Pages,
// which serves this as a static project site at /bible-app/.
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reading-plan" element={<ReadingPlanView />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/journal" element={<JournalLog />} />
          <Route path="/journal/:date" element={<JournalEntryView />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/reading-plan"
            element={<ProtectedRoute><ReadingPlanEditor /></ProtectedRoute>}
          />
          <Route
            path="/admin/journal"
            element={<ProtectedRoute><JournalEntryEditor /></ProtectedRoute>}
          />
          <Route
            path="/admin/journal/:date"
            element={<ProtectedRoute><JournalEntryEditor /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute><AdminUsers /></ProtectedRoute>}
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
