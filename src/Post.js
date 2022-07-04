import * as React from 'react';
import {Card, Paragraph, Chip, Avatar, useTheme} from 'react-native-paper';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import linkifyHtml from 'linkify-html';

const Post = ({post}) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  return (
    <Card style={{marginLeft: 16, marginRight: 16, marginBottom: 10}}>
      <Card.Content style={{margin: 0}}>
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
          style={{marginRight: 'auto'}}>
          {post.poster.name}
        </Chip>
        <RenderHtml
          source={{html: linkifyHtml(post.content)}}
          contentWidth={width - 65}
          tagsStyles={{
            img: {backgroundColor: 'white'},
            a: {color: colors.primary},
            p: {color: colors.onSurface},
          }}
          baseStyle={{color: colors.onSurface}}
        />
      </Card.Content>
    </Card>
  );
};

export default Post;
