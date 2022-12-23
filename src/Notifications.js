import * as React from 'react';
import {View, FlatList} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {GlobalContext} from '../App';
import Notif from './components/Notif';
import g from '../styles/Global.module.css';

function Notifications() {
  const {colors} = useTheme();
  const {token} = React.useContext(GlobalContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [notifs, setNotifs] = React.useState([]);
  React.useEffect(() => {
    loadNotifications();
  }, []);
  const loadNotifications = () => {
    setIsLoading(true);
    fetch(`https://api.wasteof.money/messages/unread?page=${page}`, {
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        setNotifs(data.unread);
        setPage(page + 1);
        setIsLoading(false);
      });
  };
  const refresh = () => {
    setPage(0);
    loadNotifications();
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
          Notifications
        </Text>
      </View>
    );
  };
  const renderItem = React.useCallback(({item}) => <Notif notif={item} />, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <FlatList
        data={notifs}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        onRefresh={refresh}
        ListHeaderComponent={listHeader}
        refreshing={isLoading}
        estimatedItemSize={200}
      />
    </View>
  );
}

export default Notifications;
