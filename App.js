import React from 'react';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Easing} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Portal, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feed from './src/Feed';
import Explore from './src/Explore';
import Settings from './src/Settings';
import Search from './src/Search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifications from './src/Notifications';
import UserModal from './src/UserModal';
const Tab = createMaterialBottomTabNavigator();

export const GlobalContext = React.createContext();
const App = () => {
  const theme = useTheme();
  const [shouldFilter, setShouldFilter] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [didGet, setDidGet] = React.useState(false);
  const [changelogViewed, setChangelogViewed] = React.useState(null);
  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('filter'),
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('changelogViewed'),
    ]).then(vals => {
      setShouldFilter(vals[0] == 'true' ? true : false);
      setUsername(vals[1]);
      setToken(vals[2]);
      setChangelogViewed(vals[3]);
      setDidGet(true);
    });
  }, []);
  React.useEffect(() => {
    AsyncStorage.setItem('filter', String(shouldFilter));
  }, [shouldFilter]);
  const genTabIcon = (e, active, inactive) => {
    return <Icon name={e.focused ? active : inactive || active} size={24} />;
  };
  return (
    <GlobalContext.Provider
      value={{
        shouldFilter,
        setShouldFilter,
        changelogViewed,
        username,
        setUsername,
        token,
        setToken,
        notificationCount,
        setNotificationCount,
      }}>
      {didGet && (
        <NavigationContainer theme={theme}>
          <Portal.Host>
            <Tab.Navigator
              sceneAnimationType="shifting"
              sceneAnimationEnabled={true}
              sceneAnimationEasing={Easing.ease}
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
          </Portal.Host>
        </NavigationContainer>
      )}
    </GlobalContext.Provider>
  );
};

export default App;
