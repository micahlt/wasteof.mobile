import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Appbar, useTheme} from 'react-native-paper';

const DrawerContent = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  return (
    <Appbar.Header
      style={{
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
      }}
      elevated={true}>
      <Appbar.Action
        icon="menu"
        onPress={navigation.openDrawer}
        iconColor={colors.onPrimary}
        isLeading={true}
        style={{
          marginRight: 'auto',
        }}
      />
    </Appbar.Header>
  );
};

export default DrawerContent;
