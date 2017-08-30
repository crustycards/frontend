import React from 'react';
import FriendRequest from './FriendRequest.jsx';
import { connect } from 'react-redux';

class FriendRequestsSent extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="panel">
        <div>Friend Requests Sent</div>
        {this.props.requestsSent.map((user, index) => {
          return <FriendRequest user={user} type="sent" key={index} />;
        })}
      </div>
    );
  }
}

export default connect(
  ({home}) => ({requestsSent: home.requestsSent})
)(FriendRequestsSent);