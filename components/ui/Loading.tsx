import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message, fullScreen = false }: LoadingProps) {
  const { theme } = useTheme();

  const containerStyle = fullScreen 
    ? [styles.container, styles.fullScreen, { backgroundColor: theme.colors.background }]
    : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <Text variant="body" color="secondary" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});
