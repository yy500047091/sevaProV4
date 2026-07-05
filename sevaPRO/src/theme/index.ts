export const colors = {
  primary: '#4F46E5',       // Indigo
  primaryLight: '#EEF2FF',
  secondary: '#0EA5E9',     // Sky blue
  accent: '#F59E0B',        // Amber (CTAs)
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  divider: '#F1F5F9',
  online: '#22C55E',
  offline: '#94A3B8',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11, sm: 13, base: 15, md: 17,
    lg: 20, xl: 24, '2xl': 28, '3xl': 34,
  },
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16,
  xl: 20, '2xl': 24, '3xl': 32,
};

export const borderRadius = {
  sm: 6, md: 10, lg: 14, xl: 20, full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
