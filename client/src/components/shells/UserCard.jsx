import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import { FlatButton } from 'material-ui';
import { addFriend, removeFriend } from '../../apiInterface';

const UserCard = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      {props.showFriendButton && <FlatButton label='Add as Friend' onClick={addFriend.bind(null, props.user.id)} />}
      {props.showUnfriendButton && <FlatButton label='Unfriend' onClick={removeFriend.bind(null, props.user.id)} />}
    </CardActions>
  </Card>
);

UserCard.propTypes = {
  showFriendButton: PropTypes.bool,
  showUnfriendButton: PropTypes.bool,
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  })
};

export default UserCard;