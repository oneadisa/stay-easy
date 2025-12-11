import React from 'react';
import { View, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '../ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  onPress?: () => void;
}

export function Card({ 
  children, 
  style, 
  variant = 'default',
  onPress 
}: CardProps) {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...theme.shadows.md, // Medium shadow for elevated cards
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return {
          ...baseStyle,
          ...theme.shadows.sm, // Subtle shadow for default cards
        };
    }
  };

  const cardContent = (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? theme.opacity.pressed : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}
