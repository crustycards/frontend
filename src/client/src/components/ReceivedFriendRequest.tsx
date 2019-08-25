import {Button, Card, CardActions, CardHeader} from '@material-ui/core';
import * as React from 'react';
import {useApi} from '../api/context';
import {User} from '../api/dao';

interface ReceivedFriendRequestProps {
  user: User;
}

const ReceivedFriendRequest = (props: ReceivedFriendRequestProps) => {
  const api = useApi();

  return <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      <Button onClick={() => api.main.addFriend(props.user.id)}>Accept</Button>
      <Button onClick={() => api.main.removeFriend(props.user.id)}>Decline</Button>
    </CardActions>
  </Card>;
};

export default ReceivedFriendRequest;
