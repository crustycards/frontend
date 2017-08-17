import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import FriendsList from '../components/FriendsList.jsx';
import FriendRequestsSent from '../components/FriendRequestsSent.jsx';
import FriendRequestsReceived from '../components/FriendRequestsReceived.jsx';
import FrienderPanel from '../components/FrienderPanel.jsx';

import store from '../store';
import {connect} from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = store.getState();

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

    axios.get('/api/currentuser')
    .then((response) => {
      let currentUser = response.data;
      store.dispatch({type: 'SIGN_IN', payload: {currentUser}});
    });

    axios.get('/api/friends')
    .then((response) => {
      let friendData = response.data;
      store.dispatch(
        {
          type: 'ADD_FRIENDS', 
          payload: friendData.friends
        }
      );
      store.dispatch(
        {
          type: 'ADD_REQUESTS_SENT', 
          payload: friendData.requestsSent
        }
      );
      store.dispatch(
        {
          type: 'ADD_REQUESTS_RECEIVED', 
          payload: friendData.requestsReceived
        }
      );
    });

  }

  addFriend (friend) {
    store.dispatch({type: 'ADD_FRIEND', payload: friend});
  }

  removeFriend (friend) {
    store.dispatch({type: 'REMOVE_FRIEND', payload: friend});
  }

  addFriendRequestSent (friend) {
    store.dispatch({type: 'ADD_REQUESTS_SENT', payload: friend});
  }

  removeFriendRequestSent (friend) {
    store.dispatch({type: 'REMOVE_REQUESTS_SENT', payload: friend});
  }

  addFriendRequestReceived (friend) {
    store.dispatch({type: 'ADD_REQUESTS_RECEIVED', payload: friend});
  }

  removeFriendRequestReceived (friend) {
    store.dispatch({type: 'REMOVE_REQUESTS_RECEIVED', payload: friend});
  }

  render() {
    return (
      <div>
        <div>Homepage</div>
        <div>
          {this.state.currentUser ? this.state.currentUser.firstname + ' ' + this.state.currentUser.lastname : 'Loading...'}
        </div>
        <FriendsList />
        <FriendRequestsSent />
        <FriendRequestsReceived />
        <FrienderPanel />
      </div>
    ) 
  }

}

export default connect((state) => state)(Home);