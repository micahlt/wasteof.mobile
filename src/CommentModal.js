import * as React from 'react';
import { View, FlatList } from 'react-native';
import {
  Appbar,
  ActivityIndicator,
  useTheme,
  TextInput,
  IconButton,
} from 'react-native-paper';
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
  const [isCommenting, setIsCommenting] = React.useState(false);
  const [commentContent, setCommentContent] = React.useState('');
  const [replyMetadata, setReplyMetadata] = React.useState(null);
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
        setComments([...comments, ...json.comments]);
        setPage(page + 1);
        setIsRefreshing(false);
        setIsLoading(false);
      });
  };
  const startComment = metadata => {
    setReplyMetadata(metadata);
    setCommentContent('');
    setIsCommenting(true);
  };
  const openComments = async () => {
    links.open(`${wasteofURL}/posts/${postId}#comments`);
  };
  const sendComment = () => {
    fetch(`https://api.wasteof.money/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `<p>${commentContent}</p>`,
        parent: replyMetadata?.id || null,
      }),
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {
        console.log(data);
        setIsCommenting(false);
        refresh();
      });
  };
  const deleteComment = commentId => {
    fetch(`https://api.wasteof.money/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    }).then(() => {
      refresh();
    });
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
    ({ item }) => (
      <Comment
        comment={item}
        depth={1}
        replyHandler={startComment}
        deleteHandler={deleteComment}
      />
    ),
    [],
  );
  return (
    <>
      <Appbar style={{ backgroundColor: colors.elevation.level2, zIndex: 1 }}>
        <Appbar.BackAction onPress={closeModal} />
        <Appbar.Content title="Comments" />
        <Appbar.Action
          icon="plus"
          onPress={() => startComment(null)}
          iconColor={colors.secondary}
          accessibilityLabel="New comment"
        />
        <Appbar.Action
          icon="open-in-new"
          onPress={openComments}
          iconColor={colors.secondary}
          accessibilityLabel="Open comments in browser"
        />
      </Appbar>
      {startComment && (
        <View style={{ flex: 1 }}>
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
          {isCommenting ? (
            <TextInput
              multiline={true}
              autoFocus={true}
              onChangeText={setCommentContent}
              label={
                replyMetadata
                  ? `Reply to ${replyMetadata.username}`
                  : `Write your comment`
              }
              right={<TextInput.Icon icon="send" onPress={sendComment} />}
            />
          ) : (
            <></>
          )}
        </View>
      )}
    </>
  );
};

export default CommentModal;
