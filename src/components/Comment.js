import * as React from 'react';
import { Text, Card, useTheme } from 'react-native-paper';
import { View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import s from '../../styles/Comment.module.css';
import filter from '../../utils/filter';
import linkifyHtml from 'linkify-html';
import AutoImage from './AutoImage';
import { GlobalContext } from '../../App';
import UserChip from './UserChip';
import { apiURL } from '../apiURL';

const Comment = React.memo(
  ({ comment, depth, originalPoster, isReply, inNotif }) => {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const [filteredHTML, setFilteredHTML] = React.useState(null);
    const [replies, setReplies] = React.useState([]);
    const [replyPage, setReplyPage] = React.useState([]);
    const { shouldFilter } = React.useContext(GlobalContext);
    const MAX_DEPTH = 6;
    React.useEffect(() => {
      if (shouldFilter && !filteredHTML) {
        filter(comment.content)
          .then(c => {
            setFilteredHTML(c);
          })
          .catch(err => {
            setFilteredHTML(comment.content);
          });
      } else if (!shouldFilter && !filteredHTML) {
        setFilteredHTML(comment.content);
      }
      fetch(`${apiURL}/comments/${comment._id}/replies?page=${replyPage}`)
        .then(res => res.json())
        .then(data => {
          setReplies([...replies, ...data.comments]);
        });
    }, []);
    const ImageRenderer = ({ tnode }) => {
      return <AutoImage source={tnode.attributes.src} />;
    };
    const WebDisplay = React.memo(function WebDisplay({ html }) {
      return (
        <RenderHtml
          source={{ html: linkifyHtml(filteredHTML) }}
          contentWidth={width - 65}
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
      <>
        <Card
          style={{
            ...(inNotif ? {} : s.regularComment),
            marginLeft: inNotif ? 0 : (depth || 1) * 10,
          }}
          mode="outlined">
          <Card.Content
            style={{
              margin: 0,
              paddingTop: 15,
              paddingVertical: 0,
              paddingBottom: 15,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <UserChip username={comment.poster.name} />
              {isReply && (
                <Text
                  variant="labelLarge"
                  style={{ opacity: 0.6, fontWeight: 'normal' }}>
                  reply to {originalPoster}
                </Text>
              )}
            </View>
            {filteredHTML && <WebDisplay html={comment.content} />}
          </Card.Content>
        </Card>
        {replies.map(reply => (
          <Comment
            depth={(depth | 1) + 1}
            comment={reply}
            key={reply._id}
            originalPoster={comment.poster.name}
            isReply={true}
          />
        ))}
      </>
    );
  },
);

export default Comment;
