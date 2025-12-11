import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { fontFamily } from '../../utils/fonts';

interface TextProps {
  children: React.ReactNode;
  variant?: 'display' | 'heading' | 'title' | 'body' | 'caption' | 'small';
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'success' | 'warning' | 'error';
  style?: TextStyle;
  numberOfLines?: number;
}

export function Text({ 
  children, 
  variant = 'body', 
  color = 'primary',
  style,
  numberOfLines 
}: TextProps) {
  const { theme } = useTheme();

  const getTextStyle = (): TextStyle => {
    // Use typography scale from theme
    // Poller One for headings, Montserrat Alternates for body text
    const baseStyle = {
      fontFamily: fontFamily.regular,
    };

    switch (variant) {
      case 'display':
        return {
          ...theme.typography.display,
          fontFamily: fontFamily.heading, // Poller One
        };
      case 'heading':
        return {
          ...theme.typography.heading,
          fontFamily: fontFamily.heading, // Poller One
        };
      case 'title':
        return {
          ...theme.typography.title,
          fontFamily: fontFamily.heading, // Poller One
        };
      case 'body':
        return {
          ...theme.typography.body,
          fontFamily: fontFamily.regular, // Montserrat Alternates Regular
        };
      case 'caption':
        return {
          ...theme.typography.caption,
          fontFamily: fontFamily.regular, // Montserrat Alternates Regular
        };
      case 'small':
        return {
          ...theme.typography.small,
          fontFamily: fontFamily.medium, // Montserrat Alternates Medium
        };
      default:
        return {
          ...theme.typography.body,
          fontFamily: fontFamily.regular, // Montserrat Alternates Regular
        };
    }
  };

  const getTextColor = (): string => {
    switch (color) {
      case 'primary':
        return theme.colors.textPrimary;
      case 'secondary':
        return theme.colors.textSecondary;
      case 'muted':
        return theme.colors.textMuted;
      case 'inverse':
        return theme.colors.textInverse;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.textPrimary;
    }
  };

  return (
    <RNText 
      style={[
        getTextStyle(),
        { color: getTextColor() },
        style
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
