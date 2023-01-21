import React from 'react';
import {Dialog, Button, Paragraph, Portal, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {version} from '../../package.json';

const Changelog = ({closeExternal, dismissable}) => {
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
        <Dialog.Title style={{textAlign: 'center'}}>
          Welcome to {version}
        </Dialog.Title>
        <Dialog.ScrollArea style={{padding: 10}}>
          <Paragraph style={{marginBottom: 5}}>
            This release includes the 100th open-source commit! Here's what's
            new:
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; Fixed login input labels overlapping
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; Fixed profanity filter setting not saving
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; Switched to new tab navigation system
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
