import React from 'react';
import api from '../apiInterface';
import { Button, Card, CardActions, CardHeader } from '@material-ui/core';

const SentFriendRequest = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      <Button onClick={api.removeFriend.bind(null, props.user.id)}>Revoke</Button>
    </CardActions>
  </Card>
);

export default SentFriendRequest;