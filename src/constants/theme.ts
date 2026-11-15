// ChristMyCore Design Tokens
// Brand accent (gold) stays constant across themes; backgrounds/text invert.

export type ThemeColors = {
  background: string;
  backgroundGradient: readonly [string, string, string, string];
  backgroundGradientLocations: readonly [number, number, number, number];
  surface: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentMuted: string;
  accentText: string;
  glow: string;
  star: string;
  logoTint: string | null;
  inputBg: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  statusBarStyle: 'light-content' | 'dark-content';
};

export const darkColors: ThemeColors = {
  background: '#0A1018',
  backgroundGradient: ['#070C14', '#0D1727', '#111B2E', '#09121E'],
  backgroundGradientLocations: [0, 0.35, 0.72, 1],
  surface: 'rgba(17, 25, 38, 0.9)',
  border: 'rgba(214, 178, 98, 0.28)',
  borderStrong: 'rgba(214, 178, 98, 0.42)',
  textPrimary: '#F8F5EE',
  textSecondary: '#E7E0D3',
  textMuted: '#9AA8C2',
  accent: '#D8B164',
  accentLight: '#E9C97B',
  accentMuted: '#B88E46',
  accentText: '#16110B',
  glow: '#1D2E52',
  star: 'rgba(216, 177, 100, 0.5)',
  logoTint: '#F8F5EE',
  inputBg: 'rgba(255,255,255,0.04)',
  error: '#D96B5F',
  errorBg: 'rgba(217, 107, 95, 0.15)',
  errorBorder: 'rgba(217, 107, 95, 0.35)',
  statusBarStyle: 'light-content',
};

export const lightColors: ThemeColors = {
  background: '#F7F2EA',
  backgroundGradient: ['#FFFDF9', '#F7F2EA', '#EEE3CE', '#F7F2EA'],
  backgroundGradientLocations: [0, 0.35, 0.72, 1],
  surface: '#FFFDF9',
  border: 'rgba(184, 142, 70, 0.34)',
  borderStrong: 'rgba(25, 34, 61, 0.18)',
  textPrimary: '#171E32',
  textSecondary: '#27314B',
  textMuted: '#62708D',
  accent: '#B88E46',
  accentLight: '#D4B06E',
  accentMuted: '#7D5D2A',
  accentText: '#16110B',
  glow: '#E7D7AE',
  star: 'rgba(184, 142, 70, 0.28)',
  logoTint: null,
  inputBg: 'rgba(25, 34, 61, 0.04)',
  error: '#C04D42',
  errorBg: 'rgba(192, 77, 66, 0.08)',
  errorBorder: 'rgba(192, 77, 66, 0.24)',
  statusBarStyle: 'dark-content',
};

export const FONTS = {
  serif: 'Merriweather_700Bold',
  serifItalic: 'Merriweather_400Regular_Italic',
  serifRegular: 'Merriweather_400Regular',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansBold: 'Inter_700Bold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 60,
};
