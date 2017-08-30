import React from 'react';
import Friend from './Friend.jsx';
import { connect } from 'react-redux';

const FriendsList = ({friends}) => (
  <div className="panel">
    <div>Friends</div>
    {(friends || []).map((friend, index) => {
      return <Friend user={friend} key={index} />;
    })}
  </div>
);

export default connect(
  ({home}) => ({friends: home.friends})
)(FriendsList);
