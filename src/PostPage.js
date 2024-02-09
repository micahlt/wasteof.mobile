import * as React from 'react';
import { StatusBar, View, ScrollView } from 'react-native';
import { ActivityIndicator, Appbar, useTheme } from 'react-native-paper';
import Post from './components/Post';
import { useEffect } from 'react';
import { apiURL } from './apiURL';
import { goBackIfCan } from '../utils/goBackIfCan';

const PostPage = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { postId } = route?.params;
  const [post, setPost] = React.useState(null);
  useEffect(() => {
    fetch(`${apiURL}/posts/${postId}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, []);
  return (
    <View>
      <StatusBar backgroundColor={colors.elevation.level2} animated={true} />
      <Appbar elevated={true}>
        <Appbar.BackAction onPress={() => goBackIfCan(navigation)} />
        <Appbar.Content title="Post" color={colors.secondary} />
        <Appbar.Action
          icon="flag-remove"
          onPress={() => {}}
          iconColor={colors.secondary}
        />
        <Appbar.Action
          icon="open-in-new"
          onPress={() => {}}
          iconColor={colors.secondary}
        />
      </Appbar>
      <ScrollView>
        <ActivityIndicator
          style={{ margin: 32 }}
          size="large"
          animating={!post}
        />
        {post && <Post post={post} isRepost={false} hideUser={false} />}
      </ScrollView>
    </View>
  );
};

export default PostPage;
