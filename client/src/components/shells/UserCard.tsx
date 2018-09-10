import * as React from 'react';
import {Button, Card, CardActions, CardHeader} from '@material-ui/core';
import {ApiContextWrapper} from '../../api/context';
import {Link} from 'react-router-dom';
import Api from '../../api/model/api';
import { User } from '../../api/dao';

interface UserCardProps {
  api: Api
  showFriendButton: boolean
  showUnfriendButton: boolean
  user: User
}

const UserCard = (props: UserCardProps) => (
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
      <Button>
        <Link to={`/user?id=${props.user.id}`}>
          View Profile
        </Link>
      </Button>
    </CardActions>
  </Card>
);

export default ApiContextWrapper(UserCard);