import React from 'react';
import FriendRequest from './FriendRequest.jsx';
import { connect } from 'react-redux';

const FriendRequestsReceived = ({requestsReceived}) => (
  <div className="panel">
    <div>Friend Requests Received</div>
    {requestsReceived.map((user, index) => {
      return <FriendRequest user={user} type="received" key={index} />;
    })}
  </div>
);

const mapStateToProps = ({user}) => ({
  requestsReceived: user.requestsReceived
});

export default connect(mapStateToProps)(FriendRequestsReceived);