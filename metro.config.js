const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;
const defaultAssetExts =
  require('metro-config/src/defaults/defaults').assetExts;
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  transformer: {
    babelTransformerPath: require.resolve('./transformer.js'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: defaultAssetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultSourceExts, 'css', 'svg'],
  },
});
