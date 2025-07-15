import * as React from 'react';
import { View } from 'react-native';
import {
  Card,
  IconButton,
  Text,
  Portal,
  Modal,
  useTheme,
  Icon,
} from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import ago from 's-ago';
import s from '../../styles/Post.module.css';
import filter from '../../utils/filter';
import linkify from '../../utils/linkify';
import UserChip from './UserChip';
import AutoImage from './AutoImage';
import { GlobalContext } from '../../App';
import { apiURL } from '../apiURL';
import CommentModal from '../CommentModal';
import EditorModal from '../EditorModal';
import ShowMoreReposts from './ShowMoreReposts';

const MAX_REPOSTS = 5;

const Post = React.memo(
  ({ post, isRepost, repostCount = 1, hideUser, isPinned, brush, isInNotification }) => {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const [filteredHTML, setFilteredHTML] = React.useState(null);
    const [loved, setLoved] = React.useState(false);
    const [loves, setLoves] = React.useState(post.loves);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalMode, setModalMode] = React.useState('');
    const showModal = () => setModalOpen(true);
    const hideModal = () => setModalOpen(false);
    const { shouldFilter, username, token } = React.useContext(GlobalContext);
    const viewRef = React.useRef();
    React.useEffect(() => {
      if (shouldFilter && !filteredHTML) {
        filter(post.content)
          .then(c => {
            setFilteredHTML(c);
          })
          .catch(err => {
            setFilteredHTML(post.content);
          });
      } else if (!shouldFilter && !filteredHTML) {
        setFilteredHTML(post.content);
      }
      if (token) {
        fetch(`${apiURL}/posts/${post._id}/loves/${username}`, {
          headers: {
            Authorization: token,
          },
        })
          .then(res => {
            return res.json();
          })
          .then(json => {
            if (json) setLoved(true);
          })
          .catch(err => {
            return;
          });
      }
    }, []);
    const handleLove = () => {
      fetch(`${apiURL}/posts/${post._id}/loves`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      })
        .then(res => {
          if (res.status != 200) {
            alert(`Error code ${res.status}, try again later.`);
          } else {
            setLoved(!loved);
          }
          return res.json();
        })
        .then(json => {
          setLoves(json.new.loves);
        });
    };
    const handleComment = async () => {
      setModalMode('comment');
      showModal(true);
    };
    const handleRepost = async () => {
      setModalMode('post');
      showModal(true);
    };
    const handleLongPress = () => {
      viewRef.current.capture().then(
        uri => {
          Share.open({
            url: uri,
            message: uri,
            title: 'Share this post elsewhere',
            failOnCancel: false,
            type: 'image/png',
            filename: 'wasteof-post.png',
          });
        },
        error => console.error('Oops, snapshot failed', error),
      );
    };
    const ImageRenderer = ({ tnode }) => {
      return (
        <AutoImage
          source={tnode.attributes.src}
          fitWidth={repostCount > 1 ? width - 48 * repostCount : width - (isInNotification ? 80 : 65)}
        />
      );
    };
    const WebDisplay = React.memo(function WebDisplay() {
      return (
        <RenderHtml
          source={{
            html: linkify(filteredHTML),
          }}
          contentWidth={width - 65 * repostCount}
          tagsStyles={{
            a: { color: colors.primary },
            p: {
              color: colors.onSurface,
              fontSize: '1.035rem',
              marginTop: 0,
              marginBottom: 0,
            },
            h1: {
              marginTop: 0,
              marginBottom: 0,
            },
            h2: {
              marginTop: 0,
              marginBottom: 0,
            },
          }}
          baseStyle={{ color: colors.onSurface }}
          renderers={{ img: React.useCallback(ImageRenderer, []) }}
        />
      );
    });
    return (
      <ViewShot
        ref={viewRef}
        options={{ format: 'png', quality: 1 }}
        style={{ backgroundColor: '#ffffff00' }}>
        <Card
          style={{
            ...(isRepost ? s.repostPost : s.regularPost),
            ...(isPinned ? s.pinnedPost : {}),
            backgroundColor: colors.elevation.level1,
          }}
          innerRef={viewRef}
          mode={isRepost ? 'outlined' : 'elevated'}
          onLongPress={handleLongPress}>
          <Card.Content
            style={{ margin: 0, paddingTop: 15, paddingVertical: 0 }}>
            <Portal>
              <Modal
                visible={modalOpen}
                onDismiss={hideModal}
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  padding: 0,
                  paddingVertical: 0,
                  backgroundColor: colors.background,
                }}
                style={{ marginTop: 0 }}>
                {modalMode === 'comment' && (
                  <CommentModal postId={post._id} closeModal={hideModal} />
                )}
                {modalMode === 'post' && (
                  <EditorModal repostId={post._id} closeModal={hideModal} />
                )}
              </Modal>
            </Portal>
            {!hideUser && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <UserChip username={post.poster.name} />
                <Text
                  variant="labelLarge"
                  style={{ opacity: 0.6, fontWeight: 'normal' }}>
                  {ago(new Date(post.time))}
                </Text>
              </View>
            )}
            {isPinned && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 5,
                }}>
                <Icon source="pin" size={24} color={brush.headerColor} />
                <Text
                  variant="titleMedium"
                  style={{
                    color: brush.buttonText,
                    lineHeight: 22,
                    marginLeft: 5,
                  }}>
                  Pinned post
                </Text>
              </View>
            )}
            {filteredHTML && <WebDisplay html={post.content} />}
            {post.repost && repostCount < MAX_REPOSTS ? (
              <Post
                post={post.repost}
                isRepost={true}
                repostCount={repostCount + 1}
              />
            ) : (
              post.repost && <ShowMoreReposts />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {loved ? (
                <IconButton
                  icon="heart"
                  size={20}
                  animated={false}
                  style={s.statButton}
                  iconColor={loved ? colors.primary : colors.outline}
                  onPress={handleLove}
                />
              ) : (
                <IconButton
                  icon="heart-outline"
                  animated={false}
                  size={20}
                  style={s.statButton}
                  iconColor={loved ? colors.primary : colors.outline}
                  onPress={handleLove}
                />
              )}
              <Text style={{ ...s.stat, color: colors.outline }}>{loves}</Text>
              <IconButton
                icon="recycle-variant"
                size={20}
                animated={false}
                style={s.statButton}
                iconColor={colors.outline}
                onPress={handleRepost}
              />
              <Text style={{ ...s.stat, color: colors.outline }}>
                {post.reposts}
              </Text>
              <IconButton
                icon="comment-outline"
                size={20}
                style={s.statButton}
                animated={false}
                iconColor={colors.outline}
                onPress={handleComment}
              />
              <Text style={{ ...s.stat, color: colors.outline }}>
                {post.comments}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ViewShot>
    );
  },
);

Post.whyDidYouRender = {
  logOnDifferentValues: true,
};

export default Post;
