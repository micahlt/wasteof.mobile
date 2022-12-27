import React from 'react';
import {Dialog, Button, Paragraph, Portal, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {version} from '../../package.json';

const Changelog = ({closeExternal, dismissable}) => {
  const [visible, setVisible] = React.useState(true);
  const {colors} = useTheme();
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
            This version of wasteof.mobile includes several bugfixes as well as
            some major new features:
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; Improved scrolling performance
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; Allow notifications with deleted content
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; New changelog for each update
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; Mark notifications as read and unread
          </Paragraph>
          <Paragraph style={{marginLeft: 10}}>
            &bull; Load as many notifications as you want
          </Paragraph>
          <Paragraph
            style={{marginTop: 10, fontSize: 10, color: colors.outline}}>
            View this changelog again in settings at any time.
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
