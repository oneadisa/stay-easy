import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  User
} from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserDoc } from '../types';

/**
 * Sign up with email and password
 */
export const emailSignUp = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name
  await updateProfile(credential.user, { displayName });
  
  // Create user document in Firestore
  const userDoc: Omit<UserDoc, 'uid'> = {
    displayName,
    email,
    role: 'guest',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  await setDoc(doc(db, 'users', credential.user.uid), userDoc);
  
  return credential.user;
};

/**
 * Sign in with email and password
 */
export const emailSignIn = async (
  email: string, 
  password: string
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

/**
 * Sign in with Google
 * Note: This requires expo-auth-session configuration
 */
export const googleSignIn = async (idToken: string): Promise<User> => {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  
  // Create or update user document
  const userDoc: Omit<UserDoc, 'uid'> = {
    displayName: result.user.displayName || 'Guest',
    email: result.user.email || '',
    photoURL: result.user.photoURL || undefined,
    role: 'guest',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  await setDoc(doc(db, 'users', result.user.uid), userDoc, { merge: true });
  
  return result.user;
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Sign out
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  data: Partial<Pick<UserDoc, 'displayName' | 'photoURL' | 'phoneNumber'>>
): Promise<void> => {
  // Update Firebase Auth profile
  if (auth.currentUser && (data.displayName || data.photoURL)) {
    await updateProfile(auth.currentUser, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    });
  }
  
  // Update Firestore document
  await updateDoc(doc(db, 'users', userId), {
    ...data,
    updatedAt: Date.now(),
  });
};
