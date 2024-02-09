import * as React from 'react';
import { Card } from 'react-native-paper';

const AllSeen = dismissCallback => {
  return (
    <Card style={{ margin: 16 }}>
      <Card.Title title="You've seen all these posts!" />
    </Card>
  );
};

export default AllSeen;
