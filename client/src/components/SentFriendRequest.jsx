import React, { Component } from 'react';
import api from '../apiInterface';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';

const SentFriendRequest = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
      subtitle={props.user.email}
    />
    <CardActions>
      <FlatButton label='Revoke' onClick={api.removeFriend.bind(null, props.user.id)} />
    </CardActions>
  </Card>
);

export default SentFriendRequest;