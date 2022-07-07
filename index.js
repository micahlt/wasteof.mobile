import './wdyr';
import {AppRegistry, Appearance} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {darkTheme, lightTheme} from './src/theme';

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
        <GestureHandlerRootView style={{flex: 1}}>
          <App />
        </GestureHandlerRootView>
      </PaperProvider>
    )
  );
};

AppRegistry.registerComponent(appName, () => Main);
