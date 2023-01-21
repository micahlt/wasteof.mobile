import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Checkbox,
  Button,
  Switch,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../static/logo.svg';
import g from '../styles/Global.module.css';
import RNRestart from 'react-native-restart';
import {GlobalContext} from '../App';
import Changelog from './components/Changelog';

function Settings() {
  const {colors} = useTheme();
  const {shouldFilter, setShouldFilter, username} =
    React.useContext(GlobalContext);
  const [password, setPassword] = React.useState('');
  const [hasAccepted, accept] = React.useState('unchecked');
  const [localUsername, setLocalUsername] = React.useState('');
  const [showChangelog, setShowChangelog] = React.useState(false);
  const handleCheckbox = () => {
    if (hasAccepted == 'unchecked') {
      accept('checked');
    } else {
      accept('unchecked');
    }
  };
  const signIn = () => {
    if (hasAccepted == 'checked') {
      fetch('https://api.wasteof.money/session', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: localUsername,
          password: password,
        }),
      })
        .then(response => {
          if (response.status == 200) {
            return response.json();
          } else {
            alert(`Error ${response.statusCode}, please try again`);
          }
        })
        .then(json => {
          if (json.error) {
            alert(`Error: ${json.error}.  Please try again`);
          }
          Promise.all([
            AsyncStorage.setItem('username', localUsername.toLowerCase()),
            AsyncStorage.setItem('token', json.token),
          ]).then(() => {
            RNRestart.Restart();
          });
        });
    } else {
      alert('Accept the terms to continue.');
    }
  };
  const signOut = () => {
    AsyncStorage.getItem('token').then(token => {
      fetch('https://api.wasteof.money/session', {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      }).then(() => {
        Promise.all([
          AsyncStorage.removeItem('username'),
          AsyncStorage.removeItem('token'),
        ]).then(() => {
          RNRestart.Restart();
        });
      });
    });
  };
  const signOutButton = () => {
    return (
      <Button mode="outlined" style={{marginRight: 16}} onPress={signOut}>
        Sign Out
      </Button>
    );
  };
  return (
    <ScrollView
      style={{
        padding: 20,
        flex: 1,
        backgroundColor: colors.background,
      }}>
      {showChangelog && (
        <Changelog
          dismissable={true}
          closeExternal={() => setShowChangelog(false)}
        />
      )}
      <Text variant="titleLarge" style={{fontWeight: 'bold', marginBottom: 10}}>
        Settings
      </Text>
      {!username ? (
        <Card mode="outlined" style={{backgroundColor: colors.background}}>
          <Card.Content>
            <Logo
              height={40}
              fill={colors.onBackground}
              style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 8}}
            />
            <TextInput
              label="Username"
              value={localUsername}
              onChangeText={text => setLocalUsername(text)}
              mode="outlined"
              style={{marginBottom: 5}}
              autoCapitalize="none"
              autoComplete="username"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              mode="outlined"
              secureTextEntry={true}
              autoComplete="password"
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Checkbox.Item
                status={hasAccepted}
                onPress={handleCheckbox}
                style={{paddingHorizontal: 0}}
              />
              <Text>
                I agree to the{' '}
                <Text style={{...g.link, color: colors.primary}}>Terms</Text>{' '}
                and{' '}
                <Text style={{...g.link, color: colors.primary}}>Rules</Text>.
              </Text>
            </View>
            <Button
              mode="contained-tonal"
              style={{marginLeft: 'auto', marginRight: 'auto'}}
              onPress={signIn}>
              Log In
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <Card mode="outlined">
          <Card.Cover
            source={{
              uri: `https://api.wasteof.money/users/${username}/banner`,
            }}></Card.Cover>
          <Card.Title
            title={String(username)}
            titleVariant="titleLarge"
            titleStyle={{fontWeight: 'bold'}}
            right={signOutButton}
          />
        </Card>
      )}
      <Card mode="outlined" style={{marginTop: 15}}>
        <Card.Content>
          <View style={g.inline}>
            <Switch
              value={shouldFilter}
              onValueChange={val => setShouldFilter(val)}
            />
            <Text style={{marginLeft: 10}} variant="labelLarge">
              Profanity filter
            </Text>
          </View>
          <View style={{...g.inline, marginTop: 5}}>
            <Button
              mode="contained-tonal"
              onPress={() => setShowChangelog(true)}>
              View changelog
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

export default Settings;
