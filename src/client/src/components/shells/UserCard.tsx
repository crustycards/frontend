import {Avatar, Button, Card, CardActions, CardContent, CardHeader} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {ApiContextWrapper} from '../../api/context';
import {User} from '../../api/dao';
import Api from '../../api/model/api';
import {stringToHexColor} from '../../helpers/hash';

interface UserCardProps {
  api: Api;
  showFriendButton?: boolean;
  showUnfriendButton?: boolean;
  user: User;
}

interface UserCardState {
  imgError: boolean;
}

class UserCard extends Component<UserCardProps, UserCardState> {
  constructor(props: UserCardProps) {
    super(props);

    this.state = {
      imgError: false
    };
  }

  public render() {
    return (
      <Card className='card'>
        <CardHeader
          title={
            <div style={{height: '50px'}}>
              {
                this.state.imgError === false ?
                <Avatar onError={() => this.setState({imgError: true})} style={{float: 'left'}} src={this.props.api.main.getProfileImageUrl(this.props.user.id)}/>
                :
                <Avatar style={{float: 'left', backgroundColor: stringToHexColor(this.props.user.id)}}>{this.props.user.name.charAt(0).toUpperCase()}</Avatar>
              }
              <div style={{padding: '5px 50px'}}>{this.props.user.name}</div>
            </div>
          }
        />
        <CardActions>
          {
            this.props.showFriendButton &&
            <Button
              onClick={this.props.api.main.addFriend.bind(null, this.props.user.id)}
            >
              Add as Friend
            </Button>
          }
          {
            this.props.showUnfriendButton &&
            <Button
              onClick={this.props.api.main.removeFriend.bind(null, this.props.user.id)}
            >
              Unfriend
            </Button>
          }
          <NavLink to={`/user?id=${this.props.user.id}`} style={{textDecoration: 'none'}}>
            <Button>
              View Profile
            </Button>
          </NavLink>
        </CardActions>
      </Card>
    );
  }
}

export default ApiContextWrapper(UserCard);
