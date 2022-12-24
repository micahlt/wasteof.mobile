import * as React from 'react';
import {Chip, Avatar, Modal, Text, Portal} from 'react-native-paper';
const UserModal = React.lazy(() => import('../UserModal'));

const UserChip = ({username, inline, lastInline}) => {
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
          <React.Suspense fallback={<Text>Loading</Text>}>
            <UserModal username={username} closeModal={hideModal} />
          </React.Suspense>
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
