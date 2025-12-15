import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { PropertiesProvider } from './utils/PropertiesContext';
import AppNavigator from './navigation/AppNavigator';
import { BookingProvider } from './utils/BookingContext';
import { useCustomFonts } from './utils/fonts';
import { FavoritesProvider } from './state/favouritesStore';

function AppContent() {
  const { theme } = useTheme();
  const { fontsLoaded } = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
    <ThemeProvider>
      <PropertiesProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </PropertiesProvider>
    </ThemeProvider>
    </FavoritesProvider>
  );
}