import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Go back given a navigator prop object or fall back to the home route
 * @param {NativeStackNavigationProp} navigator - a navigator prop object
 */
const goBackIfCan = navigator => {
  if (navigator.canGoBack()) {
    navigator.goBack();
  } else {
    navigator.navigate('parent');
  }
};

export { goBackIfCan };
