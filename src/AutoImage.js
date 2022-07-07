import * as React from 'react';
import {Image} from 'react-native';
const AutoImage = ({source, fitWidth = 0}) => {
  const [aspect, setAspect] = React.useState(0);
  return (
    <Image
      source={{uri: source}}
      style={{
        width: fitWidth,
        height: fitWidth * aspect,
        backgroundColor: '#ffffff',
        borderRadius: 7,
        marginBottom: 5,
      }}
      resizeMode="cover"
      onLoad={({
        nativeEvent: {
          source: {width, height},
        },
      }) => {
        setAspect(height / width);
      }}
    />
  );
};

export default AutoImage;
