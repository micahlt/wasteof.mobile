import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Easing, Linking, SafeAreaView, StatusBar } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Portal, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feed from './src/Feed';
import Explore from './src/Explore';
import Settings from './src/Settings';
import Search from './src/Search';
import UserPage from './src/UserPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifications from './src/Notifications';
import deepLinkConfig from './utils/deepLinkConfig';
import initBackgroundFetch from './utils/initBackgroundFetch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const GlobalContext = React.createContext();
const App = () => {
  const theme = useTheme();
  console.log('App theme:', theme);
  const [shouldFilter, setShouldFilter] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [didGet, setDidGet] = React.useState(false);
  const [changelogViewed, setChangelogViewed] = React.useState(null);
  const [allAccounts, setAllAccounts] = React.useState(null);
  const insets = useSafeAreaInsets();
  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('filter'),
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('changelogViewed'),
      AsyncStorage.getItem('accounts'),
      AsyncStorage.getItem('localNotifsEnabled'),
    ]).then(vals => {
      setShouldFilter(vals[0] == 'true' ? true : false);
      setUsername(vals[1]);
      setToken(vals[2]);
      setChangelogViewed(vals[3]);
      setAllAccounts(vals[4] ? JSON.parse(vals[4]) : []);
      if (vals[5] === 'true') initBackgroundFetch();
      setDidGet(true);
    });
  }, []);
  React.useEffect(() => {
    AsyncStorage.setItem('filter', String(shouldFilter));
  }, [shouldFilter]);
  React.useEffect(() => {
    if (didGet) {
      // handle notifs?
    }
  }, [didGet]);
  const genTabIcon = (e, active, inactive) => {
    return (
      <Icon
        name={e.focused ? active : inactive || active}
        size={24}
        color={theme.colors.onSurfaceVariant}
      />
    );
  };
  return (
    <KeyboardProvider preserveEdgeToEdge={true} navigationBarTranslucent={true} statusBarTranslucent={true}>
      <GlobalContext.Provider
        value={{
          shouldFilter,
          setShouldFilter,
          changelogViewed,
          username,
          setUsername,
          allAccounts,
          setAllAccounts,
          token,
          setToken,
          notificationCount,
          setNotificationCount,
        }}>
        {didGet && (
          <NavigationContainer theme={theme} linking={deepLinkConfig}>
            <StatusBar
              backgroundColor={theme.colors.background}
              barStyle={theme.dark ? 'light-content' : 'dark-content'}
              animated={true}
              translucent={true}
            />
            <Portal.Host>
              <Stack.Navigator
                initialRouteName="parent"
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    paddingTop: insets.top,
                  }
                }}>
                <Stack.Screen name="parent">
                  {() => (
                    <Tab.Navigator
                      sceneAnimationType="shifting"
                      sceneAnimationEnabled={true}
                      sceneAnimationEasing={Easing.bezier(0.4, 0, 0.2, 1)}
                      shifting={true}
                      initialRouteName="home"
                      renderTouchable={props => (
                        <TouchableWithoutFeedback {...props} />
                      )}>
                      <Tab.Screen
                        name="explore"
                        component={Explore}
                        options={{
                          tabBarIcon: p => genTabIcon(p, 'earth'),
                        }}
                      />
                      <Tab.Screen
                        name="search"
                        component={Search}
                        options={{
                          tabBarIcon: p => genTabIcon(p, 'magnify'),
                        }}
                      />
                      <Tab.Screen
                        name="home"
                        component={Feed}
                        options={{
                          tabBarIcon: p =>
                            genTabIcon(p, 'home-variant', 'home-variant-outline'),
                        }}
                      />
                      <Tab.Screen
                        name="notifications"
                        component={Notifications}
                        options={{
                          tabBarIcon: p => genTabIcon(p, 'bell', 'bell-outline'),
                          tabBarLabel: 'notifs',
                          tabBarBadge: notificationCount > 0,
                        }}
                      />
                      <Tab.Screen
                        name="settings"
                        component={Settings}
                        options={{
                          tabBarIcon: p => genTabIcon(p, 'cog', 'cog-outline'),
                        }}
                      />
                    </Tab.Navigator>
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="users"
                  component={UserPage}
                  options={{ animation: 'fade_from_bottom', contentStyle: { paddingTop: 0 } }}
                />
              </Stack.Navigator>
            </Portal.Host>
          </NavigationContainer>
        )}
      </GlobalContext.Provider>
    </KeyboardProvider>
  );
};

export default App;
