/**
 * StayEasy Design System v1.0
 * 
 * Core Philosophy: "Effortless comfort."
 * Think Airbnb + Notion minimalism: generous white space, smooth corners, 
 * subtle shadows, warm neutrals, and a single bold accent color.
 */

export type Theme = typeof LightTheme | typeof DarkTheme;

// Design Tokens - Base (shared between light and dark)
const base = {
  // Spacing System (multiples of 4)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Border Radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },

  // Typography Scale
  typography: {
    display: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    heading: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    small: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
    },
  },

  // Shadow/Elevation System
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      elevation: 6,
    },
  },

  // Opacity
  opacity: {
    disabled: 0.5,
    overlay: 0.6,
    pressed: 0.85, // 15% opacity overlay for pressed states
  },

  // Z-index layers
  z: {
    header: 10,
    modal: 20,
    toast: 30,
  },
};

// Light Theme
export const LightTheme = {
  mode: 'light' as const,
  colors: {
    // Brand Colors
    primary: '#007AFF',        // Main accent (iOS blue)
    primaryLight: '#E0EEFF',   // Backgrounds, chip fills
    primaryDark: '#0059C9',     // Pressed/hover states

    // Accent
    accent: '#FF6B6B',         // Call-to-action emphasis, error states

    // Feedback Colors
    success: '#34C759',         // Booking confirmed, success toasts
    warning: '#FFA500',         // Caution banners
    error: '#FF3B30',           // Invalid input, failed operations

    // Neutral Palette
    background: '#FFFFFF',     // Default background (white, not gray)
    surface: '#F9F9F9',        // Card background, secondary surfaces
    border: '#E2E2E2',         // Subtle divider lines

    // Text Colors
    textPrimary: '#111111',    // High-contrast readable black
    textSecondary: '#666666',  // Secondary info (location, price)
    textMuted: '#A1A1A1',      // Placeholder text, icons
    textInverse: '#FFFFFF',    // Text on colored backgrounds

    // Special
    overlay: 'rgba(0, 0, 0, 0.6)',
    skeleton: '#E0EEFF',       // Loading placeholders
    inputBackground: '#F5F5F5', // Input field background
  },
  ...base,
};

// Dark Theme
export const DarkTheme = {
  mode: 'dark' as const,
  colors: {
    // Brand Colors (slightly brighter for contrast)
    primary: '#0A84FF',        // Brighter blue for dark mode
    primaryLight: '#1E3A5F',   // Darker tint for dark backgrounds
    primaryDark: '#0051D5',    // Darker pressed state

    // Accent
    accent: '#FF6B6B',         // Same accent color

    // Feedback Colors
    success: '#34C759',
    warning: '#FFA500',
    error: '#FF3B30',

    // Neutral Palette
    background: '#121212',     // Dark background
    surface: '#1E1E1E',       // Dark surface
    border: '#2E2E2E',        // Dark border

    // Text Colors
    textPrimary: '#FFFFFF',   // White text
    textSecondary: '#B0B0B0', // Muted white
    textMuted: '#808080',     // Very muted
    textInverse: '#111111',   // Dark text on light backgrounds

    // Special
    overlay: 'rgba(0, 0, 0, 0.8)',
    skeleton: '#2E2E2E',      // Dark loading placeholders
    inputBackground: '#2A2A2A', // Dark input field background
  },
  ...base,
};
