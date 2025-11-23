# React Native Maps Setup Instructions

## Installation

The `react-native-maps` package has been added to package.json. Run:

```bash
npm install
```

## iOS Configuration

### 1. Install CocoaPods dependencies

```bash
cd ios && pod install && cd ..
```

### 2. Add to `ios/StayEasy/Info.plist`

Add the following key before the closing `</dict>` tag:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location to show properties near you.</string>
```

### 3. Update `app.json` or `app.config.ts`

If using Expo (which this project is), the configuration should work automatically. If you need custom configuration, add to `app.json`:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY"
      }
    }
  }
}
```

## Android Configuration

### 1. Add Google Maps API Key

Add your API key to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_ANDROID_API_KEY"/>
</application>
```

### 2. Update `app.json` or `app.config.ts`

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY"
        }
      }
    }
  }
}
```

## Getting Google Maps API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps SDK for iOS" and "Maps SDK for Android"
4. Create credentials (API Keys)
5. Restrict the keys to your app's bundle identifier (iOS) and package name (Android)

## Expo Configuration

Since this is an Expo project, you can use `expo-location` for better integration:

```bash
npx expo install expo-location
```

Then add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow StayEasy to use your location to show properties near you."
        }
      ]
    ]
  }
}
```

## Usage in Code

Maps are already integrated in the PropertyDetailsScreen component. The implementation uses:

```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={styles.map}
  initialRegion={{
    latitude: property.location.lat,
    longitude: property.location.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
>
  <Marker
    coordinate={{
      latitude: property.location.lat,
      longitude: property.location.lng,
    }}
    title={property.title}
  />
</MapView>
```

## Development Notes

- For Expo development builds, you'll need to create a custom development client with `npx expo run:ios` or `npx expo run:android`
- Maps won't work in Expo Go - you need a development build or production build
- For testing without API keys, the static map fallback is available in the code

## Troubleshooting

### Maps not showing on iOS
- Make sure you've run `pod install` in the ios folder
- Check that Info.plist has the location permission key
- Verify your API key is valid and has iOS Maps SDK enabled

### Maps not showing on Android
- Check AndroidManifest.xml has the correct API key
- Verify the API key has Android Maps SDK enabled
- Make sure the package name matches in Google Cloud Console restrictions

### Expo Go limitations
- react-native-maps requires custom native code
- Use `npx expo prebuild` to generate native folders
- Then run `npx expo run:ios` or `npx expo run:android`

