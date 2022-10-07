import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Portal, useTheme} from 'react-native-paper';
import {StatusBar} from 'react-native';
import Feed from './src/Feed';
import DrawerContent from './src/DrawerContent';
import AppBar from './src/AppBar';
import Explore from './src/Explore';
import Settings from './src/Settings';
import Search from './src/Search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifications from './src/Notifications';
const Drawer = createDrawerNavigator();

export const GlobalContext = React.createContext();
const App = () => {
  const {colors} = useTheme();
  const [shouldFilter, setShouldFilter] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [didGet, setDidGet] = React.useState(false);
  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('filter'),
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('token'),
    ]).then(vals => {
      setShouldFilter(Boolean(vals[0]));
      setUsername(vals[1]);
      setToken(vals[2]);
      setDidGet(true);
    });
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        shouldFilter,
        setShouldFilter,
        username,
        setUsername,
        token,
        setToken,
      }}>
      {didGet && (
        <NavigationContainer>
          <StatusBar backgroundColor={colors.primary} />
          <Portal.Host>
            <Drawer.Navigator
              drawerContent={props => <DrawerContent {...props} />}
              screenOptions={{
                header: props => <AppBar />,
              }}>
              <Drawer.Screen name="home" component={Feed} />
              <Drawer.Screen name="explore" component={Explore} />
              <Drawer.Screen name="search" component={Search} />
              <Drawer.Screen name="notifications" component={Notifications} />
              <Drawer.Screen name="settings" component={Settings} />
            </Drawer.Navigator>
          </Portal.Host>
        </NavigationContainer>
      )}
    </GlobalContext.Provider>
  );
};

export default App;
