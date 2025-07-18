import * as React from 'react';
import { View, FlatList } from 'react-native';
import {
  Appbar,
  ActivityIndicator,
  Avatar,
  Text,
  useTheme,
  TextInput,
  FAB,
} from 'react-native-paper';
import { GlobalContext } from '../App';
import { apiURL, wasteofURL } from './apiURL';
import links from '../utils/links';
import uniqueMerge from '../utils/uniqueMerge';
import timeSort from '../utils/timeSort';
import Comment from './components/Comment';
import g from '../styles/Global.module.css';
import { useNavigation } from '@react-navigation/core';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CommentModal = ({ postId, closeModal }) => {
  const navigation = useNavigation();
  const { username: myUsername, token } = React.useContext(GlobalContext);
  const { colors } = useTheme();
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const [isCommenting, setIsCommenting] = React.useState(false);
  const [commentContent, setCommentContent] = React.useState('');
  const [replyMetadata, setReplyMetadata] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const insets = useSafeAreaInsets();
  const refresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setComments([]);
    fetchComments(null, 1);
  };
  const fetchComments = (e, forceFirstPage) => {
    fetch(`${apiURL}/posts/${postId}/comments?page=${forceFirstPage || page}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        setComments(timeSort(uniqueMerge(comments, json.comments, '_id')));
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
        return res.json();
      })
      .then(data => {
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
      setComments(comments.filter(obj => obj._id != commentId));
    });
  };
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!isCommenting) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();
        setIsCommenting(false);
      }),
    [navigation, isCommenting],
  );
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
    return (
      <>
        {!isLoading && comments.length == 0 && (
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              backgroundColor: colors.background,
            }}>
            <Avatar.Icon
              size={128}
              icon="comment-remove-outline"
              style={{
                backgroundColor: colors.elevation.level4,
                marginTop: 50,
                marginBottom: 20,
              }}
            />
            <Text variant="labelLarge">No comments</Text>
          </View>
        )}
      </>
    );
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
      <Appbar.Header
        style={{ backgroundColor: colors.elevation.level2, zIndex: 1 }}>
        <Appbar.BackAction onPress={closeModal} />
        <Appbar.Content title="Comments" />
        <Appbar.Action
          icon="open-in-new"
          onPress={openComments}
          iconColor={colors.secondary}
          accessibilityLabel="Open comments in browser"
        />
      </Appbar.Header>
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
            <KeyboardStickyView offset={{ opened: insets.bottom }}>
              <TextInput
                multiline={true}
                autoFocus={true}
                onChangeText={setCommentContent}
                contentStyle={{ paddingRight: 100 }}
                label={
                  replyMetadata
                    ? `Reply to ${replyMetadata.username}`
                    : `Write your comment`
                }
              // right={<TextInput.Icon icon="send" onPress={sendComment} />}
              />
              <FAB
                onPress={
                  isCommenting ? () => sendComment() : () => startComment(null)
                }
                icon={isCommenting ? 'send' : 'pencil-plus'}
                style={g.fab}
                variant={isCommenting ? 'primary' : 'secondary'}></FAB>
            </KeyboardStickyView>
          ) : (
            <></>
          )}
        </View>
      )}
    </>
  );
};

export default CommentModal;
