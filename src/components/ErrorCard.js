import * as React from 'react';
import { Card, Text } from 'react-native-paper';

const ErrorCard = ({
  errorCode = '',
  errorMessage = 'Something went wrong.  Try again later!',
}) => {
  return (
    <Card style={{ margin: 15 }}>
      <Card.Title title={`Error ${errorCode}`} titleVariant="titleLarge" />
      <Card.Content>
        <Text>{errorMessage}</Text>
      </Card.Content>
    </Card>
  );
};

export default ErrorCard;
