import React from 'react';
import { Dialog, Button, Paragraph, Portal, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { version } from '../../package.json';

const Changelog = ({ closeExternal, dismissable }) => {
  const [visible, setVisible] = React.useState(true);
  const close = () => {
    AsyncStorage.setItem('changelogViewed', version).then(() => {
      setVisible(false);
      if (closeExternal) {
        closeExternal();
      }
    });
  };
  return (
    <Portal>
      <Dialog visible={visible} dismissable={dismissable || false}>
        <Dialog.Icon icon="party-popper" />
        <Dialog.Title style={{ textAlign: 'center' }}>
          Welcome to v
          <Text style={{ fontFamily: 'space_bold' }}>{version}</Text>
        </Dialog.Title>
        <Dialog.ScrollArea style={{ padding: 10 }}>
          <Paragraph style={{ marginBottom: 5 }}>
            wasteof.mobile is now{' '}
            <Text style={{ fontFamily: 'space_bold' }}>
              wasteof for Android
            </Text>
            , the official way to access wasteof.money on Android devices! This
            means that you can expect even more features that a third-party
            client simply can't have, like social login.
          </Paragraph>
          <Paragraph style={{ marginTop: 5 }}>
            We're super excited to bring you more official features soon!
          </Paragraph>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={close}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Changelog;
