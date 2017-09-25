import React from 'react';
import FriendRequest from './FriendRequest.jsx';
import { connect } from 'react-redux';

const FriendRequestsSent = ({requestsSent}) => (
  <div className="panel">
    <div>Friend Requests Sent</div>
    {requestsSent.map((user, index) => {
      return <FriendRequest user={user} type="sent" key={index} />;
    })}
  </div>
);

export default connect(({home}) => ({
  requestsSent: home.requestsSent
}))(FriendRequestsSent);