import React, {Component} from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FriendsList from '../components/FriendsList.jsx';
import FriendRequestsSent from '../components/FriendRequestsSent.jsx';
import FriendRequestsReceived from '../components/FriendRequestsReceived.jsx';
import FrienderPanel from '../components/FrienderPanel.jsx';
import CardpackManager from '../components/CardpackManager/index.jsx';

import {
  SET_CURRENT_USER
} from '../store/modules/home';

import {
  addFriend,
  addFriendRequestSent,
  addFriendRequestReceived,
  removeSentFriendRequest,
  removeFriend,
  removeReceivedFriendRequest,
  requestsReceived,
  requestFriends
} from '../store/modules/home.js';

class Home extends Component {
  constructor(props) {
    super(props);
    if (!props.currentUser) {
      props.history.push('/login');
    }

    props.socket.on('unfriend', (users) => {
      let otherUser;
      if (users.unfriender.id === props.currentUser.id) {
        otherUser = users.unfriendee;
      } else {
        otherUser = users.unfriender;
      }
      props.removeSentFriendRequest(otherUser);
      props.removeReceivedFriendRequest(otherUser);
      props.removeFriend(otherUser);
    });
  }

  componentDidMount() {
    this.props.requestFriends(); 
  }

  render() {
    return (
      <div className='content-wrap'>
        <div className='col-narrow'>
          <FrienderPanel />
          <FriendsList />
          <FriendRequestsSent />
          <FriendRequestsReceived />
        </div>
        <div className='col-wide'>
          <CardpackManager />
        </div>
      </div>
    ); 
  }
}

const mapStateToProps = ({global, home}) => ({
  socket: global.socket,
  currentUser: global.currentUser,
  friends: home.friends, 
  requestsSent: home.requestsSent, 
  requestsReceived: home.requestsReceived
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addFriend,
  removeFriend,
  addFriendRequestSent,
  addFriendRequestReceived,
  removeSentFriendRequest,
  removeReceivedFriendRequest,
  requestFriends
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);