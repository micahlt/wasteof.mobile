import * as React from 'react';
import {View, Linking} from 'react-native';
import {
  Text,
  IconButton,
  Badge,
  Button,
  AnimatedFAB,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {FlashList} from '@shopify/flash-list';
import Post from './Post';
import useSession from '../hooks/useSession';
import g from '../styles/Global.module.css';

function Feed() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [posts, setPosts] = React.useState([]);
  const session = useSession();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const [messageCount, setMessageCount] = React.useState(0);
  const [isExtended, setIsExtended] = React.useState(true);
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    if (session) {
      refresh(session);
    }
  }, [session]);
  const refresh = s => {
    fetchPosts(s || null, true);
  };
  const fetchPosts = (s, isInitial) => {
    setIsLoading(true);
    if (isInitial) {
      setIsRefreshing(true);
      setPosts([]);
      setPage(1);
      fetch(`https://api.wasteof.money/messages/count`, {
        headers: {
          Authorization: session?.token || s.token,
        },
      })
        .then(res => {
          if (res.status == 200) {
            return res.json();
          } else {
            alert(`Error ${res.status} - try again later.`);
          }
        })
        .then(json => {
          setMessageCount(json.count);
        })
        .catch(err => {
          alert(err);
        });
    }
    fetch(
      `https://api.wasteof.money/users/${
        session?.username || s.username
      }/following/posts?page=${page}`,
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        setPosts([...posts, ...json.posts]);
        setPage(page + 1);
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch(err => {
        alert(err);
      });
  };
  const handleFab = async () => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open('https://wasteof.money/posts/new', {
        toolbarColor: colors.primary,
      });
    } else {
      Linking.open('https://wasteof.money/posts/new');
    }
  };
  const openNotifs = async () => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open('https://wasteof.money/messages', {
        toolbarColor: colors.primary,
      });
    } else {
      Linking.open('https://wasteof.money/messages');
    }
  };
  const onScroll = ({nativeEvent}) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const listHeader = () => {
    return (
      <View style={g.infoBar}>
        <Text variant="titleLarge" style={{fontWeight: 'bold', flex: 1}}>
          Your feed
        </Text>
        <View style={g.iconButtonWrapper}>
          {messageCount > 0 && (
            <Badge style={g.iconButtonBadge} size={24}>
              {messageCount}
            </Badge>
          )}
          <IconButton
            icon="bell"
            size={24}
            iconColor={colors.primary}
            onPress={openNotifs}
          />
        </View>
      </View>
    );
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
  const renderItem = ({item}) => <Post post={item} />;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      {session && (
        <AnimatedFAB
          icon="pencil-plus"
          style={g.fab}
          onPress={handleFab}
          size="medium"
          variant="secondary"
          label="Create"
          animated={true}
          extended={isExtended}
          animateFrom="right"
        />
      )}
      {session ? (
        <FlashList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listLoading}
          onRefresh={refresh}
          refreshing={isRefreshing}
          onEndReached={fetchPosts}
          onScroll={onScroll}
          estimatedItemSize={100}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Button
            mode="contained-tonal"
            icon="account-lock-outline"
            onPress={() => navigation.navigate('settings')}>
            Sign In
          </Button>
        </View>
      )}
    </View>
  );
}

export default Feed;
