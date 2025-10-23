import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import Constants from 'expo-constants';

const cfg = Constants.expoConfig?.extra as any;

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(cfg.firebase);

// Initialize Auth
// Note: For Expo managed workflow, auth persistence is handled automatically
// The warning can be safely ignored as Expo provides its own persistence layer
export const auth = getApps().length ? getAuth() : initializeAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Connect to emulators in development
if (__DEV__ && process.env.USE_EMULATOR === '1') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔧 Connected to Firebase Emulators');
  } catch (error) {
    console.warn('⚠️ Emulator connection failed:', error);
  }
}

export default app;
