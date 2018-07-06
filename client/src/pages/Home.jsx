import React from 'react';
import {connect} from 'react-redux';
import FriendsList from '../components/FriendsList.jsx';
import FriendRequestsSent from '../components/FriendRequestsSent.jsx';
import FriendRequestsReceived from '../components/FriendRequestsReceived.jsx';
import FrienderPanel from '../components/FrienderPanel.jsx';
import CardpackManager from '../components/CardpackManager/index.jsx';

const Home = (props) => (
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

const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(Home);
