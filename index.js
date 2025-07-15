// import './wdyr';
import { AppRegistry, Appearance } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { darkTheme, lightTheme } from './src/theme';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiURL } from './src/apiURL';

const Main = () => {
  const { theme: deviceTheme } = useMaterial3Theme({
    fallbackSourceColor: '#494bd6',
  });
  const { theme: defaultTheme } = useMaterial3Theme({
    sourceColor: '#494bd6',
  });
  const [theme, setTheme] = React.useState(null);
  const updateTheme = async () => {
    let useDeviceTheme = await AsyncStorage.getItem('useDeviceTheme');
    useDeviceTheme = useDeviceTheme != 'false';
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === 'dark') {
      setTheme({
        ...darkTheme,
        colors: useDeviceTheme ? deviceTheme.dark : defaultTheme.dark,
      });
    } else {
      setTheme({
        ...lightTheme,
        colors: useDeviceTheme ? deviceTheme.light : defaultTheme.light,
      });
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

// const backgroundFetchHeadlessTask = async event => {
//   if (event.timeout) {
//     console.log('[BackgroundFetch] 💀 HeadlessTask TIMEOUT: ', event.taskId);
//     BackgroundFetch.finish(event.taskId);
//     return;
//   }
//   console.log('[BackgroundFetch] 💀 HeadlessTask start: ', event.taskId);
//   const token = await AsyncStorage.getItem('token');
//   const lastUnreadNotifCount = await AsyncStorage.getItem(
//     'lastUnreadNotifCount',
//   );
//   if (token) {
//     fetch(`${apiURL}/messages/count`, {
//       headers: {
//         Authorization: token,
//       },
//     })
//       .then(res => {
//         if (res.status == 200) {
//           return res.json();
//         } else {
//           console.error(`Error ${res.status} - try again later.`);
//           BackgroundFetch.finish(event.taskId);
//         }
//       })
//       .then(json => {
//         if (lastUnreadNotifCount === String(json.count)) return;
//         // notifee
//         //   .createChannel({
//         //     id: 'newmessages',
//         //     name: 'New Messages',
//         //   })
//         //   .then(channelId => {
//         //     notifee.displayNotification({
//         //       title: `${json.count} unread notifications on wasteof.money`,
//         //       body: 'Tap to read them now',
//         //       android: {
//         //         channelId,
//         //         pressAction: {
//         //           id: 'default',
//         //         },
//         //         smallIcon: 'ic_wasteof',
//         //       },
//         //     });
//         //     AsyncStorage.setItem('lastUnreadNotifCount', String(json.count));
//         //     BackgroundFetch.finish(event.taskId);
//         //   });
//       })
//       .catch(err => {
//         console.error(err);
//         BackgroundFetch.finish(event.taskId);
//       });
//   } else {
//     BackgroundFetch.finish(event.taskId);
//   }
// };

// BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);
