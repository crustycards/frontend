import React from 'react';
import api from '../apiInterface';
import { Button, Card, CardActions, CardHeader } from '@material-ui/core';

const ReceivedFriendRequest = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      <Button onClick={api.addFriend.bind(null, props.user.id)}>Accept</Button>
      <Button onClick={api.removeFriend.bind(null, props.user.id)}>Decline</Button>
    </CardActions>
  </Card>
);

export default ReceivedFriendRequest;