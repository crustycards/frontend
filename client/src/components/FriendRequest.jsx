import React, { Component } from 'react';
import api from '../apiInterface';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';

class FriendRequest extends Component {
  constructor (props) {
    super(props);
    this.accept = this.accept.bind(this);
    this.remove = this.remove.bind(this);
  }

  accept () {
    api.addFriend(this.props.user.id);
  }

  remove () {
    api.removeFriend(this.props.user.id);
  }

  render () {
    if (this.props.type === 'received') {
      return (
        <Card className='card'>
          <CardHeader
            title={this.props.user.name}
            subtitle={this.props.user.email}
          />
          <CardActions>
            <FlatButton label='Accept' onClick={this.accept} />
            <FlatButton label='Decline' onClick={this.remove} />
          </CardActions>
        </Card>
      );
    } else if (this.props.type === 'sent') {
      return (
        <Card className='card'>
          <CardHeader
            title={this.props.user.name}
            subtitle={this.props.user.email}
          />
          <CardActions>
            <FlatButton label='Revoke' onClick={this.remove} />
          </CardActions>
        </Card>
      );
    }
  }
}

export default FriendRequest;