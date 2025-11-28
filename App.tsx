import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { PropertiesProvider } from './utils/PropertiesContext';
import AppNavigator from './navigation/AppNavigator';
import { BookingProvider } from './utils/BookingContext';

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PropertiesProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </PropertiesProvider>
    </ThemeProvider>
  );
}