import React from 'react';
import {Button, Card, CardActions, CardHeader} from '@material-ui/core';
import {ApiContextWrapper} from '../api/context';

const ReceivedFriendRequest = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      <Button onClick={() => props.api.main.addFriend(props.user.id)}>Accept</Button>
      <Button onClick={() => props.api.main.removeFriend(props.user.id)}>Decline</Button>
    </CardActions>
  </Card>
);

export default ApiContextWrapper(ReceivedFriendRequest);
