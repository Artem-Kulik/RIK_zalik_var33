export const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E05A26',
  primaryLight: '#FF8C5A',
  secondary: '#2D3250',
  accent: '#F7C59F',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',

  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    divider: '#F3F4F6',
    icon: '#374151',
    placeholder: '#D1D5DB',
    overlay: 'rgba(0,0,0,0.5)',
    badge: '#FF6B35',
  },

  dark: {
    background: '#0D0D1A',
    surface: '#1A1A2E',
    card: '#252540',
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#374151',
    divider: '#1F2937',
    icon: '#D1D5DB',
    placeholder: '#374151',
    overlay: 'rgba(0,0,0,0.7)',
    badge: '#FF6B35',
  },
};

export const FONTS = {
  regular: { fontFamily: 'System', fontWeight: '400' },
  medium: { fontFamily: 'System', fontWeight: '500' },
  semiBold: { fontFamily: 'System', fontWeight: '600' },
  bold: { fontFamily: 'System', fontWeight: '700' },
  extraBold: { fontFamily: 'System', fontWeight: '800' },
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
};
