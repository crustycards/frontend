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
    this.state = {
      currentUser: null
    };
    axios.get('/api/currentuser')
    .then((response) => {
      let currentUser = response.data;
      this.setState({currentUser});
    });
  }

  render() {
    return (
      <div>
        <div>Homepage</div>
        <div>{this.state.currentUser ? this.state.currentUser.firstname + ' ' + this.state.currentUser.lastname : 'Loading...'}</div>
        <FriendsList />
        <FriendRequestsSent />
        <FriendRequestsReceived />
      </div>
    ) 
  }
}

export default Home;