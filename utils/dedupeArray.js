const dedupeArray = (array, key) => {
  var newArray = [];
  var lookupObject = {};

  for (var i in array) {
    lookupObject[array[i][key]] = array[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray.sort((a, b) => b.time > a.time);
};

export default dedupeArray;
