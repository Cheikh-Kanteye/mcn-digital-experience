// Theme constants for consistent styling across the app
export const theme = {
  // Primary colors
  colors: {
    // Background colors
    background: {
      primary: '#1a1a1a', // Main app background
      secondary: '#2a2a2a', // Secondary backgrounds (cards, sections)
      tertiary: '#242424', // Card backgrounds
      dark: '#0a0a0a', // Darkest background (tabs)
    },

    // Text colors
    text: {
      primary: '#fff', // Primary text
      secondary: '#999', // Secondary text
      tertiary: '#ccc', // Tertiary text (descriptions)
      accent: '#d4a574', // Accent text (highlights)
    },

    // Accent colors
    accent: {
      primary: '#d4a574', // Main accent color
      secondary: '#c9b8a8', // Secondary accent (active tabs)
      tertiary: '#6b5d50', // Tertiary accent (inactive tabs)
    },

    // Theme colors for collections
    themes: {
      histoire: '#d4a574',
      art: '#c9914d',
      culture: '#b8905f',
      musique: '#a67c52',
    },

    // UI element colors
    ui: {
      border: '#252525', // Border color
      divider: '#2a2a2a', // Divider lines
      inactive: '#3a3a3a', // Inactive states
      overlay: 'rgba(0, 0, 0, 0.5)', // Overlay backgrounds
      glass: 'rgba(255, 255, 255, 0.1)', // Glass effect
    },

    // Special colors
    special: {
      featured: '#64503c', // Featured collection background
      scanner: '#a67c52', // Scanner button
      scannerAlpha: '#a67c52bb', // Scanner with alpha
      whiteAlpha: '#ffffffff', // White with alpha
      dotGray: '#555', // Gray dots
      dotSecondary: '#666', // Secondary dots
    },

    // Status colors
    status: {
      success: '#d4a574',
      error: '#ff6b6b',
      warning: '#ffa500',
      info: '#4ecdc4',
    },
  },

  // Typography
  typography: {
    sizes: {
      xs: 11,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      huge: 28,
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    round: 50,
  },

  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 10,
    },
  },
};

// Helper functions for theme usage
export const getThemeColor = (themeName?: string): string => {
  if (!themeName) return theme.colors.accent.primary;
  const themeKey = themeName.toLowerCase() as keyof typeof theme.colors.themes;
  return theme.colors.themes[themeKey] || theme.colors.accent.primary;
};

export const getTextColor = (
  variant: 'primary' | 'secondary' | 'tertiary' | 'accent' = 'primary'
) => {
  return theme.colors.text[variant];
};

export const getBackgroundColor = (
  variant: 'primary' | 'secondary' | 'tertiary' | 'dark' = 'primary'
) => {
  return theme.colors.background[variant];
};

// Export individual color constants for backward compatibility
export const colors = {
  // Legacy exports - these will be deprecated in favor of theme.colors
  background: theme.colors.background.primary,
  backgroundSecondary: theme.colors.background.secondary,
  backgroundTertiary: theme.colors.background.tertiary,
  backgroundDark: theme.colors.background.dark,

  textPrimary: theme.colors.text.primary,
  textSecondary: theme.colors.text.secondary,
  textTertiary: theme.colors.text.tertiary,
  textAccent: theme.colors.text.accent,

  accentPrimary: theme.colors.accent.primary,
  accentSecondary: theme.colors.accent.secondary,
  accentTertiary: theme.colors.accent.tertiary,

  border: theme.colors.ui.border,
  inactive: theme.colors.ui.inactive,
  featured: theme.colors.special.featured,
  scanner: theme.colors.special.scanner,
};
