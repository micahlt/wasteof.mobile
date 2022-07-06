import * as React from 'react';
import {View} from 'react-native';
import {Card, IconButton, Text, useTheme} from 'react-native-paper';
import {useWindowDimensions, Linking} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import useSession from '../hooks/useSession';
import s from '../styles/Post.module.css';
import filter from '../utils/filter';
import linkifyHtml from 'linkify-html';
import UserChip from './UserChip';

const Post = ({post, isRepost, repostCount}) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  const [filteredHTML, setFilteredHTML] = React.useState(null);
  const [loved, setLoved] = React.useState(false);
  const [loves, setLoves] = React.useState(post.loves);
  const [localRepostCount, setLocalRepostCount] = React.useState(
    repostCount || 1,
  );
  const session = useSession();
  React.useEffect(() => {
    filter(post.content)
      .then(c => {
        setFilteredHTML(c);
      })
      .catch(err => {
        setFilteredHTML(post.content);
      });
    if (session) {
      fetch(
        `https://api.wasteof.money/posts/${post._id}/loves/${session.username}`,
      )
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
  }, [session]);
  const handleLove = () => {
    fetch(`https://api.wasteof.money/posts/${post._id}/loves`, {
      method: 'POST',
      headers: {
        Authorization: session.token,
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
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(`https://wasteof.money/posts/${post._id}`, {
        toolbarColor: colors.primary,
      });
    } else {
      Linking.open(`https://wasteof.money/posts/${post._id}`);
    }
  };
  const WebDisplay = React.memo(function WebDisplay({html}) {
    return (
      <RenderHtml
        source={{html: linkifyHtml(filteredHTML)}}
        contentWidth={width - 65 * localRepostCount}
        tagsStyles={{
          img: {
            backgroundColor: 'white',
          },
          a: {color: colors.primary},
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
        baseStyle={{color: colors.onSurface}}
      />
    );
  });
  return (
    <Card
      style={isRepost ? s.repostPost : s.regularPost}
      mode={isRepost ? 'outlined' : 'elevated'}>
      <Card.Content style={{margin: 0, paddingTop: 15, paddingVertical: 0}}>
        <UserChip username={post.poster.name} />
        {filteredHTML && <WebDisplay html={post.content} />}
        {post.repost && (
          <Post
            post={post.repost}
            isRepost={true}
            repostCount={localRepostCount + 1}
          />
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IconButton
            icon={loved ? 'heart' : 'heart-outline'}
            size={20}
            style={s.statButton}
            iconColor={loved ? colors.primary : colors.outline}
            onPress={handleLove}
          />
          <Text style={{...s.stat, color: colors.outline}}>{loves}</Text>
          <IconButton
            icon="recycle-variant"
            size={20}
            style={s.statButton}
            iconColor={colors.outline}
          />
          <Text style={{...s.stat, color: colors.outline}}>{post.reposts}</Text>
          <IconButton
            icon="comment-outline"
            size={20}
            style={s.statButton}
            iconColor={colors.outline}
            onPress={handleComment}
          />
          <Text style={{...s.stat, color: colors.outline}}>
            {post.comments}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default Post;
