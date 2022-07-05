import * as React from 'react';
import {View} from 'react-native';
import {
  Card,
  IconButton,
  Chip,
  Avatar,
  Text,
  useTheme,
} from 'react-native-paper';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import linkifyHtml from 'linkify-html';
import s from '../styles/Post.module.css';

const Post = ({post}) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  return (
    <Card
      style={{
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 10,
      }}
      mode="elevated">
      <Card.Content style={{margin: 0, paddingTop: 15, paddingVertical: 0}}>
        <Chip
          avatar={
            <Avatar.Image
              size={24}
              source={{
                uri: `https://api.wasteof.money/users/${post.poster.name}/picture`,
              }}
            />
          }
          onPress={() => console.log('Pressed')}
          style={{marginRight: 'auto', marginBottom: 7}}>
          {post.poster.name}
        </Chip>
        <RenderHtml
          source={{html: linkifyHtml(post.content)}}
          contentWidth={width - 65}
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IconButton icon="heart-outline" size={20} style={s.statButton} />
          <Text style={{...s.stat, color: colors.onSurfaceVariant}}>
            {post.loves}
          </Text>
          <IconButton icon="recycle-variant" size={20} style={s.statButton} />
          <Text style={{...s.stat, color: colors.onSurfaceVariant}}>
            {post.reposts}
          </Text>
          <IconButton icon="comment-outline" size={20} style={s.statButton} />
          <Text style={{...s.stat, color: colors.onSurfaceVariant}}>
            {post.comments}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default Post;
