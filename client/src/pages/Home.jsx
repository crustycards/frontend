import React, {Component} from 'react';
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

import { removeFriend } from '../store/modules/home.js';

class Home extends Component {
  constructor(props) {
    super(props);
    if (!props.currentUser) {
      props.history.push('/login');
    }
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
  removeFriend
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);