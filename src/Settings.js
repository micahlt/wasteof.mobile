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

function Settings() {
  const {colors} = useTheme();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [currentUsername, setCurrentUsername] = React.useState(null);
  const [hasAccepted, accept] = React.useState('unchecked');
  const [enableFilter, setFilter] = React.useState(false);
  const handleCheckbox = () => {
    if (hasAccepted == 'unchecked') {
      accept('checked');
    } else {
      accept('unchecked');
    }
  };
  const signIn = () => {
    console.log(username);
    if (hasAccepted == 'checked') {
      fetch('https://api.wasteof.money/session', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: username,
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
          AsyncStorage.setItem('username', username.toLowerCase());
          AsyncStorage.setItem('token', json.token);
          RNRestart.Restart();
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
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('token');
        RNRestart.Restart();
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
  React.useEffect(() => {
    AsyncStorage.getItem('username').then(val => {
      setCurrentUsername(val);
    });
    AsyncStorage.getItem('filter').then(val => {
      setFilter(Boolean(val));
    });
  }, []);
  React.useEffect(() => {
    AsyncStorage.setItem('filter', String(enableFilter));
  }, [enableFilter]);
  return (
    <ScrollView
      style={{
        padding: 20,
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <Text variant="titleLarge" style={{fontWeight: 'bold', marginBottom: 10}}>
        Settings
      </Text>
      {!currentUsername ? (
        <Card mode="outlined" style={{backgroundColor: colors.background}}>
          <Card.Content>
            <Logo
              height={40}
              fill={colors.onBackground}
              style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 8}}
            />
            <TextInput
              label="Username"
              value={username}
              onChangeText={text => setUsername(text)}
              mode="outlined"
              style={{marginBottom: 5}}
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              mode="outlined"
              secureTextEntry={true}
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
              uri: `https://api.wasteof.money/users/${currentUsername}/banner`,
            }}></Card.Cover>
          <Card.Title
            title={`Signed in as ${currentUsername}`}
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
              value={enableFilter}
              onValueChange={() => setFilter(!enableFilter)}
            />
            <Text style={{marginLeft: 10}} variant="labelLarge">
              Profanity filter
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

export default Settings;
