import * as React from 'react';
import {View} from 'react-native';
import {Text, IconButton, Badge, useTheme} from 'react-native-paper';
import g from '../styles/Global.module.css';
import Logo from '../static/logo.svg';

function Feed() {
  const {colors} = useTheme();
  return (
    <View
      style={{
        padding: 20,
        paddingRight: 10,
        paddingTop: 10,
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <View style={g.infoBar}>
        <Text variant="titleLarge" style={{fontWeight: 'bold', flex: 1}}>
          Your feed
        </Text>
        <View style={g.iconButtonWrapper}>
          <Badge style={g.iconButtonBadge} size={24}>
            3
          </Badge>
          <IconButton
            icon="bell"
            size={24}
            iconColor={colors.primary}
            onPress={() => {}}
          />
        </View>
      </View>
      <Logo width={331} height={165} style={{backgroundColor: 'black'}} />
    </View>
  );
}

export default Feed;
