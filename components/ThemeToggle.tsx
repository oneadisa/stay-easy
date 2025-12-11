import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Text } from './ui/Text';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  style?: any;
}

export function ThemeToggle({ style }: ThemeToggleProps) {
  const { theme, setMode, mode } = useTheme();

  const toggleTheme = () => {
    if (mode === 'system') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('system');
    }
  };

  const getThemeLabel = () => {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <Text variant="caption" style={styles.label}>
          Theme
        </Text>
        <Text variant="body" color="secondary">
          {getThemeLabel()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginRight: 8,
  },
});
