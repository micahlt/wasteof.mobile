import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import rgbHex from 'rgb-hex';
/**
 * Opens a URL with InAppBrowser, or if not available, React Native Linking
 *
 * @param {string} url - a URL to open
 * @param {string} [color] - a color for the InAppBrowser toolbar
 */
const open = async (url, color) => {
  WebBrowser.openBrowserAsync(url, {
    toolbarColor: color
      ? color.includes('rgb')
        ? `#${rgbHex(color)}`
        : color
      : null,
  }).catch(() => {
    Linking.openURL(url);
  });
};

export default { open: open };
