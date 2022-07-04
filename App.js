import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTheme} from 'react-native-paper';
import Feed from './src/Feed';
import DrawerContent from './src/DrawerContent';
import AppBar from './src/AppBar';
import Explore from './src/Explore';
const Drawer = createDrawerNavigator();

const App = () => {
  const {colors} = useTheme();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          header: props => <AppBar />,
        }}>
        <Drawer.Screen name="home" component={Feed} />
        <Drawer.Screen name="explore" component={Explore} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
