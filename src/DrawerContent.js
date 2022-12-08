import React, {useEffect} from 'react';
import {ImageBackground} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Drawer, Avatar, Text, useTheme} from 'react-native-paper';
import s from '../styles/DrawerContent.module.css';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerContent = ({state}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [username, setUsername] = React.useState(null);
  const isOnPage = name => {
    if (state.routeNames[state.index] === name) return true;
    else return false;
  };
  useEffect(() => {
    AsyncStorage.getItem('username').then(val => {
      setUsername(val);
    });
  }, []);
  return (
    <DrawerContentScrollView style={{flex: 1, backgroundColor: colors.surface}}>
      <ImageBackground
        source={{
          uri: `https://api.wasteof.money/users/${
            username || 'micahlt'
          }/banner`,
        }}
        resizeMode="cover"
        style={s.imageBackground}
        imageStyle={{opacity: 0.5}}>
        {username ? (
          <Avatar.Image
            source={{
              uri: `https://api.wasteof.money/users/${username}/picture`,
            }}
            size={100}
            style={{alignSelf: 'center', marginTop: 30, marginBottom: 10}}
          />
        ) : (
          <Avatar.Icon
            icon="face-man-shimmer-outline"
            size={100}
            style={{alignSelf: 'center', marginTop: 30, marginBottom: 10}}
            color={colors.background}
          />
        )}
        <Text style={s.username} variant="titleLarge">
          {username || 'not signed in'}
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
        onPress={() => {
          navigation.navigate('search');
        }}
        active={isOnPage('search')}
      />
      <Drawer.Item
        label="Notifications"
        icon="bell"
        onPress={() => {
          navigation.navigate('notifications');
        }}
        active={isOnPage('notifs')}
      />
      <Drawer.Item
        label="Settings"
        icon="cog"
        onPress={() => {
          navigation.navigate('settings');
        }}
        active={isOnPage('settings')}
      />
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
