# StayEasy Foundation Setup Guide

## ✅ Completed Steps

1. **Expo TypeScript Project**: Created with Blank template
2. **Dependencies**: All core dependencies installed (Firebase, navigation, auth, dev tools)
3. **Environment Files**: Created `.env.example`, `.env.local`, `.env.emulator`
4. **App Configuration**: Created `app.config.ts` to expose environment variables
5. **Package Scripts**: Updated `package.json` with dev, emu, lint, typecheck scripts
6. **Git Configuration**: Updated `.gitignore` to protect credentials

## 🔄 Manual Steps Required

### Step 1: Firebase Authentication & Project Setup

**1.1 Login to Firebase CLI**
```bash
cd /Users/adisa/Desktop/DEV/rise/air-bnb
npx firebase login
```
- This will open a browser window
- Sign in with your Google account
- Grant permissions to Firebase CLI

**1.2 Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Project name: `stayeasy` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

**1.3 Enable Firebase Services**
In your Firebase project:
1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (we'll configure this later)

2. **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in test mode (we'll secure it later)
   - Choose a location (closest to your users)

3. **Storage**:
   - Go to Storage → Get started
   - Start in test mode
   - Choose same location as Firestore

**1.4 Get Firebase Config**
1. Go to Project Settings (gear icon) → General
2. Scroll to "Your apps" section
3. Click "Add app" → Web app (</>) icon
4. App nickname: `stayeasy-web`
5. Copy the config object values to your `.env.local` file:

```env
FIREBASE_API_KEY=your_actual_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_APP_ID=your_app_id
```

### Step 2: Google OAuth Configuration

**2.1 Google Cloud Console Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project (or create new one)
3. Enable APIs:
   - Go to APIs & Services → Library
   - Search and enable "Google+ API" (or "Google Identity API")

**2.2 Configure OAuth Consent Screen**
1. Go to APIs & Services → OAuth consent screen
2. Choose "External" user type
3. Fill required fields:
   - App name: `StayEasy`
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email for testing)

**2.3 Create OAuth Credentials**
1. Go to APIs & Services → Credentials
2. Create credentials → OAuth 2.0 Client IDs

   **Web Client (for Expo proxy)**:
   - Application type: Web application
   - Name: `StayEasy Web`
   - Authorized redirect URIs: `https://auth.expo.io/@your-expo-username/stayeasy`
   - Copy Client ID to `.env.local` as `GOOGLE_EXPO_CLIENT_ID`

   **iOS Client**:
   - Application type: iOS
   - Name: `StayEasy iOS`
   - Bundle ID: `com.yourusername.stayeasy`
   - Copy Client ID to `.env.local` as `GOOGLE_IOS_CLIENT_ID`

   **Android Client**:
   - Application type: Android
   - Name: `StayEasy Android`
   - Package name: `com.yourusername.stayeasy`
   - SHA-1 certificate fingerprint: Get with:
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
   - Copy Client ID to `.env.local` as `GOOGLE_ANDROID_CLIENT_ID`

**2.4 Link Google OAuth to Firebase**
1. Go back to Firebase Console → Authentication → Sign-in method
2. Click on Google provider
3. Enable Google sign-in
4. Add Web SDK configuration:
   - Web client ID: (from Google Cloud Console)
   - Web client secret: (from Google Cloud Console)

### Step 3: Initialize Firebase CLI

**3.1 Initialize Firebase in Project**
```bash
cd /Users/adisa/Desktop/DEV/rise/air-bnb
npx firebase init
```

**Select these features** (use arrow keys and spacebar):
- ☑ Firestore: Configure security rules and indexes files
- ☑ Authentication: Configure Authentication emulator
- ☑ Storage: Configure a security rules file for Cloud Storage
- ☑ Emulators: Set up local emulators for Firebase products

**Configuration prompts**:
- **Firestore rules file**: `firestore.rules` (press Enter)
- **Firestore indexes file**: `firestore.indexes.json` (press Enter)
- **Storage rules file**: `storage.rules` (press Enter)
- **Emulator ports**:
  - Authentication emulator: `9099` (press Enter)
  - Firestore emulator: `8080` (press Enter)
  - Storage emulator: `9199` (press Enter)
  - Emulator UI: `4000` (press Enter)
- **Download emulators**: `Yes` (press Enter)

### Step 4: Verification

**4.1 Test Firebase CLI**
```bash
npx firebase projects:list
# Should show your project
```

**4.2 Test Emulators**
```bash
npm run emu
# Should open Firebase Emulator UI at http://localhost:4000
```

**4.3 Test Expo**
```bash
npm run dev
# Should start Expo development server without errors
```

## 🎯 Next Steps After Foundation

Once the foundation is complete, you'll be ready to implement:

1. **Firebase Initialization** (`lib/firebase.ts`)
2. **Type Definitions** (`types.ts`)
3. **Navigation Structure** (Stack + Tabs)
4. **Authentication Flows** (Email + Google)
5. **Shared UI Components**
6. **Firestore Security Rules**
7. **Team Handoff Documentation**

## 📁 Project Structure

Your project should now have:
```
/Users/adisa/Desktop/DEV/rise/air-bnb/
├── .env.example          # Template for team
├── .env.local           # Your actual credentials (gitignored)
├── .env.emulator        # Emulator configuration
├── app.config.ts        # Expo configuration
├── package.json         # Updated with scripts
├── .gitignore          # Updated to protect credentials
├── firebase.json       # Firebase configuration (after firebase init)
├── firestore.rules     # Firestore security rules (after firebase init)
├── storage.rules       # Storage security rules (after firebase init)
└── firestore.indexes.json # Firestore indexes (after firebase init)
```

## 🚨 Important Notes

- **Never commit `.env.local`** - it contains your actual credentials
- **Update bundle identifiers** in `app.config.ts` with your actual values
- **Test on both iOS and Android** emulators after setup
- **Keep Firebase project in test mode** until you implement proper security rules

## 🆘 Troubleshooting

**Firebase login issues**: Make sure you're logged into the correct Google account
**OAuth redirect URI**: Use your actual Expo username in the redirect URI
**SHA-1 fingerprint**: Make sure you're using the debug keystore for development
**Port conflicts**: If ports 4000, 8080, 9099, or 9199 are in use, change them in `firebase.json`
