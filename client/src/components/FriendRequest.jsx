import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    api.put(`/user/${this.props.currentUser.id}/friends/${this.props.user.id}`);
  }

  remove () {
    api.delete(`/user/${this.props.currentUser.id}/friends/${this.props.user.id}`);
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

const mapStateToProps = ({global}) => ({ currentUser: global.currentUser });

export default connect(mapStateToProps)(FriendRequest);