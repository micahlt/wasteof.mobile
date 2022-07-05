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
const Drawer = createDrawerNavigator();

const App = () => {
  const {colors} = useTheme();
  return (
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
          <Drawer.Screen name="settings" component={Settings} />
        </Drawer.Navigator>
      </Portal.Host>
    </NavigationContainer>
  );
};

export default App;
