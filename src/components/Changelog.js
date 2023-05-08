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
            This release includes some major additions! Here's what's new:
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Writing new comments
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Replying to comments
          </Paragraph>
          <Paragraph style={{ marginLeft: 10 }}>
            &bull; Deleting your own comments
          </Paragraph>
          <Paragraph style={{ marginTop: 5 }}>
            User experience improvements to this feature are coming soon, with
            post creation and user walls on the way as well!
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
