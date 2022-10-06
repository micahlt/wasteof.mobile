import * as React from 'react';
import {View, Linking, FlatList} from 'react-native';
import {
  Text,
  IconButton,
  Badge,
  Button,
  AnimatedFAB,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import Post from './Post';
import g from '../styles/Global.module.css';
import {GlobalContext} from '../App';

function Feed() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const [messageCount, setMessageCount] = React.useState(0);
  const [isExtended, setIsExtended] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const {username, token} = React.useContext(GlobalContext);
  React.useEffect(() => {
    if (token) {
      refresh();
    }
  }, [token]);
  const refresh = () => {
    setIsRefreshing(true);
    setPosts([]);
    fetchPosts(null, true);
  };
  const fetchPosts = (e, isInitial) => {
    setIsLoading(true);
    if (isInitial) {
      setPage(1);
      fetch(`https://api.wasteof.money/messages/count`, {
        headers: {
          Authorization: token,
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
      `https://api.wasteof.money/users/${username}/following/posts?page=${page}`,
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
    navigation.navigate('notifications');
  };
  const onScroll = ({nativeEvent}) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };
  const handleLoadMore = () => {
    if (!isLoading) {
      fetchPosts();
    }
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
      <View style={{paddingTop: 20, paddingBottom: 30}}>
        {!isRefreshing && (
          <Button
            loading={isLoading}
            mode="contained-tonal"
            style={{marginLeft: 'auto', marginRight: 'auto'}}
            onPress={handleLoadMore}>
            Load more
          </Button>
        )}
      </View>
    );
  };
  const renderItem = React.useCallback(({item}) => <Post post={item} />, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      {token && (
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
      {token ? (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listLoading}
          onRefresh={refresh}
          refreshing={isRefreshing}
          onScroll={onScroll}
          estimatedItemSize={250}
          windowSize={21}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            variant="titleLarge"
            style={{width: '70%', textAlign: 'center', marginBottom: 10}}>
            Get the most out of wasteof.mobile
          </Text>
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
