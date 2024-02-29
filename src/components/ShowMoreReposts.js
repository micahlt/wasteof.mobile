import * as React from 'react';
import { Card, Text } from 'react-native-paper';

const ShowMoreReposts = () => {
  return (
    <Card mode="outlined" style={{ marginTop: 5 }}>
      <Card.Content>
        <Text>
          There are more reposts, but they cannot be shown in wasteof for
          Android.
        </Text>
      </Card.Content>
    </Card>
  );
};

export default ShowMoreReposts;
