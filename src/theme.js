import {
  configureFonts,
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';

const fontConfig = {
  fontWeight: '500',
  displaySmall: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  displayMedium: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  displayLarge: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  headlineSmall: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  headlineMedium: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  headlineLarge: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  titleSmall: {
    fontFamily: 'space_bold',
    fontWeight: '500',
  },
  titleMedium: {
    fontFamily: 'space_bold',
    fontWeight: '500',
  },
  titleLarge: {
    fontFamily: 'space_bold',
    fontWeight: '500',
  },
  labelSmall: {
    fontFamily: 'space_bold',
    fontWeight: '500',
  },
  labelMedium: {
    fontFamily: 'space_bold',
    fontWeight: '500',
  },
  labelLarge: {
    fontFamily: 'space_bold',
    fontWeight: '500',
  },
  labelLarge: {
    fontFamily: 'space_bold',
    fontWeight: '500',
  },
  bodySmall: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  bodyMedium: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  bodyLarge: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
  default: {
    fontFamily: 'space_regular',
    fontWeight: '500',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  version: 3,
  isDark: false,
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme = {
  ...MD3DarkTheme,
  version: 3,
  isDark: true,
  fonts: configureFonts({ config: fontConfig }),
};
