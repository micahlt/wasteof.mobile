import * as React from 'react';
import {View, FlatList} from 'react-native';
import {Text, SegmentedButtons, Button, useTheme} from 'react-native-paper';
import {GlobalContext} from '../App';
import Notif from './components/Notif';
import s from '../styles/Notifications.module.css';

function Notifications() {
  const {colors} = useTheme();
  const {token} = React.useContext(GlobalContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [notifs, setNotifs] = React.useState([]);
  const [mode, setMode] = React.useState('unread');
  const [isEnd, setIsEnd] = React.useState(false);
  React.useEffect(() => {
    loadNotifications();
  }, []);
  React.useEffect(() => {
    setNotifs([]);
    refresh();
  }, [mode]);
  const loadNotifications = n => {
    setIsLoading(true);
    fetch(`https://api.wasteof.money/messages/${mode}?page=${n ? page : 0}`, {
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        setNotifs(n ? [...n, ...data[mode]] : data[mode]);
        setPage(page + 1);
        setIsLoading(false);
        setIsEnd(data.last);
      });
  };
  const refresh = () => {
    setNotifs([]);
    setPage(0);
    loadNotifications();
  };
  const listHeader = (
    <View style={s.listHeader}>
      <SegmentedButtons
        value={mode}
        onValueChange={val => {
          setMode(val);
        }}
        buttons={[
          {
            value: 'unread',
            icon: 'email',
            showSelectedCheck: true,
            label: 'Unread',
          },
          {
            value: 'read',
            label: 'Read',
            icon: 'email-check',
            showSelectedCheck: true,
          },
        ]}
      />
    </View>
  );
  const listLoading = (
    <View style={{paddingTop: 20, paddingBottom: 30}}>
      {!(isLoading && page == 0) && !isEnd && (
        <Button
          loading={isLoading}
          mode="contained-tonal"
          style={{marginLeft: 'auto', marginRight: 'auto'}}
          onPress={() => {
            loadNotifications(notifs);
          }}>
          Load more
        </Button>
      )}
    </View>
  );
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
        ListHeaderComponent={() => listHeader}
        ListFooterComponent={listLoading}
        refreshing={isLoading && page == 0}
        estimatedItemSize={150}
      />
    </View>
  );
}

export default Notifications;
