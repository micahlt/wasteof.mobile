import * as React from 'react';
import {Chip, Avatar, Modal, Text, Portal} from 'react-native-paper';
import UserModal from './UserModal';

const UserChip = ({username}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const showModal = () => setModalOpen(true);
  const hideModal = () => setModalOpen(false);
  return (
    <>
      <Portal>
        <Modal
          visible={modalOpen}
          onDismiss={hideModal}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-start',
            padding: 0,
            paddingVertical: 0,
          }}
          style={{marginTop: 0}}>
          <UserModal username={username} closeModal={hideModal} />
        </Modal>
      </Portal>
      <Chip
        avatar={
          <Avatar.Image
            size={24}
            source={{
              uri: `https://api.wasteof.money/users/${
                username || 'micahlt'
              }/picture`,
            }}
          />
        }
        onPress={showModal}
        style={{marginRight: 'auto', marginBottom: 7}}>
        {username}
      </Chip>
    </>
  );
};

export default UserChip;
