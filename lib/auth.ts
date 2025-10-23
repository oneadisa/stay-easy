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
 */
export const googleSignIn = async (): Promise<User> => {
  try {
    // Request Google authentication
    const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);
    
    const result = await promptAsync();
    
    if (result.type === 'success') {
      const { id_token } = result.params;
      
      if (!id_token) {
        throw new Error('No ID token received from Google');
      }
      
      // Create Firebase credential
      const credential = GoogleAuthProvider.credential(id_token);
      const firebaseResult = await signInWithCredential(auth, credential);
      
      // Create or update user document
      const userDoc: Omit<UserDoc, 'uid'> = {
        displayName: firebaseResult.user.displayName || 'Guest',
        email: firebaseResult.user.email || '',
        photoURL: firebaseResult.user.photoURL || undefined,
        role: 'guest',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      await setDoc(doc(db, 'users', firebaseResult.user.uid), userDoc, { merge: true });
      
      return firebaseResult.user;
    } else {
      throw new Error('Google authentication was cancelled or failed');
    }
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
