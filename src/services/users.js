import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';

const COLLECTION = 'users';

export function subscribeUsers(callback) {
  return onSnapshot(collection(db, COLLECTION), (snap) => {
    callback(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
  });
}

// Called once after a new Firebase Auth account is created, to give it a
// role record. Defaults to 'viewer' -- promote via setUserRole.
export async function ensureUserRecord(uid, email, role = 'viewer') {
  await setDoc(doc(db, COLLECTION, uid), { email, role }, { merge: true });
}

export async function setUserRole(uid, role) {
  await setDoc(doc(db, COLLECTION, uid), { role }, { merge: true });
}

// There's no backend here to reset another account's password directly
// (that needs the Firebase Admin SDK), so "managing" a password means
// triggering Firebase's own self-service reset email.
export function sendPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}
