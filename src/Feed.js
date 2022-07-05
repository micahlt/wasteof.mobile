import * as React from 'react';
import {View} from 'react-native';
import {Text, IconButton, Badge, Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import g from '../styles/Global.module.css';

function Feed() {
  const {colors} = useTheme();
  const navigation = useNavigation();
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button
          mode="contained-tonal"
          icon="account-lock-outline"
          onPress={() => navigation.navigate('settings')}>
          Sign In
        </Button>
      </View>
    </View>
  );
}

export default Feed;
