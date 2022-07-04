'react-native-css-transformer';
var upstreamTransformer = require('metro-react-native-babel-transformer');
var cssTransformer = require('react-native-css-transformer');
var svgTransformer = require('react-native-svg-transformer');
module.exports.transform = function ({src, filename, options}) {
  if (filename.endsWith('.css')) {
    return cssTransformer.transform({src, filename, options});
  } else if (filename.endsWith('.svg')) {
    return svgTransformer.transform({src, filename, options});
  }
  return upstreamTransformer.transform({src, filename, options});
};
