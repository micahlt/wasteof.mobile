import Filter from 'bad-words';
import AsyncStorage from '@react-native-async-storage/async-storage';
const f = new Filter({placeHolder: '█'});

/**
 * Returns a filtered version of the inputted post content
 * @param {string} postContent - HTMLString contents of post
 */
const filter = async postContent => {
  const enabled = await AsyncStorage.getItem('filter');
  if (Boolean(enabled)) {
    return f.clean(postContent);
  } else {
    return postContent;
  }
};

export default filter;
