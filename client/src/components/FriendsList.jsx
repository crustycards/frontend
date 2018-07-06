import React from 'react';
import User from './shells/UserCard.jsx';
import {connect} from 'react-redux';

const FriendsList = ({friends}) => (
  <div className="panel">
    <div>Friends</div>
    {(friends || []).map((friend, index) => {
      return <User user={friend} showUnfriendButton key={index} />;
    })}
  </div>
);

const mapStateToProps = ({user}) => ({
  friends: user.friends
});

export default connect(mapStateToProps)(FriendsList);
