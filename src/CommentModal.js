import * as React from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, ActivityIndicator, useTheme } from 'react-native-paper';
import { GlobalContext } from '../App';
import { apiURL, wasteofURL } from './apiURL';
import links from '../utils/links';
import Comment from './components/Comment';

const CommentModal = ({ postId, closeModal }) => {
  const { username: myUsername, token } = React.useContext(GlobalContext);
  const { colors } = useTheme();
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const refresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setComments([]);
    fetchComments();
  };
  const fetchComments = () => {
    fetch(`${apiURL}/posts/${postId}/comments?page=${page}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        console.log(json);
        setComments([...comments, ...json.comments]);
        setPage(page + 1);
        setIsRefreshing(false);
        setIsLoading(false);
      });
  };
  const openComments = async () => {
    links.open(`${wasteofURL}/posts/${postId}#comments`);
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
    return <></>;
  };
  const renderItem = React.useCallback(
    ({ item }) => <Comment comment={item} depth={1} />,
    [],
  );
  return (
    <>
      <Appbar style={{ backgroundColor: colors.elevation.level2 }}>
        <Appbar.BackAction onPress={closeModal} />
        <Appbar.Content title="Comments" />
        <Appbar.Action
          icon="open-in-new"
          onPress={openComments}
          iconColor={colors.secondary}
        />
      </Appbar>
      <FlatList
        style={{
          paddingTop: 10,
          flex: 1,
          backgroundColor: colors.background,
        }}
        data={comments}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listLoading}
        onRefresh={refresh}
        refreshing={isRefreshing}
        onEndReached={fetchComments}
        estimatedItemSize={125}
        windowSize={10}
      />
    </>
  );
};

export default CommentModal;
