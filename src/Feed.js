import * as React from 'react';
import {View, FlatList} from 'react-native';
import {
  Text,
  IconButton,
  Badge,
  Button,
  FAB,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Post from './Post';
import g from '../styles/Global.module.css';

function Feed() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [posts, setPosts] = React.useState([]);
  const [session, setSession] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('token'),
    ]).then(arr => {
      setSession({
        username: arr[0],
        token: arr[1],
      });
      refresh(arr[0]);
    });
  }, []);
  const refresh = username => {
    setIsLoading(true);
    fetch(
      `https://api.wasteof.money/users/${
        session?.username || username
      }/following/posts?page=${page}`,
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        setPosts(json.posts);
        setIsLoading(false);
      });
  };
  const listHeader = () => {
    return (
      <View style={g.infoBar}>
        <Text variant="titleLarge" style={{fontWeight: 'bold', flex: 1}}>
          Your feed
        </Text>
        <View style={g.iconButtonWrapper}>
          <Badge style={g.iconButtonBadge} size={24}>
            3
          </Badge>
          <IconButton
            icon="bell"
            size={24}
            iconColor={colors.primary}
            onPress={() => {}}
          />
        </View>
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
      {session && (
        <FAB
          icon="pencil-plus"
          style={g.fab}
          onPress={() => console.log('Pressed')}
          size="medium"
          variant="secondary"
          label="Create"
          animated={true}
        />
      )}
      {session ? (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          onRefresh={refresh}
          refreshing={isLoading}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Button
            mode="contained-tonal"
            icon="account-lock-outline"
            onPress={() => navigation.navigate('settings')}>
            Sign In
          </Button>
        </View>
      )}
    </View>
  );
}

export default Feed;
