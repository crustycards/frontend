import React from 'react';

class FriendRequestsReceived extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <div>Friend Requests Received</div>
        {this.props.requestsReceived.map((request) => {
          return <div>{request.firstname} {request.lastname}</div>
        })}
      </div>
    );
  }
}

export default FriendRequestsReceived;