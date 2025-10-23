import React, { useState } from 'react';
import { 
  TextInput, 
  View, 
  StyleSheet, 
  TextInputProps,
  ViewStyle 
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ 
  label, 
  error, 
  containerStyle,
  style,
  ...props 
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error 
              ? theme.colors.error 
              : isFocused 
                ? theme.colors.primary 
                : theme.colors.border,
            color: theme.colors.textPrimary,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <Text variant="caption" color="error" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    marginTop: 4,
  },
});
