import React from 'react';
import axios from 'axios';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import { FlatButton } from 'material-ui';

const remove = (email) => {
  axios.delete('/api/friends', {data: {user: email}});
};

const Friend = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
      subtitle={props.user.email}
    />
    <CardActions>
      <FlatButton label='Unfriend' onClick={remove.bind(null, props.user.email)} />
    </CardActions>
  </Card>
);

export default Friend;