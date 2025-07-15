import * as React from 'react';
import { ImageBackground, View, Image, Linking, FlatList } from 'react-native';
import {
  Appbar,
  Button,
  IconButton,
  Text,
  ActivityIndicator,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
import Post from './components/Post';
import s from '../styles/UserModal.module.css';
import { GlobalContext } from '../App';
import { apiURL, wasteofURL } from './apiURL';
import getColorFromTheme from '../utils/getColorFromTheme';
import { StatusBar, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { goBackIfCan } from '../utils/goBackIfCan';
import ErrorCard from './components/ErrorCard';
import linkify from '../utils/linkify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import links from '../utils/links';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const [pinnedPost, setPinnedPost] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [following, setFollowing] = React.useState(false);
  const [followers, setFollowers] = React.useState(0);
  const [isTogglingFollow, setIsTogglingFollow] = React.useState(false);
  const [error, setError] = React.useState(null);
  const refresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setPosts([]);
    setPinnedPost(null);
    fetch(`${apiURL}/users/${username}`)
      .then(async res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new ErrorCard(res.status);
        }
      })
      .then(json => {
        setData(json);
        setFollowers(json.stats.followers);
        fetchPosts();
        if (json.color) {
          const brushData = getColorFromTheme(json.color, isDark);
          setBrush(brushData);
          setHeaderTextColor('#000000');
        }
      })
      .catch(err => {
        setBrush({ ...brush, headerColor: colors.errorContainer });
        setHeaderTextColor(colors.onErrorContainer);
        setError({
          code: err,
          message:
            "Something went wrong while loading this profile.  Maybe it doesn't exist?",
        });
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };
  const fetchPosts = () => {
    fetch(`${apiURL}/users/${username}/posts?page=${page}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then(json => {
        setPosts([...posts, ...json.posts]);
        AsyncStorage.getItem('showPinnedPosts').then(res => {
          if (res === 'true') {
            if (json.pinned[0]) {
              setPinnedPost(json.pinned[0]);
            }
          }
        });
        setPage(page + 1);
        setIsRefreshing(false);
        setIsLoading(false);
      })
      .catch(err => {
        setError({
          code: err.message,
          message:
            "Something went wrong while loading this profile's posts.  Maybe this user doesn't exist?",
        });
        setBrush({ ...brush, headerColor: colors.errorContainer });
        setHeaderTextColor(colors.onErrorContainer);
        setIsLoading(false);
        setIsRefreshing(false);
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
      refresh();
    }, [token, route]),
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
    links.open(`${wasteofURL}/@${username}`, brush.headerColor);
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
  const WebDisplay = React.memo(function WebDisplay() {
    const { width } = useWindowDimensions();
    return (
      <RenderHtml
        source={{
          html: linkify(data.bio),
        }}
        contentWidth={width}
        tagsStyles={{
          a: { color: colors.primary },
          p: {
            color: colors.onSurface,
            fontSize: '1.035rem',
            marginTop: 0,
            marginBottom: 0,
          },
          h1: {
            marginTop: 0,
            marginBottom: 0,
          },
          h2: {
            marginTop: 0,
            marginBottom: 0,
          },
        }}
        baseStyle={{ ...s.bio, color: colors.onSurfaceVariant }}
      />
    );
  });
  const listHeader = () => {
    return (
      <>
        <StatusBar
          backgroundColor={brush.headerColor}
          barStyle="dark-content"
          animated={true}
        />
        {data && (
          <>
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
          </>
        )}
        {data?.bio && (
          <>
            <Text variant="titleMedium" style={s.heading}>
              About me
            </Text>
            <WebDisplay />
            <Divider
              horizontalInset={true}
              bold={true}
              style={{ marginTop: 5, marginBottom: 15 }}
            />
          </>
        )}
        {pinnedPost && (
          <>
            <Post
              post={pinnedPost}
              isRepost={true}
              isPinned={true}
              hideUser={true}
              brush={brush}
            />
          </>
        )}
      </>
    );
  };
  const renderItem = React.useCallback(({ item }) => <Post post={item} />, []);
  const insets = useSafeAreaInsets();
  return (
    <>
      <Appbar.Header style={{ backgroundColor: brush.headerColor, zIndex: 1 }}>
        <Appbar.BackAction
          onPress={() => goBackIfCan(navigation)}
          color={headerTextColor || colors.secondary}
        />
        <Appbar.Content
          title={username}
          color={headerTextColor || colors.secondary}
        />
        <Appbar.Action
          icon="flag-remove-outline"
          onPress={() => { }}
          iconColor={headerTextColor || colors.secondary}
        />
        <Appbar.Action
          icon="forum-outline"
          onPress={() => links.open(`${wasteofURL}/users/${username}/wall`)}
          iconColor={headerTextColor || colors.secondary}
        />
        <Appbar.Action
          icon="open-in-new"
          onPress={openUser}
          iconColor={headerTextColor || colors.secondary}
        />
      </Appbar.Header>
      {error && (
        <ErrorCard errorCode={error.code} errorMessage={error.message} />
      )}
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
