import React from 'react';
import api from '../apiInterface';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';

const ReceivedFriendRequest = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
      subtitle={props.user.email}
    />
    <CardActions>
      <FlatButton label='Accept' onClick={api.addFriend.bind(null, props.user.id)} />
      <FlatButton label='Decline' onClick={api.removeFriend.bind(null, props.user.id)} />
    </CardActions>
  </Card>
);

export default ReceivedFriendRequest;