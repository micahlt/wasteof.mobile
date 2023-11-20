import * as React from 'react';
import { ScrollView } from 'react-native';
import UserChip from './UserChip';

const UserList = ({ userNames = [], userObjects = [], style = {} }) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 0,
        ...style,
      }}>
      {userNames.map((name, i) => (
        <UserChip
          username={name}
          inline={true}
          key={name}
          lastInline={i == userNames.length - 1}
        />
      ))}
      {userObjects.map((obj, i) => (
        <UserChip
          username={obj.name}
          inline={true}
          key={obj.id}
          lastInline={i == userObjects.length - 1}
        />
      ))}
    </ScrollView>
  );
};

export default UserList;
