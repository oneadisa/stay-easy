import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: theme.colors.textPrimary,
          shadowOffset: { width: 0, height: theme.elevation.sm },
          shadowOpacity: (theme as any).mode === 'dark' ? 0.3 : 0.1,
          shadowRadius: theme.elevation.md,
          elevation: theme.elevation.sm,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}
