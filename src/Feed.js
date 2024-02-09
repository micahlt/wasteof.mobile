import * as React from 'react';
import { View, FlatList, Linking, ToastAndroid } from 'react-native';
import {
  Text,
  IconButton,
  Badge,
  Button,
  AnimatedFAB,
  Portal,
  Modal,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Post from './components/Post';
import g from '../styles/Global.module.css';
import { GlobalContext } from '../App';
import Changelog from './components/Changelog';
import { version as appVersion } from '../package.json';
import { apiURL } from './apiURL';
import EditorModal from './EditorModal';
import timeSort from '../utils/timeSort';
import uniqueMerge from '../utils/uniqueMerge';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Feed() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const [isExtended, setIsExtended] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const showModal = () => setModalOpen(true);
  const hideModal = shouldRefresh => {
    setModalOpen(false);
    if (shouldRefresh) refresh();
  };
  const {
    username,
    token,
    changelogViewed,
    setNotificationCount,
    notificationCount,
  } = React.useContext(GlobalContext);
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      if (token) fetchMessages();
    });
    if (token) {
      refresh();
    }
  }, [token]);
  const refresh = () => {
    setPosts([]);
    setIsRefreshing(true);
    fetchPosts(null, true);
  };
  const fetchMessages = () => {
    fetch(`${apiURL}/messages/count`, {
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
        setNotificationCount(json.count);
      })
      .catch(err => {
        alert(err);
      });
  };
  const fetchPosts = (e, isInitial) => {
    setIsLoading(true);
    if (isInitial) {
      setPosts([]);
      setPage(1);
      fetchMessages();
    }
    console.log('beforeFetch');
    fetch(
      `${apiURL}/users/${username}/following/posts?page=${
        isInitial ? 1 : page
      }&cachebust=${isInitial ? Math.floor(Math.random() * 100) : 0}`,
      {
        headers: isInitial
          ? {
              'Cache-Control': 'no-cache',
              pragma: 'no-cache',
            }
          : {},
      },
    )
      .then(response => {
        console.log('RES');
        return response.json();
      })
      .then(json => {
        let dedupedPosts = uniqueMerge(posts, json.posts, '_id');
        setPosts(timeSort(dedupedPosts));
        setPage(page + 1);
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch(err => {
        alert(err);
      });
  };
  const handleFab = async () => {
    showModal();
  };
  const openNotifs = async () => {
    Linking.openURL('wasteof://messages');
    // navigation.navigate('notifications');
  };
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };
  const handleLoadMore = () => {
    if (!isLoading) {
      fetchPosts();
    }
  };
  const listHeader = (
    <View style={g.infoBar}>
      <Text
        variant="titleLarge"
        style={{
          flex: 1,
        }}>
        Your feed
      </Text>
      <View style={g.iconButtonWrapper}>
        {notificationCount > 0 && (
          <Badge style={g.iconButtonBadge} size={24}>
            {notificationCount}
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
  const listLoading = (
    <View style={{ paddingTop: 20, paddingBottom: 30 }}>
      {!isRefreshing && (
        <Button
          loading={isLoading}
          mode="contained-tonal"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          onPress={handleLoadMore}>
          Load more
        </Button>
      )}
    </View>
  );
  const renderItem = React.useCallback(({ item }) => <Post post={item} />, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      {appVersion != changelogViewed && <Changelog />}
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
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            variant="titleLarge"
            style={{ width: '70%', textAlign: 'center', marginBottom: 10 }}>
            Get the most out of wasteof for Android
          </Text>
          <Button
            mode="contained-tonal"
            icon="account-lock-outline"
            onPress={() => navigation.navigate('settings')}>
            Sign In
          </Button>
        </View>
      )}
      <Portal>
        <Modal
          visible={modalOpen}
          onDismiss={hideModal}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-start',
            padding: 0,
            paddingVertical: 0,
          }}
          style={{ marginTop: 0 }}>
          <EditorModal closeModal={hideModal} />
        </Modal>
      </Portal>
    </View>
  );
}

export default Feed;
