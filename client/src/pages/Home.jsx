import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import FriendsList from '../components/FriendsList.jsx';
import FriendRequestsSent from '../components/FriendRequestsSent.jsx';
import FriendRequestsReceived from '../components/FriendRequestsReceived.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
  }

  render() {
    return (
      <div>
        <div>Homepage</div>
        <FriendsList />
        <FriendRequestsSent />
        <FriendRequestsReceived />
      </div>
    ) 
  }
}

export default Home;