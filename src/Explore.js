import * as React from 'react';
import {View, ScrollView} from 'react-native';
import {Text, useTheme, AnimatedFAB} from 'react-native-paper';
import {FlashList} from '@shopify/flash-list';
import Post from './Post';
import UserChip from './UserChip';
import g from '../styles/Global.module.css';

function Explore() {
  const {colors} = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isExtended, setIsExtended] = React.useState(true);
  const [topUsers, setTopUsers] = React.useState([]);
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
    fetch('https://api.wasteof.money/explore/users/top')
      .then(response => {
        return response.json();
      })
      .then(json => {
        let usernames = [];
        json.forEach(post => {
          usernames.push(post.name);
        });
        setTopUsers([...new Set(usernames)]);
      });
  };
  const onScroll = ({nativeEvent}) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };
  const listHeader = () => {
    return (
      <View
        style={{
          marginTop: 20,
          paddingLeft: 20,
          marginBottom: 10,
          marginRight: 0,
        }}>
        <Text variant="titleLarge" style={g.header}>
          Top users
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 40,
            marginLeft: -20,
          }}>
          {topUsers.map(username => (
            <UserChip username={username} inline={true} />
          ))}
        </ScrollView>
        <Text variant="titleLarge" style={g.header}>
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
      <FlashList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        onRefresh={refresh}
        refreshing={isLoading}
        onScroll={onScroll}
        estimatedItemSize={100}
      />
    </View>
  );
}

export default Explore;
