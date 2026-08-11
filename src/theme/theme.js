// Central design tokens for the Voice-to-Task Material 3 UI.
// Keep every screen/component pulling from here so the app stays visually consistent.

export const colors = {
  // Brand
  primary: '#5B4BFF',
  primaryDark: '#4636D6',
  primaryLight: '#8B7FFF',
  primarySoft: '#EEECFF',

  // Gradients (array form for expo-linear-gradient)
  gradientHeader: ['#7A6CFF', '#5B4BFF', '#4636D6'],
  gradientFab: ['#8B7FFF', '#5B4BFF', '#4636D6'],
  gradientGlow: ['rgba(91,75,255,0.35)', 'rgba(91,75,255,0)'],

  // Surfaces
  background: '#F8F8FC',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F1FB',
  surfaceElevated: '#FFFFFF',
  border: '#EEEDF7',
  divider: '#EFEEF9',

  // Text
  textPrimary: '#191A2B',
  textSecondary: '#6E6E85',
  textTertiary: '#A3A3B8',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#1FAE5F',
  successBg: '#E7F9EF',
  pending: '#9AA0B4',
  pendingBg: '#F1F1F7',
  danger: '#F0453F',
  dangerBg: '#FDECEC',
  warning: '#F5A623',
  warningBg: '#FEF6E7',

  white: '#FFFFFF',
  black: '#000000',
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const shadow = {
  card: {
    shadowColor: '#372F8F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  soft: {
    shadowColor: '#372F8F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  fab: {
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 12,
  },
  header: {
    shadowColor: '#4636D6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const typography = {
  display: { fontSize: 26, fontWeight: '800', letterSpacing: 0.1 },
  headline: { fontSize: 20, fontWeight: '800' },
  title: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '600' },
  bodyRegular: { fontSize: 14, fontWeight: '400' },
  subtitle: { fontSize: 13.5, fontWeight: '500' },
  caption: { fontSize: 12, fontWeight: '600' },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
};

export default { colors, radius, spacing, shadow, typography };
