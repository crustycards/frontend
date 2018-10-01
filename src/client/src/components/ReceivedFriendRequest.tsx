import {Button, Card, CardActions, CardHeader} from '@material-ui/core';
import * as React from 'react';
import {ApiContextWrapper} from '../api/context';
import {User} from '../api/dao';
import Api from '../api/model/api';

interface ReceivedFriendRequestProps {
  api: Api;
  user: User;
}

const ReceivedFriendRequest = (props: ReceivedFriendRequestProps) => (
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
