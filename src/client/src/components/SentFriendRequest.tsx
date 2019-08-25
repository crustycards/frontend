import {Button, Card, CardActions, CardHeader} from '@material-ui/core';
import * as React from 'react';
import {useApi} from '../api/context';
import {User} from '../api/dao';

interface SentFriendRequestProps {
  user: User;
}

const SentFriendRequest = (props: SentFriendRequestProps) => {
  const api = useApi();

  return <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      <Button onClick={api.main.removeFriend.bind(null, props.user.id)}>Revoke</Button>
    </CardActions>
  </Card>;
};

export default SentFriendRequest;
