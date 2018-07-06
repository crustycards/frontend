import React from 'react';
import SentFriendRequest from './SentFriendRequest.jsx';
import {connect} from 'react-redux';

const FriendRequestsSent = ({requestsSent}) => (
  <div className="panel">
    <div>Friend Requests Sent</div>
    {requestsSent.map((user, index) => {
      return <SentFriendRequest user={user} type="sent" key={index} />;
    })}
  </div>
);

const mapStateToProps = ({user}) => ({
  requestsSent: user.requestsSent
});

export default connect(mapStateToProps)(FriendRequestsSent);
