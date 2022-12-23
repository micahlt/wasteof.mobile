import * as React from 'react';
import {View, Linking, FlatList} from 'react-native';
import {Button, Searchbar, useTheme} from 'react-native-paper';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import Post from './components/Post';

function Feed() {
  const {colors} = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const onChangeSearch = q => setQuery(q);
  const refresh = () => {
    setIsRefreshing(true);
    setPosts([]);
    search(true);
  };
  const searchPosts = isInitial => {
    setIsLoading(true);
    if (isInitial) {
      setPage(1);
    }
    fetch(`https://api.wasteof.money/search/posts?q=${query}`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setPosts([...posts, ...json.results]);
        setPage(page + 1);
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch(err => {
        alert(err);
      });
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
  const handleLoadMore = () => {
    if (!isLoading) {
      fetchPosts();
    }
  };
  const listHeader = () => {
    return (
      <View style={{padding: 10}}>
        <Searchbar placeholder="Search" onChangeText={onChangeSearch} />
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
      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listLoading}
        onRefresh={refresh}
        refreshing={isRefreshing}
        estimatedItemSize={250}
        windowSize={21}
      />
    </View>
  );
}

export default Feed;
