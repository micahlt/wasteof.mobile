import * as React from 'react';
import { View, FlatList } from 'react-native';
import { Avatar, Button, Searchbar, Text, useTheme } from 'react-native-paper';
import { apiURL } from './apiURL';
import Post from './components/Post';
import UserList from './components/UserList';

function Feed() {
  const { colors } = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [loadState, setLoadState] = React.useState(2);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [last, setLast] = React.useState(false);
  const onChangeSearch = q => {
    setQuery(q);
    if (q == '') {
      setPage(1);
      setPosts([]);
      setUsers([]);
      setLoadState(2);
    }
  };
  const refresh = () => {
    setIsRefreshing(true);
    setPosts([]);
    setUsers([]);
    setLoadState(2);
  };
  const search = isInitial => {
    setLoadState(2);
    if (isInitial) {
      setPage(1);
      setIsRefreshing(true);
    }
    fetch(`${apiURL}/search/posts?q=${query}&page=${page}`)
      .then(response => response.json())
      .then(json => {
        setPosts([...posts, ...json.results]);
        setPage(page + 1);
        setLoadState(loadState - 1);
        setIsRefreshing(false);
        setLast(json.last);
      })
      .catch(err => {
        alert(err);
      });
    fetch(`${apiURL}/search/users?q=${query}`)
      .then(response => response.json())
      .then(json => {
        setUsers(json.results);
        setLoadState(loadState - 1);
        setIsRefreshing(false);
      })
      .catch(err => {
        alert(err);
      });
  };
  const handleLoadMore = () => {
    if (loadState == 0) {
      search(false);
    }
  };
  const listHeader = (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={query}
        elevation={5}
        autoFocus={true}
        onSubmitEditing={search}
        style={{ borderRadius: 10, margin: 10 }}
      />
    </View>
  );
  const listLoading = (
    <View style={{ paddingTop: 20, paddingBottom: 30 }}>
      {!isRefreshing && posts[0] && !last ? (
        <Button
          loading={loadState > 0}
          mode="contained-tonal"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
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
  const renderItem = React.useCallback(
    ({ item, index }) => {
      if (index > 0) {
        return <Post post={item} key={item._id} />;
      } else {
        return (
          <React.Fragment key={index}>
            {users.length > 0 && (
              <UserList
                userObjects={users}
                style={{
                  marginLeft: -3,
                  marginBottom: 0,
                  marginTop: 0,
                  marginRight: -10,
                }}
                key={index}
              />
            )}
          </React.Fragment>
        );
      }
    },
    [users],
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <FlatList
        stickyHeaderIndices={[0]}
        data={[{}, ...posts]}
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
