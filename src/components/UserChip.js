import * as React from 'react';
import { Linking } from 'react-native';
import { Chip, Avatar, Modal, Text, Portal } from 'react-native-paper';
const UserModal = React.lazy(() => import('../UserPage'));
import { apiURL } from '../apiURL';
const UserChip = ({ username, inline, lastInline }) => {
  return (
    <>
      <Chip
        avatar={
          <Avatar.Image
            size={24}
            source={{
              uri: `${apiURL}/users/${username || 'micahlt'}/picture`,
            }}
          />
        }
        onPress={() => Linking.openURL(`wasteof://users/${username}`)}
        style={{
          marginRight: inline ? (lastInline ? 40 : 10) : 'auto',
          marginBottom: 7,
        }}>
        {username}
      </Chip>
    </>
  );
};

export default UserChip;
