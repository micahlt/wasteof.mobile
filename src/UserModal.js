import * as React from 'react';
import {ImageBackground, View, Image, Linking, FlatList} from 'react-native';
import {
  Appbar,
  Button,
  IconButton,
  Text,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import ImageColors from 'react-native-image-colors';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import Post from './components/Post';
import s from '../styles/UserModal.module.css';
import {GlobalContext} from '../App';

const UserModal = ({username, closeModal}) => {
  const {username: myUsername, token} = React.useContext(GlobalContext);
  const {colors, isDark} = useTheme();
  const [headerColor, setHeaderColor] = React.useState(colors.surface);
  const [outlineColor, setOutlineColor] = React.useState(colors.outline);
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
    ImageColors.getColors(
      `https://api.wasteof.money/users/${username}/banner?optimized=true`,
      {
        fallback: colors.surface,
        cache: true,
        key: String(Math.random()),
      },
    )
      .then(res => {
        if (isDark) setHeaderColor(res.darkMuted);
        else setHeaderColor(res.lightMuted);
        setOutlineColor(res.lightVibrant);
      })
      .catch(err => {
        alert(
          'Failed to get the banner data - this means no dynamic theming for this profile.',
        );
      });
    fetch(`https://api.wasteof.money/users/${username}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        setData(json);
        setFollowers(json.stats.followers);
      });
    setPage(1);
    setPosts([]);
    fetchPosts();
  };
  const fetchPosts = () => {
    fetch(`https://api.wasteof.money/users/${username}/posts?page=${page}`)
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
  React.useEffect(() => {
    if (token) {
      refresh();
      fetch(
        `https://api.wasteof.money/users/${username}/followers/${myUsername}`,
      )
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
  }, [token]);
  const toggleFollow = () => {
    setIsTogglingFollow(true);
    fetch(`https://api.wasteof.money/users/${username}/followers`, {
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
      await InAppBrowser.open(`https://wasteof.money/@${username}`, {
        toolbarColor: headerColor,
      });
    } else {
      Linking.open(`https://wasteof.money/@${username}`);
    }
  };
  const listLoading = () => {
    return (
      <View style={{padding: 20}}>
        {isLoading && !isRefreshing && (
          <ActivityIndicator animating={true} color={colors.primary} />
        )}
      </View>
    );
  };
  const listHeader = () => {
    return (
      <>
        <ImageBackground
          source={{
            uri: `https://api.wasteof.money/users/${username}/banner?optimized=true`,
          }}
          style={s.imageBackground}
          resizeMode="cover"></ImageBackground>
        <Image
          source={{uri: `https://api.wasteof.money/users/${username}/picture`}}
          resizeMode="cover"
          style={{
            ...s.avatar,
            borderColor: outlineColor,
          }}
        />
        {data && (
          <View style={s.info}>
            <Button
              icon={following ? 'account-remove' : 'account-plus'}
              iconColor={colors.onSurface}
              size={20}
              onPress={toggleFollow}
              mode="contained-tonal"
              loading={isTogglingFollow}
              style={{marginRight: 10}}>
              {following ? 'Unfollow' : 'Follow'} ({followers})
            </Button>
            {data.verified && (
              <IconButton
                icon="check-decagram"
                iconColor={colors.primary}
                style={s.badge}
              />
            )}
            {data.permissions.admin && (
              <IconButton
                icon="shield-star"
                iconColor={colors.primary}
                style={s.badge}
              />
            )}
            {data.beta && (
              <IconButton
                icon="flask-outline"
                iconColor={colors.primary}
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
  const renderItem = React.useCallback(({item}) => <Post post={item} />, []);
  return (
    <>
      <Appbar style={{backgroundColor: headerColor}}>
        <Appbar.BackAction onPress={closeModal} />
        <Appbar.Content title={username} />
        <Appbar.Action
          icon="flag-remove"
          onPress={() => {}}
          iconColor={colors.secondary}
        />
        <Appbar.Action
          icon="open-in-new"
          onPress={openUser}
          iconColor={colors.secondary}
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

export default UserModal;
