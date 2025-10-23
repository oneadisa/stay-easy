import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Input } from './Input';
import { useTheme } from '../ThemeProvider';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
}

export function PasswordInput({ 
  label = 'Password',
  value,
  onChangeText,
  error,
  placeholder = 'Enter your password'
}: PasswordInputProps) {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={error}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable
        style={styles.eyeIcon}
        onPress={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff size={20} color={theme.colors.textSecondary} />
        ) : (
          <Eye size={20} color={theme.colors.textSecondary} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 44,
    padding: 4,
  },
});
