import React from 'react';
import FriendRequest from './FriendRequest.jsx';

class FriendRequestsSent extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="panel">
        <div>Friend Requests Sent</div>
        {(this.props.requestsSent||[]).map((user, index) => {
          return <FriendRequest user={user} type="sent" key={index} />
        })}
      </div>
    );
  }
}

export default FriendRequestsSent;