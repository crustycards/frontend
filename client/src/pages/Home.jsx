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
      currentUser: null,
      friends: [],
      requestsSent: [],
      requestReceived: []
    };
    axios.get('/api/currentuser')
    .then((response) => {
      let currentUser = response.data;
      this.setState({currentUser});
    });
    axios.get('/api/friends')
    .then((response) => {
      let friendData = response.data;
      console.log(friendData);
      this.setState({friends: friendData.friends});
      this.setState({requestsSent: friendData.requestsSent});
      this.setState({requestReceived: friendData.requestsReceived});
    });
  }

  render() {
    return (
      <div>
        <div>Homepage</div>
        <div>{this.state.currentUser ? this.state.currentUser.firstname + ' ' + this.state.currentUser.lastname : 'Loading...'}</div>
        <FriendsList friends={this.state.friends} />
        <FriendRequestsSent requestsSent={this.state.requestsSent} />
        <FriendRequestsReceived requestsReceived={this.state.requestReceived} />
      </div>
    ) 
  }
}

export default Home;