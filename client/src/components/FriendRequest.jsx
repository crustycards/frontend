import React from 'react';
import axios from 'axios';

class FriendRequest extends React.Component {
  constructor (props) {
    super(props);
    this.accept = this.accept.bind(this);
    this.remove = this.remove.bind(this);
  }

  accept () {
    axios.post('/api/friends', {
      type: 'accept',
      user: this.props.user.email
    });
  }

  remove () {
    axios.delete('/api/friends', {data: {user: this.props.user.email}});
  }

  render () {
    if (this.props.type === 'received') {
      return (
        <div className="subpanel">
          <div>{this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})</div>
          <button onClick={this.accept}>Accept</button>
          <button onClick={this.remove}>Decline</button>
        </div>
      );
    } else if (this.props.type === "sent") {
      return (
        <div className="subpanel">
          <div>{this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})</div>
          <button onClick={this.remove}>Revoke</button>
        </div>
      );
    }
  }
}

export default FriendRequest;