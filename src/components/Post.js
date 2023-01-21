import * as React from 'react';
import {View} from 'react-native';
import {Card, IconButton, Text, useTheme} from 'react-native-paper';
import {useWindowDimensions, Linking} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import ago from 's-ago';
import s from '../../styles/Post.module.css';
import filter from '../../utils/filter';
import linkifyHtml from 'linkify-html';
import UserChip from './UserChip';
import AutoImage from './AutoImage';
import {GlobalContext} from '../../App';
import { apiURL } from '../apiURL';

const Post = React.memo(({post, isRepost, repostCount, hideUser}) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  const [filteredHTML, setFilteredHTML] = React.useState(null);
  const [loved, setLoved] = React.useState(false);
  const [loves, setLoves] = React.useState(post.loves);
  const [localRepostCount, setLocalRepostCount] = React.useState(
    repostCount || 1,
  );
  const {shouldFilter, username, token} = React.useContext(GlobalContext);
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
      fetch(`${apiURL}/posts/${post._id}/loves/${username}`)
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
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(`https://wasteof.money/posts/${post._id}`, {
        toolbarColor: colors.primary,
      });
    } else {
      Linking.open(`https://wasteof.money/posts/${post._id}`);
    }
  };
  const ImageRenderer = ({tnode}) => {
    return (
      <AutoImage
        source={tnode.attributes.src}
        fitWidth={width - 65 * localRepostCount}
      />
    );
  };
  const WebDisplay = React.memo(function WebDisplay({html}) {
    return (
      <RenderHtml
        source={{html: linkifyHtml(filteredHTML)}}
        contentWidth={width - 65 * localRepostCount}
        tagsStyles={{
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
        renderers={{img: React.useCallback(ImageRenderer, [])}}
      />
    );
  });
  return (
    <Card
      style={{
        ...(isRepost ? s.repostPost : s.regularPost),
        backgroundColor: colors.elevation.level1,
      }}
      mode={isRepost ? 'outlined' : 'elevated'}>
      <Card.Content style={{margin: 0, paddingTop: 15, paddingVertical: 0}}>
        {!hideUser && (
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <UserChip username={post.poster.name} />
            <Text
              variant="labelLarge"
              style={{opacity: 0.6, fontWeight: 'normal'}}>
              {ago(new Date(post.time))}
            </Text>
          </View>
        )}
        {filteredHTML && <WebDisplay html={post.content} />}
        {post.repost && (
          <Post
            post={post.repost}
            isRepost={true}
            repostCount={localRepostCount + 1}
          />
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          <Text style={{...s.stat, color: colors.outline}}>{loves}</Text>
          <IconButton
            icon="recycle-variant"
            size={20}
            animated={false}
            style={s.statButton}
            iconColor={colors.outline}
          />
          <Text style={{...s.stat, color: colors.outline}}>{post.reposts}</Text>
          <IconButton
            icon="comment-outline"
            size={20}
            style={s.statButton}
            animated={false}
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
});

Post.whyDidYouRender = {
  logOnDifferentValues: true,
};

export default Post;
