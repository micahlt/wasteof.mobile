import * as React from 'react';
import { ImageBackground, View, Image, Linking, FlatList } from 'react-native';
import {
  Appbar,
  Button,
  IconButton,
  Text,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import Post from './components/Post';
import s from '../styles/UserModal.module.css';
import { GlobalContext } from '../App';
import { apiURL, wasteofURL } from './apiURL';
import getColorFromTheme from '../utils/getColorFromTheme';
import { StatusBar } from 'react-native';
import { goBackIfCan } from '../utils/goBackIfCan';

const UserPage = ({ route, navigation }) => {
  const { username } = route.params;
  const { username: myUsername, token } = React.useContext(GlobalContext);
  const { colors, isDark } = useTheme();
  // Brush is the term for wasteof.money's custom profile theming system
  const [brush, setBrush] = React.useState({
    headerColor: colors.surface,
    outlineColor: colors.outline,
    buttonBg: colors.secondaryContainer,
    buttonText: colors.onSecondaryContainer,
  });
  const [headerTextColor, setHeaderTextColor] = React.useState(
    colors.secondary,
  );
  const [data, setData] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [following, setFollowing] = React.useState(false);
  const [followers, setFollowers] = React.useState(0);
  const [isTogglingFollow, setIsTogglingFollow] = React.useState(false);
  const refresh = () => {
    setIsRefreshing(true);
    fetch(`${apiURL}/users/${username}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        setData(json);
        setFollowers(json.stats.followers);
        if (json.color) {
          const brushData = getColorFromTheme(json.color, isDark);
          setBrush(brushData);
          setHeaderTextColor('#000000');
        }
      });
    setPage(1);
    setPosts([]);
    fetchPosts();
  };
  const fetchPosts = () => {
    fetch(`${apiURL}/users/${username}/posts?page=${page}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        setPosts([...posts, ...json.posts]);
        setPage(page + 1);
        setIsRefreshing(false);
        setIsLoading(false);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      setData(null);
      setFollowers(null);
      setFollowing(null);
      setBrush({
        headerColor: colors.surface,
        outlineColor: colors.outline,
        buttonBg: colors.secondaryContainer,
        buttonText: colors.onSecondaryContainer,
      });
      if (token) {
        refresh();
        fetch(`${apiURL}/users/${username}/followers/${myUsername}`)
          .then(res => {
            return res.json();
          })
          .then(json => {
            if (json) {
              setFollowing(true);
            } else {
              setFollowing(false);
            }
          });
      }
    }, [token]),
  );
  const toggleFollow = () => {
    setIsTogglingFollow(true);
    fetch(`${apiURL}/users/${username}/followers`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    }).then(response => {
      if (response.ok) {
        if (following) {
          setFollowers(followers - 1);
        } else {
          setFollowers(followers + 1);
        }
        setFollowing(!following);
      } else {
        alert(`Error code ${response.status}, try again later.`);
      }
      setIsTogglingFollow(false);
    });
  };
  const openUser = async () => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(`${wasteofURL}/@${username}`, {
        toolbarColor: brush.headerColor,
      });
    } else {
      Linking.open(`${wasteofURL}/@${username}`);
    }
  };
  const listLoading = () => {
    return (
      <View style={{ padding: 20 }}>
        {isLoading && !isRefreshing && (
          <ActivityIndicator animating={true} color={colors.primary} />
        )}
      </View>
    );
  };
  const listHeader = () => {
    return (
      <>
        <StatusBar
          backgroundColor={brush.headerColor}
          barStyle="dark-content"
          animated={true}
        />
        <ImageBackground
          source={{
            uri: `${apiURL}/users/${username}/banner?optimized=true`,
          }}
          style={s.imageBackground}
          resizeMode="cover"></ImageBackground>
        <Image
          source={{ uri: `${apiURL}/users/${username}/picture` }}
          resizeMode="cover"
          style={{
            ...s.avatar,
            borderColor: brush.outlineColor,
          }}
        />
        {data && (
          <View style={s.info}>
            <Button
              icon={following ? 'account-remove' : 'account-plus'}
              textColor={brush.buttonText}
              buttonColor={brush.buttonBg}
              size={20}
              onPress={toggleFollow}
              mode="contained-tonal"
              loading={isTogglingFollow}
              style={{ marginRight: 10 }}>
              {following ? 'Unfollow' : 'Follow'} ({followers})
            </Button>
            {data.verified && (
              <IconButton
                icon="check-decagram"
                iconColor={brush.headerColor || colors.primary}
                style={s.badge}
              />
            )}
            {data.permissions.admin && (
              <IconButton
                icon="shield-star"
                iconColor={brush.headerColor || colors.primary}
                style={s.badge}
              />
            )}
            {data.beta && (
              <IconButton
                icon="flask-outline"
                iconColor={brush.headerColor || colors.primary}
                style={s.badge}
              />
            )}
          </View>
        )}
        {data?.bio && (
          <>
            <Text variant="bodyLarge" style={s.heading}>
              About me
            </Text>
            <Text style={s.bio}>{data.bio}</Text>
          </>
        )}
      </>
    );
  };
  const renderItem = React.useCallback(({ item }) => <Post post={item} />, []);
  return (
    <>
      <Appbar style={{ backgroundColor: brush.headerColor }}>
        <Appbar.BackAction
          onPress={() => goBackIfCan(navigation)}
          color={headerTextColor || colors.secondary}
        />
        <Appbar.Content
          title={username}
          color={headerTextColor || colors.secondary}
        />
        <Appbar.Action
          icon="flag-remove"
          onPress={() => {}}
          iconColor={headerTextColor || colors.secondary}
        />
        <Appbar.Action
          icon="open-in-new"
          onPress={openUser}
          iconColor={headerTextColor || colors.secondary}
        />
      </Appbar>
      <FlatList
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listLoading}
        onRefresh={refresh}
        refreshing={isRefreshing}
        onEndReached={fetchPosts}
        estimatedItemSize={250}
        windowSize={21}
      />
    </>
  );
};

export default UserPage;
