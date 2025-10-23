export type Theme = typeof LightTheme | typeof DarkTheme;

const base = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
  radius: { sm: 6, md: 12, lg: 20, pill: 999 },
  opacity: { disabled: 0.5, overlay: 0.6 },
  // use for shadows/elevation bridging
  elevation: { sm: 2, md: 6, lg: 12 },
  // semantic (non-color) tokens
  z: { header: 10, modal: 20, toast: 30 },
};

export const LightTheme = {
  mode: 'light' as const,
  colors: {
    // Brand
    primary: '#1E90FF',        // buttons, active tab, links
    primaryDark: '#1565C0',    // pressed/headers
    primaryLight: '#E3F2FD',   // subtle fills, chips

    // Feedback
    success: '#22C55E',
    warning: '#F59E0B',
    error:   '#E53935',
    info:    '#38BDF8',

    // UI
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F6',
    border: '#E5E7EB',

    // Text
    textPrimary: '#0D1B2A',
    textSecondary: '#6B7280',
    textInverse: '#FFFFFF',
    // Special
    overlay: 'rgba(0,0,0,0.6)',
    // Map tints / skeletons
    skeleton: '#E6ECF2',
  },
  ...base,
};

export const DarkTheme = {
  mode: 'dark' as const,
  colors: {
    // keep brand recognizable but slightly brighter for contrast
    primary: '#4EA8FF',
    primaryDark: '#1D4ED8',
    primaryLight: '#0B1220',   // subtle brand-tinted background

    success: '#22C55E',
    warning: '#F59E0B',
    error:   '#F05252',
    info:    '#38BDF8',

    background: '#0B1220',
    surface: '#111827',
    surfaceAlt: '#0F172A',
    border: '#1F2937',

    textPrimary: '#E5E7EB',
    textSecondary: '#9CA3AF',
    textInverse: '#0B1220',

    overlay: 'rgba(0,0,0,0.6)',
    skeleton: '#1F2A37',
  },
  ...base,
};
