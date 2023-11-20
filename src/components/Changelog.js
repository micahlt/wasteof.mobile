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
            This release includes minor improvements and bug fixes. Here's
            what's new:
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Comment posting fixes
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Added users to search page
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Updated Android target version
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
