import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserDoc } from '../types';

/**
 * Hook to get current authenticated user
 */
export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

/**
 * Hook to get user document from Firestore
 */
export const useUserDoc = (userId: string | null | undefined) => {
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserDoc(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (snapshot) => {
        if (snapshot.exists()) {
          setUserDoc({ uid: snapshot.id, ...snapshot.data() } as UserDoc);
        } else {
          setUserDoc(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user doc:', error);
        setUserDoc(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { userDoc, loading };
};

/**
 * Hook for auth loading state
 */
export const useAuthLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return loading;
};
