import React from 'react';
import api from '../apiInterface';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import { FlatButton } from 'material-ui';

const remove = (friendId) => {
  api.removeFriend(friendId);
};

const Friend = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
      subtitle={props.user.email}
    />
    <CardActions>
      <FlatButton label='Unfriend' onClick={remove.bind(null, props.currentUser.id)} />
    </CardActions>
  </Card>
);

export default Friend;