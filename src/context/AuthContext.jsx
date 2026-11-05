import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, firebaseConfigured } from '../firebase';

const AuthContext = createContext({ user: null, profile: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) { setLoading(false); return undefined; }
    return onAuthStateChanged(auth, async current => {
      setUser(current);
      if (current) {
        try {
          const ref = doc(db, 'users', current.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) setProfile({ id: current.uid, ...snap.data() });
          else {
            const fresh = { name: current.displayName || current.email?.split('@')[0] || 'Creator', email: current.email || '', photoURL: current.photoURL || '', bio: '', followers: [], following: [], createdAt: serverTimestamp() };
            await setDoc(ref, fresh);
            setProfile({ id: current.uid, ...fresh });
          }
        } catch (error) { console.error('Could not load profile', error); setProfile(null); }
      } else setProfile(null);
      setLoading(false);
    });
  }, []);

  return <AuthContext.Provider value={{ user, profile, loading, setProfile }}>{children}</AuthContext.Provider>;
}
