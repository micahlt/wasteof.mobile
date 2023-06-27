// import './wdyr';
import { AppRegistry, Appearance } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BackgroundFetch from 'react-native-background-fetch';
import { darkTheme, lightTheme } from './src/theme';
import { Notifications } from 'react-native-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiURL } from './src/apiURL';

const Main = () => {
  const [theme, setTheme] = React.useState(null);
  const updateTheme = () => {
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };
  React.useEffect(() => {
    Appearance.addChangeListener(() => {
      updateTheme();
    });
    updateTheme();
  }, []);
  return (
    theme && (
      <PaperProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <App />
        </GestureHandlerRootView>
      </PaperProvider>
    )
  );
};

AppRegistry.registerComponent(appName, () => Main);

const backgroundFetchHeadlessTask = async event => {
  if (event.timeout) {
    console.log('[BackgroundFetch] 💀 HeadlessTask TIMEOUT: ', event.taskId);
    BackgroundFetch.finish(event.taskId);
    return;
  }
  console.log('[BackgroundFetch] 💀 HeadlessTask start: ', event.taskId);
  const token = await AsyncStorage.getItem('token');
  const lastUnreadNotifCount = await AsyncStorage.getItem(
    'lastUnreadNotifCount',
  );
  if (token) {
    fetch(`${apiURL}/messages/count`, {
      headers: {
        Authorization: token,
      },
    })
      .then(res => {
        if (res.status == 200) {
          return res.json();
        } else {
          alert(`Error ${res.status} - try again later.`);
        }
      })
      .then(json => {
        if (lastUnreadNotifCount === String(json.count)) return;
        Notifications.postLocalNotification({
          title: `${json.count} unread messages on wasteof.money`,
          body: 'Tap to check your messages',
        });
        BackgroundFetch.finish(event.taskId);
      })
      .catch(err => {
        alert(err);
      });
  }
};

/// Now register the handler.
BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);
