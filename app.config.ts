import 'dotenv/config';

export default ({ config }: any) => ({
  ...config,
  name: 'StayEasy',
  slug: 'stayeasy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.oneadisa.stayeasy'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.oneadisa.stayeasy'
  },
  extra: {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      appId: process.env.FIREBASE_APP_ID,
    },
    google: {
      expo: process.env.GOOGLE_EXPO_CLIENT_ID,
      ios: process.env.GOOGLE_IOS_CLIENT_ID,
      android: process.env.GOOGLE_ANDROID_CLIENT_ID,
    },
  },
});
