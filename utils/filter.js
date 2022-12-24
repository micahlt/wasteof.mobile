import Filter from 'bad-words';
const f = new Filter({placeHolder: '█'});
['god', 'willy', 'omg'].forEach(w => f.removeWords(w));

/**
 * Returns a filtered version of the inputted post content
 * @param {string} postContent - HTMLString contents of post
 */
const filter = async postContent => {
  return f.clean(postContent);
};

export default filter;
