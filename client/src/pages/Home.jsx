import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import FriendsList from '../components/FriendsList.jsx';
import FriendRequestsSent from '../components/FriendRequestsSent.jsx';
import FriendRequestsReceived from '../components/FriendRequestsReceived.jsx';
import FrienderPanel from '../components/FrienderPanel.jsx';
import CardpackManager from '../components/CardpackManager/index.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.socket.on('friendrequestsend', (data) => {
      let users = JSON.parse(data);
      let otherUser;
      if (users.friender.id === this.state.currentUser.id) {
        otherUser = users.friendee;
        this.addFriendRequestSent(otherUser);
      } else {
        otherUser = users.friender;
        this.addFriendRequestReceived(otherUser);
      }
    });
    this.socket.on('friendrequestaccept', (data) => {
      let users = JSON.parse(data);
      let otherUser;
      if (users.acceptor.id === this.state.currentUser.id) {
        otherUser = users.acceptee;
      } else {
        otherUser = users.acceptor;
      }
      this.removeFriendRequestSent(otherUser);
      this.removeFriendRequestReceived(otherUser);
      this.addFriend(otherUser);
    });
    this.socket.on('unfriend', (data) => {
      let users = JSON.parse(data);
      let otherUser;
      if (users.unfriender.id === this.state.currentUser.id) {
        otherUser = users.unfriendee;
      } else {
        otherUser = users.unfriender;
      }
      this.removeFriendRequestSent(otherUser);
      this.removeFriendRequestReceived(otherUser);
      this.removeFriend(otherUser);
    });
    this.state = {
      currentUser: null,
      friends: [],
      requestsSent: [],
      requestsReceived: []
    };
    axios.get('/api/currentuser')
    .then((response) => {
      let currentUser = response.data;
      this.setState({currentUser});
    });
    axios.get('/api/friends')
    .then((response) => {
      let friendData = response.data;
      this.setState({friends: friendData.friends});
      this.setState({requestsSent: friendData.requestsSent});
      this.setState({requestsReceived: friendData.requestsReceived});
    });
  }

  addFriend (friend) {
    this.state.friends.push(friend);
    this.forceUpdate();
  }
  removeFriend (friend) {
    for (let i = 0; i < this.state.friends.length; i++) {
      if (this.state.friends[i].email === friend.email) {
        this.state.friends.splice(i, 1);
        this.forceUpdate();
      }
    }
  }
  addFriendRequestSent (friend) {
    this.state.requestsSent.push(friend);
    this.forceUpdate();
  }
  removeFriendRequestSent (friend) {
    for (let i = 0; i < this.state.requestsSent.length; i++) {
      if (this.state.requestsSent[i].email === friend.email) {
        this.state.requestsSent.splice(i, 1);
        this.forceUpdate();
      }
    }
  }
  addFriendRequestReceived (friend) {
    this.state.requestsReceived.push(friend);
    this.forceUpdate();
  }
  removeFriendRequestReceived (friend) {
    for (let i = 0; i < this.state.requestsReceived.length; i++) {
      if (this.state.requestsReceived[i].email === friend.email) {
        this.state.requestsReceived.splice(i, 1);
        this.forceUpdate();
      }
    }
  }

  render() {
    return (
      <div>
        <div>Homepage</div>
        <div>{this.state.currentUser ? this.state.currentUser.firstname + ' ' + this.state.currentUser.lastname : 'Loading...'}</div>
        <FriendsList friends={this.state.friends} />
        <FriendRequestsSent requestsSent={this.state.requestsSent} />
        <FriendRequestsReceived requestsReceived={this.state.requestsReceived} />
        <FrienderPanel />
        <CardpackManager socket={this.socket} />
      </div>
    ) 
  }
}

export default Home;