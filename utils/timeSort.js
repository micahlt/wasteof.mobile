/**
 * Sorts an array of objects by a time key from newest to oldest
 * @param {array} objectArray - The array of objects to sort
 */
const timeSort = objectArray => {
  return objectArray.sort((a, b) => {
    if (a.time > b.time) return -1;
    if (a.time < b.time) return 1;
    return 0;
  });
};

export default timeSort;
