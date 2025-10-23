import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import AppNavigator from './navigation/AppNavigator';

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <AppNavigator />
      <StatusBar 
        style="auto"
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
