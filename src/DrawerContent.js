import React from 'react';
import {ImageBackground} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Drawer, Avatar, Text, useTheme} from 'react-native-paper';
import s from '../styles/DrawerContent.module.css';
import {useNavigation} from '@react-navigation/native';

const DrawerContent = ({state}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const isOnPage = name => {
    if (state.routeNames[state.index] === name) return true;
    else return false;
  };
  return (
    <DrawerContentScrollView style={{flex: 1, backgroundColor: colors.surface}}>
      <ImageBackground
        source={{uri: 'https://api.wasteof.money/users/micahlt/banner'}}
        resizeMode="cover"
        style={s.imageBackground}
        imageStyle={{opacity: 0.5}}>
        <Avatar.Icon
          size={100}
          icon="face-man-outline"
          style={{alignSelf: 'center', margin: 20}}
        />
        <Text style={s.username} variant="titleLarge">
          Sign In
        </Text>
      </ImageBackground>
      <Drawer.Item
        label="Home"
        icon="home"
        onPress={() => {
          navigation.navigate('home');
        }}
        active={isOnPage('home')}
      />
      <Drawer.Item
        label="Explore"
        icon="web"
        onPress={() => {
          navigation.navigate('explore');
        }}
        active={isOnPage('explore')}
      />
      <Drawer.Item
        label="Search"
        icon="magnify"
        onPress={() => alert('Link to help')}
        active={isOnPage('search')}
      />
      <Drawer.Item
        label="Notifications"
        icon="bell"
        onPress={() => alert('Link to help')}
        active={isOnPage('notifs')}
      />
      <Drawer.Item
        label="Settings"
        icon="cog"
        onPress={() => alert('Link to help')}
        active={isOnPage('settings')}
      />
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
