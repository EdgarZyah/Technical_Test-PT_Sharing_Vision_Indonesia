export const COLORS = {
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  amber600: '#d97706',
  amber700: '#b45309',
  amber900: 'rgba(120,53,15,0.2)',

  emerald50: '#ecfdf5',
  emerald100: '#d1fae5',
  emerald400: '#34d399',
  emerald500: '#10b981',
  emerald600: '#059669',
  emerald900: 'rgba(6,78,59,0.2)',

  red50: '#fef2f2',
  red100: '#fee2e2',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red900: 'rgba(127,29,29,0.2)',

  blue100: '#dbeafe',
  blue500: '#3b82f6',
  blue700: '#1d4ed8',

  purple500: '#a855f7',

  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  gray950: '#030712',

  white: '#ffffff',
  black: '#000000',
};

export const LIGHT = {
  bg: COLORS.gray50,
  surface: COLORS.white,
  surfaceHover: COLORS.gray100,
  text: COLORS.gray900,
  textSecondary: COLORS.gray500,
  textMuted: COLORS.gray400,
  border: COLORS.gray200,
  borderHover: COLORS.gray300,
  inputBg: COLORS.white,
  inputBorder: COLORS.gray300,
  inputPlaceholder: COLORS.gray400,
  navActive: COLORS.amber50,
  navActiveText: COLORS.amber700,
  navInactive: COLORS.gray600,
  headerBg: 'rgba(255,255,255,0.8)',
  headerBorder: COLORS.gray200,
  sidebarBg: COLORS.white,
  sidebarBorder: COLORS.gray200,
};

export const DARK = {
  bg: COLORS.gray900,
  surface: COLORS.gray800,
  surfaceHover: COLORS.gray700,
  text: COLORS.white,
  textSecondary: COLORS.gray400,
  textMuted: COLORS.gray500,
  border: COLORS.gray700,
  borderHover: COLORS.gray600,
  inputBg: COLORS.gray800,
  inputBorder: COLORS.gray600,
  inputPlaceholder: COLORS.gray500,
  navActive: COLORS.amber900,
  navActiveText: COLORS.amber400,
  navInactive: COLORS.gray400,
  headerBg: 'rgba(31,41,55,0.8)',
  headerBorder: COLORS.gray700,
  sidebarBg: COLORS.gray800,
  sidebarBorder: COLORS.gray700,
};

export const FONTS = {
  regular: 14,
  medium: 16,
  large: 18,
  xlarge: 22,
  xxlarge: 28,
  title: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const DEMO_USER = {
  email: 'demo@haloemas.com',
  password: 'password123',
  name: 'Budi Hartono',
  goldBalance: 12.5432,
  balance: 5000000,
};

export const MOCK_TRANSACTIONS = [
  { id: 1, type: 'BUY', rupiahAmount: 500000, gramAmount: 0.2571, goldPrice: 1945200, status: 'SUCCESS', date: '2026-07-16T10:30:00Z' },
  { id: 2, type: 'BUY', rupiahAmount: 1000000, gramAmount: 0.5141, goldPrice: 1945200, status: 'SUCCESS', date: '2026-07-15T14:20:00Z' },
  { id: 3, type: 'SELL', rupiahAmount: 3850400, gramAmount: 2.0, goldPrice: 1925200, status: 'SUCCESS', date: '2026-07-14T09:15:00Z' },
  { id: 4, type: 'BUY', rupiahAmount: 2000000, gramAmount: 1.0282, goldPrice: 1945200, status: 'PENDING', date: '2026-07-13T16:45:00Z' },
  { id: 5, type: 'BUY', rupiahAmount: 750000, gramAmount: 0.3856, goldPrice: 1944800, status: 'SUCCESS', date: '2026-07-12T11:00:00Z' },
];
