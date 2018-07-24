import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card, CardActions, CardHeader} from '@material-ui/core';
import {ApiContextWrapper} from '../../api/context';

const UserCard = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.user.name}
    />
    <CardActions>
      {
        props.showFriendButton &&
        <Button
          onClick={props.api.main.addFriend.bind(null, props.user.id)}
        >
          Add as Friend
        </Button>
      }
      {
        props.showUnfriendButton &&
        <Button
          onClick={props.api.main.removeFriend.bind(null, props.user.id)}
        >
          Unfriend
        </Button>
      }
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

export default ApiContextWrapper(UserCard);
