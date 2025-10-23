# StayEasy - Airbnb Clone

A comprehensive React Native Airbnb clone built with Expo, Firebase, and TypeScript. Features complete authentication, theme system, navigation, and a solid foundation for property management and booking functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Expo CLI
- iOS Simulator or Android Studio
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/oneadisa/stay-easy.git
cd stay-easy

# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Enable Google authentication (optional)
4. Add Firebase config to `.env.local`
5. Run `firebase init` to set up emulators

See [Firebase Setup](#firebase-setup) section for detailed instructions.

## 📱 Features

### ✅ Implemented
- **Complete Authentication System**
  - Email/password registration and login
  - Password reset via email
  - Google OAuth (infrastructure ready)
  - Auth state persistence
  - Protected routes

- **Beautiful Theme System**
  - Blue-first design with light/dark modes
  - Automatic system theme detection
  - Consistent spacing and typography
  - React Navigation integration

- **4-Tab Navigation**
  - Home (browse properties)
  - Bookings (manage reservations)
  - Profile (user settings)
  - Host (property management)

- **UI Component Library**
  - Themed buttons, cards, inputs
  - Form validation
  - Loading states
  - Error handling

- **Firebase Integration**
  - Authentication
  - Firestore database
  - Cloud Storage
  - Emulator support

### 🔄 Ready for Implementation
- Property management (create, edit, delete)
- Booking system with calendar
- Image uploads and management
- Search and filtering
- Reviews and ratings
- Real-time messaging
- Payment integration

## 🎨 Theme System

### Features
- **Blue-first design** with carefully chosen color palettes
- **Full dark mode support** with automatic system detection
- **React Navigation integration** with automatic theme sync
- **TypeScript support** with full type safety
- **Consistent spacing and typography** tokens

### Quick Usage
```tsx
import { useTheme } from './components/ThemeProvider';

function MyComponent() {
  const { theme, setMode, mode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.textPrimary }}>
        Current theme: {theme.mode}
      </Text>
    </View>
  );
}
```

### Color Palette
- **Light Theme**: Primary `#1E90FF`, Background `#F9FAFB`, Surface `#FFFFFF`
- **Dark Theme**: Primary `#4EA8FF`, Background `#0B1220`, Surface `#111827`

### UI Components
```tsx
import { Button, Card, Text } from './components/ui';

<Card>
  <Text variant="h2">Welcome</Text>
  <Text variant="body" color="secondary">This is a themed card</Text>
  <Button title="Click me" onPress={() => {}} variant="primary" />
</Card>
```

## 🔥 Firebase Setup

### Step 1: Firebase Authentication & Project Setup

**1.1 Login to Firebase CLI**
```bash
npx firebase login
```

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

## 🏗️ Architecture

### Project Structure
```
stay-easy/
├── components/           # Reusable UI components
│   ├── ui/              # Core UI components (Button, Card, Text, etc.)
│   ├── ThemeProvider.tsx # Theme context and provider
│   └── ThemeToggle.tsx   # Theme toggle component
├── lib/                 # Firebase and service configurations
│   ├── firebase.ts      # Firebase initialization
│   ├── auth.ts          # Authentication functions
│   └── storage.ts       # Storage operations
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Main navigation with auth gate
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── HomeScreen.tsx  # Main home screen
│   ├── BookingsScreen.tsx
│   ├── ProfileScreen.tsx
│   └── HostScreen.tsx
├── state/              # State management
│   └── authStore.ts    # Authentication state hooks
├── types/              # TypeScript type definitions
│   └── index.ts        # Core types (User, Property, Booking, etc.)
├── utils/              # Utility functions
│   └── theme.ts        # Theme tokens and definitions
└── .env.local          # Environment variables (gitignored)
```

### Type Definitions
Complete TypeScript interfaces for:
- **UserDoc**: User profile data with role system
- **Property**: Full property listing with location, amenities, pricing
- **Booking**: Reservation management with status tracking
- **Review**: Property reviews and ratings
- **Navigation types**: Type-safe navigation parameters

### Firebase Integration
- **Authentication**: Email/password + Google OAuth
- **Firestore**: NoSQL database for user data, properties, bookings
- **Storage**: Image uploads for profiles and properties
- **Emulators**: Local development environment

## 🎯 Development

### Available Scripts
```bash
# Start development server
npm run dev

# Start with Firebase emulators
npm run dev:emu

# Start Firebase emulators
npm run emu

# Type checking
npm run typecheck

# Linting
npm run lint

# Pre-commit checks
npm run precommit
```

### Environment Variables
Create `.env.local` with your Firebase configuration:
```env
# Firebase Config
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_APP_ID=your_app_id

# Google OAuth (optional)
GOOGLE_EXPO_CLIENT_ID=your_expo_client_id
GOOGLE_IOS_CLIENT_ID=your_ios_client_id
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id

# Emulator mode
USE_EMULATOR=0
```

## 🎨 Design System

### Color Palette
- **Primary**: `#1E90FF` (Light) / `#4EA8FF` (Dark)
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Error**: `#E53935`

### Typography
- **H1**: 32px, Bold
- **H2**: 24px, SemiBold
- **H3**: 20px, SemiBold
- **Body**: 16px, Regular
- **Caption**: 14px, Regular

### Spacing Scale
- **XS**: 4px
- **SM**: 8px
- **MD**: 12px
- **LG**: 16px
- **XL**: 24px
- **2XL**: 32px

## 📊 Project Statistics

- **Files Created**: 25+
- **Lines of Code**: ~2,600+
- **Components**: 12+
- **Screens**: 7
- **Services**: 3 (Auth, Storage, Firebase)
- **Type Definitions**: 5+ core types
- **Zero TypeScript Errors**: ✅

## 🚀 What's Working Now

1. ✅ **Theme System**: Toggle between light/dark modes
2. ✅ **Navigation**: 4 tabs with beautiful icons
3. ✅ **Authentication UI**: Complete sign in/up/reset flows
4. ✅ **Firebase Ready**: All services initialized
5. ✅ **Type Safety**: Full TypeScript coverage
6. ✅ **Component Library**: Reusable, themed components
7. ✅ **Auth State**: Real-time user state management
8. ✅ **Route Protection**: Automatic auth gating

## 🎯 Next Steps

The foundation is now solid and ready for:

1. **Property Management**
   - Create, edit, delete properties
   - Image uploads and management
   - Property search and filtering

2. **Booking System**
   - Date selection with calendar
   - Booking creation and management
   - Guest/host communication

3. **Reviews & Ratings**
   - Leave reviews after stays
   - Star ratings system
   - Review moderation

4. **Advanced Features**
   - Push notifications
   - Real-time messaging
   - Payment integration
   - Map integration

## 🆘 Troubleshooting

**Firebase login issues**: Make sure you're logged into the correct Google account
**OAuth redirect URI**: Use your actual Expo username in the redirect URI
**SHA-1 fingerprint**: Make sure you're using the debug keystore for development
**Port conflicts**: If ports 4000, 8080, 9099, or 9199 are in use, change them in `firebase.json`

## 📝 Important Notes

- **Never commit `.env.local`** - it contains your actual credentials
- **Update bundle identifiers** in `app.config.ts` with your actual values
- **Test on both iOS and Android** emulators after setup
- **Keep Firebase project in test mode** until you implement proper security rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Team Ready

The codebase is now ready for team collaboration:
- Clear file structure
- Consistent patterns
- Comprehensive types
- Reusable components
- Documentation in place

Your team can now build on this solid foundation! 🚀
