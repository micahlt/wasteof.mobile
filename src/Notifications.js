import * as React from 'react';
import {View, FlatList} from 'react-native';
import {
  Text,
  SegmentedButtons,
  Button,
  Snackbar,
  useTheme,
} from 'react-native-paper';
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
  const [toast, setToast] = React.useState({
    visible: false,
    text: '',
  });
  const [lastAction, setLastAction] = React.useState({
    action: 'markUnread',
    id: '39jsjsi19j201-l',
  });
  React.useEffect(() => {
    loadNotifications();
  }, [mode]);
  const loadNotifications = n => {
    if (!n) {
      setNotifs([]);
      setIsEnd(false);
      setPage(0);
    }
    setIsLoading(true);
    fetch(`https://api.wasteof.money/messages/${mode}?page=${n ? page : 0}`, {
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        setNotifs(n ? notifs.concat(data[mode]) : data[mode]);
        setPage(page + 1);
        setIsLoading(false);
        setIsEnd(data.last);
      });
  };
  const changeReadStatus = id => {
    const i = notifs.findIndex(n => n._id == id);
    if (i != -1) {
      let newArr = notifs;
      newArr.splice(i, 1);
      setNotifs(newArr);
      if (mode == 'read') {
        setToast({text: 'Marked message as unread', visible: true});
        fetch(`https://api.wasteof.money/messages/mark/unread`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({messages: [id]}),
        }).then(res => res.json());
      } else if (mode == 'unread') {
        setToast({text: 'Marked message as read', visible: true});
        fetch(`https://api.wasteof.money/messages/mark/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({messages: [id]}),
        }).then(res => {
          console.log(JSON.stringify(res));
        });
      }
    } else {
      setToast({text: 'Error, try again: ' + i, visible: true});
    }
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
  const renderItem = ({item}) => (
    <Notif notif={item} changeReadStatus={changeReadStatus} />
  );
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
        onRefresh={() => loadNotifications(null)}
        ListHeaderComponent={() => listHeader}
        ListFooterComponent={listLoading}
        refreshing={isLoading && page == 0}
        estimatedItemSize={150}
      />
      <Snackbar
        visible={toast.visible}
        onDismiss={() => {
          setToast({...toast, visible: false});
        }}
        duration={2000}
        // action={{
        //   label: 'Undo',
        //   onPress: () => {
        //     return;
        //   },
        // }}>
      >
        {toast.text}
      </Snackbar>
    </View>
  );
}

export default Notifications;
