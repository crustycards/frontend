import * as React from 'react';
import {Button, Card, CardActions, CardHeader} from '@material-ui/core';
import {ApiContextWrapper} from '../api/context';
import {User} from '../api/dao';
import Api from '../api/model/api';

interface SentFriendRequestProps {
  api: Api
  user: User
}

const SentFriendRequest = (props: SentFriendRequestProps) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      <Button onClick={props.api.main.removeFriend.bind(null, props.user.id)}>Revoke</Button>
    </CardActions>
  </Card>
);

export default ApiContextWrapper(SentFriendRequest);
