// import React from 'react';
// import { Text as RNText, TextStyle } from 'react-native';
// import { useTheme } from '../ThemeProvider';

// interface TextProps {
//   children: React.ReactNode;
//   variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
//   color?: 'primary' | 'secondary' | 'inverse' | 'success' | 'warning' | 'error';
//   style?: TextStyle;
//   numberOfLines?: number;
// }

// export function Text({ 
//   children, 
//   variant = 'body', 
//   color = 'primary',
//   style,
//   numberOfLines 
// }: TextProps) {
//   const { theme } = useTheme();

//   const getTextStyle = (): TextStyle => {
//     const baseStyle: TextStyle = {
//       color: theme.colors.textPrimary,
//     };

//     // Variant styles
//     switch (variant) {
//       case 'h1':
//         return {
//           ...baseStyle,
//           fontSize: 32,
//           fontWeight: '700',
//           lineHeight: 40,
//         };
//       case 'h2':
//         return {
//           ...baseStyle,
//           fontSize: 24,
//           fontWeight: '600',
//           lineHeight: 32,
//         };
//       case 'h3':
//         return {
//           ...baseStyle,
//           fontSize: 20,
//           fontWeight: '600',
//           lineHeight: 28,
//         };
//       case 'body':
//         return {
//           ...baseStyle,
//           fontSize: 16,
//           fontWeight: '400',
//           lineHeight: 24,
//         };
//       case 'caption':
//         return {
//           ...baseStyle,
//           fontSize: 14,
//           fontWeight: '400',
//           lineHeight: 20,
//         };
//       case 'label':
//         return {
//           ...baseStyle,
//           fontSize: 14,
//           fontWeight: '500',
//           lineHeight: 20,
//         };
//       default:
//         return baseStyle;
//     }
//   };

//   const getTextColor = (): string => {
//     switch (color) {
//       case 'primary':
//         return theme.colors.textPrimary;
//       case 'secondary':
//         return theme.colors.textSecondary;
//       case 'inverse':
//         return theme.colors.textInverse;
//       case 'success':
//         return theme.colors.success;
//       case 'warning':
//         return theme.colors.warning;
//       case 'error':
//         return theme.colors.error;
//       default:
//         return theme.colors.textPrimary;
//     }
//   };

//   return (
//     <RNText 
//       style={[
//         getTextStyle(),
//         { color: getTextColor() },
//         style
//       ]}
//       numberOfLines={numberOfLines}
//     >
//       {children}
//     </RNText>
//   );
// }


import React from 'react';
import { Text as RNText, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../ThemeProvider';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'inverse' | 'success' | 'warning' | 'error';
  style?: StyleProp<TextStyle>; // Change this line
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
    const baseStyle: TextStyle = {
      color: theme.colors.textPrimary,
    };

    // Variant styles
    switch (variant) {
      case 'h1':
        return {
          ...baseStyle,
          fontSize: 32,
          fontWeight: '700',
          lineHeight: 40,
        };
      case 'h2':
        return {
          ...baseStyle,
          fontSize: 24,
          fontWeight: '600',
          lineHeight: 32,
        };
      case 'h3':
        return {
          ...baseStyle,
          fontSize: 20,
          fontWeight: '600',
          lineHeight: 28,
        };
      case 'body':
        return {
          ...baseStyle,
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 24,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 20,
        };
      case 'label':
        return {
          ...baseStyle,
          fontSize: 14,
          fontWeight: '500',
          lineHeight: 20,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    switch (color) {
      case 'primary':
        return theme.colors.textPrimary;
      case 'secondary':
        return theme.colors.textSecondary;
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