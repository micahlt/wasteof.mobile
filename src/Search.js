import * as React from 'react';
import {View, FlatList} from 'react-native';
import {Avatar, Button, Searchbar, Text, useTheme} from 'react-native-paper';
import Post from './components/Post';

function Feed() {
  const {colors} = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const onChangeSearch = q => {
    setQuery(q);
    if (q == '') {
      setPage(1);
      setPosts([]);
    }
  };
  const refresh = () => {
    setIsRefreshing(true);
    setPosts([]);
  };
  const searchPosts = isInitial => {
    setIsLoading(true);
    if (isInitial) {
      setPage(1);
      setIsRefreshing(true);
    }
    fetch(`https://api.wasteof.money/search/posts?q=${query}&page=${page}`)
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
  const handleLoadMore = () => {
    if (!isLoading) {
      searchPosts(false);
    }
  };
  const listHeader = (
    <View style={{padding: 10}}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={query}
        elevation={5}
        autoFocus={true}
        onSubmitEditing={searchPosts}
        style={{borderRadius: 10}}
      />
    </View>
  );
  const listLoading = () => {
    return (
      <View style={{paddingTop: 20, paddingBottom: 30}}>
        {!isRefreshing && posts[0] ? (
          <Button
            loading={isLoading}
            mode="contained-tonal"
            style={{marginLeft: 'auto', marginRight: 'auto'}}
            onPress={handleLoadMore}>
            Load more
          </Button>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              variant="titleLarge"
              style={{
                width: '70%',
                textAlign: 'center',
                marginBottom: 0,
                color: colors.outline,
              }}>
              let's find something
            </Text>
          </View>
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
        stickyHeaderIndices={[0]}
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
