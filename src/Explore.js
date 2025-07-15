import * as React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import {
  Text,
  useTheme,
  AnimatedFAB,
  Portal,
  Dialog,
  RadioButton,
  PaperProvider,
} from 'react-native-paper';
import Post from './components/Post';
import UserChip from './components/UserChip';
import g from '../styles/Global.module.css';
import { apiURL } from './apiURL';
import UserList from './components/UserList';

function Explore() {
  const { colors } = useTheme();
  const [posts, setPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isExtended, setIsExtended] = React.useState(true);
  const [topUsers, setTopUsers] = React.useState([]);
  const [timePeriod, setTimePeriod] = React.useState({
    slug: 'day',
    text: 'Trending today',
  });
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  React.useEffect(() => {
    refresh();
  }, []);
  const refresh = slug => {
    setIsLoading(true);
    fetch(
      `${apiURL}/explore/posts/trending?timeframe=${slug || timePeriod.slug}`,
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        setPosts(json.posts);
        setIsLoading(false);
      });
    fetch(`${apiURL}/explore/users/top`)
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
  const handleChangeTime = val => {
    setShowTimePicker(false);
    switch (val) {
      case 'day': {
        setTimePeriod({
          slug: val,
          text: 'Trending today',
        });
        break;
      }
      case 'week': {
        setTimePeriod({
          slug: val,
          text: 'Trending this week',
        });
        break;
      }
      case 'month': {
        setTimePeriod({
          slug: val,
          text: 'Trending this month',
        });
        break;
      }
      case 'all': {
        setTimePeriod({
          slug: val,
          text: 'Trending all time',
        });
        break;
      }
    }
    refresh(val);
  };
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };
  const listHeader = (
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
      <UserList userNames={topUsers} style={{ marginLeft: -20 }} />
      <Text variant="titleLarge" style={g.header}>
        {timePeriod.text}
      </Text>
    </View>
  );
  const renderItem = React.useCallback(({ item }) => <Post post={item} />, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <Portal>
        <PaperProvider theme={{ colors: { backdrop: 'green', ...colors } }}>
          <Dialog
            visible={showTimePicker}
            onDismiss={() => setShowTimePicker(false)}
          >
            <Dialog.Title>Choose time period</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group onValueChange={handleChangeTime}>
                <View style={{ ...g.inline, marginBottom: 10 }}>
                  <RadioButton
                    value="day"
                    uncheckedColor={colors.onSecondaryContainer}
                    color={colors.primary}
                    status={timePeriod.slug == 'day' ? 'checked' : 'unchecked'}
                  />
                  <Text variant="bodyLarge">Today</Text>
                </View>
                <View style={{ ...g.inline, marginBottom: 10 }}>
                  <RadioButton
                    value="week"
                    uncheckedColor={colors.onSecondaryContainer}
                    color={colors.primary}
                    status={timePeriod.slug == 'week' ? 'checked' : 'unchecked'}
                  />
                  <Text variant="bodyLarge">This week</Text>
                </View>
                <View style={{ ...g.inline, marginBottom: 10 }}>
                  <RadioButton
                    value="month"
                    uncheckedColor={colors.onSecondaryContainer}
                    color={colors.primary}
                    status={timePeriod.slug == 'month' ? 'checked' : 'unchecked'}
                  />
                  <Text variant="bodyLarge">This month</Text>
                </View>
                <View style={{ ...g.inline, marginBottom: 10 }}>
                  <RadioButton
                    value="all"
                    uncheckedColor={colors.onSecondaryContainer}
                    color={colors.primary}
                    status={timePeriod.slug == 'all' ? 'checked' : 'unchecked'}
                  />
                  <Text variant="bodyLarge">All time</Text>
                </View>
              </RadioButton.Group>
            </Dialog.Content>
          </Dialog>
        </PaperProvider>
      </Portal>
      <AnimatedFAB
        icon="clock-edit-outline"
        style={g.fab}
        onPress={() => setShowTimePicker(true)}
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
        estimatedItemSize={250}
      />
    </View>
  );
}

export default Explore;
