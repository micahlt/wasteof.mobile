module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin',
    'react-native-classname-to-style',
    [
      'react-native-platform-specific-extensions',
      {
        extensions: ['css'],
      },
    ],
  ],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel',
        'react-native-reanimated/plugin',
        'transform-remove-console',
      ],
    },
  },
};
