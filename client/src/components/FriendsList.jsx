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

const mapStateToProps = ({user}) => ({
  friends: user.friends
});

export default connect(mapStateToProps)(FriendsList);
