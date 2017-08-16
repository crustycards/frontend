import React from 'react';
import Friend from './Friend.jsx';

import store from '../store';
import {connect} from 'react-redux';

class FriendsList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="panel">
        <div>Friends List</div>
        {(this.props.friends||[]).map((friend, index) => (
          <Friend user={friend} key={index} />
        ))}
      </div>
    );
  }
}

const FriendsListConnected = connect((store) => store)(FriendsList)
export default FriendsListConnected;