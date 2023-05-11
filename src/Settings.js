import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Checkbox,
  Button,
  Switch,
  IconButton,
  useTheme,
  Avatar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../static/logo.svg';
import g from '../styles/Global.module.css';
import RNRestart from 'react-native-restart';
import { GlobalContext } from '../App';
import Changelog from './components/Changelog';
import { apiURL } from './apiURL';
import links from '../utils/links';

function Settings() {
  const { colors } = useTheme();
  const { shouldFilter, setShouldFilter, username, allAccounts } =
    React.useContext(GlobalContext);
  const [password, setPassword] = React.useState('');
  const [hasAccepted, accept] = React.useState('unchecked');
  const [localUsername, setLocalUsername] = React.useState('');
  const [showChangelog, setShowChangelog] = React.useState(false);
  const [addingAccount, setAddingAccount] = React.useState(false);
  const handleCheckbox = () => {
    if (hasAccepted == 'unchecked') {
      accept('checked');
    } else {
      accept('unchecked');
    }
  };
  const signIn = (switchUsername, switchToken) => {
    if (typeof switchUsername === 'string') {
      Promise.all([
        AsyncStorage.setItem('username', switchUsername),
        AsyncStorage.setItem('token', switchToken),
      ]).then(() => {
        RNRestart.Restart();
      });
    } else {
      if (hasAccepted == 'checked') {
        fetch(`${apiURL}/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
              AsyncStorage.setItem(
                'accounts',
                JSON.stringify([
                  ...allAccounts,
                  { username: localUsername.toLowerCase(), token: json.token },
                ]),
              ),
            ]).then(() => {
              RNRestart.Restart();
            });
          });
      } else {
        alert('Accept the terms to continue.');
      }
    }
  };
  const signOut = () => {
    AsyncStorage.getItem('token').then(token => {
      fetch(`${apiURL}/session`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      }).then(() => {
        const accountsList = allAccounts.filter(
          item => item.username != username,
        );
        if (allAccounts.length == 1) {
          Promise.all([
            AsyncStorage.removeItem('username'),
            AsyncStorage.removeItem('token'),
            AsyncStorage.setItem('accounts', '[]'),
          ]).then(() => {
            RNRestart.Restart();
          });
        } else {
          Promise.all([
            AsyncStorage.setItem('username', accountsList[0].username),
            AsyncStorage.setItem('token', accountsList[0].token),
            AsyncStorage.setItem('accounts', JSON.stringify(accountsList)),
          ]).then(() => {
            RNRestart.Restart();
          });
        }
      });
    });
  };
  const authButtons = () => {
    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton
          icon="account-plus-outline"
          size={20}
          mode="outlined"
          onPress={() => setAddingAccount(true)}
          style={{
            margin: 0,
            marginRight: 5,
            height: 42,
            width: 42,
            borderRadius: 42,
          }}
          iconColor={colors.primary}
        />
        <Button
          mode="outlined"
          style={{ marginRight: 16, height: 42 }}
          onPress={signOut}>
          Sign Out
        </Button>
      </View>
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
      <Text
        variant="titleLarge"
        style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Settings
      </Text>
      {!username || addingAccount ? (
        <Card
          mode="outlined"
          style={{
            backgroundColor: colors.background,
            maxWidth: 500,
          }}>
          <Card.Content>
            <Logo
              height={40}
              fill={colors.onBackground}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 8,
              }}
            />
            <TextInput
              label="Username"
              value={localUsername}
              onChangeText={text => setLocalUsername(text)}
              mode="outlined"
              style={{ marginBottom: 5 }}
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
                style={{ paddingHorizontal: 0 }}
              />
              <Text>
                I agree to the{' '}
                <Text
                  style={{ ...g.link, color: colors.primary }}
                  onPress={() =>
                    links.open('https://wasteof.money/rules', colors.primary)
                  }>
                  Rules
                </Text>
                .
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {addingAccount && (
                <Button
                  mode="outlined"
                  style={{ marginLeft: 'auto', marginRight: 0 }}
                  onPress={() => setAddingAccount(false)}>
                  Cancel
                </Button>
              )}
              <Button
                mode="contained-tonal"
                style={{
                  marginLeft: addingAccount ? 5 : 'auto',
                  marginRight: 'auto',
                }}
                onPress={signIn}>
                Log In
              </Button>
            </View>
            <Text
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                ...g.link,
                color: colors.primary,
                opacity: 0.5,
              }}
              variant="bodySmall"
              onPress={() =>
                links.open('https://wasteof.money/join', colors.primary)
              }>
              Don't have an account?
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <Card mode="outlined" style={{ maxWidth: 500 }}>
          <Card.Cover
            source={{
              uri: `${apiURL}/users/${username}/banner`,
            }}></Card.Cover>
          <Card.Title
            title={String(username)}
            titleVariant="titleLarge"
            titleStyle={{ fontWeight: 'bold' }}
            right={authButtons}
          />
        </Card>
      )}
      {allAccounts.length > 1 && (
        <Card mode="outlined" style={{ marginTop: 15, maxWidth: 500 }}>
          <Card.Content>
            <Text style={{ marginBottom: 10 }} variant="titleMedium">
              Switch accounts
            </Text>
            <ScrollView
              contentContainerStyle={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {allAccounts.map(item => (
                <View
                  style={{
                    marginRight: 10,
                    borderRadius: 45,
                    overflow: 'hidden',
                  }}
                  key={item.username}>
                  <Pressable
                    onPress={() => signIn(item.username, item.token)}
                    android_ripple={{
                      foreground: true,
                      color: colors.onBackground,
                    }}>
                    <Avatar.Image
                      source={{
                        uri: `${apiURL}/users/${item.username}/picture`,
                      }}
                      size={45}
                    />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      )}
      <Card mode="outlined" style={{ marginTop: 15, maxWidth: 500 }}>
        <Card.Content>
          <View style={g.inline}>
            <Switch
              value={shouldFilter}
              onValueChange={val => setShouldFilter(val)}
            />
            <Text style={{ marginLeft: 10 }} variant="labelLarge">
              Profanity filter
            </Text>
          </View>
          <View style={{ ...g.inline, marginTop: 10 }}>
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
