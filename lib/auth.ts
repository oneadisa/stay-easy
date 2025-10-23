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
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

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

// Configure Google Auth
WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  clientId: Constants.expoConfig?.extra?.google?.expo || '',
  iosClientId: Constants.expoConfig?.extra?.google?.ios || '',
  androidClientId: Constants.expoConfig?.extra?.google?.android || '',
};

/**
 * Sign in with Google using Expo AuthSession
 * Note: This is a simplified version that works with Expo Go
 */
export const googleSignIn = async (): Promise<User> => {
  try {
    // For now, we'll use a simple approach that works with Expo Go
    // In a production app, you'd need to configure Google Sign-In properly
    
    // This is a placeholder - Google Sign-In requires additional setup for Expo Go
    throw new Error('Google Sign-In requires additional configuration for Expo Go. Please use email/password authentication for now.');
    
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
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
