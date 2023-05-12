/**
 * Merges two arrays, de-duping them by a selected key
 * @param {array} array1 - The first array
 * @param {array} array2 - The second array
 * @param {string} key - The unique key with which to de-dupe items
 */
const uniqueMerge = (array1, array2, key) => {
  let map = new Map();
  [...array1, ...array2].forEach(item => {
    if (!map.has(item[key])) {
      map.set(item[key], item);
    }
  });
  return Array.from(map.values());
};

export default uniqueMerge;
