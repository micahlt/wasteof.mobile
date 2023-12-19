import linkifyHtml from 'linkify-html';
import 'linkify-plugin-mention';

/**
 * Returns a linkified copy of the inputted string, including @mentions
 * @param {string} content - string to linkify
 */
const linkify = content => {
  return linkifyHtml(content, {
    formatHref: {
      mention: href => `wasteof://users/${href}`,
    },
  });
};

export default linkify;
