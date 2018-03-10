import React from 'react';
import { connect } from 'react-redux';
import api from '../apiInterface';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import { FlatButton } from 'material-ui';

const remove = (id, friendId) => {
  api.delete(`/user/${id}/friends/${friendId}`);
};

const Friend = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
      subtitle={props.user.email}
    />
    <CardActions>
      <FlatButton label='Unfriend' onClick={remove.bind(null, props.currentUser.id, props.user.id)} />
    </CardActions>
  </Card>
);

const mapStateToProps = ({global}) => ({
  currentUser: global.currentUser
});

export default connect(mapStateToProps)(Friend);