import * as React from 'react';
import {
  ScrollView,
  ImageBackground,
  View,
  Image,
  Linking,
  FlatList,
} from 'react-native';
import {Appbar, Button, IconButton, Text, useTheme} from 'react-native-paper';
import ImageColors from 'react-native-image-colors';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import Post from './Post';
import useSession from '../hooks/useSession';
import s from '../styles/UserModal.module.css';

const UserModal = ({username, closeModal}) => {
  const {colors, isDark} = useTheme();
  const [headerColor, setHeaderColor] = React.useState(colors.surface);
  const [outlineColor, setOutlineColor] = React.useState(colors.outline);
  const [data, setData] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [following, setFollowing] = React.useState(false);
  React.useEffect(() => {
    ImageColors.getColors(
      `https://api.wasteof.money/users/${username}/banner?optimized=true`,
      {
        fallback: colors.surface,
        cache: true,
        key: String(Math.random()),
      },
    )
      .then(res => {
        if (isDark) setHeaderColor(res.darkMuted);
        else setHeaderColor(res.lightMuted);
        setOutlineColor(res.lightVibrant);
      })
      .catch(err => {
        alert(
          'Failed to get the banner data - this means no dynamic theming for this profile.',
        );
      });
    fetch(`https://api.wasteof.money/users/${username}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        setData(json);
      });
    fetch(`https://api.wasteof.money/users/${username}/posts`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        setPosts(json.posts);
      });
  }, []);
  const openUser = async () => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(`https://wasteof.money/@${username}`, {
        toolbarColor: headerColor,
      });
    } else {
      Linking.open(`https://wasteof.money/@${username}`);
    }
  };
  const listHeader = () => {
    return (
      <>
        <ImageBackground
          source={{
            uri: `https://api.wasteof.money/users/${username}/banner?optimized=true`,
          }}
          style={s.imageBackground}
          resizeMode="cover"></ImageBackground>
        <Image
          source={{uri: `https://api.wasteof.money/users/${username}/picture`}}
          resizeMode="cover"
          style={{
            ...s.avatar,
            borderColor: outlineColor,
          }}
        />
        {data && (
          <View style={s.info}>
            <Button
              icon="account-plus"
              iconColor={colors.onSurface}
              size={20}
              onPress={() => console.log('Pressed')}
              mode="contained-tonal"
              style={{marginRight: 10}}>
              Follow ({data.stats.followers})
            </Button>
            {data.verified && (
              <IconButton
                icon="check-decagram"
                iconColor={colors.primary}
                style={s.badge}
              />
            )}
            {data.permissions.admin && (
              <IconButton
                icon="shield-star"
                iconColor={colors.primary}
                style={s.badge}
              />
            )}
            {data.beta && (
              <IconButton
                icon="flask-outline"
                iconColor={colors.primary}
                style={s.badge}
              />
            )}
          </View>
        )}
        {data?.bio && (
          <>
            <Text variant="bodyLarge" style={s.heading}>
              About me
            </Text>
            <Text style={s.bio}>{data.bio}</Text>
          </>
        )}
      </>
    );
  };
  const renderItem = ({item}) => <Post post={item} />;
  return (
    <>
      <Appbar style={{backgroundColor: headerColor}}>
        <Appbar.BackAction onPress={closeModal} />
        <Appbar.Content title={username} />
        <Appbar.Action
          icon="flag-remove"
          onPress={() => {}}
          iconColor={colors.secondary}
        />
        <Appbar.Action
          icon="open-in-new"
          onPress={openUser}
          iconColor={colors.secondary}
        />
      </Appbar>
      <FlatList
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        data={posts}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
      />
    </>
  );
};

export default UserModal;
