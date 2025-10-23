import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'primary',
  size = 'md',
  style,
  textStyle 
}: ButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = (pressed: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: theme.spacing[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'],
      paddingHorizontal: theme.spacing[size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'],
      borderRadius: theme.radius.md,
      opacity: disabled ? theme.opacity.disabled : 1,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: pressed ? theme.colors.primaryDark : theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: pressed ? theme.colors.surfaceAlt : theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return theme.colors.textInverse;
      case 'secondary':
        return theme.colors.textPrimary;
      case 'outline':
        return theme.colors.primary;
      default:
        return theme.colors.textInverse;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [getButtonStyle(pressed), style]}
    >
      <Text 
        style={[
          {
            color: getTextColor(),
            fontWeight: '600',
            fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
          },
          textStyle
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
