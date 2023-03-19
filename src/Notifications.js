import * as React from 'react';
import { View, FlatList } from 'react-native';
import {
  Text,
  SegmentedButtons,
  Button,
  Snackbar,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../App';
import Notif from './components/Notif';
import s from '../styles/Notifications.module.css';
import { apiURL } from './apiURL';

function Notifications() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { token } = React.useContext(GlobalContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [notifs, setNotifs] = React.useState([]);
  const [mode, setMode] = React.useState('unread');
  const [isEnd, setIsEnd] = React.useState(false);
  const [toast, setToast] = React.useState({
    visible: false,
    text: '',
  });
  // const [undoAction, setUndoAction] = React.useState({
  //   action: '',
  //   id: '',
  // });
  React.useEffect(() => {
    if (token) loadNotifications();
  }, [mode]);
  const loadNotifications = n => {
    if (!n) {
      setNotifs([]);
      setIsEnd(false);
      setPage(0);
    }
    setIsLoading(true);
    fetch(`${apiURL}/messages/${mode}?page=${n ? page : 0}`, {
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
  const changeReadStatus = (id, modeOverride) => {
    const i = notifs.findIndex(n => n._id == id);
    if (i != -1) {
      let newArr = notifs;
      newArr.splice(i, 1);
      setNotifs(newArr);
      if ((modeOverride || mode) == 'read') {
        if (!modeOverride)
          setToast({ text: 'Marked message as unread', visible: true });
        // setUndoAction({action: 'read', id: id});
        fetch(`${apiURL}/messages/mark/unread`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ messages: [id] }),
        });
      } else if ((modeOverride || mode) == 'unread') {
        if (!modeOverride)
          setToast({ text: 'Marked message as read', visible: true });
        // setUndoAction({action: 'unread', id: id});
        fetch(`${apiURL}/messages/mark/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ messages: [id] }),
        });
      }
    } else {
      setToast({ text: 'Error, try again: ' + i, visible: true });
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
    <>
      {!(isLoading && page == 0) && !isEnd ? (
        <View style={{ paddingTop: 20, paddingBottom: 30 }}>
          <Button
            loading={isLoading}
            mode="contained-tonal"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
            onPress={() => {
              loadNotifications(notifs);
            }}>
            Load more
          </Button>
        </View>
      ) : (
        notifs.length == 0 &&
        !isLoading && (
          <View style={{ alignItems: 'center', flexGrow: 1 }}>
            <Avatar.Icon
              size={128}
              icon="email-check-outline"
              style={{ backgroundColor: 'transparent' }}
            />
            <Text variant="labelLarge">No unread messages</Text>
          </View>
        )
      )}
    </>
  );
  const renderItem = ({ item }) => (
    <Notif notif={item} changeReadStatus={changeReadStatus} />
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      {token ? (
        <>
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
              setToast({ ...toast, visible: false });
            }}
            duration={2000}
            // action={{
            //   label: 'Undo',
            //   onPress: () => {
            //     changeReadStatus(undoAction.id, undoAction.action);
            //   },
            // }}>
          >
            {toast.text}
          </Snackbar>
        </>
      ) : (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            variant="titleLarge"
            style={{ width: '70%', textAlign: 'center', marginBottom: 10 }}>
            Sign in to view notifications
          </Text>
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

export default Notifications;
