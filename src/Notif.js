import * as React from 'react';
import {View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import ago from 's-ago';
import s from '../styles/Notif.module.css';
import UserChip from './UserChip';
import Comment from './Comment';
import Post from './Post';

const Notif = React.memo(({notif}) => {
  const t = notif.type;
  return (
    <Card style={s.notif} mode="elevated">
      <Card.Content style={{margin: 0, paddingTop: 15, paddingVertical: 0}}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <UserChip username={notif.data.actor.name} />
          <Text
            variant="labelLarge"
            style={{opacity: 0.6, fontWeight: 'normal'}}>
            {ago(new Date(notif.time))}
          </Text>
        </View>
        {
          // Follows
          t == 'follow' && (
            <>
              <Text style={s.notifDescription}>followed you</Text>
            </>
          )
        }
        {
          // Comments on your posts
          t == 'comment' && (
            <>
              <Text style={s.notifDescription}>commented on your post</Text>
              <Comment comment={notif.data.comment} />
            </>
          )
        }
        {
          // Comments on your wall
          t == 'wall_comment' && (
            <>
              <Text style={s.notifDescription}>commented on your wall</Text>
              <Comment comment={notif.data.comment} />
            </>
          )
        }
        {
          // Comments on your wall
          t == 'wall_comment_reply' && (
            <>
              <Text style={s.notifDescription}>
                replied to your comment on your wall
              </Text>
              <Comment comment={notif.data.comment} />
            </>
          )
        }
        {
          // Comment replies
          t == 'comment_reply' && (
            <>
              <Text style={s.notifDescription}>
                replied to your comment on @{notif.data.post.poster.name}'s post
              </Text>
              <Comment comment={notif.data.comment} />
            </>
          )
        }
        {
          // Comment mentions
          t == 'comment_mention' && (
            <>
              <Text style={s.notifDescription}>
                mentioned you in a comment on @{notif.data.post.poster.name}'s
                post
              </Text>
              <Comment comment={notif.data.comment} />
            </>
          )
        }
        {
          // Comment mentions
          t == 'repost' && (
            <>
              <Text style={s.notifDescription}>reposted your post</Text>
              <Post post={notif.data.post} isRepost={true} hideUser={true} />
            </>
          )
        }
        {
          // Comment mentions
          t == 'post_mention' && (
            <>
              <Text style={s.notifDescription}>
                mentioned you in their post
              </Text>
              <Post post={notif.data.post} isRepost={true} hideUser={true} />
            </>
          )
        }
      </Card.Content>
    </Card>
  );
});

// Notif.whyDidYouRender = {
//   logOnDifferentValues: true,
// };

export default Notif;
