import * as React from 'react';
import {View, FlatList} from 'react-native';
import {Text, IconButton, useTheme, AnimatedFAB} from 'react-native-paper';
import Post from './Post';
import g from '../styles/Global.module.css';

function Explore() {
  const {colors} = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isExtended, setIsExtended] = React.useState(true);
  const [timePeriod, setTimePeriod] = React.useState({
    slug: 'day',
    text: 'Trending today',
  });
  React.useEffect(() => {
    refresh();
  }, []);
  const refresh = () => {
    setIsLoading(true);
    fetch(
      `https://api.wasteof.money/explore/posts/trending?timeframe=${timePeriod.slug}`,
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        setPosts(json.posts);
        setIsLoading(false);
      });
  };
  const onScroll = ({nativeEvent}) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };
  const listHeader = () => {
    return (
      <View style={{margin: 20, marginBottom: 10}}>
        <Text variant="titleLarge" style={{fontWeight: 'bold', flex: 1}}>
          {timePeriod.text}
        </Text>
      </View>
    );
  };
  const renderItem = ({item}) => <Post post={item} />;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <AnimatedFAB
        icon="clock-edit-outline"
        style={g.fab}
        onPress={() => console.log('Pressed')}
        size="medium"
        variant="secondary"
        label="Time Period"
        animated={true}
        animateFrom="right"
        extended={isExtended}
      />
      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        onRefresh={refresh}
        refreshing={isLoading}
        onScroll={onScroll}
      />
    </View>
  );
}

export default Explore;
