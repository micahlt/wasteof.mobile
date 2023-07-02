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
          Welcome to <Text style={{ fontFamily: 'space_bold' }}>{version}</Text>
        </Dialog.Title>
        <Dialog.ScrollArea style={{ padding: 10 }}>
          <Paragraph style={{ marginBottom: 5 }}>
            This release includes major improvements! Here's what's new:
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Dynamic profile theming
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Create reposts
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Push notifications beta
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Status bar matches screen
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Editor improvements (no double posts!)
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; More comment thread improvements
          </Paragraph>
          <Paragraph style={{ marginTop: 5 }}>
            This update brings wasteof.mobile even closer to full compatibility
            with the wasteof website!
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
