import React from 'react';

class FriendRequestsSent extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <div>Friend Requests Sent</div>
        {this.props.requestsSent.map((user) => {
          return <div>{user.firstname} {user.lastname}</div>
        })}
      </div>
    );
  }
}

export default FriendRequestsSent;