import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
import rgbHex from 'rgb-hex';
/**
 * Opens a URL with InAppBrowser, or if not available, React Native Linking
 *
 * @param {string} url - a URL to open
 * @param {string} [color] - a color for the InAppBrowser toolbar
 */
const open = async (url, color) => {
  if (await InAppBrowser.isAvailable()) {
    await InAppBrowser.open(url, {
      toolbarColor: color
        ? color.includes('rgb')
          ? `#${rgbHex(color)}`
          : color
        : null,
    });
  } else {
    Linking.open(url);
  }
};

export default { open: open };
