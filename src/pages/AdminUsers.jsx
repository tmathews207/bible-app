import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import NavBar from '../components/NavBar';
import { auth } from '../firebase';
import { ensureUserRecord, sendPasswordReset, setUserRole, subscribeUsers } from '../services/users';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => subscribeUsers(setUsers), []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setCreating(true);
    try {
      // Note: this signs the new account in as the "current user" in this
      // browser tab (a Firebase Auth client-SDK limitation -- creating
      // another user's account isn't possible without a backend/Cloud
      // Function). You'll want to log back in as yourself afterward.
      const cred = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      await ensureUserRecord(cred.user.uid, newEmail, 'viewer');
      setMessage(`Created ${newEmail} as a viewer. You are now signed in as that user -- log back in as yourself.`);
      setNewEmail('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (uid, role) => {
    await setUserRole(uid, role);
  };

  const handleResetPassword = async (email) => {
    setError('');
    setMessage('');
    try {
      await sendPasswordReset(email);
      setMessage(`Password reset email sent to ${email}.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <main className="page">
        <h1>Manage Users</h1>

        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uid}>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => handleRoleChange(u.uid, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td>
                  <button type="button" onClick={() => handleResetPassword(u.email)}>
                    Send reset email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Add a user</h2>
        <p className="hint-text">
          This creates a new sign-in account with the "viewer" role, which you can then
          promote above. Because this app has no backend server, creating an account here
          will briefly sign this browser in as that new user -- just log back in as
          yourself afterward.
        </p>
        <form onSubmit={handleCreateUser} className="form">
          <label>
            Email
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
          </label>
          <label>
            Temporary password
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </label>
          <button type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create user'}
          </button>
        </form>
      </main>
    </>
  );
}
