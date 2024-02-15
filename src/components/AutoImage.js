import * as React from 'react';
import { Image } from 'expo-image';
import { Linking, Pressable } from 'react-native';

const AutoImage = ({ source, fitWidth = 0 }) => {
  const [aspect, setAspect] = React.useState(0.5);
  return (
    <Pressable
      onPress={() => Linking.openURL(source)}
      style={{ borderRadius: 7, marginBottom: 5 }}
      useForeground={true}
      android_ripple={{ color: 'rgba(0,0,0,0.2)', foreground: true }}>
      <Image
        source={source}
        style={{
          width: fitWidth,
          height: fitWidth * aspect,
          borderRadius: 7,
        }}
        contentFit="cover"
        onLoad={e => {
          setAspect(e.source.height / e.source.width);
        }}
      />
    </Pressable>
  );
};

export default AutoImage;
